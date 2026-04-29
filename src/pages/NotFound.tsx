import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Home as HomeIcon } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] relative flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none -z-10">
        <div className="feature-blob feature-blob-1" style={{ width: '400px', height: '400px' }} />
        <div className="feature-blob feature-blob-2" style={{ width: '400px', height: '400px', left: '60%' }} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-32 h-32 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-10 border border-primary/20 backdrop-blur-xl"
      >
        <Rocket size={56} />
      </motion.div>
      
      <h1 className="text-8xl font-black mb-4 tracking-tighter gradient-text">404</h1>
      <h2 className="text-3xl font-bold mb-6 text-text-main">Page Not Found</h2>
      <p className="text-text-muted text-lg max-w-md mb-12 leading-relaxed font-medium">
        Oops! It looks like you've drifted off course. The page you're looking for has vanished into thin air.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onNavigate('')}
          className="btn-primary flex items-center justify-center gap-2 px-10 py-4 text-lg shadow-xl shadow-primary/20"
        >
          <HomeIcon size={20} /> Back to Homepage
        </button>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl opacity-30 font-bold uppercase tracking-widest text-[10px]">
        <span className="hover:opacity-100 transition-opacity cursor-default">#remove-audio</span>
        <span className="hover:opacity-100 transition-opacity cursor-default">#video-compressor</span>
        <span className="hover:opacity-100 transition-opacity cursor-default">#resizer-pro</span>
        <span className="hover:opacity-100 transition-opacity cursor-default">#secure-processing</span>
      </div>
    </div>
  );
};

export default NotFound;
