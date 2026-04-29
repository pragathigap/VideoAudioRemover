import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 mb-24">
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <MessageSquare size={12} />
          <span>Need Help?</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Get in <span className="gradient-text">Touch</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-lg max-w-xl mx-auto"
        >
          Have a question or feedback? We're here to help you get the most out of our tools.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect p-8 rounded-3xl border border-glass-border flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="text-indigo-400" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Email Us</h3>
          <p className="text-text-muted mb-6 text-sm">Our support team typically responds within 24-48 hours.</p>
          <a 
            href="mailto:support@vidaudio.tools" 
            className="text-primary font-bold text-lg hover:underline transition-all"
          >
            support@vidaudio.tools
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect p-8 rounded-3xl border border-glass-border"
        >
          <h3 className="text-xl font-bold mb-6">Why Reach Out?</h3>
          <ul className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Privacy or Security questions" },
              { icon: MessageSquare, text: "Feature requests & feedback" },
              { icon: Clock, text: "Technical support & bug reports" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/5 rounded-xl flex items-center justify-center border border-indigo-500/10">
                  <item.icon className="text-indigo-400" size={18} />
                </div>
                <span className="text-text-muted font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center p-8 rounded-3xl border border-dashed border-glass-border"
      >
        <p className="text-text-muted text-sm italic">
          "The best way to predict the future is to invent it. Your feedback helps us shape the next version of Remove Audio from Video."
        </p>
      </motion.div>
    </main>
  );
};

export default Contact;
