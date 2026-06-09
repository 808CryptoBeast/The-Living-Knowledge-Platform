/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Lesson Management Workbench
   File: LKP/js/lkp-admin-workbench.js

   Local-first workbench that runs on admin.html.
   Reads base data from window.CULTURALVERSE_DATA / LKP_DATA / IKEVERSE_DATA.
   Reads and writes local overrides through window.LKPLessonOverrides.
   No Supabase required for lesson editing.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  function qs(sel, root) { return (root || document).querySelector(sel); }

  function getBaseData() {
    return window.CULTURALVERSE_DATA || window.LKP_DATA || window.IKEVERSE_DATA || null;
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fillField(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value == null ? '' : value;
  }

  function setSelect(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function setCheck(id, checked) {
    const el = document.getElementById(id);
    if (el) el.checked = !!checked;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  function getCheck(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  }

  /* ── State ────────────────────────────────────────────────────────────── */

  var state = {
    filterCultureId: '',
    filterModuleId: '',
    filterSearch: '',
    lesson: null,
    lessonCultureId: '',
    lessonModuleId: ''
  };

  /* ── Toast ────────────────────────────────────────────────────────────── */

  function toast(msg, type) {
    var el = document.getElementById('adminToast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'admin-toast admin-toast--' + (type || 'info') + ' is-visible';
    clearTimeout(el._wbTimer);
    el._wbTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 3400);
  }

  /* ── Stats ────────────────────────────────────────────────────────────── */

  function buildStats() {
    var data = getBaseData();
    if (!data) return;

    var cultures = data.cultures || [];
    var totalModules = 0, totalLessons = 0, liveLessons = 0;

    cultures.forEach(function (c) {
      (c.modules || []).forEach(function (m) {
        totalModules++;
        (m.lessons || []).forEach(function (l) {
          totalLessons++;
          if (l.status === 'live') liveLessons++;
        });
      });
    });

    function set(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
    set('statCultures', cultures.length);
    set('statModules', totalModules);
    set('statLessons', totalLessons);
    set('statLiveLessons', liveLessons);

    var overviewEl = document.getElementById('adminOverviewList');
    if (overviewEl) {
      var patchCount = window.LKPLessonOverrides
        ? window.LKPLessonOverrides.readLocalOverrides().lessons.length
        : 0;
      overviewEl.innerHTML =
        '<div class="admin-overview-item"><span>Cultures</span><strong>' + cultures.length + '</strong></div>' +
        '<div class="admin-overview-item"><span>Modules</span><strong>' + totalModules + '</strong></div>' +
        '<div class="admin-overview-item"><span>Total Lessons</span><strong>' + totalLessons + '</strong></div>' +
        '<div class="admin-overview-item"><span>Live Lessons</span><strong>' + liveLessons + '</strong></div>' +
        '<div class="admin-overview-item"><span>Local Overrides</span><strong>' + patchCount + '</strong></div>';
    }
  }

  /* ── Override count badge ─────────────────────────────────────────────── */

  function updateOverrideCount() {
    var el = document.getElementById('wbOverrideCount');
    if (!el) return;
    var count = window.LKPLessonOverrides
      ? window.LKPLessonOverrides.readLocalOverrides().lessons.length
      : 0;
    el.textContent = count === 0 ? 'No local overrides' : count + ' local override' + (count === 1 ? '' : 's');
  }

  /* ── Culture filter dropdown ──────────────────────────────────────────── */

  function buildCultureFilter() {
    var data = getBaseData();
    if (!data) return;

    var cultures = data.cultures || [];
    var el = document.getElementById('lessonCultureFilter');
    if (!el) return;

    var html = '<option value="">All Cultures</option>';
    cultures.forEach(function (c) {
      html += '<option value="' + esc(c.id) + '">' + esc(c.name || c.id) + '</option>';
    });
    el.innerHTML = html;
    el.value = state.filterCultureId;
  }

  /* ── Module filter dropdown ───────────────────────────────────────────── */

  function buildModuleFilter() {
    var data = getBaseData();
    if (!data) return;

    var el = document.getElementById('lessonModuleFilter');
    if (!el) return;

    var cultures = state.filterCultureId
      ? (data.cultures || []).filter(function (c) { return c.id === state.filterCultureId; })
      : (data.cultures || []);

    var html = '<option value="">All Modules</option>';
    cultures.forEach(function (c) {
      (c.modules || []).forEach(function (m) {
        html += '<option value="' + esc(m.id) + '">' + esc(m.title || m.id) + '</option>';
      });
    });
    el.innerHTML = html;
    el.value = state.filterModuleId;
  }

  /* ── Lesson module dropdown (in form) ────────────────────────────────── */

  function buildFormModuleDropdown(cultureId) {
    var data = getBaseData();
    if (!data) return;

    var el = document.getElementById('lessonModule');
    if (!el) return;

    var cultures = cultureId
      ? (data.cultures || []).filter(function (c) { return c.id === cultureId; })
      : (data.cultures || []);

    var html = '';
    cultures.forEach(function (c) {
      (c.modules || []).forEach(function (m) {
        var label = cultureId ? esc(m.title || m.id) : esc((c.name || c.id) + ' / ' + (m.title || m.id));
        html += '<option value="' + esc(m.id) + '" data-culture-id="' + esc(c.id) + '">' + label + '</option>';
      });
    });
    el.innerHTML = html || '<option value="">— No modules —</option>';
  }

  /* ── Lesson list ──────────────────────────────────────────────────────── */

  function buildLessonList() {
    var data = getBaseData();
    var el = document.getElementById('lessonList');
    if (!data || !el) return;

    var patchIds = new Set();
    if (window.LKPLessonOverrides) {
      window.LKPLessonOverrides.readLocalOverrides().lessons.forEach(function (p) {
        patchIds.add(p.id);
      });
    }

    var search = state.filterSearch.toLowerCase();
    var rows = [];

    (data.cultures || []).forEach(function (culture) {
      if (state.filterCultureId && culture.id !== state.filterCultureId) return;
      (culture.modules || []).forEach(function (module) {
        if (state.filterModuleId && module.id !== state.filterModuleId) return;
        (module.lessons || []).forEach(function (lesson) {
          if (search && !(
            (lesson.title || '').toLowerCase().includes(search) ||
            (lesson.id || '').toLowerCase().includes(search)
          )) return;
          rows.push({ lesson: lesson, culture: culture, module: module });
        });
      });
    });

    if (!rows.length) {
      el.innerHTML = '<p class="admin-wb-empty">No lessons found.</p>';
      return;
    }

    var html = '';
    rows.forEach(function (row) {
      var l = row.lesson;
      var statusBadgeClass = l.status === 'live' ? 'admin-badge--live'
        : l.status === 'archived' ? 'admin-badge--archived'
        : 'admin-badge--draft';
      var overrideBadge = patchIds.has(l.id)
        ? '<span class="admin-badge admin-badge--override">override</span>'
        : '';
      var isSelected = state.lesson && state.lesson.id === l.id ? ' is-active' : '';

      html +=
        '<button class="admin-record' + isSelected + '" type="button"' +
        ' data-lesson-id="' + esc(l.id) + '"' +
        ' data-culture-id="' + esc(row.culture.id) + '"' +
        ' data-module-id="' + esc(row.module.id) + '">' +
        '<div class="admin-record__top">' +
        '<span class="admin-record__title">' + esc(l.title || l.id) + '</span>' +
        '<div class="admin-record__badges">' +
        '<span class="admin-badge ' + statusBadgeClass + '">' + esc(l.status || 'draft') + '</span>' +
        overrideBadge +
        '</div></div>' +
        '<div class="admin-record__meta">' + esc(row.culture.name || row.culture.id) + ' &rsaquo; ' + esc(row.module.title || row.module.id) + '</div>' +
        '</button>';
    });

    el.innerHTML = html;

    el.querySelectorAll('[data-lesson-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var data = getBaseData();
        var cultureId = btn.dataset.cultureId;
        var moduleId = btn.dataset.moduleId;
        var lessonId = btn.dataset.lessonId;
        var culture = (data.cultures || []).find(function (c) { return c.id === cultureId; });
        var module = culture ? (culture.modules || []).find(function (m) { return m.id === moduleId; }) : null;
        var lesson = module ? (module.lessons || []).find(function (l) { return l.id === lessonId; }) : null;
        if (lesson) selectLesson(lesson, cultureId, moduleId);
      });
    });
  }

  /* ── Select lesson into form ─────────────────────────────────────────── */

  function selectLesson(lesson, cultureId, moduleId) {
    state.lesson = lesson;
    state.lessonCultureId = cultureId;
    state.lessonModuleId = moduleId;

    fillField('lessonId', lesson.id || '');
    buildFormModuleDropdown(cultureId);
    setSelect('lessonModule', moduleId);
    fillField('lessonNum', lesson.lessonNum || lesson.num || '');
    fillField('lessonTitle', lesson.title || '');
    fillField('lessonReadTime', lesson.readTime || '');
    setSelect('lessonStatus', lesson.status || 'draft');
    fillField('lessonSort', lesson.sort != null ? lesson.sort : '');
    fillField('lessonMana', lesson.mana != null ? lesson.mana : (lesson.manaReward != null ? lesson.manaReward : ''));
    fillField('lessonXP', lesson.xp != null ? lesson.xp : (lesson.xpReward != null ? lesson.xpReward : ''));
    setCheck('lessonFeatured', !!lesson.featured);
    fillField('lessonTags', Array.isArray(lesson.tags) ? lesson.tags.join(', ') : (lesson.tags || ''));
    fillField('lessonPrerequisites', Array.isArray(lesson.prerequisites) ? lesson.prerequisites.join(', ') : (lesson.prerequisites || ''));
    fillField('lessonLead', lesson.lead || '');
    fillField('lessonExcerpt', lesson.excerpt || '');
    fillField('lessonContent', lesson.content || '');

    document.querySelectorAll('#lessonList .admin-record').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.lessonId === lesson.id);
    });
  }

  function clearForm() {
    state.lesson = null;
    state.lessonCultureId = '';
    state.lessonModuleId = '';

    ['lessonId', 'lessonNum', 'lessonTitle', 'lessonReadTime', 'lessonSort',
      'lessonMana', 'lessonXP', 'lessonTags', 'lessonPrerequisites',
      'lessonLead', 'lessonExcerpt', 'lessonContent'].forEach(function (id) {
      fillField(id, '');
    });
    setSelect('lessonStatus', 'draft');
    setCheck('lessonFeatured', false);

    document.querySelectorAll('#lessonList .admin-record').forEach(function (btn) {
      btn.classList.remove('is-active');
    });
  }

  /* ── Save ─────────────────────────────────────────────────────────────── */

  function handleSave() {
    if (!window.LKPLessonOverrides) {
      toast('Override engine not loaded', 'error');
      return;
    }

    var id = getVal('lessonId').trim();
    if (!id) { toast('Lesson ID is required', 'error'); return; }

    var moduleEl = document.getElementById('lessonModule');
    var moduleId = moduleEl ? moduleEl.value : '';
    var selectedOpt = moduleEl && moduleEl.options[moduleEl.selectedIndex];
    var cultureId = (selectedOpt && selectedOpt.dataset.cultureId) || state.lessonCultureId;

    if (!cultureId || !moduleId) {
      toast('Select a culture filter and module before saving', 'error');
      return;
    }

    var tagsRaw = getVal('lessonTags');
    var prereqRaw = getVal('lessonPrerequisites');

    var patch = {
      id: id,
      cultureId: cultureId,
      moduleId: moduleId,
      title: getVal('lessonTitle'),
      readTime: getVal('lessonReadTime'),
      status: getVal('lessonStatus') || 'draft',
      lead: getVal('lessonLead'),
      excerpt: getVal('lessonExcerpt'),
      content: getVal('lessonContent'),
      featured: getCheck('lessonFeatured')
    };

    var numVal = getVal('lessonNum');
    if (numVal.trim()) patch.lessonNum = numVal.trim();

    var sortVal = getVal('lessonSort');
    if (sortVal.trim() !== '') patch.sort = Number(sortVal);

    var manaVal = getVal('lessonMana');
    if (manaVal.trim() !== '') patch.mana = Number(manaVal);

    var xpVal = getVal('lessonXP');
    if (xpVal.trim() !== '') patch.xp = Number(xpVal);

    if (tagsRaw.trim()) {
      patch.tags = tagsRaw.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }
    if (prereqRaw.trim()) {
      patch.prerequisites = prereqRaw.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }

    state.lessonCultureId = cultureId;
    state.lessonModuleId = moduleId;

    window.LKPLessonOverrides.upsertLessonPatch(patch);
    window.LKPLessonOverrides.applyAndExpose();
    toast('Lesson saved as local override', 'success');
    refresh();
  }

  /* ── Delete ───────────────────────────────────────────────────────────── */

  function handleDelete() {
    if (!window.LKPLessonOverrides) { toast('Override engine not loaded', 'error'); return; }

    var id = getVal('lessonId').trim();
    if (!id) { toast('No lesson selected', 'error'); return; }

    var cultureId = state.lessonCultureId;
    var moduleId = state.lessonModuleId;
    if (!cultureId || !moduleId) { toast('Cannot determine culture/module for deletion', 'error'); return; }

    if (!confirm('Mark "' + id + '" as deleted? This will hide it from the lesson viewer.')) return;

    var patchSet = window.LKPLessonOverrides.readLocalOverrides();
    var existing = patchSet.lessons.find(function (p) { return p.id === id; });

    window.LKPLessonOverrides.upsertLessonPatch(
      Object.assign({}, existing || {}, { id: id, cultureId: cultureId, moduleId: moduleId, status: 'deleted' })
    );
    window.LKPLessonOverrides.applyAndExpose();
    toast('Lesson marked as deleted', 'success');
    clearForm();
    refresh();
  }

  /* ── Preview ──────────────────────────────────────────────────────────── */

  function handlePreview() {
    var overlay = document.getElementById('adminModalOverlay');
    var contentEl = document.getElementById('adminModalContent');
    if (!overlay || !contentEl) return;

    var title = getVal('lessonTitle') || 'Lesson Preview';
    var lead = getVal('lessonLead');
    var content = getVal('lessonContent');
    var readTime = getVal('lessonReadTime');
    var status = getVal('lessonStatus');

    contentEl.innerHTML =
      '<div class="admin-preview-header">' +
      '<span class="admin-badge ' + (status === 'live' ? 'admin-badge--live' : 'admin-badge--draft') + '">' + esc(status || 'draft') + '</span>' +
      (readTime ? '<span class="admin-badge">' + esc(readTime) + '</span>' : '') +
      '</div>' +
      '<h2 class="admin-preview-title">' + esc(title) + '</h2>' +
      (lead ? '<p class="admin-preview-lead">' + esc(lead) + '</p>' : '') +
      '<div class="admin-preview-body">' + (content || '<p><em>No content yet.</em></p>') + '</div>';

    overlay.removeAttribute('hidden');
  }

  /* ── Export overrides ─────────────────────────────────────────────────── */

  function handleExport() {
    if (!window.LKPLessonOverrides) { toast('Override engine not loaded', 'error'); return; }

    var patchSet = window.LKPLessonOverrides.readLocalOverrides();
    var json = JSON.stringify(patchSet, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'lkp-lesson-overrides-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('Overrides exported to file', 'success');
  }

  /* ── Import overrides ─────────────────────────────────────────────────── */

  function handleImport(json) {
    if (!window.LKPLessonOverrides) { toast('Override engine not loaded', 'error'); return; }

    var parsed;
    try {
      parsed = JSON.parse(json);
    } catch (e) {
      toast('Invalid JSON — could not parse', 'error');
      return;
    }

    var normalized = window.LKPLessonOverrides.normalizePatchSet(parsed);
    window.LKPLessonOverrides.writeLocalOverrides(normalized);
    window.LKPLessonOverrides.applyAndExpose();
    toast('Imported ' + normalized.lessons.length + ' lesson patch' + (normalized.lessons.length === 1 ? '' : 'es'), 'success');
    refresh();
  }

  function showImportModal() {
    var overlay = document.getElementById('adminModalOverlay');
    var contentEl = document.getElementById('adminModalContent');
    if (!overlay || !contentEl) return;

    contentEl.innerHTML =
      '<h2 class="admin-preview-title">Import Override JSON</h2>' +
      '<p style="color:var(--admin-muted);margin:0 0 12px 0;font-size:14px">Paste the contents of a previously exported override JSON file.</p>' +
      '<textarea id="wbImportTextarea" class="admin-wb-import-textarea" rows="14" spellcheck="false" placeholder=\'{"version":1,"lessons":[]}\' ></textarea>' +
      '<div class="admin-actions" style="margin-top:14px">' +
      '<button id="wbImportConfirmBtn" class="admin-main-btn" type="button">Import Overrides</button>' +
      '<button id="wbImportCancelBtn" class="admin-main-btn admin-main-btn--ghost" type="button">Cancel</button>' +
      '</div>';

    overlay.removeAttribute('hidden');

    var confirmBtn = document.getElementById('wbImportConfirmBtn');
    var cancelBtn = document.getElementById('wbImportCancelBtn');

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        var json = document.getElementById('wbImportTextarea')?.value || '';
        overlay.setAttribute('hidden', '');
        handleImport(json);
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        overlay.setAttribute('hidden', '');
      });
    }
  }

  /* ── Clear all overrides ──────────────────────────────────────────────── */

  function handleClearOverrides() {
    if (!window.LKPLessonOverrides) return;
    if (!confirm('Clear ALL local lesson overrides? This cannot be undone.')) return;
    window.LKPLessonOverrides.writeLocalOverrides({
      version: 1,
      updatedAt: new Date().toISOString(),
      lessons: []
    });
    window.LKPLessonOverrides.applyAndExpose();
    toast('All local overrides cleared', 'success');
    clearForm();
    refresh();
  }

  /* ── Inject workbench toolbar ─────────────────────────────────────────── */

  function injectWorkbenchToolbar() {
    var lessonPanel = qs('[data-admin-panel="lessons"]');
    if (!lessonPanel || lessonPanel.querySelector('.admin-wb-toolbar')) return;

    var toolbar = document.createElement('div');
    toolbar.className = 'admin-wb-toolbar';
    toolbar.innerHTML =
      '<button id="wbExportBtn" class="admin-small-btn" type="button">' +
      '<i class="fas fa-download"></i> Export Overrides</button>' +
      '<button id="wbImportBtn" class="admin-small-btn" type="button">' +
      '<i class="fas fa-upload"></i> Import JSON</button>' +
      '<button id="wbClearBtn" class="admin-small-btn admin-small-btn--danger" type="button">' +
      '<i class="fas fa-trash-alt"></i> Clear All</button>' +
      '<span id="wbOverrideCount" class="admin-wb-count"></span>';

    lessonPanel.insertBefore(toolbar, lessonPanel.firstChild);

    document.getElementById('wbExportBtn')?.addEventListener('click', handleExport);
    document.getElementById('wbImportBtn')?.addEventListener('click', showImportModal);
    document.getElementById('wbClearBtn')?.addEventListener('click', handleClearOverrides);

    updateOverrideCount();
  }

  /* ── Tab system ───────────────────────────────────────────────────────── */

  function initTabs() {
    document.querySelectorAll('.admin-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabName = btn.dataset.adminTab;
        document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('is-active'); });
        document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var panel = qs('[data-admin-panel="' + tabName + '"]');
        if (panel) panel.classList.add('is-active');
      });
    });
  }

  /* ── Modal close ──────────────────────────────────────────────────────── */

  function initModal() {
    var overlay = document.getElementById('adminModalOverlay');
    var closeBtn = document.getElementById('adminModalClose');
    if (!overlay) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', function () { overlay.setAttribute('hidden', ''); });
    }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.setAttribute('hidden', '');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) overlay.setAttribute('hidden', '');
    });
  }

  /* ── Refresh everything ───────────────────────────────────────────────── */

  function refresh() {
    buildStats();
    buildLessonList();
    updateOverrideCount();
  }

  /* ── Lesson panel wiring ──────────────────────────────────────────────── */

  function initLessonPanel() {
    var data = getBaseData();
    if (!data) return;

    buildCultureFilter();
    buildModuleFilter();
    buildLessonList();
    injectWorkbenchToolbar();

    document.getElementById('lessonCultureFilter')?.addEventListener('change', function (e) {
      state.filterCultureId = e.target.value;
      state.filterModuleId = '';
      buildModuleFilter();
      buildLessonList();
    });

    document.getElementById('lessonModuleFilter')?.addEventListener('change', function (e) {
      state.filterModuleId = e.target.value;
      buildLessonList();
    });

    document.getElementById('lessonSearch')?.addEventListener('input', function (e) {
      state.filterSearch = e.target.value;
      buildLessonList();
    });

    document.getElementById('newLessonBtn')?.addEventListener('click', function () {
      clearForm();
      if (state.filterCultureId) {
        state.lessonCultureId = state.filterCultureId;
        buildFormModuleDropdown(state.filterCultureId);
        if (state.filterModuleId) {
          state.lessonModuleId = state.filterModuleId;
          setSelect('lessonModule', state.filterModuleId);
        }
      } else {
        buildFormModuleDropdown('');
      }
      document.getElementById('lessonId')?.focus();
    });

    document.getElementById('saveLessonBtn')?.addEventListener('click', handleSave);
    document.getElementById('previewLessonBtn')?.addEventListener('click', handlePreview);
    document.getElementById('deleteLessonBtn')?.addEventListener('click', handleDelete);
  }

  /* ── Dashboard wiring ─────────────────────────────────────────────────── */

  function initDashboard() {
    document.getElementById('adminRefreshBtn')?.addEventListener('click', function () {
      if (window.LKPLessonOverrides) window.LKPLessonOverrides.applyAndExpose();
      refresh();
      toast('Content refreshed', 'success');
    });
  }

  /* ── Core workbench boot (called after auth confirmed) ───────────────── */

  function bootWorkbench() {
    if (window._lkpWorkbenchBooted) return;
    window._lkpWorkbenchBooted = true;

    var data = getBaseData();
    if (!data) {
      console.warn('[LKP Workbench] Base data not found — data scripts may not be loaded.');
      return;
    }

    if (window.LKPLessonOverrides) {
      window.LKPLessonOverrides.applyAndExpose();
    }

    initTabs();
    initModal();
    initDashboard();
    initLessonPanel();
    buildStats();
  }

  /* ── Init — waits for lkp:admin-authed before booting ────────────────── */

  function init() {
    /* If auth already confirmed (race-condition guard) */
    if (window.LKP_ADMIN_AUTHED) {
      bootWorkbench();
      return;
    }

    /* Otherwise wait for the auth gate to signal access */
    window.addEventListener('lkp:admin-authed', function () {
      bootWorkbench();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
