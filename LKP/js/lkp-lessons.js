/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — DEEP LESSONS PAGE
   File: LKP/js/lkp-lessons.js

   Additive upgrades:
   - Cultural progress bars
   - Complete Lesson + Mana reward button
   - Reflection prompts saved per lesson
   - Scholar / Keiki mode
   - Related lessons strip
   - Sources / further study renderer
   - Glossary <term> hover/tap cards
   - Timeline / compare / activity / teacher-note / historian-note tags
   - Reading focus mode
   - Font size controls
   - Three.js lesson background, hero scene, and completion ceremony
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const COMPLETED_KEY = 'cv_completed';
  const MANA_KEY = 'cv_mana';
  const REFLECTIONS_KEY = 'lkp_lesson_reflections_v1';
  const MODE_KEY = 'lkp_lesson_mode_v1';
  const FONT_SCALE_KEY = 'lkp_lesson_font_scale_v1';

  const DEFAULT_MANA = 10;

  const GLOSSARY = {
    mana: {
      title: 'Mana',
      culture: 'Kānaka Maoli',
      body: 'Spiritual power, authority, presence, and life-force. Mana is strengthened through right relationship, responsibility, and pono action.'
    },
    pono: {
      title: 'Pono',
      culture: 'Kānaka Maoli',
      body: 'Balance, righteousness, proper relationship, and alignment with what is good, true, and life-supporting.'
    },
    aloha: {
      title: 'Aloha',
      culture: 'Kānaka Maoli',
      body: 'More than greeting or affection. Aloha carries presence, breath, compassion, responsibility, and right relationship.'
    },
    kumulipo: {
      title: 'Kumulipo',
      culture: 'Kānaka Maoli',
      body: 'A deep Hawaiian creation chant and genealogy that preserves relationships among darkness, life, sea, land, chiefs, and the cosmos.'
    },
    moolelo: {
      title: 'Moʻolelo',
      culture: 'Kānaka Maoli',
      body: 'Story, history, narrative, and carried memory. Moʻolelo transmits knowledge through relationship, place, and generations.'
    },
    wa: {
      title: 'Wā',
      culture: 'Kānaka Maoli',
      body: 'Time, period, space, or interval. In Hawaiian thought, time is often relational and genealogical, not only mechanical.'
    },
    maat: {
      title: 'Maʻat',
      culture: 'Kemet',
      body: 'Truth, balance, justice, harmony, right order, and the ethical structure that sustains life and cosmos.'
    },
    nun: {
      title: 'Nun',
      culture: 'Kemet',
      body: 'The primordial waters or undifferentiated source from which creation emerges in Kemetic cosmology.'
    },
    duat: {
      title: 'Duat',
      culture: 'Kemet',
      body: 'A complex underworld/cosmic realm associated with night, transformation, judgment, renewal, and the journey of the soul.'
    },
    isfet: {
      title: 'Isfet',
      culture: 'Kemet',
      body: 'Disorder, imbalance, falsehood, violence, and rupture — the opposite of Maʻat.'
    }
  };

  const DEFAULT_REFLECTIONS = [
    'What is the deepest idea this lesson is trying to preserve?',
    'How does this knowledge connect land, sea, sky, family, or community?',
    'What is one way this teaching could matter in the modern world?'
  ];

  const state = {
    data: null,
    cultures: [],
    lessons: [],
    activeCulture: 'all',
    activeLessonId: null,
    mode: localStorage.getItem(MODE_KEY) || 'scholar',
    fontScale: Number(localStorage.getItem(FONT_SCALE_KEY) || '1') || 1,
    completed: readJSON(COMPLETED_KEY, []),
    reflections: readJSON(REFLECTIONS_KEY, {}),
    sidebarSearch: '',
    three: {
      ready: false,
      THREE: null,
      bg: null,
      hero: null,
      ceremony: null
    }
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
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
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('[LKP Lessons] localStorage write failed:', err);
    }
  }

  function stripHTML(value) {
    return String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getData() {
    const candidates = [
      window.CULTURALVERSE_DATA,
      window.LKP_DATA,
      window.IKEVERSE_DATA
    ];

    const data = candidates.find(item => {
      return item && Array.isArray(item.cultures) && item.cultures.length > 0;
    });

    if (data) {
      window.CULTURALVERSE_DATA = data;
      window.LKP_DATA = data;
      window.IKEVERSE_DATA = data;
      return data;
    }

    return null;
  }

  function normalizeSources(raw) {
    if (!Array.isArray(raw)) return [];

    return raw
      .map(source => {
        if (typeof source === 'string') {
          return { label: source, url: '' };
        }

        return {
          label: source.label || source.title || source.name || '',
          url: source.url || source.href || '',
          note: source.note || source.desc || ''
        };
      })
      .filter(source => source.label);
  }

  function normalizeKidVersion(lesson) {
    const kid =
      lesson.kidVersion ||
      lesson.keikiVersion ||
      lesson.kid ||
      lesson.keiki ||
      null;

    if (kid && typeof kid === 'object') {
      return {
        summary: kid.summary || kid.intro || '',
        bigIdeas: Array.isArray(kid.bigIdeas) ? kid.bigIdeas : [],
        vocabulary: Array.isArray(kid.vocabulary) ? kid.vocabulary : [],
        activity: kid.activity || '',
        reflection: Array.isArray(kid.reflection) ? kid.reflection : []
      };
    }

    return null;
  }

  function normalizeLessonScene(lesson, culture, module) {
    const scene =
      lesson.scene ||
      lesson.heroScene ||
      lesson.threeScene ||
      lesson.visual ||
      {};

    return {
      type:
        scene.type ||
        lesson.sceneType ||
        guessSceneType(lesson, culture, module),
      primary: scene.primary || getCultureColor(culture.theme),
      secondary: scene.secondary || getCultureSecondaryColor(culture.theme),
      symbol: scene.symbol || lesson.moduleEmoji || module.emoji || culture.emoji || '✦'
    };
  }

  function normalizeData(data) {
    const cultures = Array.isArray(data?.cultures) ? data.cultures : [];

    return cultures.map(culture => ({
      id: culture.id || '',
      name: culture.name || 'Untitled Culture',
      emoji: culture.emoji || '✶',
      tagline: culture.tagline || '',
      theme: culture.theme || 'default',
      status: culture.status || 'live',
      intro: culture.intro || '',
      modules: Array.isArray(culture.modules)
        ? culture.modules.map(module => ({
            id: module.id || '',
            title: module.title || 'Untitled Module',
            emoji: module.emoji || culture.emoji || '✶',
            desc: module.desc || '',
            lessons: Array.isArray(module.lessons)
              ? module.lessons.map(lesson => ({
                  id: lesson.id || '',
                  num: lesson.num || '',
                  title: lesson.title || 'Untitled Lesson',
                  readTime: lesson.readTime || '',
                  content: lesson.content || '',
                  excerpt: lesson.excerpt || lesson.leadText || lesson.lead_text || '',
                  mana: Number(lesson.mana || DEFAULT_MANA),
                  xp: Number(lesson.xp || 25),
                  sources: normalizeSources(lesson.sources || lesson.references || lesson.furtherReading),
                  related: Array.isArray(lesson.related) ? lesson.related : [],
                  concepts: Array.isArray(lesson.concepts) ? lesson.concepts : [],
                  kidVersion: normalizeKidVersion(lesson),
                  cultureId: culture.id || '',
                  cultureName: culture.name || 'Untitled Culture',
                  cultureEmoji: culture.emoji || '✶',
                  cultureTheme: culture.theme || 'default',
                  moduleId: module.id || '',
                  moduleTitle: module.title || 'Untitled Module',
                  moduleEmoji: module.emoji || culture.emoji || '✶',
                  scene: normalizeLessonScene(lesson, culture, module)
                }))
              : []
          }))
        : []
    }));
  }

  function flattenLessons(cultures) {
    const lessons = [];

    cultures.forEach(culture => {
      culture.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          lessons.push({
            ...lesson,
            cultureId: culture.id,
            cultureName: culture.name,
            cultureEmoji: culture.emoji,
            cultureTheme: culture.theme,
            moduleId: module.id,
            moduleTitle: module.title,
            moduleEmoji: module.emoji,
            contentText: stripHTML(lesson.content || '')
          });
        });
      });
    });

    return lessons;
  }

  function getCultureColor(theme) {
    const colors = {
      emerald: '#3cb371',
      kanaka: '#3cb371',
      gold: '#f0c96a',
      kemet: '#f0c96a',
      bridge: '#8fa0ff',
      rust: '#d98545',
      amber: '#e4ad48',
      saffron: '#ffb347',
      cyan: '#54c6ee',
      violet: '#8fa0ff',
      default: '#54c6ee'
    };

    return colors[theme] || colors.default;
  }

  function getCultureSecondaryColor(theme) {
    const colors = {
      emerald: '#54c6ee',
      kanaka: '#54c6ee',
      gold: '#d98545',
      kemet: '#d98545',
      bridge: '#54c6ee',
      rust: '#f0c96a',
      amber: '#d98545',
      saffron: '#f0c96a',
      cyan: '#8fa0ff',
      violet: '#54c6ee',
      default: '#8fa0ff'
    };

    return colors[theme] || colors.default;
  }

  function guessSceneType(lesson, culture, module) {
    const text = [
      lesson.id,
      lesson.title,
      module.title,
      culture.id,
      culture.name
    ].join(' ').toLowerCase();

    if (text.includes('star') || text.includes('wayfinding') || text.includes('hōkū') || text.includes('hokule')) return 'starcompass';
    if (text.includes('kumulipo') || text.includes('creation') || text.includes('pō') || text.includes('po')) return 'creation';
    if (text.includes('aloha') || text.includes('maat') || text.includes('maʻat')) return 'balance';
    if (text.includes('nun') || text.includes('water')) return 'primordial';
    if (text.includes('medicine') || text.includes('laʻau') || text.includes('laau')) return 'healing';
    if (culture.id === 'kemet') return 'pyramid';
    if (culture.id === 'bridge') return 'bridge';
    return 'constellation';
  }

  function isCompleted(lessonId) {
    if (!lessonId) return false;

    if (window.LKPRewards && typeof window.LKPRewards.isCompleted === 'function') {
      try {
        return Boolean(window.LKPRewards.isCompleted(lessonId));
      } catch {}
    }

    return state.completed.includes(lessonId);
  }

  function syncCompletedFromRewards() {
    if (!window.LKPRewards) return;

    try {
      if (typeof window.LKPRewards.getCompletedLessons === 'function') {
        const completed = window.LKPRewards.getCompletedLessons();
        if (Array.isArray(completed)) {
          state.completed = completed;
          writeJSON(COMPLETED_KEY, state.completed);
        }
      }

      if (typeof window.LKPRewards.setCompletedLessons === 'function') {
        window.LKPRewards.setCompletedLessons(state.completed);
      }
    } catch (err) {
      console.warn('[LKP Lessons] Reward sync skipped:', err);
    }
  }

  function saveCompleted() {
    state.completed = [...new Set(state.completed.filter(Boolean))];
    writeJSON(COMPLETED_KEY, state.completed);

    if (window.LKPRewards && typeof window.LKPRewards.setCompletedLessons === 'function') {
      try {
        window.LKPRewards.setCompletedLessons(state.completed);
      } catch {}
    }
  }

  function getMana() {
    return Number(localStorage.getItem(MANA_KEY) || '0') || 0;
  }

  function setMana(value) {
    localStorage.setItem(MANA_KEY, String(Math.max(0, Number(value) || 0)));
  }

  function getVisibleCultures() {
    if (state.activeCulture === 'all') return state.cultures;
    return state.cultures.filter(culture => culture.id === state.activeCulture);
  }

  function getCultureProgress(culture) {
    const lessons = culture.modules.flatMap(module => module.lessons);
    const total = lessons.length;
    const done = lessons.filter(lesson => isCompleted(lesson.id)).length;
    const percent = total ? Math.round((done / total) * 100) : 0;

    return { total, done, percent };
  }

  function ensureSidebarTools() {
    const header = $('.lkp-sidebar__header');
    if (!header || $('#lessonTreeSearch')) return;

    const tools = document.createElement('div');
    tools.className = 'lkp-sidebar-tools';
    tools.innerHTML = `
      <label class="lkp-tree-search">
        <i class="fas fa-search"></i>
        <input id="lessonTreeSearch" type="search" placeholder="Search lessons..." autocomplete="off" />
      </label>
    `;

    header.appendChild(tools);
  }

  function renderCultureFilters() {
    const holder = $('#cultureFilters');
    const welcome = $('#welcomeCultures');
    if (!holder) return;

    const liveCultures = state.cultures.filter(culture => {
      return culture.modules.some(module => module.lessons.length);
    });

    holder.innerHTML = `
      <button class="cv-filter-btn is-active" type="button" data-culture-filter="all">
        All
      </button>
      ${state.cultures.map(culture => {
        const disabled = culture.modules.every(module => !module.lessons.length);

        return `
          <button
            class="cv-culture-filter ${disabled ? 'is-disabled' : ''}"
            type="button"
            data-culture-filter="${escapeHTML(culture.id)}"
            ${disabled ? 'disabled' : ''}
            style="--culture-color:${getCultureColor(culture.theme)}"
          >
            <span>${escapeHTML(culture.emoji)}</span>
            ${escapeHTML(culture.name)}
          </button>
        `;
      }).join('')}
    `;

    if (welcome) {
      welcome.innerHTML = liveCultures.map(culture => `
        <button
          class="cv-culture-filter"
          type="button"
          data-culture-filter="${escapeHTML(culture.id)}"
          style="--culture-color:${getCultureColor(culture.theme)}"
        >
          <span>${escapeHTML(culture.emoji)}</span>
          ${escapeHTML(culture.name)}
        </button>
      `).join('');
    }
  }

  function renderLessonTree() {
    const tree = $('#lessonTree');
    if (!tree) return;

    const q = state.sidebarSearch.trim().toLowerCase();
    const visibleCultures = getVisibleCultures();

    if (!state.cultures.length) {
      tree.innerHTML = `
        <div class="cv-tree-empty">
          <strong>No lesson data found.</strong>
          <span>Check that <code>LKP/js/lkp-data.js</code> loads before <code>LKP/js/lkp-lessons.js</code>.</span>
        </div>
      `;
      return;
    }

    const html = visibleCultures.map(culture => {
      const modulesWithLessons = culture.modules
        .map(module => ({
          ...module,
          lessons: module.lessons.filter(lesson => {
            if (!q) return true;

            return [
              lesson.title,
              lesson.num,
              culture.name,
              module.title,
              lesson.contentText,
              lesson.excerpt
            ].join(' ').toLowerCase().includes(q);
          })
        }))
        .filter(module => module.lessons.length);

      const progress = getCultureProgress(culture);

      if (!modulesWithLessons.length) {
        return `
          <section class="cv-tree-culture">
            <div class="cv-tree-culture__title">
              <span>${escapeHTML(culture.emoji)}</span>
              ${escapeHTML(culture.name)}
            </div>
            <div class="cv-culture-progress">
              <div class="cv-culture-progress__meta">
                <span>${progress.done}/${progress.total} complete</span>
                <span>${progress.percent}%</span>
              </div>
              <div class="cv-culture-progress__bar">
                <span style="width:${progress.percent}%"></span>
              </div>
            </div>
            <div class="cv-tree-module">
              <div class="cv-tree-module__title">Coming Soon</div>
              <button class="cv-tree-lesson" type="button" disabled>
                <strong>${escapeHTML(q ? 'No matching lessons.' : culture.tagline || 'Lessons are being prepared.')}</strong>
                <small>${escapeHTML(culture.status || 'soon')}</small>
              </button>
            </div>
          </section>
        `;
      }

      return `
        <section class="cv-tree-culture">
          <div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}">
            <span>${escapeHTML(culture.emoji)}</span>
            ${escapeHTML(culture.name)}
          </div>

          <div class="cv-culture-progress">
            <div class="cv-culture-progress__meta">
              <span>${progress.done}/${progress.total} complete</span>
              <span>${progress.percent}%</span>
            </div>
            <div class="cv-culture-progress__bar">
              <span style="width:${progress.percent}%"></span>
            </div>
          </div>

          ${modulesWithLessons.map(module => `
            <div class="cv-tree-module">
              <div class="cv-tree-module__title">
                <span>${escapeHTML(module.emoji)}</span>
                ${escapeHTML(module.title)}
              </div>

              ${module.lessons.map(lesson => {
                const done = isCompleted(lesson.id);

                return `
                  <button
                    class="cv-tree-lesson ${lesson.id === state.activeLessonId ? 'is-active' : ''} ${done ? 'is-complete' : ''}"
                    type="button"
                    data-lesson-id="${escapeHTML(lesson.id)}"
                  >
                    <strong>${done ? '✓ ' : ''}${escapeHTML(lesson.num || 'LESSON')} · ${escapeHTML(lesson.title)}</strong>
                    <small>${escapeHTML(culture.name)} · ${escapeHTML(lesson.readTime || 'Lesson')}</small>
                  </button>
                `;
              }).join('')}
            </div>
          `).join('')}
        </section>
      `;
    }).join('');

    tree.innerHTML = html || `
      <div class="cv-tree-empty">
        <strong>No lessons found.</strong>
        <span>Choose a different culture filter.</span>
      </div>
    `;
  }

  function findLesson(id) {
    return state.lessons.find(lesson => lesson.id === id) || null;
  }

  function getLessonIndex(id) {
    return state.lessons.findIndex(lesson => lesson.id === id);
  }

  function getLessonBodyHTML(lesson) {
    if (state.mode === 'keiki') {
      return renderKeikiLessonContent(lesson);
    }

    return transformLessonContent(lesson.content, lesson);
  }

  function renderLesson(id, options = {}) {
    const lesson = findLesson(id);

    if (!lesson) {
      renderWelcome();
      return;
    }

    state.activeLessonId = lesson.id;
    state.activeCulture = lesson.cultureId || state.activeCulture;

    const welcome = $('#lessonWelcome');
    const article = $('#lessonArticle');
    const header = $('#lessonHeader');
    const body = $('#lessonBody');

    if (welcome) welcome.hidden = true;
    if (article) article.hidden = false;

    document.body.dataset.culture = lesson.cultureId || lesson.cultureTheme || 'default';
    document.body.dataset.lessonMode = state.mode;
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));

    if (header) {
      header.innerHTML = renderLessonHeader(lesson);
    }

    if (body) {
      body.innerHTML = getLessonBodyHTML(lesson);
    }

    renderSources(lesson);
    renderLessonNav();
    renderRelatedLessons(lesson);
    renderLessonTree();
    updateCompleteButton(lesson);
    updateUrlHash(lesson.id);
    bindReflectionTextareas(lesson);

    window.dispatchEvent(new CustomEvent('lkp:culture-changed', {
      detail: {
        cultureId: lesson.cultureId,
        cultureName: lesson.cultureName,
        color: getCultureColor(lesson.cultureTheme)
      }
    }));

    window.dispatchEvent(new CustomEvent('lkp:lesson-changed', {
      detail: {
        lessonId: lesson.id,
        lesson,
        scene: lesson.scene
      }
    }));

    updateHeroLabels(lesson);
    updateThreeHeroScene(lesson);

    if (!options.noScroll) {
      requestAnimationFrame(() => {
        $('#lessonMain')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    closeSidebarOnMobile();
  }

  function renderLessonHeader(lesson) {
    const done = isCompleted(lesson.id);
    const mana = lesson.mana || DEFAULT_MANA;

    return `
      <div class="cv-lesson-kicker">
        <span>${escapeHTML(lesson.cultureEmoji)}</span>
        ${escapeHTML(lesson.cultureName)} · ${escapeHTML(lesson.moduleTitle)}
      </div>

      <div class="cv-lesson-title-row">
        <h1 class="cv-lesson-title">${escapeHTML(lesson.title)}</h1>

        <div class="cv-lesson-reward-chip ${done ? 'is-complete' : ''}">
          <span>${done ? '✓ Complete' : `+${mana} Mana`}</span>
        </div>
      </div>

      <div class="cv-lesson-meta">
        <span>${escapeHTML(lesson.num || 'Lesson')}</span>
        <span>${escapeHTML(lesson.readTime || 'Deep Reading')}</span>
        <span>${escapeHTML(lesson.moduleEmoji)} ${escapeHTML(lesson.moduleTitle)}</span>
        <span>${state.mode === 'keiki' ? 'Keiki Mode' : 'Scholar Mode'}</span>
      </div>

      <div class="cv-lesson-actions">
        <button
          class="cv-action-btn cv-complete-btn ${done ? 'is-complete' : ''}"
          type="button"
          data-complete-active-lesson
        >
          ${done ? '✓ Lesson Complete' : `Complete Lesson · +${mana} Mana`}
        </button>

        <div class="cv-mode-toggle" role="group" aria-label="Lesson mode">
          <button class="cv-action-btn ${state.mode === 'scholar' ? 'is-active' : ''}" type="button" data-lesson-mode="scholar">
            Scholar
          </button>
          <button class="cv-action-btn ${state.mode === 'keiki' ? 'is-active' : ''}" type="button" data-lesson-mode="keiki">
            Keiki
          </button>
        </div>

        <div class="cv-font-controls" role="group" aria-label="Font size">
          <button class="cv-action-btn" type="button" data-font-adjust="-">A−</button>
          <button class="cv-action-btn" type="button" data-font-adjust="+">A+</button>
        </div>

        <button class="cv-action-btn" type="button" data-reading-mode>
          Focus Mode
        </button>
      </div>
    `;
  }

  function updateCompleteButton(lesson) {
    const btn = $('[data-complete-active-lesson]');
    if (!btn || !lesson) return;

    const done = isCompleted(lesson.id);
    btn.classList.toggle('is-complete', done);
    btn.textContent = done
      ? '✓ Lesson Complete'
      : `Complete Lesson · +${lesson.mana || DEFAULT_MANA} Mana`;
  }

  function renderWelcome() {
    const welcome = $('#lessonWelcome');
    const article = $('#lessonArticle');

    if (welcome) welcome.hidden = false;
    if (article) article.hidden = true;

    state.activeLessonId = null;
    renderLessonTree();
  }

  function renderLessonNav() {
    const nav = $('#lessonNav');
    if (!nav || !state.activeLessonId) return;

    const index = getLessonIndex(state.activeLessonId);
    const previous = index > 0 ? state.lessons[index - 1] : null;
    const next = index >= 0 && index < state.lessons.length - 1 ? state.lessons[index + 1] : null;

    nav.innerHTML = `
      <button
        class="cv-lesson-nav-btn"
        type="button"
        data-nav-lesson="${previous ? escapeHTML(previous.id) : ''}"
        ${previous ? '' : 'disabled'}
      >
        ← ${previous ? escapeHTML(previous.title) : 'Previous'}
      </button>

      <button
        class="cv-lesson-nav-btn"
        type="button"
        data-nav-lesson="${next ? escapeHTML(next.id) : ''}"
        ${next ? '' : 'disabled'}
      >
        ${next ? escapeHTML(next.title) : 'Next'} →
      </button>
    `;
  }

  function renderSources(lesson) {
    const holder = $('#lessonSources');
    if (!holder) return;

    const sources = lesson.sources || [];

    if (!sources.length) {
      holder.innerHTML = '';
      return;
    }

    holder.innerHTML = `
      <section class="cv-sources">
        <div class="cv-section-heading">
          <span>Sources & Further Study</span>
        </div>

        <div class="cv-source-list">
          ${sources.map(source => `
            <a
              class="cv-source-card"
              href="${escapeHTML(source.url || '#')}"
              ${source.url ? 'target="_blank" rel="noopener"' : ''}
            >
              <strong>${escapeHTML(source.label)}</strong>
              ${source.note ? `<span>${escapeHTML(source.note)}</span>` : ''}
              ${source.url ? `<small>Open source →</small>` : `<small>Reference note</small>`}
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  function getRelatedLessons(lesson) {
    const byId = new Map(state.lessons.map(item => [item.id, item]));

    const explicit = (lesson.related || [])
      .map(id => byId.get(id))
      .filter(Boolean);

    const sameModule = state.lessons.filter(item => {
      return item.id !== lesson.id && item.moduleId === lesson.moduleId;
    });

    const bridgeMatches = state.lessons.filter(item => {
      if (item.id === lesson.id) return false;

      const a = `${lesson.title} ${lesson.contentText}`.toLowerCase();
      const b = `${item.title} ${item.contentText}`.toLowerCase();

      const pairs = [
        ['kumulipo', 'nun'],
        ['aloha', 'maʻat'],
        ['aloha', 'maat'],
        ['star', 'wayfinding'],
        ['creation', 'primordial'],
        ['medicine', 'healing'],
        ['law', 'ethics']
      ];

      return pairs.some(([x, y]) => {
        return (a.includes(x) && b.includes(y)) || (a.includes(y) && b.includes(x));
      });
    });

    return [...new Map([...explicit, ...bridgeMatches, ...sameModule].map(item => [item.id, item])).values()]
      .filter(item => item.id !== lesson.id)
      .slice(0, 3);
  }

  function renderRelatedLessons(lesson) {
    const nav = $('#lessonNav');
    if (!nav) return;

    let holder = $('#relatedLessons');
    if (!holder) {
      holder = document.createElement('section');
      holder.id = 'relatedLessons';
      holder.className = 'cv-related';
      nav.insertAdjacentElement('afterend', holder);
    }

    const related = getRelatedLessons(lesson);

    if (!related.length) {
      holder.innerHTML = '';
      return;
    }

    holder.innerHTML = `
      <div class="cv-section-heading">
        <span>Related Lessons</span>
      </div>

      <div class="cv-related-grid">
        ${related.map(item => `
          <button class="cv-related-card" type="button" data-related-lesson="${escapeHTML(item.id)}">
            <span>${escapeHTML(item.cultureEmoji || '✦')}</span>
            <strong>${escapeHTML(item.title)}</strong>
            <small>${escapeHTML(item.cultureName)} · ${escapeHTML(item.moduleTitle)}</small>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderKeikiLessonContent(lesson) {
    const kid = lesson.kidVersion;
    const summary = kid?.summary || makeSimpleSummary(lesson);
    const bigIdeas = kid?.bigIdeas?.length
      ? kid.bigIdeas
      : makeBigIdeas(lesson);
    const vocabulary = kid?.vocabulary?.length
      ? kid.vocabulary
      : makeVocabularyFromLesson(lesson);
    const activity = kid?.activity || makeDefaultActivity(lesson);
    const reflection = kid?.reflection?.length
      ? kid.reflection
      : [
          'What is one thing you learned?',
          'What would you tell a younger cousin or sibling about this lesson?',
          'What is one question you still have?'
        ];

    return `
      <section class="cv-keiki-panel">
        <div class="cv-keiki-badge">Keiki Mode</div>
        <h3>Big Story</h3>
        <p>${escapeHTML(summary)}</p>
      </section>

      <section class="cv-keiki-panel">
        <h3>Big Ideas</h3>
        <div class="cv-keiki-ideas">
          ${bigIdeas.map(idea => `<div class="cv-keiki-idea">${escapeHTML(idea)}</div>`).join('')}
        </div>
      </section>

      ${vocabulary.length ? `
        <section class="cv-keiki-panel">
          <h3>Words to Know</h3>
          <div class="cv-keiki-vocab">
            ${vocabulary.map(item => `
              <div>
                <strong>${escapeHTML(item.term || item.title || '')}</strong>
                <span>${escapeHTML(item.meaning || item.body || item.definition || '')}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <section class="cv-keiki-panel">
        <h3>Try This</h3>
        <p>${escapeHTML(activity)}</p>
      </section>

      ${renderReflectionBlock(reflection, lesson, 'Keiki Reflection')}
    `;
  }

  function makeSimpleSummary(lesson) {
    const text = lesson.excerpt || stripHTML(lesson.content).split(/[.!?]/).slice(0, 2).join('. ');
    return text || `This lesson teaches an important idea from ${lesson.cultureName}. It helps us understand how knowledge, responsibility, and relationship are carried forward.`;
  }

  function makeBigIdeas(lesson) {
    const ideas = [
      `This lesson belongs to ${lesson.cultureName}.`,
      'Knowledge is carried through people, place, memory, and practice.',
      'Learning means understanding relationship, not just collecting facts.'
    ];

    if (lesson.cultureId === 'kanaka') {
      ideas[1] = 'Land, sea, sky, family, and story are connected.';
    }

    if (lesson.cultureId === 'kemet') {
      ideas[1] = 'Truth, balance, order, and responsibility help life stay strong.';
    }

    if (lesson.cultureId === 'bridge') {
      ideas[1] = 'Different cultures can hold connected patterns of wisdom.';
    }

    return ideas;
  }

  function makeVocabularyFromLesson(lesson) {
    const text = `${lesson.title} ${lesson.contentText}`.toLowerCase();

    return Object.entries(GLOSSARY)
      .filter(([key, item]) => text.includes(key) || text.includes(item.title.toLowerCase()))
      .slice(0, 4)
      .map(([, item]) => ({
        term: item.title,
        meaning: item.body
      }));
  }

  function makeDefaultActivity(lesson) {
    if (lesson.scene?.type === 'starcompass') {
      return 'Go outside at night with an adult. Look for one bright star and ask: how could people use the sky to remember direction?';
    }

    if (lesson.cultureId === 'kanaka') {
      return 'Draw a simple mountain-to-sea picture. Add one thing from the land, one from the ocean, and one from the sky.';
    }

    if (lesson.cultureId === 'kemet') {
      return 'Draw a balance scale. On one side write “truth.” On the other side write one action that helps your family or community.';
    }

    return 'Draw three circles: land, sky, and people. Write one way they connect.';
  }

  function transformLessonContent(content, lesson) {
    let html = String(content || '');

    html = html.replace(
      /<callout(?:\s+type="([^"]+)")?>([\s\S]*?)<\/callout>/gi,
      (_match, type, inner) => {
        const modifier = type ? ` cv-callout--${escapeHTML(type)}` : '';
        return `<div class="cv-callout${modifier}">${inner}</div>`;
      }
    );

    html = html.replace(
      /<facts>([\s\S]*?)<\/facts>/gi,
      (_match, inner) => {
        const items = String(inner).split('|').map(item => item.trim()).filter(Boolean);

        return `
          <div class="cv-facts">
            ${items.map(item => {
              const [value, label] = item.split('::').map(part => part?.trim() || '');
              return `
                <div class="cv-fact">
                  <strong>${escapeHTML(value || item)}</strong>
                  <span>${escapeHTML(label || '')}</span>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    );

    html = html.replace(
      /<twocol\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/twocol>/gi,
      (_match, left, right, inner) => {
        const parts = String(inner).split('||');
        const leftBody = parts[0] || '';
        const rightBody = parts[1] || '';

        return `
          <div class="cv-twocol">
            <div class="cv-twocol__side">
              <strong>${escapeHTML(left)}</strong>
              <p>${leftBody.trim()}</p>
            </div>
            <div class="cv-twocol__side">
              <strong>${escapeHTML(right)}</strong>
              <p>${rightBody.trim()}</p>
            </div>
          </div>
        `;
      }
    );

    html = html.replace(
      /<concepts>([\s\S]*?)<\/concepts>/gi,
      (_match, inner) => {
        const items = String(inner).split('·').map(item => item.trim()).filter(Boolean);

        return `
          <div class="cv-concepts">
            ${items.map(item => `<span class="cv-concept">${escapeHTML(item)}</span>`).join('')}
          </div>
        `;
      }
    );

    html = html.replace(
      /<quote(?:\s+cite="([^"]+)")?>([\s\S]*?)<\/quote>/gi,
      (_match, cite, inner) => {
        return `
          <blockquote class="cv-quote">
            <p>${inner.trim()}</p>
            ${cite ? `<cite>${escapeHTML(cite)}</cite>` : ''}
          </blockquote>
        `;
      }
    );

    html = html.replace(
      /<reflect(?:\s+title="([^"]+)")?>([\s\S]*?)<\/reflect>/gi,
      (_match, title, inner) => {
        const prompts = String(inner)
          .split('\n')
          .map(item => item.trim())
          .filter(Boolean);

        return renderReflectionBlock(prompts, lesson, title || 'Reflection Prompts');
      }
    );

    html = html.replace(
      /<term(?:\s+key="([^"]+)")?>([\s\S]*?)<\/term>/gi,
      (_match, key, inner) => {
        const label = stripHTML(inner);
        const lookupKey = String(key || label).toLowerCase().replace(/[^a-z0-9ʻ']/g, '');
        const def = GLOSSARY[lookupKey] || GLOSSARY[lookupKey.replace('ʻ', '').replace("'", '')];

        return `
          <span
            class="cv-term"
            tabindex="0"
            data-term="${escapeHTML(lookupKey)}"
            data-term-title="${escapeHTML(def?.title || label)}"
            data-term-culture="${escapeHTML(def?.culture || lesson.cultureName || '')}"
            data-term-body="${escapeHTML(def?.body || 'A key term in this lesson.')}"
          >${inner}</span>
        `;
      }
    );

    html = html.replace(
      /<timeline>([\s\S]*?)<\/timeline>/gi,
      (_match, inner) => {
        const items = String(inner)
          .split('\n')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => {
            const [date, text] = item.split('::').map(part => part?.trim() || '');
            return { date, text };
          });

        return `
          <div class="cv-timeline">
            ${items.map(item => `
              <div class="cv-timeline__item">
                <strong>${escapeHTML(item.date)}</strong>
                <span>${escapeHTML(item.text)}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
    );

    html = html.replace(
      /<compare\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/compare>/gi,
      (_match, left, right, inner) => {
        const parts = String(inner).split('||');
        return `
          <div class="cv-compare">
            <div>
              <strong>${escapeHTML(left)}</strong>
              <p>${(parts[0] || '').trim()}</p>
            </div>
            <div>
              <strong>${escapeHTML(right)}</strong>
              <p>${(parts[1] || '').trim()}</p>
            </div>
          </div>
        `;
      }
    );

    html = html.replace(
      /<activity>([\s\S]*?)<\/activity>/gi,
      (_match, inner) => `
        <div class="cv-activity">
          <strong>Learning Activity</strong>
          <p>${inner.trim()}</p>
        </div>
      `
    );

    html = html.replace(
      /<teacher-note>([\s\S]*?)<\/teacher-note>/gi,
      (_match, inner) => `
        <div class="cv-teacher-note">
          <strong>Teacher Note</strong>
          <p>${inner.trim()}</p>
        </div>
      `
    );

    html = html.replace(
      /<historian-note>([\s\S]*?)<\/historian-note>/gi,
      (_match, inner) => `
        <div class="cv-historian-note">
          <strong>Historian Note</strong>
          <p>${inner.trim()}</p>
        </div>
      `
    );

    if (!/<div class="cv-reflection/.test(html)) {
      html += renderReflectionBlock(DEFAULT_REFLECTIONS, lesson, 'Reflection Prompts');
    }

    return html;
  }

  function renderReflectionBlock(prompts, lesson, title = 'Reflection Prompts') {
    const existing = state.reflections[lesson.id] || {};

    return `
      <section class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}">
        <div class="cv-section-heading">
          <span>${escapeHTML(title)}</span>
        </div>

        <div class="cv-reflection-list">
          ${prompts.map((prompt, index) => `
            <label class="cv-reflection-card">
              <span>${escapeHTML(prompt)}</span>
              <textarea
                data-reflection-index="${index}"
                placeholder="Write your reflection here..."
              >${escapeHTML(existing[index] || '')}</textarea>
            </label>
          `).join('')}
        </div>

        <div class="cv-reflection-status" id="reflectionStatus">
          Reflections save automatically on this device.
        </div>
      </section>
    `;
  }

  function bindReflectionTextareas(lesson) {
    $all('[data-reflection-index]').forEach(textarea => {
      textarea.addEventListener('input', () => {
        const index = textarea.dataset.reflectionIndex;
        const lessonReflections = state.reflections[lesson.id] || {};
        lessonReflections[index] = textarea.value;
        state.reflections[lesson.id] = lessonReflections;
        writeJSON(REFLECTIONS_KEY, state.reflections);

        const status = $('#reflectionStatus');
        if (status) {
          status.textContent = 'Saved.';
          clearTimeout(bindReflectionTextareas._timer);
          bindReflectionTextareas._timer = setTimeout(() => {
            status.textContent = 'Reflections save automatically on this device.';
          }, 1200);
        }
      });
    });
  }

  function updateUrlHash(id) {
    if (!id) return;
    const nextHash = `#${encodeURIComponent(id)}`;

    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', nextHash);
    }
  }

  function completeActiveLesson() {
    const lesson = findLesson(state.activeLessonId);
    if (!lesson) return;

    const alreadyDone = isCompleted(lesson.id);

    if (alreadyDone) {
      showLessonToast('This lesson is already complete.');
      return;
    }

    state.completed.push(lesson.id);
    saveCompleted();

    let manaAdded = lesson.mana || DEFAULT_MANA;

    if (window.LKPRewards && typeof window.LKPRewards.completeLesson === 'function') {
      try {
        const result = window.LKPRewards.completeLesson(lesson.id, { mana: manaAdded });
        if (result && typeof result.manaAdded === 'number') {
          manaAdded = result.manaAdded;
        }
      } catch (err) {
        console.warn('[LKP Lessons] LKPRewards.completeLesson skipped:', err);
      }
    } else {
      setMana(getMana() + manaAdded);
    }

    updateCompleteButton(lesson);
    renderLessonTree();
    renderCultureFilters();
    triggerCompletionCeremony(lesson, manaAdded);

    window.dispatchEvent(new CustomEvent('lkp:lesson-completed', {
      detail: {
        lessonId: lesson.id,
        lesson,
        manaAdded
      }
    }));
  }

  function showLessonToast(message) {
    let toast = $('#lessonToast');

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lessonToast';
      toast.className = 'cv-lesson-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(showLessonToast._timer);
    showLessonToast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  function triggerCompletionCeremony(lesson, manaAdded) {
    showLessonToast(`Lesson complete · +${manaAdded} Mana`);

    const burst = document.createElement('div');
    burst.className = 'cv-completion-burst';
    burst.style.setProperty('--burst-color', getCultureColor(lesson.cultureTheme));
    burst.innerHTML = `
      <div class="cv-completion-burst__core">+${manaAdded}</div>
      ${Array.from({ length: 18 }, (_, i) => `<span style="--i:${i}"></span>`).join('')}
    `;

    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 1700);

    window.dispatchEvent(new CustomEvent('lkp:completion-ceremony', {
      detail: { lesson, manaAdded }
    }));
  }

  function setLessonMode(mode) {
    state.mode = mode === 'keiki' ? 'keiki' : 'scholar';
    localStorage.setItem(MODE_KEY, state.mode);

    if (state.activeLessonId) {
      renderLesson(state.activeLessonId, { noScroll: true });
    }
  }

  function adjustFont(direction) {
    const delta = direction === '+' ? 0.08 : -0.08;
    state.fontScale = Math.max(0.86, Math.min(1.32, state.fontScale + delta));
    localStorage.setItem(FONT_SCALE_KEY, String(state.fontScale));
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));
  }

  function toggleReadingMode() {
    document.body.classList.toggle('is-reading-mode');
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const cultureBtn = event.target.closest('[data-culture-filter]');
      if (cultureBtn) {
        const culture = cultureBtn.dataset.cultureFilter || 'all';
        state.activeCulture = culture;

        $all('[data-culture-filter]').forEach(btn => {
          btn.classList.toggle('is-active', btn.dataset.cultureFilter === culture);
        });

        renderLessonTree();
        return;
      }

      const lessonBtn = event.target.closest('[data-lesson-id]');
      if (lessonBtn) {
        renderLesson(lessonBtn.dataset.lessonId);
        return;
      }

      const navBtn = event.target.closest('[data-nav-lesson]');
      if (navBtn) {
        const id = navBtn.dataset.navLesson;
        if (id) renderLesson(id);
        return;
      }

      const related = event.target.closest('[data-related-lesson]');
      if (related) {
        renderLesson(related.dataset.relatedLesson);
        return;
      }

      if (event.target.closest('[data-complete-active-lesson]')) {
        completeActiveLesson();
        return;
      }

      const modeBtn = event.target.closest('[data-lesson-mode]');
      if (modeBtn) {
        setLessonMode(modeBtn.dataset.lessonMode);
        return;
      }

      const fontBtn = event.target.closest('[data-font-adjust]');
      if (fontBtn) {
        adjustFont(fontBtn.dataset.fontAdjust);
        return;
      }

      if (event.target.closest('[data-reading-mode]')) {
        toggleReadingMode();
      }
    });

    document.addEventListener('input', event => {
      if (event.target.matches('#lessonTreeSearch')) {
        state.sidebarSearch = event.target.value;
        renderLessonTree();
        window.dispatchEvent(new Event('lkp:tree-built'));
      }
    });

    window.addEventListener('hashchange', () => {
      openLessonFromHash({ noScroll: true });
    });

    document.addEventListener('keydown', event => {
      if (!state.activeLessonId) return;

      const index = getLessonIndex(state.activeLessonId);

      if (event.key === 'ArrowLeft' && index > 0) {
        renderLesson(state.lessons[index - 1].id);
      }

      if (event.key === 'ArrowRight' && index < state.lessons.length - 1) {
        renderLesson(state.lessons[index + 1].id);
      }

      if (event.key === 'Escape' && document.body.classList.contains('is-reading-mode')) {
        document.body.classList.remove('is-reading-mode');
      }
    });
  }

  function openLessonFromHash(options = {}) {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!hash) return false;

    const lesson = findLesson(hash);
    if (!lesson) return false;

    state.activeCulture = 'all';
    renderLesson(lesson.id, options);
    return true;
  }

  function closeSidebarOnMobile() {
    const sidebar = $('#cvSidebar');

    if (window.matchMedia('(max-width: 980px)').matches) {
      sidebar?.classList.remove('is-open');
    }
  }

  function initStarfield() {
    const canvas = $('#starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      const count = Math.min(220, Math.floor((width * height) / 9000));

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.35 + 0.25,
        a: Math.random() * 0.7 + 0.15,
        s: Math.random() * 0.015 + 0.005
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.a += star.s;
        const opacity = 0.25 + Math.abs(Math.sin(star.a)) * 0.65;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize, { passive: true });
  }

  function updateHeroLabels(lesson) {
    const emoji = $('#cultureHeroEmoji');
    const name = $('#cultureHeroName');

    if (emoji) emoji.textContent = lesson.cultureEmoji || '✦';
    if (name) name.textContent = `${lesson.cultureName} · ${lesson.scene?.type || 'lesson'}`;
  }

  async function loadTHREE() {
    if (state.three.THREE) return state.three.THREE;

    try {
      state.three.THREE = await import('https://esm.sh/three@0.160.0');
      return state.three.THREE;
    } catch (err) {
      console.warn('[LKP Lessons] Three.js import failed:', err);
      return null;
    }
  }

  async function initThreeBackground() {
    const canvas = $('#lkp-galaxy-bg');
    if (!canvas) return;

    const THREE = await loadTHREE();
    if (!THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 220);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.4));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const count = 1600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#dbefff'),
      new THREE.Color('#f0c96a'),
      new THREE.Color('#54c6ee'),
      new THREE.Color('#8fa0ff')
    ];

    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const c = palette[Math.floor(Math.random() * palette.length)];

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.62;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        depthWrite: false
      })
    );

    scene.add(stars);

    const nebulaA = makeThreeGlow(THREE, '#f0c96a', 30, 0.18);
    const nebulaB = makeThreeGlow(THREE, '#54c6ee', 22, 0.14);

    nebulaA.position.set(-13, 5, -20);
    nebulaB.position.set(14, -7, -16);

    scene.add(nebulaA, nebulaB);

    state.three.bg = {
      scene,
      camera,
      renderer,
      stars,
      nebulaA,
      nebulaB,
      targetColor: new THREE.Color('#f0c96a'),
      currentColor: new THREE.Color('#f0c96a')
    };

    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }, { passive: true });

    window.addEventListener('lkp:culture-changed', event => {
      const lesson = state.lessons.find(item => item.cultureId === event.detail.cultureId);
      const color = event.detail.color || getCultureColor(lesson?.cultureTheme || 'default');
      state.three.bg.targetColor = new THREE.Color(color);
    });

    function animate() {
      requestAnimationFrame(animate);

      const t = performance.now() * 0.001;
      state.three.bg.currentColor.lerp(state.three.bg.targetColor, 0.012);

      stars.rotation.y += 0.0002;
      nebulaA.position.x = -13 + Math.sin(t * 0.22) * 1.25;
      nebulaB.position.x = 14 + Math.cos(t * 0.18) * 1.05;
      nebulaA.material.color.copy(state.three.bg.currentColor);

      renderer.render(scene, camera);
    }

    animate();
  }

  async function initThreeHero() {
    const canvas = $('#cv-culture-hero-canvas');
    const wrap = $('#cultureHero');

    if (!canvas || !wrap) return;

    const THREE = await loadTHREE();
    if (!THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 120);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));

    const light = new THREE.PointLight(0xffd36b, 2.4, 80);
    light.position.set(0, 6, 8);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);

    state.three.hero = { scene, camera, renderer, group, wrap, currentLesson: null };

    function resize() {
      const w = Math.max(280, wrap.clientWidth || 760);
      const h = Math.max(140, wrap.clientHeight || 160);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    resize();

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(wrap);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    function animate() {
      requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      group.rotation.y += 0.002;
      group.children.forEach((child, i) => {
        child.rotation.z += 0.001 + i * 0.0002;
        child.position.y += Math.sin(t + i) * 0.0009;
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  function clearThreeGroup(group) {
    if (!group) return;

    while (group.children.length) {
      const obj = group.children.pop();
      obj.geometry?.dispose?.();

      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose?.());
        } else {
          obj.material.dispose?.();
        }
      }
    }
  }

  function updateThreeHeroScene(lesson) {
    const hero = state.three.hero;
    const THREE = state.three.THREE;

    if (!hero || !THREE || !lesson) return;

    clearThreeGroup(hero.group);

    const primary = lesson.scene?.primary || getCultureColor(lesson.cultureTheme);
    const secondary = lesson.scene?.secondary || getCultureSecondaryColor(lesson.cultureTheme);
    const type = lesson.scene?.type || 'constellation';

    const c1 = new THREE.Color(primary);
    const c2 = new THREE.Color(secondary);

    hero.group.add(makeThreeGlow(THREE, primary, 8.5, 0.38));
    hero.group.add(makeThreeGlow(THREE, secondary, 5.2, 0.18));

    if (type === 'starcompass') {
      addStarCompassHero(THREE, hero.group, c1, c2);
    } else if (type === 'creation' || type === 'primordial') {
      addCreationHero(THREE, hero.group, c1, c2);
    } else if (type === 'balance') {
      addBalanceHero(THREE, hero.group, c1, c2);
    } else if (type === 'pyramid') {
      addPyramidHero(THREE, hero.group, c1, c2);
    } else if (type === 'healing') {
      addHealingHero(THREE, hero.group, c1, c2);
    } else if (type === 'bridge') {
      addBridgeHero(THREE, hero.group, c1, c2);
    } else {
      addConstellationHero(THREE, hero.group, c1, c2);
    }

    hero.currentLesson = lesson;
  }

  function makeThreeGlow(THREE, color, size, opacity) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext('2d');
    const col = new THREE.Color(color);
    const r = Math.round(col.r * 255);
    const g = Math.round(col.g * 255);
    const b = Math.round(col.b * 255);

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
    grad.addColorStop(0.45, `rgba(${r},${g},${b},0.22)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
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

  function addStarCompassHero(THREE, group, c1, c2) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4, 0.045, 10, 96),
      new THREE.MeshBasicMaterial({ color: c1, transparent: true, opacity: 0.72 })
    );

    group.add(ring);

    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(i % 4 === 0 ? 0.22 : 0.13, 0),
        new THREE.MeshPhysicalMaterial({
          color: i % 2 ? c2 : c1,
          emissive: i % 2 ? c2 : c1,
          emissiveIntensity: 0.8
        })
      );

      star.position.set(Math.cos(a) * 4, Math.sin(a) * 4, 0);
      group.add(star);
    }
  }

  function addCreationHero(THREE, group, c1, c2) {
    for (let i = 0; i < 9; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.6 + i * 0.38, 0.018, 6, 80),
        new THREE.MeshBasicMaterial({
          color: i % 2 ? c2 : c1,
          transparent: true,
          opacity: 0.12 + i * 0.035
        })
      );

      ring.rotation.x = i * 0.18;
      ring.rotation.y = i * 0.22;
      group.add(ring);
    }

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: c1,
        emissive: c1,
        emissiveIntensity: 1.1,
        transparent: true,
        opacity: 0.9
      })
    );

    group.add(core);
  }

  function addBalanceHero(THREE, group, c1, c2) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.08, 0.08),
      new THREE.MeshBasicMaterial({ color: c1, transparent: true, opacity: 0.86 })
    );

    group.add(beam);

    const center = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.34, 0),
      new THREE.MeshPhysicalMaterial({ color: c2, emissive: c2, emissiveIntensity: 0.8 })
    );

    group.add(center);

    [-2.2, 2.2].forEach(x => {
      const bowl = new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.035, 8, 48),
        new THREE.MeshBasicMaterial({ color: c2, transparent: true, opacity: 0.68 })
      );

      bowl.position.set(x, -0.72, 0);
      group.add(bowl);
    });
  }

  function addPyramidHero(THREE, group, c1, c2) {
    const pyramid = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, 3.8, 4),
      new THREE.MeshPhysicalMaterial({
        color: c1,
        emissive: c1,
        emissiveIntensity: 0.32,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      })
    );

    pyramid.rotation.y = Math.PI / 4;
    group.add(pyramid);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: c2, emissive: c2, emissiveIntensity: 1 })
    );

    sun.position.set(0, 2.8, 0);
    group.add(sun);
  }

  function addHealingHero(THREE, group, c1, c2) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 4, 12),
      new THREE.MeshBasicMaterial({ color: c1, transparent: true, opacity: 0.82 })
    );

    group.add(stem);

    for (let i = 0; i < 8; i++) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 18, 18),
        new THREE.MeshPhysicalMaterial({ color: i % 2 ? c2 : c1, emissive: i % 2 ? c2 : c1, emissiveIntensity: 0.4 })
      );

      leaf.scale.set(1.8, 0.45, 0.12);
      leaf.position.set((i % 2 ? 0.45 : -0.45), -1.6 + i * 0.45, 0);
      leaf.rotation.z = i % 2 ? -0.65 : 0.65;
      group.add(leaf);
    }
  }

  function addBridgeHero(THREE, group, c1, c2) {
    const left = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: c1, emissive: c1, emissiveIntensity: 0.9 })
    );

    const right = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: c2, emissive: c2, emissiveIntensity: 0.9 })
    );

    left.position.set(-2.2, 0, 0);
    right.position.set(2.2, 0, 0);

    group.add(left, right);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0, 0),
      new THREE.Vector3(0, 1.3, 0),
      new THREE.Vector3(2.2, 0, 0)
    ]);

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)),
      new THREE.LineBasicMaterial({ color: c1.clone().lerp(c2, 0.5), transparent: true, opacity: 0.72 })
    );

    group.add(line);
  }

  function addConstellationHero(THREE, group, c1, c2) {
    const points = [];

    for (let i = 0; i < 9; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 1.4
      );

      points.push(p);

      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(i % 3 === 0 ? 0.22 : 0.14, 0),
        new THREE.MeshPhysicalMaterial({
          color: i % 2 ? c2 : c1,
          emissive: i % 2 ? c2 : c1,
          emissiveIntensity: 0.7
        })
      );

      star.position.copy(p);
      group.add(star);
    }

    for (let i = 0; i < points.length - 1; i++) {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]),
        new THREE.LineBasicMaterial({ color: c1, transparent: true, opacity: 0.22 })
      );

      group.add(line);
    }
  }

  function initMobileNavAndProgress() {
    const mobileToggle = $('#lkpMobileToggle');
    const navLinks = $('#lkpNavLinks');

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        mobileToggle.classList.toggle('is-open', open);
        mobileToggle.setAttribute('aria-expanded', String(open));
      });
    }

    const sidebarFab = $('#cvSidebarFab');
    const sidebar = $('#cvSidebar');

    if (sidebarFab && sidebar) {
      sidebarFab.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
    }

    const year = $('#footerYear');
    if (year) year.textContent = new Date().getFullYear();

    const progressFill = $('#progressFill');

    window.addEventListener('scroll', () => {
      if (!progressFill) return;

      const max =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    }, { passive: true });
  }

  function build(data) {
    state.data = data;
    state.cultures = normalizeData(data);
    state.lessons = flattenLessons(state.cultures);

    syncCompletedFromRewards();
    ensureSidebarTools();

    console.info(
      '[LKP Lessons] Loaded:',
      state.cultures.length,
      'cultures,',
      state.lessons.length,
      'lessons'
    );

    renderCultureFilters();
    renderLessonTree();

    const opened = openLessonFromHash({ noScroll: true });

    if (!opened && state.lessons.length) {
      renderLesson(state.lessons[0].id, { noScroll: true });
    }

    bindEvents();
    initStarfield();
    initMobileNavAndProgress();

    Promise.allSettled([
      initThreeBackground(),
      initThreeHero()
    ]).then(() => {
      if (state.activeLessonId) {
        updateThreeHeroScene(findLesson(state.activeLessonId));
      }
    });

    window.dispatchEvent(new Event('lkp:tree-built'));
  }

  function waitForDataAndBuild() {
    let attempts = 0;
    const maxAttempts = 8;
    const retryMs = 250;

    function attempt() {
      const data = getData();

      if (data && Array.isArray(data.cultures) && data.cultures.length > 0) {
        build(data);
        return;
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        console.warn(
          '[LKP Lessons] No lesson data after',
          maxAttempts * retryMs,
          'ms. Make sure LKP/js/lkp-data.js loads before LKP/js/lkp-lessons.js.'
        );

        build({ cultures: [] });
        return;
      }

      setTimeout(attempt, retryMs);
    }

    window.addEventListener('lkp:data-ready', function onReady(event) {
      window.removeEventListener('lkp:data-ready', onReady);

      const data = event?.detail?.data || getData();

      if (data && !state.data) {
        build(data);
      }
    });

    attempt();
  }

  document.addEventListener('DOMContentLoaded', waitForDataAndBuild);
})();