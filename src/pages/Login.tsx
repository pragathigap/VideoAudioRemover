import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 3 && password.trim().length > 3;

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error) return err.message;
    if (typeof err === 'object' && err && 'message' in err) {
      const message = (err as { message?: unknown }).message;
      if (typeof message === 'string') return message;
    }
    return fallback;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Navigate to dashboard on success
      onNavigate('dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (googleError) throw googleError;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Google login failed'));
    }
  };

  return (
    <main className="login-page-v2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card-v2"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Log In</h1>
          <p className="text-text-muted text-sm">Welcome back to Remove Audio from Video</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.177 0 7.548 0 9s.347 2.823.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-divider">
          <span>or log in with email</span>
        </div>

        <form className="tool-form" onSubmit={handleLogin}>
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </label>

          <button type="submit" className="btn-primary w-full justify-center py-4 mt-2" disabled={!canSubmit || loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="login-action-btn"
              onClick={() => onNavigate('signup')}
            >
              <User size={16} /> Sign Up
            </button>
            <button
              type="button"
              className="login-action-btn"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft size={16} /> Home
            </button>
          </div>
        </div>


      </motion.div>
    </main>
  );
};

export default Login;
