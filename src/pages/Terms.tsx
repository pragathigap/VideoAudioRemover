import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 mb-24">
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Scale size={12} />
          <span>Legal Agreement</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Terms of <span className="gradient-text">Service</span>
        </motion.h1>
        <p className="text-text-muted text-lg">Simple terms for a simple, powerful tool.</p>
      </header>

      <div className="space-y-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect p-8 rounded-3xl border border-glass-border"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-amber-400" size={18} />
            </div>
            Acceptance of Terms
          </h2>
          <p className="text-text-muted leading-relaxed">
            By using VidAudio, you agree to these terms. If you don't agree, please do not use the service. We provide these tools "as is" and "as available" for your creative and professional workflow.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect p-8 rounded-3xl border border-glass-border"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-amber-400" size={18} />
            </div>
            Acceptable Use
          </h2>
          <div className="space-y-4 text-text-muted">
            <p>While using VidAudio, you agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Attempt to reverse engineer the local processing engine.</li>
              <li>Use the tool for any illegal content processing.</li>
              <li>Automate or scrape the service in a way that creates excessive server load.</li>
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
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <FileText className="text-amber-400" size={18} />
            </div>
            Disclaimer of Warranty
          </h2>
          <p className="text-text-muted leading-relaxed mb-6">
            VidAudio is provided without warranties of any kind. Since processing happens locally, results depend on your device hardware and browser capabilities. We are not responsible for any data loss occurring on your device.
          </p>
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 text-center">
            <p className="text-sm text-text-muted italic">
              Last Updated: March 13, 2026
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Terms;
