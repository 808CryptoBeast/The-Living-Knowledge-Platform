/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — DEEP LESSONS PAGE
   File: LKP/js/lkp-lessons.js

   Requires:
   - LKP/js/lkp-data.js loaded before this file
   - window.CULTURALVERSE_DATA or window.LKP_DATA
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const state = {
    data: null,
    cultures: [],
    lessons: [],
    activeCulture: 'all',
    activeLessonId: null
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
      return item && Array.isArray(item.cultures);
    });

    if (data) {
      window.CULTURALVERSE_DATA = data;
      window.LKP_DATA = data;
      window.IKEVERSE_DATA = data;
      return data;
    }

    console.warn(
      '[LKP Lessons] No lesson data found. Make sure LKP/js/lkp-data.js loads before LKP/js/lkp-lessons.js.'
    );

    return { cultures: [] };
  }

  function normalizeData(data) {
    const cultures = Array.isArray(data?.cultures) ? data.cultures : [];

    return cultures.map(culture => ({
      id: culture.id || '',
      name: culture.name || 'Untitled Culture',
      emoji: culture.emoji || '✦',
      tagline: culture.tagline || '',
      theme: culture.theme || 'default',
      status: culture.status || 'live',
      intro: culture.intro || '',
      modules: Array.isArray(culture.modules)
        ? culture.modules.map(module => ({
            id: module.id || '',
            title: module.title || 'Untitled Module',
            emoji: module.emoji || culture.emoji || '✦',
            desc: module.desc || '',
            lessons: Array.isArray(module.lessons)
              ? module.lessons.map(lesson => ({
                  id: lesson.id || '',
                  num: lesson.num || '',
                  title: lesson.title || 'Untitled Lesson',
                  readTime: lesson.readTime || '',
                  content: lesson.content || '',
                  cultureId: culture.id || '',
                  cultureName: culture.name || 'Untitled Culture',
                  cultureEmoji: culture.emoji || '✦',
                  cultureTheme: culture.theme || 'default',
                  moduleId: module.id || '',
                  moduleTitle: module.title || 'Untitled Module',
                  moduleEmoji: module.emoji || culture.emoji || '✦'
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
            moduleEmoji: module.emoji
          });
        });
      });
    });

    return lessons;
  }

  function getCultureColor(theme) {
    const colors = {
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

    return colors[theme] || colors.default;
  }

  function getVisibleCultures() {
    if (state.activeCulture === 'all') {
      return state.cultures;
    }

    return state.cultures.filter(culture => culture.id === state.activeCulture);
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
      const modulesWithLessons = culture.modules.filter(module => module.lessons.length);

      if (!modulesWithLessons.length) {
        return `
          <section class="cv-tree-culture">
            <div class="cv-tree-culture__title">
              <span>${escapeHTML(culture.emoji)}</span>
              ${escapeHTML(culture.name)}
            </div>
            <div class="cv-tree-module">
              <div class="cv-tree-module__title">Coming Soon</div>
              <button class="cv-tree-lesson" type="button" disabled>
                <strong>${escapeHTML(culture.tagline || 'Lessons are being prepared.')}</strong>
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

          ${modulesWithLessons.map(module => `
            <div class="cv-tree-module">
              <div class="cv-tree-module__title">
                <span>${escapeHTML(module.emoji)}</span>
                ${escapeHTML(module.title)}
              </div>

              ${module.lessons.map(lesson => `
                <button
                  class="cv-tree-lesson ${lesson.id === state.activeLessonId ? 'is-active' : ''}"
                  type="button"
                  data-lesson-id="${escapeHTML(lesson.id)}"
                >
                  <strong>${escapeHTML(lesson.num || 'LESSON')} · ${escapeHTML(lesson.title)}</strong>
                  <small>${escapeHTML(culture.name)} · ${escapeHTML(lesson.readTime || 'Lesson')}</small>
                </button>
              `).join('')}
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

  function renderLesson(id, options = {}) {
    const lesson = findLesson(id);

    if (!lesson) {
      renderWelcome();
      return;
    }

    state.activeLessonId = lesson.id;

    const welcome = $('#lessonWelcome');
    const article = $('#lessonArticle');
    const header = $('#lessonHeader');
    const body = $('#lessonBody');
    const nav = $('#lessonNav');

    if (welcome) welcome.hidden = true;
    if (article) article.hidden = false;

    if (header) {
      header.innerHTML = `
        <div class="cv-lesson-kicker">
          <span>${escapeHTML(lesson.cultureEmoji)}</span>
          ${escapeHTML(lesson.cultureName)} · ${escapeHTML(lesson.moduleTitle)}
        </div>

        <h1 class="cv-lesson-title">${escapeHTML(lesson.title)}</h1>

        <div class="cv-lesson-meta">
          <span>${escapeHTML(lesson.num || 'Lesson')}</span>
          <span>${escapeHTML(lesson.readTime || 'Deep Reading')}</span>
          <span>${escapeHTML(lesson.moduleEmoji)} ${escapeHTML(lesson.moduleTitle)}</span>
        </div>
      `;
    }

    if (body) {
      body.innerHTML = transformLessonContent(lesson.content);
    }

    renderLessonNav();

    renderLessonTree();
    updateUrlHash(lesson.id);

    if (!options.noScroll) {
      requestAnimationFrame(() => {
        $('#lessonMain')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }

    closeSidebarOnMobile();
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

  function transformLessonContent(content) {
    let html = String(content || '');

    html = html.replace(
      /<callout(?:\s+type="([^"]+)")?>([\s\S]*?)<\/callout>/gi,
      function (_match, type, inner) {
        const modifier = type ? ` cv-callout--${escapeHTML(type)}` : '';
        return `<div class="cv-callout${modifier}">${inner}</div>`;
      }
    );

    html = html.replace(
      /<facts>([\s\S]*?)<\/facts>/gi,
      function (_match, inner) {
        const items = String(inner)
          .split('|')
          .map(item => item.trim())
          .filter(Boolean);

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
      function (_match, left, right, inner) {
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
      function (_match, inner) {
        const items = String(inner)
          .split('·')
          .map(item => item.trim())
          .filter(Boolean);

        return `
          <div class="cv-concepts">
            ${items.map(item => `<span class="cv-concept">${escapeHTML(item)}</span>`).join('')}
          </div>
        `;
      }
    );

    html = html.replace(
      /<quote(?:\s+cite="([^"]+)")?>([\s\S]*?)<\/quote>/gi,
      function (_match, cite, inner) {
        return `
          <blockquote class="cv-quote">
            <p>${inner.trim()}</p>
            ${cite ? `<cite>${escapeHTML(cite)}</cite>` : ''}
          </blockquote>
        `;
      }
    );

    return html;
  }

  function updateUrlHash(id) {
    if (!id) return;

    const nextHash = `#${encodeURIComponent(id)}`;

    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', nextHash);
    }
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

  function build() {
    state.data = getData();
    state.cultures = normalizeData(state.data);
    state.lessons = flattenLessons(state.cultures);

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
      const firstLiveLesson = state.lessons[0];

      if (firstLiveLesson) {
        renderLesson(firstLiveLesson.id, { noScroll: true });
      }
    }

    bindEvents();
    initStarfield();
  }

  function waitForDataAndBuild() {
    const existing = getData();

    if (
      existing &&
      Array.isArray(existing.cultures) &&
      existing.cultures.length
    ) {
      build();
      return;
    }

    window.addEventListener(
      'lkp:data-ready',
      () => {
        build();
      },
      { once: true }
    );

    setTimeout(() => {
      if (!state.data) {
        build();
      }
    }, 400);
  }

  document.addEventListener('DOMContentLoaded', waitForDataAndBuild);
})();