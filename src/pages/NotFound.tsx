import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Home as HomeIcon } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8"
      >
        <Rocket size={48} />
      </motion.div>
      
      <h1 className="text-6xl font-black mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold mb-6 text-text-main">Lost in Space?</h2>
      <p className="text-text-muted text-lg max-w-md mb-12">
        The page you are looking for doesn't exist or has been moved to a different galaxy.
      </p>

      <button
        onClick={() => onNavigate('')}
        className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
      >
        <HomeIcon size={20} /> Back to Homepage
      </button>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl opacity-50 italic text-sm">
        <span>#video-remover</span>
        <span>#audio-extractor</span>
        <span>#fast-compressor</span>
        <span>#secure-tools</span>
      </div>
    </div>
  );
};

export default NotFound;
