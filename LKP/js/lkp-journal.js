/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — REFLECTION JOURNAL
   File: LKP/js/lkp-journal.js
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const REFLECTIONS_KEY = 'lkp_lesson_reflections_v2';
  const COMPLETED_KEY   = 'cv_completed';

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }

  function extractReflectPrompts(content) {
    const prompts = [];
    const re = /<reflect>([\s\S]*?)<\/reflect>/gi;
    let m;
    while ((m = re.exec(content)) !== null) {
      prompts.push(m[1].trim());
    }
    return prompts;
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildLessonIndex() {
    const index = {};
    if (typeof CULTURALVERSE_DATA === 'undefined' || !CULTURALVERSE_DATA) return index;

    CULTURALVERSE_DATA.cultures.forEach(culture => {
      (culture.modules || []).forEach(module => {
        (module.lessons || []).forEach(lesson => {
          const prompts = extractReflectPrompts(lesson.content || '');
          index[lesson.id] = {
            id: lesson.id,
            num: lesson.num || '',
            title: lesson.title || lesson.id,
            moduleTitle: module.title || '',
            cultureName: culture.name || '',
            cultureEmoji: culture.emoji || '✦',
            cultureId: culture.id,
            prompts
          };
        });
      });
    });
    return index;
  }

  function renderJournal() {
    const body     = document.getElementById('journalBody');
    const empty    = document.getElementById('journalEmpty');
    const stats    = document.getElementById('journalStats');
    if (!body) return;

    const reflections = readJSON(REFLECTIONS_KEY, {});
    const completed   = readJSON(COMPLETED_KEY, []);
    const lessonIndex = buildLessonIndex();

    const lessonIds = Object.keys(reflections).filter(id => {
      const entries = reflections[id];
      return Object.values(entries || {}).some(v => String(v || '').trim().length > 0);
    });

    if (!lessonIds.length) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    const totalReflections = lessonIds.reduce((n, id) => {
      return n + Object.values(reflections[id] || {}).filter(v => String(v || '').trim().length > 0).length;
    }, 0);

    if (stats) {
      stats.hidden = false;
      stats.innerHTML = `
        <span><i class="fas fa-feather-pointed"></i> ${totalReflections} reflection${totalReflections === 1 ? '' : 's'}</span>
        <span><i class="fas fa-book-open"></i> ${lessonIds.length} lesson${lessonIds.length === 1 ? '' : 's'}</span>
        <span><i class="fas fa-check-circle"></i> ${completed.length} completed</span>
      `;
    }

    const byCulture = {};
    lessonIds.forEach(id => {
      const meta = lessonIndex[id];
      if (!meta) return;
      const key = meta.cultureId;
      if (!byCulture[key]) byCulture[key] = { name: meta.cultureName, emoji: meta.cultureEmoji, lessons: [] };
      byCulture[key].lessons.push({ meta, entries: reflections[id] || {} });
    });

    body.innerHTML = Object.values(byCulture).map(culture => `
      <section class="lkp-journal-culture">
        <h2 class="lkp-journal-culture__heading">
          <span class="lkp-journal-culture__emoji">${escapeHTML(culture.emoji)}</span>
          ${escapeHTML(culture.name)}
        </h2>
        ${culture.lessons.map(({ meta, entries }) => {
          const answeredEntries = Object.entries(entries)
            .filter(([, v]) => String(v || '').trim().length > 0)
            .sort((a, b) => Number(a[0]) - Number(b[0]));

          const reflectHtml = answeredEntries.map(([idx, text]) => {
            const prompt = meta.prompts[Number(idx)] || '';
            return `
              <div class="lkp-journal-entry" data-reflect-text="${escapeHTML(text)}">
                ${prompt ? `<p class="lkp-journal-entry__prompt">${escapeHTML(prompt)}</p>` : ''}
                <p class="lkp-journal-entry__text">${escapeHTML(text)}</p>
              </div>
            `;
          }).join('');

          return `
            <article class="lkp-journal-lesson" data-lesson-id="${escapeHTML(meta.id)}">
              <div class="lkp-journal-lesson__meta">
                <div class="lkp-journal-lesson__info">
                  ${meta.num ? `<p class="lkp-journal-lesson__num">${escapeHTML(meta.num)}</p>` : ''}
                  <p class="lkp-journal-lesson__title">${escapeHTML(meta.title)}</p>
                  <p class="lkp-journal-lesson__module">${escapeHTML(meta.moduleTitle)}</p>
                </div>
                <a class="lkp-journal-lesson__link" href="lessons.html#${escapeHTML(meta.id)}">
                  <i class="fas fa-book-open"></i> Open lesson
                </a>
              </div>
              ${reflectHtml}
            </article>
          `;
        }).join('')}
      </section>
    `).join('');

    bindSearch();
    bindExport(byCulture, lessonIndex);
  }

  function bindSearch() {
    const input = document.getElementById('journalSearch');
    if (!input) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      const lessons = document.querySelectorAll('.lkp-journal-lesson');
      let anyVisible = false;

      lessons.forEach(el => {
        const text = el.textContent.toLowerCase();
        const visible = !q || text.includes(q);
        el.hidden = !visible;
        if (visible) anyVisible = true;
      });

      document.querySelectorAll('.lkp-journal-culture').forEach(el => {
        const hasVisible = Array.from(el.querySelectorAll('.lkp-journal-lesson')).some(l => !l.hidden);
        el.hidden = !hasVisible;
      });

      let noMatch = document.getElementById('journalNoMatch');
      if (!anyVisible && q) {
        if (!noMatch) {
          noMatch = document.createElement('p');
          noMatch.id = 'journalNoMatch';
          noMatch.className = 'lkp-journal-no-match';
          document.getElementById('journalBody').appendChild(noMatch);
        }
        noMatch.textContent = `No reflections matching "${q}".`;
        noMatch.hidden = false;
      } else if (noMatch) {
        noMatch.hidden = true;
      }
    });
  }

  function bindExport(byCulture) {
    const btn = document.getElementById('journalExportBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const lines = ['Ka Paepae ʻIke Ola — Reflection Journal Export', ''];
      const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
      lines.push(`Exported: ${now}`, '', '═'.repeat(60), '');

      Object.values(byCulture).forEach(culture => {
        lines.push(`${culture.emoji} ${culture.name}`, '─'.repeat(40));
        culture.lessons.forEach(({ meta, entries }) => {
          lines.push('', `${meta.num ? meta.num + ' · ' : ''}${meta.title}`);
          lines.push(`Module: ${meta.moduleTitle}`, '');
          const answered = Object.entries(entries)
            .filter(([, v]) => String(v || '').trim().length > 0)
            .sort((a, b) => Number(a[0]) - Number(b[0]));
          answered.forEach(([idx, text]) => {
            const prompt = meta.prompts[Number(idx)] || `Reflection ${Number(idx) + 1}`;
            lines.push(`Q: ${prompt}`, `A: ${text}`, '');
          });
        });
        lines.push('');
      });

      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lkp-journal-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function init() {
    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Date().getFullYear();

    const toggle = document.getElementById('lkpMobileToggle');
    const links  = document.getElementById('lkpNavLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    if (typeof CULTURALVERSE_DATA !== 'undefined') {
      renderJournal();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        const wait = setInterval(() => {
          if (typeof CULTURALVERSE_DATA !== 'undefined') {
            clearInterval(wait);
            renderJournal();
          }
        }, 80);
        setTimeout(() => clearInterval(wait), 6000);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
