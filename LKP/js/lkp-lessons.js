/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — DEEP LESSONS v7 CLOUD SYNC
   File: LKP/js/lkp-lessons.js

   Updates:
   - Uses Supabase cloud sync through window.LKPProfileSync when signed in.
   - Lesson completion syncs to user_lesson_progress.
   - Reflections sync to user_lesson_reflections.
   - Guest/local mode still works through localStorage.
   - Hero images use full-bleed background images.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const COMPLETED_KEY   = 'cv_completed';
  const MANA_KEY        = 'cv_mana';
  const REFLECTIONS_KEY = 'lkp_lesson_reflections_v2';
  const MODE_KEY        = 'lkp_lesson_mode_v1';
  const FONT_SCALE_KEY  = 'lkp_lesson_font_scale_v1';
  const DEFAULT_MANA    = 10;

  /* ══════════════════════════════════════════════════════════════════════
     LESSON IMAGE REGISTRY

     IMPORTANT:
     lessons.html lives inside /LKP/, so image paths are relative to /LKP/.
     Correct:
       assets/images/example.png
     Incorrect:
       LKP/assets/images/example.png
  ══════════════════════════════════════════════════════════════════════ */

  const LESSON_IMAGE_REGISTRY = {
    /* Kānaka Maoli */
    'km-kumulipo': {
      url: 'assets/images/km-kumulipo.png',
      pos: 'center center',
      credit: 'The Kumulipo — Sacred Chant of Creation'
    },
    'km-wakea': {
      url: 'assets/images/km-wakea.png',
      pos: 'center center',
      credit: 'Wākea & Papahānaumoku — The Sky Father and Earth Mother'
    },
    'km-mahina': {
      url: 'assets/images/kanaka-culture.png',
      pos: 'center center',
      credit: 'Kaulana Mahina — Hawaiian Lunar Calendar'
    },
    'km-starcompass': {
      url: 'assets/images/km-starcompass.png',
      pos: 'center center',
      credit: 'The Star Compass — Navigating by Hōkūleʻa and 150 Stars'
    },
    'km-hokuleaa': {
      url: 'assets/images/km-hokuleaa.png',
      pos: 'center 55%',
      credit: 'Hōkūleʻa — Voyaging Canoe and the Revival of Wayfinding'
    },
    'km-ahupuaa': {
      url: 'assets/images/km-ahupuaa.png',
      pos: 'center 45%',
      credit: 'The Ahupuaʻa — A Complete World in One Land Division'
    },
    'km-loikalo': {
      url: 'assets/images/km-loikalo.png',
      pos: 'center 50%',
      credit: 'Loʻi Kalo & Loko Iʻa — Sacred Agriculture and Aquaculture'
    },
    'km-malamaina': {
      url: 'assets/images/km-malamaina.png',
      pos: 'center center',
      credit: 'Mālama ʻĀina — Caring for Land as Ancestor, Teacher, and Future'
    },
    'km-olelo': {
      url: 'assets/images/km-olelo.png',
      pos: 'center center',
      credit: 'ʻŌlelo Hawaiʻi — The Hawaiian Language'
    },
    'km-hula': {
      url: 'assets/images/km-hula.png',
      pos: 'center center',
      credit: 'Hula — The Body as Sacred Text'
    },
    'km-protocol': {
      url: 'assets/images/km-protocol.png',
      pos: 'center center',
      credit: 'Protocol, Pule, and Respect — How Knowledge Is Approached'
    },
    'km-laau': {
      url: 'assets/images/km-laau.png',
      pos: 'center center',
      credit: 'Laʻau Lapaʻau — The Sacred Art of Hawaiian Plant Medicine'
    },

    /* Kemet */
    'ke-nun': {
      url: 'assets/images/ke-nun.png',
      pos: 'center center',
      credit: 'Nun & the Primordial Waters — Before the Beginning'
    },
    'ke-ennead': {
      url: 'assets/images/ke-ennead.png',
      pos: 'center center',
      credit: 'The Heliopolitan Ennead — Nine Principles of Creation'
    },
    'ke-ptah': {
      url: 'assets/images/ke-ptah.png',
      pos: 'center center',
      credit: 'Ptah & the Memphite Theology — Creation Through Word'
    },
    'ke-duat': {
      url: 'assets/images/ke-duat.png',
      pos: 'center center',
      credit: 'The Duat — Night Journey, Transformation, and Renewal'
    },
    'ke-maat': {
      url: 'assets/images/ke-maat.png',
      pos: 'center center',
      credit: 'Maʻat — Truth, Justice, and Cosmic Balance'
    },
    'ke-maat-politics': {
      url: 'assets/images/ke-maat-politics.png',
      pos: 'center 55%',
      credit: 'Maʻat as Political Philosophy — The Ruler Serves the Principle'
    },
    'ke-medunetjer': {
      url: 'assets/images/ke-medunetjer.png',
      pos: 'center center',
      credit: 'Medu Netjer — Words of the Gods'
    },
    'ke-medicine': {
      url: 'assets/images/ke-medicine.png',
      pos: 'center center',
      credit: 'Kemetic Medicine — Imhotep, the Papyri, and the Science of Healing'
    },
    'ke-seshat': {
      url: 'assets/images/ke-seshat.png',
      pos: 'center center',
      credit: 'Seshat — Measurement, Writing, Architecture, and Sacred Recordkeeping'
    },
    'ke-celestial-nile': {
      url: 'assets/images/ke-celestial-nile.png',
      pos: 'center center',
      credit: 'The Nile, the Stars, and Sacred Timekeeping'
    },

    /* Bridge */
    'bridge-darkness': {
      url: 'assets/images/bridge-darkness.png',
      pos: 'center center',
      credit: 'Kumulipo & Nun — Creation from Primordial Darkness'
    },
    'bridge-pairs': {
      url: 'assets/images/bridge-pairs.png',
      pos: 'center center',
      credit: 'Paired Forces — Balance and Complementarity'
    },
    'bridge-aloha-maat': {
      url: 'assets/images/bridge-aloha-maat.png',
      pos: 'center center',
      credit: 'Aloha & Maʻat — Ethics of Right Relationship'
    },
    'bridge-genealogy-ecology': {
      url: 'assets/images/bridge-genealogy-ecology.png',
      pos: 'center center',
      credit: 'Genealogy as Ecology — When Family Trees Include the Living World'
    },
    'bridge-navigation-astronomy': {
      url: 'assets/images/bridge-navigation-astronomy.png',
      pos: 'center center',
      credit: 'Sky Knowledge — Navigation, Calendars, and Reading the Heavens'
    },
    'bridge-word-creation': {
      url: 'assets/images/bridge-word-creation.png',
      pos: 'center center',
      credit: 'Creation Through Word — Speech, Chant, Name, and the Making of Worlds'
    },

    /* Older aliases */
    'br-darkness': {
      url: 'assets/images/bridge-darkness.png',
      pos: 'center center',
      credit: 'Kumulipo & Nun — Creation from Primordial Darkness'
    },
    'br-aloha-maat': {
      url: 'assets/images/bridge-aloha-maat.png',
      pos: 'center center',
      credit: 'Aloha & Maʻat — Ethics of Right Relationship'
    }
  };

  const CULTURE_FALLBACKS = {
    kanaka: {
      url: 'assets/images/kanaka-culture.png',
      pos: 'center center',
      credit: 'Kānaka Maoli knowledge system'
    },
    kemet: {
      url: 'assets/images/kemet-culture.png',
      pos: 'center center',
      credit: 'Kemet knowledge system'
    },
    bridge: {
      url: 'assets/images/bridge-culture.png',
      pos: 'center center',
      credit: 'The Bridge — cross-cultural knowledge'
    },
    dreamtime: {
      url: 'assets/images/dreamtime-culture.png',
      pos: 'center center',
      credit: 'Dreamtime knowledge system'
    },
    default: {
      url: 'assets/images/default-culture.png',
      pos: 'center center',
      credit: 'Living Knowledge Platform'
    }
  };

  const GLOSSARY = {
    mana: {
      title: 'Mana',
      culture: 'Kānaka Maoli',
      body: 'Spiritual power, authority, and life-force. Strengthened through right relationship and pono action.'
    },
    pono: {
      title: 'Pono',
      culture: 'Kānaka Maoli',
      body: 'Balance, righteousness, and alignment with what is good, true, and life-supporting.'
    },
    aloha: {
      title: 'Aloha',
      culture: 'Kānaka Maoli',
      body: 'Presence, breath, compassion, and right relationship — vastly more than a greeting.'
    },
    kumulipo: {
      title: 'Kumulipo',
      culture: 'Kānaka Maoli',
      body: 'A Hawaiian creation chant connecting darkness, life, sea, land, and genealogy.'
    },
    po: {
      title: 'Pō',
      culture: 'Kānaka Maoli',
      body: 'Primordial darkness from which all life emerges. Not absence — pure potential.'
    },
    ao: {
      title: 'Ao',
      culture: 'Kānaka Maoli',
      body: 'The realm of light and living humans. The complement of Pō in Hawaiian cosmology.'
    },
    koa: {
      title: 'Koʻa',
      culture: 'Kānaka Maoli',
      body: 'Coral polyp — one of the earliest living forms named in the Kumulipo.'
    },
    wa: {
      title: 'Wā',
      culture: 'Kānaka Maoli',
      body: 'An epoch or period; time-space understood relationally, not only mechanically.'
    },
    moolelo: {
      title: 'Moʻolelo',
      culture: 'Kānaka Maoli',
      body: 'Story, history, and carried memory — transmits knowledge across generations.'
    },
    maat: {
      title: 'Maʻat',
      culture: 'Kemet',
      body: 'Truth, balance, cosmic justice — the ethical order sustaining all life.'
    },
    nun: {
      title: 'Nun',
      culture: 'Kemet',
      body: 'Primordial waters — the limitless, undifferentiated source from which creation emerged.'
    },
    atum: {
      title: 'Atum',
      culture: 'Kemet',
      body: 'The self-created deity who emerged from Nun and initiated divine order.'
    },
    duat: {
      title: 'Duat',
      culture: 'Kemet',
      body: 'The realm of transformation — where souls are judged and renewed.'
    },
    isfet: {
      title: 'Isfet',
      culture: 'Kemet',
      body: 'Disorder, injustice, and falsehood — what happens when Maʻat is broken.'
    },
    medu: {
      title: 'Medu Netjer',
      culture: 'Kemet',
      body: 'Sacred Kemetic writing — “words of the gods.”'
    }
  };

  const DEFAULT_REFLECTIONS = [
    'What is the deepest idea this lesson preserves — and for whom?',
    'How does this knowledge connect land, sea, sky, family, or community?',
    'What responsibility comes with knowing this?'
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
    sidebarSearch: ''
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

  function escapeAttr(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
    } catch {}
  }

  function stripHTML(value) {
    return String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cleanAssetPath(path) {
    let value = String(path || '').trim();
    if (!value) return '';

    value = value.replace(/^\.\//, '');
    value = value.replace(/^LKP\//, '');
    value = value.replace(/^\/LKP\//, '');

    return value;
  }

  function getData() {
    const data = [
      window.CULTURALVERSE_DATA,
      window.LKP_DATA,
      window.IKEVERSE_DATA
    ].find(item => item && Array.isArray(item.cultures) && item.cultures.length > 0);

    if (data) {
      window.CULTURALVERSE_DATA = data;
      window.LKP_DATA = data;
      window.IKEVERSE_DATA = data;
    }

    return data || null;
  }

  function getCultureColor(theme) {
    return {
      emerald: '#3cb371',
      kanaka: '#3cb371',
      gold: '#f0c96a',
      kemet: '#f0c96a',
      bridge: '#8fa0ff',
      rust: '#d98545',
      amber: '#e4ad48',
      cyan: '#54c6ee',
      violet: '#8fa0ff',
      default: '#54c6ee'
    }[theme] || '#54c6ee';
  }

  function makeCulturalPlaceholderSVG(lesson, fallbackData) {
    const data = fallbackData || LESSON_IMAGE_REGISTRY[lesson.id];
    const cultureId = lesson.cultureId || 'default';
    const filename = data?.filename || data?.url || `assets/images/${lesson.id || 'lesson'}.png`;
    const title = escapeAttr(lesson.title || 'Lesson');
    const culture = escapeAttr(lesson.cultureName || '');
    const module = escapeAttr(lesson.moduleTitle || '');

    const palettes = {
      kanaka: {
        bg0: '#010e08',
        bg1: '#061c12',
        bg2: '#0e2e1a',
        a1: '#3cb371',
        a2: '#54c6ee',
        t: '#8fffc7'
      },
      kemet: {
        bg0: '#0a0600',
        bg1: '#1a0f00',
        bg2: '#2a1800',
        a1: '#f0c96a',
        a2: '#d98545',
        t: '#ffeab0'
      },
      bridge: {
        bg0: '#04070f',
        bg1: '#080f20',
        bg2: '#0d1630',
        a1: '#8fa0ff',
        a2: '#54c6ee',
        t: '#c4ceff'
      },
      default: {
        bg0: '#01030a',
        bg1: '#04070f',
        bg2: '#08111e',
        a1: '#54c6ee',
        a2: '#8fa0ff',
        t: '#dbefff'
      }
    };

    const p = palettes[cultureId] || palettes.default;

    const stars = Array.from({ length: 38 }, (_, i) => {
      const x = 40 + (i * 43) % 1140;
      const y = 22 + (i * 37) % 310;
      const r = i % 5 === 0 ? 2.3 : 1.3;
      const fill = i % 2 ? p.a1 : p.a2;
      const opacity = 0.12 + (i % 4) * 0.06;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;
    }).join('');

    const pattern = cultureId === 'kemet'
      ? `<polygon points="600,58 380,300 820,300" fill="none" stroke="${p.a1}" stroke-width="1" opacity="0.14"/>
         <polygon points="600,100 440,300 760,300" fill="${p.a1}" opacity="0.045"/>
         <ellipse cx="600" cy="175" rx="44" ry="20" fill="none" stroke="${p.a1}" stroke-width="0.8" opacity="0.14"/>`
      : cultureId === 'bridge'
        ? `<circle cx="290" cy="180" r="100" fill="none" stroke="#3cb371" stroke-width="0.8" opacity="0.15"/>
           <circle cx="910" cy="180" r="100" fill="none" stroke="${p.a1}" stroke-width="0.8" opacity="0.15"/>
           <path d="M290,180 Q600,50 910,180" fill="none" stroke="${p.a1}" stroke-width="0.7" opacity="0.14"/>
           <path d="M290,180 Q600,310 910,180" fill="none" stroke="#3cb371" stroke-width="0.7" opacity="0.12"/>`
        : `<line x1="600" y1="30" x2="600" y2="330" stroke="${p.a1}" stroke-width="0.6" opacity="0.10"/>
           <line x1="460" y1="180" x2="740" y2="180" stroke="${p.a1}" stroke-width="0.6" opacity="0.10"/>
           <circle cx="600" cy="180" r="80" fill="none" stroke="${p.a1}" stroke-width="0.7" opacity="0.12"/>
           <circle cx="600" cy="180" r="130" fill="none" stroke="${p.a2}" stroke-width="0.5" opacity="0.08"/>`;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${p.bg0}"/>
            <stop offset="50%" stop-color="${p.bg1}"/>
            <stop offset="100%" stop-color="${p.bg2}"/>
          </linearGradient>
          <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
            <stop offset="70%" stop-color="rgba(0,0,0,0.3)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.72)"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="360" fill="url(#bg)"/>
        ${stars}
        ${pattern}
        <rect width="1200" height="360" fill="url(#vig)"/>
        <text x="600" y="172" text-anchor="middle" font-family="Georgia,serif" font-size="46" fill="${p.t}" opacity="0.96">${title}</text>
        <text x="600" y="218" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" letter-spacing="0.12em" fill="${p.a1}" opacity="0.72">${culture}${module ? ' · ' + module : ''}</text>
        <text x="600" y="318" text-anchor="middle" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.25)">📸 ${filename}</text>
      </svg>
    `;

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function buildUrlCandidates(url) {
    const cleaned = cleanAssetPath(url);
    const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
    const current = cleaned.match(/\.\w+$/)?.[0]?.toLowerCase() || '';
    const base = current ? cleaned.slice(0, -current.length) : cleaned;

    const stems = new Set([
      base,
      base.replace(/_/g, '-'),
      base.replace(/-/g, '_'),
      base.replace('/bridge-', '/br-'),
      base.replace('/br-', '/bridge-')
    ]);

    const ordered = [];

    for (const stem of stems) {
      ordered.push(current ? stem + current : stem);

      for (const ext of extensions) {
        if (ext !== current) {
          ordered.push(stem + ext);
        }
      }
    }

    return [...new Set(ordered.filter(Boolean))];
  }

  function getHeroImage(lesson) {
    const raw = cleanAssetPath(lesson.image || lesson.heroImage || lesson.thumbnail || '');

    if (raw && raw.length > 4) {
      return {
        url: raw,
        pos: 'center center',
        credit: '',
        placeholder: false
      };
    }

    return (
      LESSON_IMAGE_REGISTRY[lesson.id] ||
      CULTURE_FALLBACKS[lesson.cultureId] ||
      CULTURE_FALLBACKS.default
    );
  }

  function updateHeroImage(lesson) {
    const hero = document.getElementById('cultureHero');
    if (!hero) return;

    const img = getHeroImage(lesson);

    if (img.placeholder) {
      applyPlaceholder(hero, lesson, img);
      return;
    }

    applyPlaceholder(hero, lesson, img, true);

    const candidates = buildUrlCandidates(img.url);

    function tryNext(index) {
      if (index >= candidates.length) {
        applyPlaceholder(hero, lesson, img);
        console.warn('[LKP Hero] No image found for', lesson.id, '— tried:', candidates);
        return;
      }

      const probe = new Image();

      probe.onload = () => {
        applyRealHero(hero, {
          ...img,
          url: candidates[index]
        });
      };

      probe.onerror = () => tryNext(index + 1);
      probe.src = candidates[index];
    }

    tryNext(0);
  }

  function applyRealHero(hero, img) {
    hero.style.backgroundImage = `url("${img.url}")`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = img.pos || 'center center';
    hero.style.backgroundRepeat = 'no-repeat';
    hero.classList.add('has-lesson-image');
    hero.classList.remove('has-placeholder', 'is-loading');
    setHeroCredit(hero, img.credit || '');
  }

  function applyPlaceholder(hero, lesson, img, loading) {
    hero.style.backgroundImage = `url("${makeCulturalPlaceholderSVG(lesson, img)}")`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center center';
    hero.style.backgroundRepeat = 'no-repeat';
    hero.classList.toggle('has-placeholder', !loading);
    hero.classList.toggle('is-loading', !!loading);
    hero.classList.remove('has-lesson-image');
    setHeroCredit(hero, img.filename ? `📸 Add: ${img.filename}` : (img.hint || img.credit || ''));
  }

  function setHeroCredit(hero, text) {
    let badge = hero.querySelector('.cv-hero-credit');

    if (!text) {
      badge?.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'cv-hero-credit';
      hero.appendChild(badge);
    }

    badge.textContent = text;
  }

  function normalizeSources(raw) {
    if (!Array.isArray(raw)) return [];

    return raw.map(source => {
      if (typeof source === 'string') {
        return {
          label: source,
          url: '',
          note: ''
        };
      }

      return {
        label: source.label || source.title || source.name || '',
        url: source.url || source.href || '',
        note: source.note || source.desc || ''
      };
    }).filter(source => source.label);
  }

  function normalizeKidVersion(lesson) {
    const kid = lesson.kidVersion || lesson.keikiVersion || lesson.kid || lesson.keiki || null;

    if (!kid || typeof kid !== 'object') return null;

    return {
      story: kid.story || kid.summary || kid.intro || '',
      bigIdeas: Array.isArray(kid.bigIdeas) ? kid.bigIdeas : [],
      vocabulary: Array.isArray(kid.vocabulary) ? kid.vocabulary : [],
      activity: kid.activity || '',
      reflection: Array.isArray(kid.reflection) ? kid.reflection : []
    };
  }

  function normalizeData(data) {
    const cultures = Array.isArray(data?.cultures) ? data.cultures : [];

    return cultures.map(culture => ({
      id: culture.id || '',
      name: culture.name || 'Untitled',
      emoji: culture.emoji || '✶',
      tagline: culture.tagline || '',
      theme: culture.theme || 'default',
      status: culture.status || 'live',
      intro: culture.intro || '',
      modules: Array.isArray(culture.modules)
        ? culture.modules.map(module => ({
            id: module.id || '',
            title: module.title || 'Module',
            emoji: module.emoji || culture.emoji || '✶',
            desc: module.desc || '',
            lessons: Array.isArray(module.lessons)
              ? module.lessons.map(lesson => ({
                  id: lesson.id || '',
                  num: lesson.num || '',
                  title: lesson.title || 'Lesson',
                  readTime: lesson.readTime || '',
                  content: lesson.content || '',
                  excerpt: lesson.excerpt || lesson.leadText || '',
                  objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
                  mana: Number(lesson.mana || DEFAULT_MANA),
                  xp: Number(lesson.xp || 25),
                  image: lesson.image || lesson.heroImage || lesson.thumbnail || '',
                  sources: normalizeSources(lesson.sources || lesson.references || []),
                  related: Array.isArray(lesson.related) ? lesson.related : [],
                  kidVersion: normalizeKidVersion(lesson),
                  cultureId: culture.id || '',
                  cultureName: culture.name || '',
                  cultureEmoji: culture.emoji || '✶',
                  cultureTheme: culture.theme || 'default',
                  moduleId: module.id || '',
                  moduleTitle: module.title || '',
                  moduleEmoji: module.emoji || culture.emoji || '✶'
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
            contentText: stripHTML(lesson.content || '')
          });
        });
      });
    });

    return lessons;
  }

  function isCompleted(id) {
    if (!id) return false;

    if (window.LKPRewards?.isCompleted) {
      try {
        return Boolean(window.LKPRewards.isCompleted(id));
      } catch {}
    }

    return state.completed.includes(id);
  }

  function syncCompletedFromRewards() {
    if (!window.LKPRewards) return;

    try {
      const completed = window.LKPRewards.getCompletedLessons?.();

      if (Array.isArray(completed)) {
        state.completed = completed;
        writeJSON(COMPLETED_KEY, completed);
      }

      window.LKPRewards.setCompletedLessons?.(state.completed);
    } catch {}
  }

  function saveCompleted() {
    state.completed = [...new Set(state.completed.filter(Boolean))];
    writeJSON(COMPLETED_KEY, state.completed);

    try {
      window.LKPRewards?.setCompletedLessons?.(state.completed);
    } catch {}
  }

  function getMana() {
    return Number(localStorage.getItem(MANA_KEY) || '0') || 0;
  }

  function setMana(value) {
    localStorage.setItem(MANA_KEY, String(Math.max(0, Number(value) || 0)));
  }

  function ensureSidebarTools() {
    const header = $('.lkp-sidebar__header');

    if (!header || document.getElementById('lessonTreeSearch')) return;

    const tools = document.createElement('div');
    tools.className = 'lkp-sidebar-tools';
    tools.innerHTML = `
      <label class="lkp-tree-search">
        <i class="fas fa-search"></i>
        <input id="lessonTreeSearch" type="search" placeholder="Search lessons…" autocomplete="off"/>
      </label>
    `;

    header.appendChild(tools);
  }

  function renderCultureFilters() {
    const holder = document.getElementById('cultureFilters');
    const welcome = document.getElementById('welcomeCultures');

    if (!holder) return;

    const liveCultures = state.cultures.filter(culture =>
      culture.modules.some(module => module.lessons.length)
    );

    holder.innerHTML = `
      <button class="cv-filter-btn is-active" type="button" data-culture-filter="all">All</button>
      ${state.cultures.map(culture => {
        const disabled = culture.modules.every(module => !module.lessons.length);

        return `
          <button
            class="cv-culture-filter${disabled ? ' is-disabled' : ''}"
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

  function getCultureProgress(culture) {
    const allLessons = culture.modules.flatMap(module => module.lessons);
    const done = allLessons.filter(lesson => isCompleted(lesson.id)).length;

    return {
      total: allLessons.length,
      done,
      percent: allLessons.length ? Math.round((done / allLessons.length) * 100) : 0
    };
  }

  function renderLessonTree() {
    const tree = document.getElementById('lessonTree');
    if (!tree) return;

    const query = state.sidebarSearch.trim().toLowerCase();

    const visibleCultures = state.activeCulture === 'all'
      ? state.cultures
      : state.cultures.filter(culture => culture.id === state.activeCulture);

    if (!state.cultures.length) {
      tree.innerHTML = `
        <div class="cv-tree-empty">
          <strong>No lesson data found.</strong>
          <span>Check that <code>LKP/js/lkp-data.js</code> loads first.</span>
        </div>
      `;
      return;
    }

    tree.innerHTML = visibleCultures.map(culture => {
      const progress = getCultureProgress(culture);

      const progressBar = `
        <div class="cv-culture-progress">
          <div class="cv-culture-progress__meta">
            <span>${progress.done}/${progress.total} complete</span>
            <span>${progress.percent}%</span>
          </div>
          <div class="cv-culture-progress__bar">
            <span style="width:${progress.percent}%;background:${getCultureColor(culture.theme)}"></span>
          </div>
        </div>
      `;

      const filteredModules = culture.modules.map(module => ({
        ...module,
        lessons: module.lessons.filter(lesson => {
          if (!query) return true;

          return [
            lesson.title,
            lesson.num,
            culture.name,
            module.title,
            lesson.contentText,
            lesson.excerpt
          ].join(' ').toLowerCase().includes(query);
        })
      })).filter(module => module.lessons.length);

      if (!filteredModules.length) {
        return `
          <section class="cv-tree-culture">
            <div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}">
              <span>${escapeHTML(culture.emoji)}</span>
              ${escapeHTML(culture.name)}
            </div>
            ${progressBar}
            <div class="cv-tree-module">
              <div class="cv-tree-module__title">Coming Soon</div>
              <button class="cv-tree-lesson" type="button" disabled>
                <strong>${escapeHTML(query ? 'No matching lessons.' : culture.tagline || 'Lessons being prepared.')}</strong>
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

          ${progressBar}

          ${filteredModules.map(module => `
            <div class="cv-tree-module">
              <div class="cv-tree-module__title">
                <span>${escapeHTML(module.emoji)}</span>
                ${escapeHTML(module.title)}
              </div>

              ${module.lessons.map(lesson => {
                const done = isCompleted(lesson.id);
                const active = lesson.id === state.activeLessonId;

                return `
                  <button
                    class="cv-tree-lesson${active ? ' is-active' : ''}${done ? ' is-complete' : ''}"
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
    }).join('') || `
      <div class="cv-tree-empty">
        <strong>No lessons found.</strong>
      </div>
    `;
  }

  function findLesson(id) {
    return state.lessons.find(lesson => lesson.id === id) || null;
  }

  function getLessonIndex(id) {
    return state.lessons.findIndex(lesson => lesson.id === id);
  }

  function inferObjectives(lesson) {
    if (Array.isArray(lesson.objectives) && lesson.objectives.length) {
      return lesson.objectives;
    }

    const match = (lesson.content || '').match(/<objectives>([\s\S]*?)<\/objectives>/i);

    if (match) {
      const items = match[1]
        .split('\n')
        .map(item => item.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);

      if (items.length) return items;
    }

    const base = [
      `Understand the historical and living context of ${lesson.title} within ${lesson.cultureName || 'this tradition'}.`,
      'Identify the core concepts, vocabulary, and practices this knowledge system preserves.',
      'Reflect on how this teaching connects to living communities today.'
    ];

    if (lesson.cultureId === 'kanaka') {
      base[1] = 'Recognize key Hawaiian terms and their connections to land, ocean, and sky.';
    } else if (lesson.cultureId === 'kemet') {
      base[1] = 'Explore the philosophical, scientific, and ethical dimensions of Kemetic knowledge.';
    } else if (lesson.cultureId === 'bridge') {
      base[1] = 'Draw connections between parallel concepts across Hawaiian and Kemetic traditions.';
      base[2] = 'Consider what cross-cultural dialogue reveals about universal human knowledge systems.';
    }

    return base;
  }

  function renderLessonHeader(lesson) {
    const done = isCompleted(lesson.id);
    const mana = lesson.mana || DEFAULT_MANA;
    const words = lesson.contentText ? lesson.contentText.split(/\s+/).length : 0;
    const readLabel = lesson.readTime || (words > 0 ? `${Math.ceil(words / 200)} min read` : 'Deep Reading');
    const objectives = inferObjectives(lesson);

    return `
      <nav class="cv-lesson-path">
        <span class="cv-lesson-path__link">${escapeHTML(lesson.cultureEmoji)} ${escapeHTML(lesson.cultureName)}</span>
        <span class="cv-lesson-path__sep">›</span>
        <span>${escapeHTML(lesson.moduleTitle)}</span>
        ${lesson.num ? `<span class="cv-lesson-path__sep">›</span><span>${escapeHTML(lesson.num)}</span>` : ''}
      </nav>

      <h1 class="cv-lesson-title">${escapeHTML(lesson.title)}</h1>

      ${lesson.excerpt ? `<p class="cv-lesson-excerpt">${escapeHTML(lesson.excerpt)}</p>` : ''}

      <div class="cv-lesson-meta">
        ${lesson.num ? `<span class="cv-meta-chip"><i class="fas fa-hashtag"></i>${escapeHTML(lesson.num)}</span>` : ''}
        <span class="cv-meta-chip"><i class="fas fa-clock"></i>${escapeHTML(readLabel)}</span>
        <span class="cv-meta-chip" style="border-color:var(--active-color);color:var(--active-color);">${escapeHTML(lesson.cultureEmoji)} ${escapeHTML(lesson.cultureName)}</span>
        <span class="cv-meta-chip">${state.mode === 'keiki' ? '🌺 Keiki' : '📜 Scholar'}</span>
      </div>

      ${objectives.length ? `
        <details class="cv-objectives">
          <summary class="cv-objectives__toggle">
            <i class="fas fa-compass"></i>
            Learning Objectives
            <i class="fas fa-chevron-down cv-objectives__arrow"></i>
          </summary>
          <ul class="cv-objectives__list">
            ${objectives.map(objective => `<li>${escapeHTML(objective)}</li>`).join('')}
          </ul>
        </details>
      ` : ''}

      <div id="lessonActionSentinel" style="height:1px;margin:-1px 0 0;pointer-events:none;"></div>

      <div class="cv-action-strip" id="lessonActionStrip" role="toolbar">
        <button class="cv-btn-complete ${done ? 'is-complete' : ''}" type="button" data-complete-active-lesson>
          ${done ? '<i class="fas fa-check-circle"></i> Complete' : `<i class="fas fa-star"></i> Mark Complete · +${mana} Mana`}
        </button>

        <div class="cv-mode-toggle" role="group">
          <button class="cv-btn-mode ${state.mode === 'scholar' ? 'is-active' : ''}" type="button" data-lesson-mode="scholar">
            <i class="fas fa-scroll"></i>
            Scholar
          </button>
          <button class="cv-btn-mode ${state.mode === 'keiki' ? 'is-active' : ''}" type="button" data-lesson-mode="keiki">
            🌺 Keiki
          </button>
        </div>

        <div class="cv-font-controls" role="group">
          <button class="cv-btn-icon" type="button" data-font-adjust="-">A−</button>
          <button class="cv-btn-icon" type="button" data-font-adjust="+">A+</button>
        </div>

        <button class="cv-btn-icon" type="button" data-reading-mode title="Focus mode">
          <i class="fas fa-expand"></i>
        </button>
      </div>
    `;
  }

  function transformContent(content, lesson) {
    let html = String(content || '');

    html = html.replace(/<objectives>[\s\S]*?<\/objectives>/gi, '');

    html = html.replace(
      /<chant(?:\s+lang="([^"]*)")?(?:\s+title="([^"]*)")?>([\s\S]*?)<\/chant>/gi,
      (_match, lang, title, inner) => {
        const lines = inner.trim().split('\n').map(line => line.trim()).filter(Boolean);

        return `
          <div class="cv-chant" lang="${escapeHTML(lang || 'haw')}">
            <div class="cv-chant__header">
              <span class="cv-chant__lang">${escapeHTML(lang || 'Traditional')}</span>
              ${title ? `<span class="cv-chant__title">${escapeHTML(title)}</span>` : ''}
            </div>
            <div class="cv-chant__lines">
              ${lines.map(line => `<div class="cv-chant__line">${escapeHTML(line)}</div>`).join('')}
            </div>
          </div>
        `;
      }
    );

    html = html.replace(
      /<primary-source(?:\s+cite="([^"]*)")?(?:\s+date="([^"]*)")?>([\s\S]*?)<\/primary-source>/gi,
      (_match, cite, date, inner) => `
        <blockquote class="cv-primary-source">
          <div class="cv-primary-source__mark">❝</div>
          <div class="cv-primary-source__text">${inner.trim()}</div>
          ${cite || date ? `
            <footer class="cv-primary-source__footer">
              ${date ? `<span class="cv-primary-source__date">${escapeHTML(date)}</span>` : ''}
              ${cite ? `<cite class="cv-primary-source__cite">${escapeHTML(cite)}</cite>` : ''}
            </footer>
          ` : ''}
        </blockquote>
      `
    );

    html = html.replace(
      /<scripture(?:\s+cite="([^"]*)")?(?:\s+title="([^"]*)")?>([\s\S]*?)<\/scripture>/gi,
      (_match, cite, title, inner) => `
        <div class="cv-scripture">
          ${title ? `<div class="cv-scripture__title">${escapeHTML(title)}</div>` : ''}
          <div class="cv-scripture__text">${inner.trim()}</div>
          ${cite ? `<div class="cv-scripture__cite">— ${escapeHTML(cite)}</div>` : ''}
        </div>
      `
    );

    html = html.replace(
      /<manuscript(?:\s+cite="([^"]*)")?>([\s\S]*?)<\/manuscript>/gi,
      (_match, cite, inner) => `
        <div class="cv-manuscript">
          <div class="cv-manuscript__text">${inner.trim()}</div>
          ${cite ? `<div class="cv-manuscript__cite">${escapeHTML(cite)}</div>` : ''}
        </div>
      `
    );

    html = html.replace(
      /<callout(?:\s+type="([^"]+)")?>([\s\S]*?)<\/callout>/gi,
      (_match, type, inner) => `
        <div class="cv-callout${type ? ` cv-callout--${escapeHTML(type)}` : ''}" role="note">${inner}</div>
      `
    );

    html = html.replace(
      /<facts>([\s\S]*?)<\/facts>/gi,
      (_match, inner) => `
        <div class="cv-facts">
          ${inner.split('|').map(item => item.trim()).filter(Boolean).map(item => {
            const [value, label] = item.split('::').map(part => part?.trim() || '');

            return `
              <div class="cv-fact">
                <strong>${escapeHTML(value || item)}</strong>
                ${label ? `<span>${escapeHTML(label)}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `
    );

    html = html.replace(
      /<twocol\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/twocol>/gi,
      (_match, left, right, inner) => {
        const [a, b] = inner.split('||');

        return `
          <div class="cv-twocol">
            <div class="cv-twocol__side">
              <strong class="cv-twocol__label">${escapeHTML(left)}</strong>
              <div>${(a || '').trim()}</div>
            </div>
            <div class="cv-twocol__side">
              <strong class="cv-twocol__label">${escapeHTML(right)}</strong>
              <div>${(b || '').trim()}</div>
            </div>
          </div>
        `;
      }
    );

    html = html.replace(
      /<compare\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/compare>/gi,
      (_match, left, right, inner) => {
        const [a, b] = inner.split('||');

        return `
          <div class="cv-compare">
            <div class="cv-compare__side">
              <strong class="cv-compare__label">${escapeHTML(left)}</strong>
              <div>${(a || '').trim()}</div>
            </div>
            <div class="cv-compare__divider"></div>
            <div class="cv-compare__side">
              <strong class="cv-compare__label">${escapeHTML(right)}</strong>
              <div>${(b || '').trim()}</div>
            </div>
          </div>
        `;
      }
    );

    html = html.replace(
      /<concepts>([\s\S]*?)<\/concepts>/gi,
      (_match, inner) => `
        <div class="cv-concepts" role="list">
          ${inner.split('·').map(item => item.trim()).filter(Boolean).map(item => `
            <span class="cv-concept" role="listitem">${escapeHTML(item)}</span>
          `).join('')}
        </div>
      `
    );

    html = html.replace(
      /<quote(?:\s+cite="([^"]+)")?>([\s\S]*?)<\/quote>/gi,
      (_match, cite, inner) => `
        <blockquote class="cv-quote">
          <p>${inner.trim()}</p>
          ${cite ? `<cite>— ${escapeHTML(cite)}</cite>` : ''}
        </blockquote>
      `
    );

    html = html.replace(
      /<term(?:\s+key="([^"]+)")?>([\s\S]*?)<\/term>/gi,
      (_match, key, inner) => {
        const label = stripHTML(inner);
        const lookup = String(key || label).toLowerCase().replace(/[^a-z0-9]/g, '');
        const def = GLOSSARY[lookup] || GLOSSARY[lookup.replace(/ʻ|'/g, '')];

        return `
          <span
            class="cv-term"
            tabindex="0"
            role="button"
            data-term-title="${escapeHTML(def?.title || label)}"
            data-term-culture="${escapeHTML(def?.culture || lesson.cultureName || '')}"
            data-term-body="${escapeHTML(def?.body || 'A key term in this lesson.')}"
          >${inner}</span>
        `;
      }
    );

    html = html.replace(
      /<timeline>([\s\S]*?)<\/timeline>/gi,
      (_match, inner) => `
        <div class="cv-timeline" role="list">
          ${inner.split('\n').map(item => item.trim()).filter(Boolean).map(item => {
            const [date, text] = item.split('::').map(part => part?.trim() || '');

            return `
              <div class="cv-timeline__item" role="listitem">
                <div class="cv-timeline__dot"></div>
                <div>
                  <strong class="cv-timeline__date">${escapeHTML(date)}</strong>
                  <span class="cv-timeline__text">${escapeHTML(text)}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `
    );

    html = html.replace(
      /<activity>([\s\S]*?)<\/activity>/gi,
      (_match, inner) => `
        <div class="cv-activity" role="note">
          <div class="cv-activity__hd">
            <i class="fas fa-hand-sparkles"></i>
            <strong>Learning Activity</strong>
          </div>
          <div class="cv-activity__body">${inner.trim()}</div>
        </div>
      `
    );

    html = html.replace(
      /<teacher-note>([\s\S]*?)<\/teacher-note>/gi,
      (_match, inner) => `
        <aside class="cv-teacher-note">
          <div class="cv-aside-hd">
            <i class="fas fa-chalkboard-teacher"></i>
            <strong>Teacher Note</strong>
          </div>
          <p>${inner.trim()}</p>
        </aside>
      `
    );

    html = html.replace(
      /<historian-note>([\s\S]*?)<\/historian-note>/gi,
      (_match, inner) => `
        <aside class="cv-historian-note">
          <div class="cv-aside-hd">
            <i class="fas fa-scroll"></i>
            <strong>Historian Note</strong>
          </div>
          <p>${inner.trim()}</p>
        </aside>
      `
    );

    html = html.replace(
      /<reflect(?:\s+title="([^"]+)")?>([\s\S]*?)<\/reflect>/gi,
      (_match, title, inner) => {
        const prompts = inner.split('\n').map(item => item.trim()).filter(Boolean);
        return renderReflectionAccordion(prompts, lesson, title);
      }
    );

    return html;
  }

  function renderReflectionAccordion(prompts, lesson, title) {
    const existing = state.reflections[lesson.id] || {};

    return `
      <details class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}">
        <summary class="cv-reflection__toggle">
          <i class="fas fa-pen-nib"></i>
          ${escapeHTML(title || 'Reflection Prompts')}
          <span class="cv-reflection__hint">click to open</span>
        </summary>

        <div class="cv-reflection__body">
          <p class="cv-reflection__intro">
            These prompts are for your own thinking — saved locally on this device and synced when signed in.
          </p>

          <div class="cv-reflection-list">
            ${prompts.map((prompt, index) => `
              <label class="cv-reflection-card">
                <span class="cv-reflection-card__prompt">${escapeHTML(prompt)}</span>
                <textarea data-reflection-index="${index}" placeholder="Write your reflection…" rows="3">${escapeHTML(existing[index] || '')}</textarea>
              </label>
            `).join('')}
          </div>

          <div class="cv-reflection-status" id="reflectionStatus">
            <i class="fas fa-lock"></i>
            Saved on this device only
          </div>
        </div>
      </details>
    `;
  }

  function renderKeikiContent(lesson) {
    const kid = lesson.kidVersion;
    const story = kid?.story || kid?.summary || autoStory(lesson);
    const bigIdeas = kid?.bigIdeas?.length ? kid.bigIdeas : autoIdeas(lesson);
    const vocab = kid?.vocabulary?.length ? kid.vocabulary : autoVocab(lesson);
    const activity = kid?.activity || autoActivity(lesson);
    const prompts = kid?.reflection?.length
      ? kid.reflection
      : ['What surprised you most?', 'How would you explain this to a friend?', 'What question do you still have?'];

    const existing = state.reflections[lesson.id] || {};

    return `
      <div class="cv-keiki-wrap">
        <div class="cv-keiki-banner">
          <span class="cv-keiki-banner__badge">🌺 Keiki Mode</span>
          <span class="cv-keiki-banner__title">${escapeHTML(lesson.title)}</span>
        </div>

        <section class="cv-keiki-section">
          <h3 class="cv-keiki-section__title"><span>📖</span> The Story</h3>
          <div class="cv-keiki-story">${story}</div>
        </section>

        <section class="cv-keiki-section">
          <h3 class="cv-keiki-section__title"><span>💡</span> Big Ideas</h3>
          <div class="cv-keiki-ideas">
            ${bigIdeas.map((idea, index) => `
              <div class="cv-keiki-idea">
                <span class="cv-keiki-idea__num">${index + 1}</span>
                <p>${escapeHTML(idea)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        ${vocab.length ? `
          <section class="cv-keiki-section">
            <h3 class="cv-keiki-section__title"><span>📚</span> Words to Know</h3>
            <div class="cv-keiki-vocab">
              ${vocab.map(item => `
                <div class="cv-keiki-vocab__card">
                  <strong>${escapeHTML(item.term || item.title || '')}</strong>
                  <span>${escapeHTML(item.meaning || item.body || item.definition || '')}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="cv-keiki-section">
          <h3 class="cv-keiki-section__title"><span>✏️</span> Try This</h3>
          <div class="cv-keiki-activity">${escapeHTML(activity)}</div>
        </section>

        <details class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}">
          <summary class="cv-reflection__toggle">
            <i class="fas fa-pen-nib"></i>
            Your Reflections
            <span class="cv-reflection__hint">click to open</span>
          </summary>

          <div class="cv-reflection__body">
            <div class="cv-reflection-list">
              ${prompts.map((prompt, index) => `
                <label class="cv-reflection-card">
                  <span class="cv-reflection-card__prompt">${escapeHTML(prompt)}</span>
                  <textarea data-reflection-index="${index}" placeholder="Write here…" rows="3">${escapeHTML(existing[index] || '')}</textarea>
                </label>
              `).join('')}
            </div>

            <div class="cv-reflection-status" id="reflectionStatus">
              <i class="fas fa-lock"></i>
              Saved on this device only
            </div>
          </div>
        </details>
      </div>
    `;
  }

  function autoStory(lesson) {
    const text = stripHTML(lesson.content || '')
      .split(/[.!?]/)
      .slice(0, 3)
      .join('. ')
      .trim();

    return escapeHTML(text || `${lesson.title} is an important teaching from ${lesson.cultureName}.`);
  }

  function autoIdeas(lesson) {
    return [
      `This knowledge belongs to ${lesson.cultureName} — a living tradition.`,
      'Knowledge is passed through story, chant, and practice — not just books.',
      'When we learn, we carry something important forward for those who come after.'
    ];
  }

  function autoVocab(lesson) {
    const text = `${lesson.contentText} ${lesson.title}`.toLowerCase();

    return Object.entries(GLOSSARY)
      .filter(([key]) => text.includes(key))
      .slice(0, 5)
      .map(([, value]) => ({
        term: value.title,
        meaning: value.body
      }));
  }

  function autoActivity(lesson) {
    if (lesson.cultureId === 'kanaka') {
      return 'Draw a web with the ocean in the center. Connect: water → coral → fish → birds → people. Write one word on each line describing the relationship.';
    }

    if (lesson.cultureId === 'kemet') {
      return 'Draw two columns: Maʻat (Balance) and Isfet (Disorder). List 3 things from your own life in each column. What tips the scales?';
    }

    return 'Create a mind map with this lesson title at the center. Add 5 connecting ideas. Share one connection with someone you trust.';
  }

  function bindReflectionTextareas(lesson) {
    $all('[data-reflection-index]').forEach(textarea => {
      textarea.addEventListener('input', () => {
        const reflections = state.reflections[lesson.id] || {};
        reflections[textarea.dataset.reflectionIndex] = textarea.value;
        state.reflections[lesson.id] = reflections;
        writeJSON(REFLECTIONS_KEY, state.reflections);

        if (window.LKPProfileSync && window.LKPProfileSync.state.user) {
          window.LKPProfileSync.saveReflection(
            lesson.id,
            textarea.dataset.reflectionIndex,
            textarea.value,
            textarea.closest('.cv-reflection-card')?.querySelector('.cv-reflection-card__prompt')?.textContent || ''
          );
        }

        const status = document.getElementById('reflectionStatus');

        if (status) {
          if (window.LKPProfileSync && window.LKPProfileSync.state.user) {
            status.innerHTML = '<i class="fas fa-cloud"></i> Saved to cloud';
          } else {
            status.innerHTML = '<i class="fas fa-check"></i> Saved locally';
          }

          clearTimeout(bindReflectionTextareas._timer);

          bindReflectionTextareas._timer = setTimeout(() => {
            status.innerHTML = window.LKPProfileSync && window.LKPProfileSync.state.user
              ? '<i class="fas fa-cloud"></i> Synced with your Passport'
              : '<i class="fas fa-lock"></i> Saved on this device only';
          }, 1800);
        }
      });
    });
  }

  function renderSources(lesson) {
    const holder = document.getElementById('lessonSources');
    if (!holder) return;

    const sources = lesson.sources || [];

    if (!sources.length) {
      holder.innerHTML = '';
      return;
    }

    holder.innerHTML = `
      <section class="cv-sources">
        <div class="cv-divider-heading">
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
              <small>${source.url ? 'Open →' : 'Reference'}</small>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderRelatedLessons(lesson) {
    const nav = document.getElementById('lessonNav');
    if (!nav) return;

    let holder = document.getElementById('relatedLessons');

    if (!holder) {
      holder = document.createElement('section');
      holder.id = 'relatedLessons';
      holder.className = 'cv-related';
      nav.insertAdjacentElement('afterend', holder);
    }

    const byId = new Map(state.lessons.map(item => [item.id, item]));

    const explicit = (lesson.related || []).map(id => byId.get(id)).filter(Boolean);
    const sameModule = state.lessons.filter(item => item.id !== lesson.id && item.moduleId === lesson.moduleId);

    const bridgeMatch = state.lessons.filter(item => {
      if (item.id === lesson.id) return false;

      const a = `${lesson.title} ${lesson.contentText}`.toLowerCase();
      const b = `${item.title} ${item.contentText}`.toLowerCase();

      return [
        ['kumulipo', 'nun'],
        ['aloha', 'maat'],
        ['star', 'wayfinding'],
        ['creation', 'primordial'],
        ['medicine', 'healing']
      ].some(([x, y]) => {
        return (a.includes(x) && b.includes(y)) || (a.includes(y) && b.includes(x));
      });
    });

    const related = [
      ...new Map([...explicit, ...bridgeMatch, ...sameModule].map(item => [item.id, item])).values()
    ].filter(item => item.id !== lesson.id).slice(0, 3);

    if (!related.length) {
      holder.innerHTML = '';
      return;
    }

    holder.innerHTML = `
      <div class="cv-divider-heading">
        <span>Related Lessons</span>
      </div>

      <div class="cv-related-grid">
        ${related.map(item => `
          <button
            class="cv-related-card"
            type="button"
            data-related-lesson="${escapeHTML(item.id)}"
            style="--related-color:${getCultureColor(item.cultureTheme)}"
          >
            <span class="cv-related-card__emoji">${escapeHTML(item.cultureEmoji || '✦')}</span>
            <div>
              <strong>${escapeHTML(item.title)}</strong>
              <small>${escapeHTML(item.cultureName)} · ${escapeHTML(item.moduleTitle)}</small>
            </div>
            ${isCompleted(item.id) ? '<span class="cv-related-card__done">✓</span>' : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderLessonNav() {
    const nav = document.getElementById('lessonNav');
    if (!nav || !state.activeLessonId) return;

    const index = getLessonIndex(state.activeLessonId);
    const previous = index > 0 ? state.lessons[index - 1] : null;
    const next = index < state.lessons.length - 1 ? state.lessons[index + 1] : null;

    nav.innerHTML = `
      <button
        class="cv-nav-btn"
        type="button"
        data-nav-lesson="${previous ? escapeHTML(previous.id) : ''}"
        ${previous ? '' : 'disabled'}
      >
        <i class="fas fa-arrow-left"></i>
        <div>
          <small>Previous</small>
          <span>${previous ? escapeHTML(previous.title) : '—'}</span>
        </div>
      </button>

      <button
        class="cv-nav-btn cv-nav-btn--next"
        type="button"
        data-nav-lesson="${next ? escapeHTML(next.id) : ''}"
        ${next ? '' : 'disabled'}
      >
        <div>
          <small>Next</small>
          <span>${next ? escapeHTML(next.title) : '—'}</span>
        </div>
        <i class="fas fa-arrow-right"></i>
      </button>
    `;
  }

  function renderLesson(id, options = {}) {
    const lesson = findLesson(id);

    if (!lesson) {
      renderWelcome();
      return;
    }

    state.activeLessonId = lesson.id;

    document.body.dataset.culture = lesson.cultureId || 'default';
    document.body.dataset.lessonMode = state.mode;
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));

    const welcome = document.getElementById('lessonWelcome');
    const article = document.getElementById('lessonArticle');

    if (welcome) welcome.hidden = true;
    if (article) article.hidden = false;

    const header = document.getElementById('lessonHeader');

    if (header) {
      header.innerHTML = renderLessonHeader(lesson);
    }

    const body = document.getElementById('lessonBody');

    if (body) {
      body.innerHTML = state.mode === 'keiki'
        ? renderKeikiContent(lesson)
        : transformContent(lesson.content, lesson);

      if (state.mode === 'scholar' && !body.querySelector('.cv-reflection')) {
        body.insertAdjacentHTML('beforeend', renderReflectionAccordion(DEFAULT_REFLECTIONS, lesson, 'Reflection Prompts'));
      }
    }

    updateHeroImage(lesson);

    const emoji = document.getElementById('cultureHeroEmoji');
    const name = document.getElementById('cultureHeroName');

    if (emoji) emoji.textContent = lesson.cultureEmoji || '✦';
    if (name) name.textContent = `${lesson.cultureName} · ${lesson.moduleTitle}`;

    renderSources(lesson);
    renderLessonNav();
    renderRelatedLessons(lesson);
    renderLessonTree();
    updateCompleteButton(lesson);
    updateUrlHash(lesson.id);
    bindReflectionTextareas(lesson);
    initStickyStrip();

    window.dispatchEvent(new CustomEvent('lkp:culture-changed', {
      detail: {
        cultureId: lesson.cultureId,
        color: getCultureColor(lesson.cultureTheme)
      }
    }));

    window.dispatchEvent(new CustomEvent('lkp:lesson-changed', {
      detail: {
        lessonId: lesson.id,
        lesson
      }
    }));

    if (!options.noScroll) {
      requestAnimationFrame(() => {
        document.getElementById('lessonMain')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }

    closeSidebarOnMobile();
  }

  function updateCompleteButton(lesson) {
    const btn = document.querySelector('[data-complete-active-lesson]');
    if (!btn || !lesson) return;

    const done = isCompleted(lesson.id);

    btn.classList.toggle('is-complete', done);
    btn.innerHTML = done
      ? '<i class="fas fa-check-circle"></i> Complete'
      : `<i class="fas fa-star"></i> Mark Complete · +${lesson.mana || DEFAULT_MANA} Mana`;
  }

  function renderWelcome() {
    const welcome = document.getElementById('lessonWelcome');
    const article = document.getElementById('lessonArticle');

    if (welcome) welcome.hidden = false;
    if (article) article.hidden = true;

    state.activeLessonId = null;
    renderLessonTree();
  }

  let stickyObserver = null;

  function initStickyStrip() {
    if (stickyObserver) {
      stickyObserver.disconnect();
    }

    const strip = document.getElementById('lessonActionStrip');
    const sentinel = document.getElementById('lessonActionSentinel');

    if (!strip || !sentinel || !('IntersectionObserver' in window)) return;

    stickyObserver = new IntersectionObserver(entries => {
      strip.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, {
      threshold: 0
    });

    stickyObserver.observe(sentinel);
  }

  function updateUrlHash(id) {
    if (!id) return;

    const next = '#' + encodeURIComponent(id);

    if (window.location.hash !== next) {
      history.replaceState(null, '', next);
    }
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

  async function completeActiveLesson() {
    const lesson = findLesson(state.activeLessonId);
    if (!lesson) return;

    if (isCompleted(lesson.id)) {
      showToast('Already complete — Nānā i ke kumu.');
      return;
    }

    if (window.LKPProfileSync && window.LKPProfileSync.state.user) {
      const result = await window.LKPProfileSync.completeLesson(lesson);

      if (result.completed) {
        const localCompleted = readJSON(COMPLETED_KEY, []);

        if (!localCompleted.includes(lesson.id)) {
          localCompleted.push(lesson.id);
          writeJSON(COMPLETED_KEY, localCompleted);
        }

        state.completed = [...new Set([...state.completed, lesson.id])];

        try {
          window.LKPRewards?.setCompletedLessons?.(state.completed);
        } catch {}

        updateCompleteButton(lesson);
        renderLessonTree();
        triggerCeremony(lesson, lesson.mana || DEFAULT_MANA);
        return;
      }
    }

    state.completed.push(lesson.id);
    saveCompleted();

    const mana = lesson.mana || DEFAULT_MANA;

    if (window.LKPRewards?.completeLesson) {
      try {
        window.LKPRewards.completeLesson(lesson.id, { mana });
      } catch {}
    } else {
      setMana(getMana() + mana);
    }

    updateCompleteButton(lesson);
    renderLessonTree();
    triggerCeremony(lesson, mana);

    window.dispatchEvent(new CustomEvent('lkp:lesson-completed', {
      detail: {
        lessonId: lesson.id,
        lesson,
        manaAdded: mana
      }
    }));
  }

  function showToast(message) {
    let toast = document.getElementById('lessonToast');

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lessonToast';
      toast.className = 'cv-lesson-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(showToast._timer);

    showToast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3000);
  }

  function triggerCeremony(lesson, mana) {
    showToast(`Lesson complete · +${mana} Mana earned`);

    const burst = document.createElement('div');
    burst.className = 'cv-completion-burst';
    burst.style.setProperty('--burst-color', getCultureColor(lesson.cultureTheme));
    burst.innerHTML = `
      <div class="cv-completion-burst__core">+${mana}</div>
      ${Array.from({ length: 18 }, (_, index) => `<span style="--i:${index}"></span>`).join('')}
    `;

    document.body.appendChild(burst);

    setTimeout(() => {
      burst.remove();
    }, 1700);
  }

  function setLessonMode(mode) {
    state.mode = mode === 'keiki' ? 'keiki' : 'scholar';
    localStorage.setItem(MODE_KEY, state.mode);

    if (state.activeLessonId) {
      renderLesson(state.activeLessonId, { noScroll: true });
    }
  }

  function adjustFont(direction) {
    state.fontScale = Math.max(
      0.86,
      Math.min(1.32, state.fontScale + (direction === '+' ? 0.08 : -0.08))
    );

    localStorage.setItem(FONT_SCALE_KEY, String(state.fontScale));
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));
  }

  function closeSidebarOnMobile() {
    if (window.matchMedia('(max-width:980px)').matches) {
      document.getElementById('cvSidebar')?.classList.remove('is-open');
    }
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const cultureFilter = event.target.closest('[data-culture-filter]');

      if (cultureFilter) {
        state.activeCulture = cultureFilter.dataset.cultureFilter || 'all';

        $all('[data-culture-filter]').forEach(btn => {
          btn.classList.toggle('is-active', btn.dataset.cultureFilter === state.activeCulture);
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
      if (navBtn && navBtn.dataset.navLesson) {
        renderLesson(navBtn.dataset.navLesson);
        return;
      }

      const relatedBtn = event.target.closest('[data-related-lesson]');
      if (relatedBtn) {
        renderLesson(relatedBtn.dataset.relatedLesson);
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
        document.body.classList.toggle('is-reading-mode');
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

      if (event.key === 'Escape') {
        document.body.classList.remove('is-reading-mode');
      }
    });
  }

  function initNavAndProgress() {
    const toggle = document.getElementById('lkpMobileToggle');
    const navLinks = document.getElementById('lkpNavLinks');

    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    const fab = document.getElementById('cvSidebarFab');
    const sidebar = document.getElementById('cvSidebar');

    if (fab && sidebar) {
      fab.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });

      document.addEventListener('click', event => {
        if (!sidebar.classList.contains('is-open')) return;
        if (!sidebar.contains(event.target) && event.target !== fab) {
          sidebar.classList.remove('is-open');
        }
      });
    }

    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Date().getFullYear();

    const fill = document.getElementById('progressFill');

    window.addEventListener('scroll', () => {
      if (!fill) return;

      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      fill.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }, {
      passive: true
    });
  }

  function hydrateFromCloudSync() {
    if (!window.LKPProfileSync) return;

    const completed = window.LKPProfileSync.getLocalCompleted?.();

    if (Array.isArray(completed)) {
      state.completed = completed;
      writeJSON(COMPLETED_KEY, completed);
    }

    const reflections = window.LKPProfileSync.getLocalReflections?.();

    if (reflections && typeof reflections === 'object') {
      state.reflections = reflections;
      writeJSON(REFLECTIONS_KEY, reflections);
    }

    renderLessonTree();

    if (state.activeLessonId) {
      updateCompleteButton(findLesson(state.activeLessonId));
    }
  }

  function build(data) {
    state.data = data;
    state.cultures = normalizeData(data);
    state.lessons = flattenLessons(state.cultures);

    syncCompletedFromRewards();
    ensureSidebarTools();

    console.info(
      '[LKP Lessons v7 Cloud Sync] Loaded:',
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
    initNavAndProgress();

    window.addEventListener('lkp:profile-sync-ready', function () {
      hydrateFromCloudSync();

      if (state.activeLessonId) {
        renderLesson(state.activeLessonId, { noScroll: true });
      }
    });

    window.addEventListener('lkp:cloud-progress-updated', function () {
      hydrateFromCloudSync();

      if (state.activeLessonId) {
        updateCompleteButton(findLesson(state.activeLessonId));
      }
    });

    hydrateFromCloudSync();

    window.dispatchEvent(new Event('lkp:tree-built'));
  }

  function waitForDataAndBuild() {
    let attempts = 0;
    const maxAttempts = 8;
    const retryMs = 250;

    window.addEventListener('lkp:data-ready', function onReady(event) {
      window.removeEventListener('lkp:data-ready', onReady);

      const data = event?.detail?.data || getData();

      if (data && !state.data) {
        build(data);
      }
    });

    (function attempt() {
      const data = getData();

      if (data) {
        build(data);
        return;
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        console.warn('[LKP Lessons] No data after', maxAttempts * retryMs, 'ms.');
        build({ cultures: [] });
        return;
      }

      setTimeout(attempt, retryMs);
    })();
  }

  document.addEventListener('DOMContentLoaded', waitForDataAndBuild);
})();