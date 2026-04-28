/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — REWARDS ENGINE
   File: LKP/js/lkp-rewards.js

   Phase 1:
   - Local/off-chain rewards
   - Mana
   - XP
   - Ranks
   - Badges
   - Module completion
   - Culture completion
   - Daily check-in
   - XRPL-ready claim record structure for future use

   Storage:
   - cv_completed              existing lesson completion array
   - cv_mana                   backwards-compatible mana total
   - lkp_rewards_state_v1      calculated reward state
   - lkp_rewards_daily_v1      daily check-in dates
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const STORAGE = {
    completed: "cv_completed",
    legacyMana: "cv_mana",
    rewards: "lkp_rewards_state_v1",
    daily: "lkp_rewards_daily_v1",
    wallet: "lkp_wallet_link_v1"
  };

  const RULES = {
    lesson: {
      mana: 10,
      xp: 25
    },
    module: {
      mana: 100,
      xp: 250
    },
    culture: {
      mana: 500,
      xp: 1000
    },
    dailyCheckIn: {
      mana: 5,
      xp: 10
    },
    reflection: {
      mana: 25,
      xp: 75
    },
    quizPass: {
      mana: 50,
      xp: 125
    }
  };

  const RANKS = [
    {
      id: "initiate",
      name: "Initiate",
      minMana: 0,
      icon: "🌱",
      desc: "Beginning the path of living knowledge."
    },
    {
      id: "wayfinder",
      name: "Wayfinder",
      minMana: 250,
      icon: "🧭",
      desc: "Learning to navigate culture, story, and cosmic order."
    },
    {
      id: "navigator",
      name: "Navigator",
      minMana: 750,
      icon: "🌊",
      desc: "Moving through knowledge systems with direction and discipline."
    },
    {
      id: "knowledge_keeper",
      name: "Knowledge Keeper",
      minMana: 1500,
      icon: "📜",
      desc: "Holding lessons, protocols, and deeper meaning with care."
    },
    {
      id: "constellation_builder",
      name: "Constellation Builder",
      minMana: 3000,
      icon: "🌌",
      desc: "Connecting lessons into living patterns of understanding."
    },
    {
      id: "piko_guardian",
      name: "Piko Guardian",
      minMana: 5000,
      icon: "◈",
      desc: "Protecting the centerline of knowledge, culture, and responsibility."
    }
  ];

  const BADGE_LIBRARY = [
    {
      id: "first_star",
      name: "First Star",
      icon: "⭐",
      desc: "Completed your first lesson.",
      test: ctx => ctx.completedLessonCount >= 1
    },
    {
      id: "path_starter",
      name: "Path Starter",
      icon: "🌱",
      desc: "Completed 5 lessons.",
      test: ctx => ctx.completedLessonCount >= 5
    },
    {
      id: "current_rider",
      name: "Current Rider",
      icon: "🌊",
      desc: "Completed 10 lessons.",
      test: ctx => ctx.completedLessonCount >= 10
    },
    {
      id: "star_reader",
      name: "Star Reader",
      icon: "✨",
      desc: "Completed 25 lessons.",
      test: ctx => ctx.completedLessonCount >= 25
    },
    {
      id: "navigator_badge",
      name: "Navigator",
      icon: "🧭",
      desc: "Completed 50 lessons.",
      test: ctx => ctx.completedLessonCount >= 50
    },
    {
      id: "module_keeper",
      name: "Module Keeper",
      icon: "📘",
      desc: "Completed one full module.",
      test: ctx => ctx.completedModules.length >= 1
    },
    {
      id: "culture_keeper",
      name: "Culture Keeper",
      icon: "🏛️",
      desc: "Completed one full culture path.",
      test: ctx => ctx.completedCultures.length >= 1
    },
    {
      id: "bridge_walker",
      name: "Bridge Walker",
      icon: "🌐",
      desc: "Completed a Bridge lesson.",
      test: ctx => ctx.completedByCulture.bridge > 0
    },
    {
      id: "kanaka_path",
      name: "Kānaka Maoli Path",
      icon: "🌺",
      desc: "Completed a Kānaka Maoli lesson.",
      test: ctx => ctx.completedByCulture.kanaka > 0
    },
    {
      id: "kemet_path",
      name: "Kemet Path",
      icon: "☥",
      desc: "Completed a Kemet lesson.",
      test: ctx => ctx.completedByCulture.kemet > 0
    },
    {
      id: "daily_flame",
      name: "Daily Flame",
      icon: "🔥",
      desc: "Checked in for learning today.",
      test: ctx => ctx.checkedInToday
    },
    {
      id: "seven_day_current",
      name: "Seven Day Current",
      icon: "🌊",
      desc: "Built a 7-day learning rhythm.",
      test: ctx => ctx.streak >= 7
    }
  ];

  let cachedData = null;
  let cachedFlat = null;
  let cachedState = null;

  function todayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function safeJSONParse(value, fallback) {
    try {
      return JSON.parse(value || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function readJSON(key, fallback) {
    return safeJSONParse(localStorage.getItem(key), fallback);
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeData(data) {
    if (
      data &&
      Array.isArray(data.cultures)
    ) {
      return data;
    }

    if (
      window.CULTURALVERSE_DATA &&
      Array.isArray(window.CULTURALVERSE_DATA.cultures)
    ) {
      return window.CULTURALVERSE_DATA;
    }

    return { cultures: [] };
  }

  function stripTags(html) {
    return String(html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function flattenData(data) {
    const normalized = normalizeData(data);
    const lessons = [];
    const modules = [];
    const cultures = [];

    normalized.cultures.forEach((culture, cultureIndex) => {
      const cultureId = culture.id || `culture-${cultureIndex}`;
      const cultureName = culture.name || `Culture ${cultureIndex + 1}`;
      const cultureLessons = [];

      const cultureRecord = {
        id: cultureId,
        name: cultureName,
        emoji: culture.emoji || "✦",
        theme: culture.theme || "default",
        status: culture.status || "live",
        intro: culture.intro || "",
        modules: [],
        lessons: cultureLessons
      };

      const rawModules = Array.isArray(culture.modules) ? culture.modules : [];

      rawModules.forEach((module, moduleIndex) => {
        const moduleId = module.id || `${cultureId}-module-${moduleIndex}`;
        const moduleName = module.title || `Module ${moduleIndex + 1}`;
        const moduleLessons = Array.isArray(module.lessons) ? module.lessons : [];

        const moduleRecord = {
          id: moduleId,
          key: `${cultureId}:${moduleId}`,
          cultureId,
          cultureName,
          title: moduleName,
          emoji: module.emoji || culture.emoji || "✦",
          desc: module.desc || "",
          lessons: []
        };

        moduleLessons.forEach((lesson, lessonIndex) => {
          const lessonId = lesson.id || `${moduleId}-lesson-${lessonIndex}`;

          const lessonRecord = {
            id: lessonId,
            key: lessonId,
            cultureId,
            cultureName,
            moduleId,
            moduleKey: moduleRecord.key,
            moduleTitle: moduleName,
            title: lesson.title || lessonId,
            num: lesson.num || "",
            readTime: lesson.readTime || "",
            contentText: stripTags(lesson.content || "")
          };

          moduleRecord.lessons.push(lessonRecord);
          cultureLessons.push(lessonRecord);
          lessons.push(lessonRecord);
        });

        cultureRecord.modules.push(moduleRecord);
        modules.push(moduleRecord);
      });

      cultures.push(cultureRecord);
    });

    return {
      cultures,
      modules,
      lessons
    };
  }

  function getFlatData(data = cachedData) {
    const normalized = normalizeData(data);

    if (!cachedFlat || normalized !== cachedData) {
      cachedData = normalized;
      cachedFlat = flattenData(normalized);
    }

    return cachedFlat;
  }

  function getCompletedLessons() {
    const arr = readJSON(STORAGE.completed, []);
    return Array.isArray(arr) ? [...new Set(arr)] : [];
  }

  function setCompletedLessons(ids) {
    const clean = [...new Set((ids || []).filter(Boolean))];
    writeJSON(STORAGE.completed, clean);
    return clean;
  }

  function getDailyDates() {
    const arr = readJSON(STORAGE.daily, []);
    return Array.isArray(arr) ? [...new Set(arr)] : [];
  }

  function setDailyDates(dates) {
    const clean = [...new Set((dates || []).filter(Boolean))].sort();
    writeJSON(STORAGE.daily, clean);
    return clean;
  }

  function calculateStreak(dates) {
    const set = new Set(dates || []);
    let streak = 0;
    const cursor = new Date();

    while (true) {
      const key = todayKey(cursor);
      if (!set.has(key)) break;

      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  function getRank(mana) {
    let current = RANKS[0];

    RANKS.forEach(rank => {
      if (mana >= rank.minMana) {
        current = rank;
      }
    });

    const next = RANKS.find(rank => rank.minMana > current.minMana) || null;
    const progressToNext = next
      ? Math.min(100, Math.round(((mana - current.minMana) / (next.minMana - current.minMana)) * 100))
      : 100;

    return {
      current,
      next,
      progressToNext
    };
  }

  function calculateRewards(options = {}) {
    const data = normalizeData(options.data || cachedData);
    const flat = getFlatData(data);
    const completed = [...new Set(options.completed || getCompletedLessons())];
    const completedSet = new Set(completed);
    const dailyDates = getDailyDates();
    const today = todayKey();
    const checkedInToday = dailyDates.includes(today);
    const streak = calculateStreak(dailyDates);

    const completedLessons = flat.lessons.filter(lesson => completedSet.has(lesson.id));

    const completedByCulture = {};
    const completedByModule = {};

    completedLessons.forEach(lesson => {
      completedByCulture[lesson.cultureId] = (completedByCulture[lesson.cultureId] || 0) + 1;
      completedByModule[lesson.moduleKey] = (completedByModule[lesson.moduleKey] || 0) + 1;
    });

    flat.cultures.forEach(culture => {
      if (!(culture.id in completedByCulture)) {
        completedByCulture[culture.id] = 0;
      }
    });

    const completedModules = flat.modules.filter(module => {
      return module.lessons.length > 0 && module.lessons.every(lesson => completedSet.has(lesson.id));
    });

    const completedCultures = flat.cultures.filter(culture => {
      return culture.lessons.length > 0 && culture.lessons.every(lesson => completedSet.has(lesson.id));
    });

    const dailyMana = dailyDates.length * RULES.dailyCheckIn.mana;
    const dailyXP = dailyDates.length * RULES.dailyCheckIn.xp;

    let mana =
      completedLessons.length * RULES.lesson.mana +
      completedModules.length * RULES.module.mana +
      completedCultures.length * RULES.culture.mana +
      dailyMana;

    let xp =
      completedLessons.length * RULES.lesson.xp +
      completedModules.length * RULES.module.xp +
      completedCultures.length * RULES.culture.xp +
      dailyXP;

    const ctx = {
      completed,
      completedSet,
      completedLessonCount: completedLessons.length,
      completedLessons,
      completedModules,
      completedCultures,
      completedByCulture,
      completedByModule,
      checkedInToday,
      dailyDates,
      streak,
      flat
    };

    const badges = BADGE_LIBRARY
      .filter(badge => badge.test(ctx))
      .map(badge => ({
        id: badge.id,
        name: badge.name,
        icon: badge.icon,
        desc: badge.desc,
        earnedAt: today
      }));

    const certificates = [
      ...completedModules.map(module => ({
        id: `module:${module.key}`,
        type: "module",
        title: `${module.title}`,
        subtitle: `${module.cultureName}`,
        cultureId: module.cultureId,
        moduleId: module.id,
        earnedAt: today,
        xrplReady: true
      })),
      ...completedCultures.map(culture => ({
        id: `culture:${culture.id}`,
        type: "culture",
        title: `${culture.name} Culture Path`,
        subtitle: "Culture Completion",
        cultureId: culture.id,
        earnedAt: today,
        xrplReady: true
      }))
    ];

    const claimRecords = buildClaimRecords({
      completedLessons,
      completedModules,
      completedCultures,
      badges,
      certificates,
      today
    });

    const rank = getRank(mana);

    const state = {
      version: 1,
      updatedAt: new Date().toISOString(),
      mana,
      xp,
      rank,
      completed,
      completedLessonCount: completedLessons.length,
      totalLessonCount: flat.lessons.length,
      completedModuleCount: completedModules.length,
      totalModuleCount: flat.modules.length,
      completedCultureCount: completedCultures.length,
      totalCultureCount: flat.cultures.length,
      completedByCulture,
      completedModules,
      completedCultures,
      badges,
      certificates,
      claimRecords,
      streak,
      checkedInToday,
      dailyDates,
      rules: RULES
    };

    cachedState = state;

    writeJSON(STORAGE.rewards, state);
    localStorage.setItem(STORAGE.legacyMana, String(mana));

    window.dispatchEvent(new CustomEvent("lkp:rewards-updated", {
      detail: state
    }));

    return state;
  }

  function buildClaimRecords(payload) {
    const {
      completedLessons,
      completedModules,
      completedCultures,
      badges,
      certificates,
      today
    } = payload;

    const records = [];

    completedLessons.forEach(lesson => {
      records.push({
        id: `lesson:${lesson.id}`,
        type: "lesson_completion",
        status: "offchain_ready",
        title: lesson.title,
        cultureId: lesson.cultureId,
        moduleId: lesson.moduleId,
        lessonId: lesson.id,
        mana: RULES.lesson.mana,
        xp: RULES.lesson.xp,
        xrpl: {
          eligible: false,
          futureUse: "Can later become part of proof-of-learning claim history."
        },
        createdAt: today
      });
    });

    completedModules.forEach(module => {
      records.push({
        id: `module:${module.key}`,
        type: "module_completion",
        status: "xrpl_ready_future",
        title: module.title,
        cultureId: module.cultureId,
        moduleId: module.id,
        mana: RULES.module.mana,
        xp: RULES.module.xp,
        xrpl: {
          eligible: true,
          suggestedAssetType: "NFT certificate",
          futureUse: "Can later be minted as an XRPL NFT badge/certificate."
        },
        createdAt: today
      });
    });

    completedCultures.forEach(culture => {
      records.push({
        id: `culture:${culture.id}`,
        type: "culture_completion",
        status: "xrpl_ready_future",
        title: culture.name,
        cultureId: culture.id,
        mana: RULES.culture.mana,
        xp: RULES.culture.xp,
        xrpl: {
          eligible: true,
          suggestedAssetType: "NFT certificate or claimable reward",
          futureUse: "Can later unlock XRPL reward claim or culture path NFT."
        },
        createdAt: today
      });
    });

    badges.forEach(badge => {
      records.push({
        id: `badge:${badge.id}`,
        type: "badge",
        status: "offchain_badge",
        title: badge.name,
        badgeId: badge.id,
        xrpl: {
          eligible: false,
          futureUse: "Can later be mirrored to an NFT or achievement registry."
        },
        createdAt: today
      });
    });

    certificates.forEach(cert => {
      records.push({
        id: `certificate:${cert.id}`,
        type: "certificate",
        status: "xrpl_ready_future",
        title: cert.title,
        certificateType: cert.type,
        cultureId: cert.cultureId,
        moduleId: cert.moduleId || null,
        xrpl: {
          eligible: true,
          suggestedAssetType: "NFT certificate",
          futureUse: "Can later be minted or attached to wallet profile."
        },
        createdAt: today
      });
    });

    return records;
  }

  function init(options = {}) {
    cachedData = normalizeData(options.data);
    cachedFlat = flattenData(cachedData);
    return calculateRewards({ data: cachedData });
  }

  function getState(options = {}) {
    if (!cachedState || options.recalculate) {
      return calculateRewards({ data: options.data || cachedData });
    }

    return cachedState;
  }

  function getProfileSummary(options = {}) {
    const state = getState(options);
    const total = state.totalLessonCount || 0;
    const completed = state.completedLessonCount || 0;
    const progress = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return {
      mana: state.mana,
      xp: state.xp,
      rank: state.rank,
      badges: state.badges,
      certificates: state.certificates,
      claimRecords: state.claimRecords,
      streak: state.streak,
      checkedInToday: state.checkedInToday,
      completedLessonCount: completed,
      totalLessonCount: total,
      completedModuleCount: state.completedModuleCount,
      totalModuleCount: state.totalModuleCount,
      completedCultureCount: state.completedCultureCount,
      totalCultureCount: state.totalCultureCount,
      progress,
      completedByCulture: state.completedByCulture
    };
  }

  function completeLesson(lessonId) {
    if (!lessonId) return getState();

    const completed = getCompletedLessons();

    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      setCompletedLessons(completed);
    }

    return calculateRewards({ data: cachedData, completed });
  }

  function uncompleteLesson(lessonId) {
    if (!lessonId) return getState();

    const completed = getCompletedLessons().filter(id => id !== lessonId);
    setCompletedLessons(completed);

    return calculateRewards({ data: cachedData, completed });
  }

  function toggleLesson(lessonId, forceValue) {
    const completed = getCompletedLessons();
    const isDone = completed.includes(lessonId);
    const shouldComplete = typeof forceValue === "boolean" ? forceValue : !isDone;

    return shouldComplete
      ? completeLesson(lessonId)
      : uncompleteLesson(lessonId);
  }

  function checkInToday() {
    const dates = getDailyDates();
    const today = todayKey();

    if (!dates.includes(today)) {
      dates.push(today);
      setDailyDates(dates);
    }

    return calculateRewards({ data: cachedData });
  }

  function resetRewardsOnly() {
    localStorage.removeItem(STORAGE.rewards);
    localStorage.removeItem(STORAGE.daily);
    localStorage.setItem(STORAGE.legacyMana, "0");
    cachedState = null;
    return calculateRewards({ data: cachedData });
  }

  function exportXRPLReadyClaims() {
    const state = getState();
    return state.claimRecords.filter(record => record.xrpl && record.xrpl.eligible);
  }

  function getWalletLink() {
    return readJSON(STORAGE.wallet, null);
  }

  function setWalletLink(wallet) {
    const payload = {
      address: wallet?.address || "",
      network: wallet?.network || "XRPL",
      linkedAt: new Date().toISOString(),
      verified: Boolean(wallet?.verified),
      note: wallet?.note || "Future XRPL reward wallet."
    };

    writeJSON(STORAGE.wallet, payload);
    return payload;
  }

  window.LKPRewards = {
    STORAGE,
    RULES,
    RANKS,
    BADGE_LIBRARY,

    init,
    getState,
    getProfileSummary,
    calculateRewards,

    completeLesson,
    uncompleteLesson,
    toggleLesson,
    checkInToday,

    getCompletedLessons,
    setCompletedLessons,
    getDailyDates,

    resetRewardsOnly,
    exportXRPLReadyClaims,

    getWalletLink,
    setWalletLink,

    flattenData,
    getFlatData
  };
})();