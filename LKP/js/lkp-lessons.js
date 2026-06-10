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
  const STARTED_KEY     = 'lkp_started_lessons_v1';
  const REFLECTIONS_KEY = 'lkp_lesson_reflections_v2';
  const MODE_KEY        = 'lkp_lesson_mode_v1';
  const FONT_SCALE_KEY  = 'lkp_lesson_font_scale_v1';
  const LAST_LESSON_KEY = 'lkp_last_lesson_id_v1';
  const SKIP_ROADMAP_KEY = 'lkp_skip_journey_roadmap_v1';
  const READ_PROGRESS_KEY = 'lkp_lesson_read_progress_v1';
  const BOOKMARKS_KEY   = 'lkp_bookmarks_v1';
  const STREAK_KEY      = 'lkp_streak_v1';
  const NOTES_KEY       = 'lkp_notes_v1';
  const COMPLETION_REQUIRED_PROGRESS = 70;
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
    'ke-creation-deep': {
      url: 'assets/images/ke-nun.png',
      pos: 'center center',
      credit: 'Kemetic Creation Deep Study — Nun, Atum, Ogdoad, Ennead, and Ptah'
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
      url: 'assets/images/bridge/bridge-darkness.png',
      pos: 'center center',
      credit: 'Kumulipo & Nun — Creation from Primordial Darkness'
    },
    'bridge-pairs': {
      url: 'assets/images/bridge/bridge-cross-culture.png',
      pos: 'center center',
      credit: 'Paired Forces — Balance and Complementarity'
    },
    'bridge-aloha-maat': {
      url: 'assets/images/bridge/bridge-aloha-maat.png',
      pos: 'center center',
      credit: 'Aloha & Maʻat — Ethics of Right Relationship'
    },
    'bridge-navigation-astronomy': {
      url: 'assets/images/bridge/bridge-navigation-astronomy.png',
      pos: 'center center',
      credit: 'Sky Knowledge — Navigation, Calendars, and Reading the Heavens'
    },
    'bridge-word-creation': {
      url: 'assets/images/bridge/bridge-word-creation.png',
      pos: 'center center',
      credit: 'Creation Through Word — Speech, Chant, Name, and the Making of Worlds'
    },
    'bridge-ecology': {
      url: 'assets/images/bridge/bridge-ecology.png',
      pos: 'center center',
      credit: 'Ecology, Kinship, and Living Systems'
    },
    'bridge-cross-culture': {
      url: 'assets/images/bridge/bridge-cross-culture.png',
      pos: 'center center',
      credit: 'Cross-Cultural Knowledge Bridges'
    },
    'br-cosmology-evolution': {
      url: 'assets/images/bridge/bridge-ecology.png',
      pos: 'center center',
      credit: 'Kumulipo & Evolution — Cosmology Across Scales'
    },

    /* Dogon */
    'dg-po-creation': {
      url: 'assets/images/dogon/dg-po.png',
      pos: 'center center',
      credit: 'Po, Amma & Nommo — Dogon Creation Deep Study'
    },
    'dg-sirius-triplet': {
      url: 'assets/images/dogon/dg-01.png',
      pos: 'center center',
      credit: 'The Sirius Triplet — The Hidden Companion Star'
    },
    'dg-ammas-world': {
      url: 'assets/images/dogon/dg-02.png',
      pos: 'center center',
      credit: 'Amma & the Creation of the World — The Cosmic Egg'
    },
    'dg-syncretism': {
      url: 'assets/images/dogon/dg-03.png',
      pos: 'center center',
      credit: 'Knowledge Keepers & Transmission — Dogon Wisdom in the World'
    },

    /* Māori */
    'mi-te-po': {
      url: 'assets/images/maori/mi-te-po.png',
      pos: 'center center',
      credit: 'Te Kore & Te Pō — Potential, Night, and Becoming'
    },
    'mi-rangi-papa': {
      url: 'assets/images/maori/mi-ranga-papa.png',
      pos: 'center center',
      credit: 'Ranginui & Papatūānuku — The First Separation'
    },
    'mi-whakapapa': {
      url: 'assets/images/maori/mi-whakapapa.png',
      pos: 'center center',
      credit: 'Whakapapa — Genealogy as Knowledge System'
    },
    'mi-hineahuone': {
      url: 'assets/images/maori/mi-hineahuone.png',
      pos: 'center center',
      credit: 'Tāne & Hineahuone — Human Emergence from Earth'
    },
    'mi-hinetitama': {
      url: 'assets/images/maori/mi-hinetitama.png',
      pos: 'center center',
      credit: 'Hine-tītama & Hine-nui-te-pō — Dawn, Death, and Return'
    },
    'mi-maui': {
      url: 'assets/images/maori/mi-maui.png',
      pos: 'center center',
      credit: 'Māui — World-Shaping, Fire, Sun, and Islands'
    },
    'mi-kaitiakitanga': {
      url: 'assets/images/maori/mi-kaitiakitanga.png',
      pos: 'center center',
      credit: 'Kaitiakitanga — Responsibility from Creation'
    },

    /* Dreamtime */
    'dt-songlines-intro': {
      url: 'assets/images/dreamtime/dreamtime-culture.png',
      pos: 'center center',
      credit: 'The Songlines — Stories That Are Maps'
    },
    'dt-celestial-navigation': {
      url: 'assets/images/dreamtime/dreamtime-celestial-song.png',
      pos: 'center center',
      credit: 'Stars & Navigation — The Celestial Songlines'
    },
    'dt-country-consciousness': {
      url: 'assets/images/dreamtime/dreamtime-kinship.png',
      pos: 'center center',
      credit: 'Country as Living — Kinship & Custodianship'
    },
    'dt-protocol-country': {
      url: 'assets/images/dreamtime/dreamtime-protocol.png',
      pos: 'center center',
      credit: 'Protocol First — Many Nations, Many Dreamings'
    },
    'dt-seven-sisters': {
      url: 'assets/images/dreamtime/dreamtime-seven-sisters.png',
      pos: 'center center',
      credit: 'Seven Sisters — Songline Across Sky and Country'
    },
    'dt-emu-sky': {
      url: 'assets/images/dreamtime/dreamtime-emu.png',
      pos: 'center center',
      credit: 'Emu in the Sky — Reading Dark Constellations'
    },
    'dt-care-country': {
      url: 'assets/images/dreamtime/dreamtime-obligation.png',
      pos: 'center center',
      credit: 'Caring for Country — Knowledge as Obligation'
    },
    'dt-nations-map': {
      url: 'assets/images/dreamtime/dreamtime-culture.png',
      pos: 'center center',
      credit: 'Nations, Language Groups & Country — Many Dreaming Systems'
    },

    /* Older aliases */
    'br-darkness': {
      url: 'assets/images/bridge/bridge-darkness.png',
      pos: 'center center',
      credit: 'Kumulipo & Nun — Creation from Primordial Darkness'
    },
    'br-aloha-maat': {
      url: 'assets/images/bridge/bridge-aloha-maat.png',
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
      url: 'assets/images/bridge/bridge-cross-culture.png',
      pos: 'center center',
      credit: 'The Bridge — cross-cultural knowledge'
    },
    dogon: {
      url: 'assets/images/dogon/dg-po.png',
      pos: 'center center',
      credit: 'Dogon knowledge system'
    },
    dreamtime: {
      url: 'assets/images/dreamtime/dreamtime-culture.png',
      pos: 'center center',
      credit: 'Dreamtime knowledge system'
    },
    maori: {
      url: 'assets/images/maori/mi-te-po.png',
      pos: 'center center',
      credit: 'Māori knowledge system'
    },
    yoruba: {
      pos: 'center center',
      credit: 'Yoruba knowledge system',
      placeholder: true
    },
    chinese: {
      pos: 'center center',
      credit: 'Chinese knowledge traditions',
      placeholder: true
    },
    default: {
      pos: 'center center',
      credit: 'Living Knowledge lesson',
      placeholder: true
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

  const KEMET_DEEP_FRAMEWORK = {
    'ke-creation-deep': {
      movement: 'Ordering the Hidden Deep into Living Cosmos',
      crisis: 'Flattening Kemetic creation into one simple myth erases the way multiple temple traditions preserve complementary creation logics.',
      intelligence: 'multi-origin relational discernment',
      continuity: 'Kemetic creation is not a single flat story; Nun, the Ogdoad, Atum, the Ennead, Ptah, Maʻat, and the Duat form a layered architecture of emergence, speech, order, renewal, and responsibility.',
      pathways: [
        'Trace one movement from hidden potential into named order without treating darkness as absence.',
        'Compare Heliopolitan, Hermopolitan, and Memphite creation as complementary lenses rather than contradictions.',
        'Apply multi-origin relational discernment by holding two valid origin accounts together without forcing one to erase the other.'
      ]
    },
    'ke-nun': {
      movement: 'Holding Primordial Potential',
      crisis: 'Reducing Nun to emptiness erases the Kemetic understanding of fertile potential and cyclical renewal.',
      intelligence: 'potential literacy',
      continuity: 'This lesson grounds the sequence: before order, there is charged depth that remains active in every cycle.',
      pathways: [
        'Track how modern institutions confuse emptiness with potential and identify one area where fertile groundwork is being ignored.',
        'Apply potential literacy to planning by naming what must be protected before visible outputs appear.',
        'Map how flood, recession, and renewal cycles still shape contemporary ecological and social systems.'
      ]
    },
    'ke-ennead': {
      movement: 'Differentiating Through Principle Pairs',
      crisis: 'Treating the Ennead as a pantheon list instead of a process model hides the logic of complementary emergence.',
      intelligence: 'paired-force discernment',
      continuity: 'This stage translates primordial depth into patterned differentiation through interdependent principles.',
      pathways: [
        'Identify one policy, family, or organizational tension that needs complementary balancing rather than winner-take-all logic.',
        'Use paired-force discernment to name what each side contributes to long-term order.',
        'Trace how unresolved pairing tensions become structural instability over time.'
      ]
    },
    'ke-ptah': {
      movement: 'Bringing Thought into Form Through Word',
      crisis: 'If speech is treated as neutral, language can generate disorder rather than ordered reality.',
      intelligence: 'speech-responsibility',
      continuity: 'Memphite theology deepens the sequence by showing creation as intentional thought enacted through disciplined naming.',
      pathways: [
        'Audit one sphere of language in your context where naming is currently producing confusion or harm.',
        'Apply speech-responsibility by defining one phrase or policy term with precision and ethical intent.',
        'Track how language choices alter trust, coordination, and collective direction.'
      ]
    },
    'ke-duat': {
      movement: 'Crossing Night Toward Renewal',
      crisis: 'Treating the Duat as superstition hides its disciplined model of transformation through trial.',
      intelligence: 'transformational endurance',
      continuity: 'This lesson carries Maʻat into liminal space where renewal is earned through passage, not granted automatically.',
      pathways: [
        'Map one ongoing transition where endurance and ethical navigation matter more than speed.',
        'Define what must be released and what must be preserved during your current night-journey phase.',
        'Practice transformational endurance by setting one recurring ritual that stabilizes passage.'
      ]
    },
    'ke-maat': {
      movement: 'Balancing Cosmic and Social Order',
      crisis: 'When Maʻat is reduced to morality slogans, systemic justice and ecological accountability disappear.',
      intelligence: 'integrated justice reasoning',
      continuity: 'Maʻat converts cosmology into lived ethics across person, polity, ecology, and afterlife orientation.',
      pathways: [
        'Identify one area where truth, justice, and ecology are being separated and integrate them into one accountability frame.',
        'Apply integrated justice reasoning to one real conflict and document the tradeoffs clearly.',
        'Trace how small ethical distortions scale into institutional disorder.'
      ]
    },
    'ke-maat-politics': {
      movement: 'Submitting Rule to Principle',
      crisis: 'When rulers claim to define truth, principle is inverted and governance becomes extraction.',
      intelligence: 'principle-first governance',
      continuity: 'This lesson extends Maʻat by insisting authority remains accountable to a prior ethical order.',
      pathways: [
        'Assess one leadership structure in your context and identify whether principle serves power or power serves principle.',
        'Design one governance safeguard that protects ethical order from personality capture.',
        'Track how humility practices alter leadership legitimacy over time.'
      ]
    },
    'ke-medunetjer': {
      movement: 'Encoding Reality in Sacred Sign',
      crisis: 'Reducing medu netjer to decorative script severs language from memory, power, and continuity.',
      intelligence: 'symbolic precision',
      continuity: 'Writing becomes a technology of continuity: recording thought, law, ritual, and identity across millennia.',
      pathways: [
        'Identify one modern communication channel where symbolic precision has degraded and causes recurring misunderstanding.',
        'Apply symbolic precision by redesigning one message for clarity, memory, and consequence.',
        'Trace what is lost when a culture cannot read its own archive.'
      ]
    },
    'ke-medicine': {
      movement: 'Healing Through Integrated Order',
      crisis: 'Splitting body and spirit frameworks can produce treatment without restoration of balance.',
      intelligence: 'whole-system healing logic',
      continuity: 'Kemetic medicine carries Maʻat into diagnosis and care, integrating procedure, remedy, and ethical orientation.',
      pathways: [
        'Map one health challenge using physical, relational, and structural factors instead of a single-cause model.',
        'Apply whole-system healing logic by identifying one preventive intervention and one restorative intervention together.',
        'Track how ethical conditions shape health outcomes in your community context.'
      ]
    },
    'ke-seshat': {
      movement: 'Measuring to Sustain Civilization',
      crisis: 'When measurement is detached from meaning, data can optimize harm instead of order.',
      intelligence: 'meaningful measurement',
      continuity: 'Seshat ties writing, architecture, and recordkeeping into a civilizational memory infrastructure.',
      pathways: [
        'Audit one metric system in your work/community and identify what important reality it currently excludes.',
        'Redesign one measure so it reflects long-term stability rather than short-term output only.',
        'Track how better records improve accountability across generations.'
      ]
    },
    'ke-nile-stars': {
      movement: 'Synchronizing Earth Cycles and Sky Time',
      crisis: 'Ignoring seasonal and celestial timing breaks planning, storage, and collective resilience.',
      intelligence: 'temporal alignment',
      continuity: 'This lesson aligns cosmology and agriculture through calendar intelligence and environmental observation.',
      pathways: [
        'Map one recurring cycle in your context and align planning to cycle reality rather than arbitrary deadlines.',
        'Apply temporal alignment by setting one decision checkpoint to seasonal indicators.',
        'Track the cost of mistimed coordination across one full cycle.'
      ]
    }
  };

  const KEMET_CREATION_DEEP_STUDIES = {
    'ke-creation-deep': {
      title: 'Kemetic Creation Deep Study',
      subtitle: 'Nun, the First Mound, Atum, the Ogdoad, the Ennead, Ptah, and Maʻat',
      sourceNote: 'Primary witnesses include the Pyramid Texts, Coffin Texts, Memphite Theology / Shabaka Stone tradition, and later temple cosmologies. The lesson reads these as related creation architectures, not as one flattened story.',
      sources: [
        {
          label: 'Pyramid Texts · Atum emerging from Nun',
          body: 'Atum comes into being upon Nun before sky, earth, and ordered ground have fully appeared. The source language frames creation as emergence from primordial waters, not creation from emptiness.'
        },
        {
          label: 'Coffin Texts · self-creation and the first gods',
          body: 'Atum is remembered as the one who brings forth Shu and Tefnut, the first differentiated pair. The creator is complete, but creation becomes visible through relation.'
        },
        {
          label: 'Memphite Theology · heart and tongue',
          body: 'Ptah creates through heart and tongue: conception, naming, and spoken articulation. Thought becomes world through disciplined speech.'
        }
      ],
      sequence: [
        ['Nun', 'The dark primordial waters, not empty but full of unformed potential.'],
        ['Hidden conditions', 'The Ogdoad names pre-creation qualities: water, limitlessness, darkness, and hiddenness.'],
        ['First mound', 'The benben or primeval mound rises as the first stable place where form can stand.'],
        ['Atum', 'Self-conscious completeness emerges and begins differentiation.'],
        ['Shu and Tefnut', 'Air/space and moisture appear as the first relational pair.'],
        ['Geb and Nut', 'Earth and sky are separated so the living world can unfold between them.'],
        ['Osiris, Isis, Set, Nephthys', 'Life, death, disruption, magic, restoration, and social drama enter the cosmic field.'],
        ['Ptah', 'Creation is understood as thought shaped by speech, craft, and naming.'],
        ['Maʻat', 'Creation must be maintained through truth, balance, justice, and right relation.']
      ],
      parallels: [
        ['Pō / Nun', 'Both traditions refuse to treat darkness as mere absence. Darkness/depth is generative. Difference remains: Pō is embedded in Hawaiian genealogy and chant sequence; Nun is the primordial water condition in Kemetic cosmology.'],
        ['Birth sequence / divine differentiation', 'The Kumulipo unfolds through birth lines; Kemet often unfolds through divine principles, paired forces, and temple-specific creation accounts.'],
        ['Chant / word', 'The Kumulipo preserves creation through genealogical chant. Memphite theology emphasizes heart and tongue as creation through thought and speech. Both honor language as world-shaping, but through distinct protocols.'],
        ['Kuleana / Maʻat', 'Both frameworks connect origin to responsibility. Kumulipo binds humans into genealogy and kuleana; Kemet binds creation into Maʻat and the ongoing maintenance of order.']
      ],
      misreadings: [
        'Do not reduce Nun to empty nothingness.',
        'Do not read the Ogdoad, Ennead, and Ptah traditions as contradictions that cancel each other.',
        'Do not treat Kemetic creation as a simple list of gods.',
        'Do not use Kumulipo parallels to claim sameness or replacement.',
        'Do not remove Maʻat from creation; order must be maintained after emergence.'
      ]
    },
    'ke-nun': {
      title: 'Nun Deep Study',
      subtitle: 'Primordial Waters Before Ordered Form',
      sourceNote: 'Read Nun as fertile depth, not as emptiness. The created world emerges from a charged condition that remains around and beneath creation.',
      sources: [
        {
          label: 'Pyramid Texts · before sky and earth',
          body: 'The source tradition places Atum/Re in a time before sky and earth were established, locating creation in a pre-ordered watery depth.'
        },
        {
          label: 'Coffin Texts · boundless waters',
          body: 'The creator identifies with the waters and with self-limitation. Creation begins when boundlessness takes form.'
        }
      ],
      sequence: [
        ['Dark water', 'The first condition is not a blank void but the deep medium of all possibility.'],
        ['Undifferentiated stillness', 'No firm earth, no separated sky, no stable direction, no visible light; everything is latent.'],
        ['Hidden qualities', 'The Ogdoad names water, limitlessness, darkness, and hiddenness as living preconditions.'],
        ['Self-awareness', 'Atum becomes conscious within Nun.'],
        ['First standing place', 'The mound gives creation a place to appear.'],
        ['First pair', 'Shu and Tefnut begin the relational unfolding of world.'],
        ['Continuing depth', 'Nun remains around and beneath creation, returning ritually in flood, night, death, and renewal.']
      ],
      parallels: [
        ['Pō and Nun', 'Both are source-depths. Pō is Hawaiian generative darkness within genealogy; Nun is Kemetic primordial water before ordered creation.'],
        ['Oceanic emergence', 'Both traditions use depth as a way to think origin, but each belongs to its own land, language, and ritual world.'],
        ['Po / Pō / Nun', 'Dogon Po, Hawaiian Pō, and Kemetic Nun can be placed in careful dialogue as hidden generative conditions, while avoiding claims that they are the same term or tradition.']
      ],
      misreadings: [
        'Do not translate Nun as nothing.',
        'Do not make Atum an external maker standing outside creation.',
        'Do not forget that Nun remains present after creation as surrounding depth and renewal.',
        'Do not let Manly P. Hall or later esoteric summaries replace Egyptian primary witnesses; use them only as secondary interpretive lenses.'
      ]
    },
    'ke-ennead': {
      title: 'Ennead Deep Study',
      subtitle: 'Nine Principles of Differentiation and Relation',
      sourceNote: 'The Heliopolitan Ennead is best read as a process model: reality differentiates through paired principles and relational tension.',
      sources: [
        {
          label: 'Heliopolitan tradition · Atum and the nine',
          body: 'Atum generates the first pair, Shu and Tefnut; from them come Geb and Nut; from earth and sky come Osiris, Isis, Set, and Nephthys.'
        }
      ],
      sequence: [
        ['Atum', 'Completeness becomes the source of differentiation.'],
        ['Shu and Tefnut', 'Air/space and moisture make life possible.'],
        ['Geb and Nut', 'Earth and sky are separated into a livable field.'],
        ['Osiris and Isis', 'Regeneration, kingship, healing, and restoration enter the story.'],
        ['Set and Nephthys', 'Disruption, edge, desert, hiddenness, and protection of the dead complete the field.']
      ],
      parallels: [
        ['Genealogy and principle', 'The Kumulipo names births in chant sequence; the Ennead names divine principles in a creation genealogy.'],
        ['Difference without separation', 'Both systems show many forms emerging without severing connection to source.']
      ],
      misreadings: [
        'Do not treat the Ennead as a random pantheon list.',
        'Do not make Set simply evil; disruption has a place in the ordered field.',
        'Do not miss the paired-force logic.'
      ]
    },
    'ke-ptah': {
      title: 'Ptah Deep Study',
      subtitle: 'Creation Through Heart, Tongue, Craft, and Name',
      sourceNote: 'The Memphite Theology frames creation as intelligence articulated: heart conceives, tongue speaks, and form becomes established.',
      sources: [
        {
          label: 'Memphite Theology / Shabaka Stone tradition',
          body: 'Ptah is associated with heart and tongue. The names of things are pronounced, and through naming the ordered world becomes effective.'
        }
      ],
      sequence: [
        ['Heart', 'Conception, intention, and inner design.'],
        ['Tongue', 'Speech, naming, and activation.'],
        ['Craft', 'The world is shaped like a made and measured work.'],
        ['Name', 'To name something is to stabilize its place in reality.'],
        ['Maʻat', 'Speech must sustain order rather than disorder.']
      ],
      parallels: [
        ['Chant and speech', 'The Kumulipo carries origin through chant; Ptah creates through articulated thought and word. Both honor language as generative.'],
        ['Name and relation', 'Both systems treat naming as placement within a larger order, not as a decorative label.']
      ],
      misreadings: [
        'Do not treat speech as neutral.',
        'Do not reduce Ptah to a craftsman only; craft here is cosmological intelligence.',
        'Do not separate word from ethical consequence.'
      ]
    }
  };

  function buildKemetCreationDeepStudy(lesson) {
    const study = KEMET_CREATION_DEEP_STUDIES[lesson.id];
    if (!study) return '';

    const sourceBlocks = study.sources.map(source => `
      <article class="kumu-wa-panel">
        <div class="kumu-wa-panel__body">
          <p class="kumu-wa-panel__kicker">${source.label}</p>
          <p>${source.body}</p>
        </div>
      </article>
    `).join('');

    const sequenceRows = study.sequence.map(([term, meaning]) => `
      <tr>
        <td><strong>${term}</strong></td>
        <td>${meaning}</td>
      </tr>
    `).join('');

    const parallelRows = study.parallels.map(([term, meaning]) => `
      <tr>
        <td><strong>${term}</strong></td>
        <td>${meaning}</td>
      </tr>
    `).join('');

    const misreadings = study.misreadings.map(item => `<li>${item}</li>`).join('');

    return `
      <section class="kumu-section kumu-section--compact kumu-wa-chant-card kumu-wa-chant-card--primary kumu-reveal is-visible">
        <h4>${study.title}</h4>
        <p class="kumu-wa-source-meta">
          <span>Primary sources first</span>
          <span>Kemetic creation architecture</span>
          <span>Careful Kumulipo dialogue</span>
        </p>
        <p class="lead">${study.subtitle}</p>
        <p>${study.sourceNote}</p>
      </section>

      <section class="kumu-section kumu-section--compact kumu-reveal is-visible">
        <h4>Primary Creation Witnesses</h4>
        <p class="kumu-wa-provenance">These are short source-grounded orientation notes, not replacements for the original Kemetic texts or specialist translations.</p>
        <div class="kumu-wa-accordion">
          ${sourceBlocks}
        </div>
      </section>

      <section class="kumu-section kumu-section--compact kumu-reveal is-visible">
        <h4>Creation Sequence</h4>
        <table class="kumu-wa-table">
          <thead>
            <tr><th>Moment</th><th>Meaning</th></tr>
          </thead>
          <tbody>${sequenceRows}</tbody>
        </table>
      </section>

      <section class="kumu-section kumu-section--compact kumu-reveal is-visible">
        <h4>Kumulipo Dialogue · Similarity Without Collapse</h4>
        <table class="kumu-wa-table">
          <thead>
            <tr><th>Resonance</th><th>Boundary</th></tr>
          </thead>
          <tbody>${parallelRows}</tbody>
        </table>
        <p class="kumu-wa-provenance">Bridge protocol: parallels help us see shared human inquiry into darkness, water, birth, word, order, and responsibility. They do not make Kemet and Kumulipo the same tradition.</p>
      </section>

      <section class="kumu-section kumu-section--compact kumu-section--quiet kumu-reveal is-visible">
        <details>
          <summary>Reading Cautions</summary>
          <ul>${misreadings}</ul>
        </details>
      </section>
    `;
  }

  function buildKemetDeepScaffold(lesson) {
    const creationDeepStudy = buildKemetCreationDeepStudy(lesson);
    const meta = KEMET_DEEP_FRAMEWORK[lesson.id] || {
      movement: 'Interpreting Through Kemetic Relational Logic',
      crisis: 'Flattening this lesson into trivia obscures its civilizational intelligence and practical implications.',
      intelligence: 'contextual discernment',
      continuity: 'This lesson should be read as part of a coherent Kemetic architecture linking cosmology, ethics, knowledge, and governance.',
      pathways: [
        'Identify one practical domain where this lesson offers clearer orientation than default modern assumptions.',
        'Apply the lesson intelligence in one concrete decision and document consequence.',
        'Track what changes when relation and responsibility are centered.'
      ]
    };

    const pathways = (meta.pathways || [])
      .map(item => `<li>${item}</li>`)
      .join('');

    return `
      ${creationDeepStudy}

      <section class="kumu-section kumu-section--compact kumu-kemet-afterword kumu-reveal is-visible">
        <h4>Knowledge Integration</h4>
        <div class="kumu-kemet-afterword__grid">
          <p><span class="kumu-wa-source-tag">Movement</span> ${meta.movement}</p>
          <p><span class="kumu-wa-source-tag">Practice</span> ${meta.intelligence}</p>
          <p><span class="kumu-wa-source-tag">Continuity</span> ${meta.continuity}</p>
        </div>
        ${pathways ? `<details class="kumu-kemet-afterword__details"><summary>Deepen Practice</summary><ul>${pathways}</ul></details>` : ''}
      </section>
    `;
  }

  const MAORI_DEEP_FRAMEWORK = {
    'mi-te-po': {
      movement: 'moving from hidden potential into the world of light',
      source: 'Te Kore and Te Pō are treated as generative conditions, not empty absence.',
      practice: 'Protect unseen preparation before demanding visible outcome.',
      continuity: 'This prepares Ranginui and Papatūānuku by showing that light emerges from layered darkness.'
    },
    'mi-rangi-papa': {
      movement: 'creating breathable space through relational separation',
      source: 'Ranginui and Papatūānuku remain parents after separation; creation carries love, grief, and consequence.',
      practice: 'Make space without erasing relation.',
      continuity: 'This opens Te Ao Mārama and places atua domains into active kinship.'
    },
    'mi-whakapapa': {
      movement: 'ordering knowledge through layered relation',
      source: 'Whakapapa places beings, places, atua, and obligations into sequence and kinship.',
      practice: 'Ask what responsibility follows from every relationship named.',
      continuity: 'This carries creation into land, identity, governance, ecology, and conduct.'
    },
    'mi-hineahuone': {
      movement: 'bringing human life from earth, breath, and sacred relation',
      source: 'Hineahuone grounds human emergence in whenua, Kurawaka, and the life-giving breath.',
      practice: 'Treat humanity as earth-born kin rather than separate owner.',
      continuity: 'This carries whakapapa into human embodiment and prepares the boundary teachings of Hine-tītama.'
    },
    'mi-hinetitama': {
      movement: 'transforming dawn into the night that receives descendants',
      source: 'Hine-tītama becomes Hine-nui-te-pō, making death part of relation rather than meaningless absence.',
      practice: 'Honor truth, boundary, grief, and return as part of living knowledge.',
      continuity: 'This returns the creation arc to Te Pō and prepares Māui by marking the sacred limit he cannot conquer.'
    },
    'mi-maui': {
      movement: 'reshaping the world so life can continue within limits',
      source: 'Māui slows the sun, seeks fire, fishes up land, and meets the boundary of death.',
      practice: 'Use cleverness in service of community continuity, not unchecked conquest.',
      continuity: 'This shows creation continuing through culture hero action while staying accountable to Hine-nui-te-pō.'
    },
    'mi-kaitiakitanga': {
      movement: 'turning creation genealogy into present-day responsibility',
      source: 'Kaitiakitanga arises because whenua, atua, ancestors, waters, forests, and people remain related.',
      practice: 'Judge decisions by mauri, whakapapa, and long-term relational consequence.',
      continuity: 'This completes the Māori creation arc by moving from origin knowledge into lived care.'
    }
  };

  const CREATION_ARCS = {
    kanaka: {
      title: 'Kumulipo Creation Arc',
      subtitle: 'Sixteen Wā as one living genealogy from Pō into kuleana.',
      note: 'This arc is an orientation map. The chant and Wā pages remain the primary pathway.',
      items: [
        ['Pō', 'Deep generative darkness'],
        ['Kumulipo', 'Source genealogy begins'],
        ['Koʻa', 'Coral and first sea forms'],
        ['Kai', 'Marine multiplicity'],
        ['Manu', 'Flight and boundary crossing'],
        ['Kānaka', 'Human lines emerge'],
        ['Hāloa', 'Land, kalo, and people bound together'],
        ['Kuleana', 'Genealogy becomes responsibility']
      ],
      bridgesTitle: 'Polynesian Resonance Cards',
      bridges: [
        ['Kumulipo Pō', 'Māori Te Pō', 'Both hold darkness as generative depth, not emptiness. Keep each chant genealogy distinct.'],
        ['Hāloa', 'Hineahuone / whenua', 'Both ground human life in land-body relation. They are resonant, not interchangeable.'],
        ['Māui in Hawaiʻi', 'Māui in Aotearoa', 'A shared Polynesian figure appears through different place names, deeds, and local meanings.'],
        ['Kuleana', 'Kaitiakitanga', 'Both move knowledge into obligation and care, each through its own language and protocol.']
      ]
    },
    maori: {
      title: 'Māori Creation Arc',
      subtitle: 'Te Kore, Te Pō, Te Ao Mārama, and responsibility as one unfolding sequence.',
      note: 'Many iwi and hapū hold specific versions. This map is a public learning compass, not a replacement for local whakapapa.',
      items: [
        ['Te Kore', 'Potential before visible form'],
        ['Te Pō', 'Generative night and becoming'],
        ['Rangi / Papa', 'Sky and earth held close'],
        ['Tāne', 'Separation opens Te Ao Mārama'],
        ['Hineahuone', 'Human life from earth and breath'],
        ['Hine-nui-te-pō', 'Death, boundary, and return'],
        ['Māui', 'World-shaping within sacred limits'],
        ['Kaitiakitanga', 'Creation becomes lived responsibility']
      ],
      bridgesTitle: 'Kumulipo Resonance Cards',
      bridges: [
        ['Te Pō', 'Kumulipo Pō', 'Both name darkness as origin-depth and generative condition, not a void to escape.'],
        ['Hineahuone / whenua', 'Hāloa', 'Both teach that human life is inseparable from land, body, birth, and obligation.'],
        ['Māui in Aotearoa', 'Māui in Hawaiʻi', 'The figure travels across Polynesia, but each place keeps its own story authority.'],
        ['Kaitiakitanga', 'Kuleana', 'Both insist relation must become conduct, restraint, and care for living systems.']
      ]
    }
  };

  const DREAMTIME_DEEP_FRAMEWORK = {
    'dt-songlines-intro': {
      movement: 'reading story as map, law, memory, and living relation',
      source: 'Songlines are held through Country, language, performance, and custodial responsibility.',
      practice: 'Treat story as situated knowledge rather than extractable content.',
      continuity: 'This opens the Dreamtime arc by showing how place and memory are sung into relation.'
    },
    'dt-celestial-navigation': {
      movement: 'reading sky and Country as one navigational field',
      source: 'Star knowledge can hold direction, season, ceremony, and ecological timing.',
      practice: 'Connect observation to responsibility before turning it into data.',
      continuity: 'This carries Songlines into the night sky and prepares the Seven Sisters and Emu in the Sky lessons.'
    },
    'dt-country-consciousness': {
      movement: 'recognizing Country as living relation rather than background space',
      source: 'Country includes land, water, sky, beings, ancestors, language, and living community.',
      practice: 'Ask what Country needs protected, repaired, or renewed.',
      continuity: 'This grounds every Dreamtime lesson in reciprocal obligation.'
    },
    'dt-protocol-country': {
      movement: 'placing protocol before access',
      source: 'Dreaming knowledge is nation-specific, place-based, and sometimes restricted.',
      practice: 'Let custodianship define what can be learned, shared, or left alone.',
      continuity: 'This protects the whole Dreamtime pathway from becoming generic content.'
    },
    'dt-seven-sisters': {
      movement: 'following a Songline across sky, Country, and custodial difference',
      source: 'Seven Sisters traditions show connection without making knowledge ownerless.',
      practice: 'Honor shared pathways through specific authority and place.',
      continuity: 'This deepens celestial Songlines through one public orientation example.'
    },
    'dt-emu-sky': {
      movement: 'learning to read dark pattern as knowledge',
      source: 'The Emu in the Sky is seen in dark Milky Way forms and linked in public accounts to seasonal intelligence.',
      practice: 'Train attention to shadow, timing, and negative space.',
      continuity: 'This returns darkness to the center as a teacher, not an absence.'
    },
    'dt-care-country': {
      movement: 'turning Dreaming knowledge into care for Country',
      source: 'Knowledge is complete only when it protects living place, language, memory, and relation.',
      practice: 'Move from fascination to protection, repair, and accountable conduct.',
      continuity: 'This completes the arc by making learning visible as obligation.'
    },
    'dt-nations-map': {
      movement: 'refusing to flatten many Countries into one generic category',
      source: 'AIATSIS maps hundreds of Aboriginal and Torres Strait Islander language, social, and nation groups.',
      practice: 'Name plurality, then seek local community authority for place-specific learning.',
      continuity: 'This keeps the whole Dreamtime section accountable to many Nations, languages, and custodians.'
    }
  };

  function buildDreamtimeDeepScaffold(lesson) {
    const meta = DREAMTIME_DEEP_FRAMEWORK[lesson.id];
    if (!meta) return '';

    return `
      <section class="kumu-section kumu-section--compact kumu-kemet-afterword kumu-reveal is-visible">
        <h4>Dreamtime Knowledge Integration</h4>
        <div class="kumu-kemet-afterword__grid">
          <p><span class="kumu-wa-source-tag">Movement</span> ${meta.movement}</p>
          <p><span class="kumu-wa-source-tag">Protocol Ground</span> ${meta.source}</p>
          <p><span class="kumu-wa-source-tag">Practice</span> ${meta.practice}</p>
        </div>
        <p class="kumu-wa-provenance">${meta.continuity}</p>
      </section>
    `;
  }

  function buildCreationArcView(lesson) {
    const arc = CREATION_ARCS[lesson.cultureId];
    if (!arc) return '';
    if (lesson.cultureId === 'kanaka' && lesson.id !== 'km-kumulipo' && !lesson.id.startsWith('km-wa-')) return '';
    if (lesson.cultureId === 'maori' && !lesson.id.startsWith('mi-')) return '';

    const activeTitle = lesson.id.startsWith('mi-')
      ? MAORI_DEEP_FRAMEWORK[lesson.id]?.movement || lesson.title
      : lesson.id.startsWith('km-wa-') || lesson.id === 'km-kumulipo'
        ? lesson.title
        : '';

    const steps = arc.items.map(([label, detail], index) => {
      const isActive = activeTitle && (
        activeTitle.toLowerCase().includes(label.toLowerCase()) ||
        lesson.title.toLowerCase().includes(label.toLowerCase())
      );

      return `
        <li class="cv-creation-arc__step${isActive ? ' is-active' : ''}">
          <span class="cv-creation-arc__index">${String(index + 1).padStart(2, '0')}</span>
          <span class="cv-creation-arc__label">${escapeHTML(label)}</span>
          <span class="cv-creation-arc__detail">${escapeHTML(detail)}</span>
        </li>
      `;
    }).join('');

    const bridges = arc.bridges.map(([left, right, meaning]) => `
      <article class="cv-resonance-card">
        <div class="cv-resonance-card__pair">
          <span>${escapeHTML(left)}</span>
          <i class="fas fa-arrows-left-right" aria-hidden="true"></i>
          <span>${escapeHTML(right)}</span>
        </div>
        <p>${escapeHTML(meaning)}</p>
      </article>
    `).join('');

    return `
      <section class="cv-creation-arc kumu-reveal is-visible" aria-label="${escapeAttr(arc.title)}">
        <div class="cv-creation-arc__header">
          <p class="cv-creation-arc__eyebrow">${escapeHTML(lesson.cultureName || 'Creation')}</p>
          <h4>${escapeHTML(arc.title)}</h4>
          <p>${escapeHTML(arc.subtitle)}</p>
        </div>
        <ol class="cv-creation-arc__rail">
          ${steps}
        </ol>
        <p class="cv-creation-arc__note">${escapeHTML(arc.note)}</p>
        <div class="cv-resonance">
          <h5>${escapeHTML(arc.bridgesTitle)}</h5>
          <div class="cv-resonance__grid">
            ${bridges}
          </div>
          <p class="cv-creation-arc__note">Bridge protocol: these are careful Polynesian resonances. They help pattern recognition without collapsing languages, lands, genealogies, or living authorities into one story.</p>
        </div>
      </section>
    `;
  }

  function buildMaoriDeepScaffold(lesson) {
    const meta = MAORI_DEEP_FRAMEWORK[lesson.id];
    if (!meta) return '';

    return `
      <section class="kumu-section kumu-section--compact kumu-kemet-afterword kumu-reveal is-visible">
        <h4>Māori Knowledge Integration</h4>
        <div class="kumu-kemet-afterword__grid">
          <p><span class="kumu-wa-source-tag">Movement</span> ${meta.movement}</p>
          <p><span class="kumu-wa-source-tag">Source Ground</span> ${meta.source}</p>
          <p><span class="kumu-wa-source-tag">Practice</span> ${meta.practice}</p>
        </div>
        <p class="kumu-wa-provenance">${meta.continuity}</p>
      </section>
    `;
  }

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
    readProgress: readJSON(READ_PROGRESS_KEY, {}),
    reflections: readJSON(REFLECTIONS_KEY, {}),
    suppressReadProgress: false,
    sidebarSearch: '',
    openCultures: new Set(),
    closedCultures: new Set()
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

  function getBookmarks() {
    return readJSON(BOOKMARKS_KEY, []);
  }

  function isBookmarked(lessonId) {
    return getBookmarks().includes(lessonId);
  }

  function toggleBookmark(lessonId) {
    const bookmarks = getBookmarks();
    const idx = bookmarks.indexOf(lessonId);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.unshift(lessonId);
    }
    writeJSON(BOOKMARKS_KEY, bookmarks);
    const btn = document.querySelector(`[data-bookmark-lesson="${CSS.escape(lessonId)}"]`);
    if (btn) {
      const bookmarked = bookmarks.includes(lessonId);
      btn.classList.toggle('is-bookmarked', bookmarked);
      btn.title = bookmarked ? 'Remove bookmark' : 'Bookmark this lesson';
      btn.setAttribute('aria-pressed', bookmarked ? 'true' : 'false');
    }
    renderSidebarBookmarks();
    showToast(bookmarks.includes(lessonId) ? 'Lesson bookmarked.' : 'Bookmark removed.');
  }

  function renderSidebarBookmarks() {
    const panel = document.getElementById('lessonBookmarksPanel');
    if (!panel) return;
    const ids = getBookmarks();
    const lessons = ids.map(id => findLesson(id)).filter(Boolean);
    if (!lessons.length) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    panel.innerHTML = `
      <div class="cv-sidebar-bookmarks">
        <div class="cv-sidebar-bookmarks__heading">
          <i class="fas fa-bookmark" aria-hidden="true"></i>
          Bookmarks
        </div>
        ${lessons.map(lesson => `
          <div class="cv-sidebar-bookmark-item${lesson.id === state.activeLessonId ? ' is-active' : ''}">
            <button class="cv-sidebar-bookmark-item__nav" type="button" data-lesson-id="${escapeHTML(lesson.id)}">
              <span class="cv-sidebar-bookmark-item__emoji">${escapeHTML(lesson.cultureEmoji)}</span>
              <span class="cv-sidebar-bookmark-item__info">
                <span class="cv-sidebar-bookmark-item__title">${escapeHTML(lesson.title)}</span>
                <span class="cv-sidebar-bookmark-item__culture">${escapeHTML(lesson.cultureName)}</span>
              </span>
            </button>
            <button
              class="cv-sidebar-bookmark-item__remove"
              type="button"
              data-remove-bookmark="${escapeHTML(lesson.id)}"
              aria-label="Remove bookmark"
            ><i class="fas fa-xmark"></i></button>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ── Streak ──────────────────────────────────────────────────────── */

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function updateStreak() {
    const today = todayStr();
    const data = readJSON(STREAK_KEY, { lastDate: '', count: 0 });
    if (data.lastDate === today) return data.count;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    const newCount = data.lastDate === yStr ? data.count + 1 : 1;
    writeJSON(STREAK_KEY, { lastDate: today, count: newCount });
    return newCount;
  }

  function getStreak() {
    const data = readJSON(STREAK_KEY, { lastDate: '', count: 0 });
    const today = todayStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    return (data.lastDate === today || data.lastDate === yStr) ? data.count : 0;
  }

  /* ── Lesson notes ────────────────────────────────────────────────── */

  function renderLessonNotes(lesson) {
    const holder = document.getElementById('lessonNotes');
    if (!holder) return;
    const notes = readJSON(NOTES_KEY, {});
    const existing = notes[lesson.id] || '';
    holder.innerHTML = `
      <details class="cv-lesson-notes"${existing ? ' open' : ''}>
        <summary class="cv-lesson-notes__toggle">
          <i class="fas fa-pen-to-square" aria-hidden="true"></i>
          My Notes
          <span class="cv-lesson-notes__hint">${existing ? 'click to collapse' : 'click to open'}</span>
          <i class="fas fa-chevron-down cv-lesson-notes__arrow" aria-hidden="true"></i>
        </summary>
        <div class="cv-lesson-notes__body">
          <textarea
            class="cv-lesson-notes__textarea"
            id="lessonNotesTextarea"
            placeholder="Write your personal notes about this lesson…"
            rows="5"
          >${escapeHTML(existing)}</textarea>
          <div class="cv-lesson-notes__footer">
            <span class="cv-lesson-notes__status" id="lessonNotesStatus"></span>
            <button class="cv-lesson-notes__export-btn" type="button" data-export-reflections>
              <i class="fas fa-download" aria-hidden="true"></i>
              Export all reflections
            </button>
          </div>
        </div>
      </details>
    `;
    const textarea = holder.querySelector('#lessonNotesTextarea');
    if (textarea) {
      let saveTimer;
      textarea.addEventListener('input', () => {
        const allNotes = readJSON(NOTES_KEY, {});
        allNotes[lesson.id] = textarea.value;
        writeJSON(NOTES_KEY, allNotes);
        const status = document.getElementById('lessonNotesStatus');
        if (status) status.textContent = 'Saved';
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => { if (status) status.textContent = ''; }, 1800);
      });
    }
  }

  /* ── Featured lesson ─────────────────────────────────────────────── */

  function renderFeaturedLesson() {
    const holder = document.getElementById('lessonFeatured');
    if (!holder || !state.lessons.length) return;
    const dayIndex = Math.floor(Date.now() / 86400000);
    const lesson = state.lessons[dayIndex % state.lessons.length];
    const done = isCompleted(lesson.id);
    holder.hidden = false;
    holder.innerHTML = `
      <div class="cv-featured-lesson">
        <div class="cv-featured-lesson__label"><i class="fas fa-star" aria-hidden="true"></i> Featured today</div>
        <button class="cv-featured-lesson__card" type="button" data-lesson-id="${escapeHTML(lesson.id)}">
          <span class="cv-featured-lesson__emoji">${escapeHTML(lesson.cultureEmoji)}</span>
          <div class="cv-featured-lesson__info">
            <strong>${escapeHTML(lesson.title)}</strong>
            <small>${escapeHTML(lesson.cultureName)} · ${escapeHTML(lesson.readTime || 'Lesson')}</small>
          </div>
          ${done
            ? '<span class="cv-featured-lesson__done"><i class="fas fa-check-circle"></i></span>'
            : '<span class="cv-featured-lesson__arrow">→</span>'}
        </button>
      </div>
    `;
  }

  /* ── Reflection export ───────────────────────────────────────────── */

  function exportReflections() {
    const reflections = readJSON(REFLECTIONS_KEY, {});
    const ids = Object.keys(reflections);
    const filled = ids.filter(id => {
      const answers = reflections[id];
      return answers && Object.values(answers).some(v => String(v).trim());
    });

    if (!filled.length) {
      showToast('No reflections saved yet.');
      return;
    }

    const lines = [
      'Ka Paepae ʻIke Ola — Reflection Journal',
      `Exported: ${new Date().toLocaleDateString()}`,
      '═'.repeat(50),
      ''
    ];

    filled.forEach(id => {
      const lesson = findLesson(id);
      const answers = reflections[id];
      if (!lesson || !answers) return;
      lines.push(`${lesson.cultureEmoji} ${lesson.cultureName} · ${lesson.moduleTitle}`);
      lines.push(lesson.title);
      lines.push('─'.repeat(40));
      Object.values(answers).forEach(answer => {
        if (String(answer).trim()) lines.push('', String(answer).trim());
      });
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lkp-reflections-${todayStr()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Reflections exported.');
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
      const patched = window.LKPLessonOverrides
        ? window.LKPLessonOverrides.applyOverrides(data)
        : data;

      window.CULTURALVERSE_DATA = patched;
      window.LKP_DATA = patched;
      window.IKEVERSE_DATA = patched;
      return patched;
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

  const RESOLVED_IMAGE_CACHE = new Map();
  let heroResolveToken = 0;
  let stripResolveToken = 0;

  function resolveFirstExistingImage(url) {
    const cleaned = cleanAssetPath(url);
    if (!cleaned) return Promise.resolve('');

    if (RESOLVED_IMAGE_CACHE.has(cleaned)) {
      return RESOLVED_IMAGE_CACHE.get(cleaned);
    }

    const candidates = buildUrlCandidates(cleaned);

    const task = new Promise(resolve => {
      function tryNext(index) {
        if (index >= candidates.length) {
          resolve('');
          return;
        }

        const probe = new Image();
        probe.onload = () => resolve(candidates[index]);
        probe.onerror = () => tryNext(index + 1);
        probe.src = candidates[index];
      }

      tryNext(0);
    });

    RESOLVED_IMAGE_CACHE.set(cleaned, task);
    return task;
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

    const token = ++heroResolveToken;

    const img = getHeroImage(lesson);

    if (!img || img.placeholder || !img.url) {
      applyPlaceholder(hero, lesson, img);
      return;
    }

    applyPlaceholder(hero, lesson, img, true);

    resolveFirstExistingImage(img.url).then(found => {
      if (token !== heroResolveToken || state.activeLessonId !== lesson.id) return;

      if (!found) {
        applyPlaceholder(hero, lesson, img);
        console.warn('[LKP Hero] No image found for', lesson.id, '— base:', img.url);
        return;
      }

      applyRealHero(hero, {
        ...img,
        url: found
      });

      syncHeroLightbox();
    });
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
    syncHeroLightbox();
  }

  function syncHeroLightbox() {
    const hero = document.getElementById('cultureHero');
    const lightboxImage = document.getElementById('heroLightboxImage');
    const lightboxCaption = document.getElementById('heroLightboxCaption');
    if (!hero || !lightboxImage || !lightboxCaption) return;

    lightboxImage.style.backgroundImage = hero.style.backgroundImage || '';
    lightboxImage.style.backgroundPosition = hero.style.backgroundPosition || 'center center';

    const credit = hero.querySelector('.cv-hero-credit')?.textContent?.trim() || '';
    lightboxCaption.textContent = credit || 'Lesson artwork';
  }

  function openHeroLightbox() {
    const lightbox = document.getElementById('heroLightbox');
    if (!lightbox) return;
    syncHeroLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-hero-lightbox-open');
  }

  function closeHeroLightbox() {
    const lightbox = document.getElementById('heroLightbox');
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-hero-lightbox-open');
  }

  function normalizeSources(raw) {
    if (!Array.isArray(raw)) return [];

    function inferSourceMeta(source) {
      const hint = `${source.label || ''} ${source.note || ''} ${source.url || ''}`.toLowerCase();
      const explicitType = String(source.sourceType || source.type || '').trim().toLowerCase();
      const explicitConfidence = String(source.sourceConfidence || source.confidence || '').trim().toLowerCase();

      let sourceType = explicitType;
      if (!sourceType) {
        if (/oral|chant|moolelo|mo'olelo|genealogy|kupuna/.test(hint)) sourceType = 'oral tradition';
        else if (/papyrus|manuscript|inscription|tablet|archive/.test(hint)) sourceType = 'primary text';
        else if (/journal|press|doi|edu\b|research|article|study/.test(hint)) sourceType = 'research';
        else if (/museum|artifact|archaeolog|excavat/.test(hint)) sourceType = 'archaeological';
        else sourceType = 'reference';
      }

      let sourceConfidence = explicitConfidence;
      if (!sourceConfidence) {
        if (/primary|archive|inscription|papyrus|peer review|doi|journal/.test(hint)) sourceConfidence = 'high confidence';
        else if (/oral|tradition|community|interpret/.test(hint)) sourceConfidence = 'context-based';
        else sourceConfidence = 'moderate confidence';
      }

      return { sourceType, sourceConfidence };
    }

    return raw.map(source => {
      if (typeof source === 'string') {
        return {
          label: source,
          url: '',
          note: '',
          sourceType: 'reference',
          sourceConfidence: 'moderate confidence'
        };
      }

      const normalized = {
        label: source.label || source.title || source.name || '',
        url: source.url || source.href || '',
        note: source.note || source.desc || ''
      };

      const meta = inferSourceMeta({
        ...normalized,
        type: source.type,
        sourceType: source.sourceType,
        confidence: source.confidence,
        sourceConfidence: source.sourceConfidence
      });

      return {
        ...normalized,
        sourceType: meta.sourceType,
        sourceConfidence: meta.sourceConfidence
      };
    }).filter(source => source.label);
  }

  function getLessonConceptChips(lesson) {
    const fromTag = [];
    const match = String(lesson.content || '').match(/<concepts>([\s\S]*?)<\/concepts>/i);

    if (match) {
      match[1]
        .split('·')
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => fromTag.push(item));
    }

    if (fromTag.length) {
      return [...new Set(fromTag)].slice(0, 8);
    }

    const cleanTitleWords = String(lesson.title || '')
      .split(/\s+/)
      .map(word => word.trim())
      .filter(word => word.length >= 4 && !/^the$/i.test(word));

    return [...new Set(cleanTitleWords)].slice(0, 6);
  }

  function normalizeConnections(raw) {
    if (!Array.isArray(raw)) return [];

    return raw.map(item => {
      if (typeof item === 'string') {
        return {
          cultureId: item,
          lessonId: '',
          label: '',
          note: '',
          axis: '',
          url: ''
        };
      }

      return {
        cultureId: item.cultureId || item.culture || '',
        lessonId: item.lessonId || item.lesson || '',
        label: item.label || item.title || '',
        note: item.note || item.desc || '',
        axis: item.axis || item.theme || '',
        url: item.url || item.href || ''
      };
    }).filter(item => item.cultureId || item.lessonId || item.url);
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
                  connections: normalizeConnections(lesson.connections || lesson.bridges || []),
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

  function getLessonReadProgress(lessonId) {
    const value = Number(state.readProgress?.[lessonId] || 0);
    return Math.max(0, Math.min(100, Math.round(value) || 0));
  }

  function getCurrentPageReadProgress() {
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (max <= 0) return 100;

    return Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100)));
  }

  function setLessonReadProgress(lessonId, value) {
    if (!lessonId) return 0;

    const current = getLessonReadProgress(lessonId);
    const next = Math.max(current, Math.max(0, Math.min(100, Math.round(Number(value) || 0))));

    if (next !== current) {
      state.readProgress[lessonId] = next;
      writeJSON(READ_PROGRESS_KEY, state.readProgress);
    }

    return next;
  }

  function hasReflection(lessonId) {
    const refs = state.reflections[lessonId] || {};
    return Object.values(refs).some(v => String(v || '').trim().length > 0);
  }

  function canCompleteLesson(lesson) {
    if (!lesson?.id) return false;
    if (isCompleted(lesson.id)) return true;
    return getLessonReadProgress(lesson.id) >= COMPLETION_REQUIRED_PROGRESS
      && hasReflection(lesson.id);
  }

  function updateLessonReadProgress(options = {}) {
    const fill = document.getElementById('progressFill');
    const percent = getCurrentPageReadProgress();

    if (fill) {
      fill.style.width = `${percent}%`;
    }

    if (!state.activeLessonId || state.suppressReadProgress) return percent;

    const stored = options.write === false
      ? getLessonReadProgress(state.activeLessonId)
      : setLessonReadProgress(state.activeLessonId, percent);

    const lesson = findLesson(state.activeLessonId);
    if (lesson) updateCompleteButton(lesson);

    return Math.max(stored, percent);
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
        <input id="lessonTreeSearch" name="lessonTreeSearch" type="search" placeholder="Search lessons…" autocomplete="off"/>
      </label>
    `;

    header.appendChild(tools);
  }

  function renderCultureFilters() {
    const holder = document.getElementById('cultureFilters');
    const welcome = document.getElementById('welcomeCultures');
    const roadmap = document.getElementById('lessonRoadmap');

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

    if (roadmap) {
      const totalLessons = liveCultures.reduce((sum, culture) =>
        sum + culture.modules.reduce((moduleSum, module) => moduleSum + module.lessons.length, 0), 0);
      const completedLessons = state.completed.length;

      roadmap.innerHTML = `
        <section class="cv-roadmap-panel cv-roadmap-panel--wide">
          <div>
            <span class="cv-roadmap-kicker">How the journeys work</span>
            <h3>Choose a culture, then follow its lesson path.</h3>
            <p>Each culture opens as a living study world: origin stories, language, land, sky, ethics, governance, medicine, ceremony, and modern responsibility. You can go deep in one culture or begin many and let your galaxy grow with you.</p>
          </div>
          <div class="cv-roadmap-stats" aria-label="Learning progress overview">
            <span><strong>${liveCultures.length}</strong> live cultures</span>
            <span><strong>${totalLessons}</strong> lessons</span>
            <span><strong>${completedLessons}</strong> completed</span>
          </div>
        </section>

        <section class="cv-roadmap-grid" aria-label="Culture roadmap">
          ${liveCultures.map(culture => {
            const progress = getCultureProgress(culture);
            const firstLesson = culture.modules.flatMap(module => module.lessons)[0];
            const modules = culture.modules
              .filter(module => module.lessons.length)
              .map(module => module.title)
              .join(' · ');

            return `
              <article class="cv-roadmap-culture" style="--culture-color:${getCultureColor(culture.theme)}">
                <div class="cv-roadmap-culture__top">
                  <span class="cv-roadmap-culture__emoji">${escapeHTML(culture.emoji)}</span>
                  <div>
                    <h3>${escapeHTML(culture.name)}</h3>
                    <p>${escapeHTML(culture.tagline || modules || 'Living knowledge pathway')}</p>
                  </div>
                </div>
                <div class="cv-roadmap-culture__bar"><span style="width:${progress.percent}%"></span></div>
                <div class="cv-roadmap-culture__meta">
                  <span>${progress.done}/${progress.total} complete</span>
                  <span>${escapeHTML(modules || 'Lessons')}</span>
                </div>
                ${firstLesson ? `
                  <button class="cv-roadmap-culture__start" type="button" data-lesson-id="${escapeAttr(firstLesson.id)}">
                    Enter ${escapeHTML(culture.name)}
                    <i class="fas fa-arrow-right"></i>
                  </button>
                ` : ''}
              </article>
            `;
          }).join('')}
        </section>

        <section class="cv-roadmap-panel cv-roadmap-panel--future">
          <div>
            <span class="cv-roadmap-kicker">Future roadmap</span>
            <h3>Learn-to-earn, anchored in care.</h3>
            <p>The next reward layer is planned around XRPL: fast, low-friction proof of learning that can support badges, credentials, stewardship quests, and portable learner identity without turning culture into speculation.</p>
          </div>
          <div class="cv-roadmap-future-grid" aria-label="Future platform roadmap">
            <article>
              <i class="fas fa-award"></i>
              <h4>Mana and credentials</h4>
              <p>Lessons, reflections, reviews, and community challenges can become visible achievements tied to progress and conduct.</p>
            </article>
            <article>
              <i class="fas fa-link"></i>
              <h4>XRPL foundation</h4>
              <p>XRPL can support lightweight badges, trust lines, future NFTs, and wallet-connected learning records when the platform is ready.</p>
            </article>
            <article>
              <i class="fas fa-cube"></i>
              <h4>Digitalverse</h4>
              <p>A dedicated section will help learners navigate blockchain ecosystems, AI tools, LLMs, wallets, safety, and emerging technologies.</p>
            </article>
          </div>
          <ul class="cv-roadmap-list">
            <li>Reward depth, reflection, source literacy, and real-world responsibility.</li>
            <li>Let culture planets, moons, rings, and badges show earned learning without replacing relationship.</li>
            <li>Use Digitalverse to teach the technology layer before asking learners to use it.</li>
          </ul>
        </section>
      `;
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

    if (!state.cultures.length) {
      tree.innerHTML = `
        <div class="cv-tree-empty">
          <strong>No lesson data found.</strong>
          <span>Check that <code>LKP/js/lkp-data.js</code> loads first.</span>
        </div>
      `;
      return;
    }

    tree.innerHTML = state.cultures.map(culture => {
      const progress = getCultureProgress(culture);
      const cultureColor = getCultureColor(culture.theme);
      const cultureHasActiveLesson = culture.modules.some(module =>
        module.lessons.some(lesson => lesson.id === state.activeLessonId)
      );
      const allComplete = progress.total > 0 && progress.done === progress.total;
      const isFocusedCulture = state.activeCulture === culture.id;
      const shouldOpen = !state.closedCultures.has(culture.id) && Boolean(
        query ||
        cultureHasActiveLesson ||
        isFocusedCulture ||
        state.openCultures.has(culture.id)
      );
      const progressLabel = progress.total
        ? `${progress.done} of ${progress.total} lessons complete`
        : 'Lessons coming soon';
      const statusLabel = allComplete ? 'Complete' : `${progress.percent}%`;

      const progressBar = `
        <div class="cv-culture-progress">
          <div class="cv-culture-progress__meta">
            <span>${escapeHTML(progressLabel)}</span>
            <span>${escapeHTML(statusLabel)}</span>
          </div>
          <div class="cv-culture-progress__bar">
            <span style="width:${progress.percent}%;background:${cultureColor}"></span>
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
          <section class="cv-tree-culture${shouldOpen ? ' is-open' : ''}" style="--culture-color:${cultureColor}">
            <button
              class="cv-tree-culture__title"
              type="button"
              data-culture-toggle="${escapeHTML(culture.id)}"
              aria-expanded="${shouldOpen ? 'true' : 'false'}"
              aria-controls="culture-panel-${escapeHTML(culture.id)}"
            >
              <span class="cv-tree-culture__identity">
                <span class="cv-tree-culture__emoji">${escapeHTML(culture.emoji)}</span>
                <span>${escapeHTML(culture.name)}</span>
              </span>
              <span class="cv-tree-culture__status" aria-label="${escapeHTML(progressLabel)}">${allComplete ? '✓' : escapeHTML(statusLabel)}</span>
              <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="cv-tree-culture__body" id="culture-panel-${escapeHTML(culture.id)}" ${shouldOpen ? '' : 'hidden'}>
              <div class="cv-tree-culture__body-inner">
                ${progressBar}
                <div class="cv-tree-module">
                  <div class="cv-tree-module__title">Coming Soon</div>
                  <button class="cv-tree-lesson" type="button" disabled>
                    <strong>${escapeHTML(query ? 'No matching lessons.' : culture.tagline || 'Lessons being prepared.')}</strong>
                  </button>
                </div>
              </div>
            </div>
          </section>
        `;
      }

      return `
        <section class="cv-tree-culture${shouldOpen ? ' is-open' : ''}" style="--culture-color:${cultureColor}">
          <button
            class="cv-tree-culture__title"
            type="button"
            data-culture-toggle="${escapeHTML(culture.id)}"
            aria-expanded="${shouldOpen ? 'true' : 'false'}"
            aria-controls="culture-panel-${escapeHTML(culture.id)}"
          >
            <span class="cv-tree-culture__identity">
              <span class="cv-tree-culture__emoji">${escapeHTML(culture.emoji)}</span>
              <span>${escapeHTML(culture.name)}</span>
            </span>
            <span class="cv-tree-culture__status" aria-label="${escapeHTML(progressLabel)}">${allComplete ? '✓' : escapeHTML(statusLabel)}</span>
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
          </button>

          <div class="cv-tree-culture__body" id="culture-panel-${escapeHTML(culture.id)}" ${shouldOpen ? '' : 'hidden'}>
            <div class="cv-tree-culture__body-inner">
              ${progressBar}

              ${filteredModules.map(module => {
                const moduleDone = module.lessons.filter(l => isCompleted(l.id)).length;
                const moduleTotal = module.lessons.length;
                const modulePct = moduleTotal > 0 ? Math.round((moduleDone / moduleTotal) * 100) : 0;
                const moduleMins = module.lessons.reduce((sum, l) => {
                  const m = parseInt(l.readTime) || 0;
                  return sum + m;
                }, 0);
                const moduleTimeLabel = moduleMins > 0 ? `${moduleMins} min` : '';

                return `
                <div class="cv-tree-module">
                  <div class="cv-tree-module__title">
                    <span class="cv-tree-module__emoji">${escapeHTML(module.emoji)}</span>
                    <span class="cv-tree-module__name">${escapeHTML(module.title)}</span>
                    <span class="cv-tree-module__stats">
                      ${moduleTimeLabel ? `<span class="cv-tree-module__time">${escapeHTML(moduleTimeLabel)}</span>` : ''}
                      <span class="cv-tree-module__prog">${moduleDone}/${moduleTotal}</span>
                    </span>
                  </div>
                  <div class="cv-tree-module__bar" aria-hidden="true"><span style="width:${modulePct}%"></span></div>

                  ${module.lessons.map(lesson => {
                    const done = isCompleted(lesson.id);
                    const active = lesson.id === state.activeLessonId;
                    const bookmarked = isBookmarked(lesson.id);
                    const hasConnections = Array.isArray(lesson.connections) && lesson.connections.length > 0;

                    return `
                      <button
                        class="cv-tree-lesson${active ? ' is-active' : ''}${done ? ' is-complete' : ''}"
                        type="button"
                        data-lesson-id="${escapeHTML(lesson.id)}"
                        aria-current="${active ? 'page' : 'false'}"
                      >
                        <span class="cv-tree-lesson__dot" aria-hidden="true"></span>
                        <span class="cv-tree-lesson__text">
                          <strong>${escapeHTML(lesson.num || 'LESSON')} · ${escapeHTML(lesson.title)}</strong>
                          <small>${escapeHTML(lesson.readTime || 'Lesson')}${hasConnections ? ' · <i class="fas fa-circle-nodes" aria-label="cross-culture connections" title="Cross-culture connections"></i>' : ''}</small>
                        </span>
                        <span class="cv-tree-lesson__icons" aria-hidden="true">
                          ${bookmarked ? '<i class="fas fa-bookmark cv-tree-lesson__bookmark-pip"></i>' : ''}
                          ${done ? '<span class="cv-tree-lesson__check">✓</span>' : ''}
                        </span>
                      </button>
                    `;
                  }).join('')}
                </div>
              `; }).join('')}
            </div>
          </div>
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

        <button class="cv-btn-icon cv-btn-reading-mode" type="button" data-reading-mode title="Reading focus mode">
          <i class="fas fa-glasses"></i>
        </button>

        <button
          class="cv-btn-icon cv-btn-bookmark${isBookmarked(lesson.id) ? ' is-bookmarked' : ''}"
          type="button"
          data-bookmark-lesson="${escapeHTML(lesson.id)}"
          title="${isBookmarked(lesson.id) ? 'Remove bookmark' : 'Bookmark this lesson'}"
          aria-pressed="${isBookmarked(lesson.id) ? 'true' : 'false'}"
        >
          <i class="fas fa-bookmark"></i>
        </button>

        <button class="cv-btn-icon cv-btn-share" type="button" data-share-lesson="${escapeHTML(lesson.id)}" title="Share this lesson">
          <i class="fas fa-share-nodes"></i>
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
                <textarea
                  id="reflection-${escapeHTML(lesson.id)}-${index}"
                  name="reflection-${escapeHTML(lesson.id)}-${index}"
                  data-reflection-index="${index}"
                  placeholder="Write your reflection…"
                  rows="3"
                >${escapeHTML(existing[index] || '')}</textarea>
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
                  <textarea
                    id="reflection-${escapeHTML(lesson.id)}-${index}"
                    name="reflection-${escapeHTML(lesson.id)}-${index}"
                    data-reflection-index="${index}"
                    placeholder="Write here…"
                    rows="3"
                  >${escapeHTML(existing[index] || '')}</textarea>
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

        updateCompleteButton(lesson);

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
              <div class="cv-source-badges">
                ${source.sourceType ? `<span class="cv-source-badge cv-source-badge--type">${escapeHTML(source.sourceType)}</span>` : ''}
                ${source.sourceConfidence ? `<span class="cv-source-badge cv-source-badge--confidence">${escapeHTML(source.sourceConfidence)}</span>` : ''}
              </div>
              ${source.note ? `<span>${escapeHTML(source.note)}</span>` : ''}
              <small>${source.url ? 'Open →' : 'Reference'}</small>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderLessonVisuals(lesson) {
    const holder = document.getElementById('lessonVisuals');
    if (!holder) return;

    const words = lesson.contentText ? lesson.contentText.split(/\s+/).length : 0;
    const readMins = lesson.readTime || (words > 0 ? `${Math.ceil(words / 210)} min read` : 'Deep reading');
    const conceptChips = getLessonConceptChips(lesson);
    const sources = Array.isArray(lesson.sources) ? lesson.sources : [];
    const connections = Array.isArray(lesson.connections) ? lesson.connections : [];
    const highConfidence = sources.filter(source => /high/i.test(source.sourceConfidence || '')).length;

    holder.innerHTML = `
      <section class="cv-lesson-visuals">
        <div class="cv-divider-heading">
          <span>Lesson Snapshot</span>
        </div>

        <div class="cv-lesson-stats">
          <article class="cv-lesson-stat">
            <small>Depth</small>
            <strong>${escapeHTML(readMins)}</strong>
          </article>
          <article class="cv-lesson-stat">
            <small>Sources</small>
            <strong>${sources.length}</strong>
          </article>
          <article class="cv-lesson-stat">
            <small>High Confidence</small>
            <strong>${highConfidence}</strong>
          </article>
          <article class="cv-lesson-stat">
            <small>Connections</small>
            <strong>${connections.length}</strong>
          </article>
        </div>

        ${conceptChips.length ? `
          <div class="cv-lesson-concepts" role="list" aria-label="Key lesson concepts">
            ${conceptChips.map(item => `<span class="cv-lesson-concept" role="listitem">${escapeHTML(item)}</span>`).join('')}
          </div>
        ` : ''}
      </section>
    `;
  }

  function renderLessonImageStrip(lesson) {
    const holder = document.getElementById('lessonVisualStrip');
    if (!holder) return;

    const token = ++stripResolveToken;
    const byId = new Map(state.lessons.map(item => [item.id, item]));
    const sameModule = state.lessons
      .filter(item => item.id !== lesson.id && item.moduleId === lesson.moduleId)
      .slice(0, 4);

    const queue = [
      lesson,
      ...(lesson.related || []).map(id => byId.get(id)).filter(Boolean),
      ...sameModule
    ];

    const uniqueLessons = [...new Map(queue.map(item => [item.id, item])).values()].slice(0, 6);

    Promise.all(uniqueLessons.map(async item => {
      const image = getHeroImage(item);
      if (!image || image.placeholder || !image.url) return null;

      const resolved = await resolveFirstExistingImage(image.url);
      if (!resolved) return null;

      return {
        id: item.id,
        title: item.title,
        cultureName: item.cultureName,
        color: getCultureColor(item.cultureTheme),
        url: resolved
      };
    })).then(cards => {
      if (token !== stripResolveToken || state.activeLessonId !== lesson.id) return;

      const liveCards = cards.filter(Boolean).slice(0, 5);

      if (!liveCards.length) {
        holder.innerHTML = '';
        return;
      }

      holder.innerHTML = `
        <section class="cv-visual-strip">
          <div class="cv-divider-heading">
            <span>Visual Archive</span>
          </div>

          <div class="cv-visual-strip__row">
            ${liveCards.map(card => `
              <button
                class="cv-visual-strip__card"
                type="button"
                data-related-lesson="${escapeHTML(card.id)}"
                style="--visual-color:${card.color}"
              >
                <img src="${escapeAttr(card.url)}" alt="${escapeAttr(card.title)}" loading="lazy" />
                <span>
                  <strong>${escapeHTML(card.title)}</strong>
                  <small>${escapeHTML(card.cultureName || 'Lesson')}</small>
                </span>
              </button>
            `).join('')}
          </div>
        </section>
      `;
    });
  }

  function getFirstLessonForCulture(cultureId, excludeLessonId) {
    return state.lessons.find(item => item.cultureId === cultureId && item.id !== excludeLessonId) || null;
  }

  function renderConnections(lesson) {
    const holder = document.getElementById('lessonConnections');
    if (!holder) return;

    const connections = Array.isArray(lesson.connections) ? lesson.connections : [];

    if (!connections.length) {
      holder.innerHTML = '';
      return;
    }

    const byLessonId = new Map(state.lessons.map(item => [item.id, item]));
    const byCultureId = new Map(state.cultures.map(item => [item.id, item]));

    const cards = connections.map(connection => {
      const explicitLesson = connection.lessonId ? byLessonId.get(connection.lessonId) : null;
      const fallbackLesson = !explicitLesson && connection.cultureId
        ? getFirstLessonForCulture(connection.cultureId, lesson.id)
        : null;
      const targetLesson = explicitLesson || fallbackLesson;

      const targetCulture =
        byCultureId.get(connection.cultureId) ||
        (targetLesson ? byCultureId.get(targetLesson.cultureId) : null);

      const cultureName = targetCulture?.name || targetLesson?.cultureName || 'Connected Culture';
      const cultureEmoji = targetCulture?.emoji || targetLesson?.cultureEmoji || '✦';
      const cultureTheme = targetCulture?.theme || targetLesson?.cultureTheme || 'default';
      const color = getCultureColor(cultureTheme);

      const title = connection.label || targetLesson?.title || cultureName;
      const note = connection.note || (targetLesson
        ? `${targetLesson.cultureName} · ${targetLesson.moduleTitle}`
        : 'Open this culture thread');
      const axis = connection.axis || '';

      if (connection.url) {
        return `
          <a
            class="cv-connection-card"
            href="${escapeHTML(connection.url)}"
            target="_blank"
            rel="noopener"
            style="--connection-color:${color}"
          >
            <span class="cv-connection-card__emoji">${escapeHTML(cultureEmoji)}</span>
            <div>
              <strong>${escapeHTML(title)}</strong>
              <small>${escapeHTML(note)}</small>
            </div>
            ${axis ? `<span class="cv-connection-card__axis">${escapeHTML(axis)}</span>` : ''}
            <span class="cv-connection-card__go">Open ↗</span>
          </a>
        `;
      }

      if (targetLesson) {
        return `
          <button
            class="cv-connection-card"
            type="button"
            data-connection-lesson="${escapeHTML(targetLesson.id)}"
            style="--connection-color:${color}"
          >
            <span class="cv-connection-card__emoji">${escapeHTML(cultureEmoji)}</span>
            <div>
              <strong>${escapeHTML(title)}</strong>
              <small>${escapeHTML(note)}</small>
            </div>
            ${axis ? `<span class="cv-connection-card__axis">${escapeHTML(axis)}</span>` : ''}
            <span class="cv-connection-card__go">Open →</span>
          </button>
        `;
      }

      if (targetCulture) {
        return `
          <button
            class="cv-connection-card"
            type="button"
            data-connection-culture="${escapeHTML(targetCulture.id)}"
            style="--connection-color:${color}"
          >
            <span class="cv-connection-card__emoji">${escapeHTML(cultureEmoji)}</span>
            <div>
              <strong>${escapeHTML(title)}</strong>
              <small>${escapeHTML(note)}</small>
            </div>
            ${axis ? `<span class="cv-connection-card__axis">${escapeHTML(axis)}</span>` : ''}
            <span class="cv-connection-card__go">Browse →</span>
          </button>
        `;
      }

      return '';
    }).filter(Boolean);

    if (!cards.length) {
      holder.innerHTML = '';
      return;
    }

    holder.innerHTML = `
      <section class="cv-connections">
        <div class="cv-divider-heading">
          <span>Culture Connections</span>
        </div>

        <div class="cv-connections-grid">
          ${cards.join('')}
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
    const activeConcepts = getLessonConceptChips(lesson).map(item => item.toLowerCase());

    const conceptMatch = state.lessons
      .filter(item => item.id !== lesson.id)
      .map(item => {
        const itemConcepts = getLessonConceptChips(item).map(tag => tag.toLowerCase());
        const overlap = itemConcepts.filter(tag => activeConcepts.includes(tag));

        return {
          lesson: item,
          score: overlap.length
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.lesson);

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
      ...new Map([...explicit, ...conceptMatch, ...bridgeMatch, ...sameModule].map(item => [item.id, item])).values()
    ].filter(item => item.id !== lesson.id).slice(0, 3);

    if (!related.length) {
      holder.innerHTML = '';
      return;
    }

    holder.innerHTML = `
      <div class="cv-divider-heading">
        <span>Related Lessons</span>
      </div>

      ${activeConcepts.length ? `
        <div class="cv-related-concepts" aria-label="Related by concept">
          <small>Related by concept</small>
          <div>
            ${activeConcepts.slice(0, 6).map(item => `<span>${escapeHTML(item)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

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

      <div class="cv-swipe-hint" aria-hidden="true">Swipe left or right to move between lessons</div>
    `;
  }

  function renderMobileScrubber() {
    const scrubber = document.getElementById('lessonMobileScrubber');
    if (!scrubber || !state.activeLessonId) return;

    const index = getLessonIndex(state.activeLessonId);
    const previous = index > 0 ? state.lessons[index - 1] : null;
    const next = index < state.lessons.length - 1 ? state.lessons[index + 1] : null;
    const current = findLesson(state.activeLessonId);

    const completedCount = state.completed.length;
    const totalCount = state.lessons.length;
    const mana = getMana();
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    scrubber.innerHTML = `
      <button
        class="cv-mobile-scrubber__btn"
        type="button"
        data-nav-lesson="${previous ? escapeHTML(previous.id) : ''}"
        ${previous ? '' : 'disabled'}
        aria-label="Go to previous lesson"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="cv-mobile-scrubber__center">
        <small>Lesson ${index + 1} of ${totalCount} &nbsp;·&nbsp; <i class="fas fa-star" style="color:#f0c96a;font-size:0.7em"></i> ${mana} Mana</small>
        <strong>${escapeHTML(current?.title || '')}</strong>
        <div class="cv-mobile-scrubber__bar" aria-hidden="true" title="${pct}% complete">
          <span style="width:${pct}%"></span>
        </div>
      </div>

      <button
        class="cv-mobile-scrubber__btn"
        type="button"
        data-nav-lesson="${next ? escapeHTML(next.id) : ''}"
        ${next ? '' : 'disabled'}
        aria-label="Go to next lesson"
      >
        <i class="fas fa-chevron-right"></i>
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
    state.suppressReadProgress = !options.noScroll;
    localStorage.setItem(LAST_LESSON_KEY, lesson.id);
    try {
      const started = JSON.parse(localStorage.getItem(STARTED_KEY) || '[]');
      if (Array.isArray(started) && !started.includes(lesson.id)) {
        started.push(lesson.id);
        localStorage.setItem(STARTED_KEY, JSON.stringify(started));
      }
    } catch (_err) {
      localStorage.setItem(STARTED_KEY, JSON.stringify([lesson.id]));
    }

    document.body.dataset.culture = lesson.cultureId || 'default';
    document.body.dataset.lessonMode = state.mode;
    document.documentElement.style.setProperty('--lesson-font-scale', String(state.fontScale));

    const welcome = document.getElementById('lessonWelcome');
    const home = document.getElementById('lessonHome');
    const article = document.getElementById('lessonArticle');

    if (welcome) welcome.hidden = true;
    if (home) home.hidden = true;
    if (article) article.hidden = false;
    document.body.classList.remove('cv-roadmap-open');

    if (article) {
      article.classList.remove('is-transitioning');
      void article.offsetWidth;
      article.classList.add('is-transitioning');
      clearTimeout(renderLesson._transitionTimer);
      renderLesson._transitionTimer = setTimeout(() => {
        article.classList.remove('is-transitioning');
      }, 260);
    }

    const header = document.getElementById('lessonHeader');

    if (header) {
      header.innerHTML = renderLessonHeader(lesson);
    }

    const body = document.getElementById('lessonBody');

    if (body) {
      if (state.mode === 'keiki') {
        body.innerHTML = renderKeikiContent(lesson);
      } else {
        const baseContent = transformContent(lesson.content, lesson);
        const kemetScaffold = lesson.id.startsWith('ke-')
          ? buildKemetDeepScaffold(lesson)
          : '';
        const maoriScaffold = lesson.id.startsWith('mi-')
          ? buildMaoriDeepScaffold(lesson)
          : '';
        const dreamtimeScaffold = lesson.id.startsWith('dt-')
          ? buildDreamtimeDeepScaffold(lesson)
          : '';
        const creationArc = buildCreationArcView(lesson);

        const ARC_MARKER = '<!-- CV_CREATION_ARC -->';
        if (creationArc && baseContent.includes(ARC_MARKER)) {
          body.innerHTML = baseContent.replace(ARC_MARKER, creationArc) + kemetScaffold + maoriScaffold + dreamtimeScaffold;
        } else {
          body.innerHTML = creationArc + baseContent + kemetScaffold + maoriScaffold + dreamtimeScaffold;
        }
      }

      if (state.mode === 'scholar' && !body.querySelector('.cv-reflection')) {
        body.insertAdjacentHTML('beforeend', renderReflectionAccordion(DEFAULT_REFLECTIONS, lesson, 'Reflection Prompts'));
      }

      if (lesson.id === 'km-kumulipo' || lesson.id.startsWith('km-wa-')) {
        initKumulipoExperience(body);
        if (lesson.id === 'km-kumulipo' && window.KUMULIPO_WA_UI && typeof window.KUMULIPO_WA_UI.insert === 'function') {
          window.KUMULIPO_WA_UI.insert(document.getElementById('lessonActionStrip'), state.mode);
        }
      }

      if (window.LKPGlossary && typeof window.LKPGlossary.apply === 'function') {
        window.LKPGlossary.apply(body);
      }
    }

    updateHeroImage(lesson);
    syncHeroLightbox();

    const emoji = document.getElementById('cultureHeroEmoji');
    const name = document.getElementById('cultureHeroName');

    if (emoji) emoji.textContent = lesson.cultureEmoji || '✦';
    if (name) name.textContent = `${lesson.cultureName} · ${lesson.moduleTitle}`;

    renderConnections(lesson);
    renderLessonNotes(lesson);
    renderLessonVisuals(lesson);
    renderLessonImageStrip(lesson);
    renderSources(lesson);
    renderLessonNav();
    updateStreak();
    renderMobileScrubber();
    renderRelatedLessons(lesson);
    
    renderLessonTree();
    updateCompleteButton(lesson);
    updateLessonReadProgress({ write: false });
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
        window.setTimeout(() => {
          state.suppressReadProgress = false;
          updateLessonReadProgress();
        }, 700);
      });
    } else {
      state.suppressReadProgress = false;
      requestAnimationFrame(() => updateLessonReadProgress());
    }

    closeSidebarOnMobile();
  }

  function initKumulipoExperience(bodyEl) {
    if (!bodyEl) return;

    const hero = bodyEl.querySelector('.kumu-hero');

    if (hero) {
      const resetHeroMotion = () => {
        hero.style.setProperty('--kumu-shift-x', '0px');
        hero.style.setProperty('--kumu-shift-y', '0px');
        hero.style.setProperty('--kumu-glow-y', '0px');
      };

      resetHeroMotion();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hero.classList.add('is-visible');
      } else {
        const updateHeroMotion = () => {
          const rect = hero.getBoundingClientRect();
          const viewportHeight = window.innerHeight || 1;
          const centerOffset = (rect.top + rect.height * 0.5) - viewportHeight * 0.5;
          const normalized = Math.max(-1, Math.min(1, centerOffset / viewportHeight));

          hero.style.setProperty('--kumu-shift-x', `${normalized * -10}px`);
          hero.style.setProperty('--kumu-shift-y', `${normalized * 14}px`);
          hero.style.setProperty('--kumu-glow-y', `${normalized * 18}px`);
        };

        updateHeroMotion();
        window.requestAnimationFrame(updateHeroMotion);
        window.addEventListener('scroll', updateHeroMotion, { passive: true });
      }
    }

    const revealItems = Array.from(bodyEl.querySelectorAll('.kumu-reveal'));

    if (revealItems.length) {
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });

        revealItems.forEach(item => revealObserver.observe(item));
      } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
      }
    }

    const accordionGroups = Array.from(bodyEl.querySelectorAll('[data-kumu-wa-accordion]'));
    accordionGroups.forEach(group => {
      const items = Array.from(group.querySelectorAll('.kumu-wa-panel'));
      if (!items.length) return;

      let guard = false;

      function openPanel(targetItem) {
        guard = true;
        items.forEach(other => {
          other.open = other === targetItem;
        });
        guard = false;
      }

      items.forEach(item => {
        item.addEventListener('toggle', () => {
          if (guard || !item.open) return;

          openPanel(item);
        });
      });
    });

    const timeline = bodyEl.querySelector('[data-kumu-wa-timeline]');
    if (!timeline) return;

    const items = Array.from(timeline.querySelectorAll('.kumu-wa-item'));
    if (!items.length) return;

    let guard = false;

    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (guard || !item.open) return;

        guard = true;
        items.forEach(other => {
          if (other !== item) other.open = false;
        });
        guard = false;
      });
    });
  }

  function updateCompleteButton(lesson) {
    const btn = document.querySelector('[data-complete-active-lesson]');
    if (!btn || !lesson) return;

    const done = isCompleted(lesson.id);
    const progress = getLessonReadProgress(lesson.id);
    const readDone = progress >= COMPLETION_REQUIRED_PROGRESS;
    const reflected = hasReflection(lesson.id);
    const locked = !done && (!readDone || !reflected);

    btn.classList.toggle('is-complete', done);
    btn.classList.toggle('is-locked', locked);
    btn.setAttribute('aria-disabled', locked ? 'true' : 'false');
    btn.dataset.completionLocked = locked ? 'true' : 'false';

    if (done) {
      btn.title = 'Lesson complete';
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Complete';
      return;
    }

    if (!readDone) {
      const remaining = Math.max(0, COMPLETION_REQUIRED_PROGRESS - progress);
      btn.title = `Read ${remaining}% more to unlock completion.`;
      btn.innerHTML = `<i class="fas fa-lock"></i> Read ${remaining}% more`;
      return;
    }

    if (!reflected) {
      btn.title = 'Answer a reflection prompt to complete this lesson.';
      btn.innerHTML = '<i class="fas fa-pen"></i> Answer a reflection to complete';
      return;
    }

    btn.title = 'Mark this lesson complete';
    btn.innerHTML = `<i class="fas fa-star"></i> Mark Complete · +${lesson.mana || DEFAULT_MANA} Mana`;
  }

  function renderWelcome() {
    const welcome = document.getElementById('lessonWelcome');
    const home = document.getElementById('lessonHome');
    const article = document.getElementById('lessonArticle');

    if (welcome) welcome.hidden = false;
    if (home) home.hidden = false;
    if (article) article.hidden = true;
    document.body.classList.toggle('cv-roadmap-open', Boolean(welcome));

    const skip = document.querySelector('[data-skip-roadmap]');
    if (skip) skip.checked = localStorage.getItem(SKIP_ROADMAP_KEY) === 'true';

    state.activeLessonId = null;

    const lastId = localStorage.getItem(LAST_LESSON_KEY);
    const lastLesson = lastId ? findLesson(lastId) : null;

    const resumeBtns = document.querySelectorAll('[data-start-first-available]');
    resumeBtns.forEach(btn => {
      if (lastLesson) {
        btn.innerHTML = `<i class="fas fa-compass"></i> Continue: ${escapeHTML(lastLesson.title)}`;
        btn.setAttribute('title', `Continue: ${escapeHTML(lastLesson.title)}`);
      } else {
        btn.innerHTML = '<i class="fas fa-compass"></i> Start First Journey';
        btn.removeAttribute('title');
      }
    });

    const homeH1 = document.querySelector('#lessonHome h1');
    const homeP = document.querySelector('#lessonHome > .cv-lesson-home__inner > p');
    if (homeH1 && homeP) {
      if (lastLesson) {
        homeH1.textContent = 'Welcome back.';
        homeP.textContent = 'Pick up where you left off, explore a new culture, or browse today\'s featured lesson below.';
      } else {
        homeH1.textContent = 'Choose your path.';
        homeP.textContent = 'Open the culture map to find your first journey, or tap the list icon on mobile to browse all lessons.';
      }
    }

    const resumeBanner = document.getElementById('lessonResumeBanner');
    if (resumeBanner) {
      if (lastLesson) {
        resumeBanner.hidden = false;
        resumeBanner.innerHTML = `
          <span class="cv-resume-banner__label">Last visited</span>
          <button class="cv-resume-banner__btn" type="button" data-lesson-id="${escapeHTML(lastLesson.id)}">
            <span class="cv-resume-banner__emoji">${escapeHTML(lastLesson.cultureEmoji)}</span>
            <span class="cv-resume-banner__title">${escapeHTML(lastLesson.title)}</span>
            <span class="cv-resume-banner__culture">${escapeHTML(lastLesson.cultureName)} · ${escapeHTML(lastLesson.moduleTitle)}</span>
          </button>
        `;
      } else {
        resumeBanner.hidden = true;
      }
    }

    renderFeaturedLesson();
    renderLessonTree();

    const streakBadge = document.getElementById('lessonStreakBadge');
    if (streakBadge) {
      const n = getStreak();
      if (n > 0) {
        streakBadge.hidden = false;
        streakBadge.innerHTML = `<span class="cv-streak-badge"><i class="fas fa-fire" aria-hidden="true"></i> ${n} day${n === 1 ? '' : 's'} in a row</span>`;
      } else {
        streakBadge.hidden = true;
      }
    }
  }

  function closeRoadmapOverlay() {
    const welcome = document.getElementById('lessonWelcome');
    if (welcome) welcome.hidden = true;
    document.body.classList.remove('cv-roadmap-open');
  }

  function openRoadmapOverlay() {
    const welcome = document.getElementById('lessonWelcome');
    const home = document.getElementById('lessonHome');

    if (home) home.hidden = false;
    if (welcome) {
      welcome.hidden = false;
      document.body.classList.add('cv-roadmap-open');
      welcome.querySelector('[data-close-roadmap]')?.focus?.();
    }
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

    const readProgress = getLessonReadProgress(lesson.id);

    if (!canCompleteLesson(lesson)) {
      updateCompleteButton(lesson);
      if (readProgress < COMPLETION_REQUIRED_PROGRESS) {
        const remaining = Math.max(0, COMPLETION_REQUIRED_PROGRESS - readProgress);
        showToast(`Keep reading — ${remaining}% more to go.`);
      } else {
        showToast('Write a reflection first — nānā i ke kumu.');
      }
      return;
    }

    if (window.LKPProfileSync && window.LKPProfileSync.state.user) {
      const result = await window.LKPProfileSync.completeLesson(lesson, {
        source: 'lesson-page',
        readProgress,
        requiredProgress: COMPLETION_REQUIRED_PROGRESS
      });

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
        await window.LKPRewards.completeLesson(lesson.id, {
          source: 'lesson-page',
          mana,
          lesson,
          readProgress,
          requiredProgress: COMPLETION_REQUIRED_PROGRESS
        });
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

    checkCertificateEligibility(lesson);
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

  function showCertificate({ type, title, cultureName, emoji, completedCount }) {
    const existing = document.getElementById('lkp-cert-modal');
    if (existing) existing.remove();

    const learnerName = window.LKP_ADMIN_PROFILE?.display_name
      || window.LKPProfileSync?.state?.profile?.display_name
      || 'Wayfinder';

    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const mana = getMana();

    const modal = document.createElement('div');
    modal.id = 'lkp-cert-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Completion Certificate');
    modal.innerHTML = `
      <div class="lkp-cert-overlay"></div>
      <div class="lkp-cert-sheet" id="lkpCertSheet">
        <div class="lkp-cert-glyph">${escapeHTML(emoji || '✦')}</div>
        <p class="lkp-cert-eyebrow">Certificate of Completion</p>
        <p class="lkp-cert-presented">This certifies that</p>
        <h2 class="lkp-cert-learner">${escapeHTML(learnerName)}</h2>
        <p class="lkp-cert-has">has completed the</p>
        <h3 class="lkp-cert-title">${escapeHTML(title)}</h3>
        ${cultureName ? `<p class="lkp-cert-culture">${escapeHTML(cultureName)}</p>` : ''}
        <p class="lkp-cert-meta">
          ${type === 'culture' ? `All ${completedCount} lessons complete` : `Module complete · ${completedCount} lessons`}
          &nbsp;·&nbsp; ${escapeHTML(now)}
          &nbsp;·&nbsp; <i class="fas fa-star"></i> ${mana} Mana
        </p>
        <div class="lkp-cert-seal" aria-hidden="true">◈</div>
        <div class="lkp-cert-platform">Ka Paepae ʻIke Ola — The Living Knowledge Platform</div>
        <div class="lkp-cert-actions">
          <button class="lkp-cert-btn lkp-cert-btn--print" type="button" id="lkpCertPrint">
            <i class="fas fa-print"></i> Print / Save PDF
          </button>
          <button class="lkp-cert-btn lkp-cert-btn--close" type="button" id="lkpCertClose">
            <i class="fas fa-xmark"></i> Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('lkpCertClose').addEventListener('click', () => modal.remove());
    modal.querySelector('.lkp-cert-overlay').addEventListener('click', () => modal.remove());
    document.getElementById('lkpCertPrint').addEventListener('click', () => {
      document.body.classList.add('lkp-cert-printing');
      window.print();
      setTimeout(() => document.body.classList.remove('lkp-cert-printing'), 500);
    });

    setTimeout(() => modal.classList.add('is-visible'), 50);
  }

  function checkCertificateEligibility(lesson) {
    const culture = state.cultures.find(c => c.id === lesson.cultureId);
    if (!culture) return;

    const module = culture.modules.find(m => m.id === lesson.moduleId);
    if (module) {
      const moduleDone = module.lessons.every(l => isCompleted(l.id));
      if (moduleDone) {
        const cultureDone = culture.modules.every(m =>
          m.lessons.every(l => isCompleted(l.id))
        );

        if (cultureDone) {
          setTimeout(() => showCertificate({
            type: 'culture',
            title: culture.name,
            emoji: culture.emoji || '✦',
            completedCount: culture.modules.reduce((n, m) => n + m.lessons.length, 0)
          }), 2000);
        } else {
          setTimeout(() => showCertificate({
            type: 'module',
            title: module.title,
            cultureName: culture.name,
            emoji: culture.emoji || '✦',
            completedCount: module.lessons.length
          }), 2000);
        }
      }
    }
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
    const swipeState = {
      x: 0,
      y: 0,
      active: false,
      time: 0
    };

    function canUseTouchGestures() {
      return window.matchMedia('(max-width:980px)').matches || window.matchMedia('(pointer:coarse)').matches;
    }

    function onSwipeStart(event) {
      if (!state.activeLessonId || !canUseTouchGestures()) return;
      if (!event.touches || event.touches.length !== 1) return;

      const target = event.target;
      if (target.closest('textarea,input,button,a,.lkp-sidebar,.cv-sidebar-fab')) return;

      const startX = event.touches[0].clientX;
      const startY = event.touches[0].clientY;
      const vw = window.innerWidth || document.documentElement.clientWidth || 1;
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const inEdgeZone = startX <= vw * 0.08 || startX >= vw * 0.92;
      const inTopZone = startY <= vh * 0.1;
      const inBottomZone = startY >= vh * 0.9;

      // Guard edge and extreme top/bottom regions to avoid clashes with OS gestures.
      if (inEdgeZone || inTopZone || inBottomZone) return;

      swipeState.active = true;
      swipeState.x = startX;
      swipeState.y = startY;
      swipeState.time = Date.now();
    }

    function onSwipeEnd(event) {
      if (!swipeState.active || !state.activeLessonId || !canUseTouchGestures()) return;
      swipeState.active = false;
      if (!event.changedTouches || !event.changedTouches.length) return;

      const dx = event.changedTouches[0].clientX - swipeState.x;
      const dy = event.changedTouches[0].clientY - swipeState.y;
      const elapsed = Date.now() - swipeState.time;

      if (elapsed > 820) return;
      if (Math.abs(dx) < 66) return;
      if (Math.abs(dy) > 76) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.2) return;

      const index = getLessonIndex(state.activeLessonId);
      if (index < 0) return;

      if (dx < 0 && index < state.lessons.length - 1) {
        renderLesson(state.lessons[index + 1].id);
      } else if (dx > 0 && index > 0) {
        renderLesson(state.lessons[index - 1].id);
      }
    }

    document.getElementById('lessonMain')?.addEventListener('touchstart', onSwipeStart, { passive: true });
    document.getElementById('lessonMain')?.addEventListener('touchend', onSwipeEnd, { passive: true });

    document.addEventListener('click', event => {
      const waSummary = event.target.closest('.kumu-wa-panel > summary');
      if (waSummary) {
        event.preventDefault();

        const panel = waSummary.parentElement;
        const group = panel?.closest('[data-kumu-wa-accordion]');

        if (panel && group) {
          const panels = Array.from(group.querySelectorAll('.kumu-wa-panel'));
          const nextOpen = !panel.open;

          panels.forEach(item => {
            item.open = false;
          });

          panel.open = nextOpen;
        }

        return;
      }

      const vocabSummary = event.target.closest('.kumu-wa-vocab__item > summary');
      if (vocabSummary) {
        event.preventDefault();

        const item = vocabSummary.parentElement;
        const list = item?.closest('.kumu-wa-vocab__chips');

        if (item) {
          const nextOpen = !item.open;

          if (list) {
            list.querySelectorAll('.kumu-wa-vocab__item').forEach(entry => {
              entry.open = false;
            });
          }

          item.open = nextOpen;
        }

        return;
      }

      // Explicit handler for all other <details> toggles — fixes display:flex + overflow:hidden
      // compatibility issues in Safari and older Chromium builds.
      const anySummary = event.target.closest('summary');
      if (anySummary && !anySummary.closest('.kumu-wa-panel') && !anySummary.closest('.kumu-wa-vocab__item')) {
        const detailsEl = anySummary.closest('details');
        if (detailsEl) {
          event.preventDefault();
          const wasOpen = detailsEl.open;
          detailsEl.open = !wasOpen;

          const notesHint = anySummary.querySelector('.cv-lesson-notes__hint');
          if (notesHint) {
            notesHint.textContent = detailsEl.open ? 'click to collapse' : 'click to open';
          }
          const reflectHint = anySummary.querySelector('.cv-reflection__hint');
          if (reflectHint) {
            reflectHint.textContent = detailsEl.open ? 'click to collapse' : 'click to open';
          }
          const arrow = anySummary.querySelector('.cv-objectives__arrow, .cv-lesson-notes__arrow');
          if (arrow) arrow.style.transform = detailsEl.open ? 'rotate(180deg)' : '';

          return;
        }
      }

      const cultureFilter = event.target.closest('[data-culture-filter]');

      if (cultureFilter) {
        state.activeCulture = cultureFilter.dataset.cultureFilter || 'all';

        $all('[data-culture-filter]').forEach(btn => {
          btn.classList.toggle('is-active', btn.dataset.cultureFilter === state.activeCulture);
        });

        renderLessonTree();
        return;
      }

      if (event.target.closest('[data-close-roadmap]')) {
        closeRoadmapOverlay();
        return;
      }

      if (event.target.id === 'lessonWelcome') {
        closeRoadmapOverlay();
        return;
      }

      if (event.target.closest('[data-open-roadmap]')) {
        openRoadmapOverlay();
        return;
      }

      const startFirst = event.target.closest('[data-start-first-available]');
      if (startFirst) {
        const last = findLesson(localStorage.getItem(LAST_LESSON_KEY) || '');
        const first = last || state.lessons[0];
        if (first) renderLesson(first.id);
        return;
      }

      const skipRoadmap = event.target.closest('[data-skip-roadmap]');
      if (skipRoadmap) {
        localStorage.setItem(SKIP_ROADMAP_KEY, skipRoadmap.checked ? 'true' : 'false');
        return;
      }

      const cultureToggle = event.target.closest('[data-culture-toggle]');
      if (cultureToggle) {
        event.preventDefault();

        const cultureId = cultureToggle.dataset.cultureToggle || '';
        const section = cultureToggle.closest('.cv-tree-culture');
        const panelId = cultureToggle.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        const nextOpen = cultureToggle.getAttribute('aria-expanded') !== 'true';

        cultureToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        section?.classList.toggle('is-open', nextOpen);

        if (panel) {
          panel.hidden = !nextOpen;
        }

        if (cultureId) {
          if (nextOpen) {
            state.openCultures.add(cultureId);
            state.closedCultures.delete(cultureId);
          } else {
            state.closedCultures.add(cultureId);
            state.openCultures.delete(cultureId);
          }
        }

        return;
      }

      if (event.target.closest('[data-export-reflections]')) {
        exportReflections();
        return;
      }

      const bookmarkBtn = event.target.closest('[data-bookmark-lesson]');
      if (bookmarkBtn) {
        toggleBookmark(bookmarkBtn.dataset.bookmarkLesson);
        return;
      }

      const removeBookmarkBtn = event.target.closest('[data-remove-bookmark]');
      if (removeBookmarkBtn) {
        toggleBookmark(removeBookmarkBtn.dataset.removeBookmark);
        return;
      }

      const shareBtn = event.target.closest('[data-share-lesson]');
      if (shareBtn) {
        const lessonId = shareBtn.dataset.shareLesson;
        const url = window.location.origin + window.location.pathname + '#' + encodeURIComponent(lessonId);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard.')).catch(() => {
            prompt('Copy this link:', url);
          });
        } else {
          prompt('Copy this link:', url);
        }
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

      const connectionLessonBtn = event.target.closest('[data-connection-lesson]');
      if (connectionLessonBtn) {
        renderLesson(connectionLessonBtn.dataset.connectionLesson);
        return;
      }

      const connectionCultureBtn = event.target.closest('[data-connection-culture]');
      if (connectionCultureBtn) {
        const cultureId = connectionCultureBtn.dataset.connectionCulture;
        state.activeCulture = cultureId || 'all';

        $all('[data-culture-filter]').forEach(btn => {
          btn.classList.toggle('is-active', btn.dataset.cultureFilter === state.activeCulture);
        });

        renderLessonTree();

        const first = getFirstLessonForCulture(cultureId, '');
        if (first) {
          renderLesson(first.id);
        } else {
          showToast('This culture has no lessons yet.');
        }

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
        return;
      }

      if (event.target.closest('[data-hero-fullscreen-open]')) {
        openHeroLightbox();
        return;
      }

      if (event.target.closest('[data-hero-fullscreen-close]')) {
        closeHeroLightbox();
        return;
      }

      const lightbox = document.getElementById('heroLightbox');
      if (lightbox?.classList.contains('is-open') && event.target === lightbox) {
        closeHeroLightbox();
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
      if (event.key === 'Escape' && !document.getElementById('lessonWelcome')?.hidden) {
        closeRoadmapOverlay();
        return;
      }

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
        closeHeroLightbox();
      }
    });
  }

  function initNavAndProgress() {
    const toggle = document.getElementById('lkpMobileToggle');
    const navLinks = document.getElementById('lkpNavLinks');
    const nav = document.getElementById('lkpNav');

    if (toggle && navLinks) {
      const setNavOpen = open => {
        navLinks.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      };

      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        setNavOpen(open);
      });

      navLinks.addEventListener('click', event => {
        if (event.target.closest('a')) {
          setNavOpen(false);
        }
      });

      document.addEventListener('click', event => {
        if (toggle.getAttribute('aria-expanded') !== 'true') return;
        if (nav?.contains(event.target)) return;
        setNavOpen(false);
      });

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          setNavOpen(false);
        }
      });

      window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width:1080px)').matches) {
          setNavOpen(false);
        }
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

    window.addEventListener('scroll', () => {
      updateLessonReadProgress();
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

    window.LKPLessons = window.LKPLessons || {};
    window.LKPLessons.getStreak = getStreak;

    renderCultureFilters();
    renderLessonTree();
    renderSidebarBookmarks();

    const opened = openLessonFromHash({ noScroll: true });

    if (!opened) {
      const shouldSkipRoadmap = localStorage.getItem(SKIP_ROADMAP_KEY) === 'true';
      const lastLesson = shouldSkipRoadmap
        ? findLesson(localStorage.getItem(LAST_LESSON_KEY) || '')
        : null;

      if (lastLesson) {
        renderLesson(lastLesson.id, { noScroll: true });
      } else {
        renderWelcome();
      }
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

  window.LESSON_RENDERER = {
    navigateTo: function (lessonId) {
      if (!lessonId) return false;
      if (!findLesson(lessonId)) return false;
      renderLesson(lessonId);
      return true;
    }
  };

  document.addEventListener('DOMContentLoaded', waitForDataAndBuild);
})();
