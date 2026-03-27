import React, { useCallback, useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RemoveAudio from './pages/RemoveAudio';

// Lazy load non-critical pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ExtractMP3 = lazy(() => import('./pages/ExtractMP3'));
const VideoCompressor = lazy(() => import('./pages/VideoCompressor'));
const VideoResizer = lazy(() => import('./pages/VideoResizer'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Info = lazy(() => import('./pages/Info.tsx'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login.tsx'));
const Signup = lazy(() => import('./pages/Signup.tsx'));
const AddAudio = lazy(() => import('./pages/AddAudio'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

import { supabase } from './lib/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

// Loading fallback
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // Use lowercase for cleaner URLs
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.substring(1);
    // If path is empty or 'remove-audio', default to root ''
    return (path === '' || path === 'remove-audio') ? '' : path;
  });

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
    // If page is empty string, push root path '/'
    window.history.pushState({}, '', page === '' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      setCurrentPage((path === '' || path === 'remove-audio') ? '' : path);
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
      case '':
      case 'remove-audio':
        return <RemoveAudio />;
      case 'home':
        return <Home />;
      case 'tools':
        return <Home />;
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
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
