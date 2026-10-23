// Sporty confirm dialogs and toasts for the admin panel.
// Framework-free (plain DOM) so it can be called from components, API
// interceptors or anywhere else, and replaces SweetAlert across the panel.
//
//   notify.success(title, text)          toast
//   notify.loading(title, text)          toast handle → .update({ type: 'success', ... })
//   await confirmDialog({ title, ... })  → true / false
//   await confirmDelete({ title, item }) → true / false (hold-to-confirm)
//   notify.fire({ ...sweetalertOptions }) SweetAlert-compatible bridge
import './notify.scss';
import { t } from '../../i18n';

/* ===================== Icons (lucide) ===================== */
const ICONS = {
  dumbbell: '<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/>',
  trash: '<g class="ra-lid"><path d="M3 6h18"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></g><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  check: '<path class="ra-draw" d="M20 6 9 17l-5-5"/>',
  x: '<path class="ra-draw" d="M18 6 6 18"/><path class="ra-draw" d="m6 6 12 12"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v1"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
};

const svg = (name, size = 24, strokeWidth = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.bell}</svg>`;

const esc = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Parses without executing scripts or loading images
const htmlToText = (html = '') =>
  new DOMParser()
    .parseFromString(String(html).replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>\s*<p[^>]*>/gi, '\n'), 'text/html')
    .body.textContent.trim();

const ECG_PATH = 'M0,22 H120 L132,22 L140,8 L150,34 L160,3 L170,30 L178,22 H250 L258,15 L266,22 H400';

/* ===================== Dialog ===================== */

/**
 * Sporty confirm dialog.
 *
 * @param {Object} options
 * @param {'confirm'|'warning'|'delete'} [options.variant]
 * @param {string} [options.icon]        dumbbell | trash | logout | zap | bell
 * @param {string} options.title
 * @param {string} [options.text]
 * @param {string} [options.item]        name shown in a chip (flies into the bin on delete)
 * @param {boolean} [options.hold]       hold-to-confirm (default for delete)
 * @param {Function} [options.onConfirm] async work to run with a loading button before closing
 * @returns {Promise<boolean>}
 */
export function confirmDialog({
  variant = 'confirm',
  icon,
  title = '',
  text = '',
  item,
  confirmText = t('تأكيد'),
  cancelText = t('إلغاء'),
  hold = variant === 'delete',
  onConfirm,
} = {}) {
  const iconName = icon || { delete: 'trash', warning: 'zap' }[variant] || 'dumbbell';

  return new Promise((resolve) => {
    const lastFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'ra-overlay';
    overlay.innerHTML = `
      <div class="ra-modal ra-modal--${variant}" role="dialog" aria-modal="true" aria-labelledby="ra-title" aria-describedby="ra-text">
        <svg class="ra-ecg" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
          <path class="ra-ecg__base" d="${ECG_PATH}"/><path class="ra-ecg__beat" d="${ECG_PATH}" pathLength="1000"/>
        </svg>
        <div class="ra-badge"><span class="ra-pulse"></span><span class="ra-pulse"></span><div class="ra-badge__icon">${svg(iconName, 34)}</div></div>
        <h3 id="ra-title">${esc(title)}</h3>
        ${text ? `<p id="ra-text">${esc(text)}</p>` : ''}
        ${item ? `<div class="ra-chip">${svg('dumbbell', 16)}<span>${esc(item)}</span></div>` : ''}
        <div class="ra-actions">
          <button type="button" class="ra-btn ${hold ? 'ra-btn--hold' : 'ra-btn--primary'}" data-confirm>
            <span class="ra-btn__label">${hold ? svg('hand', 18) : ''}${esc(confirmText)}</span>
            ${hold ? `<span class="ra-btn__label ra-btn__label--fill" aria-hidden="true">${svg('hand', 18)}${esc(confirmText)}</span>` : ''}
            <span class="ra-spin"></span>
          </button>
          <button type="button" class="ra-btn ra-btn--ghost" data-cancel>${esc(cancelText)}</button>
        </div>
        ${hold ? `<p class="ra-hint">${svg('hand', 14)} ${esc(t('اضغط مع الاستمرار للتأكيد — مثل آخر عدّة 💪'))}</p>` : ''}
      </div>`;
    document.body.appendChild(overlay);

    const modal = overlay.querySelector('.ra-modal');
    const confirmBtn = overlay.querySelector('[data-confirm]');
    const cancelBtn = overlay.querySelector('[data-cancel]');
    let busy = false;
    let closed = false;

    const close = (result) => {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.remove();
        lastFocus?.focus?.();
      }, 220);
      resolve(result);
    };

    function onKey(e) {
      if (e.key === 'Escape' && !busy) {
        e.stopPropagation();
        close(false);
      }
      if (e.key === 'Tab') {
        // keep focus inside the dialog
        e.preventDefault();
        (document.activeElement === confirmBtn ? cancelBtn : confirmBtn).focus();
      }
    }
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay && !busy) close(false);
    });
    cancelBtn.addEventListener('click', () => {
      if (!busy) close(false);
    });

    const run = async () => {
      if (!onConfirm) {
        close(true);
        return;
      }
      busy = true;
      confirmBtn.disabled = true;
      cancelBtn.disabled = true;
      confirmBtn.classList.add('is-loading');
      try {
        await onConfirm();
        close(true);
      } catch (err) {
        busy = false;
        confirmBtn.disabled = false;
        cancelBtn.disabled = false;
        confirmBtn.classList.remove('is-loading');
        notify.error(t('حدث خطأ'), err?.response?.data?.message || err?.message || t('حاول مرة أخرى'));
      }
    };

    if (hold) {
      setupHold(confirmBtn, modal, async () => {
        await flyIntoBin(modal);
        run();
      });
      setTimeout(() => cancelBtn.focus(), 60); // safer default for destructive actions
    } else {
      confirmBtn.addEventListener('click', run);
      setTimeout(() => confirmBtn.focus(), 60);
    }
  });
}

/** Delete confirmation: red, hold-to-confirm, item flies into the bin. */
export const confirmDelete = (options = {}) =>
  confirmDialog({ confirmText: t('نعم، احذف'), ...options, variant: 'delete', hold: true });

function setupHold(btn, modal, onDone) {
  const DURATION = 1000;
  const hint = modal.querySelector('.ra-hint');
  let raf = null;
  let t0 = 0;
  let progress = 0;
  let done = false;
  let holding = false;

  const set = (value) => {
    progress = value;
    modal.style.setProperty('--p', value.toFixed(3));
    modal.style.setProperty('--lid', value.toFixed(3));
  };

  const frame = (ts) => {
    if (!t0) t0 = ts;
    set(Math.min((ts - t0) / DURATION, 1));
    if (progress < 1) {
      raf = requestAnimationFrame(frame);
      return;
    }
    done = true;
    holding = false;
    btn.classList.remove('holding');
    navigator.vibrate?.(30);
    onDone();
  };

  const start = (e) => {
    if (done || btn.disabled || holding) return;
    if (e.type === 'keydown') {
      if (!(e.key === ' ' || e.key === 'Enter') || e.repeat) return;
      e.preventDefault();
    }
    holding = true;
    modal.classList.remove('releasing');
    btn.classList.add('holding');
    t0 = 0;
    raf = requestAnimationFrame(frame);
  };

  const stop = (e) => {
    if (done || !holding) return;
    if (e.type === 'keyup' && !(e.key === ' ' || e.key === 'Enter')) return;
    holding = false;
    cancelAnimationFrame(raf);
    btn.classList.remove('holding');
    if (progress < 0.35 && hint) {
      // a quick tap: remind them to keep pressing
      hint.classList.remove('nudge');
      void hint.offsetWidth;
      hint.classList.add('nudge');
    }
    modal.classList.add('releasing');
    set(0);
  };

  btn.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
  btn.addEventListener('keydown', start);
  btn.addEventListener('keyup', stop);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

function flyIntoBin(modal) {
  return new Promise((resolve) => {
    const chip = modal.querySelector('.ra-chip');
    const badge = modal.querySelector('.ra-badge');
    const finish = () => {
      modal.classList.remove('releasing');
      modal.classList.add('lid-closing');
      modal.style.setProperty('--lid', 0);
      badge.classList.add('ra-gulp');
      setTimeout(resolve, 250);
    };
    if (!chip) {
      finish();
      return;
    }
    const a = chip.getBoundingClientRect();
    const b = badge.getBoundingClientRect();
    chip.style.setProperty('--dx', `${b.left + b.width / 2 - (a.left + a.width / 2)}px`);
    chip.style.setProperty('--dy', `${b.top + b.height / 2 - (a.top + a.height / 2)}px`);
    chip.classList.add('ra-chip--fly');
    setTimeout(finish, 520);
  });
}

/* ===================== Toasts ===================== */
const TYPE_ICON = { success: 'check', error: 'x', warning: 'zap', info: 'bell' };
const DEFAULT_TITLE = {
  success: () => t('تم بنجاح'),
  error: () => t('حدث خطأ'),
  warning: () => t('تنبيه'),
  info: () => t('معلومة'),
  loading: () => t('جاري التحميل...'),
};
const MAX_TOASTS = 4;
const live = new Map(); // dedupe key → handle
let lastErrorAt = 0;

const getStack = () => {
  let stack = document.querySelector('.ra-toasts');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'ra-toasts';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  return stack;
};

/**
 * Show a toast.
 *
 * @param {Object} options
 * @param {'success'|'error'|'warning'|'info'|'loading'} [options.type]
 * @param {string} [options.title]
 * @param {string} [options.text]
 * @param {number} [options.duration]   ms (0 = stay until closed)
 * @param {number} [options.countdown]  seconds, shows a countdown ring instead of the icon
 * @param {Function} [options.onCountdownEnd]
 * @returns {{ update: Function, close: Function }}
 */
export function toast(options = {}) {
  let state = { type: 'success', ...options };
  state.title = state.title || DEFAULT_TITLE[state.type]?.() || '';
  if (state.duration === undefined) state.duration = state.type === 'error' ? 6000 : 4500;

  // Same message already on screen: replay it instead of stacking a copy
  const key = `${state.type}|${state.title}|${state.text || ''}`;
  if (state.type !== 'loading' && !state.countdown && live.has(key)) {
    const existing = live.get(key);
    existing.update({});
    return existing;
  }

  if (state.type === 'error') lastErrorAt = Date.now();

  const el = document.createElement('div');
  let timerId = null;
  let entered = false; // after the slide-in, updates must not replay it
  let currentKey = key;

  const iconHtml = () => {
    if (state.type === 'loading') {
      return '<svg class="ra-loader" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/></svg>';
    }
    if (state.countdown) {
      return `<div class="ra-count" style="--cd:${state.countdown}s"><svg viewBox="0 0 34 34"><circle class="track" cx="17" cy="17" r="14"/><circle class="bar" cx="17" cy="17" r="14"/></svg><b>${state.countdown}</b></div>`;
    }
    const burst = state.type === 'success'
      ? `<span class="ra-burst">${Array.from({ length: 8 }, (_, i) => `<span style="--a:${i * 45}deg"></span>`).join('')}</span>`
      : '';
    return svg(TYPE_ICON[state.type], 22, 2.5) + burst;
  };

  const render = () => {
    el.className = `ra-toast ra-toast--${state.type}${entered ? ' entered' : ''}`;
    el.setAttribute('role', state.type === 'error' ? 'alert' : 'status');
    const timed = state.type !== 'loading' && !state.countdown && state.duration > 0;
    el.innerHTML = `
      <div class="ra-toast__icon">${iconHtml()}</div>
      <div class="ra-toast__body"><strong>${esc(state.title)}</strong>${state.text ? `<p>${esc(state.text)}</p>` : ''}</div>
      <button type="button" class="ra-toast__close" aria-label="${esc(t('إغلاق'))}">${svg('close', 16)}</button>
      ${timed ? `<div class="ra-toast__timer" style="--dur:${state.duration}ms"><span></span></div>` : ''}`;
    el.querySelector('.ra-toast__close').addEventListener('click', dismiss);
    el.querySelector('.ra-toast__timer span')?.addEventListener('animationend', dismiss);

    clearInterval(timerId);
    if (state.countdown) {
      let left = state.countdown;
      const label = el.querySelector('.ra-count b');
      timerId = setInterval(() => {
        left -= 1;
        if (left > 0) {
          label.textContent = left;
          return;
        }
        clearInterval(timerId);
        state.onCountdownEnd?.(handle);
      }, 1000);
    }
  };

  function dismiss() {
    if (el.dataset.leaving) return;
    el.dataset.leaving = '1';
    clearInterval(timerId);
    if (live.get(currentKey) === handle) live.delete(currentKey);
    el.classList.add('leaving');
    setTimeout(() => {
      el.style.height = `${el.offsetHeight}px`;
      void el.offsetHeight;
      el.classList.add('collapse');
      setTimeout(() => el.remove(), 260);
    }, 240);
  }

  const handle = {
    update(next = {}) {
      if (el.dataset.leaving) return;
      state = { ...state, countdown: 0, ...next };
      if (next.type && !next.title) state.title = DEFAULT_TITLE[next.type]?.() || state.title;
      if (next.type && next.duration === undefined) state.duration = next.type === 'error' ? 6000 : 4500;
      if (state.type === 'error') lastErrorAt = Date.now();
      if (live.get(currentKey) === handle) live.delete(currentKey);
      currentKey = `${state.type}|${state.title}|${state.text || ''}`;
      if (state.type !== 'loading' && !state.countdown) live.set(currentKey, handle);
      render();
      el.classList.add('ra-bumped');
      setTimeout(() => el.classList.remove('ra-bumped'), 400);
    },
    close: dismiss,
  };

  render();
  const stack = getStack();
  stack.prepend(el);
  if (state.type !== 'loading' && !state.countdown) live.set(key, handle);
  setTimeout(() => {
    entered = true;
    if (!el.dataset.leaving) el.classList.add('entered');
  }, 1000);

  [...stack.children]
    .filter((node) => !node.dataset.leaving)
    .slice(MAX_TOASTS)
    .forEach((node) => node.querySelector('.ra-toast__close')?.click());

  return handle;
}

/**
 * Show a generic error unless the page shows its own error toast within the
 * next moment (used by the API client so failures are never silent, without
 * doubling up messages the page already handles).
 */
export function fallbackError(title, text) {
  const scheduledAt = Date.now();
  setTimeout(() => {
    if (lastErrorAt >= scheduledAt) return;
    toast({ type: 'error', title, text });
  }, 400);
}

/* ===================== SweetAlert-compatible bridge ===================== */
const DELETE_RE = /حذف|احذف|delete|remove/i;
const LOGOUT_RE = /خروج|log ?out|sign ?out/i;

/**
 * Accepts the SweetAlert options used across the panel and renders them with
 * the new design: dialogs with a cancel button become confirm dialogs
 * (hold-to-confirm for deletes), everything else becomes a toast.
 * Resolves like SweetAlert: { isConfirmed, isDismissed, isDenied, value }.
 */
export function fire(options = {}, legacyText, legacyIcon) {
  const opts = typeof options === 'string' ? { title: options, text: legacyText, icon: legacyIcon } : options;
  const { title = '', icon, showCancelButton, confirmButtonText, cancelButtonText, timer } = opts;
  let text = opts.text || '';
  let item;

  if (opts.html) {
    const strong = String(opts.html).match(/<strong>([\s\S]*?)<\/strong>/i);
    if (strong) item = htmlToText(strong[1]);
    text = htmlToText(opts.html);
  }

  if (showCancelButton) {
    const haystack = `${title} ${text} ${confirmButtonText || ''}`;
    const isDelete = DELETE_RE.test(haystack);
    const isLogout = !isDelete && LOGOUT_RE.test(haystack);
    const variant = isDelete ? 'delete' : isLogout || icon === 'warning' ? 'warning' : 'confirm';

    return confirmDialog({
      variant,
      icon: isLogout ? 'logout' : undefined,
      title,
      text,
      item,
      ...(confirmButtonText && { confirmText: confirmButtonText }),
      ...(cancelButtonText && { cancelText: cancelButtonText }),
    }).then((ok) => ({ isConfirmed: ok, isDismissed: !ok, isDenied: false, value: ok || undefined }));
  }

  const type = { success: 'success', error: 'error', warning: 'warning' }[icon] || 'info';
  toast({
    type,
    title: title || undefined,
    text,
    ...(timer && { duration: Math.max(timer, 2000) }),
  });
  return Promise.resolve({ isConfirmed: true, isDismissed: false, isDenied: false, value: true });
}

/** SweetAlert-style mixin: preset options for repeated calls. */
export const mixin = (defaults = {}) => ({
  fire: (options = {}, ...rest) =>
    fire(typeof options === 'string' ? { ...defaults, title: options, text: rest[0], icon: rest[1] } : { ...defaults, ...options }),
});

/* ===================== Public API ===================== */
export const notify = {
  success: (title, text, options) => toast({ ...options, type: 'success', title, text }),
  error: (title, text, options) => toast({ ...options, type: 'error', title, text }),
  warning: (title, text, options) => toast({ ...options, type: 'warning', title, text }),
  info: (title, text, options) => toast({ ...options, type: 'info', title, text }),
  loading: (title, text) => toast({ type: 'loading', title, text }),
  toast,
  confirm: confirmDialog,
  confirmDelete,
  fire,
  mixin,
  // Toasts already pause on hover; kept for SweetAlert-style call sites
  stopTimer: () => {},
  resumeTimer: () => {},
};

export default notify;
