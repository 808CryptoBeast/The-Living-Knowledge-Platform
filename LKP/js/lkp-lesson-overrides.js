(function () {
  'use strict';

  const STORAGE_KEY = 'lkp_lesson_overrides_v1';
  const DELETE_SENTINEL = '__delete';

  function clone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function readLocalOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return normalizePatchSet(parsed);
    } catch (err) {
      console.warn('[LKP Overrides] Could not read local overrides:', err);
      return emptyPatchSet();
    }
  }

  function writeLocalOverrides(patchSet) {
    const normalized = normalizePatchSet(patchSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized, null, 2));
    return normalized;
  }

  function emptyPatchSet() {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      lessons: []
    };
  }

  function normalizePatchSet(value) {
    if (!value || typeof value !== 'object') return emptyPatchSet();
    const lessons = Array.isArray(value.lessons) ? value.lessons : [];
    return {
      version: Number(value.version || 1),
      updatedAt: value.updatedAt || new Date().toISOString(),
      lessons: lessons
        .filter(item => item && typeof item === 'object' && item.id)
        .map(item => ({ ...item }))
    };
  }

  function mergeObject(base, patch) {
    const out = { ...(base || {}) };
    Object.keys(patch || {}).forEach(key => {
      if (key === 'id' || key === 'cultureId' || key === 'moduleId') {
        out[key] = patch[key];
        return;
      }

      if (patch[key] === DELETE_SENTINEL) {
        delete out[key];
        return;
      }

      if (
        patch[key] &&
        typeof patch[key] === 'object' &&
        !Array.isArray(patch[key]) &&
        out[key] &&
        typeof out[key] === 'object' &&
        !Array.isArray(out[key])
      ) {
        out[key] = mergeObject(out[key], patch[key]);
        return;
      }

      out[key] = patch[key];
    });
    return out;
  }

  function findCulture(data, cultureId) {
    return (data.cultures || []).find(culture => culture.id === cultureId) || null;
  }

  function findModule(culture, moduleId) {
    return (culture.modules || []).find(module => module.id === moduleId) || null;
  }

  function ensureModule(data, patch) {
    const culture = findCulture(data, patch.cultureId);
    if (!culture) return null;

    culture.modules = Array.isArray(culture.modules) ? culture.modules : [];
    let module = findModule(culture, patch.moduleId);

    if (!module) {
      module = {
        id: patch.moduleId,
        title: patch.moduleTitle || 'Draft Module',
        desc: '',
        lessons: []
      };
      culture.modules.push(module);
    }

    module.lessons = Array.isArray(module.lessons) ? module.lessons : [];
    return module;
  }

  function applyLessonPatch(data, patch) {
    if (!patch || !patch.id || !patch.cultureId || !patch.moduleId) return;

    const module = ensureModule(data, patch);
    if (!module) return;

    const idx = module.lessons.findIndex(lesson => lesson.id === patch.id);
    const fields = { ...patch };
    delete fields.cultureId;
    delete fields.moduleId;
    delete fields.moduleTitle;

    if (fields.status === 'deleted') {
      if (idx >= 0) module.lessons.splice(idx, 1);
      return;
    }

    if (idx >= 0) {
      module.lessons[idx] = mergeObject(module.lessons[idx], fields);
    } else {
      module.lessons.push({
        id: patch.id,
        title: patch.title || patch.id,
        readTime: patch.readTime || 'Draft',
        status: patch.status || 'draft',
        content: patch.content || '<p>Draft lesson content.</p>',
        ...fields
      });
    }
  }

  function applyOverrides(data, patchSet) {
    const next = clone(data || { cultures: [] }) || { cultures: [] };
    next.cultures = Array.isArray(next.cultures) ? next.cultures : [];
    const normalized = normalizePatchSet(patchSet || readLocalOverrides());

    normalized.lessons.forEach(patch => applyLessonPatch(next, patch));
    return next;
  }

  function getBaseData() {
    return [window.CULTURALVERSE_DATA, window.LKP_DATA, window.IKEVERSE_DATA]
      .find(item => item && Array.isArray(item.cultures));
  }

  function applyAndExpose(patchSet) {
    const base = getBaseData();
    if (!base) return null;

    const data = applyOverrides(base, patchSet);
    window.CULTURALVERSE_DATA = data;
    window.LKP_DATA = data;
    window.IKEVERSE_DATA = data;
    window.dispatchEvent(new CustomEvent('lkp:data-ready', {
      detail: {
        cultures: data.cultures.length,
        data
      }
    }));
    return data;
  }

  function upsertLessonPatch(patch) {
    const patchSet = readLocalOverrides();
    const idx = patchSet.lessons.findIndex(item => item.id === patch.id);
    const nextPatch = {
      ...patch,
      updatedAt: new Date().toISOString()
    };

    if (idx >= 0) patchSet.lessons[idx] = nextPatch;
    else patchSet.lessons.push(nextPatch);

    patchSet.updatedAt = new Date().toISOString();
    writeLocalOverrides(patchSet);
    return patchSet;
  }

  function removeLessonPatch(id) {
    const patchSet = readLocalOverrides();
    patchSet.lessons = patchSet.lessons.filter(item => item.id !== id);
    patchSet.updatedAt = new Date().toISOString();
    writeLocalOverrides(patchSet);
    return patchSet;
  }

  window.LKPLessonOverrides = {
    STORAGE_KEY,
    DELETE_SENTINEL,
    readLocalOverrides,
    writeLocalOverrides,
    applyOverrides,
    applyAndExpose,
    upsertLessonPatch,
    removeLessonPatch,
    normalizePatchSet
  };
})();
