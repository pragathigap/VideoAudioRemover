import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const toolContentMap: Record<string, { title: string, subtitle: string, items: { q: string, a: string }[] }> = {
  'mute': {
    title: "Why Remove Audio?",
    subtitle: "The fastest way to mute videos directly in your browser.",
    items: [
      { q: "Perfect for Social Media", a: "Mute original audio before adding trending sounds on platforms like TikTok and Instagram Reels." },
      { q: "Clean B-Roll", a: "Remove distracting background noise, wind, or chatter from your footage before editing." },
      { q: "Zero Quality Loss", a: "We strip the audio track without re-encoding the video stream, preserving 100% of the original video quality." }
    ]
  },
  'extract': {
    title: "Why Extract MP3?",
    subtitle: "Turn any video into a high-quality audio file instantly.",
    items: [
      { q: "Podcasts & Interviews", a: "Easily convert video podcasts or long-form interviews into MP3s for listening on the go." },
      { q: "Save Background Music", a: "Extract that perfect background track or sound bite from a recorded clip." },
      { q: "High Quality Audio", a: "We extract the audio directly with high-fidelity encoding, ensuring crisp sound." }
    ]
  },
  'compress-video': {
    title: "Why Compress Video?",
    subtitle: "Reduce file sizes drastically without sacrificing visual quality.",
    items: [
      { q: "Discord & Email Ready", a: "Shrink massive video files to bypass attachment limits on messaging apps and email." },
      { q: "Faster Uploads", a: "Smaller files mean lightning-fast uploads to YouTube, Instagram, and web forms." },
      { q: "Smart FFmpeg Engine", a: "We use advanced CRF compression to significantly drop file size while keeping the video looking crisp." }
    ]
  },
  'resize-video': {
    title: "Why Resize Video?",
    subtitle: "Perfectly frame and scale your videos for any platform.",
    items: [
      { q: "Social Media Formats", a: "Instantly crop and resize to 9:16 for TikTok/Shorts or 1:1 for Instagram feeds." },
      { q: "Fix Resolution", a: "Lower 4K footage down to standard 1080p or 720p for easier sharing and editing performance." },
      { q: "Black Bar Prevention", a: "Our tools intelligently fit or crop video dimensions to avoid ugly black bars." }
    ]
  },
  'add-audio': {
    title: "Why Add Audio?",
    subtitle: "Replace or overlay new audio tracks onto your videos.",
    items: [
      { q: "Background Music", a: "Easily attach a background music track to your silent or muted video clips." },
      { q: "Voiceovers & Dubs", a: "Sync a newly recorded voiceover file directly to your existing video footage." },
      { q: "Instant Merging", a: "Our web-based engine multiplexes the video and audio files locally in seconds." }
    ]
  }
};

interface ToolDisplayProps {
  mode: string;
}

const ToolDisplay: React.FC<ToolDisplayProps> = ({ mode }) => {
  const content = toolContentMap[mode] || toolContentMap['mute'];

  return (
    <>
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

      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
          <p className="text-text-muted">{content.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.items.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {i + 1}
              </div>
              <h4 className="font-bold">{item.q}</h4>
              <p className="text-sm text-text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-effect p-12 rounded-[2.5rem] mb-24 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Process Your Videos?</h2>
          <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
            Experience the power of local media processing. No account required to start.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-success bg-success/10 px-4 py-2 rounded-full">
              <CheckCircle2 size={16} /> 100% Private
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
              <CheckCircle2 size={16} /> No Upload Limits
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ToolDisplay;
