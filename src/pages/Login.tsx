import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim().length > 3 && password.trim().length > 3;

  return (
    <main className="max-w-4xl mx-auto px-6">
      <header className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome <span className="gradient-text">Back</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-lg"
        >
          Log in to manage your plan and access premium tools.
        </motion.p>
      </header>

      <section className="glass-effect rounded-3xl p-8 mb-8">
        <div className="login-grid">
          <div className="login-aside">
            <div className="login-aside-card">
              <h3 className="text-2xl font-bold mb-4">Pro perks</h3>
              <div className="space-y-4">
                {[
                  'No ads and faster workflows',
                  'Batch processing for heavy jobs',
                  'Priority access to new tools',
                  'Commercial-friendly usage',
                ].map((t) => (
                  <div key={t} className="login-perk">
                    <div className="login-perk-dot" />
                    <span className="text-sm text-text-muted">{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button type="button" className="btn-secondary w-full justify-center py-4 text-lg" onClick={() => onNavigate('pricing')}>
                  View Pricing
                </button>
              </div>
            </div>
          </div>

          <div className="login-form glass-effect rounded-2xl p-6">
            <div className="login-top">
              <button type="button" className="nav-item" onClick={() => onNavigate('home')}>
                <span className="flex items-center gap-2">
                  <ArrowLeft size={16} /> Back
                </span>
              </button>
              <div className="login-badge">Demo UI</div>
            </div>

            <div className="tool-form">
              <label className="tool-label">
                Email
                <div className="tool-input-with-icon">
                  <Mail size={16} className="text-text-muted" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tool-input tool-input-plain"
                    inputMode="email"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="tool-label">
                Password
                <div className="tool-input-with-icon">
                  <Lock size={16} className="text-text-muted" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="tool-input tool-input-plain"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button type="button" className="btn-primary w-full justify-center py-4 text-lg" disabled={!canSubmit}>
                Log In
              </button>

              <div className="login-helper">
                This login screen is UI-only. Wire it to your auth provider when ready.
              </div>

              <button type="button" className="btn-secondary w-full justify-center py-4 text-lg" onClick={() => onNavigate('home')}>
                Continue Without Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
