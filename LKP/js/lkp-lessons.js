/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — DEEP LESSONS  v5  (Senior Dev Revamp)
   File: LKP/js/lkp-lessons.js

   KEY CHANGES FROM v4
   ─ Image paths fixed: assets/images/ (not LKP/assets/images/)
   ─ New content tags: <chant>, <primary-source>, <scripture>, <manuscript>
   ─ Reflection is a collapsible accordion — not shoved into content mid-flow
   ─ Keiki mode completely redesigned: story + vocab + activity + reflection
   ─ Sticky action strip on scroll (IntersectionObserver)
   ─ Hero: 360px full-bleed background-image directly on the div
   ─ Three.js fully removed
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
     PATHS: relative to LKP/ (where lessons.html lives)
     CORRECT: assets/images/foo.jpg
     WRONG:   LKP/assets/images/foo.jpg  (double-prefix, breaks loading)
  ══════════════════════════════════════════════════════════════════════ */

  const LESSON_IMAGE_REGISTRY = {
    'km-starcompass': { url:'assets/images/hawaiian-star-compass.png', pos:'center center',  credit:"Nainoa Thompson's Hawaiian Star Compass" },
    'km-hokuleaa':    { url:'assets/images/km-hokuleaa.png',           pos:'center 55%',     credit:"Hōkūleʻa — Polynesian Voyaging Society / Wikimedia Commons" },
    'km-loikalo':     { url:'assets/images/km-loikalo.png',            pos:'center 50%',     credit:"Hanalei Valley Loʻi Kalo — Wikimedia Commons" },
    'km-ahupuaa':     { url:'assets/images/km-ahupuaa.png',            pos:'center 45%',     credit:"Nuʻuanu Valley — Wikimedia Commons" },
    'km-kumulipo':    { placeholder:true, filename:'assets/images/km-kumulipo.png',    hint:'Deep night sky over ocean — stars, first light emerging' },
    'km-wakea':       { placeholder:true, filename:'assets/images/km-wakea.png',       hint:'Sky meeting ocean horizon — Wākea and Papahānaumoku' },
    'km-olelo':       { placeholder:true, filename:'assets/images/km-olelo.png',       hint:'Hawaiian kapa cloth patterns or traditional chant imagery' },
    'km-hula':        { placeholder:true, filename:'assets/images/km-hula.png',        hint:'Hula dancers in traditional kapa — flowing, grounded movement' },
    'km-laau':        { placeholder:true, filename:'assets/images/km-laau.png',        hint:'Hawaiian medicinal plants — ʻolena, noni, kalo leaves' },
    'ke-medicine':    { url:'assets/images/ke-medicine.jpg',           pos:'center center',  credit:"Edwin Smith Surgical Papyrus — Wikimedia Commons" },
    'ke-medunetjer':  { url:'assets/images/ke-medunetjer.jpg',         pos:'center center',  credit:"Egyptian Hieroglyphs — Wikimedia Commons" },
    'ke-maat-politics':{ url:'assets/images/ke-maat-politics.jpg',     pos:'center 55%',     credit:"Great Sphinx of Giza — Wikimedia Commons" },
    'ke-nun':         { placeholder:true, filename:'assets/images/ke-nun.jpg',         hint:'Primordial waters — deep, still, dark water reflecting ancient sky' },
    'ke-ennead':      { placeholder:true, filename:'assets/images/ke-ennead.jpg',      hint:'Temple at Heliopolis / Karnak — columns, stone, morning light' },
    'ke-ptah':        { placeholder:true, filename:'assets/images/ke-ptah.jpg',        hint:'Ptah deity — blue-skinned, staff, cartouche, mummiform figure' },
    'ke-maat':        { placeholder:true, filename:'assets/images/ke-maat.jpg',        hint:'Balance scales, feather of Maʻat, Hall of Two Truths' },
    'br-darkness':    { placeholder:true, filename:'assets/images/br-darkness.jpg',    hint:'Milky Way over ocean — Pō / Nun' },
    'br-aloha-maat':  { placeholder:true, filename:'assets/images/br-alohamaat.jpg',   hint:'Two cultural symbols meeting — lei + ankh, green + gold' }
  };

  const CULTURE_FALLBACKS = {
    kanaka:    { placeholder:true, filename:'assets/images/kanaka-culture.jpg',    hint:'Hawaiian ocean and stars at night' },
    kemet:     { placeholder:true, filename:'assets/images/kemet-culture.jpg',     hint:'Egyptian pyramid at dawn — gold and shadow' },
    bridge:    { placeholder:true, filename:'assets/images/bridge-culture.jpg',    hint:'Two coastlines meeting — Pacific and Nile' },
    dreamtime: { placeholder:true, filename:'assets/images/dreamtime-culture.jpg', hint:'Australian desert stars — Uluru at dusk' },
    default:   { placeholder:true, filename:'assets/images/default-culture.jpg',   hint:'Milky Way arch over ocean' }
  };

  /* ══════════════════════════════════════════════════════════════════════
     PLACEHOLDER SVG GENERATOR
  ══════════════════════════════════════════════════════════════════════ */

  function makeCulturalPlaceholderSVG(lesson, fallbackData) {
    const data      = fallbackData || LESSON_IMAGE_REGISTRY[lesson.id];
    const cultureId = lesson.cultureId || 'default';
    const filename  = data?.filename || `assets/images/${lesson.id||'lesson'}.jpg`;
    const title     = escapeAttr(lesson.title || 'Lesson');
    const culture   = escapeAttr(lesson.cultureName || '');
    const mod       = escapeAttr(lesson.moduleTitle || '');

    const palettes = {
      kanaka:  { bg0:'#010e08', bg1:'#061c12', bg2:'#0e2e1a', a1:'#3cb371', a2:'#54c6ee', t:'#8fffc7' },
      kemet:   { bg0:'#0a0600', bg1:'#1a0f00', bg2:'#2a1800', a1:'#f0c96a', a2:'#d98545', t:'#ffeab0' },
      bridge:  { bg0:'#04070f', bg1:'#080f20', bg2:'#0d1630', a1:'#8fa0ff', a2:'#54c6ee', t:'#c4ceff' },
      default: { bg0:'#01030a', bg1:'#04070f', bg2:'#08111e', a1:'#54c6ee', a2:'#8fa0ff', t:'#dbefff' }
    };
    const p = palettes[cultureId] || palettes.default;

    const pats = { kanaka:kanakaP(p), kemet:kemetP(p), bridge:bridgeP(p), default:constP(p) };
    const pat  = pats[cultureId] || pats.default;

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360">
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
        ${pat}
        <rect width="1200" height="360" fill="url(#vig)"/>
        <text x="600" y="172" text-anchor="middle" font-family="Georgia,serif" font-size="46" fill="${p.t}" opacity="0.96">${title}</text>
        <text x="600" y="218" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" letter-spacing="0.12em" fill="${p.a1}" opacity="0.72">${culture}${mod?'  ·  '+mod:''}</text>
        <text x="600" y="318" text-anchor="middle" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.25)">📸 ${filename}</text>
      </svg>`);
  }

  function escapeAttr(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function kanakaP(p) {
    const stars = Array.from({length:32},(_,i)=>{const x=40+(i*43)%1140,y=20+(i*37)%310,r=i%5===0?2.5:1.4;return `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.a1}" opacity="${0.12+(i%4)*0.07}"/>`;}).join('');
    return stars+`<line x1="600" y1="30" x2="600" y2="330" stroke="${p.a1}" stroke-width="0.6" opacity="0.10"/>
      <line x1="460" y1="180" x2="740" y2="180" stroke="${p.a1}" stroke-width="0.6" opacity="0.10"/>
      <circle cx="600" cy="180" r="80" fill="none" stroke="${p.a1}" stroke-width="0.7" opacity="0.12"/>
      <circle cx="600" cy="180" r="130" fill="none" stroke="${p.a2}" stroke-width="0.5" opacity="0.07"/>`+
      Array.from({length:5},(_,i)=>{const y=290+i*12;return `<path d="M0,${y} Q150,${y-7} 300,${y} Q450,${y+7} 600,${y} Q750,${y-7} 900,${y} Q1050,${y+7} 1200,${y}" fill="none" stroke="${p.a2}" stroke-width="0.7" opacity="${0.08-i*0.012}"/>`;}).join('');
  }
  function kemetP(p) {
    return `<polygon points="600,60 380,300 820,300" fill="none" stroke="${p.a1}" stroke-width="1" opacity="0.13"/>
      <polygon points="600,100 440,300 760,300" fill="${p.a1}" opacity="0.04"/>`+
      Array.from({length:10},(_,i)=>{const y=70+i*24;return `<line x1="80" y1="${y}" x2="370" y2="${y}" stroke="${p.a1}" stroke-width="0.5" opacity="0.07"/><line x1="830" y1="${y}" x2="1120" y2="${y}" stroke="${p.a1}" stroke-width="0.5" opacity="0.07"/>`;}).join('')+
      `<ellipse cx="600" cy="175" rx="44" ry="20" fill="none" stroke="${p.a1}" stroke-width="0.8" opacity="0.14"/>
       <circle cx="600" cy="175" r="10" fill="none" stroke="${p.a1}" stroke-width="0.8" opacity="0.14"/>`;
  }
  function bridgeP(p) {
    return `<circle cx="290" cy="180" r="100" fill="none" stroke="#3cb371" stroke-width="0.8" opacity="0.14"/>
      <circle cx="910" cy="180" r="100" fill="none" stroke="${p.a1}" stroke-width="0.8" opacity="0.14"/>
      <path d="M290,180 Q600,50 910,180" fill="none" stroke="${p.a1}" stroke-width="0.7" opacity="0.13"/>
      <path d="M290,180 Q600,310 910,180" fill="none" stroke="#3cb371" stroke-width="0.7" opacity="0.10"/>`+
      Array.from({length:24},(_,i)=>{const x=60+i*48,y=40+(i*37)%280;return `<circle cx="${x}" cy="${y}" r="1.3" fill="${i%2?'#3cb371':p.a1}" opacity="${0.12+i%4*0.05}"/>`;}).join('');
  }
  function constP(p) {
    const pts=[[200,70],[380,100],[550,55],[720,90],[900,65],[1050,95],[300,200],[480,180],[650,210],[820,190],[980,215]];
    return pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="${p.a1}" opacity="0.18"/>`).join('')+
      pts.slice(0,-1).map(([x,y],i)=>{const[nx,ny]=pts[i+1];return `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="${p.a1}" stroke-width="0.5" opacity="0.09"/>`;}).join('');
  }

  /* ── Hero image ─────────────────────────────────────────────────── */

  function getHeroImage(lesson) {
    const raw = lesson.image || lesson.heroImage || lesson.thumbnail || '';
    if (raw && raw.length > 4) return { url:raw, pos:'center center', credit:'', placeholder:false };
    return LESSON_IMAGE_REGISTRY[lesson.id] || CULTURE_FALLBACKS[lesson.cultureId] || CULTURE_FALLBACKS.default;
  }

  function updateHeroImage(lesson) {
    const hero = document.getElementById('cultureHero');
    if (!hero) return;
    const img = getHeroImage(lesson);
    if (img.placeholder) { _applyPlaceholder(hero, lesson, img); return; }
    const probe = new window.Image();
    probe.onload  = () => _applyReal(hero, img);
    probe.onerror = () => _applyPlaceholder(hero, lesson, img);
    probe.src = img.url;
    _applyPlaceholder(hero, lesson, img, true);
  }

  function _applyReal(hero, img) {
    hero.style.backgroundImage    = `url("${img.url}")`;
    hero.style.backgroundSize     = 'cover';
    hero.style.backgroundPosition = img.pos || 'center center';
    hero.classList.add('has-lesson-image');
    hero.classList.remove('has-placeholder','is-loading');
    _setCredit(hero, img.credit || '');
  }

  function _applyPlaceholder(hero, lesson, img, loading) {
    hero.style.backgroundImage    = `url("${makeCulturalPlaceholderSVG(lesson, img)}")`;
    hero.style.backgroundSize     = 'cover';
    hero.style.backgroundPosition = 'center center';
    hero.classList.toggle('has-placeholder', !loading);
    hero.classList.toggle('is-loading', !!loading);
    hero.classList.remove('has-lesson-image');
    _setCredit(hero, img.filename ? `📸 Add: ${img.filename}` : (img.hint||''));
  }

  function _setCredit(hero, text) {
    let b = hero.querySelector('.cv-hero-credit');
    if (!text) { b?.remove(); return; }
    if (!b) { b = document.createElement('div'); b.className='cv-hero-credit'; hero.appendChild(b); }
    b.textContent = text;
  }

  /* ── Glossary ───────────────────────────────────────────────────── */

  const GLOSSARY = {
    mana:     { title:'Mana',       culture:'Kānaka Maoli', body:'Spiritual power, authority, and life-force. Strengthened through right relationship and pono action.' },
    pono:     { title:'Pono',       culture:'Kānaka Maoli', body:'Balance, righteousness, and alignment with what is good, true, and life-supporting.' },
    aloha:    { title:'Aloha',      culture:'Kānaka Maoli', body:'Presence, breath, compassion, and right relationship — vastly more than a greeting.' },
    kumulipo: { title:'Kumulipo',   culture:'Kānaka Maoli', body:'A 2,102-line Hawaiian creation chant connecting darkness, life, sea, land, and genealogy.' },
    po:       { title:'Pō',         culture:'Kānaka Maoli', body:'Primordial darkness from which all life emerges. Not absence — pure potential.' },
    ao:       { title:'Ao',         culture:'Kānaka Maoli', body:'The realm of light and living humans. The complement of Pō in Hawaiian cosmology.' },
    koa:      { title:'Koʻa',       culture:'Kānaka Maoli', body:'Coral polyp — the first living being named in the Kumulipo. All life unfolds from this pairing.' },
    wa:       { title:'Wā',         culture:'Kānaka Maoli', body:'An epoch in the Kumulipo; also time-space understood as relational, not mechanical.' },
    moolelo:  { title:'Moʻolelo',   culture:'Kānaka Maoli', body:'Story, history, and carried memory — transmits knowledge across generations.' },
    maat:     { title:'Maʻat',      culture:'Kemet',        body:'Truth, balance, cosmic justice — the ethical order sustaining all life. Represented by the feather of truth.' },
    nun:      { title:'Nun',        culture:'Kemet',        body:'Primordial waters — the limitless, undifferentiated source from which creation emerged.' },
    atum:     { title:'Atum',       culture:'Kemet',        body:'The self-created deity who emerged from Nun and initiated divine order.' },
    duat:     { title:'Duat',       culture:'Kemet',        body:'The realm of transformation — where souls are judged and renewed, and the sun travels at night.' },
    isfet:    { title:'Isfet',      culture:'Kemet',        body:'Disorder, injustice, and falsehood — what happens when Maʻat is broken.' },
    medu:     { title:'Medu Neter', culture:'Kemet',        body:'Sacred Kemetic writing — literally "words of the gods." A living system of meaning, not mere script.' }
  };

  const DEFAULT_REFLECTIONS = [
    'What is the deepest idea this lesson preserves — and for whom?',
    'How does this knowledge connect land, sea, sky, family, or community?',
    'What responsibility comes with knowing this?'
  ];

  /* ── State ──────────────────────────────────────────────────────── */

  const state = {
    data:null, cultures:[], lessons:[],
    activeCulture:'all', activeLessonId:null,
    mode:        localStorage.getItem(MODE_KEY)        || 'scholar',
    fontScale:   Number(localStorage.getItem(FONT_SCALE_KEY)||'1') || 1,
    completed:   readJSON(COMPLETED_KEY, []),
    reflections: readJSON(REFLECTIONS_KEY, {}),
    sidebarSearch: ''
  };

  /* ── Utils ──────────────────────────────────────────────────────── */

  function $(s)    { return document.querySelector(s); }
  function $all(s) { return Array.from(document.querySelectorAll(s)); }
  function escapeHTML(v) { return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function readJSON(k,fb) { try { const r=localStorage.getItem(k); return r?JSON.parse(r):fb; } catch { return fb; } }
  function writeJSON(k,v) { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} }
  function stripHTML(v)   { return String(v||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }

  /* ── Data ───────────────────────────────────────────────────────── */

  function getData() {
    const d=[window.CULTURALVERSE_DATA,window.LKP_DATA,window.IKEVERSE_DATA].find(x=>x&&Array.isArray(x.cultures)&&x.cultures.length>0);
    if(d){window.CULTURALVERSE_DATA=window.LKP_DATA=window.IKEVERSE_DATA=d;}
    return d||null;
  }

  function getCultureColor(theme) {
    return {emerald:'#3cb371',kanaka:'#3cb371',gold:'#f0c96a',kemet:'#f0c96a',bridge:'#8fa0ff',
            rust:'#d98545',amber:'#e4ad48',cyan:'#54c6ee',violet:'#8fa0ff',default:'#54c6ee'}[theme]||'#54c6ee';
  }

  /* ── Completion ─────────────────────────────────────────────────── */

  function isCompleted(id) {
    if(!id) return false;
    if(window.LKPRewards?.isCompleted) try{return Boolean(window.LKPRewards.isCompleted(id));}catch{}
    return state.completed.includes(id);
  }
  function syncCompletedFromRewards() {
    if(!window.LKPRewards) return;
    try{const c=window.LKPRewards.getCompletedLessons?.();if(Array.isArray(c)){state.completed=c;writeJSON(COMPLETED_KEY,c);}window.LKPRewards.setCompletedLessons?.(state.completed);}catch{}
  }
  function saveCompleted() {
    state.completed=[...new Set(state.completed.filter(Boolean))];
    writeJSON(COMPLETED_KEY,state.completed);
    try{window.LKPRewards?.setCompletedLessons?.(state.completed);}catch{}
  }
  function getMana()  { return Number(localStorage.getItem(MANA_KEY)||'0')||0; }
  function setMana(v) { localStorage.setItem(MANA_KEY,String(Math.max(0,Number(v)||0))); }

  /* ── Normalize ──────────────────────────────────────────────────── */

  function normalizeSources(raw) {
    if(!Array.isArray(raw)) return [];
    return raw.map(s=>typeof s==='string'?{label:s,url:'',note:''}:{label:s.label||s.title||s.name||'',url:s.url||s.href||'',note:s.note||s.desc||''}).filter(s=>s.label);
  }

  function normalizeKidVersion(lesson) {
    const kid=lesson.kidVersion||lesson.keikiVersion||lesson.kid||lesson.keiki||null;
    if(!kid||typeof kid!=='object') return null;
    return {
      story:      kid.story||kid.summary||kid.intro||'',
      bigIdeas:   Array.isArray(kid.bigIdeas)?kid.bigIdeas:[],
      vocabulary: Array.isArray(kid.vocabulary)?kid.vocabulary:[],
      activity:   kid.activity||'',
      reflection: Array.isArray(kid.reflection)?kid.reflection:[]
    };
  }

  function normalizeData(data) {
    return (Array.isArray(data?.cultures)?data.cultures:[]).map(culture=>({
      id:culture.id||'', name:culture.name||'Untitled', emoji:culture.emoji||'✶',
      tagline:culture.tagline||'', theme:culture.theme||'default',
      status:culture.status||'live', intro:culture.intro||'',
      modules:Array.isArray(culture.modules)?culture.modules.map(module=>({
        id:module.id||'', title:module.title||'Module',
        emoji:module.emoji||culture.emoji||'✶', desc:module.desc||'',
        lessons:Array.isArray(module.lessons)?module.lessons.map(lesson=>({
          id:lesson.id||'', num:lesson.num||'', title:lesson.title||'Lesson',
          readTime:lesson.readTime||'', content:lesson.content||'',
          excerpt:lesson.excerpt||lesson.leadText||'',
          objectives:Array.isArray(lesson.objectives)?lesson.objectives:[],
          mana:Number(lesson.mana||DEFAULT_MANA), xp:Number(lesson.xp||25),
          image:lesson.image||lesson.heroImage||lesson.thumbnail||'',
          sources:normalizeSources(lesson.sources||lesson.references||[]),
          related:Array.isArray(lesson.related)?lesson.related:[],
          kidVersion:normalizeKidVersion(lesson),
          cultureId:culture.id||'', cultureName:culture.name||'',
          cultureEmoji:culture.emoji||'✶', cultureTheme:culture.theme||'default',
          moduleId:module.id||'', moduleTitle:module.title||'', moduleEmoji:module.emoji||culture.emoji||'✶'
        })):[]
      })):[]
    }));
  }

  function flattenLessons(cultures) {
    const ls=[];
    cultures.forEach(c=>c.modules.forEach(m=>m.lessons.forEach(l=>ls.push({...l,contentText:stripHTML(l.content||'')}))));
    return ls;
  }

  /* ── Sidebar ────────────────────────────────────────────────────── */

  function ensureSidebarTools() {
    const hdr=$('.lkp-sidebar__header');
    if(!hdr||document.getElementById('lessonTreeSearch')) return;
    const t=document.createElement('div');
    t.className='lkp-sidebar-tools';
    t.innerHTML=`<label class="lkp-tree-search"><i class="fas fa-search"></i><input id="lessonTreeSearch" type="search" placeholder="Search lessons…" autocomplete="off"/></label>`;
    hdr.appendChild(t);
  }

  function renderCultureFilters() {
    const holder=document.getElementById('cultureFilters'), welcome=document.getElementById('welcomeCultures');
    if(!holder) return;
    const live=state.cultures.filter(c=>c.modules.some(m=>m.lessons.length));
    holder.innerHTML=`<button class="cv-filter-btn is-active" type="button" data-culture-filter="all">All</button>`+
      state.cultures.map(c=>{
        const d=c.modules.every(m=>!m.lessons.length);
        return `<button class="cv-culture-filter${d?' is-disabled':''}" type="button" data-culture-filter="${escapeHTML(c.id)}" ${d?'disabled':''} style="--culture-color:${getCultureColor(c.theme)}"><span>${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}</button>`;
      }).join('');
    if(welcome) welcome.innerHTML=live.map(c=>`<button class="cv-culture-filter" type="button" data-culture-filter="${escapeHTML(c.id)}" style="--culture-color:${getCultureColor(c.theme)}"><span>${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}</button>`).join('');
  }

  function getCultureProgress(culture) {
    const all=culture.modules.flatMap(m=>m.lessons), done=all.filter(l=>isCompleted(l.id)).length;
    return {total:all.length, done, percent:all.length?Math.round((done/all.length)*100):0};
  }

  function renderLessonTree() {
    const tree=document.getElementById('lessonTree');
    if(!tree) return;
    const q=state.sidebarSearch.trim().toLowerCase();
    const visible=state.activeCulture==='all'?state.cultures:state.cultures.filter(c=>c.id===state.activeCulture);
    if(!state.cultures.length){tree.innerHTML=`<div class="cv-tree-empty"><strong>No lesson data found.</strong><span>Check that <code>LKP/js/lkp-data.js</code> loads first.</span></div>`;return;}
    tree.innerHTML=visible.map(culture=>{
      const prog=getCultureProgress(culture);
      const pbar=`<div class="cv-culture-progress"><div class="cv-culture-progress__meta"><span>${prog.done}/${prog.total} complete</span><span>${prog.percent}%</span></div><div class="cv-culture-progress__bar"><span style="width:${prog.percent}%;background:${getCultureColor(culture.theme)}"></span></div></div>`;
      const filtered=culture.modules.map(m=>({...m,lessons:m.lessons.filter(l=>!q||[l.title,l.num,culture.name,m.title,l.contentText,l.excerpt].join(' ').toLowerCase().includes(q))})).filter(m=>m.lessons.length);
      if(!filtered.length) return `<section class="cv-tree-culture"><div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}"><span>${escapeHTML(culture.emoji)}</span>${escapeHTML(culture.name)}</div>${pbar}<div class="cv-tree-module"><div class="cv-tree-module__title">Coming Soon</div><button class="cv-tree-lesson" type="button" disabled><strong>${escapeHTML(q?'No matching lessons.':culture.tagline||'Lessons being prepared.')}</strong></button></div></section>`;
      return `<section class="cv-tree-culture"><div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}"><span>${escapeHTML(culture.emoji)}</span>${escapeHTML(culture.name)}</div>${pbar}${filtered.map(m=>`<div class="cv-tree-module"><div class="cv-tree-module__title"><span>${escapeHTML(m.emoji)}</span>${escapeHTML(m.title)}</div>${m.lessons.map(l=>{const done=isCompleted(l.id),active=l.id===state.activeLessonId;return `<button class="cv-tree-lesson${active?' is-active':''}${done?' is-complete':''}" type="button" data-lesson-id="${escapeHTML(l.id)}"><strong>${done?'✓ ':''}${escapeHTML(l.num||'LESSON')} · ${escapeHTML(l.title)}</strong><small>${escapeHTML(culture.name)} · ${escapeHTML(l.readTime||'Lesson')}</small></button>`;}).join('')}</div>`).join('')}</section>`;
    }).join('')||`<div class="cv-tree-empty"><strong>No lessons found.</strong></div>`;
  }

  function findLesson(id)     { return state.lessons.find(l=>l.id===id)||null; }
  function getLessonIndex(id) { return state.lessons.findIndex(l=>l.id===id); }

  /* ══════════════════════════════════════════════════════════════════════
     LESSON HEADER
  ══════════════════════════════════════════════════════════════════════ */

  function inferObjectives(lesson) {
    if(Array.isArray(lesson.objectives)&&lesson.objectives.length) return lesson.objectives;
    const match=(lesson.content||'').match(/<objectives>([\s\S]*?)<\/objectives>/i);
    if(match){const items=match[1].split('\n').map(s=>s.replace(/^[-•]\s*/,'').trim()).filter(Boolean);if(items.length) return items;}
    const base=[
      `Understand the historical and living context of ${lesson.title} within ${lesson.cultureName||'this tradition'}.`,
      `Identify the core concepts, vocabulary, and practices this knowledge system preserves.`,
      `Reflect on how this teaching connects to living communities today.`
    ];
    if(lesson.cultureId==='kanaka') base[1]='Recognize key Hawaiian terms and their connections to land, ocean, and sky.';
    else if(lesson.cultureId==='kemet') base[1]='Explore the philosophical, scientific, and ethical dimensions of Kemetic knowledge.';
    else if(lesson.cultureId==='bridge'){base[1]='Draw connections between parallel concepts across Hawaiian and Kemetic traditions.';base[2]='Consider what cross-cultural dialogue reveals about universal human knowledge systems.';}
    return base;
  }

  function renderLessonHeader(lesson) {
    const done=isCompleted(lesson.id), mana=lesson.mana||DEFAULT_MANA;
    const words=lesson.contentText?lesson.contentText.split(/\s+/).length:0;
    const readLabel=lesson.readTime||(words>0?`${Math.ceil(words/200)} min read`:'Deep Reading');
    const objectives=inferObjectives(lesson);
    return `
      <nav class="cv-lesson-path">
        <span class="cv-lesson-path__link">${escapeHTML(lesson.cultureEmoji)} ${escapeHTML(lesson.cultureName)}</span>
        <span class="cv-lesson-path__sep">›</span>
        <span>${escapeHTML(lesson.moduleTitle)}</span>
        ${lesson.num?`<span class="cv-lesson-path__sep">›</span><span>${escapeHTML(lesson.num)}</span>`:''}
      </nav>

      <h1 class="cv-lesson-title">${escapeHTML(lesson.title)}</h1>
      ${lesson.excerpt?`<p class="cv-lesson-excerpt">${escapeHTML(lesson.excerpt)}</p>`:''}

      <div class="cv-lesson-meta">
        ${lesson.num?`<span class="cv-meta-chip"><i class="fas fa-hashtag"></i>${escapeHTML(lesson.num)}</span>`:''}
        <span class="cv-meta-chip"><i class="fas fa-clock"></i>${escapeHTML(readLabel)}</span>
        <span class="cv-meta-chip" style="border-color:var(--active-color);color:var(--active-color);">${escapeHTML(lesson.cultureEmoji)} ${escapeHTML(lesson.cultureName)}</span>
        <span class="cv-meta-chip">${state.mode==='keiki'?'🌺 Keiki':'📜 Scholar'}</span>
      </div>

      ${objectives.length?`
      <details class="cv-objectives">
        <summary class="cv-objectives__toggle">
          <i class="fas fa-compass"></i> Learning Objectives
          <i class="fas fa-chevron-down cv-objectives__arrow"></i>
        </summary>
        <ul class="cv-objectives__list">${objectives.map(o=>`<li>${escapeHTML(o)}</li>`).join('')}</ul>
      </details>`:''}

      <div id="lessonActionSentinel" style="height:1px;margin:-1px 0 0;pointer-events:none;"></div>
      <div class="cv-action-strip" id="lessonActionStrip" role="toolbar">
        <button class="cv-btn-complete ${done?'is-complete':''}" type="button" data-complete-active-lesson>
          ${done?'<i class="fas fa-check-circle"></i> Complete':`<i class="fas fa-star"></i> Mark Complete · +${mana} Mana`}
        </button>
        <div class="cv-mode-toggle" role="group">
          <button class="cv-btn-mode ${state.mode==='scholar'?'is-active':''}" type="button" data-lesson-mode="scholar"><i class="fas fa-scroll"></i> Scholar</button>
          <button class="cv-btn-mode ${state.mode==='keiki'?'is-active':''}" type="button" data-lesson-mode="keiki">🌺 Keiki</button>
        </div>
        <div class="cv-font-controls" role="group">
          <button class="cv-btn-icon" type="button" data-font-adjust="-">A−</button>
          <button class="cv-btn-icon" type="button" data-font-adjust="+">A+</button>
        </div>
        <button class="cv-btn-icon" type="button" data-reading-mode title="Focus mode"><i class="fas fa-expand"></i></button>
      </div>`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     CONTENT TRANSFORMS
     Supports all existing tags + new: <chant>, <primary-source>,
     <scripture>, <manuscript>
  ══════════════════════════════════════════════════════════════════════ */

  function transformContent(content, lesson) {
    let h = String(content||'');
    h = h.replace(/<objectives>[\s\S]*?<\/objectives>/gi, '');

    /* ── Chant — oral tradition, line by line ── */
    h = h.replace(/<chant(?:\s+lang="([^"]*)")?(?:\s+title="([^"]*)")?>([\s\S]*?)<\/chant>/gi,
      (_,lang,title,inner) => {
        const lines=inner.trim().split('\n').map(s=>s.trim()).filter(Boolean);
        return `<div class="cv-chant" lang="${escapeHTML(lang||'haw')}">
          <div class="cv-chant__header">
            <span class="cv-chant__lang">${escapeHTML(lang||'Traditional')}</span>
            ${title?`<span class="cv-chant__title">${escapeHTML(title)}</span>`:''}
          </div>
          <div class="cv-chant__lines">${lines.map(l=>`<div class="cv-chant__line">${escapeHTML(l)}</div>`).join('')}</div>
        </div>`;
      });

    /* ── Primary source — translated excerpt with attribution ── */
    h = h.replace(/<primary-source(?:\s+cite="([^"]*)")?(?:\s+date="([^"]*)")?>([\s\S]*?)<\/primary-source>/gi,
      (_,cite,date,inner) =>
        `<blockquote class="cv-primary-source">
          <div class="cv-primary-source__mark">❝</div>
          <div class="cv-primary-source__text">${inner.trim()}</div>
          ${cite||date?`<footer class="cv-primary-source__footer">${date?`<span class="cv-primary-source__date">${escapeHTML(date)}</span>`:''}${cite?`<cite class="cv-primary-source__cite">${escapeHTML(cite)}</cite>`:''}</footer>`:''}
        </blockquote>`);

    /* ── Scripture — kemetic/sacred block ── */
    h = h.replace(/<scripture(?:\s+cite="([^"]*)")?(?:\s+title="([^"]*)")?>([\s\S]*?)<\/scripture>/gi,
      (_,cite,title,inner) =>
        `<div class="cv-scripture">
          ${title?`<div class="cv-scripture__title">${escapeHTML(title)}</div>`:''}
          <div class="cv-scripture__text">${inner.trim()}</div>
          ${cite?`<div class="cv-scripture__cite">— ${escapeHTML(cite)}</div>`:''}
        </div>`);

    /* ── Manuscript — papyrus/document ── */
    h = h.replace(/<manuscript(?:\s+cite="([^"]*)")?>([\s\S]*?)<\/manuscript>/gi,
      (_,cite,inner) =>
        `<div class="cv-manuscript">
          <div class="cv-manuscript__text">${inner.trim()}</div>
          ${cite?`<div class="cv-manuscript__cite">${escapeHTML(cite)}</div>`:''}
        </div>`);

    /* ── Callout ── */
    h = h.replace(/<callout(?:\s+type="([^"]+)")?>([\s\S]*?)<\/callout>/gi,
      (_,type,inner) => `<div class="cv-callout${type?` cv-callout--${escapeHTML(type)}`:''}" role="note">${inner}</div>`);

    /* ── Facts ── */
    h = h.replace(/<facts>([\s\S]*?)<\/facts>/gi, (_,inner) =>
      `<div class="cv-facts">${inner.split('|').map(s=>s.trim()).filter(Boolean).map(item=>{const[v,l]=item.split('::').map(s=>s?.trim()||'');return `<div class="cv-fact"><strong>${escapeHTML(v||item)}</strong>${l?`<span>${escapeHTML(l)}</span>`:''}</div>`;}).join('')}</div>`);

    /* ── Two col ── */
    h = h.replace(/<twocol\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/twocol>/gi,
      (_,left,right,inner) => {const[a,b]=inner.split('||');return `<div class="cv-twocol"><div class="cv-twocol__side"><strong class="cv-twocol__label">${escapeHTML(left)}</strong><div>${(a||'').trim()}</div></div><div class="cv-twocol__side"><strong class="cv-twocol__label">${escapeHTML(right)}</strong><div>${(b||'').trim()}</div></div></div>`;});

    /* ── Compare ── */
    h = h.replace(/<compare\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/compare>/gi,
      (_,left,right,inner) => {const[a,b]=inner.split('||');return `<div class="cv-compare"><div class="cv-compare__side"><strong class="cv-compare__label">${escapeHTML(left)}</strong><div>${(a||'').trim()}</div></div><div class="cv-compare__divider"></div><div class="cv-compare__side"><strong class="cv-compare__label">${escapeHTML(right)}</strong><div>${(b||'').trim()}</div></div></div>`;});

    /* ── Concepts ── */
    h = h.replace(/<concepts>([\s\S]*?)<\/concepts>/gi, (_,inner) =>
      `<div class="cv-concepts" role="list">${inner.split('·').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="cv-concept" role="listitem">${escapeHTML(s)}</span>`).join('')}</div>`);

    /* ── Quote ── */
    h = h.replace(/<quote(?:\s+cite="([^"]+)")?>([\s\S]*?)<\/quote>/gi,
      (_,cite,inner) => `<blockquote class="cv-quote"><p>${inner.trim()}</p>${cite?`<cite>— ${escapeHTML(cite)}</cite>`:''}</blockquote>`);

    /* ── Term (glossary) ── */
    h = h.replace(/<term(?:\s+key="([^"]+)")?>([\s\S]*?)<\/term>/gi,
      (_,key,inner) => {
        const label=stripHTML(inner), lk=String(key||label).toLowerCase().replace(/[^a-z0-9]/g,'');
        const def=GLOSSARY[lk]||GLOSSARY[lk.replace(/ʻ|'/g,'')];
        return `<span class="cv-term" tabindex="0" role="button" data-term-title="${escapeHTML(def?.title||label)}" data-term-culture="${escapeHTML(def?.culture||lesson.cultureName||'')}" data-term-body="${escapeHTML(def?.body||'A key term in this lesson.')}">${inner}</span>`;
      });

    /* ── Timeline ── */
    h = h.replace(/<timeline>([\s\S]*?)<\/timeline>/gi, (_,inner) =>
      `<div class="cv-timeline" role="list">${inner.split('\n').map(s=>s.trim()).filter(Boolean).map(item=>{const[date,text]=item.split('::').map(s=>s?.trim()||'');return `<div class="cv-timeline__item" role="listitem"><div class="cv-timeline__dot"></div><div><strong class="cv-timeline__date">${escapeHTML(date)}</strong><span class="cv-timeline__text">${escapeHTML(text)}</span></div></div>`;}).join('')}</div>`);

    /* ── Activity ── */
    h = h.replace(/<activity>([\s\S]*?)<\/activity>/gi,
      (_,inner) => `<div class="cv-activity" role="note"><div class="cv-activity__hd"><i class="fas fa-hand-sparkles"></i><strong>Learning Activity</strong></div><div class="cv-activity__body">${inner.trim()}</div></div>`);

    /* ── Teacher note ── */
    h = h.replace(/<teacher-note>([\s\S]*?)<\/teacher-note>/gi,
      (_,inner) => `<aside class="cv-teacher-note"><div class="cv-aside-hd"><i class="fas fa-chalkboard-teacher"></i><strong>Teacher Note</strong></div><p>${inner.trim()}</p></aside>`);

    /* ── Historian note ── */
    h = h.replace(/<historian-note>([\s\S]*?)<\/historian-note>/gi,
      (_,inner) => `<aside class="cv-historian-note"><div class="cv-aside-hd"><i class="fas fa-scroll"></i><strong>Historian Note</strong></div><p>${inner.trim()}</p></aside>`);

    /* ── Reflect (inline accordion) ── */
    h = h.replace(/<reflect(?:\s+title="([^"]+)")?>([\s\S]*?)<\/reflect>/gi,
      (_,title,inner) => renderReflectionAccordion(inner.split('\n').map(s=>s.trim()).filter(Boolean), lesson, title));

    return h;
  }

  /* ── Reflection accordion ───────────────────────────────────────── */

  function renderReflectionAccordion(prompts, lesson, title) {
    const ex=state.reflections[lesson.id]||{};
    return `<details class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}">
      <summary class="cv-reflection__toggle">
        <i class="fas fa-pen-nib"></i> ${escapeHTML(title||'Reflection Prompts')}
        <span class="cv-reflection__hint">click to open</span>
      </summary>
      <div class="cv-reflection__body">
        <p class="cv-reflection__intro">These prompts are for your own thinking — saved locally on this device.</p>
        <div class="cv-reflection-list">
          ${prompts.map((p,i)=>`<label class="cv-reflection-card"><span class="cv-reflection-card__prompt">${escapeHTML(p)}</span><textarea data-reflection-index="${i}" placeholder="Write your reflection…" rows="3">${escapeHTML(ex[i]||'')}</textarea></label>`).join('')}
        </div>
        <div class="cv-reflection-status" id="reflectionStatus"><i class="fas fa-lock"></i> Saved on this device only</div>
      </div>
    </details>`;
  }

  /* ── Keiki mode ─────────────────────────────────────────────────── */

  function renderKeikiContent(lesson) {
    const kid=lesson.kidVersion;
    const story=kid?.story||kid?.summary||autoStory(lesson);
    const bigIdeas=kid?.bigIdeas?.length?kid.bigIdeas:autoIdeas(lesson);
    const vocab=kid?.vocabulary?.length?kid.vocabulary:autoVocab(lesson);
    const activity=kid?.activity||autoActivity(lesson);
    const prompts=kid?.reflection?.length?kid.reflection:['What surprised you most?','How would you explain this to a friend?','What question do you still have?'];
    const ex=state.reflections[lesson.id]||{};

    return `<div class="cv-keiki-wrap">
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
          ${bigIdeas.map((idea,i)=>`<div class="cv-keiki-idea"><span class="cv-keiki-idea__num">${i+1}</span><p>${escapeHTML(idea)}</p></div>`).join('')}
        </div>
      </section>

      ${vocab.length?`<section class="cv-keiki-section">
        <h3 class="cv-keiki-section__title"><span>📚</span> Words to Know</h3>
        <div class="cv-keiki-vocab">
          ${vocab.map(v=>`<div class="cv-keiki-vocab__card"><strong>${escapeHTML(v.term||v.title||'')}</strong><span>${escapeHTML(v.meaning||v.body||v.definition||'')}</span></div>`).join('')}
        </div>
      </section>`:''}

      <section class="cv-keiki-section">
        <h3 class="cv-keiki-section__title"><span>✏️</span> Try This</h3>
        <div class="cv-keiki-activity">${escapeHTML(activity)}</div>
      </section>

      <details class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}">
        <summary class="cv-reflection__toggle"><i class="fas fa-pen-nib"></i> Your Reflections <span class="cv-reflection__hint">click to open</span></summary>
        <div class="cv-reflection__body">
          <div class="cv-reflection-list">
            ${prompts.map((p,i)=>`<label class="cv-reflection-card"><span class="cv-reflection-card__prompt">${escapeHTML(p)}</span><textarea data-reflection-index="${i}" placeholder="Write here…" rows="3">${escapeHTML(ex[i]||'')}</textarea></label>`).join('')}
          </div>
          <div class="cv-reflection-status" id="reflectionStatus"><i class="fas fa-lock"></i> Saved on this device only</div>
        </div>
      </details>
    </div>`;
  }

  function autoStory(lesson) {
    return escapeHTML(stripHTML(lesson.content||'').split(/[.!?]/).slice(0,3).join('. ').trim() ||
      `${lesson.title} is an important teaching from ${lesson.cultureName}.`);
  }
  function autoIdeas(lesson) {
    return [
      `This knowledge belongs to ${lesson.cultureName} — a living tradition.`,
      'Knowledge is passed through story, chant, and practice — not just books.',
      'When we learn, we carry something important forward for those who come after.'
    ];
  }
  function autoVocab(lesson) {
    return Object.entries(GLOSSARY).filter(([k])=>(lesson.contentText+lesson.title).toLowerCase().includes(k)).slice(0,5).map(([,v])=>({term:v.title,meaning:v.body}));
  }
  function autoActivity(lesson) {
    if(lesson.cultureId==='kanaka') return 'Draw a web with the ocean in the center. Connect: water → coral → fish → birds → people. Write one word on each line describing the relationship.';
    if(lesson.cultureId==='kemet')  return 'Draw two columns: Maʻat (Balance) and Isfet (Disorder). List 3 things from your own life in each column. What tips the scales?';
    return 'Create a mind map with this lesson\'s title at the center. Add 5 connecting ideas. Share one connection with someone you trust.';
  }

  /* ── Reflection save ────────────────────────────────────────────── */

  function bindReflectionTextareas(lesson) {
    $all('[data-reflection-index]').forEach(ta=>{
      ta.addEventListener('input',()=>{
        const r=state.reflections[lesson.id]||{};
        r[ta.dataset.reflectionIndex]=ta.value;
        state.reflections[lesson.id]=r;
        writeJSON(REFLECTIONS_KEY,state.reflections);
        const s=document.getElementById('reflectionStatus');
        if(s){s.innerHTML='<i class="fas fa-check"></i> Saved';clearTimeout(bindReflectionTextareas._t);bindReflectionTextareas._t=setTimeout(()=>{s.innerHTML='<i class="fas fa-lock"></i> Saved on this device only';},1800);}
      });
    });
  }

  /* ── Sources ────────────────────────────────────────────────────── */

  function renderSources(lesson) {
    const holder=document.getElementById('lessonSources');
    if(!holder) return;
    const sources=lesson.sources||[];
    if(!sources.length){holder.innerHTML='';return;}
    holder.innerHTML=`<section class="cv-sources"><div class="cv-divider-heading"><span>Sources & Further Study</span></div><div class="cv-source-list">${sources.map(s=>`<a class="cv-source-card" href="${escapeHTML(s.url||'#')}" ${s.url?'target="_blank" rel="noopener"':''}><strong>${escapeHTML(s.label)}</strong>${s.note?`<span>${escapeHTML(s.note)}</span>`:''}<small>${s.url?'Open →':'Reference'}</small></a>`).join('')}</div></section>`;
  }

  /* ── Related ────────────────────────────────────────────────────── */

  function renderRelatedLessons(lesson) {
    const nav=document.getElementById('lessonNav');
    if(!nav) return;
    let holder=document.getElementById('relatedLessons');
    if(!holder){holder=document.createElement('section');holder.id='relatedLessons';holder.className='cv-related';nav.insertAdjacentElement('afterend',holder);}
    const byId=new Map(state.lessons.map(l=>[l.id,l]));
    const explicit=(lesson.related||[]).map(id=>byId.get(id)).filter(Boolean);
    const sameModule=state.lessons.filter(l=>l.id!==lesson.id&&l.moduleId===lesson.moduleId);
    const bridgeMatch=state.lessons.filter(l=>{if(l.id===lesson.id) return false;const a=`${lesson.title} ${lesson.contentText}`.toLowerCase(),b=`${l.title} ${l.contentText}`.toLowerCase();return[['kumulipo','nun'],['aloha','maat'],['star','wayfinding'],['creation','primordial'],['medicine','healing']].some(([x,y])=>(a.includes(x)&&b.includes(y))||(a.includes(y)&&b.includes(x)));});
    const related=[...new Map([...explicit,...bridgeMatch,...sameModule].map(l=>[l.id,l])).values()].filter(l=>l.id!==lesson.id).slice(0,3);
    if(!related.length){holder.innerHTML='';return;}
    holder.innerHTML=`<div class="cv-divider-heading"><span>Related Lessons</span></div><div class="cv-related-grid">${related.map(l=>`<button class="cv-related-card" type="button" data-related-lesson="${escapeHTML(l.id)}" style="--related-color:${getCultureColor(l.cultureTheme)}"><span class="cv-related-card__emoji">${escapeHTML(l.cultureEmoji||'✦')}</span><div><strong>${escapeHTML(l.title)}</strong><small>${escapeHTML(l.cultureName)} · ${escapeHTML(l.moduleTitle)}</small></div>${isCompleted(l.id)?'<span class="cv-related-card__done">✓</span>':''}</button>`).join('')}</div>`;
  }

  /* ── Nav ────────────────────────────────────────────────────────── */

  function renderLessonNav() {
    const nav=document.getElementById('lessonNav');
    if(!nav||!state.activeLessonId) return;
    const idx=getLessonIndex(state.activeLessonId);
    const prev=idx>0?state.lessons[idx-1]:null, next=idx<state.lessons.length-1?state.lessons[idx+1]:null;
    nav.innerHTML=`
      <button class="cv-nav-btn" type="button" data-nav-lesson="${prev?escapeHTML(prev.id):''}" ${prev?'':'disabled'}>
        <i class="fas fa-arrow-left"></i>
        <div><small>Previous</small><span>${prev?escapeHTML(prev.title):'—'}</span></div>
      </button>
      <button class="cv-nav-btn cv-nav-btn--next" type="button" data-nav-lesson="${next?escapeHTML(next.id):''}" ${next?'':'disabled'}>
        <div><small>Next</small><span>${next?escapeHTML(next.title):'—'}</span></div>
        <i class="fas fa-arrow-right"></i>
      </button>`;
  }

  /* ── Render lesson ──────────────────────────────────────────────── */

  function renderLesson(id, opts={}) {
    const lesson=findLesson(id);
    if(!lesson){renderWelcome();return;}

    state.activeLessonId=lesson.id;
    document.body.dataset.culture=lesson.cultureId||'default';
    document.body.dataset.lessonMode=state.mode;
    document.documentElement.style.setProperty('--lesson-font-scale',String(state.fontScale));

    const welcome=document.getElementById('lessonWelcome'), article=document.getElementById('lessonArticle');
    if(welcome) welcome.hidden=true;
    if(article) article.hidden=false;

    const header=document.getElementById('lessonHeader');
    if(header) header.innerHTML=renderLessonHeader(lesson);

    const body=document.getElementById('lessonBody');
    if(body){
      body.innerHTML=state.mode==='keiki'?renderKeikiContent(lesson):transformContent(lesson.content,lesson);
      // Append bottom reflection if no <reflect> tag found in content
      if(state.mode==='scholar'&&!body.querySelector('.cv-reflection')){
        body.insertAdjacentHTML('beforeend',renderReflectionAccordion(DEFAULT_REFLECTIONS,lesson,'Reflection Prompts'));
      }
    }

    updateHeroImage(lesson);
    const emoji=document.getElementById('cultureHeroEmoji'), name=document.getElementById('cultureHeroName');
    if(emoji) emoji.textContent=lesson.cultureEmoji||'✦';
    if(name)  name.textContent=`${lesson.cultureName} · ${lesson.moduleTitle}`;

    renderSources(lesson);
    renderLessonNav();
    renderRelatedLessons(lesson);
    renderLessonTree();
    updateCompleteButton(lesson);
    updateUrlHash(lesson.id);
    bindReflectionTextareas(lesson);
    initStickyStrip();

    window.dispatchEvent(new CustomEvent('lkp:culture-changed',{detail:{cultureId:lesson.cultureId,color:getCultureColor(lesson.cultureTheme)}}));
    window.dispatchEvent(new CustomEvent('lkp:lesson-changed',{detail:{lessonId:lesson.id,lesson}}));

    if(!opts.noScroll) requestAnimationFrame(()=>document.getElementById('lessonMain')?.scrollIntoView({behavior:'smooth',block:'start'}));
    closeSidebarOnMobile();
  }

  function updateCompleteButton(lesson) {
    const btn=document.querySelector('[data-complete-active-lesson]');
    if(!btn||!lesson) return;
    const done=isCompleted(lesson.id);
    btn.classList.toggle('is-complete',done);
    btn.innerHTML=done?'<i class="fas fa-check-circle"></i> Complete':`<i class="fas fa-star"></i> Mark Complete · +${lesson.mana||DEFAULT_MANA} Mana`;
  }

  function renderWelcome() {
    const w=document.getElementById('lessonWelcome'), a=document.getElementById('lessonArticle');
    if(w) w.hidden=false;
    if(a) a.hidden=true;
    state.activeLessonId=null;
    renderLessonTree();
  }

  /* ── Sticky action strip ────────────────────────────────────────── */

  let _obs=null;
  function initStickyStrip() {
    if(_obs){_obs.disconnect();}
    const strip=document.getElementById('lessonActionStrip'), sentinel=document.getElementById('lessonActionSentinel');
    if(!strip||!sentinel||!('IntersectionObserver' in window)) return;
    _obs=new IntersectionObserver(entries=>{strip.classList.toggle('is-stuck',!entries[0].isIntersecting)},{threshold:0});
    _obs.observe(sentinel);
  }

  /* ── URL hash ───────────────────────────────────────────────────── */

  function updateUrlHash(id) {
    if(!id) return;
    const next='#'+encodeURIComponent(id);
    if(window.location.hash!==next) history.replaceState(null,'',next);
  }

  function openLessonFromHash(opts={}) {
    const hash=decodeURIComponent(window.location.hash.replace(/^#/,''));
    if(!hash) return false;
    const lesson=findLesson(hash);
    if(!lesson) return false;
    state.activeCulture='all';
    renderLesson(lesson.id,opts);
    return true;
  }

  /* ── Complete ───────────────────────────────────────────────────── */

  function completeActiveLesson() {
    const lesson=findLesson(state.activeLessonId);
    if(!lesson) return;
    if(isCompleted(lesson.id)){showToast('Already complete — Nānā i ke kumu.');return;}
    state.completed.push(lesson.id);
    saveCompleted();
    const mana=lesson.mana||DEFAULT_MANA;
    if(window.LKPRewards?.completeLesson){try{window.LKPRewards.completeLesson(lesson.id,{mana});}catch{}}
    else setMana(getMana()+mana);
    updateCompleteButton(lesson);
    renderLessonTree();
    triggerCeremony(lesson,mana);
    window.dispatchEvent(new CustomEvent('lkp:lesson-completed',{detail:{lessonId:lesson.id,lesson,manaAdded:mana}}));
  }

  function showToast(msg) {
    let t=document.getElementById('lessonToast');
    if(!t){t=document.createElement('div');t.id='lessonToast';t.className='cv-lesson-toast';document.body.appendChild(t);}
    t.textContent=msg;t.classList.add('is-visible');clearTimeout(showToast._t);
    showToast._t=setTimeout(()=>t.classList.remove('is-visible'),3000);
  }

  function triggerCeremony(lesson,mana) {
    showToast(`Lesson complete · +${mana} Mana earned`);
    const burst=document.createElement('div');
    burst.className='cv-completion-burst';
    burst.style.setProperty('--burst-color',getCultureColor(lesson.cultureTheme));
    burst.innerHTML=`<div class="cv-completion-burst__core">+${mana}</div>`+Array.from({length:18},(_,i)=>`<span style="--i:${i}"></span>`).join('');
    document.body.appendChild(burst);
    setTimeout(()=>burst.remove(),1700);
  }

  /* ── Controls ───────────────────────────────────────────────────── */

  function setLessonMode(mode) {
    state.mode=mode==='keiki'?'keiki':'scholar';
    localStorage.setItem(MODE_KEY,state.mode);
    if(state.activeLessonId) renderLesson(state.activeLessonId,{noScroll:true});
  }

  function adjustFont(dir) {
    state.fontScale=Math.max(0.86,Math.min(1.32,state.fontScale+(dir==='+'?0.08:-0.08)));
    localStorage.setItem(FONT_SCALE_KEY,String(state.fontScale));
    document.documentElement.style.setProperty('--lesson-font-scale',String(state.fontScale));
  }

  function closeSidebarOnMobile() {
    if(window.matchMedia('(max-width:980px)').matches) document.getElementById('cvSidebar')?.classList.remove('is-open');
  }

  /* ── Events ─────────────────────────────────────────────────────── */

  function bindEvents() {
    document.addEventListener('click',e=>{
      const cf=e.target.closest('[data-culture-filter]');
      if(cf){state.activeCulture=cf.dataset.cultureFilter||'all';$all('[data-culture-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.cultureFilter===state.activeCulture));renderLessonTree();return;}
      const lb=e.target.closest('[data-lesson-id]');     if(lb){renderLesson(lb.dataset.lessonId);return;}
      const nb=e.target.closest('[data-nav-lesson]');    if(nb&&nb.dataset.navLesson){renderLesson(nb.dataset.navLesson);return;}
      const rl=e.target.closest('[data-related-lesson]');if(rl){renderLesson(rl.dataset.relatedLesson);return;}
      if(e.target.closest('[data-complete-active-lesson]')){completeActiveLesson();return;}
      const mb=e.target.closest('[data-lesson-mode]');   if(mb){setLessonMode(mb.dataset.lessonMode);return;}
      const fb=e.target.closest('[data-font-adjust]');   if(fb){adjustFont(fb.dataset.fontAdjust);return;}
      if(e.target.closest('[data-reading-mode]')) document.body.classList.toggle('is-reading-mode');
    });
    document.addEventListener('input',e=>{
      if(e.target.matches('#lessonTreeSearch')){state.sidebarSearch=e.target.value;renderLessonTree();window.dispatchEvent(new Event('lkp:tree-built'));}
    });
    window.addEventListener('hashchange',()=>openLessonFromHash({noScroll:true}));
    document.addEventListener('keydown',e=>{
      if(!state.activeLessonId) return;
      const idx=getLessonIndex(state.activeLessonId);
      if(e.key==='ArrowLeft'&&idx>0) renderLesson(state.lessons[idx-1].id);
      if(e.key==='ArrowRight'&&idx<state.lessons.length-1) renderLesson(state.lessons[idx+1].id);
      if(e.key==='Escape') document.body.classList.remove('is-reading-mode');
    });
  }

  function initNavAndProgress() {
    const toggle=document.getElementById('lkpMobileToggle'), navLinks=document.getElementById('lkpNavLinks');
    if(toggle&&navLinks){toggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});}
    const fab=document.getElementById('cvSidebarFab'), sidebar=document.getElementById('cvSidebar');
    if(fab&&sidebar){fab.addEventListener('click',()=>sidebar.classList.toggle('is-open'));document.addEventListener('click',ev=>{if(!sidebar.classList.contains('is-open')) return;if(!sidebar.contains(ev.target)&&ev.target!==fab) sidebar.classList.remove('is-open');});}
    const yr=document.getElementById('footerYear');
    if(yr) yr.textContent=new Date().getFullYear();
    const fill=document.getElementById('progressFill');
    window.addEventListener('scroll',()=>{if(!fill) return;const max=document.documentElement.scrollHeight-document.documentElement.clientHeight;fill.style.width=`${max>0?(window.scrollY/max)*100:0}%`;},{passive:true});
  }

  /* ── Build ──────────────────────────────────────────────────────── */

  function build(data) {
    state.data=data;
    state.cultures=normalizeData(data);
    state.lessons=flattenLessons(state.cultures);
    syncCompletedFromRewards();
    ensureSidebarTools();
    console.info('[LKP Lessons v5] Loaded:',state.cultures.length,'cultures,',state.lessons.length,'lessons');
    renderCultureFilters();
    renderLessonTree();
    const opened=openLessonFromHash({noScroll:true});
    if(!opened&&state.lessons.length) renderLesson(state.lessons[0].id,{noScroll:true});
    bindEvents();
    initNavAndProgress();
    window.dispatchEvent(new Event('lkp:tree-built'));
  }

  function waitForDataAndBuild() {
    let attempts=0;
    const MAX=8, MS=250;
    window.addEventListener('lkp:data-ready',function onReady(ev){
      window.removeEventListener('lkp:data-ready',onReady);
      const d=ev?.detail?.data||getData();
      if(d&&!state.data) build(d);
    });
    (function attempt(){
      const d=getData();
      if(d){build(d);return;}
      if(++attempts>=MAX){console.warn('[LKP Lessons] No data after',MAX*MS,'ms.');build({cultures:[]});return;}
      setTimeout(attempt,MS);
    })();
  }

  document.addEventListener('DOMContentLoaded',waitForDataAndBuild);
})();