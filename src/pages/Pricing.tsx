import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  badge?: string;
  recommended?: boolean;
  originalPrice?: string;
}

const PricingCard = ({ title, price, period, features, buttonText, badge, recommended, originalPrice }: PricingCardProps) => (
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
        >
          <span className="pricing-btn-content">
            {recommended ? <Zap size={14} fill="currentColor" /> : <ShieldCheck size={14} />}
            {buttonText}
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

const Pricing: React.FC = () => {
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
    </div>
  );
};

export default Pricing;
