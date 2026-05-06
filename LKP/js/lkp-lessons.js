/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — DEEP LESSONS  v4
   File: LKP/js/lkp-lessons.js

   IMAGE SYSTEM
   ─ LESSON_IMAGE_REGISTRY: real photos where we have them (own assets +
     verified Wikimedia Commons), placeholder: true for everything else
   ─ makeCulturalPlaceholderSVG(): generates a beautiful, culturally-
     themed inline SVG card — looks DESIGNED not broken — and tells you
     exactly which file to create (e.g. LKP/assets/images/km-kumulipo.jpg)
   ─ updateHeroImage(): tries real URL → verifies it loads → gracefully
     falls back to placeholder; Three.js overlay is VERY subtle (opacity
     0.08–0.14 max) so photos read clearly

   EDUCATOR LESSON STRUCTURE (top → bottom)
   ─ Lesson breadcrumb path
   ─ Title + mana chip
   ─ Excerpt / hook paragraph
   ─ Learning Objectives block ("After this lesson you will…")
   ─ Meta chips (num · read time · module · mode)
   ─ Action bar (Complete · Scholar/Keiki · A−/A+ · Focus)
   ─ Body content (all custom tags: callout, facts, twocol, compare,
     concepts, quote, reflect, term, timeline, activity, teacher-note,
     historian-note)
   ─ Key concepts strip (auto-extracted from <term> and <concepts> tags)
   ─ Reflection prompts (auto-saved per lesson)
   ─ Sources & Further Study
   ─ Prev / Next navigation
   ─ Related Lessons
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Constants ──────────────────────────────────────────────────────── */
  const COMPLETED_KEY   = 'cv_completed';
  const MANA_KEY        = 'cv_mana';
  const REFLECTIONS_KEY = 'lkp_lesson_reflections_v1';
  const MODE_KEY        = 'lkp_lesson_mode_v1';
  const FONT_SCALE_KEY  = 'lkp_lesson_font_scale_v1';
  const DEFAULT_MANA    = 10;

  /* ══════════════════════════════════════════════════════════════════════
     LESSON IMAGE REGISTRY
     ────────────────────────────────────────────────────────────────────
     url       → real image to display (own asset or verified Wikimedia)
     pos       → CSS background-position
     credit    → attribution shown in bottom-right badge
     placeholder: true → no real image yet; use SVG placeholder
     filename  → the file YOU need to create in LKP/assets/images/
  ══════════════════════════════════════════════════════════════════════ */

  const LESSON_IMAGE_REGISTRY = {

    /* ── Kānaka Maoli ──────────────────────────────────────────────────
       Hawaiian aesthetic: ocean, stars, land, kalo, navigational arts   */

    'km-starcompass': {
      url:    'LKP/assets/images/hawaiian-star-compass.jpg',
      pos:    'center center',
      credit: "Nainoa Thompson's Hawaiian Star Compass"
    },
    'km-hokuleaa': {
      url:    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Hokule%27a_and_Hikianalia_in_Kaneohe_Bay.jpg/1280px-Hokule%27a_and_Hikianalia_in_Kaneohe_Bay.jpg',
      pos:    'center 55%',
      credit: "Hōkūleʻa — Polynesian Voyaging Society / Wikimedia Commons"
    },
    'km-loikalo': {
      url:    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hanalei_Valley_taro_fields.jpg/1280px-Hanalei_Valley_taro_fields.jpg',
      pos:    'center 50%',
      credit: "Hanalei Valley Loʻi Kalo — Wikimedia Commons"
    },
    'km-ahupuaa': {
      url:    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nuuanu_Valley_from_Pali_Lookout.jpg/1280px-Nuuanu_Valley_from_Pali_Lookout.jpg',
      pos:    'center 45%',
      credit: "Nuʻuanu Valley — Wikimedia Commons"
    },

    /* These lessons need custom cultural artwork — see filename hint */
    'km-kumulipo': {
      placeholder: true,
      filename: 'LKP/assets/images/km-kumulipo.png',
      hint: 'Deep night sky over ocean — stars, darkness, first light emerging'
    },
    'km-wakea': {
      placeholder: true,
      filename: 'LKP/assets/images/km-wakea.png',
      hint: 'Sky meeting ocean horizon — Wākea (sky) and Papahānaumoku (earth)'
    },
    'km-olelo': {
      placeholder: true,
      filename: 'LKP/assets/images/km-olelo.png',
      hint: 'Hawaiian kapa cloth patterns or traditional writing/chant imagery'
    },
    'km-hula': {
      placeholder: true,
      filename: 'LKP/assets/images/km-hula.png',
      hint: 'Hula dancers in traditional kapa — flowing, grounded movement'
    },
    'km-laau': {
      placeholder: true,
      filename: 'km-laau.png',
      hint: 'Hawaiian medicinal plants — ʻolena (turmeric), noni, kalo leaves'
    },

    /* ── Kemet ─────────────────────────────────────────────────────────
       Kemetic aesthetic: warm ochre/gold, papyrus, hieroglyphs, stone    */

    'ke-medicine': {
      url:    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Edwin_Smith_Papyrus_v2.jpg/800px-Edwin_Smith_Papyrus_v2.jpg',
      pos:    'center center',
      credit: "Edwin Smith Surgical Papyrus — Wikimedia Commons"
    },
    'ke-medunetjer': {
      url:    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Hieroglyphen_im_Alten_%C3%84gypten.jpg/1280px-Hieroglyphen_im_Alten_%C3%84gypten.jpg',
      pos:    'center center',
      credit: "Egyptian Hieroglyphs — Wikimedia Commons"
    },
    'ke-maat-politics': {
      url:    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Great_Sphinx_of_Giza_-_20080716a.jpg/1280px-Great_Sphinx_of_Giza_-_20080716a.jpg',
      pos:    'center 55%',
      credit: "Great Sphinx of Giza — Wikimedia Commons"
    },

    'ke-nun': {
      placeholder: true,
      filename: 'ke-nun.png',
      hint: 'Primordial waters — deep, still, dark water reflecting ancient sky'
    },
    'ke-ennead': {
      placeholder: true,
      filename: 'ke-ennead.png',
      hint: 'Temple at Heliopolis / Karnak — columns, stone, morning light'
    },
    'ke-ptah': {
      placeholder: true,
      filename: 'ke-ptah.png',
      hint: 'Ptah deity — blue-skinned, staff, cartouche, mummiform figure'
    },
    'ke-maat': {
      placeholder: true,
      filename: 'ke-maat.png',
      hint: 'Balance scales, feather of Maʻat, Hall of Two Truths imagery'
    },

    /* ── Bridge ────────────────────────────────────────────────────────
       Bridge aesthetic: two cultures meeting — ocean + desert, stars + light */

    'br-darkness': {
      placeholder: true,
      filename: 'br-darkness.jpg',
      hint: 'Milky Way over ocean — Pō (Hawaiian darkness) / Nun (Kemetic source)'
    },
    'br-aloha-maat': {
      placeholder: true,
      filename: 'br-alohamaat.png',
      hint: 'Two hands, two cultural symbols meeting — lei + ankh, green + gold'
    }
  };

  /* Culture-level fallbacks (also placeholder-based) */
  const CULTURE_FALLBACKS = {
    kanaka:    { placeholder: true, filename: 'kanaka-culture.jpg', hint: 'Hawaiian ocean and stars at night — Nā Hōkū Nā Kiu' },
    kemet:     { placeholder: true, filename: 'kemet-culture.jpg',  hint: 'Egyptian pyramid at dawn — gold and shadow' },
    bridge:    { placeholder: true, filename: 'bridge-culture.jpg', hint: 'Two coastlines meeting — Pacific and Nile' },
    dreamtime: { placeholder: true, filename: 'dreamtime-culture.jpg', hint: 'Australian desert stars — Uluru at dusk' },
    default:   { placeholder: true, filename: 'default-culture.jpg', hint: 'Milky Way arch over ocean' }
  };

  /* ══════════════════════════════════════════════════════════════════════
     PLACEHOLDER SVG GENERATOR
     Produces a beautiful, culturally-themed card that looks DESIGNED,
     not broken. Shows the filename so you know what to create.
  ══════════════════════════════════════════════════════════════════════ */

  function makeCulturalPlaceholderSVG(lesson, fallbackData) {
    const data = fallbackData || LESSON_IMAGE_REGISTRY[lesson.id];
    const cultureId = lesson.cultureId || 'default';
    const filename = data?.filename || `${lesson.id || 'lesson'}.jpg`;
    const title    = escapeAttr(lesson.title || 'Lesson');
    const culture  = escapeAttr(lesson.cultureName || '');
    const module_  = escapeAttr(lesson.moduleTitle || '');

    /* Color scheme per culture */
    const palettes = {
      kanaka: { bg0:'#010e08', bg1:'#061c12', bg2:'#0e2e1a', accent:'#3cb371', accent2:'#54c6ee', text:'#8fffc7' },
      kemet:  { bg0:'#0a0600', bg1:'#1a0f00', bg2:'#2a1800', accent:'#f0c96a', accent2:'#d98545', text:'#ffeab0' },
      bridge: { bg0:'#04070f', bg1:'#080f20', bg2:'#0d1630', accent:'#8fa0ff', accent2:'#54c6ee', text:'#c4ceff' },
      default:{ bg0:'#01030a', bg1:'#04070f', bg2:'#08111e', accent:'#54c6ee', accent2:'#8fa0ff', text:'#dbefff' }
    };
    const p = palettes[cultureId] || palettes.default;

    /* Cultural pattern per culture */
    const patterns = {
      kanaka: kanakaPattern(p),
      kemet:  kemetPattern(p),
      bridge: bridgePattern(p),
      default:constellationPattern(p)
    };
    const patternSVG = (patterns[cultureId] || patterns.default);

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="${p.bg0}"/>
      <stop offset="50%"  stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="280" fill="url(#bg)"/>
  ${patternSVG}
  <rect width="1200" height="280" fill="url(#vignette)"/>
  <text x="600" y="118" text-anchor="middle" font-family="Georgia,serif"
        font-size="38" font-weight="400" letter-spacing="0.02em"
        fill="${p.text}" opacity="0.94">${title}</text>
  <text x="600" y="158" text-anchor="middle" font-family="system-ui,sans-serif"
        font-size="17" font-weight="400" letter-spacing="0.08em"
        fill="${p.accent}" opacity="0.78">${culture}${module_ ? '  ·  ' + module_ : ''}</text>
  <rect x="480" y="218" width="240" height="1" fill="${p.accent}" opacity="0.28"/>
  <text x="600" y="245" text-anchor="middle" font-family="monospace"
        font-size="12" fill="rgba(255,255,255,0.35)">📸 ${filename}</text>
</svg>`);
  }

  function escapeAttr(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* Hawaiian pattern: star points + navigation lines + wave at base */
  function kanakaPattern(p) {
    const stars = Array.from({length:28}, (_,i) => {
      const x = 40 + (i * 43) % 1140, y = 20 + (i * 37) % 220;
      const r = i % 5 === 0 ? 2.5 : 1.4;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.accent}" opacity="${0.15 + (i%4)*0.07}"/>`;
    }).join('');
    const compass = `
      <line x1="600" y1="30" x2="600" y2="250" stroke="${p.accent}" stroke-width="0.6" opacity="0.10"/>
      <line x1="480" y1="140" x2="720" y2="140" stroke="${p.accent}" stroke-width="0.6" opacity="0.10"/>
      <line x1="515" y1="75" x2="685" y2="205" stroke="${p.accent}" stroke-width="0.4" opacity="0.07"/>
      <line x1="685" y1="75" x2="515" y2="205" stroke="${p.accent}" stroke-width="0.4" opacity="0.07"/>
      <circle cx="600" cy="140" r="70" fill="none" stroke="${p.accent}" stroke-width="0.7" opacity="0.12"/>
      <circle cx="600" cy="140" r="110" fill="none" stroke="${p.accent2}" stroke-width="0.5" opacity="0.07"/>`;
    const waves = Array.from({length:4}, (_,i) => {
      const y = 232 + i*12;
      return `<path d="M0,${y} Q150,${y-7} 300,${y} Q450,${y+7} 600,${y} Q750,${y-7} 900,${y} Q1050,${y+7} 1200,${y}" fill="none" stroke="${p.accent2}" stroke-width="0.7" opacity="${0.08-i*0.015}"/>`;
    }).join('');
    return stars + compass + waves;
  }

  /* Kemetic pattern: pyramid silhouette + papyrus lines + geometric eye */
  function kemetPattern(p) {
    const pyramid = `<polygon points="600,50 400,240 800,240" fill="none" stroke="${p.accent}" stroke-width="1.0" opacity="0.13"/>
      <polygon points="600,90 460,240 740,240" fill="${p.accent}" opacity="0.035"/>`;
    const lines = Array.from({length:8}, (_,i) => {
      const y = 55 + i * 25;
      return `<line x1="100" y1="${y}" x2="480" y2="${y}" stroke="${p.accent}" stroke-width="0.5" opacity="0.07"/>
              <line x1="720" y1="${y}" x2="1100" y2="${y}" stroke="${p.accent}" stroke-width="0.5" opacity="0.07"/>`;
    }).join('');
    const eye = `
      <ellipse cx="600" cy="135" rx="40" ry="18" fill="none" stroke="${p.accent}" stroke-width="0.8" opacity="0.14"/>
      <circle cx="600" cy="135" r="9" fill="none" stroke="${p.accent}" stroke-width="0.8" opacity="0.14"/>
      <line x1="560" y1="135" x2="520" y2="125" stroke="${p.accent}" stroke-width="0.6" opacity="0.10"/>
      <line x1="640" y1="135" x2="680" y2="125" stroke="${p.accent}" stroke-width="0.6" opacity="0.10"/>`;
    return pyramid + lines + eye;
  }

  /* Bridge pattern: two culture circles + connecting arc + shared stars */
  function bridgePattern(p) {
    const left  = `<circle cx="310" cy="140" r="90" fill="none" stroke="#3cb371" stroke-width="0.8" opacity="0.14"/>`;
    const right = `<circle cx="890" cy="140" r="90" fill="none" stroke="${p.accent}" stroke-width="0.8" opacity="0.14"/>`;
    const arc   = `<path d="M310,140 Q600,40 890,140" fill="none" stroke="${p.accent}" stroke-width="0.7" opacity="0.13"/>
                   <path d="M310,140 Q600,240 890,140" fill="none" stroke="#3cb371" stroke-width="0.7" opacity="0.10"/>`;
    const stars = Array.from({length:20}, (_,i) => {
      const x = 100 + i * 52, y = 40 + (i*37)%180;
      return `<circle cx="${x}" cy="${y}" r="1.2" fill="${i%2?'#3cb371':p.accent}" opacity="${0.12+i%4*0.05}"/>`;
    }).join('');
    return left + right + arc + stars;
  }

  /* Default constellation pattern */
  function constellationPattern(p) {
    const pts = [[200,60],[380,90],[550,45],[720,80],[900,55],[1050,85],[300,180],[480,160],[650,190],[820,170],[980,195]];
    const dots = pts.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${p.accent}" opacity="0.18"/>`).join('');
    const lines = pts.slice(0,-1).map(([x,y],i) => {
      const [nx,ny] = pts[i+1];
      return `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="${p.accent}" stroke-width="0.5" opacity="0.09"/>`;
    }).join('');
    return dots + lines;
  }

  /* ── Hero image resolution ──────────────────────────────────────────── */

  function getHeroImage(lesson) {
    /* 1. Data file provides its own image */
    const raw = lesson.image || lesson.heroImage || lesson.thumbnail || '';
    if (raw && raw.length > 4) return { url: raw, pos:'center center', credit:'', placeholder:false };

    /* 2. Curated registry */
    const reg = LESSON_IMAGE_REGISTRY[lesson.id];
    if (reg) return reg;

    /* 3. Culture fallback */
    return CULTURE_FALLBACKS[lesson.cultureId] || CULTURE_FALLBACKS.default;
  }

  function updateHeroImage(lesson) {
    const hero = document.getElementById('cultureHero');
    if (!hero) return;

    const img = getHeroImage(lesson);

    if (img.placeholder) {
      _applyPlaceholder(hero, lesson, img);
      return;
    }

    /* Try loading the real image — if it breaks, fall back */
    const probe = new Image();
    probe.onload  = () => _applyRealImage(hero, img);
    probe.onerror = () => _applyPlaceholder(hero, lesson, img);
    probe.src = img.url;
    /* Show placeholder immediately while loading so the hero isn't blank */
    _applyPlaceholder(hero, lesson, img, true /* loading */);
  }

  function _applyRealImage(hero, img) {
    hero.style.backgroundImage    = `url("${img.url}")`;
    hero.style.backgroundSize     = 'cover';
    hero.style.backgroundPosition = img.pos || 'center center';
    hero.classList.add('has-lesson-image');
    hero.classList.remove('has-placeholder','is-loading');
    _setCredit(hero, img.credit || '');
  }

  function _applyPlaceholder(hero, lesson, img, isLoading) {
    const svgUrl = makeCulturalPlaceholderSVG(lesson, img);
    hero.style.backgroundImage    = `url("${svgUrl}")`;
    hero.style.backgroundSize     = 'cover';
    hero.style.backgroundPosition = 'center center';
    hero.classList.toggle('has-placeholder', !isLoading);
    hero.classList.toggle('is-loading', !!isLoading);
    hero.classList.remove('has-lesson-image');
    const notice = img.filename
      ? `📸 Add: LKP/assets/images/${img.filename}`
      : (img.hint || '');
    _setCredit(hero, notice);
  }

  function _setCredit(hero, text) {
    let badge = hero.querySelector('.cv-hero-credit');
    if (!text) { badge?.remove(); return; }
    if (!badge) { badge = document.createElement('div'); badge.className = 'cv-hero-credit'; hero.appendChild(badge); }
    badge.textContent = text;
  }

  /* ── Glossary ───────────────────────────────────────────────────────── */

  const GLOSSARY = {
    mana:     { title:'Mana',     culture:'Kānaka Maoli', body:'Spiritual power, authority, and life-force. Strengthened through right relationship and pono action.' },
    pono:     { title:'Pono',     culture:'Kānaka Maoli', body:'Balance, righteousness, and alignment with what is good, true, and life-supporting.' },
    aloha:    { title:'Aloha',    culture:'Kānaka Maoli', body:'Presence, breath, compassion, responsibility, and right relationship — more than greeting.' },
    kumulipo: { title:'Kumulipo', culture:'Kānaka Maoli', body:'A deep Hawaiian creation chant preserving relationships among darkness, life, sea, land, and cosmos.' },
    moolelo:  { title:'Moʻolelo',culture:'Kānaka Maoli', body:'Story, history, and carried memory — transmits knowledge through relationship, place, and generations.' },
    wa:       { title:'Wā',       culture:'Kānaka Maoli', body:'Time and space as relational and genealogical, not only mechanical.' },
    maat:     { title:'Maʻat',   culture:'Kemet',        body:'Truth, balance, justice, and the ethical structure that sustains life and cosmos.' },
    nun:      { title:'Nun',      culture:'Kemet',        body:'The primordial waters — undifferentiated source from which creation emerges.' },
    duat:     { title:'Duat',     culture:'Kemet',        body:'The cosmic realm of transformation, judgment, renewal, and the journey of the soul.' },
    isfet:    { title:'Isfet',    culture:'Kemet',        body:'Disorder, imbalance, and falsehood — the opposite of Maʻat.' }
  };

  /* ── Default reflections ────────────────────────────────────────────── */

  const DEFAULT_REFLECTIONS = [
    'What is the deepest idea this lesson is trying to preserve?',
    'How does this knowledge connect land, sea, sky, family, or community?',
    'What is one way this teaching could matter in your world today?'
  ];

  /* ── State ──────────────────────────────────────────────────────────── */

  const state = {
    data: null, cultures: [], lessons: [],
    activeCulture: 'all', activeLessonId: null,
    mode:        localStorage.getItem(MODE_KEY)        || 'scholar',
    fontScale:   Number(localStorage.getItem(FONT_SCALE_KEY) || '1') || 1,
    completed:   readJSON(COMPLETED_KEY, []),
    reflections: readJSON(REFLECTIONS_KEY, {}),
    sidebarSearch: '',
    three: { THREE: null, hero: null }
  };

  /* ── Utilities ──────────────────────────────────────────────────────── */

  function $(s)    { return document.querySelector(s); }
  function $all(s) { return Array.from(document.querySelectorAll(s)); }

  function escapeHTML(v) {
    return String(v ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function readJSON(k, fb) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  function stripHTML(v)    { return String(v||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }

  /* ── Data loading ───────────────────────────────────────────────────── */

  function getData() {
    const d = [window.CULTURALVERSE_DATA, window.LKP_DATA, window.IKEVERSE_DATA]
      .find(x => x && Array.isArray(x.cultures) && x.cultures.length > 0);
    if (d) { window.CULTURALVERSE_DATA = window.LKP_DATA = window.IKEVERSE_DATA = d; }
    return d || null;
  }

  /* ── Color helpers ──────────────────────────────────────────────────── */

  function getCultureColor(theme) {
    return { emerald:'#3cb371', kanaka:'#3cb371', gold:'#f0c96a', kemet:'#f0c96a',
             bridge:'#8fa0ff', rust:'#d98545', amber:'#e4ad48', saffron:'#ffb347',
             cyan:'#54c6ee', violet:'#8fa0ff', default:'#54c6ee' }[theme] || '#54c6ee';
  }

  function getCultureSecondary(theme) {
    return { emerald:'#54c6ee', kanaka:'#54c6ee', gold:'#d98545', kemet:'#d98545',
             bridge:'#54c6ee', rust:'#f0c96a', default:'#8fa0ff' }[theme] || '#8fa0ff';
  }

  /* ── Completion helpers ─────────────────────────────────────────────── */

  function isCompleted(id) {
    if (!id) return false;
    if (window.LKPRewards?.isCompleted) try { return Boolean(window.LKPRewards.isCompleted(id)); } catch {}
    return state.completed.includes(id);
  }

  function syncCompletedFromRewards() {
    if (!window.LKPRewards) return;
    try {
      const c = window.LKPRewards.getCompletedLessons?.();
      if (Array.isArray(c)) { state.completed = c; writeJSON(COMPLETED_KEY, c); }
      window.LKPRewards.setCompletedLessons?.(state.completed);
    } catch {}
  }

  function saveCompleted() {
    state.completed = [...new Set(state.completed.filter(Boolean))];
    writeJSON(COMPLETED_KEY, state.completed);
    try { window.LKPRewards?.setCompletedLessons?.(state.completed); } catch {}
  }

  function getMana()  { return Number(localStorage.getItem(MANA_KEY) || '0') || 0; }
  function setMana(v) { localStorage.setItem(MANA_KEY, String(Math.max(0, Number(v) || 0))); }

  /* ── Data normalization ─────────────────────────────────────────────── */

  function normalizeSources(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(s => typeof s === 'string'
      ? { label: s, url: '', note: '' }
      : { label: s.label||s.title||s.name||'', url: s.url||s.href||'', note: s.note||s.desc||'' }
    ).filter(s => s.label);
  }

  function normalizeKidVersion(lesson) {
    const kid = lesson.kidVersion || lesson.keikiVersion || lesson.kid || lesson.keiki || null;
    if (!kid || typeof kid !== 'object') return null;
    return {
      summary:    kid.summary    || kid.intro     || '',
      bigIdeas:   Array.isArray(kid.bigIdeas)   ? kid.bigIdeas   : [],
      vocabulary: Array.isArray(kid.vocabulary) ? kid.vocabulary : [],
      activity:   kid.activity   || '',
      reflection: Array.isArray(kid.reflection) ? kid.reflection : []
    };
  }

  function guessSceneType(lesson, culture) {
    const t = [lesson.id, lesson.title, culture.id].join(' ').toLowerCase();
    if (t.includes('star') || t.includes('wayfinding') || t.includes('hokule')) return 'starcompass';
    if (t.includes('kumulipo') || t.includes('creation') || t.includes('wakea')) return 'creation';
    if (t.includes('aloha') || t.includes('maat')) return 'balance';
    if (t.includes('nun') || t.includes('water')) return 'primordial';
    if (t.includes('medicine') || t.includes('laau')) return 'healing';
    if (culture.id === 'kemet') return 'pyramid';
    if (culture.id === 'bridge') return 'bridge';
    return 'constellation';
  }

  function normalizeData(data) {
    return (Array.isArray(data?.cultures) ? data.cultures : []).map(culture => ({
      id: culture.id||'', name: culture.name||'Untitled', emoji: culture.emoji||'✶',
      tagline: culture.tagline||'', theme: culture.theme||'default',
      status: culture.status||'live', intro: culture.intro||'',
      modules: Array.isArray(culture.modules) ? culture.modules.map(module => ({
        id: module.id||'', title: module.title||'Module',
        emoji: module.emoji||culture.emoji||'✶', desc: module.desc||'',
        lessons: Array.isArray(module.lessons) ? module.lessons.map(lesson => ({
          id: lesson.id||'', num: lesson.num||'', title: lesson.title||'Lesson',
          readTime: lesson.readTime||'', content: lesson.content||'',
          excerpt: lesson.excerpt||lesson.leadText||'',
          objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
          mana: Number(lesson.mana||DEFAULT_MANA), xp: Number(lesson.xp||25),
          image: lesson.image||lesson.heroImage||lesson.thumbnail||'',
          sources: normalizeSources(lesson.sources||lesson.references||[]),
          related: Array.isArray(lesson.related) ? lesson.related : [],
          kidVersion: normalizeKidVersion(lesson),
          cultureId: culture.id||'', cultureName: culture.name||'',
          cultureEmoji: culture.emoji||'✶', cultureTheme: culture.theme||'default',
          moduleId: module.id||'', moduleTitle: module.title||'', moduleEmoji: module.emoji||culture.emoji||'✶',
          sceneType: lesson.sceneType || guessSceneType(lesson, culture)
        })) : []
      })) : []
    }));
  }

  function flattenLessons(cultures) {
    const ls = [];
    cultures.forEach(c => c.modules.forEach(m => m.lessons.forEach(l =>
      ls.push({ ...l, contentText: stripHTML(l.content || '') })
    )));
    return ls;
  }

  /* ── Sidebar search ─────────────────────────────────────────────────── */

  function ensureSidebarTools() {
    const hdr = $('.lkp-sidebar__header');
    if (!hdr || document.getElementById('lessonTreeSearch')) return;
    const t = document.createElement('div');
    t.className = 'lkp-sidebar-tools';
    t.innerHTML = `<label class="lkp-tree-search"><i class="fas fa-search"></i>
      <input id="lessonTreeSearch" type="search" placeholder="Search lessons…" autocomplete="off"/></label>`;
    hdr.appendChild(t);
  }

  /* ── Culture filters ────────────────────────────────────────────────── */

  function renderCultureFilters() {
    const holder = document.getElementById('cultureFilters');
    const welcome = document.getElementById('welcomeCultures');
    if (!holder) return;
    const live = state.cultures.filter(c => c.modules.some(m => m.lessons.length));
    holder.innerHTML = `<button class="cv-filter-btn is-active" type="button" data-culture-filter="all">All</button>` +
      state.cultures.map(c => {
        const d = c.modules.every(m => !m.lessons.length);
        return `<button class="cv-culture-filter${d?' is-disabled':''}" type="button"
          data-culture-filter="${escapeHTML(c.id)}" ${d?'disabled':''}
          style="--culture-color:${getCultureColor(c.theme)}">
          <span>${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}</button>`;
      }).join('');
    if (welcome) {
      welcome.innerHTML = live.map(c => `
        <button class="cv-culture-filter" type="button"
          data-culture-filter="${escapeHTML(c.id)}"
          style="--culture-color:${getCultureColor(c.theme)}">
          <span>${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}</button>`).join('');
    }
  }

  /* ── Lesson tree with progress bars ────────────────────────────────── */

  function getCultureProgress(culture) {
    const all  = culture.modules.flatMap(m => m.lessons);
    const done = all.filter(l => isCompleted(l.id)).length;
    return { total: all.length, done, percent: all.length ? Math.round((done/all.length)*100) : 0 };
  }

  function renderLessonTree() {
    const tree = document.getElementById('lessonTree');
    if (!tree) return;
    const q = state.sidebarSearch.trim().toLowerCase();
    const visible = state.activeCulture === 'all'
      ? state.cultures
      : state.cultures.filter(c => c.id === state.activeCulture);

    if (!state.cultures.length) {
      tree.innerHTML = `<div class="cv-tree-empty"><strong>No lesson data found.</strong>
        <span>Check that <code>LKP/js/lkp-data.js</code> loads first.</span></div>`;
      return;
    }

    tree.innerHTML = visible.map(culture => {
      const prog = getCultureProgress(culture);
      const pbar = `<div class="cv-culture-progress">
        <div class="cv-culture-progress__meta">
          <span>${prog.done}/${prog.total} complete</span>
          <span>${prog.percent}%</span>
        </div>
        <div class="cv-culture-progress__bar">
          <span style="width:${prog.percent}%;background:${getCultureColor(culture.theme)}"></span>
        </div>
      </div>`;

      const filtered = culture.modules.map(m => ({
        ...m,
        lessons: m.lessons.filter(l => !q || [l.title,l.num,culture.name,m.title,l.contentText,l.excerpt]
          .join(' ').toLowerCase().includes(q))
      })).filter(m => m.lessons.length);

      if (!filtered.length) {
        return `<section class="cv-tree-culture">
          <div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}">
            <span>${escapeHTML(culture.emoji)}</span>${escapeHTML(culture.name)}
          </div>${pbar}
          <div class="cv-tree-module"><div class="cv-tree-module__title">Coming Soon</div>
          <button class="cv-tree-lesson" type="button" disabled>
            <strong>${escapeHTML(q?'No matching lessons.':culture.tagline||'Lessons being prepared.')}</strong>
          </button></div></section>`;
      }

      return `<section class="cv-tree-culture">
        <div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}">
          <span>${escapeHTML(culture.emoji)}</span>${escapeHTML(culture.name)}
        </div>${pbar}
        ${filtered.map(m => `
          <div class="cv-tree-module">
            <div class="cv-tree-module__title">
              <span>${escapeHTML(m.emoji)}</span>${escapeHTML(m.title)}
            </div>
            ${m.lessons.map(l => {
              const done = isCompleted(l.id);
              const active = l.id === state.activeLessonId;
              return `<button class="cv-tree-lesson${active?' is-active':''}${done?' is-complete':''}"
                type="button" data-lesson-id="${escapeHTML(l.id)}">
                <strong>${done?'✓ ':''}${escapeHTML(l.num||'LESSON')} · ${escapeHTML(l.title)}</strong>
                <small>${escapeHTML(culture.name)} · ${escapeHTML(l.readTime||'Lesson')}</small>
              </button>`;
            }).join('')}
          </div>`).join('')}
      </section>`;
    }).join('') || `<div class="cv-tree-empty"><strong>No lessons found.</strong></div>`;
  }

  /* ── Find / index ───────────────────────────────────────────────────── */

  function findLesson(id)     { return state.lessons.find(l => l.id === id) || null; }
  function getLessonIndex(id) { return state.lessons.findIndex(l => l.id === id); }

  /* ══════════════════════════════════════════════════════════════════════
     EDUCATOR LESSON OBJECTIVES
     Auto-generates 3 clear learning objectives if none are in the data.
     Data files can supply: lesson.objectives = ['...','...','...']
     OR use the <objectives> content tag in lesson.content.
  ══════════════════════════════════════════════════════════════════════ */

  function inferLessonObjectives(lesson) {
    /* Check data-file supplied objectives */
    if (Array.isArray(lesson.objectives) && lesson.objectives.length) return lesson.objectives;

    /* Check for <objectives> tag in content */
    const match = (lesson.content || '').match(/<objectives>([\s\S]*?)<\/objectives>/i);
    if (match) {
      const items = match[1].split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
      if (items.length) return items;
    }

    /* Auto-generate from lesson metadata */
    const cultureName = lesson.cultureName || 'this culture';
    const moduleTitle = lesson.moduleTitle || 'this module';

    const base = [
      `Understand the historical and living context of ${lesson.title} within ${cultureName}.`,
      `Identify the core concepts, vocabulary, and practices this knowledge tradition preserves.`,
      `Reflect on how this teaching connects to living communities and contemporary relevance.`
    ];

    /* Culture-specific overrides */
    if (lesson.cultureId === 'kanaka') {
      base[1] = `Recognize key Hawaiian terms, practices, and their connections to land, ocean, and sky.`;
    } else if (lesson.cultureId === 'kemet') {
      base[1] = `Explore the philosophical, scientific, and ethical dimensions of Kemetic knowledge.`;
    } else if (lesson.cultureId === 'bridge') {
      base[1] = `Draw connections between parallel concepts across Hawaiian and Kemetic traditions.`;
      base[2] = `Consider what cross-cultural dialogue reveals about universal human knowledge systems.`;
    }

    /* Module-specific tweaks */
    if (/navigat|star|wayfind/i.test(moduleTitle)) {
      base[0] = `Understand how ${lesson.title} functioned as a living navigational system.`;
    } else if (/heal|medic|laau/i.test(moduleTitle)) {
      base[0] = `Identify the plants, methods, and philosophy behind ${lesson.title}.`;
    } else if (/cosm|creat|origin/i.test(moduleTitle)) {
      base[0] = `Analyze the cosmological worldview expressed through ${lesson.title}.`;
    }

    return base;
  }

  function renderLessonObjectives(lesson) {
    const objectives = inferLessonObjectives(lesson);
    return `
      <div class="cv-lesson-objectives">
        <div class="cv-lesson-objectives__label">
          <i class="fas fa-compass" aria-hidden="true"></i>
          Learning Objectives
        </div>
        <ul class="cv-lesson-objectives__list" role="list">
          ${objectives.map(obj => `<li>${escapeHTML(obj)}</li>`).join('')}
        </ul>
      </div>`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     EDUCATOR LESSON HEADER
     Breadcrumb path → title → excerpt → objectives → meta → actions
  ══════════════════════════════════════════════════════════════════════ */

  function renderLessonHeader(lesson) {
    const done = isCompleted(lesson.id);
    const mana = lesson.mana || DEFAULT_MANA;
    const excerpt = lesson.excerpt || lesson.leadText || '';
    const words = lesson.contentText ? lesson.contentText.split(/\s+/).length : 0;
    const readLabel = lesson.readTime || (words > 0 ? `${Math.ceil(words/200)} min read` : 'Deep Reading');

    return `
      <!-- Breadcrumb path -->
      <nav class="cv-lesson-path" aria-label="Lesson path">
        <span>${escapeHTML(lesson.cultureEmoji)}</span>
        <span>${escapeHTML(lesson.cultureName)}</span>
        <span class="cv-lesson-path__sep" aria-hidden="true">›</span>
        <span>${escapeHTML(lesson.moduleEmoji)} ${escapeHTML(lesson.moduleTitle)}</span>
        ${lesson.num ? `<span class="cv-lesson-path__sep" aria-hidden="true">›</span><span>${escapeHTML(lesson.num)}</span>` : ''}
      </nav>

      <!-- Title + mana reward -->
      <div class="cv-lesson-title-row">
        <h1 class="cv-lesson-title">${escapeHTML(lesson.title)}</h1>
        <div class="cv-lesson-reward-chip ${done?'is-complete':''}">
          ${done ? '<i class="fas fa-check-circle"></i> Complete' : `<i class="fas fa-star"></i> +${mana} Mana`}
        </div>
      </div>

      <!-- Excerpt / hook -->
      ${excerpt ? `<p class="cv-lesson-excerpt">${escapeHTML(excerpt)}</p>` : ''}

      <!-- Learning objectives -->
      ${renderLessonObjectives(lesson)}

      <!-- Meta chips -->
      <div class="cv-lesson-meta" role="list" aria-label="Lesson details">
        ${lesson.num ? `<span role="listitem"><i class="fas fa-hashtag" aria-hidden="true"></i>${escapeHTML(lesson.num)}</span>` : ''}
        <span role="listitem"><i class="fas fa-clock" aria-hidden="true"></i>${escapeHTML(readLabel)}</span>
        <span role="listitem" class="cv-lesson-meta__culture" style="color:var(--active-color)">${escapeHTML(lesson.cultureEmoji)} ${escapeHTML(lesson.cultureName)}</span>
        <span role="listitem">${state.mode === 'keiki' ? '🌺 Keiki Mode' : '📜 Scholar Mode'}</span>
      </div>

      <!-- Action bar -->
      <div class="cv-lesson-actions" role="toolbar" aria-label="Lesson controls">
        <button class="cv-action-btn cv-complete-btn ${done?'is-complete':''}"
          type="button" data-complete-active-lesson>
          ${done
            ? '<i class="fas fa-check-circle"></i> Lesson Complete'
            : `<i class="fas fa-star"></i> Complete Lesson · +${mana} Mana`}
        </button>
        <div class="cv-mode-toggle" role="group" aria-label="Lesson mode">
          <button class="cv-action-btn ${state.mode==='scholar'?'is-active':''}"
            type="button" data-lesson-mode="scholar">📜 Scholar</button>
          <button class="cv-action-btn ${state.mode==='keiki'?'is-active':''}"
            type="button" data-lesson-mode="keiki">🌺 Keiki</button>
        </div>
        <div class="cv-font-controls" role="group" aria-label="Font size">
          <button class="cv-action-btn" type="button" data-font-adjust="-" aria-label="Decrease font">A−</button>
          <button class="cv-action-btn" type="button" data-font-adjust="+" aria-label="Increase font">A+</button>
        </div>
        <button class="cv-action-btn" type="button" data-reading-mode aria-label="Toggle focus mode">
          <i class="fas fa-expand" aria-hidden="true"></i> Focus
        </button>
      </div>`;
  }

  /* ── Render lesson ──────────────────────────────────────────────────── */

  function renderLesson(id, opts = {}) {
    const lesson = findLesson(id);
    if (!lesson) { renderWelcome(); return; }

    state.activeLessonId = lesson.id;
    document.body.dataset.culture    = lesson.cultureId || 'default';
    document.body.dataset.lessonMode = state.mode;
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));

    const welcome = document.getElementById('lessonWelcome');
    const article = document.getElementById('lessonArticle');
    if (welcome) welcome.hidden = true;
    if (article) article.hidden = false;

    const header = document.getElementById('lessonHeader');
    if (header) header.innerHTML = renderLessonHeader(lesson);

    const body = document.getElementById('lessonBody');
    if (body) body.innerHTML = state.mode === 'keiki'
      ? renderKeikiContent(lesson)
      : transformLessonContent(lesson.content, lesson);

    /* Set hero image FIRST (photo or placeholder) — Three.js overlays on top */
    updateHeroImage(lesson);

    /* Hero label */
    const emoji = document.getElementById('cultureHeroEmoji');
    const name  = document.getElementById('cultureHeroName');
    if (emoji) emoji.textContent = lesson.cultureEmoji || '✦';
    if (name)  name.textContent  = `${lesson.cultureName} · ${lesson.moduleTitle}`;

    /* Three.js subtle overlay */
    updateThreeHeroScene(lesson);

    /* Remaining sections */
    renderSources(lesson);
    renderLessonNav();
    renderRelatedLessons(lesson);
    renderLessonTree();
    updateCompleteButton(lesson);
    updateUrlHash(lesson.id);
    bindReflectionTextareas(lesson);

    window.dispatchEvent(new CustomEvent('lkp:culture-changed', {
      detail: { cultureId: lesson.cultureId, color: getCultureColor(lesson.cultureTheme) }
    }));
    window.dispatchEvent(new CustomEvent('lkp:lesson-changed', { detail: { lessonId: lesson.id, lesson } }));

    if (!opts.noScroll) {
      requestAnimationFrame(() =>
        document.getElementById('lessonMain')?.scrollIntoView({ behavior:'smooth', block:'start' })
      );
    }

    closeSidebarOnMobile();
  }

  function updateCompleteButton(lesson) {
    const btn = document.querySelector('[data-complete-active-lesson]');
    if (!btn || !lesson) return;
    const done = isCompleted(lesson.id);
    btn.classList.toggle('is-complete', done);
    btn.innerHTML = done
      ? '<i class="fas fa-check-circle"></i> Lesson Complete'
      : `<i class="fas fa-star"></i> Complete Lesson · +${lesson.mana||DEFAULT_MANA} Mana`;
  }

  function renderWelcome() {
    const w = document.getElementById('lessonWelcome');
    const a = document.getElementById('lessonArticle');
    if (w) w.hidden = false;
    if (a) a.hidden = true;
    state.activeLessonId = null;
    renderLessonTree();
  }

  /* ── Lesson navigation ──────────────────────────────────────────────── */

  function renderLessonNav() {
    const nav = document.getElementById('lessonNav');
    if (!nav || !state.activeLessonId) return;
    const idx  = getLessonIndex(state.activeLessonId);
    const prev = idx > 0 ? state.lessons[idx - 1] : null;
    const next = idx >= 0 && idx < state.lessons.length - 1 ? state.lessons[idx + 1] : null;
    nav.innerHTML = `
      <button class="cv-lesson-nav-btn" type="button"
        data-nav-lesson="${prev ? escapeHTML(prev.id) : ''}" ${prev?'':'disabled'}>
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
        <span>${prev ? escapeHTML(prev.title) : 'Previous'}</span>
      </button>
      <button class="cv-lesson-nav-btn" type="button"
        data-nav-lesson="${next ? escapeHTML(next.id) : ''}" ${next?'':'disabled'}>
        <span>${next ? escapeHTML(next.title) : 'Next'}</span>
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
      </button>`;
  }

  /* ── Sources ─────────────────────────────────────────────────────────── */

  function renderSources(lesson) {
    const holder = document.getElementById('lessonSources');
    if (!holder) return;
    const sources = lesson.sources || [];
    if (!sources.length) { holder.innerHTML = ''; return; }
    holder.innerHTML = `
      <section class="cv-sources">
        <div class="cv-section-heading"><span>Sources & Further Study</span></div>
        <div class="cv-source-list">
          ${sources.map(s => `
            <a class="cv-source-card" href="${escapeHTML(s.url||'#')}" ${s.url?'target="_blank" rel="noopener"':''}>
              <strong>${escapeHTML(s.label)}</strong>
              ${s.note ? `<span>${escapeHTML(s.note)}</span>` : ''}
              <small>${s.url ? 'Open source →' : 'Reference note'}</small>
            </a>`).join('')}
        </div>
      </section>`;
  }

  /* ── Related lessons ─────────────────────────────────────────────────── */

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

    const byId = new Map(state.lessons.map(l => [l.id, l]));
    const explicit    = (lesson.related||[]).map(id => byId.get(id)).filter(Boolean);
    const sameModule  = state.lessons.filter(l => l.id !== lesson.id && l.moduleId === lesson.moduleId);
    const bridgeMatch = state.lessons.filter(l => {
      if (l.id === lesson.id) return false;
      const a = `${lesson.title} ${lesson.contentText}`.toLowerCase();
      const b = `${l.title} ${l.contentText}`.toLowerCase();
      return [['kumulipo','nun'],['aloha','maat'],['star','wayfinding'],['creation','primordial'],['medicine','healing']]
        .some(([x,y]) => (a.includes(x)&&b.includes(y)) || (a.includes(y)&&b.includes(x)));
    });

    const related = [...new Map([...explicit,...bridgeMatch,...sameModule].map(l=>[l.id,l])).values()]
      .filter(l => l.id !== lesson.id).slice(0, 3);

    if (!related.length) { holder.innerHTML = ''; return; }

    holder.innerHTML = `
      <div class="cv-section-heading"><span>Related Lessons</span></div>
      <div class="cv-related-grid">
        ${related.map(l => `
          <button class="cv-related-card" type="button" data-related-lesson="${escapeHTML(l.id)}"
            style="--related-color:${getCultureColor(l.cultureTheme)}">
            <span class="cv-related-card__emoji">${escapeHTML(l.cultureEmoji||'✦')}</span>
            <div class="cv-related-card__body">
              <strong>${escapeHTML(l.title)}</strong>
              <small>${escapeHTML(l.cultureName)} · ${escapeHTML(l.moduleTitle)}</small>
              ${l.readTime ? `<span class="cv-related-card__time">⏱ ${escapeHTML(l.readTime)}</span>` : ''}
            </div>
            ${isCompleted(l.id) ? `<span class="cv-related-card__done" title="Completed">✓</span>` : ''}
          </button>`).join('')}
      </div>`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     CONTENT TRANSFORMS
     All custom tags rendered to HTML for the lesson body.
  ══════════════════════════════════════════════════════════════════════ */

  function renderReflectionBlock(prompts, lesson, title) {
    const ex = state.reflections[lesson.id] || {};
    return `
      <section class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}">
        <div class="cv-section-heading">
          <i class="fas fa-pen-nib" aria-hidden="true"></i>
          <span>${escapeHTML(title || 'Reflection Prompts')}</span>
        </div>
        <p class="cv-reflection__intro">Take a moment. These prompts are for your own thinking — answers save automatically on this device.</p>
        <div class="cv-reflection-list">
          ${prompts.map((p, i) => `
            <label class="cv-reflection-card">
              <span class="cv-reflection-card__prompt">${escapeHTML(p)}</span>
              <textarea data-reflection-index="${i}"
                placeholder="Write your reflection here…"
                rows="3">${escapeHTML(ex[i]||'')}</textarea>
            </label>`).join('')}
        </div>
        <div class="cv-reflection-status" id="reflectionStatus">
          <i class="fas fa-lock" aria-hidden="true"></i> Saved on this device only
        </div>
      </section>`;
  }

  function transformLessonContent(content, lesson) {
    let html = String(content || '');

    /* Strip <objectives> tag (handled in header already) */
    html = html.replace(/<objectives>[\s\S]*?<\/objectives>/gi, '');

    /* ── Custom tags ─────────────────────────────────────────────────── */

    html = html.replace(/<callout(?:\s+type="([^"]+)")?>([\s\S]*?)<\/callout>/gi,
      (_, type, inner) =>
        `<div class="cv-callout${type?` cv-callout--${escapeHTML(type)}`:''}" role="note">${inner}</div>`);

    html = html.replace(/<facts>([\s\S]*?)<\/facts>/gi, (_, inner) =>
      `<div class="cv-facts">${
        inner.split('|').map(s=>s.trim()).filter(Boolean).map(item => {
          const [v,l] = item.split('::').map(s=>s?.trim()||'');
          return `<div class="cv-fact"><strong>${escapeHTML(v||item)}</strong><span>${escapeHTML(l||'')}</span></div>`;
        }).join('')
      }</div>`);

    html = html.replace(/<twocol\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/twocol>/gi,
      (_, left, right, inner) => {
        const [a,b] = inner.split('||');
        return `<div class="cv-twocol">
          <div class="cv-twocol__side"><strong>${escapeHTML(left)}</strong><p>${(a||'').trim()}</p></div>
          <div class="cv-twocol__side"><strong>${escapeHTML(right)}</strong><p>${(b||'').trim()}</p></div>
        </div>`;
      });

    html = html.replace(/<compare\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/compare>/gi,
      (_, left, right, inner) => {
        const [a,b] = inner.split('||');
        return `<div class="cv-compare">
          <div><strong class="cv-compare__label">${escapeHTML(left)}</strong><p>${(a||'').trim()}</p></div>
          <div><strong class="cv-compare__label">${escapeHTML(right)}</strong><p>${(b||'').trim()}</p></div>
        </div>`;
      });

    html = html.replace(/<concepts>([\s\S]*?)<\/concepts>/gi, (_, inner) =>
      `<div class="cv-concepts" role="list" aria-label="Key concepts">
        ${inner.split('·').map(s=>s.trim()).filter(Boolean)
          .map(s=>`<span class="cv-concept" role="listitem">${escapeHTML(s)}</span>`).join('')}
      </div>`);

    html = html.replace(/<quote(?:\s+cite="([^"]+)")?>([\s\S]*?)<\/quote>/gi,
      (_, cite, inner) =>
        `<blockquote class="cv-quote">
          <p>${inner.trim()}</p>
          ${cite ? `<cite>— ${escapeHTML(cite)}</cite>` : ''}
        </blockquote>`);

    html = html.replace(/<reflect(?:\s+title="([^"]+)")?>([\s\S]*?)<\/reflect>/gi,
      (_, title, inner) => renderReflectionBlock(
        inner.split('\n').map(s => s.trim()).filter(Boolean), lesson, title));

    html = html.replace(/<term(?:\s+key="([^"]+)")?>([\s\S]*?)<\/term>/gi,
      (_, key, inner) => {
        const label = stripHTML(inner);
        const lk  = String(key||label).toLowerCase().replace(/[^a-z0-9]/g,'');
        const def = GLOSSARY[lk] || GLOSSARY[lk.replace(/ʻ|'/g,'')];
        return `<span class="cv-term" tabindex="0" role="button"
          aria-description="${def?.body||'Key term'}"
          data-term="${escapeHTML(lk)}"
          data-term-title="${escapeHTML(def?.title||label)}"
          data-term-culture="${escapeHTML(def?.culture||lesson.cultureName||'')}"
          data-term-body="${escapeHTML(def?.body||'A key term in this lesson.')}"
        >${inner}</span>`;
      });

    html = html.replace(/<timeline>([\s\S]*?)<\/timeline>/gi, (_, inner) =>
      `<div class="cv-timeline" role="list">
        ${inner.split('\n').map(s=>s.trim()).filter(Boolean).map(item => {
          const [date,text] = item.split('::').map(s=>s?.trim()||'');
          return `<div class="cv-timeline__item" role="listitem">
            <strong class="cv-timeline__date">${escapeHTML(date)}</strong>
            <span class="cv-timeline__text">${escapeHTML(text)}</span>
          </div>`;
        }).join('')}
      </div>`);

    html = html.replace(/<activity>([\s\S]*?)<\/activity>/gi,
      (_, inner) =>
        `<div class="cv-activity" role="note">
          <strong><i class="fas fa-hand-sparkles" aria-hidden="true"></i> Learning Activity</strong>
          <p>${inner.trim()}</p>
        </div>`);

    html = html.replace(/<teacher-note>([\s\S]*?)<\/teacher-note>/gi,
      (_, inner) =>
        `<div class="cv-teacher-note" role="note">
          <strong><i class="fas fa-chalkboard-teacher" aria-hidden="true"></i> Teacher Note</strong>
          <p>${inner.trim()}</p>
        </div>`);

    html = html.replace(/<historian-note>([\s\S]*?)<\/historian-note>/gi,
      (_, inner) =>
        `<div class="cv-historian-note" role="note">
          <strong><i class="fas fa-scroll" aria-hidden="true"></i> Historian Note</strong>
          <p>${inner.trim()}</p>
        </div>`);

    /* Auto-append reflection block if none found in content */
    if (!html.includes('cv-reflection')) {
      html += renderReflectionBlock(DEFAULT_REFLECTIONS, lesson, 'Reflection Prompts');
    }

    return html;
  }

  /* ── Keiki mode ─────────────────────────────────────────────────────── */

  function renderKeikiContent(lesson) {
    const kid     = lesson.kidVersion;
    const summary = kid?.summary || stripHTML(lesson.content).split(/[.!?]/).slice(0,2).join('. ');
    const bigIdeas = kid?.bigIdeas?.length ? kid.bigIdeas
      : [`This lesson belongs to ${lesson.cultureName}.`,
         'Knowledge is carried through people, place, memory, and practice.',
         'Learning means understanding relationship, not just collecting facts.'];
    const vocab   = kid?.vocabulary?.length ? kid.vocabulary
      : Object.entries(GLOSSARY)
          .filter(([k,v]) => (lesson.contentText+lesson.title).toLowerCase().includes(k))
          .slice(0,4).map(([,v]) => ({ term:v.title, meaning:v.body }));
    const activity  = kid?.activity || 'Draw three circles: land, sky, and people. Write one way they connect.';
    const prompts   = kid?.reflection?.length ? kid.reflection
      : ['What is one thing you learned?',
         'What would you tell a younger cousin about this lesson?',
         'What is one question you still have?'];

    return `
      <div class="cv-keiki-panel">
        <div class="cv-keiki-badge">🌺 Keiki Mode</div>
        <h3>The Big Story</h3>
        <p>${escapeHTML(summary)}</p>
      </div>
      <div class="cv-keiki-panel">
        <h3>Big Ideas</h3>
        <div class="cv-keiki-ideas">
          ${bigIdeas.map(i => `<div class="cv-keiki-idea">${escapeHTML(i)}</div>`).join('')}
        </div>
      </div>
      ${vocab.length ? `
      <div class="cv-keiki-panel">
        <h3>Words to Know</h3>
        <div class="cv-keiki-vocab">
          ${vocab.map(v => `
            <div><strong>${escapeHTML(v.term||'')}</strong>
            <span>${escapeHTML(v.meaning||v.body||v.definition||'')}</span></div>`).join('')}
        </div>
      </div>` : ''}
      <div class="cv-keiki-panel">
        <h3>Try This</h3>
        <p>${escapeHTML(activity)}</p>
      </div>
      ${renderReflectionBlock(prompts, lesson, 'Keiki Reflection')}`;
  }

  /* ── Reflection auto-save ───────────────────────────────────────────── */

  function bindReflectionTextareas(lesson) {
    $all('[data-reflection-index]').forEach(ta => {
      ta.addEventListener('input', () => {
        const r = state.reflections[lesson.id] || {};
        r[ta.dataset.reflectionIndex] = ta.value;
        state.reflections[lesson.id] = r;
        writeJSON(REFLECTIONS_KEY, state.reflections);
        const s = document.getElementById('reflectionStatus');
        if (s) {
          s.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Saved';
          clearTimeout(bindReflectionTextareas._t);
          bindReflectionTextareas._t = setTimeout(() => {
            s.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> Saved on this device only';
          }, 1500);
        }
      });
    });
  }

  /* ── URL hash routing ───────────────────────────────────────────────── */

  function updateUrlHash(id) {
    if (!id) return;
    const next = '#' + encodeURIComponent(id);
    if (window.location.hash !== next) history.replaceState(null, '', next);
  }

  function openLessonFromHash(opts = {}) {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!hash) return false;
    const lesson = findLesson(hash);
    if (!lesson) return false;
    state.activeCulture = 'all';
    renderLesson(lesson.id, opts);
    return true;
  }

  /* ── Complete lesson + ceremony ─────────────────────────────────────── */

  function completeActiveLesson() {
    const lesson = findLesson(state.activeLessonId);
    if (!lesson) return;
    if (isCompleted(lesson.id)) { showToast('This lesson is already complete. Nānā i ke kumu — look to the source.'); return; }

    state.completed.push(lesson.id);
    saveCompleted();
    let mana = lesson.mana || DEFAULT_MANA;

    if (window.LKPRewards?.completeLesson) {
      try { window.LKPRewards.completeLesson(lesson.id, { mana }); } catch {}
    } else {
      setMana(getMana() + mana);
    }

    updateCompleteButton(lesson);
    renderLessonTree();
    triggerCompletionCeremony(lesson, mana);
    window.dispatchEvent(new CustomEvent('lkp:lesson-completed', { detail:{ lessonId:lesson.id, lesson, manaAdded:mana } }));
  }

  function showToast(msg) {
    let t = document.getElementById('lessonToast');
    if (!t) { t = document.createElement('div'); t.id='lessonToast'; t.className='cv-lesson-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('is-visible'), 3000);
  }

  function triggerCompletionCeremony(lesson, mana) {
    showToast(`Lesson complete · +${mana} Mana earned`);
    const burst = document.createElement('div');
    burst.className = 'cv-completion-burst';
    burst.style.setProperty('--burst-color', getCultureColor(lesson.cultureTheme));
    burst.innerHTML = `<div class="cv-completion-burst__core">+${mana}</div>` +
      Array.from({length:18}, (_,i) => `<span style="--i:${i}"></span>`).join('');
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1700);
    window.dispatchEvent(new CustomEvent('lkp:completion-ceremony', { detail:{ lesson, manaAdded:mana } }));
  }

  /* ── Controls ───────────────────────────────────────────────────────── */

  function setLessonMode(mode) {
    state.mode = mode === 'keiki' ? 'keiki' : 'scholar';
    localStorage.setItem(MODE_KEY, state.mode);
    if (state.activeLessonId) renderLesson(state.activeLessonId, { noScroll:true });
  }

  function adjustFont(dir) {
    state.fontScale = Math.max(0.86, Math.min(1.32, state.fontScale + (dir==='+' ? 0.08 : -0.08)));
    localStorage.setItem(FONT_SCALE_KEY, String(state.fontScale));
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));
  }

  function closeSidebarOnMobile() {
    if (window.matchMedia('(max-width:980px)').matches)
      document.getElementById('cvSidebar')?.classList.remove('is-open');
  }

  /* ── Event binding ──────────────────────────────────────────────────── */

  function bindEvents() {
    document.addEventListener('click', e => {
      const cf = e.target.closest('[data-culture-filter]');
      if (cf) {
        state.activeCulture = cf.dataset.cultureFilter || 'all';
        $all('[data-culture-filter]').forEach(b => b.classList.toggle('is-active', b.dataset.cultureFilter === state.activeCulture));
        renderLessonTree(); return;
      }
      const lb = e.target.closest('[data-lesson-id]');
      if (lb) { renderLesson(lb.dataset.lessonId); return; }
      const nb = e.target.closest('[data-nav-lesson]');
      if (nb && nb.dataset.navLesson) { renderLesson(nb.dataset.navLesson); return; }
      const rl = e.target.closest('[data-related-lesson]');
      if (rl) { renderLesson(rl.dataset.relatedLesson); return; }
      if (e.target.closest('[data-complete-active-lesson]')) { completeActiveLesson(); return; }
      const mb = e.target.closest('[data-lesson-mode]');
      if (mb) { setLessonMode(mb.dataset.lessonMode); return; }
      const fb = e.target.closest('[data-font-adjust]');
      if (fb) { adjustFont(fb.dataset.fontAdjust); return; }
      if (e.target.closest('[data-reading-mode]')) { document.body.classList.toggle('is-reading-mode'); }
    });

    document.addEventListener('input', e => {
      if (e.target.matches('#lessonTreeSearch')) {
        state.sidebarSearch = e.target.value;
        renderLessonTree();
        window.dispatchEvent(new Event('lkp:tree-built'));
      }
    });

    window.addEventListener('hashchange', () => openLessonFromHash({ noScroll:true }));

    document.addEventListener('keydown', e => {
      if (!state.activeLessonId) return;
      const idx = getLessonIndex(state.activeLessonId);
      if (e.key === 'ArrowLeft' && idx > 0)  renderLesson(state.lessons[idx-1].id);
      if (e.key === 'ArrowRight' && idx < state.lessons.length-1) renderLesson(state.lessons[idx+1].id);
      if (e.key === 'Escape') document.body.classList.remove('is-reading-mode');
    });
  }

  /* ── Three.js hero OVERLAY — very subtle on top of real photo ────────── */

  async function loadTHREE() {
    if (state.three.THREE) return state.three.THREE;
    try { state.three.THREE = await import('https://esm.sh/three@0.160.0'); } catch {}
    return state.three.THREE;
  }

  async function initThreeHero() {
    const canvas = document.getElementById('cv-culture-hero-canvas');
    const wrap   = document.getElementById('cultureHero');
    if (!canvas || !wrap) return;
    const THREE = await loadTHREE();
    if (!THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 120);
    camera.position.set(0, 0, 14);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const group = new THREE.Group();
    scene.add(group);
    state.three.hero = { scene, camera, renderer, group, wrap };

    function resize() {
      const w = Math.max(280, wrap.clientWidth||760);
      const h = Math.max(120, wrap.clientHeight||160);
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(wrap);
    else window.addEventListener('resize', resize, { passive:true });

    (function animate() {
      requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      group.rotation.y += 0.0012;
      group.children.forEach((c,i) => { c.rotation.z += 0.0005 + i*0.0001; c.position.y += Math.sin(t+i)*0.0004; });
      renderer.render(scene, camera);
    })();
  }

  function makeGlow(THREE, color, size, opacity) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const col = new THREE.Color(color);
    const r = Math.round(col.r*255), g = Math.round(col.g*255), b = Math.round(col.b*255);
    const grd = ctx.createRadialGradient(64,64,0,64,64,64);
    grd.addColorStop(0,    `rgba(${r},${g},${b},0.85)`);
    grd.addColorStop(0.5,  `rgba(${r},${g},${b},0.18)`);
    grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd; ctx.fillRect(0,0,128,128);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, opacity, depthWrite:false, blending:THREE.AdditiveBlending }));
    spr.scale.setScalar(size); return spr;
  }

  function clearGroup(group) {
    while (group.children.length) {
      const o = group.children.pop();
      o.geometry?.dispose?.();
      if (Array.isArray(o.material)) o.material.forEach(m=>m.dispose?.());
      else o.material?.dispose?.();
    }
  }

  /* Overlay opacity is intentionally very low (0.08–0.14) so photos show through clearly */
  function updateThreeHeroScene(lesson) {
    const hero  = state.three.hero;
    const THREE = state.three.THREE;
    if (!hero || !THREE || !lesson) return;
    clearGroup(hero.group);

    const c1   = new THREE.Color(getCultureColor(lesson.cultureTheme));
    const c2   = new THREE.Color(getCultureSecondary(lesson.cultureTheme));
    const type = lesson.sceneType || 'constellation';

    /* Very subtle ambient glows — they should NOT dominate the real photo */
    hero.group.add(makeGlow(THREE, c1.getStyle(), 10, 0.10));
    hero.group.add(makeGlow(THREE, c2.getStyle(),  7, 0.06));

    const lineMat = c => new THREE.LineBasicMaterial({ color:c, transparent:true, opacity:0.14, depthWrite:false });
    const meshMat = c => new THREE.MeshPhysicalMaterial({ color:c, emissive:c, emissiveIntensity:0.5, transparent:true, opacity:0.40 });

    if (type === 'starcompass') {
      /* Rotating compass ring + 16 small directional stars */
      hero.group.add(new THREE.Mesh(new THREE.TorusGeometry(4,0.03,10,120), new THREE.MeshBasicMaterial({ color:c1, transparent:true, opacity:0.28 })));
      for (let i=0; i<16; i++) {
        const a = (i/16)*Math.PI*2;
        const s = new THREE.Mesh(new THREE.OctahedronGeometry(i%4===0?0.16:0.09,0), meshMat(i%2?c2:c1));
        s.position.set(Math.cos(a)*4, Math.sin(a)*4, 0);
        hero.group.add(s);
      }
    } else if (type === 'creation') {
      /* Pō/Ao axis — very light */
      hero.group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,5,8), new THREE.MeshBasicMaterial({ color:c1, transparent:true, opacity:0.32 })));
      { const _ao=new THREE.Mesh(new THREE.OctahedronGeometry(0.34,0), meshMat(new THREE.Color(0xffe7a5))); _ao.position.set(0,2,0); hero.group.add(_ao); }
      { const _po=new THREE.Mesh(new THREE.SphereGeometry(0.38,16,16), meshMat(c1)); _po.position.set(0,-1.5,0); hero.group.add(_po); }
      for (let i=0;i<5;i++) { const rg=new THREE.Mesh(new THREE.TorusGeometry(1.1+i*0.45,0.009,6,80), new THREE.MeshBasicMaterial({ color:i%2?c2:c1, transparent:true, opacity:0.08+i*0.012, depthWrite:false })); rg.rotation.x=Math.PI/2+i*0.10; rg.scale.set(1.28,0.62,1); hero.group.add(rg); }
    } else if (type === 'pyramid') {
      const pyr = new THREE.Mesh(new THREE.ConeGeometry(2.4,3.8,4), new THREE.MeshPhysicalMaterial({ color:c1, emissive:c1, emissiveIntensity:0.18, wireframe:true, transparent:true, opacity:0.30 }));
      pyr.rotation.y = Math.PI/4; hero.group.add(pyr);
      { const _sun=new THREE.Mesh(new THREE.SphereGeometry(0.38,16,16), meshMat(c2)); _sun.position.set(0,2.8,0); hero.group.add(_sun); }
    } else if (type === 'balance') {
      hero.group.add(new THREE.Mesh(new THREE.BoxGeometry(6,0.05,0.05), new THREE.MeshBasicMaterial({ color:c1, transparent:true, opacity:0.30 })));
      [-2.2,2.2].forEach(x => { const bw=new THREE.Mesh(new THREE.TorusGeometry(0.65,0.025,8,48), new THREE.MeshBasicMaterial({ color:c2, transparent:true, opacity:0.28 })); bw.position.set(x,-0.7,0); hero.group.add(bw); });
    } else if (type === 'healing') {
      hero.group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,4,8), new THREE.MeshBasicMaterial({ color:c1, transparent:true, opacity:0.30 })));
      for (let i=0;i<6;i++) { const lf=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,12), meshMat(i%2?c2:c1)); lf.scale.set(1.7,0.42,0.11); lf.position.set(i%2?0.40:-0.40,-1.4+i*0.45,0); lf.rotation.z=i%2?-0.55:0.55; hero.group.add(lf); }
    } else if (type === 'bridge') {
      const sl=new THREE.Mesh(new THREE.SphereGeometry(0.38,16,16),meshMat(c1)); sl.position.set(-2.2,0,0); hero.group.add(sl);
      const sr=new THREE.Mesh(new THREE.SphereGeometry(0.38,16,16),meshMat(c2)); sr.position.set(2.2,0,0); hero.group.add(sr);
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-2.2,0,0),new THREE.Vector3(0,1.2,0),new THREE.Vector3(2.2,0,0)]);
      hero.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(56)), lineMat(c1.clone().lerp(c2,0.5))));
    } else {
      /* Constellation — a few stars and lines */
      const pts = [];
      for (let i=0;i<8;i++) {
        const p = new THREE.Vector3((Math.random()-0.5)*6,(Math.random()-0.5)*2.5,(Math.random()-0.5)*1);
        pts.push(p);
        const s=new THREE.Mesh(new THREE.OctahedronGeometry(i%3===0?0.16:0.10,0), meshMat(i%2?c2:c1));
        s.position.copy(p); hero.group.add(s);
        if (i>0) hero.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pts[i-1],p]), lineMat(c1)));
      }
    }

    hero.group.scale.setScalar(1.10);
  }

  /* ── Nav / FAB / progress ───────────────────────────────────────────── */

  function initNavAndProgress() {
    const toggle   = document.getElementById('lkpMobileToggle');
    const navLinks = document.getElementById('lkpNavLinks');
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    const fab     = document.getElementById('cvSidebarFab');
    const sidebar = document.getElementById('cvSidebar');
    if (fab && sidebar) {
      fab.addEventListener('click', () => sidebar.classList.toggle('is-open'));
      document.addEventListener('click', ev => {
        if (!sidebar.classList.contains('is-open')) return;
        if (!sidebar.contains(ev.target) && ev.target !== fab) sidebar.classList.remove('is-open');
      });
    }
    const yr = document.getElementById('footerYear');
    if (yr) yr.textContent = new Date().getFullYear();
    const fill = document.getElementById('progressFill');
    window.addEventListener('scroll', () => {
      if (!fill) return;
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      fill.style.width = `${max > 0 ? (window.scrollY/max)*100 : 0}%`;
    }, { passive:true });
  }

  /* ── Build ──────────────────────────────────────────────────────────── */

  function build(data) {
    state.data     = data;
    state.cultures = normalizeData(data);
    state.lessons  = flattenLessons(state.cultures);

    syncCompletedFromRewards();
    ensureSidebarTools();

    console.info('[LKP Lessons] Loaded:', state.cultures.length, 'cultures,', state.lessons.length, 'lessons');

    renderCultureFilters();
    renderLessonTree();

    const opened = openLessonFromHash({ noScroll:true });
    if (!opened && state.lessons.length) renderLesson(state.lessons[0].id, { noScroll:true });

    bindEvents();
    initNavAndProgress();

    initThreeHero().then(() => {
      if (state.activeLessonId) updateThreeHeroScene(findLesson(state.activeLessonId));
    });

    window.dispatchEvent(new Event('lkp:tree-built'));
  }

  function waitForDataAndBuild() {
    let attempts = 0;
    const MAX = 8, MS = 250;
    window.addEventListener('lkp:data-ready', function onReady(ev) {
      window.removeEventListener('lkp:data-ready', onReady);
      const d = ev?.detail?.data || getData();
      if (d && !state.data) build(d);
    });
    (function attempt() {
      const d = getData();
      if (d) { build(d); return; }
      if (++attempts >= MAX) { console.warn('[LKP Lessons] No data after', MAX*MS, 'ms.'); build({ cultures:[] }); return; }
      setTimeout(attempt, MS);
    })();
  }

  document.addEventListener('DOMContentLoaded', waitForDataAndBuild);
})();