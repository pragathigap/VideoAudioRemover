import React, { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RemoveAudio from './pages/RemoveAudio';
import ExtractMP3 from './pages/ExtractMP3';
import VideoCompressor from './pages/VideoCompressor';
import VideoResizer from './pages/VideoResizer';
import Pricing from './pages/Pricing';
import Info from './pages/Info.tsx';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import AddAudio from './pages/AddAudio';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

import { supabase } from './lib/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // Use lowercase for cleaner URLs
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.substring(1);
    return path || 'remove-audio';
  });

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      setCurrentPage(path || 'remove-audio');
    };
    window.addEventListener('popstate', handlePopState);

    const subscription = supabase
      ? supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
          setUser(session?.user ?? null);
          if (event === 'SIGNED_IN') {
            const path = window.location.pathname.substring(1);
            if (path === 'login' || path === 'signup') {
              handleNavigate('dashboard');
            }
          }
        }).data.subscription
      : null;

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      subscription?.unsubscribe();
    };
  }, [handleNavigate]);

  const renderPage = () => {
    if (currentPage.startsWith('info:')) {
      const section = currentPage.split(':')[1];
      if (section === 'about') return <Info section="about" onNavigate={handleNavigate} />;
      if (section === 'faq') return <Info section="faq" onNavigate={handleNavigate} />;
      // Mapping old info links to new dedicated pages
      if (section === 'contact') return <Contact />;
    }

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'tools':
        return <Home />;
      case 'remove-audio':
        return <RemoveAudio />;
      case 'extract-audio':
        return <ExtractMP3 />;
      case 'compress-video':
        return <VideoCompressor />;
      case 'resizer':
        return <VideoResizer />;
      case 'add-audio':
        return <AddAudio />;
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} user={user} />
      
      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
