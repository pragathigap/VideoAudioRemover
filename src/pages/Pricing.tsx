import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, CheckCircle2, Sparkles, X, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  notes?: Record<string, string>;
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

interface RazorpayResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}
interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  onClick?: () => void;
  loading?: boolean;
  badge?: string;
  recommended?: boolean;
  originalPrice?: string;
}

const PricingCard = ({ title, price, period, features, buttonText, onClick, loading, badge, recommended, originalPrice }: PricingCardProps) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.015 }}
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`pricing-card ${recommended ? 'pricing-card--recommended' : ''}`}
  >
    <div className="pricing-card-border" />
    <div className="pricing-card-body">
      {badge && (
        <div className="pricing-badge">
          <Sparkles size={10} fill="white" />
          <span>{badge}</span>
        </div>
      )}

      <div className="pricing-top">
        <h3 className={`pricing-eyebrow ${recommended ? 'pricing-eyebrow--recommended' : ''}`}>{title}</h3>
        <div className="pricing-price-row">
          {originalPrice && (
            <span className="pricing-original-price">${originalPrice}</span>
          )}
          <span className="pricing-dollar">$</span>
          <span className="pricing-price gradient-text">{price}</span>
        </div>
        <p className="pricing-period">{period}</p>
      </div>

      <div className="pricing-divider" />

      <ul className="pricing-features">
        {features.map((feature) => (
          <li key={feature} className="pricing-feature">
            <span className={`pricing-feature-icon ${recommended ? 'pricing-feature-icon--recommended' : ''}`}>
              <Check size={13} strokeWidth={3.5} className="text-white" />
            </span>
            <span className="pricing-feature-text">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pricing-cta">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className={`pricing-btn ${recommended ? 'pricing-btn--recommended' : 'pricing-btn--standard'}`}
          onClick={onClick}
          disabled={loading}
        >
          <span className="pricing-btn-content">
            {recommended ? <Zap size={14} fill="currentColor" /> : <ShieldCheck size={14} />}
            {loading ? 'Loading…' : buttonText}
          </span>
        </motion.button>

        <div className="pricing-trust">
          <span className="pricing-trust-dot" />
          <span>Secure Local Processing</span>
          <span className="pricing-trust-dot" />
        </div>
      </div>
    </div>
  </motion.div>
);

interface PricingProps {
  onNavigate: (page: string) => void;
}

type UiModalVariant = 'success' | 'error' | 'info';

type UiModalState = {
  variant: UiModalVariant;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [uiModal, setUiModal] = useState<UiModalState | null>(null);

  React.useEffect(() => {
    if (uiModal?.variant === 'success') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#6366f1']
      });
    }
  }, [uiModal]);

  const razorpayKeyId = useMemo(() => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    return typeof key === 'string' ? key : '';
  }, []);

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error) return err.message;
    if (typeof err === 'object' && err && 'message' in err) {
      const message = (err as { message?: unknown }).message;
      if (typeof message === 'string') return message;
    }
    return fallback;
  };

  const openModal = (state: UiModalState) => setUiModal(state);

  const closeModal = () => setUiModal(null);

  const sendPaymentEmail = async (email: string, payload: { plan: string; amount: number; paymentId: string; expiryDate: string }) => {
    if (!supabase || !email) return false;

    const redirectTo = `${window.location.origin}/dashboard?payment=success&plan=${encodeURIComponent(payload.plan)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
        data: {
          plan: payload.plan,
          amount: String(payload.amount / 100),
          payment_id: payload.paymentId,
          expiry_date: payload.expiryDate,
        },
      },
    });

    if (!error) return true;

    try {
      const { error: retryError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: false,
        },
      });
      return !retryError;
    } catch {
      return false;
    }
  };

  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('Window not available'));
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve();

      const existing = document.querySelector('script[data-razorpay-checkout="true"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.dataset.razorpayCheckout = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.body.appendChild(script);
    });

  const openCheckout = async (planName: string, displayPrice: string) => {
    // Check if user is logged in
    if (!supabase) {
      openModal({
        variant: 'error',
        title: 'Authentication Error',
        message: 'Please try again.',
      });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onNavigate('login');
      return;
    }

    if (!razorpayKeyId) {
      openModal({
        variant: 'error',
        title: 'Payment Setup Error',
        message: 'Razorpay is not configured.',
      });
      return;
    }

    setPayingPlan(planName);
    try {
      await loadRazorpayScript();

      const priceNumber = Number(displayPrice);
      const amount = Number.isFinite(priceNumber) ? Math.round(priceNumber * 100) : 0;
      if (!amount) {
        openModal({
          variant: 'error',
          title: 'Payment Error',
          message: 'Invalid amount.',
        });
        return;
      }

      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) {
        openModal({
          variant: 'error',
          title: 'Payment Error',
          message: 'Razorpay failed to initialize.',
        });
        return;
      }

      const instance = new RazorpayCtor({
        key: razorpayKeyId,
        amount,
        currency: 'INR',
        name: 'Remove Audio from Video',
        description: planName,
        prefill: {
          email: user?.email || '',
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
        },
        notes: {
          plan: planName,
        },
        handler: async (response: RazorpayResponse) => {
          const showSuccess = (emailSent: boolean) => {
            openModal({
              variant: 'success',
              title: 'Payment Successful',
              message: emailSent
                ? 'Your subscription is active. A confirmation email has been sent to your inbox.'
                : 'Your subscription is active. If you do not receive a confirmation email, please check spam/promotions.',
              actionLabel: 'Go to Dashboard',
              onAction: () => {
                closeModal();
                onNavigate('dashboard');
              },
            });
          };

          try {
            if (!supabase) throw new Error('Supabase client not initialized');
            
            // Calculate expiry date
            const now = new Date();
            const expiresAt = new Date();
            if (planName.toLowerCase().includes('annual')) {
              expiresAt.setFullYear(now.getFullYear() + 1);
            } else {
              expiresAt.setMonth(now.getMonth() + 1);
            }

            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not found');

            // 2. Update all user metadata in ONE call
            const { error: metaError } = await supabase.auth.updateUser({
              data: { 
                is_premium: true,
                premium_plan: planName,
                premium_expires_at: expiresAt.toISOString(),
                last_payment_id: response.razorpay_payment_id,
                last_plan_name: planName,
                last_payment_date: new Date().toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              }
            });
            if (metaError) throw metaError;

            // 3. Record the subscription in the database
            await supabase.from('subscriptions').insert({
              user_id: user.id,
              name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown User',
              plan_name: planName,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              amount: amount / 100,
              status: 'active',
              payment_status: 'paid',
              expires_at: expiresAt.toISOString()
            });

            // 4. Send payment confirmation email using Supabase Magic Link template
            const emailSent = await sendPaymentEmail(user.email || '', {
              plan: planName,
              amount,
              paymentId: response.razorpay_payment_id || '',
              expiryDate: expiresAt.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),
            });
            showSuccess(emailSent);

          } catch (err: unknown) {
            openModal({
              variant: 'error',
              title: 'Payment Processing Error',
              message: getErrorMessage(err, 'There was an error updating your account. Please contact support.'),
            });
          } finally {
            setPayingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPayingPlan(null);
          },
        },
      });

      instance.open();
    } catch (e: unknown) {
      openModal({
        variant: 'error',
        title: 'Payment Error',
        message: getErrorMessage(e, 'Unable to start Razorpay checkout.'),
      });
    } finally {
      setPayingPlan(null);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-bg" />
      <div className="pricing-wrap">
        <header className="pricing-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pricing-pill-wrap"
          >
            <span className="pricing-pill">
              Upgrade your workflow
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pricing-title"
          >
            Choose your <span className="gradient-text">plan</span>
          </motion.h1>
          <p className="pricing-subtitle">
            No ads, faster processing, and premium features for creators who ship.
          </p>
        </header>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PricingCard
            title="Free Forever"
            price="0"
            period="Personal use"
            buttonText="Get Started"
            onClick={() => window.location.href = '/'}
            features={[
              "50MB Max File Size",
              "2 min Max Video Duration",
              "3 Exports per day",
              "MP4 Format Only",
              "Browser-Based Processing",
              "Standard Support"
            ]}
          />
          <PricingCard
            title="Monthly"
            price="4.99"
            period="Billed Monthly"
            buttonText="Start Monthly Pro"
            onClick={() => openCheckout('Monthly Pro', '4.99')}
            loading={payingPlan === 'Monthly Pro'}
            features={[
              "500MB Max File Size",
              "Unlimited Video Length",
              "Unlimited Exports per day",
              "1080p / Original Quality",
              "Priority Processing",
              "All Formats (MOV, AVI, WebM)",
              "No Advertisements"
            ]}
          />
          <PricingCard
            title="Annual"
            price="39.99"
            originalPrice="59.88"
            period="Billed yearly • Save 33%"
            badge="Best Value"
            recommended={true}
            buttonText="Unlock Annual Elite"
            onClick={() => openCheckout('Annual Elite', '39.99')}
            loading={payingPlan === 'Annual Elite'}
            features={[
              "Everything in Monthly",
              "Priority Support",
              "Early Access to AI Tools",
              "Bulk Processing Actions",
              "Multi-Device Sync",
              "Advanced Export Options"
            ]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pricing-footer"
        >
          <div className="pricing-footer-row">
            {['PRIVATE', 'STABLE', 'FAST', 'POWERFUL'].map((l) => (
              <span key={l} className="pricing-footer-chip">{l}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {uiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl p-10 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-text-muted hover:text-text-main hover:bg-gray-100 transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-5">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-50 mb-2"
                >
                  {uiModal.variant === 'success' && <CheckCircle2 size={64} className="text-emerald-500" />}
                  {uiModal.variant === 'error' && <AlertCircle size={64} className="text-red-500" />}
                  {uiModal.variant === 'info' && <ShieldCheck size={64} className="text-primary" />}
                </motion.div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">{uiModal.title}</h3>
                  <p className="text-text-muted leading-relaxed px-2">{uiModal.message}</p>
                </div>

                {uiModal.actionLabel && uiModal.onAction && (
                  <button
                    type="button"
                    onClick={uiModal.onAction}
                    className="w-full btn-primary justify-center py-4 text-lg bg-success hover:bg-emerald-600 border-none shadow-lg shadow-emerald-100"
                  >
                    {uiModal.actionLabel}
                  </button>
                )}

                {!uiModal.actionLabel && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full btn-secondary justify-center py-4 text-lg"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;
