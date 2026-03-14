import React from 'react';
import { Video as VideoIcon } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="cursor-pointer" onClick={() => navigate('remove-audio')}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <VideoIcon className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold gradient-text">VidAudio</span>
          </div>
          <p className="text-sm text-text-muted">
            Professional browser-based media tools. Fast, private, and powerful.
          </p>
        </div>
        <div>
          <h5 className="footer-title">Tools</h5>
          <button onClick={() => navigate('remove-audio')} className="footer-link-btn">Remove Audio</button>
          <button onClick={() => navigate('extract-audio')} className="footer-link-btn">Extract Audio</button>
          <button onClick={() => navigate('compress-video')} className="footer-link-btn">Compress Video</button>
          <button onClick={() => navigate('add-audio')} className="footer-link-btn">Add Audio</button>
          <button onClick={() => navigate('resizer')} className="footer-link-btn">Resize Video</button>
        </div>
        <div>
          <h5 className="footer-title">Support</h5>
          <button onClick={() => navigate('info:faq')} className="footer-link-btn">FAQ</button>
          <button onClick={() => navigate('contact')} className="footer-link-btn">Contact</button>
          <button onClick={() => navigate('privacy')} className="footer-link-btn">Privacy</button>
          <button onClick={() => navigate('terms')} className="footer-link-btn">Terms</button>
        </div>
        <div>
          <h5 className="footer-title">Legal</h5>
          <button onClick={() => navigate('privacy')} className="footer-link-btn">Privacy Policy</button>
          <button onClick={() => navigate('terms')} className="footer-link-btn">Terms of Service</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-glass-border text-center text-xs text-text-muted">
        © {new Date().getFullYear()} VidAudio Remover. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
