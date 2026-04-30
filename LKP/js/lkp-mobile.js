/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Mobile Experience
   lkp-mobile.js

   Mobile-first cosmic system:
   - Shared data from CULTURALVERSE_DATA
   - Hawaiian star compass home portal
   - Culture cards + lesson cards from same desktop lesson data
   - Three.js Living Knowledge Galaxy (Ka ʻIke Hōkū)
   - Culture galaxies orbiting Hōkū Kumu (the star foundation)
   - Every lesson star has its own orbit ring + mini moon
   - Tap a galaxy core to zoom into it — full free zoom/pan/rotate
   - Tap a lesson star or moon to open lesson preview
   - Return-to-core control
   - Profile tab / admin gateway placeholder

   FIXES:
   - Camera no longer fights user input: followFocusedCulture() removed from
     animate loop, replaced with isTransitioning flag (same fix as profile.js)
   - enablePan = true, wider zoom range so users can freely explore
   - Lesson nodes each have child orbit rings + moons that auto-follow
   - Hawaiian names: Hōkū Kumu (core), Ka ʻIke Hōkū (galaxy), Kilo Hōkū (tab)
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────────────
     PATHS + DATA
  ──────────────────────────────────────────────────────────────────────── */

  const IN_LKP_FOLDER =
    /\/LKP\/?$/i.test(location.pathname.replace(/[^/]*$/, '')) ||
    /\/LKP\//i.test(location.pathname);

  const ASSET_ROOT = IN_LKP_FOLDER ? 'assets/images/' : 'LKP/assets/images/';
  const CSS_PATH = IN_LKP_FOLDER ? 'css/lkp-mobile.css' : 'LKP/css/lkp-mobile.css';
  const LESSONS_PATH = 'lessons.html';

  function assetPath(file) {
    return ASSET_ROOT + file;
  }

  function getSharedLessonData() {
    if (
      window.CULTURALVERSE_DATA &&
      Array.isArray(window.CULTURALVERSE_DATA.cultures)
    ) {
      return window.CULTURALVERSE_DATA;
    }

    if (
      typeof CULTURALVERSE_DATA !== 'undefined' &&
      CULTURALVERSE_DATA &&
      Array.isArray(CULTURALVERSE_DATA.cultures)
    ) {
      window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
      return CULTURALVERSE_DATA;
    }

    console.warn('[LKP Mobile] CULTURALVERSE_DATA was not found. Mobile lessons will not render.');
    return { cultures: [] };
  }

  const DATA = getSharedLessonData();

  const THEME = {
    emerald: { color: '#3cb371', colorDim: 'rgba(60,179,113,0.12)', colorBorder: 'rgba(60,179,113,0.30)', glow: 'rgba(60,179,113,0.28)' },
    gold: { color: '#f0c96a', colorDim: 'rgba(240,201,106,0.12)', colorBorder: 'rgba(240,201,106,0.34)', glow: 'rgba(240,201,106,0.30)' },
    bridge: { color: '#8fa0ff', colorDim: 'rgba(143,160,255,0.13)', colorBorder: 'rgba(143,160,255,0.34)', glow: 'rgba(143,160,255,0.30)' },
    rust: { color: '#d98545', colorDim: 'rgba(217,133,69,0.12)', colorBorder: 'rgba(217,133,69,0.32)', glow: 'rgba(217,133,69,0.28)' },
    amber: { color: '#e4ad48', colorDim: 'rgba(228,173,72,0.12)', colorBorder: 'rgba(228,173,72,0.32)', glow: 'rgba(228,173,72,0.28)' },
    saffron: { color: '#ffb347', colorDim: 'rgba(255,179,71,0.12)', colorBorder: 'rgba(255,179,71,0.32)', glow: 'rgba(255,179,71,0.28)' },
    cyan: { color: '#54c6ee', colorDim: 'rgba(84,198,238,0.12)', colorBorder: 'rgba(84,198,238,0.30)', glow: 'rgba(84,198,238,0.28)' },
    violet: { color: '#8fa0ff', colorDim: 'rgba(143,160,255,0.13)', colorBorder: 'rgba(143,160,255,0.34)', glow: 'rgba(143,160,255,0.30)' },
    default: { color: '#54c6ee', colorDim: 'rgba(84,198,238,0.12)', colorBorder: 'rgba(84,198,238,0.30)', glow: 'rgba(84,198,238,0.28)' }
  };

  const FALLBACK_CULTURES = [
    { id: 'kanaka', name: 'Kānaka Maoli', emoji: '🌺', tagline: 'Hawaiian Indigenous Knowledge', theme: 'emerald', status: 'live', intro: 'Hawaiian cosmology, wayfinding, land stewardship, language, and healing traditions.', modules: [] },
    { id: 'kemet', name: 'Kemet', emoji: '☥', tagline: 'Ancient Egyptian Wisdom', theme: 'gold', status: 'live', intro: 'Kemetic cosmology, Maʻat, sacred arts, science, and medicine.', modules: [] },
    { id: 'bridge', name: 'The Bridge', emoji: '🌐', tagline: 'Cross-Cultural Connections', theme: 'bridge', status: 'live', intro: 'Shared cosmological and ethical patterns across living knowledge systems.', modules: [] }
  ];

  const RAW_CULTURES = DATA.cultures.length ? DATA.cultures : FALLBACK_CULTURES;

  function stripTags(html) {
    return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function shortTitle(title) {
    return String(title || '').replace(/\s+—\s+.*$/, '').replace(/\s+-\s+.*$/, '').trim();
  }

  function cultureImage(id) {
    const map = { kanaka: 'kanaka.png', kemet: 'kemet.png', bridge: 'bridge.png', dreamtime: 'dreamtime.png', dogon: 'dogon.png', vedic: 'vedic.png', maya: 'maya.png', rapanui: 'rapanui.png', taino: 'taino.png', digitalverse: 'digitalverse.png', ikeverse: 'ikeverse.png', pikoverse: 'pikoverse.png' };
    return assetPath(map[id] || `${id}.png`);
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
      CONCEPTS.set(concept.id, { ...concept, cultureId: culture.id, cultureName: culture.name, cultureEmoji: culture.emoji, color: culture.color, colorDim: culture.colorDim, colorBorder: culture.colorBorder, glow: culture.glow });
    });
  });

  /* ────────────────────────────────────────────────────────────────────────
     STATE
  ──────────────────────────────────────────────────────────────────────── */

  let activeTab = 'home';
  let activeGalaxy = 0;
  let sheetOpen = false;
  let sheetData = null;

  const mobileGalaxyState = {
    initialized: false,
    THREE: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    raycaster: null,
    pointer: null,

    nodes: [],
    cultureGroups: [],
    cultureCores: [],
    dustSystems: [],
    labels: [],
    orbitTrails: [],

    hokuKumu: null,   // the central star (was pikoCore)
    hokuGlow: null,   // glow sprite for center

    focusMode: 'ecosystem',
    focusedCultureIndex: null,
    cameraTween: null,

    /* ── FIX: only lerp camera during explicit transitions ── */
    isTransitioning: false,

    frameId: null
  };

  /* ────────────────────────────────────────────────────────────────────────
     LESSON ROUTING
  ──────────────────────────────────────────────────────────────────────── */

  function lessonHref(lessonId) {
    return `${LESSONS_PATH}#${encodeURIComponent(lessonId)}`;
  }

  function getFirstLessonForCulture(cultureId) {
    const culture = CULTURES.find(c => c.id === cultureId);
    if (!culture) return null;
    for (const mod of culture.modules || []) {
      for (const lesson of mod.lessons || []) {
        return { culture, module: mod, lesson };
      }
    }
    return null;
  }

  function cultureHref(cultureId) {
    const first = getFirstLessonForCulture(cultureId);
    return first ? lessonHref(first.lesson.id) : LESSONS_PATH;
  }

  /* ────────────────────────────────────────────────────────────────────────
     COMPASS IMAGE PROCESSOR
  ──────────────────────────────────────────────────────────────────────── */

  function waitForImageReady(img) {
    return new Promise((resolve) => {
      if (!img) return resolve(false);
      if (img.complete && img.naturalWidth > 0) { resolve(true); return; }
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  function processCompassToGoldDataURL(img) {
    const sourceW = img.naturalWidth || img.width || 1024;
    const sourceH = img.naturalHeight || img.height || 1024;
    const size = Math.max(sourceW, sourceH);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = size; canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    const dx = (size - sourceW) / 2; const dy = (size - sourceH) / 2;
    ctx.drawImage(img, dx, dy, sourceW, sourceH);
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const goldDark = { r: 112, g: 76, b: 24 }; const goldMid = { r: 216, g: 164, b: 66 }; const goldHi = { r: 255, g: 225, b: 132 };
    let kept = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; const g = data[i+1]; const b = data[i+2]; const a = data[i+3];
      if (a === 0) continue;
      const max = Math.max(r,g,b); const min = Math.min(r,g,b);
      const sat = max - min; const lum = (r*0.299 + g*0.587 + b*0.114) / 255;
      const isWhitePaper = r>=178 && g>=178 && b>=178 && lum>=0.72 && sat<=58;
      const isWhiteHalo = r>=152 && g>=152 && b>=152 && lum>=0.62 && sat<=66;
      if (isWhitePaper) { data[i+3] = 0; continue; }
      if (isWhiteHalo) { const fade = Math.min(1, Math.max(0,(lum-0.62)/0.14)); data[i+3] = Math.round(a*(1-fade)); if (data[i+3]<=8) { data[i+3]=0; continue; } }
      const inkStrength = Math.min(1, Math.max(0.26,(0.92-lum)/0.72));
      const highlight = Math.min(1, Math.max(0,(lum-0.12)/0.55));
      const baseR = goldDark.r + (goldMid.r-goldDark.r)*inkStrength;
      const baseG = goldDark.g + (goldMid.g-goldDark.g)*inkStrength;
      const baseB = goldDark.b + (goldMid.b-goldDark.b)*inkStrength;
      data[i] = Math.round(baseR + (goldHi.r-baseR)*highlight*0.36);
      data[i+1] = Math.round(baseG + (goldHi.g-baseG)*highlight*0.36);
      data[i+2] = Math.round(baseB + (goldHi.b-baseB)*highlight*0.36);
      const alphaBoost = Math.min(1, Math.max(0.35,(0.90-lum)/0.55));
      data[i+3] = Math.max(data[i+3], Math.round(255*alphaBoost));
      kept++;
    }
    ctx.putImageData(imageData, 0, 0);
    const glowCanvas = document.createElement('canvas'); const glowCtx = glowCanvas.getContext('2d');
    glowCanvas.width = size; glowCanvas.height = size;
    glowCtx.clearRect(0,0,size,size); glowCtx.drawImage(canvas,0,0);
    glowCtx.globalCompositeOperation = 'source-in'; glowCtx.fillStyle = 'rgba(255,205,92,0.72)'; glowCtx.fillRect(0,0,size,size);
    const finalCanvas = document.createElement('canvas'); const finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = size; finalCanvas.height = size;
    finalCtx.clearRect(0,0,size,size); finalCtx.filter='blur(1.2px)'; finalCtx.globalAlpha=0.42; finalCtx.drawImage(glowCanvas,0,0);
    finalCtx.filter='none'; finalCtx.globalAlpha=1; finalCtx.drawImage(canvas,0,0);
    if (kept < size*size*0.001) { console.warn('[LKP Mobile] Compass processor removed too much. Keeping original.'); return img.src; }
    return finalCanvas.toDataURL('image/png');
  }

  async function activateMobileCompassImage(scope = document) {
    const img = scope.querySelector('#lkp-m-compass-img');
    if (!img) return;
    const ready = await waitForImageReady(img);
    if (!ready) return;
    try { const cleaned = processCompassToGoldDataURL(img); img.src = cleaned; img.classList.add('is-processed'); } catch (err) { console.warn('[LKP Mobile] Compass processing failed:', err.message); }
  }

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
    buildKiloHokuPanel();
    buildEcosystemPanel();
    buildProfilePanel();
    buildBottomSheet();
    buildBottomNav();
    switchTab('home');
    initSwipe();
  }

  function injectMobileCSS() {
    if (document.querySelector('link[data-lkp-mobile-css="true"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = CSS_PATH; link.dataset.lkpMobileCss = 'true';
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
          <section id="lkp-m-profile"   class="lkp-m-panel" data-panel="profile"></section>
        </div>
        <div id="lkp-m-sheet" class="lkp-m-sheet" role="dialog" aria-modal="true" aria-hidden="true"></div>
        <div id="lkp-m-sheet-bg" class="lkp-m-sheet-bg" aria-hidden="true"></div>
        <nav id="lkp-m-nav" class="lkp-m-nav" aria-label="Mobile platform navigation"></nav>
      </div>`;
  }

  function buildStarfield() {
    const el = document.getElementById('lkp-m-starfield');
    const count = 84;
    const colors = ['#9ed8ff','#ffffff','#ffe8d0','#b48cff','#ffd0aa','#54c6ee'];
    let out = `<div class="lkp-m-nebula lkp-m-nebula--one"></div><div class="lkp-m-nebula lkp-m-nebula--two"></div>`;
    for (let i = 0; i < count; i++) {
      const x=Math.random()*100; const y=Math.random()*100; const s=1+Math.random()*2.8;
      const dur=2.8+Math.random()*5.5; const del=Math.random()*6; const col=colors[Math.floor(Math.random()*colors.length)];
      out += `<span class="lkp-m-star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:${col};animation-duration:${dur}s;animation-delay:${del}s"></span>`;
    }
    el.innerHTML = out;
  }

  /* ────────────────────────────────────────────────────────────────────────
     HOME
  ──────────────────────────────────────────────────────────────────────── */

  function getOrbitCultures() { return CULTURES; }

  function openCultureFromButton(btn) {
    const tab = btn.dataset.tab; const galaxyIndex = btn.dataset.galaxy;
    if (galaxyIndex !== undefined && galaxyIndex !== '') activeGalaxy = Math.max(0, Math.min(GALAXIES.length-1, parseInt(galaxyIndex,10)));
    switchTab(tab || 'home');
  }

  function bindTabButtons(scope) {
    scope.querySelectorAll('[data-tab]').forEach(btn => { btn.addEventListener('click', () => openCultureFromButton(btn)); });
  }

  function buildHomePills() {
    return getOrbitCultures().map((culture) => {
      const isBridge = culture.id === 'bridge';
      const galaxyIndex = GALAXIES.findIndex(g => g.id === culture.id);
      const tab = isBridge ? 'bridge' : 'galaxies';
      return `<button class="lkp-m-pill lkp-m-pill--dynamic" style="--pill-color:${culture.color};--pill-bg:${culture.colorDim};--pill-border:${culture.colorBorder}" data-tab="${tab}" ${!isBridge && galaxyIndex>=0 ? `data-galaxy="${galaxyIndex}"` : ''}><span>${culture.emoji}</span> ${escapeHTML(culture.name)}</button>`;
    }).join('');
  }

  function buildCompassOrbitNodes() {
    const entries = getOrbitCultures(); const total = Math.max(1, entries.length);
    const nodes = entries.map((culture, index) => {
      const angle = -90 + (360/total)*index; const isBridge = culture.id === 'bridge';
      const galaxyIndex = GALAXIES.findIndex(g => g.id === culture.id);
      const tab = isBridge ? 'bridge' : 'galaxies';
      const disabled = culture.status !== 'live' && !culture.concepts.length;
      return `<button class="lkp-m-orbit-node ${disabled ? 'is-soon' : ''}" style="--orbit-color:${culture.color};--orbit-bg:${culture.colorDim};--orbit-angle:${angle}deg;--orbit-delay:${(-index*0.65).toFixed(2)}s" data-tab="${tab}" ${!isBridge && galaxyIndex>=0 ? `data-galaxy="${galaxyIndex}"` : ''} aria-label="Open ${escapeHTML(culture.name)}"><span class="lkp-m-orbit-node__halo"></span><img src="${culture.image}" class="lkp-m-orbit-node__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="lkp-m-orbit-node__emoji" style="display:none">${culture.emoji}</span></button>`;
    }).join('');
    const sparks = Array.from({length:18},(_,i) => { const angle=Math.round((360/18)*i); const delay=(-i*0.37).toFixed(2); return `<span class="lkp-m-orbit-spark" style="--spark-angle:${angle}deg;--spark-delay:${delay}s"></span>`; }).join('');
    return `${nodes}${sparks}`;
  }

  function buildHomeQuickButtons() {
    const buttons = getOrbitCultures().map((culture) => {
      const isBridge = culture.id === 'bridge'; const galaxyIndex = GALAXIES.findIndex(g => g.id === culture.id);
      const tab = isBridge ? 'bridge' : 'galaxies'; const count = culture.lessonCount;
      const label = culture.status==='live' ? `${count} ${count===1?'lesson':'lessons'}` : 'Coming soon';
      return `<button class="lkp-m-quick-btn lkp-m-quick-btn--dynamic" style="--quick-color:${culture.color};--quick-bg:${culture.colorDim};--quick-border:${culture.colorBorder}" data-tab="${tab}" ${!isBridge && galaxyIndex>=0 ? `data-galaxy="${galaxyIndex}"` : ''}><img src="${culture.image}" class="lkp-m-quick-btn__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="lkp-m-quick-btn__glyph" style="display:none">${culture.emoji}</span><span class="lkp-m-quick-btn__label">${escapeHTML(culture.name)}</span><span class="lkp-m-quick-btn__sub">${escapeHTML(label)}</span></button>`;
    }).join('');
    return `${buttons}<button class="lkp-m-quick-btn lkp-m-quick-btn--dynamic lkp-m-quick-btn--chart" style="--quick-color:var(--m-cyan);--quick-bg:rgba(84,198,238,0.10);--quick-border:rgba(84,198,238,0.26)" data-tab="chart"><span class="lkp-m-quick-btn__glyph">✦</span><span class="lkp-m-quick-btn__label">Ka ʻIke Hōkū</span><span class="lkp-m-quick-btn__sub">Living Knowledge Galaxy</span></button>`;
  }

  function buildContinueLearningCard() {
    let completed = [];
    try { completed = JSON.parse(localStorage.getItem('cv_completed') || '[]'); } catch { completed = []; }
    const allLiveLessons = CULTURES.filter(c=>c.status==='live').flatMap(culture => (culture.modules||[]).flatMap(mod => (mod.lessons||[]).map(lesson => ({culture,mod,lesson}))));
    const next = allLiveLessons.find(item => !completed.includes(item.lesson.id)) || allLiveLessons[0];
    if (!next) return '';
    return `<a class="lkp-m-continue-card" href="${lessonHref(next.lesson.id)}" style="--continue-color:${next.culture.color};--continue-bg:${next.culture.colorDim};--continue-border:${next.culture.colorBorder}"><span class="lkp-m-continue-card__eyebrow">Continue Learning</span><strong>${next.culture.emoji} ${escapeHTML(next.lesson.title||next.lesson.id)}</strong><small>${escapeHTML(next.culture.name)} · ${escapeHTML(next.mod.title||'Module')} · ${escapeHTML(next.lesson.readTime||'Lesson')}</small></a>`;
  }

  function buildHome() {
    const el = document.getElementById('lkp-m-home');
    const liveCount = LIVE_CULTURES.length; const totalCount = CULTURES.length;
    el.innerHTML = `
      <div class="lkp-m-home">
        <div class="lkp-m-home__brand">
          <div class="lkp-m-home__glyph">◈</div>
          <h1 class="lkp-m-home__title">Living<br><em>Knowledge</em></h1>
          <p class="lkp-m-home__sub">${liveCount} live ${liveCount===1?'galaxy':'galaxies'}, ${totalCount} total culture orbits. Every mobile lesson comes from the same desktop data.</p>
        </div>
        <div class="lkp-m-home__pills">${buildHomePills()}</div>
        <div class="lkp-m-compass-portal" aria-label="Living Hawaiian star compass gateway">
          <div class="lkp-m-compass-aura lkp-m-compass-aura--gold"></div>
          <div class="lkp-m-compass-aura lkp-m-compass-aura--cyan"></div>
          <div class="lkp-m-compass-ring lkp-m-compass-ring--outer"></div>
          <div class="lkp-m-compass-ring lkp-m-compass-ring--inner"></div>
          <div class="lkp-m-home__compass" aria-hidden="true">
            <img id="lkp-m-compass-img" src="${assetPath('hawaiian-star-compass.jpg')}" class="lkp-m-compass-img" alt="" decoding="async" onerror="this.onerror=null;this.src='${assetPath('hawaiian-star-compass.png')}';">
          </div>
          <div class="lkp-m-orbit" aria-label="Culture orbit selector">${buildCompassOrbitNodes()}</div>
          <div class="lkp-m-compass-caption"><span>Ka Pā Nānā Hōkū</span><small>Tap a culture orbit</small></div>
        </div>
        ${buildContinueLearningCard()}
        <div class="lkp-m-home__quick">${buildHomeQuickButtons()}</div>
        <a href="${LESSONS_PATH}" class="lkp-m-begin-btn"><span>📖</span> Open Full Lesson Library</a>
      </div>`;
    bindTabButtons(el);
    activateMobileCompassImage(el);
  }

  /* ────────────────────────────────────────────────────────────────────────
     MODULE / LESSON CARDS
  ──────────────────────────────────────────────────────────────────────── */

  function buildModuleBlocks(culture) {
    if (!culture.modules?.length) {
      return `<div class="lkp-m-soon-card"><span>${culture.emoji}</span><strong>Coming Soon</strong><p>${escapeHTML(culture.tagline||culture.intro||'This culture orbit is ready for future lessons.')}</p></div>`;
    }
    return culture.modules.map(mod => {
      const lessons = (mod.lessons||[]).map(lesson => `
        <a class="lkp-m-lesson-row" href="${lessonHref(lesson.id)}" style="--lesson-color:${culture.color};--lesson-bg:${culture.colorDim};--lesson-border:${culture.colorBorder}">
          <span class="lkp-m-lesson-row__num">${escapeHTML(lesson.num||'')}</span>
          <span class="lkp-m-lesson-row__body"><strong>${escapeHTML(lesson.title||lesson.id)}</strong><small>${escapeHTML(lesson.readTime||'Lesson')}</small></span>
          <span class="lkp-m-lesson-row__arrow">→</span>
        </a>`).join('');
      return `<section class="lkp-m-module-block"><div class="lkp-m-module-block__head"><span>${mod.emoji||culture.emoji||'✦'}</span><div><strong>${escapeHTML(mod.title||'Knowledge Module')}</strong><small>${escapeHTML(mod.desc||'')}</small></div></div><div class="lkp-m-module-block__lessons">${lessons||`<div class="lkp-m-empty-note">Lessons coming soon.</div>`}</div></section>`;
    }).join('');
  }

  /* ────────────────────────────────────────────────────────────────────────
     GALAXY LESSON PANEL
  ──────────────────────────────────────────────────────────────────────── */

  function buildGalaxiesPanel() {
    const el = document.getElementById('lkp-m-galaxies');
    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Living Lessons</span>
        <h2>Choose a Culture</h2>
        <p>Every culture, module, and lesson shown here comes from the same data used by the desktop lesson page.</p>
      </div>
      <div id="lkp-m-galaxy-scroll" class="lkp-m-galaxy-scroll">
        ${GALAXIES.map((culture, index) => buildGalaxyCard(culture, index)).join('')}
      </div>
      <div class="lkp-m-dots" aria-hidden="true">
        ${GALAXIES.map((_,i) => `<span class="lkp-m-dot ${i===activeGalaxy?'is-active':''}"></span>`).join('')}
      </div>`;
  }

  function buildGalaxyCard(culture, index) {
    const isSoon = culture.status !== 'live' || !culture.modules?.length;
    return `
      <article class="lkp-m-galaxy-card ${isSoon?'is-soon':''}" data-galaxy-card="${index}" style="--galaxy-color:${culture.color};--galaxy-bg:${culture.colorDim};--galaxy-border:${culture.colorBorder};--galaxy-glow:${culture.glow}">
        <div class="lkp-m-galaxy-card__top">
          <div class="lkp-m-galaxy-card__icon"><img src="${culture.image}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span style="display:none">${culture.emoji}</span></div>
          <div><span class="lkp-m-status ${culture.status==='live'?'is-live':'is-soon'}">${culture.status==='live'?'Live':'Coming Soon'}</span><h3>${escapeHTML(culture.name)}</h3><p>${escapeHTML(culture.tagline||'')}</p></div>
        </div>
        <div class="lkp-m-galaxy-card__intro">${escapeHTML(culture.intro||'')}</div>
        <div class="lkp-m-galaxy-card__stats"><span><strong>${culture.moduleCount}</strong> modules</span><span><strong>${culture.lessonCount}</strong> lessons</span><span><strong>${escapeHTML(culture.theme)}</strong> theme</span></div>
        <a class="lkp-m-enter-lessons" href="${cultureHref(culture.id)}" style="--enter-color:${culture.color};--enter-bg:${culture.colorDim};--enter-border:${culture.colorBorder}">Enter ${escapeHTML(culture.name)} Lessons →</a>
        <div class="lkp-m-module-list">${buildModuleBlocks(culture)}</div>
      </article>`;
  }

  function updateDotsFromScroll() {
    const scroller = document.getElementById('lkp-m-galaxy-scroll');
    if (!scroller) return;
    const cards = [...scroller.querySelectorAll('[data-galaxy-card]')];
    if (!cards.length) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0; let bestDistance = Infinity;
    cards.forEach((card, index) => { const cardCenter = card.offsetLeft + card.offsetWidth/2; const distance = Math.abs(cardCenter-center); if (distance<bestDistance) { bestDistance=distance; best=index; } });
    activeGalaxy = best;
    document.querySelectorAll('.lkp-m-dot').forEach((dot, index) => { dot.classList.toggle('is-active', index===activeGalaxy); });
  }

  /* ────────────────────────────────────────────────────────────────────────
     BRIDGE PANEL
  ──────────────────────────────────────────────────────────────────────── */

  function buildBridgePanel() {
    const el = document.getElementById('lkp-m-bridge');
    const bridge = BRIDGE;
    if (!bridge) { el.innerHTML = `<div class="lkp-m-section-head"><span class="lkp-m-eyebrow">Bridge</span><h2>No Bridge Data Yet</h2><p>Add a culture with <code>id: 'bridge'</code> to lkp-data.js.</p></div>`; return; }
    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">${bridge.emoji} ${escapeHTML(bridge.tagline||'Cross-Cultural Connections')}</span>
        <h2>${escapeHTML(bridge.name)}</h2>
        <p>${escapeHTML(bridge.intro||'')}</p>
      </div>
      <article class="lkp-m-galaxy-card lkp-m-galaxy-card--bridge" style="--galaxy-color:${bridge.color};--galaxy-bg:${bridge.colorDim};--galaxy-border:${bridge.colorBorder};--galaxy-glow:${bridge.glow}">
        <div class="lkp-m-galaxy-card__stats"><span><strong>${bridge.moduleCount}</strong> modules</span><span><strong>${bridge.lessonCount}</strong> lessons</span><span><strong>${escapeHTML(bridge.theme)}</strong> theme</span></div>
        <a class="lkp-m-enter-lessons" href="${cultureHref(bridge.id)}" style="--enter-color:${bridge.color};--enter-bg:${bridge.colorDim};--enter-border:${bridge.colorBorder}">Enter Bridge Lessons →</a>
        <div class="lkp-m-module-list">${buildModuleBlocks(bridge)}</div>
      </article>`;
  }

  /* ────────────────────────────────────────────────────────────────────────
     KA ʻIKE HŌKŪ — LIVING KNOWLEDGE GALAXY PANEL
     (formerly "Three.js Star Chart")
     
     Hawaiian naming used:
       Ka ʻIke Hōkū = "The Knowledge Stars" — main galaxy name
       Kilo Hōkū    = "Star Gazer/Viewer" — nav tab label
       Hōkū Kumu    = "Foundation Star / Source Star" — central core
  ──────────────────────────────────────────────────────────────────────── */

  function buildKiloHokuPanel() {
    const el = document.getElementById('lkp-m-chart');
    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Kilo Hōkū — Living Knowledge Galaxy</span>
        <h2>Ka ʻIke Hōkū</h2>
        <p>
          Culture galaxies orbit the Hōkū Kumu (star foundation). Tap a culture core to zoom in.
          Tap any lesson star or orbiting moon to open its lesson preview.
          Pinch to zoom · drag to rotate · two-finger pan to explore freely.
        </p>
      </div>

      <div class="lkp-m-three-galaxy-wrap">
        <canvas id="lkp-m-three-galaxy" class="lkp-m-three-galaxy" aria-label="Ka ʻIke Hōkū — Living Knowledge Galaxy"></canvas>

        <button id="lkp-m-return-core" class="lkp-m-return-core" type="button">
          ← Return to Hōkū Kumu
        </button>

        <div class="lkp-m-three-galaxy__hud">
          <div><strong id="lkp-m-galaxy-count">${CULTURES.length}</strong><span>Cultures</span></div>
          <div><strong id="lkp-m-lesson-count">${[...CONCEPTS.values()].length}</strong><span>Lessons</span></div>
        </div>

        <div id="lkp-m-galaxy-tip" class="lkp-m-galaxy-tip">
          <strong>Hōkū Kumu</strong>
          <span>Tap a culture galaxy to zoom in · tap a star to open its lesson</span>
        </div>
      </div>

      <div class="lkp-m-galaxy-legend">
        ${CULTURES.map((culture, index) => `
          <button class="lkp-m-galaxy-legend__item" data-focus-culture="${index}" style="--legend-color:${culture.color};--legend-bg:${culture.colorDim};--legend-border:${culture.colorBorder}">
            <span>${culture.emoji}</span>
            <strong>${escapeHTML(culture.name)}</strong>
            <small>${culture.lessonCount} lessons</small>
          </button>`).join('')}
      </div>`;

    document.getElementById('lkp-m-return-core')?.addEventListener('click', returnToHokuKumu);
    el.querySelectorAll('[data-focus-culture]').forEach(btn => {
      btn.addEventListener('click', () => { focusCultureGalaxy(parseInt(btn.dataset.focusCulture, 10)); });
    });

    requestAnimationFrame(() => { initMobileThreeLessonGalaxy(); });
  }

  /* ────────────────────────────────────────────────────────────────────────
     THREE.JS GALAXY INIT
  ──────────────────────────────────────────────────────────────────────── */

  async function initMobileThreeLessonGalaxy() {
    const canvas = document.getElementById('lkp-m-three-galaxy');
    const wrap = canvas?.closest('.lkp-m-three-galaxy-wrap');
    if (!canvas || !wrap) return;
    if (mobileGalaxyState.initialized) { resizeMobileThreeGalaxy(); return; }

    const THREE = await import('https://esm.sh/three@0.160.0');
    const { OrbitControls } = await import('https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js');

    mobileGalaxyState.THREE = THREE;
    mobileGalaxyState.initialized = true;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x01030a, 0.012);

    const camera = new THREE.PerspectiveCamera(62, wrap.clientWidth / wrap.clientHeight, 0.1, 320);
    camera.position.set(0, 14, 52);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = true;          // ← free pan
    controls.enableZoom = true;         // ← free zoom
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.42;
    controls.zoomSpeed = 0.65;
    controls.minDistance = 4;           // ← zoom all the way in
    controls.maxDistance = 120;         // ← zoom all the way out
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.24;
    controls.target.set(0, 0, 0);

    if ('zoomToCursor' in controls) controls.zoomToCursor = true;

    // Prevent wheel from scrolling page while inside galaxy
    canvas.addEventListener('wheel', event => { event.preventDefault(); event.stopPropagation(); }, { passive: false });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    mobileGalaxyState.scene = scene;
    mobileGalaxyState.camera = camera;
    mobileGalaxyState.renderer = renderer;
    mobileGalaxyState.controls = controls;
    mobileGalaxyState.raycaster = raycaster;
    mobileGalaxyState.pointer = pointer;
    mobileGalaxyState.nodes = [];
    mobileGalaxyState.cultureGroups = [];
    mobileGalaxyState.cultureCores = [];
    mobileGalaxyState.dustSystems = [];
    mobileGalaxyState.labels = [];
    mobileGalaxyState.orbitTrails = [];

    scene.add(new THREE.AmbientLight(0xffffff, 0.42));
    const key = new THREE.PointLight(0xffdd9a, 2.8, 180); key.position.set(0,42,34); scene.add(key);
    const cyan = new THREE.PointLight(0x54c6ee, 1.35, 130); cyan.position.set(-38,22,-20); scene.add(cyan);
    const violet = new THREE.PointLight(0x8fa0ff, 1.1, 120); violet.position.set(32,14,28); scene.add(violet);

    buildMobileKiloHokuSystem(scene, THREE);
    bindMobileGalaxyEvents(canvas);
    window.addEventListener('resize', resizeMobileThreeGalaxy, { passive: true });

    function animate() {
      mobileGalaxyState.frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      const distance = camera.position.distanceTo(controls.target);
      const zoomBoost = Math.min(3.05, Math.max(1, (distance - 18) / 18));

      // ── FIX: only run camera tween during explicit transitions ──
      updateCameraTween();

      // Hōkū Kumu core animation
      if (mobileGalaxyState.hokuKumu) {
        mobileGalaxyState.hokuKumu.rotation.y += 0.008;
        mobileGalaxyState.hokuKumu.rotation.x = Math.sin(t * 0.36) * 0.08;
      }
      if (mobileGalaxyState.hokuGlow) {
        mobileGalaxyState.hokuGlow.material.opacity = 0.34 + Math.sin(t * 1.1) * 0.08;
      }

      // Culture group orbits
      mobileGalaxyState.cultureGroups.forEach((group, index) => {
        const data = group.userData;
        const isFocused = mobileGalaxyState.focusedCultureIndex === index;

        if (mobileGalaxyState.focusMode === 'ecosystem') {
          data.orbitAngle += data.orbitSpeed;
          group.position.x = Math.cos(data.orbitAngle) * data.orbitRadius;
          group.position.z = Math.sin(data.orbitAngle) * data.orbitRadius;
          group.position.y = data.baseY + Math.sin(t * 0.32 + index) * 0.45;
        }

        group.rotation.y += isFocused ? 0.004 : (data.rotationSpeed || 0.001);
        group.rotation.x = Math.sin(t * 0.18 + index) * 0.035;
      });

      // ── FIX: NO followFocusedCulture() here — that was fighting user input ──

      // Dust systems
      mobileGalaxyState.dustSystems.forEach((dust, index) => {
        dust.rotation.y += 0.0009 + index * 0.00012;
        dust.rotation.z += 0.00035;
      });

      // Label opacity
      mobileGalaxyState.labels.forEach(label => {
        const inCultureMode = mobileGalaxyState.focusMode === 'culture';
        const isFocusedLabel = label.userData.cultureIndex === mobileGalaxyState.focusedCultureIndex;
        label.material.opacity = inCultureMode ? (isFocusedLabel ? 0.84 : 0.18) : 0.72;
      });

      // Lesson nodes + their satellite moon pivots
      mobileGalaxyState.nodes.forEach((node, index) => {
        node.mesh.rotation.y += 0.01;
        node.mesh.rotation.x = Math.sin(t + index * 0.37) * 0.18;

        const pulse = 1 + Math.sin(t * 1.7 + index) * 0.055;
        const nodeScale = node.baseScale * pulse * zoomBoost;
        node.mesh.scale.setScalar(nodeScale);

        if (node.glow) {
          const baseSize = node.glow.userData.baseSize || 1;
          node.glow.scale.setScalar(baseSize * zoomBoost);
          node.glow.material.opacity = node.isHovered
            ? 0.95
            : Math.min(0.88, 0.42 + zoomBoost * 0.09 + Math.sin(t * 1.4 + index) * 0.10);
        }

        // ── Animate satellite moon pivots (children of lesson mesh) ──
        if (node.satellitePivots?.length) {
          node.satellitePivots.forEach((pivot, pi) => {
            pivot.rotation.y += pivot.userData.speed || (0.028 + pi * 0.009);
            pivot.rotation.x += pivot.userData.wobble || 0.0005;
          });
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }

  /* ────────────────────────────────────────────────────────────────────────
     BUILD GALAXY SCENE
  ──────────────────────────────────────────────────────────────────────── */

  function buildMobileKiloHokuSystem(scene, THREE) {
    addMobileBackgroundStars(scene, THREE);
    makeHokuKumuCore(scene, THREE);
    addPikoOrbitTrails(scene, THREE);
    buildMobileGalaxyStars(scene, THREE);
  }

  function addMobileBackgroundStars(scene, THREE) {
    const bgCount = 1100;
    const bgPositions = new Float32Array(bgCount * 3);
    const bgColors = new Float32Array(bgCount * 3);
    const gold = new THREE.Color('#f0c96a'); const cyan = new THREE.Color('#54c6ee'); const white = new THREE.Color('#dbefff');
    for (let i = 0; i < bgCount; i++) {
      const r = 48 + Math.random()*82; const theta = Math.random()*Math.PI*2; const phi = Math.acos(Math.random()*2-1);
      bgPositions[i*3] = r*Math.sin(phi)*Math.cos(theta); bgPositions[i*3+1] = r*Math.cos(phi)*0.72; bgPositions[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
      const mixed = white.clone(); if (Math.random()>0.72) mixed.lerp(gold,0.45); if (Math.random()>0.82) mixed.lerp(cyan,0.35);
      bgColors[i*3]=mixed.r; bgColors[i*3+1]=mixed.g; bgColors[i*3+2]=mixed.b;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions,3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgColors,3));
    scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ size:0.12, vertexColors:true, transparent:true, opacity:0.68, depthWrite:false })));
  }

  /* Hōkū Kumu — the star foundation / central core */
  function makeHokuKumuCore(scene, THREE) {
    const coreGroup = new THREE.Group();
    coreGroup.name = 'Hōkū Kumu — Star Foundation';
    scene.add(coreGroup);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 2),
      new THREE.MeshPhysicalMaterial({ color: 0xf0c96a, emissive: 0xf0c96a, emissiveIntensity: 1.1, metalness: 0.12, roughness: 0.18, transparent: true, opacity: 0.98 })
    );
    coreGroup.add(core);

    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(0.74, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.26 })
    );
    coreGroup.add(inner);

    const glow = makeMobileGlowSprite(THREE, '#f0c96a', 8.2, 0.38); coreGroup.add(glow);
    const cyanGlow = makeMobileGlowSprite(THREE, '#54c6ee', 5.8, 0.18); coreGroup.add(cyanGlow);

    const label = makeMobileTextSprite(THREE, 'Hōkū Kumu', '#f0c96a');
    label.position.set(0, 2.8, 0); label.scale.set(5.2, 1.2, 1); coreGroup.add(label);

    const ringA = makePikoRing(THREE, 2.15, '#f0c96a', 0.28); ringA.rotation.x = Math.PI/2; coreGroup.add(ringA);
    const ringB = makePikoRing(THREE, 2.72, '#54c6ee', 0.16); ringB.rotation.x = Math.PI/2.45; coreGroup.add(ringB);

    mobileGalaxyState.hokuKumu = coreGroup;
    mobileGalaxyState.hokuGlow = glow;
  }

  function makePikoRing(THREE, radius, color, opacity) {
    const pts = [];
    for (let i=0; i<=128; i++) { const a=(i/128)*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*radius, Math.sin(a)*radius, 0)); }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent:true, opacity, depthWrite:false }));
  }

  function addPikoOrbitTrails(scene, THREE) {
    const cultureCount = Math.max(1, CULTURES.length);
    const baseRadius = Math.min(28, 13 + cultureCount * 2.2);
    CULTURES.forEach((culture, index) => {
      const radius = baseRadius + (index%3)*0.55;
      const ring = makeFlatOrbitTrail(THREE, radius, culture.color||'#f0c96a', index%2 ? 0.08 : 0.11);
      ring.rotation.x = Math.PI/2; scene.add(ring); mobileGalaxyState.orbitTrails.push(ring);
    });
  }

  function makeFlatOrbitTrail(THREE, radius, color, opacity) {
    const pts = [];
    for (let i=0; i<=192; i++) { const a=(i/192)*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*radius, Math.sin(a)*radius, 0)); }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent:true, opacity, depthWrite:false }));
  }

  /* ────────────────────────────────────────────────────────────────────────
     BUILD CULTURE GALAXIES + LESSON STARS WITH MOON ORBITS
  ──────────────────────────────────────────────────────────────────────── */

  function buildMobileGalaxyStars(scene, THREE) {
    const cultureCount = Math.max(1, CULTURES.length);
    const galaxyRadius = Math.min(28, 13 + cultureCount * 2.2);

    CULTURES.forEach((culture, cultureIndex) => {
      const cultureAngle = -Math.PI/2 + (Math.PI*2*cultureIndex)/cultureCount;
      const cx = Math.cos(cultureAngle)*galaxyRadius; const cz = Math.sin(cultureAngle)*galaxyRadius;
      const cy = culture.id==='bridge' ? 4 : 0;

      const cultureGroup = new THREE.Group();
      cultureGroup.position.set(cx, cy, cz);
      cultureGroup.userData.rotationSpeed = 0.0008 + cultureIndex*0.00018;
      cultureGroup.userData.orbitAngle = cultureAngle;
      cultureGroup.userData.orbitSpeed = 0.0014 + cultureIndex*0.00013;
      cultureGroup.userData.orbitRadius = galaxyRadius + (cultureIndex%3)*0.55;
      cultureGroup.userData.baseY = cy;
      cultureGroup.userData.cultureIndex = cultureIndex;
      scene.add(cultureGroup);
      mobileGalaxyState.cultureGroups.push(cultureGroup);

      const color = new THREE.Color(culture.color||'#54c6ee');

      // Culture core sphere
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 24, 24),
        new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: culture.status==='live'?0.92:0.42, metalness:0.08, roughness:0.18, transparent:true, opacity:culture.status==='live'?0.96:0.52 })
      );
      core.userData.isCultureCore = true;
      core.userData.cultureIndex = cultureIndex;
      core.userData.cultureId = culture.id;
      core.userData.cultureName = culture.name;
      cultureGroup.add(core);
      mobileGalaxyState.cultureCores.push({ mesh: core, group: cultureGroup, culture, index: cultureIndex });

      const coreGlow = makeMobileGlowSprite(THREE, culture.color||'#54c6ee', 5.1, 0.46); cultureGroup.add(coreGlow);

      const nebula = makeMobileNebulaSprite(THREE, culture.color||'#54c6ee', 8.5+Math.min(6,culture.lessonCount*0.18), culture.id==='bridge'?0.36:0.28);
      nebula.rotation.z = cultureIndex*0.7; cultureGroup.add(nebula);

      addMobileGalaxyDust(cultureGroup, THREE, culture.color||'#54c6ee', 180+Math.min(220,culture.lessonCount*10), 4.2+Math.min(5.5,culture.lessonCount*0.16), culture.id==='bridge'?0.50:0.38);

      const label = makeMobileTextSprite(THREE, `${culture.emoji} ${culture.name}`, culture.color||'#f0c96a');
      label.position.set(0, 2.12, 0); label.scale.set(5.4, 1.22, 1);
      label.userData.cultureIndex = cultureIndex;
      cultureGroup.add(label); mobileGalaxyState.labels.push(label);

      const modules = culture.modules || [];

      modules.forEach((mod, modIndex) => {
        const lessons = mod.lessons || [];
        const moduleRadius = 2.35 + modIndex*1.85;

        // Module orbit ring (around culture core)
        addMobileOrbitRing(cultureGroup, THREE, moduleRadius, culture.color||'#f0c96a', 0.17);

        addMobileGalaxyDust(cultureGroup, THREE, culture.color||'#54c6ee', 54+Math.min(80,lessons.length*8), moduleRadius+0.2, 0.18);

        lessons.forEach((lesson, lessonIndex) => {
          const angle = -Math.PI/2 + (Math.PI*2*lessonIndex)/Math.max(1,lessons.length);
          const x = Math.cos(angle)*moduleRadius; const z = Math.sin(angle)*moduleRadius;
          const y = Math.sin(angle*2+modIndex)*0.45;
          const isMajor = lessonIndex===0 && modIndex===0;

          const geo = isMajor ? new THREE.OctahedronGeometry(0.34,0) : new THREE.SphereGeometry(0.22,18,18);
          const mat = new THREE.MeshPhysicalMaterial({ color, emissive:color, emissiveIntensity:isMajor?0.98:0.66, metalness:0.05, roughness:0.18, transparent:true, opacity:0.98 });

          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, z);
          mesh.userData.lessonId = lesson.id;
          mesh.userData.cultureId = culture.id;
          mesh.userData.cultureIndex = cultureIndex;
          mesh.userData.moduleId = mod.id;
          mesh.userData.title = lesson.title||lesson.id;
          mesh.userData.readTime = lesson.readTime||'';
          mesh.userData.num = lesson.num||'';
          mesh.userData.cultureName = culture.name;
          mesh.userData.moduleTitle = mod.title||'';
          mesh.userData.color = culture.color||'#f0c96a';

          const glow = makeMobileGlowSprite(THREE, culture.color||'#f0c96a', isMajor?2.25:1.45, isMajor?0.62:0.42);
          glow.position.copy(mesh.position);

          cultureGroup.add(mesh);
          cultureGroup.add(glow);

          /* ── MOON ORBITS: every lesson star gets its own orbit ring(s)
             and mini moon(s) added as children so they auto-follow ── */
          const satellitePivots = [];
          const moonCount = isMajor ? 2 : 1;

          for (let m = 0; m < moonCount; m++) {
            const moonRadius = (isMajor ? 0.62 : 0.46) + m * 0.24;
            const moonTiltX = Math.PI / (3 + m * 1.2);
            const moonTiltZ = (Math.PI / 6) * (m % 2 === 0 ? 1 : -1);

            // Orbit ring as child of lesson mesh — auto-follows
            const moonRing = makeMoonOrbitRing(THREE, moonRadius, culture.color||'#f0c96a', 0.30, moonTiltX, moonTiltZ);
            mesh.add(moonRing);

            // Moon pivot as child of lesson mesh
            const pivot = new THREE.Object3D();
            pivot.rotation.x = moonTiltX;
            pivot.rotation.z = moonTiltZ;
            pivot.userData.speed = 0.028 + m * 0.012 + lessonIndex * 0.003;
            pivot.userData.wobble = 0.0006 + m * 0.0002;

            const moonSize = 0.06 + m * 0.022;
            const moonMesh = new THREE.Mesh(
              new THREE.SphereGeometry(moonSize, 10, 10),
              new THREE.MeshPhysicalMaterial({ color: new THREE.Color(culture.color||'#f0c96a').offsetHSL(0.04*m, 0.06, 0.12), emissive: new THREE.Color(culture.color||'#f0c96a'), emissiveIntensity: 0.75 + m*0.08, roughness: 0.28, metalness: 0.08 })
            );
            moonMesh.position.set(moonRadius, 0, 0);

            const moonGlow = makeMobileGlowSprite(THREE, culture.color||'#f0c96a', 0.52 + m*0.18, 0.38 + m*0.06);
            moonGlow.position.copy(moonMesh.position);

            pivot.add(moonMesh);
            pivot.add(moonGlow);
            mesh.add(pivot);
            satellitePivots.push(pivot);
          }

          mobileGalaxyState.nodes.push({
            mesh, glow, culture, module: mod, lesson,
            cultureIndex, baseScale: isMajor ? 1.25 : 1,
            isHovered: false,
            satellitePivots
          });
        });
      });

      // Placeholder orbit for cultures with no lessons yet
      if (!modules.length) {
        addMobileOrbitRing(cultureGroup, THREE, 2.5, culture.color||'#f0c96a', 0.12);
        for (let i=0; i<6; i++) {
          const angle=(Math.PI*2*i)/6;
          const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.15,12,12), new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.34 }));
          mesh.position.set(Math.cos(angle)*2.5, 0, Math.sin(angle)*2.5);
          cultureGroup.add(mesh);
        }
      }
    });

    // Bridge arcs between live cultures
    const liveCultures = CULTURES.filter(c=>c.status==='live');
    if (liveCultures.length >= 2) {
      const pts = [];
      liveCultures.forEach(culture => {
        const idx = CULTURES.findIndex(c=>c.id===culture.id);
        const angle = -Math.PI/2 + (Math.PI*2*idx)/cultureCount;
        pts.push(new THREE.Vector3(Math.cos(angle)*galaxyRadius, culture.id==='bridge'?4:0, Math.sin(angle)*galaxyRadius));
      });
      for (let i=0; i<pts.length-1; i++) {
        const curve = new THREE.CatmullRomCurve3([pts[i], new THREE.Vector3(0,6,0), pts[i+1]]);
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), new THREE.LineBasicMaterial({ color:0xd4ae5a, transparent:true, opacity:0.17 })));
      }
    }
  }

  function makeMoonOrbitRing(THREE, radius, color, opacity, tiltX=0, tiltZ=0) {
    const pts = [];
    for (let i=0; i<=64; i++) { const a=(i/64)*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*radius, 0, Math.sin(a)*radius)); }
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent:true, opacity, depthWrite:false })
    );
    ring.rotation.x = tiltX; ring.rotation.z = tiltZ;
    return ring;
  }

  function addMobileOrbitRing(group, THREE, radius, color, opacity) {
    const pts = [];
    for (let i=0; i<=96; i++) { const a=(i/96)*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*radius, 0, Math.sin(a)*radius)); }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent:true, opacity, depthWrite:false })));
  }

  function makeMobileNebulaSprite(THREE, color, size, opacity) {
    const c = document.createElement('canvas'); c.width=256; c.height=256;
    const ctx = c.getContext('2d'); const col = new THREE.Color(color);
    const r=Math.round(col.r*255); const g=Math.round(col.g*255); const b=Math.round(col.b*255);
    ctx.clearRect(0,0,256,256);
    const grd = ctx.createRadialGradient(128,128,8,128,128,128);
    grd.addColorStop(0.00,`rgba(${r},${g},${b},0.36)`); grd.addColorStop(0.28,`rgba(${r},${g},${b},0.18)`); grd.addColorStop(0.58,`rgba(${r},${g},${b},0.07)`); grd.addColorStop(1.00,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd; ctx.fillRect(0,0,256,256);
    for (let i=0; i<70; i++) { const px=128+(Math.random()-0.5)*190; const py=128+(Math.random()-0.5)*190; const pRadius=8+Math.random()*28; const puff=ctx.createRadialGradient(px,py,0,px,py,pRadius); puff.addColorStop(0,`rgba(255,255,255,${0.025+Math.random()*0.04})`); puff.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=puff; ctx.beginPath(); ctx.arc(px,py,pRadius,0,Math.PI*2); ctx.fill(); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, opacity, depthWrite:false, blending:THREE.AdditiveBlending }));
    sprite.scale.set(size, size*0.72, 1); sprite.userData.baseSize = size;
    return sprite;
  }

  function addMobileGalaxyDust(group, THREE, color, count, radius, opacity) {
    const positions = new Float32Array(count*3); const colors = new Float32Array(count*3);
    const base=new THREE.Color(color); const gold=new THREE.Color('#f0c96a'); const cyan=new THREE.Color('#54c6ee');
    for (let i=0; i<count; i++) {
      const arm=i%3; const angle=Math.random()*Math.PI*2+arm*((Math.PI*2)/3);
      const spread=Math.pow(Math.random(),0.55)*radius; const spiral=angle+spread*0.34;
      positions[i*3]=Math.cos(spiral)*spread; positions[i*3+1]=(Math.random()-0.5)*1.25; positions[i*3+2]=Math.sin(spiral)*spread;
      const mixed=base.clone(); if (Math.random()>0.65) mixed.lerp(gold,0.32); if (Math.random()>0.78) mixed.lerp(cyan,0.22);
      colors[i*3]=mixed.r; colors[i*3+1]=mixed.g; colors[i*3+2]=mixed.b;
    }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(positions,3)); geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const dust=new THREE.Points(geo, new THREE.PointsMaterial({ size:0.055, vertexColors:true, transparent:true, opacity, depthWrite:false, blending:THREE.AdditiveBlending }));
    group.add(dust); mobileGalaxyState.dustSystems.push(dust);
    return dust;
  }

  function makeMobileGlowSprite(THREE, color, size, opacity) {
    const c=document.createElement('canvas'); c.width=96; c.height=96;
    const ctx=c.getContext('2d'); const grd=ctx.createRadialGradient(48,48,0,48,48,48);
    const col=new THREE.Color(color); const r=Math.round(col.r*255); const g=Math.round(col.g*255); const b=Math.round(col.b*255);
    grd.addColorStop(0,`rgba(${r},${g},${b},0.85)`); grd.addColorStop(0.45,`rgba(${r},${g},${b},0.24)`); grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd; ctx.fillRect(0,0,96,96);
    const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, opacity, depthWrite:false, blending:THREE.AdditiveBlending }));
    sprite.scale.setScalar(size); sprite.userData.baseSize=size;
    return sprite;
  }

  function makeMobileTextSprite(THREE, text, color) {
    const c=document.createElement('canvas'); c.width=512; c.height=128;
    const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
    ctx.font="700 34px 'DM Sans',system-ui,sans-serif"; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor=color; ctx.shadowBlur=16; ctx.fillStyle=color; ctx.fillText(text,c.width/2,c.height/2);
    const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
    return new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, depthWrite:false }));
  }

  /* ────────────────────────────────────────────────────────────────────────
     TAP / CLICK DETECTION
  ──────────────────────────────────────────────────────────────────────── */

  function bindMobileGalaxyEvents(canvas) {
    canvas.addEventListener('pointermove', (event) => { updateMobileGalaxyPointer(event, canvas); pickMobileGalaxyNode(false); }, { passive: true });
    canvas.addEventListener('click', (event) => { updateMobileGalaxyPointer(event, canvas); pickMobileGalaxyNode(true); }, { passive: true });
    canvas.addEventListener('touchend', (event) => {
      if (!event.changedTouches?.length) return;
      updateMobileGalaxyPointer(event.changedTouches[0], canvas);
      pickMobileGalaxyNode(true);
    }, { passive: true });
  }

  function updateMobileGalaxyPointer(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    mobileGalaxyState.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mobileGalaxyState.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickMobileGalaxyNode(open) {
    const { raycaster, pointer, camera, nodes, cultureCores } = mobileGalaxyState;
    if (!raycaster || !pointer || !camera) return;

    nodes.forEach(n => { n.isHovered = false; });
    raycaster.setFromCamera(pointer, camera);

    // Check culture cores first
    const coreHits = raycaster.intersectObjects(cultureCores.map(c => c.mesh), false);
    if (coreHits.length) {
      const coreEntry = cultureCores.find(c => c.mesh === coreHits[0].object);
      const tip = document.getElementById('lkp-m-galaxy-tip');
      if (coreEntry && tip) {
        tip.innerHTML = `<strong style="color:${coreEntry.culture.color}">${escapeHTML(coreEntry.culture.name)}</strong><span>${open ? 'Zooming into galaxy...' : 'Tap to zoom into this culture galaxy'}</span>`;
      }
      if (open && coreEntry) focusCultureGalaxy(coreEntry.index);
      return;
    }

    // Collect all lesson meshes AND their moon pivots' children for hit testing
    const lessonMeshes = nodes.map(n => n.mesh);

    // Also collect moon meshes (children of lesson mesh via pivot)
    const moonMeshMap = new Map(); // moon mesh → node
    nodes.forEach(node => {
      if (node.satellitePivots) {
        node.satellitePivots.forEach(pivot => {
          pivot.children.forEach(child => {
            if (child.isMesh) moonMeshMap.set(child, node);
          });
        });
      }
    });

    const allHitMeshes = [...lessonMeshes, ...moonMeshMap.keys()];
    const hits = raycaster.intersectObjects(allHitMeshes, false);
    const tip = document.getElementById('lkp-m-galaxy-tip');

    if (!hits.length) {
      if (tip) tip.innerHTML = mobileGalaxyState.focusMode==='culture' ? `<strong>Culture Galaxy</strong><span>Tap a lesson star or its orbiting moon</span>` : `<strong>Hōkū Kumu</strong><span>Tap a culture galaxy to zoom in · tap a star to open its lesson</span>`;
      return;
    }

    const hitMesh = hits[0].object;
    // Find the node — either direct lesson mesh or via moon map
    const node = nodes.find(n => n.mesh === hitMesh) || moonMeshMap.get(hitMesh);
    if (!node) return;

    node.isHovered = true;

    if (tip) {
      tip.innerHTML = `<strong style="color:${node.culture.color}">${escapeHTML(node.lesson.title||node.lesson.id)}</strong><span>${escapeHTML(node.culture.name)} · ${escapeHTML(node.module.title||'')} ${node.lesson.num ? '· '+escapeHTML(node.lesson.num) : ''}</span>`;
    }

    if (open) {
      openConceptSheet(node.culture, {
        id: node.lesson.id,
        lessonId: node.lesson.id,
        title: node.lesson.title || node.lesson.id,
        label: node.lesson.title || node.lesson.id,
        num: node.lesson.num || '',
        readTime: node.lesson.readTime || '',
        moduleTitle: node.module.title || '',
        desc: stripTags(node.lesson.content || node.module.desc || node.culture.intro || '').slice(0, 220)
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────────────
     CAMERA FOCUS SYSTEM — isTransitioning flag prevents fighting user input
  ──────────────────────────────────────────────────────────────────────── */

  function focusCultureGalaxy(index) {
    const THREE = mobileGalaxyState.THREE;
    const group = mobileGalaxyState.cultureGroups[index];
    const camera = mobileGalaxyState.camera;
    const controls = mobileGalaxyState.controls;
    if (!THREE || !group || !camera || !controls) return;

    const world = new THREE.Vector3();
    group.getWorldPosition(world);
    const culture = CULTURES[index];

    mobileGalaxyState.focusMode = 'culture';
    mobileGalaxyState.focusedCultureIndex = index;
    mobileGalaxyState.isTransitioning = true; // ← trigger camera move

    const offset = new THREE.Vector3(0, 4.5, 12.5);
    animateCameraTo(world.clone().add(offset), world.clone(), 820);

    const btn = document.getElementById('lkp-m-return-core');
    if (btn) btn.classList.add('is-visible');

    const tip = document.getElementById('lkp-m-galaxy-tip');
    if (tip && culture) {
      tip.innerHTML = `<strong style="color:${culture.color}">${escapeHTML(culture.name)} — Ka ʻIke Hōkū</strong><span>Tap a lesson star or orbiting moon to open its preview</span>`;
    }
  }

  function returnToHokuKumu() {
    const THREE = mobileGalaxyState.THREE;
    const camera = mobileGalaxyState.camera;
    if (!THREE || !camera) return;

    mobileGalaxyState.focusMode = 'ecosystem';
    mobileGalaxyState.focusedCultureIndex = null;
    mobileGalaxyState.isTransitioning = true; // ← trigger camera return

    animateCameraTo(new THREE.Vector3(0, 14, 52), new THREE.Vector3(0, 0, 0), 850);

    document.getElementById('lkp-m-return-core')?.classList.remove('is-visible');

    const tip = document.getElementById('lkp-m-galaxy-tip');
    if (tip) tip.innerHTML = `<strong>Hōkū Kumu</strong><span>Tap a culture galaxy to zoom in · tap a star to open its lesson</span>`;
  }

  function animateCameraTo(position, target, duration = 800) {
    const THREE = mobileGalaxyState.THREE;
    const camera = mobileGalaxyState.camera;
    const controls = mobileGalaxyState.controls;
    if (!THREE || !camera || !controls) return;

    mobileGalaxyState.cameraTween = {
      startTime: performance.now(),
      duration,
      fromPosition: camera.position.clone(),
      toPosition: position.clone(),
      fromTarget: controls.target.clone(),
      toTarget: target.clone()
    };
  }

  function updateCameraTween() {
    const tween = mobileGalaxyState.cameraTween;
    const camera = mobileGalaxyState.camera;
    const controls = mobileGalaxyState.controls;
    if (!tween || !camera || !controls) return;

    const elapsed = performance.now() - tween.startTime;
    const raw = Math.min(1, elapsed / tween.duration);
    const ease = raw < 0.5 ? 4*raw*raw*raw : 1 - Math.pow(-2*raw+2,3)/2;

    camera.position.lerpVectors(tween.fromPosition, tween.toPosition, ease);
    controls.target.lerpVectors(tween.fromTarget, tween.toTarget, ease);

    if (raw >= 1) {
      mobileGalaxyState.cameraTween = null;
      mobileGalaxyState.isTransitioning = false; // ← done, release camera to user
    }
  }

  /* ── followFocusedCulture() REMOVED — was the source of camera-fighting-user bug ── */

  function resizeMobileThreeGalaxy() {
    const { renderer, camera } = mobileGalaxyState;
    const canvas = document.getElementById('lkp-m-three-galaxy');
    const wrap = canvas?.closest('.lkp-m-three-galaxy-wrap');
    if (!renderer || !camera || !wrap) return;
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  }

  /* ────────────────────────────────────────────────────────────────────────
     ECOSYSTEM PANEL
  ──────────────────────────────────────────────────────────────────────── */

  function buildEcosystemPanel() {
    const el = document.getElementById('lkp-m-ecosystem');
    const totalModules = CULTURES.reduce((sum,c) => sum+c.moduleCount, 0);
    const totalLessons = CULTURES.reduce((sum,c) => sum+c.lessonCount, 0);
    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Ikeverse Ecosystem</span>
        <h2>Culture Registry</h2>
        <p>This view is generated from your data file. More cultures become more orbits, cards, and galaxy nodes.</p>
      </div>
      <div class="lkp-m-eco-stats"><div><strong>${CULTURES.length}</strong><span>Cultures</span></div><div><strong>${totalModules}</strong><span>Modules</span></div><div><strong>${totalLessons}</strong><span>Lessons</span></div></div>
      <div class="lkp-m-eco-list">
        ${CULTURES.map(culture => `<article class="lkp-m-eco-card" style="--eco-color:${culture.color};--eco-bg:${culture.colorDim};--eco-border:${culture.colorBorder}"><div class="lkp-m-eco-card__icon">${culture.emoji}</div><div><span class="lkp-m-status ${culture.status==='live'?'is-live':'is-soon'}">${culture.status==='live'?'Live':'Coming Soon'}</span><h3>${escapeHTML(culture.name)}</h3><p>${escapeHTML(culture.tagline||'')}</p><small>${culture.moduleCount} modules · ${culture.lessonCount} lessons · theme: ${escapeHTML(culture.theme)}</small></div></article>`).join('')}
      </div>`;
  }

  /* ────────────────────────────────────────────────────────────────────────
     PROFILE PANEL
  ──────────────────────────────────────────────────────────────────────── */

  function readLocalJSON(key, fallback=null) {
    try { return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback)); } catch { return fallback; }
  }

  function buildProfilePanel() {
    const el = document.getElementById('lkp-m-profile');
    const completed = readLocalJSON('cv_completed', []);
    const cachedProfile = readLocalJSON('piko_profile_v1', null) || readLocalJSON('pikoverse_profile', null) || readLocalJSON('cv_profile', null);
    const mana = parseInt(localStorage.getItem('cv_mana')||'0', 10)||0;
    const totalLessons = [...CONCEPTS.values()].length;
    const pct = totalLessons ? Math.min(100, Math.round((completed.length/totalLessons)*100)) : 0;
    const displayName = cachedProfile?.display_name || cachedProfile?.name || cachedProfile?.handle || cachedProfile?.email || 'Guest Wayfinder';
    const role = cachedProfile?.role || 'user';
    const isAdmin = role==='admin'||role==='owner';

    el.innerHTML = `
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Profile</span>
        <h2>Your Wayfinder Profile</h2>
        <p>Your learning progress, ecosystem identity, and access across the Living Knowledge Platform and Ikeverse.</p>
      </div>
      <div class="lkp-m-profile-card ${isAdmin?'is-admin':''}">
        <div class="lkp-m-profile-card__avatar">${isAdmin?'👑':'👤'}</div>
        <div><span class="lkp-m-status ${isAdmin?'is-live':'is-soon'}">${isAdmin?'Admin Access':'User Profile'}</span><h3>${escapeHTML(displayName)}</h3><p>${isAdmin?'You have expanded control tools for managing lessons, pages, and ecosystem content.':'Sign in to sync progress across devices and unlock your full profile.'}</p></div>
      </div>
      <div class="lkp-m-profile-stats"><div><strong>${completed.length}</strong><span>Completed</span></div><div><strong>${mana}</strong><span>Mana</span></div><div><strong>${pct}%</strong><span>Progress</span></div></div>
      <div class="lkp-m-profile-progress"><span style="width:${pct}%"></span></div>
      <div class="lkp-m-profile-actions">
        <a href="profile.html" class="lkp-m-profile-btn">Open Full Profile</a>
        ${isAdmin?`<a href="admin.html" class="lkp-m-profile-btn lkp-m-profile-btn--admin">Open Admin Dashboard</a>`:''}
      </div>
      <div class="lkp-m-profile-ecosystem">
        <a href="https://www.pikoverse.xyz">Pikoverse</a>
        <a href="https://808cryptobeast.github.io/ikehub/">IkeHub</a>
        <a href="https://808cryptobeast.github.io/Ikestar/">IkeStar</a>
        <a href="${LESSONS_PATH}">Lessons</a>
      </div>
      <div class="lkp-m-profile-note"><strong>Admin security note:</strong> UI access should only reveal tools. Real edit permissions should be enforced by Supabase roles and Row Level Security.</div>`;
  }

  /* ────────────────────────────────────────────────────────────────────────
     BOTTOM SHEET
  ──────────────────────────────────────────────────────────────────────── */

  function buildBottomSheet() {
    document.getElementById('lkp-m-sheet-bg').addEventListener('click', closeSheet);
  }

  function openConceptSheet(culture, concept) {
    sheetOpen = true; sheetData = { culture, concept };
    const sheet = document.getElementById('lkp-m-sheet');
    const bg = document.getElementById('lkp-m-sheet-bg');
    const isSoon = culture.status !== 'live' || !concept.lessonId;

    sheet.innerHTML = `
      <div class="lkp-m-sheet__handle"></div>
      <button class="lkp-m-sheet__close" type="button" aria-label="Close">×</button>
      <div class="lkp-m-sheet__kicker" style="color:${culture.color}">${culture.emoji} ${escapeHTML(culture.name)}</div>
      <h3>${escapeHTML(concept.title||concept.label)}</h3>
      <p class="lkp-m-sheet__meta">${escapeHTML(concept.num||'')}${concept.readTime?`<span>·</span>${escapeHTML(concept.readTime)}`:''}${concept.moduleTitle?`<span>·</span>${escapeHTML(concept.moduleTitle)}`:''}
      </p>
      <p class="lkp-m-sheet__body">${escapeHTML(concept.desc||culture.intro||'')}</p>
      <div class="lkp-m-sheet__actions">
        ${isSoon?`<button class="lkp-m-sheet__cta is-disabled" type="button">Coming Soon</button>`:`<a class="lkp-m-sheet__cta" href="${lessonHref(concept.lessonId)}">Open Full Lesson →</a>`}
      </div>`;

    sheet.querySelector('.lkp-m-sheet__close').addEventListener('click', closeSheet);
    sheet.classList.add('is-open'); bg.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
  }

  function closeSheet() {
    sheetOpen = false; sheetData = null;
    const sheet = document.getElementById('lkp-m-sheet');
    const bg = document.getElementById('lkp-m-sheet-bg');
    if (!sheet || !bg) return;
    sheet.classList.remove('is-open'); bg.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
  }

  /* ────────────────────────────────────────────────────────────────────────
     BOTTOM NAV
     Tab type = stays inside mobile app
     Link type = navigates to real page
  ──────────────────────────────────────────────────────────────────────── */

  const NAV_TABS = [
    { id: 'home',      icon: 'fa-house',          label: 'Home',       type: 'tab' },
    { id: 'galaxies',  icon: 'fa-circle-nodes',   label: 'Lessons',    type: 'tab' },
    { id: 'chart',     icon: 'fa-star',            label: 'Kilo Hōkū', type: 'tab' },
    { id: 'ecosystem', icon: 'fa-database',        label: 'Data',       type: 'tab' },
    { id: 'about',     icon: 'fa-circle-info',     label: 'About',      type: 'link', href: 'about.html' },
    { id: 'profile',   icon: 'fa-user-astronaut',  label: 'Profile',    type: 'link', href: 'profile.html' }
  ];

  function buildBottomNav() {
    const nav = document.getElementById('lkp-m-nav');
    if (!nav) return;
    nav.innerHTML = NAV_TABS.map(item => {
      const activeClass = item.type==='tab' && item.id===activeTab ? 'is-active' : '';
      return `<button class="lkp-m-nav__btn ${activeClass}" data-tab="${item.id}" data-type="${item.type}" ${item.href?`data-href="${item.href}"`:''}  aria-label="${item.label}" type="button"><i class="fas ${item.icon} lkp-m-nav__icon" aria-hidden="true"></i><span class="lkp-m-nav__label">${item.label}</span></button>`;
    }).join('');

    nav.querySelectorAll('.lkp-m-nav__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const href = btn.dataset.href; const type = btn.dataset.type; const tab = btn.dataset.tab;
        if (type==='link' && href) { window.location.href = href; return; }
        switchTab(tab);
      });
    });
  }

  function switchTab(tabId) {
    const panel = document.querySelector(`.lkp-m-panel[data-panel="${tabId}"]`);
    if (!panel) {
      if (tabId==='about') { window.location.href='about.html'; return; }
      if (tabId==='profile') { window.location.href='profile.html'; return; }
      if (tabId==='lessons') { window.location.href='lessons.html'; return; }
      return;
    }

    activeTab = tabId;
    closeSheet();

    document.querySelectorAll('.lkp-m-panel').forEach(p => { p.classList.toggle('is-active', p.dataset.panel===tabId); });
    document.querySelectorAll('.lkp-m-nav__btn').forEach(btn => { const isTab=btn.dataset.type==='tab'; btn.classList.toggle('is-active', isTab && btn.dataset.tab===tabId); });

    if (tabId==='galaxies') {
      requestAnimationFrame(() => {
        const scroller = document.getElementById('lkp-m-galaxy-scroll');
        scroller?.querySelector(`[data-galaxy-card="${activeGalaxy}"]`)?.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
        updateDotsFromScroll();
      });
    }

    if (tabId==='chart') {
      requestAnimationFrame(() => {
        initMobileThreeLessonGalaxy();
        resizeMobileThreeGalaxy();
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────────────
     SWIPE GESTURE (horizontal between panels — kept minimal)
  ──────────────────────────────────────────────────────────────────────── */

  function initSwipe() {
    const panels = document.getElementById('lkp-m-panels');
    if (!panels) return;
    let startX = 0; let startY = 0; let isDragging = false;
    panels.addEventListener('touchstart', e => { if (e.touches.length!==1) return; startX=e.touches[0].clientX; startY=e.touches[0].clientY; isDragging=true; }, { passive:true });
    panels.addEventListener('touchend', e => {
      if (!isDragging) return; isDragging=false;
      const dx = e.changedTouches[0].clientX - startX; const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)*0.8) return;
      const tabOrder = ['home','galaxies','bridge','chart','ecosystem'];
      const cur = tabOrder.indexOf(activeTab);
      if (dx < 0 && cur < tabOrder.length-1) switchTab(tabOrder[cur+1]);
      if (dx > 0 && cur > 0) switchTab(tabOrder[cur-1]);
    }, { passive:true });
  }

  /* ────────────────────────────────────────────────────────────────────────
     INIT
  ──────────────────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.LKP_MOBILE_DATA = { cultures: CULTURES, galaxies: GALAXIES, bridge: BRIDGE, concepts: CONCEPTS };
})();