/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — REWARDS ENGINE  v2  (Supabase sync)
   File: LKP/js/lkp-rewards.js

   WHAT CHANGED FROM v1:
   ─────────────────────
   • localStorage is now a fast READ CACHE only — never the source of truth
   • Supabase is the single source of truth for:
       - completed lessons   (lkp_user_progress table)
       - mana / XP totals    (profiles.total_mana / profiles.total_xp)
       - daily check-ins     (lkp_daily_checkins table)
   • completeLesson() calls the DB function complete_lesson() which:
       - checks if already done on ANY device before awarding
       - atomically increments profile totals
       - returns { already_completed } so the UI knows whether to animate
   • All public methods that write data are now async and return Promises
   • Existing read-only calls (getState, getProfileSummary, isCompleted)
     stay synchronous against the local cache so your UI stays fast
   • Falls back gracefully to local cache when offline or not signed in

   REQUIRED BEFORE THIS WORKS:
   ─────────────────────────────
   Run lkp-progress-sync.sql in your Supabase SQL Editor first.
   That creates:
     - lkp_user_progress   (lesson completion, unique per user+lesson)
     - lkp_daily_checkins  (one row per user per day)
     - complete_lesson()   (DB function that prevents double-awarding)
     - Adds total_mana + total_xp to profiles table

   PUBLIC API (unchanged names, some now return Promises):
   ────────────────────────────────────────────────────────
     await LKPRewards.init(options)              boot + load from Supabase
     LKPRewards.getState()                       sync read from cache
     LKPRewards.getProfileSummary()              sync read from cache
     await LKPRewards.completeLesson(lessonId)   write to Supabase + cache
     await LKPRewards.checkInToday()             write to Supabase + cache
     LKPRewards.isCompleted(lessonId)            sync boolean from cache
     LKPRewards.getTotals()                      { mana, xp, count } from cache
     LKPRewards.exportXRPLReadyClaims()          unchanged
     LKPRewards.getWalletLink() / setWalletLink  unchanged (stays local)
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Config ──────────────────────────────────────────────────────────── */

  // Legacy localStorage keys kept so existing code reading them still works
  const STORAGE = {
    completed:  "cv_completed",
    legacyMana: "cv_mana",
    rewards:    "lkp_rewards_state_v1",
    daily:      "lkp_rewards_daily_v1",
    wallet:     "lkp_wallet_link_v1"
  };

  // ── These are unchanged from v1 ────────────────────────────────────────

  const RULES = {
    lesson:       { mana: 10,  xp: 25   },
    module:       { mana: 100, xp: 250  },
    culture:      { mana: 500, xp: 1000 },
    dailyCheckIn: { mana: 5,   xp: 10   },
    reflection:   { mana: 25,  xp: 75   },
    quizPass:     { mana: 50,  xp: 125  }
  };

  const RANKS = [
    { id: "initiate",               name: "Initiate",               minMana: 0,    icon: "🌱", desc: "Beginning the path of living knowledge."                                      },
    { id: "wayfinder",              name: "Wayfinder",              minMana: 250,  icon: "🧭", desc: "Learning to navigate culture, story, and cosmic order."                       },
    { id: "navigator",              name: "Navigator",              minMana: 750,  icon: "🌊", desc: "Moving through knowledge systems with direction and discipline."              },
    { id: "knowledge_keeper",       name: "Knowledge Keeper",       minMana: 1500, icon: "📜", desc: "Holding lessons, protocols, and deeper meaning with care."                    },
    { id: "constellation_builder",  name: "Constellation Builder",  minMana: 3000, icon: "🌌", desc: "Connecting lessons into living patterns of understanding."                    },
    { id: "piko_guardian",          name: "Piko Guardian",          minMana: 5000, icon: "◈",  desc: "Protecting the centerline of knowledge, culture, and responsibility."         }
  ];

  const BADGE_LIBRARY = [
    { id: "first_star",        name: "First Star",          icon: "⭐",  desc: "Completed your first lesson.",            test: ctx => ctx.completedLessonCount >= 1  },
    { id: "path_starter",      name: "Path Starter",        icon: "🌱",  desc: "Completed 5 lessons.",                    test: ctx => ctx.completedLessonCount >= 5  },
    { id: "current_rider",     name: "Current Rider",       icon: "🌊",  desc: "Completed 10 lessons.",                   test: ctx => ctx.completedLessonCount >= 10 },
    { id: "star_reader",       name: "Star Reader",         icon: "✨",  desc: "Completed 25 lessons.",                   test: ctx => ctx.completedLessonCount >= 25 },
    { id: "navigator_badge",   name: "Navigator",           icon: "🧭",  desc: "Completed 50 lessons.",                   test: ctx => ctx.completedLessonCount >= 50 },
    { id: "module_keeper",     name: "Module Keeper",       icon: "📘",  desc: "Completed one full module.",              test: ctx => ctx.completedModules.length >= 1 },
    { id: "culture_keeper",    name: "Culture Keeper",      icon: "🏛️", desc: "Completed one full culture path.",        test: ctx => ctx.completedCultures.length >= 1 },
    { id: "bridge_walker",     name: "Bridge Walker",       icon: "🌐",  desc: "Completed a Bridge lesson.",              test: ctx => (ctx.completedByCulture.bridge || 0) > 0 },
    { id: "kanaka_path",       name: "Kānaka Maoli Path",   icon: "🌺",  desc: "Completed a Kānaka Maoli lesson.",        test: ctx => (ctx.completedByCulture.kanaka || 0) > 0 },
    { id: "kemet_path",        name: "Kemet Path",          icon: "☥",  desc: "Completed a Kemet lesson.",               test: ctx => (ctx.completedByCulture.kemet  || 0) > 0 },
    { id: "daily_flame",       name: "Daily Flame",         icon: "🔥",  desc: "Checked in for learning today.",          test: ctx => ctx.checkedInToday },
    { id: "seven_day_current", name: "Seven Day Current",   icon: "🌊",  desc: "Built a 7-day learning rhythm.",          test: ctx => ctx.streak >= 7 }
  ];

  /* ── Internal state ──────────────────────────────────────────────────── */

  // Local in-memory cache — always mirrors what's in Supabase
  const _cache = {
    completedIds:  new Set(),   // lesson IDs completed on any device
    dailyDates:    [],          // ISO date strings "YYYY-MM-DD"
    totalMana:     0,
    totalXP:       0,
    profileLoaded: false
  };

  let _supabase   = null;   // Supabase client, resolved in init()
  let _userId     = null;   // UUID of the signed-in user
  let _flatData   = null;   // flattened lesson/module/culture tree
  let _cachedData = null;   // raw platform data passed to init()
  let _cachedState = null;  // last calculateRewards() result

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
      const cultureRecord  = { id: cultureId, name: cultureName, emoji: culture.emoji || "✦",
                                theme: culture.theme || "default", status: culture.status || "live",
                                intro: culture.intro || "", modules: [], lessons: cultureLessons };

      (Array.isArray(culture.modules) ? culture.modules : []).forEach((module, mi) => {
        const moduleId   = module.id    || `${cultureId}-module-${mi}`;
        const moduleName = module.title || `Module ${mi + 1}`;
        const moduleRecord = { id: moduleId, key: `${cultureId}:${moduleId}`,
                               cultureId, cultureName, title: moduleName,
                               emoji: module.emoji || culture.emoji || "✦",
                               desc: module.desc || "", lessons: [] };

        (Array.isArray(module.lessons) ? module.lessons : []).forEach((lesson, li) => {
          const lessonId = lesson.id || `${moduleId}-lesson-${li}`;
          const record   = { id: lessonId, key: lessonId, cultureId, cultureName,
                             moduleId, moduleKey: moduleRecord.key, moduleTitle: moduleName,
                             title: lesson.title || lessonId, num: lesson.num || "",
                             readTime: lesson.readTime || "",
                             contentText: stripTags(lesson.content || "") };
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

  // Resolve the Supabase client — works whether it's on window directly
  // or wrapped in window.LKP_SUPABASE / window._supaClient etc.
  function resolveSupabase() {
    return (
      window._lkpSupaClient ||
      window.LKP_SUPABASE   ||
      window._supaClient     ||
      null
    );
  }

  // ── Load all completed lessons for this user from Supabase ──────────────
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

    // Rebuild cache from server data
    _cache.completedIds = new Set((data || []).map(r => r.lesson_id));

    // Mirror to localStorage for backward compat (offline reads)
    const ids = [..._cache.completedIds];
    writeLocal(STORAGE.completed, ids);

    _cache.profileLoaded = true;
  }

  // ── Load daily check-in dates ───────────────────────────────────────────
  async function loadDailyFromSupabase() {
    if (!_supabase || !_userId) return;

    // lkp_daily_checkins: (user_id uuid, checkin_date date, primary key)
    const { data, error } = await _supabase
      .from("lkp_daily_checkins")
      .select("checkin_date")
      .eq("user_id", _userId)
      .order("checkin_date", { ascending: true });

    if (error) {
      // Table may not exist yet — fall back to localStorage silently
      console.warn("[LKPRewards] loadDaily error:", error.message);
      _cache.dailyDates = readLocal(STORAGE.daily, []);
      return;
    }

    _cache.dailyDates = (data || []).map(r =>
      typeof r.checkin_date === "string"
        ? r.checkin_date.slice(0, 10)
        : r.checkin_date
    );

    writeLocal(STORAGE.daily, _cache.dailyDates);
  }

  // ── Load profile totals ─────────────────────────────────────────────────
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

    if (data) {
      _cache.totalMana = data.total_mana || 0;
      _cache.totalXP   = data.total_xp   || 0;
    }
  }

  /* ── Streak calculation (unchanged logic) ─────────────────────────────── */

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

  /* ── Rank calculation (unchanged) ─────────────────────────────────────── */

  function getRank(mana) {
    let current = RANKS[0];
    RANKS.forEach(rank => { if (mana >= rank.minMana) current = rank; });
    const next           = RANKS.find(r => r.minMana > current.minMana) || null;
    const progressToNext = next
      ? Math.min(100, Math.round(((mana - current.minMana) / (next.minMana - current.minMana)) * 100))
      : 100;
    return { current, next, progressToNext };
  }

  /* ── Core reward calculation (now reads from _cache, not localStorage) ── */

  function calculateRewards(options = {}) {
    const data     = normalizeData(options.data || _cachedData);
    const flat     = getFlatData(data);

    // Source of truth: _cache.completedIds (loaded from Supabase)
    // Fallback for offline / pre-init calls: read localStorage
    const completed = options.completed
      ? [...new Set(options.completed)]
      : _cache.completedIds.size > 0
        ? [..._cache.completedIds]
        : readLocal(STORAGE.completed, []);

    const completedSet = new Set(completed);

    const dailyDates    = _cache.dailyDates.length > 0
      ? _cache.dailyDates
      : readLocal(STORAGE.daily, []);
    const today         = todayKey();
    const checkedInToday = dailyDates.includes(today);
    const streak         = calculateStreak(dailyDates);

    const completedLessons  = flat.lessons.filter(l => completedSet.has(l.id));
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

    // Prefer Supabase-sourced totals when available (most accurate)
    // Fall back to calculating from completed lists when offline
    let mana, xp;
    if (_cache.profileLoaded && _cache.totalMana > 0) {
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

    const claimRecords = buildClaimRecords({ completedLessons, completedModules, completedCultures, badges, certificates, today });
    const rank         = getRank(mana);

    const state = {
      version: 2,
      updatedAt: new Date().toISOString(),
      mana, xp, rank,
      completed: [...completedSet],
      completedLessonCount: completedLessons.length,
      totalLessonCount:     flat.lessons.length,
      completedModuleCount: completedModules.length,
      totalModuleCount:     flat.modules.length,
      completedCultureCount: completedCultures.length,
      totalCultureCount:    flat.cultures.length,
      completedByCulture, completedModules, completedCultures,
      badges, certificates, claimRecords,
      streak, checkedInToday, dailyDates,
      rules: RULES
    };

    _cachedState = state;

    // Mirror to localStorage for backward compat
    writeLocal(STORAGE.rewards,    state);
    writeLocal(STORAGE.legacyMana, String(mana));
    writeLocal(STORAGE.completed,  [...completedSet]);

    window.dispatchEvent(new CustomEvent("lkp:rewards-updated", { detail: state }));
    return state;
  }

  /* ── buildClaimRecords (unchanged from v1) ──────────────────────────── */

  function buildClaimRecords({ completedLessons, completedModules, completedCultures, badges, certificates, today }) {
    const records = [];

    completedLessons.forEach(lesson => {
      records.push({ id: `lesson:${lesson.id}`, type: "lesson_completion",
        status: "offchain_ready", title: lesson.title, cultureId: lesson.cultureId,
        moduleId: lesson.moduleId, lessonId: lesson.id,
        mana: RULES.lesson.mana, xp: RULES.lesson.xp,
        xrpl: { eligible: false, futureUse: "Can later become part of proof-of-learning claim history." },
        createdAt: today });
    });
    completedModules.forEach(module => {
      records.push({ id: `module:${module.key}`, type: "module_completion",
        status: "xrpl_ready_future", title: module.title, cultureId: module.cultureId,
        moduleId: module.id, mana: RULES.module.mana, xp: RULES.module.xp,
        xrpl: { eligible: true, suggestedAssetType: "NFT certificate",
          futureUse: "Can later be minted as an XRPL NFT badge/certificate." },
        createdAt: today });
    });
    completedCultures.forEach(culture => {
      records.push({ id: `culture:${culture.id}`, type: "culture_completion",
        status: "xrpl_ready_future", title: culture.name, cultureId: culture.id,
        mana: RULES.culture.mana, xp: RULES.culture.xp,
        xrpl: { eligible: true, suggestedAssetType: "NFT certificate or claimable reward",
          futureUse: "Can later unlock XRPL reward claim or culture path NFT." },
        createdAt: today });
    });
    badges.forEach(badge => {
      records.push({ id: `badge:${badge.id}`, type: "badge", status: "offchain_badge",
        title: badge.name, badgeId: badge.id,
        xrpl: { eligible: false, futureUse: "Can later be mirrored to an NFT or achievement registry." },
        createdAt: today });
    });
    certificates.forEach(cert => {
      records.push({ id: `certificate:${cert.id}`, type: "certificate",
        status: "xrpl_ready_future", title: cert.title, certificateType: cert.type,
        cultureId: cert.cultureId, moduleId: cert.moduleId || null,
        xrpl: { eligible: true, suggestedAssetType: "NFT certificate",
          futureUse: "Can later be minted or attached to wallet profile." },
        createdAt: today });
    });

    return records;
  }

  /* ══════════════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════════════ */

  /**
   * init({ data, supabase, userId })
   * Call once after the user signs in and your platform data is ready.
   *
   *   await LKPRewards.init({
   *     data:      window.CULTURALVERSE_DATA,
   *     supabase:  window._lkpSupaClient,   // or however you expose it
   *     userId:    session.user.id
   *   });
   */
  async function init(options = {}) {
    _cachedData = normalizeData(options.data);
    _flatData   = flattenData(_cachedData);
    _supabase   = options.supabase || resolveSupabase();
    _userId     = options.userId   || _supabase?.auth?.currentUser?.id || null;

    // If we have a live Supabase session, load from the server
    if (_supabase && _userId) {
      await Promise.all([
        loadProgressFromSupabase(),
        loadDailyFromSupabase(),
        loadProfileTotalsFromSupabase()
      ]);
    } else {
      // Offline / not signed in — fall back to local cache
      const localIds = readLocal(STORAGE.completed, []);
      _cache.completedIds = new Set(localIds);
      _cache.dailyDates   = readLocal(STORAGE.daily, []);
    }

    return calculateRewards({ data: _cachedData });
  }

  /* ── Synchronous reads (against in-memory cache) ──────────────────────── */

  function getState(options = {}) {
    if (!_cachedState || options.recalculate) {
      return calculateRewards({ data: options.data || _cachedData });
    }
    return _cachedState;
  }

  function getProfileSummary(options = {}) {
    const state    = getState(options);
    const total    = state.totalLessonCount || 0;
    const completed = state.completedLessonCount || 0;
    const progress  = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return {
      mana:                state.mana,
      xp:                  state.xp,
      rank:                state.rank,
      badges:              state.badges,
      certificates:        state.certificates,
      claimRecords:        state.claimRecords,
      streak:              state.streak,
      checkedInToday:      state.checkedInToday,
      completedLessonCount: completed,
      totalLessonCount:    total,
      completedModuleCount: state.completedModuleCount,
      totalModuleCount:    state.totalModuleCount,
      completedCultureCount: state.completedCultureCount,
      totalCultureCount:   state.totalCultureCount,
      progress,
      completedByCulture:  state.completedByCulture
    };
  }

  /** isCompleted(lessonId) — synchronous boolean from cache */
  function isCompleted(lessonId) {
    return _cache.completedIds.has(lessonId);
  }

  /** getTotals() — { mana, xp, count } from cache */
  function getTotals() {
    return {
      mana:  _cache.totalMana,
      xp:    _cache.totalXP,
      count: _cache.completedIds.size
    };
  }

  /* ── Async writes (Supabase first, then cache) ─────────────────────────── */

  /**
   * completeLesson(lessonId)
   * ─────────────────────────
   * THE main method your lesson pages should call when a user finishes a lesson.
   *
   * Returns:
   *   {
   *     already_completed: boolean  — true = already done on another device, skip animation
   *     mana_earned:       number   — 0 if already_completed, else lesson mana value
   *     xp_earned:         number   — 0 if already_completed, else lesson xp value
   *     state:             object   — updated full reward state
   *   }
   *
   * Usage on your lesson page:
   *   const result = await LKPRewards.completeLesson('kemet-creation-lesson-1');
   *   if (!result.already_completed) {
   *     showRewardModal(result.mana_earned, result.xp_earned);
   *   }
   */
  async function completeLesson(lessonId) {
    if (!lessonId) return { already_completed: false, mana_earned: 0, xp_earned: 0, state: getState() };

    // FAST PATH: already in local cache → definitely already done
    if (_cache.completedIds.has(lessonId)) {
      return { already_completed: true, mana_earned: 0, xp_earned: 0, state: getState() };
    }

    // SUPABASE PATH: call the DB function that prevents double-awarding
    if (_supabase && _userId) {
      const { data, error } = await _supabase.rpc("complete_lesson", { p_lesson_id: lessonId });

      if (error) {
        console.warn("[LKPRewards] complete_lesson RPC error:", error.message);
        // Fall through to local-only path so the user isn't stuck
      } else {
        const result = typeof data === "string" ? JSON.parse(data) : data;

        if (result.already_completed) {
          // Another device already earned this — update local cache to match
          _cache.completedIds.add(lessonId);
          writeLocal(STORAGE.completed, [..._cache.completedIds]);
          return { already_completed: true, mana_earned: 0, xp_earned: 0, state: getState() };
        }

        // Server awarded rewards — sync totals back into cache
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

    // LOCAL-ONLY FALLBACK (offline or not signed in)
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

  /**
   * checkInToday()
   * ───────────────
   * Records a daily check-in. Safe to call multiple times — only awards
   * once per calendar day per user, enforced by the DB unique constraint.
   */
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
      } else {
        // Award mana/xp to profile only if this is a NEW check-in today
        if (!_cache.dailyDates.includes(today)) {
          await _supabase
            .from("profiles")
            .update({
              total_mana: (_cache.totalMana + RULES.dailyCheckIn.mana),
              total_xp:   (_cache.totalXP   + RULES.dailyCheckIn.xp)
            })
            .eq("id", _userId);

          await loadProfileTotalsFromSupabase();
        }
      }

      // Always reload daily dates from server to stay in sync
      await loadDailyFromSupabase();

    } else {
      // Offline fallback
      if (!_cache.dailyDates.includes(today)) {
        _cache.dailyDates.push(today);
        writeLocal(STORAGE.daily, _cache.dailyDates);
      }
    }

    return calculateRewards({ data: _cachedData });
  }

  /* ── Backward-compat sync aliases (v1 callers that didn't await) ─────── */

  /** @deprecated Use await completeLesson() — kept for backward compat */
  function toggleLesson(lessonId, forceValue) {
    const shouldComplete = typeof forceValue === "boolean" ? forceValue : !_cache.completedIds.has(lessonId);
    if (shouldComplete) return completeLesson(lessonId);
    // uncomplete is local-only (no Supabase delete to keep history clean)
    _cache.completedIds.delete(lessonId);
    writeLocal(STORAGE.completed, [..._cache.completedIds]);
    return Promise.resolve({ already_completed: false, mana_earned: 0, xp_earned: 0, state: calculateRewards() });
  }

  /** @deprecated Use await completeLesson() */
  function uncompleteLesson(lessonId) {
    return toggleLesson(lessonId, false);
  }

  /* ── Unchanged utility methods ───────────────────────────────────────── */

  function getCompletedLessons() {
    return [..._cache.completedIds];
  }

  function setCompletedLessons(ids) {
    _cache.completedIds = new Set((ids || []).filter(Boolean));
    writeLocal(STORAGE.completed, [..._cache.completedIds]);
    return [..._cache.completedIds];
  }

  function getDailyDates() {
    return [..._cache.dailyDates];
  }

  function resetRewardsOnly() {
    _cache.completedIds  = new Set();
    _cache.dailyDates    = [];
    _cache.totalMana     = 0;
    _cache.totalXP       = 0;
    _cache.profileLoaded = false;
    _cachedState         = null;
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

  /* ── Expose public API ───────────────────────────────────────────────── */

  window.LKPRewards = {
    // Config constants (unchanged)
    STORAGE, RULES, RANKS, BADGE_LIBRARY,

    // Boot
    init,

    // Synchronous reads
    getState,
    getProfileSummary,
    isCompleted,
    getTotals,
    getCompletedLessons,
    getDailyDates,
    calculateRewards,
    flattenData,
    getFlatData,

    // Async writes
    completeLesson,
    checkInToday,

    // Backward compat
    toggleLesson,
    uncompleteLesson,
    setCompletedLessons,

    // XRPL
    exportXRPLReadyClaims,
    getWalletLink,
    setWalletLink,

    // Dev utility
    resetRewardsOnly
  };

})();