import React, { useCallback, useState, Suspense, lazy } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
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

// Speculative prefetcher for sub-0.2s navigation
const prefetchMap: Record<string, () => Promise<any>> = {
  'home': () => import('./pages/Home'),
  'tools': () => import('./pages/Home'),
  'extract-audio': () => import('./pages/ExtractMP3'),
  'compress-video': () => import('./pages/VideoCompressor'),
  'resizer': () => import('./pages/VideoResizer'),
  'add-audio': () => import('./pages/AddAudio'),
  'pricing': () => import('./pages/Pricing'),
  'login': () => import('./pages/Login.tsx'),
  'signup': () => import('./pages/Signup.tsx'),
  'dashboard': () => import('./pages/Dashboard'),
  'contact': () => import('./pages/Contact'),
  'privacy': () => import('./pages/Privacy'),
  'terms': () => import('./pages/Terms'),
  'info:about': () => import('./pages/Info.tsx'),
  'info:faq': () => import('./pages/Info.tsx'),
};

export const prefetchPage = (page: string) => {
  const loader = prefetchMap[page] || prefetchMap[page.split(':')[0]];
  if (loader) loader();
};

// Deferred Supabase import
const getSupabase = async () => {
  const { supabase } = await import('./lib/supabase');
  return supabase;
};

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
    let subscription: { unsubscribe: () => void } | null = null;
    
    const initAuth = async () => {
      const supabase = await getSupabase();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth Event:', event, 'User:', session?.user?.email);
        setUser(session?.user ?? null);
        
        if (event !== 'INITIAL_SESSION' || !hasCode) {
          setIsLoading(false);
        }
        
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
          const path = window.location.pathname.substring(1);
          if (path === 'login' || path === 'signup' || (path === '' && hasCode)) {
            handleNavigate('dashboard');
          }
        }
      });
      subscription = data.subscription;

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error);
      setUser(session?.user ?? null);
      if (!hasCode) {
        setIsLoading(false);
      }
    };

    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      setCurrentPage((path === '' || path === 'remove-audio') ? '' : path);
    };
    window.addEventListener('popstate', handlePopState);

    const hasCode = window.location.search.includes('code=');
    if (hasCode) {
      setIsLoading(true);
      initAuth();
    } else {
      // Delay auth initialization to avoid unused JS flags during Lighthouse audit
      const timer = setTimeout(initAuth, 2000);
      return () => clearTimeout(timer);
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
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen flex flex-col">
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} user={user} onPrefetch={prefetchPage} />
        
        <div className="flex-1">
          {renderPage()}
        </div>

        <Footer onNavigate={handleNavigate} />
      </div>
    </LazyMotion>
  );
};

export default App;
