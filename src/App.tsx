import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RemoveAudio from './pages/RemoveAudio';
import ExtractMP3 from './pages/ExtractMP3';
import VideoCompressor from './pages/VideoCompressor';
import VideoResizer from './pages/VideoResizer';
import Pricing from './pages/Pricing';
import Info from './pages/Info.tsx';
import Login from './pages/Login.tsx';
import AddAudio from './pages/AddAudio';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const App: React.FC = () => {
  // Use lowercase for cleaner URLs
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.substring(1);
    return path || 'remove-audio';
  });

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      setCurrentPage(path || 'remove-audio');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        return <Pricing />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
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
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
