import React from 'react';
import { Video as VideoIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
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
          <a href="#" className="footer-link">Remove Audio</a>
          <a href="#" className="footer-link">Extract MP3</a>
          <a href="#" className="footer-link">Compress MP3</a>
          <a href="#" className="footer-link">Pricing</a>
        </div>
        <div>
          <h5 className="footer-title">Support</h5>
          <a href="#" className="footer-link">FAQ</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
        </div>
        <div>
          <h5 className="footer-title">Legal</h5>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Cookie Policy</a>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-glass-border text-center text-xs text-text-muted">
        © {new Date().getFullYear()} VidAudio Remover. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
