import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Video as VideoIcon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const active = useMemo(() => {
    if (currentPage.startsWith('info:')) return 'info';
    if (currentPage.startsWith('auth:')) return 'auth';
    return currentPage;
  }, [currentPage]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!navRef.current?.contains(target)) {
        setIsMoreOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const navigate = (page: string) => {
    onNavigate(page);
    setIsMoreOpen(false);
  };

  const navItemClass = (isActive: boolean) =>
    `nav-item ${isActive ? 'nav-item-active' : ''}`;

  return (
    <nav ref={navRef} className="navbar glass-effect sticky top-0 z-50 px-6 py-4 flex items-center mb-8">
      <div 
        className="flex items-center gap-2 flex-1 cursor-pointer" 
        onClick={() => navigate('home')}
      >
        <div className="brand-badge w-10 h-10 rounded-xl flex items-center justify-center">
          <VideoIcon className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold gradient-text">VidAudio Remover</span>
      </div>

      <div className="flex gap-4 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate('home')}
          className={navItemClass(active === 'home')}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => navigate('tools')}
          className={navItemClass(active === 'tools')}
        >
          Tools
        </button>
        <button 
          type="button"
          onClick={() => navigate('pricing')}
          className={navItemClass(active === 'pricing')}
        >
          Pricing
        </button>
        <div className="relative">
          <button
            type="button"
            className={navItemClass(active === 'info')}
            onClick={() => setIsMoreOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={isMoreOpen}
          >
            <span className="flex items-center gap-2">
              More <ChevronDown size={14} className={`nav-chevron ${isMoreOpen ? 'nav-chevron-open' : ''}`} />
            </span>
          </button>

          {isMoreOpen && (
            <div role="menu" className="nav-dropdown glass-effect">
              <button type="button" role="menuitem" className="nav-dropdown-item" onClick={() => navigate('info:about')}>
                About
              </button>
              <button type="button" role="menuitem" className="nav-dropdown-item" onClick={() => navigate('info:faq')}>
                FAQ
              </button>
              <button type="button" role="menuitem" className="nav-dropdown-item" onClick={() => navigate('info:contact')}>
                Contact
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end flex-1">
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary py-2 px-6" onClick={() => navigate('auth:login')}>
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
