import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Info from './pages/Info.tsx';
import Login from './pages/Login.tsx';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (currentPage.startsWith('info:')) {
      const section = currentPage.split(':')[1];
      if (section === 'about' || section === 'faq' || section === 'contact') {
        return <Info section={section} onNavigate={handleNavigate} />;
      }
      return <Info section="about" onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'home':
        return <Landing onNavigate={handleNavigate} />;
      case 'tools':
        return <Home />;
      case 'pricing':
        return <Pricing />;
      case 'auth:login':
        return <Login onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer />
    </div>
  );
};

export default App;
