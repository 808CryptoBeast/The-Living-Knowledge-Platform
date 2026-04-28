/* ═══════════════════════════════════════════════════════════════════════════
   PIKOVERSE PROFILE — Wayfinder Passport
   Shared profile for Pikoverse / Ikeverse / Digitalverse / Culturalverse / LKP

   IMPORTANT:
   Replace SUPABASE_URL and SUPABASE_ANON_KEY with your real Supabase values.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://fmrjdvsqdfyaqtzwbbqi.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcmpkdnNxZGZ5YXF0endiYnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTE2MzYsImV4cCI6MjA5MTE2NzYzNn0.UKyvX02bG4cNhb7U2TK96t8XFREHYYwHJIKbPK06nqs';

  const PROFILE_CACHE_KEY = 'piko_profile_v1';
  const COMPLETED_KEY = 'cv_completed';
  const MANA_KEY = 'cv_mana';

  const isSupabaseConfigured =
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('PASTE_YOUR') &&
    !SUPABASE_ANON_KEY.includes('PASTE_YOUR');

  const supabaseClient =
    isSupabaseConfigured && window.supabase
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

  const realmDescriptions = {
    pikoverse:
      'Pikoverse is the main gateway: projects, marketplace, showcase, identity, and the central hub for everything you are building.',
    ikeverse:
      'Ikeverse is the living learning world for culture, history, ancestral knowledge, and deep systems of understanding.',
    digitalverse:
      'Digitalverse is the technology learning realm: AI, blockchain, XR, Web3, cryptography, and emerging digital tools.',
    culturalverse:
      'Culturalverse is the deep cultural study layer: moʻolelo, cosmology, protocols, living traditions, and cross-cultural respect.',
    lkp:
      'The Living Knowledge Platform turns lessons into constellations, using star maps, galaxies, and shared learning paths.',
    ikestar:
      'IkeStar focuses on celestial knowledge, star navigation, astronomy, and sky-based learning across traditions.'
  };

  const ecosystemItems = [
    {
      id: 'pikoverse',
      name: 'Pikoverse',
      desc: 'Main hub, showcase, marketplace, and ecosystem identity.',
      href: 'https://www.pikoverse.xyz',
      color: '#f0c96a'
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
      id: 'lkp',
      name: 'Living Knowledge',
      desc: 'The star-map lesson library and constellation platform.',
      href: 'lessons.html',
      color: '#f0c96a'
    },
    {
      id: 'ikestar',
      name: 'IkeStar',
      desc: 'Celestial knowledge, astronomy, navigation, and sky lore.',
      href: 'https://808cryptobeast.github.io/Ikestar/',
      color: '#54c6ee'
    },
    {
      id: 'admin',
      name: 'Admin Deck',
      desc: 'Owner/admin controls for lessons, pages, users, and assets.',
      href: 'admin.html',
      color: '#ffdf8a',
      adminOnly: true
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
      raycaster: null,
      pointer: null,
      nodes: [],
      frameId: null
    }
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return [...document.querySelectorAll(selector)];
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
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
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
    const clean = String(name || 'Piko Wayfinder')
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim();

    const parts = clean.split(/\s+/).filter(Boolean);

    if (!parts.length) return 'PW';
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
      violet: '#8fa0ff'
    };

    return map[theme] || '#54c6ee';
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#ffffff').replace('#', '');
    const full = clean.length === 3
      ? clean.split('').map(c => c + c).join('')
      : clean;

    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    return `rgba(${r},${g},${b},${alpha})`;
  }

  function getLessonData() {
    let data = null;

    if (
      window.CULTURALVERSE_DATA &&
      Array.isArray(window.CULTURALVERSE_DATA.cultures)
    ) {
      data = window.CULTURALVERSE_DATA;
    } else if (
      typeof CULTURALVERSE_DATA !== 'undefined' &&
      CULTURALVERSE_DATA &&
      Array.isArray(CULTURALVERSE_DATA.cultures)
    ) {
      data = CULTURALVERSE_DATA;
      window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
    } else {
      data = { cultures: [] };
    }

    const lessons = [];

    data.cultures.forEach(culture => {
      const modules = Array.isArray(culture.modules) ? culture.modules : [];

      modules.forEach(module => {
        const moduleLessons = Array.isArray(module.lessons) ? module.lessons : [];

        moduleLessons.forEach(lesson => {
          lessons.push({
            cultureId: culture.id,
            cultureName: culture.name,
            cultureEmoji: culture.emoji || '✦',
            cultureTheme: culture.theme || 'default',
            moduleId: module.id,
            moduleTitle: module.title || 'Module',
            moduleEmoji: module.emoji || culture.emoji || '✦',
            id: lesson.id,
            num: lesson.num || '',
            title: lesson.title || lesson.id,
            readTime: lesson.readTime || '',
            content: lesson.content || ''
          });
        });
      });
    });

    return lessons;
  }

  async function init() {
    state.completed = readJSON(COMPLETED_KEY, []);
    state.mana = parseInt(localStorage.getItem(MANA_KEY) || '0', 10) || 0;
    state.lessons = getLessonData();

    bindUI();
    populateCultureFilter();
    renderProfileFromCache();
    renderDashboard();
    renderEcosystem();
    renderLessonPath();
    initProfileGalaxy();

    if (!supabaseClient) {
      setSessionState(
        'Supabase is not configured yet. Guest/local profile mode is active.',
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
        await loadRemoteProgress();
      } else {
        state.profile = null;
        state.isAdmin = false;
      }

      renderDashboard();
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

      const lessonId = btn.dataset.toggleComplete;
      await toggleLessonComplete(lessonId);
    });

    $('#realmWheel')?.addEventListener('click', event => {
      const btn = event.target.closest('[data-realm]');
      if (!btn) return;

      $all('#realmWheel [data-realm]').forEach(el => {
        el.classList.toggle('is-active', el === btn);
      });

      const realm = btn.dataset.realm;
      const desc = $('#realmDescription');

      if (desc) {
        desc.textContent = realmDescriptions[realm] || 'This realm is connected to your profile.';
      }
    });
  }

  function setSessionState(message, tone = '') {
    const el = $('#profileSessionState');
    if (!el) return;

    el.classList.remove('is-good', 'is-warning');

    if (tone === 'good') el.classList.add('is-good');
    if (tone === 'warning') el.classList.add('is-warning');

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
        await loadRemoteProgress();
      } else {
        setSessionState('Not signed in. Guest/local profile mode is active.', 'warning');
      }

      renderDashboard();
      renderEcosystem();
      renderLessonPath();
    } catch (err) {
      console.error(err);
      setSessionState('Could not load Supabase session. Guest mode active.', 'warning');
    }
  }

  async function signIn() {
    if (!supabaseClient) {
      showToast('Add your Supabase URL and anon key in profile.js first.');
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
      await loadRemoteProgress();

      renderDashboard();
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
      showToast('Add your Supabase URL and anon key in profile.js first.');
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

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
            handle: normalizeHandle(displayName || email.split('@')[0])
          }
        }
      });

      if (error) throw error;

      state.user = data.user || null;
      state.session = data.session || null;

      if (state.user) {
        await loadOrCreateProfile();
      }

      renderDashboard();
      renderEcosystem();
      renderLessonPath();

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
      await loadRemoteProgress();
      renderDashboard();
      renderLessonPath();
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

        const newProfile = {
          id: user.id,
          email: user.email,
          display_name: displayName,
          handle: normalizeHandle(user.user_metadata?.handle || displayName),
          role: 'user',
          home_realm: 'pikoverse',
          preferences: {},
          ecosystem_access: {}
        };

        const { data: inserted, error: insertError } = await supabaseClient
          .from('profiles')
          .insert(newProfile)
          .select('*')
          .single();

        if (insertError) throw insertError;

        profile = inserted;
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

      const remoteMana = (data || []).reduce((sum, row) => sum + (row.mana || 0), 0);

      if (remoteMana > state.mana) {
        state.mana = remoteMana;
        localStorage.setItem(MANA_KEY, String(remoteMana));
      }
    } catch (err) {
      console.warn('[Profile] Could not load remote progress:', err.message);
    }
  }

  async function saveRemoteProgress(lessonId, completed) {
    if (!supabaseClient || !state.user) return;

    try {
      const payload = {
        user_id: state.user.id,
        lesson_id: lessonId,
        ecosystem: 'lkp',
        completed,
        mana: completed ? 10 : 0
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
    const homeRealm = $('#editHomeRealm')?.value || 'pikoverse';
    const avatarUrl = $('#editAvatarUrl')?.value.trim();
    const bio = $('#editBio')?.value.trim();

    const localProfile = {
      ...(state.profile || readJSON(PROFILE_CACHE_KEY, {}) || {}),
      display_name: displayName || 'Guest Wayfinder',
      handle,
      home_realm: homeRealm,
      avatar_url: avatarUrl,
      bio,
      role: state.profile?.role || 'user'
    };

    if (!state.user || !supabaseClient) {
      state.profile = localProfile;
      writeJSON(PROFILE_CACHE_KEY, localProfile);

      renderDashboard();
      showToast('Saved locally. Sign in with Supabase to sync.');
      return;
    }

    try {
      const payload = {
        id: state.user.id,
        email: state.user.email,
        display_name: displayName || state.user.email?.split('@')[0],
        handle,
        home_realm: homeRealm,
        avatar_url: avatarUrl,
        bio
      };

      const { data, error } = await supabaseClient
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select('*')
        .single();

      if (error) throw error;

      state.profile = data;
      state.isAdmin = ['admin', 'owner'].includes(data.role);

      writeJSON(PROFILE_CACHE_KEY, data);

      renderDashboard();
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

    if (currentlyDone) {
      state.completed = state.completed.filter(id => id !== lessonId);
      state.mana = Math.max(0, state.mana - 10);
      await saveRemoteProgress(lessonId, false);
    } else {
      state.completed = [...new Set([...state.completed, lessonId])];
      state.mana += 10;
      await saveRemoteProgress(lessonId, true);
    }

    writeJSON(COMPLETED_KEY, state.completed);
    localStorage.setItem(MANA_KEY, String(state.mana));

    renderDashboard();
    renderLessonPath();

    showToast(currentlyDone ? 'Lesson marked open.' : 'Lesson completed. +10 mana.');
  }

  function renderProfileFromCache() {
    const cached = readJSON(PROFILE_CACHE_KEY, null);

    if (cached && !state.profile) {
      state.profile = cached;
      state.isAdmin = ['admin', 'owner'].includes(cached.role);
    }
  }

  function renderDashboard() {
    const profile = state.profile || {};
    const completed = state.completed || [];
    const totalLessons = state.lessons.length;

    const progress = totalLessons
      ? Math.min(100, Math.round((completed.length / totalLessons) * 100))
      : 0;

    const displayName =
      profile.display_name ||
      profile.name ||
      profile.handle ||
      state.user?.email ||
      'Guest Wayfinder';

    const handle =
      profile.handle ||
      normalizeHandle(displayName) ||
      'guest';

    const role = profile.role || (state.user ? 'user' : 'guest');
    const isAdmin = ['admin', 'owner'].includes(role) && !!state.user;

    state.isAdmin = isAdmin;

    $('#profileDisplayName').textContent = displayName;
    $('#profileHandleLine').textContent = `@${handle}`;
    $('#profileRoleLine').textContent = isAdmin
      ? `${role.toUpperCase()} · upgraded command profile`
      : state.user
        ? 'Signed-in wayfinder profile'
        : 'Guest/local profile mode';

    $('#passportRoleChip').textContent = isAdmin
      ? role.toUpperCase()
      : state.user
        ? 'USER'
        : 'GUEST';

    $('#profileAvatarInitials').textContent = initialsFromName(displayName);

    const avatar = $('#profileAvatar');

    if (avatar) {
      if (profile.avatar_url) {
        avatar.style.backgroundImage = `
          linear-gradient(rgba(1,3,10,0.12), rgba(1,3,10,0.12)),
          url("${profile.avatar_url}")
        `;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
      } else {
        avatar.style.backgroundImage = '';
      }
    }

    $('#statCompleted').textContent = completed.length;
    $('#statMana').textContent = state.mana;
    $('#statLessons').textContent = totalLessons;
    $('#statProgress').textContent = `${progress}%`;

    const ring = $('#passportRingProgress');
    if (ring) {
      const circumference = 314;
      ring.style.strokeDashoffset = String(circumference - (circumference * progress) / 100);
    }

    $('#editDisplayName').value = profile.display_name || '';
    $('#editHandle').value = profile.handle || '';
    $('#editHomeRealm').value = profile.home_realm || 'pikoverse';
    $('#editAvatarUrl').value = profile.avatar_url || '';
    $('#editBio').value = profile.bio || '';

    $('#profileSignOutBtn')?.classList.toggle('is-hidden', !state.user);
    $('#adminPanel')?.classList.toggle('is-hidden', !isAdmin);

    renderBadges(progress, isAdmin, role);
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
      cultures.set(lesson.cultureId, lesson.cultureName);
    });

    const options = [...cultures.entries()]
      .map(([id, name]) => `<option value="${escapeHTML(id)}">${escapeHTML(name)}</option>`)
      .join('');

    select.innerHTML = `<option value="all">All Cultures</option>${options}`;
  }

  function renderEcosystem() {
    const grid = $('#ecosystemGrid');
    if (!grid) return;

    grid.innerHTML = ecosystemItems
      .filter(item => !item.adminOnly || state.isAdmin)
      .map(item => `
        <a class="ecosystem-card"
           href="${item.href}"
           ${item.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}
           style="--eco-color:${item.color};--eco-bg:${hexToRgba(item.color, 0.10)};--eco-border:${hexToRgba(item.color, 0.26)}">
          <strong>${escapeHTML(item.name)}</strong>
          <span>${escapeHTML(item.desc)}</span>
          <small>Open →</small>
        </a>
      `).join('');
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
          lesson.content
        ].join(' ').toLowerCase().includes(q);
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
          loads before <strong>profile.js</strong>.
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
      const color = themeColor(lesson.cultureTheme);
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

  /* ────────────────────────────────────────────────────────────────────────
     THREE.JS PROFILE GALAXY
  ──────────────────────────────────────────────────────────────────────── */

  async function initProfileGalaxy() {
    const canvas = $('#profileGalaxy');
    if (!canvas || state.three.initialized) return;

    const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    const { OrbitControls } = await import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js');

    state.three.THREE = THREE;
    state.three.initialized = true;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x01030a, 0.028);

    const camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      260
    );

    camera.position.set(0, 12, 48);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.rotateSpeed = 0.35;
    controls.zoomSpeed = 0.55;
    controls.minDistance = 24;
    controls.maxDistance = 82;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;

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

    window.addEventListener('resize', resizeProfileGalaxy, { passive: true });

    function animate() {
      state.three.frameId = requestAnimationFrame(animate);

      const t = performance.now() * 0.001;

      state.three.nodes.forEach((node, index) => {
        node.mesh.rotation.y += 0.006;
        node.mesh.rotation.x = Math.sin(t + index * 0.41) * 0.08;
        node.mesh.position.y = node.baseY + Math.sin(t + index * 0.55) * 0.12;

        if (node.glow) {
          node.glow.material.opacity = 0.25 + Math.sin(t * 1.3 + index) * 0.08;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }

  function clearIdentityGalaxy() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;

    if (!THREE || !scene) return;

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
      if (child.geometry) child.geometry.dispose?.();
      if (child.material) child.material.dispose?.();
    });
  }

  function rebuildProfileGalaxyForRole() {
    if (!state.three.initialized) return;

    clearIdentityGalaxy();
    buildIdentityGalaxy();
  }

  function buildIdentityGalaxy() {
    const THREE = state.three.THREE;
    const scene = state.three.scene;

    if (!THREE || !scene) return;

    const bgCount = 1100;
    const positions = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
      const r = 52 + Math.random() * 88;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const bg = new THREE.Points(
      bgGeo,
      new THREE.PointsMaterial({
        size: 0.11,
        color: 0xdbefff,
        transparent: true,
        opacity: 0.62,
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

    const coreGlow = makeGlowSprite(state.isAdmin ? '#ffdf8a' : '#f0c96a', state.isAdmin ? 8 : 6, state.isAdmin ? 0.42 : 0.32);
    coreGlow.userData.profileGalaxyGenerated = true;
    scene.add(coreGlow);

    state.three.nodes.push({
      mesh: core,
      glow: coreGlow,
      baseY: 0
    });

    const items = ecosystemItems.filter(item => !item.adminOnly || state.isAdmin);
    const radius = state.isAdmin ? 13 : 11;

    items.forEach((item, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / items.length;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 2) * 1.4;

      const color = new THREE.Color(item.color);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(item.adminOnly ? 0.52 : 0.36, 22, 22),
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

      const glow = makeGlowSprite(item.color, item.adminOnly ? 3.1 : 2.0, item.adminOnly ? 0.52 : 0.28);
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

      state.three.nodes.push({
        mesh,
        glow,
        label,
        line,
        item,
        baseY: y
      });
    });

    addOrbitLine(radius, '#f0c96a', 0.06);
    addOrbitLine(radius * 0.62, '#54c6ee', 0.045);
  }

  function addOrbitLine(radius, color, opacity) {
    const THREE = state.three.THREE;
    const scene = state.three.scene;

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

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  document.addEventListener('DOMContentLoaded', init);
})();