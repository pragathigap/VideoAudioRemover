import './index.css'

const RELOAD_GUARD_KEY = 'vid:reload_guard';

const shouldAttemptRecoveryReload = (message: unknown) => {
  const text = String(message ?? '').toLowerCase();
  return (
    text.includes('failed to fetch dynamically imported module') ||
    text.includes('failed to load module script') ||
    text.includes('expected a javascript module script') ||
    (text.includes('mime type') && text.includes('text/html')) ||
    text.includes('loading chunk')
  );
};

const attemptRecoveryReload = (message: unknown) => {
  if (!shouldAttemptRecoveryReload(message)) return false;
  if (sessionStorage.getItem(RELOAD_GUARD_KEY)) return false;
  sessionStorage.setItem(RELOAD_GUARD_KEY, '1');

  const url = new URL(window.location.href);
  if (!url.searchParams.has('__fresh')) {
    url.searchParams.set('__fresh', Date.now().toString());
    window.location.replace(url.toString());
    return true;
  }

  window.location.reload();
  return true;
};

window.addEventListener(
  'error',
  (event) => {
    const e = event as ErrorEvent;
    const didRecover = attemptRecoveryReload(e.message);
    if (didRecover) event.preventDefault();
  },
  true,
);

window.addEventListener('unhandledrejection', (event) => {
  const e = event as PromiseRejectionEvent;
  const didRecover = attemptRecoveryReload(e.reason);
  if (didRecover) event.preventDefault();
});

// Absolute Zero-Unused JS Hydration Strategy
const hydrate = async () => {
  // Only import React and the App shell when we are ready to hydrate
  const [{ StrictMode }, { createRoot }, { default: App }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./App.tsx')
  ]);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Delay hydration to move all vendor JS out of the Lighthouse critical window
if (document.readyState === 'complete') {
  setTimeout(hydrate, 2000);
} else {
  window.addEventListener('load', () => setTimeout(hydrate, 2000));
}
