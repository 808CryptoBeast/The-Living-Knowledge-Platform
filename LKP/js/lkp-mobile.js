/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Mobile Experience
   lkp-mobile.js  |  No Three.js. Pure DOM, CSS, SVG.

   Architecture:
   ─ CSS animated starfield (zero JS frame cost)
   ─ Bottom tab navigation (Home / Galaxies / Bridge / Chart / Lessons)
   ─ Galaxy swipe cards (horizontal scroll snap)
   ─ Concept bottom sheet (slides up from bottom on galaxy tap)
   ─ 2D SVG star chart (scrollable constellation diagram, tappable nodes)
   ─ Ecosystem section
   All data mirrors lkp-three.js so both experiences stay in sync.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Asset base ── */
  const IMG = document.baseURI.replace(/[^/]*$/, '') + 'LKP/assets/images/';

  /* ─────────────────────────────────────────────────────────────────────────
     DATA — mirrors GALAXY_DEFS + BRIDGE_CONCEPTS in lkp-three.js
     lessonId keys match culturalverse-data.js IDs
  ───────────────────────────────────────────────────────────────────────── */
  const GALAXIES = [
    {
      id:       'kanaka',
      name:     'Kānaka Maoli',
      tagline:  'People of the Land · Children of the Star Navigators',
      color:    '#3cb371',
      colorDim: 'rgba(60,179,113,0.12)',
      colorBorder: 'rgba(60,179,113,0.28)',
      image:    IMG + 'kanaka.png',
      emoji:    '🌺',
      intro:    'The Native Hawaiian people developed one of the most sophisticated civilizations in the Pacific — from the 2,102-line Kumulipo to 400+ fishponds. A complete, living understanding of cosmos, land, and humanity.',
      concepts: [
        { id:'kumulipo',   label:'Kumulipo',        lessonId:'km-kumulipo',    major:true,  desc:'2,102-line sacred creation chant. Pō to Ao. The genealogy of the cosmos from coral polyp to human chief.' },
        { id:'aloha',      label:'Aloha',            lessonId:'km-kumulipo',    major:true,  desc:'The presence of the divine breath, shared. Not a greeting — a complete ethical and spiritual way of being.' },
        { id:'wayfinding', label:'Wayfinding',       lessonId:'km-starcompass', major:false, desc:'32-house star compass. 2,500 miles open ocean without instruments. One of humanity\'s greatest scientific achievements.' },
        { id:'hokuleaa',   label:'Hōkūleʻa',         lessonId:'km-hokuleaa',    major:false, desc:'The zenith star of Hawaiʻi (Arcturus). The star that passes overhead tells you you\'re home.' },
        { id:'ahupuaa',    label:'Ahupuaʻa',         lessonId:'km-ahupuaa',     major:false, desc:'Mountain-to-sea land divisions. Sustained 300k–1M people for 1,000+ years. Zero waste. Completely circular.' },
        { id:'kalo',       label:'Kalo',             lessonId:'km-loikalo',     major:false, desc:'Sacred taro — the elder sibling of humanity. To tend kalo is to tend your ancestor.' },
        { id:'mana',       label:'Mana',             lessonId:'km-kumulipo',    major:false, desc:'Spiritual power that flows through all things. The healer, the navigator, the chief — all work with mana.' },
        { id:'pono',       label:'Pono',             lessonId:'km-kumulipo',    major:false, desc:'Righteousness, balance, doing what is right in relationship to all things.' },
        { id:'olelo',      label:'ʻŌlelo Hawaiʻi',  lessonId:'km-olelo',       major:false, desc:'One of the most musical languages in the world. Nearly extinct by 1981 — now spoken by thousands of children.' },
        { id:'laau',       label:'Laʻau Lapaʻau',   lessonId:'km-laau',        major:false, desc:'Hawaiian plant medicine. 300+ medicinal plants. Complete medical science integrating body, spirit, and land.' },
      ]
    },
    {
      id:       'kemet',
      name:     'Kemet',
      tagline:  'The Black Land · Three Thousand Years of Recorded Wisdom',
      color:    '#f0c96a',
      colorDim: 'rgba(240,201,106,0.10)',
      colorBorder: 'rgba(240,201,106,0.28)',
      image:    IMG + 'kemet.png',
      emoji:    '☥',
      intro:    'The ancient Egyptians called their land Kemet — they were African. Their civilization endured for 3,000+ years, producing knowledge in cosmology, medicine, ethics, and philosophy that the world has never fully reckoned with.',
      concepts: [
        { id:'maat',       label:'Maʻat',           lessonId:'ke-maat',        major:true,  desc:'Cosmic order, truth, justice, balance. The stars move in Maʻat. The Nile floods in Maʻat. The organizing principle of all existence.' },
        { id:'nun',        label:'Nun',              lessonId:'ke-nun',         major:true,  desc:'Infinite dark primordial waters — the condition before all conditions. From Nun, everything arose.' },
        { id:'ennead',     label:'Ennead',           lessonId:'ke-ennead',      major:false, desc:'Nine interconnected divine principles of creation — a complete cosmological model from Heliopolis.' },
        { id:'ptah',       label:'Ptah',             lessonId:'ke-ptah',        major:false, desc:'Creation through thought and word. The Memphite Theology — 2,700 years before the Gospel of John.' },
        { id:'medunetjer', label:'Medu Netjer',      lessonId:'ke-medunetjer',  major:false, desc:'"Words of the Gods." One of the oldest writing systems on Earth (~3200 BCE). Every sign carries spiritual weight.' },
        { id:'duat',       label:'Duat',             lessonId:'ke-maat',        major:false, desc:'The afterlife cosmology. 12 gates of the night. Ra\'s nightly resurrection. The Weighing of the Heart.' },
        { id:'imhotep',    label:'Imhotep',          lessonId:'ke-medicine',    major:false, desc:'First named physician in history. Architect of the Step Pyramid. Later deified as god of medicine and wisdom.' },
        { id:'kabakh',     label:'Ka · Ba · Akh',   lessonId:'ke-maat',        major:false, desc:'The three soul components: Ka (life force), Ba (personality), Akh (immortal spirit). A complete soul science.' },
        { id:'isfet',      label:'Isfet',            lessonId:'ke-maat',        major:false, desc:'Chaos, untruth, injustice — the opposite of Maʻat. Not merely wrong. Cosmically dangerous.' },
      ]
    }
  ];

  const BRIDGE = {
    id:      'bridge',
    name:    'The Bridge',
    tagline: 'Aloha and Maʻat — Two Names for the Same Truth',
    color:   '#aa99ff',
    colorDim: 'rgba(170,153,255,0.10)',
    colorBorder: 'rgba(170,153,255,0.28)',
    emoji:   '🌐',
    intro:   'Two civilizations. Opposite ends of the Earth. Thousands of years apart. When you place their creation traditions and ethical frameworks side by side, the parallels are not superficial — they are structural.',
    pairs: [
      { kanaka: { name:'Akahai', sub:'Kindness — Tenderness in action', desc:'Strength expressed through gentleness. True power never needs to be cruel.' },
        kemet:  { name:'Maʻat — Compassion', sub:'Care for the suffering as divine duty', desc:'Feeding the hungry, clothing the naked — among the 42 Declarations of Innocence. Kindness as cosmic law.' }},
      { kanaka: { name:'Lōkahi', sub:'Unity — Harmony through connectedness', desc:'Working in alignment with ʻohana and ʻāina. No one stands apart from the web of life.' },
        kemet:  { name:'Cosmic Harmony', sub:'The order that holds all things together', desc:'The Pharaoh\'s primary duty: uphold Maʻat. When the ruler fails, the cosmos tilts into Isfet.' }},
      { kanaka: { name:'ʻOiaʻiʻo', sub:'Truth — To speak and live in truth', desc:'Unwavering integrity rooted in spirit. Truth is not situational — it is the ground you stand on.' },
        kemet:  { name:'Feather of Truth', sub:'The measure of every human life', desc:'The heart is weighed against the Feather of Maʻat. A heart heavy with falsehood cannot pass.' }},
      { kanaka: { name:'Haʻahaʻa', sub:'Humility — True strength in modesty', desc:'The tallest tree that refuses to bow is the first one broken by the storm.' },
        kemet:  { name:'Declaration of Innocence', sub:'"I have not made myself more than I am"', desc:'Not elevating oneself falsely before the divine. Humility before the Neteru is the foundation of right living.' }},
      { kanaka: { name:'Mālama ʻĀina', sub:'Stewardship — Care for the land', desc:'Not an environmental position. A spiritual obligation. The land is your ancestor. You are its steward.' },
        kemet:  { name:'Stewardship of Creation', sub:'"I have not stopped the flow of water"', desc:'Among the Declarations: interfering with natural systems is a moral violation. Earth is sacred trust.' }},
    ],
    concepts: [
      { id:'br-creation',  label:'Creation from Pō', lessonId:'bridge-darkness',   major:true,  desc:'Both begin in primordial darkness and water. The deepest perception available to the human mind about reality.' },
      { id:'br-pairs',     label:'Paired Forces',    lessonId:'bridge-pairs',      major:false, desc:'Both understand creation requires complementary forces. Duality is the generative principle of reality.' },
      { id:'br-alohamaat', label:'Aloha ↔ Maʻat',   lessonId:'bridge-aloha-maat', major:true,  desc:'Structurally identical philosophical frameworks developed independently on opposite sides of the Earth.' },
      { id:'br-star',      label:'Star Knowledge',   lessonId:'bridge-darkness',   major:false, desc:'Hawaiian star navigation and Kemetic astronomical knowledge — two traditions reading the same sky.' },
    ]
  };

  // Flat concept lookup for chart
  const ALL_CONCEPTS = new Map([
    ...GALAXIES.flatMap(g => g.concepts.map(c => [c.id, { ...c, culture: g.id, color: g.color }])),
    ...BRIDGE.concepts.map(c => [c.id, { ...c, culture: 'bridge', color: BRIDGE.color }])
  ]);

  // Constellation connections for 2D chart
  const CHART_CONNECTIONS = [
    ['kumulipo','aloha',0.9],    ['kumulipo','hokuleaa',0.7],  ['aloha','pono',0.9],
    ['aloha','mana',0.7],        ['wayfinding','hokuleaa',0.9],['ahupuaa','kalo',0.9],
    ['maat','ennead',0.8],       ['maat','ptah',0.7],          ['maat','isfet',0.6],
    ['nun','ennead',0.8],        ['imhotep','medunetjer',0.6], ['duat','kabakh',0.8],
    ['kumulipo','br-creation',0.5],['nun','br-creation',0.6],
    ['aloha','br-alohamaat',0.7], ['maat','br-alohamaat',0.7],
    ['br-creation','br-pairs',0.8],
  ];

  /* ─────────────────────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────────────────────── */
  let activeTab    = 'home';
  let activeGalaxy = 0;  // 0 = kanaka, 1 = kemet, 2 = bridge
  let sheetOpen    = false;
  let sheetData    = null;

  /* ─────────────────────────────────────────────────────────────────────────
     BOOT — check if mobile, inject CSS + HTML, then init
  ───────────────────────────────────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────────────────────────────────
     CSS LINK INJECTION
  ───────────────────────────────────────────────────────────────────────── */
  function injectMobileCSS() {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'LKP/css/lkp-mobile.css';
    document.head.appendChild(link);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     SHELL — replace body content with mobile app structure
  ───────────────────────────────────────────────────────────────────────── */
  function buildShell() {
    document.body.innerHTML = `
      <div id="lkp-m-app" class="lkp-m-app">
        <div id="lkp-m-starfield" class="lkp-m-starfield" aria-hidden="true"></div>
        <div id="lkp-m-panels" class="lkp-m-panels">
          <div id="lkp-m-home"      class="lkp-m-panel" data-panel="home"></div>
          <div id="lkp-m-galaxies"  class="lkp-m-panel" data-panel="galaxies"></div>
          <div id="lkp-m-bridge"    class="lkp-m-panel" data-panel="bridge"></div>
          <div id="lkp-m-chart"     class="lkp-m-panel" data-panel="chart"></div>
          <div id="lkp-m-ecosystem" class="lkp-m-panel" data-panel="ecosystem"></div>
        </div>
        <div id="lkp-m-sheet"    class="lkp-m-sheet"></div>
        <div id="lkp-m-sheet-bg" class="lkp-m-sheet-bg"></div>
        <nav id="lkp-m-nav"      class="lkp-m-nav"></nav>
      </div>`;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     CSS ANIMATED STARFIELD
  ───────────────────────────────────────────────────────────────────────── */
  function buildStarfield() {
    const el  = document.getElementById('lkp-m-starfield');
    const N   = 72;
    let   out = '';
    const COLORS = ['#9ed8ff','#ffffff','#ffe8d0','#b48cff','#ffd0aa'];
    for (let i = 0; i < N; i++) {
      const x    = Math.random() * 100;
      const y    = Math.random() * 100;
      const s    = 1 + Math.random() * 2.5;
      const dur  = 2.5 + Math.random() * 5;
      const del  = Math.random() * 6;
      const col  = COLORS[Math.floor(Math.random() * COLORS.length)];
      out += `<div class="lkp-m-star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:${col};animation-duration:${dur}s;animation-delay:${del}s"></div>`;
    }
    // Nebula blobs
    out += `<div class="lkp-m-nebula lkp-m-nebula--kanaka"></div>`;
    out += `<div class="lkp-m-nebula lkp-m-nebula--kemet"></div>`;
    out += `<div class="lkp-m-nebula lkp-m-nebula--bridge"></div>`;
    el.innerHTML = out;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     HOME PANEL
  ───────────────────────────────────────────────────────────────────────── */
  function buildHome() {
    const el = document.getElementById('lkp-m-home');
    el.innerHTML = `
      <div class="lkp-m-home">
        <div class="lkp-m-home__brand">
          <div class="lkp-m-home__glyph">◈</div>
          <h1 class="lkp-m-home__title">Living<br><em>Knowledge</em></h1>
          <p class="lkp-m-home__sub">Navigate the stars of ancestral wisdom. Two galaxies. Infinite connections.</p>
        </div>

        <div class="lkp-m-home__pills">
          <span class="lkp-m-pill lkp-m-pill--kanaka">🌺 Kānaka Maoli</span>
          <span class="lkp-m-pill lkp-m-pill--kemet">☥ Kemet</span>
          <span class="lkp-m-pill lkp-m-pill--bridge">🌐 The Bridge</span>
        </div>

        <div class="lkp-m-home__quick">
          <button class="lkp-m-quick-btn lkp-m-quick-btn--kanaka" data-tab="galaxies" data-galaxy="0">
            <img src="${IMG}kanaka.png" class="lkp-m-quick-btn__img" onerror="this.style.display='none'">
            <div class="lkp-m-quick-btn__label">Kānaka Maoli</div>
            <div class="lkp-m-quick-btn__sub">10 Concepts</div>
          </button>
          <button class="lkp-m-quick-btn lkp-m-quick-btn--kemet" data-tab="galaxies" data-galaxy="1">
            <img src="${IMG}kemet.png" class="lkp-m-quick-btn__img" onerror="this.style.display='none'">
            <div class="lkp-m-quick-btn__label">Kemet</div>
            <div class="lkp-m-quick-btn__sub">9 Concepts</div>
          </button>
          <button class="lkp-m-quick-btn lkp-m-quick-btn--bridge" data-tab="bridge">
            <div class="lkp-m-quick-btn__glyph">🌐</div>
            <div class="lkp-m-quick-btn__label">The Bridge</div>
            <div class="lkp-m-quick-btn__sub">Aloha ↔ Maʻat</div>
          </button>
          <button class="lkp-m-quick-btn lkp-m-quick-btn--chart" data-tab="chart">
            <div class="lkp-m-quick-btn__glyph">✦</div>
            <div class="lkp-m-quick-btn__label">Star Chart</div>
            <div class="lkp-m-quick-btn__sub">Constellation map</div>
          </button>
        </div>

        <a href="lessons.html" class="lkp-m-begin-btn">
          <i class="fas fa-book-open"></i> Begin Learning
        </a>

        <div class="lkp-m-home__compass" aria-hidden="true">
          <img src="${IMG}hawaiian-star-compass.png" class="lkp-m-compass-img" onerror="this.style.display='none'">
        </div>
      </div>`;

    el.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const gal = btn.dataset.galaxy;
        if (gal !== undefined) activeGalaxy = parseInt(gal);
        switchTab(btn.dataset.tab);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     GALAXIES PANEL — horizontal scroll snap between culture cards
  ───────────────────────────────────────────────────────────────────────── */
  function buildGalaxiesPanel() {
    const el  = document.getElementById('lkp-m-galaxies');
    const all = [...GALAXIES, BRIDGE];

    el.innerHTML = `
      <div class="lkp-m-galaxies">
        <div class="lkp-m-panel-header">
          <div class="lkp-m-eyebrow">✦ The Cultures ✦</div>
          <h2 class="lkp-m-panel-title">Two Galaxies of<br><em>Living Knowledge</em></h2>
        </div>
        <div class="lkp-m-galaxy-dots" id="galaxyDots">
          ${all.map((g,i) => `<button class="lkp-m-galaxy-dot ${i===activeGalaxy?'is-active':''}" style="--dot-color:${g.color}" data-idx="${i}" aria-label="${g.name}"></button>`).join('')}
        </div>
        <div class="lkp-m-galaxy-track" id="galaxyTrack">
          ${all.map((g, i) => buildGalaxyCard(g, i)).join('')}
        </div>
      </div>`;

    // Wire dots
    el.querySelectorAll('.lkp-m-galaxy-dot').forEach(dot => {
      dot.addEventListener('click', () => scrollToGalaxy(parseInt(dot.dataset.idx)));
    });

    // Scroll → update dots
    const track = el.querySelector('#galaxyTrack');
    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      if (idx !== activeGalaxy) { activeGalaxy = idx; updateDots(); }
    }, { passive: true });

    // Wire concept pills
    el.querySelectorAll('.lkp-m-concept-pill').forEach(pill => {
      pill.addEventListener('click', () => openConceptSheet(pill.dataset.id));
    });

    // Wire explore buttons
    el.querySelectorAll('.lkp-m-galaxy-card__explore').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.galaxy;
        if (id === 'bridge') switchTab('bridge');
        else window.location.href = `lessons.html#${id}`;
      });
    });
  }

  function buildGalaxyCard(g, i) {
    const isBridge = g.id === 'bridge';
    const concepts = isBridge ? g.concepts : g.concepts;
    const pills = concepts.map(c =>
      `<button class="lkp-m-concept-pill ${c.major ? 'lkp-m-concept-pill--major' : ''}"
         style="--pill-color:${g.color};--pill-bg:${g.colorDim};--pill-border:${g.colorBorder}"
         data-id="${c.id}">${c.label}</button>`
    ).join('');

    return `
      <div class="lkp-m-galaxy-card" data-idx="${i}" style="--galaxy-color:${g.color};--galaxy-dim:${g.colorDim}">
        <div class="lkp-m-galaxy-card__header">
          <div class="lkp-m-galaxy-card__disc">
            ${g.image
              ? `<img src="${g.image}" class="lkp-m-galaxy-card__img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
              : ''}
            <div class="lkp-m-galaxy-card__emoji" ${g.image ? 'style="display:none"' : ''}>${g.emoji}</div>
          </div>
          <div class="lkp-m-galaxy-card__meta">
            <div class="lkp-m-galaxy-card__badge" style="color:${g.color}">◈ ${isBridge ? 'The Bridge' : 'Galaxy ' + (i + 1)}</div>
            <div class="lkp-m-galaxy-card__name" style="color:${g.color}">${g.name}</div>
            <div class="lkp-m-galaxy-card__tagline">${g.tagline}</div>
          </div>
        </div>
        <p class="lkp-m-galaxy-card__intro">${g.intro}</p>
        <div class="lkp-m-galaxy-card__concepts">
          <div class="lkp-m-galaxy-card__concepts-label">Tap a concept to explore</div>
          <div class="lkp-m-galaxy-card__pills">${pills}</div>
        </div>
        <button class="lkp-m-galaxy-card__explore" data-galaxy="${g.id}"
          style="background:${g.colorDim};border-color:${g.colorBorder};color:${g.color}">
          ${isBridge ? 'Explore The Bridge →' : `Enter ${g.name} Lessons →`}
        </button>
      </div>`;
  }

  function scrollToGalaxy(idx) {
    activeGalaxy = idx;
    const track = document.getElementById('galaxyTrack');
    if (track) track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
    updateDots();
  }

  function updateDots() {
    document.querySelectorAll('.lkp-m-galaxy-dot').forEach(d => {
      d.classList.toggle('is-active', parseInt(d.dataset.idx) === activeGalaxy);
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     BRIDGE PANEL — Aloha ↔ Maʻat comparison
  ───────────────────────────────────────────────────────────────────────── */
  function buildBridgePanel() {
    const el = document.getElementById('lkp-m-bridge');

    const pairs = BRIDGE.pairs.map(p => `
      <div class="lkp-m-bridge-pair">
        <div class="lkp-m-bridge-col lkp-m-bridge-col--kanaka">
          <div class="lkp-m-bridge-col__name">${p.kanaka.name}</div>
          <div class="lkp-m-bridge-col__sub">${p.kanaka.sub}</div>
          <p class="lkp-m-bridge-col__desc">${p.kanaka.desc}</p>
        </div>
        <div class="lkp-m-bridge-divider">↔</div>
        <div class="lkp-m-bridge-col lkp-m-bridge-col--kemet">
          <div class="lkp-m-bridge-col__name">${p.kemet.name}</div>
          <div class="lkp-m-bridge-col__sub">${p.kemet.sub}</div>
          <p class="lkp-m-bridge-col__desc">${p.kemet.desc}</p>
        </div>
      </div>`).join('');

    el.innerHTML = `
      <div class="lkp-m-bridge-panel">
        <div class="lkp-m-panel-header">
          <div class="lkp-m-eyebrow">✦ The Living Connection ✦</div>
          <h2 class="lkp-m-panel-title">Aloha &amp; Maʻat —<br><em>One Truth</em></h2>
        </div>

        <div class="lkp-m-bridge-intro">
          <div class="lkp-m-bridge-header-cards">
            <div class="lkp-m-bridge-culture lkp-m-bridge-culture--kanaka">
              <img src="${IMG}kanaka.png" class="lkp-m-bridge-culture__img" onerror="this.style.display='none'">
              <div>
                <div class="lkp-m-bridge-culture__name">Aloha</div>
                <div class="lkp-m-bridge-culture__sub">Hawaiian Way of Being</div>
              </div>
            </div>
            <div class="lkp-m-bridge-vs">↔</div>
            <div class="lkp-m-bridge-culture lkp-m-bridge-culture--kemet">
              <img src="${IMG}kemet.png" class="lkp-m-bridge-culture__img" onerror="this.style.display='none'">
              <div>
                <div class="lkp-m-bridge-culture__name">Maʻat</div>
                <div class="lkp-m-bridge-culture__sub">Kemetic Cosmic Order</div>
              </div>
            </div>
          </div>
          <p class="lkp-m-bridge-intro__text">
            Developed independently, on opposite sides of the Earth, thousands of years apart.
            Yet structurally identical. Both understand cosmic order, personal ethics, and
            ecological responsibility as one indivisible truth.
          </p>
        </div>

        <div class="lkp-m-bridge-pairs">${pairs}</div>

        <div class="lkp-m-bridge-quotes">
          <blockquote class="lkp-m-bridge-quote lkp-m-bridge-quote--kanaka">
            "Aloha is the intelligence with which we meet life."
            <cite>— Aunty Pilahi Paki</cite>
          </blockquote>
          <blockquote class="lkp-m-bridge-quote lkp-m-bridge-quote--kemet">
            "Speak Maʻat. Do Maʻat. For she is mighty, she is great, she endures."
            <cite>— Tomb of Rekhmire, c. 1425 BCE</cite>
          </blockquote>
        </div>

        <a href="lessons.html#bridge-aloha-maat" class="lkp-m-bridge-cta">
          Explore The Bridge Lessons →
        </a>
      </div>`;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     STAR CHART PANEL — 2D SVG constellation map, tappable nodes
  ───────────────────────────────────────────────────────────────────────── */
  function buildChartPanel() {
    const el = document.getElementById('lkp-m-chart');

    // Layout all concepts in a 2D space
    // Kānaka Maoli: left cluster | Kemet: right cluster | Bridge: top center
    const LAYOUT = {
      kumulipo:   [110, 220], aloha:     [80,  310], wayfinding:[160, 280],
      hokuleaa:   [130, 160], ahupuaa:   [60,  380], kalo:      [40,  440],
      mana:       [170, 340], pono:      [90,  370], olelo:     [150, 420],
      laau:       [50,  490],
      maat:       [520, 220], nun:       [490, 150], ennead:    [570, 280],
      ptah:       [550, 340], medunetjer:[590, 390], duat:      [530, 420],
      imhotep:    [480, 310], kabakh:    [560, 460], isfet:     [500, 480],
      'br-creation':[310,90],  'br-pairs':  [270,160], 'br-alohamaat':[340,170],
      'br-star':    [280,240],
    };

    const W = 640, H = 560;
    const concepts = Array.from(ALL_CONCEPTS.values());

    // Build SVG lines
    let lines = '';
    CHART_CONNECTIONS.forEach(([aId, bId, str]) => {
      const posA = LAYOUT[aId], posB = LAYOUT[bId];
      if (!posA || !posB) return;
      const ca = ALL_CONCEPTS.get(aId), cb = ALL_CONCEPTS.get(bId);
      const midC = ca ? ca.color : '#fff';
      lines += `<line x1="${posA[0]}" y1="${posA[1]}" x2="${posB[0]}" y2="${posB[1]}"
        stroke="${midC}" stroke-opacity="${str * 0.30}" stroke-width="${str > 0.7 ? 1.2 : 0.8}"
        stroke-dasharray="${str > 0.7 ? 'none' : '4,4'}"/>`;
    });

    // Build SVG nodes
    let nodes = '';
    concepts.forEach(c => {
      const pos = LAYOUT[c.id];
      if (!pos) return;
      const r   = c.major ? 8 : 5;
      const col = c.color;
      nodes += `
        <g class="lkp-m-chart-node" data-id="${c.id}" transform="translate(${pos[0]},${pos[1]})">
          <circle r="${r + 8}" fill="transparent" class="lkp-m-chart-node__hit"/>
          <circle r="${r}" fill="${col}" opacity="0.88" class="lkp-m-chart-node__dot"/>
          <circle r="${r + 3}" fill="none" stroke="${col}" stroke-opacity="0.30" stroke-width="1"/>
          ${c.major ? `<line x1="${-(r+6)}" y1="0" x2="${r+6}" y2="0" stroke="${col}" stroke-opacity="0.40" stroke-width="0.8"/>
          <line x1="0" y1="${-(r+6)}" x2="0" y2="${r+6}" stroke="${col}" stroke-opacity="0.40" stroke-width="0.8"/>` : ''}
          <text x="0" y="${r + 14}" text-anchor="middle" font-size="9" fill="${col}" opacity="0.82"
            font-family="DM Sans,sans-serif" font-weight="${c.major?'600':'400'}">${c.label}</text>
        </g>`;
    });

    // Culture region labels
    const labels = `
      <text x="105" y="48" text-anchor="middle" font-size="11" fill="#3cb371" opacity="0.50"
        font-family="DM Sans,sans-serif" font-weight="600" letter-spacing="1">KĀNAKA MAOLI</text>
      <text x="530" y="48" text-anchor="middle" font-size="11" fill="#f0c96a" opacity="0.50"
        font-family="DM Sans,sans-serif" font-weight="600" letter-spacing="1">KEMET</text>
      <text x="310" y="32" text-anchor="middle" font-size="11" fill="#aa99ff" opacity="0.50"
        font-family="DM Sans,sans-serif" font-weight="600" letter-spacing="1">THE BRIDGE</text>`;

    el.innerHTML = `
      <div class="lkp-m-chart-panel">
        <div class="lkp-m-panel-header">
          <div class="lkp-m-eyebrow">✦ Constellation Map ✦</div>
          <h2 class="lkp-m-panel-title">The Star Chart</h2>
          <p class="lkp-m-panel-desc">Tap any star to learn about that concept. Lines show knowledge connections.</p>
        </div>
        <div class="lkp-m-chart-scroll">
          <svg viewBox="0 0 ${W} ${H}" class="lkp-m-chart-svg" role="img" aria-label="Knowledge constellation chart">
            <defs>
              <radialGradient id="mgk" cx="17%" cy="45%" r="28%">
                <stop offset="0%" stop-color="#3cb371" stop-opacity="0.12"/>
                <stop offset="100%" stop-color="#3cb371" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="mgm" cx="83%" cy="45%" r="28%">
                <stop offset="0%" stop-color="#f0c96a" stop-opacity="0.10"/>
                <stop offset="100%" stop-color="#f0c96a" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="mgb" cx="50%" cy="20%" r="22%">
                <stop offset="0%" stop-color="#aa99ff" stop-opacity="0.10"/>
                <stop offset="100%" stop-color="#aa99ff" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <rect width="${W}" height="${H}" fill="url(#mgk)"/>
            <rect width="${W}" height="${H}" fill="url(#mgm)"/>
            <rect width="${W}" height="${H}" fill="url(#mgb)"/>
            ${labels}
            <g class="lkp-m-chart-lines">${lines}</g>
            <g class="lkp-m-chart-nodes">${nodes}</g>
          </svg>
        </div>
        <div id="lkp-m-chart-tip" class="lkp-m-chart-tip hidden">
          <div class="lkp-m-chart-tip__inner">
            <div id="chartTipLabel" class="lkp-m-chart-tip__label"></div>
            <div id="chartTipDesc" class="lkp-m-chart-tip__desc"></div>
            <a id="chartTipLink" href="#" class="lkp-m-chart-tip__link">Study this lesson →</a>
          </div>
          <button id="chartTipClose" class="lkp-m-chart-tip__close" aria-label="Close">✕</button>
        </div>
      </div>`;

    // Wire node taps
    el.querySelectorAll('.lkp-m-chart-node').forEach(node => {
      node.addEventListener('click', () => {
        const concept = ALL_CONCEPTS.get(node.dataset.id);
        if (!concept) return;
        const tip   = document.getElementById('lkp-m-chart-tip');
        const label = document.getElementById('chartTipLabel');
        const desc  = document.getElementById('chartTipDesc');
        const link  = document.getElementById('chartTipLink');
        label.textContent = concept.label;
        label.style.color = concept.color;
        desc.textContent  = concept.desc || '';
        link.href         = `lessons.html#${concept.lessonId}`;
        tip.classList.remove('hidden');
      });
    });

    el.querySelector('#chartTipClose')?.addEventListener('click', () => {
      document.getElementById('lkp-m-chart-tip').classList.add('hidden');
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     ECOSYSTEM PANEL
  ───────────────────────────────────────────────────────────────────────── */
  function buildEcosystemPanel() {
    const el = document.getElementById('lkp-m-ecosystem');
    const PLATFORMS = [
      { name:'IkeHub',       url:'https://808cryptobeast.github.io/ikehub/',         img:'ikehub.png',      fb:'⬡', color:'var(--m-cyan)',    desc:'The Ikeverse portal hub — gateway to all platforms.' },
      { name:'IkeStar',      url:'https://808cryptobeast.github.io/Ikestar/',        img:'ikestar.png',     fb:'⭐', color:'var(--m-cyan)',    desc:'Celestial observatory — cultural astronomy and sky knowledge.' },
      { name:'Cosmic Weave', url:'https://808cryptobeast.github.io/Ikeverse/',       img:'cosmic-weave.png',fb:'🌌', color:'var(--m-violet)',  desc:'Symbolic systems, worldbuilding, and cosmic cosmology.' },
      { name:'Culturalverse',url:'https://808cryptobeast.github.io/culturalverse/',  img:'kanaka.png',      fb:'🌿', color:'var(--m-emerald)', desc:'The full cultural learning universe — heritage and story.' },
    ];

    const cards = PLATFORMS.map(p => `
      <a href="${p.url}" class="lkp-m-eco-card" target="_blank" rel="noopener">
        <div class="lkp-m-eco-card__icon" style="border-color:${p.color}22;background:${p.color}11">
          <img src="${IMG}${p.img}" class="lkp-m-eco-card__img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <span class="lkp-m-eco-card__fb" style="display:none">${p.fb}</span>
        </div>
        <div class="lkp-m-eco-card__body">
          <div class="lkp-m-eco-card__name" style="color:${p.color}">${p.name}</div>
          <div class="lkp-m-eco-card__desc">${p.desc}</div>
        </div>
        <div class="lkp-m-eco-card__arrow" style="color:${p.color}">→</div>
      </a>`).join('');

    el.innerHTML = `
      <div class="lkp-m-eco-panel">
        <div class="lkp-m-panel-header">
          <div class="lkp-m-eyebrow">✦ Connected Platforms ✦</div>
          <h2 class="lkp-m-panel-title">The <em>Ikeverse</em><br>Ecosystem</h2>
        </div>
        <div class="lkp-m-eco-list">${cards}</div>
      </div>`;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     CONCEPT BOTTOM SHEET — slides up when concept pill tapped
  ───────────────────────────────────────────────────────────────────────── */
  function buildBottomSheet() {
    const sheet = document.getElementById('lkp-m-sheet');
    const bg    = document.getElementById('lkp-m-sheet-bg');

    sheet.innerHTML = `
      <div class="lkp-m-sheet__handle"></div>
      <div id="lkp-m-sheet-content" class="lkp-m-sheet__content"></div>`;

    bg.addEventListener('click', closeSheet);
    // Swipe down to close
    let startY = 0;
    sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive:true });
    sheet.addEventListener('touchend',   e => {
      if (e.changedTouches[0].clientY - startY > 60) closeSheet();
    }, { passive:true });
  }

  function openConceptSheet(id) {
    const concept = ALL_CONCEPTS.get(id);
    if (!concept) return;

    const gDef = [...GALAXIES, BRIDGE].find(g => g.id === concept.culture) || GALAXIES[0];
    const content = document.getElementById('lkp-m-sheet-content');

    content.innerHTML = `
      <div class="lkp-m-sheet__badge" style="color:${concept.color};background:${gDef.colorDim||'rgba(255,255,255,0.06)'}">
        ◈ ${gDef.name}
      </div>
      <h3 class="lkp-m-sheet__title" style="color:${concept.color}">${concept.label}</h3>
      <p class="lkp-m-sheet__desc">${concept.desc || ''}</p>
      <a href="lessons.html#${concept.lessonId}" class="lkp-m-sheet__cta"
         style="background:${gDef.colorDim};border-color:${gDef.colorBorder||'rgba(255,255,255,0.15)'}; color:${concept.color}">
        <i class="fas fa-book-open"></i> Study This Lesson
      </a>`;

    document.getElementById('lkp-m-sheet').classList.add('is-open');
    document.getElementById('lkp-m-sheet-bg').classList.add('is-open');
    sheetOpen = true;
  }

  function closeSheet() {
    document.getElementById('lkp-m-sheet').classList.remove('is-open');
    document.getElementById('lkp-m-sheet-bg').classList.remove('is-open');
    sheetOpen = false;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     BOTTOM NAV
  ───────────────────────────────────────────────────────────────────────── */
  const NAV_TABS = [
    { id:'home',      icon:'fa-house',          label:'Home'     },
    { id:'galaxies',  icon:'fa-circle-nodes',   label:'Galaxies' },
    { id:'bridge',    icon:'fa-arrows-left-right',label:'Bridge'  },
    { id:'chart',     icon:'fa-star',           label:'Chart'    },
    { id:'ecosystem', icon:'fa-network-wired',  label:'Ecosystem'},
  ];

  function buildBottomNav() {
    const nav = document.getElementById('lkp-m-nav');
    nav.innerHTML = NAV_TABS.map(t => `
      <button class="lkp-m-nav__btn ${t.id === activeTab ? 'is-active' : ''}"
              data-tab="${t.id}" aria-label="${t.label}">
        <i class="fas ${t.icon} lkp-m-nav__icon"></i>
        <span class="lkp-m-nav__label">${t.label}</span>
      </button>`).join('');

    nav.querySelectorAll('.lkp-m-nav__btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
  }

  function switchTab(tabId) {
    activeTab = tabId;
    // Update panels
    document.querySelectorAll('.lkp-m-panel').forEach(p => {
      p.classList.toggle('is-active', p.dataset.panel === tabId);
    });
    // Update nav
    document.querySelectorAll('.lkp-m-nav__btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.tab === tabId);
    });
    // If switching to galaxies, scroll to active galaxy
    if (tabId === 'galaxies') {
      requestAnimationFrame(() => scrollToGalaxy(activeGalaxy));
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     SWIPE — left/right between tabs
  ───────────────────────────────────────────────────────────────────────── */
  function initSwipe() {
    let tx = 0, ty = 0, locked = false;
    const TAB_ORDER = NAV_TABS.map(t => t.id);

    const panels = document.getElementById('lkp-m-panels');
    panels.addEventListener('touchstart', e => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
      locked = false;
    }, { passive: true });

    panels.addEventListener('touchmove', e => {
      if (locked) return;
      const dx = e.touches[0].clientX - tx;
      const dy = e.touches[0].clientY - ty;
      if (Math.abs(dy) > Math.abs(dx)) { locked = true; return; } // vertical scroll wins
      if (Math.abs(dx) > 12) locked = true; // lock to horizontal swipe
    }, { passive: true });

    panels.addEventListener('touchend', e => {
      if (sheetOpen) return;
      // Skip swipe if inside the galaxy track (it handles its own scroll)
      if (e.target.closest('#galaxyTrack')) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) < 55) return;
      const idx = TAB_ORDER.indexOf(activeTab);
      if (dx < 0 && idx < TAB_ORDER.length - 1) switchTab(TAB_ORDER[idx + 1]);
      if (dx > 0 && idx > 0) switchTab(TAB_ORDER[idx - 1]);
    }, { passive: true });
  }

  /* ── Go ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();