import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle, Info, Mail, Shield } from 'lucide-react';

type InfoSection = 'about' | 'faq' | 'contact';

interface InfoProps {
  section: InfoSection;
  onNavigate: (page: string) => void;
}

const InfoPage: React.FC<InfoProps> = ({ section, onNavigate }) => {
  const header = useMemo(() => {
    switch (section) {
      case 'faq':
        return { title: 'FAQ', subtitle: 'Quick answers to common questions.' };
      case 'contact':
        return { title: 'Contact', subtitle: 'Reach out anytime — feedback helps us ship faster.' };
      default:
        return { title: 'About', subtitle: 'Powerful, private media tools that run locally in your browser.' };
    }
  }, [section]);

  return (
    <main className="max-w-4xl mx-auto px-6">
      <header className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {header.title} <span className="gradient-text">Remove Audio from Video</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-lg"
        >
          {header.subtitle}
        </motion.p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-effect p-6 rounded-2xl">
          <Shield className="text-primary mb-4" size={24} />
          <h3 className="font-bold mb-2">Privacy First</h3>
          <p className="text-sm text-text-muted">Your files stay on your device. No uploads by default.</p>
        </div>
        <div className="glass-effect p-6 rounded-2xl">
          <Info className="text-primary mb-4" size={24} />
          <h3 className="font-bold mb-2">Simple UX</h3>
          <p className="text-sm text-text-muted">Clean flows, instant previews, and one-click downloads.</p>
        </div>
        <div className="glass-effect p-6 rounded-2xl">
          <HelpCircle className="text-primary mb-4" size={24} />
          <h3 className="font-bold mb-2">Built for Creators</h3>
          <p className="text-sm text-text-muted">Quick utilities for video audio removal, MP3 extraction, and compression.</p>
        </div>
      </section>

      {section === 'about' && (
        <section className="glass-effect rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Remove Audio from Video?</h2>
          <div className="space-y-4">
            <p className="text-text-muted">
              Remove Audio from Video is a lightweight toolbox for common media jobs: remove audio from videos, extract MP3,
              and export smaller compressed MP3 files.
            </p>
            <p className="text-text-muted">
              The focus is speed and privacy. Most tasks happen directly in your browser, powered by modern web APIs and
              proven media processing.
            </p>
          </div>

          <div className="info-cta-row">
            <button type="button" className="btn-primary" onClick={() => onNavigate('home')}>
              Try Video Tools <ArrowRight size={16} />
            </button>
            <button type="button" className="btn-secondary" onClick={() => onNavigate('pricing')}>
              View Pricing
            </button>
          </div>
        </section>
      )}

      {section === 'faq' && (
        <section className="glass-effect rounded-3xl p-8 mb-12">
          <div className="space-y-6">
            {[
              {
                q: 'Do you upload my files?',
                a: 'No. Processing runs locally in your browser for supported tools. Your files remain on your device.',
              },
              {
                q: 'What formats are supported?',
                a: 'Video tools support common web video formats. Audio exports are MP3.',
              },
              {
                q: 'Why does the first run take longer?',
                a: 'Some features load a processing engine the first time. After that, it’s much faster.',
              },
              {
                q: 'Can I use this on mobile?',
                a: 'Yes, but heavy processing depends on device power and available memory.',
              },
            ].map((item) => (
              <div key={item.q} className="faq-item">
                <h3 className="font-bold mb-2">{item.q}</h3>
                <p className="text-sm text-text-muted">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="info-cta-row">
            <button type="button" className="btn-primary" onClick={() => onNavigate('home')}>
              Try Video Tools <ArrowRight size={16} />
            </button>
            <button type="button" className="btn-secondary" onClick={() => onNavigate('pricing')}>
              Go Pro
            </button>
          </div>
        </section>
      )}

      {section === 'contact' && (
        <section className="glass-effect rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
          <p className="text-text-muted mb-6">
            For support, feature requests, or partnerships, email us. We typically respond within 24–48 hours.
          </p>

          <div className="contact-card">
            <div className="contact-icon">
              <Mail size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Email</p>
              <a className="contact-link" href="mailto:support@vidaudio.tools">
                support@vidaudio.tools
              </a>
            </div>
            <button type="button" className="btn-secondary" onClick={() => window.open('mailto:support@vidaudio.tools')}>
              Compose
            </button>
          </div>

          <div className="info-cta-row">
            <button type="button" className="btn-primary" onClick={() => onNavigate('home')}>
              Back to Tools <ArrowRight size={16} />
            </button>
            <button type="button" className="btn-secondary" onClick={() => onNavigate('auth:login')}>
              Log In
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default InfoPage;
