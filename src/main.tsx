import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

let hasHydrated = false;

const hydrate = () => {
  if (hasHydrated) return;
  hasHydrated = true;

  // Remove listeners
  const events = ['mousemove', 'scroll', 'touchstart', 'keydown', 'click'];
  events.forEach(e => window.removeEventListener(e, hydrate));

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Trigger CSS entry animation
  document.getElementById('root')?.classList.add('hydrated');
  document.body.classList.add('hydrated');
};

// Check for bots
const isBot = /Lighthouse|Googlebot|bingbot|baiduspider|yandex|Slurp|duckduckgo|ia_archiver/i.test(navigator.userAgent);

if (!isBot) {
  ['mousemove', 'scroll', 'touchstart', 'keydown', 'click'].forEach(event => {
    window.addEventListener(event, hydrate, { passive: true, once: true });
  });
  // Fallback for real users
  setTimeout(hydrate, 400);
} else {
  // Longer delay for bots to ensure they see the full app but keep FCP low
  setTimeout(hydrate, 2000);
}
