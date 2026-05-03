/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Wayfinder Passport
   File: LKP/js/profile.js

   Includes:
   - Supabase auth/session
   - Profile loading/saving
   - Lesson progress
   - Mana/reward UI
   - Dark/light mode
   - Time-of-day background system: dawn/day/dusk/night
   - Three.js Knowledge Galaxy
   - Realm-specific nebula colors
   - Distant galaxies, dust/gas, mini orbiting planets
   - Click-to-focus realm preview
   - Reset View / Center Sun / Open Realm chips

   FIXES:
   - Galaxy: updateGalaxyCamera now only lerps during active transitions,
     so the user can freely zoom, rotate, and pan without the camera
     fighting back every frame.
   - Lessons: added lkp:data-ready fallback so lesson data loads even if
     CULTURALVERSE_DATA isn't on window at the exact moment init() runs.

   SYNC CHANGES (6):
   1. window._lkpSupaClient exposed after createClient()
   2. bootRewards(data) always passes { supabase, userId } to LKPRewards.init()
   3. hydrateLessonsFromData() calls bootRewards() not bare LKPRewards.init()
   4. signIn()/signUp() show LKPSignOut loading spinner + welcome animation
   5. #profileSignOutBtn listener removed from bindUI() — lkp-signout.js wires it
   6. lkp_user_progress table, await LKPRewards.completeLesson(), bootRewards on auth
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     SUPABASE CONFIG
  ═══════════════════════════════════════════════════════════════════════ */

  const SUPABASE_URL =
    window.LKP_SUPABASE_URL ||
    'https://fmrjdvsqdfyaqtzwbbqi.supabase.co';

  const SUPABASE_ANON_KEY =
    window.LKP_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcmpkdnNxZGZ5YXF0endiYnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTE2MzYsImV4cCI6MjA5MTE2NzYzNn0.UKyvX02bG4cNhb7U2TK96t8XFREHYYwHJIKbPK06nqs';

  const isSupabaseConfigured =
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('PASTE_YOUR') &&
    !SUPABASE_ANON_KEY.includes('PASTE_YOUR');

  let supabaseClient = null;

  /* ═══════════════════════════════════════════════════════════════════════
     STORAGE KEYS
  ═══════════════════════════════════════════════════════════════════════ */

  const PROFILE_CACHE_KEY = 'lkp_profile_v1';
  const LEGACY_PROFILE_CACHE_KEY = 'piko_profile_v1';
  const COMPLETED_KEY = 'cv_completed';
  const MANA_KEY = 'cv_mana';
  const THEME_KEY = 'lkp_profile_theme';
  const BACKGROUND_VARIANT_KEY = 'lkp_profile_bg_variant';
  const BACKGROUND_ROTATION_MS = 90000;

  /* ═══════════════════════════════════════════════════════════════════════
     REALM DATA
  ═══════════════════════════════════════════════════════════════════════ */

  const realmDescriptions = {
    lkp:
      'The Living Knowledge Platform turns lessons into constellations, using star maps, galaxies, rewards, and shared learning paths.',
    lessons:
      'Deep Lessons is the full living library where lessons, culture modules, and constellation paths are explored.',
    admin:
      'Admin Deck is the command layer for adding, editing, publishing, and managing lessons, galaxies, cultures, modules, and sources.',
    ikeverse:
      'Ikeverse is the living learning world for culture, history, ancestral knowledge, and deep systems of understanding.',
    digitalverse:
      'Digitalverse is the technology learning realm: AI, blockchain, XR, Web3, cryptography, and emerging digital tools.',
    culturalverse:
      "Culturalverse is the deep cultural study layer: mo\u02bbolelo, cosmology, protocols, living traditions, and cross-cultural respect.",
    ikehub:
      'IkeHub is the gateway portal that connects every application, section, and realm in the Ikeverse ecosystem.',
    ikestar:
      'IkeStar focuses on celestial knowledge, star navigation, astronomy, and sky-based learning across traditions.',
    pikoverse:
      'Pikoverse is the wider ecosystem layer for projects, showcases, marketplace ideas, identity, and future integrations.'
  };

  const ecosystemItems = [
    {
      id: 'lkp',
      name: 'The Living Knowledge Platform',
      shortName: 'LKP',
      desc: 'Main learning hub, lesson galaxy, culture registry, rewards, and Wayfinder Passport.',
      href: 'index.html',
      color: '#f0c96a',
      secondaryColor: '#54c6ee',
      paletteName: 'Gold / Cyan',
      progressScope: 'lkp'
    },
    {
      id: 'lessons',
      name: 'Deep Lessons',
      shortName: 'Lessons',
      desc: 'The full cultural lesson library and constellation learning path.',
      href: 'lessons.html',
      color: '#54c6ee',
      secondaryColor: '#f0c96a',
      paletteName: 'Cyan / Gold',
      progressScope: 'lessons'
    },
    {
      id: 'admin',
      name: 'Admin Deck',
      shortName: 'Admin',
      desc: 'Owner/admin controls for lessons, galaxies, cultures, modules, sources, and publishing.',
      href: 'admin.html',
      color: '#ffdf8a',
      secondaryColor: '#8fa0ff',
      paletteName: 'Command Gold / Violet',
      adminOnly: true,
      progressScope: 'admin'
    },
    {
      id: 'ikehub',
      name: 'IkeHub',
      shortName: 'IkeHub',
      desc: 'The portal hub connecting every application and realm.',
      href: 'https://808cryptobeast.github.io/ikehub/',
      color: '#54c6ee',
      secondaryColor: '#8fa0ff',
      paletteName: 'Portal Cyan / Violet',
      progressScope: 'ikehub'
    },
    {
      id: 'ikeverse',
      name: 'Ikeverse',
      shortName: 'Ikeverse',
      desc: 'Ancestral knowledge, living cultures, and learning systems.',
      href: 'https://808cryptobeast.github.io/Ikeverse/',
      color: '#3cb371',
      secondaryColor: '#8fffc7',
      paletteName: 'Emerald / Jade',
      progressScope: 'ikeverse'
    },
    {
      id: 'digitalverse',
      name: 'Digitalverse',
      shortName: 'Digital',
      desc: 'AI, blockchain, Web3, XR, smart systems, and future tech.',
      href: '#digitalverse',
      color: '#8fa0ff',
      secondaryColor: '#54c6ee',
      paletteName: 'Violet / Neon Cyan',
      progressScope: 'digitalverse'
    },
    {
      id: 'culturalverse',
      name: 'Culturalverse',
      shortName: 'Culture',
      desc: "Deep cultural study, cosmology, mo\u02bbolelo, and protocols.",
      href: 'https://808cryptobeast.github.io/culturalverse/',
      color: '#d98545',
      secondaryColor: '#f0c96a',
      paletteName: 'Amber / Rust',
      progressScope: 'culturalverse'
    },
    {
      id: 'ikestar',
      name: 'IkeStar',
      shortName: 'IkeStar',
      desc: 'Celestial knowledge, astronomy, navigation, and sky lore.',
      href: 'https://808cryptobeast.github.io/Ikestar/',
      color: '#54c6ee',
      secondaryColor: '#ffffff',
      paletteName: 'Star Blue / White',
      progressScope: 'ikestar'
    },
    {
      id: 'pikoverse',
      name: 'Pikoverse',
      shortName: 'Pikoverse',
      desc: 'Wider project ecosystem, showcase, marketplace, and identity layer.',
      href: 'https://www.pikoverse.xyz',
      color: '#f0c96a',
      secondaryColor: '#ff9f43',
      paletteName: 'Gold / Orange',
      progressScope: 'pikoverse'
    }
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     TIME-OF-DAY PALETTES
  ═══════════════════════════════════════════════════════════════════════ */

  const backgroundPhasePalettes = {
    dawn: [
      {
        themeColor: '#10203d',
        sky:
          'radial-gradient(circle at 18% 18%, rgba(255, 184, 122, 0.24), transparent 28%), radial-gradient(circle at 80% 16%, rgba(115, 172, 255, 0.18), transparent 30%), linear-gradient(180deg, #08101f 0%, #132745 34%, #2a3552 66%, #120f21 100%)',
        image:
          'radial-gradient(circle at 50% 115%, rgba(255, 219, 166, 0.18), transparent 34%), radial-gradient(circle at 84% 26%, rgba(155, 112, 255, 0.11), transparent 26%)',
        stars:
          'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.88) 0 1px, transparent 1.6px), radial-gradient(circle at 72% 22%, rgba(255,255,255,0.7) 0 1.2px, transparent 1.8px), radial-gradient(circle at 58% 58%, rgba(255,255,255,0.42) 0 1px, transparent 1.6px), radial-gradient(circle at 38% 72%, rgba(255,255,255,0.5) 0 1.1px, transparent 1.7px)',
        glowOne: 'rgba(255, 173, 110, 0.24)',
        glowTwo: 'rgba(101, 171, 255, 0.18)',
        glowThree: 'rgba(178, 127, 255, 0.12)'
      },
      {
        themeColor: '#102440',
        sky:
          'radial-gradient(circle at 22% 20%, rgba(255, 196, 123, 0.22), transparent 26%), radial-gradient(circle at 77% 20%, rgba(96, 183, 255, 0.14), transparent 28%), linear-gradient(180deg, #070d1a 0%, #14253d 32%, #364f7a 68%, #161726 100%)',
        image:
          'radial-gradient(circle at 50% 110%, rgba(255, 210, 155, 0.14), transparent 32%), radial-gradient(circle at 12% 78%, rgba(126, 100, 255, 0.12), transparent 26%)',
        stars:
          'radial-gradient(circle at 26% 36%, rgba(255,255,255,0.78) 0 1px, transparent 1.6px), radial-gradient(circle at 68% 18%, rgba(255,255,255,0.62) 0 1.1px, transparent 1.7px), radial-gradient(circle at 82% 58%, rgba(255,255,255,0.34) 0 1px, transparent 1.6px), radial-gradient(circle at 44% 74%, rgba(255,255,255,0.46) 0 1.1px, transparent 1.8px)',
        glowOne: 'rgba(255, 196, 123, 0.20)',
        glowTwo: 'rgba(96, 183, 255, 0.16)',
        glowThree: 'rgba(126, 100, 255, 0.10)'
      }
    ],
    day: [
      {
        themeColor: '#0f2840',
        sky:
          'radial-gradient(circle at 18% 16%, rgba(255, 252, 226, 0.18), transparent 24%), radial-gradient(circle at 82% 14%, rgba(138, 228, 255, 0.15), transparent 28%), linear-gradient(180deg, #0b1830 0%, #16345e 30%, #376ba0 66%, #1c3457 100%)',
        image:
          'radial-gradient(circle at 48% 108%, rgba(175, 218, 255, 0.16), transparent 30%), radial-gradient(circle at 20% 78%, rgba(125, 176, 255, 0.14), transparent 24%)',
        stars:
          'radial-gradient(circle at 26% 30%, rgba(255,255,255,0.48) 0 1px, transparent 1.6px), radial-gradient(circle at 68% 26%, rgba(255,255,255,0.4) 0 1px, transparent 1.7px), radial-gradient(circle at 74% 58%, rgba(255,255,255,0.26) 0 1px, transparent 1.7px)',
        glowOne: 'rgba(120, 202, 255, 0.18)',
        glowTwo: 'rgba(255, 239, 189, 0.12)',
        glowThree: 'rgba(131, 164, 255, 0.10)'
      },
      {
        themeColor: '#13304d',
        sky:
          'radial-gradient(circle at 14% 18%, rgba(255, 248, 212, 0.14), transparent 22%), radial-gradient(circle at 84% 16%, rgba(173, 238, 255, 0.16), transparent 28%), linear-gradient(180deg, #091429 0%, #17385e 28%, #4577ab 66%, #213859 100%)',
        image:
          'radial-gradient(circle at 50% 108%, rgba(185, 226, 255, 0.14), transparent 28%), radial-gradient(circle at 80% 76%, rgba(111, 167, 255, 0.12), transparent 24%)',
        stars:
          'radial-gradient(circle at 24% 32%, rgba(255,255,255,0.4) 0 1px, transparent 1.6px), radial-gradient(circle at 70% 24%, rgba(255,255,255,0.32) 0 1px, transparent 1.7px), radial-gradient(circle at 58% 70%, rgba(255,255,255,0.2) 0 1px, transparent 1.7px)',
        glowOne: 'rgba(120, 202, 255, 0.16)',
        glowTwo: 'rgba(255, 248, 212, 0.10)',
        glowThree: 'rgba(111, 167, 255, 0.12)'
      }
    ],
    dusk: [
      {
        themeColor: '#241634',
        sky:
          'radial-gradient(circle at 20% 18%, rgba(255, 176, 107, 0.2), transparent 26%), radial-gradient(circle at 78% 18%, rgba(132, 138, 255, 0.18), transparent 28%), linear-gradient(180deg, #0a0d18 0%, #241638 32%, #53305f 62%, #211524 100%)',
        image:
          'radial-gradient(circle at 50% 110%, rgba(255, 188, 125, 0.14), transparent 30%), radial-gradient(circle at 20% 76%, rgba(122, 92, 255, 0.12), transparent 24%)',
        stars:
          'radial-gradient(circle at 24% 28%, rgba(255,255,255,0.9) 0 1px, transparent 1.6px), radial-gradient(circle at 70% 22%, rgba(255,255,255,0.72) 0 1.1px, transparent 1.8px), radial-gradient(circle at 48% 62%, rgba(255,255,255,0.38) 0 1px, transparent 1.7px), radial-gradient(circle at 80% 56%, rgba(255,255,255,0.44) 0 1px, transparent 1.8px)',
        glowOne: 'rgba(255, 176, 107, 0.18)',
        glowTwo: 'rgba(132, 138, 255, 0.18)',
        glowThree: 'rgba(228, 115, 255, 0.10)'
      },
      {
        themeColor: '#2b183e',
        sky:
          'radial-gradient(circle at 20% 18%, rgba(255, 167, 108, 0.18), transparent 26%), radial-gradient(circle at 80% 18%, rgba(132, 155, 255, 0.14), transparent 28%), linear-gradient(180deg, #090c16 0%, #281941 30%, #5b346f 62%, #251726 100%)',
        image:
          'radial-gradient(circle at 50% 112%, rgba(255, 187, 124, 0.12), transparent 28%), radial-gradient(circle at 14% 74%, rgba(180, 115, 255, 0.10), transparent 24%)',
        stars:
          'radial-gradient(circle at 26% 26%, rgba(255,255,255,0.84) 0 1px, transparent 1.6px), radial-gradient(circle at 68% 22%, rgba(255,255,255,0.64) 0 1.1px, transparent 1.8px), radial-gradient(circle at 54% 70%, rgba(255,255,255,0.34) 0 1px, transparent 1.8px), radial-gradient(circle at 82% 54%, rgba(255,255,255,0.4) 0 1px, transparent 1.8px)',
        glowOne: 'rgba(255, 167, 108, 0.16)',
        glowTwo: 'rgba(132, 155, 255, 0.15)',
        glowThree: 'rgba(180, 115, 255, 0.10)'
      }
    ],
    night: [
      {
        themeColor: '#070b14',
        sky:
          'radial-gradient(circle at 18% 0%, rgba(84, 198, 238, 0.16), transparent 34%), radial-gradient(circle at 86% 12%, rgba(240, 201, 106, 0.13), transparent 36%), radial-gradient(circle at 50% 105%, rgba(143, 160, 255, 0.10), transparent 36%), linear-gradient(180deg, #01030a 0%, #020711 52%, #01030a 100%)',
        image:
          'radial-gradient(circle at 22% 22%, rgba(97, 208, 255, 0.12), transparent 24%), radial-gradient(circle at 72% 30%, rgba(144, 103, 255, 0.10), transparent 26%), radial-gradient(circle at 50% 110%, rgba(78, 102, 216, 0.10), transparent 28%)',
        stars:
          'radial-gradient(circle at 15% 18%, rgba(255,255,255,0.92) 0 1px, transparent 1.7px), radial-gradient(circle at 32% 44%, rgba(255,255,255,0.78) 0 1px, transparent 1.7px), radial-gradient(circle at 74% 24%, rgba(255,255,255,0.72) 0 1.1px, transparent 1.8px), radial-gradient(circle at 58% 60%, rgba(255,255,255,0.44) 0 1px, transparent 1.8px), radial-gradient(circle at 80% 74%, rgba(255,255,255,0.34) 0 1px, transparent 1.7px)',
        glowOne: 'rgba(84, 198, 238, 0.22)',
        glowTwo: 'rgba(240, 201, 106, 0.16)',
        glowThree: 'rgba(143, 160, 255, 0.12)'
      },
      {
        themeColor: '#080c18',
        sky:
          'radial-gradient(circle at 16% 4%, rgba(76, 198, 255, 0.14), transparent 32%), radial-gradient(circle at 84% 12%, rgba(255, 214, 128, 0.10), transparent 34%), radial-gradient(circle at 50% 105%, rgba(126, 148, 255, 0.08), transparent 34%), linear-gradient(180deg, #01030a 0%, #020814 48%, #040818 100%)',
        image:
          'radial-gradient(circle at 24% 28%, rgba(90, 210, 255, 0.1), transparent 24%), radial-gradient(circle at 78% 32%, rgba(179, 111, 255, 0.08), transparent 24%), radial-gradient(circle at 48% 112%, rgba(90, 116, 220, 0.10), transparent 28%)',
        stars:
          'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.88) 0 1px, transparent 1.7px), radial-gradient(circle at 28% 42%, rgba(255,255,255,0.72) 0 1px, transparent 1.7px), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.68) 0 1.1px, transparent 1.8px), radial-gradient(circle at 54% 58%, rgba(255,255,255,0.38) 0 1px, transparent 1.8px), radial-gradient(circle at 82% 72%, rgba(255,255,255,0.28) 0 1px, transparent 1.7px)',
        glowOne: 'rgba(76, 198, 255, 0.20)',
        glowTwo: 'rgba(255, 214, 128, 0.14)',
        glowThree: 'rgba(126, 148, 255, 0.10)'
      }
    ]
  };

  /* ═══════════════════════════════════════════════════════════════════════
     STATE
  ═══════════════════════════════════════════════════════════════════════ */

  const state = {
    session: null,
    user: null,
    profile: null,
    isAdmin: false,

    completed: [],
    mana: 0,
    lessons: [],
    contentData: null,
    sessionReady: false,

    filters: {
      search: '',
      culture: 'all',
      status: 'all'
    },

    visuals: {
      theme: localStorage.getItem(THEME_KEY) || 'dark',
      timePhase: 'night',
      bgVariant: parseInt(localStorage.getItem(BACKGROUND_VARIANT_KEY) || '0', 10) || 0,
      bgTimer: null
    },

    three: {
      initialized: false,
      THREE: null,
      scene: null,
      camera: null,
      renderer: null,
      controls: null,

      nodes: [],
      distantGalaxies: [],
      sunGroup: null,
      frameId: null,
      resizeObserver: null,

      raycaster: null,
      pointer: null,

      activeNode: null,
      hoveredNode: null,
      tooltipEl: null,
      selectionEl: null,

      defaultCameraPos: null,
      defaultTarget: null,
      focusCameraPos: null,
      focusTarget: null,

      isTransitioning: false
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     DOM / UTILITY HELPERS
  ═══════════════════════════════════════════════════════════════════════ */

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value ?? '';
  }

  function setHTML(selector, value) {
    const el = $(selector);
    if (el) el.innerHTML = value ?? '';
  }

  function setValue(selector, value) {
    const el = $(selector);
    if (el) el.value = value ?? '';
  }

  function setHidden(selector, hidden) {
    const el = $(selector);
    if (el) el.classList.toggle('is-hidden', Boolean(hidden));
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('[Profile] Could not write localStorage:', err.message);
    }
  }

  function showToast(message) {
    const toast = $('#profileToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function normalizeHandle(handle) {
    return String(handle || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 32);
  }

  function initialsFromName(name) {
    const clean = String(name || 'LKP Wayfinder')
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim();

    const parts = clean.split(/\s+/).filter(Boolean);

    if (!parts.length) return 'LW';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  function themeColor(theme) {
    const map = {
      emerald: '#3cb371',
      gold: '#f0c96a',
      bridge: '#8fa0ff',
      rust: '#d98545',
      amber: '#e4ad48',
      saffron: '#ffb347',
      cyan: '#54c6ee',
      violet: '#8fa0ff',
      default: '#54c6ee'
    };

    return map[theme] || '#54c6ee';
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#ffffff').replace('#', '');
    const full =
      clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;

    const num = parseInt(full, 16);

    if (Number.isNaN(num)) {
      return `rgba(255,255,255,${alpha})`;
    }

    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    return `rgba(${r},${g},${b},${alpha})`;
  }

  function stripHTML(html) {
    return String(html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isDataImage(value) {
    return String(value || '').trim().startsWith('data:image/');
  }

  function getSafeAvatarUrl(value) {
    const url = String(value || '').trim();

    if (!url) return '';
    // Allow data URLs for in-session preview — they won't be persisted to Supabase
    // (saveProfile() guards against saving them).
    if (isDataImage(url)) return url;
    if (url.length > 2000) return '';

    return url;
  }

  function getThemeMeta() {
    return document.querySelector('meta[name="theme-color"]');
  }

  /* ═══════════════════════════════════════════════════════════════════════
     THEME + TIME-OF-DAY SYSTEM
  ═══════════════════════════════════════════════════════════════════════ */

  function resolveTimePhase(date = new Date()) {
    const hour = date.getHours();

    if (hour >= 5 && hour < 10) return 'dawn';
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';

    return 'night';
  }

  function getBackgroundPalette(phase, variantIndex) {
    const set = backgroundPhasePalettes[phase] || backgroundPhasePalettes.night;
    const safeIndex = Math.abs(variantIndex || 0) % set.length;

    return set[safeIndex];
  }

  function syncThemeToggleLabel() {
    const btn = $('#profileThemeToggle');
    if (!btn) return;

    if (state.visuals.theme === 'light') {
      btn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      btn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
      btn.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  function applyVisualEnvironment(options = {}) {
    const body = document.body;
    if (!body) return;

    const nextTheme = options.theme || state.visuals.theme || 'dark';
    const nextPhase = options.phase || resolveTimePhase();

    const nextVariant = Number.isFinite(options.variant)
      ? options.variant
      : state.visuals.bgVariant || 0;

    const palette = getBackgroundPalette(nextPhase, nextVariant);

    state.visuals.theme = nextTheme === 'light' ? 'light' : 'dark';
    state.visuals.timePhase = nextPhase;
    state.visuals.bgVariant = nextVariant;

    body.classList.toggle('profile-theme-light', state.visuals.theme === 'light');
    body.classList.toggle('profile-theme-dark', state.visuals.theme === 'dark');
    body.dataset.timePhase = nextPhase;
    body.dataset.bgVariant = String(nextVariant);

    body.style.setProperty('--profile-page-backdrop', palette.sky);
    body.style.setProperty('--profile-sky-gradient', palette.sky);
    body.style.setProperty('--profile-sky-image', palette.image);
    body.style.setProperty('--profile-star-field', palette.stars);
    body.style.setProperty('--profile-nebula-one', palette.glowOne);
    body.style.setProperty('--profile-nebula-two', palette.glowTwo);
    body.style.setProperty('--profile-nebula-three', palette.glowThree);

    const themeMeta = getThemeMeta();
    if (themeMeta) {
      themeMeta.setAttribute(
        'content',
        palette.themeColor || (state.visuals.theme === 'light' ? '#dbe9ff' : '#070b14')
      );
    }

    try {
      localStorage.setItem(THEME_KEY, state.visuals.theme);
      localStorage.setItem(BACKGROUND_VARIANT_KEY, String(nextVariant));
    } catch (err) {
      console.warn('[Profile] Could not persist theme/background:', err.message);
    }

    syncThemeToggleLabel();
  }

  function initThemeSystem() {
    let savedTheme = 'dark';

    try {
      savedTheme = localStorage.getItem(THEME_KEY) || state.visuals.theme || 'dark';
    } catch {
      savedTheme = 'dark';
    }

    applyVisualEnvironment({
      theme: savedTheme,
      phase: resolveTimePhase(),
      variant: state.visuals.bgVariant
    });
  }

  function cycleBackgroundVariant() {
    const phase = resolveTimePhase();
    const set = backgroundPhasePalettes[phase] || backgroundPhasePalettes.night;
    const nextVariant = (state.visuals.bgVariant + 1) % set.length;

    applyVisualEnvironment({
      theme: state.visuals.theme,
      phase,
      variant: nextVariant
    });
  }

  function startBackgroundClock() {
    clearInterval(state.visuals.bgTimer);

    initThemeSystem();

    state.visuals.bgTimer = setInterval(() => {
      const phase = resolveTimePhase();

      if (phase !== state.visuals.timePhase) {
        applyVisualEnvironment({
          theme: state.visuals.theme,
          phase,
          variant: 0
        });
        return;
      }

      cycleBackgroundVariant();
    }, BACKGROUND_ROTATION_MS);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     DATA NORMALIZATION
  ═══════════════════════════════════════════════════════════════════════ */

  function getStaticContentData() {
    const candidates = [];

    try {
      if (window.CULTURALVERSE_DATA && Array.isArray(window.CULTURALVERSE_DATA.cultures))
        candidates.push(window.CULTURALVERSE_DATA);
    } catch {}

    try {
      if (window.LKP_DATA && Array.isArray(window.LKP_DATA.cultures))
        candidates.push(window.LKP_DATA);
    } catch {}

    try {
      if (window.IKEVERSE_DATA && Array.isArray(window.IKEVERSE_DATA.cultures))
        candidates.push(window.IKEVERSE_DATA);
    } catch {}

    try {
      if (typeof CULTURALVERSE_DATA !== 'undefined' && CULTURALVERSE_DATA && Array.isArray(CULTURALVERSE_DATA.cultures))
        candidates.push(CULTURALVERSE_DATA);
    } catch {}

    try {
      if (typeof LKP_DATA !== 'undefined' && LKP_DATA && Array.isArray(LKP_DATA.cultures))
        candidates.push(LKP_DATA);
    } catch {}

    try {
      if (typeof IKEVERSE_DATA !== 'undefined' && IKEVERSE_DATA && Array.isArray(IKEVERSE_DATA.cultures))
        candidates.push(IKEVERSE_DATA);
    } catch {}

    const data = candidates.find(item => {
      return (
        item &&
        Array.isArray(item.cultures) &&
        item.cultures.some(culture => {
          return Array.isArray(culture.modules) &&
            culture.modules.some(module => {
              return Array.isArray(module.lessons) && module.lessons.length;
            });
        })
      );
    });

    if (data) {
      window.CULTURALVERSE_DATA = data;
      window.LKP_DATA = data;
      window.IKEVERSE_DATA = data;
      console.info('[Profile] Static lesson data loaded:', data.cultures.length, 'cultures');
      return data;
    }

    console.warn('[Profile] No usable static lesson data found. Check LKP/js/lkp-data.js for a path error or syntax error.');
    return { cultures: [] };
  }

  // Resolve lessons array from a module, tolerating various key names.
  function resolveModuleLessons(module) {
    const raw =
      module.lessons      ||   // standard
      module.items        ||   // alternative
      module.content      ||   // alternative
      module.lessonList   ||   // alternative
      module.lesson_items ||   // snake_case
      [];
    if (!Array.isArray(raw)) return [];
    return raw.map(lesson => ({
      id:       lesson.id       || lesson._id || lesson.lessonId || '',
      num:      lesson.num      || lesson.lesson_num  || lesson.number || '',
      title:    lesson.title    || lesson.name        || lesson.id    || 'Lesson',
      readTime: lesson.readTime || lesson.read_time   || lesson.duration || '',
      content:  lesson.content  || lesson.body        || lesson.text  || '',
      leadText: lesson.leadText || lesson.lead_text   || lesson.intro || '',
      excerpt:  lesson.excerpt  || lesson.summary     || '',
      mana:     lesson.mana     || lesson.mana_value  || 10,
      xp:       lesson.xp      || lesson.xp_value    || 25
    })).filter(l => l.id);   // drop any entries with no id
  }

  // Resolve modules array from a culture, tolerating various key names.
  function resolveCultureModules(culture) {
    const raw =
      culture.modules     ||
      culture.sections    ||
      culture.units       ||
      culture.chapters    ||
      [];

    if (!Array.isArray(raw) || raw.length === 0) {
      // Some data files put lessons directly on the culture (no modules wrapper).
      // Wrap them in a synthetic module so the rest of the pipeline works.
      const directLessons =
        culture.lessons     ||
        culture.items       ||
        culture.content     ||
        [];
      if (Array.isArray(directLessons) && directLessons.length > 0) {
        return [{
          id:      `${culture.id}-module-0`,
          title:   culture.name || 'Module',
          emoji:   culture.emoji || '\u2736',
          desc:    '',
          lessons: directLessons
        }];
      }
      return [];
    }
    return raw;
  }

  function normalizeContentData(data) {
    if (!data || !Array.isArray(data.cultures)) {
      return { cultures: [] };
    }

    return {
      ...data,
      cultures: data.cultures.map(culture => ({
        id:       culture.id       || culture._id    || '',
        name:     culture.name     || culture.title  || 'Culture',
        emoji:    culture.emoji    || '\u2736',
        theme:    culture.theme    || culture.culture_theme || 'default',
        colorHex: culture.colorHex || culture.color_hex    || null,
        modules:  resolveCultureModules(culture).map(module => ({
          id:      module.id    || module._id   || '',
          title:   module.title || module.name  || 'Module',
          emoji:   module.emoji || module.module_emoji || culture.emoji || '\u2736',
          desc:    module.desc  || module.description  || '',
          lessons: resolveModuleLessons(module)
        }))
      })).filter(c => c.id)   // drop cultures with no id
    };
  }

  function flattenLessons(data) {
    const normalized = normalizeContentData(data);
    const lessons = [];

    normalized.cultures.forEach(culture => {
      const modules = Array.isArray(culture.modules) ? culture.modules : [];

      modules.forEach(module => {
        const moduleLessons = Array.isArray(module.lessons) ? module.lessons : [];

        moduleLessons.forEach(lesson => {
          lessons.push({
            cultureId: culture.id,
            cultureName: culture.name,
            cultureEmoji: culture.emoji || '\u2736',
            cultureTheme: culture.theme || 'default',
            cultureColor: culture.colorHex || themeColor(culture.theme),
            moduleId: module.id,
            moduleTitle: module.title || 'Module',
            moduleEmoji: module.emoji || culture.emoji || '\u2736',
            id: lesson.id,
            num: lesson.num || '',
            title: lesson.title || lesson.id,
            readTime: lesson.readTime || '',
            content: lesson.content || '',
            contentText: stripHTML(lesson.content || ''),
            leadText: lesson.leadText || '',
            excerpt: lesson.excerpt || '',
            mana: lesson.mana || 10,
            xp: lesson.xp || 25
          });
        });
      });
    });

    return lessons;
  }

  /* CHANGE 2: bootRewards — always passes supabase + userId to LKPRewards.init()
     This is the root fix for cross-device sync. Every call to init goes here. */
  async function bootRewards(data) {
    if (!window.LKPRewards || typeof window.LKPRewards.init !== 'function') return;
    try {
      // Only pass supabase+userId when the user is signed in.
      // Guest mode intentionally has no userId — lkp-rewards.js will use local cache.
      const userId   = state.user?.id || null;
      const sbClient = userId ? (window._lkpSupaClient || supabaseClient) : null;

      await window.LKPRewards.init({
        data:     data || state.contentData,
        supabase: sbClient,
        userId:   userId
      });
    } catch (err) {
      console.warn('[Profile] LKPRewards.init failed:', err.message);
    }
  }

  /* CHANGE 3: hydrateLessonsFromData calls bootRewards() not bare LKPRewards.init() */
  async function hydrateLessonsFromData(data) {
    state.contentData = normalizeContentData(data);
    state.lessons = flattenLessons(state.contentData);

    await bootRewards(state.contentData);

    if (window.LKPRewards) {
      try {
        if (typeof window.LKPRewards.setCompletedLessons === 'function') {
          window.LKPRewards.setCompletedLessons(state.completed);
        }

        const rewardSummary = window.LKPRewards.getProfileSummary?.({
          recalculate: true
        });

        if (rewardSummary && typeof rewardSummary.mana === 'number') {
          state.mana = rewardSummary.mana;
          localStorage.setItem(MANA_KEY, String(state.mana));
        }
      } catch (err) {
        console.warn('[Profile] Rewards engine init failed:', err.message);
      }
    }
  }

  // Candidate paths for the lesson data script — tried in order.
  const LKP_DATA_SCRIPT_PATHS = [
    'LKP/js/lkp-data.js',
    'js/lkp-data.js',
    'lkp-data.js',
    'LKP/js/data.js',
    'js/data.js'
  ];

  function hasUsableLessons(data) {
    return (
      data &&
      Array.isArray(data.cultures) &&
      data.cultures.some(culture =>
        Array.isArray(culture.modules) &&
        culture.modules.some(module =>
          Array.isArray(module.lessons) && module.lessons.length > 0
        )
      )
    );
  }

  // Dynamically inject a <script> tag and wait for it to load.
  function injectScript(src) {
    return new Promise(resolve => {
      // Don't inject the same script twice
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }
      const el = document.createElement('script');
      el.src = src;
      el.defer = false;
      el.async = false;
      el.onload  = () => resolve(true);
      el.onerror = () => resolve(false);
      document.head.appendChild(el);
    });
  }

  function waitForLessonData(timeoutMs = 1800) {
    return new Promise(async resolve => {
      // ── 1. Data already on window ─────────────────────────────────────
      const existing = getStaticContentData();
      if (hasUsableLessons(existing)) {
        resolve(existing);
        return;
      }

      let resolved = false;

      const finish = data => {
        if (resolved) return;
        resolved = true;
        window.removeEventListener('lkp:data-ready', onReady);
        clearTimeout(eventTimer);
        const final = data || getStaticContentData();
        if (!hasUsableLessons(final)) {
          console.warn(
            '[Profile] No lesson data found after all attempts.\n' +
            'Make sure one of these exists and sets window.LKP_DATA, ' +
            'window.CULTURALVERSE_DATA, or window.IKEVERSE_DATA:\n' +
            LKP_DATA_SCRIPT_PATHS.join(', ')
          );
        }
        resolve(final);
      };

      // ── 2. Wait for lkp:data-ready event (fired by lkp-data.js) ──────
      const onReady = event => {
        const data =
          event?.detail?.data ||
          window.CULTURALVERSE_DATA ||
          window.LKP_DATA ||
          window.IKEVERSE_DATA ||
          null;
        finish(data);
      };

      window.addEventListener('lkp:data-ready', onReady);

      // ── 3. Try injecting lkp-data.js from known paths ─────────────────
      // Run in parallel with the event listener — whichever fires first wins.
      (async () => {
        for (const path of LKP_DATA_SCRIPT_PATHS) {
          if (resolved) return;

          const ok = await injectScript(path);

          if (ok) {
            // Give the script a tick to execute and set window globals
            await new Promise(r => setTimeout(r, 80));

            const data = getStaticContentData();
            if (hasUsableLessons(data)) {
              console.info('[Profile] Lesson data loaded via injected script:', path);
              finish(data);
              return;
            }
          }
        }

        // All paths tried — fall through to the event timer
      })();

      // ── 4. Absolute timeout fallback ──────────────────────────────────
      const eventTimer = setTimeout(() => {
        finish(getStaticContentData());
      }, timeoutMs);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SUPABASE
  ═══════════════════════════════════════════════════════════════════════ */

  async function waitForSupabaseLibrary() {
    if (!isSupabaseConfigured) return null;
    if (window.supabase) return window.supabase;

    return new Promise(resolve => {
      let tries = 0;

      const timer = setInterval(() => {
        tries += 1;

        if (window.supabase) {
          clearInterval(timer);
          resolve(window.supabase);
        }

        if (tries > 60) {
          clearInterval(timer);
          resolve(null);
        }
      }, 100);
    });
  }

  async function setupSupabaseClient() {
    if (!isSupabaseConfigured) return null;

    const supaLib = await waitForSupabaseLibrary();

    if (!supaLib) {
      console.warn('[Profile] Supabase library did not load.');
      return null;
    }

    supabaseClient = supaLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    /* CHANGE 1: expose so lkp-rewards.js and lkp-signout.js share this client */
    window._lkpSupaClient = supabaseClient;

    return supabaseClient;
  }

  async function loadManagedContent() {
    if (!supabaseClient) return false;

    try {
      const { data, error } = await supabaseClient.rpc('get_lkp_content', {
        public_only: !state.isAdmin
      });

      if (error) throw error;

      if (data && Array.isArray(data.cultures) && data.cultures.length > 0) {
        // Only replace static data if Supabase actually returned cultures.
        // An empty response from the RPC means "no managed content yet" —
        // don't wipe the static lessons that already loaded from lkp-data.js.
        await hydrateLessonsFromData(data);
        populateCultureFilter();
        renderLessonPath();
        renderDashboard();
        renderRewardsPanel();
        updateGalaxySelectionMeta();
        return true;
      }
    } catch (err) {
      console.warn('[Profile] Supabase content load skipped:', err.message);
    }

    return false;
  }

  /* CHANGE 6: loadSession calls bootRewards() with userId after profile loads */
  async function loadSession() {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;

      state.session = data.session || null;
      state.user = state.session?.user || null;

      if (state.user) {
        await loadOrCreateProfile();
        await bootRewards(state.contentData);
        await loadManagedContent();
        await loadRemoteProgress();
      } else {
        setSessionState('Not signed in. Guest/local profile mode is active.', 'warning');
        await loadManagedContent();
      }

      state.sessionReady = true;

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();
    } catch (err) {
      console.error(err);
      state.sessionReady = true;
      renderDashboard();
      setSessionState('Could not load Supabase session. Guest mode active.', 'warning');
    } finally {
      document.body.classList.remove('profile-loading');
    }
  }

  /* CHANGE 4: signIn shows loading spinner + fires welcome animation */
  async function signIn() {
    if (!supabaseClient) {
      showToast('Supabase is not ready yet.');
      return;
    }

    const email = $('#authEmail')?.value.trim();
    const password = $('#authPassword')?.value;

    if (!email || !password) {
      showToast('Email and password are required.');
      return;
    }

    const submitBtn = $('#profileAuthForm')?.querySelector('button[type="submit"]');
    if (window.LKPSignOut?.showSignInLoading) window.LKPSignOut.showSignInLoading(submitBtn);

    try {
      setSessionState('Signing in\u2026');

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      state.session = data.session;
      state.user = data.user;

      await loadOrCreateProfile();
      await bootRewards(state.contentData);
      await loadManagedContent();
      await loadRemoteProgress();

      if (window.LKPSignOut?.hideSignInLoading) window.LKPSignOut.hideSignInLoading(submitBtn);

      const displayName =
        state.profile?.display_name ||
        data.user.user_metadata?.display_name ||
        $('#authDisplayName')?.value.trim() ||
        data.user.email;

      if (window.LKPSignOut?.showSignInSuccess) window.LKPSignOut.showSignInSuccess(displayName);

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();

      showToast('Signed in successfully.');
    } catch (err) {
      console.error(err);
      if (window.LKPSignOut?.hideSignInLoading) window.LKPSignOut.hideSignInLoading(submitBtn);
      showToast(err.message || 'Sign-in failed.');
      setSessionState('Sign-in failed. Check your email/password.', 'warning');
    }
  }

  /* CHANGE 4: signUp shows loading spinner + fires welcome animation */
  async function signUp() {
    if (!supabaseClient) {
      showToast('Supabase is not ready yet.');
      return;
    }

    const email = $('#authEmail')?.value.trim();
    const password = $('#authPassword')?.value;
    const displayName = $('#authDisplayName')?.value.trim();

    if (!email || !password) {
      showToast('Email and password are required.');
      return;
    }

    const signUpBtn = $('#signUpBtn');
    if (window.LKPSignOut?.showSignInLoading) window.LKPSignOut.showSignInLoading(signUpBtn);

    try {
      setSessionState('Creating profile\u2026');

      const baseName = displayName || email.split('@')[0];

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: baseName,
            handle: normalizeHandle(baseName),
            home_realm: 'lkp'
          }
        }
      });

      if (error) throw error;

      state.user = data.user || null;
      state.session = data.session || null;

      if (state.user) {
        await loadOrCreateProfile();
        await bootRewards(state.contentData);
        await loadRemoteProgress();
      }

      if (window.LKPSignOut?.hideSignInLoading) window.LKPSignOut.hideSignInLoading(signUpBtn);
      if (window.LKPSignOut?.showSignInSuccess) window.LKPSignOut.showSignInSuccess(displayName || baseName);

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();

      showToast('Profile created. Check email confirmation if Supabase requires it.');
    } catch (err) {
      console.error(err);
      if (window.LKPSignOut?.hideSignInLoading) window.LKPSignOut.hideSignInLoading(signUpBtn);
      showToast(err.message || 'Profile creation failed.');
      setSessionState('Profile creation failed.', 'warning');
    }
  }

  async function signOut() {
    if (!supabaseClient) return;

    try {
      await supabaseClient.auth.signOut();

      state.user = null;
      state.session = null;
      state.profile = null;
      state.isAdmin = false;

      setSessionState('Signed out. Guest/local profile mode is active.', 'warning');

      renderProfileFromCache();
      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();

      showToast('Signed out.');
    } catch (err) {
      console.error(err);
      showToast('Sign-out failed.');
    }
  }

  /* CHANGE 6: syncNow calls bootRewards() with userId */
  async function syncNow() {
    if (!supabaseClient || !state.user) {
      showToast('Sign in first to sync your profile.');
      return;
    }

    try {
      await loadOrCreateProfile();
      await bootRewards(state.contentData);
      await loadManagedContent();
      await loadRemoteProgress();

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();

      showToast('Profile synced.');
    } catch (err) {
      console.error(err);
      showToast('Sync failed.');
    }
  }

  async function loadOrCreateProfile() {
    if (!supabaseClient || !state.user) return;

    const user = state.user;

    try {
      let { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        const displayName =
          user.user_metadata?.display_name ||
          user.email?.split('@')[0] ||
          'Wayfinder';

        const baseHandle = normalizeHandle(user.user_metadata?.handle || displayName);

        const safeHandle = baseHandle
          ? `${baseHandle}_${String(user.id).slice(0, 8)}`
          : `wayfinder_${String(user.id).slice(0, 8)}`;

        const newProfile = {
          id: user.id,
          email: user.email,
          display_name: displayName,
          handle: safeHandle,
          role: 'user',
          home_realm: 'lkp',
          preferences: {},
          ecosystem_access: {
            lkp: true,
            lessons: true,
            rewards: true,
            profile: true
          }
        };

        const { data: inserted, error: insertError } = await supabaseClient
          .from('profiles')
          .insert(newProfile)
          .select('*')
          .single();

        if (insertError) throw insertError;

        profile = inserted;
      }

      if (profile && isDataImage(profile.avatar_url)) {
        profile.avatar_url = null;
      }

      if (profile && (!profile.home_realm || profile.home_realm === 'pikoverse')) {
        profile.home_realm = 'lkp';
      }

      state.profile = profile;
      state.isAdmin = ['admin', 'owner'].includes(profile.role);

      writeJSON(PROFILE_CACHE_KEY, profile);

      setSessionState(
        `Signed in as ${profile.display_name || profile.email || user.email}`,
        'good'
      );
    } catch (err) {
      console.error(err);
      setSessionState('Signed in, but profile row could not be loaded.', 'warning');
    }
  }

  /* CHANGE 6: uses lkp_user_progress table */
  async function loadRemoteProgress() {
    if (!supabaseClient || !state.user) return;

    try {
      const { data, error } = await supabaseClient
        .from('lkp_user_progress')
        .select('lesson_id, mana_earned, xp_earned')
        .eq('user_id', state.user.id)
        .eq('completed', true);

      if (error) throw error;

      const remoteCompleted = (data || []).map(row => row.lesson_id);
      const merged = [...new Set([...state.completed, ...remoteCompleted])];

      state.completed = merged;
      writeJSON(COMPLETED_KEY, merged);

      if (
        window.LKPRewards &&
        typeof window.LKPRewards.setCompletedLessons === 'function'
      ) {
        window.LKPRewards.setCompletedLessons(merged);

        const summary = window.LKPRewards.getProfileSummary?.({
          recalculate: true
        });

        if (summary && typeof summary.mana === 'number') {
          state.mana = summary.mana;
          localStorage.setItem(MANA_KEY, String(state.mana));
        }
      }
    } catch (err) {
      console.warn('[Profile] Could not load remote progress:', err.message);
    }
  }

  /* CHANGE 6: uses lkp_user_progress table with mana_earned / xp_earned columns */
  async function saveRemoteProgress(lessonId, completed) {
    if (!supabaseClient || !state.user) return;

    try {
      const lesson = state.lessons.find(item => item.id === lessonId);

      const { error } = await supabaseClient
        .from('lkp_user_progress')
        .upsert({
          user_id:      state.user.id,
          lesson_id:    lessonId,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          mana_earned:  completed ? (lesson?.mana || 10) : 0,
          xp_earned:    completed ? (lesson?.xp   || 25) : 0
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;
    } catch (err) {
      console.warn('[Profile] Could not save remote progress:', err.message);
    }
  }

  async function saveProfile() {
    const displayName = $('#editDisplayName')?.value.trim();
    const handle = normalizeHandle($('#editHandle')?.value);
    const homeRealm = $('#editHomeRealm')?.value || 'lkp';
    let avatarUrl = $('#editAvatarUrl')?.value.trim();
    const bio = $('#editBio')?.value.trim();

    // If it's a data URL it came from the avatar upload flow.
    // Try to upload to Supabase Storage first; if that fails, strip it from the payload
    // (data URLs are never persisted to the profiles table directly).
    if (avatarUrl && isDataImage(avatarUrl)) {
      if (supabaseClient && state.user) {
        const publicUrl = await uploadAvatarToStorage(avatarUrl);
        if (publicUrl) {
          avatarUrl = publicUrl;
        } else {
          showToast('Could not upload image to storage. Add a Supabase "avatars" storage bucket.');
          avatarUrl = state.profile?.avatar_url || '';
        }
      } else {
        // Guest mode — can't persist data URLs, just keep current
        avatarUrl = state.profile?.avatar_url || '';
      }
    }

    if (avatarUrl && !isDataImage(avatarUrl) && avatarUrl.length > 2000) {
      showToast('Avatar URL is too long. Use a shorter hosted image URL.');
      avatarUrl = '';
    }

    const localProfile = {
      ...(state.profile || readJSON(PROFILE_CACHE_KEY, {}) || {}),
      display_name: displayName || 'Guest Wayfinder',
      handle,
      home_realm: homeRealm,
      avatar_url: avatarUrl || null,
      bio: bio || null,
      role: state.profile?.role || 'user'
    };

    if (!state.user || !supabaseClient) {
      state.profile = localProfile;
      writeJSON(PROFILE_CACHE_KEY, localProfile);

      renderDashboard();
      renderRewardsPanel();
      rebuildProfileGalaxyForRole();

      showToast('Saved locally. Sign in with Supabase to sync.');
      return;
    }

    try {
      const payload = {
        id: state.user.id,
        email: state.user.email,
        display_name: displayName || state.user.email?.split('@')[0],
        handle: handle || null,
        home_realm: homeRealm,
        avatar_url: avatarUrl || null,
        bio: bio || null
      };

      const { data, error } = await supabaseClient
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select('*')
        .single();

      if (error) throw error;

      if (data && isDataImage(data.avatar_url)) {
        data.avatar_url = null;
      }

      if (data && (!data.home_realm || data.home_realm === 'pikoverse')) {
        data.home_realm = 'lkp';
      }

      state.profile = data;
      state.isAdmin = ['admin', 'owner'].includes(data.role);

      writeJSON(PROFILE_CACHE_KEY, data);

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      rebuildProfileGalaxyForRole();

      showToast('Profile saved.');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Could not save profile.');
    }
  }

  /* CHANGE 6: uses await LKPRewards.completeLesson() for the complete path —
     calls the DB function which prevents double-award across devices.
     saveRemoteProgress only called for uncomplete since completeLesson()
     already writes to lkp_user_progress for the complete path. */
  async function toggleLessonComplete(lessonId) {
    const currentlyDone = state.completed.includes(lessonId);
    const shouldComplete = !currentlyDone;

    if (shouldComplete) {
      state.completed = [...new Set([...state.completed, lessonId])];
    } else {
      state.completed = state.completed.filter(id => id !== lessonId);
    }

    writeJSON(COMPLETED_KEY, state.completed);

    let rewardResult = null;

    if (window.LKPRewards) {
      if (shouldComplete && typeof window.LKPRewards.completeLesson === 'function') {
        rewardResult = await window.LKPRewards.completeLesson(lessonId);
      } else if (!shouldComplete && typeof window.LKPRewards.toggleLesson === 'function') {
        window.LKPRewards.toggleLesson(lessonId, false);
      }

      const rewardSummary = window.LKPRewards.getProfileSummary?.({
        recalculate: true
      });

      if (rewardSummary && typeof rewardSummary.mana === 'number') {
        state.mana = rewardSummary.mana;
      }
    } else {
      const lesson = state.lessons.find(item => item.id === lessonId);
      const manaValue = lesson?.mana || 10;

      state.mana = shouldComplete
        ? state.mana + manaValue
        : Math.max(0, state.mana - manaValue);
    }

    localStorage.setItem(MANA_KEY, String(state.mana));

    if (!shouldComplete) {
      await saveRemoteProgress(lessonId, false);
    }

    renderDashboard();
    renderRewardsPanel();
    renderLessonPath();
    updateGalaxySelectionMeta();

    if (shouldComplete && rewardResult?.already_completed) {
      showToast('Already completed on another device. \u2713');
    } else if (shouldComplete) {
      const summary = window.LKPRewards?.getProfileSummary?.();
      showToast(
        summary?.rank?.current?.name
          ? `Lesson completed. Rank: ${summary.rank.current.name}.`
          : 'Lesson completed. + Mana.'
      );
    } else {
      showToast('Lesson marked open.');
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     RENDERING
  ═══════════════════════════════════════════════════════════════════════ */

  function renderProfileFromCache() {
    const cached =
      readJSON(PROFILE_CACHE_KEY, null) ||
      readJSON(LEGACY_PROFILE_CACHE_KEY, null);

    if (cached && !state.profile) {
      if (isDataImage(cached.avatar_url)) {
        cached.avatar_url = null;
      }

      if (!cached.home_realm || cached.home_realm === 'pikoverse') {
        cached.home_realm = 'lkp';
      }

      state.profile = cached;
      state.isAdmin = ['admin', 'owner'].includes(cached.role);

      writeJSON(PROFILE_CACHE_KEY, cached);
    }
  }

  function renderDashboard() {
    const profile = state.profile || {};
    const completed = state.completed || [];
    const totalLessons = state.lessons.length;

    if (window.LKPRewards) {
      try {
        if (typeof window.LKPRewards.setCompletedLessons === 'function') {
          window.LKPRewards.setCompletedLessons(completed);
        }

        const rewardSummary = window.LKPRewards.getProfileSummary?.({
          recalculate: true
        });

        if (rewardSummary && typeof rewardSummary.mana === 'number') {
          state.mana = rewardSummary.mana;
          localStorage.setItem(MANA_KEY, String(state.mana));
        }
      } catch (err) {
        console.warn('[Profile] Rewards render sync failed:', err.message);
      }
    }

    const progress = totalLessons
      ? Math.min(100, Math.round((completed.length / totalLessons) * 100))
      : 0;

    const displayName =
      profile.display_name ||
      profile.name ||
      profile.handle ||
      state.user?.email ||
      'Guest Wayfinder';

    const handle = profile.handle || normalizeHandle(displayName) || 'guest';
    const role = profile.role || (state.user ? 'user' : 'guest');
    const isAdmin = ['admin', 'owner'].includes(role) && Boolean(state.user);

    state.isAdmin = isAdmin;

    document.body.classList.toggle('profile-is-signed-in', Boolean(state.user));
    document.body.classList.toggle('profile-is-admin', Boolean(isAdmin));

    setText('#profileDisplayName', displayName);
    setText('#profileHandleLine', `@${handle}`);

    setText(
      '#profileRoleLine',
      isAdmin
        ? `${role.toUpperCase()} \u00b7 upgraded command profile`
        : state.user
          ? 'Signed-in wayfinder profile'
          : 'Guest/local profile mode'
    );

    setText('#passportRoleChip', isAdmin ? role.toUpperCase() : state.user ? 'USER' : 'GUEST');
    setText('#profileAvatarInitials', initialsFromName(displayName));

    const avatar = $('#profileAvatar');
    const safeAvatarUrl = getSafeAvatarUrl(profile.avatar_url);

    if (avatar) {
      if (safeAvatarUrl) {
        avatar.style.backgroundImage = `
          linear-gradient(rgba(1,3,10,0.12), rgba(1,3,10,0.12)),
          url("${safeAvatarUrl}")
        `;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
      } else {
        avatar.style.backgroundImage = '';
      }
    }

    setText('#statCompleted', completed.length);
    setText('#statMana', state.mana);
    setText('#statLessons', totalLessons);
    setText('#statProgress', `${progress}%`);
    setText('#statProgressMirror', `${progress}%`);

    const ring = $('#passportRingProgress');

    if (ring) {
      const circumference = 314;
      ring.style.strokeDashoffset = String(
        circumference - (circumference * progress) / 100
      );
    }

    setValue('#editDisplayName', profile.display_name || '');
    setValue('#editHandle', profile.handle || '');
    setValue('#editHomeRealm', profile.home_realm || 'lkp');
    setValue('#editAvatarUrl', safeAvatarUrl);
    setValue('#editBio', profile.bio || '');

    setHidden('#profileSignOutBtn', !state.user);
    setHidden('#authPanel', Boolean(state.user));
    setHidden('#adminPanel', !isAdmin);

    renderBadges(progress, isAdmin, role);
    resizeProfileGalaxy();
  }

  function renderRewardsPanel() {
    if (!window.LKPRewards) return;

    let summary;

    try {
      summary = window.LKPRewards.getProfileSummary?.({
        recalculate: true
      });
    } catch (err) {
      console.warn('[Profile] Rewards panel failed:', err.message);
      return;
    }

    if (!summary) return;

    const rank = summary.rank?.current || {
      name: 'Initiate',
      icon: '\uD83C\uDF31',
      desc: 'Beginning the path of living knowledge.'
    };

    const next = summary.rank?.next || null;
    const rankProgress = summary.rank?.progressToNext ?? 100;

    setText('#rewardRankIcon', rank.icon || '\uD83C\uDF31');
    setText('#rewardRankName', rank.name || 'Initiate');
    setText('#rewardRankDesc', rank.desc || 'Beginning the path of living knowledge.');

    setText('#rewardMana', summary.mana || 0);
    setText('#rewardXP', summary.xp || 0);
    setText('#rewardStreak', summary.streak || 0);

    setText('#rewardModules', summary.completedModuleCount || 0);
    setText('#rewardCultures', summary.completedCultureCount || 0);

    const xrplReadyCount = (summary.claimRecords || []).filter(record => {
      return record.xrpl?.eligible;
    }).length;

    setText('#rewardClaims', xrplReadyCount);

    setText(
      '#rewardNextRank',
      next
        ? `Next: ${next.name} at ${next.minMana} Mana`
        : 'Highest rank reached'
    );

    setText('#rewardRankProgress', `${rankProgress}%`);

    const bar = $('#rewardRankBar');

    if (bar) {
      bar.style.width = `${rankProgress}%`;
    }

    const checkBtn = $('#rewardCheckInBtn');

    if (checkBtn) {
      checkBtn.textContent = summary.checkedInToday
        ? 'Checked In Today'
        : 'Daily Learning Check-In';

      checkBtn.disabled = Boolean(summary.checkedInToday);
      checkBtn.classList.toggle('is-disabled', Boolean(summary.checkedInToday));
    }

    const badges = summary.badges || [];

    setHTML(
      '#rewardBadges',
      badges.length
        ? badges.map(badge => `
            <span class="rewards-badge" title="${escapeHTML(badge.desc || '')}">
              <span>${badge.icon || '\u2736'}</span>
              ${escapeHTML(badge.name)}
            </span>
          `).join('')
        : `<div class="profile-note">Complete your first lesson to earn your first badge.</div>`
    );

    const certificates = summary.certificates || [];

    setHTML(
      '#rewardCertificates',
      certificates.length
        ? certificates.slice(0, 5).map(cert => `
            <div class="rewards-certificate">
              <strong>${escapeHTML(cert.title)}</strong>
              <span>${escapeHTML(cert.subtitle || cert.type || 'Certificate')} \u00b7 XRPL-ready future record</span>
            </div>
          `).join('')
        : `<div class="profile-note">Complete a full module to generate your first certificate record.</div>`
    );
  }

  function renderBadges(progress, isAdmin, role) {
    const row = $('#profileBadgeRow');
    if (!row) return;

    const badges = [];

    badges.push({
      icon: '\u25c8',
      label: state.user ? 'Synced Profile' : 'Guest Mode'
    });

    if (progress >= 10)  badges.push({ icon: '\uD83C\uDF31', label: 'Path Starter' });
    if (progress >= 25)  badges.push({ icon: '\uD83C\uDF0A', label: 'Current Rider' });
    if (progress >= 50)  badges.push({ icon: '\u2B50',       label: 'Star Reader' });
    if (progress >= 75)  badges.push({ icon: '\uD83E\uDDED', label: 'Navigator' });
    if (progress >= 100) badges.push({ icon: '\uD83C\uDF0C', label: 'Constellation Keeper' });
    if (isAdmin) badges.push({ icon: '\uD83D\uDC51', label: `${role} Access` });

    row.innerHTML = badges.map(badge => `
      <span class="profile-badge">
        <span>${badge.icon}</span>
        ${escapeHTML(badge.label)}
      </span>
    `).join('');
  }

  function populateCultureFilter() {
    const select = $('#lessonCultureFilter');
    if (!select) return;

    const cultures = new Map();

    state.lessons.forEach(lesson => {
      if (lesson.cultureId && lesson.cultureName) {
        cultures.set(lesson.cultureId, lesson.cultureName);
      }
    });

    const options = [...cultures.entries()]
      .map(([id, name]) => {
        return `<option value="${escapeHTML(id)}">${escapeHTML(name)}</option>`;
      })
      .join('');

    select.innerHTML = `<option value="all">All Cultures</option>${options}`;

    if (!cultures.has(state.filters.culture) && state.filters.culture !== 'all') {
      state.filters.culture = 'all';
      select.value = 'all';
    }
  }

  function renderEcosystem() {
    const grid = $('#ecosystemGrid');
    if (!grid) return;

    grid.innerHTML = ecosystemItems
      .filter(item => !item.adminOnly || state.isAdmin)
      .map(item => `
        <a class="profile-ecosystem-card ecosystem-card"
           href="${item.href}"
           ${item.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}
           style="--eco-color:${item.color};--eco-bg:${hexToRgba(item.color, 0.10)};--eco-border:${hexToRgba(item.color, 0.26)}">
          <strong>${escapeHTML(item.name)}</strong>
          <span>${escapeHTML(item.desc)}</span>
          <small>Open &#8594;</small>
        </a>
      `)
      .join('');
  }

  function renderLessonPath() {
    const list = $('#lessonPathList');
    if (!list) return;

    let lessons = [...state.lessons];

    if (state.filters.search) {
      const q = state.filters.search;

      lessons = lessons.filter(lesson => {
        return [
          lesson.title,
          lesson.num,
          lesson.cultureName,
          lesson.moduleTitle,
          lesson.contentText,
          lesson.content,
          lesson.leadText,
          lesson.excerpt
        ]
          .join(' ')
          .toLowerCase()
          .includes(q);
      });
    }

    if (state.filters.culture !== 'all') {
      lessons = lessons.filter(lesson => lesson.cultureId === state.filters.culture);
    }

    if (state.filters.status !== 'all') {
      lessons = lessons.filter(lesson => {
        const done = state.completed.includes(lesson.id);
        return state.filters.status === 'completed' ? done : !done;
      });
    }

    // Safety net: if state.lessons is empty but we have content data,
    // re-flatten right now (handles race conditions or repeated renders).
    if (!state.lessons.length && state.contentData) {
      state.lessons = flattenLessons(state.contentData);
      if (state.lessons.length) {
        populateCultureFilter();
      }
    }

    // Also try the global data objects as a last resort
    if (!state.lessons.length) {
      const fallback =
        window.CULTURALVERSE_DATA ||
        window.LKP_DATA           ||
        window.IKEVERSE_DATA      ||
        null;
      if (fallback && Array.isArray(fallback.cultures) && fallback.cultures.length) {
        state.contentData = normalizeContentData(fallback);
        state.lessons     = flattenLessons(state.contentData);
        if (state.lessons.length) {
          populateCultureFilter();
        }
      }
    }

    if (!state.lessons.length) {
      // Show a more informative message based on what we do/don't have
      const hasCultures = state.contentData?.cultures?.length > 0;
      const detail = hasCultures
        ? `Found ${state.contentData.cultures.length} culture(s) but no lessons inside them. Check that your data file's modules contain a <code>lessons</code> array.`
        : 'No lesson data found. Make sure <strong>LKP/js/lkp-data.js</strong> loads before <strong>profile.js</strong>, or that Supabase content is live.';

      list.innerHTML = `<div class="profile-note">${detail}</div>`;
      return;
    }

    if (!lessons.length) {
      list.innerHTML = `
        <div class="profile-note">
          No lessons match your current filter.
        </div>
      `;
      return;
    }

    list.innerHTML = lessons.map(lesson => {
      const color = lesson.cultureColor || themeColor(lesson.cultureTheme);
      const completed = state.completed.includes(lesson.id);

      return `
        <article class="lesson-row" style="--lesson-color:${color}">
          <span class="lesson-row__num">${escapeHTML(lesson.num || 'LESSON')}</span>

          <a class="lesson-row__body" href="lessons.html#${encodeURIComponent(lesson.id)}">
            <strong>${completed ? '\u2705 ' : ''}${escapeHTML(lesson.title)}</strong>
            <small>${escapeHTML(lesson.cultureName)} \u00b7 ${escapeHTML(lesson.moduleTitle)} \u00b7 ${escapeHTML(lesson.readTime || 'Lesson')}</small>
          </a>

          <button
            class="lesson-row__complete ${completed ? 'is-done' : ''}"
            type="button"
            data-toggle-complete="${escapeHTML(lesson.id)}"
          >
            ${completed ? 'Done' : 'Complete'}
          </button>

          <a class="lesson-row__open" href="lessons.html#${encodeURIComponent(lesson.id)}">\u2192</a>
        </article>
      `;
    }).join('');
  }

  function setSessionState(message, tone = '') {
    const el = $('#profileSessionState');
    if (!el) return;

    el.classList.remove('is-good', 'is-warning', 'is-bad');

    if (tone === 'good') el.classList.add('is-good');
    if (tone === 'warning') el.classList.add('is-warning');
    if (tone === 'bad') el.classList.add('is-bad');

    el.textContent = message;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     AVATAR IMAGE UPLOAD — drag, drop, paste
  ═══════════════════════════════════════════════════════════════════════ */

  // Resize and compress an image file to a canvas data URL.
  // Max 512×512, quality 0.82 JPEG — keeps it small for session preview.
  function resizeImageFile(file, maxPx = 512, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = evt => {
        const img = new window.Image();

        img.onload = () => {
          const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
          const w     = Math.round(img.width  * scale);
          const h     = Math.round(img.height * scale);

          const canvas = document.createElement('canvas');
          canvas.width  = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          resolve(canvas.toDataURL('image/jpeg', quality));
        };

        img.onerror = () => reject(new Error('Image failed to load'));
        img.src = evt.target.result;
      };

      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  // Try to upload a data URL to Supabase Storage (bucket: avatars).
  // Returns the public URL string on success, null on failure.
  async function uploadAvatarToStorage(dataUrl) {
    if (!supabaseClient || !state.user) return null;

    try {
      // Convert data URL → Blob
      const res   = await fetch(dataUrl);
      const blob  = await res.blob();
      const ext   = blob.type.includes('png') ? 'png' : 'jpg';
      const path  = `${state.user.id}/avatar.${ext}`;

      const { error } = await supabaseClient
        .storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: blob.type });

      if (error) {
        console.warn('[Profile] Storage upload error:', error.message);
        return null;
      }

      const { data } = supabaseClient
        .storage
        .from('avatars')
        .getPublicUrl(path);

      return data?.publicUrl || null;
    } catch (err) {
      console.warn('[Profile] Avatar upload failed:', err.message);
      return null;
    }
  }

  // Central handler: takes a File object, resizes, previews, then tries to persist.
  async function handleAvatarImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please drop or paste an image file.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image is too large (max 8 MB). Try a smaller file.');
      return;
    }

    try {
      showToast('Processing image…');

      const dataUrl = await resizeImageFile(file);

      // Immediate preview — update the avatar element directly
      const avatar = $('#profileAvatar');
      if (avatar) {
        avatar.style.backgroundImage = `
          linear-gradient(rgba(1,3,10,0.12), rgba(1,3,10,0.12)),
          url("${dataUrl}")
        `;
        avatar.style.backgroundSize     = 'cover';
        avatar.style.backgroundPosition = 'center';
      }

      // Also populate the URL field so the user can see something changed
      const urlInput = $('#editAvatarUrl');
      if (urlInput) urlInput.value = '(uploading…)';

      // Try Supabase Storage upload
      const publicUrl = await uploadAvatarToStorage(dataUrl);

      if (publicUrl) {
        // Persist the public URL to profile
        if (state.profile) state.profile.avatar_url = publicUrl;
        if (urlInput) urlInput.value = publicUrl;

        await saveProfile();
        showToast('Avatar uploaded and saved ✓');
      } else {
        // No storage bucket — keep data URL in session preview only
        // Don't put the data URL in the text field (it's 50k+ chars)
        if (state.profile) state.profile.avatar_url = dataUrl;
        if (urlInput) urlInput.value = '';
        if (urlInput) urlInput.placeholder = 'Image previewed (session only)';

        showToast(
          state.user
            ? 'Image previewed. To persist it, create a Supabase Storage bucket named "avatars".'
            : 'Image previewed for this session. Sign in to save your avatar.'
        );
      }
    } catch (err) {
      console.error('[Profile] Avatar processing failed:', err);
      showToast('Could not process image. Try a different file.');
    }
  }

  // Inject an "Upload Photo" button next to the avatar URL field in the edit form.
  // This works dynamically so profile.html doesn't need to be modified.
  function injectAvatarUploadButton() {
    const urlInput = $('#editAvatarUrl');
    if (!urlInput || document.getElementById('lkp-avatar-upload-btn')) return;

    const btn = document.createElement('button');
    btn.id          = 'lkp-avatar-upload-btn';
    btn.type        = 'button';
    btn.textContent = '📷 Upload Photo';
    btn.title       = 'Click to upload a photo, or drag & drop / paste an image anywhere';

    btn.style.cssText = [
      'display:block',
      'margin-top:8px',
      'padding:8px 16px',
      'background:rgba(240,201,106,0.15)',
      'border:1px solid rgba(240,201,106,0.45)',
      'border-radius:8px',
      'color:#f0c96a',
      'font-size:13px',
      'cursor:pointer',
      'transition:background 0.2s',
      'width:100%',
    ].join(';');

    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(240,201,106,0.28)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(240,201,106,0.15)';
    });

    btn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type   = 'file';
      input.accept = 'image/*';

      input.onchange = evt => {
        const file = evt.target.files?.[0];
        if (file) handleAvatarImageFile(file);
      };

      input.click();
    });

    // Insert right after the URL input
    urlInput.parentNode.insertBefore(btn, urlInput.nextSibling);

    // Also add a small hint label
    const hint = document.createElement('small');
    hint.style.cssText = 'display:block;margin-top:6px;opacity:0.55;font-size:11px;';
    hint.textContent   = 'Or drag & drop / paste (Ctrl+V) an image anywhere on the page';
    btn.parentNode.insertBefore(hint, btn.nextSibling);
  }

  // Wire up drag-and-drop on the avatar element.
  function bindAvatarDragDrop() {
    const avatar = $('#profileAvatar');
    if (!avatar) return;

    // Visual feedback during drag
    avatar.addEventListener('dragenter', evt => {
      evt.preventDefault();
      avatar.classList.add('drag-over');
    }, { passive: false });

    avatar.addEventListener('dragover', evt => {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
      avatar.classList.add('drag-over');
    }, { passive: false });

    avatar.addEventListener('dragleave', () => {
      avatar.classList.remove('drag-over');
    });

    avatar.addEventListener('drop', evt => {
      evt.preventDefault();
      avatar.classList.remove('drag-over');

      const file = evt.dataTransfer?.files?.[0];
      if (file) handleAvatarImageFile(file);
    }, { passive: false });

    // Click-to-open file picker as fallback
    avatar.style.cursor = 'pointer';
    avatar.title        = 'Click, drag, or paste an image to update your avatar';

    avatar.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type  = 'file';
      input.accept = 'image/*';

      input.onchange = evt => {
        const file = evt.target.files?.[0];
        if (file) handleAvatarImageFile(file);
      };

      input.click();
    });
  }

  // Wire up global paste (Ctrl+V / Cmd+V anywhere on the page).
  function bindGlobalImagePaste() {
    document.addEventListener('paste', async evt => {
      // Skip if user is typing in an input/textarea
      const target = document.activeElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        target.id !== 'editAvatarUrl'
      ) {
        return;
      }

      const items = evt.clipboardData?.items || [];

      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            evt.preventDefault();
            await handleAvatarImageFile(file);
            return;
          }
        }
      }
    });
  }

    /* ═══════════════════════════════════════════════════════════════════════
     UI BINDING
  ═══════════════════════════════════════════════════════════════════════ */

  function bindUI() {
    $('#profileThemeToggle')?.addEventListener('click', () => {
      const next = state.visuals.theme === 'light' ? 'dark' : 'light';

      applyVisualEnvironment({
        theme: next,
        phase: state.visuals.timePhase,
        variant: state.visuals.bgVariant
      });
    });

    $('#profileAuthForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      await signIn();
    });

    $('#signUpBtn')?.addEventListener('click', async () => {
      await signUp();
    });

    /* CHANGE 5: #profileSignOutBtn listener removed — lkp-signout.js auto-wires
       it with the cosmic departure overlay. State cleanup happens in
       onAuthStateChange when SIGNED_OUT fires automatically. */

    $('#profileSyncBtn')?.addEventListener('click', async () => {
      await syncNow();
    });

    $('#profileEditForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      await saveProfile();
    });

    $('#lessonSearch')?.addEventListener('input', event => {
      state.filters.search = event.target.value.trim().toLowerCase();
      renderLessonPath();
    });

    $('#lessonCultureFilter')?.addEventListener('change', event => {
      state.filters.culture = event.target.value;
      renderLessonPath();
    });

    $('#lessonStatusFilter')?.addEventListener('change', event => {
      state.filters.status = event.target.value;
      renderLessonPath();
    });

    $('#lessonPathList')?.addEventListener('click', async event => {
      const btn = event.target.closest('[data-toggle-complete]');
      if (!btn) return;

      event.preventDefault();
      await toggleLessonComplete(btn.dataset.toggleComplete);
    });

    $('#realmWheel')?.addEventListener('click', event => {
      const btn = event.target.closest('[data-realm]');
      if (!btn) return;

      $all('#realmWheel [data-realm]').forEach(el => {
        el.classList.toggle('is-active', el === btn);
      });

      const desc = $('#realmDescription');

      if (desc) {
        desc.textContent =
          realmDescriptions[btn.dataset.realm] ||
          'This realm is connected to your profile.';
      }
    });

    $('#rewardCheckInBtn')?.addEventListener('click', async () => {
      if (!window.LKPRewards) {
        showToast('Rewards engine is not loaded yet.');
        return;
      }

      const before = window.LKPRewards.getProfileSummary?.() || {};

      if (typeof window.LKPRewards.checkInToday === 'function') {
        await window.LKPRewards.checkInToday();
      }

      const after = window.LKPRewards.getProfileSummary?.({
        recalculate: true
      }) || {};

      state.mana = after.mana || state.mana;
      localStorage.setItem(MANA_KEY, String(state.mana));

      renderDashboard();
      renderRewardsPanel();
      updateGalaxySelectionMeta();

      if (before.checkedInToday) {
        showToast('You already checked in today.');
      } else {
        showToast('Daily check-in complete. +5 Mana.');
      }
    });

    $('#profileGalaxyResetBtn')?.addEventListener('click', clearGalaxySelection);
    $('#profileGalaxyCenterBtn')?.addEventListener('click', centerGalaxySun);
    $('#profileGalaxyOpenFocusedBtn')?.addEventListener('click', openActiveGalaxyNode);
    $('#profileGalaxyCloseBtn')?.addEventListener('click', clearGalaxySelection);
    $('#profileGalaxySelectionCenter')?.addEventListener('click', () => {
      if (state.three.activeNode) focusGalaxyNode(state.three.activeNode, { keepPanel: true });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        clearGalaxySelection();
      }
    });

    // Avatar image upload — drag-drop, click-to-pick, and global paste
    bindAvatarDragDrop();
    bindGlobalImagePaste();

    // Inject an upload button next to the avatar URL input in the edit form.
    // Works even if profile.html doesn't have a dedicated upload button.
    injectAvatarUploadButton();
  }

  /* ═══════════════════════════════════════════════════════════════════════
     THREE.JS GALAXY
  ═══════════════════════════════════════════════════════════════════════ */

  async function initProfileGalaxy() {
    const canvas = $('#profileGalaxy');
    if (!canvas || state.three.initialized) return;

    try {
      ensureGalaxyUI();

      const THREE = await import('https://esm.sh/three@0.160.0');
      const { OrbitControls } = await import(
        'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js'
      );

      state.three.THREE = THREE;
      state.three.initialized = true;
      state.three.raycaster = new THREE.Raycaster();
      state.three.pointer = new THREE.Vector2();

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x01030a, 0.015);

      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 320);
      camera.position.set(0, 13, 52);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const controls = new OrbitControls(camera, canvas);
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.065;
      controls.rotateSpeed = 0.42;
      controls.zoomSpeed = 0.85;
      controls.minDistance = 6;
      controls.maxDistance = 120;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.22;
      controls.target.set(0, 0, 0);

      if ('zoomToCursor' in controls) {
        controls.zoomToCursor = true;
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.46));

      const sunLight = new THREE.PointLight(0xffd36b, 3.1, 190);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);

      const goldLight = new THREE.PointLight(0xffdd9a, 2.3, 180);
      goldLight.position.set(0, 32, 24);
      scene.add(goldLight);

      const cyanLight = new THREE.PointLight(0x54c6ee, 1.7, 150);
      cyanLight.position.set(-30, 12, -26);
      scene.add(cyanLight);

      const violetLight = new THREE.PointLight(0x8fa0ff, 1.1, 120);
      violetLight.position.set(26, -8, -20);
      scene.add(violetLight);

      state.three.scene = scene;
      state.three.camera = camera;
      state.three.renderer = renderer;
      state.three.controls = controls;
      state.three.defaultCameraPos = camera.position.clone();
      state.three.defaultTarget = controls.target.clone();

      buildIdentityGalaxy();
      resizeProfileGalaxy();

      window.addEventListener('resize', resizeProfileGalaxy, { passive: true });

      const holder = getGalaxyHolder();

      if (holder && 'ResizeObserver' in window) {
        state.three.resizeObserver = new ResizeObserver(() => resizeProfileGalaxy());
        state.three.resizeObserver.observe(holder);
      }

      canvas.addEventListener('click', onProfileGalaxyClick);
      canvas.addEventListener('dblclick', openActiveGalaxyNode);
      canvas.addEventListener('pointermove', onProfileGalaxyPointerMove);
      canvas.addEventListener('pointerleave', () => {
        state.three.hoveredNode = null;
        hideGalaxyTooltip();
      });

      canvas.addEventListener(
        'wheel',
        event => {
          event.preventDefault();
          event.stopPropagation();
        },
        { passive: false }
      );

      animateGalaxy();
    } catch (err) {
      console.warn('[Profile] Three.js profile galaxy failed to initialize:', err.message);
    }
  }

  function animateGalaxy() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;
    const camera = state.three.camera;
    const controls = state.three.controls;
    const renderer = state.three.renderer;

    if (!THREE || !scene || !camera || !controls || !renderer) return;

    state.three.frameId = requestAnimationFrame(animateGalaxy);

    const t = performance.now() * 0.001;
    const activeNode = state.three.activeNode;

    state.three.nodes.forEach((node, index) => {
      if (!node.mesh) return;

      if (node.isSun) {
        animateSun(node, t);
        return;
      }

      animateRealmNode(node, index, t, activeNode);
    });

    if (state.three.distantGalaxies?.length) {
      state.three.distantGalaxies.forEach((galaxy, index) => {
        if (!galaxy.group) return;

        galaxy.group.rotation.z += 0.00045 + index * 0.00005;
        galaxy.group.rotation.y += 0.00022 + index * 0.00003;

        if (galaxy.dust) {
          galaxy.dust.rotation.z -= 0.0003;
        }
      });
    }

    updateGalaxyCamera();

    controls.update();
    renderer.render(scene, camera);
  }

  function animateSun(node, t) {
    if (!node.mesh) return;

    node.mesh.rotation.y += 0.0035;
    node.mesh.rotation.z += 0.0011;

    if (node.glow) {
      node.glow.position.copy(node.mesh.position);
      node.glow.material.opacity = 0.34 + Math.sin(t * 1.4) * 0.04;
    }

    if (node.extraObjects && node.extraObjects.length) {
      node.extraObjects.forEach((obj, objIndex) => {
        if (!obj) return;

        obj.position.copy(node.mesh.position);

        if (obj.type === 'Points') {
          obj.rotation.y += 0.0008 + objIndex * 0.0002;
          obj.rotation.x += 0.0003;
        } else {
          obj.rotation.z += 0.001 + objIndex * 0.0004;
        }
      });
    }
  }

  function animateRealmNode(node, index, t, activeNode) {
    const THREE = state.three.THREE;
    const isFocused = activeNode === node;
    const focusSlowdown = activeNode ? 0.34 : 1;

    const angle = node.baseAngle + t * node.orbitSpeed * focusSlowdown;

    const pos = new THREE.Vector3(
      Math.cos(angle) * node.orbitRadius,
      0,
      Math.sin(angle) * node.orbitRadius
    );

    pos.applyEuler(
      new THREE.Euler(node.orbitTiltX || 0, 0, node.orbitTiltZ || 0)
    );

    pos.y += node.baseY || 0;
    pos.y += Math.sin(t * 1.15 + index * 0.7) * (node.verticalFloat || 0.14);

    node.mesh.position.copy(pos);
    node.mesh.rotation.y += isFocused ? 0.009 : 0.005;
    node.mesh.rotation.x = Math.sin(t + index * 0.41) * 0.07;

    const targetScale = isFocused ? 1.34 : 1;
    node.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    if (node.glow) {
      node.glow.position.copy(pos);
      node.glow.material.opacity =
        (node.glow.userData.baseOpacity || 0.24) +
        Math.sin(t * 1.2 + index) * 0.05 +
        (isFocused ? 0.16 : 0);
    }

    if (node.nebula) {
      node.nebula.position.copy(pos);
      node.nebula.rotation.z += 0.0014;
      node.nebula.rotation.y += 0.0007;

      node.nebula.children.forEach((child, childIndex) => {
        if (child.material && typeof child.material.opacity === 'number') {
          child.material.opacity =
            (child.userData.baseOpacity || 0.12) +
            ((Math.sin(t * 0.9 + index + childIndex) + 1) * 0.04) +
            (isFocused ? 0.04 : 0);
        }

        if (child.type === 'Points') {
          child.rotation.y += 0.0009;
          child.rotation.x += 0.0002;
        } else {
          child.rotation.z += 0.001;
        }
      });
    }

    if (node.gasCloud) {
      node.gasCloud.position.copy(pos);
      node.gasCloud.rotation.y += 0.001;
      node.gasCloud.rotation.z -= 0.0007;
    }

    if (node.satelliteSystem) {
      node.satelliteSystem.position.copy(pos);
    }

    if (node.satellitePivots?.length) {
      node.satellitePivots.forEach((pivot, pivotIndex) => {
        const focusBoost = isFocused ? 1.45 : 1;

        pivot.rotation.y +=
          (pivot.userData.speed || (0.01 + pivotIndex * 0.002)) * focusBoost;

        pivot.rotation.x += pivot.userData.wobble || 0.0006;
        pivot.rotation.z += (pivot.userData.wobble || 0.0006) * 0.35;
      });
    }

    if (node.label) {
      node.label.position.set(pos.x, pos.y + 1.55, pos.z);
      const labelScale = isFocused ? 5.2 : 4.4;
      node.label.scale.lerp(new THREE.Vector3(labelScale, 1.15, 1), 0.08);
    }
  }

  function updateGalaxyCamera() {
    const THREE = state.three.THREE;
    const camera = state.three.camera;
    const controls = state.three.controls;

    if (!THREE || !camera || !controls) return;

    const activeNode = state.three.activeNode;

    controls.autoRotate = !activeNode && !state.three.isTransitioning;

    if (!state.three.isTransitioning) return;

    if (activeNode?.mesh) {
      const nodePosition = new THREE.Vector3();
      activeNode.mesh.getWorldPosition(nodePosition);

      const direction = nodePosition.clone().normalize();

      if (direction.lengthSq() < 0.0001) {
        direction.set(0, 0.22, 1).normalize();
      }

      const isMobile = window.matchMedia('(max-width: 760px)').matches;
      const isTablet = window.matchMedia('(max-width: 1120px)').matches;

      const cameraDistance = isMobile ? 8.4 : isTablet ? 7.2 : 5.45;
      const cameraLift = isMobile ? 2.3 : isTablet ? 2.15 : 1.85;

      state.three.focusTarget = nodePosition.clone();
      state.three.focusCameraPos = nodePosition
        .clone()
        .add(direction.multiplyScalar(cameraDistance))
        .add(new THREE.Vector3(0, cameraLift, 0));
    } else {
      state.three.focusTarget =
        state.three.defaultTarget?.clone() || new THREE.Vector3(0, 0, 0);

      state.three.focusCameraPos =
        state.three.defaultCameraPos?.clone() || new THREE.Vector3(0, 13, 52);
    }

    const lerpFactor = activeNode ? 0.075 : 0.034;
    const targetFactor = activeNode ? 0.095 : 0.048;

    if (state.three.focusCameraPos) {
      camera.position.lerp(state.three.focusCameraPos, lerpFactor);
    }

    if (state.three.focusTarget) {
      controls.target.lerp(state.three.focusTarget, targetFactor);
    }

    const cameraReady =
      !state.three.focusCameraPos ||
      camera.position.distanceTo(state.three.focusCameraPos) < 0.12;

    const targetReady =
      !state.three.focusTarget ||
      controls.target.distanceTo(state.three.focusTarget) < 0.12;

    if (cameraReady && targetReady) {
      if (state.three.focusCameraPos) camera.position.copy(state.three.focusCameraPos);
      if (state.three.focusTarget) controls.target.copy(state.three.focusTarget);

      state.three.isTransitioning = false;
      controls.autoRotate = !state.three.activeNode;
    }
  }

  function ensureGalaxyUI() {
    const holder = getGalaxyHolder();
    if (!holder) return;

    state.three.tooltipEl = $('#profileGalaxyTooltip');
    state.three.selectionEl = $('#profileGalaxySelection');
  }

  function getGalaxyHolder() {
    const canvas = $('#profileGalaxy');
    if (!canvas) return null;

    return canvas.closest('.profile-galaxy-panel__inner') || canvas.parentElement;
  }

  function getGalaxySize() {
    const holder = getGalaxyHolder();
    const rect = holder?.getBoundingClientRect();

    return {
      width: Math.max(320, Math.round(rect?.width || 640)),
      height: Math.max(320, Math.round(rect?.height || 420))
    };
  }

  function resizeProfileGalaxy() {
    const { renderer, camera } = state.three;

    if (!renderer || !camera) return;

    const { width, height } = getGalaxySize();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(width, height, false);
  }

  function raycastGalaxyNode(event) {
    const THREE = state.three.THREE;
    const camera = state.three.camera;
    const raycaster = state.three.raycaster;

    if (!THREE || !camera || !raycaster) return null;

    const canvas = $('#profileGalaxy');
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const pointer = state.three.pointer || new THREE.Vector2();

    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    state.three.pointer = pointer;
    raycaster.setFromCamera(pointer, camera);

    const nodes = state.three.nodes.filter(node => {
      return node.item && node.mesh && node.mesh.userData?.href;
    });

    const meshes = nodes.map(node => node.mesh);
    const hits = raycaster.intersectObjects(meshes, false);

    if (!hits.length) return null;

    const mesh = hits[0].object;
    return nodes.find(node => node.mesh === mesh) || null;
  }

  function onProfileGalaxyPointerMove(event) {
    const node = raycastGalaxyNode(event);
    const tooltip = state.three.tooltipEl || $('#profileGalaxyTooltip');

    const holder = getGalaxyHolder();

    if (!tooltip || !holder) return;

    if (!node) {
      state.three.hoveredNode = null;
      hideGalaxyTooltip();
      return;
    }

    state.three.hoveredNode = node;

    const holderRect = holder.getBoundingClientRect();

    tooltip.innerHTML = `
      <strong style="color:${node.item.color};display:block;margin-bottom:3px;">
        ${escapeHTML(node.item.name)}
      </strong>
      <span>${escapeHTML(node.item.desc)}</span>
    `;

    tooltip.style.left = `${event.clientX - holderRect.left}px`;
    tooltip.style.top = `${event.clientY - holderRect.top}px`;
    tooltip.classList.add('is-visible');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  function hideGalaxyTooltip() {
    const tooltip = state.three.tooltipEl || $('#profileGalaxyTooltip');
    if (!tooltip) return;

    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  function onProfileGalaxyClick(event) {
    const node = raycastGalaxyNode(event);

    if (!node) {
      clearGalaxySelection();
      return;
    }

    focusGalaxyNode(node);
  }

  function focusGalaxyNode(node, options = {}) {
    if (!node?.item) return;

    state.three.activeNode = node;
    state.three.isTransitioning = true;
    hideGalaxyTooltip();

    showGalaxySelection(node);

    if (!options.keepPanel) {
      showToast(`Focused ${node.item.name}. Use Enter Realm to open it.`);
    }
  }

  function centerGalaxySun() {
    state.three.activeNode = null;
    state.three.isTransitioning = true;
    _clearSelectionUIOnly();

    showToast('Centered on the IkeStar core.');
  }

  function clearGalaxySelection() {
    state.three.activeNode = null;
    state.three.isTransitioning = false;
    _clearSelectionUIOnly();
  }

  function openActiveGalaxyNode() {
    const node = state.three.activeNode;

    if (!node?.item?.href) {
      showToast('Select a realm first.');
      return;
    }

    const href = node.item.href;

    if (href === '#digitalverse') {
      showToast('Digitalverse preview is reserved for the next connected realm.');
      return;
    }

    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.href = href;
    }
  }

  function showGalaxySelection(node) {
    const panel = state.three.selectionEl || $('#profileGalaxySelection');
    if (!panel || !node?.item) return;

    const completedCount = state.completed.length || 0;
    const totalLessons = state.lessons.length || 0;
    const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

    setText(
      '#profileGalaxySelectionKicker',
      node.item.adminOnly ? 'Admin Realm' : `${node.item.paletteName || 'Realm Nebula'}`
    );

    setText('#profileGalaxySelectionTitle', node.item.name);
    setText('#profileGalaxySelectionDesc', node.item.desc);

    setHTML(
      '#profileGalaxySelectionMeta',
      `
        <strong>${escapeHTML(node.item.shortName || node.item.name)}</strong>
        <span>
          ${escapeHTML(node.item.paletteName || 'Realm palette')} \u00b7
          ${completedCount}/${totalLessons} LKP lessons complete \u00b7
          ${progress}% current learning progress.
        </span>
      `
    );

    const openLink = $('#profileGalaxySelectionOpen');

    if (openLink) {
      openLink.href = node.item.href || '#';

      if (node.item.href && node.item.href.startsWith('http')) {
        openLink.target = '_blank';
        openLink.rel = 'noopener';
      } else {
        openLink.removeAttribute('target');
        openLink.removeAttribute('rel');
      }
    }

    panel.style.borderColor = hexToRgba(node.item.color, 0.42);
    panel.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
  }

  function updateGalaxySelectionMeta() {
    if (state.three.activeNode) {
      showGalaxySelection(state.three.activeNode);
    }
  }

  function disposeObject3D(object) {
    if (!object) return;

    object.traverse?.(child => {
      child.geometry?.dispose?.();

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose?.());
        } else {
          child.material.dispose?.();
        }
      }
    });
  }

  function _clearSelectionUIOnly() {
    hideGalaxyTooltip();

    const panel = state.three.selectionEl || $('#profileGalaxySelection');

    if (panel) {
      panel.classList.remove('is-visible');
      panel.setAttribute('aria-hidden', 'true');
    }
  }

  function clearIdentityGalaxy() {
    const scene = state.three.scene;
    if (!scene) return;

    _clearSelectionUIOnly();

    state.three.activeNode = null;
    state.three.hoveredNode = null;
    state.three.isTransitioning = false;

    state.three.nodes.forEach(node => {
      [
        node.mesh,
        node.glow,
        node.nebula,
        node.gasCloud,
        node.label,
        node.line,
        node.orbitLine,
        node.satelliteSystem
      ].forEach(obj => {
        if (obj) {
          scene.remove(obj);
          disposeObject3D(obj);
        }
      });

      if (node.extraObjects && Array.isArray(node.extraObjects)) {
        node.extraObjects.forEach(obj => {
          if (obj) {
            scene.remove(obj);
            disposeObject3D(obj);
          }
        });
      }
    });

    state.three.nodes = [];
    state.three.distantGalaxies = [];
    state.three.sunGroup = null;

    const removable = scene.children.filter(child => child.userData?.profileGalaxyGenerated);

    removable.forEach(child => {
      scene.remove(child);
      disposeObject3D(child);
    });
  }

  function rebuildProfileGalaxyForRole() {
    if (!state.three.initialized) return;

    clearIdentityGalaxy();
    buildIdentityGalaxy();
    resizeProfileGalaxy();
  }

  /* FIX: buildIdentityGalaxy fully restored — the original was truncated after
     glow.userData.baseOpacity, missing all nebula/gasCloud/satellite/label
     creation, the scene.add() calls, and the nodes.push() with the colon on
     verticalFloat fixed. */
  function buildIdentityGalaxy() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;

    if (!THREE || !scene) return;

    addDustField();
    addDistantGalaxies();

    const sun = makeSunCore();
    sun.group.userData.profileGalaxyGenerated = true;
    scene.add(sun.group);

    state.three.sunGroup = sun.group;

    state.three.nodes.push({
      mesh: sun.group,
      glow: sun.primaryGlow,
      extraObjects: sun.extras,
      baseY: 0,
      isSun: true
    });

    const items = ecosystemItems.filter(item => !item.adminOnly || state.isAdmin);
    const baseRadius = state.isAdmin ? 12.4 : 10.8;
    const isDesktopGalaxy = window.matchMedia('(min-width: 1024px)').matches;

    items.forEach((item, index) => {
      const primaryColor = item.color;
      const secondaryColor = item.secondaryColor || item.color;
      const color = new THREE.Color(primaryColor);

      const orbitRadius = baseRadius + (index % 4) * 2.05;
      const orbitTiltX = -0.34 + (index % 5) * 0.16;
      const orbitTiltZ = -0.22 + (index % 4) * 0.14;
      const orbitSpeed = 0.082 + (index % 4) * 0.013;
      const baseAngle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
      const baseY = Math.sin(index * 1.7) * 0.55;

      const orbitLine = makeOrbitRing(
        orbitRadius,
        primaryColor,
        item.adminOnly ? 0.13 : 0.065,
        orbitTiltX,
        orbitTiltZ
      );

      orbitLine.userData.profileGalaxyGenerated = true;
      scene.add(orbitLine);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(item.adminOnly ? 0.74 : 0.56, 28, 28),
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: item.adminOnly ? 1.0 : 0.68,
          metalness: 0.08,
          roughness: 0.24,
          transparent: true,
          opacity: 0.96
        })
      );

      mesh.userData.profileGalaxyGenerated = true;
      mesh.userData.href = item.href;
      mesh.userData.name = item.name;

      const glow = makeGlowSprite(
        primaryColor,
        item.adminOnly ? 4.9 : 3.6,
        item.adminOnly ? 0.42 : 0.28
      );

      glow.userData.profileGalaxyGenerated = true;
      glow.userData.baseOpacity = item.adminOnly ? 0.42 : 0.28;

      /* FIX: these nebula/gasCloud/satellite/label lines were completely missing */
      const nebula = makeRealmNebulaCluster(
        primaryColor,
        secondaryColor,
        item.adminOnly ? 3.35 : 2.7,
        item.adminOnly ? 0.25 : 0.18
      );

      nebula.userData.profileGalaxyGenerated = true;

      const gasCloud = makeGasCloud(
        primaryColor,
        secondaryColor,
        item.adminOnly ? 3.4 : 2.7,
        item.adminOnly ? 210 : 160,
        item.adminOnly ? 0.28 : 0.20
      );

      gasCloud.userData.profileGalaxyGenerated = true;

      const satellite = makeSatelliteSystem(
        primaryColor,
        secondaryColor,
        item.adminOnly ? 2.15 : 1.75,
        item.adminOnly ? 3 : 2
      );

      satellite.group.userData.profileGalaxyGenerated = true;

      const label = makeTextSprite(item.name, primaryColor);
      label.scale.set(4.4, 1, 1);
      label.userData.profileGalaxyGenerated = true;

      scene.add(mesh);
      scene.add(glow);
      scene.add(nebula);
      scene.add(gasCloud);
      scene.add(satellite.group);
      scene.add(label);

      /* FIX: verticalFloat had missing colon — was `verticalFloat 0.12` */
      state.three.nodes.push({
        mesh,
        glow,
        nebula,
        gasCloud,
        label,
        orbitLine,
        satelliteSystem: satellite.group,
        satellitePivots: satellite.pivots,
        item,
        orbitRadius,
        orbitTiltX,
        orbitTiltZ,
        orbitSpeed,
        baseAngle,
        baseY,
        verticalFloat: 0.12 + (index % 2) * 0.05
      });
    });
  }

  function addDustField() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;
    if (!THREE || !scene) return;

    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#dbefff'),
      new THREE.Color('#f0c96a'),
      new THREE.Color('#54c6ee'),
      new THREE.Color('#8fa0ff')
    ];

    for (let i = 0; i < count; i++) {
      const r = 24 + Math.random() * 92;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.105,
        vertexColors: true,
        transparent: true,
        opacity: 0.62,
        depthWrite: false
      })
    );

    stars.userData.profileGalaxyGenerated = true;
    scene.add(stars);
  }

  function addDistantGalaxies() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;
    if (!THREE || !scene) return;

    state.three.distantGalaxies = [];

    const distant = [
      { pos: [-44, 18, -58], color: '#54c6ee', secondary: '#8fa0ff', scale: 5.8 },
      { pos: [38, -14, -62], color: '#8fa0ff', secondary: '#54c6ee', scale: 6.2 },
      { pos: [50, 20, -48], color: '#f0c96a', secondary: '#ff9f43', scale: 4.8 },
      { pos: [-56, -20, -68], color: '#d98545', secondary: '#f0c96a', scale: 6.8 },
      { pos: [0, 26, -80], color: '#54c6ee', secondary: '#ffffff', scale: 5.0 }
    ];

    distant.forEach((item, index) => {
      const group = new THREE.Group();

      const glow = makeGlowSprite(item.color, item.scale, 0.13);
      glow.position.set(0, 0, 0);

      const cloud = makeGasCloud(
        item.color,
        item.secondary,
        item.scale * 0.72,
        140,
        0.11
      );

      const ring = makeOrbitRing(
        item.scale * 0.58,
        item.secondary,
        0.08,
        Math.PI / 4,
        Math.PI / 10
      );

      ring.scale.set(1.7, 0.46, 1);

      group.position.set(item.pos[0], item.pos[1], item.pos[2]);
      group.rotation.z = Math.random() * Math.PI;
      group.add(glow);
      group.add(cloud);
      group.add(ring);
      group.userData.profileGalaxyGenerated = true;

      scene.add(group);
      state.three.distantGalaxies.push({
        group,
        dust: cloud,
        index
      });
    });
  }

  function makeSunCore() {
    const THREE = state.three.THREE;
    const group = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 34, 34),
      new THREE.MeshPhysicalMaterial({
        color: 0xffd36b,
        emissive: 0xffc247,
        emissiveIntensity: 1.35,
        roughness: 0.18,
        metalness: 0.04,
        transparent: true,
        opacity: 0.98
      })
    );

    core.userData.profileGalaxyGenerated = true;

    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(2.55, 30, 30),
      new THREE.MeshBasicMaterial({
        color: 0xffd36b,
        transparent: true,
        opacity: 0.09,
        depthWrite: false
      })
    );

    outer.userData.profileGalaxyGenerated = true;

    const innerGlow = makeGlowSprite('#ffd76d', 7.2, 0.44);
    innerGlow.userData.baseOpacity = 0.44;

    const outerGlow = makeGlowSprite('#ffb347', 12.4, 0.23);
    outerGlow.userData.baseOpacity = 0.23;

    const coronaDust = makeGasCloud('#ffd76d', '#ffb347', 4.4, 310, 0.24);
    const coronaDust2 = makeGasCloud('#ffb347', '#54c6ee', 5.4, 230, 0.14);
    coronaDust2.rotation.x = Math.PI / 5;

    const coronaRingA = makeOrbitRing(3.2, '#ffd76d', 0.13, Math.PI / 6, Math.PI / 8);
    const coronaRingB = makeOrbitRing(4.2, '#ffb347', 0.09, -Math.PI / 5, Math.PI / 10);
    const coronaRingC = makeOrbitRing(5.0, '#54c6ee', 0.06, Math.PI / 3.5, -Math.PI / 7);

    group.add(core);
    group.add(outer);
    group.add(innerGlow);
    group.add(outerGlow);
    group.add(coronaDust);
    group.add(coronaDust2);
    group.add(coronaRingA);
    group.add(coronaRingB);
    group.add(coronaRingC);

    group.userData.profileGalaxyGenerated = true;

    return {
      group,
      primaryGlow: innerGlow,
      extras: [outerGlow, coronaDust, coronaDust2, coronaRingA, coronaRingB, coronaRingC]
    };
  }

  function makeRealmNebulaCluster(primaryColor, secondaryColor, scale, opacity) {
    const THREE = state.three.THREE;
    const group = new THREE.Group();

    const layers = [
      { color: primaryColor, x: -0.62, y: 0.18, z: 0.16, size: scale * 1.55, alpha: opacity * 0.85 },
      { color: secondaryColor, x: 0.66, y: -0.12, z: -0.22, size: scale * 1.28, alpha: opacity * 0.72 },
      { color: primaryColor, x: 0.12, y: 0.38, z: -0.18, size: scale * 1.02, alpha: opacity * 0.58 },
      { color: secondaryColor, x: -0.20, y: -0.40, z: 0.10, size: scale * 0.92, alpha: opacity * 0.50 },
      { color: '#ffffff', x: 0.0, y: 0.0, z: 0.0, size: scale * 0.52, alpha: opacity * 0.18 }
    ];

    layers.forEach(layer => {
      const sprite = makeGlowSprite(layer.color, layer.size, layer.alpha);
      sprite.position.set(layer.x, layer.y, layer.z);
      sprite.userData.baseOpacity = layer.alpha;
      group.add(sprite);
    });

    const dustA = makeGasCloud(primaryColor, secondaryColor, scale * 1.38, 170, opacity * 0.72);
    dustA.userData.baseOpacity = opacity * 0.72;
    group.add(dustA);

    const dustB = makeGasCloud(secondaryColor, primaryColor, scale * 1.02, 130, opacity * 0.50);
    dustB.rotation.x = Math.PI / 5;
    dustB.userData.baseOpacity = opacity * 0.50;
    group.add(dustB);

    const ringA = makeOrbitRing(scale * 0.9, primaryColor, opacity * 0.22, Math.PI / 3, Math.PI / 9);
    ringA.userData.baseOpacity = opacity * 0.22;
    group.add(ringA);

    const ringB = makeOrbitRing(scale * 1.15, secondaryColor, opacity * 0.17, Math.PI / 6, -Math.PI / 5);
    ringB.userData.baseOpacity = opacity * 0.17;
    group.add(ringB);

    group.userData.profileGalaxyGenerated = true;

    return group;
  }

  function makeGasCloud(primaryColor, secondaryColor, radius, count = 160, opacity = 0.18) {
    const THREE = state.three.THREE;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(primaryColor);
    const c2 = new THREE.Color(secondaryColor || primaryColor);
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = radius * (0.18 + Math.random() * 0.9);
      const vertical = (Math.random() - 0.5) * radius * 0.56;
      const wobble = 0.64 + Math.random() * 0.74;

      positions[i * 3] = Math.cos(angle) * spread * wobble;
      positions[i * 3 + 1] = vertical;
      positions[i * 3 + 2] = Math.sin(angle) * spread;

      const mix = Math.random();
      const color = c1.clone().lerp(c2, mix).lerp(white, Math.random() * 0.12);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const cloud = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: Math.max(0.05, radius * 0.034),
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );

    cloud.userData.profileGalaxyGenerated = true;
    cloud.userData.baseOpacity = opacity;

    return cloud;
  }

  function makeSatelliteSystem(primaryColor, secondaryColor, radius = 1.8, moonCount = 2) {
    const THREE = state.three.THREE;
    const group = new THREE.Group();
    const pivots = [];

    for (let i = 0; i < moonCount; i++) {
      const orbitRadius = radius * (0.62 + i * 0.34);
      const orbitTiltX = (Math.PI / 10) * (i % 2 === 0 ? 1 : -1);
      const orbitTiltZ = (Math.PI / 8) * (i % 3 === 0 ? -1 : 1);
      const useSecondary = i % 2 === 1;
      const moonColor = useSecondary ? secondaryColor : primaryColor;

      const orbitRing = makeOrbitRing(
        orbitRadius,
        moonColor,
        0.16,
        orbitTiltX,
        orbitTiltZ
      );

      group.add(orbitRing);

      const pivot = new THREE.Object3D();
      pivot.rotation.x = orbitTiltX;
      pivot.rotation.z = orbitTiltZ;
      pivot.userData.speed = 0.008 + i * 0.0028;
      pivot.userData.wobble = 0.0004 + i * 0.0002;
      const moonSize = 0.08 + i * 0.036;

      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(moonSize, 14, 14),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(moonColor).offsetHSL(0.03 * i, 0.04, 0.08),
          emissive: new THREE.Color(moonColor),
          emissiveIntensity: 0.30 + i * 0.07,
          roughness: 0.35,
          metalness: 0.06
        })
      );

      moon.position.set(orbitRadius, 0, 0);
      moon.userData.profileGalaxyGenerated = true;

      const moonGlow = makeGlowSprite(moonColor, 0.58 + i * 0.22, 0.14 + i * 0.03);
      moonGlow.position.copy(moon.position);

      pivot.add(moon);
      pivot.add(moonGlow);
      group.add(pivot);
      pivots.push(pivot);
    }

    group.userData.profileGalaxyGenerated = true;

    return { group, pivots };
  }

  function makeOrbitRing(radius, color, opacity, tiltX = 0, tiltZ = 0) {
    const THREE = state.three.THREE;
    const points = [];

    for (let i = 0; i <= 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false
      })
    );

    line.rotation.x = tiltX;
    line.rotation.z = tiltZ;
    line.userData.profileGalaxyGenerated = true;

    return line;
  }

  function makeGlowSprite(color, size, opacity) {
    const THREE = state.three.THREE;

    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;

    const ctx = c.getContext('2d');
    const col = new THREE.Color(color);

    const r = Math.round(col.r * 255);
    const g = Math.round(col.g * 255);
    const b = Math.round(col.b * 255);

    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
    grd.addColorStop(0.28, `rgba(${r},${g},${b},0.34)`);
    grd.addColorStop(0.62, `rgba(${r},${g},${b},0.10)`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );

    sprite.scale.setScalar(size);
    sprite.userData.profileGalaxyGenerated = true;
    sprite.userData.baseOpacity = opacity;

    return sprite;
  }

  function makeTextSprite(text, color) {
    const THREE = state.three.THREE;

    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;

    const ctx = c.getContext('2d');

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "800 34px 'DM Sans', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = color;
    ctx.fillText(text, c.width / 2, c.height / 2);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      })
    );

    sprite.userData.profileGalaxyGenerated = true;

    return sprite;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════════════════ */

  async function init() {
    document.body.classList.add('profile-loading');

    state.completed = readJSON(COMPLETED_KEY, []);
    state.mana = parseInt(localStorage.getItem(MANA_KEY) || '0', 10) || 0;

    startBackgroundClock();

    const staticData = await waitForLessonData();
    await hydrateLessonsFromData(staticData);

    bindUI();
    populateCultureFilter();
    renderProfileFromCache();
    renderRewardsPanel();
    renderEcosystem();
    renderLessonPath();

    await initProfileGalaxy();

    await setupSupabaseClient();

    if (!supabaseClient) {
      document.body.classList.remove('profile-loading');
      state.sessionReady = true;
      renderDashboard();

      setSessionState(
        isSupabaseConfigured
          ? 'Supabase library is not ready. Guest/local profile mode is active.'
          : 'Supabase is not configured yet. Guest/local profile mode is active.',
        'warning'
      );

      return;
    }

    await loadSession();

    /* CHANGE 6: onAuthStateChange always calls bootRewards() with userId so
       every device signs in with full cross-device sync enabled */
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      state.session = session || null;
      state.user = session?.user || null;

      if (state.user) {
        await loadOrCreateProfile();
        await bootRewards(state.contentData);
        await loadManagedContent();
        await loadRemoteProgress();
      } else {
        /* Fired automatically after lkp-signout.js calls supabase.auth.signOut() */
        state.profile = null;
        state.isAdmin = false;
        await bootRewards(state.contentData);
        await loadManagedContent();
      }

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();