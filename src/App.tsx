import React, { useCallback, useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route-based code splitting
const RemoveAudio = lazy(() => import('./pages/RemoveAudio'));
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    // If there is a code in the URL, we know an auth exchange is happening
    const hasCode = window.location.search.includes('code=');
    if (hasCode) {
      console.log('Auth code detected in URL, waiting for exchange...');
      setIsLoading(true);
    }

    const subscription = supabase
      ? supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
          console.log('Auth Event:', event, 'User:', session?.user?.email);
          setUser(session?.user ?? null);
          
          // Only stop loading if we have resolved the initial state or a code was exchanged
          if (event !== 'INITIAL_SESSION' || !hasCode) {
            setIsLoading(false);
          }
          
          if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
            const path = window.location.pathname.substring(1);
            if (path === 'login' || path === 'signup' || (path === '' && hasCode)) {
              console.log('Redirecting to dashboard...');
              handleNavigate('dashboard');
            }
          }
        }).data.subscription
      : null;

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) console.error('Session error:', error);
        console.log('Initial Session Fetch:', session?.user?.email);
        setUser(session?.user ?? null);
        if (!hasCode) {
          setIsLoading(false);
        }
      });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      subscription?.unsubscribe();
    };
  }, [handleNavigate]);

  // Auth Guard: Redirect logged-in users away from auth pages
  React.useEffect(() => {
    if (user && (currentPage === 'login' || currentPage === 'signup')) {
      handleNavigate('dashboard');
    }
  }, [user, currentPage, handleNavigate]);

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    return (
      <Suspense fallback={null}>
        {(() => {
          if (currentPage.startsWith('info:')) {
            const section = currentPage.split(':')[1];
            if (section === 'about') return <Info section="about" onNavigate={handleNavigate} />;
            if (section === 'faq') return <Info section="faq" onNavigate={handleNavigate} />;
            if (section === 'contact') return <Contact />;
          }

          switch (currentPage) {
            case '':
            case 'remove-audio':
              return <RemoveAudio />;
            case 'home':
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
              return <Dashboard onNavigate={handleNavigate} user={user} isLoading={isLoading} />;
            case 'contact':
              return <Contact />;
            case 'privacy':
              return <Privacy />;
            case 'terms':
              return <Terms />;
            default:
              return <Home />;
          }
        })()}
      </Suspense>
    );
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
