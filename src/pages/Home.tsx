import React, { useState, useRef } from 'react';
import { Upload, Download, CheckCircle2, VolumeX, FileAudio, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { muteVideo, extractAudio, extractAndCompressAudio } from '../mediaProcessor';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  processed?: string;
  processedType?: 'video' | 'audio';
  progress: number;
  status: 'idle' | 'processing' | 'done' | 'error';
}

const Home: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isFFmpegLoading, setIsFFmpegLoading] = useState(false);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mp3BitrateKbps, setMp3BitrateKbps] = useState(128);

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
    setMediaFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMuteVideo = async (fileObj: MediaFile) => {
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0 } : f
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
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0 } : f
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

  const handleExtractAndCompressAudio = async (fileObj: MediaFile) => {
    setIsFFmpegLoading(true);
    setMediaFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'processing', progress: 0 } : f
    ));

    try {
      const result = await extractAndCompressAudio(fileObj.file, mp3BitrateKbps, (p) => {
        setIsFFmpegLoading(false);
        setMediaFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, progress: p } : f
        ));
      });
      
      setMediaFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, processed: result, processedType: 'audio', status: 'done', progress: 100 } : f
      ));
    } catch (err: unknown) {
      console.error('Compress error:', err);
      setIsFFmpegLoading(false);
      const message = err instanceof Error ? err.message : 'Failed to compress audio';
      setFfmpegError(message);
      setMediaFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'error' } : f
      ));
    }
  };

  const downloadProcessed = (fileObj: MediaFile) => {
    if (!fileObj.processed) return;
    const link = document.createElement('a');
    link.href = fileObj.processed;
    const ext = fileObj.processedType === 'video' ? 'mp4' : 'mp3';
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
        >
          Mute or Extract <span className="gradient-text">Magic</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-lg"
        >
          Upload a video, remove its audio, extract MP3, or extract a smaller compressed MP3.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="home-tool-list"
        >
          <div className="home-tool-chip">
            <VolumeX size={16} />
            Remove Audio
          </div>
          <div className="home-tool-chip">
            <FileAudio size={16} />
            Extract MP3
          </div>
          <div className="home-tool-chip">
            <FileAudio size={16} />
            Extract & Compress MP3 (choose bitrate)
          </div>
        </motion.div>
      </header>

      {ffmpegError && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 flex mb-8 justify-between items-center"
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
          <p className="text-text-muted">Drag & drop MP4/WebM files here</p>
        </div>

        {mediaFiles.length > 0 && (
          <div className="mt-12 space-y-12">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <p className="font-semibold">MP3 Compression</p>
                  <p className="text-sm text-text-muted">Lower bitrate = smaller file size</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-muted">Bitrate</span>
                  <select
                    value={mp3BitrateKbps}
                    onChange={(e) => setMp3BitrateKbps(Number(e.target.value))}
                    className="tool-select"
                    aria-label="MP3 bitrate"
                  >
                    {[64, 96, 128, 160, 192, 256, 320].map((v) => (
                      <option key={v} value={v}>{v} kbps</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
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
                      <button 
                        onClick={() => handleMuteVideo(file)}
                        disabled={file.status === 'processing'}
                        className="btn-primary w-full justify-center py-4 text-lg"
                      >
                        <VolumeX size={20} /> Remove Audio
                      </button>
                      <button 
                        onClick={() => handleExtractAudio(file)}
                        disabled={file.status === 'processing'}
                        className="btn-secondary w-full justify-center py-4 text-lg"
                      >
                        <FileAudio size={20} /> Extract Audio (MP3)
                      </button>
                      <button
                        onClick={() => handleExtractAndCompressAudio(file)}
                        disabled={file.status === 'processing'}
                        className="btn-secondary w-full justify-center py-4 text-lg"
                      >
                        <FileAudio size={20} /> Extract & Compress MP3
                      </button>

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
                          className="btn-primary w-full justify-center py-4 bg-success hover:bg-green-600 border-none mt-2"
                        >
                          <Download size={20} /> Download {file.processedType?.toUpperCase()}
                        </motion.button>
                      )}

                      <button 
                        onClick={() => removeFile(file.id)}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors mt-2"
                      >
                        Cancel / Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
    </main>
  );
};

export default Home;
