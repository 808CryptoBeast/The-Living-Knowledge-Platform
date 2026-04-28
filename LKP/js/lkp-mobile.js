/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Mobile Experience
   lkp-mobile.js | Data-driven from lkp-data.js / CULTURALVERSE_DATA

   Purpose:
   - Mobile-only DOM/CSS/SVG experience. No Three.js required.
   - Reads CULTURALVERSE_DATA.cultures when lkp-data.js is loaded first.
   - Every culture added to lkp-data.js becomes another mobile galaxy/orbit/card.
   - Keeps the Hawaiian star compass alive on mobile as the portal centerpiece.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────────────
     PATHS + DATA
  ──────────────────────────────────────────────────────────────────────── */
  const BASE = document.baseURI.replace(/[^/]*$/, '');
  const IMG  = BASE + 'LKP/assets/images/';

  const DATA =
    (typeof CULTURALVERSE_DATA !== 'undefined' && CULTURALVERSE_DATA && Array.isArray(CULTURALVERSE_DATA.cultures))
      ? CULTURALVERSE_DATA
      : (window.CULTURALVERSE_DATA && Array.isArray(window.CULTURALVERSE_DATA.cultures))
        ? window.CULTURALVERSE_DATA
        : { cultures: [] };

  const THEME = {
    emerald: {
      color: '#3cb371',
      colorDim: 'rgba(60,179,113,0.12)',
      colorBorder: 'rgba(60,179,113,0.30)',
      glow: 'rgba(60,179,113,0.28)'
    },
    gold: {
      color: '#f0c96a',
      colorDim: 'rgba(240,201,106,0.12)',
      colorBorder: 'rgba(240,201,106,0.34)',
      glow: 'rgba(240,201,106,0.30)'
    },
    bridge: {
      color: '#8fa0ff',
      colorDim: 'rgba(143,160,255,0.13)',
      colorBorder: 'rgba(143,160,255,0.34)',
      glow: 'rgba(143,160,255,0.30)'
    },
    rust: {
      color: '#d98545',
      colorDim: 'rgba(217,133,69,0.12)',
      colorBorder: 'rgba(217,133,69,0.32)',
      glow: 'rgba(217,133,69,0.28)'
    },
    amber: {
      color: '#e4ad48',
      colorDim: 'rgba(228,173,72,0.12)',
      colorBorder: 'rgba(228,173,72,0.32)',
      glow: 'rgba(228,173,72,0.28)'
    },
    saffron: {
      color: '#ffb347',
      colorDim: 'rgba(255,179,71,0.12)',
      colorBorder: 'rgba(255,179,71,0.32)',
      glow: 'rgba(255,179,71,0.28)'
    },
    default: {
      color: '#54c6ee',
      colorDim: 'rgba(84,198,238,0.12)',
      colorBorder: 'rgba(84,198,238,0.30)',
      glow: 'rgba(84,198,238,0.28)'
    }
  };

  const KNOWN_CONNECTIONS = [
    ['km-kumulipo', 'km-wakea', 0.85],
    ['km-starcompass', 'km-hokuleaa', 0.95],
    ['km-ahupuaa', 'km-loikalo', 0.88],
    ['km-olelo', 'km-hula', 0.74],
    ['km-loikalo', 'km-laau', 0.68],
    ['ke-nun', 'ke-ennead', 0.90],
    ['ke-ennead', 'ke-ptah', 0.72],
    ['ke-maat', 'ke-maat-politics', 0.86],
    ['ke-medunetjer', 'ke-medicine', 0.70],
    ['km-kumulipo', 'bridge-darkness', 0.70],
    ['ke-nun', 'bridge-darkness', 0.70],
    ['km-kumulipo', 'bridge-pairs', 0.60],
    ['ke-ennead', 'bridge-pairs', 0.60],
    ['km-kumulipo', 'bridge-aloha-maat', 0.52],
    ['ke-maat', 'bridge-aloha-maat', 0.82]
  ];

  const FALLBACK_CULTURES = [
    {
      id: 'kanaka',
      name: 'Kānaka Maoli',
      emoji: '🌺',
      tagline: 'Hawaiian Indigenous Knowledge',
      theme: 'emerald',
      status: 'live',
      intro: 'Hawaiian cosmology, wayfinding, land stewardship, language, and healing traditions.',
      modules: []
    },
    {
      id: 'kemet',
      name: 'Kemet',
      emoji: '☥',
      tagline: 'Ancient Egyptian Wisdom',
      theme: 'gold',
      status: 'live',
      intro: 'Kemetic cosmology, Maʻat, sacred arts, science, and medicine.',
      modules: []
    },
    {
      id: 'bridge',
      name: 'The Bridge',
      emoji: '🌐',
      tagline: 'Cross-Cultural Connections',
      theme: 'bridge',
      status: 'live',
      intro: 'Shared cosmological and ethical patterns across living knowledge systems.',
      modules: []
    }
  ];

  const RAW_CULTURES = DATA.cultures.length ? DATA.cultures : FALLBACK_CULTURES;

  function stripTags(html) {
    return String(html || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function shortTitle(title) {
    return String(title || '')
      .replace(/\s+—\s+.*$/, '')
      .replace(/\s+-\s+.*$/, '')
      .trim();
  }

  function cultureImage(id) {
    const map = {
      kanaka: 'kanaka.png',
      kemet: 'kemet.png',
      bridge: 'bridge.png',
      dreamtime: 'dreamtime.png',
      dogon: 'dogon.png',
      vedic: 'vedic.png'
    };

    return IMG + (map[id] || `${id}.png`);
  }

  function normalizeCulture(culture, index) {
    const theme = THEME[culture.theme] || THEME.default;
    const modules = Array.isArray(culture.modules) ? culture.modules : [];

    const concepts = modules.flatMap((module, moduleIndex) => {
      const lessons = Array.isArray(module.lessons) ? module.lessons : [];

      return lessons.map((lesson, lessonIndex) => {
        const body = stripTags(lesson.content || module.desc || culture.intro || '');
        const globalIndex = moduleIndex * 10 + lessonIndex;

        return {
          id: lesson.id,
          label: shortTitle(lesson.title || lesson.id),
          title: lesson.title || lesson.id,
          num: lesson.num || '',
          readTime: lesson.readTime || '',
          lessonId: lesson.id,
          moduleId: module.id,
          moduleTitle: module.title || 'Knowledge Module',
          moduleEmoji: module.emoji || culture.emoji || '✦',
          desc: body.slice(0, 180) + (body.length > 180 ? '…' : ''),
          major: lessonIndex === 0 || globalIndex < 2,
          status: culture.status || 'live'
        };
      });
    });

    return {
      id: culture.id || `culture-${index}`,
      name: culture.name || `Culture ${index + 1}`,
      emoji: culture.emoji || '✦',
      tagline: culture.tagline || 'Living knowledge system',
      intro: culture.intro || '',
      theme: culture.theme || 'default',
      status: culture.status || 'live',
      modules,
      moduleCount: modules.length,
      lessonCount: concepts.length,
      color: theme.color,
      colorDim: theme.colorDim,
      colorBorder: theme.colorBorder,
      glow: theme.glow,
      image: cultureImage(culture.id || `culture-${index}`),
      concepts
    };
  }

  const CULTURES = RAW_CULTURES.map(normalizeCulture);
  const GALAXIES = CULTURES.filter(c => c.id !== 'bridge');
  const BRIDGE = CULTURES.find(c => c.id === 'bridge') || null;
  const LIVE_CULTURES = CULTURES.filter(c => c.status === 'live');

  const CONCEPTS = new Map();
  CULTURES.forEach(culture => {
    culture.concepts.forEach(concept => {
      CONCEPTS.set(concept.id, {
        ...concept,
        cultureId: culture.id,
        cultureName: culture.name,
        cultureEmoji: culture.emoji,
        color: culture.color,
        colorDim: culture.colorDim,
        colorBorder: culture.colorBorder,
        glow: culture.glow
      });
    });
  });

  /* ────────────────────────────────────────────────────────────────────────
     STATE
  ──────────────────────────────────────────────────────────────────────── */
  let activeTab = 'home';
  let activeGalaxy = 0;
  let sheetOpen = false;
  let sheetData = null;

  /* ────────────────────────────────────────────────────────────────────────
     BOOT
  ──────────────────────────────────────────────────────────────────────── */
  function boot() {
    injectMobileCSS();
    buildShell();
    buildStarfield();
    buildHome();
    buildGalaxiesPanel();
    buildBridgePanel();
    buildChartPanel();
    buildEcosystemPanel();
    buildBottomSheet();
    buildBottomNav();
    switchTab('home');
    initSwipe();
  }

  function injectMobileCSS() {
    if (document.querySelector('link[data-lkp-mobile-css="true"]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'LKP/css/lkp-mobile.css';
    link.dataset.lkpMobileCss = 'true';
    document.head.appendChild(link);
  }

  function buildShell() {
    document.body.innerHTML = `
      <div id="lkp-m-app" class="lkp-m-app">
        <div id="lkp-m-starfield" class="lkp-m-starfield" aria-hidden="true"></div>
        <div id="lkp-m-panels" class="lkp-m-panels">
          <section id="lkp-m-home"      class="lkp-m-panel" data-panel="home"></section>
          <section id="lkp-m-galaxies"  class="lkp-m-panel" data-panel="galaxies"></section>
          <section id="lkp-m-bridge"    class="lkp-m-panel" data-panel="bridge"></section>
          <section id="lkp-m-chart"     class="lkp-m-panel" data-panel="chart"></section>
          <section id="lkp-m-ecosystem" class="lkp-m-panel" data-panel="ecosystem"></section>
        </div>
        <div id="lkp-m-sheet" class="lkp-m-sheet" role="dialog" aria-modal="true" aria-hidden="true"></div>
        <div id="lkp-m-sheet-bg" class="lkp-m-sheet-bg" aria-hidden="true"></div>
        <nav id="lkp-m-nav" class="lkp-m-nav" aria-label="Mobile platform navigation"></nav>
      </div>`;
  }

  function buildStarfield() {
    const el = document.getElementById('lkp-m-starfield');
    const count = 84;
    const colors = ['#9ed8ff', '#ffffff', '#ffe8d0', '#b48cff', '#ffd0aa', '#54c6ee'];
    let out = '<div class="lkp-m-nebula lkp-m-nebula--one"></div><div class="lkp-m-nebula lkp-m-nebula--two"></div>';

    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const s = 1 + Math.random() * 2.8;
      const dur = 2.8 + Math.random() * 5.5;
      const del = Math.random() * 6;
      const col = colors[Math.floor(Math.random() * colors.length)];

      out += `<span class="lkp-m-star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:${col};animation-duration:${dur}s;animation-delay:${del}s"></span>`;
    }

    el.innerHTML = out;
  }

  /* ────────────────────────────────────────────────────────────────────────
     DATA-DRIVEN HOME HELPERS
  ──────────────────────────────────────────────────────────────────────── */
  function getOrbitCultures() {
    return CULTURES;
  }

  function openCultureFromButton(btn) {
    const tab = btn.dataset.tab;
    const galaxyIndex = btn.dataset.galaxy;

    if (galaxyIndex !== undefined && galaxyIndex !== '') {
      activeGalaxy = Math.max(0, Math.min(GALAXIES.length - 1, parseInt(galaxyIndex, 10)));
    }

    switchTab(tab || 'home');
  }

  function bindTabButtons(scope) {
    scope.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => openCultureFromButton(btn));
    });
  }

  function buildHomePills() {
    return getOrbitCultures().map((culture, index) => {
      const isBridge = culture.id === 'bridge';
      const galaxyIndex = GALAXIES.findIndex(g => g.id === culture.id);
      const tab = isBridge ? 'bridge' : 'galaxies';

      return `
        <button class="lkp-m-pill lkp-m-pill--dynamic"
                style="--pill-color:${culture.color};--pill-bg:${culture.colorDim};--pill-border:${culture.colorBorder}"
                data-tab="${tab}"
                ${!isBridge && galaxyIndex >= 0 ? `data-galaxy="${galaxyIndex}"` : ''}>
          <span>${culture.emoji}</span> ${escapeHTML(culture.name)}
        </button>`;
    }).join('');
  }

  function buildCompassOrbitNodes() {
    const entries = getOrbitCultures();
    const total = Math.max(1, entries.length);

    const nodes = entries.map((culture, index) => {
      const angle = -90 + (360 / total) * index;
      const isBridge = culture.id === 'bridge';
      const galaxyIndex = GALAXIES.findIndex(g => g.id === culture.id);
      const tab = isBridge ? 'bridge' : 'galaxies';
      const disabled = culture.status !== 'live' && !culture.concepts.length;

      return `
        <button class="lkp-m-orbit-node ${disabled ? 'is-soon' : ''}"
                style="--orbit-color:${culture.color};--orbit-bg:${culture.colorDim};--orbit-angle:${angle}deg;--orbit-delay:${(-index * 0.65).toFixed(2)}s"
                data-tab="${tab}"
                ${!isBridge && galaxyIndex >= 0 ? `data-galaxy="${galaxyIndex}"` : ''}
                aria-label="Open ${escapeHTML(culture.name)}">
          <span class="lkp-m-orbit-node__halo"></span>
          <img src="${culture.image}" class="lkp-m-orbit-node__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
          <span class="lkp-m-orbit-node__emoji" style="display:none">${culture.emoji}</span>
        </button>`;
    }).join('');

    const sparks = Array.from({ length: 18 }, (_, i) => {
      const angle = Math.round((360 / 18) * i);
      const delay = (-i * 0.37).toFixed(2);
      return `<span class="lkp-m-orbit-spark" style="--spark-angle:${angle}deg;--spark-delay:${delay}s"></span>`;
    }).join('');

    return `${nodes}${sparks}`;
  }

  function buildHomeQuickButtons() {
    const buttons = getOrbitCultures().map((culture) => {
      const isBridge = culture.id === 'bridge';
      const galaxyIndex = GALAXIES.findIndex(g => g.id === culture.id);
      const tab = isBridge ? 'bridge' : 'galaxies';
      const count = culture.lessonCount;
      const label = culture.status === 'live'
        ? `${count} ${count === 1 ? 'lesson' : 'lessons'}`
        : 'Coming soon';

      return `
        <button class="lkp-m-quick-btn lkp-m-quick-btn--dynamic"
                style="--quick-color:${culture.color};--quick-bg:${culture.colorDim};--quick-border:${culture.colorBorder}"
                data-tab="${tab}" ${!isBridge && galaxyIndex >= 0 ? `data-galaxy="${galaxyIndex}"` : ''}>
          <img src="${culture.image}" class="lkp-m-quick-btn__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
          <span class="lkp-m-quick-btn__glyph" style="display:none">${culture.emoji}</span>
          <span class="lkp-m-quick-btn__label">${escapeHTML(culture.name)}</span>
          <span class="lkp-m-quick-btn__sub">${escapeHTML(label)}</span>
        </button>`;
    }).join('');

    return `${buttons}
      <button class="lkp-m-quick-btn lkp-m-quick-btn--dynamic lkp-m-quick-btn--chart"
              style="--quick-color:var(--m-cyan);--quick-bg:rgba(84,198,238,0.10);--quick-border:rgba(84,198,238,0.26)"
              data-tab="chart">
        <span class="lkp-m-quick-btn__glyph">✦</span>
        <span class="lkp-m-quick-btn__label">Star Chart</span>
        <span class="lkp-m-quick-btn__sub">Constellation map</span>
      </button>`;
  }

  function buildHome() {
    const el = document.getElementById('lkp-m-home');
    const liveCount = LIVE_CULTURES.length;
    const totalCount = CULTURES.length;

    el.innerHTML = `
      <div class="lkp-m-home">
        <div class="lkp-m-home__brand">
          <div class="lkp-m-home__glyph">◈</div>
          <h1 class="lkp-m-home__title">Living<br><em>Knowledge</em></h1>
          <p class="lkp-m-home__sub">
            Navigate the stars of ancestral wisdom. ${liveCount} live ${liveCount === 1 ? 'galaxy' : 'galaxies'}, ${totalCount} total culture orbits.
            Add another culture to <strong>lkp-data.js</strong> and it becomes another galaxy.
          </p>
        </div>

        <div class="lkp-m-home__pills">
          ${buildHomePills()}
        </div>

        <div class="lkp-m-compass-portal" aria-label="Living Hawaiian star compass gateway">
          <div class="lkp-m-compass-aura lkp-m-compass-aura--gold"></div>
          <div class="lkp-m-compass-aura lkp-m-compass-aura--cyan"></div>
          <div class="lkp-m-compass-ring lkp-m-compass-ring--outer"></div>
          <div class="lkp-m-compass-ring lkp-m-compass-ring--inner"></div>

          <div class="lkp-m-home__compass" aria-hidden="true">
            <img src="${IMG}hawaiian-star-compass.jpg"
                 class="lkp-m-compass-img"
                 alt=""
                 onerror="this.onerror=null;this.src='${IMG}hawaiian-star-compass.png';">
          </div>

          <div class="lkp-m-orbit" aria-label="Culture orbit selector">
            ${buildCompassOrbitNodes()}
          </div>

          <div class="lkp-m-compass-caption">
            <span>Ka Pā Nānā Hōkū</span>
            <small>Tap a culture orbit</small>
          </div>
        </div>

        <div class="lkp-m-home__quick">
          ${buildHomeQuickButtons()}
        </div>

        <a href="lessons.html" class="lkp-m-begin-btn">
          <span>📖</span> Begin Learning
        </a>
      </div>`;

    bindTabButtons(el);
  }

  /* ────────────────────────────────────────────────────────────────────────
     GALAXY PANEL
  ──────────────────────────────────────────────────────────────────────── */
  function buildGalaxiesPanel() {
    const el = document.getElementById('lkp-m-galaxies');

    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Living Galaxies</span>
        <h2>Choose a Culture</h2>
        <p>Every culture in <strong>lkp-data.js</strong> becomes a mobile galaxy card. Live cultures show lessons; coming-soon cultures hold the orbit for future expansion.</p>
      </div>

      <div id="lkp-m-galaxy-scroll" class="lkp-m-galaxy-scroll">
        ${GALAXIES.map((culture, index) => buildGalaxyCard(culture, index)).join('')}
      </div>

      <div class="lkp-m-dots" aria-hidden="true">
        ${GALAXIES.map((_, i) => `<span class="lkp-m-dot ${i === activeGalaxy ? 'is-active' : ''}"></span>`).join('')}
      </div>`;

    el.querySelectorAll('.lkp-m-concept-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const culture = CULTURES.find(c => c.id === btn.dataset.culture);
        const concept = CONCEPTS.get(btn.dataset.concept);
        if (culture && concept) openConceptSheet(culture, concept);
      });
    });
  }

  function buildGalaxyCard(culture, index) {
    const isSoon = culture.status !== 'live' || !culture.concepts.length;
    const conceptButtons = culture.concepts.length
      ? culture.concepts.map(concept => `
          <button class="lkp-m-concept-btn ${concept.major ? 'is-major' : ''}"
                  style="--concept-color:${culture.color};--concept-bg:${culture.colorDim};--concept-border:${culture.colorBorder}"
                  data-culture="${culture.id}"
                  data-concept="${concept.id}">
            <span>${concept.moduleEmoji || culture.emoji}</span>
            <strong>${escapeHTML(concept.label)}</strong>
            <small>${escapeHTML(concept.moduleTitle || concept.readTime || '')}</small>
          </button>`).join('')
      : `<div class="lkp-m-soon-card">
          <span>${culture.emoji}</span>
          <strong>Coming Soon</strong>
          <p>${escapeHTML(culture.tagline || culture.intro || 'This culture orbit is ready for future lessons.')}</p>
        </div>`;

    return `
      <article class="lkp-m-galaxy-card ${isSoon ? 'is-soon' : ''}"
               data-galaxy-card="${index}"
               style="--galaxy-color:${culture.color};--galaxy-bg:${culture.colorDim};--galaxy-border:${culture.colorBorder};--galaxy-glow:${culture.glow}">
        <div class="lkp-m-galaxy-card__top">
          <div class="lkp-m-galaxy-card__icon">
            <img src="${culture.image}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
            <span style="display:none">${culture.emoji}</span>
          </div>
          <div>
            <span class="lkp-m-status ${culture.status === 'live' ? 'is-live' : 'is-soon'}">${culture.status === 'live' ? 'Live' : 'Coming Soon'}</span>
            <h3>${escapeHTML(culture.name)}</h3>
            <p>${escapeHTML(culture.tagline || '')}</p>
          </div>
        </div>

        <div class="lkp-m-galaxy-card__intro">${escapeHTML(culture.intro || '')}</div>

        <div class="lkp-m-galaxy-card__stats">
          <span><strong>${culture.moduleCount}</strong> modules</span>
          <span><strong>${culture.lessonCount}</strong> lessons</span>
          <span><strong>${culture.theme}</strong> theme</span>
        </div>

        <div class="lkp-m-concept-grid">
          ${conceptButtons}
        </div>
      </article>`;
  }

  function updateDotsFromScroll() {
    const scroller = document.getElementById('lkp-m-galaxy-scroll');
    if (!scroller) return;

    const cards = [...scroller.querySelectorAll('[data-galaxy-card]')];
    if (!cards.length) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    activeGalaxy = best;
    document.querySelectorAll('.lkp-m-dot').forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeGalaxy);
    });
  }

  /* ────────────────────────────────────────────────────────────────────────
     BRIDGE PANEL
  ──────────────────────────────────────────────────────────────────────── */
  function buildBridgePanel() {
    const el = document.getElementById('lkp-m-bridge');
    const bridge = BRIDGE;

    if (!bridge) {
      el.innerHTML = `
        <div class="lkp-m-section-head">
          <span class="lkp-m-eyebrow">Bridge</span>
          <h2>No Bridge Data Yet</h2>
          <p>Add a culture with <code>id: 'bridge'</code> to lkp-data.js.</p>
        </div>`;
      return;
    }

    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">${bridge.emoji} ${escapeHTML(bridge.tagline || 'Cross-Cultural Connections')}</span>
        <h2>${escapeHTML(bridge.name)}</h2>
        <p>${escapeHTML(bridge.intro || '')}</p>
      </div>

      <div class="lkp-m-bridge-grid">
        ${bridge.concepts.length
          ? bridge.concepts.map(concept => `
            <button class="lkp-m-bridge-card"
                    style="--bridge-color:${bridge.color};--bridge-bg:${bridge.colorDim};--bridge-border:${bridge.colorBorder}"
                    data-culture="${bridge.id}"
                    data-concept="${concept.id}">
              <span>${concept.moduleEmoji || bridge.emoji}</span>
              <strong>${escapeHTML(concept.title)}</strong>
              <small>${escapeHTML(concept.readTime || concept.moduleTitle || '')}</small>
              <p>${escapeHTML(concept.desc || '')}</p>
            </button>`).join('')
          : `<div class="lkp-m-soon-card"><span>${bridge.emoji}</span><strong>Bridge lessons coming soon</strong></div>`}
      </div>`;

    el.querySelectorAll('[data-concept]').forEach(btn => {
      btn.addEventListener('click', () => {
        const concept = CONCEPTS.get(btn.dataset.concept);
        if (concept) openConceptSheet(bridge, concept);
      });
    });
  }

  /* ────────────────────────────────────────────────────────────────────────
     CHART PANEL
  ──────────────────────────────────────────────────────────────────────── */
  function buildChartPanel() {
    const el = document.getElementById('lkp-m-chart');
    const chartConcepts = [...CONCEPTS.values()].filter(c => !c.id.endsWith('-soon'));
    const positioned = getChartPositions(chartConcepts);
    const positionsById = new Map(positioned.map(item => [item.id, item]));
    const dynamicConnections = buildDynamicConnections(chartConcepts);
    const connections = [...KNOWN_CONNECTIONS, ...dynamicConnections]
      .filter(([a, b]) => positionsById.has(a) && positionsById.has(b));

    const lines = connections.map(([a, b, strength]) => {
      const p1 = positionsById.get(a);
      const p2 = positionsById.get(b);
      const op = 0.18 + Math.min(0.45, Number(strength || 0.5) * 0.35);
      return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="rgba(240,201,106,${op})" stroke-width="${1 + Number(strength || 0.5)}" />`;
    }).join('');

    const nodes = positioned.map(p => `
      <button class="lkp-m-chart-node ${p.major ? 'is-major' : ''}"
              style="left:${p.x}px;top:${p.y}px;--node-color:${p.color};--node-bg:${p.colorDim};--node-border:${p.colorBorder}"
              data-culture="${p.cultureId}"
              data-concept="${p.id}">
        <span>${p.moduleEmoji || p.cultureEmoji || '✦'}</span>
        <strong>${escapeHTML(p.label)}</strong>
      </button>`).join('');

    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Constellation Map</span>
        <h2>Living Star Chart</h2>
        <p>Swipe around the chart. Tap any star to open its lesson. New lessons in lkp-data.js appear here automatically.</p>
      </div>

      <div class="lkp-m-chart-wrap">
        <div class="lkp-m-chart-canvas" style="width:980px;height:760px">
          <svg class="lkp-m-chart-lines" width="980" height="760" viewBox="0 0 980 760" aria-hidden="true">
            ${lines}
          </svg>
          ${nodes}
        </div>
      </div>`;

    el.querySelectorAll('.lkp-m-chart-node').forEach(btn => {
      btn.addEventListener('click', () => {
        const culture = CULTURES.find(c => c.id === btn.dataset.culture);
        const concept = CONCEPTS.get(btn.dataset.concept);
        if (culture && concept) openConceptSheet(culture, concept);
      });
    });
  }

  function getChartPositions(concepts) {
    const cultures = CULTURES.filter(c => c.concepts.length);
    const centerX = 490;
    const centerY = 380;
    const cultureRadius = 250;
    const positioned = [];

    cultures.forEach((culture, cultureIndex) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * cultureIndex) / Math.max(1, cultures.length);
      const cx = centerX + Math.cos(angle) * cultureRadius;
      const cy = centerY + Math.sin(angle) * cultureRadius;
      const localConcepts = concepts.filter(c => c.cultureId === culture.id);
      const localRadius = Math.min(128, 62 + localConcepts.length * 7);

      localConcepts.forEach((concept, index) => {
        const nodeAngle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(1, localConcepts.length);
        const ring = concept.major ? localRadius * 0.48 : localRadius;

        positioned.push({
          ...concept,
          x: Math.round(cx + Math.cos(nodeAngle) * ring),
          y: Math.round(cy + Math.sin(nodeAngle) * ring)
        });
      });
    });

    return positioned;
  }

  function buildDynamicConnections(concepts) {
    const out = [];
    const byCulture = new Map();

    concepts.forEach(c => {
      if (!byCulture.has(c.cultureId)) byCulture.set(c.cultureId, []);
      byCulture.get(c.cultureId).push(c);
    });

    byCulture.forEach(items => {
      for (let i = 0; i < items.length - 1; i++) {
        out.push([items[i].id, items[i + 1].id, 0.42]);
      }
    });

    return out;
  }

  /* ────────────────────────────────────────────────────────────────────────
     ECOSYSTEM PANEL
  ──────────────────────────────────────────────────────────────────────── */
  function buildEcosystemPanel() {
    const el = document.getElementById('lkp-m-ecosystem');
    const totalModules = CULTURES.reduce((sum, c) => sum + c.moduleCount, 0);
    const totalLessons = CULTURES.reduce((sum, c) => sum + c.lessonCount, 0);

    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Ikeverse Ecosystem</span>
        <h2>Culture Registry</h2>
        <p>This view is generated from your data file. More cultures become more orbits, cards, and chart nodes.</p>
      </div>

      <div class="lkp-m-eco-stats">
        <div><strong>${CULTURES.length}</strong><span>Cultures</span></div>
        <div><strong>${totalModules}</strong><span>Modules</span></div>
        <div><strong>${totalLessons}</strong><span>Lessons</span></div>
      </div>

      <div class="lkp-m-eco-list">
        ${CULTURES.map(culture => `
          <article class="lkp-m-eco-card" style="--eco-color:${culture.color};--eco-bg:${culture.colorDim};--eco-border:${culture.colorBorder}">
            <div class="lkp-m-eco-card__icon">${culture.emoji}</div>
            <div>
              <span class="lkp-m-status ${culture.status === 'live' ? 'is-live' : 'is-soon'}">${culture.status === 'live' ? 'Live' : 'Coming Soon'}</span>
              <h3>${escapeHTML(culture.name)}</h3>
              <p>${escapeHTML(culture.tagline || '')}</p>
              <small>${culture.moduleCount} modules · ${culture.lessonCount} lessons · theme: ${escapeHTML(culture.theme)}</small>
            </div>
          </article>`).join('')}
      </div>`;
  }

  /* ────────────────────────────────────────────────────────────────────────
     BOTTOM SHEET
  ──────────────────────────────────────────────────────────────────────── */
  function buildBottomSheet() {
    const bg = document.getElementById('lkp-m-sheet-bg');
    bg.addEventListener('click', closeSheet);
  }

  function openConceptSheet(culture, concept) {
    sheetOpen = true;
    sheetData = { culture, concept };

    const sheet = document.getElementById('lkp-m-sheet');
    const bg = document.getElementById('lkp-m-sheet-bg');
    const isSoon = culture.status !== 'live' || !concept.lessonId;

    sheet.innerHTML = `
      <div class="lkp-m-sheet__handle"></div>
      <button class="lkp-m-sheet__close" type="button" aria-label="Close">×</button>

      <div class="lkp-m-sheet__kicker" style="color:${culture.color}">${culture.emoji} ${escapeHTML(culture.name)}</div>
      <h3>${escapeHTML(concept.title || concept.label)}</h3>
      <p class="lkp-m-sheet__meta">
        ${escapeHTML(concept.num || '')}
        ${concept.readTime ? `<span>·</span>${escapeHTML(concept.readTime)}` : ''}
        ${concept.moduleTitle ? `<span>·</span>${escapeHTML(concept.moduleTitle)}` : ''}
      </p>
      <p class="lkp-m-sheet__body">${escapeHTML(concept.desc || culture.intro || '')}</p>

      <div class="lkp-m-sheet__actions">
        ${isSoon
          ? `<button class="lkp-m-sheet__cta is-disabled" type="button">Coming Soon</button>`
          : `<a class="lkp-m-sheet__cta" href="lessons.html#${encodeURIComponent(concept.lessonId)}">Open Lesson →</a>`}
      </div>`;

    sheet.querySelector('.lkp-m-sheet__close').addEventListener('click', closeSheet);

    sheet.classList.add('is-open');
    bg.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
  }

  function closeSheet() {
    sheetOpen = false;
    sheetData = null;

    const sheet = document.getElementById('lkp-m-sheet');
    const bg = document.getElementById('lkp-m-sheet-bg');

    sheet.classList.remove('is-open');
    bg.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
  }

  /* ────────────────────────────────────────────────────────────────────────
     NAV + TABS
  ──────────────────────────────────────────────────────────────────────── */
  function buildBottomNav() {
    const nav = document.getElementById('lkp-m-nav');

    const items = [
      { id: 'home', label: 'Home', icon: '◈' },
      { id: 'galaxies', label: 'Galaxies', icon: '✦' },
      { id: 'bridge', label: 'Bridge', icon: '🌐' },
      { id: 'chart', label: 'Chart', icon: '✧' },
      { id: 'ecosystem', label: 'Data', icon: '☷' }
    ];

    nav.innerHTML = items.map(item => `
      <button class="lkp-m-nav__btn" data-tab="${item.id}" aria-label="${item.label}">
        <span class="lkp-m-nav__icon">${item.icon}</span>
        <span class="lkp-m-nav__label">${item.label}</span>
      </button>`).join('');

    bindTabButtons(nav);
  }

  function switchTab(tab) {
    activeTab = tab;
    closeSheet();

    document.querySelectorAll('.lkp-m-panel').forEach(panel => {
      panel.classList.toggle('is-active', panel.dataset.panel === tab);
    });

    document.querySelectorAll('.lkp-m-nav__btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === tab);
    });

    if (tab === 'galaxies') {
      requestAnimationFrame(() => {
        const scroller = document.getElementById('lkp-m-galaxy-scroll');
        const card = scroller?.querySelector(`[data-galaxy-card="${activeGalaxy}"]`);
        card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        updateDotsFromScroll();
      });
    }
  }

  function initSwipe() {
    const scroller = document.getElementById('lkp-m-galaxy-scroll');
    if (!scroller) return;

    let ticking = false;
    scroller.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateDotsFromScroll();
        ticking = false;
      });
    }, { passive: true });

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && sheetOpen) closeSheet();
    });
  }

  /* ────────────────────────────────────────────────────────────────────────
     INIT WHEN READY
  ──────────────────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.LKP_MOBILE_DATA = {
    cultures: CULTURES,
    galaxies: GALAXIES,
    bridge: BRIDGE,
    concepts: CONCEPTS
  };
})();