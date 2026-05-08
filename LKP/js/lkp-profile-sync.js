/* ═══════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — SUPABASE PROFILE SYNC
   File: LKP/js/lkp-profile-sync.js

   Purpose:
   - Make profile, mana, completed lessons, and reflections follow the user
     across devices after Supabase login.
═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const COMPLETED_KEY = 'cv_completed';
  const MANA_KEY = 'cv_mana';
  const REFLECTIONS_KEY = 'lkp_lesson_reflections_v2';

  const PROFILE_SYNC_EVENT = 'lkp:profile-sync-ready';

  const state = {
    supabase: null,
    user: null,
    profile: null,
    progress: [],
    reflections: {},
    ready: false
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('[LKP Profile Sync] localStorage write failed:', err);
    }
  }

  function getLocalCompleted() {
    const completed = readJSON(COMPLETED_KEY, []);
    return Array.isArray(completed) ? completed : [];
  }

  function setLocalCompleted(completed) {
    writeJSON(COMPLETED_KEY, [...new Set(completed.filter(Boolean))]);
  }

  function getLocalMana() {
    return Number(localStorage.getItem(MANA_KEY) || '0') || 0;
  }

  function setLocalMana(value) {
    localStorage.setItem(MANA_KEY, String(Math.max(0, Number(value) || 0)));
  }

  function getLocalReflections() {
    return readJSON(REFLECTIONS_KEY, {});
  }

  function setLocalReflections(value) {
    writeJSON(REFLECTIONS_KEY, value || {});
  }

  function getSupabaseClient() {
    if (state.supabase) return state.supabase;

    if (window.supabaseClient) {
      state.supabase = window.supabaseClient;
      return state.supabase;
    }

    if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
      state.supabase = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      );
      window.supabaseClient = state.supabase;
      return state.supabase;
    }

    console.warn(
      '[LKP Profile Sync] Supabase client not found. Make sure SUPABASE_URL, SUPABASE_ANON_KEY, and @supabase/supabase-js are loaded.'
    );

    return null;
  }

  async function getUser() {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.warn('[LKP Profile Sync] getUser failed:', error.message);
      return null;
    }

    state.user = data?.user || null;
    return state.user;
  }

  async function ensureProfile() {
    const supabase = getSupabaseClient();
    if (!supabase || !state.user) return null;

    const { data, error } = await supabase.rpc('ensure_profile');

    if (error) {
      console.warn('[LKP Profile Sync] ensure_profile failed:', error.message);

      const fallback = {
        id: state.user.id,
        email: state.user.email,
        display_name:
          state.user.user_metadata?.display_name ||
          state.user.email?.split('@')[0] ||
          'Wayfinder',
        handle:
          state.user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]+/g, '_') ||
          'wayfinder',
        home_realm: 'lkp'
      };

      const { data: upserted, error: upsertError } = await supabase
        .from('profiles')
        .upsert(fallback, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) {
        console.warn('[LKP Profile Sync] profile fallback upsert failed:', upsertError.message);
        return null;
      }

      state.profile = upserted;
      return upserted;
    }

    state.profile = data;
    return data;
  }

  async function loadCloudProgress() {
    const supabase = getSupabaseClient();
    if (!supabase || !state.user) return [];

    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', state.user.id);

    if (error) {
      console.warn('[LKP Profile Sync] loadCloudProgress failed:', error.message);
      return [];
    }

    state.progress = data || [];
    return state.progress;
  }

  async function loadCloudReflections() {
    const supabase = getSupabaseClient();
    if (!supabase || !state.user) return {};

    const { data, error } = await supabase
      .from('user_lesson_reflections')
      .select('*')
      .eq('user_id', state.user.id);

    if (error) {
      console.warn('[LKP Profile Sync] loadCloudReflections failed:', error.message);
      return {};
    }

    const grouped = {};

    (data || []).forEach(row => {
      if (!grouped[row.lesson_id]) grouped[row.lesson_id] = {};
      grouped[row.lesson_id][row.prompt_index] = row.response || '';
    });

    state.reflections = grouped;
    return grouped;
  }

  async function mergeLocalToCloud() {
    const supabase = getSupabaseClient();
    if (!supabase || !state.user) return;

    const localCompleted = getLocalCompleted();
    const localMana = getLocalMana();
    const localReflections = getLocalReflections();

    if (localCompleted.length) {
      const rows = localCompleted.map(lessonId => ({
        user_id: state.user.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        last_opened_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert(rows, { onConflict: 'user_id,lesson_id' });

      if (error) {
        console.warn('[LKP Profile Sync] local completed merge failed:', error.message);
      }
    }

    if (localMana > 0 && state.profile) {
      const nextMana = Math.max(Number(state.profile.mana || 0), localMana);

      const { error } = await supabase
        .from('profiles')
        .update({ mana: nextMana })
        .eq('id', state.user.id);

      if (error) {
        console.warn('[LKP Profile Sync] mana merge failed:', error.message);
      }
    }

    const reflectionRows = [];

    Object.entries(localReflections || {}).forEach(([lessonId, answers]) => {
      Object.entries(answers || {}).forEach(([promptIndex, response]) => {
        if (!String(response || '').trim()) return;

        reflectionRows.push({
          user_id: state.user.id,
          lesson_id: lessonId,
          prompt_index: Number(promptIndex),
          response: String(response || '')
        });
      });
    });

    if (reflectionRows.length) {
      const { error } = await supabase
        .from('user_lesson_reflections')
        .upsert(reflectionRows, { onConflict: 'user_id,lesson_id,prompt_index' });

      if (error) {
        console.warn('[LKP Profile Sync] reflection merge failed:', error.message);
      }
    }
  }

  async function pullCloudToLocal() {
    const cloudCompleted = state.progress
      .filter(row => row.status === 'completed')
      .map(row => row.lesson_id);

    const mergedCompleted = [
      ...new Set([...getLocalCompleted(), ...cloudCompleted])
    ];

    setLocalCompleted(mergedCompleted);

    if (state.profile) {
      setLocalMana(state.profile.mana || 0);
    }

    if (state.reflections) {
      const local = getLocalReflections();
      setLocalReflections({
        ...state.reflections,
        ...local
      });
    }
  }

  async function completeLesson(lesson) {
    const supabase = getSupabaseClient();

    if (!supabase || !state.user || !lesson?.id) {
      const local = getLocalCompleted();

      if (!local.includes(lesson.id)) {
        local.push(lesson.id);
        setLocalCompleted(local);
        setLocalMana(getLocalMana() + Number(lesson.mana || 10));
      }

      return {
        synced: false,
        completed: true
      };
    }

    const mana = Number(lesson.mana || 10);
    const xp = Number(lesson.xp || 25);

    const { error: progressError } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: state.user.id,
        lesson_id: lesson.id,
        culture_id: lesson.cultureId || null,
        module_id: lesson.moduleId || null,
        status: 'completed',
        mana_awarded: mana,
        xp_awarded: xp,
        completed_at: new Date().toISOString(),
        last_opened_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      });

    if (progressError) {
      console.warn('[LKP Profile Sync] completeLesson progress failed:', progressError.message);
      return {
        synced: false,
        completed: false,
        error: progressError
      };
    }

    const nextMana = Number(state.profile?.mana || 0) + mana;
    const nextXp = Number(state.profile?.xp || 0) + xp;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        mana: nextMana,
        xp: nextXp
      })
      .eq('id', state.user.id)
      .select()
      .single();

    if (!profileError && profile) {
      state.profile = profile;
      setLocalMana(profile.mana || nextMana);
    }

    const local = getLocalCompleted();

    if (!local.includes(lesson.id)) {
      local.push(lesson.id);
      setLocalCompleted(local);
    }

    await loadCloudProgress();

    window.dispatchEvent(new CustomEvent('lkp:cloud-progress-updated', {
      detail: {
        lesson,
        profile: state.profile,
        progress: state.progress
      }
    }));

    return {
      synced: true,
      completed: true
    };
  }

  async function saveReflection(lessonId, promptIndex, response, prompt) {
    const supabase = getSupabaseClient();

    const local = getLocalReflections();

    if (!local[lessonId]) local[lessonId] = {};
    local[lessonId][promptIndex] = response;
    setLocalReflections(local);

    if (!supabase || !state.user) {
      return {
        synced: false
      };
    }

    const { error } = await supabase
      .from('user_lesson_reflections')
      .upsert({
        user_id: state.user.id,
        lesson_id: lessonId,
        prompt_index: Number(promptIndex),
        prompt: prompt || null,
        response: response || ''
      }, {
        onConflict: 'user_id,lesson_id,prompt_index'
      });

    if (error) {
      console.warn('[LKP Profile Sync] saveReflection failed:', error.message);
      return {
        synced: false,
        error
      };
    }

    return {
      synced: true
    };
  }

  async function updateProfile(patch) {
    const supabase = getSupabaseClient();

    if (!supabase || !state.user) {
      return {
        data: null,
        error: new Error('Not signed in')
      };
    }

    const safePatch = {
      display_name: patch.display_name,
      handle: patch.handle,
      bio: patch.bio,
      avatar_url: patch.avatar_url,
      home_realm: patch.home_realm,
      preferences: patch.preferences
    };

    Object.keys(safePatch).forEach(key => {
      if (typeof safePatch[key] === 'undefined') delete safePatch[key];
    });

    const { data, error } = await supabase
      .from('profiles')
      .update(safePatch)
      .eq('id', state.user.id)
      .select()
      .single();

    if (!error && data) {
      state.profile = data;

      window.dispatchEvent(new CustomEvent('lkp:profile-updated', {
        detail: {
          profile: data
        }
      }));
    }

    return {
      data,
      error
    };
  }

  async function sync() {
    const user = await getUser();

    if (!user) {
      state.ready = false;
      window.dispatchEvent(new CustomEvent(PROFILE_SYNC_EVENT, {
        detail: {
          signedIn: false
        }
      }));
      return null;
    }

    await ensureProfile();

    /*
      First login after using local mode:
      push localStorage data into Supabase, then pull cloud truth back down.
    */
    await mergeLocalToCloud();
    await loadCloudProgress();
    await loadCloudReflections();
    await pullCloudToLocal();

    state.ready = true;

    window.dispatchEvent(new CustomEvent(PROFILE_SYNC_EVENT, {
      detail: {
        signedIn: true,
        user: state.user,
        profile: state.profile,
        progress: state.progress,
        reflections: state.reflections
      }
    }));

    return {
      user: state.user,
      profile: state.profile,
      progress: state.progress,
      reflections: state.reflections
    };
  }

  function initAuthListener() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.onAuthStateChange(async function (_event, session) {
      state.user = session?.user || null;
      await sync();
    });
  }

  window.LKPProfileSync = {
    state,
    sync,
    getUser,
    ensureProfile,
    loadCloudProgress,
    loadCloudReflections,
    completeLesson,
    saveReflection,
    updateProfile,
    getLocalCompleted,
    setLocalCompleted,
    getLocalMana,
    setLocalMana,
    getLocalReflections,
    setLocalReflections
  };

  document.addEventListener('DOMContentLoaded', function () {
    initAuthListener();
    sync();
  });
})();