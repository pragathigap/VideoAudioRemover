import React from 'react';
import { motion } from 'framer-motion';
import { Shield, EyeOff, Lock, ServerOff, FileCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 mb-24">
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Shield size={12} />
          <span>Privacy Priority</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Privacy <span className="gradient-text">Policy</span>
        </motion.h1>
        <p className="text-text-muted text-lg">Your data is yours. We just provide the tools.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: EyeOff, title: "No Tracking", text: "We don't use cookies to track your personal activity." },
          { icon: ServerOff, title: "No Uploads", text: "Media processing happens entirely in your local browser." },
          { icon: Lock, title: "Secure", text: "Advanced encryption stays within your machine's secure sandbox." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-effect p-6 rounded-2xl flex flex-col items-center text-center gap-3 border border-glass-border"
          >
            <item.icon className="text-cyan-400" size={24} />
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </section>

      <div className="space-y-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect p-8 rounded-3xl border border-glass-border"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <FileCheck className="text-cyan-400" size={18} />
            </div>
            Information We Collect
          </h2>
          <div className="prose prose-invert max-w-none text-text-muted space-y-4">
            <p>
              At VidAudio, we prioritize your data privacy above all else. Because our tools are browser-based:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Video & Audio Files:</strong> We never upload your media files to our servers. All processing is done locally on your device via FFmpeg.wasm.</li>
              <li><strong>Personal Data:</strong> We do not require account creation for basic usage. If you choose to go Pro, we only collect minimal billing information through our secure payment provider (Stripe).</li>
              <li><strong>Local Storage:</strong> We may use browser local storage to save your workspace preferences, which never leaves your device.</li>
            </ul>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect p-8 rounded-3xl border border-glass-border"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Shield className="text-cyan-400" size={18} />
            </div>
            Data Security
          </h2>
          <p className="text-text-muted leading-relaxed mb-6">
            We use industry-standard security measures to protect your information. Since your media files never reach our servers, the primary security boundary is your own browser's security sandbox.
          </p>
          <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6">
            <h4 className="font-bold text-cyan-400 mb-2 italic">Pro Tip:</h4>
            <p className="text-sm text-text-muted italic">
              "For ultimate privacy, you can even use our tools while offline after the initial processing engine has loaded."
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Privacy;
