/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Mobile Experience  v2
   lkp-mobile.js

   PATH FIXES v2:
   ─ LESSONS_PATH uses IN_LKP_FOLDER logic — hash links resolve correctly
     from root (index.html) AND from inside LKP/ subfolder
   ─ profile.html / about.html use root-relative paths
   ─ Lesson cards: num · excerpt · readTime · module · culture · completion ✓

   GALAXY FIXES (original doc 12 improvements kept):
   ─ isTransitioning flag: camera lerp ONLY runs during explicit transitions
   ─ followFocusedCulture() removed — no camera-fighting-user-input
   ─ enablePan = true, maxDistance = 120 for free exploration
   ─ Moon orbit rings + satellite pivots per lesson star
   ─ Tapping a moon opens the same lesson sheet as tapping the star
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Path resolution ──────────────────────────────────────────────────────
     Determine whether this script is executing inside the LKP/ subfolder
     or at the repository root. All hrefs are built from this.
  ── */
  const IN_LKP_FOLDER =
    /\/LKP\/?$/i.test(location.pathname.replace(/[^/]*$/, '')) ||
    /\/LKP\//i.test(location.pathname);

  const ASSET_ROOT   = IN_LKP_FOLDER ? 'assets/images/' : 'LKP/assets/images/';
  const CSS_PATH     = IN_LKP_FOLDER ? 'css/lkp-mobile.css' : 'LKP/css/lkp-mobile.css';

  // ── KEY FIX: lessons.html lives at LKP/lessons.html from root ────────────
  const LESSONS_PATH = IN_LKP_FOLDER ? 'lessons.html' : 'LKP/lessons.html';

  // Profile and About are always at repo root
  const PROFILE_PATH = IN_LKP_FOLDER ? '../profile.html' : 'profile.html';
  const ABOUT_PATH   = IN_LKP_FOLDER ? '../about.html'   : 'about.html';
  const ADMIN_PATH   = IN_LKP_FOLDER ? 'admin.html'      : 'LKP/admin.html';

  function assetPath(file) { return ASSET_ROOT + file; }

  /* ── Data loading ─────────────────────────────────────────────────────── */
  function getSharedLessonData() {
    const d = window.CULTURALVERSE_DATA || window.LKP_DATA || window.IKEVERSE_DATA;
    if (d && Array.isArray(d.cultures)) {
      window.CULTURALVERSE_DATA = window.LKP_DATA = window.IKEVERSE_DATA = d;
      return d;
    }
    try {
      if (typeof CULTURALVERSE_DATA !== 'undefined' && Array.isArray(CULTURALVERSE_DATA.cultures)) {
        window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
        return CULTURALVERSE_DATA;
      }
    } catch {}
    console.warn('[LKP Mobile] CULTURALVERSE_DATA not found. Mobile lessons will not render.');
    return { cultures: [] };
  }

  const DATA = getSharedLessonData();

  /* ── Theme palette ────────────────────────────────────────────────────── */
  const THEME = {
    emerald: { color:'#3cb371', colorDim:'rgba(60,179,113,0.12)',  colorBorder:'rgba(60,179,113,0.30)',  glow:'rgba(60,179,113,0.28)'  },
    gold:    { color:'#f0c96a', colorDim:'rgba(240,201,106,0.12)', colorBorder:'rgba(240,201,106,0.34)', glow:'rgba(240,201,106,0.30)' },
    bridge:  { color:'#8fa0ff', colorDim:'rgba(143,160,255,0.13)', colorBorder:'rgba(143,160,255,0.34)', glow:'rgba(143,160,255,0.30)' },
    rust:    { color:'#d98545', colorDim:'rgba(217,133,69,0.12)',  colorBorder:'rgba(217,133,69,0.32)',  glow:'rgba(217,133,69,0.28)'  },
    amber:   { color:'#e4ad48', colorDim:'rgba(228,173,72,0.12)',  colorBorder:'rgba(228,173,72,0.32)',  glow:'rgba(228,173,72,0.28)'  },
    saffron: { color:'#ffb347', colorDim:'rgba(255,179,71,0.12)',  colorBorder:'rgba(255,179,71,0.32)',  glow:'rgba(255,179,71,0.28)'  },
    cyan:    { color:'#54c6ee', colorDim:'rgba(84,198,238,0.12)',  colorBorder:'rgba(84,198,238,0.30)',  glow:'rgba(84,198,238,0.28)'  },
    violet:  { color:'#8fa0ff', colorDim:'rgba(143,160,255,0.13)', colorBorder:'rgba(143,160,255,0.34)', glow:'rgba(143,160,255,0.30)' },
    default: { color:'#54c6ee', colorDim:'rgba(84,198,238,0.12)',  colorBorder:'rgba(84,198,238,0.30)',  glow:'rgba(84,198,238,0.28)'  }
  };

  const FALLBACK_CULTURES = [
    { id:'kanaka', name:'Kānaka Maoli', emoji:'🌺', tagline:'Hawaiian Indigenous Knowledge', theme:'emerald', status:'live', intro:'Hawaiian cosmology, wayfinding, land stewardship, language, and healing.', modules:[] },
    { id:'kemet',  name:'Kemet',        emoji:'☥',  tagline:'Ancient Egyptian Wisdom',       theme:'gold',    status:'live', intro:'Kemetic cosmology, Maʻat, sacred arts, science, and medicine.',        modules:[] },
    { id:'bridge', name:'The Bridge',   emoji:'🌐',  tagline:'Cross-Cultural Connections',   theme:'bridge',  status:'live', intro:'Shared cosmological and ethical patterns across living knowledge systems.', modules:[] }
  ];

  const RAW_CULTURES = DATA.cultures.length ? DATA.cultures : FALLBACK_CULTURES;

  let loaderFailsafeTimer = null;

  function injectLoader() {
    if (document.getElementById('lkp-loader')) return;

    const iconPrimary = assetPath('LKP-1.png');
    const iconAltA = assetPath('LKP-2.png');
    const iconAltB = IN_LKP_FOLDER ? '../LKP/assets/images/LKP-1.png' : 'LKP/assets/images/LKP-1.png';

    const el = document.createElement('div');
    el.id = 'lkp-loader';
    el.innerHTML = `
      <div class="lkp-loader__inner">
        <div class="lkp-loader__icon-wrap">
          <div class="lkp-loader__fill"></div>
          <img class="lkp-loader__icon" src="${iconPrimary}" alt="The Living Knowledge Platform" loading="eager" decoding="sync" onerror="if(this.dataset.fbk!=='1'){this.dataset.fbk='1';this.src='${iconAltA}';return;} if(this.dataset.fbk!=='2'){this.dataset.fbk='2';this.src='${iconAltB}';return;}" />
          <div class="lkp-loader__ring"></div>
          <div class="lkp-loader__upload"></div>
        </div>
        <div class="lkp-loader__title">Living Knowledge</div>
        <div class="lkp-loader__sub">Uploading the living archive&hellip;</div>
      </div>
    `;

    document.body.appendChild(el);

    if (loaderFailsafeTimer) window.clearTimeout(loaderFailsafeTimer);
    loaderFailsafeTimer = window.setTimeout(() => {
      dismissLoader();
    }, 6500);
  }

  function dismissLoader() {
    const el = document.getElementById('lkp-loader');
    if (!el) return;

    if (loaderFailsafeTimer) {
      window.clearTimeout(loaderFailsafeTimer);
      loaderFailsafeTimer = null;
    }

    el.classList.add('out');
    window.setTimeout(() => el.remove(), 720);
  }

  /* ── Utilities ────────────────────────────────────────────────────────── */
  function stripTags(html) { return String(html||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
  function escapeHTML(v)   { return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function shortTitle(t)   { return String(t||'').replace(/\s+[—\-]\s+.*$/,'').trim(); }
  function cultureImage(id){ const m={kanaka:'kanaka.png',kemet:'kemet.png',bridge:'bridge.png',dreamtime:'dreamtime.png',dogon:'dogon.png',vedic:'vedic.png'}; return assetPath(m[id]||id+'.png'); }

  /* ── Normalize ─────────────────────────────────────────────────────────── */
  function normalizeCulture(culture, index) {
    const theme = THEME[culture.theme] || THEME.default;
    const modules = Array.isArray(culture.modules) ? culture.modules : [];

    const concepts = modules.flatMap((module, mi) => {
      const lessons = Array.isArray(module.lessons) ? module.lessons : [];
      return lessons.map((lesson, li) => {
        const body = stripTags(lesson.content || module.desc || culture.intro || '');
        return {
          id: lesson.id,
          label: shortTitle(lesson.title || lesson.id),
          title: lesson.title || lesson.id,
          num: lesson.num || '',
          readTime: lesson.readTime || '',
          excerpt: lesson.excerpt || lesson.leadText || body.slice(0, 200),
          lessonId: lesson.id,
          moduleId: module.id,
          moduleTitle: module.title || 'Knowledge Module',
          moduleEmoji: module.emoji || culture.emoji || '✦',
          desc: body.slice(0, 240) + (body.length > 240 ? '…' : ''),
          major: li === 0 || (mi === 0 && li < 2),
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

  const CULTURES     = RAW_CULTURES.map(normalizeCulture);
  const GALAXIES     = CULTURES.filter(c => c.id !== 'bridge');
  const BRIDGE       = CULTURES.find(c => c.id === 'bridge') || null;
  const LIVE_CULTURES = CULTURES.filter(c => c.status === 'live');

  const CONCEPTS = new Map();
  CULTURES.forEach(culture => {
    culture.concepts.forEach(concept => {
      CONCEPTS.set(concept.id, { ...concept, cultureId:culture.id, cultureName:culture.name, cultureEmoji:culture.emoji, color:culture.color, colorDim:culture.colorDim, colorBorder:culture.colorBorder, glow:culture.glow });
    });
  });

  /* ── App state ────────────────────────────────────────────────────────── */
  let activeTab    = 'home';
  let activeGalaxy = 0;
  let sheetOpen    = false;
  let sheetData    = null;

  const mobileGalaxyState = {
    initialized: false,
    THREE: null, scene:null, camera:null, renderer:null, controls:null,
    raycaster:null, pointer:null,
    nodes:[], cultureGroups:[], cultureCores:[], dustSystems:[], labels:[], orbitTrails:[],
    nebulaSprites: [],
    lessonPivots: [],
    hokuKumu:null, hokuGlow:null,
    focusMode: 'ecosystem',
    focusedCultureIndex: null,
    cameraTween: null,
    isTransitioning: false,   // ← camera lerp only during explicit transitions
    frameId: null
  };

  /* ── Lesson routing (KEY FIX) ─────────────────────────────────────────── */
  function lessonHref(lessonId) {
    // Hash-only — GitHub Pages 404s on query params even when the file exists
    return `${LESSONS_PATH}#${encodeURIComponent(lessonId)}`;
  }

  function getFirstLessonForCulture(cultureId) {
    const culture = CULTURES.find(c => c.id === cultureId);
    if (!culture) return null;
    for (const mod of culture.modules || []) {
      for (const lesson of mod.lessons || []) { return { culture, module:mod, lesson }; }
    }
    return null;
  }

  function cultureHref(cultureId) {
    const first = getFirstLessonForCulture(cultureId);
    return first ? lessonHref(first.lesson.id) : LESSONS_PATH;
  }

  /* ── Compass image processor ──────────────────────────────────────────── */
  function waitForImageReady(img) {
    return new Promise(resolve => {
      if (!img) return resolve(false);
      if (img.complete && img.naturalWidth > 0) { resolve(true); return; }
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  function processCompassToGoldDataURL(img) {
    const sourceW = img.naturalWidth || img.width || 1024;
    const sourceH = img.naturalHeight || img.height || 1024;
    const size = Math.min(sourceW, sourceH);  // crop to shorter dim (excludes caption)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently:true });
    canvas.width = canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    // Centre-crop
    ctx.drawImage(img, (sourceW-size)/2, (sourceH-size)/2, size, size, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const goldDark={r:112,g:76,b:24}; const goldMid={r:216,g:164,b:66}; const goldHi={r:255,g:225,b:132};
    let kept = 0;
    for (let i=0; i<data.length; i+=4) {
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
      if (a===0) continue;
      const max=Math.max(r,g,b),min=Math.min(r,g,b),sat=max-min;
      const lum=(r*0.299+g*0.587+b*0.114)/255;
      const isWhitePaper=r>=178&&g>=178&&b>=178&&lum>=0.72&&sat<=58;
      const isWhiteHalo=r>=152&&g>=152&&b>=152&&lum>=0.62&&sat<=66;
      if (isWhitePaper){data[i+3]=0;continue;}
      if (isWhiteHalo){const fade=Math.min(1,Math.max(0,(lum-0.62)/0.14));data[i+3]=Math.round(a*(1-fade));if(data[i+3]<=8){data[i+3]=0;continue;}}
      const inkStr=Math.min(1,Math.max(0.26,(0.92-lum)/0.72));
      const highlight=Math.min(1,Math.max(0,(lum-0.12)/0.55));
      const baseR=goldDark.r+(goldMid.r-goldDark.r)*inkStr;
      const baseG=goldDark.g+(goldMid.g-goldDark.g)*inkStr;
      const baseB=goldDark.b+(goldMid.b-goldDark.b)*inkStr;
      data[i]=Math.round(baseR+(goldHi.r-baseR)*highlight*0.36);
      data[i+1]=Math.round(baseG+(goldHi.g-baseG)*highlight*0.36);
      data[i+2]=Math.round(baseB+(goldHi.b-baseB)*highlight*0.36);
      const alphaBoost=Math.min(1,Math.max(0.35,(0.90-lum)/0.55));
      data[i+3]=Math.max(data[i+3],Math.round(255*alphaBoost));
      kept++;
    }
    ctx.putImageData(imageData, 0, 0);
    const glowC=document.createElement('canvas'),glowCtx=glowC.getContext('2d');
    glowC.width=glowC.height=size; glowCtx.clearRect(0,0,size,size); glowCtx.drawImage(canvas,0,0);
    glowCtx.globalCompositeOperation='source-in'; glowCtx.fillStyle='rgba(255,205,92,0.72)'; glowCtx.fillRect(0,0,size,size);
    const finalC=document.createElement('canvas'),finalCtx=finalC.getContext('2d');
    finalC.width=finalC.height=size; finalCtx.clearRect(0,0,size,size);
    finalCtx.filter='blur(1.2px)'; finalCtx.globalAlpha=0.42; finalCtx.drawImage(glowC,0,0);
    finalCtx.filter='none'; finalCtx.globalAlpha=1; finalCtx.drawImage(canvas,0,0);
    if (kept < size*size*0.001) { return img.src; }
    return finalC.toDataURL('image/png');
  }

  async function activateMobileCompassImage(scope=document) {
    const img = scope.querySelector('#lkp-m-compass-img');
    if (!img) return;
    const ready = await waitForImageReady(img);
    if (!ready) return;
    try { const cleaned = processCompassToGoldDataURL(img); img.src=cleaned; img.classList.add('is-processed'); } catch (err) { console.warn('[LKP Mobile] Compass processing failed:', err.message); }
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */
  function boot() {
    injectMobileCSS();
    buildShell();
    injectLoader();

    try {
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
      requestAnimationFrame(() => dismissLoader());
    } catch (err) {
      console.error('[LKP Mobile] Boot failed:', err);
      dismissLoader();
    }
  }

  function injectMobileCSS() {
    if (document.querySelector('link[data-lkp-mobile-css="true"]')) return;
    const link = document.createElement('link');
    link.rel='stylesheet'; link.href=CSS_PATH; link.dataset.lkpMobileCss='true';
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
    const colors = ['#9ed8ff','#ffffff','#ffe8d0','#b48cff','#ffd0aa','#54c6ee'];
    let out = `<div class="lkp-m-nebula lkp-m-nebula--one"></div><div class="lkp-m-nebula lkp-m-nebula--two"></div>`;
    for (let i=0; i<84; i++) {
      const x=Math.random()*100,y=Math.random()*100,s=1+Math.random()*2.8;
      const dur=2.8+Math.random()*5.5,del=Math.random()*6,col=colors[Math.floor(Math.random()*colors.length)];
      out+=`<span class="lkp-m-star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:${col};animation-duration:${dur}s;animation-delay:${del}s"></span>`;
    }
    el.innerHTML = out;
  }

  /* ── Home panel ───────────────────────────────────────────────────────── */
  function openCultureFromButton(btn) {
    const tab=btn.dataset.tab; const gi=btn.dataset.galaxy;
    if (gi!==undefined&&gi!=='') activeGalaxy=Math.max(0,Math.min(GALAXIES.length-1,parseInt(gi,10)));
    switchTab(tab||'home');
  }

  function bindTabButtons(scope) {
    scope.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>openCultureFromButton(btn)));
  }

  function buildHomePills() {
    return CULTURES.map(c=>{
      const isBridge=c.id==='bridge';const gi=GALAXIES.findIndex(g=>g.id===c.id);const tab=isBridge?'bridge':'galaxies';
      return `<button class="lkp-m-pill lkp-m-pill--dynamic" style="--pill-color:${c.color};--pill-bg:${c.colorDim};--pill-border:${c.colorBorder}" data-tab="${tab}" ${!isBridge&&gi>=0?`data-galaxy="${gi}"`:''}><span>${c.emoji}</span> ${escapeHTML(c.name)}</button>`;
    }).join('');
  }

  function buildCompassOrbitNodes() {
    const total=Math.max(1,CULTURES.length);
    const nodes=CULTURES.map((c,i)=>{
      const angle=-90+(360/total)*i;const isBridge=c.id==='bridge';const gi=GALAXIES.findIndex(g=>g.id===c.id);const tab=isBridge?'bridge':'galaxies';
      const disabled=c.status!=='live'&&!c.concepts.length;
      return `<button class="lkp-m-orbit-node ${disabled?'is-soon':''}" style="--orbit-color:${c.color};--orbit-bg:${c.colorDim};--orbit-angle:${angle}deg;--orbit-delay:${(-i*0.65).toFixed(2)}s" data-tab="${tab}" ${!isBridge&&gi>=0?`data-galaxy="${gi}"`:''} aria-label="Open ${escapeHTML(c.name)}"><span class="lkp-m-orbit-node__halo"></span><img src="${c.image}" class="lkp-m-orbit-node__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="lkp-m-orbit-node__emoji" style="display:none">${c.emoji}</span></button>`;
    }).join('');
    const sparks=Array.from({length:18},(_,i)=>`<span class="lkp-m-orbit-spark" style="--spark-angle:${Math.round((360/18)*i)}deg;--spark-delay:${(-i*0.37).toFixed(2)}s"></span>`).join('');
    return `${nodes}${sparks}`;
  }

  function buildHomeQuickButtons() {
    const btns=CULTURES.map(c=>{
      const isBridge=c.id==='bridge';const gi=GALAXIES.findIndex(g=>g.id===c.id);const tab=isBridge?'bridge':'galaxies';
      const count=c.lessonCount;const label=c.status==='live'?`${count} ${count===1?'lesson':'lessons'}`:'Coming soon';
      return `<button class="lkp-m-quick-btn lkp-m-quick-btn--dynamic" style="--quick-color:${c.color};--quick-bg:${c.colorDim};--quick-border:${c.colorBorder}" data-tab="${tab}" ${!isBridge&&gi>=0?`data-galaxy="${gi}"`:''}>
        <img src="${c.image}" class="lkp-m-quick-btn__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
        <span class="lkp-m-quick-btn__glyph" style="display:none">${c.emoji}</span>
        <span class="lkp-m-quick-btn__label">${escapeHTML(c.name)}</span>
        <span class="lkp-m-quick-btn__sub">${escapeHTML(label)}</span>
      </button>`;
    }).join('');
    return `${btns}<button class="lkp-m-quick-btn lkp-m-quick-btn--dynamic lkp-m-quick-btn--chart" style="--quick-color:var(--m-cyan);--quick-bg:rgba(84,198,238,0.10);--quick-border:rgba(84,198,238,0.26)" data-tab="chart"><span class="lkp-m-quick-btn__glyph">✦</span><span class="lkp-m-quick-btn__label">Ka ʻIke Hōkū</span><span class="lkp-m-quick-btn__sub">Living Knowledge Galaxy</span></button>`;
  }

  function buildContinueLearningCard() {
    let completed=[];
    try{completed=JSON.parse(localStorage.getItem('cv_completed')||'[]');}catch{completed=[];}
    const allLiveLessons=CULTURES.filter(c=>c.status==='live').flatMap(culture=>(culture.modules||[]).flatMap(mod=>(mod.lessons||[]).map(lesson=>({culture,mod,lesson}))));
    const next=allLiveLessons.find(item=>!completed.includes(item.lesson.id))||allLiveLessons[0];
    if (!next) return '';
    return `<a class="lkp-m-continue-card" href="${lessonHref(next.lesson.id)}" style="--continue-color:${next.culture.color};--continue-bg:${next.culture.colorDim};--continue-border:${next.culture.colorBorder}">
      <span class="lkp-m-continue-card__eyebrow">Continue Learning</span>
      <strong>${next.culture.emoji} ${escapeHTML(next.lesson.title||next.lesson.id)}</strong>
      <small>${escapeHTML(next.culture.name)} · ${escapeHTML(next.mod.title||'Module')} · ${escapeHTML(next.lesson.readTime||'Lesson')}</small>
    </a>`;
  }

  function buildHome() {
    const el=document.getElementById('lkp-m-home');
    const liveCount=LIVE_CULTURES.length;const totalCount=CULTURES.length;
    el.innerHTML=`
      <div class="lkp-m-home">
        <div class="lkp-m-home__brand">
          <div class="lkp-m-home__glyph">◈</div>
          <h1 class="lkp-m-home__title">Living<br><em>Knowledge</em></h1>
          <p class="lkp-m-home__sub">${liveCount} live ${liveCount===1?'galaxy':'galaxies'}, ${totalCount} total culture orbits. Every lesson is linked to the full lesson page.</p>
        </div>
        <div class="lkp-m-home__pills">${buildHomePills()}</div>
        <div class="lkp-m-home-galaxy-wrap" style="position:relative;width:100%;height:240px;margin:1.5rem 0;border-radius:12px;overflow:hidden;background:linear-gradient(135deg,rgba(15,3,10,0.8) 0%,rgba(20,8,18,0.9) 100%);border:1px solid rgba(84,198,238,0.12);">
          <canvas id="lkp-m-home-galaxy" style="display:block;width:100%;height:100%;" aria-label="Living Knowledge Galaxy"></canvas>
          <div style="position:absolute;bottom:8px;right:8px;font-size:10px;color:rgba(240,201,106,0.5);font-weight:600;">Tap or drag to explore</div>
        </div>
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
    requestAnimationFrame(()=>initMobileHomeGalaxy());
  }

  /* ── Lesson row renderer (RICHER INFO) ────────────────────────────────── */
  function buildLessonRow(lesson, culture, mod) {
    // Resolve completion from LKPRewards if available, else localStorage
    let done = false;
    try { done = window.LKPRewards?.isCompleted?.(lesson.id) || false; } catch {}
    if (!done) {
      try { done = JSON.parse(localStorage.getItem('cv_completed')||'[]').includes(lesson.id); } catch {}
    }

    const body = stripTags(lesson.content || '').slice(0, 160);
    const excerpt = lesson.excerpt || lesson.leadText || (body ? body + '…' : '');

    return `
      <a class="lkp-m-lesson-row ${done?'is-done':''}"
         href="${lessonHref(lesson.id)}"
         style="--lesson-color:${culture.color};--lesson-bg:${culture.colorDim};--lesson-border:${culture.colorBorder}">
        <div class="lkp-m-lesson-row__head">
          ${lesson.num?`<span class="lkp-m-lesson-row__num">${escapeHTML(lesson.num)}</span>`:''}
          ${done?`<span class="lkp-m-lesson-row__done" title="Completed">✓</span>`:''}
        </div>
        <div class="lkp-m-lesson-row__body">
          <strong>${escapeHTML(lesson.title||lesson.id)}</strong>
          ${excerpt?`<p class="lkp-m-lesson-row__excerpt">${escapeHTML(excerpt)}</p>`:''}
          <div class="lkp-m-lesson-row__meta">
            ${lesson.readTime?`<span>⏱ ${escapeHTML(lesson.readTime)}</span>`:''}
            <span>${escapeHTML(culture.emoji)} ${escapeHTML(culture.name)}</span>
          </div>
        </div>
        <span class="lkp-m-lesson-row__arrow">→</span>
      </a>`;
  }

  function buildModuleBlocks(culture) {
    if (!culture.modules?.length) {
      return `<div class="lkp-m-soon-card"><span>${culture.emoji}</span><strong>Coming Soon</strong><p>${escapeHTML(culture.tagline||culture.intro||'This culture orbit is ready for future lessons.')}</p></div>`;
    }
    return culture.modules.map(mod => {
      const lessons = (mod.lessons||[]).map(lesson => buildLessonRow(lesson, culture, mod)).join('');
      return `
        <section class="lkp-m-module-block">
          <div class="lkp-m-module-block__head">
            <span>${mod.emoji||culture.emoji||'✦'}</span>
            <div>
              <strong>${escapeHTML(mod.title||'Knowledge Module')}</strong>
              <small>${escapeHTML(mod.desc||'')}</small>
            </div>
          </div>
          <div class="lkp-m-module-block__lessons">
            ${lessons||`<div class="lkp-m-empty-note">Lessons coming soon.</div>`}
          </div>
        </section>`;
    }).join('');
  }

  /* ── Galaxies panel ───────────────────────────────────────────────────── */
  function buildGalaxiesPanel() {
    const el=document.getElementById('lkp-m-galaxies');
    el.innerHTML=`
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Living Lessons</span>
        <h2>Choose a Culture</h2>
        <p>Every lesson card links directly to the full lesson page.</p>
      </div>
      <div id="lkp-m-galaxy-scroll" class="lkp-m-galaxy-scroll">
        ${GALAXIES.map((c,i)=>buildGalaxyCard(c,i)).join('')}
      </div>
      <div class="lkp-m-dots" aria-hidden="true">
        ${GALAXIES.map((_,i)=>`<span class="lkp-m-dot ${i===activeGalaxy?'is-active':''}"></span>`).join('')}
      </div>`;
  }

  function buildGalaxyCard(culture, index) {
    const isSoon=culture.status!=='live'||!culture.modules?.length;
    return `
      <article class="lkp-m-galaxy-card ${isSoon?'is-soon':''}" data-galaxy-card="${index}"
        style="--galaxy-color:${culture.color};--galaxy-bg:${culture.colorDim};--galaxy-border:${culture.colorBorder};--galaxy-glow:${culture.glow}">
        <div class="lkp-m-galaxy-card__top">
          <div class="lkp-m-galaxy-card__icon">
            <img src="${culture.image}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
            <span style="display:none">${culture.emoji}</span>
          </div>
          <div>
            <span class="lkp-m-status ${culture.status==='live'?'is-live':'is-soon'}">${culture.status==='live'?'Live':'Coming Soon'}</span>
            <h3>${escapeHTML(culture.name)}</h3>
            <p>${escapeHTML(culture.tagline||'')}</p>
          </div>
        </div>
        <div class="lkp-m-galaxy-card__intro">${escapeHTML(culture.intro||'')}</div>
        <div class="lkp-m-galaxy-card__stats">
          <span><strong>${culture.moduleCount}</strong> modules</span>
          <span><strong>${culture.lessonCount}</strong> lessons</span>
          <span><strong>${escapeHTML(culture.theme)}</strong> theme</span>
        </div>
        <a class="lkp-m-enter-lessons" href="${cultureHref(culture.id)}"
          style="--enter-color:${culture.color};--enter-bg:${culture.colorDim};--enter-border:${culture.colorBorder}">
          Enter ${escapeHTML(culture.name)} Lessons →
        </a>
        <div class="lkp-m-module-list">${buildModuleBlocks(culture)}</div>
      </article>`;
  }

  function updateDotsFromScroll() {
    const scroller=document.getElementById('lkp-m-galaxy-scroll');if(!scroller)return;
    const cards=[...scroller.querySelectorAll('[data-galaxy-card]')];if(!cards.length)return;
    const center=scroller.scrollLeft+scroller.clientWidth/2;
    let best=0,bestDist=Infinity;
    cards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(d<bestDist){bestDist=d;best=i;}});
    activeGalaxy=best;
    document.querySelectorAll('.lkp-m-dot').forEach((d,i)=>d.classList.toggle('is-active',i===activeGalaxy));
  }

  /* ── Bridge panel ─────────────────────────────────────────────────────── */
  function buildBridgePanel() {
    const el=document.getElementById('lkp-m-bridge');
    const bridge=BRIDGE;
    if (!bridge){el.innerHTML=`<div class="lkp-m-section-head"><span class="lkp-m-eyebrow">Bridge</span><h2>No Bridge Data Yet</h2><p>Add a culture with id: 'bridge' to lkp-data.js.</p></div>`;return;}
    el.innerHTML=`
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">${bridge.emoji} ${escapeHTML(bridge.tagline||'Cross-Cultural Connections')}</span>
        <h2>${escapeHTML(bridge.name)}</h2>
        <p>${escapeHTML(bridge.intro||'')}</p>
      </div>
      <article class="lkp-m-galaxy-card lkp-m-galaxy-card--bridge"
        style="--galaxy-color:${bridge.color};--galaxy-bg:${bridge.colorDim};--galaxy-border:${bridge.colorBorder};--galaxy-glow:${bridge.glow}">
        <div class="lkp-m-galaxy-card__stats">
          <span><strong>${bridge.moduleCount}</strong> modules</span>
          <span><strong>${bridge.lessonCount}</strong> lessons</span>
        </div>
        <a class="lkp-m-enter-lessons" href="${cultureHref(bridge.id)}"
          style="--enter-color:${bridge.color};--enter-bg:${bridge.colorDim};--enter-border:${bridge.colorBorder}">
          Enter Bridge Lessons →
        </a>
        <div class="lkp-m-module-list">${buildModuleBlocks(bridge)}</div>
      </article>`;
  }

  /* ── Ka ʻIke Hōkū — Galaxy panel ──────────────────────────────────────── */
  function buildKiloHokuPanel() {
    const el=document.getElementById('lkp-m-chart');
    el.innerHTML=`
      <div class="lkp-m-section-head">
        <span class="lkp-m-eyebrow">Kilo Hōkū — Living Knowledge Galaxy</span>
        <h2>Ka ʻIke Hōkū</h2>
        <p>Culture galaxies orbit the Hōkū Kumu. Tap a culture core to zoom in. Tap any lesson star or orbiting moon to open its lesson. Pinch to zoom · drag to rotate · two-finger pan.</p>
      </div>
      <div class="lkp-m-three-galaxy-wrap">
        <canvas id="lkp-m-three-galaxy" class="lkp-m-three-galaxy" aria-label="Ka ʻIke Hōkū — Living Knowledge Galaxy"></canvas>
        <button id="lkp-m-return-core" class="lkp-m-return-core" type="button">← Return to Hōkū Kumu</button>
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
        ${CULTURES.map((c,i)=>`<button class="lkp-m-galaxy-legend__item" data-focus-culture="${i}" style="--legend-color:${c.color};--legend-bg:${c.colorDim};--legend-border:${c.colorBorder}"><span>${c.emoji}</span><strong>${escapeHTML(c.name)}</strong><small>${c.lessonCount} lessons</small></button>`).join('')}
      </div>`;

    document.getElementById('lkp-m-return-core')?.addEventListener('click', returnToHokuKumu);
    el.querySelectorAll('[data-focus-culture]').forEach(btn=>{
      btn.addEventListener('click',()=>focusCultureGalaxy(parseInt(btn.dataset.focusCulture,10)));
    });

    requestAnimationFrame(()=>initMobileThreeLessonGalaxy());
  }

  /* ── Three.js galaxy init ─────────────────────────────────────────────── */
  async function initMobileThreeLessonGalaxy() {
    const canvas=document.getElementById('lkp-m-three-galaxy');
    const wrap=canvas?.closest('.lkp-m-three-galaxy-wrap');
    if (!canvas||!wrap) return;
    if (mobileGalaxyState.initialized){resizeMobileThreeGalaxy();return;}

    const THREE=await import('https://esm.sh/three@0.160.0');
    const {OrbitControls}=await import('https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js');

    mobileGalaxyState.THREE=THREE;mobileGalaxyState.initialized=true;

    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x01030a,0.012);
    const camera=new THREE.PerspectiveCamera(62,wrap.clientWidth/wrap.clientHeight,0.1,320);
    camera.position.set(0,14,52);

    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(wrap.clientWidth,wrap.clientHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.25;

    const controls=new OrbitControls(camera,canvas);
    controls.enablePan=true;controls.enableZoom=true;controls.enableDamping=true;
    controls.dampingFactor=0.08;controls.rotateSpeed=0.42;controls.zoomSpeed=0.65;
    controls.minDistance=4;controls.maxDistance=120;
    controls.autoRotate=true;controls.autoRotateSpeed=0.24;
    controls.target.set(0,0,0);
    if ('zoomToCursor' in controls) controls.zoomToCursor=true;

    canvas.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();},{passive:false});

    const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();
    mobileGalaxyState.scene=scene;mobileGalaxyState.camera=camera;mobileGalaxyState.renderer=renderer;
    mobileGalaxyState.controls=controls;mobileGalaxyState.raycaster=raycaster;mobileGalaxyState.pointer=pointer;
    mobileGalaxyState.nodes=[];mobileGalaxyState.cultureGroups=[];mobileGalaxyState.cultureCores=[];
    mobileGalaxyState.dustSystems=[];mobileGalaxyState.labels=[];mobileGalaxyState.orbitTrails=[];
    mobileGalaxyState.nebulaSprites=[];mobileGalaxyState.lessonPivots=[];

    scene.add(new THREE.AmbientLight(0xffffff,0.42));
    const key=new THREE.PointLight(0xffdd9a,2.8,180);key.position.set(0,42,34);scene.add(key);
    const cyanL=new THREE.PointLight(0x54c6ee,1.35,130);cyanL.position.set(-38,22,-20);scene.add(cyanL);
    const violetL=new THREE.PointLight(0x8fa0ff,1.1,120);violetL.position.set(32,14,28);scene.add(violetL);

    buildMobileKiloHokuSystem(scene,THREE);
    bindMobileGalaxyEvents(canvas);
    window.addEventListener('resize',resizeMobileThreeGalaxy,{passive:true});

    function animate(){
      mobileGalaxyState.frameId=requestAnimationFrame(animate);
      const t=performance.now()*0.001;
      const dist=camera.position.distanceTo(controls.target);
      const zoomBoost=Math.min(3.05,Math.max(1,(dist-18)/18));

      updateCameraTween(); // ← only moves camera when isTransitioning = true

      if (mobileGalaxyState.hokuKumu){mobileGalaxyState.hokuKumu.rotation.y+=0.008;mobileGalaxyState.hokuKumu.rotation.x=Math.sin(t*0.36)*0.08;}
      if (mobileGalaxyState.hokuGlow){mobileGalaxyState.hokuGlow.material.opacity=0.34+Math.sin(t*1.1)*0.08;}

      mobileGalaxyState.cultureGroups.forEach((group,i)=>{
        const d=group.userData;const isFocused=mobileGalaxyState.focusedCultureIndex===i;
        if (mobileGalaxyState.focusMode==='ecosystem'){
          d.orbitAngle+=d.orbitSpeed;
          group.position.x=Math.cos(d.orbitAngle)*d.orbitRadius;
          group.position.z=Math.sin(d.orbitAngle)*d.orbitRadius;
          group.position.y=d.baseY+Math.sin(t*0.32+i)*0.45;
        }
        group.rotation.y+=isFocused?0.0018:(d.rotationSpeed||0.00042);
        group.rotation.x=Math.sin(t*0.18+i)*0.035;
      });

      // ── NO followFocusedCulture() — that caused camera-fighting-input bug ──

      mobileGalaxyState.dustSystems.forEach((d,i)=>{d.rotation.y+=0.00045+i*0.00006;d.rotation.z+=0.00018;});

      mobileGalaxyState.nebulaSprites.forEach((neb, i) => {
        const phase = neb.userData.phase || i;
        const baseOpacity = neb.userData.baseOpacity || 0.28;
        neb.rotation.z += neb.userData.spin || 0.0002;
        neb.material.opacity = baseOpacity + Math.sin(t * 0.45 + phase) * 0.06;
      });

      mobileGalaxyState.lessonPivots.forEach((pivot, i) => {
        const d = pivot.userData;
        d.angle += d.speed;
        const x = Math.cos(d.angle) * d.radius;
        const z = Math.sin(d.angle) * d.radius;
        const y = d.baseY + Math.sin(t * 0.6 + d.phase) * d.wobble;
        pivot.position.set(x, y, z);
        pivot.rotation.y += d.spin;
      });

      mobileGalaxyState.labels.forEach(label=>{
        const inCM=mobileGalaxyState.focusMode==='culture';
        const isFL=label.userData.cultureIndex===mobileGalaxyState.focusedCultureIndex;
        label.material.opacity=inCM?(isFL?0.84:0.18):0.72;
      });

      mobileGalaxyState.nodes.forEach((node,i)=>{
        const orb = node.mesh.userData.orbit;
        if (orb) {
          orb.angle += orb.speed;
          const x = Math.cos(orb.angle) * orb.radius;
          const z = Math.sin(orb.angle) * orb.radius;
          const y = orb.baseY + Math.sin(t * 0.55 + orb.phase) * 0.12;
          node.mesh.position.set(x, y, z);
          if (node.glow) node.glow.position.copy(node.mesh.position);
        }
        node.mesh.rotation.y+=0.01;node.mesh.rotation.x=Math.sin(t+i*0.37)*0.18;
        const pulse=1+Math.sin(t*1.25+i)*0.045;const nodeScale=node.baseScale*pulse*zoomBoost;
        node.mesh.scale.setScalar(nodeScale);
        if (node.glow){const bs=node.glow.userData.baseSize||1;node.glow.scale.setScalar(bs*zoomBoost);node.glow.material.opacity=node.isHovered?0.95:Math.min(0.88,0.42+zoomBoost*0.09+Math.sin(t*1.4+i)*0.10);}
        if (node.satellitePivots?.length){node.satellitePivots.forEach((pivot,pi)=>{pivot.rotation.y+=pivot.userData.speed||(0.0042+pi*0.0016);pivot.rotation.x+=pivot.userData.wobble||0.00018;});}
      });

      controls.update();renderer.render(scene,camera);
    }
    animate();
  }

  /* ── Build galaxy scene ───────────────────────────────────────────────── */
  function buildMobileKiloHokuSystem(scene,THREE){
    addMobileBackgroundStars(scene,THREE);makeHokuKumuCore(scene,THREE);addPikoOrbitTrails(scene,THREE);buildMobileGalaxyStars(scene,THREE);
  }

  function addMobileBackgroundStars(scene,THREE){
    const n=1100;const p=new Float32Array(n*3);const c=new Float32Array(n*3);
    const gold=new THREE.Color('#f0c96a'),cyan=new THREE.Color('#54c6ee'),white=new THREE.Color('#dbefff');
    for(let i=0;i<n;i++){const r=48+Math.random()*82;const theta=Math.random()*Math.PI*2;const phi=Math.acos(Math.random()*2-1);p[i*3]=r*Math.sin(phi)*Math.cos(theta);p[i*3+1]=r*Math.cos(phi)*0.72;p[i*3+2]=r*Math.sin(phi)*Math.sin(theta);const mixed=white.clone();if(Math.random()>0.72)mixed.lerp(gold,0.45);if(Math.random()>0.82)mixed.lerp(cyan,0.35);c[i*3]=mixed.r;c[i*3+1]=mixed.g;c[i*3+2]=mixed.b;}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('color',new THREE.BufferAttribute(c,3));
    scene.add(new THREE.Points(geo,new THREE.PointsMaterial({size:0.12,vertexColors:true,transparent:true,opacity:0.68,depthWrite:false})));
  }

  function makeHokuKumuCore(scene,THREE){
    const g=new THREE.Group();g.name='Hōkū Kumu';scene.add(g);
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.45,2),new THREE.MeshPhysicalMaterial({color:0xf0c96a,emissive:0xf0c96a,emissiveIntensity:1.1,metalness:0.12,roughness:0.18,transparent:true,opacity:0.98})));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.74,24,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.26})));
    const glow=makeMobileGlowSprite(THREE,'#f0c96a',8.2,0.38);g.add(glow);g.add(makeMobileGlowSprite(THREE,'#54c6ee',5.8,0.18));
    const label=makeMobileTextSprite(THREE,'Hōkū Kumu','#f0c96a');label.position.set(0,2.8,0);label.scale.set(5.2,1.2,1);g.add(label);
    const rA=makePikoRing(THREE,2.15,'#f0c96a',0.28);rA.rotation.x=Math.PI/2;g.add(rA);
    const rB=makePikoRing(THREE,2.72,'#54c6ee',0.16);rB.rotation.x=Math.PI/2.45;g.add(rB);
    mobileGalaxyState.hokuKumu=g;mobileGalaxyState.hokuGlow=glow;
  }

  function makePikoRing(THREE,radius,color,opacity){
    const pts=[];for(let i=0;i<=128;i++){const a=(i/128)*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a)*radius,0));}
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:new THREE.Color(color),transparent:true,opacity,depthWrite:false}));
  }

  function addPikoOrbitTrails(scene,THREE){
    const n=Math.max(1,CULTURES.length);const baseR=Math.min(28,13+n*2.2);
    CULTURES.forEach((c,i)=>{const r=baseR+(i%3)*0.55;const ring=makeFlatOrbitTrail(THREE,r,c.color||'#f0c96a',i%2?0.08:0.11);ring.rotation.x=Math.PI/2;scene.add(ring);mobileGalaxyState.orbitTrails.push(ring);});
  }

  function makeFlatOrbitTrail(THREE,radius,color,opacity){
    const pts=[];for(let i=0;i<=192;i++){const a=(i/192)*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a)*radius,0));}
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:new THREE.Color(color),transparent:true,opacity,depthWrite:false}));
  }

  function buildMobileGalaxyStars(scene,THREE){
    const n=Math.max(1,CULTURES.length);const galaxyR=Math.min(36,16+n*2.8);

    CULTURES.forEach((culture,ci)=>{
      // Each nebula (culture) has unique orbital parameters
      const angle=-Math.PI/2+(Math.PI*2*ci)/n;
      // More varied orbital radius for each nebula
      const orbitalRadiusOffset=(((ci*7)%11)-5)*0.35; // Creates more varied distribution
      const orbitalRadius=galaxyR+orbitalRadiusOffset+((ci%4)-1.5)*0.95;
      // Each nebula spins at different speed
      const uniqueOrbitalSpeed=0.00022+ci*0.00003+Math.sin(ci*0.8)*0.00008;
      
      const cx=Math.cos(angle)*galaxyR,cz=Math.sin(angle)*galaxyR,cy=culture.id==='bridge'?4:0;
      const group=new THREE.Group();
      group.position.set(cx,cy,cz);
      group.userData={
        rotationSpeed:0.00032+ci*0.00006+Math.cos(ci*0.6)*0.00008,
        orbitAngle:angle,
        orbitSpeed:uniqueOrbitalSpeed,
        orbitRadius:orbitalRadius,
        baseY:cy,
        cultureIndex:ci
      };
      scene.add(group);mobileGalaxyState.cultureGroups.push(group);

      const color=new THREE.Color(culture.color||'#54c6ee');

      // Planet (culture core) with size variation based on content
      const coreSize=0.65+Math.min(0.25,culture.lessonCount*0.008);
      const core=new THREE.Mesh(new THREE.SphereGeometry(coreSize,24,24),new THREE.MeshPhysicalMaterial({color,emissive:color,emissiveIntensity:culture.status==='live'?0.92:0.42,metalness:0.08,roughness:0.18,transparent:true,opacity:culture.status==='live'?0.96:0.52}));
      core.userData={isCultureCore:true,cultureIndex:ci,cultureId:culture.id,cultureName:culture.name};
      group.add(core);mobileGalaxyState.cultureCores.push({mesh:core,group,culture,index:ci});

      group.add(makeMobileGlowSprite(THREE,culture.color||'#54c6ee',5.1,0.46));
      const neb=makeMobileNebulaSprite(THREE,culture.color||'#54c6ee',10.8+Math.min(8,culture.lessonCount*0.22),culture.id==='bridge'?0.52:0.44);
      neb.rotation.z=ci*0.7+Math.random()*0.3;
      neb.userData = { spin: 0.00028 + ci * 0.00003, phase: ci * 0.8, baseOpacity: neb.material.opacity };
      group.add(neb);
      mobileGalaxyState.nebulaSprites.push(neb);

      const nebOuter=makeMobileNebulaSprite(THREE,culture.color||'#54c6ee',15.4+Math.min(10,culture.lessonCount*0.28),culture.id==='bridge'?0.24:0.18);
      nebOuter.rotation.z=-ci*0.4;
      nebOuter.userData = { spin: -(0.00012 + ci * 0.000015), phase: ci * 1.1 + 1.3, baseOpacity: nebOuter.material.opacity };
      group.add(nebOuter);
      mobileGalaxyState.nebulaSprites.push(nebOuter);
      addMobileGalaxyDust(group,THREE,culture.color||'#54c6ee',180+Math.min(220,culture.lessonCount*10),4.2+Math.min(5.5,culture.lessonCount*0.16),culture.id==='bridge'?0.50:0.38);

      const label=makeMobileTextSprite(THREE,`${culture.emoji} ${culture.name}`,culture.color||'#f0c96a');
      label.position.set(0,2.12,0);label.scale.set(5.4,1.22,1);label.userData.cultureIndex=ci;
      group.add(label);mobileGalaxyState.labels.push(label);

      (culture.modules||[]).forEach((mod,mi)=>{
        const lessons=mod.lessons||[];
        // Each module gets unique orbital radius
        const modR=2.35+mi*1.85+Math.sin(mi*1.2)*0.35;
        addMobileOrbitRing(group,THREE,modR,culture.color||'#f0c96a',0.17);
        addMobileGalaxyDust(group,THREE,culture.color||'#54c6ee',54+Math.min(80,lessons.length*8),modR+0.2,0.18);

        lessons.forEach((lesson,li)=>{
          // Each star (lesson) has unique orbital characteristics
          const angle2=-Math.PI/2+(Math.PI*2*li)/Math.max(1,lessons.length);
          // Vary radius slightly for each lesson within its module
          const lessonRadiusVar=(((li*5+mi*3)%7)-3)*0.12;
          const lessonRadius=modR+lessonRadiusVar;
          const ly=Math.sin(angle2*2+mi)*0.45+Math.cos(li*0.9)*0.15;
          const isMajor=li===0&&mi===0;

          const mesh=new THREE.Mesh(
            isMajor?new THREE.OctahedronGeometry(0.34,0):new THREE.SphereGeometry(0.22,18,18),
            new THREE.MeshPhysicalMaterial({color,emissive:color,emissiveIntensity:isMajor?0.98:0.66,metalness:0.05,roughness:0.18,transparent:true,opacity:0.98})
          );
          mesh.position.set(Math.cos(angle2)*lessonRadius,ly,Math.sin(angle2)*lessonRadius);
          mesh.userData={lessonId:lesson.id,cultureId:culture.id,cultureIndex:ci,moduleId:mod.id,title:lesson.title||lesson.id,readTime:lesson.readTime||'',num:lesson.num||'',excerpt:lesson.excerpt||lesson.leadText||'',cultureName:culture.name,moduleTitle:mod.title||'',color:culture.color||'#f0c96a'};
          mesh.userData.orbit={angle:angle2,speed:0.0009+li*0.00012+Math.random()*0.00012,radius:lessonRadius,baseY:ly,phase:li*0.55};

          const glow=makeMobileGlowSprite(THREE,culture.color||'#f0c96a',isMajor?2.25:1.45,isMajor?0.62:0.42);
          glow.position.copy(mesh.position);
          group.add(mesh);group.add(glow);

          // Moon orbit rings + pivots with unique orbital speeds per moon
          const satellitePivots=[];const moonCount=isMajor?2:1;
          for(let m=0;m<moonCount;m++){
            const mR=(isMajor?0.62:0.46)+m*0.24+Math.random()*0.08;
            const mTX=Math.PI/(3+m*1.2)+Math.sin(m*0.7)*0.08;
            const mTZ=(Math.PI/6)*(m%2===0?1:-1)+Math.cos(li*0.5)*0.06;
            const moonRing=makeMoonOrbitRing(THREE,mR,culture.color||'#f0c96a',0.30,mTX,mTZ);mesh.add(moonRing);
            const pivot=new THREE.Object3D();pivot.rotation.x=mTX;pivot.rotation.z=mTZ;
            // Each moon has unique orbital speed
            pivot.userData={speed:0.0038+m*0.0012+li*0.00035+Math.random()*0.0005,wobble:0.00015+m*0.00008+Math.random()*0.00006};
            const moonMesh=new THREE.Mesh(new THREE.SphereGeometry(0.06+m*0.022,10,10),new THREE.MeshPhysicalMaterial({color:new THREE.Color(culture.color||'#f0c96a').offsetHSL(0.04*m,0.06,0.12),emissive:new THREE.Color(culture.color||'#f0c96a'),emissiveIntensity:0.75+m*0.08,roughness:0.28,metalness:0.08}));
            moonMesh.position.set(mR,0,0);
            const moonGlow=makeMobileGlowSprite(THREE,culture.color||'#f0c96a',0.52+m*0.18,0.38+m*0.06);moonGlow.position.copy(moonMesh.position);
            pivot.add(moonMesh);pivot.add(moonGlow);mesh.add(pivot);satellitePivots.push(pivot);
          }

          mobileGalaxyState.nodes.push({mesh,glow,culture,module:mod,lesson,cultureIndex:ci,baseScale:isMajor?1.25:1,isHovered:false,satellitePivots});
        });
      });

      if (!(culture.modules||[]).length){
        addMobileOrbitRing(group,THREE,2.5,culture.color||'#f0c96a',0.12);
        for(let i=0;i<6;i++){const a=(Math.PI*2*i)/6;const m=new THREE.Mesh(new THREE.SphereGeometry(0.15,12,12),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.34}));m.position.set(Math.cos(a)*2.5,0,Math.sin(a)*2.5);group.add(m);}
      }
    });

    // Bridge arcs between live cultures with individual arc paths
    const live=CULTURES.filter(c=>c.status==='live');
    if (live.length>=2){
      const pts=live.map(c=>{const idx=CULTURES.findIndex(x=>x.id===c.id);const a=-Math.PI/2+(Math.PI*2*idx)/n;const baseR=Math.min(28,13+n*2.2);return new THREE.Vector3(Math.cos(a)*baseR,c.id==='bridge'?4:0,Math.sin(a)*baseR);});
      for(let i=0;i<pts.length-1;i++){
        const arcHeight=6+Math.sin(i*0.7)*1.5;
        const curve=new THREE.CatmullRomCurve3([pts[i],new THREE.Vector3(0,arcHeight,0),pts[i+1]]);
        const arcOpacity=0.17+Math.sin(i*0.5)*0.06;
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),new THREE.LineBasicMaterial({color:0xd4ae5a,transparent:true,opacity:arcOpacity})));
      }
    }
  }

  function makeMoonOrbitRing(THREE,radius,color,opacity,tiltX=0,tiltZ=0){
    const pts=[];for(let i=0;i<=64;i++){const a=(i/64)*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius));}
    const ring=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:new THREE.Color(color),transparent:true,opacity,depthWrite:false}));ring.rotation.x=tiltX;ring.rotation.z=tiltZ;return ring;
  }
  function addMobileOrbitRing(group,THREE,radius,color,opacity){
    const pts=[];for(let i=0;i<=96;i++){const a=(i/96)*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius));}
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:new THREE.Color(color),transparent:true,opacity,depthWrite:false})));
  }
  function makeMobileNebulaSprite(THREE,color,size,opacity){
    const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');const col=new THREE.Color(color);const r=Math.round(col.r*255),g=Math.round(col.g*255),b=Math.round(col.b*255);ctx.clearRect(0,0,256,256);const grd=ctx.createRadialGradient(128,128,8,128,128,128);grd.addColorStop(0,`rgba(${r},${g},${b},0.36)`);grd.addColorStop(0.28,`rgba(${r},${g},${b},0.18)`);grd.addColorStop(0.58,`rgba(${r},${g},${b},0.07)`);grd.addColorStop(1,`rgba(${r},${g},${b},0)`);ctx.fillStyle=grd;ctx.fillRect(0,0,256,256);
    for(let i=0;i<70;i++){const px=128+(Math.random()-0.5)*190,py=128+(Math.random()-0.5)*190,pr=8+Math.random()*28;const puff=ctx.createRadialGradient(px,py,0,px,py,pr);puff.addColorStop(0,`rgba(255,255,255,${0.025+Math.random()*0.04})`);puff.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=puff;ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<42;i++){const px=128+(Math.random()-0.5)*180,py=128+(Math.random()-0.5)*180,pr=22+Math.random()*44;const haze=ctx.createRadialGradient(px,py,0,px,py,pr);haze.addColorStop(0,`rgba(${r},${g},${b},${0.06+Math.random()*0.05})`);haze.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=haze;ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill();}
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));sprite.scale.set(size,size*0.72,1);sprite.userData.baseSize=size;return sprite;
  }
  function addMobileGalaxyDust(group,THREE,color,count,radius,opacity,targetState=mobileGalaxyState){
    const p=new Float32Array(count*3),c=new Float32Array(count*3);const base=new THREE.Color(color),gold=new THREE.Color('#f0c96a'),cyan=new THREE.Color('#54c6ee');
    for(let i=0;i<count;i++){const arm=i%3,angle=Math.random()*Math.PI*2+arm*((Math.PI*2)/3),spread=Math.pow(Math.random(),0.55)*radius,spiral=angle+spread*0.34;p[i*3]=Math.cos(spiral)*spread;p[i*3+1]=(Math.random()-0.5)*1.25;p[i*3+2]=Math.sin(spiral)*spread;const mixed=base.clone();if(Math.random()>0.65)mixed.lerp(gold,0.32);if(Math.random()>0.78)mixed.lerp(cyan,0.22);c[i*3]=mixed.r;c[i*3+1]=mixed.g;c[i*3+2]=mixed.b;}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('color',new THREE.BufferAttribute(c,3));
    const dust=new THREE.Points(geo,new THREE.PointsMaterial({size:0.055,vertexColors:true,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));
    group.add(dust);targetState.dustSystems.push(dust);return dust;
  }
  function makeMobileGlowSprite(THREE,color,size,opacity){
    const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d');const col=new THREE.Color(color);const r=Math.round(col.r*255),g=Math.round(col.g*255),b=Math.round(col.b*255);const grd=ctx.createRadialGradient(48,48,0,48,48,48);grd.addColorStop(0,`rgba(${r},${g},${b},0.85)`);grd.addColorStop(0.45,`rgba(${r},${g},${b},0.24)`);grd.addColorStop(1,`rgba(${r},${g},${b},0)`);ctx.fillStyle=grd;ctx.fillRect(0,0,96,96);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));sprite.scale.setScalar(size);sprite.userData.baseSize=size;return sprite;
  }
  function makeMobileTextSprite(THREE,text,color){
    const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.clearRect(0,0,512,128);ctx.font="700 34px 'DM Sans',system-ui,sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=color;ctx.shadowBlur=16;ctx.fillStyle=color;ctx.fillText(text,256,64);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
  }

  /* ── Galaxy tap detection ─────────────────────────────────────────────── */
  function bindMobileGalaxyEvents(canvas){
    canvas.addEventListener('pointermove',e=>{updateMobileGalaxyPointer(e,canvas);pickMobileGalaxyNode(false);},{passive:true});
    canvas.addEventListener('click',e=>{updateMobileGalaxyPointer(e,canvas);pickMobileGalaxyNode(true);},{passive:true});
    canvas.addEventListener('touchend',e=>{if(!e.changedTouches?.length)return;updateMobileGalaxyPointer(e.changedTouches[0],canvas);pickMobileGalaxyNode(true);},{passive:true});
  }

  function updateMobileGalaxyPointer(e,canvas){
    const rect=canvas.getBoundingClientRect();
    mobileGalaxyState.pointer.x=((e.clientX-rect.left)/rect.width)*2-1;
    mobileGalaxyState.pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
  }

  function pickMobileGalaxyNode(open){
    const {raycaster,pointer,camera,nodes,cultureCores}=mobileGalaxyState;
    if (!raycaster||!pointer||!camera) return;
    nodes.forEach(n=>n.isHovered=false);
    raycaster.setFromCamera(pointer,camera);

    const coreHits=raycaster.intersectObjects(cultureCores.map(c=>c.mesh),false);
    if (coreHits.length){
      const ce=cultureCores.find(c=>c.mesh===coreHits[0].object);
      const tip=document.getElementById('lkp-m-galaxy-tip');
      if (ce&&tip) tip.innerHTML=`<strong style="color:${ce.culture.color}">${escapeHTML(ce.culture.name)}</strong><span>${open?'Zooming into galaxy...':'Tap to zoom into this culture galaxy'}</span>`;
      if (open&&ce) focusCultureGalaxy(ce.index);
      return;
    }

    const lessonMeshes=nodes.map(n=>n.mesh);
    const moonMeshMap=new Map();
    nodes.forEach(node=>{node.satellitePivots?.forEach(pivot=>{pivot.children.forEach(child=>{if(child.isMesh)moonMeshMap.set(child,node);});});});

    const hits=raycaster.intersectObjects([...lessonMeshes,...moonMeshMap.keys()],false);
    const tip=document.getElementById('lkp-m-galaxy-tip');
    if (!hits.length){if(tip)tip.innerHTML=mobileGalaxyState.focusMode==='culture'?`<strong>Culture Galaxy</strong><span>Tap a lesson star or its orbiting moon</span>`:`<strong>Hōkū Kumu</strong><span>Tap a culture galaxy to zoom in · tap a star to open its lesson</span>`;return;}

    const hitMesh=hits[0].object;const node=nodes.find(n=>n.mesh===hitMesh)||moonMeshMap.get(hitMesh);if(!node)return;
    node.isHovered=true;
    if (tip) tip.innerHTML=`<strong style="color:${node.culture.color}">${escapeHTML(node.lesson.title||node.lesson.id)}</strong><span>${escapeHTML(node.culture.name)} · ${escapeHTML(node.module.title||'')} ${node.lesson.num?'· '+escapeHTML(node.lesson.num):''}</span>`;
    if (open){
      openConceptSheet(node.culture,{
        id:node.lesson.id,lessonId:node.lesson.id,
        title:node.lesson.title||node.lesson.id,label:node.lesson.title||node.lesson.id,
        num:node.lesson.num||'',readTime:node.lesson.readTime||'',
        moduleTitle:node.module.title||'',
        excerpt:node.lesson.excerpt||node.lesson.leadText||'',
        desc:stripTags(node.lesson.content||node.module.desc||node.culture.intro||'').slice(0,280)
      });
    }
  }

  /* ── Camera focus (isTransitioning prevents fighting user input) ───────── */
  function focusCultureGalaxy(index){
    const THREE=mobileGalaxyState.THREE,group=mobileGalaxyState.cultureGroups[index],camera=mobileGalaxyState.camera,controls=mobileGalaxyState.controls;
    if (!THREE||!group||!camera||!controls) return;
    const world=new THREE.Vector3();group.getWorldPosition(world);
    mobileGalaxyState.focusMode='culture';mobileGalaxyState.focusedCultureIndex=index;mobileGalaxyState.isTransitioning=true;
    const offset=new THREE.Vector3(0,4.5,12.5);animateCameraTo(world.clone().add(offset),world.clone(),820);
    document.getElementById('lkp-m-return-core')?.classList.add('is-visible');
    const culture=CULTURES[index];const tip=document.getElementById('lkp-m-galaxy-tip');
    if (tip&&culture) tip.innerHTML=`<strong style="color:${culture.color}">${escapeHTML(culture.name)} — Ka ʻIke Hōkū</strong><span>Tap a lesson star or orbiting moon to open its preview</span>`;
  }

  function returnToHokuKumu(){
    const THREE=mobileGalaxyState.THREE,camera=mobileGalaxyState.camera;if (!THREE||!camera) return;
    mobileGalaxyState.focusMode='ecosystem';mobileGalaxyState.focusedCultureIndex=null;mobileGalaxyState.isTransitioning=true;
    animateCameraTo(new THREE.Vector3(0,14,52),new THREE.Vector3(0,0,0),850);
    document.getElementById('lkp-m-return-core')?.classList.remove('is-visible');
    const tip=document.getElementById('lkp-m-galaxy-tip');
    if (tip) tip.innerHTML=`<strong>Hōkū Kumu</strong><span>Tap a culture galaxy to zoom in · tap a star to open its lesson</span>`;
  }

  function animateCameraTo(position,target,duration=800){
    const camera=mobileGalaxyState.camera,controls=mobileGalaxyState.controls;if(!camera||!controls)return;
    mobileGalaxyState.cameraTween={startTime:performance.now(),duration,fromPosition:camera.position.clone(),toPosition:position.clone(),fromTarget:controls.target.clone(),toTarget:target.clone()};
  }

  function updateCameraTween(){
    const tween=mobileGalaxyState.cameraTween,camera=mobileGalaxyState.camera,controls=mobileGalaxyState.controls;
    if (!tween||!camera||!controls) return;
    const raw=Math.min(1,(performance.now()-tween.startTime)/tween.duration);
    const ease=raw<0.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2;
    camera.position.lerpVectors(tween.fromPosition,tween.toPosition,ease);
    controls.target.lerpVectors(tween.fromTarget,tween.toTarget,ease);
    if (raw>=1){mobileGalaxyState.cameraTween=null;mobileGalaxyState.isTransitioning=false;}
  }

  function resizeMobileThreeGalaxy(){
    const {renderer,camera}=mobileGalaxyState;const canvas=document.getElementById('lkp-m-three-galaxy');const wrap=canvas?.closest('.lkp-m-three-galaxy-wrap');
    if (!renderer||!camera||!wrap) return;
    camera.aspect=wrap.clientWidth/wrap.clientHeight;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(wrap.clientWidth,wrap.clientHeight);
  }

  /* ── Mobile Home Galaxy Viewer ─────────────────────────────────────────── */
  const homeGalaxyState = {
    initialized: false,
    THREE: null, scene:null, camera:null, renderer:null, controls:null,
    cultureGroups:[], dustSystems:[], nebulaSprites:[], lessonPivots:[], frameId:null
  };

  async function initMobileHomeGalaxy(){
    const canvas=document.getElementById('lkp-m-home-galaxy');
    const wrap=canvas?.closest('.lkp-m-home-galaxy-wrap');
    if (!canvas||!wrap) return;
    if (homeGalaxyState.initialized){resizeMobileHomeGalaxy();return;}

    const THREE=await import('https://esm.sh/three@0.160.0');
    const {OrbitControls}=await import('https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js');

    homeGalaxyState.THREE=THREE;homeGalaxyState.initialized=true;

    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x01030a,0.016);
    const camera=new THREE.PerspectiveCamera(55,wrap.clientWidth/wrap.clientHeight,0.1,200);
    camera.position.set(0,8,32);

    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.3));
    renderer.setSize(wrap.clientWidth,wrap.clientHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;

    const controls=new OrbitControls(camera,canvas);
    controls.enablePan=false;controls.enableZoom=true;controls.enableDamping=true;
    controls.dampingFactor=0.12;controls.rotateSpeed=0.35;controls.zoomSpeed=0.5;
    controls.minDistance=6;controls.maxDistance=70;
    controls.autoRotate=true;controls.autoRotateSpeed=0.18;
    controls.target.set(0,0,0);

    homeGalaxyState.scene=scene;homeGalaxyState.camera=camera;homeGalaxyState.renderer=renderer;
    homeGalaxyState.controls=controls;homeGalaxyState.cultureGroups=[];homeGalaxyState.dustSystems=[];homeGalaxyState.nebulaSprites=[];homeGalaxyState.lessonPivots=[];

    scene.add(new THREE.AmbientLight(0xffffff,0.35));
    const key=new THREE.PointLight(0xffdd9a,2.2,140);key.position.set(0,28,24);scene.add(key);
    const cyan=new THREE.PointLight(0x54c6ee,1.0,100);cyan.position.set(-30,16,-15);scene.add(cyan);

    // Add simplified central core
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(0.8,1),new THREE.MeshPhysicalMaterial({color:0xf0c96a,emissive:0xf0c96a,emissiveIntensity:0.8,metalness:0.1,roughness:0.2,transparent:true,opacity:0.95}));
    scene.add(core);

    // Build home galaxy with individual orbits for each culture
    buildHomeGalaxySystem(scene,THREE);

    window.addEventListener('resize',resizeMobileHomeGalaxy,{passive:true});

    function animate(){
      homeGalaxyState.frameId=requestAnimationFrame(animate);
      const t=performance.now()*0.0008;
      
      core.rotation.y+=0.004;
      core.rotation.x=Math.sin(t*0.3)*0.04;

      homeGalaxyState.cultureGroups.forEach((group,i)=>{
        const d=group.userData;
        d.orbitAngle+=d.orbitSpeed;
        group.position.x=Math.cos(d.orbitAngle)*d.orbitRadius;
        group.position.z=Math.sin(d.orbitAngle)*d.orbitRadius;
        group.position.y=d.baseY+Math.sin(t*0.4+i)*0.28;
        group.rotation.y+=0.0004+i*0.00003;
      });

      homeGalaxyState.dustSystems.forEach((d,i)=>{d.rotation.y+=0.00032+i*0.00004;d.rotation.z+=0.00012;});

      homeGalaxyState.nebulaSprites.forEach((neb, i) => {
        const phase = neb.userData.phase || i;
        const baseOpacity = neb.userData.baseOpacity || 0.2;
        neb.rotation.z += neb.userData.spin || 0.00014;
        neb.material.opacity = baseOpacity + Math.sin(t * 0.38 + phase) * 0.045;
      });

      homeGalaxyState.lessonPivots.forEach((pivot) => {
        const d = pivot.userData;
        d.angle += d.speed;
        pivot.position.set(
          Math.cos(d.angle) * d.radius,
          d.baseY + Math.sin(t * 0.5 + d.phase) * d.wobble,
          Math.sin(d.angle) * d.radius
        );
      });

      controls.update();renderer.render(scene,camera);
    }
    animate();
  }

  function buildHomeGalaxySystem(scene,THREE){
    const n=Math.max(1,CULTURES.length);
    const baseR=Math.min(18,10+n*1.5);

    CULTURES.forEach((culture,ci)=>{
      // Each nebula gets its own orbital parameters
      const baseAngle=-Math.PI/2+(Math.PI*2*ci)/n;
      const orbitRadiusVariance=0.8+Math.random()*1.2;
      const orbitRadius=baseR+((ci%3)-1)*0.6+orbitRadiusVariance*0.3;
      const orbitSpeed=0.00022+ci*0.00003+Math.random()*0.00005;
      const tiltAngle=Math.sin(ci*0.7)*0.12;
      
      const group=new THREE.Group();
      group.userData={
        orbitAngle:baseAngle,
        orbitSpeed:orbitSpeed,
        orbitRadius:orbitRadius,
        baseY:culture.id==='bridge'?2.5:0,
        tiltAngle:tiltAngle,
        cultureIndex:ci
      };
      scene.add(group);
      homeGalaxyState.cultureGroups.push(group);

      const color=new THREE.Color(culture.color||'#54c6ee');
      
      // Culture core
      const coreSize=0.42+Math.random()*0.15;
      const core=new THREE.Mesh(
        new THREE.SphereGeometry(coreSize,16,16),
        new THREE.MeshPhysicalMaterial({
          color,emissive:color,emissiveIntensity:culture.status==='live'?0.7:0.3,
          metalness:0.05,roughness:0.2,transparent:true,
          opacity:culture.status==='live'?0.92:0.48
        })
      );
      group.add(core);

      // Glow
      const glowSize=2.8+Math.random()*1.2;
      const glow=makeMobileGlowSprite(THREE,culture.color||'#54c6ee',glowSize,0.32);
      group.add(glow);

      // Nebula sprite with rotation
      const nebSize=4.5+Math.min(3.2,culture.lessonCount*0.12);
      const neb=makeMobileNebulaSprite(THREE,culture.color||'#54c6ee',nebSize,culture.id==='bridge'?0.34:0.28);
      neb.rotation.z=ci*0.5+Math.random()*0.6;
      group.add(neb);
      neb.userData = { spin: 0.00018 + ci * 0.00002, phase: ci * 0.9, baseOpacity: neb.material.opacity };
      homeGalaxyState.nebulaSprites.push(neb);

      const nebOuter=makeMobileNebulaSprite(THREE,culture.color||'#54c6ee',nebSize*1.45,0.12);
      nebOuter.rotation.z=-ci*0.38;
      nebOuter.userData = { spin: -(0.00008 + ci * 0.00001), phase: ci * 1.1 + 0.7, baseOpacity: nebOuter.material.opacity };
      group.add(nebOuter);
      homeGalaxyState.nebulaSprites.push(nebOuter);

      // Dust system around culture
      const dustCount=80+Math.min(120,culture.lessonCount*6);
      const dustRadius=3.2+Math.random()*1.5;
      addMobileGalaxyDust(group,THREE,culture.color||'#54c6ee',dustCount,dustRadius,0.14,homeGalaxyState);

      // Lesson stars orbit around culture at individual radii/speeds
      (culture.modules||[]).forEach((mod,mi)=>{
        const lessons=mod.lessons||[];
        const lessonOrbitR=1.8+mi*0.9+Math.random()*0.4;
        
        lessons.forEach((lesson,li)=>{
          // Each lesson gets individual orbital speed and angle
          const lessonAngle=-Math.PI/2+(Math.PI*2*li)/Math.max(1,lessons.length);
          const lessonSpeed=0.0011+li*0.00014+Math.random()*0.00016;
          const isMajor=li===0&&mi===0;
          
          // Use a pivot for individual lesson orbit
          const lessonPivot=new THREE.Object3D();
          lessonPivot.userData={angle:lessonAngle,speed:lessonSpeed,radius:lessonOrbitR,baseY:ly,phase:li*0.6,wobble:0.11+Math.random()*0.04};
          
          const lx=Math.cos(lessonAngle)*lessonOrbitR;
          const lz=Math.sin(lessonAngle)*lessonOrbitR;
          const ly=Math.sin(lessonAngle*1.2+mi)*0.25;
          
          const mesh=new THREE.Mesh(
            isMajor?new THREE.OctahedronGeometry(0.18,0):new THREE.SphereGeometry(0.12,12,12),
            new THREE.MeshPhysicalMaterial({
              color,emissive:color,emissiveIntensity:isMajor?0.75:0.5,
              metalness:0.04,roughness:0.2,transparent:true,opacity:0.95
            })
          );
          mesh.position.set(lx,ly,lz);
          lessonPivot.add(mesh);
          
          const lGlow=makeMobileGlowSprite(THREE,culture.color||'#f0c96a',isMajor?1.0:0.6,isMajor?0.4:0.25);
          lGlow.position.copy(mesh.position);
          lessonPivot.add(lGlow);
          
          group.add(lessonPivot);
          homeGalaxyState.lessonPivots.push(lessonPivot);
        });
      });
    });
  }

  function resizeMobileHomeGalaxy(){
    const {renderer,camera}=homeGalaxyState;
    const canvas=document.getElementById('lkp-m-home-galaxy');
    const wrap=canvas?.closest('.lkp-m-home-galaxy-wrap');
    if (!renderer||!camera||!wrap) return;
    camera.aspect=wrap.clientWidth/wrap.clientHeight;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.3));
    renderer.setSize(wrap.clientWidth,wrap.clientHeight);
  }

  /* ── Ecosystem panel ──────────────────────────────────────────────────── */
  function buildEcosystemPanel(){
    const el=document.getElementById('lkp-m-ecosystem');
    const totalModules=CULTURES.reduce((s,c)=>s+c.moduleCount,0);const totalLessons=CULTURES.reduce((s,c)=>s+c.lessonCount,0);
    el.innerHTML=`
      <div class="lkp-m-section-head"><span class="lkp-m-eyebrow">Ikeverse Ecosystem</span><h2>Culture Registry</h2><p>Generated from your data file. More cultures become more orbits and galaxy nodes.</p></div>
      <div class="lkp-m-eco-stats"><div><strong>${CULTURES.length}</strong><span>Cultures</span></div><div><strong>${totalModules}</strong><span>Modules</span></div><div><strong>${totalLessons}</strong><span>Lessons</span></div></div>
      <div class="lkp-m-eco-list">${CULTURES.map(c=>`<article class="lkp-m-eco-card" style="--eco-color:${c.color};--eco-bg:${c.colorDim};--eco-border:${c.colorBorder}"><div class="lkp-m-eco-card__icon">${c.emoji}</div><div><span class="lkp-m-status ${c.status==='live'?'is-live':'is-soon'}">${c.status==='live'?'Live':'Coming Soon'}</span><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.tagline||'')}</p><small>${c.moduleCount} modules · ${c.lessonCount} lessons · theme: ${escapeHTML(c.theme)}</small></div></article>`).join('')}</div>`;
  }

  /* ── Profile panel ────────────────────────────────────────────────────── */
  function readLocalJSON(key,fb=null){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fb));}catch{return fb;}}

  function buildProfilePanel(){
    const el=document.getElementById('lkp-m-profile');
    const completed=readLocalJSON('cv_completed',[])||[];
    const cachedProfile=readLocalJSON('lkp_profile_v1',null)||readLocalJSON('piko_profile_v1',null);
    const mana=parseInt(localStorage.getItem('cv_mana')||'0',10)||0;
    const totalLessons=[...CONCEPTS.values()].length;
    const pct=totalLessons?Math.min(100,Math.round((completed.length/totalLessons)*100)):0;
    const displayName=cachedProfile?.display_name||cachedProfile?.name||cachedProfile?.handle||cachedProfile?.email||'Guest Wayfinder';
    const role=cachedProfile?.role||'user';const isAdmin=role==='admin'||role==='owner';
    el.innerHTML=`
      <div class="lkp-m-section-head"><span class="lkp-m-eyebrow">Profile</span><h2>Your Wayfinder Profile</h2><p>Your learning progress and ecosystem identity across the Living Knowledge Platform.</p></div>
      <div class="lkp-m-profile-card ${isAdmin?'is-admin':''}"><div class="lkp-m-profile-card__avatar">${isAdmin?'👑':'👤'}</div><div><span class="lkp-m-status ${isAdmin?'is-live':'is-soon'}">${isAdmin?'Admin Access':'User Profile'}</span><h3>${escapeHTML(displayName)}</h3><p>${isAdmin?'You have expanded control tools for managing lessons and ecosystem content.':'Sign in to sync progress across devices and unlock your full profile.'}</p></div></div>
      <div class="lkp-m-profile-stats"><div><strong>${completed.length}</strong><span>Completed</span></div><div><strong>${mana}</strong><span>Mana</span></div><div><strong>${pct}%</strong><span>Progress</span></div></div>
      <div class="lkp-m-profile-progress"><span style="width:${pct}%"></span></div>
      <div class="lkp-m-profile-actions">
        <a href="${PROFILE_PATH}" class="lkp-m-profile-btn">Open Full Profile</a>
        ${isAdmin?`<a href="${ADMIN_PATH}" class="lkp-m-profile-btn lkp-m-profile-btn--admin">Open Admin Dashboard</a>`:''}
      </div>
      <div class="lkp-m-profile-ecosystem">
        <a href="${LESSONS_PATH}">Lessons</a>
        <a href="${PROFILE_PATH}">Profile</a>
        <a href="${ABOUT_PATH}">About</a>
        <a href="https://808cryptobeast.github.io/ikehub/">IkeHub</a>
        <a href="https://808cryptobeast.github.io/Ikestar/">IkeStar</a>
        <a href="https://www.pikoverse.xyz">Pikoverse</a>
      </div>`;
  }

  /* ── Bottom sheet (richer lesson info) ───────────────────────────────── */
  function buildBottomSheet(){
    document.getElementById('lkp-m-sheet-bg').addEventListener('click',closeSheet);
  }

  function openConceptSheet(culture, concept){
    sheetOpen=true;sheetData={culture,concept};
    const sheet=document.getElementById('lkp-m-sheet');const bg=document.getElementById('lkp-m-sheet-bg');
    const isSoon=culture.status!=='live'||!concept.lessonId;
    const desc = concept.excerpt || concept.desc || culture.intro || '';
    sheet.innerHTML=`
      <div class="lkp-m-sheet__handle"></div>
      <button class="lkp-m-sheet__close" type="button" aria-label="Close">×</button>
      <div class="lkp-m-sheet__kicker" style="color:${culture.color}">${culture.emoji} ${escapeHTML(culture.name)}</div>
      <h3>${escapeHTML(concept.title||concept.label)}</h3>
      <p class="lkp-m-sheet__meta">
        ${concept.num?`<span class="lkp-m-sheet__num">${escapeHTML(concept.num)}</span>`:''}
        ${concept.readTime?`<span>⏱ ${escapeHTML(concept.readTime)}</span>`:''}
        ${concept.moduleTitle?`<span>📂 ${escapeHTML(concept.moduleTitle)}</span>`:''}
      </p>
      <p class="lkp-m-sheet__body">${escapeHTML(desc)}</p>
      <div class="lkp-m-sheet__actions">
        ${isSoon
          ? `<button class="lkp-m-sheet__cta is-disabled" type="button">Coming Soon</button>`
          : `<a class="lkp-m-sheet__cta" href="${lessonHref(concept.lessonId)}" style="--cta-color:${culture.color};--cta-bg:${culture.colorDim};--cta-border:${culture.colorBorder}">Open Full Lesson →</a>`}
      </div>`;
    sheet.querySelector('.lkp-m-sheet__close').addEventListener('click',closeSheet);
    sheet.classList.add('is-open');bg.classList.add('is-open');sheet.setAttribute('aria-hidden','false');
  }

  function closeSheet(){
    sheetOpen=false;sheetData=null;
    const sheet=document.getElementById('lkp-m-sheet'),bg=document.getElementById('lkp-m-sheet-bg');
    if(!sheet||!bg)return;sheet.classList.remove('is-open');bg.classList.remove('is-open');sheet.setAttribute('aria-hidden','true');
  }

  /* ── Bottom nav ───────────────────────────────────────────────────────── */
  const NAV_TABS=[
    {id:'home',     icon:'fa-house',         label:'Home',      type:'tab'},
    {id:'galaxies', icon:'fa-circle-nodes',  label:'Lessons',   type:'tab'},
    {id:'chart',    icon:'fa-star',           label:'Kilo Hōkū', type:'tab'},
    {id:'ecosystem',icon:'fa-database',       label:'Data',      type:'tab'},
    {id:'profile',  icon:'fa-user-astronaut', label:'Profile',   type:'link', href:PROFILE_PATH}
  ];

  function buildBottomNav(){
    const nav=document.getElementById('lkp-m-nav');if(!nav)return;
    nav.innerHTML=NAV_TABS.map(item=>{const activeClass=item.type==='tab'&&item.id===activeTab?'is-active':'';return `<button class="lkp-m-nav__btn ${activeClass}" data-tab="${item.id}" data-type="${item.type}" ${item.href?`data-href="${item.href}"`:''}  aria-label="${item.label}" type="button"><i class="fas ${item.icon} lkp-m-nav__icon" aria-hidden="true"></i><span class="lkp-m-nav__label">${item.label}</span></button>`;}).join('');
    nav.querySelectorAll('.lkp-m-nav__btn').forEach(btn=>{btn.addEventListener('click',()=>{const href=btn.dataset.href,type=btn.dataset.type,tab=btn.dataset.tab;if(type==='link'&&href){window.location.href=href;return;}switchTab(tab);});});
  }

  function switchTab(tabId){
    const panel=document.querySelector(`.lkp-m-panel[data-panel="${tabId}"]`);
    if (!panel){
      if(tabId==='about'){window.location.href=ABOUT_PATH;return;}
      if(tabId==='profile'){window.location.href=PROFILE_PATH;return;}
      if(tabId==='lessons'){window.location.href=LESSONS_PATH;return;}
      return;
    }
    activeTab=tabId;closeSheet();
    document.querySelectorAll('.lkp-m-panel').forEach(p=>p.classList.toggle('is-active',p.dataset.panel===tabId));
    document.querySelectorAll('.lkp-m-nav__btn').forEach(b=>b.classList.toggle('is-active',b.dataset.type==='tab'&&b.dataset.tab===tabId));
    if(tabId==='galaxies'){requestAnimationFrame(()=>{const s=document.getElementById('lkp-m-galaxy-scroll');s?.querySelector(`[data-galaxy-card="${activeGalaxy}"]`)?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});updateDotsFromScroll();});}
    if(tabId==='chart'){requestAnimationFrame(()=>{initMobileThreeLessonGalaxy();resizeMobileThreeGalaxy();});}
  }

  /* ── Swipe gesture ────────────────────────────────────────────────────── */
  function initSwipe(){
    const panels=document.getElementById('lkp-m-panels');if(!panels)return;
    let startX=0,startY=0,isDragging=false;
    panels.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;startX=e.touches[0].clientX;startY=e.touches[0].clientY;isDragging=true;},{passive:true});
    panels.addEventListener('touchend',e=>{
      if(!isDragging)return;isDragging=false;
      const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
      if(Math.abs(dx)<50||Math.abs(dy)>Math.abs(dx)*0.8)return;
      const order=['home','galaxies','bridge','chart','ecosystem'];const cur=order.indexOf(activeTab);
      if(dx<0&&cur<order.length-1)switchTab(order[cur+1]);if(dx>0&&cur>0)switchTab(order[cur-1]);
    },{passive:true});
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.LKP_MOBILE_DATA={cultures:CULTURES,galaxies:GALAXIES,bridge:BRIDGE,concepts:CONCEPTS,lessonHref};
})();