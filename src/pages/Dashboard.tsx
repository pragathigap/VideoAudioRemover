import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Crown, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNavigate('login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, [onNavigate]);

  const handleLogout = async () => {
    if (!supabase) {
      onNavigate('login');
      return;
    }
    await supabase.auth.signOut();
    onNavigate('login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <main className="dashboard-content min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-3xl p-6 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden text-center"
            style={{ background: 'rgba(255, 255, 255, 0.9)' }}
          >
            <h1 className="text-3xl font-bold mb-2 text-text-main">Auth not configured</h1>
            <p className="text-text-muted mb-8">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable dashboard.</p>
            <button
              type="button"
              onClick={() => onNavigate('')}
              className="btn-primary justify-center py-3 px-8"
            >
              Back to Tools
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <main className="dashboard-content min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-6 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.9)' }}
        >
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-[100px] opacity-10 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
            {/* Profile Avatar Section */}
            <div className="flex-shrink-0">
              <div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-xl border-4 border-white"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
              >
                {initial}
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-text-main">Hi {fullName}!</h1>
                <p className="text-text-muted text-lg">Manage your account and subscriptions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-text-main font-semibold">
                    <Crown size={20} className="text-amber-500" />
                    <span>Account Status</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-muted text-sm">Premium account:</span>
                    {!user?.user_metadata?.is_premium && (
                      <button 
                        onClick={() => onNavigate('pricing')}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        style={{ backgroundColor: '#3b82f6' }}
                      >
                        Buy Premium
                      </button>
                    )}
                    {user?.user_metadata?.is_premium && (
                      <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                        <ShieldCheck size={14} />
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Active subscription:</span>
                    <span className="font-medium text-sm">
                      {user?.user_metadata?.is_premium ? 'Pro Plan' : 'Free Plan'}
                    </span>
                  </div>

                   <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Subscription ends:</span>
                    <span className="font-medium text-sm">
                      {user?.user_metadata?.premium_expires_at 
                        ? new Date(user.user_metadata.premium_expires_at).toLocaleDateString() 
                        : '-'}
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
                   <div className="flex items-center gap-3 text-text-main font-semibold">
                    <ShieldCheck size={20} className="text-green-500" />
                    <span>Personal Details</span>
                  </div>
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-2 text-text-muted shrink-0">
                        <UserIcon size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Name</span>
                      </div>
                      <div className="text-text-main font-semibold text-sm text-right">{fullName}</div>
                    </div>
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-2 text-text-muted shrink-0">
                        <Mail size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Email</span>
                      </div>
                      <div className="text-text-main break-all font-semibold text-sm text-right">{user?.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                  style={{ backgroundColor: '#4b5563' }}
                >
                  <LogOut size={20} />
                  Log out
                </button>
                
                <button 
                  onClick={() => onNavigate('')}
                  className="flex items-center gap-2 bg-white text-text-main border border-gray-200 hover:border-primary hover:text-primary px-8 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                >
                  Back to Tools
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Dashboard;
