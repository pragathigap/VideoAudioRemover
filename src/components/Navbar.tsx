import React, { useMemo, useRef } from 'react';
import { Video as VideoIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user }) => {
  const navRef = useRef<HTMLElement | null>(null);

  const active = useMemo(() => {
    if (currentPage === 'login') return 'auth';
    return currentPage;
  }, [currentPage]);

  const navigate = (page: string) => {
    onNavigate(page);
  };

  const navItemClass = (isActive: boolean) =>
    `nav-item ${isActive ? 'nav-item-active' : ''}`;

  return (
    <nav ref={navRef} className="navbar glass-effect sticky top-0 z-50 px-6 py-4 flex items-center mb-8">
      <div
        className="flex items-center gap-2 flex-1 cursor-pointer"
        onClick={() => navigate('remove-audio')}
      >
        <div className="brand-badge w-10 h-10 rounded-xl flex items-center justify-center">
          <VideoIcon className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold gradient-text">Remove Audio from Video</span>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate('pricing')}
          className={navItemClass(active === 'pricing')}
        >
          <span>Pricing</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('remove-audio')}
          className={navItemClass(active === 'remove-audio')}
        >
          <span>Remove Audio</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('add-audio')}
          className={navItemClass(active === 'add-audio')}
        >
          <span>Add Audio</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('extract-audio')}
          className={navItemClass(active === 'extract-audio')}
        >
          <span>Extract Audio</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('compress-video')}
          className={navItemClass(active === 'compress-video')}
        >
          <span>Compress Video</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('resizer')}
          className={navItemClass(active === 'resizer')}
        >
          <span>Resizer</span>
        </button>
      </div>

      <div className="flex justify-end flex-1">
        <div className="flex items-center gap-3">
          {user ? (
            <button
              type="button"
              className="btn-primary py-2 px-6"
              onClick={() => navigate('dashboard')}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button type="button" className="btn-secondary py-2 px-6" onClick={() => navigate('login')}>
                Log In
              </button>
              <button type="button" className="btn-primary py-2 px-6" onClick={() => navigate('signup')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
