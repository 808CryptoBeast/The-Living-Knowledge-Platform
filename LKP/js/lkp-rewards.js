/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — REWARDS ENGINE  v2.1  (Supabase sync)
   File: LKP/js/lkp-rewards.js

   FIXES IN v2.1 vs v2:
   ─────────────────────
   FIX 1: _cache.profileLoaded was only set in loadProgressFromSupabase().
           Now a separate _cache.totalsLoaded flag is set in
           loadProfileTotalsFromSupabase() so totals are trusted independently.

   FIX 2: calculateRewards() checked (_cache.profileLoaded && totalMana > 0).
           A brand-new user with 0 mana failed that check and fell back to
           local recalculation, ignoring Supabase. Now checks _cache.totalsLoaded
           with no mana > 0 requirement.

   FIX 3: _supabase?.auth?.currentUser?.id is unreliable in Supabase JS v2
           (currentUser can be null even with an active session). Removed.
           userId MUST be passed explicitly from your auth state change callback.
           Example: await LKPRewards.init({ supabase, userId: session.user.id, data })
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Config ──────────────────────────────────────────────────────────── */

  const STORAGE = {
    completed:  "cv_completed",
    legacyMana: "cv_mana",
    rewards:    "lkp_rewards_state_v1",
    daily:      "lkp_rewards_daily_v1",
    wallet:     "lkp_wallet_link_v1"
  };

  const RULES = {
    lesson:       { mana: 10,  xp: 25   },
    module:       { mana: 100, xp: 250  },
    culture:      { mana: 500, xp: 1000 },
    dailyCheckIn: { mana: 5,   xp: 10   },
    reflection:   { mana: 25,  xp: 75   },
    quizPass:     { mana: 50,  xp: 125  }
  };

  const RANKS = [
    { id: "initiate",              name: "Initiate",              minMana: 0,    icon: "🌱", desc: "Beginning the path of living knowledge."                               },
    { id: "wayfinder",             name: "Wayfinder",             minMana: 250,  icon: "🧭", desc: "Learning to navigate culture, story, and cosmic order."                },
    { id: "navigator",             name: "Navigator",             minMana: 750,  icon: "🌊", desc: "Moving through knowledge systems with direction and discipline."       },
    { id: "knowledge_keeper",      name: "Knowledge Keeper",      minMana: 1500, icon: "📜", desc: "Holding lessons, protocols, and deeper meaning with care."             },
    { id: "constellation_builder", name: "Constellation Builder", minMana: 3000, icon: "🌌", desc: "Connecting lessons into living patterns of understanding."             },
    { id: "piko_guardian",         name: "Piko Guardian",         minMana: 5000, icon: "◈",  desc: "Protecting the centerline of knowledge, culture, and responsibility."  }
  ];

  const BADGE_LIBRARY = [
    { id: "first_star",        name: "First Star",        icon: "⭐",  desc: "Completed your first lesson.",       test: ctx => ctx.completedLessonCount >= 1  },
    { id: "path_starter",      name: "Path Starter",      icon: "🌱",  desc: "Completed 5 lessons.",               test: ctx => ctx.completedLessonCount >= 5  },
    { id: "current_rider",     name: "Current Rider",     icon: "🌊",  desc: "Completed 10 lessons.",              test: ctx => ctx.completedLessonCount >= 10 },
    { id: "star_reader",       name: "Star Reader",       icon: "✨",  desc: "Completed 25 lessons.",              test: ctx => ctx.completedLessonCount >= 25 },
    { id: "navigator_badge",   name: "Navigator",         icon: "🧭",  desc: "Completed 50 lessons.",              test: ctx => ctx.completedLessonCount >= 50 },
    { id: "module_keeper",     name: "Module Keeper",     icon: "📘",  desc: "Completed one full module.",         test: ctx => ctx.completedModules.length >= 1  },
    { id: "culture_keeper",    name: "Culture Keeper",    icon: "🏛️", desc: "Completed one full culture path.",   test: ctx => ctx.completedCultures.length >= 1 },
    { id: "bridge_walker",     name: "Bridge Walker",     icon: "🌐",  desc: "Completed a Bridge lesson.",         test: ctx => (ctx.completedByCulture.bridge || 0) > 0 },
    { id: "kanaka_path",       name: "Kānaka Maoli Path", icon: "🌺",  desc: "Completed a Kānaka Maoli lesson.",   test: ctx => (ctx.completedByCulture.kanaka || 0) > 0 },
    { id: "kemet_path",        name: "Kemet Path",        icon: "☥",  desc: "Completed a Kemet lesson.",          test: ctx => (ctx.completedByCulture.kemet  || 0) > 0 },
    { id: "daily_flame",       name: "Daily Flame",       icon: "🔥",  desc: "Checked in for learning today.",     test: ctx => ctx.checkedInToday },
    { id: "seven_day_current", name: "Seven Day Current", icon: "🌊",  desc: "Built a 7-day learning rhythm.",     test: ctx => ctx.streak >= 7 }
  ];

  /* ── Internal state ──────────────────────────────────────────────────── */

  const _cache = {
    completedIds:   new Set(),
    dailyDates:     [],
    totalMana:      0,
    totalXP:        0,
    progressLoaded: false,  // true after loadProgressFromSupabase() succeeds
    totalsLoaded:   false   // FIX 1: separate flag for profile totals
  };

  let _supabase    = null;
  let _userId      = null;
  let _flatData    = null;
  let _cachedData  = null;
  let _cachedState = null;

  /* ── Utilities ───────────────────────────────────────────────────────── */

  function todayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function safeJSONParse(value, fallback) {
    try { return JSON.parse(value || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  function readLocal(key, fallback) {
    return safeJSONParse(localStorage.getItem(key), fallback);
  }

  function writeLocal(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function stripTags(html) {
    return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  function normalizeData(data) {
    if (data && Array.isArray(data.cultures)) return data;
    if (window.CULTURALVERSE_DATA && Array.isArray(window.CULTURALVERSE_DATA.cultures))
      return window.CULTURALVERSE_DATA;
    return { cultures: [] };
  }

  function flattenData(data) {
    const normalized = normalizeData(data);
    const lessons = [], modules = [], cultures = [];

    normalized.cultures.forEach((culture, ci) => {
      const cultureId   = culture.id   || `culture-${ci}`;
      const cultureName = culture.name || `Culture ${ci + 1}`;
      const cultureLessons = [];
      const cultureRecord  = {
        id: cultureId, name: cultureName, emoji: culture.emoji || "✦",
        theme: culture.theme || "default", status: culture.status || "live",
        intro: culture.intro || "", modules: [], lessons: cultureLessons
      };

      (Array.isArray(culture.modules) ? culture.modules : []).forEach((module, mi) => {
        const moduleId   = module.id    || `${cultureId}-module-${mi}`;
        const moduleName = module.title || `Module ${mi + 1}`;
        const moduleRecord = {
          id: moduleId, key: `${cultureId}:${moduleId}`,
          cultureId, cultureName, title: moduleName,
          emoji: module.emoji || culture.emoji || "✦",
          desc: module.desc || "", lessons: []
        };

        (Array.isArray(module.lessons) ? module.lessons : []).forEach((lesson, li) => {
          const lessonId = lesson.id || `${moduleId}-lesson-${li}`;
          const record = {
            id: lessonId, key: lessonId, cultureId, cultureName,
            moduleId, moduleKey: moduleRecord.key, moduleTitle: moduleName,
            title: lesson.title || lessonId, num: lesson.num || "",
            readTime: lesson.readTime || "",
            contentText: stripTags(lesson.content || "")
          };
          moduleRecord.lessons.push(record);
          cultureLessons.push(record);
          lessons.push(record);
        });

        cultureRecord.modules.push(moduleRecord);
        modules.push(moduleRecord);
      });

      cultures.push(cultureRecord);
    });

    return { cultures, modules, lessons };
  }

  function getFlatData(data = _cachedData) {
    const normalized = normalizeData(data);
    if (!_flatData || normalized !== _cachedData) {
      _cachedData = normalized;
      _flatData   = flattenData(normalized);
    }
    return _flatData;
  }

  /* ── Supabase helpers ────────────────────────────────────────────────── */

  function resolveSupabase() {
    return (
      window._lkpSupaClient ||
      window.LKP_SUPABASE   ||
      window._supaClient     ||
      null
    );
  }

  async function loadProgressFromSupabase() {
    if (!_supabase || !_userId) return;

    const { data, error } = await _supabase
      .from("lkp_user_progress")
      .select("lesson_id, completed, mana_earned, xp_earned")
      .eq("user_id", _userId)
      .eq("completed", true);

    if (error) {
      console.warn("[LKPRewards] loadProgress error:", error.message);
      return;
    }

    _cache.completedIds    = new Set((data || []).map(r => r.lesson_id));
    _cache.progressLoaded  = true;

    writeLocal(STORAGE.completed, [..._cache.completedIds]);
  }

  async function loadDailyFromSupabase() {
    if (!_supabase || !_userId) return;

    const { data, error } = await _supabase
      .from("lkp_daily_checkins")
      .select("checkin_date")
      .eq("user_id", _userId)
      .order("checkin_date", { ascending: true });

    if (error) {
      console.warn("[LKPRewards] loadDaily error:", error.message);
      _cache.dailyDates = readLocal(STORAGE.daily, []);
      return;
    }

    _cache.dailyDates = (data || []).map(r =>
      typeof r.checkin_date === "string" ? r.checkin_date.slice(0, 10) : r.checkin_date
    );

    writeLocal(STORAGE.daily, _cache.dailyDates);
  }

  async function loadProfileTotalsFromSupabase() {
    if (!_supabase || !_userId) return;

    const { data, error } = await _supabase
      .from("profiles")
      .select("total_mana, total_xp")
      .eq("id", _userId)
      .maybeSingle();

    if (error) {
      console.warn("[LKPRewards] loadProfile error:", error.message);
      return;
    }

    // FIX 1 + FIX 2: Always set totalsLoaded = true when Supabase responds,
    // even if the value is 0. A new user legitimately has 0 mana.
    _cache.totalMana    = (data && data.total_mana != null) ? data.total_mana : 0;
    _cache.totalXP      = (data && data.total_xp   != null) ? data.total_xp   : 0;
    _cache.totalsLoaded = true;
  }

  /* ── Streak ──────────────────────────────────────────────────────────── */

  function calculateStreak(dates) {
    const set    = new Set(dates || []);
    let streak   = 0;
    const cursor = new Date();

    while (true) {
      const key = todayKey(cursor);
      if (!set.has(key)) break;
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  /* ── Rank ────────────────────────────────────────────────────────────── */

  function getRank(mana) {
    let current = RANKS[0];
    RANKS.forEach(rank => { if (mana >= rank.minMana) current = rank; });
    const next           = RANKS.find(r => r.minMana > current.minMana) || null;
    const progressToNext = next
      ? Math.min(100, Math.round(((mana - current.minMana) / (next.minMana - current.minMana)) * 100))
      : 100;
    return { current, next, progressToNext };
  }

  /* ── calculateRewards ────────────────────────────────────────────────── */

  function calculateRewards(options = {}) {
    const data = normalizeData(options.data || _cachedData);
    const flat = getFlatData(data);

    const completed = options.completed
      ? [...new Set(options.completed)]
      : _cache.progressLoaded
        ? [..._cache.completedIds]
        : readLocal(STORAGE.completed, []);

    const completedSet = new Set(completed);

    const dailyDates     = _cache.progressLoaded
      ? _cache.dailyDates
      : readLocal(STORAGE.daily, []);
    const today          = todayKey();
    const checkedInToday = dailyDates.includes(today);
    const streak         = calculateStreak(dailyDates);

    const completedLessons   = flat.lessons.filter(l => completedSet.has(l.id));
    const completedByCulture = {};
    const completedByModule  = {};

    completedLessons.forEach(lesson => {
      completedByCulture[lesson.cultureId] = (completedByCulture[lesson.cultureId] || 0) + 1;
      completedByModule[lesson.moduleKey]   = (completedByModule[lesson.moduleKey]   || 0) + 1;
    });
    flat.cultures.forEach(c => {
      if (!(c.id in completedByCulture)) completedByCulture[c.id] = 0;
    });

    const completedModules  = flat.modules.filter(m =>
      m.lessons.length > 0 && m.lessons.every(l => completedSet.has(l.id)));
    const completedCultures = flat.cultures.filter(c =>
      c.lessons.length > 0 && c.lessons.every(l => completedSet.has(l.id)));

    // FIX 2: Use _cache.totalsLoaded — no mana > 0 requirement.
    // New users with 0 mana are valid and must not fall back to local calc.
    let mana, xp;
    if (_cache.totalsLoaded) {
      mana = _cache.totalMana;
      xp   = _cache.totalXP;
    } else {
      const dailyMana = dailyDates.length * RULES.dailyCheckIn.mana;
      const dailyXP   = dailyDates.length * RULES.dailyCheckIn.xp;
      mana = completedLessons.length * RULES.lesson.mana
           + completedModules.length  * RULES.module.mana
           + completedCultures.length * RULES.culture.mana
           + dailyMana;
      xp   = completedLessons.length * RULES.lesson.xp
           + completedModules.length  * RULES.module.xp
           + completedCultures.length * RULES.culture.xp
           + dailyXP;
    }

    const ctx = {
      completed, completedSet,
      completedLessonCount: completedLessons.length,
      completedLessons, completedModules, completedCultures,
      completedByCulture, completedByModule,
      checkedInToday, dailyDates, streak, flat
    };

    const badges = BADGE_LIBRARY
      .filter(badge => badge.test(ctx))
      .map(badge => ({ id: badge.id, name: badge.name, icon: badge.icon, desc: badge.desc, earnedAt: today }));

    const certificates = [
      ...completedModules.map(m => ({
        id: `module:${m.key}`, type: "module",
        title: m.title, subtitle: m.cultureName,
        cultureId: m.cultureId, moduleId: m.id, earnedAt: today, xrplReady: true
      })),
      ...completedCultures.map(c => ({
        id: `culture:${c.id}`, type: "culture",
        title: `${c.name} Culture Path`, subtitle: "Culture Completion",
        cultureId: c.id, earnedAt: today, xrplReady: true
      }))
    ];

    const claimRecords = buildClaimRecords({
      completedLessons, completedModules, completedCultures, badges, certificates, today
    });
    const rank = getRank(mana);

    const state = {
      version: 2,
      updatedAt: new Date().toISOString(),
      mana, xp, rank,
      completed: [...completedSet],
      completedLessonCount:  completedLessons.length,
      totalLessonCount:      flat.lessons.length,
      completedModuleCount:  completedModules.length,
      totalModuleCount:      flat.modules.length,
      completedCultureCount: completedCultures.length,
      totalCultureCount:     flat.cultures.length,
      completedByCulture, completedModules, completedCultures,
      badges, certificates, claimRecords,
      streak, checkedInToday, dailyDates,
      rules: RULES
    };

    _cachedState = state;

    writeLocal(STORAGE.rewards,    state);
    writeLocal(STORAGE.legacyMana, String(mana));
    writeLocal(STORAGE.completed,  [...completedSet]);

    window.dispatchEvent(new CustomEvent("lkp:rewards-updated", { detail: state }));
    return state;
  }

  /* ── buildClaimRecords ───────────────────────────────────────────────── */

  function buildClaimRecords({ completedLessons, completedModules, completedCultures, badges, certificates, today }) {
    const records = [];

    completedLessons.forEach(lesson => {
      records.push({
        id: `lesson:${lesson.id}`, type: "lesson_completion",
        status: "offchain_ready", title: lesson.title,
        cultureId: lesson.cultureId, moduleId: lesson.moduleId, lessonId: lesson.id,
        mana: RULES.lesson.mana, xp: RULES.lesson.xp,
        xrpl: { eligible: false, futureUse: "Can later become part of proof-of-learning claim history." },
        createdAt: today
      });
    });
    completedModules.forEach(module => {
      records.push({
        id: `module:${module.key}`, type: "module_completion",
        status: "xrpl_ready_future", title: module.title,
        cultureId: module.cultureId, moduleId: module.id,
        mana: RULES.module.mana, xp: RULES.module.xp,
        xrpl: { eligible: true, suggestedAssetType: "NFT certificate",
          futureUse: "Can later be minted as an XRPL NFT badge/certificate." },
        createdAt: today
      });
    });
    completedCultures.forEach(culture => {
      records.push({
        id: `culture:${culture.id}`, type: "culture_completion",
        status: "xrpl_ready_future", title: culture.name, cultureId: culture.id,
        mana: RULES.culture.mana, xp: RULES.culture.xp,
        xrpl: { eligible: true, suggestedAssetType: "NFT certificate or claimable reward",
          futureUse: "Can later unlock XRPL reward claim or culture path NFT." },
        createdAt: today
      });
    });
    badges.forEach(badge => {
      records.push({
        id: `badge:${badge.id}`, type: "badge", status: "offchain_badge",
        title: badge.name, badgeId: badge.id,
        xrpl: { eligible: false, futureUse: "Can later be mirrored to an NFT or achievement registry." },
        createdAt: today
      });
    });
    certificates.forEach(cert => {
      records.push({
        id: `certificate:${cert.id}`, type: "certificate",
        status: "xrpl_ready_future", title: cert.title, certificateType: cert.type,
        cultureId: cert.cultureId, moduleId: cert.moduleId || null,
        xrpl: { eligible: true, suggestedAssetType: "NFT certificate",
          futureUse: "Can later be minted or attached to wallet profile." },
        createdAt: today
      });
    });

    return records;
  }

  /* ══════════════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════════════ */

  /**
   * init({ data, supabase, userId })
   *
   * CRITICAL: Always pass userId from your auth callback. Never rely on
   * supabase.auth.currentUser — it is unreliable in Supabase JS v2.
   *
   *   supabase.auth.onAuthStateChange(async (_event, session) => {
   *     if (session?.user) {
   *       await LKPRewards.init({
   *         data:     window.CULTURALVERSE_DATA,
   *         supabase: window._lkpSupaClient,
   *         userId:   session.user.id    // ← always pass this
   *       });
   *       renderProfile();
   *     }
   *   });
   */
  async function init(options = {}) {
    _cachedData = normalizeData(options.data);
    _flatData   = flattenData(_cachedData);
    _supabase   = options.supabase || resolveSupabase();

    // FIX 3: Do not use _supabase?.auth?.currentUser — unreliable in v2.
    _userId = options.userId || null;

    if (!_userId) {
      console.warn("[LKPRewards] init() called without userId. Pass session.user.id explicitly.");
    }

    if (_supabase && _userId) {
      await Promise.all([
        loadProgressFromSupabase(),
        loadDailyFromSupabase(),
        loadProfileTotalsFromSupabase()
      ]);
    } else {
      // Offline / signed out — read from local cache
      _cache.completedIds = new Set(readLocal(STORAGE.completed, []));
      _cache.dailyDates   = readLocal(STORAGE.daily, []);
    }

    return calculateRewards({ data: _cachedData });
  }

  /* ── Synchronous reads ───────────────────────────────────────────────── */

  function getState(options = {}) {
    if (!_cachedState || options.recalculate) {
      return calculateRewards({ data: options.data || _cachedData });
    }
    return _cachedState;
  }

  function getProfileSummary(options = {}) {
    const state     = getState(options);
    const total     = state.totalLessonCount || 0;
    const completed = state.completedLessonCount || 0;
    const progress  = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return {
      mana:                 state.mana,
      xp:                   state.xp,
      rank:                 state.rank,
      badges:               state.badges,
      certificates:         state.certificates,
      claimRecords:         state.claimRecords,
      streak:               state.streak,
      checkedInToday:       state.checkedInToday,
      completedLessonCount: completed,
      totalLessonCount:     total,
      completedModuleCount: state.completedModuleCount,
      totalModuleCount:     state.totalModuleCount,
      completedCultureCount: state.completedCultureCount,
      totalCultureCount:    state.totalCultureCount,
      progress,
      completedByCulture:   state.completedByCulture
    };
  }

  function isCompleted(lessonId) {
    return _cache.completedIds.has(lessonId);
  }

  function getTotals() {
    return {
      mana:  _cache.totalMana,
      xp:    _cache.totalXP,
      count: _cache.completedIds.size
    };
  }

  /* ── Async writes ────────────────────────────────────────────────────── */

  async function completeLesson(lessonId) {
    if (!lessonId) {
      return { already_completed: false, mana_earned: 0, xp_earned: 0, state: getState() };
    }

    if (_cache.completedIds.has(lessonId)) {
      return { already_completed: true, mana_earned: 0, xp_earned: 0, state: getState() };
    }

    if (_supabase && _userId) {
      const { data, error } = await _supabase.rpc("complete_lesson", { p_lesson_id: lessonId });

      if (error) {
        console.warn("[LKPRewards] complete_lesson RPC error:", error.message);
      } else {
        const result = typeof data === "string" ? JSON.parse(data) : data;

        if (result.already_completed) {
          _cache.completedIds.add(lessonId);
          writeLocal(STORAGE.completed, [..._cache.completedIds]);
          return { already_completed: true, mana_earned: 0, xp_earned: 0, state: getState() };
        }

        await loadProfileTotalsFromSupabase();
        _cache.completedIds.add(lessonId);

        const state = calculateRewards({ data: _cachedData });
        return {
          already_completed: false,
          mana_earned:       result.mana_earned,
          xp_earned:         result.xp_earned,
          state
        };
      }
    }

    // Local-only fallback
    _cache.completedIds.add(lessonId);
    writeLocal(STORAGE.completed, [..._cache.completedIds]);
    const state = calculateRewards({ data: _cachedData });

    return {
      already_completed: false,
      mana_earned:       RULES.lesson.mana,
      xp_earned:         RULES.lesson.xp,
      state
    };
  }

  async function checkInToday() {
    const today = todayKey();

    if (_supabase && _userId) {
      const { error } = await _supabase
        .from("lkp_daily_checkins")
        .upsert(
          { user_id: _userId, checkin_date: today },
          { onConflict: "user_id,checkin_date" }
        );

      if (error) {
        console.warn("[LKPRewards] checkInToday error:", error.message);
      } else if (!_cache.dailyDates.includes(today)) {
        await _supabase
          .from("profiles")
          .update({
            total_mana: _cache.totalMana + RULES.dailyCheckIn.mana,
            total_xp:   _cache.totalXP   + RULES.dailyCheckIn.xp
          })
          .eq("id", _userId);

        await loadProfileTotalsFromSupabase();
      }

      await loadDailyFromSupabase();

    } else {
      if (!_cache.dailyDates.includes(today)) {
        _cache.dailyDates.push(today);
        writeLocal(STORAGE.daily, _cache.dailyDates);
      }
    }

    return calculateRewards({ data: _cachedData });
  }

  /* ── Backward-compat ─────────────────────────────────────────────────── */

  function toggleLesson(lessonId, forceValue) {
    const shouldComplete = typeof forceValue === "boolean"
      ? forceValue
      : !_cache.completedIds.has(lessonId);

    if (shouldComplete) return completeLesson(lessonId);

    _cache.completedIds.delete(lessonId);
    writeLocal(STORAGE.completed, [..._cache.completedIds]);
    return Promise.resolve({
      already_completed: false, mana_earned: 0, xp_earned: 0, state: calculateRewards()
    });
  }

  function uncompleteLesson(lessonId) {
    return toggleLesson(lessonId, false);
  }

  function getCompletedLessons() { return [..._cache.completedIds]; }

  function setCompletedLessons(ids) {
    _cache.completedIds = new Set((ids || []).filter(Boolean));
    writeLocal(STORAGE.completed, [..._cache.completedIds]);
    return [..._cache.completedIds];
  }

  function getDailyDates() { return [..._cache.dailyDates]; }

  function resetRewardsOnly() {
    _cache.completedIds   = new Set();
    _cache.dailyDates     = [];
    _cache.totalMana      = 0;
    _cache.totalXP        = 0;
    _cache.progressLoaded = false;
    _cache.totalsLoaded   = false;
    _cachedState          = null;
    localStorage.removeItem(STORAGE.rewards);
    localStorage.removeItem(STORAGE.daily);
    writeLocal(STORAGE.legacyMana, "0");
    return calculateRewards({ data: _cachedData });
  }

  function exportXRPLReadyClaims() {
    return getState().claimRecords.filter(r => r.xrpl && r.xrpl.eligible);
  }

  function getWalletLink() {
    return safeJSONParse(localStorage.getItem(STORAGE.wallet), null);
  }

  function setWalletLink(wallet) {
    const payload = {
      address:  wallet?.address  || "",
      network:  wallet?.network  || "XRPL",
      linkedAt: new Date().toISOString(),
      verified: Boolean(wallet?.verified),
      note:     wallet?.note || "Future XRPL reward wallet."
    };
    writeLocal(STORAGE.wallet, payload);
    return payload;
  }

  /* ── Expose ──────────────────────────────────────────────────────────── */

  window.LKPRewards = {
    STORAGE, RULES, RANKS, BADGE_LIBRARY,
    init,
    getState, getProfileSummary, isCompleted, getTotals,
    getCompletedLessons, getDailyDates, calculateRewards, flattenData, getFlatData,
    completeLesson, checkInToday,
    toggleLesson, uncompleteLesson, setCompletedLessons,
    exportXRPLReadyClaims, getWalletLink, setWalletLink,
    resetRewardsOnly
  };

})();