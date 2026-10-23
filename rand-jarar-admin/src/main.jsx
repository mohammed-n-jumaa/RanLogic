import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './assets/styles/global.scss';

// Debug logging is for development only; keep warnings and errors in production
if (import.meta.env.PROD) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

// After a new deploy the old hashed page chunks no longer exist on the server,
// so an open tab fails to load the next page. Reload once to pick up the new build.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'chunk_reload_at';
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(KEY)) || 0;
    // Guard against a reload loop if the chunk is genuinely missing
    if (Date.now() - last < 10000) return;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage unavailable: still try a single reload */
  }
  event.preventDefault();
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);