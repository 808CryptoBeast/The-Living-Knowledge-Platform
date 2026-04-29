/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Wayfinder Passport
   File: LKP/js/profile.js
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SUPABASE_URL =
    window.LKP_SUPABASE_URL ||
    'https://fmrjdvsqdfyaqtzwbbqi.supabase.co';

  const SUPABASE_ANON_KEY =
    window.LKP_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcmpkdnNxZGZ5YXF0endiYnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTE2MzYsImV4cCI6MjA5MTE2NzYzNn0.UKyvX02bG4cNhb7U2TK96t8XFREHYYwHJIKbPK06nqs';

  const PROFILE_CACHE_KEY = 'lkp_profile_v1';
  const LEGACY_PROFILE_CACHE_KEY = 'piko_profile_v1';
  const COMPLETED_KEY = 'cv_completed';
  const MANA_KEY = 'cv_mana';

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

  const state = {
    session: null,
    user: null,
    profile: null,
    isAdmin: false,
    completed: [],
    mana: 0,
    lessons: [],
    contentData: null,
    /* ── NEW: tracks whether the Supabase session check has fully resolved ── */
    sessionReady: false,
    filters: {
      search: '',
      culture: 'all',
      status: 'all'
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
      resizeObserver: null
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
        window.LKPRewards.init({ data: state.contentData });

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

  /* ── INIT ──────────────────────────────────────────────────────────────────
     FIX: body gets 'profile-loading' immediately so the layout is hidden while
     the async Supabase session check runs. This prevents the layout from
     rendering in guest mode and then snapping to signed-in mode (or vice versa).
     'profile-loading' is removed inside loadSession() via a finally block.
  ──────────────────────────────────────────────────────────────────────────── */
  async function init() {
    /* Hide the layout immediately — we reveal it once session is confirmed */
    document.body.classList.add('profile-loading');

    state.completed = readJSON(COMPLETED_KEY, []);
    state.mana = parseInt(localStorage.getItem(MANA_KEY) || '0', 10) || 0;

    hydrateLessonsFromData(getStaticContentData());

    bindUI();
    populateCultureFilter();
    renderProfileFromCache();

    /* Render non-layout UI (stats, lesson list, ecosystem links) without
       committing layout-altering body classes yet */
    renderRewardsPanel();
    renderEcosystem();
    renderLessonPath();

    await initProfileGalaxy();
    await setupSupabaseClient();

    if (!supabaseClient) {
      /* No Supabase — reveal layout in guest mode immediately */
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

    /* loadSession() removes 'profile-loading' in its finally block */
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
    $all('[data-scroll-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.querySelector(btn.dataset.scrollTarget);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  /* ── loadSession ───────────────────────────────────────────────────────────
     FIX: 'profile-loading' is always removed here via finally{}, regardless
     of whether the session check succeeds or fails. The layout then fades in
     with the correct classes already applied — no visible snap.
  ──────────────────────────────────────────────────────────────────────────── */
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
      /* Always reveal the layout once session state is known */
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
        const summary = window.LKPRewards.getProfileSummary?.({ recalculate: true });

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

      rewardSummary = window.LKPRewards.getProfileSummary?.({ recalculate: true });

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

        const rewardSummary = window.LKPRewards.getProfileSummary?.({ recalculate: true });

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
      summary = window.LKPRewards.getProfileSummary?.({ recalculate: true });
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
      next ? `Next: ${next.name} at ${next.minMana} Mana` : 'Highest rank reached'
    );

    setText('#rewardRankProgress', `${rankProgress}%`);

    const bar = $('#rewardRankBar');
    if (bar) bar.style.width = `${rankProgress}%`;

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
    badges.push({ icon: '◈', label: state.user ? 'Synced Profile' : 'Guest Mode' });

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
      list.innerHTML = `<div class="profile-note">No lessons match your current filter.</div>`;
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

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x01030a, 0.026);

      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 260);
      camera.position.set(0, 11, 44);

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
      controls.rotateSpeed = 0.35;
      controls.zoomSpeed = 0.55;
      controls.minDistance = 22;
      controls.maxDistance = 76;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.28;

      scene.add(new THREE.AmbientLight(0xffffff, 0.42));

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

      buildIdentityGalaxy();
      resizeProfileGalaxy();

      window.addEventListener('resize', resizeProfileGalaxy, { passive: true });

      const holder = getGalaxyHolder();
      if (holder && 'ResizeObserver' in window) {
        state.three.resizeObserver = new ResizeObserver(() => resizeProfileGalaxy());
        state.three.resizeObserver.observe(holder);
      }

      canvas.addEventListener('click', onProfileGalaxyClick);

      function animate() {
        state.three.frameId = requestAnimationFrame(animate);
        const t = performance.now() * 0.001;

        state.three.nodes.forEach((node, index) => {
          if (!node.mesh) return;

          node.mesh.rotation.y += 0.006;
          node.mesh.rotation.x = Math.sin(t + index * 0.41) * 0.08;
          node.mesh.position.y = node.baseY + Math.sin(t + index * 0.55) * 0.12;

          if (node.glow) {
            node.glow.position.copy(node.mesh.position);
            node.glow.material.opacity = 0.25 + Math.sin(t * 1.3 + index) * 0.08;
          }

          if (node.label) node.label.position.y = node.mesh.position.y + 1.35;
        });

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

  function onProfileGalaxyClick(event) {
    const THREE = state.three.THREE;
    const camera = state.three.camera;
    const scene = state.three.scene;

    if (!THREE || !camera || !scene) return;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);

    const meshes = state.three.nodes
      .map(node => node.mesh)
      .filter(mesh => mesh && mesh.userData?.href);

    const hits = raycaster.intersectObjects(meshes, false);
    if (!hits.length) return;

    const href = hits[0].object.userData.href;
    if (!href) return;

    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.href = href;
    }
  }

  function clearIdentityGalaxy() {
    const scene = state.three.scene;
    if (!scene) return;

    state.three.nodes.forEach(node => {
      if (node.mesh) scene.remove(node.mesh);
      if (node.glow) scene.remove(node.glow);
      if (node.label) scene.remove(node.label);
      if (node.line) scene.remove(node.line);
    });

    state.three.nodes = [];

    const removable = scene.children.filter(child => child.userData?.profileGalaxyGenerated);

    removable.forEach(child => {
      scene.remove(child);
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

    const bgCount = 850;
    const positions = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
      const r = 30 + Math.random() * 66;
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
        size: 0.10,
        color: 0xdbefff,
        transparent: true,
        opacity: 0.52,
        depthWrite: false
      })
    );

    bg.userData.profileGalaxyGenerated = true;
    scene.add(bg);

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(state.isAdmin ? 1.48 : 1.22, 1),
      new THREE.MeshPhysicalMaterial({
        color: state.isAdmin ? 0xffdf8a : 0xf0c96a,
        emissive: state.isAdmin ? 0xffdf8a : 0xf0c96a,
        emissiveIntensity: state.isAdmin ? 0.9 : 0.65,
        metalness: 0.08,
        roughness: 0.18,
        transparent: true,
        opacity: 0.95
      })
    );

    core.userData.profileGalaxyGenerated = true;
    scene.add(core);

    const coreGlow = makeGlowSprite(
      state.isAdmin ? '#ffdf8a' : '#f0c96a',
      state.isAdmin ? 8 : 6,
      state.isAdmin ? 0.42 : 0.32
    );

    coreGlow.userData.profileGalaxyGenerated = true;
    scene.add(coreGlow);

    state.three.nodes.push({ mesh: core, glow: coreGlow, baseY: 0 });

    const items = ecosystemItems.filter(item => !item.adminOnly || state.isAdmin);
    const radius = state.isAdmin ? 12 : 10.5;

    items.forEach((item, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 2) * 1.35;
      const color = new THREE.Color(item.color);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(item.adminOnly ? 0.52 : 0.38, 22, 22),
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: item.adminOnly ? 0.95 : 0.55,
          metalness: 0.08,
          roughness: 0.24,
          transparent: true,
          opacity: item.adminOnly ? 0.98 : 0.9
        })
      );

      mesh.position.set(x, y, z);
      mesh.userData.profileGalaxyGenerated = true;
      mesh.userData.href = item.href;
      mesh.userData.name = item.name;

      const glow = makeGlowSprite(
        item.color,
        item.adminOnly ? 3.1 : 2.0,
        item.adminOnly ? 0.52 : 0.28
      );

      glow.position.copy(mesh.position);
      glow.userData.profileGalaxyGenerated = true;

      const label = makeTextSprite(item.name, item.color);
      label.position.set(x, y + 1.35, z);
      label.scale.set(4.2, 1, 1);
      label.userData.profileGalaxyGenerated = true;

      scene.add(mesh);
      scene.add(glow);
      scene.add(label);

      const line = makeCurveLine(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.45, y + 2.4, z * 0.45),
        new THREE.Vector3(x, y, z),
        item.color,
        item.adminOnly ? 0.24 : 0.13
      );

      line.userData.profileGalaxyGenerated = true;
      scene.add(line);

      state.three.nodes.push({ mesh, glow, label, line, item, baseY: y });
    });

    addOrbitLine(radius, '#f0c96a', 0.065);
    addOrbitLine(radius * 0.62, '#54c6ee', 0.048);
  }

  function addOrbitLine(radius, color, opacity) {
    const THREE = state.three.THREE;
    const scene = state.three.scene;
    if (!THREE || !scene) return;

    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false
      })
    );

    line.userData.profileGalaxyGenerated = true;
    scene.add(line);
  }

  function makeCurveLine(a, b, c, color, opacity) {
    const THREE = state.three.THREE;
    const curve = new THREE.CatmullRomCurve3([a, b, c]);

    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(44)),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity
      })
    );
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

    return new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      })
    );
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