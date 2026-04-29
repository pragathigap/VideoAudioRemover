import React from 'react';

// Inline Icons for zero-unused JS
const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

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
      <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          id="footer-logo"
          className="cursor-pointer"
          onClick={() => navigate('')}
          role="link"
          tabIndex={0}
          aria-label="Home - Remove Audio from Video"
          onKeyDown={(e) => e.key === 'Enter' && navigate('')}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <VideoIcon />
            </div>
            <span className="text-lg font-bold gradient-text">Remove Audio from Video</span>
          </div>
          <p className="text-sm text-text-muted">
            Professional browser-based media tools. Fast, private, and powerful.
          </p>
        </div>
        <div>
          <h5 className="footer-title">Tools</h5>
          <button id="footer-tool-remove" onClick={() => navigate('')} className="footer-link-btn">Remove Audio</button>
          <button id="footer-tool-extract" onClick={() => navigate('extract-audio')} className="footer-link-btn">Extract Audio</button>
          <button id="footer-tool-compress" onClick={() => navigate('compress-video')} className="footer-link-btn">Compress Video</button>
          <button id="footer-tool-add" onClick={() => navigate('add-audio')} className="footer-link-btn">Add Audio</button>
          <button id="footer-tool-resize" onClick={() => navigate('resizer')} className="footer-link-btn">Resize Video</button>
        </div>
        <div>
          <h5 className="footer-title">Support</h5>
          <button onClick={() => navigate('info:faq')} className="footer-link-btn">FAQ</button>
          <button onClick={() => navigate('contact')} className="footer-link-btn">Contact</button>
          <a href="/privacy-policy.html" onClick={(e) => { e.preventDefault(); navigate('privacy'); }} className="footer-link-btn text-left">Privacy</a>
          <a href="/terms-of-service.html" onClick={(e) => { e.preventDefault(); navigate('terms'); }} className="footer-link-btn text-left">Terms</a>
        </div>
        <div>
          <h5 className="footer-title">Legal</h5>
          <a href="/privacy-policy.html" onClick={(e) => { e.preventDefault(); navigate('privacy'); }} className="footer-link-btn text-left">Privacy Policy</a>
          <a href="/terms-of-service.html" onClick={(e) => { e.preventDefault(); navigate('terms'); }} className="footer-link-btn text-left">Terms of Service</a>
        </div>
      </div>
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-glass-border text-center text-xs text-text-muted flex flex-col items-center gap-4">
        <div className="flex gap-4 mb-2">
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Instagram"><InstagramIcon /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Twitter"><TwitterIcon /></a>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span>© {new Date().getFullYear()} Remove Audio from Video. All rights reserved.</span>
          <span>powered By Golden Advertising & Publicity</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
