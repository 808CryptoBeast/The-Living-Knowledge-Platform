/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — DEEP LESSONS PAGE  v3
   File: LKP/js/lkp-lessons.js
   Additive: hero images · progress bars · complete button · reflections
             keiki mode · related lessons · sources · glossary <term>
             timeline · focus mode · font controls · Three.js overlay
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

  /* ── Hero image map ─────────────────────────────────────────────────────
     Priority: lesson.image (from lkp-data.js) → this map → culture fallback.
     All Wikimedia Commons URLs are public domain or freely licensed.
  ── */
  const LESSON_IMAGES = {
    'km-kumulipo':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg',                                             credit: 'Milky Way — Wikimedia Commons',         pos: 'center 40%' },
    'km-wakea':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Milky_way_from_earth.jpg/1280px-Milky_way_from_earth.jpg',                                 credit: 'Night sky — Wikimedia Commons',          pos: 'center 60%' },
    'km-starcompass': { url: 'LKP/assets/images/hawaiian-star-compass.jpg',                                                                                                        credit: "Nainoa Thompson's Hawaiian Star Compass", pos: 'center center' },
    'km-hokuleaa':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Hokule%27a_and_Hikianalia_in_Kaneohe_Bay.jpg/1280px-Hokule%27a_and_Hikianalia_in_Kaneohe_Bay.jpg', credit: "Hokule'a — Wikimedia Commons",    pos: 'center 55%' },
    'km-ahupuaa':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Nuuanu_Valley_from_Pali_Lookout.jpg/1280px-Nuuanu_Valley_from_Pali_Lookout.jpg',          credit: 'Nuuanu Valley — Wikimedia Commons',     pos: 'center 45%' },
    'km-loikalo':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hanalei_Valley_taro_fields.jpg/1280px-Hanalei_Valley_taro_fields.jpg',                    credit: 'Hanalei Valley taro — Wikimedia Commons', pos: 'center 50%' },
    'km-olelo':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Hawaiian_language.jpg/1280px-Hawaiian_language.jpg',                                       credit: 'Hawaiian language — Wikimedia Commons', pos: 'center center' },
    'km-hula':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Hula_performance_at_Merrie_Monarch.jpg/1280px-Hula_performance_at_Merrie_Monarch.jpg',    credit: 'Hula performance — Wikimedia Commons',  pos: 'center 30%' },
    'km-laau':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tropical_forest_Hawaii.jpg/1280px-Tropical_forest_Hawaii.jpg',                            credit: 'Hawaiian forest — Wikimedia Commons',   pos: 'center 60%' },
    'ke-nun':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nile_at_Aswan.jpg/1280px-Nile_at_Aswan.jpg',                                             credit: 'Nile at Aswan — Wikimedia Commons',     pos: 'center 70%' },
    'ke-ennead':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Karnak_temple.jpg/1280px-Karnak_temple.jpg',                                              credit: 'Karnak Temple — Wikimedia Commons',     pos: 'center 40%' },
    'ke-ptah':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ptah_standing.svg/480px-Ptah_standing.svg.png',                                           credit: 'Ptah — Wikimedia Commons',              pos: 'center center' },
    'ke-maat':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Egypt_luxor_karnak_temple_033.jpg/1280px-Egypt_luxor_karnak_temple_033.jpg',              credit: 'Karnak reliefs — Wikimedia Commons',    pos: 'center 35%' },
    'ke-maat-politics':{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Great_Sphinx_of_Giza_-_20080716a.jpg/1280px-Great_Sphinx_of_Giza_-_20080716a.jpg',      credit: 'Great Sphinx — Wikimedia Commons',      pos: 'center 55%' },
    'ke-medunetjer':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Hieroglyphen_im_Alten_%C3%84gypten.jpg/1280px-Hieroglyphen_im_Alten_%C3%84gypten.jpg',   credit: 'Hieroglyphs — Wikimedia Commons',       pos: 'center center' },
    'ke-medicine':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Edwin_Smith_Papyrus_v2.jpg/800px-Edwin_Smith_Papyrus_v2.jpg',                             credit: 'Edwin Smith Papyrus — Wikimedia Commons', pos: 'center center' },
    'br-darkness':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Starsinthesky.jpg/1280px-Starsinthesky.jpg',                                              credit: 'Stars — Wikimedia Commons',             pos: 'center center' },
    'br-aloha-maat':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg',                                           credit: 'Stars — Wikimedia Commons',             pos: 'center 40%' }
  };

  const CULTURE_IMAGES = {
    kanaka:    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Haleakala_sunrise.jpg/1280px-Haleakala_sunrise.jpg',  pos: 'center 40%' },
    kemet:     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/1280px-Kheops-Pyramid.jpg',        pos: 'center 60%' },
    bridge:    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg',        pos: 'center 40%' },
    dreamtime: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uluru%2C_Ayers_Rock.jpg/1280px-Uluru%2C_Ayers_Rock.jpg', pos: 'center 55%' },
    default:   { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg',        pos: 'center 50%' }
  };

  /* ── Glossary ─────────────────────────────────────────────────────────── */
  const GLOSSARY = {
    mana:     { title: 'Mana',     culture: 'Kanaka Maoli', body: 'Spiritual power, authority, and life-force. Strengthened through right relationship and pono action.' },
    pono:     { title: 'Pono',     culture: 'Kanaka Maoli', body: 'Balance, righteousness, and alignment with what is good, true, and life-supporting.' },
    aloha:    { title: 'Aloha',    culture: 'Kanaka Maoli', body: 'Presence, breath, compassion, responsibility, and right relationship.' },
    kumulipo: { title: 'Kumulipo', culture: 'Kanaka Maoli', body: 'A deep Hawaiian creation chant and genealogy preserving relationships among darkness, life, sea, land, and cosmos.' },
    moolelo:  { title: 'Moolelo', culture: 'Kanaka Maoli', body: 'Story, history, and carried memory. Transmits knowledge through relationship, place, and generations.' },
    maat:     { title: 'Maat',     culture: 'Kemet',        body: 'Truth, balance, justice, harmony, and the ethical structure that sustains life and cosmos.' },
    nun:      { title: 'Nun',      culture: 'Kemet',        body: 'The primordial waters — undifferentiated source from which creation emerges in Kemetic cosmology.' },
    duat:     { title: 'Duat',     culture: 'Kemet',        body: 'A complex cosmic realm of transformation, judgment, renewal, and the journey of the soul.' },
    isfet:    { title: 'Isfet',    culture: 'Kemet',        body: 'Disorder, imbalance, falsehood, and violence — the opposite of Maat.' }
  };

  const DEFAULT_REFLECTIONS = [
    'What is the deepest idea this lesson is trying to preserve?',
    'How does this knowledge connect land, sea, sky, family, or community?',
    'What is one way this teaching could matter in the modern world?'
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

  /* ── Utilities ─────────────────────────────────────────────────────── */
  function $(s)    { return document.querySelector(s); }
  function $all(s) { return Array.from(document.querySelectorAll(s)); }
  function escapeHTML(v) { return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function readJSON(k,fb){ try{const r=localStorage.getItem(k);return r?JSON.parse(r):fb;}catch{return fb;} }
  function writeJSON(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch{} }
  function stripHTML(v){ return String(v||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }

  /* ── Data helpers ────────────────────────────────────────────────────── */
  function getData() {
    const d=[window.CULTURALVERSE_DATA,window.LKP_DATA,window.IKEVERSE_DATA].find(x=>x&&Array.isArray(x.cultures)&&x.cultures.length>0);
    if(d){window.CULTURALVERSE_DATA=window.LKP_DATA=window.IKEVERSE_DATA=d;}
    return d||null;
  }

  /* ── Hero image resolution ───────────────────────────────────────────── */
  function getHeroImage(lesson) {
    const raw = lesson.image||lesson.heroImage||lesson.thumbnail||'';
    if(raw&&raw.length>4) return { url:raw, pos:'center center', credit:'' };
    const mapped = LESSON_IMAGES[lesson.id];
    if(mapped) return mapped;
    return CULTURE_IMAGES[lesson.cultureId]||CULTURE_IMAGES.default;
  }

  function updateHeroImage(lesson) {
    const hero = document.getElementById('cultureHero');
    if(!hero) return;
    const img = getHeroImage(lesson);
    hero.style.backgroundImage   = 'url("'+img.url+'")';
    hero.style.backgroundSize    = 'cover';
    hero.style.backgroundPosition = img.pos||'center center';
    hero.classList.add('has-lesson-image');
    let credit = hero.querySelector('.cv-hero-credit');
    if(img.credit) {
      if(!credit){ credit=document.createElement('div'); credit.className='cv-hero-credit'; hero.appendChild(credit); }
      credit.textContent = img.credit;
    } else if(credit) { credit.remove(); }
  }

  /* ── Color helpers ───────────────────────────────────────────────────── */
  function getCultureColor(theme) {
    return { emerald:'#3cb371',kanaka:'#3cb371',gold:'#f0c96a',kemet:'#f0c96a',bridge:'#8fa0ff',rust:'#d98545',amber:'#e4ad48',saffron:'#ffb347',cyan:'#54c6ee',violet:'#8fa0ff',default:'#54c6ee' }[theme]||'#54c6ee';
  }
  function getCultureSecondary(theme) {
    return { emerald:'#54c6ee',kanaka:'#54c6ee',gold:'#d98545',kemet:'#d98545',bridge:'#54c6ee',rust:'#f0c96a',default:'#8fa0ff' }[theme]||'#8fa0ff';
  }

  /* ── Completion helpers ──────────────────────────────────────────────── */
  function isCompleted(id) {
    if(!id) return false;
    if(window.LKPRewards&&typeof window.LKPRewards.isCompleted==='function') try{return Boolean(window.LKPRewards.isCompleted(id));}catch{}
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
  function getMana(){return Number(localStorage.getItem(MANA_KEY)||'0')||0;}
  function setMana(v){localStorage.setItem(MANA_KEY,String(Math.max(0,Number(v)||0)));}

  /* ── Normalize ───────────────────────────────────────────────────────── */
  function normalizeSources(raw) {
    if(!Array.isArray(raw)) return [];
    return raw.map(s=>typeof s==='string'?{label:s,url:'',note:''}:{label:s.label||s.title||s.name||'',url:s.url||s.href||'',note:s.note||s.desc||''}).filter(s=>s.label);
  }
  function normalizeKidVersion(lesson) {
    const kid=lesson.kidVersion||lesson.keikiVersion||lesson.kid||lesson.keiki||null;
    if(!kid||typeof kid!=='object') return null;
    return {summary:kid.summary||kid.intro||'',bigIdeas:Array.isArray(kid.bigIdeas)?kid.bigIdeas:[],vocabulary:Array.isArray(kid.vocabulary)?kid.vocabulary:[],activity:kid.activity||'',reflection:Array.isArray(kid.reflection)?kid.reflection:[]};
  }
  function guessSceneType(lesson,culture) {
    const t=[lesson.id,lesson.title,culture.id,culture.name].join(' ').toLowerCase();
    if(t.includes('star')||t.includes('wayfinding')||t.includes('hokule')) return 'starcompass';
    if(t.includes('kumulipo')||t.includes('creation')||t.includes('wakea')) return 'creation';
    if(t.includes('aloha')||t.includes('maat')) return 'balance';
    if(t.includes('nun')||t.includes('water')) return 'primordial';
    if(t.includes('medicine')||t.includes('laau')) return 'healing';
    if(culture.id==='kemet') return 'pyramid';
    if(culture.id==='bridge') return 'bridge';
    return 'constellation';
  }
  function normalizeData(data) {
    return (Array.isArray(data?.cultures)?data.cultures:[]).map(c=>({
      id:c.id||'',name:c.name||'Untitled',emoji:c.emoji||'*',tagline:c.tagline||'',theme:c.theme||'default',status:c.status||'live',intro:c.intro||'',
      modules:Array.isArray(c.modules)?c.modules.map(m=>({
        id:m.id||'',title:m.title||'Module',emoji:m.emoji||c.emoji||'*',desc:m.desc||'',
        lessons:Array.isArray(m.lessons)?m.lessons.map(l=>({
          id:l.id||'',num:l.num||'',title:l.title||'Lesson',readTime:l.readTime||'',content:l.content||'',excerpt:l.excerpt||l.leadText||'',
          mana:Number(l.mana||DEFAULT_MANA),xp:Number(l.xp||25),image:l.image||l.heroImage||l.thumbnail||'',
          sources:normalizeSources(l.sources||l.references||[]),related:Array.isArray(l.related)?l.related:[],
          kidVersion:normalizeKidVersion(l),
          cultureId:c.id||'',cultureName:c.name||'',cultureEmoji:c.emoji||'*',cultureTheme:c.theme||'default',
          moduleId:m.id||'',moduleTitle:m.title||'',moduleEmoji:m.emoji||c.emoji||'*',
          sceneType:l.sceneType||guessSceneType(l,c)
        })):[]
      })):[]
    }));
  }
  function flattenLessons(cultures) {
    const ls=[];
    cultures.forEach(c=>c.modules.forEach(m=>m.lessons.forEach(l=>ls.push({...l,contentText:stripHTML(l.content||'')}))));
    return ls;
  }

  /* ── Sidebar search ─────────────────────────────────────────────────── */
  function ensureSidebarTools() {
    const hdr=$('.lkp-sidebar__header');
    if(!hdr||document.getElementById('lessonTreeSearch')) return;
    const t=document.createElement('div');t.className='lkp-sidebar-tools';
    t.innerHTML='<label class="lkp-tree-search"><i class="fas fa-search"></i><input id="lessonTreeSearch" type="search" placeholder="Search lessons..." autocomplete="off" /></label>';
    hdr.appendChild(t);
  }

  /* ── Culture filters ─────────────────────────────────────────────────── */
  function renderCultureFilters() {
    const holder=document.getElementById('cultureFilters');
    const welcome=document.getElementById('welcomeCultures');
    if(!holder) return;
    const live=state.cultures.filter(c=>c.modules.some(m=>m.lessons.length));
    holder.innerHTML='<button class="cv-filter-btn is-active" type="button" data-culture-filter="all">All</button>'+
      state.cultures.map(c=>{const d=c.modules.every(m=>!m.lessons.length);return`<button class="cv-culture-filter${d?' is-disabled':''}" type="button" data-culture-filter="${escapeHTML(c.id)}" ${d?'disabled':''} style="--culture-color:${getCultureColor(c.theme)}"><span>${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}</button>`;}).join('');
    if(welcome) welcome.innerHTML=live.map(c=>`<button class="cv-culture-filter" type="button" data-culture-filter="${escapeHTML(c.id)}" style="--culture-color:${getCultureColor(c.theme)}"><span>${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}</button>`).join('');
  }

  /* ── Progress bar ────────────────────────────────────────────────────── */
  function getCultureProgress(culture) {
    const all=culture.modules.flatMap(m=>m.lessons);
    const done=all.filter(l=>isCompleted(l.id)).length;
    return {total:all.length,done,percent:all.length?Math.round((done/all.length)*100):0};
  }

  /* ── Lesson tree ─────────────────────────────────────────────────────── */
  function renderLessonTree() {
    const tree=document.getElementById('lessonTree');
    if(!tree) return;
    const q=state.sidebarSearch.trim().toLowerCase();
    const visible=state.activeCulture==='all'?state.cultures:state.cultures.filter(c=>c.id===state.activeCulture);
    if(!state.cultures.length){tree.innerHTML='<div class="cv-tree-empty"><strong>No lesson data found.</strong><span>Check that LKP/js/lkp-data.js loads first.</span></div>';return;}
    tree.innerHTML=visible.map(culture=>{
      const prog=getCultureProgress(culture);
      const bar=`<div class="cv-culture-progress"><div class="cv-culture-progress__meta"><span>${prog.done}/${prog.total} complete</span><span>${prog.percent}%</span></div><div class="cv-culture-progress__bar"><span style="width:${prog.percent}%;background:${getCultureColor(culture.theme)}"></span></div></div>`;
      const filtered=culture.modules.map(m=>({...m,lessons:m.lessons.filter(l=>!q||[l.title,l.num,culture.name,m.title,l.contentText,l.excerpt].join(' ').toLowerCase().includes(q))})).filter(m=>m.lessons.length);
      if(!filtered.length) return`<section class="cv-tree-culture"><div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}"><span>${escapeHTML(culture.emoji)}</span>${escapeHTML(culture.name)}</div>${bar}<div class="cv-tree-module"><div class="cv-tree-module__title">Coming Soon</div><button class="cv-tree-lesson" type="button" disabled><strong>${escapeHTML(q?'No matching lessons.':culture.tagline||'Lessons being prepared.')}</strong></button></div></section>`;
      return`<section class="cv-tree-culture"><div class="cv-tree-culture__title" style="--culture-color:${getCultureColor(culture.theme)}"><span>${escapeHTML(culture.emoji)}</span>${escapeHTML(culture.name)}</div>${bar}${filtered.map(m=>`<div class="cv-tree-module"><div class="cv-tree-module__title"><span>${escapeHTML(m.emoji)}</span>${escapeHTML(m.title)}</div>${m.lessons.map(l=>{const done=isCompleted(l.id);const active=l.id===state.activeLessonId;return`<button class="cv-tree-lesson${active?' is-active':''}${done?' is-complete':''}" type="button" data-lesson-id="${escapeHTML(l.id)}"><strong>${done?'+ ':''} ${escapeHTML(l.num||'LESSON')} . ${escapeHTML(l.title)}</strong><small>${escapeHTML(culture.name)} . ${escapeHTML(l.readTime||'Lesson')}</small></button>`;}).join('')}</div>`).join('')}</section>`;
    }).join('')||'<div class="cv-tree-empty"><strong>No lessons found.</strong></div>';
  }

  /* ── Lesson rendering ────────────────────────────────────────────────── */
  function findLesson(id)     { return state.lessons.find(l=>l.id===id)||null; }
  function getLessonIndex(id) { return state.lessons.findIndex(l=>l.id===id); }

  function renderLesson(id,opts={}) {
    const lesson=findLesson(id);
    if(!lesson){renderWelcome();return;}
    state.activeLessonId=lesson.id;
    document.body.dataset.culture   =lesson.cultureId||'default';
    document.body.dataset.lessonMode =state.mode;
    document.documentElement.style.setProperty('--lesson-font-scale',String(state.fontScale));

    const welcome=document.getElementById('lessonWelcome');
    const article=document.getElementById('lessonArticle');
    if(welcome) welcome.hidden=true;
    if(article) article.hidden=false;

    const header=document.getElementById('lessonHeader');
    if(header) header.innerHTML=renderLessonHeader(lesson);
    const body=document.getElementById('lessonBody');
    if(body) body.innerHTML=state.mode==='keiki'?renderKeikiContent(lesson):transformLessonContent(lesson.content,lesson);

    renderSources(lesson);
    renderLessonNav();
    renderRelatedLessons(lesson);
    renderLessonTree();
    updateCompleteButton(lesson);
    updateUrlHash(lesson.id);
    bindReflectionTextareas(lesson);

    /* Real photo behind the Three.js overlay */
    updateHeroImage(lesson);

    const emoji=document.getElementById('cultureHeroEmoji');
    const name =document.getElementById('cultureHeroName');
    if(emoji) emoji.textContent=lesson.cultureEmoji||'*';
    if(name)  name.textContent=lesson.cultureName+' . '+lesson.moduleTitle;

    updateThreeHeroScene(lesson);

    window.dispatchEvent(new CustomEvent('lkp:culture-changed',{detail:{cultureId:lesson.cultureId,color:getCultureColor(lesson.cultureTheme)}}));
    window.dispatchEvent(new CustomEvent('lkp:lesson-changed',{detail:{lessonId:lesson.id,lesson}}));

    if(!opts.noScroll) requestAnimationFrame(()=>document.getElementById('lessonMain')?.scrollIntoView({behavior:'smooth',block:'start'}));
    closeSidebarOnMobile();
  }

  function renderLessonHeader(lesson) {
    const done=isCompleted(lesson.id);const mana=lesson.mana||DEFAULT_MANA;
    const excerpt = lesson.excerpt||lesson.leadText||'';
    const wordCount = lesson.contentText ? Math.ceil(lesson.contentText.split(/\s+/).length / 200) : null;
    const readLabel = lesson.readTime || (wordCount ? wordCount+' min read' : 'Deep Reading');
    return`<div class="cv-lesson-kicker"><span>${escapeHTML(lesson.cultureEmoji)}</span>${escapeHTML(lesson.cultureName)} · ${escapeHTML(lesson.moduleTitle)}</div>
      <div class="cv-lesson-title-row"><h1 class="cv-lesson-title">${escapeHTML(lesson.title)}</h1><div class="cv-lesson-reward-chip ${done?'is-complete':''}"><span>${done?'✓ Complete':'+'+mana+' Mana'}</span></div></div>
      ${excerpt?`<p class="cv-lesson-excerpt">${escapeHTML(excerpt)}</p>`:''}
      <div class="cv-lesson-meta">
        ${lesson.num?`<span class="cv-lesson-meta__num">${escapeHTML(lesson.num)}</span>`:''}
        <span><i class="fas fa-clock" aria-hidden="true"></i> ${escapeHTML(readLabel)}</span>
        <span>${escapeHTML(lesson.moduleEmoji)} ${escapeHTML(lesson.moduleTitle)}</span>
        <span class="cv-lesson-meta__culture" style="color:var(--active-color)">${escapeHTML(lesson.cultureEmoji)} ${escapeHTML(lesson.cultureName)}</span>
        <span class="cv-lesson-meta__mode">${state.mode==='keiki'?'🌺 Keiki Mode':'📜 Scholar Mode'}</span>
      </div>
      <div class="cv-lesson-actions">
        <button class="cv-action-btn cv-complete-btn ${done?'is-complete':''}" type="button" data-complete-active-lesson>${done?'+ Lesson Complete':'Complete Lesson . +'+mana+' Mana'}</button>
        <div class="cv-mode-toggle" role="group"><button class="cv-action-btn ${state.mode==='scholar'?'is-active':''}" type="button" data-lesson-mode="scholar">Scholar</button><button class="cv-action-btn ${state.mode==='keiki'?'is-active':''}" type="button" data-lesson-mode="keiki">Keiki</button></div>
        <div class="cv-font-controls" role="group"><button class="cv-action-btn" type="button" data-font-adjust="-">A-</button><button class="cv-action-btn" type="button" data-font-adjust="+">A+</button></div>
        <button class="cv-action-btn" type="button" data-reading-mode>Focus Mode</button>
      </div>`;
  }

  function updateCompleteButton(lesson) {
    const btn=document.querySelector('[data-complete-active-lesson]');
    if(!btn||!lesson) return;
    const done=isCompleted(lesson.id);
    btn.classList.toggle('is-complete',done);
    btn.textContent=done?'+ Lesson Complete':'Complete Lesson . +'+(lesson.mana||DEFAULT_MANA)+' Mana';
  }

  function renderWelcome() {
    const w=document.getElementById('lessonWelcome'),a=document.getElementById('lessonArticle');
    if(w) w.hidden=false;if(a) a.hidden=true;state.activeLessonId=null;renderLessonTree();
  }

  function renderLessonNav() {
    const nav=document.getElementById('lessonNav');
    if(!nav||!state.activeLessonId) return;
    const idx=getLessonIndex(state.activeLessonId);
    const prev=idx>0?state.lessons[idx-1]:null;
    const next=idx>=0&&idx<state.lessons.length-1?state.lessons[idx+1]:null;
    nav.innerHTML=`<button class="cv-lesson-nav-btn" type="button" data-nav-lesson="${prev?escapeHTML(prev.id):''}" ${prev?'':'disabled'}><- ${prev?escapeHTML(prev.title):'Previous'}</button><button class="cv-lesson-nav-btn" type="button" data-nav-lesson="${next?escapeHTML(next.id):''}" ${next?'':'disabled'}>${next?escapeHTML(next.title):'Next'} -></button>`;
  }

  function renderSources(lesson) {
    const holder=document.getElementById('lessonSources');
    if(!holder) return;
    const sources=lesson.sources||[];
    if(!sources.length){holder.innerHTML='';return;}
    holder.innerHTML=`<section class="cv-sources"><div class="cv-section-heading"><span>Sources & Further Study</span></div><div class="cv-source-list">${sources.map(s=>`<a class="cv-source-card" href="${escapeHTML(s.url||'#')}" ${s.url?'target="_blank" rel="noopener"':''}><strong>${escapeHTML(s.label)}</strong>${s.note?`<span>${escapeHTML(s.note)}</span>`:''}<small>${s.url?'Open source ->':'Reference note'}</small></a>`).join('')}</div></section>`;
  }

  function renderRelatedLessons(lesson) {
    const nav=document.getElementById('lessonNav');if(!nav) return;
    let holder=document.getElementById('relatedLessons');
    if(!holder){holder=document.createElement('section');holder.id='relatedLessons';holder.className='cv-related';nav.insertAdjacentElement('afterend',holder);}
    const byId=new Map(state.lessons.map(l=>[l.id,l]));
    const explicit=(lesson.related||[]).map(id=>byId.get(id)).filter(Boolean);
    const sameModule=state.lessons.filter(l=>l.id!==lesson.id&&l.moduleId===lesson.moduleId);
    const bridge=state.lessons.filter(l=>{
      if(l.id===lesson.id) return false;
      const a=(lesson.title+' '+lesson.contentText).toLowerCase();const b=(l.title+' '+l.contentText).toLowerCase();
      return [['kumulipo','nun'],['aloha','maat'],['star','wayfinding'],['creation','primordial'],['medicine','healing']].some(([x,y])=>(a.includes(x)&&b.includes(y))||(a.includes(y)&&b.includes(x)));
    });
    const related=[...new Map([...explicit,...bridge,...sameModule].map(l=>[l.id,l])).values()].filter(l=>l.id!==lesson.id).slice(0,3);
    if(!related.length){holder.innerHTML='';return;}
    holder.innerHTML=`<div class="cv-section-heading"><span>Related Lessons</span></div><div class="cv-related-grid">${related.map(l=>`<button class="cv-related-card" type="button" data-related-lesson="${escapeHTML(l.id)}" style="--related-color:${getCultureColor(l.cultureTheme)}"><div class="cv-related-card__top"><span class="cv-related-card__emoji">${escapeHTML(l.cultureEmoji||'✦')}</span><span class="cv-related-card__done">${isCompleted(l.id)?'✓':''}</span></div><strong>${escapeHTML(l.title)}</strong><small>${escapeHTML(l.cultureName)} · ${escapeHTML(l.moduleTitle)}</small>${l.readTime?`<span class="cv-related-card__time">${escapeHTML(l.readTime)}</span>`:''}</button>`).join('')}</div>`;
  }

  /* ── Content transforms ─────────────────────────────────────────────── */
  function renderReflectionBlock(prompts,lesson,title) {
    const ex=state.reflections[lesson.id]||{};
    return`<section class="cv-reflection" data-reflection-lesson="${escapeHTML(lesson.id)}"><div class="cv-section-heading"><span>${escapeHTML(title||'Reflection Prompts')}</span></div><div class="cv-reflection-list">${prompts.map((p,i)=>`<label class="cv-reflection-card"><span>${escapeHTML(p)}</span><textarea data-reflection-index="${i}" placeholder="Write your reflection here...">${escapeHTML(ex[i]||'')}</textarea></label>`).join('')}</div><div class="cv-reflection-status" id="reflectionStatus">Reflections save automatically on this device.</div></section>`;
  }

  function transformLessonContent(content,lesson) {
    let html=String(content||'');
    html=html.replace(/<callout(?:\s+type="([^"]+)")?>([\s\S]*?)<\/callout>/gi,(_,type,inner)=>`<div class="cv-callout${type?' cv-callout--'+escapeHTML(type):''}">${inner}</div>`);
    html=html.replace(/<facts>([\s\S]*?)<\/facts>/gi,(_,inner)=>`<div class="cv-facts">${inner.split('|').map(s=>s.trim()).filter(Boolean).map(item=>{const[v,l]=item.split('::').map(s=>s?.trim()||'');return`<div class="cv-fact"><strong>${escapeHTML(v||item)}</strong><span>${escapeHTML(l||'')}</span></div>`;}).join('')}</div>`);
    html=html.replace(/<twocol\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/twocol>/gi,(_,l,r,inner)=>{const[a,b]=inner.split('||');return`<div class="cv-twocol"><div class="cv-twocol__side"><strong>${escapeHTML(l)}</strong><p>${(a||'').trim()}</p></div><div class="cv-twocol__side"><strong>${escapeHTML(r)}</strong><p>${(b||'').trim()}</p></div></div>`;});
    html=html.replace(/<compare\s+left="([^"]*)"\s+right="([^"]*)">([\s\S]*?)<\/compare>/gi,(_,l,r,inner)=>{const[a,b]=inner.split('||');return`<div class="cv-compare"><div><strong>${escapeHTML(l)}</strong><p>${(a||'').trim()}</p></div><div><strong>${escapeHTML(r)}</strong><p>${(b||'').trim()}</p></div></div>`;});
    html=html.replace(/<concepts>([\s\S]*?)<\/concepts>/gi,(_,inner)=>`<div class="cv-concepts">${inner.split('*').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="cv-concept">${escapeHTML(s)}</span>`).join('')}</div>`);
    html=html.replace(/<quote(?:\s+cite="([^"]+)")?>([\s\S]*?)<\/quote>/gi,(_,cite,inner)=>`<blockquote class="cv-quote"><p>${inner.trim()}</p>${cite?`<cite>${escapeHTML(cite)}</cite>`:''}</blockquote>`);
    html=html.replace(/<reflect(?:\s+title="([^"]+)")?>([\s\S]*?)<\/reflect>/gi,(_,title,inner)=>renderReflectionBlock(inner.split('\n').map(s=>s.trim()).filter(Boolean),lesson,title));

    html=html.replace(/<term(?:\s+key="([^"]+)")?>([\s\S]*?)<\/term>/gi,(_,key,inner)=>{const label=stripHTML(inner);const lk=String(key||label).toLowerCase().replace(/[^a-z0-9]/g,'');const def=GLOSSARY[lk];return`<span class="cv-term" tabindex="0" data-term="${escapeHTML(lk)}" data-term-title="${escapeHTML(def?.title||label)}" data-term-culture="${escapeHTML(def?.culture||lesson.cultureName||'')}" data-term-body="${escapeHTML(def?.body||'A key term in this lesson.')}">${inner}</span>`;});
    html=html.replace(/<timeline>([\s\S]*?)<\/timeline>/gi,(_,inner)=>`<div class="cv-timeline">${inner.split('\n').map(s=>s.trim()).filter(Boolean).map(item=>{const[date,text]=item.split('::').map(s=>s?.trim()||'');return`<div class="cv-timeline__item"><strong>${escapeHTML(date)}</strong><span>${escapeHTML(text)}</span></div>`;}).join('')}</div>`);

    html=html.replace(/<activity>([\s\S]*?)<\/activity>/gi,(_,inner)=>`<div class="cv-activity"><strong>Learning Activity</strong><p>${inner.trim()}</p></div>`);
    html=html.replace(/<teacher-note>([\s\S]*?)<\/teacher-note>/gi,(_,inner)=>`<div class="cv-teacher-note"><strong>Teacher Note</strong><p>${inner.trim()}</p></div>`);
    html=html.replace(/<historian-note>([\s\S]*?)<\/historian-note>/gi,(_,inner)=>`<div class="cv-historian-note"><strong>Historian Note</strong><p>${inner.trim()}</p></div>`);
    if(!html.includes('cv-reflection')) html+=renderReflectionBlock(DEFAULT_REFLECTIONS,lesson,'Reflection Prompts');
    return html;
  }

  /* ── Keiki mode ─────────────────────────────────────────────────────── */
  function renderKeikiContent(lesson) {
    const kid=lesson.kidVersion;
    const summary=kid?.summary||stripHTML(lesson.content).split(/[.!?]/).slice(0,2).join('. ');
    const bigIdeas=kid?.bigIdeas?.length?kid.bigIdeas:['This lesson belongs to '+lesson.cultureName+'.','Knowledge is carried through people, place, memory, and practice.','Learning means understanding relationship, not just collecting facts.'];
    const vocab=kid?.vocabulary?.length?kid.vocabulary:Object.entries(GLOSSARY).filter(([k,v])=>(lesson.contentText+lesson.title).toLowerCase().includes(k)).slice(0,4).map(([,v])=>({term:v.title,meaning:v.body}));
    const activity=kid?.activity||'Draw three circles: land, sky, and people. Write one way they connect.';
    const prompts=kid?.reflection?.length?kid.reflection:['What is one thing you learned?','What would you tell a younger cousin about this lesson?','What is one question you still have?'];
    return`<section class="cv-keiki-panel"><div class="cv-keiki-badge">Keiki Mode</div><h3>Big Story</h3><p>${escapeHTML(summary)}</p></section><section class="cv-keiki-panel"><h3>Big Ideas</h3><div class="cv-keiki-ideas">${bigIdeas.map(i=>`<div class="cv-keiki-idea">${escapeHTML(i)}</div>`).join('')}</div></section>${vocab.length?`<section class="cv-keiki-panel"><h3>Words to Know</h3><div class="cv-keiki-vocab">${vocab.map(v=>`<div><strong>${escapeHTML(v.term||'')}</strong><span>${escapeHTML(v.meaning||v.body||v.definition||'')}</span></div>`).join('')}</div></section>`:''}<section class="cv-keiki-panel"><h3>Try This</h3><p>${escapeHTML(activity)}</p></section>${renderReflectionBlock(prompts,lesson,'Keiki Reflection')}`;
  }

  /* ── Reflection binding ─────────────────────────────────────────────── */
  function bindReflectionTextareas(lesson) {
    $all('[data-reflection-index]').forEach(ta=>{
      ta.addEventListener('input',()=>{
        const r=state.reflections[lesson.id]||{};r[ta.dataset.reflectionIndex]=ta.value;
        state.reflections[lesson.id]=r;writeJSON(REFLECTIONS_KEY,state.reflections);
        const s=document.getElementById('reflectionStatus');
        if(s){s.textContent='Saved.';clearTimeout(bindReflectionTextareas._t);bindReflectionTextareas._t=setTimeout(()=>{s.textContent='Reflections save automatically on this device.';},1200);}
      });
    });
  }

  /* ── Routing ────────────────────────────────────────────────────────── */
  function updateUrlHash(id){if(!id)return;const n='#'+encodeURIComponent(id);if(window.location.hash!==n)history.replaceState(null,'',n);}
  function openLessonFromHash(opts={}){const h=decodeURIComponent(window.location.hash.replace(/^#/,''));if(!h)return false;const l=findLesson(h);if(!l)return false;state.activeCulture='all';renderLesson(l.id,opts);return true;}

  /* ── Complete / ceremony ─────────────────────────────────────────────── */
  function completeActiveLesson(){
    const lesson=findLesson(state.activeLessonId);if(!lesson)return;
    if(isCompleted(lesson.id)){showToast('This lesson is already complete.');return;}
    state.completed.push(lesson.id);saveCompleted();
    let mana=lesson.mana||DEFAULT_MANA;
    if(window.LKPRewards?.completeLesson){try{window.LKPRewards.completeLesson(lesson.id,{mana});}catch{}}else{setMana(getMana()+mana);}
    updateCompleteButton(lesson);renderLessonTree();triggerCompletionCeremony(lesson,mana);
    window.dispatchEvent(new CustomEvent('lkp:lesson-completed',{detail:{lessonId:lesson.id,lesson,manaAdded:mana}}));
  }
  function showToast(msg){let t=document.getElementById('lessonToast');if(!t){t=document.createElement('div');t.id='lessonToast';t.className='cv-lesson-toast';document.body.appendChild(t);}t.textContent=msg;t.classList.add('is-visible');clearTimeout(showToast._t);showToast._t=setTimeout(()=>t.classList.remove('is-visible'),2600);}
  function triggerCompletionCeremony(lesson,mana){
    showToast('Lesson complete . +'+mana+' Mana');
    const burst=document.createElement('div');burst.className='cv-completion-burst';burst.style.setProperty('--burst-color',getCultureColor(lesson.cultureTheme));
    burst.innerHTML=`<div class="cv-completion-burst__core">+${mana}</div>`+Array.from({length:18},(_,i)=>`<span style="--i:${i}"></span>`).join('');
    document.body.appendChild(burst);setTimeout(()=>burst.remove(),1700);
    window.dispatchEvent(new CustomEvent('lkp:completion-ceremony',{detail:{lesson,manaAdded:mana}}));
  }

  /* ── Controls ───────────────────────────────────────────────────────── */
  function setLessonMode(m){state.mode=m==='keiki'?'keiki':'scholar';localStorage.setItem(MODE_KEY,state.mode);if(state.activeLessonId)renderLesson(state.activeLessonId,{noScroll:true});}
  function adjustFont(d){state.fontScale=Math.max(0.86,Math.min(1.32,state.fontScale+(d==='+'?0.08:-0.08)));localStorage.setItem(FONT_SCALE_KEY,String(state.fontScale));document.documentElement.style.setProperty('--lesson-font-scale',String(state.fontScale));}
  function closeSidebarOnMobile(){if(window.matchMedia('(max-width:980px)').matches)document.getElementById('cvSidebar')?.classList.remove('is-open');}

  /* ── Three.js hero overlay (sits on top of the photo) ───────────────── */
  async function loadTHREE(){if(state.three.THREE)return state.three.THREE;try{state.three.THREE=await import('https://esm.sh/three@0.160.0');}catch{}return state.three.THREE;}
  async function initThreeHero(){
    const canvas=document.getElementById('cv-culture-hero-canvas');const wrap=document.getElementById('cultureHero');if(!canvas||!wrap)return;
    const THREE=await loadTHREE();if(!THREE)return;
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(65,1,0.1,120);camera.position.set(0,0,14);
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
    scene.add(new THREE.AmbientLight(0xffffff,0.5));const light=new THREE.PointLight(0xffd36b,2.2,80);light.position.set(0,6,8);scene.add(light);
    const group=new THREE.Group();scene.add(group);
    state.three.hero={scene,camera,renderer,group,wrap};
    function resize(){const w=Math.max(280,wrap.clientWidth||760);const h=Math.max(120,wrap.clientHeight||160);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
    resize();if('ResizeObserver'in window)new ResizeObserver(resize).observe(wrap);else window.addEventListener('resize',resize,{passive:true});
    (function animate(){requestAnimationFrame(animate);const t=performance.now()*0.001;group.rotation.y+=0.0018;group.children.forEach((c,i)=>{c.rotation.z+=0.0008+i*0.0002;c.position.y+=Math.sin(t+i)*0.0007;});renderer.render(scene,camera);})();
  }

  function makeGlow(THREE,color,size,opacity){
    const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
    const col=new THREE.Color(color);const r=Math.round(col.r*255),g=Math.round(col.g*255),b=Math.round(col.b*255);
    const grd=ctx.createRadialGradient(64,64,0,64,64,64);grd.addColorStop(0,`rgba(${r},${g},${b},0.9)`);grd.addColorStop(0.45,`rgba(${r},${g},${b},0.22)`);grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd;ctx.fillRect(0,0,128,128);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));spr.scale.setScalar(size);return spr;
  }

  function clearGroup(group){while(group.children.length){const o=group.children.pop();o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.();}}

  function updateThreeHeroScene(lesson){
    const hero=state.three.hero;const THREE=state.three.THREE;if(!hero||!THREE||!lesson)return;
    clearGroup(hero.group);
    const c1=new THREE.Color(lesson.scene?.primary||getCultureColor(lesson.cultureTheme));
    const c2=new THREE.Color(lesson.scene?.secondary||getCultureSecondary(lesson.cultureTheme));
    const type=lesson.sceneType||'constellation';
    /* Semi-transparent glows sit on top of the lesson photo */
    hero.group.add(makeGlow(THREE,c1.getStyle(),9,0.22));hero.group.add(makeGlow(THREE,c2.getStyle(),6,0.12));
    const mat1=new THREE.MeshPhysicalMaterial({color:c1,emissive:c1,emissiveIntensity:0.75,transparent:true,opacity:0.65});
    const mat2=new THREE.MeshPhysicalMaterial({color:c2,emissive:c2,emissiveIntensity:0.65,transparent:true,opacity:0.60});
    if(type==='starcompass'){
      hero.group.add(new THREE.Mesh(new THREE.TorusGeometry(4,0.04,10,120),mat1.clone()));
      for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2;const s=new THREE.Mesh(new THREE.OctahedronGeometry(i%4===0?0.19:0.11,0),new THREE.MeshPhysicalMaterial({color:i%2?c2:c1,emissive:i%2?c2:c1,emissiveIntensity:0.85}));s.position.set(Math.cos(a)*4,Math.sin(a)*4,0);hero.group.add(s);}
    }else if(type==='creation'){
      hero.group.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,5,10),mat1.clone()),{}));
      const ao=new THREE.Mesh(new THREE.OctahedronGeometry(0.4,0),new THREE.MeshPhysicalMaterial({color:0xffe7a5,emissive:0xf0c96a,emissiveIntensity:1.3}));ao.position.set(0,2,0);hero.group.add(ao);
      const po=new THREE.Mesh(new THREE.SphereGeometry(0.45,20,20),mat1.clone());po.position.set(0,-1.5,0);hero.group.add(po);
      for(let i=0;i<5;i++){const rg=new THREE.Mesh(new THREE.TorusGeometry(1.2+i*0.52,0.011,6,80),new THREE.MeshBasicMaterial({color:i%2?c2:c1,transparent:true,opacity:0.13+i*0.016,depthWrite:false}));rg.rotation.x=Math.PI/2+i*0.1;rg.scale.set(1.28,0.62,1);hero.group.add(rg);}
    }else if(type==='pyramid'){
      const pyr=new THREE.Mesh(new THREE.ConeGeometry(2.4,3.8,4),new THREE.MeshPhysicalMaterial({color:c1,emissive:c1,emissiveIntensity:0.28,wireframe:true,transparent:true,opacity:0.6}));pyr.rotation.y=Math.PI/4;hero.group.add(pyr);
      const sun=new THREE.Mesh(new THREE.SphereGeometry(0.42,20,20),new THREE.MeshPhysicalMaterial({color:c2,emissive:c2,emissiveIntensity:0.95}));sun.position.set(0,2.8,0);hero.group.add(sun);
    }else if(type==='balance'){
      hero.group.add(new THREE.Mesh(new THREE.BoxGeometry(6,0.07,0.07),mat1.clone()));
      hero.group.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.3,0),mat2.clone()));
      [-2.2,2.2].forEach(x=>{const bw=new THREE.Mesh(new THREE.TorusGeometry(0.66,0.03,8,48),new THREE.MeshBasicMaterial({color:c2,transparent:true,opacity:0.64}));bw.position.set(x,-0.7,0);hero.group.add(bw);});
    }else if(type==='healing'){
      hero.group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,4,10),mat1.clone()));
      for(let i=0;i<8;i++){const lf=new THREE.Mesh(new THREE.SphereGeometry(0.18,14,14),new THREE.MeshPhysicalMaterial({color:i%2?c2:c1,emissive:i%2?c2:c1,emissiveIntensity:0.38}));lf.scale.set(1.7,0.42,0.11);lf.position.set(i%2?0.42:-0.42,-1.52+i*0.42,0);lf.rotation.z=i%2?-0.58:0.58;hero.group.add(lf);}
    }else if(type==='bridge'){
      const sl=new THREE.Mesh(new THREE.SphereGeometry(0.42,20,20),mat1.clone());sl.position.set(-2.2,0,0);const sr=new THREE.Mesh(new THREE.SphereGeometry(0.42,20,20),mat2.clone());sr.position.set(2.2,0,0);hero.group.add(sl,sr);
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-2.2,0,0),new THREE.Vector3(0,1.3,0),new THREE.Vector3(2.2,0,0)]);
      hero.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)),new THREE.LineBasicMaterial({color:c1.clone().lerp(c2,0.5),transparent:true,opacity:0.68})));
    }else{
      const pts=[];for(let i=0;i<9;i++){const p=new THREE.Vector3((Math.random()-0.5)*7,(Math.random()-0.5)*3,(Math.random()-0.5)*1.2);pts.push(p);const s=new THREE.Mesh(new THREE.OctahedronGeometry(i%3===0?0.19:0.12,0),new THREE.MeshPhysicalMaterial({color:i%2?c2:c1,emissive:i%2?c2:c1,emissiveIntensity:0.7}));s.position.copy(p);hero.group.add(s);if(i>0)hero.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pts[i-1],p]),new THREE.LineBasicMaterial({color:c1,transparent:true,opacity:0.20})));}
    }
    hero.group.scale.setScalar(1.12);
  }

  /* ── Event binding ──────────────────────────────────────────────────── */
  function bindEvents(){
    document.addEventListener('click',e=>{
      const cf=e.target.closest('[data-culture-filter]');if(cf){state.activeCulture=cf.dataset.cultureFilter||'all';$all('[data-culture-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.cultureFilter===state.activeCulture));renderLessonTree();return;}
      const lb=e.target.closest('[data-lesson-id]');if(lb){renderLesson(lb.dataset.lessonId);return;}
      const nb=e.target.closest('[data-nav-lesson]');if(nb&&nb.dataset.navLesson){renderLesson(nb.dataset.navLesson);return;}
      const rl=e.target.closest('[data-related-lesson]');if(rl){renderLesson(rl.dataset.relatedLesson);return;}
      if(e.target.closest('[data-complete-active-lesson]')){completeActiveLesson();return;}
      const mb=e.target.closest('[data-lesson-mode]');if(mb){setLessonMode(mb.dataset.lessonMode);return;}
      const fb=e.target.closest('[data-font-adjust]');if(fb){adjustFont(fb.dataset.fontAdjust);return;}
      if(e.target.closest('[data-reading-mode]')){document.body.classList.toggle('is-reading-mode');}
    });
    document.addEventListener('input',e=>{if(e.target.matches('#lessonTreeSearch')){state.sidebarSearch=e.target.value;renderLessonTree();window.dispatchEvent(new Event('lkp:tree-built'));}});
    window.addEventListener('hashchange',()=>openLessonFromHash({noScroll:true}));
    document.addEventListener('keydown',e=>{if(!state.activeLessonId)return;const idx=getLessonIndex(state.activeLessonId);if(e.key==='ArrowLeft'&&idx>0)renderLesson(state.lessons[idx-1].id);if(e.key==='ArrowRight'&&idx<state.lessons.length-1)renderLesson(state.lessons[idx+1].id);if(e.key==='Escape')document.body.classList.remove('is-reading-mode');});
  }

  /* ── Nav/FAB/progress ───────────────────────────────────────────────── */
  function initNavAndProgress(){
    const toggle=document.getElementById('lkpMobileToggle'),navLinks=document.getElementById('lkpNavLinks');
    if(toggle&&navLinks)toggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
    const fab=document.getElementById('cvSidebarFab'),sidebar=document.getElementById('cvSidebar');
    if(fab&&sidebar){fab.addEventListener('click',()=>sidebar.classList.toggle('is-open'));document.addEventListener('click',ev=>{if(!sidebar.classList.contains('is-open'))return;if(!sidebar.contains(ev.target)&&ev.target!==fab)sidebar.classList.remove('is-open');});}
    const yr=document.getElementById('footerYear');if(yr)yr.textContent=new Date().getFullYear();
    const fill=document.getElementById('progressFill');window.addEventListener('scroll',()=>{if(!fill)return;const max=document.documentElement.scrollHeight-document.documentElement.clientHeight;fill.style.width=`${max>0?(window.scrollY/max)*100:0}%`;},{passive:true});
  }

  /* ── Build ──────────────────────────────────────────────────────────── */
  function build(data){
    state.data=data;state.cultures=normalizeData(data);state.lessons=flattenLessons(state.cultures);
    syncCompletedFromRewards();ensureSidebarTools();
    console.info('[LKP Lessons] Loaded:',state.cultures.length,'cultures,',state.lessons.length,'lessons');
    renderCultureFilters();renderLessonTree();
    const opened=openLessonFromHash({noScroll:true});
    if(!opened&&state.lessons.length)renderLesson(state.lessons[0].id,{noScroll:true});
    bindEvents();initNavAndProgress();
    initThreeHero().then(()=>{if(state.activeLessonId)updateThreeHeroScene(findLesson(state.activeLessonId));});
    window.dispatchEvent(new Event('lkp:tree-built'));
  }

  function waitForDataAndBuild(){
    let attempts=0;const MAX=8,MS=250;
    window.addEventListener('lkp:data-ready',function onReady(ev){window.removeEventListener('lkp:data-ready',onReady);const d=ev?.detail?.data||getData();if(d&&!state.data)build(d);});
    (function attempt(){const d=getData();if(d){build(d);return;}if(++attempts>=MAX){console.warn('[LKP Lessons] No lesson data after',MAX*MS,'ms.');build({cultures:[]});return;}setTimeout(attempt,MS);})();
  }

  document.addEventListener('DOMContentLoaded',waitForDataAndBuild);
})();