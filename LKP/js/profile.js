/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Wayfinder Passport
   File: LKP/js/profile.js

   Handles:
   - Supabase auth/session
   - Profile loading/saving
   - Lesson progress
   - Mana/reward UI
   - Time-of-day cosmic background
   - Dark / light mode
   - Three.js Knowledge Galaxy
   - Sun core, realm orbits, realm nebulae, moons/mini-planets
   - Hover tooltip, click-to-focus realm card, return-to-orbit controls
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SUPABASE_URL =
    window.LKP_SUPABASE_URL ||
    'https://fmrjdvsqdfyaqtzwbbqi.supabase.co';

  const SUPABASE_ANON_KEY =
    window.LKP_SUPABASE_ANON_KEY ||
    'PASTE_YOUR_CORRECT_SUPABASE_ANON_KEY_HERE';

  const PROFILE_CACHE_KEY = 'lkp_profile_v1';
  const LEGACY_PROFILE_CACHE_KEY = 'piko_profile_v1';
  const COMPLETED_KEY = 'cv_completed';
  const MANA_KEY = 'cv_mana';

  const THEME_KEY = 'lkp_profile_theme';
  const BACKGROUND_VARIANT_KEY = 'lkp_profile_bg_variant';
  const BACKGROUND_ROTATION_MS = 90000;

  const isSupabaseConfigured =
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('PASTE_YOUR') &&
    !SUPABASE_ANON_KEY.includes('PASTE_YOUR');

  let supabaseClient = null;

  const realmDescriptions = {
    lkp:
      'The Living Knowledge Platform turns lessons into constellations, using star maps, galaxies, rewards, and shared learning paths.',
    ikeverse:
      'Ikeverse is the living learning world for culture, history, ancestral knowledge, and deep systems of understanding.',
    digitalverse:
      'Digitalverse is the technology learning realm: AI, blockchain, XR, Web3, cryptography, and emerging digital tools.',
    culturalverse:
      'Culturalverse is the deep cultural study layer: moʻolelo, cosmology, protocols, living traditions, and cross-cultural respect.',
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
      desc: 'Main learning hub, lesson galaxy, culture registry, rewards, and Wayfinder Passport.',
      href: 'index.html',
      color: '#f0c96a'
    },
    {
      id: 'lessons',
      name: 'Deep Lessons',
      desc: 'The full cultural lesson library and constellation learning path.',
      href: 'lessons.html',
      color: '#54c6ee'
    },
    {
      id: 'admin',
      name: 'Admin Deck',
      desc: 'Owner/admin controls for lessons, galaxies, cultures, modules, sources, and publishing.',
      href: 'admin.html',
      color: '#ffdf8a',
      adminOnly: true
    },
    {
      id: 'ikehub',
      name: 'IkeHub',
      desc: 'The portal hub connecting every application and realm.',
      href: 'https://808cryptobeast.github.io/ikehub/',
      color: '#54c6ee'
    },
    {
      id: 'ikeverse',
      name: 'Ikeverse',
      desc: 'Ancestral knowledge, living cultures, and learning systems.',
      href: 'https://808cryptobeast.github.io/Ikeverse/',
      color: '#3cb371'
    },
    {
      id: 'digitalverse',
      name: 'Digitalverse',
      desc: 'AI, blockchain, Web3, XR, smart systems, and future tech.',
      href: '#digitalverse',
      color: '#8fa0ff'
    },
    {
      id: 'culturalverse',
      name: 'Culturalverse',
      desc: 'Deep cultural study, cosmology, moʻolelo, and protocols.',
      href: 'https://808cryptobeast.github.io/culturalverse/',
      color: '#d98545'
    },
    {
      id: 'ikestar',
      name: 'IkeStar',
      desc: 'Celestial knowledge, astronomy, navigation, and sky lore.',
      href: 'https://808cryptobeast.github.io/Ikestar/',
      color: '#54c6ee'
    },
    {
      id: 'pikoverse',
      name: 'Pikoverse',
      desc: 'Wider project ecosystem, showcase, marketplace, and identity layer.',
      href: 'https://www.pikoverse.xyz',
      color: '#f0c96a'
    }
  ];

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
      frameId: null,
      resizeObserver: null,
      raycaster: null,
      pointer: null,
      hoveredNode: null,
      focusedNode: null,
      targetCameraPosition: null,
      targetControlTarget: null,
      defaultCameraPosition: null,
      defaultControlTarget: null
    }
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function setHTML(selector, value) {
    const el = $(selector);
    if (el) el.innerHTML = value;
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
    if (isDataImage(url)) return '';
    if (url.length > 2000) return '';

    return url;
  }

  function getThemeMeta() {
    return document.querySelector('meta[name="theme-color"]');
  }

  function syncThemeToggleLabel() {
    const label = $('#profileThemeToggleLabel');
    if (!label) return;

    label.textContent = state.visuals.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  function resolveTimePhase(date = new Date()) {
    const hour = date.getHours();

    if (hour >= 5 && hour < 10) return 'dawn';
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';

    return 'night';
  }

  function getBackgroundPalette(phase, variantIndex) {
    const set = backgroundPhasePalettes[phase] || backgroundPhasePalettes.night;
    const safeIndex = Math.abs(variantIndex) % set.length;

    return set[safeIndex];
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

    state.visuals.theme = nextTheme;
    state.visuals.timePhase = nextPhase;
    state.visuals.bgVariant = nextVariant;

    body.classList.toggle('profile-theme-dark', nextTheme === 'dark');
    body.classList.toggle('profile-theme-light', nextTheme === 'light');
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
        palette.themeColor || (nextTheme === 'light' ? '#dbe9ff' : '#070b14')
      );
    }

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
      localStorage.setItem(BACKGROUND_VARIANT_KEY, String(nextVariant));
    } catch (err) {
      console.warn('[Profile] Could not persist theme/background:', err.message);
    }

    syncThemeToggleLabel();
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

    applyVisualEnvironment({
      theme: localStorage.getItem(THEME_KEY) || state.visuals.theme || 'dark',
      phase: resolveTimePhase(),
      variant: state.visuals.bgVariant
    });

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

  function getStaticContentData() {
    if (
      window.CULTURALVERSE_DATA &&
      Array.isArray(window.CULTURALVERSE_DATA.cultures)
    ) {
      return window.CULTURALVERSE_DATA;
    }

    if (
      typeof CULTURALVERSE_DATA !== 'undefined' &&
      CULTURALVERSE_DATA &&
      Array.isArray(CULTURALVERSE_DATA.cultures)
    ) {
      window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
      return CULTURALVERSE_DATA;
    }

    return { cultures: [] };
  }

  function normalizeContentData(data) {
    if (!data || !Array.isArray(data.cultures)) {
      return { cultures: [] };
    }

    return {
      ...data,
      cultures: data.cultures.map(culture => ({
        id: culture.id,
        name: culture.name,
        emoji: culture.emoji || '✦',
        theme: culture.theme || culture.culture_theme || 'default',
        colorHex: culture.colorHex || culture.color_hex || null,
        modules: Array.isArray(culture.modules)
          ? culture.modules.map(module => ({
              id: module.id,
              title: module.title || module.module_title || 'Module',
              emoji: module.emoji || module.module_emoji || culture.emoji || '✦',
              desc: module.desc || module.description || '',
              lessons: Array.isArray(module.lessons)
                ? module.lessons.map(lesson => ({
                    id: lesson.id,
                    num: lesson.num || lesson.lesson_num || '',
                    title: lesson.title || lesson.id,
                    readTime: lesson.readTime || lesson.read_time || '',
                    content: lesson.content || '',
                    leadText: lesson.leadText || lesson.lead_text || '',
                    excerpt: lesson.excerpt || '',
                    mana: lesson.mana || 10,
                    xp: lesson.xp || 25
                  }))
                : []
            }))
          : []
      }))
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
            cultureEmoji: culture.emoji || '✦',
            cultureTheme: culture.theme || 'default',
            cultureColor: culture.colorHex || themeColor(culture.theme),
            moduleId: module.id,
            moduleTitle: module.title || 'Module',
            moduleEmoji: module.emoji || culture.emoji || '✦',
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

  function hydrateLessonsFromData(data) {
    state.contentData = normalizeContentData(data);
    state.lessons = flattenLessons(state.contentData);

    if (window.LKPRewards && typeof window.LKPRewards.init === 'function') {
      try {
        window.LKPRewards.init({
          data: state.contentData
        });

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
    return supabaseClient;
  }

  async function loadManagedContent() {
    if (!supabaseClient) return false;

    try {
      const { data, error } = await supabaseClient.rpc('get_lkp_content', {
        public_only: !state.isAdmin
      });

      if (error) throw error;

      if (data && Array.isArray(data.cultures)) {
        hydrateLessonsFromData(data);
        populateCultureFilter();
        renderLessonPath();
        renderDashboard();
        renderRewardsPanel();
        return true;
      }
    } catch (err) {
      console.warn('[Profile] Supabase content load skipped:', err.message);
    }

    return false;
  }

  async function init() {
    document.body.classList.add('profile-loading');

    state.completed = readJSON(COMPLETED_KEY, []);
    state.mana = parseInt(localStorage.getItem(MANA_KEY) || '0', 10) || 0;

    hydrateLessonsFromData(getStaticContentData());

    bindUI();
    startBackgroundClock();
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

    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      state.session = session || null;
      state.user = session?.user || null;

      if (state.user) {
        await loadOrCreateProfile();
        await loadManagedContent();
        await loadRemoteProgress();
      } else {
        state.profile = null;
        state.isAdmin = false;
        await loadManagedContent();
      }

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();
    });
  }

  function bindUI() {
    $('#profileThemeToggleBtn')?.addEventListener('click', () => {
      const next = state.visuals.theme === 'dark' ? 'light' : 'dark';

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

    $('#profileSignOutBtn')?.addEventListener('click', async () => {
      await signOut();
    });

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

    $('#rewardCheckInBtn')?.addEventListener('click', () => {
      if (!window.LKPRewards) {
        showToast('Rewards engine is not loaded yet.');
        return;
      }

      const before = window.LKPRewards.getProfileSummary?.() || {};

      if (typeof window.LKPRewards.checkInToday === 'function') {
        window.LKPRewards.checkInToday();
      }

      const after = window.LKPRewards.getProfileSummary?.({
        recalculate: true
      }) || {};

      state.mana = after.mana || state.mana;
      localStorage.setItem(MANA_KEY, String(state.mana));

      renderDashboard();
      renderRewardsPanel();

      if (before.checkedInToday) {
        showToast('You already checked in today.');
      } else {
        showToast('Daily check-in complete. +5 Mana.');
      }
    });

    $('#profileGalaxyCloseBtn')?.addEventListener('click', clearGalaxyFocus);
    $('#profileGalaxyResetBtn')?.addEventListener('click', clearGalaxyFocus);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        clearGalaxyFocus();
      }
    });
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

  async function loadSession() {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;

      state.session = data.session || null;
      state.user = state.session?.user || null;

      if (state.user) {
        await loadOrCreateProfile();
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

    try {
      setSessionState('Signing in...');

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      state.session = data.session;
      state.user = data.user;

      await loadOrCreateProfile();
      await loadManagedContent();
      await loadRemoteProgress();

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();

      showToast('Signed in successfully.');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Sign-in failed.');
      setSessionState('Sign-in failed. Check your email/password.', 'warning');
    }
  }

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

    try {
      setSessionState('Creating profile...');

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
        await loadRemoteProgress();
      }

      renderDashboard();
      renderRewardsPanel();
      renderEcosystem();
      renderLessonPath();
      rebuildProfileGalaxyForRole();

      showToast('Profile created. Check email confirmation if Supabase requires it.');
    } catch (err) {
      console.error(err);
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

  async function syncNow() {
    if (!supabaseClient || !state.user) {
      showToast('Sign in first to sync your profile.');
      return;
    }

    try {
      await loadOrCreateProfile();
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

  async function loadRemoteProgress() {
    if (!supabaseClient || !state.user) return;

    try {
      const { data, error } = await supabaseClient
        .from('user_progress')
        .select('*')
        .eq('user_id', state.user.id)
        .eq('ecosystem', 'lkp')
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
      } else {
        const remoteMana = (data || []).reduce((sum, row) => {
          return sum + (row.mana || 0);
        }, 0);

        if (remoteMana > state.mana) {
          state.mana = remoteMana;
          localStorage.setItem(MANA_KEY, String(remoteMana));
        }
      }
    } catch (err) {
      console.warn('[Profile] Could not load remote progress:', err.message);
    }
  }

  async function saveRemoteProgress(lessonId, completed) {
    if (!supabaseClient || !state.user) return;

    try {
      const lesson = state.lessons.find(item => item.id === lessonId);

      const payload = {
        user_id: state.user.id,
        lesson_id: lessonId,
        ecosystem: 'lkp',
        completed,
        mana: completed ? (lesson?.mana || 10) : 0
      };

      const { error } = await supabaseClient
        .from('user_progress')
        .upsert(payload, {
          onConflict: 'user_id,lesson_id,ecosystem'
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

    if (avatarUrl && isDataImage(avatarUrl)) {
      showToast('Avatar URL cannot be a base64 image. Use a normal image path or hosted URL.');
      avatarUrl = '';
    }

    if (avatarUrl && avatarUrl.length > 2000) {
      showToast('Avatar URL is too long. Use a shorter hosted image URL or local file path.');
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

  async function toggleLessonComplete(lessonId) {
    const currentlyDone = state.completed.includes(lessonId);
    const shouldComplete = !currentlyDone;

    if (shouldComplete) {
      state.completed = [...new Set([...state.completed, lessonId])];
    } else {
      state.completed = state.completed.filter(id => id !== lessonId);
    }

    writeJSON(COMPLETED_KEY, state.completed);

    let rewardSummary = null;

    if (window.LKPRewards) {
      if (typeof window.LKPRewards.toggleLesson === 'function') {
        window.LKPRewards.toggleLesson(lessonId, shouldComplete);
      }

      rewardSummary = window.LKPRewards.getProfileSummary?.({
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

    await saveRemoteProgress(lessonId, shouldComplete);

    renderDashboard();
    renderRewardsPanel();
    renderLessonPath();

    showToast(
      shouldComplete
        ? `Lesson completed. ${rewardSummary?.rank?.current?.name ? `Rank: ${rewardSummary.rank.current.name}.` : '+ Mana.'}`
        : 'Lesson marked open.'
    );
  }

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
        ? `${role.toUpperCase()} · upgraded command profile`
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
      icon: '🌱',
      desc: 'Beginning the path of living knowledge.'
    };

    const next = summary.rank?.next || null;
    const rankProgress = summary.rank?.progressToNext ?? 100;

    setText('#rewardRankIcon', rank.icon || '🌱');
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
              <span>${badge.icon || '✦'}</span>
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
              <span>${escapeHTML(cert.subtitle || cert.type || 'Certificate')} · XRPL-ready future record</span>
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
      icon: '◈',
      label: state.user ? 'Synced Profile' : 'Guest Mode'
    });

    if (progress >= 10) badges.push({ icon: '🌱', label: 'Path Starter' });
    if (progress >= 25) badges.push({ icon: '🌊', label: 'Current Rider' });
    if (progress >= 50) badges.push({ icon: '⭐', label: 'Star Reader' });
    if (progress >= 75) badges.push({ icon: '🧭', label: 'Navigator' });
    if (progress >= 100) badges.push({ icon: '🌌', label: 'Constellation Keeper' });
    if (isAdmin) badges.push({ icon: '👑', label: `${role} Access` });

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
          <small>Open →</small>
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

    if (!state.lessons.length) {
      list.innerHTML = `
        <div class="profile-note">
          No lesson data found. Make sure <strong>LKP/js/lkp-data.js</strong>
          loads before <strong>profile.js</strong>, or that Supabase content is live.
        </div>
      `;
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
            <strong>${completed ? '✅ ' : ''}${escapeHTML(lesson.title)}</strong>
            <small>${escapeHTML(lesson.cultureName)} · ${escapeHTML(lesson.moduleTitle)} · ${escapeHTML(lesson.readTime || 'Lesson')}</small>
          </a>

          <button
            class="lesson-row__complete ${completed ? 'is-done' : ''}"
            type="button"
            data-toggle-complete="${escapeHTML(lesson.id)}"
          >
            ${completed ? 'Done' : 'Complete'}
          </button>

          <a class="lesson-row__open" href="lessons.html#${encodeURIComponent(lesson.id)}">→</a>
        </article>
      `;
    }).join('');
  }

  async function initProfileGalaxy() {
    const canvas = $('#profileGalaxy');
    if (!canvas || state.three.initialized) return;

    try {
      const THREE = await import('https://esm.sh/three@0.160.0');
      const { OrbitControls } = await import(
        'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js'
      );

      state.three.THREE = THREE;
      state.three.initialized = true;
      state.three.raycaster = new THREE.Raycaster();
      state.three.pointer = new THREE.Vector2();

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x01030a, 0.023);

      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 300);
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
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.rotateSpeed = 0.32;
      controls.zoomSpeed = 0.52;
      controls.minDistance = 24;
      controls.maxDistance = 88;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.23;

      scene.add(new THREE.AmbientLight(0xffffff, 0.42));

      const sunLight = new THREE.PointLight(0xffd36b, 3.2, 160);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);

      const goldLight = new THREE.PointLight(0xffdd9a, 2.2, 150);
      goldLight.position.set(0, 34, 24);
      scene.add(goldLight);

      const cyanLight = new THREE.PointLight(0x54c6ee, 1.5, 120);
      cyanLight.position.set(-30, 14, -26);
      scene.add(cyanLight);

      state.three.scene = scene;
      state.three.camera = camera;
      state.three.renderer = renderer;
      state.three.controls = controls;
      state.three.defaultCameraPosition = camera.position.clone();
      state.three.defaultControlTarget = controls.target.clone();

      buildIdentityGalaxy();
      resizeProfileGalaxy();

      window.addEventListener('resize', resizeProfileGalaxy, { passive: true });

      const holder = getGalaxyHolder();

      if (holder && 'ResizeObserver' in window) {
        state.three.resizeObserver = new ResizeObserver(() => resizeProfileGalaxy());
        state.three.resizeObserver.observe(holder);
      }

      canvas.addEventListener('click', onProfileGalaxyClick);
      canvas.addEventListener('pointermove', onProfileGalaxyPointerMove);
      canvas.addEventListener('pointerleave', () => {
        state.three.hoveredNode = null;
        hideGalaxyTooltip();
      });

      function animate() {
        state.three.frameId = requestAnimationFrame(animate);
        const t = performance.now() * 0.001;

        state.three.nodes.forEach((node, index) => {
          if (!node.mesh) return;

          if (node.isSun) {
            node.mesh.rotation.y += 0.0035;
            node.mesh.rotation.z += 0.0012;

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

            return;
          }

          const focusSlowdown = state.three.focusedNode ? 0.25 : 1;
          const angle = node.baseAngle + t * node.orbitSpeed * focusSlowdown;

          const pos = new THREE.Vector3(
            Math.cos(angle) * node.orbitRadius,
            0,
            Math.sin(angle) * node.orbitRadius
          );

          pos.applyEuler(
            new THREE.Euler(node.orbitTiltX || 0, 0, node.orbitTiltZ || 0)
          );

          pos.y += Math.sin(t * 1.15 + index * 0.7) * (node.verticalFloat || 0.12);

          node.mesh.position.copy(pos);
          node.mesh.rotation.y += node === state.three.focusedNode ? 0.009 : 0.005;
          node.mesh.rotation.x = Math.sin(t + index * 0.41) * 0.07;

          const selectedScale = node === state.three.focusedNode ? 1.32 : 1;
          node.mesh.scale.lerp(new THREE.Vector3(selectedScale, selectedScale, selectedScale), 0.08);

          if (node.glow) {
            node.glow.position.copy(pos);
            node.glow.material.opacity =
              (node.glow.userData.baseOpacity || 0.24) +
              Math.sin(t * 1.2 + index) * 0.05 +
              (node === state.three.focusedNode ? 0.12 : 0);
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
                  (node === state.three.focusedNode ? 0.03 : 0);
              }

              if (child.type === 'Points') {
                child.rotation.y += 0.0009;
                child.rotation.x += 0.0002;
              } else {
                child.rotation.z += 0.001;
              }
            });
          }

          if (node.satelliteSystem) {
            node.satelliteSystem.position.copy(pos);
          }

          if (node.satellitePivots && node.satellitePivots.length) {
            node.satellitePivots.forEach((pivot, pIndex) => {
              pivot.rotation.y += pivot.userData.speed || (0.01 + pIndex * 0.002);
              pivot.rotation.x += pivot.userData.wobble || 0.0006;
            });
          }

          if (node.label) {
            node.label.position.set(pos.x, pos.y + 1.45, pos.z);
            const labelScale = node === state.three.focusedNode ? 5.2 : 4.4;
            node.label.scale.lerp(new THREE.Vector3(labelScale, 1.15, 1), 0.08);
          }
        });

        updateFocusedCamera();

        controls.update();
        renderer.render(scene, camera);
      }

      animate();
    } catch (err) {
      console.warn('[Profile] Three.js profile galaxy failed to initialize:', err.message);
    }
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

  function setPointerFromEvent(event) {
    const THREE = state.three.THREE;
    const canvas = $('#profileGalaxy');
    const pointer = state.three.pointer;

    if (!THREE || !canvas || !pointer) return false;

    const rect = canvas.getBoundingClientRect();

    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    return true;
  }

  function getRealmNodes() {
    return state.three.nodes.filter(node => {
      return node && node.mesh && node.item && node.mesh.userData?.href;
    });
  }

  function getIntersectedRealmNode(event) {
    const THREE = state.three.THREE;
    const camera = state.three.camera;
    const raycaster = state.three.raycaster;
    const pointer = state.three.pointer;

    if (!THREE || !camera || !raycaster || !pointer) return null;
    if (!setPointerFromEvent(event)) return null;

    raycaster.setFromCamera(pointer, camera);

    const nodes = getRealmNodes();
    const meshes = nodes.map(node => node.mesh);
    const hits = raycaster.intersectObjects(meshes, false);

    if (!hits.length) return null;

    const hitMesh = hits[0].object;
    return nodes.find(node => node.mesh === hitMesh) || null;
  }

  function onProfileGalaxyPointerMove(event) {
    const node = getIntersectedRealmNode(event);

    if (!node) {
      state.three.hoveredNode = null;
      hideGalaxyTooltip();
      return;
    }

    state.three.hoveredNode = node;
    showGalaxyTooltip(node, event);
  }

  function onProfileGalaxyClick(event) {
    const node = getIntersectedRealmNode(event);

    if (!node) {
      clearGalaxyFocus();
      return;
    }

    focusRealmNode(node);
  }

  function showGalaxyTooltip(node, event) {
    const tooltip = $('#profileGalaxyTooltip');
    const holder = getGalaxyHolder();

    if (!tooltip || !holder || !node?.item) return;

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
    const tooltip = $('#profileGalaxyTooltip');
    if (!tooltip) return;

    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  function focusRealmNode(node) {
    const THREE = state.three.THREE;
    const camera = state.three.camera;
    const controls = state.three.controls;

    if (!THREE || !camera || !controls || !node?.item) return;

    state.three.focusedNode = node;
    controls.autoRotate = false;
    hideGalaxyTooltip();

    const nodePosition = new THREE.Vector3();
    node.mesh.getWorldPosition(nodePosition);

    const direction = nodePosition.clone().normalize();

    if (direction.lengthSq() < 0.0001) {
      direction.set(0, 0.22, 1).normalize();
    }

    const cameraDistance = 7.8;
    const cameraLift = new THREE.Vector3(0, 2.5, 0);

    state.three.targetControlTarget = nodePosition.clone();
    state.three.targetCameraPosition = nodePosition
      .clone()
      .add(direction.multiplyScalar(cameraDistance))
      .add(cameraLift);

    showGalaxySelection(node);
  }

  function showGalaxySelection(node) {
    const panel = $('#profileGalaxySelection');
    if (!panel || !node?.item) return;

    setText('#profileGalaxySelectionKicker', node.item.adminOnly ? 'Admin Realm' : 'Focused Realm');
    setText('#profileGalaxySelectionTitle', node.item.name);
    setText('#profileGalaxySelectionDesc', node.item.desc);

    const openLink = $('#profileGalaxySelectionOpen');

    if (openLink) {
      openLink.href = node.item.href || '#';
      openLink.style.setProperty('--realm-color', node.item.color);

      if (node.item.href && node.item.href.startsWith('http')) {
        openLink.target = '_blank';
        openLink.rel = 'noopener';
      } else {
        openLink.removeAttribute('target');
        openLink.removeAttribute('rel');
      }
    }

    panel.style.borderColor = hexToRgba(node.item.color, 0.36);
    panel.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
  }

  function clearGalaxyFocus() {
    const controls = state.three.controls;

    state.three.focusedNode = null;

    if (controls) {
      controls.autoRotate = true;
    }

    if (state.three.defaultCameraPosition) {
      state.three.targetCameraPosition = state.three.defaultCameraPosition.clone();
    }

    if (state.three.defaultControlTarget) {
      state.three.targetControlTarget = state.three.defaultControlTarget.clone();
    }

    const panel = $('#profileGalaxySelection');

    if (panel) {
      panel.classList.remove('is-visible');
      panel.setAttribute('aria-hidden', 'true');
    }
  }

  function updateFocusedCamera() {
    const THREE = state.three.THREE;
    const camera = state.three.camera;
    const controls = state.three.controls;

    if (!THREE || !camera || !controls) return;

    if (state.three.focusedNode?.mesh) {
      const nodePosition = new THREE.Vector3();
      state.three.focusedNode.mesh.getWorldPosition(nodePosition);

      const direction = nodePosition.clone().normalize();

      if (direction.lengthSq() < 0.0001) {
        direction.set(0, 0.22, 1).normalize();
      }

      state.three.targetControlTarget = nodePosition.clone();
      state.three.targetCameraPosition = nodePosition
        .clone()
        .add(direction.multiplyScalar(7.8))
        .add(new THREE.Vector3(0, 2.5, 0));
    }

    if (state.three.targetCameraPosition) {
      camera.position.lerp(state.three.targetCameraPosition, 0.055);
    }

    if (state.three.targetControlTarget) {
      controls.target.lerp(state.three.targetControlTarget, 0.055);

      if (
        !state.three.focusedNode &&
        camera.position.distanceTo(state.three.targetCameraPosition) < 0.08 &&
        controls.target.distanceTo(state.three.targetControlTarget) < 0.08
      ) {
        state.three.targetCameraPosition = null;
        state.three.targetControlTarget = null;
      }
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

  function clearIdentityGalaxy() {
    const scene = state.three.scene;
    if (!scene) return;

    hideGalaxyTooltip();

    const panel = $('#profileGalaxySelection');
    if (panel) {
      panel.classList.remove('is-visible');
      panel.setAttribute('aria-hidden', 'true');
    }

    state.three.focusedNode = null;
    state.three.hoveredNode = null;
    state.three.targetCameraPosition = null;
    state.three.targetControlTarget = null;

    state.three.nodes.forEach(node => {
      [
        node.mesh,
        node.glow,
        node.nebula,
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

  function buildIdentityGalaxy() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;

    if (!THREE || !scene) return;

    const bgCount = 1100;
    const positions = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
      const r = 34 + Math.random() * 78;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const bg = new THREE.Points(
      bgGeo,
      new THREE.PointsMaterial({
        size: 0.09,
        color: 0xdbefff,
        transparent: true,
        opacity: 0.56,
        depthWrite: false
      })
    );

    bg.userData.profileGalaxyGenerated = true;
    scene.add(bg);

    const sun = makeSunCore();
    sun.group.userData.profileGalaxyGenerated = true;
    scene.add(sun.group);

    state.three.nodes.push({
      mesh: sun.group,
      glow: sun.primaryGlow,
      extraObjects: sun.extras,
      baseY: 0,
      isSun: true
    });

    const items = ecosystemItems.filter(item => !item.adminOnly || state.isAdmin);
    const baseRadius = state.isAdmin ? 10.8 : 9.2;

    items.forEach((item, index) => {
      const color = new THREE.Color(item.color);

      const orbitRadius = baseRadius + (index % 4) * 2.15;
      const orbitTiltX = -0.34 + (index % 5) * 0.16;
      const orbitTiltZ = -0.22 + (index % 4) * 0.14;
      const orbitSpeed = 0.10 + (index % 3) * 0.022;
      const baseAngle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;

      const orbitLine = makeOrbitRing(
        orbitRadius,
        item.color,
        item.adminOnly ? 0.13 : 0.07,
        orbitTiltX,
        orbitTiltZ
      );

      orbitLine.userData.profileGalaxyGenerated = true;
      scene.add(orbitLine);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(item.adminOnly ? 0.62 : 0.48, 24, 24),
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: item.adminOnly ? 0.95 : 0.58,
          metalness: 0.07,
          roughness: 0.24,
          transparent: true,
          opacity: 0.95
        })
      );

      mesh.userData.profileGalaxyGenerated = true;
      mesh.userData.href = item.href;
      mesh.userData.name = item.name;

      const glow = makeGlowSprite(
        item.color,
        item.adminOnly ? 2.9 : 2.2,
        item.adminOnly ? 0.34 : 0.22
      );

      glow.userData.profileGalaxyGenerated = true;
      glow.userData.baseOpacity = item.adminOnly ? 0.34 : 0.22;

      const nebula = makeNebulaCluster(
        item.color,
        item.adminOnly ? 3.2 : 2.55,
        item.adminOnly ? 0.22 : 0.16
      );

      nebula.userData.profileGalaxyGenerated = true;

      const satellite = makeSatelliteSystem(item.color, item.adminOnly ? 2.2 : 1.7);
      satellite.group.userData.profileGalaxyGenerated = true;

      const label = makeTextSprite(item.name, item.color);
      label.scale.set(4.4, 1, 1);
      label.userData.profileGalaxyGenerated = true;

      scene.add(mesh);
      scene.add(glow);
      scene.add(nebula);
      scene.add(satellite.group);
      scene.add(label);

      state.three.nodes.push({
        mesh,
        glow,
        nebula,
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
        verticalFloat: 0.1 + (index % 2) * 0.04,
        baseY: 0
      });
    });
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

  function makeDustCloud(color, radius, count = 140, opacity = 0.16) {
    const THREE = state.three.THREE;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = radius * (0.2 + Math.random() * 0.9);
      const y = (Math.random() - 0.5) * radius * 0.55;
      const wobble = 0.75 + Math.random() * 0.6;

      positions[i * 3] = Math.cos(angle) * spread * wobble;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * spread;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: Math.max(0.045, radius * 0.03),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );

    dust.userData.profileGalaxyGenerated = true;
    dust.userData.baseOpacity = opacity;

    return dust;
  }

  function makeNebulaCluster(color, scale, opacity) {
    const group = new state.three.THREE.Group();

    const layers = [
      { x: -0.55, y: 0.18, z: 0.16, size: scale * 1.5, alpha: opacity * 0.85 },
      { x: 0.62, y: -0.12, z: -0.22, size: scale * 1.15, alpha: opacity * 0.72 },
      { x: 0.12, y: 0.36, z: -0.18, size: scale * 0.95, alpha: opacity * 0.58 },
      { x: -0.18, y: -0.38, z: 0.10, size: scale * 0.85, alpha: opacity * 0.50 }
    ];

    layers.forEach(layer => {
      const sprite = makeGlowSprite(color, layer.size, layer.alpha);
      sprite.position.set(layer.x, layer.y, layer.z);
      sprite.userData.baseOpacity = layer.alpha;
      group.add(sprite);
    });

    const dustA = makeDustCloud(color, scale * 1.2, 130, opacity * 0.65);
    dustA.userData.baseOpacity = opacity * 0.65;
    group.add(dustA);

    const dustB = makeDustCloud(color, scale * 0.8, 90, opacity * 0.42);
    dustB.rotation.x = Math.PI / 5;
    dustB.userData.baseOpacity = opacity * 0.42;
    group.add(dustB);

    const ringA = makeOrbitRing(scale * 0.8, color, opacity * 0.22, Math.PI / 3, Math.PI / 9);
    ringA.userData.baseOpacity = opacity * 0.22;
    group.add(ringA);

    const ringB = makeOrbitRing(scale * 1.05, color, opacity * 0.15, Math.PI / 6, -Math.PI / 5);
    ringB.userData.baseOpacity = opacity * 0.15;
    group.add(ringB);

    group.userData.profileGalaxyGenerated = true;

    return group;
  }

  function makeSatelliteSystem(color, radius = 1.8) {
    const THREE = state.three.THREE;
    const group = new THREE.Group();
    const pivots = [];
    const moonCount = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < moonCount; i++) {
      const orbitRadius = radius * (0.62 + i * 0.34);
      const orbitTiltX = (Math.PI / 10) * (i % 2 === 0 ? 1 : -1);
      const orbitTiltZ = (Math.PI / 8) * (i % 3 === 0 ? -1 : 1);

      const orbitRing = makeOrbitRing(
        orbitRadius,
        color,
        0.16,
        orbitTiltX,
        orbitTiltZ
      );

      group.add(orbitRing);

      const pivot = new THREE.Object3D();
      pivot.rotation.x = orbitTiltX;
      pivot.rotation.z = orbitTiltZ;
      pivot.userData.speed = 0.008 + i * 0.0025;
      pivot.userData.wobble = 0.0004 + i * 0.0002;

      const moonSize = 0.08 + i * 0.035;

      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(moonSize, 14, 14),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color).offsetHSL(0.03 * i, 0.03, 0.08),
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.28 + i * 0.06,
          roughness: 0.35,
          metalness: 0.06
        })
      );

      moon.position.set(orbitRadius, 0, 0);
      moon.userData.profileGalaxyGenerated = true;

      const moonGlow = makeGlowSprite(color, 0.55 + i * 0.22, 0.12 + i * 0.03);
      moonGlow.position.copy(moon.position);

      pivot.add(moon);
      pivot.add(moonGlow);
      group.add(pivot);
      pivots.push(pivot);
    }

    group.userData.profileGalaxyGenerated = true;

    return { group, pivots };
  }

  function makeSunCore() {
    const THREE = state.three.THREE;
    const group = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 30, 30),
      new THREE.MeshPhysicalMaterial({
        color: 0xffd36b,
        emissive: 0xffc247,
        emissiveIntensity: 1.25,
        roughness: 0.18,
        metalness: 0.04,
        transparent: true,
        opacity: 0.98
      })
    );

    core.userData.profileGalaxyGenerated = true;

    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(2.45, 26, 26),
      new THREE.MeshBasicMaterial({
        color: 0xffd36b,
        transparent: true,
        opacity: 0.08
      })
    );

    outer.userData.profileGalaxyGenerated = true;

    const innerGlow = makeGlowSprite('#ffd76d', 6.5, 0.44);
    innerGlow.userData.baseOpacity = 0.44;

    const outerGlow = makeGlowSprite('#ffb347', 10.5, 0.22);
    outerGlow.userData.baseOpacity = 0.22;

    const coronaDust = makeDustCloud('#ffd76d', 3.6, 220, 0.22);
    const coronaDust2 = makeDustCloud('#ffb347', 4.4, 170, 0.14);
    coronaDust2.rotation.x = Math.PI / 5;

    const coronaRingA = makeOrbitRing(3.0, '#ffd76d', 0.12, Math.PI / 6, Math.PI / 8);
    const coronaRingB = makeOrbitRing(3.8, '#ffb347', 0.08, -Math.PI / 5, Math.PI / 10);

    group.add(core);
    group.add(outer);
    group.add(innerGlow);
    group.add(outerGlow);
    group.add(coronaDust);
    group.add(coronaDust2);
    group.add(coronaRingA);
    group.add(coronaRingB);

    group.userData.profileGalaxyGenerated = true;

    return {
      group,
      primaryGlow: innerGlow,
      extras: [outerGlow, coronaDust, coronaDust2, coronaRingA, coronaRingB]
    };
  }

  function makeGlowSprite(color, size, opacity) {
    const THREE = state.three.THREE;

    const c = document.createElement('canvas');
    c.width = 96;
    c.height = 96;

    const ctx = c.getContext('2d');
    const col = new THREE.Color(color);

    const r = Math.round(col.r * 255);
    const g = Math.round(col.g * 255);
    const b = Math.round(col.b * 255);

    const grd = ctx.createRadialGradient(48, 48, 0, 48, 48, 48);
    grd.addColorStop(0, `rgba(${r},${g},${b},0.88)`);
    grd.addColorStop(0.45, `rgba(${r},${g},${b},0.22)`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 96, 96);

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

  function resizeProfileGalaxy() {
    const { renderer, camera } = state.three;

    if (!renderer || !camera) return;

    const { width, height } = getGalaxySize();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(width, height, false);
  }

  document.addEventListener('DOMContentLoaded', init);
})();