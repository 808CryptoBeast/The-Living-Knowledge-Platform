/**
 * lkp-kumulipo-wa-ui.js
 * Interactive Wā expansion UI for Kumulipo lesson
 * Renders 16 collapsible sections with bilingual content
 */

(function() {
  'use strict';

  // Wā data extracted from enrichments
  const WA_DATA = [
    {
      num: 1,
      hawaiian: 'Wā o ke Koʻa',
      englishTitle: 'Era of Coral',
      hawaiianPhrase: 'Hānau ka koʻa i ka pō',
      englishMeaning: 'Coral life is born in deep darkness.',
      theme: 'First life in deep pō: coral and earliest sea forms.',
      englishLens: 'Life begins in oceanic darkness.',
      concepts: ['Koʻa (coral)', 'First paired life', 'Sacred darkness', 'Marine genesis'],
      relatedConnections: ['ke-nun', 'bridge-darkness']
    },
    {
      num: 2,
      hawaiian: 'Wā o nā Mea o ke Kai',
      englishTitle: 'Era of Sea Creatures',
      hawaiianPhrase: 'Hānau nā mea o ke kai',
      englishMeaning: 'Sea beings multiply and diversify.',
      theme: 'Marine multiplicity expands.',
      englishLens: 'Diversification of aquatic life.',
      concepts: ['Sea creatures', 'Multiplicity', 'Diversification', 'Paired emergence'],
      relatedConnections: ['ke-nun']
    },
    {
      num: 3,
      hawaiian: 'Wā o nā Limu a me nā Mea Ulu o ke Kai',
      englishTitle: 'Sea Plants and Growth',
      hawaiianPhrase: 'Ulu nā limu o ke kai',
      englishMeaning: 'Marine plants and algae establish life webs.',
      theme: 'Algae and marine growth systems.',
      englishLens: 'Ecological foundations and food webs.',
      concepts: ['Limu (seaweed)', 'Growth systems', 'Food webs', 'Marine ecology'],
      relatedConnections: ['br-cosmology-evolution']
    },
    {
      num: 4,
      hawaiian: 'Wā o nā Mea Kolo a me nā Mea Pēlā',
      englishTitle: 'Creeping and Small Forms',
      hawaiianPhrase: 'Pili nā mea liʻiliʻi',
      englishMeaning: 'Small and creeping life forms connect ecological layers.',
      theme: 'Transitional and interlinked species.',
      englishLens: 'Complexity through relation.',
      concepts: ['Interrelation', 'Small forms', 'Layered complexity', 'Connection'],
      relatedConnections: []
    },
    {
      num: 5,
      hawaiian: 'Wā o nā Iʻa Nui',
      englishTitle: 'Larger Sea Beings',
      hawaiianPhrase: 'Nui nā iʻa o ke kai',
      englishMeaning: 'Larger marine beings emerge in patterned pairings.',
      theme: 'Expanded marine orders and paired emergence.',
      englishLens: 'Patterned increase in scale.',
      concepts: ['Large fish', 'Patterned pairs', 'Marine order', 'Emergence'],
      relatedConnections: []
    },
    {
      num: 6,
      hawaiian: 'Wā o nā Manu Kai a me nā Mea Pēlā',
      englishTitle: 'Sea Birds and Boundary Crossers',
      hawaiianPhrase: 'Lele nā manu kai',
      englishMeaning: 'Sea birds and boundary-crossing life move between realms.',
      theme: 'Life crossing air-water thresholds.',
      englishLens: 'New ecological niches.',
      concepts: ['Manu (birds)', 'Boundary crossing', 'Air-water threshold', 'New niches'],
      relatedConnections: []
    },
    {
      num: 7,
      hawaiian: 'Wā o nā Mea Ulu o ka ʻĀina',
      englishTitle: 'Land Growth',
      hawaiianPhrase: 'Ulu nā mea kanu o ka ʻāina',
      englishMeaning: 'Land plants and algae establish life webs.',
      theme: 'Plant worlds of land become central.',
      englishLens: 'Terrestrial systems stabilize.',
      concepts: ['ʻĀina (land)', 'Plants', 'Terrestrial foundation', 'Stabilization'],
      relatedConnections: []
    },
    {
      num: 8,
      hawaiian: 'Wā o nā Holoholona o ka ʻĀina',
      englishTitle: 'Land Animals',
      hawaiianPhrase: 'Hele nā holoholona o ka ʻāina',
      englishMeaning: 'Land animals take their place in living relation.',
      theme: 'Land life matures in layered relations.',
      englishLens: 'Increasing terrestrial complexity.',
      concepts: ['Holoholona (animals)', 'Land ecology', 'Complexity', 'Living relation'],
      relatedConnections: []
    },
    {
      num: 9,
      hawaiian: 'Wā o ka Huli i ke Ao',
      englishTitle: 'Turning Toward Light',
      hawaiianPhrase: 'Huli ka pō i ke ao',
      englishMeaning: 'Darkness turns toward light.',
      theme: 'Transition from deep pō toward ao.',
      englishLens: 'Cosmological threshold and emergence.',
      concepts: ['Pō to Ao', 'Transition', 'Light emergence', 'Cosmic threshold'],
      relatedConnections: ['vd-nasadiya']
    },
    {
      num: 10,
      hawaiian: 'Wā o nā Kūpuna Akua',
      englishTitle: 'Ancestral Divine Genealogies',
      hawaiianPhrase: 'Puka nā kūpuna akua',
      englishMeaning: 'Ancestral divine genealogies come forward.',
      theme: 'Sacred genealogical ordering.',
      englishLens: 'Cosmos expressed through lineage.',
      concepts: ['Kūpuna (ancestors)', 'Akua (divine)', 'Sacred order', 'Genealogy'],
      relatedConnections: ['bridge-genealogy-ecology']
    },
    {
      num: 11,
      hawaiian: 'Wā o nā Hanauna Kiʻekiʻe',
      englishTitle: 'High Genealogical Lines',
      hawaiianPhrase: 'Paʻa nā hanauna kiʻekiʻe',
      englishMeaning: 'High ancestral lines are ordered and secured.',
      theme: 'Intensified chiefly/ancestral sequencing.',
      englishLens: 'Social order linked to cosmic order.',
      concepts: ['High lineages', 'Sacred order', 'Chiefly lines', 'Secured genealogy'],
      relatedConnections: []
    },
    {
      num: 12,
      hawaiian: 'Wā o nā Pili Aliʻi',
      englishTitle: 'Chiefly Relational Lines',
      hawaiianPhrase: 'Pili nā aliʻi i ke kumu',
      englishMeaning: 'Chiefly lines are tied to sacred origins.',
      theme: 'Governance and genealogy intertwine.',
      englishLens: 'Authority as inherited kuleana.',
      concepts: ['Aliʻi (chiefs)', 'Kuleana (responsibility)', 'Governance', 'Authority'],
      relatedConnections: []
    },
    {
      num: 13,
      hawaiian: 'Wā o ka Hānau Moʻokūʻauhau',
      englishTitle: 'Genealogical Birth Lines',
      hawaiianPhrase: 'Hānau ka moʻokūʻauhau kanaka',
      englishMeaning: 'Human genealogy is born within cosmic continuity.',
      theme: 'Human lines in sacred continuity.',
      englishLens: 'Humans placed inside, not outside, creation.',
      concepts: ['Kanaka (humans)', 'Moʻokūʻauhau (genealogy)', 'Continuity', 'Sacred'],
      relatedConnections: ['km-wakea']
    },
    {
      num: 14,
      hawaiian: 'Wā o ka Hoʻonui Hanauna',
      englishTitle: 'Expansion of Descendant Lines',
      hawaiianPhrase: 'Hoʻonui ʻia nā hanauna',
      englishMeaning: 'Descendant lines expand through kinship.',
      theme: 'Social worlds widen through kinship.',
      englishLens: 'Peoplehood as ecological relationship.',
      concepts: ['Expansion', 'Kinship', 'Social worlds', 'Relation'],
      relatedConnections: []
    },
    {
      num: 15,
      hawaiian: 'Wā o ke Kauoha a me ke Kuleana',
      englishTitle: 'Charge and Responsibility',
      hawaiianPhrase: 'Kau ʻia ke kuleana',
      englishMeaning: 'Responsibility is placed upon lineage.',
      theme: 'Lineage carries ethical obligation.',
      englishLens: 'Memory becomes duty.',
      concepts: ['Kuleana (responsibility)', 'Charge', 'Obligation', 'Memory as duty'],
      relatedConnections: []
    },
    {
      num: 16,
      hawaiian: 'Wā o ke Ao Kanaka',
      englishTitle: 'Human Realm in Light',
      hawaiianPhrase: 'Ao kanaka, mālama honua',
      englishMeaning: 'In the human realm of light, stewardship is the charge.',
      theme: 'Genealogy culminates in living responsibility.',
      englishLens: 'To be human is to steward relations across land, sea, and sky.',
      concepts: ['Ao (light)', 'Kanaka (humans)', 'Mālama (stewardship)', 'Honua (earth)'],
      relatedConnections: ['km-wakea', 'dt-songlines-intro']
    }
  ];

  /**
   * Generate dynamic opening header that shows current Wā phrase
   * @param {number} waNum - Current Wā number to display (optional, defaults to 1)
   * @returns {string} HTML for opening header
   */
  function renderWaOpeningHeader(waNum = 1) {
    const wa = WA_DATA.find(w => w.num === waNum);
    if (!wa) return '';

    return `
      <div class="kumulipo-wa-opening-header">
        <div class="kumulipo-wa-opening-header__intro">
          <h4>Kumulipo — Opening of Wā ${waNum}</h4>
          <span class="kumulipo-wa-opening-header__subtitle">${escapeHTML(wa.hawaiian)}</span>
        </div>
        
        <div class="kumulipo-wa-opening-header__content">
          <div class="kumulipo-wa-opening-phrase">
            <strong>ʻŌlelo Hawaiʻi:</strong>
            <p>"${escapeHTML(wa.hawaiianPhrase)}"</p>
          </div>
          
          <div class="kumulipo-wa-opening-translation">
            <strong>English Meaning:</strong>
            <p>${escapeHTML(wa.englishMeaning)}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate Wā list (navigation buttons only)
   * @param {number} selectedWa - Currently selected Wā number (for header)
   * @returns {string} HTML for Wā navigation list
   */
  function renderWaNavigation(selectedWa = 1) {
    let html = renderWaOpeningHeader(selectedWa);
    html += `
      <div class="kumulipo-wa-nav">
        <div class="kumulipo-wa-nav__intro">
          <h4>16 Wā Epochs</h4>
        </div>
        <div class="kumulipo-wa-nav__list">
    `;

    WA_DATA.forEach((wa) => {
      html += `
        <button class="kumulipo-wa-nav-btn" type="button" data-wa-select="${wa.num}" aria-label="View Wā ${wa.num}: ${wa.hawaiian}">
          <span class="kumulipo-wa-nav-num">${String(wa.num).padStart(2, '0')}</span>
          <span class="kumulipo-wa-nav-text">
            <span class="kumulipo-wa-nav-hawaiian">${escapeHTML(wa.hawaiian)}</span>
            <span class="kumulipo-wa-nav-english">${escapeHTML(wa.englishTitle)}</span>
          </span>
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Generate full view for a single Wā
   * @param {number} waNum - Wā number (1-16)
   * @param {string} lessonMode - 'scholar' or 'keiki'
   * @returns {string} HTML for single Wā full view
   */
  function renderWaSingleView(waNum, lessonMode = 'scholar') {
    const wa = WA_DATA.find(w => w.num === waNum);
    if (!wa) return '';

    const isScholar = lessonMode === 'scholar';
    const waCluster = waNum <= 8 ? 'Pō' : 'Ao';
    const conceptList = isScholar ? wa.concepts.join(' · ') : wa.concepts.slice(0, 2).join(' · ');

    let html = renderWaOpeningHeader(waNum);
    html += `
      <div class="kumulipo-wa-single">
        <div class="kumulipo-wa-single__header">
          <div class="kumulipo-wa-single__cluster">
            <span class="kumulipo-wa-cluster-badge">${waCluster} Cluster</span>
            <span class="kumulipo-wa-progress">${waNum} of 16</span>
          </div>
          <div class="kumulipo-wa-single__titles">
            <h2 class="kumulipo-wa-single__hawaiian">${escapeHTML(wa.hawaiian)}</h2>
            <h3 class="kumulipo-wa-single__english">${escapeHTML(wa.englishTitle)}</h3>
          </div>
        </div>

        <div class="kumulipo-wa-single__content">
          <!-- Hawaiian phrase -->
          <div class="kumulipo-wa-phrase-block">
            <strong class="kumulipo-wa-phrase-label">ʻŌlelo Hawaiʻi:</strong>
            <p class="kumulipo-wa-phrase-text">"${escapeHTML(wa.hawaiianPhrase)}"</p>
          </div>

          <!-- English translation -->
          <div class="kumulipo-wa-translation-block">
            <strong class="kumulipo-wa-translation-label">English Meaning:</strong>
            <p class="kumulipo-wa-translation-text">${escapeHTML(wa.englishMeaning)}</p>
          </div>

          <!-- Theme & lens -->
          <div class="kumulipo-wa-lens-block">
            <strong class="kumulipo-wa-lens-label">Cosmological Role:</strong>
            <p class="kumulipo-wa-theme">${escapeHTML(wa.theme)}</p>
            ${isScholar ? `
              <strong class="kumulipo-wa-lens-label" style="display:block;margin-top:1rem;">Modern Understanding:</strong>
              <p class="kumulipo-wa-english-lens">${escapeHTML(wa.englishLens)}</p>
            ` : ''}
          </div>

          <!-- Concepts -->
          <div class="kumulipo-wa-concepts-block">
            <strong class="kumulipo-wa-concepts-label">Key Concepts:</strong>
            <div class="kumulipo-wa-concept-tags">
              ${conceptList.split(' · ').map(concept => `<span class="kumulipo-wa-tag">${escapeHTML(concept)}</span>`).join('')}
            </div>
          </div>

          <!-- Related connections (Scholar mode) -->
          ${isScholar && wa.relatedConnections.length > 0 ? `
            <div class="kumulipo-wa-related-block">
              <strong class="kumulipo-wa-related-label">Related Lessons:</strong>
              <ul class="kumulipo-wa-related-list">
                ${wa.relatedConnections.map(lessonId => `
                  <li>
                    <a href="#" class="kumulipo-wa-related-link" data-navigate-lesson="${escapeHTML(lessonId)}">
                      ${escapeHTML(lessonId)}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Navigation between Wā -->
        <div class="kumulipo-wa-single__nav">
          ${waNum > 1 ? `
            <button class="kumulipo-wa-single-nav-btn kumulipo-wa-single-nav-prev" type="button" data-wa-prev="${waNum - 1}" aria-label="Previous Wā">
              <i class="fas fa-chevron-left"></i>
              <span>Previous Wā</span>
            </button>
          ` : '<div></div>'}
          
          <button class="kumulipo-wa-single-nav-back" type="button" data-wa-back aria-label="Back to all Wā">
            <i class="fas fa-times"></i>
            Back to All
          </button>

          ${waNum < 16 ? `
            <button class="kumulipo-wa-single-nav-btn kumulipo-wa-single-nav-next" type="button" data-wa-next="${waNum + 1}" aria-label="Next Wā">
              <span>Next Wā</span>
              <i class="fas fa-chevron-right"></i>
            </button>
          ` : '<div></div>'}
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Initialize Wā selection and navigation
   * @param {HTMLElement|Document} container - Scope search to this container
   * @param {string} lessonMode - 'scholar' or 'keiki'
   * @param {Function} modeGetter - Function to get current mode
   */
  function initWaInteractivity(container = document, lessonMode = 'scholar', modeGetter = null) {
    // Select Wā button clicked - show single view
    const selectButtons = container.querySelectorAll('[data-wa-select]');
    console.log(`[KUMULIPO_WA] Found ${selectButtons.length} Wā select buttons`);

    selectButtons.forEach((btn, idx) => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const waNum = parseInt(this.getAttribute('data-wa-select'), 10);
        const currentMode = modeGetter ? modeGetter() : lessonMode;
        
        console.log(`[KUMULIPO_WA] Wā ${waNum} selected (mode: ${currentMode})`);
        showWaSingleView(waNum, currentMode);
      });
    });

    // Back button - show all Wā nav
    const backBtns = container.querySelectorAll('[data-wa-back]');
    backBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('[KUMULIPO_WA] Back to all Wā');
        showWaNavigation();
      });
    });

    // Previous/Next navigation
    const prevBtns = container.querySelectorAll('[data-wa-prev]');
    prevBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const waNum = parseInt(this.getAttribute('data-wa-prev'), 10);
        const currentMode = modeGetter ? modeGetter() : lessonMode;
        
        console.log(`[KUMULIPO_WA] Previous Wā: ${waNum}`);
        showWaSingleView(waNum, currentMode);
      });
    });

    const nextBtns = container.querySelectorAll('[data-wa-next]');
    nextBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const waNum = parseInt(this.getAttribute('data-wa-next'), 10);
        const currentMode = modeGetter ? modeGetter() : lessonMode;
        
        console.log(`[KUMULIPO_WA] Next Wā: ${waNum}`);
        showWaSingleView(waNum, currentMode);
      });
    });

    // Handle related lesson navigation
    const relatedLinks = container.querySelectorAll('[data-navigate-lesson]');
    console.log(`[KUMULIPO_WA] Found ${relatedLinks.length} related lesson links`);
    
    relatedLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const lessonId = this.getAttribute('data-navigate-lesson');
        console.log(`[KUMULIPO_WA] Navigate to lesson: ${lessonId}`);
        
        if (window.LESSON_RENDERER && typeof window.LESSON_RENDERER.navigateTo === 'function') {
          window.LESSON_RENDERER.navigateTo(lessonId);
        }
      });
    });
  }

  /**
   * Show single Wā view
   */
  function showWaSingleView(waNum, lessonMode = 'scholar') {
    const container = document.querySelector('.kumulipo-wa-container');
    if (!container) return;

    // Store current selection for header updates
    container.dataset.selectedWa = waNum;

    const html = renderWaSingleView(waNum, lessonMode);
    container.innerHTML = html;

    // Reinitialize event listeners for the new view
    initWaInteractivity(container, lessonMode, () => {
      if (window.LESSON_MODE) return window.LESSON_MODE;
      const modeBtn = document.querySelector('[data-lesson-mode].is-active');
      return modeBtn ? modeBtn.getAttribute('data-lesson-mode') : lessonMode;
    });
    
    // Scroll to top of Wā content
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Show Wā navigation list with dynamic header
   */
  function showWaNavigation() {
    const container = document.querySelector('.kumulipo-wa-container');
    if (!container) return;

    // Use stored selection for header, or default to 1
    const selectedWa = parseInt(container.dataset.selectedWa || '1', 10);
    const html = renderWaNavigation(selectedWa);
    container.innerHTML = html;

    // Reinitialize event listeners for the new view
    initWaInteractivity(container);
    
    // Scroll to top of nav
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Insert Wā UI after action strip in lesson rendering
   * @param {HTMLElement} actionStrip - The action strip element
   * @param {string} lessonMode - 'scholar' or 'keiki'
   */
  function insertWaUI(actionStrip, lessonMode = 'scholar') {
    console.log('[KUMULIPO_WA] Inserting Wā UI in', lessonMode, 'mode');
    
    if (!actionStrip) {
      console.warn('[KUMULIPO_WA] actionStrip element not found');
      return;
    }

    // Remove existing Wā UI if present
    const existing = document.querySelector('.kumulipo-wa-container');
    if (existing) {
      console.log('[KUMULIPO_WA] Removing existing Wā UI');
      existing.parentElement.remove();
    }

    // Create wrapper for Wā UI
    const waWrapper = document.createElement('div');
    waWrapper.className = 'kumulipo-wa-wrapper';
    const html = renderWaNavigation(1); // Start with navigation view, Wā 1 header
    console.log('[KUMULIPO_WA] Rendered navigation HTML length:', html.length);
    
    const container = document.createElement('div');
    container.className = 'kumulipo-wa-container';
    container.dataset.selectedWa = '1'; // Initialize with Wā 1
    container.innerHTML = html;
    waWrapper.appendChild(container);

    // Insert after action strip
    if (actionStrip.parentElement) {
      actionStrip.parentElement.insertBefore(waWrapper, actionStrip.nextElementSibling);
      console.log('[KUMULIPO_WA] Wā UI inserted into DOM');
    } else {
      console.warn('[KUMULIPO_WA] actionStrip.parentElement not found');
      return;
    }

    // Initialize interactivity within this wrapper only
    console.log('[KUMULIPO_WA] Initializing event listeners');
    initWaInteractivity(container, lessonMode, () => {
      // Dynamic mode getter - looks for current lesson mode
      if (window.LESSON_MODE) return window.LESSON_MODE;
      const modeBtn = document.querySelector('[data-lesson-mode].is-active');
      return modeBtn ? modeBtn.getAttribute('data-lesson-mode') : lessonMode;
    });
  }

  /**
   * Update Wā UI when lesson mode changes
   * @param {string} newMode - 'scholar' or 'keiki'
   */
  function updateWaMode(newMode) {
    const container = document.querySelector('.kumulipo-wa-container');
    if (!container) return;

    // Check if we're currently showing a single Wā view or navigation
    const singleView = container.querySelector('.kumulipo-wa-single');
    
    if (singleView) {
      // Extract the current Wā number from the single view
      const progressText = container.querySelector('.kumulipo-wa-progress')?.textContent || '';
      const match = progressText.match(/(\d+) of 16/);
      const waNum = match ? parseInt(match[1], 10) : 1;
      
      console.log(`[KUMULIPO_WA] Updating single view Wā ${waNum} to mode: ${newMode}`);
      showWaSingleView(waNum, newMode);
    } else {
      // Navigation view - no need to update, just reinitialize listeners with new mode
      console.log(`[KUMULIPO_WA] Updating navigation listeners to mode: ${newMode}`);
      initWaInteractivity(container, newMode);
    }
  }

  /**
   * HTML escape utility
   */
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Export public API
  window.KUMULIPO_WA_UI = {
    insert: insertWaUI,
    updateMode: updateWaMode,
    showWaSingleView: showWaSingleView,
    showWaNavigation: showWaNavigation
  };

})();
