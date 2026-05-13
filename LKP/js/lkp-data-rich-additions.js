/* ═══════════════════════════════════════════════════════════════════════════
   LKP RICH LESSON ENRICHMENTS — ADDITIVE PATCH
   File: LKP/js/lkp-data-rich-additions.js

   Load order:
   1. js/lkp-data.js
   2. js/lkp-data-rich-additions.js
   3. js/lkp-rewards.js
   4. js/lkp-lessons.js

   Adds:
   - Optional metadata fields: mana, xp, sceneType, concepts, sources, related
   - Keiki / kidVersion data for Scholar ↔ Keiki mode
   - Reflection prompts, activity cards, timelines, comparison blocks
   - New deeper lessons without replacing existing lesson content
═══════════════════════════════════════════════════════════════════════════ */

(function enrichLkpLessonsWithoutReplacingExistingContent() {
  'use strict';

  if (
    typeof CULTURALVERSE_DATA === 'undefined' ||
    !CULTURALVERSE_DATA ||
    !Array.isArray(CULTURALVERSE_DATA.cultures)
  ) {
    console.warn('[LKP Data] Rich lesson enrichment skipped: CULTURALVERSE_DATA missing.');
    return;
  }

  function findCulture(id) {
    return CULTURALVERSE_DATA.cultures.find(culture => culture.id === id) || null;
  }

  function findModule(cultureId, moduleId) {
    const culture = findCulture(cultureId);
    if (!culture) return null;

    culture.modules = Array.isArray(culture.modules) ? culture.modules : [];
    return culture.modules.find(module => module.id === moduleId) || null;
  }

  function ensureModule(cultureId, moduleData) {
    const culture = findCulture(cultureId);
    if (!culture) return null;

    culture.modules = Array.isArray(culture.modules) ? culture.modules : [];

    let module = culture.modules.find(item => item.id === moduleData.id);

    if (!module) {
      module = {
        id: moduleData.id,
        title: moduleData.title || 'Untitled Module',
        emoji: moduleData.emoji || culture.emoji || '✦',
        desc: moduleData.desc || '',
        lessons: []
      };

      culture.modules.push(module);
    }

    module.lessons = Array.isArray(module.lessons) ? module.lessons : [];
    return module;
  }

  function findLesson(id) {
    for (const culture of CULTURALVERSE_DATA.cultures) {
      for (const module of culture.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.id === id) return lesson;
        }
      }
    }

    return null;
  }

  function upsertLesson(cultureId, moduleId, lessonData) {
    const module = findModule(cultureId, moduleId);
    if (!module) return;

    module.lessons = Array.isArray(module.lessons) ? module.lessons : [];

    const existing = module.lessons.find(lesson => lesson.id === lessonData.id);

    if (existing) {
      Object.assign(existing, {
        ...lessonData,
        content: existing.content || lessonData.content || ''
      });
      return;
    }

    module.lessons.push(lessonData);
  }

  function appendContentOnce(lesson, marker, html) {
    if (!lesson || !html) return;

    lesson.content = String(lesson.content || '');

    if (lesson.content.includes(marker)) return;

    lesson.content += `\n\n<!-- ${marker} -->\n${html.trim()}\n`;
  }

  function enrichLesson(id, data) {
    const lesson = findLesson(id);
    if (!lesson) return;

    const additions = data.additions || '';
    const marker = `LKP-RICH:${id}`;

    Object.assign(lesson, {
      mana: data.mana ?? lesson.mana ?? 10,
      xp: data.xp ?? lesson.xp ?? 25,
      sceneType: data.sceneType || lesson.sceneType || lesson.heroScene?.type || undefined,
      concepts: data.concepts || lesson.concepts || [],
      sources: data.sources || lesson.sources || [],
      related: data.related || lesson.related || [],
      connections: data.connections || lesson.connections || [],
      kidVersion: data.kidVersion || lesson.kidVersion || lesson.keikiVersion || undefined
    });

    // KM·01 structure is now authored directly in base data.
    if (additions && id !== 'km-kumulipo') {
      appendContentOnce(lesson, marker, additions);
    }
  }

  const SOURCE_SETS = {
    kanakaCore: [
      {
        label: 'Queen Liliʻuokalani — The Kumulipo',
        note: 'Primary Hawaiian-language/English translation tradition for the Kumulipo.',
        sourceType: 'primary text',
        sourceConfidence: 'high confidence'
      },
      {
        label: 'Samuel M. Kamakau — Ruling Chiefs of Hawaii',
        note: 'Historical Hawaiian accounts and aliʻi genealogical context.',
        sourceType: 'historical chronicle',
        sourceConfidence: 'high confidence'
      },
      {
        label: 'Mary Kawena Pukui — Hawaiian Dictionary / ʻŌlelo resources',
        note: 'Language and cultural meaning reference.',
        sourceType: 'language reference',
        sourceConfidence: 'high confidence'
      }
    ],
    wayfinding: [
      {
        label: 'Polynesian Voyaging Society — Hōkūleʻa and Mālama Honua materials',
        note: 'Modern voyaging revival, navigation education, and wayfinding context.'
      },
      {
        label: 'Nainoa Thompson / Mau Piailug navigation teachings',
        note: 'Star compass, ocean swell reading, and non-instrument navigation.'
      }
    ],
    ecology: [
      {
        label: 'Native Hawaiian ahupuaʻa and ʻāina-based resource management studies',
        note: 'Watershed governance, food systems, and ecological design.'
      },
      {
        label: 'Loko iʻa and loʻi kalo restoration resources',
        note: 'Fishpond, taro, and community food sovereignty work.'
      }
    ],
    kemetCore: [
      {
        label: 'Pyramid Texts and Coffin Texts',
        note: 'Primary ritual and cosmological source material from ancient Kemet.',
        sourceType: 'primary text',
        sourceConfidence: 'high confidence'
      },
      {
        label: 'Memphite Theology / Shabaka Stone tradition',
        note: 'Creation through heart, tongue, speech, and Ptah.',
        sourceType: 'inscription tradition',
        sourceConfidence: 'high confidence'
      },
      {
        label: 'Egyptian wisdom literature and Maʻat texts',
        note: 'Ethics, governance, order, and proper conduct.',
        sourceType: 'wisdom literature',
        sourceConfidence: 'high confidence'
      }
    ],
    bridge: [
      {
        label: 'Cross-cultural cosmology comparison notes',
        note: 'Used for comparing pattern, not claiming identical origin.',
        sourceType: 'comparative synthesis',
        sourceConfidence: 'context-based'
      },
      {
        label: 'Living knowledge methodology',
        note: 'Treats traditions as knowledge systems carried by people, not decorative mythology.',
        sourceType: 'methodological framework',
        sourceConfidence: 'context-based'
      }
    ]
  };

  const ENRICHMENTS = {
    'km-kumulipo': {
      mana: 18,
      xp: 48,
      sceneType: 'creation',
      concepts: ['Pō', 'Ao', 'Koʻa', 'Moʻokūʻauhau', 'Kumulipo Wā 1–16', 'Sacred darkness', 'Emergence', 'Kinship ecology', 'Stewardship'],
      sources: SOURCE_SETS.kanakaCore,
      related: ['km-wakea', 'ke-nun', 'bridge-darkness', 'bridge-genealogy-ecology', 'br-cosmology-evolution', 'vd-nasadiya', 'dt-songlines-intro'],
      connections: [
        {
          cultureId: 'kemet',
          lessonId: 'ke-nun',
          axis: 'Cosmology',
          note: 'Compare Pō and Nun as generative source frameworks.'
        },
        {
          cultureId: 'bridge',
          lessonId: 'bridge-darkness',
          axis: 'Bridge',
          note: 'Use the bridge lens to compare pattern without collapsing difference.'
        },
        {
          cultureId: 'bridge',
          lessonId: 'br-cosmology-evolution',
          axis: 'Epistemology',
          note: 'Connect the 16 wā emergence sequence to bridge lessons on evolution and cosmology while preserving Hawaiian sovereignty.'
        },
        {
          cultureId: 'vedic',
          lessonId: 'vd-nasadiya',
          axis: 'Philosophy',
          note: 'Read dark generative beginning motifs in dialogue with Nasadiya questions about origin.'
        },
        {
          cultureId: 'dreamtime',
          lessonId: 'dt-songlines-intro',
          axis: 'Future Thread',
          note: 'Relate chant-memory and place-memory as living cartographies of relation.'
        }
      ],
      kidVersion: {
        summary: 'The Kumulipo teaches that life begins in deep darkness, water, heat, and relationship. It connects coral, sea life, land life, people, chiefs, and the cosmos into one family story.',
        bigIdeas: [
          'Darkness can be a sacred beginning, not something bad.',
          'People are related to the ocean, coral, plants, animals, and stars.',
          'Genealogy can be a way to remember how all life is connected.'
        ],
        vocabulary: [
          { term: 'Kumulipo', meaning: 'A Hawaiian creation chant and genealogy of life.' },
          { term: 'Pō', meaning: 'Deep darkness, night, source, and sacred beginning.' },
          { term: 'Wā', meaning: 'A period, epoch, time, or space in the chant.' }
        ],
        activity: 'Draw a spiral. At the center write Pō. Around it draw coral, sea creatures, plants, animals, people, and stars to show life unfolding.',
        reflection: [
          'Why might darkness be a beginning instead of an ending?',
          'What living thing do you feel most connected to?',
          'How can genealogy teach responsibility?'
        ]
      },
      additions: `
<reflect>
What does the Kumulipo teach about darkness as source rather than emptiness?
How does genealogy become a form of ecological memory?
What responsibility comes from knowing that human life is connected to coral, sea, plants, animals, and sky?
</reflect>

<timeline>
Early 18th century::Traditional chiefly composition and transmission context associated with Kalaninuiamamao
19th century::King Kalākaua preserves the chant in writing
1897::Queen Liliʻuokalani publishes her English translation while imprisoned after the overthrow
20th century onward::The Kumulipo continues to be studied as genealogy, cosmology, ecological memory, and living Hawaiian knowledge
</timeline>

<activity>
Build a relationship map from Pō to coral, from coral to sea life, from sea life to land, and from land to people. The goal is not to draw a family tree only for humans, but to show how the chant frames life itself as kinship.
</activity>

<teacher-note>
A strong teaching move is to ask learners to compare a standard Western timeline of evolution with the Kumulipo's sequence of unfolding life, while also reminding them that the Kumulipo is not reducible to modern biology. It is a sacred Hawaiian knowledge system with its own integrity.
</teacher-note>

<historian-note>
The Kumulipo was also used in aliʻi contexts to affirm chiefly genealogy and authority. That political use matters, but it should not be mistaken for the whole purpose of the chant. Its deeper function preserves cosmology, kinship, ecological relationship, sacred order, and cultural memory.
</historian-note>

<h4>Kumulipo Wā 1–16 Teaching Map (ʻŌlelo + English)</h4>
<p>This guide offers a teaching map of all 16 wā with practical English meaning alongside Hawaiian naming. It is a study companion, not a replacement for full chant recitation and line-level translation traditions.</p>

<ul>
<li><strong>Wā 1 — Wā o ke Koʻa (Era of Coral)</strong> · First life in deep pō: coral and earliest sea forms. <em>English lens:</em> life begins in oceanic darkness.</li>
<li><strong>Wā 2 — Wā o nā Mea o ke Kai (Era of Sea Creatures)</strong> · Marine multiplicity expands. <em>English lens:</em> diversification of aquatic life.</li>
<li><strong>Wā 3 — Wā o nā Limu a me nā Mea Ulu o ke Kai (Sea Plants and Growth)</strong> · Algae and marine growth systems. <em>English lens:</em> ecological foundations and food webs.</li>
<li><strong>Wā 4 — Wā o nā Mea Kolo a me nā Mea Pēlā (Creeping and Small Forms)</strong> · Transitional and interlinked species. <em>English lens:</em> complexity through relation.</li>
<li><strong>Wā 5 — Wā o nā Iʻa Nui (Larger Sea Beings)</strong> · Expanded marine orders and paired emergence. <em>English lens:</em> patterned increase in scale.</li>
<li><strong>Wā 6 — Wā o nā Manu Kai a me nā Mea Pēlā (Sea Birds and Boundary Crossers)</strong> · Life crossing air-water thresholds. <em>English lens:</em> new ecological niches.</li>
<li><strong>Wā 7 — Wā o nā Mea Ulu o ka ʻĀina (Land Growth)</strong> · Plant worlds of land become central. <em>English lens:</em> terrestrial systems stabilize.</li>
<li><strong>Wā 8 — Wā o nā Holoholona o ka ʻĀina (Land Animals)</strong> · Land life matures in layered relations. <em>English lens:</em> increasing terrestrial complexity.</li>
<li><strong>Wā 9 — Wā o ka Huli i ke Ao (Turning Toward Light)</strong> · Transition from deep pō toward ao. <em>English lens:</em> cosmological threshold and emergence.</li>
<li><strong>Wā 10 — Wā o nā Kūpuna Akua (Ancestral Divine Genealogies)</strong> · Sacred genealogical ordering. <em>English lens:</em> cosmos expressed through lineage.</li>
<li><strong>Wā 11 — Wā o nā Hanauna Kiʻekiʻe (High Genealogical Lines)</strong> · Intensified chiefly/ancestral sequencing. <em>English lens:</em> social order linked to cosmic order.</li>
<li><strong>Wā 12 — Wā o nā Pili Aliʻi (Chiefly Relational Lines)</strong> · Governance and genealogy intertwine. <em>English lens:</em> authority as inherited kuleana.</li>
<li><strong>Wā 13 — Wā o ka Hānau Moʻokūʻauhau (Genealogical Birth Lines)</strong> · Human lines in sacred continuity. <em>English lens:</em> humans placed inside, not outside, creation.</li>
<li><strong>Wā 14 — Wā o ka Hoʻonui Hanauna (Expansion of Descendant Lines)</strong> · Social worlds widen through kinship. <em>English lens:</em> peoplehood as ecological relationship.</li>
<li><strong>Wā 15 — Wā o ke Kauoha a me ke Kuleana (Charge and Responsibility)</strong> · Lineage carries ethical obligation. <em>English lens:</em> memory becomes duty.</li>
<li><strong>Wā 16 — Wā o ke Ao Kanaka (Human Realm in Light)</strong> · Genealogy culminates in living responsibility. <em>English lens:</em> to be human is to steward relations across land, sea, and sky.</li>
</ul>

<callout type="bridge"><strong>Many-level reading of the Kumulipo:</strong> (1) Genealogical: a sacred lineage text; (2) Ecological: life unfolds through relationship; (3) Political-historical: aliʻi legitimacy and kuleana; (4) Philosophical: darkness as fertile source; (5) Scientific dialogue: meaningful resonance with staged emergence, evolution, and early hot dense cosmology, while remaining a distinct Hawaiian knowledge system rather than a pre-modern physics manual.</callout>

<compare left="Scientific Conversation" right="Cultural Integrity">
Possible conversation points: staged emergence of complexity, oceanic origins of life, hot primordial conditions, non-linear relational systems (sometimes compared metaphorically with network, quantum, or string thinking). || Essential boundary: Kumulipo is not reducible to Big Bang theory, evolution, quantum mechanics, or string theory. It is a sovereign chant tradition with its own epistemology, language, protocol, and sacred authority.
</compare>

<activity>
Bridge exercise: create a four-column notebook page titled Wā, Hawaiian phrase/theme, English meaning, and multi-level interpretation (ecological, genealogical, philosophical, scientific dialogue). Fill all 16 wā and then link at least three entries to bridge lessons without collapsing distinct traditions.
</activity>

<h4>Richer Wā Cluster Dataset (Study Layer)</h4>
<p>Use this as a learning scaffold for deep study circles, annotation work, and chant dialogue sessions.</p>

<twocol left="Pō Cluster (Wā 1–8)" right="Ao Cluster (Wā 9–16)">
Primary movement: marine emergence, paired life forms, ecological relation, and staged complexity from sea toward land. Suggested annotations: oceanic birth, biodiversity emergence, relational duality, continuity of life systems.||Primary movement: transition to light, genealogical ordering, chiefly lines, and ethical kuleana. Suggested annotations: lineage and governance, memory as duty, human responsibility as stewardship.
</twocol>

<timeline>
Wā 1–2::Earliest marine emergence and diversification in deep Pō
Wā 3–4::Foundational growth systems and small life interrelations
Wā 5–6::Larger sea beings and cross-boundary life (sea-sky links)
Wā 7–8::Land plant and animal stabilization in relational order
Wā 9–12::Transition to Ao and sacred genealogical structuring
Wā 13–16::Human lineage, chiefly responsibility, and stewardship charge
</timeline>

<teacher-note>
For each wā, ask learners to produce a bilingual annotation card with: (1) ʻŌlelo phrase, (2) direct English meaning, (3) ecological reading, (4) genealogical reading, (5) ethical implication for today. This creates a richer data archive for class-led interpretation.
</teacher-note>

<reflect>
Which wā feels most urgent for the present ecological moment, and why?
How does bilingual study change the meaning you receive from each wā?
What changes when genealogy is understood as responsibility instead of status?
</reflect>
`
    },

    'km-wakea': {
      mana: 12,
      xp: 32,
      sceneType: 'balance',
      concepts: ['Wākea', 'Papahānaumoku', 'Hāloa', 'Kalo', 'Aloha ʻāina', 'Kinship ecology'],
      sources: SOURCE_SETS.kanakaCore,
      related: ['km-kumulipo', 'km-loikalo', 'km-ahupuaa'],
      kidVersion: {
        summary: 'This lesson teaches that sky, earth, islands, kalo, and people are family. Kalo is remembered as an elder sibling, so caring for kalo means caring for family.',
        bigIdeas: [
          'The land is not just property; it is family.',
          'Food can carry genealogy and responsibility.',
          'Caring for kalo teaches caring for people.'
        ],
        vocabulary: [
          { term: 'Wākea', meaning: 'Sky father, wide expanse.' },
          { term: 'Papahānaumoku', meaning: 'Earth mother, she who gives birth to islands.' },
          { term: 'Hāloa', meaning: 'Ancestral child connected to kalo and humanity.' }
        ],
        activity: 'Draw kalo as an older sibling. Around it draw the people, water, soil, and sun that help it live.',
        reflection: [
          'How would you treat food differently if it was your elder sibling?',
          'What does it mean to love land as family?'
        ]
      },
      additions: `
<reflect>
How does the story of Hāloa change the meaning of agriculture?
What does this genealogy teach about food sovereignty and family obligation?
How is aloha ʻāina different from simply liking beautiful places?
</reflect>

<compare left="Kalo as Crop" right="Kalo as Elder Sibling">
A crop is treated as a resource measured by yield, price, and production. || An elder sibling is treated through care, gratitude, relationship, restraint, and responsibility.
</compare>

<activity>
Create a two-column chart comparing modern industrial agriculture with the Hāloa relationship to kalo. Focus on water, soil, labor, gratitude, waste, and responsibility.
</activity>
`
    },

    'km-starcompass': {
      mana: 14,
      xp: 38,
      sceneType: 'starcompass',
      concepts: ['Hawaiian star compass', 'Hōkūleʻa', 'Zenith star', 'Star houses', 'Swell reading', 'Kilokilo hōkū'],
      sources: SOURCE_SETS.wayfinding,
      related: ['km-hokuleaa', 'bridge-navigation-astronomy', 'km-mahina'],
      kidVersion: {
        summary: 'Navigators used the stars, waves, birds, clouds, and wind to find islands across the ocean without modern tools.',
        bigIdeas: [
          'The sky can be a map.',
          'The ocean has patterns that can be read.',
          'A navigator must pay attention with the whole body.'
        ],
        vocabulary: [
          { term: 'Hōkūleʻa', meaning: 'Arcturus, the zenith star of Hawaiʻi.' },
          { term: 'Star house', meaning: 'A direction on the horizon where stars rise or set.' },
          { term: 'Wayfinding', meaning: 'Navigation using natural signs instead of modern instruments.' }
        ],
        activity: 'At sunset or night, notice one bright star. Ask where it rises or sets. Imagine using that star as a direction marker.',
        reflection: [
          'What natural signs do you already use without thinking?',
          'Why would patience matter for a navigator?'
        ]
      },
      additions: `
<reflect>
What skills does non-instrument navigation require beyond memorizing stars?
How does the star compass show that science can be carried through oral tradition and practice?
What does wayfinding teach about trust, observation, and responsibility?
</reflect>

<activity>
Choose one star or direction marker and create a simple observation log for three nights. Record where it appears, how high it is, and what direction it seems to move.
</activity>

<teacher-note>
This lesson works well with a hands-on compass activity: have learners mark cardinal directions, then add rising and setting points of familiar stars or the sun at different times of year.
</teacher-note>
`
    },

    'km-hokuleaa': {
      mana: 12,
      xp: 34,
      sceneType: 'voyage',
      concepts: ['Hōkūleʻa', 'Mau Piailug', 'Nainoa Thompson', 'Mālama Honua', 'Cultural restoration'],
      sources: SOURCE_SETS.wayfinding,
      related: ['km-starcompass', 'bridge-navigation-astronomy'],
      kidVersion: {
        summary: 'Hōkūleʻa is a voyaging canoe that helped Hawaiians remember and revive star navigation. It showed the world that Polynesian navigators crossed the ocean with skill and intention.',
        bigIdeas: [
          'A canoe can carry culture, not just people.',
          'Learning from elders can restore knowledge.',
          'A voyage can heal identity.'
        ],
        vocabulary: [
          { term: 'Hōkūleʻa', meaning: 'The voyaging canoe named after Arcturus.' },
          { term: 'Mālama Honua', meaning: 'To care for the Earth.' }
        ],
        activity: 'Design your own symbolic canoe. Label what knowledge, values, and responsibilities it carries.',
        reflection: [
          'What would you carry on a knowledge canoe?',
          'Why is proving ancestral knowledge important?'
        ]
      }
    },

    'km-ahupuaa': {
      mana: 14,
      xp: 38,
      sceneType: 'watershed',
      concepts: ['Ahupuaʻa', 'Mauka', 'Makai', 'Watershed', 'Resource governance', 'Mālama ʻāina'],
      sources: SOURCE_SETS.ecology,
      related: ['km-loikalo', 'km-malamaina', 'bridge-genealogy-ecology'],
      kidVersion: {
        summary: 'An ahupuaʻa is a land division that usually goes from mountain to sea. It gives a community access to forest, water, farms, coast, and ocean.',
        bigIdeas: [
          'Water connects mountain, land, and sea.',
          'A community needs many ecosystems to live well.',
          'Good governance protects the whole system.'
        ],
        vocabulary: [
          { term: 'Mauka', meaning: 'Toward the mountain.' },
          { term: 'Makai', meaning: 'Toward the ocean.' },
          { term: 'Ahupuaʻa', meaning: 'A Hawaiian land division often running from mountain to sea.' }
        ],
        activity: 'Draw a mountain-to-sea map. Add forest, stream, loʻi, village, fishpond, reef, and open ocean.',
        reflection: [
          'Why should mountain and ocean be managed together?',
          'What happens downstream when people do not care for upstream?'
        ]
      },
      additions: `
<reflect>
How does the ahupuaʻa challenge modern boundaries that separate land, water, agriculture, and ocean management?
What would change if every community had to understand where its water comes from and where its waste goes?
How does the ahupuaʻa express governance as ecological responsibility?
</reflect>

<activity>
Map your own neighborhood as if it were an ahupuaʻa. Identify high ground, water flow, food sources, waste paths, gathering places, and the nearest ocean or watershed outlet.
</activity>
`
    },

    'km-loikalo': {
      mana: 14,
      xp: 38,
      sceneType: 'healing',
      concepts: ['Loʻi kalo', 'Loko iʻa', 'ʻAuwai', 'Mākāhā', 'Food sovereignty', 'Circular nutrients'],
      sources: SOURCE_SETS.ecology,
      related: ['km-wakea', 'km-ahupuaa', 'km-malamaina'],
      kidVersion: {
        summary: 'Loʻi kalo and loko iʻa are Hawaiian food systems. They use flowing water, careful design, and community work to grow kalo and fish.',
        bigIdeas: [
          'Food systems can be designed to feed people and protect nature.',
          'Water is shared and must be cared for.',
          'Community work keeps the system alive.'
        ],
        vocabulary: [
          { term: 'Loʻi', meaning: 'A wetland taro patch.' },
          { term: 'Loko iʻa', meaning: 'A Hawaiian fishpond.' },
          { term: 'ʻAuwai', meaning: 'An irrigation channel that carries water.' }
        ],
        activity: 'Build a simple diagram showing water entering a loʻi, feeding kalo, then continuing downstream.',
        reflection: [
          'Why should water keep moving?',
          'What does food teach about responsibility?'
        ]
      }
    },

    'km-olelo': {
      mana: 12,
      xp: 34,
      sceneType: 'constellation',
      concepts: ['ʻŌlelo Hawaiʻi', 'Place names', 'Language revitalization', 'Pūnana Leo', 'Memory'],
      sources: SOURCE_SETS.kanakaCore,
      related: ['km-hula', 'km-protocol', 'km-kumulipo'],
      kidVersion: {
        summary: 'ʻŌlelo Hawaiʻi is the Hawaiian language. It carries stories, place names, relationships, and cultural memory.',
        bigIdeas: [
          'Language carries knowledge.',
          'Place names can teach history and ecology.',
          'Reviving language helps revive identity.'
        ],
        vocabulary: [
          { term: 'ʻŌlelo', meaning: 'Language, speech, word, or to speak.' },
          { term: 'Pūnana Leo', meaning: 'Language nest; Hawaiian immersion preschool movement.' }
        ],
        activity: 'Choose one Hawaiian place name and research what it means. Draw what the name describes.',
        reflection: [
          'Why do place names matter?',
          'What words from your family carry memory?'
        ]
      }
    },

    'km-hula': {
      mana: 12,
      xp: 34,
      sceneType: 'constellation',
      concepts: ['Hula kahiko', 'Hula ʻauana', 'Kumu hula', 'Embodied knowledge', 'Mele'],
      sources: SOURCE_SETS.kanakaCore,
      related: ['km-olelo', 'km-protocol'],
      kidVersion: {
        summary: 'Hula is a way of carrying knowledge through movement, chant, rhythm, story, and discipline.',
        bigIdeas: [
          'The body can remember knowledge.',
          'Movement can tell history.',
          'Learning sacred arts requires respect and practice.'
        ],
        vocabulary: [
          { term: 'Kumu hula', meaning: 'A master teacher and source of hula knowledge.' },
          { term: 'Mele', meaning: 'Song, chant, or poetic composition.' }
        ],
        activity: 'Choose one natural element, such as rain or wind, and create three respectful hand motions to represent it.',
        reflection: [
          'How can movement tell a story?',
          'Why does practice matter in cultural arts?'
        ]
      }
    },

    'km-laau': {
      mana: 16,
      xp: 42,
      sceneType: 'healing',
      concepts: ['Laʻau lapaʻau', 'Kahuna lapaʻau', 'Plant medicine', 'Pule', 'Kapu', 'Healing relationship'],
      sources: SOURCE_SETS.kanakaCore,
      related: ['km-malamaina', 'ke-medicine'],
      kidVersion: {
        summary: 'Laʻau lapaʻau is Hawaiian plant medicine. It teaches that healing includes plants, prayer, respect, family, land, and responsibility.',
        bigIdeas: [
          'Plants are living relatives, not just materials.',
          'Healing includes body, spirit, family, and place.',
          'Medicine requires respect and careful learning.'
        ],
        vocabulary: [
          { term: 'Laʻau', meaning: 'Plant, tree, wood, or medicine.' },
          { term: 'Lapaʻau', meaning: 'Medicine or healing practice.' },
          { term: 'Pule', meaning: 'Prayer.' }
        ],
        activity: 'Pick one safe, common plant you know. Draw it and list three respectful questions you would ask before using it as medicine.',
        reflection: [
          'Why does medicine begin with respect?',
          'What does it mean to ask permission from the living world?'
        ]
      }
    },

    'ke-nun': {
      mana: 14,
      xp: 38,
      sceneType: 'primordial',
      concepts: ['Nun', 'Primordial waters', 'Emergence', 'Atum', 'Creation before form'],
      sources: SOURCE_SETS.kemetCore,
      related: ['km-kumulipo', 'bridge-darkness', 'ke-ennead'],
      connections: [
        {
          cultureId: 'kanaka',
          lessonId: 'km-kumulipo',
          axis: 'Creation',
          note: 'Read with Kumulipo openings to contrast emergence language.'
        },
        {
          cultureId: 'bridge',
          lessonId: 'bridge-darkness',
          axis: 'Bridge',
          note: 'Follow synthesis threads while preserving each source context.'
        },
        {
          cultureId: 'dogon',
          axis: 'Future Thread',
          note: 'Future expansion: compare sky-water origin models and symbolism.'
        }
      ],
      kidVersion: {
        summary: 'Nun is the deep primordial water before creation. In Kemetic thought, the world emerges from this hidden watery source.',
        bigIdeas: [
          'Water can symbolize the beginning before form.',
          'Creation can emerge from hidden depth.',
          'Many traditions imagine the beginning as dark, deep, and watery.'
        ],
        vocabulary: [
          { term: 'Nun', meaning: 'The primordial waters before creation.' },
          { term: 'Atum', meaning: 'A creator figure associated with emergence from Nun.' }
        ],
        activity: 'Draw a dark blue circle for Nun. From it, draw the first mound, sun, or life emerging.',
        reflection: [
          'Why might water be a symbol for beginning?',
          'How is Nun similar to and different from Pō?'
        ]
      },
      additions: `
<reflect>
What does Nun teach about potential before visible form?
How does the image of primordial water compare with Hawaiian Pō and deep ocean darkness?
Why do many knowledge systems place creation in depth rather than empty space?
</reflect>

<compare left="Pō / Kumulipo" right="Nun / Kemet">
Pō emphasizes generative darkness, unfolding life, genealogy, and deep oceanic source. || Nun emphasizes primordial waters, unformed potential, emergence, and the first acts of cosmic ordering.
</compare>
`
    },

    'ke-ennead': {
      mana: 12,
      xp: 34,
      sceneType: 'constellation',
      concepts: ['Ennead', 'Atum', 'Shu', 'Tefnut', 'Geb', 'Nut', 'Osiris', 'Isis', 'Set', 'Nephthys'],
      sources: SOURCE_SETS.kemetCore,
      related: ['ke-nun', 'ke-ptah', 'ke-duat'],
      kidVersion: {
        summary: 'The Ennead is a group of nine important divine principles in one Kemetic creation tradition. They show how air, moisture, sky, earth, life, death, and renewal are connected.',
        bigIdeas: [
          'Creation unfolds through relationships.',
          'The divine family represents forces of nature and society.',
          'Stories can organize complex ideas.'
        ],
        vocabulary: [
          { term: 'Ennead', meaning: 'A group of nine divine principles.' },
          { term: 'Nut', meaning: 'Sky.' },
          { term: 'Geb', meaning: 'Earth.' }
        ],
        activity: 'Draw a family tree of natural forces: air, moisture, sky, earth, life, death, and renewal.',
        reflection: [
          'Why might people explain nature through family relationships?',
          'Which part of the Ennead feels most connected to daily life?'
        ]
      }
    },

    'ke-ptah': {
      mana: 13,
      xp: 36,
      sceneType: 'constellation',
      concepts: ['Ptah', 'Heart', 'Tongue', 'Speech', 'Craft', 'Memphite Theology'],
      sources: SOURCE_SETS.kemetCore,
      related: ['ke-medunetjer', 'km-olelo', 'bridge-word-creation'],
      kidVersion: {
        summary: 'The Ptah tradition teaches creation through heart and speech. What is imagined inwardly becomes real through words and making.',
        bigIdeas: [
          'Words can shape reality.',
          'Thought, speech, and craft are connected.',
          'Creation can be understood as intelligence becoming form.'
        ],
        vocabulary: [
          { term: 'Ptah', meaning: 'A creator associated with craft, heart, tongue, and making.' },
          { term: 'Memphite Theology', meaning: 'A Kemetic creation teaching centered on Ptah.' }
        ],
        activity: 'Think of one kind sentence. Say it aloud. Write what changed when the thought became speech.',
        reflection: [
          'Why do words matter?',
          'How can speech create or damage relationship?'
        ]
      }
    },

    'ke-maat': {
      mana: 15,
      xp: 40,
      sceneType: 'balance',
      concepts: ['Maʻat', 'Truth', 'Balance', 'Justice', 'Feather', 'Ethics', 'Cosmic order'],
      sources: SOURCE_SETS.kemetCore,
      related: ['bridge-aloha-maat', 'ke-maat-politics', 'km-protocol'],
      kidVersion: {
        summary: 'Maʻat means truth, balance, justice, and right order. It teaches that our actions should help the world stay in harmony.',
        bigIdeas: [
          'Truth and balance are daily choices.',
          'Justice is part of cosmic order.',
          'Good leadership must serve balance.'
        ],
        vocabulary: [
          { term: 'Maʻat', meaning: 'Truth, justice, balance, harmony, and cosmic order.' },
          { term: 'Isfet', meaning: 'Disorder, falsehood, harm, and imbalance.' }
        ],
        activity: 'Draw a feather on one side of a scale. On the other side write one action that helps create balance.',
        reflection: [
          'What does balance look like in your family?',
          'How can one truthful action help the community?'
        ]
      },
      additions: `
<reflect>
How does Maʻat make ethics larger than personal behavior?
What happens when leadership serves itself instead of cosmic balance?
How can Maʻat be compared with pono without flattening either tradition?
</reflect>

<activity>
Make a Maʻat decision chart: write one hard choice, list actions that create balance, and list actions that create isfet or disorder.
</activity>
`
    },

    'ke-maat-politics': {
      mana: 13,
      xp: 36,
      sceneType: 'balance',
      concepts: ['Kingship', 'Governance', 'Justice', 'Temple economy', 'Public order', 'Maʻat'],
      sources: SOURCE_SETS.kemetCore,
      related: ['ke-maat', 'km-kapu-pono', 'bridge-aloha-maat'],
      kidVersion: {
        summary: 'This lesson teaches that a ruler was supposed to protect Maʻat. Leadership was not only power; it was responsibility to truth, balance, and the people.',
        bigIdeas: [
          'Leadership should serve order and justice.',
          'Power without responsibility creates disorder.',
          'A good society needs ethical structure.'
        ],
        vocabulary: [
          { term: 'Governance', meaning: 'How a society makes decisions and keeps order.' },
          { term: 'Justice', meaning: 'Fairness and right relationship.' }
        ],
        activity: 'Write three rules a leader should follow to protect balance in a community.',
        reflection: [
          'What makes someone a good leader?',
          'Why should leaders be accountable?'
        ]
      }
    },

    'ke-medunetjer': {
      mana: 12,
      xp: 34,
      sceneType: 'constellation',
      concepts: ['Medu Netjer', 'Hieroglyphs', 'Sacred writing', 'Seshat', 'Memory', 'Ritual language'],
      sources: SOURCE_SETS.kemetCore,
      related: ['ke-ptah', 'ke-seshat', 'km-olelo'],
      kidVersion: {
        summary: 'Medu Netjer means words of the gods. Kemetic writing used signs, images, sounds, and sacred meaning to preserve knowledge.',
        bigIdeas: [
          'Writing can be sacred technology.',
          'Symbols can carry sound and meaning.',
          'Memory needs careful keepers.'
        ],
        vocabulary: [
          { term: 'Medu Netjer', meaning: 'Words of the gods; sacred Kemetic writing.' },
          { term: 'Scribe', meaning: 'A trained writer and knowledge keeper.' }
        ],
        activity: 'Create three symbols for values you care about: truth, family, courage, kindness, or balance.',
        reflection: [
          'Why do symbols help people remember?',
          'What should never be forgotten?'
        ]
      }
    },

    'ke-medicine': {
      mana: 15,
      xp: 40,
      sceneType: 'healing',
      concepts: ['Imhotep', 'Edwin Smith Papyrus', 'Ebers Papyrus', 'Diagnosis', 'Surgery', 'Healing science'],
      sources: SOURCE_SETS.kemetCore,
      related: ['km-laau', 'ke-seshat'],
      kidVersion: {
        summary: 'Kemetic medicine included careful observation, diagnosis, treatment, surgery, plant remedies, and spiritual care.',
        bigIdeas: [
          'Good healing begins with careful observation.',
          'Ancient science could be very advanced.',
          'Healing can include body, mind, and spirit.'
        ],
        vocabulary: [
          { term: 'Diagnosis', meaning: 'Figuring out what kind of illness or injury someone has.' },
          { term: 'Imhotep', meaning: 'A famous Kemetic figure remembered for wisdom, architecture, and healing.' }
        ],
        activity: 'Practice observation: look at a leaf, shell, or stone for two minutes and write five details you did not notice at first.',
        reflection: [
          'Why does careful observation matter in medicine?',
          'How can science and spirit both support healing?'
        ]
      }
    },

    'bridge-darkness': {
      mana: 14,
      xp: 38,
      sceneType: 'primordial',
      concepts: ['Pō', 'Nun', 'Primordial water', 'Darkness', 'Potential', 'Creation'],
      sources: SOURCE_SETS.bridge,
      related: ['km-kumulipo', 'ke-nun', 'bridge-pairs'],
      connections: [
        {
          cultureId: 'kanaka',
          lessonId: 'km-kumulipo',
          axis: 'Source',
          note: 'Return to Hawaiian source chant context.'
        },
        {
          cultureId: 'kemet',
          lessonId: 'ke-nun',
          axis: 'Source',
          note: 'Return to Kemetic scripture context.'
        },
        {
          cultureId: 'vedic',
          axis: 'Future Thread',
          note: 'Future expansion: compare primordial waters and speech-creation motifs.'
        }
      ],
      kidVersion: {
        summary: 'Both Hawaiian and Kemetic traditions describe beginnings through deep darkness or deep water. These are not empty places; they are full of possibility.',
        bigIdeas: [
          'Darkness can mean potential.',
          'Water can mean source and beginning.',
          'Cultures can share patterns while staying unique.'
        ],
        vocabulary: [
          { term: 'Pō', meaning: 'Deep generative darkness in Hawaiian thought.' },
          { term: 'Nun', meaning: 'Primordial waters in Kemetic thought.' }
        ],
        activity: 'Use two colors, deep blue and black, to draw a beginning place full of hidden life.',
        reflection: [
          'Why do beginnings sometimes look quiet or hidden?',
          'How can two cultures share a pattern but not be the same?'
        ]
      },
      additions: `
<h4>Bridge Expansion: Kumulipo, Evolution, and Contemporary Cosmology</h4>
<p>The bridge work here is comparative and careful: we are not claiming that Hawaiian or Kemetic traditions were secretly doing modern physics. We are recognizing that different knowledge systems asked similar origin questions and preserved sophisticated pattern-language about emergence, relation, and order.</p>

<twocol left="Kumulipo Sequence" right="Scientific Dialogue Points">Wā 1–8 move through oceanic beginnings, relational pairings, and increasing life complexity before the transition to human genealogical lines in Wā 9–16. The chant encodes staged unfolding, interdependence, and continuity between humans and earlier life forms.||Potential dialogue points include: evolutionary staging (simple to complex life forms), deep-time emergence, and the insight that humans are continuous with earlier life rather than separate from it.</twocol>

<twocol left="Pō / Nun Intuition" right="Big Bang-Era Conversation">Both traditions preserve a deep-source beginning: dark, fertile, undifferentiated potential.||Modern cosmology describes an early hot dense state, expansion, and later structure formation. The resonance is in shared inquiry about origins under extreme conditions, not in literal equation of terms.</twocol>

<compare left="Quantum/String Metaphor (Use Carefully)" right="What We Must Not Do">
You can use metaphorical parallels: hidden structure, relation before visible form, pattern-like emergence, and reality described through unseen dynamics. || Do not claim the Kumulipo predicts quantum field equations or string models. Do not flatten chant traditions into modern theory vocabulary. Keep comparison dialogical, not extractive.
</compare>

<callout type="bridge"><strong>Bridge protocol:</strong> Similarity is a conversation starter, not a proof of sameness. The goal is mutual illumination with cultural specificity intact. Keep Hawaiian terms in Hawaiian context, Kemetic terms in Kemetic context, and scientific terms in scientific method context.</callout>

<activity>
Use three columns: (1) Kumulipo / Nun source language, (2) scientific concept family (evolution, Big Bang cosmology, quantum, string), (3) boundary statement. Fill each row with one resonance and one non-equivalence sentence.
</activity>
`
    },

    'bridge-pairs': {
      mana: 12,
      xp: 34,
      sceneType: 'bridge',
      concepts: ['Complementarity', 'Paired forces', 'Male/female pairing', 'Sky/earth', 'Order/emergence'],
      sources: SOURCE_SETS.bridge,
      related: ['km-wakea', 'ke-ennead', 'bridge-darkness'],
      kidVersion: {
        summary: 'Many creation stories use pairs: sky and earth, dark and light, water and land, order and movement. Pairs help explain balance.',
        bigIdeas: [
          'Opposites can work together.',
          'Balance does not always mean sameness.',
          'Creation often happens through relationship.'
        ],
        vocabulary: [
          { term: 'Complementary', meaning: 'Different parts that work together.' },
          { term: 'Pair', meaning: 'Two connected things.' }
        ],
        activity: 'List five pairs in nature: day/night, ocean/land, seed/rain. Explain how each pair works together.',
        reflection: [
          'What pair helps you understand balance?',
          'Can difference be a strength?'
        ]
      }
    },

    'bridge-aloha-maat': {
      mana: 16,
      xp: 42,
      sceneType: 'balance',
      concepts: ['Aloha', 'Maʻat', 'Pono', 'Ethics', 'Relationship', 'Cosmic alignment'],
      sources: SOURCE_SETS.bridge,
      related: ['ke-maat', 'km-kapu-pono', 'km-malamaina'],
      kidVersion: {
        summary: 'Aloha and Maʻat both teach that people should live in right relationship. They are not the same word, but both connect ethics, balance, and responsibility.',
        bigIdeas: [
          'Aloha is a way of meeting life with care and responsibility.',
          'Maʻat is truth, justice, and balance.',
          'Both teach that actions affect the whole world.'
        ],
        vocabulary: [
          { term: 'Aloha', meaning: 'Presence, compassion, breath, love, and right relationship.' },
          { term: 'Maʻat', meaning: 'Truth, balance, justice, and cosmic order.' }
        ],
        activity: 'Write one action that shows aloha. Write one action that shows Maʻat. Circle what they share.',
        reflection: [
          'How can kindness be a form of order?',
          'How can truth be a form of love?'
        ]
      },
      additions: `
<reflect>
Where do Aloha and Maʻat overlap, and where should they remain distinct?
How can comparison become respectful rather than extractive?
What does it mean to build technology from ethics instead of adding ethics later?
</reflect>

<teacher-note>
When teaching this comparison, emphasize that resonance does not prove sameness. The goal is to recognize patterns of wisdom while protecting cultural specificity.
</teacher-note>
`
    },

    'br-cosmology-evolution': {
      mana: 16,
      xp: 44,
      sceneType: 'cosmology',
      concepts: ['Kumulipo', 'Evolution', 'Big Bang', 'Emergence', 'Scale', 'Genealogy', 'Time', 'Complexity'],
      sources: SOURCE_SETS.bridge,
      related: ['km-kumulipo', 'ke-nun', 'bridge-darkness'],
      kidVersion: {
        summary: 'The Kumulipo traces how life unfolds step by step: coral, sea creatures, plants, land animals, people. Science shows that life evolves the same way. The universe unfolds the same way too — from simple energy to complex galaxies to life. All these stories use the same pattern: simple things combine to make complicated things.',
        bigIdeas: [
          'Creation unfolds in stages, getting more complex.',
          'The same pattern appears at different sizes: atoms to cells to organisms to galaxies.',
          'Hawaiian genealogy, evolution, and cosmic history are different stories about the same pattern.',
          'Complexity emerges from simpler parts following simple rules.'
        ],
        vocabulary: [
          { term: 'Genealogy', meaning: 'A family tree; where you come from.' },
          { term: 'Evolution', meaning: 'How life changes and becomes more complex over time.' },
          { term: 'Emergence', meaning: 'New things appearing that were not there before.' },
          { term: 'Wā', meaning: 'An epoch or age in Hawaiian tradition.' }
        ],
        activity: `<activity>
Create three timelines on separate paper: one for the Kumulipo (coral to humans), one for evolution (simple life to humans), one for the universe (Big Bang to galaxies). Compare them. What's the same? What's different? Is it the pattern or the details?
</activity>`,
        reflection: `<reflect>
The Kumulipo, evolution, and the Big Bang are not the same story. But they describe the same pattern happening at different scales and in different ways. Can something be both true and different at the same time?
</reflect>`
      }
    },

    'dg-sirius-triplet': {
      mana: 11,
      xp: 31,
      sceneType: 'astronomy',
      concepts: ['Sirius system', 'Invisible companions', 'Dogon astronomy', 'Hidden realities', 'Dark matter'],
      sources: SOURCE_SETS.kemet,
      related: ['vd-vedic-astronomy', 'dt-celestial-navigation']
    },

    'dg-ammas-world': {
      mana: 10,
      xp: 28,
      sceneType: 'cosmology',
      concepts: ['Amma', 'Creator principle', 'Sacred geometry', 'Emergence', 'Self-organization'],
      sources: SOURCE_SETS.kemet,
      related: ['dg-sirius-triplet', 'vd-nasadiya']
    },

    'dg-syncretism': {
      mana: 9,
      xp: 26,
      sceneType: 'epistemology',
      concepts: ['Oral transmission', 'Knowledge systems', 'Precision', 'Cultural knowledge', 'Bias'],
      sources: SOURCE_SETS.kemet,
      related: ['dt-songlines-intro']
    },

    'vd-nasadiya': {
      mana: 12,
      xp: 34,
      sceneType: 'philosophy',
      concepts: ['Creation', 'Non-being', 'Brahman', 'Quantum potential', 'Emergence', 'Uncertainty'],
      sources: SOURCE_SETS.bridge,
      related: ['km-kumulipo', 'br-darkness', 'dg-ammas-world']
    },

    'vd-brahma-cycles': {
      mana: 13,
      xp: 38,
      sceneType: 'cosmology',
      concepts: ['Yugas', 'Dharma', 'Cosmic cycles', 'Time scales', 'Entropy', 'Renewal'],
      sources: SOURCE_SETS.bridge,
      related: ['vd-nasadiya', 'km-kumulipo']
    },

    'vd-vedic-astronomy': {
      mana: 11,
      xp: 32,
      sceneType: 'astronomy',
      concepts: ['Decimal system', 'Zero', 'Heliocentric', 'Mathematics', 'Ancient knowledge'],
      sources: SOURCE_SETS.kemet,
      related: ['dg-sirius-triplet', 'dt-celestial-navigation']
    },

    'dt-songlines-intro': {
      mana: 13,
      xp: 37,
      sceneType: 'narrative',
      concepts: ['Songlines', 'Dreaming', 'Country', 'Oral geography', 'Knowledge system', 'Sacred places'],
      sources: SOURCE_SETS.kemet,
      related: ['dt-celestial-navigation', 'dt-country-consciousness']
    },

    'dt-celestial-navigation': {
      mana: 11,
      xp: 31,
      sceneType: 'astronomy',
      concepts: ['Navigation', 'Stars', 'Constellations', 'Pleiades', 'Southern Cross', 'Seasonal markers'],
      sources: SOURCE_SETS.kemet,
      related: ['dt-songlines-intro', 'vd-vedic-astronomy', 'dg-sirius-triplet']
    },

    'dt-country-consciousness': {
      mana: 12,
      xp: 34,
      sceneType: 'philosophy',
      concepts: ['Country', 'Kinship', 'Custodianship', 'Living systems', 'Reciprocal relationship', 'Ethics'],
      sources: SOURCE_SETS.kemet,
      related: ['dt-songlines-intro', 'br-aloha-maat']
    }
  };

  Object.entries(ENRICHMENTS).forEach(([lessonId, data]) => enrichLesson(lessonId, data));

  /* ═══════════════════════════════════════════════════════════════════════
     NEW RICHER KĀNAKA MAOLI LESSONS
  ═══════════════════════════════════════════════════════════════════════ */

  upsertLesson('kanaka', 'kanaka-cosmology', {
    id: 'km-mahina',
    num: 'KM·10',
    title: 'Kaulana Mahina — The Hawaiian Lunar Calendar as Ecological Intelligence',
    readTime: '12 min',
    mana: 14,
    xp: 38,
    sceneType: 'constellation',
    concepts: ['Mahina', 'Lunar calendar', 'Fishing', 'Planting', 'Observation', 'Timekeeping'],
    sources: SOURCE_SETS.kanakaCore,
    related: ['km-starcompass', 'km-loikalo', 'km-ahupuaa'],
    kidVersion: {
      summary: 'The Hawaiian lunar calendar uses the moon to guide fishing, planting, gathering, and ceremony. It teaches people to observe cycles instead of rushing time.',
      bigIdeas: [
        'The moon can help people track time.',
        'Different nights are good for different activities.',
        'Observation across many generations becomes science.'
      ],
      vocabulary: [
        { term: 'Mahina', meaning: 'Moon or month.' },
        { term: 'Anahulu', meaning: 'A ten-day period in the Hawaiian lunar month.' },
        { term: 'Kaulana Mahina', meaning: 'The Hawaiian lunar calendar.' }
      ],
      activity: 'Observe the moon for seven nights. Draw its shape each night and write one thing you notice.',
      reflection: [
        'How does the moon change?',
        'Why would farmers and fishers care about the moon?'
      ]
    },
    content: `
<p class="lead">Kaulana Mahina, the Hawaiian lunar calendar, is a system of timekeeping built from observation, memory, and ecological relationship. It does not treat time as empty numbers on a wall. It treats time as a living rhythm: moonlight, tides, fish behavior, plant growth, ceremony, and human responsibility moving together.</p>

<facts>29.5 days::Approximate lunar cycle|30::Common Hawaiian moon names|3 anahulu::Ten-day phases of the month|Observation::The foundation of the calendar</facts>

<h4>Time as Relationship</h4>
<p>In many modern systems, time is abstract: hours, dates, schedules, and deadlines. In Kaulana Mahina, time is relational. Each moon night carries qualities. Some nights are better for planting, some for fishing, some for gathering, some for rest and ceremony. The question is not only <em>what day is it?</em> but <em>what is the world doing right now?</em></p>

<h4>The Three Anahulu</h4>
<p>The Hawaiian lunar month is often organized into three broad ten-day periods called <strong>anahulu</strong>. The first grows in light, the second is fuller and more active, and the third declines toward darkness. These phases help learners understand the month as a breathing cycle: emergence, fullness, release, and return.</p>

<twocol left="Modern Calendar" right="Kaulana Mahina">A fixed grid of dates, useful for coordination but often detached from place. || A place-based calendar that asks people to watch moon, tide, growth, fish, weather, and ceremony together.</twocol>

<h4>Ecological Practice</h4>
<p>For farmers, moon phases could guide planting and harvesting. For fishers, moonlight and tides could affect feeding patterns and reef conditions. For communities, the moon helped organize ceremony, rest, and work. This is a form of science, but not science separated from culture. It is science carried through practice.</p>

<callout>The Hawaiian lunar calendar teaches a principle that modern sustainability urgently needs: good decisions require attention to cycles. A community that observes cycles can act with timing. A community that ignores cycles often mistakes speed for intelligence.</callout>

<reflect>
How does a lunar calendar change the way people understand time?
What cycles do you already observe in your daily life?
How could a moon-based calendar support ecological responsibility today?
</reflect>

<activity>
Begin a seven-night moon journal. Draw the moon, write the weather, note the tide if you can, and record one feeling or observation from the night.
</activity>
`
  });

  upsertLesson('kanaka', 'kanaka-land', {
    id: 'km-malamaina',
    num: 'KM·11',
    title: 'Mālama ʻĀina — Caring for Land as Ancestor, Teacher, and Future',
    readTime: '13 min',
    mana: 15,
    xp: 40,
    sceneType: 'watershed',
    concepts: ['Mālama ʻāina', 'Aloha ʻāina', 'Stewardship', 'Reciprocity', 'Restoration', 'Food sovereignty'],
    sources: SOURCE_SETS.ecology,
    related: ['km-ahupuaa', 'km-loikalo', 'km-wakea', 'bridge-genealogy-ecology'],
    kidVersion: {
      summary: 'Mālama ʻāina means caring for the land. But in Hawaiian thinking, the land also cares for people. This creates a relationship of giving and returning.',
      bigIdeas: [
        'Land is a relative and teacher.',
        'Care means action, not only feeling.',
        'The future depends on how we treat place now.'
      ],
      vocabulary: [
        { term: 'Mālama', meaning: 'To care for, protect, preserve, and tend.' },
        { term: 'ʻĀina', meaning: 'Land; that which feeds.' },
        { term: 'Aloha ʻāina', meaning: 'Love of land, expressed through responsibility.' }
      ],
      activity: 'Choose one place near you. Pick up trash, water a plant, or observe it carefully. Write what the place gave you back.',
      reflection: [
        'How can land be a teacher?',
        'What is one action that shows aloha ʻāina?'
      ]
    },
    content: `
<p class="lead"><strong>Mālama ʻāina</strong> means to care for the land, but the phrase carries more than environmental stewardship. ʻĀina means that which feeds. The land is not passive scenery. It is ancestor, provider, teacher, archive, and future. To mālama ʻāina is to accept relationship.</p>

<h4>Care as Reciprocity</h4>
<p>In a purely extractive model, land is valued by what can be taken from it. In a reciprocal model, land is valued by relationship: what it gives, what it teaches, what it requires, and what must be returned. This makes care practical. It includes restoring streams, maintaining loʻi, protecting reefs, learning place names, honoring burials, feeding people, and defending land from harm.</p>

<concepts>Mālama · ʻĀina · Aloha ʻāina · Reciprocity · Restoration · Responsibility</concepts>

<h4>ʻĀina as Archive</h4>
<p>Place remembers. A stream remembers rainfall patterns. A fishpond remembers community labor. A terrace remembers hands that built it. A place name remembers an event, a species, a wind, a chief, a plant, or a warning. When people lose relationship with place, they do not only lose land. They lose a library.</p>

<callout type="gold">Mālama ʻāina is not only about protecting nature. It is about protecting the relationship that allows culture, food, language, and future generations to live.</callout>

<reflect>
What does it mean to say that land is an archive?
How is caring for land different when the land is understood as family?
What would a technology platform look like if it was designed around mālama ʻāina?
</reflect>

<activity>
Choose a place and make a care plan for it. Include one action for water, one for plants or animals, one for people, and one for memory or story.
</activity>
`
  });

  upsertLesson('kanaka', 'kanaka-language', {
    id: 'km-protocol',
    num: 'KM·12',
    title: 'Protocol, Pule, and Respect — How Knowledge Is Approached',
    readTime: '11 min',
    mana: 13,
    xp: 36,
    sceneType: 'balance',
    concepts: ['Protocol', 'Pule', 'Kapu', 'Respect', 'Knowledge ethics', 'Permission'],
    sources: SOURCE_SETS.kanakaCore,
    related: ['km-olelo', 'km-hula', 'km-laau', 'ke-maat'],
    kidVersion: {
      summary: 'Protocol means the respectful way to approach people, places, plants, knowledge, and ceremony. It teaches that not everything should be taken just because we can access it.',
      bigIdeas: [
        'Respect comes before learning.',
        'Some knowledge has protocols and responsibilities.',
        'Permission matters.'
      ],
      vocabulary: [
        { term: 'Pule', meaning: 'Prayer.' },
        { term: 'Kapu', meaning: 'Sacred restriction, boundary, or protocol.' },
        { term: 'Protocol', meaning: 'A respectful process for approaching knowledge or place.' }
      ],
      activity: 'Write three respectful steps before entering a sacred or important place.',
      reflection: [
        'Why should learners ask permission?',
        'What is the difference between learning and taking?'
      ]
    },
    content: `
<p class="lead">Knowledge is not approached casually in Hawaiian traditions. Some knowledge is public. Some is familial. Some is sacred. Some requires training, permission, ceremony, or kuleana. Protocol is the bridge between curiosity and respect.</p>

<h4>Why Protocol Exists</h4>
<p>Protocol is not a barrier designed to keep people away. It is a relational structure that protects people, places, ancestors, and the knowledge itself. It asks: Who are you? Why are you here? Who gave permission? What responsibilities come with what you learn?</p>

<twocol left="Access" right="Kuleana">Access asks, Can I get this information? || Kuleana asks, What responsibility comes with receiving this knowledge?</twocol>

<h4>Pule and Preparation</h4>
<p><strong>Pule</strong> is prayer, but it is also alignment. Before gathering plants, entering certain places, beginning ceremony, or teaching sacred knowledge, pule sets intention. It reminds the learner that knowledge is alive and relationship-based.</p>

<callout>In a digital platform, protocol matters even more. Technology can copy, remix, and distribute knowledge quickly. Cultural respect requires slowing down enough to ask whether something should be copied, how it should be framed, and who it belongs to first.</callout>

<reflect>
What is the difference between access and kuleana?
How should a learning platform protect cultural knowledge from becoming decoration?
What protocols should guide how learners approach sacred or community-held knowledge?
</reflect>

<activity>
Create a digital protocol card for this platform. Include: respect, source, permission, context, and responsibility.
</activity>
`
  });

  /* ═══════════════════════════════════════════════════════════════════════
     NEW RICHER KEMET LESSONS
  ═══════════════════════════════════════════════════════════════════════ */

  upsertLesson('kemet', 'kemet-cosmology', {
    id: 'ke-duat',
    num: 'KE·10',
    title: 'The Duat — Night Journey, Transformation, and Renewal',
    readTime: '13 min',
    mana: 15,
    xp: 40,
    sceneType: 'primordial',
    concepts: ['Duat', 'Ra', 'Night journey', 'Twelve hours', 'Aaru', 'Transformation'],
    sources: SOURCE_SETS.kemetCore,
    related: ['ke-maat', 'ke-nun', 'bridge-darkness'],
    kidVersion: {
      summary: 'The Duat is a mysterious night world where the sun travels, the soul is tested, and renewal becomes possible. It teaches that darkness can be a place of transformation.',
      bigIdeas: [
        'Night can be a journey, not just an ending.',
        'Transformation requires tests and guidance.',
        'Renewal comes after moving through darkness.'
      ],
      vocabulary: [
        { term: 'Duat', meaning: 'A night-world or underworld of transformation.' },
        { term: 'Ra', meaning: 'A solar deity connected to the sun journey.' },
        { term: 'Aaru', meaning: 'The Field of Reeds, an ideal renewed realm.' }
      ],
      activity: 'Draw a twelve-gate night journey. At each gate write one quality needed to grow: courage, truth, patience, kindness, memory.',
      reflection: [
        'Why do stories use night as a place of change?',
        'What helps people move through hard times?'
      ]
    },
    content: `
<p class="lead">The <strong>Duat</strong> is often translated as the underworld, but that word is too simple. The Duat is a cosmic night realm, a place of passage, testing, danger, knowledge, and renewal. It is where Ra travels during the night so the sun can be reborn at dawn.</p>

<facts>12::Hours or gates of the night|Ra::Solar traveler|Aaru::Field of Reeds|Transformation::Core pattern</facts>

<h4>The Night Journey</h4>
<p>Each night, the sun disappears into the west. In Kemetic cosmology, this disappearance is not death as finality. It is a journey through hidden realms. Ra travels through the Duat, meeting beings, passing gates, confronting chaos, and renewing the power that allows sunrise to return.</p>

<h4>The Soul and the Path</h4>
<p>The Duat also frames the soul's journey after death. The person must know names, gates, words of power, and ethical truth. Knowledge is not trivia here. Knowledge is passage. Speech, memory, and Maʻat become tools of transformation.</p>

<callout>The Duat teaches that darkness is not only danger. It is the hidden process through which renewal becomes possible. Like Pō and Nun, it refuses to treat darkness as emptiness.</callout>

<reflect>
What does the Duat teach about transformation?
How does the night journey compare with other teachings about darkness and emergence?
Why might knowledge, names, and truth be necessary for passage?
</reflect>

<activity>
Create a symbolic map of twelve gates. Each gate should ask one ethical question a person must answer before moving forward.
</activity>
`
  });

  upsertLesson('kemet', 'kemet-arts', {
    id: 'ke-seshat',
    num: 'KE·11',
    title: 'Seshat — Measurement, Writing, Architecture, and Sacred Recordkeeping',
    readTime: '12 min',
    mana: 14,
    xp: 38,
    sceneType: 'constellation',
    concepts: ['Seshat', 'Writing', 'Measurement', 'Architecture', 'Scribes', 'Recordkeeping'],
    sources: SOURCE_SETS.kemetCore,
    related: ['ke-medunetjer', 'ke-ptah', 'km-olelo'],
    kidVersion: {
      summary: 'Seshat is connected with writing, measuring, counting, architecture, and records. She shows that knowledge needs careful memory and accurate tools.',
      bigIdeas: [
        'Writing preserves memory.',
        'Measurement helps build stable things.',
        'Knowledge systems need keepers.'
      ],
      vocabulary: [
        { term: 'Seshat', meaning: 'A Kemetic figure associated with writing, measurement, and recordkeeping.' },
        { term: 'Scribe', meaning: 'A trained writer and keeper of records.' }
      ],
      activity: 'Measure a room, desk, or small object carefully. Draw it and label your measurements like a young architect-scribe.',
      reflection: [
        'Why does accuracy matter?',
        'What records should a community preserve?'
      ]
    },
    content: `
<p class="lead"><strong>Seshat</strong> represents one of the most important principles in any civilization: knowledge must be measured, written, remembered, and protected. She is associated with scribes, records, temple foundations, architecture, mathematics, and the act of stretching the cord to align sacred buildings.</p>

<h4>Measurement as Sacred Practice</h4>
<p>To measure is not only to count. In Kemet, measurement was connected to order. The correct alignment of a temple, the record of a reign, the boundaries of fields after Nile flooding, and the keeping of ritual calendars all required precision. Without measurement, Maʻat could not be maintained in administration, architecture, or memory.</p>

<h4>Writing as Architecture of Memory</h4>
<p>Writing turns speech into durable form. Scribes did not simply copy words. They maintained state records, sacred texts, medical knowledge, astronomical observations, and cultural continuity. Seshat reminds us that every knowledge platform is also a recordkeeping system.</p>

<compare left="Seshat" right="Digital Knowledge Platform">
Seshat represents sacred recordkeeping, measurement, memory, and alignment. || A digital platform can preserve lessons, progress, sources, reflections, and credentials — but only if it is designed with integrity.
</compare>

<reflect>
What is the relationship between measurement and justice?
How can recordkeeping protect memory, and how can it also distort memory?
What should this platform record carefully for future learners?
</reflect>

<activity>
Design a symbolic recordkeeping tool for the Living Knowledge Platform. What would it measure: progress, responsibility, reflection, source quality, or community contribution?
</activity>
`
  });

  upsertLesson('kemet', 'kemet-arts', {
    id: 'ke-celestial-nile',
    num: 'KE·12',
    title: 'The Nile, the Stars, and Sacred Timekeeping',
    readTime: '12 min',
    mana: 14,
    xp: 38,
    sceneType: 'starcompass',
    concepts: ['Nile', 'Sopdet', 'Sirius', 'Calendar', 'Inundation', 'Astronomy'],
    sources: SOURCE_SETS.kemetCore,
    related: ['ke-seshat', 'km-mahina', 'bridge-navigation-astronomy'],
    kidVersion: {
      summary: 'Kemetic people watched the Nile, the stars, and the seasons. The star Sopdet, known as Sirius, was connected with important timing and renewal.',
      bigIdeas: [
        'Stars can help track seasons.',
        'Rivers shape calendars and civilization.',
        'Sacred timekeeping connects sky and earth.'
      ],
      vocabulary: [
        { term: 'Sopdet', meaning: 'A star/deity associated with Sirius.' },
        { term: 'Inundation', meaning: 'The seasonal flooding of the Nile.' },
        { term: 'Calendar', meaning: 'A system for organizing time.' }
      ],
      activity: 'Draw a river, a star, and a field. Show how sky timing could help farming.',
      reflection: [
        'Why would a river civilization care about stars?',
        'How does the sky help people prepare?'
      ]
    },
    content: `
<p class="lead">Kemetic timekeeping joined earth and sky. The Nile's seasonal flood, agricultural cycles, temple ritual, and celestial observation were not separate sciences. They formed one living calendar of renewal.</p>

<h4>Sopdet and the Year</h4>
<p>The heliacal rising of Sopdet, associated with Sirius, became an important sign in Egyptian calendrical tradition. Its return near the season of Nile inundation connected star observation with water, agriculture, and the renewal of the land.</p>

<h4>The Nile as Cosmic Teacher</h4>
<p>The Nile's flooding could destroy or nourish. Its cycles demanded observation, planning, storage, measurement, and social coordination. This is why astronomy, mathematics, governance, and agriculture grew together. The river required intelligence.</p>

<callout>Like Hawaiian lunar and ocean observation, Kemetic timekeeping shows that ancient science was embedded in place. The sky was not abstract. It was a calendar for survival, ritual, and governance.</callout>

<reflect>
How do rivers teach time?
Why does agriculture need astronomy?
What similarities do you see between Nile timekeeping and Hawaiian moon or star knowledge?
</reflect>

<activity>
Make a three-part calendar: sky sign, water sign, and human action. Fill in one example for farming, fishing, or gathering.
</activity>
`
  });

  /* ═══════════════════════════════════════════════════════════════════════
     NEW BRIDGE LESSONS
  ═══════════════════════════════════════════════════════════════════════ */

  upsertLesson('bridge', 'bridge-cosmology', {
    id: 'bridge-genealogy-ecology',
    num: 'BR·04',
    title: 'Genealogy as Ecology — When Family Trees Include the Living World',
    readTime: '14 min',
    mana: 16,
    xp: 42,
    sceneType: 'bridge',
    concepts: ['Genealogy', 'Ecology', 'Kinship', 'Kumulipo', 'Hāloa', 'Living systems'],
    sources: SOURCE_SETS.bridge,
    related: ['km-kumulipo', 'km-wakea', 'km-ahupuaa', 'km-malamaina'],
    kidVersion: {
      summary: 'Some knowledge systems teach that people are related to plants, animals, water, land, and sky. This makes ecology a family responsibility.',
      bigIdeas: [
        'Family can include more than humans.',
        'If nature is kin, care becomes responsibility.',
        'Genealogy can teach ecology.'
      ],
      vocabulary: [
        { term: 'Genealogy', meaning: 'A record of relationships and ancestry.' },
        { term: 'Ecology', meaning: 'The study of relationships among living beings and their environments.' },
        { term: 'Kinship', meaning: 'Family relationship or belonging.' }
      ],
      activity: 'Make a family tree that includes one plant, one animal, one water source, and one place that helps your family live.',
      reflection: [
        'What changes when nature is treated as family?',
        'How does kinship create responsibility?'
      ]
    },
    content: `
<p class="lead">In many modern systems, genealogy belongs to humans and ecology belongs to science. But in many Indigenous knowledge systems, this division is too small. Genealogy can include coral, kalo, fish, islands, waters, winds, stars, and people. Ecology is kinship in motion.</p>

<h4>Beyond the Human Family Tree</h4>
<p>The Kumulipo connects human life to earlier forms of life. The Hāloa genealogy connects people to kalo. Ahupuaʻa thinking connects community survival to watershed health. These are not separate ideas. Together, they create an ethic: if the living world is family, then ecological harm is family harm.</p>

<twocol left="Modern Separation" right="Living Kinship">Humans are separated from nature, and the environment becomes an external resource. || Humans are part of a family of beings, and care becomes a duty of relationship.</twocol>

<h4>Why This Matters Now</h4>
<p>Climate crisis, food insecurity, polluted water, and biodiversity loss are not only technical problems. They are relationship failures. A genealogy that includes the living world trains people to see responsibility where extractive systems see only resource.</p>

<reflect>
How does genealogy become an ecological teaching?
What would environmental policy look like if rivers, plants, and reefs were treated as relatives?
How can a digital platform teach relationship instead of extraction?
</reflect>

<activity>
Build a kinship ecology map: place yourself in the center, then connect to food, water, land, air, family, ancestors, and future generations.
</activity>
`
  });

  upsertLesson('bridge', 'bridge-cosmology', {
    id: 'bridge-navigation-astronomy',
    num: 'BR·05',
    title: 'Sky Knowledge — Navigation, Calendars, and the Human Need to Read the Heavens',
    readTime: '14 min',
    mana: 16,
    xp: 42,
    sceneType: 'starcompass',
    concepts: ['Astronomy', 'Navigation', 'Calendar', 'Hōkūleʻa', 'Sopdet', 'Mahina', 'Observation'],
    sources: SOURCE_SETS.bridge,
    related: ['km-starcompass', 'km-mahina', 'ke-celestial-nile'],
    kidVersion: {
      summary: 'Many cultures looked to the sky for direction, seasons, ceremony, and survival. Stars and the moon helped people know where they were and when to act.',
      bigIdeas: [
        'The sky can be map, clock, calendar, and story.',
        'Observation turns into knowledge over generations.',
        'Different cultures read the same sky in different ways.'
      ],
      vocabulary: [
        { term: 'Astronomy', meaning: 'The study of stars, planets, moon, sun, and sky patterns.' },
        { term: 'Navigation', meaning: 'Finding direction and route.' },
        { term: 'Calendar', meaning: 'A system for organizing time.' }
      ],
      activity: 'Create a sky journal with three sections: direction, time, and story. Add one observation for each.',
      reflection: [
        'How can the sky be a teacher?',
        'Why should we learn more than one cultural sky map?'
      ]
    },
    content: `
<p class="lead">The sky has always been one of humanity's greatest classrooms. It is a map for voyagers, a calendar for farmers, a ritual clock for priests, a story archive for communities, and a mirror for philosophical thought. Hawaiian wayfinding, Kemetic Nile timekeeping, and many other traditions show that astronomy is never only about objects in space. It is about relationship to place.</p>

<facts>Stars::Direction and latitude|Moon::Cycles and timing|Sun::Season and daily rhythm|Culture::Meaning and memory</facts>

<h4>One Sky, Many Maps</h4>
<p>The physical sky is shared, but cultural sky maps are not identical. Hawaiians built star houses and oceanic navigation systems. Kemet connected stars with calendars, temples, Nile cycles, and divine order. Other cultures developed their own constellations, names, seasonal markers, and stories. Learning more than one sky map teaches humility: no single culture exhausts the meaning of the heavens.</p>

<compare left="Hawaiian Wayfinding" right="Kemetic Timekeeping">Stars guide direction across open ocean, while swells, birds, clouds, and wind complete the map. || Stars help mark sacred time, agricultural cycles, temple alignments, and Nile renewal.
</compare>

<h4>Observation as Discipline</h4>
<p>Sky knowledge is not a one-time lesson. It is disciplined observation across nights, seasons, and generations. The learner becomes reliable by watching patiently. This is why sky knowledge also teaches character: attention, humility, memory, and responsibility.</p>

<reflect>
What is the difference between looking at the sky and reading the sky?
How do different cultures turn observation into knowledge?
How could an Ikeverse sky map honor many traditions without flattening them into one system?
</reflect>

<activity>
Choose one sky object: the moon, Venus, a bright star, or the sun's sunset point. Observe it for one week and write how its position or appearance changes.
</activity>
`
  });

  upsertLesson('bridge', 'bridge-cosmology', {
    id: 'bridge-word-creation',
    num: 'BR·06',
    title: 'Creation Through Word — Speech, Chant, Name, and the Making of Worlds',
    readTime: '13 min',
    mana: 15,
    xp: 40,
    sceneType: 'constellation',
    concepts: ['Word', 'Chant', 'Ptah', 'ʻŌlelo', 'Name', 'Creative speech'],
    sources: SOURCE_SETS.bridge,
    related: ['ke-ptah', 'ke-medunetjer', 'km-olelo', 'km-hula'],
    kidVersion: {
      summary: 'Many traditions teach that words are powerful. A chant, name, prayer, or spoken truth can shape memory, relationship, and the world people build together.',
      bigIdeas: [
        'Words can create relationship.',
        'Names can carry memory and responsibility.',
        'Speech should be used carefully.'
      ],
      vocabulary: [
        { term: 'Chant', meaning: 'Spoken or sung words carried with rhythm and memory.' },
        { term: 'Name', meaning: 'A word that identifies and can carry story.' },
        { term: 'Creative speech', meaning: 'Words that help shape reality or relationship.' }
      ],
      activity: 'Choose one word that matters to you. Write its meaning, draw it as a symbol, and describe how it can help people.',
      reflection: [
        'How can words heal?',
        'How can words harm?',
        'What word would you protect?'
      ]
    },
    content: `
<p class="lead">Words do not only describe worlds. In many knowledge systems, words participate in making worlds. A chant carries genealogy. A name preserves place. A prayer aligns action. A law orders society. A harmful word can fracture relationship, while a truthful word can restore it.</p>

<h4>Ptah and Creative Speech</h4>
<p>In the Memphite Theology, Ptah creates through heart and tongue: thought and speech. Creation is not random. It is intelligence articulated. This makes language a sacred technology.</p>

<h4>ʻŌlelo and Carried Memory</h4>
<p>In Hawaiian knowledge, ʻōlelo carries place, genealogy, value, and history. A chant like the Kumulipo does not merely talk about creation; it performs memory across generations. Hula and mele make speech embodied. The body, voice, breath, and rhythm become archives.</p>

<callout>When a platform stores lessons, reflections, names, and credentials, it becomes a speech system too. It should therefore ask: what kind of world are these words helping to create?</callout>

<reflect>
How do words create relationship?
Why should names and chants be handled with care?
How can digital learning honor the sacred power of language?
</reflect>

<activity>
Create a short three-line chant or affirmation for learning. It should include one relationship, one responsibility, and one hope for the future.
</activity>
`
  });

  console.info(
    '[LKP Data] Rich lesson metadata and added lessons applied. Total lessons:',
    CULTURALVERSE_DATA.cultures.flatMap(c => (c.modules || []).flatMap(m => m.lessons || [])).length
  );
})();

/* Refresh global aliases after additive enrichment when this file is loaded separately. */
(function exposeEnrichedLkpData() {
  try {
    if (
      typeof CULTURALVERSE_DATA !== 'undefined' &&
      CULTURALVERSE_DATA &&
      Array.isArray(CULTURALVERSE_DATA.cultures)
    ) {
      window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
      window.LKP_DATA = CULTURALVERSE_DATA;
      window.IKEVERSE_DATA = CULTURALVERSE_DATA;

      window.dispatchEvent(new CustomEvent('lkp:data-ready', {
        detail: {
          cultures: CULTURALVERSE_DATA.cultures.length,
          data: CULTURALVERSE_DATA
        }
      }));

      console.info(
        '[LKP Data] Rich additions exposed globally:',
        CULTURALVERSE_DATA.cultures.length,
        'cultures'
      );
    }
  } catch (err) {
    console.warn('[LKP Data] Rich additions export failed:', err);
  }
})();