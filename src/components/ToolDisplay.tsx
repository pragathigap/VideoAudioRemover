import React from 'react';
import { 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Maximize, 
  VolumeX, 
  Wind, 
  ShieldCheck,
  FileAudio,
  Music,
  Zap,
  HardDrive,
  Rocket,
  Settings,
  Mic,
  RefreshCw
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolContent {
  title: string;
  subtitle: string;
  items: { 
    q: string; 
    a: string; 
    icon: LucideIcon;
    color: string;
  }[];
}

export const toolContentMap: Record<string, ToolContent> = {
  'mute': {
    title: "Why Remove Audio?",
    subtitle: "The fastest way to mute videos directly in your browser.",
    items: [
      { q: "Perfect for Social", a: "Mute original audio before adding trending sounds on platforms.", icon: VolumeX, color: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" },
      { q: "Clean B-Roll", a: "Remove distracting background noise, wind, or chatter from your footage.", icon: Wind, color: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
      { q: "Zero Quality Loss", a: "We strip the audio track without re-encoding, preserving 100% video quality.", icon: ShieldCheck, color: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)" }
    ]
  },
  'extract': {
    title: "Why Extract MP3?",
    subtitle: "Turn any video into a high-quality audio file instantly.",
    items: [
      { q: "Podcasts & Media", a: "Easily convert long-form interviews into MP3s for listening on the go.", icon: Mic, color: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)" },
      { q: "Save Background Music", a: "Extract that perfect background track or sound bite from any recorded clip.", icon: Music, color: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" },
      { q: "High Fidelity", a: "We extract audio directly with high-fidelity encoding for crisp sound.", icon: FileAudio, color: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" }
    ]
  },
  'compress-video': {
    title: "Why Compress Video?",
    subtitle: "Reduce file sizes drastically without sacrificing visual quality.",
    items: [
      { q: "Messaging Ready", a: "Shrink massive video files to bypass attachment limits on Discord and Email.", icon: HardDrive, color: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" },
      { q: "Faster Uploads", a: "Smaller files mean lightning-fast uploads to social media and web forms.", icon: Rocket, color: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
      { q: "Smart Engine", a: "Advanced CRF compression significantly drops file size while keeping visuals crisp.", icon: Zap, color: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)" }
    ]
  },
  'resize-video': {
    title: "Why Resize Video?",
    subtitle: "Perfectly frame and scale your videos for any platform.",
    items: [
      { q: "Social Media Formats", a: "Instantly crop and resize to 9:16 for TikTok/Shorts or 1:1 for Instagram feeds.", icon: Smartphone, color: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
      { q: "Fix Resolution", a: "Lower 4K footage down to standard 1080p or 720p for easier sharing and editing.", icon: Monitor, color: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
      { q: "Black Bar Prevention", a: "Our tools intelligently fit or crop video dimensions to avoid ugly black bars.", icon: Maximize, color: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }
    ]
  },
  'add-audio': {
    title: "Why Add Audio?",
    subtitle: "Replace or overlay new audio tracks onto your videos.",
    items: [
      { q: "Background Music", a: "Easily attach a background music track to your silent or muted video clips.", icon: Music, color: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)" },
      { q: "Voiceovers & Dubs", a: "Sync a newly recorded voiceover file directly to your existing video footage.", icon: Mic, color: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" },
      { q: "Instant Merging", a: "Our web-based engine multiplexes the video and audio files locally in seconds.", icon: RefreshCw, color: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)" }
    ]
  }
};

interface ToolDisplayProps {
  mode: string;
}

const ToolDisplay: React.FC<ToolDisplayProps> = ({ mode }) => {
  const content = toolContentMap[mode] || toolContentMap['mute'];

  return (
    <div className="py-12">
      {/* Feature Badges section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {[
          { title: 'Browser-Based', description: 'Faster processing without server uploads. Your data stays on your machine.', icon: Zap, theme: 'rgba(234, 179, 8, 0.1)', color: '#eab308' },
          { title: 'Privacy First', description: 'Zero tracking. Zero uploads. Zero compromises on your privacy.', icon: ShieldCheck, theme: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
          { title: 'Pro Engine', description: 'Powered by industry-standard FFmpeg for pixel-perfect results.', icon: Settings, theme: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }
        ].map((feature, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="feature-card flex flex-col items-center text-center"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: feature.theme, color: feature.color }}
            >
              <feature.icon size={24} />
            </div>
            <h4 className="font-bold mb-2">{feature.title}</h4>
            <p className="text-sm text-text-muted">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Main Tool Features Section */}
      <section className="mb-24 relative">
        {/* Background blobs for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none -z-10">
          <div className="feature-blob feature-blob-1" />
          <div className="feature-blob feature-blob-2" />
        </div>

        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            {content.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            {content.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {content.items.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -8 }}
              className="feature-card"
            >
              <div 
                className="feature-icon-wrapper"
                style={{ background: item.color }}
              >
                <item.icon size={28} />
              </div>
              <h4 className="feature-title">{item.q}</h4>
              <p className="feature-description leading-relaxed">{item.a}</p>
              
              {/* Card Decoration */}
              <div className="feature-number">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section Card */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="cta-section"
      >
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Process Your Videos?</h2>
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of local media processing. Private, secure, and lightning-fast. No account required to start.
          </p>
          <div className="badge-group">
            <div className="feature-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <CheckCircle2 size={20} /> 100% Private Engine
            </div>
            <div className="feature-badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <Zap size={20} /> Instant Processing
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ToolDisplay;
