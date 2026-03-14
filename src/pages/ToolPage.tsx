import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, CheckCircle2, VolumeX, FileAudio, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { muteVideo, extractAudio, compressVideo, resizeVideo, addAudioToVideo } from '../mediaProcessor';

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

  // Settings for new tools
  const [compressionCrf, setCompressionCrf] = useState(28); // 18-28 is good range
  const [resizeRes, setResizeRes] = useState<{ w: number, h: number }>({ w: 1280, h: 720 });
  const [selectedFrame, setSelectedFrame] = useState('16:9');
  const [selectedQuality, setSelectedQuality] = useState('720');

  useEffect(() => {
    const q = parseInt(selectedQuality);
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

    setResizeRes({ w, h });
  }, [selectedFrame, selectedQuality]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'idle' as const
      }));
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

  const handleMuteVideo = async (fileObj: MediaFile) => {
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

  const handleExtractAudio = async (fileObj: MediaFile) => {
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

  const handleCompressVideo = async (fileObj: MediaFile) => {
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

  const handleAddAudio = async (fileObj: MediaFile) => {
    if (!fileObj.audioFile) return;
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

  const handleResizeVideo = async (fileObj: MediaFile) => {
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
          <p className="text-text-muted">Drag & drop MP4 files here</p>
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
                        <option value="1080">1080p (Full HD)</option>
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
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2">
                      <div className="video-preview-container">
                        <video src={file.preview} controls muted={file.status === 'idle'} />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate text-sm">{file.file.name}</p>
                        <span className={`status-badge ${file.status === 'done' ? 'status-done' : 'status-processing'}`}>
                          {file.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
                      {(mode === 'all' || mode === 'mute') && (
                        <button
                          onClick={() => handleMuteVideo(file)}
                          disabled={file.status === 'processing'}
                          className="btn-primary w-full justify-center py-4 text-lg"
                        >
                          <VolumeX size={20} /> Remove Audio
                        </button>
                      )}
                      {(mode === 'all' || mode === 'extract') && (
                        <button
                          onClick={() => handleExtractAudio(file)}
                          disabled={file.status === 'processing'}
                          className="btn-secondary w-full justify-center py-4 text-lg"
                        >
                          <FileAudio size={20} /> Extract Audio (MP3)
                        </button>
                      )}

                      {mode === 'compress-video' && (
                        <button
                          onClick={() => handleCompressVideo(file)}
                          disabled={file.status === 'processing'}
                          className="btn-primary w-full justify-center py-4 text-lg"
                        >
                          Compress Now
                        </button>
                      )}

                      {mode === 'resize-video' && (
                        <button
                          onClick={() => handleResizeVideo(file)}
                          disabled={file.status === 'processing'}
                          className="btn-primary w-full justify-center py-4 text-lg"
                        >
                          Resize to {resizeRes.w}x{resizeRes.h}
                        </button>
                      )}

                      {mode === 'add-audio' && (
                        <div className="space-y-3">
                          <button
                            onClick={() => handleAudioPick(file.id)}
                            disabled={file.status === 'processing'}
                            className="btn-secondary w-full justify-center py-4 text-lg"
                          >
                            <FileAudio size={20} /> {file.audioFile ? 'Change Audio' : 'Select Audio File'}
                          </button>

                          {file.audioFile && (
                            <div className="bg-bg-dark-alt/50 border border-glass-border rounded-xl p-3 flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-text-muted uppercase">Selected Audio</span>
                                <span className="text-xs text-primary font-medium">Ready</span>
                              </div>
                              <p className="text-sm font-medium truncate">{file.audioFile.name}</p>
                              <audio src={file.audioPreview} controls className="w-full h-8" />
                            </div>
                          )}

                          <button
                            onClick={() => handleAddAudio(file)}
                            disabled={file.status === 'processing' || !file.audioFile}
                            className="btn-primary w-full justify-center py-4 text-lg"
                          >
                            Merge Audio & Video
                          </button>
                        </div>
                      )}

                      {file.status === 'processing' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{isFFmpegLoading ? 'Loading Engine...' : 'Processing...'}</span>
                            <span>{file.progress}%</span>
                          </div>
                          <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${file.progress}%` }} />
                          </div>
                          {isFFmpegLoading && (
                            <p className="text-[10px] text-text-muted italic">Downloading processing core (one-time)...</p>
                          )}
                        </div>
                      )}

                      {file.status === 'done' && (
                        <motion.button
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          onClick={() => downloadProcessed(file)}
                          className="btn-primary w-full justify-center py-4 bg-success hover:bg-green-600 border-none mt-2 text-lg"
                        >
                          <Download size={20} /> Download {file.processedType ? file.processedType.charAt(0).toUpperCase() + file.processedType.slice(1) : ''}
                        </motion.button>
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="btn-danger w-full justify-center py-4 text-lg mt-auto"
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
              a: "Basic tasks are free. We offer a Pro plan for unlimited usage and larger files."
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
    </main>
  );
};

export default ToolPage;
