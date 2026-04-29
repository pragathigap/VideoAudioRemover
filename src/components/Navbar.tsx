import React, { useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';

// Inline Icons for zero-unused JS
const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
);
const MenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const XIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user?: User | null;
  onPrefetch?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onPrefetch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const active = useMemo(() => {
    if (currentPage === 'login') return 'auth';
    if (currentPage === '') return 'remove-audio';
    return currentPage;
  }, [currentPage]);

  const prefetch = (page: string) => {
    if (onPrefetch) onPrefetch(page);
  };

  const navigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const navItemClass = (isActive: boolean) =>
    `nav-item ${isActive ? 'nav-item-active' : ''}`;

  return (
    <nav ref={navRef} className="navbar glass-effect sticky top-0 z-50 px-6 flex items-center mb-8">
      <div className="flex-1 flex items-center justify-between w-full h-full relative">
        <div
          id="nav-logo"
          className="flex items-center gap-3 cursor-pointer min-w-0"
          onClick={() => navigate('')}
          onMouseEnter={() => prefetch('')}
          onTouchStart={() => prefetch('')}
          role="link"
          tabIndex={0}
          aria-label="Home - Remove Audio from Video"
          onKeyDown={(e) => e.key === 'Enter' && navigate('')}
        >
          <div className="brand-badge w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
            <VideoIcon />
          </div>
          <span className="text-xl font-bold gradient-text truncate">Remove Audio from Video</span>
        </div>

        <div className="hidden lg:flex gap-2 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate('pricing')}
            onMouseEnter={() => prefetch('pricing')}
            onTouchStart={() => prefetch('pricing')}
            className={navItemClass(active === 'pricing')}
          >
            <span>Pricing</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('')}
            onMouseEnter={() => prefetch('')}
            onTouchStart={() => prefetch('')}
            className={navItemClass(active === 'remove-audio')}
          >
            <span>Remove Audio</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('add-audio')}
            onMouseEnter={() => prefetch('add-audio')}
            onTouchStart={() => prefetch('add-audio')}
            className={navItemClass(active === 'add-audio')}
          >
            <span>Add Audio</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('extract-audio')}
            onMouseEnter={() => prefetch('extract-audio')}
            onTouchStart={() => prefetch('extract-audio')}
            className={navItemClass(active === 'extract-audio')}
          >
            <span>Extract Audio</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('compress-video')}
            onMouseEnter={() => prefetch('compress-video')}
            onTouchStart={() => prefetch('compress-video')}
            className={navItemClass(active === 'compress-video')}
          >
            <span>Compress Video</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('resizer')}
            onMouseEnter={() => prefetch('resizer')}
            onTouchStart={() => prefetch('resizer')}
            className={navItemClass(active === 'resizer')}
          >
            <span>Resizer</span>
          </button>
        </div>

        <div className="hidden lg:flex justify-end gap-3">
          {user ? (
            <button
              id="nav-dashboard"
              type="button"
              className="btn-primary py-2 px-6"
              onClick={() => navigate('dashboard')}
              onMouseEnter={() => prefetch('dashboard')}
              onTouchStart={() => prefetch('dashboard')}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                id="nav-login"
                type="button"
                className="btn-secondary py-2 px-6"
                onClick={() => navigate('login')}
                onMouseEnter={() => prefetch('login')}
                onTouchStart={() => prefetch('login')}
              >
                Log In
              </button>
              <button
                id="nav-signup"
                type="button"
                className="btn-primary py-2 px-6"
                onClick={() => navigate('signup')}
                onMouseEnter={() => prefetch('signup')}
                onTouchStart={() => prefetch('signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay lg:hidden">
          <button onClick={() => navigate('pricing')} onMouseEnter={() => prefetch('pricing')} className={`${navItemClass(active === 'pricing')} w-full justify-start py-3 px-4`}>Pricing</button>
          <button onClick={() => navigate('')} onMouseEnter={() => prefetch('')} className={`${navItemClass(active === 'remove-audio')} w-full justify-start py-3 px-4`}>Remove Audio</button>
          <button onClick={() => navigate('add-audio')} onMouseEnter={() => prefetch('add-audio')} className={`${navItemClass(active === 'add-audio')} w-full justify-start py-3 px-4`}>Add Audio</button>
          <button onClick={() => navigate('extract-audio')} onMouseEnter={() => prefetch('extract-audio')} className={`${navItemClass(active === 'extract-audio')} w-full justify-start py-3 px-4`}>Extract Audio</button>
          <button onClick={() => navigate('compress-video')} onMouseEnter={() => prefetch('compress-video')} className={`${navItemClass(active === 'compress-video')} w-full justify-start py-3 px-4`}>Compress Video</button>
          <button onClick={() => navigate('resizer')} onMouseEnter={() => prefetch('resizer')} className={`${navItemClass(active === 'resizer')} w-full justify-start py-3 px-4`}>Resizer</button>
          <div className="h-[1px] bg-white/10 my-2" />
          {user ? (
            <button onClick={() => navigate('dashboard')} onMouseEnter={() => prefetch('dashboard')} className="btn-primary w-full justify-center py-3">Dashboard</button>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('login')} onMouseEnter={() => prefetch('login')} className="btn-secondary w-full justify-center py-3">Log In</button>
              <button onClick={() => navigate('signup')} onMouseEnter={() => prefetch('signup')} className="btn-primary w-full justify-center py-3">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
