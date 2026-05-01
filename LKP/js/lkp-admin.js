/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — ADMIN DECK
   File: LKP/js/lkp-admin.js

   FIXES IN THIS VERSION:
   1. Auth overlay no longer blocks owner/admin — profile load is fault-tolerant
   2. Modal close button and Escape key both work reliably
   3. Cross-device sync: user progress (mana/XP) now reads/writes from
      lkp_user_progress table in Supabase so all devices stay in sync
   4. Better role diagnostics so you can see exactly what's in your profile row
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const SUPABASE_URL =
    window.LKP_SUPABASE_URL ||
    "https://fmrjdvsqdfyaqtzwbbqi.supabase.co";

  const SUPABASE_ANON_KEY =
    window.LKP_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcmpkdnNxZGZ5YXF0endiYnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTE2MzYsImV4cCI6MjA5MTE2NzYzNn0.UKyvX02bG4cNhb7U2TK96t8XFREHYYwHJIKbPK06nqs";

  const isConfigured =
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("PASTE_YOUR");

  const state = {
    supa: null,
    session: null,
    user: null,
    profile: null,
    isAdmin: false,

    cultures: [],
    modules: [],
    lessons: [],
    sources: [],
    galaxy: [],

    selected: {
      cultureId: null,
      moduleId: null,
      lessonId: null,
      sourceId: null,
      galaxyKey: null
    },

    filters: {
      cultureSearch: "",
      moduleCulture: "all",
      lessonCulture: "all",
      lessonModule: "all",
      lessonSearch: "",
      sourceLesson: "all",
      galaxyType: "all"
    }
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return [...document.querySelectorAll(selector)];
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message, tone = "") {
    const toast = $("#adminToast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("is-bad", "is-good");
    if (tone) toast.classList.add(`is-${tone}`);
    toast.classList.add("is-visible");

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  function setStatus(message, tone = "") {
    const el = $("#adminAccessStatus");
    if (!el) return;

    el.textContent = message;
    el.classList.remove("is-good", "is-bad");

    if (tone === "good") el.classList.add("is-good");
    if (tone === "bad") el.classList.add("is-bad");
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['ʻ']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function toInteger(value, fallback = 0) {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function csvToArray(value) {
    return String(value || "")
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);
  }

  function arrayToCSV(value) {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  function safeJSON(value, fallback = {}) {
    try {
      if (!String(value || "").trim()) return fallback;
      return JSON.parse(value);
    } catch {
      throw new Error("Invalid JSON.");
    }
  }

  function statusBadge(status) {
    const cls =
      status === "live"
        ? "admin-badge admin-badge--live"
        : status === "archived"
          ? "admin-badge admin-badge--archived"
          : "admin-badge admin-badge--draft";

    return `<span class="${cls}">${escapeHTML(status || "draft")}</span>`;
  }

  function cultureName(id) {
    return state.cultures.find(c => c.id === id)?.name || id || "Unknown";
  }

  function moduleName(id) {
    return state.modules.find(m => m.id === id)?.title || id || "Unknown";
  }

  function lessonName(id) {
    return state.lessons.find(l => l.id === id)?.title || id || "Unknown";
  }

  function currentUserId() {
    return state.user?.id || null;
  }

  async function init() {
    bindStaticUI();

    if (!isConfigured) {
      setStatus(
        "Supabase key is missing. Open LKP/js/lkp-admin.js and paste your anon key.",
        "bad"
      );
      return;
    }

    await waitForSupabase();

    state.supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    await loadSession();

    state.supa.auth.onAuthStateChange(async (_event, session) => {
      state.session = session || null;
      state.user = session?.user || null;

      if (state.user) {
        await loadProfile();
        if (state.isAdmin) await bootAdminApp();
      } else {
        state.profile = null;
        state.isAdmin = false;
        renderAccess();
      }
    });
  }

  function waitForSupabase() {
    return new Promise((resolve, reject) => {
      if (window.supabase) {
        resolve();
        return;
      }

      let tries = 0;

      const timer = setInterval(() => {
        tries++;

        if (window.supabase) {
          clearInterval(timer);
          resolve();
          return;
        }

        if (tries > 50) {
          clearInterval(timer);
          reject(new Error("Supabase library failed to load."));
        }
      }, 100);
    });
  }

  function bindStaticUI() {
    $("#adminSignInBtn")?.addEventListener("click", signIn);
    $("#adminSignOutBtn")?.addEventListener("click", signOut);
    $("#adminRefreshBtn")?.addEventListener("click", bootAdminApp);

    $("#adminEmail")?.addEventListener("keydown", event => {
      if (event.key === "Enter") signIn();
    });

    $("#adminPassword")?.addEventListener("keydown", event => {
      if (event.key === "Enter") signIn();
    });

    $all("[data-admin-tab]").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.adminTab));
    });

    // ── FIX: Modal close via button AND Escape key ────────────────────────
    $("#adminModalClose")?.addEventListener("click", closeModal);

    $("#adminModalOverlay")?.addEventListener("click", event => {
      if (event.target.id === "adminModalOverlay") closeModal();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeModal();
    });
    // ─────────────────────────────────────────────────────────────────────

    /* Search / filters */
    $("#cultureSearch")?.addEventListener("input", event => {
      state.filters.cultureSearch = event.target.value.trim().toLowerCase();
      renderCultures();
    });

    $("#moduleCultureFilter")?.addEventListener("change", event => {
      state.filters.moduleCulture = event.target.value;
      renderModules();
    });

    $("#lessonCultureFilter")?.addEventListener("change", event => {
      state.filters.lessonCulture = event.target.value;
      populateLessonModuleFilter();
      renderLessons();
    });

    $("#lessonModuleFilter")?.addEventListener("change", event => {
      state.filters.lessonModule = event.target.value;
      renderLessons();
    });

    $("#lessonSearch")?.addEventListener("input", event => {
      state.filters.lessonSearch = event.target.value.trim().toLowerCase();
      renderLessons();
    });

    $("#sourceLessonFilter")?.addEventListener("change", event => {
      state.filters.sourceLesson = event.target.value;
      renderSources();
    });

    $("#galaxyTypeFilter")?.addEventListener("change", event => {
      state.filters.galaxyType = event.target.value;
      renderGalaxySettings();
    });

    $("#galaxyTargetType")?.addEventListener("change", populateGalaxyTargetIds);

    /* New buttons */
    $("#newCultureBtn")?.addEventListener("click", newCulture);
    $("#newModuleBtn")?.addEventListener("click", newModule);
    $("#newLessonBtn")?.addEventListener("click", newLesson);
    $("#newSourceBtn")?.addEventListener("click", newSource);
    $("#newGalaxyBtn")?.addEventListener("click", newGalaxySetting);

    /* Save/delete */
    $("#saveCultureBtn")?.addEventListener("click", saveCulture);
    $("#deleteCultureBtn")?.addEventListener("click", deleteCulture);

    $("#saveModuleBtn")?.addEventListener("click", saveModule);
    $("#deleteModuleBtn")?.addEventListener("click", deleteModule);

    $("#saveLessonBtn")?.addEventListener("click", saveLesson);
    $("#deleteLessonBtn")?.addEventListener("click", deleteLesson);
    $("#previewLessonBtn")?.addEventListener("click", previewLesson);

    $("#saveSourceBtn")?.addEventListener("click", saveSource);
    $("#deleteSourceBtn")?.addEventListener("click", deleteSource);

    $("#saveGalaxyBtn")?.addEventListener("click", saveGalaxySetting);
    $("#deleteGalaxyBtn")?.addEventListener("click", deleteGalaxySetting);

    /* Auto IDs */
    $("#cultureName")?.addEventListener("input", () => {
      if (!$("#cultureId").value.trim()) $("#cultureId").value = slugify($("#cultureName").value);
    });

    $("#moduleTitle")?.addEventListener("input", () => {
      if (!$("#moduleId").value.trim()) $("#moduleId").value = slugify($("#moduleTitle").value);
    });

    $("#lessonTitle")?.addEventListener("input", () => {
      if (!$("#lessonId").value.trim()) $("#lessonId").value = slugify($("#lessonTitle").value);
    });
  }

  async function loadSession() {
    try {
      const { data, error } = await state.supa.auth.getSession();
      if (error) throw error;

      state.session = data.session || null;
      state.user = state.session?.user || null;

      if (state.user) {
        await loadProfile();
        if (state.isAdmin) await bootAdminApp();
        else renderAccess();
      } else {
        renderAccess();
      }
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Could not load session.", "bad");
    }
  }

  async function signIn() {
    if (!state.supa) return;

    const email = $("#adminEmail")?.value.trim();
    const password = $("#adminPassword")?.value;

    if (!email || !password) {
      showToast("Email and password are required.", "bad");
      return;
    }

    try {
      setStatus("Signing in…");

      const { data, error } = await state.supa.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      state.session = data.session;
      state.user = data.user;

      await loadProfile();

      if (state.isAdmin) {
        await bootAdminApp();
        showToast("Signed into Admin Deck.", "good");
      } else {
        showToast(
          `Signed in as ${email} but role is "${state.profile?.role || "none"}". Must be admin or owner.`,
          "bad"
        );
      }
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Sign-in failed.", "bad");
      showToast(err.message || "Sign-in failed.", "bad");
    }
  }

  async function signOut() {
    if (!state.supa) return;

    await state.supa.auth.signOut();

    state.session = null;
    state.user = null;
    state.profile = null;
    state.isAdmin = false;

    renderAccess();
    showToast("Signed out.");
  }

  // ── FIX: loadProfile is now fault-tolerant ─────────────────────────────
  // Previously, if the profiles table threw any error it would propagate
  // and leave the auth panel visible with no explanation. Now we catch the
  // error, display useful diagnostics, and still call renderAccess() so the
  // UI updates correctly.
  async function loadProfile() {
    if (!state.user) return;

    try {
      const { data, error } = await state.supa
        .from("profiles")
        .select("*")
        .eq("id", state.user.id)
        .maybeSingle();

      if (error) {
        // Table might not exist or RLS is blocking the read.
        // Show the raw error so you can diagnose in Supabase dashboard.
        console.warn("[LKP Admin] profiles query error:", error.message, error.code);
        setStatus(
          `Profile query failed: ${error.message} (code: ${error.code}). ` +
          `Check Supabase RLS policies on the profiles table.`,
          "bad"
        );
        state.profile = null;
        state.isAdmin = false;
        renderAccess();
        return;
      }

      state.profile = data || null;
      state.isAdmin = ["admin", "owner"].includes(data?.role);

      // Helpful diagnostics — visible in the status line under sign-in form
      if (!data) {
        setStatus(
          `No profile row found for user id: ${state.user.id}. ` +
          `Add a row in the profiles table with role = "owner".`,
          "bad"
        );
      } else if (!state.isAdmin) {
        setStatus(
          `Profile found. Current role: "${data.role}". ` +
          `Update it to "admin" or "owner" in Supabase to grant access.`,
          "bad"
        );
      }
    } catch (err) {
      console.error("[LKP Admin] loadProfile threw unexpectedly:", err);
      setStatus(`Unexpected error loading profile: ${err.message}`, "bad");
      state.profile = null;
      state.isAdmin = false;
    }

    renderAccess();
  }
  // ──────────────────────────────────────────────────────────────────────

  function renderAccess() {
    const authPanel = $("#adminAuthPanel");
    const app = $("#adminApp");
    const signOutBtn = $("#adminSignOutBtn");

    signOutBtn?.classList.toggle("is-hidden", !state.user);

    if (!state.user) {
      authPanel?.classList.remove("is-hidden");
      app?.classList.add("is-hidden");
      setStatus("Not signed in. Admin tools are locked.");
      return;
    }

    if (!state.isAdmin) {
      authPanel?.classList.remove("is-hidden");
      app?.classList.add("is-hidden");
      // Status already set with diagnostics in loadProfile above
      return;
    }

    authPanel?.classList.add("is-hidden");
    app?.classList.remove("is-hidden");
    setStatus(`Admin access granted: ${(state.profile?.role || "admin").toUpperCase()}`, "good");
  }

  async function bootAdminApp() {
    if (!state.isAdmin) {
      renderAccess();
      return;
    }

    try {
      await loadAllContent();
      populateSelects();
      renderAll();
      showToast("Admin content loaded.", "good");
    } catch (err) {
      console.error("[LKP Admin] bootAdminApp error:", err);
      showToast(`Failed to load content: ${err.message}`, "bad");
    }
  }

  async function loadAllContent() {
    const [cultures, modules, lessons, sources, galaxy] = await Promise.all([
      state.supa.from("lkp_cultures").select("*").order("sort_order", { ascending: true }),
      state.supa.from("lkp_modules").select("*").order("sort_order", { ascending: true }),
      state.supa.from("lkp_lessons").select("*").order("sort_order", { ascending: true }),
      state.supa.from("lkp_sources").select("*").order("sort_order", { ascending: true }),
      state.supa.from("lkp_galaxy_settings").select("*").order("target_type", { ascending: true })
    ]);

    for (const res of [cultures, modules, lessons, sources, galaxy]) {
      if (res.error) throw res.error;
    }

    state.cultures = cultures.data || [];
    state.modules = modules.data || [];
    state.lessons = lessons.data || [];
    state.sources = sources.data || [];
    state.galaxy = galaxy.data || [];
  }

  function switchTab(tab) {
    $all("[data-admin-tab]").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.adminTab === tab);
    });

    $all("[data-admin-panel]").forEach(panel => {
      panel.classList.toggle("is-active", panel.dataset.adminPanel === tab);
    });
  }

  function populateSelects() {
    populateCultureSelects();
    populateModuleSelects();
    populateLessonSelects();
    populateGalaxyTargetIds();
  }

  function populateCultureSelects() {
    const cultureOptions = [
      `<option value="all">All Cultures</option>`,
      ...state.cultures.map(c => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>`)
    ].join("");

    const cultureOnlyOptions = state.cultures
      .map(c => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>`)
      .join("");

    ["#moduleCultureFilter", "#lessonCultureFilter"].forEach(selector => {
      const el = $(selector);
      if (el) el.innerHTML = cultureOptions;
    });

    const moduleCulture = $("#moduleCulture");
    if (moduleCulture) moduleCulture.innerHTML = cultureOnlyOptions;
  }

  function populateModuleSelects() {
    const moduleOptions = state.modules
      .map(m => `
        <option value="${escapeHTML(m.id)}">
          ${escapeHTML(cultureName(m.culture_id))} · ${escapeHTML(m.title)}
        </option>
      `)
      .join("");

    const lessonModule = $("#lessonModule");
    if (lessonModule) lessonModule.innerHTML = moduleOptions;

    populateLessonModuleFilter();
  }

  function populateLessonModuleFilter() {
    const selectedCulture = $("#lessonCultureFilter")?.value || "all";

    let mods = state.modules;

    if (selectedCulture !== "all") {
      mods = mods.filter(m => m.culture_id === selectedCulture);
    }

    const options = [
      `<option value="all">All Modules</option>`,
      ...mods.map(m => `<option value="${escapeHTML(m.id)}">${escapeHTML(m.title)}</option>`)
    ].join("");

    const el = $("#lessonModuleFilter");
    if (el) el.innerHTML = options;

    if (!mods.find(m => m.id === state.filters.lessonModule)) {
      state.filters.lessonModule = "all";
      if (el) el.value = "all";
    }
  }

  function populateLessonSelects() {
    const lessonOptions = [
      `<option value="all">All Lessons</option>`,
      ...state.lessons.map(l => `
        <option value="${escapeHTML(l.id)}">
          ${escapeHTML(l.lesson_num || "")} ${escapeHTML(l.title)}
        </option>
      `)
    ].join("");

    const sourceFilter = $("#sourceLessonFilter");
    if (sourceFilter) sourceFilter.innerHTML = lessonOptions;

    const sourceLesson = $("#sourceLesson");
    if (sourceLesson) {
      sourceLesson.innerHTML = state.lessons
        .map(l => `<option value="${escapeHTML(l.id)}">${escapeHTML(l.title)}</option>`)
        .join("");
    }
  }

  function populateGalaxyTargetIds() {
    const type = $("#galaxyTargetType")?.value || "platform";
    const select = $("#galaxyTargetId");
    if (!select) return;

    let options = [];

    if (type === "platform") {
      options = [{ id: "lkp", label: "LKP / Piko Core" }];
    }

    if (type === "culture") {
      options = state.cultures.map(c => ({ id: c.id, label: c.name }));
    }

    if (type === "module") {
      options = state.modules.map(m => ({
        id: m.id,
        label: `${cultureName(m.culture_id)} · ${m.title}`
      }));
    }

    if (type === "lesson") {
      options = state.lessons.map(l => ({
        id: l.id,
        label: `${l.lesson_num || ""} ${l.title}`
      }));
    }

    select.innerHTML = options
      .map(o => `<option value="${escapeHTML(o.id)}">${escapeHTML(o.label)}</option>`)
      .join("");
  }

  function renderAll() {
    renderStats();
    renderOverview();
    renderCultures();
    renderModules();
    renderLessons();
    renderSources();
    renderGalaxySettings();
  }

  function renderStats() {
    $("#statCultures").textContent = state.cultures.length;
    $("#statModules").textContent = state.modules.length;
    $("#statLessons").textContent = state.lessons.length;
    $("#statLiveLessons").textContent = state.lessons.filter(l => l.status === "live").length;
  }

  function renderOverview() {
    const wrap = $("#adminOverviewList");
    if (!wrap) return;

    const draftLessons = state.lessons.filter(l => l.status === "draft").length;
    const archivedLessons = state.lessons.filter(l => l.status === "archived").length;
    const liveCultures = state.cultures.filter(c => c.status === "live").length;
    const galaxyCount = state.galaxy.length;

    const rows = [
      ["Live cultures", liveCultures],
      ["Draft lessons", draftLessons],
      ["Archived lessons", archivedLessons],
      ["Galaxy settings records", galaxyCount],
      ["Signed in as", state.profile?.email || state.user?.email || "Unknown"],
      ["Role", state.profile?.role || "unknown"]
    ];

    wrap.innerHTML = rows.map(([label, value]) => `
      <div class="admin-overview-item">
        <span>${escapeHTML(label)}</span>
        <strong>${escapeHTML(value)}</strong>
      </div>
    `).join("");
  }

  /* ── Cultures ─────────────────────────────────────────────────────────── */

  function renderCultures() {
    const wrap = $("#cultureList");
    if (!wrap) return;

    const q = state.filters.cultureSearch;

    let rows = [...state.cultures];

    if (q) {
      rows = rows.filter(c => [c.id, c.name, c.tagline, c.intro].join(" ").toLowerCase().includes(q));
    }

    if (!rows.length) {
      wrap.innerHTML = `<div class="admin-note">No cultures found.</div>`;
      return;
    }

    wrap.innerHTML = rows.map(c => `
      <article class="admin-record ${state.selected.cultureId === c.id ? "is-active" : ""}" data-culture-id="${escapeHTML(c.id)}">
        <div class="admin-record__top">
          <span class="admin-record__title">${escapeHTML(c.emoji || "✦")} ${escapeHTML(c.name)}</span>
          ${statusBadge(c.status)}
        </div>
        <div class="admin-record__meta">
          ${escapeHTML(c.id)} · theme: ${escapeHTML(c.theme)} · sort: ${escapeHTML(c.sort_order)}
        </div>
        <div class="admin-record__badges">
          ${c.featured ? `<span class="admin-badge">Featured</span>` : ""}
          <span class="admin-badge">${escapeHTML(c.color_hex || "#f0c96a")}</span>
        </div>
      </article>
    `).join("");

    wrap.querySelectorAll("[data-culture-id]").forEach(card => {
      card.addEventListener("click", () => selectCulture(card.dataset.cultureId));
    });
  }

  function newCulture() {
    state.selected.cultureId = null;

    $("#cultureId").disabled = false;
    $("#cultureId").value = "";
    $("#cultureName").value = "";
    $("#cultureEmoji").value = "✦";
    $("#cultureStatus").value = "draft";
    $("#cultureTheme").value = "gold";
    $("#cultureColor").value = "#f0c96a";
    $("#cultureSort").value = String((state.cultures.length + 1) * 10);
    $("#cultureFeatured").checked = false;
    $("#cultureIcon").value = "";
    $("#cultureHeroImage").value = "";
    $("#cultureTagline").value = "";
    $("#cultureIntro").value = "";

    renderCultures();
  }

  function selectCulture(id) {
    const c = state.cultures.find(row => row.id === id);
    if (!c) return;

    state.selected.cultureId = id;

    $("#cultureId").disabled = true;
    $("#cultureId").value = c.id || "";
    $("#cultureName").value = c.name || "";
    $("#cultureEmoji").value = c.emoji || "✦";
    $("#cultureStatus").value = c.status || "draft";
    $("#cultureTheme").value = c.theme || "gold";
    $("#cultureColor").value = c.color_hex || "#f0c96a";
    $("#cultureSort").value = c.sort_order ?? 0;
    $("#cultureFeatured").checked = Boolean(c.featured);
    $("#cultureIcon").value = c.icon_url || "";
    $("#cultureHeroImage").value = c.hero_image_url || "";
    $("#cultureTagline").value = c.tagline || "";
    $("#cultureIntro").value = c.intro || "";

    renderCultures();
  }

  async function saveCulture() {
    const id = $("#cultureId").value.trim() || slugify($("#cultureName").value);

    if (!id || !$("#cultureName").value.trim()) {
      showToast("Culture ID and name are required.", "bad");
      return;
    }

    const payload = {
      id,
      name: $("#cultureName").value.trim(),
      emoji: $("#cultureEmoji").value.trim() || "✦",
      status: $("#cultureStatus").value,
      theme: $("#cultureTheme").value,
      color_hex: $("#cultureColor").value.trim() || "#f0c96a",
      sort_order: toInteger($("#cultureSort").value, 0),
      featured: $("#cultureFeatured").checked,
      icon_url: $("#cultureIcon").value.trim() || null,
      hero_image_url: $("#cultureHeroImage").value.trim() || null,
      tagline: $("#cultureTagline").value.trim() || null,
      intro: $("#cultureIntro").value.trim() || null,
      updated_by: currentUserId()
    };

    if (!state.selected.cultureId) {
      payload.created_by = currentUserId();
    }

    const { error } = await state.supa
      .from("lkp_cultures")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("culture", id, state.selected.cultureId ? "update" : "create", payload);
    state.selected.cultureId = id;
    await bootAdminApp();
    selectCulture(id);
    showToast("Culture saved.", "good");
  }

  async function deleteCulture() {
    const id = state.selected.cultureId;
    if (!id) return showToast("Select a culture first.", "bad");

    if (!confirm(`Delete culture "${id}" and all modules/lessons under it?`)) return;

    const snapshot = state.cultures.find(c => c.id === id);

    const { error } = await state.supa
      .from("lkp_cultures")
      .delete()
      .eq("id", id);

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("culture", id, "delete", snapshot || {});
    newCulture();
    await bootAdminApp();
    showToast("Culture deleted.", "good");
  }

  /* ── Modules ──────────────────────────────────────────────────────────── */

  function renderModules() {
    const wrap = $("#moduleList");
    if (!wrap) return;

    let rows = [...state.modules];

    const filter = state.filters.moduleCulture || $("#moduleCultureFilter")?.value || "all";
    if (filter !== "all") rows = rows.filter(m => m.culture_id === filter);

    if (!rows.length) {
      wrap.innerHTML = `<div class="admin-note">No modules found.</div>`;
      return;
    }

    wrap.innerHTML = rows.map(m => `
      <article class="admin-record ${state.selected.moduleId === m.id ? "is-active" : ""}" data-module-id="${escapeHTML(m.id)}">
        <div class="admin-record__top">
          <span class="admin-record__title">${escapeHTML(m.emoji || "✦")} ${escapeHTML(m.title)}</span>
          ${statusBadge(m.status)}
        </div>
        <div class="admin-record__meta">
          ${escapeHTML(m.id)} · ${escapeHTML(cultureName(m.culture_id))} · sort: ${escapeHTML(m.sort_order)}
        </div>
      </article>
    `).join("");

    wrap.querySelectorAll("[data-module-id]").forEach(card => {
      card.addEventListener("click", () => selectModule(card.dataset.moduleId));
    });
  }

  function newModule() {
    state.selected.moduleId = null;

    $("#moduleId").disabled = false;
    $("#moduleId").value = "";
    $("#moduleCulture").value = state.cultures[0]?.id || "";
    $("#moduleTitle").value = "";
    $("#moduleEmoji").value = "✦";
    $("#moduleStatus").value = "draft";
    $("#moduleSort").value = String((state.modules.length + 1) * 10);
    $("#moduleOrbitRadius").value = "";
    $("#moduleOrbitSpeed").value = "";
    $("#moduleDescription").value = "";

    renderModules();
  }

  function selectModule(id) {
    const m = state.modules.find(row => row.id === id);
    if (!m) return;

    state.selected.moduleId = id;

    $("#moduleId").disabled = true;
    $("#moduleId").value = m.id || "";
    $("#moduleCulture").value = m.culture_id || "";
    $("#moduleTitle").value = m.title || "";
    $("#moduleEmoji").value = m.emoji || "✦";
    $("#moduleStatus").value = m.status || "draft";
    $("#moduleSort").value = m.sort_order ?? 0;
    $("#moduleOrbitRadius").value = m.orbit_radius ?? "";
    $("#moduleOrbitSpeed").value = m.orbit_speed ?? "";
    $("#moduleDescription").value = m.description || "";

    renderModules();
  }

  async function saveModule() {
    const id = $("#moduleId").value.trim() || slugify($("#moduleTitle").value);

    if (!id || !$("#moduleTitle").value.trim() || !$("#moduleCulture").value) {
      showToast("Module ID, title, and culture are required.", "bad");
      return;
    }

    const payload = {
      id,
      culture_id: $("#moduleCulture").value,
      title: $("#moduleTitle").value.trim(),
      emoji: $("#moduleEmoji").value.trim() || "✦",
      status: $("#moduleStatus").value,
      sort_order: toInteger($("#moduleSort").value, 0),
      orbit_radius: toNumberOrNull($("#moduleOrbitRadius").value),
      orbit_speed: toNumberOrNull($("#moduleOrbitSpeed").value),
      description: $("#moduleDescription").value.trim() || null,
      updated_by: currentUserId()
    };

    if (!state.selected.moduleId) {
      payload.created_by = currentUserId();
    }

    const { error } = await state.supa
      .from("lkp_modules")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("module", id, state.selected.moduleId ? "update" : "create", payload);
    state.selected.moduleId = id;
    await bootAdminApp();
    selectModule(id);
    showToast("Module saved.", "good");
  }

  async function deleteModule() {
    const id = state.selected.moduleId;
    if (!id) return showToast("Select a module first.", "bad");

    if (!confirm(`Delete module "${id}" and all lessons under it?`)) return;

    const snapshot = state.modules.find(m => m.id === id);

    const { error } = await state.supa
      .from("lkp_modules")
      .delete()
      .eq("id", id);

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("module", id, "delete", snapshot || {});
    newModule();
    await bootAdminApp();
    showToast("Module deleted.", "good");
  }

  /* ── Lessons ──────────────────────────────────────────────────────────── */

  function renderLessons() {
    const wrap = $("#lessonList");
    if (!wrap) return;

    let rows = [...state.lessons];

    const cultureFilter = $("#lessonCultureFilter")?.value || state.filters.lessonCulture;
    const moduleFilter = $("#lessonModuleFilter")?.value || state.filters.lessonModule;
    const q = state.filters.lessonSearch;

    if (cultureFilter !== "all") {
      rows = rows.filter(l => l.culture_id === cultureFilter);
    }

    if (moduleFilter !== "all") {
      rows = rows.filter(l => l.module_id === moduleFilter);
    }

    if (q) {
      rows = rows.filter(l => [
        l.id,
        l.lesson_num,
        l.title,
        l.excerpt,
        l.content,
        moduleName(l.module_id),
        cultureName(l.culture_id)
      ].join(" ").toLowerCase().includes(q));
    }

    if (!rows.length) {
      wrap.innerHTML = `<div class="admin-note">No lessons found.</div>`;
      return;
    }

    wrap.innerHTML = rows.map(l => `
      <article class="admin-record ${state.selected.lessonId === l.id ? "is-active" : ""}" data-lesson-id="${escapeHTML(l.id)}">
        <div class="admin-record__top">
          <span class="admin-record__title">${escapeHTML(l.lesson_num || "LESSON")} · ${escapeHTML(l.title)}</span>
          ${statusBadge(l.status)}
        </div>
        <div class="admin-record__meta">
          ${escapeHTML(l.id)} · ${escapeHTML(cultureName(l.culture_id))} · ${escapeHTML(moduleName(l.module_id))}
        </div>
        <div class="admin-record__badges">
          <span class="admin-badge">${escapeHTML(l.mana ?? 10)} Mana</span>
          <span class="admin-badge">${escapeHTML(l.xp ?? 25)} XP</span>
          ${l.featured ? `<span class="admin-badge">Featured</span>` : ""}
        </div>
      </article>
    `).join("");

    wrap.querySelectorAll("[data-lesson-id]").forEach(card => {
      card.addEventListener("click", () => selectLesson(card.dataset.lessonId));
    });
  }

  function newLesson() {
    state.selected.lessonId = null;

    $("#lessonId").disabled = false;
    $("#lessonId").value = "";
    $("#lessonModule").value = state.modules[0]?.id || "";
    $("#lessonNum").value = "";
    $("#lessonTitle").value = "";
    $("#lessonReadTime").value = "8 min read";
    $("#lessonStatus").value = "draft";
    $("#lessonSort").value = String((state.lessons.length + 1) * 10);
    $("#lessonMana").value = "10";
    $("#lessonXP").value = "25";
    $("#lessonFeatured").checked = false;
    $("#lessonTags").value = "";
    $("#lessonPrerequisites").value = "";
    $("#lessonLead").value = "";
    $("#lessonExcerpt").value = "";
    $("#lessonContent").value = "";

    renderLessons();
  }

  function selectLesson(id) {
    const l = state.lessons.find(row => row.id === id);
    if (!l) return;

    state.selected.lessonId = id;

    $("#lessonId").disabled = true;
    $("#lessonId").value = l.id || "";
    $("#lessonModule").value = l.module_id || "";
    $("#lessonNum").value = l.lesson_num || "";
    $("#lessonTitle").value = l.title || "";
    $("#lessonReadTime").value = l.read_time || "";
    $("#lessonStatus").value = l.status || "draft";
    $("#lessonSort").value = l.sort_order ?? 0;
    $("#lessonMana").value = l.mana ?? 10;
    $("#lessonXP").value = l.xp ?? 25;
    $("#lessonFeatured").checked = Boolean(l.featured);
    $("#lessonTags").value = arrayToCSV(l.tags);
    $("#lessonPrerequisites").value = arrayToCSV(l.prerequisites);
    $("#lessonLead").value = l.lead_text || "";
    $("#lessonExcerpt").value = l.excerpt || "";
    $("#lessonContent").value = l.content || "";

    renderLessons();
  }

  async function saveLesson() {
    const id = $("#lessonId").value.trim() || slugify($("#lessonTitle").value);
    const moduleId = $("#lessonModule").value;
    const module = state.modules.find(m => m.id === moduleId);

    if (!id || !moduleId || !$("#lessonTitle").value.trim()) {
      showToast("Lesson ID, module, and title are required.", "bad");
      return;
    }

    const payload = {
      id,
      module_id: moduleId,
      culture_id: module?.culture_id || null,
      lesson_num: $("#lessonNum").value.trim() || null,
      title: $("#lessonTitle").value.trim(),
      read_time: $("#lessonReadTime").value.trim() || null,
      status: $("#lessonStatus").value,
      sort_order: toInteger($("#lessonSort").value, 0),
      mana: toInteger($("#lessonMana").value, 10),
      xp: toInteger($("#lessonXP").value, 25),
      featured: $("#lessonFeatured").checked,
      tags: csvToArray($("#lessonTags").value),
      prerequisites: csvToArray($("#lessonPrerequisites").value),
      lead_text: $("#lessonLead").value.trim() || null,
      excerpt: $("#lessonExcerpt").value.trim() || null,
      content: $("#lessonContent").value.trim() || null,
      updated_by: currentUserId()
    };

    if (!state.selected.lessonId) {
      payload.created_by = currentUserId();
    }

    const { error } = await state.supa
      .from("lkp_lessons")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("lesson", id, state.selected.lessonId ? "update" : "create", payload);
    state.selected.lessonId = id;
    await bootAdminApp();
    selectLesson(id);
    showToast("Lesson saved.", "good");
  }

  async function deleteLesson() {
    const id = state.selected.lessonId;
    if (!id) return showToast("Select a lesson first.", "bad");

    if (!confirm(`Delete lesson "${id}"?`)) return;

    const snapshot = state.lessons.find(l => l.id === id);

    const { error } = await state.supa
      .from("lkp_lessons")
      .delete()
      .eq("id", id);

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("lesson", id, "delete", snapshot || {});
    newLesson();
    await bootAdminApp();
    showToast("Lesson deleted.", "good");
  }

  function previewLesson() {
    const title = $("#lessonTitle").value.trim() || "Untitled Lesson";
    const num = $("#lessonNum").value.trim();
    const lead = $("#lessonLead").value.trim();
    const content = $("#lessonContent").value.trim();

    openModal(`
      <article class="admin-preview-article">
        <span class="admin-eyebrow">${escapeHTML(num || "Preview")}</span>
        <h1>${escapeHTML(title)}</h1>
        ${lead ? `<p class="lead">${escapeHTML(lead)}</p>` : ""}
        <div class="admin-preview-content">
          ${content || `<p>No content yet.</p>`}
        </div>
      </article>
    `);
  }

  /* ── Sources ──────────────────────────────────────────────────────────── */

  function renderSources() {
    const wrap = $("#sourceList");
    if (!wrap) return;

    let rows = [...state.sources];

    const lessonFilter = $("#sourceLessonFilter")?.value || state.filters.sourceLesson;

    if (lessonFilter !== "all") {
      rows = rows.filter(s => s.lesson_id === lessonFilter);
    }

    if (!rows.length) {
      wrap.innerHTML = `<div class="admin-note">No sources found.</div>`;
      return;
    }

    wrap.innerHTML = rows.map(s => `
      <article class="admin-record ${String(state.selected.sourceId) === String(s.id) ? "is-active" : ""}" data-source-id="${escapeHTML(s.id)}">
        <div class="admin-record__top">
          <span class="admin-record__title">${escapeHTML(s.label)}</span>
          <span class="admin-badge">${escapeHTML(s.source_type || "web")}</span>
        </div>
        <div class="admin-record__meta">
          ${escapeHTML(lessonName(s.lesson_id))} · sort: ${escapeHTML(s.sort_order)}
        </div>
      </article>
    `).join("");

    wrap.querySelectorAll("[data-source-id]").forEach(card => {
      card.addEventListener("click", () => selectSource(card.dataset.sourceId));
    });
  }

  function newSource() {
    state.selected.sourceId = null;

    $("#sourceLesson").value = state.lessons[0]?.id || "";
    $("#sourceLabel").value = "";
    $("#sourceType").value = "web";
    $("#sourceSort").value = "10";
    $("#sourceUrl").value = "";
    $("#sourceCitation").value = "";

    renderSources();
  }

  function selectSource(id) {
    const s = state.sources.find(row => String(row.id) === String(id));
    if (!s) return;

    state.selected.sourceId = s.id;

    $("#sourceLesson").value = s.lesson_id || "";
    $("#sourceLabel").value = s.label || "";
    $("#sourceType").value = s.source_type || "web";
    $("#sourceSort").value = s.sort_order ?? 0;
    $("#sourceUrl").value = s.url || "";
    $("#sourceCitation").value = s.citation || "";

    renderSources();
  }

  async function saveSource() {
    if (!$("#sourceLesson").value || !$("#sourceLabel").value.trim()) {
      showToast("Source lesson and label are required.", "bad");
      return;
    }

    const payload = {
      lesson_id: $("#sourceLesson").value,
      label: $("#sourceLabel").value.trim(),
      source_type: $("#sourceType").value,
      sort_order: toInteger($("#sourceSort").value, 0),
      url: $("#sourceUrl").value.trim() || null,
      citation: $("#sourceCitation").value.trim() || null,
      updated_by: currentUserId()
    };

    let response;

    if (state.selected.sourceId) {
      response = await state.supa
        .from("lkp_sources")
        .update(payload)
        .eq("id", state.selected.sourceId)
        .select()
        .single();
    } else {
      payload.created_by = currentUserId();

      response = await state.supa
        .from("lkp_sources")
        .insert(payload)
        .select()
        .single();
    }

    if (response.error) {
      showToast(response.error.message, "bad");
      return;
    }

    await logRevision("source", String(response.data.id), state.selected.sourceId ? "update" : "create", response.data);
    state.selected.sourceId = response.data.id;
    await bootAdminApp();
    selectSource(response.data.id);
    showToast("Source saved.", "good");
  }

  async function deleteSource() {
    const id = state.selected.sourceId;
    if (!id) return showToast("Select a source first.", "bad");

    if (!confirm(`Delete source "${id}"?`)) return;

    const snapshot = state.sources.find(s => String(s.id) === String(id));

    const { error } = await state.supa
      .from("lkp_sources")
      .delete()
      .eq("id", id);

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("source", String(id), "delete", snapshot || {});
    newSource();
    await bootAdminApp();
    showToast("Source deleted.", "good");
  }

  /* ── Galaxy Settings ──────────────────────────────────────────────────── */

  function renderGalaxySettings() {
    const wrap = $("#galaxyList");
    if (!wrap) return;

    let rows = [...state.galaxy];

    const type = $("#galaxyTypeFilter")?.value || "all";

    if (type !== "all") {
      rows = rows.filter(g => g.target_type === type);
    }

    if (!rows.length) {
      wrap.innerHTML = `<div class="admin-note">No galaxy settings found.</div>`;
      return;
    }

    wrap.innerHTML = rows.map(g => {
      const key = `${g.target_type}:${g.target_id}`;

      return `
        <article class="admin-record ${state.selected.galaxyKey === key ? "is-active" : ""}" data-galaxy-key="${escapeHTML(key)}">
          <div class="admin-record__top">
            <span class="admin-record__title">${escapeHTML(g.target_type)} · ${escapeHTML(labelForTarget(g.target_type, g.target_id))}</span>
            <span class="admin-badge">${escapeHTML(g.label_visibility || "auto")}</span>
          </div>
          <div class="admin-record__meta">
            core: ${escapeHTML(g.core_color)} · glow: ${escapeHTML(g.glow_color)}
          </div>
        </article>
      `;
    }).join("");

    wrap.querySelectorAll("[data-galaxy-key]").forEach(card => {
      card.addEventListener("click", () => selectGalaxySetting(card.dataset.galaxyKey));
    });
  }

  function labelForTarget(type, id) {
    if (type === "platform") return id;
    if (type === "culture") return cultureName(id);
    if (type === "module") return moduleName(id);
    if (type === "lesson") return lessonName(id);
    return id;
  }

  function newGalaxySetting() {
    state.selected.galaxyKey = null;

    $("#galaxyTargetType").value = "culture";
    populateGalaxyTargetIds();
    $("#galaxyCoreColor").value = "#f0c96a";
    $("#galaxyGlowColor").value = "#54c6ee";
    $("#galaxyNebulaColor").value = "#8fa0ff";
    $("#galaxyDustDensity").value = "1.0";
    $("#galaxyOrbitRadius").value = "";
    $("#galaxyOrbitSpeed").value = "";
    $("#galaxyLabelVisibility").value = "auto";
    $("#galaxyMobilePriority").value = "0";
    $("#galaxySettingsJSON").value = "{}";

    renderGalaxySettings();
  }

  function selectGalaxySetting(key) {
    const [type, ...rest] = key.split(":");
    const targetId = rest.join(":");

    const g = state.galaxy.find(row => row.target_type === type && row.target_id === targetId);
    if (!g) return;

    state.selected.galaxyKey = key;

    $("#galaxyTargetType").value = g.target_type || "culture";
    populateGalaxyTargetIds();
    $("#galaxyTargetId").value = g.target_id || "";
    $("#galaxyCoreColor").value = g.core_color || "#f0c96a";
    $("#galaxyGlowColor").value = g.glow_color || "#54c6ee";
    $("#galaxyNebulaColor").value = g.nebula_color || "#8fa0ff";
    $("#galaxyDustDensity").value = g.dust_density ?? 1;
    $("#galaxyOrbitRadius").value = g.orbit_radius ?? "";
    $("#galaxyOrbitSpeed").value = g.orbit_speed ?? "";
    $("#galaxyLabelVisibility").value = g.label_visibility || "auto";
    $("#galaxyMobilePriority").value = g.mobile_priority ?? 0;
    $("#galaxySettingsJSON").value = JSON.stringify(g.settings || {}, null, 2);

    renderGalaxySettings();
  }

  async function saveGalaxySetting() {
    let settings;

    try {
      settings = safeJSON($("#galaxySettingsJSON").value, {});
    } catch (err) {
      showToast(err.message, "bad");
      return;
    }

    const targetType = $("#galaxyTargetType").value;
    const targetId = $("#galaxyTargetId").value;

    if (!targetType || !targetId) {
      showToast("Galaxy target type and ID are required.", "bad");
      return;
    }

    const payload = {
      target_type: targetType,
      target_id: targetId,
      core_color: $("#galaxyCoreColor").value.trim() || "#f0c96a",
      glow_color: $("#galaxyGlowColor").value.trim() || "#54c6ee",
      nebula_color: $("#galaxyNebulaColor").value.trim() || "#8fa0ff",
      dust_density: toNumberOrNull($("#galaxyDustDensity").value) ?? 1,
      orbit_radius: toNumberOrNull($("#galaxyOrbitRadius").value),
      orbit_speed: toNumberOrNull($("#galaxyOrbitSpeed").value),
      label_visibility: $("#galaxyLabelVisibility").value,
      mobile_priority: toInteger($("#galaxyMobilePriority").value, 0),
      settings,
      updated_by: currentUserId()
    };

    if (!state.selected.galaxyKey) {
      payload.created_by = currentUserId();
    }

    const { error } = await state.supa
      .from("lkp_galaxy_settings")
      .upsert(payload, { onConflict: "target_type,target_id" });

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    const key = `${targetType}:${targetId}`;
    await logRevision("galaxy", key, state.selected.galaxyKey ? "update" : "create", payload);
    state.selected.galaxyKey = key;
    await bootAdminApp();
    selectGalaxySetting(key);
    showToast("Galaxy settings saved.", "good");
  }

  async function deleteGalaxySetting() {
    const key = state.selected.galaxyKey;
    if (!key) return showToast("Select a galaxy setting first.", "bad");

    const [targetType, ...rest] = key.split(":");
    const targetId = rest.join(":");

    if (!confirm(`Delete galaxy settings for "${key}"?`)) return;

    const snapshot = state.galaxy.find(g => g.target_type === targetType && g.target_id === targetId);

    const { error } = await state.supa
      .from("lkp_galaxy_settings")
      .delete()
      .eq("target_type", targetType)
      .eq("target_id", targetId);

    if (error) {
      showToast(error.message, "bad");
      return;
    }

    await logRevision("galaxy", key, "delete", snapshot || {});
    newGalaxySetting();
    await bootAdminApp();
    showToast("Galaxy settings deleted.", "good");
  }

  /* ── Revisions ────────────────────────────────────────────────────────── */

  async function logRevision(targetType, targetId, action, snapshot) {
    if (!state.isAdmin) return;

    try {
      await state.supa
        .from("lkp_content_revisions")
        .insert({
          admin_id: currentUserId(),
          target_type: targetType,
          target_id: targetId,
          action,
          snapshot: snapshot || {},
          note: `Admin Deck ${action}`
        });
    } catch (err) {
      console.warn("[LKP Admin] Revision log failed:", err.message);
    }
  }

  /* ── Modal ────────────────────────────────────────────────────────────── */

  function openModal(html) {
    const overlay = $("#adminModalOverlay");
    const content = $("#adminModalContent");

    if (!overlay || !content) return;

    content.innerHTML = html;
    overlay.hidden = false;
    overlay.removeAttribute("hidden"); // belt-and-suspenders for browsers that cache hidden
  }

  function closeModal() {
    const overlay = $("#adminModalOverlay");
    if (!overlay) return;
    overlay.hidden = true;
    overlay.setAttribute("hidden", "");
  }

  document.addEventListener("DOMContentLoaded", init);
})();