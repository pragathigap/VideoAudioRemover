import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Download, CheckCircle2, VolumeX, FileAudio, RefreshCw, X, Crown, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { muteVideo, extractAudio, compressVideo, resizeVideo, addAudioToVideo } from '../mediaProcessor';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export type ToolMode = 'all' | 'mute' | 'extract' | 'compress-video' | 'resize-video' | 'add-audio';

interface ToolPageProps {
  mode: ToolMode;
  title: string;
  description: string;
}

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  audioFile?: File;
  audioPreview?: string;
  processed?: string;
  processedType?: 'video' | 'audio';
  progress: number;
  status: 'idle' | 'processing' | 'done' | 'error';
}

const ToolPage: React.FC<ToolPageProps> = ({ mode, title, description }) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isFFmpegLoading, setIsFFmpegLoading] = useState(false);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const limitModalAnimationFrameRef = useRef<number | null>(null);

  // Settings for new tools
  const [compressionCrf, setCompressionCrf] = useState(28); // 18-28 is good range
  const [selectedFrame, setSelectedFrame] = useState('16:9');
  const [selectedQuality, setSelectedQuality] = useState('720');

  const FREE_DAILY_LIMIT = 3;
  const FREE_FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
  const PAID_FILE_SIZE_LIMIT = 500 * 1024 * 1024; // 500MB
  const FREE_DURATION_LIMIT = 120; // 2 minutes

  const getCurrentDate = () => new Date().toISOString().slice(0, 10);

  const getInitialUsageCount = () => {
    const currentDate = getCurrentDate();
    const stored = localStorage.getItem('vid_usage_tracker_v2');
    if (!stored) {
      localStorage.setItem('vid_usage_tracker_v2', JSON.stringify({ date: currentDate, count: 0 }));
      return 0;
    }

    try {
      const parsed: any = JSON.parse(stored);
      if (parsed && parsed.date === currentDate) {
        return parsed.count || 0;
      }
    } catch (e) {
      void e;
    }

    localStorage.setItem('vid_usage_tracker_v2', JSON.stringify({ date: currentDate, count: 0 }));
    return 0;
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(() => getInitialUsageCount());
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    setUsageCount(getInitialUsageCount());
  }, [mode]);

  useEffect(() => {
    return () => {
      if (limitModalAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(limitModalAnimationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const applyUser = (user: User | null) => {
      setCurrentUser(user);
      setIsPremium(!!user?.user_metadata?.is_premium);
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted) return;
      applyUser(user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      void event;
      if (!isMounted) return;
      applyUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const ensureCurrentDayUsage = () => {
    const currentDate = getCurrentDate();
    const stored = localStorage.getItem('vid_usage_tracker_v2');
    if (!stored) {
      localStorage.setItem('vid_usage_tracker_v2', JSON.stringify({ date: currentDate, count: 0 }));
      return 0;
    }

    try {
      const parsed: any = JSON.parse(stored);
      if (parsed && parsed.date === currentDate) {
        return parsed.count || 0;
      }
    } catch (e) {
      void e;
    }

    localStorage.setItem('vid_usage_tracker_v2', JSON.stringify({ date: currentDate, count: 0 }));
    return 0;
  };

  const scrollToActiveCard = (triggerElement?: HTMLElement) => {
    const target = triggerElement?.closest('.action-card') ?? triggerElement;
    target?.scrollIntoView({ behavior: 'auto', block: 'center' });
  };

  const openLimitModal = (triggerElement?: HTMLElement) => {
    scrollToActiveCard(triggerElement);
    if (limitModalAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(limitModalAnimationFrameRef.current);
    }
    limitModalAnimationFrameRef.current = window.requestAnimationFrame(() => {
      setShowLimitModal(true);
    });
  };

  const incrementUsage = (triggerElement?: HTMLElement) => {
    if (isPremium) return true;

    const currentCount = ensureCurrentDayUsage();
    if (currentCount >= FREE_DAILY_LIMIT) {
      openLimitModal(triggerElement);
      return false;
    }

    const newCount = currentCount + 1;
    const currentDate = getCurrentDate();
    localStorage.setItem('vid_usage_tracker_v2', JSON.stringify({ date: currentDate, count: newCount }));
    setUsageCount(newCount);
    return true;
  };

  const resizeRes = useMemo(() => {
    const q = parseInt(selectedQuality, 10);
    let w = q;
    let h = q;

    if (selectedFrame === '16:9') {
      w = Math.round(q * 16 / 9);
      h = q;
    } else if (selectedFrame === '9:16') {
      w = q;
      h = Math.round(q * 16 / 9);
    } else if (selectedFrame === '4:5') {
      w = q;
      h = Math.round(q * 1.25);
    }

    return { w, h };
  }, [selectedFrame, selectedQuality]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles: MediaFile[] = [];

      for (const file of selectedFiles) {
        // Validation logic
        const isMp4 = file.name.toLowerCase().endsWith('.mp4');
        const maxSize = isPremium ? PAID_FILE_SIZE_LIMIT : FREE_FILE_SIZE_LIMIT;

        if (!isPremium && !isMp4) {
          setFfmpegError(`Free tier supports MP4 only. Please upgrade for ${file.name.split('.').pop()?.toUpperCase()} support.`);
          continue;
        }

        if (file.size > maxSize) {
          setFfmpegError(`File too large. ${isPremium ? '500MB' : '50MB'} limit applied.`);
          continue;
        }

        const preview = URL.createObjectURL(file);
        
        // Duration check for free users
        if (!isPremium) {
          const duration = await new Promise<number>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
              resolve(video.duration);
            };
            video.src = preview;
          });

          if (duration > FREE_DURATION_LIMIT) {
            setFfmpegError(`Video too long. Free tier limit is 2 minutes.`);
            URL.revokeObjectURL(preview);
            continue;
          }
        }

        if (!isPremium && newFiles.length >= 1) {
          setFfmpegError("Batch processing is a Pro feature. Please process files one by one or upgrade to Pro.");
          break;
        }

        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          progress: 0,
          status: 'idle' as const
        });
      }
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        if (file.preview) URL.revokeObjectURL(file.preview);
        if (file.audioPreview) URL.revokeObjectURL(file.audioPreview);
        if (file.processed) URL.revokeObjectURL(file.processed);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleMuteVideo = async (fileObj: MediaFile, triggerElement?: HTMLElement) => {
    if (!incrementUsage(triggerElement)) return;
    if (fileObj.processed) URL.revokeObjectURL(fileObj.processed);
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f =>
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0, processed: undefined } : f
    ));

    try {
      const result = await muteVideo(fileObj.file, (p) => {
        setIsFFmpegLoading(false);
        setMediaFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, progress: p } : f
        ));
      });

      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, processed: result, processedType: 'video', status: 'done', progress: 100 } : f
      ));
    } catch (err: unknown) {
      console.error('Mute error:', err);
      setIsFFmpegLoading(false);
      const message = err instanceof Error ? err.message : 'Failed to process video';
      setFfmpegError(message);
      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, status: 'error' } : f
      ));
    }
  };

  const handleExtractAudio = async (fileObj: MediaFile, triggerElement?: HTMLElement) => {
    if (!incrementUsage(triggerElement)) return;
    if (fileObj.processed) URL.revokeObjectURL(fileObj.processed);
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f =>
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0, processed: undefined } : f
    ));

    try {
      const result = await extractAudio(fileObj.file, (p) => {
        setIsFFmpegLoading(false);
        setMediaFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, progress: p } : f
        ));
      });

      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, processed: result, processedType: 'audio', status: 'done', progress: 100 } : f
      ));
    } catch (err: unknown) {
      console.error('Extract error:', err);
      setIsFFmpegLoading(false);
      const message = err instanceof Error ? err.message : 'Failed to extract audio';
      setFfmpegError(message);
      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, status: 'error' } : f
      ));
    }
  };

  const handleCompressVideo = async (fileObj: MediaFile, triggerElement?: HTMLElement) => {
    if (!incrementUsage(triggerElement)) return;
    if (fileObj.processed) URL.revokeObjectURL(fileObj.processed);
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f =>
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0, processed: undefined } : f
    ));

    try {
      const result = await compressVideo(fileObj.file, compressionCrf, (p) => {
        setIsFFmpegLoading(false);
        setMediaFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, progress: p } : f
        ));
      });

      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, processed: result, processedType: 'video', status: 'done', progress: 100 } : f
      ));
    } catch (err: unknown) {
      console.error('Compress error:', err);
      setIsFFmpegLoading(false);
      setFfmpegError(err instanceof Error ? err.message : 'Failed to compress video');
      setMediaFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
    }
  };

  const handleAudioPick = (id: string) => {
    setSelectedFileId(id);
    audioInputRef.current?.click();
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedFileId) {
      const audioFile = e.target.files[0];
      const audioPreview = URL.createObjectURL(audioFile);
      setMediaFiles(prev => prev.map(f =>
        f.id === selectedFileId ? { ...f, audioFile, audioPreview } : f
      ));
      setSelectedFileId(null);
      // Reset input so same file can be picked again if needed
      e.target.value = '';
    }
  };

  const handleAddAudio = async (fileObj: MediaFile, triggerElement?: HTMLElement) => {
    if (!fileObj.audioFile) return;
    if (!incrementUsage(triggerElement)) return;
    if (fileObj.processed) URL.revokeObjectURL(fileObj.processed);
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f =>
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0, processed: undefined } : f
    ));

    try {
      const result = await addAudioToVideo(fileObj.file, fileObj.audioFile, (p) => {
        setIsFFmpegLoading(false);
        setMediaFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, progress: p } : f
        ));
      });

      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, processed: result, processedType: 'video', status: 'done', progress: 100 } : f
      ));
    } catch (err: unknown) {
      console.error('Add audio error:', err);
      setIsFFmpegLoading(false);
      setFfmpegError(err instanceof Error ? err.message : 'Failed to add audio to video');
      setMediaFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
    }
  };

  const handleResizeVideo = async (fileObj: MediaFile, triggerElement?: HTMLElement) => {
    if (!incrementUsage(triggerElement)) return;
    if (fileObj.processed) URL.revokeObjectURL(fileObj.processed);
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f =>
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0, processed: undefined } : f
    ));

    try {
      const result = await resizeVideo(fileObj.file, resizeRes.w, resizeRes.h, (p) => {
        setIsFFmpegLoading(false);
        setMediaFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, progress: p } : f
        ));
      });

      setMediaFiles(prev => prev.map(f =>
        f.id === fileObj.id ? { ...f, processed: result, processedType: 'video', status: 'done', progress: 100 } : f
      ));
    } catch (err: unknown) {
      console.error('Resize error:', err);
      setIsFFmpegLoading(false);
      setFfmpegError(err instanceof Error ? err.message : 'Failed to resize video');
      setMediaFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
    }
  };

  const downloadProcessed = (fileObj: MediaFile) => {
    if (!fileObj.processed) return;
    const link = document.createElement('a');
    link.href = fileObj.processed;

    // Determine extension from processedType or processed URL if possible
    let ext = 'mp4';
    if (fileObj.processedType === 'audio') {
      ext = 'mp3';
    }

    link.download = `vid-audio-remix-${fileObj.file.name.split('.')[0]}.${ext}`;
    link.click();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#22d3ee', '#10b981']
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-6">
      <header className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-lg"
        >
          {description}
        </motion.p>

        {!isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <RefreshCw size={14} className={usageCount > 0 ? 'animate-spin-slow' : ''} />
              <span>{usageCount} / {FREE_DAILY_LIMIT} daily exports used</span>
            </div>
          </motion.div>
        )}
      </header>

      {ffmpegError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="animate-spin" />
            <p className="text-sm font-medium">{ffmpegError}</p>
          </div>
          <button onClick={() => setFfmpegError(null)}>
            <X size={18} />
          </button>
        </motion.div>
      )}

      <section className="glass-effect rounded-3xl p-8 mb-8">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-glass-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition-all group"
        >
          <input
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 bg-bg-dark-alt rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Select Videos</h3>
          <p className="text-text-muted">Drag & drop MP4 files here {!isPremium && '(Max 50MB)'}</p>
        </div>

        {mediaFiles.length > 0 && (
          <div className="mt-12 space-y-12">
            {mode === 'compress-video' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <p className="font-semibold">Compression Quality</p>
                    <p className="text-sm text-text-muted">Higher CRF = Smaller file, lower quality</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">CRF: {compressionCrf}</span>
                    <input
                      type="range" min="18" max="51" step="1"
                      value={compressionCrf}
                      onChange={(e) => setCompressionCrf(parseInt(e.target.value))}
                      className="accent-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'resize-video' && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <p className="font-semibold">Target Resolution</p>
                    <p className="text-sm text-text-muted">Select or enter custom dimensions</p>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center flex-1 md:justify-end">
                    <div className="flex flex-col gap-1 min-w-[140px]">
                      <span className="text-[10px] font-bold uppercase text-text-muted ml-1">Frame</span>
                      <select
                        value={selectedFrame}
                        onChange={(e) => setSelectedFrame(e.target.value)}
                        className="tool-select py-2 h-auto"
                      >
                        <option value="16:9">YouTube / Landscape (16:9)</option>
                        <option value="9:16">Story / TikTok (9:16)</option>
                        <option value="1:1">Square (1:1)</option>
                        <option value="4:5">Portrait (4:5)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <span className="text-[10px] font-bold uppercase text-text-muted ml-1">Quality</span>
                      <select
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="tool-select py-2 h-auto"
                      >
                        <option value="1080" disabled={!isPremium}>1080p (Full HD) {!isPremium && '🔒'}</option>
                        <option value="720">720p (HD)</option>
                        <option value="480">480p (SD)</option>
                        <option value="360">360p</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {mediaFiles.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="action-card"
                >
                  <div className="grid grid-cols-[1fr,auto] gap-4 mb-6 px-1 items-start w-full min-w-0">
                    <div className="min-w-0">
                      <p className="font-bold text-text-main text-lg break-all leading-tight mb-1" title={file.file.name}>
                        {file.file.name}
                      </p>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none">
                        {file.file.type.split('/')[1] || 'media'} • {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    {file.status !== 'idle' && (
                      <span className={`status-badge shrink-0 mt-1 ${file.status === 'done' ? 'status-done' : 'status-processing'}`}>
                        {file.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="w-full">
                      <div className="video-preview-container shadow-lg max-w-2xl mx-auto">
                        <video src={file.preview} controls muted={file.status === 'idle'} />
                      </div>
                    </div>

                    <div className="w-full flex flex-col items-center gap-4 max-w-xl mx-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {(mode === 'all' || mode === 'mute') && (
                          <button
                            onClick={(e) => handleMuteVideo(file, e.currentTarget)}
                            disabled={file.status === 'processing'}
                            className="btn-primary w-full justify-center py-4 text-lg"
                          >
                            <VolumeX size={20} /> Remove Audio
                          </button>
                        )}
                        {(mode === 'all' || mode === 'extract') && (
                          <button
                            onClick={(e) => handleExtractAudio(file, e.currentTarget)}
                            disabled={file.status === 'processing'}
                            className="btn-secondary w-full justify-center py-4 text-lg"
                          >
                            <FileAudio size={20} /> Extract Audio (MP3)
                          </button>
                        )}

                        {!isPremium && (
                          <button
                            onClick={() => window.location.href = '/pricing'}
                            className="btn-secondary w-full justify-center py-4 text-lg opacity-60"
                          >
                            <Sparkles size={20} className="text-amber-500" /> AI Noise Removal 🔒
                          </button>
                        )}

                        {mode === 'compress-video' && (
                          <button
                            onClick={(e) => handleCompressVideo(file, e.currentTarget)}
                            disabled={file.status === 'processing'}
                            className="btn-primary w-full justify-center py-4 text-lg"
                          >
                            Compress Now
                          </button>
                        )}

                        {mode === 'resize-video' && (
                          <button
                            onClick={(e) => handleResizeVideo(file, e.currentTarget)}
                            disabled={file.status === 'processing'}
                            className="btn-primary w-full justify-center py-4 text-lg"
                          >
                            Resize to {resizeRes.w}x{resizeRes.h}
                          </button>
                        )}
                      </div>

                      {mode === 'add-audio' && (
                        <div className="space-y-4 w-full">
                          <button
                            onClick={() => handleAudioPick(file.id)}
                            disabled={file.status === 'processing'}
                            className="btn-secondary w-full justify-center py-4 text-lg"
                          >
                            <FileAudio size={20} /> {file.audioFile ? 'Change Audio' : 'Select Audio File'}
                          </button>

                          {file.audioFile && (
                            <div className="bg-bg-dark-alt/50 border border-glass-border rounded-2xl p-4 flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Audio Source</span>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Ready</span>
                              </div>
                              <p className="text-sm font-semibold truncate">{file.audioFile.name}</p>
                              <audio src={file.audioPreview} controls className="w-full h-8" />
                            </div>
                          )}

                          <button
                            onClick={(e) => handleAddAudio(file, e.currentTarget)}
                            disabled={file.status === 'processing' || !file.audioFile}
                            className="btn-primary w-full justify-center py-4 text-lg"
                          >
                            Merge Audio & Video
                          </button>
                        </div>
                      )}

                      {file.status === 'processing' && (
                        <div className="space-y-2 mt-2 w-full">
                          <div className="flex justify-between text-xs font-bold text-primary">
                            <span>{isFFmpegLoading ? 'ENGINE LOADING' : 'CONVERTING'}</span>
                            <span>{file.progress}%</span>
                          </div>
                          <div className="progress-container h-2 bg-gray-100">
                            <div className="progress-bar rounded-full" style={{ width: `${file.progress}%` }} />
                          </div>
                          {isFFmpegLoading && (
                            <p className="text-[10px] text-text-muted italic text-center">Preparing processing core...</p>
                          )}
                        </div>
                      )}

                      {file.status === 'done' && (
                        <motion.button
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          onClick={() => downloadProcessed(file)}
                          className="btn-primary w-full justify-center py-4 bg-success hover:bg-emerald-600 border-none mt-2 text-lg shadow-lg shadow-emerald-100"
                        >
                          <Download size={20} /> Download Result
                        </motion.button>
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="btn-danger w-full justify-center py-4 text-lg mt-2"
                      >
                        <X size={20} /> Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              ref={audioInputRef}
              onChange={handleAudioFileSelect}
            />
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {[
          { title: 'Browser-Based', description: 'Faster processing without server uploads. Your data stays on your machine.', icon: CheckCircle2 },
          { title: 'Privacy First', description: 'Zero tracking. Zero uploads. Zero compromises on your data privacy.', icon: CheckCircle2 },
          { title: 'Pro Grade FFmpeg', description: 'Powered by industry-standard FFmpeg for pixel-perfect results.', icon: CheckCircle2 }
        ].map((feature, i) => (
          <div key={i} className="glass-effect p-6 rounded-2xl">
            <feature.icon className="text-primary mb-4" size={24} />
            <h4 className="font-bold mb-2">{feature.title}</h4>
            <p className="text-sm text-text-muted">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-32 mb-40">
        <header className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-3"
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
          <p className="text-text-muted max-w-lg mx-auto">Everything you need to know about our browser-based processing engine.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              q: "Do you upload my files?",
              a: "No. Processing runs locally in your browser for supported tools. Your files remain on your device."
            },
            {
              q: "What formats are supported?",
              a: "Video tools support common web video formats. Audio exports are high-quality MP3."
            },
            {
              q: "Why does the first run take longer?",
              a: "Some features load a processing engine the first time. After that, it's much faster."
            },
            {
              q: "Is it completely free?",
              a: "Basic tasks are free (up to 3 exports/day, 50MB max file size). We offer a Pro plan for unlimited usage and larger files."
            }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="faq-glass-card"
            >
              <h3 className="faq-question">{faq.q}</h3>
              <p className="faq-answer">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowLimitModal(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Crown size={40} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-text-main">Monthly Limit Reached</h3>
                  <p className="text-text-muted">
                    {currentUser
                      ? `You've reached your free limit of ${FREE_DAILY_LIMIT} files today. Upgrade to Pro for unlimited access.`
                      : `You've reached your free limit of ${FREE_DAILY_LIMIT} files today. Upgrade to Pro for unlimited access. Create an account or log in to continue processing.`
                    }
                  </p>
                </div>
                <div className="w-full space-y-3">
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full btn-primary justify-center py-4 text-lg bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20"
                  >
                    <Zap size={20} fill="white" />
                    Unlock Unlimited Access
                  </button>

                  {!currentUser && (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="w-full btn-secondary justify-center py-4 text-lg"
                    >
                      Log In
                    </button>
                  )}

                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="w-full btn-secondary justify-center py-4 text-lg border-none hover:bg-gray-100"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ToolPage;
