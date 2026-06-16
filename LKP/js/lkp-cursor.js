(function () {
  'use strict';

  const STORAGE_KEY = 'lkp_cursor_theme_v1';
  const THEMES = [
    { id: 'default', label: 'Classic Pointer' },
    { id: 'wayfinder', label: 'Wayfinder Compass' },
    { id: 'star', label: 'Star Core' },
    { id: 'ocean', label: 'Ocean Pulse' },
    { id: 'ember', label: 'Ember Glow' },
    { id: 'leaf', label: 'Greenstone Leaf' }
  ];

  const supportsFinePointer = () =>
    window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function normalizeTheme(theme) {
    return THEMES.some(item => item.id === theme) ? theme : 'wayfinder';
  }

  function ensureCursor() {
    if (document.querySelector('.lkp-custom-cursor')) return;

    const cursor = document.createElement('div');
    cursor.className = 'lkp-custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="lkp-custom-cursor__ring"></span><span class="lkp-custom-cursor__core"></span>';
    document.body.appendChild(cursor);
  }

  function getTheme() {
    return normalizeTheme(localStorage.getItem(STORAGE_KEY) || 'wayfinder');
  }

  function setTheme(theme, options = {}) {
    const nextTheme = normalizeTheme(theme);

    localStorage.setItem(STORAGE_KEY, nextTheme);
    document.body.dataset.lkpCursorTheme = nextTheme;
    document.body.classList.toggle('lkp-cursor-enabled', nextTheme !== 'default');

    if (nextTheme !== 'default') {
      ensureCursor();
    } else {
      document.body.classList.remove('lkp-cursor-visible', 'lkp-cursor-active');
    }

    if (!options.silent) {
      window.dispatchEvent(new CustomEvent('lkp:cursor-theme-changed', {
        detail: { theme: nextTheme }
      }));
    }

    return nextTheme;
  }

  function bindPointer() {
    if (!supportsFinePointer()) return;

    document.addEventListener('pointermove', event => {
      if (document.body.dataset.lkpCursorTheme === 'default') return;

      document.body.style.setProperty('--lkp-cursor-x', `${event.clientX}px`);
      document.body.style.setProperty('--lkp-cursor-y', `${event.clientY}px`);
      document.body.classList.add('lkp-cursor-visible');
    }, { passive: true });

    document.addEventListener('pointerdown', () => {
      if (document.body.dataset.lkpCursorTheme !== 'default') {
        document.body.classList.add('lkp-cursor-active');
      }
    }, { passive: true });

    document.addEventListener('pointerup', () => {
      document.body.classList.remove('lkp-cursor-active');
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      document.body.classList.remove('lkp-cursor-visible', 'lkp-cursor-active');
    }, { passive: true });
  }

  function init() {
    if (!document.body) return;

    if (!supportsFinePointer()) return;

    setTheme(getTheme(), { silent: true });
    bindPointer();
  }

  window.LKPCursor = {
    themes: THEMES.slice(),
    getTheme,
    setTheme
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
