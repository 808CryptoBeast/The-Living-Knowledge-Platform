/* ═══════════════════════════════════════════════════════════════════
   culturalverse-data.js
   ──────────────────────────────────────────────────────────────────
   HOW TO ADD CONTENT:

   ► Add a new culture:
     Copy a full culture object in CULTURES array, change the id,
     name, emoji, theme, and populate its modules array.

   ► Add a module to an existing culture:
     Find the culture by id, add a new object to its modules array.

   ► Add a lesson to an existing module:
     Find the module by id, add a new object to its lessons array.

   ► Content format inside lesson.content:
     Plain string. Supports these HTML-like tags:
       <h4>Heading</h4>
       <p>Paragraph</p>
       <ul><li>Item</li></ul>
       <callout>Highlighted note</callout>
       <callout type="gold">Gold variant</callout>
       <callout type="bridge">Bridge/connection variant</callout>
       <facts>val::key | val::key | val::key</facts>
       <twocol left="Label" right="Label">left content || right content</twocol>
       <quote cite="Source">Quote text</quote>
       <concepts>Word · Word · Word</concepts>
═══════════════════════════════════════════════════════════════════ */

const KUMULIPO_WA_1_LINES = [
  'O ke au i kahuli wela ka honua',
  'O ke au i kahuli lole ka lani',
  'O ke au i kuka\'iaka ka la',
  'E ho\'omalamalama i ka malama',
  'O ke au o Makali\'i ka po',
  'O ka lipolipo, o ka lipolipo',
  'O ka lipolipo o ka la',
  'O ka lipolipo o ka po'
];

const KUMULIPO_WA_1_TRANSLATIONS = [
  'When the earth turned hot and transformed,',
  'When the heavens turned and shifted,',
  'When the sun was darkened in turning,',
  'The moon was caused to shine forth,',
  'The time of the rise of the Pleiades,',
  'Deep darkness, layered darkness,',
  'The dense darkness of day,',
  'The dense darkness of night.'
];

const KUMULIPO_WA_2_LINES = [
  'Hanau kama a ka Powehiwehi',
  'Hanau ka i\'a, hanau ka Nai\'a i ke kai la holo',
  'Hanau ka Mano, hanau ka Moano, i ke kai la holo',
  'Hanau ke Aku, hanau ke \'Ahi i ke kai la holo',
  'Hanau ka \'Ama\'ama, hanau ka \'Anae i ke kai la holo',
  'Po--no'
];

const KUMULIPO_WA_2_TRANSLATIONS = [
  'Born were the children of the profound deep darkness,',
  'Born were the fishes, born the dolphin moving in the sea,',
  'Born were the shark and the moano fish moving in the sea,',
  'Born were the aku and the ahi moving in the sea,',
  'Born were the amaama and the anae moving in the sea,',
  'Darkness, then completion.'
];

const KUMULIPO_WA_3_LINES = [
  'O kane ia, o ka wahine kela',
  'Hanau ka Haha',
  'Hanau ka Huhu he makua',
  'Puka kana keiki he Huhulele, lele',
  'Hanau manu ka \'aina',
  'Hanau manu ke kai'
];

const KUMULIPO_WA_3_TRANSLATIONS = [
  'This one is male, that one is female,',
  'Born was the haha fish,',
  'Born was the huhu as elder parent,',
  'Its child emerged, the huhulele, leaping,',
  'Bird life was born for the land,',
  'Bird life was born for the sea.'
];

const KUMULIPO_WA_4_LINES = [
  'E kukulu i ke \'ahi\'a a la\'a la',
  'O kolo aku, o kolo mai',
  'O ho\'ohua ka ohana o kolo',
  'Hanau ka po ia honu kua nanaka',
  'Hanau ka po ia mo\'onanea',
  'Hanau ka ohana o Kolo i ka po'
];

const KUMULIPO_WA_4_TRANSLATIONS = [
  'Raise up the young ohia growth,',
  'Creeping forth, creeping back,',
  'The creeping family multiplies,',
  'Born in this darkness was the rough-backed turtle,',
  'Born in this darkness was the smooth lizard form,',
  'Born in darkness was the family of creeping beings.'
];

const KUMULIPO_WA_5_LINES = [
  'O kuhele ke au ia Kapokanokano',
  'O ka uli \'iliuli makamaka hou',
  'O kama a pua\'a i hanau',
  'Hanau ka pua\'a hiwahiwa i ke au',
  'Hanau ka Mehe\'ula, he \'ula\'ula ia',
  'Po--no'
];

const KUMULIPO_WA_5_TRANSLATIONS = [
  'Flowed the current at Kapokanokano,',
  'Deep dark blue appeared anew,',
  'The offspring of pig-kind was born,',
  'Born was the cherished black pig in that era,',
  'Born was the reddish one, red in appearance,',
  'Darkness, then completion.'
];

const KUMULIPO_WA_6_LINES = [
  'O kupukupu kahili o Kua-ka-mano',
  'Ka \'ai ana ka pi\'ipi\'i wai',
  'Ka \'ai ana ka pi\'ipi\'i kai',
  'Noho po\'opo\'o ka \'iole makua',
  'He \'iole ko uka, he \'iole ko kai',
  'Po--no'
];

const KUMULIPO_WA_6_TRANSLATIONS = [
  'Sprouting plumes rose at Kua-ka-mano,',
  'Feeding on the small freshwater snail,',
  'Feeding on the small saltwater snail,',
  'The elder rat sits crouched,',
  'A rat of the uplands, a rat of the shore,',
  'Darkness, then completion.'
];

const KUMULIPO_WA_7_LINES = [
  'O kau ke anoano, ia\'u kualono',
  'He \'ilio \'i\'i, he \'ilio, \'a\'a',
  'O ka pe\'ape\'a lohelohe',
  'Puka ka pe\'ape\'a huluhulu',
  'Puka ka pe\'ape\'a lau manamana',
  'Po--no'
];

const KUMULIPO_WA_7_TRANSLATIONS = [
  'The seed-form settles upon the ridges,',
  'A small dog, a barking dog, fierce,',
  'The bat with listening ears,',
  'The bat with feathers emerged,',
  'The bat with many-fingered leaves emerged,',
  'Darkness, then completion.'
];

const KUMULIPO_WA_8_LINES = [
  'O kama auli\'i, auli\'i anei',
  'Hanau kanaka o mehelau',
  'Hanau kanaka ia Wai\'ololi',
  'Hanau ka wahine ia Wai\'olola',
  'Hanau o La\'ila\'i he wahine',
  'Hanau Ki\'i he kane'
];

const KUMULIPO_WA_8_TRANSLATIONS = [
  'A small child-form was born, yes, small indeed,',
  'Born was the human of mehelau,',
  'Born was the human at Waiololi,',
  'Born was the woman at Waiolola,',
  'Born was Lailai, a woman,',
  'Born was Kii, a man.'
];

const KUMULIPO_WA_9_LINES = [
  'O La\'ila\'i, o Ola\'i-ku-honua',
  'O Wela, o Owe, o owa ka lani',
  'Puka lele, lele pu i ka lani',
  'Oia wahine no \'I\'iliponi, no loko o \'I\'ipakalani',
  'Oia no ke ho\'i iluna',
  'Ua--ao--'
];

const KUMULIPO_WA_9_TRANSLATIONS = [
  'Lailai with Olai-ku-honua,',
  'Wela and Owe, and the calling sky,',
  'Leaping forth, leaping together into the heavens,',
  'That woman of Iiliponi, from within Iipakalani,',
  'She indeed returns upward,',
  'It becomes daylight.'
];

const KUMULIPO_WA_10_LINES = [
  'O mai la, o La\'ila\'i ka paia',
  'Hanau Kamaha\'ina he kane',
  'Hanau o Hali\'a he wahine',
  'Hanau Hakea he kane',
  'Moe ia Ki\'i no ke moe iaia',
  'Puka--'
];

const KUMULIPO_WA_10_TRANSLATIONS = [
  'Here came Lailai as the foundation,',
  'Born was Kamahaina, a male,',
  'Born was Halia, a female,',
  'Born was Hakea, a male,',
  'Kii lay with her in union,',
  'Emergence came forth.'
];

const KUMULIPO_WA_11_LINES = [
  'Oia wahine noho lani a pi\'o lani no',
  'Hanau o Kamaha\'ina, he kane',
  'Hanau o Kamamule, kona muli',
  'Hanau o Kamamainau, o kona waena',
  'Hanau o Kamakulua kona poki\'i, he wahine',
  'O Loa\'a ke kane -- Nakelea ka wahine'
];

const KUMULIPO_WA_11_TRANSLATIONS = [
  'That woman dwelt in heaven, bent in the heavens,',
  'Born was Kamahaina, the male,',
  'Born was Kamamule, the younger,',
  'Born was Kamamainau, the middle one,',
  'Born was Kamakulua, the younger sister, female,',
  'Loaa the male, Nakelea the female.'
];

const KUMULIPO_WA_12_LINES = [
  'Opu\'upu\'u ke kane -- La\'aniha ka wahine',
  'Maunanui -- Makelewa\'a',
  'Hanau Kihala\'aupoe he Wauke',
  'Hanau o \'Ulu he \'Ulu',
  'Hanau o Kupulanakehau he wahine',
  'Hanau o Kulani\'ehu he kane'
];

const KUMULIPO_WA_12_TRANSLATIONS = [
  'Opuupuu the male, Laaniha the female,',
  'Maunanui with Makelewaa,',
  'Born was Kihalaupoe, the wauke plant,',
  'Born was Ulu, the breadfruit,',
  'Born was Kupulanakehau, female,',
  'Born was Kulaniehu, male.'
];

const KUMULIPO_WA_13_LINES = [
  'Paliku ke kane -- Paliha\'i ka wahine',
  'Kapapanuinuiauakea -- Ka\'ina\'inakea',
  'Hanau o Kapapa-pahu ka mua',
  'Hanau o Laumiha he wahine',
  'Hanau o Haumea he wahine, i noho ia Kanaloa-akua',
  'Haloa ulu hahaloa'
];

const KUMULIPO_WA_13_TRANSLATIONS = [
  'Paliku the male, Palihai the female,',
  'Kapapanuinuiauakea with Kainainakea,',
  'Born first was Kapapa-pahu,',
  'Born was Laumiha, a female,',
  'Born was Haumea, a woman who dwelt with Kanaloa-akua,',
  'Haloa, the long growing shoot.'
];

const KUMULIPO_WA_14_LINES = [
  'Li\'aikuhonua ke kane -- Ke\'akahulihonua ka wahine',
  'Hanau Hanala\'anui, hanau Hanala\'aiki',
  'Hanau Paliku',
  'Hanau Ololo -- Ololonu\'u',
  'Hanau Kumuhonua -- Haloiho',
  'Hanau o Haloa--no'
];

const KUMULIPO_WA_14_TRANSLATIONS = [
  'Liaikuhonua the male, Keakahulihonua the female,',
  'Born were Hanalaanui and Hanalaaiki,',
  'Born was Paliku,',
  'Born was Ololo, then Ololonu u,',
  'Born were Kumuhonua and Haloiho,',
  'Born was Haloa indeed.'
];

const KUMULIPO_WA_15_LINES = [
  'O Haumea wahine o Nu\'umea i Kukuiha\'a',
  'Komo i ka \'ulu, he \'ulu ia',
  'O Haumea nui aiwaiwa',
  'Moe mo\'opuna ia Haloa',
  'Hanau o \'Ulu, hanau O Nana\'ulu',
  'Maui-a-ka-malo'
];

const KUMULIPO_WA_15_TRANSLATIONS = [
  'Haumea, woman of Nuumea at Kukuihaa,',
  'Entering the breadfruit grove, it is breadfruit indeed,',
  'Great Haumea of profound wonder,',
  'The grandchild Haloa lay in union,',
  'Born was Ulu, born was Nanaulu,',
  'Maui of the loincloth.'
];

const KUMULIPO_WA_16_LINES = [
  'Maui ke kane -- Hinakealohaila ka wahine',
  '\'Aikanaka -- Hina\'aiakamalama',
  'Hanau o Punaimua, o Hema, o Puna i muli',
  'Hanau Kaha\'i-nui-a-Hema -- Hinaulu\'ohi\'a',
  'Hanau o Kawauka\'ohele, o Kelea-nui-noho-ana-\'api\'api, he wahine',
  'Ia Lono-i-ka-maka'
];

const KUMULIPO_WA_16_TRANSLATIONS = [
  'Maui the male, Hinakealohaila the female,',
  'Aikanaka with Hinaaiakamalama,',
  'Born were Punaimua, Hema, and Puna-the-younger,',
  'Born was Kaha i-nui-a-Hema with Hinauluohia,',
  'Born was Kawaukaohele and Kelea-nui-noho-ana-apiapi, a female,',
  'Until Lono-i-ka-maka.'
];

const KUMULIPO_WA_PEDAGOGY = {
  1: {
    vocabulary: [
      { term: 'Pō', meaning: 'The fertile darkness of origin, not emptiness but the source condition of becoming.' },
      { term: 'Koʻa', meaning: 'Coral or coral-form emergence, often read as one of the first foundational thresholds of life.' },
      { term: 'Kumulipo', meaning: 'The sacred creation chant whose name evokes the deep source, foundation, and night of origin.' },
      { term: 'Kuleana', meaning: 'The responsibility inherited through relationship, knowledge, and belonging.' }
    ],
    foundationCards: [
      { title: 'Source-Depth', body: 'Read Wā 1 as origin in fertile depth. Darkness here is a source condition from which becoming emerges.' },
      { title: 'Heat and Turning', body: 'The opening emphasizes motion, heat, and turning. Creation begins as transformation before stable form appears.' },
      { title: 'Relational Beginning', body: 'Existence begins in relation. The first lesson is not separation, but interdependence.' }
    ],
    commonMisreadings: [
      'Treating pō as emptiness instead of generative depth.',
      'Reading the opening as static description rather than active becoming.',
      'Missing that Wā 1 establishes the ethical basis for later kuleana.'
    ]
  },
  2: {
    vocabulary: [
      { term: 'Kai', meaning: 'The sea or ocean domain, not background space but a living genealogical field.' },
      { term: 'Iʻa', meaning: 'Fish or marine beings named as kin within the unfolding genealogy of ocean life.' },
      { term: 'Powehiwehi', meaning: 'A profound depth of darkness associated here with the generative sea-born emergence of life.' },
      { term: 'Moʻokūʻauhau', meaning: 'Genealogical continuity, the lineal thread linking marine multiplicity into one living order.' }
    ],
    foundationCards: [
      { title: 'Abundance with Order', body: 'Multiplicity here is structured emergence within an ocean genealogy, not random excess.' },
      { title: 'Marine Kinship', body: 'Sea life appears as related presences in one unfolding field, not separate resource categories.' },
      { title: 'Ocean Memory', body: 'The sea acts as a living archive of continuity, diversification, and ancestral relation.' }
    ],
    commonMisreadings: [
      'Reducing this wā to a species list instead of a genealogy.',
      'Treating abundance as permission for extraction.',
      'Missing that marine diversity is framed as ancestral continuity.'
    ]
  },
  3: {
    vocabulary: [
      { term: 'Mea Lele', meaning: 'Flying creatures — insects and birds — who emerge through transformation in Wā 3.' },
      { term: 'Hānau', meaning: 'To be born or brought forth; each parent here gives birth to a child that transforms and flies.' },
      { term: 'Lele', meaning: 'To fly or leap; the defining motion of Wā 3, marking the emergence of flight as a new form of life.' },
      { term: 'Puka', meaning: 'To come forth or emerge; the word repeated as each transformed child breaks free and takes wing.' }
    ],
    foundationCards: [
      { title: 'Transformation as Genealogy', body: 'Wā 3 presents metamorphosis as a genealogical act — parent gives birth to child of a different, flying form.' },
      { title: 'Flight as Emergence', body: 'The repeated phrase "puka kana keiki, lele" marks flight itself as a new threshold of becoming in the chant.' },
      { title: 'Land and Sea Birds Together', body: 'The wā closes by naming both land birds and sea birds, showing that the flying world spans all domains.' }
    ],
    commonMisreadings: [
      'Treating the insect-to-bird sequence as a species list rather than a genealogy of transformation.',
      'Missing the significance of "lele" (flew) as the repeating marker of a new threshold of life.',
      'Overlooking insects as the foundational parent-forms from which the bird world emerges.'
    ]
  },
  4: {
    vocabulary: [
      { term: 'Kolo', meaning: 'Creeping or crawling life, signaling transitional forms and connective movement.' },
      { term: 'Pili', meaning: 'Connection, closeness, or relation; a useful lens for understanding linked life forms.' },
      { term: 'Honu', meaning: 'Sea turtle, a being of threshold and relation between ecological zones.' },
      { term: 'Moʻo', meaning: 'Lizard or reptilian form, often tied to transitional presence and storied relation in Hawaiian thought.' }
    ],
    foundationCards: [
      { title: 'Threshold Life', body: 'This wā centers beings that connect zones, scales, and phases of emergence.' },
      { title: 'Small Does Not Mean Minor', body: 'The chant resists the idea that value follows size.' },
      { title: 'Pattern from Many Motions', body: 'Small movements generate larger continuity and system coherence.' }
    ],
    commonMisreadings: [
      'Treating smaller forms as lesser in meaning.',
      'Overlooking thresholds and transitional life.',
      'Reading interconnection as hierarchy instead of reciprocity.'
    ]
  },
  5: {
    vocabulary: [
      { term: 'Puaʻa', meaning: 'Pig; the central figure of Wā 5, born of chiefly lineage and tied to land, cultivation, and abundance.' },
      { term: 'Poʻo', meaning: 'Head; Wā 5 names many human types by head-shape and temperament, showing the diversity of humanity at its emergence.' },
      { term: 'Kapokanokano', meaning: 'The Night-digger; the ancestral figure whose union with Pō-lalo-uli produces the pig and the first human social diversity.' },
      { term: 'Hanauna', meaning: 'Generation or descendant line; the night gives birth to many types, each named and placed within ancestral sequence.' }
    ],
    foundationCards: [
      { title: 'Pigs as Sacred Lineage', body: 'Wā 5 presents the pig not as animal resource but as a being of chiefly bloodline, born within genealogical order.' },
      { title: 'Human Diversity Emerges', body: 'The chant names peaked-heads, flat-heads, fair-haired, dark-heads, war leaders, and many more — diversity is ancestral, not accidental.' },
      { title: 'Land and Cultivation Begin', body: 'The pig lodges inland, cultivates taro patches, and begins the tenfold increase of land — linking animal life to the opening of agriculture.' }
    ],
    commonMisreadings: [
      'Reading Wā 5 as a continuation of sea life rather than recognizing the shift to land animals and human social emergence.',
      'Treating the list of head-types as racial classification rather than as a genealogical naming of human diversity within the chant.',
      'Missing the pig as a figure of sacred chiefly lineage, not merely livestock.'
    ]
  },
  6: {
    vocabulary: [
      { term: 'ʻIole', meaning: 'Rat; the primary creature of Wā 6, appearing upland and by the sea as a sign of habitation and fertility.' },
      { term: 'Kupukupu', meaning: 'To spring up or multiply; the opening of Wā 6 describes new chiefly lines sprouting like growth.' },
      { term: 'Mahimahi', meaning: 'Cultivation or tillage; Wā 6 marks the emergence of agriculture alongside the expansion of chiefly lines.' },
      { term: 'Aliʻi', meaning: 'Chief or chiefly line; the wā opens with many new lines of chiefs springing forth, linking social growth to animal emergence.' }
    ],
    foundationCards: [
      { title: 'Chiefly Lines Multiply', body: 'Wā 6 opens by naming the proliferation of new chiefly lines — social structure expanding alongside animal life.' },
      { title: 'Rats as Presence of Habitation', body: 'The ʻiole (rat) appears upland and by the sea, marking inhabited land and the spread of life into settled places.' },
      { title: 'Cultivation Enters the Chant', body: 'Food grown by water and by sea is named here — the beginning of human agriculture as part of the genealogical unfolding.' }
    ],
    commonMisreadings: [
      'Skipping Wā 6 as minor or transitional — it marks the critical entry of cultivation and social structure into the genealogy.',
      'Treating the rat as incidental rather than as the named creature of this wā whose presence signals inhabited land.',
      'Missing the connection between the multiplication of chiefly lines and the ecological expansion of animal life in the same era.'
    ]
  },
  7: {
    vocabulary: [
      { term: 'ʻĪlio', meaning: 'Dog; the central creature of Wā 7, appearing as dark red, brindled, and hairless, sacred as an offering.' },
      { term: 'Peʻapeʻa', meaning: 'Bat; the Hawaiian hoary bat appears in Wā 7 alongside dogs as a creature of the night and threshold.' },
      { term: 'Weliweli', meaning: 'Dread or awe; the opening of Wā 7 is saturated with sacred fear of the night, the offering place, and the law.' },
      { term: 'Anoano', meaning: 'Fear or dread here, not seed-form — the mountain-top feeling of sacred awe before the unknown.' }
    ],
    foundationCards: [
      { title: 'Sacred Dread Opens the Wā', body: 'Wā 7 begins not with birth but with fear — awe of the night, the law, and the place of offering. This is knowledge approached with reverence.' },
      { title: 'Dogs as Sacred Beings', body: 'The ʻīlio (dog) appears as a being of multiple forms — dark red, brindled, hairless — and as an offering, linking animal life to sacred practice.' },
      { title: 'Bats at the Threshold', body: 'The peʻapeʻa (bat) joins the dog as a creature of night and boundary, named within the genealogical sequence as a distinct form of life.' }
    ],
    commonMisreadings: [
      'Reading the opening fear-language as poetic ornament rather than as a core teaching about sacred approach to knowledge.',
      'Treating dogs as domestic animals rather than as sacred beings with specific forms and ritual significance in this wā.',
      'Overlooking bats as named genealogical creatures, not background scenery.'
    ]
  },
  8: {
    vocabulary: [
      { term: 'Laʻilaʻi', meaning: 'The foundational female figure whose birth marks human emergence in the Kumulipo genealogy.' },
      { term: 'Kiʻi', meaning: 'The foundational male figure born alongside Laʻilaʻi, forming the first human pair in the chant.' },
      { term: 'Kanaka', meaning: 'Human being; Wā 8 marks the moment humans are born into the genealogical sequence — not as rulers but as kin.' },
      { term: 'Waiʻololi / Waiʻolola', meaning: 'The narrow stream and the broad stream; the recurring refrain pairing male and female at every threshold of emergence.' }
    ],
    foundationCards: [
      { title: 'Humans Are Born, Not Appointed', body: 'Wā 8 presents human emergence through the same genealogical language as coral, fish, and birds — humans arrive within, not above, creation.' },
      { title: 'Laʻilaʻi as Foundational Ancestor', body: 'The named female figure Laʻilaʻi is the pivotal human ancestral presence, with Kiʻi as her male counterpart — human origin is named and relational.' },
      { title: 'Continuity Not Rupture', body: 'The arrival of humans does not break the chant\'s pattern — the same birth-language continues, placing human life within the long genealogy of all living things.' }
    ],
    commonMisreadings: [
      'Reading human emergence as a culminating achievement rather than as one more birth within the ongoing genealogical sequence.',
      'Treating Laʻilaʻi and Kiʻi as mythic symbols rather than as named ancestors who anchor human identity within the chant.',
      'Missing that "kanaka" is introduced through the same relational language used for every other creature in the Kumulipo.'
    ]
  },
  9: {
    vocabulary: [
      { term: 'Ao', meaning: 'Light, visibility, and the humanly inhabited realm that emerges in continuity with pō.' },
      { term: 'Pō', meaning: 'Source-depth that remains present even as ao unfolds.' },
      { term: 'Huli', meaning: 'Turning, transformation, or change in state rather than abrupt rupture.' },
      { term: 'Lani', meaning: 'Heaven, sky, or elevated domain, often signaling cosmic relation and ordering.' }
    ],
    foundationCards: [
      { title: 'Turning, Not Rupture', body: 'Ao emerges from pō without rejecting its source.' },
      { title: 'Visibility from Depth', body: 'What becomes visible remains rooted in what came before.' },
      { title: 'Continuity Through Change', body: 'Transformation is continuity in a new register, not severance.' }
    ],
    commonMisreadings: [
      'Treating ao as a total break from pō.',
      'Reading transition as replacement rather than continuity.',
      'Missing that visibility still depends on generative depth.'
    ]
  },
  10: {
    vocabulary: [
      { term: 'Akua', meaning: 'Divine or sacred ancestral presences within the genealogical ordering of the chant.' },
      { term: 'Inoa', meaning: 'Name; in Hawaiian thought, naming can locate beings within relation and significance.' },
      { term: 'Hānau', meaning: 'Birth or emergence, signaling genealogical becoming.' },
      { term: 'Moʻokūʻauhau', meaning: 'Genealogy as remembered continuity and ordered relationship.' }
    ],
    foundationCards: [
      { title: 'Genealogy as Ordering', body: 'Sacred order becomes legible through named ancestral relations.' },
      { title: 'Naming as Placement', body: 'Names do more than label; they place beings within a structured field of relation.' },
      { title: 'Memory as Structure', body: 'Genealogy preserves cosmology through disciplined sequence.' }
    ],
    commonMisreadings: [
      'Reducing divine genealogy to a list of names.',
      'Treating naming as decorative rather than structural.',
      'Missing memory as a core knowledge system.'
    ]
  },
  11: {
    vocabulary: [
      { term: 'Hanauna', meaning: 'Generation, descendant line, or lineage grouping within a larger ancestral sequence.' },
      { term: 'Aliʻi', meaning: 'Chiefly rank or leadership, ideally tied to responsibility, not mere privilege.' },
      { term: 'Kuleana', meaning: 'Obligation, duty, and accountable relation carried by inherited placement.' },
      { term: 'Lani', meaning: 'Sky, heaven, or elevated sacred orientation that frames high genealogical lines.' }
    ],
    foundationCards: [
      { title: 'Higher Duty', body: 'Elevated lineages mean intensified responsibility, not mere prestige.' },
      { title: 'Rank with Accountability', body: 'Lineal distinction carries ethical weight and reciprocal obligation.' },
      { title: 'Leadership in Relation', body: 'Authority has meaning only when tied to land, ancestry, and future life.' }
    ],
    commonMisreadings: [
      'Reading high lineage as status alone.',
      'Confusing genealogy with entitlement.',
      'Ignoring duties embedded in elevated position.'
    ]
  },
  12: {
    vocabulary: [
      { term: 'Pili Aliʻi', meaning: 'Chiefly relational ties, linking authority to lineage and obligation.' },
      { term: 'Kauoha', meaning: 'Charge, command, or entrusted direction, often implying duty and transmission.' },
      { term: 'Wauke', meaning: 'Paper mulberry, a significant plant in Hawaiian material and cultural practice.' },
      { term: 'ʻUlu', meaning: 'Breadfruit or growth; a term that carries both botanical and generative significance.' }
    ],
    foundationCards: [
      { title: 'Governance Through Relation', body: 'Leadership appears as a relational trust grounded in genealogy and place.' },
      { title: 'Political Order as Sacred', body: 'Authority is part of ancestral and ecological balance, not detached administration.' },
      { title: 'Rule by Balance', body: 'The measure of leadership is how well it keeps relationships aligned.' }
    ],
    commonMisreadings: [
      'Treating chiefly lines as mere political succession.',
      'Separating governance from sacred responsibility.',
      'Reading leadership as control rather than stewardship.'
    ]
  },
  13: {
    vocabulary: [
      { term: 'Kanaka', meaning: 'Human being or person, understood in the Kumulipo through relation rather than separation.' },
      { term: 'Haumea', meaning: 'A powerful female ancestral figure in Hawaiian genealogy and generative traditions.' },
      { term: 'Hāloa', meaning: 'A foundational ancestor name associated with long breath, lineage, and human continuity.' },
      { term: 'Kanaloa', meaning: 'A major akua often associated with oceanic depth, power, and sacred relation.' }
    ],
    foundationCards: [
      { title: 'Human Continuity', body: 'Humans emerge as continuation, not interruption, of the living genealogy.' },
      { title: 'Personhood as Belonging', body: 'To be human is to belong within pre-existing webs of ancestry and ecology.' },
      { title: 'Kinship Over Exception', body: 'Human meaning comes from embeddedness, not separation.' }
    ],
    commonMisreadings: [
      'Treating humans as separate from the rest of creation.',
      'Reading human arrival as the beginning of value.',
      'Ignoring kinship obligations carried by personhood.'
    ]
  },
  14: {
    vocabulary: [
      { term: 'Hanauna', meaning: 'Generational branching or descendant lines expanding through time.' },
      { term: 'Pilina', meaning: 'Relationship, connection, or binding tie between people, places, and ancestral lines.' },
      { term: 'Kumuhonua', meaning: 'A named ancestral figure whose name evokes foundational relation to earth or source.' },
      { term: 'Hāloa', meaning: 'A key ancestral name signaling continuity across descendant communities.' }
    ],
    foundationCards: [
      { title: 'Branching Lineages', body: 'Descent widens into social complexity while preserving genealogical coherence.' },
      { title: 'Community as Expansion', body: 'More descendants means denser relation, not greater separation.' },
      { title: 'Belonging Across Generations', body: 'Collective identity is sustained through continuity and care.' }
    ],
    commonMisreadings: [
      'Reading expansion as dilution of relation.',
      'Reducing descendants to numbers instead of obligations.',
      'Missing the communal dimension of genealogical growth.'
    ]
  },
  15: {
    vocabulary: [
      { term: 'Kauoha', meaning: 'Entrusted instruction or charge carried forward through genealogy.' },
      { term: 'Kuleana', meaning: 'Responsibility that must be enacted, not merely recognized.' },
      { term: 'Haumea', meaning: 'Ancestral female source figure tied to generation, continuity, and transformation.' },
      { term: 'Nānāulu', meaning: 'A named descendant line linked to human and social expansion in Hawaiian genealogy.' }
    ],
    foundationCards: [
      { title: 'Ethics of Inheritance', body: 'Genealogy carries duty, not just identity.' },
      { title: 'Knowledge into Conduct', body: 'Insight must become practice; memory without action is incomplete.' },
      { title: 'Care for What Follows', body: 'Responsibility is intergenerational and future-facing.' }
    ],
    commonMisreadings: [
      'Treating inheritance as entitlement rather than duty.',
      'Separating spiritual knowledge from conduct.',
      'Ignoring the future-facing nature of kuleana.'
    ]
  },
  16: {
    vocabulary: [
      { term: 'Ao Kanaka', meaning: 'The human realm in light, where living responsibility becomes explicit.' },
      { term: 'Mālama', meaning: 'To care for, preserve, and sustain in right relationship.' },
      { term: 'Lono', meaning: 'A major akua associated with fertility, seasonality, peace, and abundance in Hawaiian tradition.' },
      { term: 'Pilina', meaning: 'Relationship or relational bond, central to understanding human kuleana.' }
    ],
    foundationCards: [
      { title: 'Human Realm as Responsibility', body: 'Culmination means stewardship, not supremacy.' },
      { title: 'Embodied Relation', body: 'Ancestry, ecology, governance, and spirit converge as lived human conduct.' },
      { title: 'Mālama as Outcome', body: 'The final lesson is that to be human is to mālama the relations that sustain life.' }
    ],
    commonMisreadings: [
      'Reading culmination as human domination over creation.',
      'Treating the final wā as an endpoint rather than ongoing practice.',
      'Missing that human meaning is defined by mālama, not control.'
    ]
  }
};

const KUMULIPO_WA_DEEP_MAP = {
  1:  { hawaiianTitle: 'Wā o ke Koʻa', englishTitle: 'Pō and Foundational Marine Emergence', movement: 'Breathing the Deep Fold', metaphor: 'the deep fold', crisis: 'Treating origin as empty darkness instead of fertile ancestral depth erases the obligations carried by every later emergence.', intelligence: 'source-attunement', issue: 'climate origin stories', caution: 'A common reduction is to romanticize pō as vague mysticism. This wā names pō as living origin-depth with obligations.', arc: 'This is the first of 16 wā movements. By the end, you will not have learned about the Kumulipo. You will have crossed through it: from the deep breathing of Pō alone, through coral and sea and shoot and root, to the human standing in Ao with Lono in the eye — carrying the dark within, seeing consequence as obligation, and knowing that to be human is to be small among animals and responsible for everything.' },
  2:  { hawaiianTitle: 'Wā o nā Mea o ke Kai', englishTitle: 'Sea Multiplicity', movement: 'Parting into Relation', metaphor: 'the first parting', crisis: 'If multiplicity is read as inventory for extraction, marine kinship collapses into resource logic.', intelligence: 'patterned abundance discernment', issue: 'ocean exploitation', caution: 'Well-intentioned biodiversity language can still treat beings as data points. This wā insists they are kin in genealogy.' },
  3:  { hawaiianTitle: 'Wā o nā Mea Lele', englishTitle: 'Insects, Birds, and the Flying World', movement: 'Transforming into Flight', metaphor: 'the parent and the child that flies', crisis: 'When transformation is ignored or flattened into taxonomy, the genealogical meaning of metamorphosis — parent giving birth to a flying child — is lost.', intelligence: 'transformation-attunement', issue: 'loss of native bird species and insect populations', caution: 'A common reduction is to treat the insect-to-bird sequence as a species catalogue rather than as a genealogy of transformation and flight.' },
  4:  { hawaiianTitle: 'Wā o nā Mea Kolo', englishTitle: 'Small and Transitional Forms', movement: 'Crawling into Sensation', metaphor: 'the sea creatures becoming movement', crisis: 'If small and transitional life is dismissed as minor, the chain of continuity is severed at its connective joints.', intelligence: 'threshold attention', issue: 'habitat fragmentation', caution: 'A frequent misread is to rank beings by size and charisma. This wā trains attention to connective life.' },
  5:  { hawaiianTitle: 'Wā o ka Puaʻa', englishTitle: 'Pigs and Human Social Diversity', movement: 'Digging into the Land', metaphor: 'the pig rooting in the earth', crisis: 'Reading Wā 5 as a continuation of sea life misses the fundamental shift to land animals and the emergence of human social diversity named through head-types and classes.', intelligence: 'social-diversity awareness', issue: 'land use, animal kinship, and human plurality', caution: 'The list of human head-types is easily misread as racial taxonomy; it is instead a genealogical naming of human diversity as part of the night\'s abundance.' },
  6:  { hawaiianTitle: 'Wā o ka ʻIole', englishTitle: 'Chiefly Lines, Cultivation, and Rats', movement: 'Sprouting into Habitation', metaphor: 'the rat in the upland and by the sea', crisis: 'If the rat and the chiefly lines are skipped as minor, the emergence of cultivation and inhabited land is erased from the genealogy.', intelligence: 'habitation awareness', issue: 'food sovereignty and chiefly succession', caution: 'A common error is to treat Wā 6 as a filler between animals and humans — it is the wā where agriculture and social structure enter the genealogy.' },
  7:  { hawaiianTitle: 'Wā o ka ʻĪlio', englishTitle: 'Dogs, Bats, and Sacred Dread', movement: 'Standing in Fear on the Ridge', metaphor: 'the mountain top and the offering place', crisis: 'If the opening dread-language is treated as decoration, the wā\'s core teaching about sacred approach to knowledge is lost.', intelligence: 'sacred-approach attunement', issue: 'sacred protocols and ecological reverence', caution: 'Wā 7 is easily flattened into a catalogue of animals — it is equally a teaching about the proper feeling-tone for approaching what is sacred and unknown.' },
  8:  { hawaiianTitle: 'Wā o Laʻilaʻi', englishTitle: 'Human Emergence', movement: 'Being Born into Relation', metaphor: 'the narrow stream and the broad stream', crisis: 'Human-centered reading converts the arrival of Laʻilaʻi and Kiʻi into a crowning event, erasing that humans are born into — not above — the living genealogy.', intelligence: 'relational-selfhood orientation', issue: 'human exceptionalism and ecological disconnection', caution: 'This wā is often read as the climax of creation. In the Kumulipo it is one more birth, named the same way as coral, fish, and birds — continuous, not supreme.' },
  9:  { hawaiianTitle: 'Wā o ka Huli i ke Ao', englishTitle: 'Turning Toward Light', movement: 'Turning Courage toward Light', metaphor: 'the door', crisis: 'If ao is framed as escape from pō, learners lose ancestral depth and mistake visibility for truth.', intelligence: 'the courage to turn and wait', issue: 'social transitions', caution: 'Modern narratives of progress misread this as linear ascent. The chant names a hinge, not a graduation.' },
  10: { hawaiianTitle: 'Wā o nā Kūpuna Akua', englishTitle: 'Ancestral Divine Genealogies', movement: 'Building the Calm Wall', metaphor: 'the wall', crisis: 'Without disciplined naming, genealogy becomes abstraction and authority detaches from accountability.', intelligence: 'genealogical orientation', issue: 'memory loss and disinformation', caution: 'A common reduction is to treat divine lines as mythic ornament rather than structural governance.' },
  11: { hawaiianTitle: 'Wā o nā Hanauna Kiʻekiʻe', englishTitle: 'High Genealogical Lines', movement: 'Bending Heaven toward Duty', metaphor: 'the bent arch', crisis: 'If height is read as entitlement, leadership becomes extraction and the arch of responsibility collapses.', intelligence: 'positional awareness', issue: 'leadership ethics', caution: 'This wā forbids linear superiority thinking; high returns to low through obligation.' },
  12: { hawaiianTitle: 'Wā o nā Pili Aliʻi', englishTitle: 'Chiefly Relational Lines', movement: 'Raising Pillars of Stewardship', metaphor: 'the pillars', crisis: 'When governance is detached from genealogy, power loses relational legitimacy and harms land-community balance.', intelligence: 'relational governance', issue: 'institutional trust collapse', caution: 'Well-intentioned policy language can ignore ancestral protocol and flatten kuleana into management.' },
  13: { hawaiianTitle: 'Wā o ka Hānau Moʻokūʻauhau', englishTitle: 'Human Genealogical Emergence', movement: 'Rooting Humans in Kinship', metaphor: 'the root and shoot', crisis: 'If human emergence is read as crowning achievement, kinship contracts and obligation weakens.', intelligence: 'smallness before grandeur', issue: 'human exceptionalism in technology', caution: 'A frequent misread is to convert genealogy into DNA-only identity and erase ethical relation.' },
  14: { hawaiianTitle: 'Wā o ka Hoʻonui Hanauna', englishTitle: 'Expansion of Descendant Lines', movement: 'Weaving Care at Scale', metaphor: 'the woven roof', crisis: 'Scaling descendants without scaling care produces fragmentation, extraction, and inherited instability.', intelligence: 'scalable care', issue: 'community fragmentation', caution: 'Growth metrics alone misread this wā; expansion must widen responsibility, not just numbers.' },
  15: { hawaiianTitle: 'Wā o ke Kauoha a me ke Kuleana', englishTitle: 'Charge and Responsibility', movement: 'Carrying Weight into Conduct', metaphor: 'the hearth', crisis: 'When inheritance is framed as entitlement, charge becomes possession and kuleana is abandoned.', intelligence: 'discernment of weight', issue: 'intergenerational justice', caution: 'A common misread is moralizing duty as guilt; this wā frames duty as relational clarity and action.' },
  16: { hawaiianTitle: 'Wā o ke Ao Kanaka', englishTitle: 'Human Realm in Light', movement: 'Seeing Consequence in the Eye', metaphor: 'the eye in the gable', crisis: 'If consequence is ignored, human agency becomes blind force and the full arc is betrayed.', intelligence: 'consequence as vision', issue: 'governance and climate accountability', caution: 'The final reduction is to read culmination as endpoint. This wā begins lived obligation.', arc: 'This is the 16th wā movement. You have crossed from the deep breathing of Pō alone, through coral and sea and shoot and root, to this moment: the human standing in Ao with Lono in the eye — carrying the dark within, seeing consequence as obligation, and knowing that to be human is to be small among animals and responsible for everything. This page does not end the learning. It begins the living.' }
};

const KUMULIPO_WA_SCIENCE_MAP = {
  1: ['quantum', 'string'],
  2: ['quantum', 'string'],
  3: ['string'],
  4: ['darwin'],
  5: ['darwin'],
  6: [],
  7: [],
  8: ['darwin'],
  9: ['quantum'],
  10: ['quantum', 'string'],
  11: ['string'],
  12: [],
  13: ['darwin'],
  14: ['darwin', 'quantum'],
  15: ['darwin'],
  16: ['darwin', 'quantum', 'string']
};

function buildScientificResonanceSection({ waNumber, deep, config }) {
  const frameworks = KUMULIPO_WA_SCIENCE_MAP[waNumber] || [];

  const blocks = {
    darwin: {
      title: 'Resonance with Charles Darwin · Evolution by Descent',
      paragraphs: [
        `${config.waLabel} resonates with Darwinian descent where branching continuity matters: forms emerge through deep time, and no being stands outside lineage. The Kumulipo holds this as genealogical relation rather than mechanism language.`,
        'Darwinian frameworks explain diversification through natural selection and inherited variation. This wā adds an ethical register: descent carries kuleana, so genealogy is obligation, not entitlement.'
      ],
      alignment: 'Both frameworks place humans within a broader lineage rather than above other beings.',
      difference: 'Darwinian theory explains mechanism; this wā centers relational and ethical consequence.'
    },
    quantum: {
      title: 'Resonance with Quantum Theory · Entanglement and Observation',
      paragraphs: [
        `${config.waLabel} resonates with quantum non-separability in how relation precedes isolated units. The chant framework treats beings as already interconnected within one unfolding field of emergence.`,
        waNumber === 16
          ? 'At Wā 16, Lono-i-ka-maka sharpens this resonance: seeing is participatory. Observation is not detached; it changes what becomes actionable and binds witness to response.'
          : waNumber === 9
            ? 'At Wā 9, the turn toward ao resonates with threshold observation: visibility changes the field, yet pō remains active as source-depth within what appears.'
            : 'Quantum descriptions often model measurement and collapse mathematically. This wā frames participation genealogically and ethically, emphasizing conduct rather than instrument readout.'
      ],
      alignment: 'Both frameworks reject a fully detached observer and emphasize relation over isolation.',
      difference: 'Quantum theory seeks predictive formalism; this wā seeks relational orientation and kuleana in practice.'
    },
    string: {
      title: 'Resonance with String Theory · Vibrational Emergence and Hidden Dimensions',
      paragraphs: [
        `${config.waLabel} resonates with string-theory intuitions where visible form emerges from deeper, less-visible structure. The chant describes emergence from folded or hidden substrata in ways that invite parallel description, not equivalence.`,
        waNumber === 16
          ? 'The naming of Kelea-nui-noho-ana-ʻapiʻapi in this threshold aligns with the image of folded structure: what appears in ao depends on what remains concealed and compressed in depth.'
          : waNumber === 11
            ? 'The bent geometry of piʻo in this threshold echoes curved and folded spatial imagination. The Kumulipo treats this as cosmological relation, while string theory treats it as mathematical structure.'
            : 'String frameworks pursue mathematically constrained models of hidden dimensions and vibration. This wā contributes genealogical meaning and relational consequence to that pattern language.'
      ],
      alignment: 'Both describe visible reality as dependent on deeper folded or hidden structures.',
      difference: 'String theory is mathematical and test-oriented; this wā is genealogical, ethical, and place-anchored.'
    }
  };

  const renderedBlocks = frameworks.map(key => {
    const item = blocks[key];
    if (!item) return '';
    return `
      <h5>${item.title}</h5>
      <p>${item.paragraphs[0]}</p>
      <p>${item.paragraphs[1]}</p>
      <p><strong>Key alignment:</strong> ${item.alignment}</p>
      <p><strong>Key difference:</strong> ${item.difference}</p>
    `;
  }).join('');

  const scopeNote = frameworks.length
    ? ''
    : '<p>This wā is carried primarily through genealogical and ethical description. Scientific resonance is intentionally minimal here to avoid forced comparison and preserve epistemic integrity.</p>';

  const contextualBridge = `<p><strong>Context in this wā:</strong> ${config.waLabel} is working through ${deep.movement.toLowerCase()} with a specific warning: ${deep.crisis} Resonance is useful only if it helps protect ${deep.intelligence} in lived decisions.</p>`;
  const methodBoundary = '<p><strong>Method boundary:</strong> Scientific frameworks aim for formal explanation and predictive scope, while the Kumulipo here provides genealogical orientation, protocol memory, and kuleana-bearing conduct.</p>';
  const readingGuidance = '<p><strong>Reading guidance:</strong> Use these parallels to sharpen pattern recognition, then return to the chant line, language, and place-based obligations as the primary interpretive authority.</p>';

  return `
  <section class="kumu-section kumu-reveal">
    <h4>Scientific Resonances · Parallel Descriptions</h4>
    <p><em>The following comparisons are not claims of equivalence or prediction. They are invitations to see how different epistemologies, genealogical and scientific, describe related phenomena of emergence, differentiation, and entanglement. Each framework honors its own methods and purposes.</em></p>
    ${contextualBridge}
    ${scopeNote}
    ${renderedBlocks}
    ${methodBoundary}
    ${readingGuidance}
    <h5>Caution · What These Resonances Do Not Mean</h5>
    <p>These resonances do not mean the Kumulipo predicted evolution, quantum theory, or string theory. They do not mean science proves the Kumulipo. They indicate parallel descriptions across distinct epistemologies that can deepen understanding of both without reducing either one.</p>
  </section>
  `;
}

function getDefaultIntracrisesForWa(waNumber) {
  const map = {
    1: [
      { tension: 'Potential vs. Form', question: 'How can origin remain fertile depth once form begins to appear?' },
      { tension: 'Naming vs. Possessing', question: 'How do we name first emergence without claiming ownership over it?' }
    ],
    2: [
      { tension: 'Abundance vs. Extraction', question: 'How is marine multiplicity protected from becoming an inventory mindset?' },
      { tension: 'Difference vs. Separation', question: 'How can many forms emerge without losing genealogical kinship?' }
    ],
    3: [
      { tension: 'Foundation vs. Visibility', question: 'Why are support layers hardest to protect before collapse is visible?' },
      { tension: 'Nourishment vs. Throughput', question: 'When does feeding life become mere production logic?' }
    ],
    4: [
      { tension: 'Smallness vs. Significance', question: 'How do we keep small transitional life central to meaning?' },
      { tension: 'Movement vs. Stability', question: 'What must remain fluid so larger continuity can hold?' }
    ],
    5: [
      { tension: 'Scale vs. Dependency', question: 'How do larger beings remain accountable to foundational systems?' },
      { tension: 'Presence vs. Dominance', question: 'When does visibility begin to masquerade as entitlement?' }
    ],
    6: [
      { tension: 'Boundary vs. Wall', question: 'How can boundaries guide relation without becoming separation?' },
      { tension: 'Mobility vs. Belonging', question: 'How does crossing domains deepen, rather than dilute, kuleana?' }
    ],
    7: [
      { tension: 'Growth vs. Limit', question: 'How can terrestrial growth stay aligned with watershed limits?' },
      { tension: 'Rootedness vs. Drift', question: 'What practices keep land emergence tied to prior ocean genealogies?' }
    ],
    8: [
      { tension: 'Human Attention vs. More-than-Human Value', question: 'How do we resist centering humans when animal kinship is named?' },
      { tension: 'Care vs. Control', question: 'When does protection language become domination language?' }
    ],
    9: [
      { tension: 'Light vs. Depth', question: 'How can turning toward ao avoid rejecting ancestral pō?' },
      { tension: 'Urgency vs. Ripening', question: 'What must be waited for at thresholds of transformation?' }
    ],
    10: [
      { tension: 'Memory vs. Abstraction', question: 'How is naming kept relational instead of becoming empty taxonomy?' },
      { tension: 'Order vs. Rigidity', question: 'When does structure stop serving life and begin to harden power?' }
    ],
    11: [
      { tension: 'Height vs. Humility', question: 'How can elevated position deepen service rather than entitlement?' },
      { tension: 'Rank vs. Reciprocity', question: 'What ensures high lines remain answerable to low foundations?' }
    ],
    12: [
      { tension: 'Authority vs. Stewardship', question: 'How does governance remain a relational duty instead of command?' },
      { tension: 'Protocol vs. Access', question: 'How can inclusion grow without erasing ancestral discipline?' }
    ],
    13: [
      { tension: 'Emergence vs. Exceptionalism', question: 'How can human arrival be read as inclusion, not crowning?' },
      { tension: 'Identity vs. Obligation', question: 'When lineage is named, what actions must follow?' }
    ],
    14: [
      { tension: 'Expansion vs. Coherence', question: 'How does widening descendant life avoid fragmentation?' },
      { tension: 'Scale vs. Intimacy', question: 'What keeps care personal as communities grow larger?' }
    ],
    15: [
      { tension: 'Charge vs. Burden', question: 'How is inherited duty carried without collapsing into despair?' },
      { tension: 'Legacy vs. Extraction', question: 'When does inheritance become possession instead of stewardship?' }
    ],
    16: [
      { tension: 'Vision vs. Action', question: 'How does seeing consequence become shared governance, not private insight?' },
      { tension: 'Culmination vs. Continuation', question: 'What keeps this ending as a beginning of lived practice?' }
    ]
  };

  return map[waNumber] || [
    { tension: 'Visibility vs. Depth', question: 'How can this wā move into clearer form without abandoning ancestral depth?' },
    { tension: 'Inheritance vs. Entitlement', question: 'When lineage is named, what keeps it as kuleana rather than possession?' }
  ];
}

function buildKumulipoWaContent(config) {
  const waNumber = Number((String(config.waLabel || '').match(/Wā\s+(\d+)/) || [])[1] || 0);
  const pedagogy = KUMULIPO_WA_PEDAGOGY[waNumber] || {};
  const deep = KUMULIPO_WA_DEEP_MAP[waNumber] || KUMULIPO_WA_DEEP_MAP[1];
  const previousDeep = KUMULIPO_WA_DEEP_MAP[Math.max(1, waNumber - 1)] || null;
  const nextDeep = KUMULIPO_WA_DEEP_MAP[Math.min(16, waNumber + 1)] || null;

  const sourceTag = text => `<span class="kumu-wa-source-tag">${text}</span>`;

  const safeLine = index => {
    if (!Array.isArray(config.lines) || !config.lines.length) return 'No chant line selected.';
    return config.lines[index] || config.lines[0];
  };

  const escapeKumu = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const objectives = [
    `Name the central movement in this wā and explain how it transforms relation without implying linear progress.`,
    `Recognize the specific crisis in this wā and describe what is lost when it is ignored or misused.`,
    `Practice ${deep.intelligence} by connecting this wā to a real decision in community, governance, family, or place.`,
    `Follow how this wā carries pō into ao while preparing ${nextDeep ? `Wā ${waNumber + 1}` : 'ongoing lived kuleana beyond the chant'}.`
  ].slice(0, 5);

  const objectiveReveals = [
    `Knowledge reveal: The movement is ${deep.movement.toLowerCase()}, and its purpose is relational transformation rooted in ${deep.metaphor}, not linear advancement or human supremacy.`,
    `Knowledge reveal: The crisis in this wā is ${deep.crisis.toLowerCase()} The loss is practical: weakened kuleana, damaged continuity, and decisions detached from consequence.`,
    `Knowledge reveal: ${deep.intelligence} becomes visible when choices are made with genealogy as obligation, especially where short-term gain conflicts with long-term relation.`,
    `Knowledge reveal: This wā keeps pō active inside ao; it receives from ${previousDeep ? `Wā ${waNumber - 1}` : 'pure beginning'} and prepares ${nextDeep ? `Wā ${waNumber + 1}` : 'lived practice beyond the chant'} in one unbroken arc.`
  ];

  const objectiveTitles = [
    'Movement Clarity',
    'Crisis Visibility',
    'Practice Intelligence',
    'Continuity Thread'
  ];

  const objectiveContext = [
    'How this wā shifts orientation',
    'Where failure modes become visible',
    'How capacity becomes lived conduct',
    'How this wā links backward and forward'
  ];

  const objectiveRows = objectives.map((objective, index) => `
    <article class="kumu-wa-objective-card">
      <h5>${objectiveTitles[index] || `Objective ${index + 1}`}</h5>
      <p class="kumu-wa-objective-card__context">${objectiveContext[index] || 'Learning orientation'}</p>
      <p><strong>${objective}</strong></p>
      <p>${objectiveReveals[index] || ''}</p>
    </article>
  `).join('');

  const selectionNote = config.selectionNote || `These lines were selected because they illuminate ${deep.metaphor} and show how ${config.waLabel} holds both emergence and risk. The Hawaiian lines remain the primary source; the English is an interpretive aid for orientation.`;

  const foundationLenses = [
    `${config.waLabel} should be approached as one movement in an unbroken genealogical arc, not a standalone episode.`,
    `This wā is not a story of human ascent; it trains ${deep.intelligence} inside a living more-than-human chain.`,
    `${previousDeep ? `It continues Wā ${waNumber - 1} by carrying ${previousDeep.movement.toLowerCase()} into ${deep.movement.toLowerCase()}.` : 'It opens the sequence by naming pure beginning in pō before visible differentiation.'}`,
    `${nextDeep ? `It prepares Wā ${waNumber + 1} by making possible ${nextDeep.movement.toLowerCase()}.` : 'It prepares the learner to leave the page and begin lived kuleana.'}`,
    `Pō is carried into ao here as foundation and memory; light does not cancel darkness, it reveals responsibility inside it.`
  ];

  const vocabSource = (config.vocabulary && config.vocabulary.length
    ? config.vocabulary
    : pedagogy.vocabulary && pedagogy.vocabulary.length
      ? pedagogy.vocabulary
      : [
          { term: 'Pō', meaning: 'Generative ancestral darkness that remains active in every emergence.' },
          { term: 'Ao', meaning: 'Realm of visibility where obligation becomes conduct, not supremacy.' },
          { term: 'Moʻokūʻauhau', meaning: 'Genealogical continuity that binds beings, places, and duties.' },
          { term: 'Kuleana', meaning: 'Inherited charge to respond in right relation.' }
        ]
  ).slice(0, 6);

  const vocab = [...vocabSource];
  if (!vocab.some(item => /pō|po/i.test(item.term))) {
    vocab.push({ term: 'Pō', meaning: 'In this wā, pō is carried as ancestral depth shaping interpretation and responsibility.' });
  }
  if (!vocab.some(item => /ao/i.test(item.term))) {
    vocab.push({ term: 'Ao', meaning: 'In this wā, ao marks visibility with accountability, not a break from origin.' });
  }

  const vocabularyRows = vocab.slice(0, 6).map(item => `
    <tr>
      <td><strong>${item.term}</strong></td>
      <td>${item.meaning}</td>
    </tr>
  `).join('');

  const intracrises = (config.intracrises && config.intracrises.length
    ? config.intracrises
    : getDefaultIntracrisesForWa(waNumber)
  ).slice(0, 4);

  const toGuidance = text => String(text || '')
    .replace(/\?+$/g, '')
    .replace(/^How\s+/i, 'Practice ')
    .replace(/^What\s+/i, 'Apply ')
    .replace(/^When\s+/i, 'Notice when ');

  const intracrisisRows = intracrises.map(item => `
    <tr>
      <td>${item.tension}</td>
      <td>${toGuidance(item.question)}.</td>
    </tr>
  `).join('');

  const modernRowsRaw = (config.parallels || []).slice(0, 4);
  const modernRows = (modernRowsRaw.length ? modernRowsRaw : [
    { title: 'Systems Thinking', body: 'Helps modern learners notice relational pattern and cumulative consequence.' },
    { title: 'Ecology', body: 'Clarifies interdependence and limits extractive interpretations.' }
  ]).map(item => `
    <tr>
      <td>${item.title}</td>
      <td>Modern ${item.title.toLowerCase()} often seeks universal abstraction; this wā stays genealogical, place-based, and protocol-bound.</td>
      <td>${item.body}</td>
    </tr>
  `).join('');

  const deepenStudyPathways = (config.inquiryPrompts && config.inquiryPrompts.length ? config.inquiryPrompts : [
    `Identify where the crisis named in ${config.waLabel} is active in your community and document concrete evidence.`,
    `Trace consequence two steps forward when this wā is misunderstood in governance, education, or family life.`,
    `Map how ${config.waLabel} reinterprets Wā ${Math.max(1, waNumber - 1)} and carries continuity into present practice.`,
    `${nextDeep ? `Protect the conditions this wā requires so Wā ${waNumber + 1} can emerge without distortion.` : 'Carry one clear practice from this wā into daily life so the arc remains living.'}`,
    `Apply smallness-before-grandeur by making one decision that centers more-than-human relation this month.`
  ]).slice(0, 6).map(item => `<li>${toGuidance(item).replace(/\.+$/,'')}.</li>`).join('');

  const misreadingsSource = (config.commonMisreadings && config.commonMisreadings.length
    ? config.commonMisreadings
    : pedagogy.commonMisreadings && pedagogy.commonMisreadings.length
      ? pedagogy.commonMisreadings
      : [
          'Reading this wā as mythic past instead of living orientation.',
          'Treating modern parallels as replacements for Hawaiian source meaning.',
          'Assuming human centrality rather than genealogical inclusion.'
        ])
    .slice(0, 5);

  const misreadings = misreadingsSource.map(item => {
    const cleaned = String(item).replace(/\.$/, '');
    return `<li><strong>"${cleaned}"</strong> — Corrective: Read the chant as living genealogy where relation creates obligation, and keep modern frameworks as orientation aids only.</li>`;
  }).join('');

  const continuityAnchor = waNumber === 1
    ? `
      <p>${sourceTag('Continuity')} Wā 1 is pure beginning in the deep fold of pō: not emptiness, but charged ancestral potential where relation is born before hierarchy.</p>
      <ul>
        <li><strong>Forward to Wā 2:</strong> The first parting of sea multiplicity becomes possible because Wā 1 establishes generative depth and ordered emergence.</li>
        <li><strong>Origin reflection:</strong> At pure beginning, responsibility is seed-form: to witness origin without claiming ownership of it.</li>
      </ul>
    `
    : waNumber === 16
      ? `
        <p>${sourceTag('Continuity')} Wā 16 receives the charge of Wā 15 and places it in sight: consequence must become vision, and vision must become conduct.</p>
        <ul>
          <li><strong>Back to Wā 15:</strong> The hearth of weight becomes the eye in the gable; charge becomes accountable seeing.</li>
          <li><strong>Full-arc reflection:</strong> The sequence from deep fold to eye in the gable teaches one continuity: humans are small among ancestors and responsible for the whole chain.</li>
        </ul>
      `
      : `
        <p>${sourceTag('Continuity')} This wā sits between ${previousDeep.metaphor} and ${nextDeep.metaphor}, carrying forward cumulative continuity rather than linear progress.</p>
        <ul>
          <li><strong>From Wā ${waNumber - 1}:</strong> ${previousDeep.movement} gives the structural conditions this wā receives.</li>
          <li><strong>Toward Wā ${waNumber + 1}:</strong> ${deep.movement} prepares the next movement of ${nextDeep.movement.toLowerCase()}.</li>
          <li><strong>Arc reminder:</strong> Pō remains active within ao here; genealogy names obligation, not entitlement.</li>
        </ul>
      `;

  const culturalContext = `${sourceTag('Cultural reading')} In ${config.waLabel}, ${config.emergence} ${config.relationships} Within the wider Kumulipo arc, ${config.structureRole} The embedded crisis is explicit: ${deep.crisis} This wā prepares ${nextDeep ? `Wā ${waNumber + 1} by training ${deep.intelligence} before the next emergence.` : 'the learner to move from study into lived kuleana beyond this page.'}`;

  const whyAction = config.kuleanaQuestion || `Name one concrete decision you will change this week so ${deep.intelligence} becomes visible in your own place, family, or work.`;
  const whyNow = `${sourceTag('Kuleana now')} ${config.whyNow} In contemporary ${deep.issue}, this wā warns that knowledge without relation becomes extraction. Its intelligence is practical: ${deep.intelligence} as a collective capacity for consequence-aware action. Genealogy here is not memory alone; it is governance, care, and restraint in real decisions. ${whyAction}`;
  const scientificResonancesSection = buildScientificResonanceSection({ waNumber, deep, config });

  const chantExcerpt = Array.isArray(config.lines) && config.lines.length
    ? `
      ${sourceTag('Primary chant')}
      <chant lang="'Olelo Hawaii" title="Selected Kumulipo Lines for Wā ${waNumber}">
${config.lines.join('\n')}
      </chant>
      ${Array.isArray(config.lineTranslations) && config.lineTranslations.length ? `
      ${sourceTag('Interpretive translation')}
      <chant lang="English" title="Interpretive English Translation for Wā ${waNumber}">
${config.lineTranslations.join('\n')}
      </chant>
      ` : ''}
    `
    : `
      <div class="kumu-wa-chant-placeholder">
        <p><strong>Selected Kumulipo lines for this wā will be inserted here.</strong></p>
      </div>
    `;

  const expectedLineCount = Number(config.startLine) && Number(config.endLine)
    ? (Number(config.endLine) - Number(config.startLine) + 1)
    : 0;

  const sourceVersePairs = Array.isArray(config.versePairs) && config.versePairs.length
    ? config.versePairs
    : (window.KUMULIPO_FULL_VERSE_PAIRS && Array.isArray(window.KUMULIPO_FULL_VERSE_PAIRS[String(waNumber)])
      ? window.KUMULIPO_FULL_VERSE_PAIRS[String(waNumber)]
      : []);

  const pairedLines = sourceVersePairs.length
    ? sourceVersePairs.map((pair, index) => ({
        number: pair.number || pair.num || String(index + 1).padStart(4, '0'),
        hawaiian: pair.hawaiian || pair.line || '',
        english: pair.english || pair.translation || ''
      }))
    : (Array.isArray(config.lines) ? config.lines : []).map((line, index) => ({
        number: String(Number(config.startLine || 1) + index).padStart(4, '0'),
        hawaiian: line,
        english: Array.isArray(config.lineTranslations) ? (config.lineTranslations[index] || '') : ''
      }));

  const fullChantExcerpt = pairedLines.length
    ? `
      ${sourceTag('Primary chant first')}
      <div class="kumu-wa-source-meta">
        <span>Wā ${waNumber}</span>
        <span>${pairedLines.length}${expectedLineCount ? ` of ${expectedLineCount}` : ''} numbered line${pairedLines.length === 1 ? '' : 's'}</span>
        ${Number(config.startLine) && Number(config.endLine) ? `<span>Source range ${String(config.startLine).padStart(4, '0')}–${String(config.endLine).padStart(4, '0')}</span>` : ''}
        <span>Hawaiian with English meaning underneath</span>
      </div>
      <div class="kumu-wa-full-chant" data-kumulipo-wa-lines="${waNumber}">
        ${pairedLines.map(pair => `
          <article class="kumu-wa-line-pair">
            <div class="kumu-wa-line-pair__num">${escapeKumu(pair.number)}</div>
            <div class="kumu-wa-line-pair__body">
              <p class="kumu-wa-line-pair__hawaiian">${escapeKumu(pair.hawaiian)}</p>
              ${pair.english ? `<p class="kumu-wa-line-pair__english">${escapeKumu(pair.english)}</p>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
      <p class="kumu-wa-full-chant__note">${config.isCompleteVerse || (expectedLineCount && pairedLines.length >= expectedLineCount) ? `Complete Wā ${waNumber} source chant loaded before the interpretive breakdown.` : `This Wā page is formatted for the complete chant, with ${pairedLines.length}${expectedLineCount ? ` of ${expectedLineCount}` : ''} line pairs currently loaded.`}</p>
    `
    : chantExcerpt;

  return `
<section class="kumu-wa-module">
  <section class="kumu-wa-hero kumu-reveal">
    <p class="kumu-wa-hero__eyebrow">Kumulipo Wā Deep Relational Study</p>
    <h2 class="kumu-wa-hero__title">Wā ${waNumber} — ${deep.hawaiianTitle}</h2>
    <p class="kumu-wa-hero__subtitle">${deep.englishTitle} · ${deep.movement}</p>
    <p class="kumu-wa-hero__lead">${config.heroLead}</p>
    ${deep.arc ? `<p class="kumu-wa-arc-statement">${deep.arc}</p>` : ''}
  </section>

  <section class="kumu-section kumu-wa-chant-card kumu-wa-chant-card--primary kumu-reveal">
    <h4>Full Kumulipo Verse</h4>
    <p class="kumu-section__intro">Read the chant first. Each source line appears in Hawaiian, with its English meaning directly underneath, before the interpretation and breakdown.</p>
    ${fullChantExcerpt}
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Foundational Orientation</h4>
    <p><strong>Wā ${waNumber} — ${deep.hawaiianTitle}</strong><br>${deep.englishTitle} · ${deep.movement}</p>
    <p>${sourceTag('Orientation')} This wā centers ${config.emergence} It should be read through ${deep.metaphor} as a living movement that deepens relation and responsibility. The embedded risk is clear: ${deep.crisis} The capacity this wā cultivates is ${deep.intelligence}, which prepares the learner for ${nextDeep ? `Wā ${waNumber + 1}` : 'living this arc in practice'}.</p>
    <p class="kumu-wa-provenance">Provenance note: This title movement is an interpretive compass for learning, not a replacement for the chant itself.</p>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Learning Objectives</h4>
    <div class="kumu-wa-objective-grid">
      ${objectiveRows}
    </div>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Foundation Lens for Reading</h4>
    <ul>
      ${foundationLenses.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Vocabulary in Context</h4>
    <table class="kumu-wa-table">
      <thead>
        <tr><th>Term</th><th>Meaning in This Wā</th></tr>
      </thead>
      <tbody>
        ${vocabularyRows}
      </tbody>
    </table>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Cultural Context · What Is Emerging</h4>
    <p>${culturalContext}</p>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Deeper Interpretation · The Greater Meaning</h4>
    <h5>The Core Movement</h5>
    <p>${sourceTag('Contextual interpretation')} ${deep.movement} is the movement of ${deep.metaphor}: a natural transformation that changes relation without breaking genealogy. In these lines, emergence is not a ladder but an unfolding surface where each form remains accountable to what came before. The chant evidence "${safeLine(0)}" anchors that movement in named relation rather than abstraction. This makes the learner inhabit process, not observe from outside.</p>

    <h5>The Crisis of This Wā</h5>
    <p>${deep.crisis} If this wā is misunderstood, the failure mode is concrete: relation is replaced by extraction, and genealogy is reduced to identity without duty. What is lost is not only cultural memory, but the capacity to make consequence-aware decisions across land, sea, family, and governance. The crisis is therefore a teacher, because it exposes exactly where intelligence is needed.</p>

    <h5>Intracrises (The Tensions Within)</h5>
    <table class="kumu-wa-table">
      <thead>
        <tr><th>Tension</th><th>Tension to Hold</th></tr>
      </thead>
      <tbody>
        ${intracrisisRows}
      </tbody>
    </table>

    <h5>The Intelligence of This Wā</h5>
    <p>This wā cultivates ${deep.intelligence}. In a person, that intelligence appears as disciplined attention to relation before reaction: asking what this action inherits, disturbs, and prepares. In a community, it appears as governance that honors ancestors, protects foundational life, and resists short-term gain that fractures continuity. This is relational intelligence over abstract knowledge: capacity that can be practiced and tested in real conditions.</p>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Modern Parallels · Careful Dialogue</h4>
    ${sourceTag('Modern orientation aid')}
    <table class="kumu-wa-table">
      <thead>
        <tr><th>Modern Concept</th><th>How It Differs from the Wā</th><th>Where They Align</th></tr>
      </thead>
      <tbody>
        ${modernRows}
      </tbody>
    </table>
    <callout type="bridge"><strong>Caution:</strong> ${deep.caution}</callout>
  </section>

  ${scientificResonancesSection}

  <section class="kumu-section kumu-reveal">
    <h4>Why This Wā Matters Today · Kuleana Now</h4>
    <p>${whyNow}</p>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Deepen Study Pathways</h4>
    <ul>
      ${deepenStudyPathways}
    </ul>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Common Misreadings to Avoid</h4>
    <ul>
      ${misreadings}
    </ul>
  </section>

  <section class="kumu-section kumu-reveal">
    <h4>Continuity Anchor</h4>
    ${continuityAnchor}
  </section>
</section>
`;
}

function buildKumulipoWaSummaryCards() {
  const cards = Array.from({ length: 16 }, (_, index) => {
    const wa = index + 1;
    const deep = KUMULIPO_WA_DEEP_MAP[wa];
    const essence = `Wā ${wa} trains ${deep.intelligence} through ${deep.movement.toLowerCase()}, carrying pō into ao without surrendering relational obligation.`;
    const imagePrompt = `Visualize ${deep.metaphor} in an ocean-to-sky Hawaiian cosmological sequence, honoring genealogy, smallness before grandeur, and cumulative continuity from Wā ${wa} to Wā ${Math.min(16, wa + 1)}.`;
    const thresholdQuestion = wa === 16
      ? 'How will you practice consequence as vision this month so learning becomes lived kuleana?'
      : `What must you carry from Wā ${wa} so Wā ${wa + 1} can emerge without distortion in your own context?`;

    return `
      <article class="kumu-wa-bridge-card">
        <h5>Wā ${wa} · ${deep.movement}</h5>
        <p><strong>Essence:</strong> ${essence}</p>
        <p><strong>Image prompt:</strong> ${imagePrompt}</p>
        <p><strong>Threshold question:</strong> ${thresholdQuestion}</p>
      </article>
    `;
  }).join('');

  return `
<section class="kumu-section kumu-reveal">
  <h4>Kumulipo Wā Threshold Summary Cards (1–16)</h4>
  <p>Use these cards as transitions between deep study pages. They are not replacements for the full lessons; they are navigational anchors for movement, continuity, and kuleana.</p>
  <div class="kumu-wa-bridge-grid">
    ${cards}
  </div>
</section>
`;
}

const CULTURALVERSE_DATA = {

  /* ─────────────────────────────────────────────────────────────
     CULTURES
  ───────────────────────────────────────────────────────────────*/
  cultures: [

    /* ══════════════════════════════════════════════════════════
       KĀNAKA MAOLI
    ══════════════════════════════════════════════════════════ */
    {
      id:      'kanaka',
      name:    'Kānaka Maoli',
      emoji:   '🌺',
      tagline: 'Hawaiian Indigenous Knowledge',
      theme:   'emerald',
      status:  'live',
      intro:   'The Native Hawaiian people developed one of the most sophisticated civilizations in the Pacific over more than 1,500 years. These lessons explore the depth of Hawaiian knowledge — from cosmic creation to ecological engineering — as a living tradition, not a historical artifact.',

      modules: [

        /* ── MODULE 1: COSMOLOGY ── */
        {
          id:    'kanaka-cosmology',
          title: 'Cosmology & Creation',
          emoji: '🌊',
          desc:  'The Hawaiian understanding of the origins of the cosmos, life, and humanity.',
          lessons: [
            {
              id:       'km-kumulipo',
              num:      'KM·01',
              title:    'The Kumulipo — Sacred Chant of Creation',
              readTime: '12 min',
              content: `
<section class="kumu-hero kumu-reveal">
  <p class="kumu-hero__eyebrow">Kanaka Maoli Sacred Knowledge</p>
  <h2 class="kumu-hero__title">Kumulipo</h2>
  <p class="kumu-hero__subtitle">A Genealogy of Creation, Life, and Living Knowledge</p>
  <p class="kumu-hero__lead">This lesson is designed as an immersive Culturalverse/Ikeverse entry into the Kumulipo, beginning with Wā 1 and extending outward into the chant's wider architecture of creation. The aim is to encounter the Kumulipo first as Kanaka Maoli ancestral knowledge, then to read its patterns in careful dialogue with modern questions about origin, life, relationship, and responsibility.</p>
</section>

<facts>2,102::Lines in the Chant|16 Wā::Epochs of Unfolding|Pō::Generative Darkness, Not Emptiness|1897::Liliʻuokalani Translation</facts>

<section class="kumu-section kumu-reveal">
  <h4>What Is the Kumulipo?</h4>
  <p>The Kumulipo is a sacred Kanaka Maoli creation chant, genealogy, cosmology, and living knowledge system. It is a profound framework of pō, emergence, life, genealogy, ecology, relationship, and kuleana. It carries ancestral intelligence through chant, memory, protocol, and transmission across generations.</p>
  <p>The Kumulipo should not be reduced to mythology, poetry, or Western scientific explanation. Modern science offers one framework, while the Kumulipo offers a Kanaka Maoli ancestral framework. Where meaningful parallels appear, they can be used carefully to support understanding, without collapsing difference.</p>
  <callout>The opening line, <strong>"O ke au i kahuli wela ka honua"</strong>, describes transformation in conditions of heat, motion, and becoming. Creation is presented as unfolding process, not static event.</callout>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Beyond Royal Lineage</h4>
  <p>The Kumulipo has historically been used to affirm aliʻi genealogy and chiefly authority. That historical use is real and important. But it is not the whole meaning of the chant. Its deeper function is broader: preserving a worldview in which creation is genealogical, life is interconnected, and humans emerge within the same relational system as coral, ocean, plants, animals, stars, land, and sky.</p>
  <p>This makes the Kumulipo a living body of ancestral knowledge, not a narrow political text. It preserves layered insight into origins, ecological relationships, continuity of life, and humanity's place within creation.</p>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Transition: The Wā as Layered Stages of Unfolding Reality</h4>
  <p>The wā can be understood as layered stages of becoming. Each wā carries specific cultural meaning while also resonating with modern ideas in cosmology, evolution, ecology, systems thinking, and relational ethics. These parallels do not replace Hawaiian meaning. They help modern readers recognize the depth and sophistication of the knowledge system.</p>
  <p>This lesson begins with Wā 1 as the interpretive foundation: darkness is generative, relationship is primary, and life begins in continuity rather than separation.</p>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Reading the Kumulipo Through Interconnection, Resonance, and Participation</h4>
  <p>Many modern readers need a way to feel the Kumulipo as a living pattern rather than a distant text. A careful bridge is to notice that the chant describes reality as deeply interconnected, layered, and participatory. It begins in pō, a fertile depth of becoming, and unfolds through relationships rather than isolated things.</p>
  <p>This does not mean the Kumulipo is "really quantum physics" in disguise. That would flatten Hawaiian knowledge into another system's vocabulary. But modern ideas about non-isolation, resonance, emergence, and observer participation can help contemporary learners recognize what Hawaiian ancestors already preserved in chant form: life is relational, power is alignment, and knowing carries consequences.</p>
  <div class="kumu-parallel-grid">
    <article class="kumu-parallel-card">
      <h5>Interconnection</h5>
      <p>The Kumulipo teaches that coral, sea life, plants, animals, celestial forces, ancestors, and humans belong to one genealogical continuum. A useful modern comparison is the idea that reality is not made of isolated parts, but of relationships and fields of influence.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Resonance and Mana</h5>
      <p>A respectful bridge is resonance: strength comes through alignment within a larger pattern. Hawaiian teachings on mana point less toward domination and more toward the quality of one\'s relation, integrity, and presence within the living web.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Participatory Knowledge</h5>
      <p>The Kumulipo is not merely observed from outside. Chant, protocol, memory, and conduct all matter. A modern learner might say that awareness participates in reality; the Kumulipo would add that this participation must be guided by kuleana, humility, and ancestral respect.</p>
    </article>
  </div>
  <callout type="bridge">Use modern frameworks as orientation aids, not as replacements. The point is not to prove that Hawaiian ancestors were secretly using the language of physics. The point is to help modern readers recover the depth of a knowledge system built on relation, emergence, and responsibility.</callout>
</section>

<!-- KM_KUMULIPO_SOURCE_INSERT -->

<section class="kumu-section kumu-reveal">
  <h4>Modern Parallels</h4>
  <div class="kumu-parallel-grid">
    <article class="kumu-parallel-card">
      <h5>Cosmology</h5>
      <p><strong>This parallels modern cosmology</strong> in its movement from hidden depth toward emergence, order, and structure. The opening emphasis on heat, turning, and becoming can help modern readers think about early conditions, formation, and unfolding process, without claiming that the Kumulipo is a scientific statement of Big Bang theory.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Emergence and Development</h5>
      <p><strong>This resonates with staged emergence</strong> because life appears through ordered phases rather than instant completion. Complexity grows through relation, sequence, and continuity, which gives modern learners a careful bridge to discussions of development and evolving life systems.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Ecology</h5>
      <p><strong>This can be compared to ecological interdependence</strong> because coral, sea life, plants, animals, land, and people are treated as connected relations rather than isolated objects. The chant maps living systems through kinship.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Interconnection</h5>
      <p><strong>A useful contemporary bridge is relational interconnection</strong>: reality is not best understood as isolated parts, but as linked presences influencing one another. This does not reduce the chant to physics language; it helps modern readers recognize the depth of Hawaiian relational thought.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Genealogy</h5>
      <p><strong>This reflects continuity of life</strong> through moʻokūʻauhau. Human identity emerges inside ancestral and ecological continuity, not outside it, which makes genealogy a structure of belonging as well as descent.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Systems Thinking</h5>
      <p><strong>This reflects a systems-based understanding of relationship and interdependence</strong> in which each phase of emergence creates the conditions for what follows. Meaning comes from relational pattern, not isolated parts.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Resonance and Participation</h5>
      <p><strong>Another careful bridge is resonance and participatory knowing</strong>. Presence, chant, memory, intention, and conduct all matter in Hawaiian thought. Modern readers may hear an echo of participation here, but the Kumulipo frames that participation through protocol, humility, and kuleana.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Kuleana</h5>
      <p><strong>This frames responsibility as integral to knowledge.</strong> To know creation is to inherit obligation toward balance, stewardship, and right relationship. Knowledge does not end in insight; it becomes conduct.</p>
    </article>
  </div>
  <callout type="bridge">These parallels are orientation aids for contemporary readers. They are most useful when they clarify interconnection, resonance, emergence, and participatory knowing without replacing Hawaiian meanings, sources, or protocols.</callout>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Kumulipo Wā Study Pages</h4>
  <p class="kumu-section__intro">Each wā now has its own dedicated lesson page with specific cultural framing, emergence focus, careful modern dialogue, and present-day relevance. Use this as the guided pathway instead of a single compressed timeline.</p>
  <ul>
    <li><a href="#km-wa-01">Wā 1 — Wā o ke Koʻa: Pō, Coral, and Foundational Marine Emergence</a></li>
    <li><a href="#km-wa-02">Wā 2 — Wā o nā Iʻa: The Great Fish Genealogy</a></li>
    <li><a href="#km-wa-03">Wā 3 — Wā o nā Mea Lele: Insects, Birds, and the Flying World</a></li>
    <li><a href="#km-wa-04">Wā 4 — Wā o nā Mea Kolo: Crawlers — Turtles, Geckos, and Transitional Forms</a></li>
    <li><a href="#km-wa-05">Wā 5 — Wā o ka Puaʻa: Pigs and Human Social Diversity</a></li>
    <li><a href="#km-wa-06">Wā 6 — Wā o ka ʻIole: Chiefly Lines, Cultivation, and Rats</a></li>
    <li><a href="#km-wa-07">Wā 7 — Wā o ka ʻĪlio: Dogs, Bats, and Sacred Dread</a></li>
    <li><a href="#km-wa-08">Wā 8 — Wā o Laʻilaʻi: Human Emergence</a></li>
    <li><a href="#km-wa-09">Wā 9 — Wā o ka Huli i ke Ao: Turning Toward Light</a></li>
    <li><a href="#km-wa-10">Wā 10 — Wā o nā Kūpuna Akua: Ancestral Divine Genealogies</a></li>
    <li><a href="#km-wa-11">Wā 11 — Wā o nā Hanauna Kiʻekiʻe: High Genealogical Lines</a></li>
    <li><a href="#km-wa-12">Wā 12 — Wā o nā Pili Aliʻi: Chiefly Relational Lines</a></li>
    <li><a href="#km-wa-13">Wā 13 — Wā o ka Hānau Moʻokūʻauhau: Human Genealogical Emergence</a></li>
    <li><a href="#km-wa-14">Wā 14 — Wā o ka Hoʻonui Hanauna: Expansion of Descendant Lines</a></li>
    <li><a href="#km-wa-15">Wā 15 — Wā o ke Kauoha a me ke Kuleana: Charge and Responsibility</a></li>
    <li><a href="#km-wa-16">Wā 16 — Wā o ke Ao Kanaka: Human Realm in Light</a></li>
  </ul>
  <callout type="bridge">Replacement learning flow: (1) Read KM·01 as cosmological framing, (2) move through each dedicated Wā page, (3) return to KM·01 final section to integrate the whole sequence.</callout>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Wā 1 and Cross-Cultural Resonance</h4>
  <p>Wā 1 can be placed in respectful dialogue with other knowledge systems without collapsing difference. In Kemet thought, Nun names primordial waters before ordered creation. In the Kumulipo, pō and marine emergence hold a related structural role. The resonance is not identity. It is a shared insight that order emerges from primordial depth through distinct ancestral languages and protocols.</p>
  <twocol left="Wā 1 in Kumulipo" right="Resonance in Kemet">Pō is generative darkness; koʻa marks foundational life; creation unfolds through genealogy and relation.||Nun is primordial depth before ordered form; creation emerges through named principles and cosmic ordering.</twocol>
</section>

<section class="kumu-section kumu-reveal">
  <h4>What Replaces the Timeline and Activity Blocks</h4>
  <p>Instead of one interactive timeline and broad teacher activity stack, this lesson now serves as the orientation gateway. Detailed learning happens in dedicated Wā pages, each focused on a single stage with more depth and less repetition.</p>
  <ul>
    <li><strong>Wā-specific pages:</strong> one page per wā with targeted interpretation and modern dialogue.</li>
    <li><strong>Comparative lens notes:</strong> focused comparison statements kept careful and non-reductive.</li>
    <li><strong>Reflection studio:</strong> short reflective prompts at the end of each wā page rather than one large activity block.</li>
  </ul>
</section>

<reflect title="Reflection Prompts">
How does understanding darkness as generative change your view of beginnings?
Where do you see relational thinking in your own community, ecology, or family history?
What does kuleana look like when humans are understood as part of creation rather than above it?
</reflect>

<section class="kumu-section kumu-reveal kumu-section--final">
  <h4>Why the Kumulipo Matters Today</h4>
  <p>The Kumulipo is not a simple origin story. It is a living knowledge system that speaks directly to modern questions about identity, ecology, sustainability, ancestry, consciousness, and responsibility. It teaches that creation is relational, life unfolds through genealogy, and knowledge carries kuleana.</p>
  <p>For Culturalverse and Ikeverse, the Kumulipo is both introduction and return point. Wā 1 opens the learning journey, and at the end of study it becomes the interpretive key again: humans are part of nature, not above it; relationship precedes hierarchy; and wisdom must become stewardship.</p>
  <callout>This does not reduce the Kumulipo to science. It reveals the layered intelligence of Kanaka Maoli ancestral knowledge and its continuing relevance for the present and future.</callout>
</section>
`
            },
            {
              id:       'km-wakea',
              num:      'KM·02',
              title:    'Wākea & Papahānaumoku — The Sky Father and Earth Mother',
              readTime: '8 min',
              content: `
<p class="lead">Beyond the Kumulipo's cosmic genealogy, the creation narrative of <strong>Wākea</strong> (sky father) and <strong>Papahānaumoku</strong> (earth mother) provides the deepest spiritual framework for the Hawaiian relationship to land, family, and food. This is the story that makes kalo the elder sibling of all human beings.</p>

<h4>The Names Themselves</h4>
<p><strong>Wākea</strong> means "wide expanse" — the sky, infinite space, the masculine expansive principle. <strong>Papahānaumoku</strong> means "she who gives birth to islands" — Papa (flat foundation, earth) + hānau (to give birth) + moku (island). The earth mother is literally defined by her generative act: birthing the islands of Hawaiʻi.</p>

<h4>The Birth of Hāloa</h4>
<p>Wākea and Papahānaumoku had a child together — but this child was stillborn, born too early and not fully formed. Rather than discarding this child, they planted the baby in the earth. From that sacred burial, the first <strong>kalo</strong> (taro) plant grew. Its name: <strong>Hāloa-naka</strong> — "the trembling long stalk."</p>
<p>Wākea and Papahānaumoku had a second child — this one fully alive, fully human. This child was named <strong>Hāloa</strong> — named in honor of his elder sibling, the kalo plant that preceded him and nourished him.</p>

<callout>This genealogy is one of the most ethically profound ecological relationships in any culture's tradition. Kalo is not a crop. Kalo is your elder sibling. To pull taro from the ground is not agriculture — it is receiving nourishment from your ancestor. To damage or waste kalo is to disrespect your elder. To tend the loʻi is to fulfill your obligation to your family. The entire Hawaiian relationship to land, food, and agriculture flows from this genealogical truth.</callout>

<h4>The Islands as Family</h4>
<p>The islands themselves are children of Papahānaumoku and Wākea — born in sequence, each with its own name and personality. Hawaiʻi (the Big Island) is the eldest, then Maui, Kahoʻolawe, Lānaʻi, Molokaʻi, Oʻahu, Kauaʻi, Niʻihau. Each island is not a place — it is a being, a family member, an ancestor. <strong>Aloha ʻāina</strong> — love of the land — is not a sentiment. It is the natural expression of knowing that the land is your relative.</p>
`
            },
          ]
        },

        {
          id:    'kanaka-kumulipo-wa',
          title: 'Kumulipo Wā Deep Study',
          emoji: '🌌',
          desc:  'Dedicated lesson pages for each of the 16 Wā, each with its own focus and modern dialogue.',
          lessons: [
            {
              id:       'km-wa-01',
              num:      'KM·W01',
              title:    'Wā 1 — Wā o ke Koʻa: Pō and Foundational Marine Emergence',
              readTime: '8 min',
              image:    'assets/images/kumulipo/wa-1.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 1 — Wā Akahi: The First Era of Emergence',
                heroSubtitle: 'Wā o ke Koʻa · Pō and Foundational Marine Emergence',
                heroLead: 'Wā 1 opens in deep pō and establishes the first layer of becoming. It is the interpretive doorway to the entire Kumulipo: life emerges through relation, not isolation.',
                lines: KUMULIPO_WA_1_LINES,
                lineTranslations: KUMULIPO_WA_1_TRANSLATIONS,
                startLine: 1,
                endLine: 122,
                emergence: 'Generative movement in pō, heat, turning, and early marine emergence associated with koʻa as foundational life threshold.',
                relationships: 'This wā introduces relation between darkness, transformation, oceanic life, and ordered unfolding rather than instant completion.',
                structureRole: 'Wā 1 grounds all later wā by establishing source-depth, emergence, and continuity as the governing pattern.',
                deeper: 'As a knowledge layer, Wā 1 frames existence as genealogical process. The Kumulipo is not simply telling what happened; it is teaching how to understand origin, life, and responsibility through relational cosmology. Darkness is epistemic depth, not absence.',
                parallels: [
                  {
                    title: 'Cosmology',
                    body: 'This can be compared to modern cosmology and early questions of space-time, heat, matter, and emergence. The comparison is structural, not literal equivalence.'
                  },
                  {
                    title: 'Energy and Pattern',
                    body: 'This resembles modern ideas of patterned emergence where order unfolds from hidden conditions. As a metaphor, this can be placed beside discussions of energy fields and generative dynamics.'
                  },
                  {
                    title: 'Systems Thinking',
                    body: 'This parallels systems thinking because the first conditions shape all subsequent formations. Meaning comes from relation and sequence, not isolated parts.'
                  }
                ],
                whyNow: 'Wā 1 matters today because it reorients identity toward ancestry and ecological humility. It teaches that human life begins within larger relational fields of ocean, earth, and sky, and therefore carries kuleana.'
              })
            },
            {
              id:       'km-wa-02',
              num:      'KM·W02',
              title:    'Wā 2 — Wā o nā Mea o ke Kai: Sea Multiplicity',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-2.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 2 — The Era of Sea Multiplicity',
                heroSubtitle: 'Wā o nā Mea o ke Kai · Marine Diversification',
                heroLead: 'Wā 2 deepens ocean genealogy through multiplicity. Life expands in sequence, relation, and complexity within the marine world.',
                lines: KUMULIPO_WA_2_LINES,
                lineTranslations: KUMULIPO_WA_2_TRANSLATIONS,
                startLine: 123,
                endLine: 272,
                emergence: 'Sea beings multiply and diversify, expanding the living architecture of the ocean.',
                relationships: 'This wā strengthens oceanic kinship by showing how many forms of life arise through relational unfolding rather than isolated events.',
                structureRole: 'Wā 2 extends Wā 1 by turning foundational emergence into patterned marine abundance.',
                deeper: 'Wā 2 functions as a knowledge layer of abundance-with-order. It teaches that complexity is not chaos; it is relationship becoming denser. The Kumulipo encodes life as genealogical interconnection rather than separate categories of species and resource.',
                parallels: [
                  {
                    title: 'Evolution',
                    body: 'This resonates with evolutionary diversification in aquatic systems, where multiplicity appears through successive emergence.'
                  },
                  {
                    title: 'Biodiversity',
                    body: 'This parallels modern biodiversity thinking by highlighting variety as strength within a living network.'
                  },
                  {
                    title: 'Complexity Theory',
                    body: 'This resembles complexity models in which interacting forms produce layered ecological structure over time.'
                  }
                ],
                whyNow: 'Wā 2 matters today because it supports ocean-centered identity and sustainability ethics. It reminds communities that marine diversity is ancestral continuity, not expendable inventory.'
              })
            },
            {
              id:       'km-wa-03',
              num:      'KM·W03',
              title:    'Wā 3 — Wā o nā Mea Lele: Insects, Birds, and the Flying World',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-3.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 3 — The Era of Insects and Birds',
                heroSubtitle: 'Wā o nā Mea Lele · Transformation, Flight, and the Birth of the Bird World',
                heroLead: 'Wā 3 is the wā of transformation. Every parent gives birth to a child that flies. Insects become moths, dragonflies, grasshoppers, and birds — the chant names this crossing as genealogy, not metamorphosis alone.',
                lines: KUMULIPO_WA_3_LINES,
                lineTranslations: KUMULIPO_WA_3_TRANSLATIONS,
                startLine: 273,
                endLine: 377,
                emergence: 'Insects emerge as parents, and their children take flight — the wā moves from crawling to flying, from grub to bird, in a sustained genealogical sequence.',
                relationships: 'This wā links every insect parent to its flying child, and closes by pairing sea birds with land birds — the flying world spans all domains.',
                structureRole: 'Wā 3 marks the first great threshold of transformation in the chant: from creatures of the earth and sea to creatures of the air.',
                deeper: 'Wā 3 teaches transformation as a genealogical act. In the Kumulipo, a woodborer does not simply become a moth — it gives birth to one. This is the chant\'s way of saying that all transformation is relational: something ancestral holds the new form into being. The repeated "puka kana keiki, lele" — out came its child, and flew — is one of the chant\'s great rhythmic teachings about emergence, change, and the continuity of lineage through radical transformation.',
                parallels: [
                  {
                    title: 'Metamorphosis and Evolution',
                    body: 'This resonates with modern biology\'s understanding of metamorphosis — the radical transformation of form within a single lineage — framed here as genealogy rather than mechanism.'
                  },
                  {
                    title: 'Ecology of Birds',
                    body: 'The detailed naming of Hawaiian birds reflects deep ecological knowledge. Many of these birds are now endangered or extinct, making this wā an ancestral record of biodiversity.'
                  },
                  {
                    title: 'Transformation as Continuity',
                    body: 'This parallels modern systems thinking about phase transitions: new forms emerge from prior states without severing the thread of continuity.'
                  }
                ],
                whyNow: 'Wā 3 matters today because Hawaiʻi has lost more bird species than almost anywhere on earth. This wā is both an ancestral record of that world and a reminder that transformation — even radical change — carries lineage forward.'
              })
            },
            {
              id:       'km-wa-04',
              num:      'KM·W04',
              title:    'Wā 4 — Wā o nā Mea Kolo: Small and Transitional Forms',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-4.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 4 — The Era of Small and Transitional Life',
                heroSubtitle: 'Wā o nā Mea Kolo · Interlinked Transitional Forms',
                heroLead: 'Wā 4 highlights creeping and smaller forms that connect phases of life and strengthen ecological continuity.',
                lines: KUMULIPO_WA_4_LINES,
                lineTranslations: KUMULIPO_WA_4_TRANSLATIONS,
                startLine: 378,
                endLine: 480,
                emergence: 'Transitional forms, connective life pathways, and dense small-scale interactions.',
                relationships: 'This wā shows relation across thresholds and scales, where small life forms link broader systems.',
                structureRole: 'Wā 4 acts as the bridge layer between early foundations and larger emergent orders.',
                deeper: 'Wā 4 teaches that scale does not determine significance. The Kumulipo encodes a philosophy of interconnection in which micro-relations hold macro-systems together. This is a living relational ontology, not a hierarchy of importance.',
                parallels: [
                  {
                    title: 'Systems Thinking',
                    body: 'This parallels systems thinking where many localized interactions generate larger emergent patterns.'
                  },
                  {
                    title: 'Complex Adaptive Systems',
                    body: 'This can be compared to complexity theory in which transitions are carried by interacting small-scale agents.'
                  },
                  {
                    title: 'Pattern Emergence',
                    body: 'This resembles the modern idea that pattern and order can arise from numerous low-level exchanges.'
                  }
                ],
                whyNow: 'Wā 4 matters today because it teaches respect for foundational and often-overlooked life forms, essential for biodiversity resilience and ecological repair.'
              })
            },
            {
              id:       'km-wa-05',
              num:      'KM·W05',
              title:    'Wā 5 — Wā o ka Puaʻa: Pigs and Human Social Diversity',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-5.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 5 — The Era of the Pig and Human Diversity',
                heroSubtitle: 'Wā o ka Puaʻa · The Pig of Chiefly Blood and the Many Forms of Humanity',
                heroLead: 'Wā 5 moves from the sea to the land. The pig is born of sacred chiefly lineage, roots in the earth, and cultivates the taro patches. Then the night gives birth to the vast diversity of human types — naming them all within the genealogical sequence.',
                lines: KUMULIPO_WA_5_LINES,
                lineTranslations: KUMULIPO_WA_5_TRANSLATIONS,
                startLine: 481,
                endLine: 538,
                emergence: 'The pig is born and lodges inland; then the night gives birth to the many human types — peaked-heads, flat-heads, dark-heads, fair-haired, war leaders, high chiefs, and many more.',
                relationships: 'This wā links the pig to chiefly lineage and land cultivation, then extends that same genealogical logic to the diversity of humanity — all named, all ancestral.',
                structureRole: 'Wā 5 marks the decisive shift from marine and aerial life to land animals and the first emergence of human social variety.',
                deeper: 'Wā 5 teaches that human diversity is genealogical, not accidental. The night does not produce one human type — it produces many, each named and placed within the chant\'s sequence. This is the Kumulipo\'s way of saying that plurality is ancestral: difference among humans is as ancient and as sacred as the coral born in Wā 1. The pig — "ka puaʻa hiwahiwa" (the pig of highest rank) — opens the wā as a being of chiefly blood, connecting animal life to the sacred social order that will follow.',
                parallels: [
                  {
                    title: 'Human Diversity and Ancestry',
                    body: 'The naming of many human types resonates with modern understandings that human diversity is ancient, deep, and part of one shared lineage — not a deviation from a single norm.'
                  },
                  {
                    title: 'Animal Kinship and Land',
                    body: 'The pig\'s role in cultivation and its connection to chiefly lineage parallels contemporary understandings of human-animal co-evolution and the deep ties between domesticated animals and land stewardship.'
                  },
                  {
                    title: 'Social Complexity',
                    body: 'The emergence of named social roles — war leaders, chanters, chiefs, workers — parallels modern anthropological accounts of social differentiation arising within genealogical communities.'
                  }
                ],
                whyNow: 'Wā 5 matters today because it frames human social diversity as ancestral and sacred — not as division but as the night\'s abundance — and because the pig\'s tie to land and cultivation echoes contemporary conversations about food sovereignty and indigenous agriculture.'
              })
            },
            {
              id:       'km-wa-06',
              num:      'KM·W06',
              title:    'Wā 6 — Wā o ka ʻIole: Chiefly Lines, Cultivation, and Rats',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-6.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 6 — The Era of Chiefly Lines, Cultivation, and Rats',
                heroSubtitle: 'Wā o ka ʻIole · Many Lines of Chiefs Sprout; the Rat Inhabits the Land',
                heroLead: 'Wā 6 opens with new chiefly lines multiplying like growth, moves into the emergence of cultivation and food, and names the rat — upland and by the sea — as the creature of this era of habitation and spread.',
                lines: KUMULIPO_WA_6_LINES,
                lineTranslations: KUMULIPO_WA_6_TRANSLATIONS,
                startLine: 539,
                endLine: 565,
                emergence: 'Chiefly lines proliferate; cultivation appears alongside the rat as a marker of inhabited and productive land.',
                relationships: 'This wā connects social expansion — new chiefly lines — with ecological expansion: food grown by water, food grown by the sea, and the rat as a sign of settled life.',
                structureRole: 'Wā 6 is where agriculture, social structure, and the inhabited landscape enter the genealogical sequence together.',
                deeper: 'Wā 6 teaches that social and ecological emergence happen together. The sprouting of chiefly lines and the appearance of the ʻiole (rat) in the upland and by the sea are part of the same moment: the land is now inhabited, tended, and alive with multiplying life. The rat in Hawaiian tradition is not merely pest — it is a creature whose presence marks a living, inhabited place. Cultivation arises full of kapu (taboo), meaning that food production is not secular — it is sacred from the start.',
                parallels: [
                  {
                    title: 'Agriculture and Social Complexity',
                    body: 'This resonates with anthropological accounts of how agriculture and social differentiation emerge together — cultivation and chiefly hierarchy are co-arising, not sequential.'
                  },
                  {
                    title: 'Commensal Species',
                    body: 'The rat as a companion species of human habitation parallels modern understandings of commensal animals — creatures whose range expands with human settlement.'
                  },
                  {
                    title: 'Sacred Food Systems',
                    body: 'Cultivation arising "full of kapu" parallels indigenous food sovereignty frameworks in which growing food is a spiritual and relational practice, not merely economic production.'
                  }
                ],
                whyNow: 'Wā 6 matters today because food sovereignty, agricultural sustainability, and the integrity of chiefly traditions are all live questions in Hawaiʻi — and this wā places them within the same ancestral breath.'
              })
            },
            {
              id:       'km-wa-07',
              num:      'KM·W07',
              title:    'Wā 7 — Wā o ka ʻĪlio: Dogs, Bats, and Sacred Dread',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-7.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 7 — The Era of Dogs, Bats, and Sacred Dread',
                heroSubtitle: 'Wā o ka ʻĪlio · Fear on the Mountain Top, Dogs as Sacred Beings',
                heroLead: 'Wā 7 opens not with birth but with fear — dread of the night, the offering place, and the law. Then dogs appear in many forms: dark red, brindled, hairless, sacred. The bat joins them as a creature of threshold and night.',
                lines: KUMULIPO_WA_7_LINES,
                lineTranslations: KUMULIPO_WA_7_TRANSLATIONS,
                startLine: 566,
                endLine: 594,
                emergence: 'Sacred awe precedes the named creatures: dogs in multiple forms and the bat appear as genealogical beings within this era of sacred approach.',
                relationships: 'This wā links the emotional register of sacred dread to the specific animals — dog and bat — who inhabit the boundary between night and inhabited land.',
                structureRole: 'Wā 7 teaches the proper stance before sacred knowledge: fear and reverence are not obstacles but openings. The dog and the bat are the creatures who live closest to that threshold.',
                deeper: 'Wā 7 is unique in the Kumulipo for opening with the feeling of standing before the sacred — "kau ke anoano, iaʻu kualono" (fear falls upon me on the mountain top). This is not terror but awe: the recognition that some knowledge requires a particular approach. The ʻīlio (dog) is named in multiple forms — dark red, brindled, hairless — and appears as an offering, a sacred animal whose life is given over to the akua. The peʻapeʻa (bat), the only native land mammal of Hawaiʻi, appears here as a creature of the night and the forest edge, named within the genealogy as a being of its own standing.',
                parallels: [
                  {
                    title: 'Sacred Ecology',
                    body: 'The opening dread-language parallels indigenous sacred ecology frameworks in which approaching certain places, species, or knowledge requires protocol, preparation, and appropriate feeling.'
                  },
                  {
                    title: 'Dogs and Human Culture',
                    body: 'The detailed naming of dog types reflects the deep human-dog relationship in Polynesian culture — dogs as companions, offerings, and sacred figures, not merely domestic animals.'
                  },
                  {
                    title: 'Bats and Ecosystems',
                    body: 'The ʻōpeʻapeʻa (Hawaiian hoary bat) is Hawaiʻiʻs only native land mammal and an essential pollinator — its appearance in the Kumulipo as a named genealogical being reflects an ancestral awareness of its ecological importance.'
                  }
                ],
                whyNow: 'Wā 7 matters today because it teaches the emotional and ethical preparation required for encountering sacred knowledge — and because the Hawaiian hoary bat and native dog traditions are both part of an ancestral ecological memory worth protecting.'
              })
            },
            {
              id:       'km-wa-08',
              num:      'KM·W08',
              title:    'Wā 8 — Wā o Laʻilaʻi: Human Emergence',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-8.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 8 — The Era of Human Emergence',
                heroSubtitle: 'Wā o Laʻilaʻi · Born Was Laʻilaʻi, a Woman; Born Was Kiʻi, a Man',
                heroLead: 'Wā 8 is the wā of human emergence. Through the same genealogical language used for coral, fish, and birds, the chant names the first humans: Laʻilaʻi, a woman, and Kiʻi, a man. Humanity arrives within creation, not above it.',
                lines: KUMULIPO_WA_8_LINES,
                lineTranslations: KUMULIPO_WA_8_TRANSLATIONS,
                startLine: 595,
                endLine: 643,
                emergence: 'Humans are born — Laʻilaʻi and Kiʻi named as the foundational human pair — through the same birth-language used for every creature in the Kumulipo.',
                relationships: 'This wā places human emergence inside the ongoing genealogy of coral, sea, insects, birds, crawlers, pigs, and dogs — humanity as kin, not crown.',
                structureRole: 'Wā 8 completes the long arc of pō-born life by naming the first humans, setting the stage for the genealogical and chiefly lines that follow in Wā 9–16.',
                deeper: 'Wā 8 is the Kumulipo\'s most powerful teaching against human exceptionalism. Laʻilaʻi and Kiʻi are born with the same "hanau" — the same birth-word — used for the coral polyp in Wā 1. This is deliberate. Humans are not a different kind of emergence; they are one more generation within the same ancestral continuum that began in the deep pō. The chant insists that to be human is to be late-born within a vast, already-meaningful creation — which means that human identity carries the weight of everything that came before.',
                parallels: [
                  {
                    title: 'Human Origins and Kinship',
                    body: 'This resonates with modern evolutionary biology\'s understanding that humans emerge within — not apart from — the long history of life on earth, sharing ancestry with all living things.'
                  },
                  {
                    title: 'Relational Identity',
                    body: 'This parallels contemporary relational and indigenous frameworks that ground human identity in ecological and ancestral belonging rather than individual autonomy.'
                  },
                  {
                    title: 'Gender and Genealogy',
                    body: 'The naming of Laʻilaʻi as female first, with Kiʻi as male, reflects a genealogical tradition in which the female ancestral line is foundational — consistent with Hawaiian moʻokūʻauhau practice.'
                  }
                ],
                whyNow: 'Wā 8 matters today because the foundational questions of human identity — who are we, where do we come from, what do we owe? — are answered here not with dominion but with kinship. Laʻilaʻi and Kiʻi are born into a world already full of ancestors.'
              })
            },
            {
              id:       'km-wa-09',
              num:      'KM·W09',
              title:    'Wā 9 — Wā o ka Huli i ke Ao: Turning Toward Light',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-9.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 9 — The Turning Toward Ao',
                heroSubtitle: 'Wā o ka Huli i ke Ao · Threshold of Visibility',
                heroLead: 'Wā 9 marks a threshold movement toward ao. It is a transformation in state, not a rejection of pō.',
                lines: KUMULIPO_WA_9_LINES,
                lineTranslations: KUMULIPO_WA_9_TRANSLATIONS,
                startLine: 644,
                endLine: 672,
                emergence: 'A visible phase of ordering unfolds from previously concealed generative depth.',
                relationships: 'This wā binds pō and ao as continuous registers of one unfolding reality.',
                structureRole: 'Wā 9 is the hinge between foundational life emergence and later genealogical ordering.',
                deeper: 'Wā 9 teaches transitional intelligence: becoming is continuous, and source remains present in manifestation. The Kumulipo offers a model where transformation preserves ancestry rather than replacing it.',
                parallels: [
                  {
                    title: 'Complex Systems',
                    body: 'This can be compared to phase transitions where new order appears from prior conditions without severing continuity.'
                  },
                  {
                    title: 'Pattern and Emergence',
                    body: 'This parallels modern notions of emergence in which latent structures become observable through change in state.'
                  },
                  {
                    title: 'Relational Ontology',
                    body: 'This resonates with contemporary relational frameworks that interpret reality as layered and process-based.'
                  }
                ],
                whyNow: 'Wā 9 matters today because social and ecological transitions require continuity-based thinking that honors source, memory, and responsibility during change.'
              })
            },
            {
              id:       'km-wa-10',
              num:      'KM·W10',
              title:    'Wā 10 — Wā o nā Kūpuna Akua: Ancestral Divine Genealogies',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-10.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 10 — The Era of Divine Ancestral Genealogies',
                heroSubtitle: 'Wā o nā Kūpuna Akua · Sacred Lineal Ordering',
                heroLead: 'Wā 10 names sacred ancestral lines, making cosmic order legible through genealogy.',
                lines: KUMULIPO_WA_10_LINES,
                lineTranslations: KUMULIPO_WA_10_TRANSLATIONS,
                startLine: 673,
                endLine: 707,
                emergence: 'Divine ancestral relationships are articulated with greater structure and sequence.',
                relationships: 'This wā links cosmos, ancestry, naming, and sacred continuity in one framework.',
                structureRole: 'Wā 10 introduces explicit genealogical architecture that shapes later human and chiefly lines.',
                deeper: 'Wā 10 shows that knowledge is relational placement. To name is to situate within sacred continuity. The Kumulipo therefore preserves cosmology through genealogy, and genealogy through disciplined memory.',
                parallels: [
                  {
                    title: 'Systems Mapping',
                    body: 'This reflects modern systems mapping where meaning and function arise from relational position.'
                  },
                  {
                    title: 'Pattern Languages',
                    body: 'This resembles structured pattern languages that encode complex order through linked naming.'
                  },
                  {
                    title: 'Consciousness and Memory',
                    body: 'As a metaphor, this can be placed beside consciousness studies that emphasize memory and relation as world-making processes.'
                  }
                ],
                whyNow: 'Wā 10 matters today because cultural memory and naming practices remain crucial for identity, continuity, and respectful stewardship.'
              })
            },
            {
              id:       'km-wa-11',
              num:      'KM·W11',
              title:    'Wā 11 — Wā o nā Hanauna Kiʻekiʻe: High Genealogical Lines',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-11.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 11 — The Era of High Genealogical Lines',
                heroSubtitle: 'Wā o nā Hanauna Kiʻekiʻe · Layered Lineage Structure',
                heroLead: 'Wā 11 intensifies lineal ordering and inherited placement within sacred continuity.',
                lines: KUMULIPO_WA_11_LINES,
                lineTranslations: KUMULIPO_WA_11_TRANSLATIONS,
                startLine: 708,
                endLine: 1545,
                emergence: 'Higher genealogical lines and layered ancestral sequencing are clarified.',
                relationships: 'This wā links rank with obligation, showing lineal position as ethical responsibility.',
                structureRole: 'Wā 11 refines the social-cosmic architecture that informs later chiefly and human duties.',
                deeper: 'Wā 11 resists status-only readings of lineage. In Kumulipo logic, elevated position means increased kuleana. Leadership and memory are inseparable; authority is accountable to genealogy, land, and future generations.',
                parallels: [
                  {
                    title: 'Nested Systems',
                    body: 'This can be compared to nested systems where levels of organization carry differentiated function and responsibility.'
                  },
                  {
                    title: 'Governance Theory',
                    body: 'This parallels contemporary stewardship models that tie legitimacy to accountability and continuity.'
                  },
                  {
                    title: 'Complex Social Fields',
                    body: 'This resembles relational field models where identity and duty emerge through networked placement.'
                  }
                ],
                whyNow: 'Wā 11 matters today because it reframes leadership away from extraction and toward intergenerational accountability.'
              })
            },
            {
              id:       'km-wa-12',
              num:      'KM·W12',
              title:    'Wā 12 — Wā o nā Pili Aliʻi: Chiefly Relational Lines',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-12.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 12 — The Era of Chiefly Relational Lines',
                heroSubtitle: 'Wā o nā Pili Aliʻi · Governance Through Genealogy',
                heroLead: 'Wā 12 ties chiefly lines directly to ancestral source, centering authority as relational kuleana.',
                lines: KUMULIPO_WA_12_LINES,
                lineTranslations: KUMULIPO_WA_12_TRANSLATIONS,
                startLine: 1546,
                endLine: 1734,
                emergence: 'Chiefly relational lines and governance obligations rooted in genealogy.',
                relationships: 'This wā binds leadership to sacred continuity, land relationship, and social responsibility.',
                structureRole: 'Wā 12 translates genealogical architecture into political and ethical practice.',
                deeper: 'Wā 12 teaches that governance is never separate from ancestry. The Kumulipo frames political order as a sacred trust: to lead is to maintain balance among people, place, and genealogy.',
                parallels: [
                  {
                    title: 'Stewardship Governance',
                    body: 'This can be compared to modern stewardship-based governance models over extractive command structures.'
                  },
                  {
                    title: 'Relational Ethics',
                    body: 'This parallels ethics frameworks where duty arises from relationship, not individual assertion alone.'
                  },
                  {
                    title: 'Systems Responsibility',
                    body: 'This resembles systems governance ideas in which decision-makers are accountable to whole-network outcomes.'
                  }
                ],
                whyNow: 'Wā 12 matters today because sustainable governance depends on relational legitimacy, cultural memory, and responsibility to land and community.'
              })
            },
            {
              id:       'km-wa-13',
              num:      'KM·W13',
              title:    'Wā 13 — Wā o ka Hānau Moʻokūʻauhau: Human Genealogical Emergence',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-13.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 13 — The Era of Human Genealogical Emergence',
                heroSubtitle: 'Wā o ka Hānau Moʻokūʻauhau · Humans Within Continuity',
                heroLead: 'Wā 13 introduces human genealogical lines within the same sacred continuity as earlier life forms.',
                lines: KUMULIPO_WA_13_LINES,
                lineTranslations: KUMULIPO_WA_13_TRANSLATIONS,
                startLine: 1735,
                endLine: 1813,
                emergence: 'Human lineages emerge as continuation, not interruption, of creation.',
                relationships: 'This wā places humans in kinship with ocean, land, plants, animals, and ancestors.',
                structureRole: 'Wā 13 marks the transition from cosmic and chiefly structures into human genealogical identity.',
                deeper: 'Wā 13 is a corrective to human exceptionalism. The Kumulipo teaches personhood as relational belonging. Human identity inherits responsibility precisely because it is embedded in pre-existing ancestral and ecological networks.',
                parallels: [
                  {
                    title: 'Evolution and Continuity',
                    body: 'This resonates with modern understandings that humans emerge within broader biological continuity.'
                  },
                  {
                    title: 'Ecological Identity',
                    body: 'This can be compared to ecological identity frameworks where selfhood is constituted through relations.'
                  },
                  {
                    title: 'Consciousness Studies',
                    body: 'As a metaphor, this can be placed beside inquiries into consciousness as relationally situated, not isolated.'
                  }
                ],
                whyNow: 'Wā 13 matters today because identity crises, ecological crises, and social fragmentation all call for kinship-based understandings of humanity.'
              })
            },
            {
              id:       'km-wa-14',
              num:      'KM·W14',
              title:    'Wā 14 — Wā o ka Hoʻonui Hanauna: Expansion of Descendant Lines',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-14.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 14 — The Era of Expanding Descendant Lines',
                heroSubtitle: 'Wā o ka Hoʻonui Hanauna · Widening Relational Communities',
                heroLead: 'Wā 14 expands descendant lines into wider social worlds while maintaining genealogical continuity.',
                lines: KUMULIPO_WA_14_LINES,
                lineTranslations: KUMULIPO_WA_14_TRANSLATIONS,
                startLine: 1814,
                endLine: 1929,
                emergence: 'Branching descendant relations and expanded peoplehood through continuity of lineage.',
                relationships: 'This wā connects family, community, and ecology as one widening field of relation.',
                structureRole: 'Wā 14 scales genealogy outward into social organization and collective identity.',
                deeper: 'Wā 14 frames expansion as responsibility, not separation. Growth in descendants increases relational obligations to place, memory, and future life. The Kumulipo presents belonging as active practice across generations.',
                parallels: [
                  {
                    title: 'Network Theory',
                    body: 'This can be compared to branching network models where growth increases relational density and interdependence.'
                  },
                  {
                    title: 'Complex Social Systems',
                    body: 'This parallels complexity perspectives in which community resilience depends on connected lineage pathways.'
                  },
                  {
                    title: 'Relational Fields',
                    body: 'As a metaphor, this resembles relational field concepts where identity expands through patterned connection.'
                  }
                ],
                whyNow: 'Wā 14 matters today because sustainable futures require renewed kinship, community memory, and intergenerational cooperation.'
              })
            },
            {
              id:       'km-wa-15',
              num:      'KM·W15',
              title:    'Wā 15 — Wā o ke Kauoha a me ke Kuleana: Charge and Responsibility',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-15.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 15 — The Era of Charge and Kuleana',
                heroSubtitle: 'Wā o ke Kauoha a me ke Kuleana · Ethics of Inherited Duty',
                heroLead: 'Wā 15 makes explicit that genealogy carries ethical charge: inheritance is obligation, not entitlement.',
                lines: KUMULIPO_WA_15_LINES,
                lineTranslations: KUMULIPO_WA_15_TRANSLATIONS,
                startLine: 1930,
                endLine: 2048,
                emergence: 'Kuleana appears as integral feature of lineage and memory.',
                relationships: 'This wā links ancestry, conduct, stewardship, and intergenerational responsibility.',
                structureRole: 'Wā 15 converts genealogical knowledge into ethical instruction for lived practice.',
                deeper: 'Wā 15 is the ethical pivot of the sequence. The Kumulipo teaches that knowing one\'s place in creation must become action that protects balance. Knowledge without responsibility is incomplete.',
                parallels: [
                  {
                    title: 'Sustainability Ethics',
                    body: 'This reflects modern sustainability ethics where current decisions are evaluated by intergenerational impact.'
                  },
                  {
                    title: 'Systems Stewardship',
                    body: 'This can be compared to stewardship models that prioritize long-term system health over short-term extraction.'
                  },
                  {
                    title: 'Moral Ecology',
                    body: 'This resonates with emerging frameworks that connect ecological integrity and ethical responsibility.'
                  }
                ],
                whyNow: 'Wā 15 matters today because climate, resource, and social crises demand cultures of responsibility rooted in ancestry and care for future generations.'
              })
            },
            {
              id:       'km-wa-16',
              num:      'KM·W16',
              title:    'Wā 16 — Wā o ke Ao Kanaka: Human Realm in Light',
              readTime: '7 min',
              image:    'assets/images/kumulipo/wa-16.png',
              content: buildKumulipoWaContent({
                waLabel: 'Wā 16 — The Human Realm in Ao',
                heroSubtitle: 'Wā o ke Ao Kanaka · Culmination in Living Responsibility',
                heroLead: 'Wā 16 culminates the sequence in human life under light, defined not by dominion but by stewardship and relational intelligence.',
                lines: KUMULIPO_WA_16_LINES,
                lineTranslations: KUMULIPO_WA_16_TRANSLATIONS,
                startLine: 2049,
                endLine: 2102,
                emergence: 'Human social-ethical accountability across land, sea, sky, and community.',
                relationships: 'This wā integrates ancestry, ecology, governance, and spiritual responsibility into lived human practice.',
                structureRole: 'Wā 16 completes the unfolding sequence by defining humanity through kuleana within creation.',
                deeper: 'Wā 16 is culmination-as-commitment. The Kumulipo does not end with human superiority; it ends with responsibility. Humanity is the stage where relational knowledge must be enacted to sustain balance.',
                parallels: [
                  {
                    title: 'Integrated Systems',
                    body: 'This can be compared to integrated systems stewardship that links social, ecological, and ethical domains.'
                  },
                  {
                    title: 'Complexity and Governance',
                    body: 'This parallels complexity-aware governance where long-term resilience depends on relational decision making.'
                  },
                  {
                    title: 'Consciousness and Responsibility',
                    body: 'As a metaphor, this resonates with consciousness studies that connect awareness with ethical action.'
                  }
                ],
                whyNow: 'Wā 16 matters today because it offers a profound framework for identity, sustainability, and cultural memory: to be human is to mālama relationships that make life possible.'
              })
            },
            {
              id:       'km-threshold-summary-cards',
              num:      'KM·SC1',
              title:    'Kumulipo Wā Summary Cards — 16 Threshold Quick Reference',
              readTime: '10 min',
              content: buildKumulipoWaSummaryCards()
            }
          ]
        },

        /* ── MODULE 2: NAVIGATION ── */
        {
          id:    'kanaka-navigation',
          title: 'Wayfinding & Navigation',
          emoji: '⭐',
          desc:  'The science and art of navigating the Pacific by stars, swells, birds, and sky.',
          lessons: [
            {
              id:       'km-starcompass',
              num:      'KM·03',
              title:    'The Star Compass — Navigating by Hōkūleʻa and 150 Stars',
              readTime: '10 min',
              content: `
<p class="lead">For over a thousand years before European contact, Polynesian navigators sailed vast stretches of open ocean across the largest ocean on Earth — without compasses, maps, or instruments. They used the stars, ocean swells, wind, cloud formations, bird behavior, and the color and temperature of the water itself. This is not primitive navigation. It is one of humanity's greatest scientific and intellectual achievements.</p>

<facts>Hokūleʻa::Zenith Star of Hawaiʻi (Arcturus)|32::Star Houses on the Horizon Compass|~150–200::Stars Memorized by Master Navigators|2,500 mi::Hawaiʻi to Tahiti (open ocean)</facts>

<h4>The Star Compass</h4>
<p>Hawaiian navigators built a mental star compass by dividing the horizon into <strong>32 houses</strong> — directions defined by where specific stars rise and set on the horizon. Every star rises in the east and sets in the west at a consistent bearing, varying only with the observer's latitude. A navigator memorized each star's rising and setting points and used them to know direction at any hour of the night.</p>
<p>The zenith star of Hawaiʻi — the star that passes directly overhead — is <strong>Hōkūleʻa (Arcturus)</strong>. When Hōkūleʻa sits directly overhead, you are at the latitude of Hawaiʻi (~21°N). Navigators used the zenith star as a latitude fix: when it's overhead, you're home.</p>

<h4>Reading the Ocean Swells</h4>
<p>Stars only work on clear nights. The deeper art involved reading the ocean itself. The Pacific has <strong>deep ocean swells</strong> — long, regular waves generated by distant weather systems — that travel in consistent directions regardless of local wind. A skilled navigator could feel these swells through the hull of the canoe and through their own body lying on the deck with eyes closed.</p>

<h4>Other Signs of Land and Direction</h4>
<ul>
<li><strong>Birds:</strong> The kōlea (golden plover) migrates between Hawaiʻi and Alaska on a known path. Specific seabirds are only found within certain distances of land — their presence signals an island before it is visible on the horizon.</li>
<li><strong>Cloud formations:</strong> Islands create distinctive stationary cloud formations 20–30 miles away. Cumulus clouds tend to form and remain over land due to heat differentials. A cloud that doesn't move on a clear day often means land beneath it.</li>
<li><strong>Ocean color and smell:</strong> Near islands the water changes color from reef sediment and freshwater runoff. Vegetation can be smelled 20 miles offshore on the right wind.</li>
<li><strong>Phosphorescence:</strong> Underwater phosphorescence patterns change near islands. Current directions shift around landmasses in predictable ways.</li>
</ul>

<callout>Kilokilo Hōkū — "star gazing" — was a sacred science. The navigator held not just technical knowledge but spiritual responsibility: every life on the canoe depended on their clarity of mind and their relationship with the stars, wind, and ocean. Navigation was a practice of alignment — with the natural world and with oneself.</callout>
`
            },
            {
              id:       'km-hokuleaa',
              num:      'KM·04',
              title:    'Hōkūleʻa — The Voyaging Canoe & the Revival of Wayfinding',
              readTime: '8 min',
              content: `
<p class="lead">By the mid-20th century, traditional wayfinding had been nearly completely lost. In 1973, the Polynesian Voyaging Society was founded with a mission: prove that ancient Polynesians could have intentionally sailed and settled the Pacific — and revive the knowledge that nearly died. The result was one of the most important cultural achievements of the 20th century.</p>

<facts>1973::Polynesian Voyaging Society Founded|1976::First Voyage Hawaiʻi to Tahiti|62 ft::Length of Hōkūleʻa|2014–2017::Worldwide Voyage (Mālama Honua)</facts>

<h4>Building Hōkūleʻa</h4>
<p><strong>Hōkūleʻa</strong> — named for Arcturus, the zenith star of Hawaiʻi — is a 62-foot double-hulled voyaging canoe modeled on traditional designs from petroglyphs, oral tradition, and the accounts of early European observers. She was built by hand and launched in 1975. In <strong>1976</strong>, navigator <strong>Mau Piailug</strong> of Satawal, Micronesia — one of the last living traditional navigators in the Pacific — guided Hōkūleʻa from Hawaiʻi to Tahiti using only traditional navigation. No instruments. No compass. No maps. 2,500 miles of open ocean in 30 days.</p>

<h4>Nainoa Thompson and the Hawaiian Revival</h4>
<p><strong>Nainoa Thompson</strong> (born 1953, Oʻahu) became the apprentice of Mau Piailug and dedicated years to rebuilding the star compass from first principles — studying astronomy, memorizing star paths, learning to feel the swells. In 1980, he became the first Hawaiian in approximately 600 years to navigate by the stars alone. He has since guided Hōkūleʻa and sister canoes on voyages throughout the Pacific, to Japan, and on the Mālama Honua (2014–2017) worldwide voyage — 47,000 miles across 27 countries.</p>

<callout type="gold">The revival of wayfinding was not only a technical achievement. It was a cultural and spiritual restoration. When Hawaiian youth learned that their ancestors had navigated half the globe by the stars, the shame that colonialism had planted — the idea that Hawaiian knowledge was primitive — began to dissolve. The canoe became a vehicle not just of navigation but of healing.</callout>

<h4>What Hōkūleʻa Proved</h4>
<p>Hōkūleʻa's voyages answered definitively: Did Polynesian people intentionally navigate and settle the Pacific, or did they drift there by accident? They navigated. Every island in Polynesia — from Aotearoa to Rapa Nui to Hawaiʻi — was found, settled, and connected by intentional, skilled, deeply scientific ocean navigation. It was not luck. It was genius.</p>
`
            }
          ]
        },

        /* ── MODULE 3: LAND & ECOLOGY ── */
        {
          id:    'kanaka-land',
          title: 'Land, Ecology & Governance',
          emoji: '🌿',
          desc:  'The ahupuaʻa system, loʻi kalo, and loko iʻa — Hawaiian ecological intelligence.',
          lessons: [
            {
              id:       'km-ahupuaa',
              num:      'KM·05',
              title:    'The Ahupuaʻa — A Complete World in One Land Division',
              readTime: '10 min',
              content: `
<p class="lead">The ahupuaʻa is one of the most sophisticated land and resource management systems ever developed by any civilization on Earth. It was not just a political boundary — it was a complete ecological unit, a living system designed to sustain human communities in perfect relationship with their environment, from the highest mountain peak to the deepest ocean.</p>

<h4>What the Word Means</h4>
<p><strong>Ahu</strong> (altar/mound) + <strong>Puaʻa</strong> (pig) = a stone altar topped with the carved image of a pig's head, placed at territorial boundaries. When traveling along a ridge or coastal road and encountering an ahu puaʻa, you knew you were crossing from one community's land into another. These physical markers expressed a sophisticated system of resource sovereignty.</p>

<h4>The Shape: Mountain to Sea</h4>
<p>Each ahupuaʻa ran in a wedge shape from the mountain ridgeline (<em>mauka</em>) to the sea (<em>makai</em>), following a watershed. This design meant every ahupuaʻa had access to every ecological zone needed for complete human survival:</p>

<ul>
<li><strong>Wao Akua</strong> (Realm of the Gods) — High mountain forest, cloud cover, the source of all fresh water. Sacred, protected.</li>
<li><strong>Wao Koa</strong> (Realm of Warriors) — Upland forest. Timber for canoes, medicine plants, bird feathers for aliʻi regalia.</li>
<li><strong>Wao Kanaka</strong> (Realm of People) — Agricultural lands. Loʻi kalo (taro paddies), gardens, sweet potato fields.</li>
<li><strong>Kahakai</strong> (Coastline) — Loko iʻa (fishponds), salt production, shoreline fishing.</li>
<li><strong>Kai</strong> (The Sea) — The ahupuaʻa extended into the ocean: offshore fishing zones, seaweed harvesting, canoe navigation routes.</li>
</ul>

<callout>The ahupuaʻa sustained a Hawaiian population estimated at 300,000 to 1,000,000 people — entirely from island resources, without external trade — for over 1,000 years. No landfill. No watershed pollution. Complete circularity of nutrients from mountain to sea and back. Modern ecological sustainability science is still catching up to what Hawaiian communities understood a millennium ago.</callout>
`
            },
            {
              id:       'km-loikalo',
              num:      'KM·06',
              title:    'Loʻi Kalo & Loko Iʻa — Sacred Agriculture and Aquaculture',
              readTime: '10 min',
              content: `
<p class="lead">Two systems defined Hawaiian food sovereignty at a level unmatched in the pre-contact Pacific: the <strong>loʻi kalo</strong> (wetland taro paddies) and the <strong>loko iʻa</strong> (fishponds). Together they formed the nutritional foundation of Hawaiian civilization — one rooted in the land, one in the sea, both expressing the understanding that food production is a spiritual act.</p>

<h4>Loʻi Kalo — The Sacred Taro Paddy</h4>
<p>Kalo (taro) is the elder sibling of humanity in Hawaiian tradition (see KM·02). To cultivate kalo is to tend your ancestor. Loʻi kalo are sophisticated hydraulic systems fed by <strong>ʻauwai</strong> — irrigation channels redirecting mountain stream water through the paddies in continuous flow. This flow oxygenates the water, regulates temperature, delivers nutrients from the mountains, and carries waste downstream.</p>

<facts>300+::Named Varieties of Kalo|~1000 yrs::Continuous Wetland Agriculture|400+::Fishponds at European Contact|Mākāhā::The Self-Regulating Sluice Gate</facts>

<twocol left="ʻAuwai — The Water System" right="Biodiversity of Kalo">Hawaiian farmers built sophisticated ʻauwai networks that could irrigate dozens of loʻi from a single mountain stream. The channels were engineered for gravity flow, minimal evaporation, and nutrient transport. They required constant maintenance — cleaning, repair, flow management — and this maintenance was a community obligation, not an individual one. The water belonged to everyone.||Hawaiian farmers cultivated over 300 named varieties of kalo, each with distinct flavors, textures, colors, and preferred growing conditions. Some varieties grew in wet loʻi; others in dry fields (kula). Some were prized for eating; others for making poi; others for their medicinal properties. This biodiversity was itself a form of resilience — no single disease or drought could destroy the entire food supply.</twocol>

<h4>The Genius of the Mākāhā</h4>
<p>The loko kuapā (walled coastal fishpond) uses a mākāhā — a sluice gate built into the stone wall, sized so that juvenile fish can swim through the openings into the pond, feeding on the abundant algae inside. As the fish grow, they become too large to pass back through the gate. They are effectively self-harvesting. The fishpond ecosystem is self-sustaining.</p>

<callout>The loʻi kalo and loko iʻa together embodied the principle of mālama ʻāina — caring for the land. Not as a philosophical abstraction, but as daily practice: you maintain the ʻauwai channels, you observe the mākāhā, you harvest sustainably, you return nutrients to the system. The land and sea care for you only as long as you care for them.</callout>
`
            }
          ]
        },

        /* ── MODULE 4: LANGUAGE & ARTS ── */
        {
          id:    'kanaka-language',
          title: 'Language, Hula & Sacred Arts',
          emoji: '🗣️',
          desc:  'ʻŌlelo Hawaiʻi, hula as living text, and the arts as knowledge systems.',
          lessons: [
            {
              id:       'km-olelo',
              num:      'KM·07',
              title:    'ʻŌlelo Hawaiʻi — The Hawaiian Language',
              readTime: '8 min',
              content: `
<p class="lead">ʻŌlelo Hawaiʻi is one of the most musical languages in the world — built from 5 vowels and 8 consonants, every word a meditation on sound and meaning. It is also a language that nearly died within living memory, and whose revival is one of the most remarkable acts of cultural resistance and restoration in modern history.</p>

<facts>5::Vowels (a, e, i, o, u)|8::Consonants (h, k, l, m, n, p, w, ʻokina)|~1778::Estimated 500,000 Hawaiian speakers|~1981::Fewer than 50 children fluent</facts>

<h4>The Structure of Meaning</h4>
<p>Hawaiian is a polysynthetic language — single words carry layers of compressed meaning. The word <strong>aloha</strong> alone contains: love, peace, compassion, grace, mercy, kindness, the breath of life (alo = presence + ha = breath). Every place name in Hawaiʻi is a story, an ecological observation, or a genealogical record. <strong>Waikīkī</strong> means "spouting waters." <strong>Honolulu</strong> means "protected bay." The landscape was a living text, and the language was the key to reading it.</p>

<h4>The Banning of the Language</h4>
<p>After the illegal overthrow of the Hawaiian Kingdom in 1893, and annexation by the United States in 1898, ʻōlelo Hawaiʻi was banned from schools in 1896. Children were punished for speaking Hawaiian at school. By 1981, fewer than 50 children spoke Hawaiian as their first language. A language that had carried 2,102 lines of the Kumulipo, generations of genealogy, and an entire ecological knowledge system was nearly gone within three generations.</p>

<callout type="gold">In 1983, a group of Hawaiian educators and families created the first Hawaiian language immersion preschool — Pūnana Leo (Language Nest). Today, there are over 20 Pūnana Leo schools and a full Hawaiian-medium school system from preschool through university. An estimated 18,000–20,000 people now speak Hawaiian with varying fluency. The language is not just surviving — it is being transmitted to a new generation of children for whom Hawaiian is their first language.</callout>
`
            },
            {
              id:       'km-hula',
              num:      'KM·08',
              title:    'Hula — The Body as Sacred Text',
              readTime: '8 min',
              content: `
<p class="lead">Hula is not a performance. It is a technology for the preservation and transmission of knowledge. Every movement — every gesture of the hand, every step of the foot, every expression of the face — encodes specific meaning: genealogy, geography, natural phenomenon, spiritual practice, historical event. The dancer's body is a living library.</p>

<h4>Two Forms of Hula</h4>
<p><strong>Hula kahiko</strong> (ancient hula) — performed with chant (oli or mele) and traditional percussion instruments (pahu drum, ipu gourd). This is ceremonial hula, rooted in the heiau tradition. It was performed for the gods, for the aliʻi, and for specific ritual occasions. The knowledge contained in hula kahiko was considered sacred and was transmitted only through formal apprenticeship with a kumu hula (hula teacher/master).</p>
<p><strong>Hula ʻauana</strong> (modern hula) — developed in the 19th century with Western musical influence, using guitar and ukulele. More accessible and celebratory, but still grounded in the same movement vocabulary and narrative tradition.</p>

<h4>The Hālau Hula</h4>
<p>The hālau hula (hula school) is a sacred institution. The relationship between <strong>kumu hula</strong> (teacher, literally "source of hula") and <strong>haumāna</strong> (student) is not merely educational — it is genealogical and spiritual. The kumu transmits not just technique but the akua (spiritual essence) of the tradition.</p>

<callout>When missionaries banned hula in the 1820s, calling it "licentious and heathen," they understood something important about it — they just understood it wrong. Hula was dangerous to colonialism precisely because it was the primary vehicle for transmitting Hawaiian identity, history, and values. The fact that hula survived, was revived in the Hawaiian Renaissance of the 1970s, and now thrives worldwide is one of the most powerful acts of cultural preservation in human history.</callout>
`
            }
          ]
        },

        /* ── MODULE 5: HEALING & PLANT MEDICINE ── */
        {
          id:    'kanaka-healing',
          title: 'Healing & Plant Medicine',
          emoji: '🌿',
          desc:  'Laʻau lapaʻau — the sacred art of Hawaiian plant medicine and the kahuna healers.',
          lessons: [
            {
              id:       'km-laau',
              num:      'KM·09',
              title:    'Laʻau Lapaʻau — The Sacred Art of Hawaiian Plant Medicine',
              readTime: '16 min',
              content: `
<p class="lead"><em>Laʻau lapaʻau</em> — Hawaiian plant medicine — is one of the most sophisticated healing systems developed in the Pacific. For over a thousand years before Western contact, Kānaka Maoli healers called <strong>kahuna lapaʻau</strong> maintained deep botanical knowledge of hundreds of native and Polynesian-introduced plants, combining physical remedies with spiritual practice, prayer, and an understanding that healing is never separate from the relationship between person, family, land, and cosmos. This is not folk medicine. It is a complete medical science.</p>

<facts>300+::Medicinal plants used|~1,000 yrs::Of recorded practice|Kahuna::Trained specialists|Living::Tradition today</facts>

<h4>The Kahuna Lapaʻau — Healers of the Highest Order</h4>
<p>A <strong>kahuna lapaʻau</strong> (healing kahuna) was not simply an herbalist. The word <em>kahuna</em> means "keeper of the secret" or "master of a craft" — and the craft of healing required years, sometimes decades, of apprenticeship under an established healer. Training was oral, rigorous, and sacred. A kahuna lapaʻau learned:</p>
<ul>
<li>The identity, preparation, and proper harvesting of medicinal plants</li>
<li>The prayers (<em>pule</em>) associated with each plant and condition</li>
<li>Diagnosis through observation, questioning, and spiritual discernment</li>
<li>The timing of treatments according to lunar cycles and seasons</li>
<li>The kapu (sacred protocols) governing medicine — when to harvest, how to approach plants with respect, how to prepare and administer remedies</li>
<li>The relationship between emotional and spiritual states and physical illness</li>
</ul>
<p>There were many types of kahuna healers, each with specific specializations: the <strong>kahuna hāhā</strong> diagnosed illness through physical examination and touch; the <strong>kahuna pule</strong> healed through prayer and spiritual intervention; the kahuna lapaʻau worked specifically with plant-based medicines. These roles sometimes overlapped in a single healer, and often collaborated.</p>

<h4>Key Medicinal Plants of Hawaiʻi</h4>
<p>Of the hundreds of plants in the Hawaiian pharmacopoeia, the following were among the most foundational — carried across the Pacific in the voyaging canoes, cultivated in the ahupuaʻa system, and integrated into daily life as both food and medicine.</p>

<div class="cv-plant-grid">
  <div class="cv-plant-card">
    <div class="cv-plant-name">Noni <span class="cv-plant-latin">Morinda citrifolia</span></div>
    <div class="cv-plant-body"><p>Called the "pain killer tree" in Polynesia, noni was one of the most versatile medicines in the Hawaiian tradition. The fruit, leaves, bark, and roots all had documented uses. Fruit juice was used for high blood pressure, diabetes-related conditions, digestive complaints, and general immune support. Leaves were heated and applied as poultices for joint pain and skin conditions. Modern research has confirmed many of noni's bioactive compounds including damnacanthal, scopoletin, and proxeronine.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">ʻŌlena <span class="cv-plant-latin">Curcuma longa — Turmeric</span></div>
    <div class="cv-plant-body"><p>ʻŌlena (turmeric) was brought to Hawaiʻi by the first Polynesian voyagers and held deep medicinal and ceremonial significance. It was used to treat respiratory infections — the juice squeezed into the nostrils for sinus conditions. Also used for ear infections, skin inflammations, and as a purifying agent in ceremony. The active compound curcumin is now one of the most studied anti-inflammatory substances in modern pharmacology — confirming what Kānaka Maoli healers knew for over a thousand years.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">Kalo <span class="cv-plant-latin">Colocasia esculenta — Taro</span></div>
    <div class="cv-plant-body"><p>Kalo is the sacred elder sibling of the Kānaka Maoli people. As medicine, kalo leaves were used in poultices for skin irritations and minor wounds. The corm was cooked into preparations for digestive disorders. The starchy gel from cooked kalo soothed inflammation internally and externally. Beyond its medicinal properties, kalo represents the deep inseparability of food and medicine in Hawaiian tradition — properly cultivated and consumed food is itself preventive medicine.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">Kukui <span class="cv-plant-latin">Aleurites moluccana — Candlenut</span></div>
    <div class="cv-plant-body"><p>The kukui tree — now the official state tree of Hawaiʻi — was a complete pharmacy in itself. Nut oil was used for burns, chapped skin, and sunburn. Roasted kernels were used as a laxative. The sap from the bark treated mouth sores and thrush. Ash of burned kukui nuts mixed with salt was applied to gum infections and toothaches. Kukui (light) also represented knowledge and enlightenment — leis made from kukui nuts were worn by aliʻi and hula dancers.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">Kī <span class="cv-plant-latin">Cordyline fruticosa — Ti Plant</span></div>
    <div class="cv-plant-body"><p>Kī (ti plant) held immense spiritual and medicinal power. The leaves were used to wrap hot stones in steam treatments — the original Hawaiian steam therapy. Kī was used in purification rituals, planted around homes for protection, and carried by healers during ceremonies. The spiritual and medicinal properties of kī were considered inseparable — plants used in healing were understood to carry mana, and that mana was activated through proper prayer and protocol.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">Māmaki <span class="cv-plant-latin">Pipturus albidus</span></div>
    <div class="cv-plant-body"><p>Māmaki is one of Hawaiʻi's most beloved native plants and one of the few endemic plants widely used medicinally. As a tea, māmaki leaves were consumed to support overall health, strengthen the immune system, and aid recovery from illness. It was used for high blood pressure, liver conditions, and as a general tonic. Modern research has identified polyphenols, chlorogenic acid, and rutin in māmaki — compounds associated with antioxidant, anti-inflammatory, and cardioprotective effects.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">ʻAwa <span class="cv-plant-latin">Piper methysticum — Kava</span></div>
    <div class="cv-plant-body"><p>ʻAwa (kava) was one of the most significant ceremonially and medicinally important plants brought by Polynesian voyagers. Used across the Pacific for thousands of years, ʻawa was consumed in ritual ceremonies to open communication with ancestral spirits. Medicinally, it functioned as a powerful anxiolytic and muscle relaxant — used to ease pain, calm anxiety, and treat insomnia. The kavalactones in kava are now confirmed by modern science to have sedative, anxiolytic, and analgesic properties.</p></div>
  </div>
  <div class="cv-plant-card">
    <div class="cv-plant-name">ʻUhaloa <span class="cv-plant-latin">Waltheria indica</span></div>
    <div class="cv-plant-body"><p>ʻUhaloa was one of the primary respiratory plants in the Hawaiian pharmacopoeia. The root and bark were chewed or brewed into preparations for sore throats, coughs, and respiratory infections. It was considered one of the most reliable treatments for throat conditions. The plant demonstrates the remarkable specificity of Hawaiian botanical knowledge — healers understood that different preparations of ʻuhaloa worked differently depending on whether the condition was in the upper or lower respiratory tract.</p></div>
  </div>
</div>

<h4>Kapu and the Ethics of Healing</h4>
<p>The kapu system — often misrepresented as merely a set of restrictions — was in reality a sophisticated framework for maintaining balance (<em>pono</em>) between human activity and the natural and spiritual worlds. In the context of laʻau lapaʻau, kapu governed:</p>
<ul>
<li><strong>Harvesting protocols:</strong> Plants were gathered at specific times, in specific ways, with prayers offered before and after. Taking more than needed was forbidden. The first of a harvest was often returned as an offering.</li>
<li><strong>Gender protocols:</strong> Some plants and preparations were specific to women's medicine, others to men's.</li>
<li><strong>Preparation environments:</strong> The space where medicine was prepared was considered sacred. Certain activities and presences were restricted during preparation.</li>
<li><strong>The healer's conduct:</strong> The kahuna lapaʻau maintained personal purity — physical, emotional, spiritual — as a prerequisite for effective healing. A healer in conflict or imbalance could not effectively channel the healing mana of plants.</li>
</ul>

<h4>Pule — Prayer as Medicine</h4>
<p>No preparation of laʻau lapaʻau was complete without <strong>pule</strong> (prayer). The pule was not decoration on top of the medicine — it was understood to be integral to activating the plant's healing properties. Plants held <em>mana</em> — spiritual power — and that mana was accessed and directed through the proper prayers, spoken by a qualified kahuna who had earned the right to call upon those forces.</p>
<p>Specific pule existed for specific plants and conditions. The healer also prayed with and for the patient, addressing not just the physical symptoms but the spiritual and relational conditions that might have opened the person to illness. Hawaiian healing understood that illness was often a symptom of a disrupted relationship — with family, with land, with the divine — and that lasting healing required addressing all levels simultaneously.</p>

<h4>The Modern Revival</h4>
<p>The Hawaiian cultural renaissance of the 1970s brought renewed attention to laʻau lapaʻau. Efforts to document, preserve, and revive traditional healing knowledge have been led by organizations including <strong>Papa Ola Lōkahi</strong> (the Native Hawaiian Health Care consortium), the University of Hawaiʻi's ethnobotany and Hawaiian Studies programs, and individual kahuna who maintained the tradition through generations of suppression.</p>

<callout>Laʻau lapaʻau reveals a principle at the heart of Kānaka Maoli knowledge: that the land — the <em>ʻāina</em> — provides everything needed for human health and flourishing. The plants are not resources to be extracted but relatives to be respected. The healer is not separate from the land but its student and steward. This is not a metaphor. It is the operating system of an entire civilization.</callout>
`
            }
          ]
        }

      ] // end kanaka modules
    },    

    /* ══════════════════════════════════════════════════════════
       KEMET
    ══════════════════════════════════════════════════════════ */
    {
      id:      'kemet',
      name:    'Kemet',
      emoji:   '☥',
      tagline: 'Ancient Egyptian Wisdom — The Teachings of the Black Land',
      theme:   'gold',
      status:  'live',
      intro:   'The ancient Egyptians called their land Kemet — "the Black Land." They were African. Their civilization endured for over 3,000 years and produced knowledge systems in cosmology, ethics, mathematics, medicine, and philosophy that shaped every major civilization that followed. These lessons explore the depth of that knowledge on its own terms — not as the foundation of Western culture, but as African civilization at its height.',

      modules: [

        /* ── MODULE 1: COSMOLOGY ── */
        {
          id:    'kemet-cosmology',
          title: 'Cosmogony & Creation',
          emoji: '☀',
          desc:  'The multiple creation traditions of Kemet — from Nun to the Ennead.',
          lessons: [
            {
              id:       'ke-nun',
              num:      'KE·01',
              title:    'Nun & the Primordial Waters — Before the Beginning',
              readTime: '8 min',
              content: `
<p class="lead"><strong>Nun</strong> — the infinite, dark, primordial waters — is one of the oldest concepts in all human religious thought. It predates the Egyptian written record, which itself is the oldest in the world. Nun is not a god with a face and a story. Nun is the condition that existed before all conditions. Pure potential. Infinite depth. Absolute darkness. From Nun, everything arose.</p>

<h4>What Nun Is</h4>
<p>Nun is not nothingness. The Kemetic mind did not conceive of creation as something arising from nothing (ex nihilo) — that is a later Greek/Christian concept. For the ancient Egyptians, before creation there was <em>something</em>: dark, formless, infinite, and containing all potential. Nun is that something. It is not empty space — it is full of everything that has not yet become anything.</p>

<callout>Nun was understood to still exist at the margins of the created world — the cosmic ocean that surrounded and underlaid the ordered creation. The annual Nile flood was Nun returning: the primordial waters briefly reclaiming the earth before receding and renewing it. Every flood was a mini-re-creation.</callout>

<h4>The Conditions Within Nun — The Ogdoad</h4>
<p>The Hermopolitan tradition identified the conditions within Nun as four paired forces — the Ogdoad (Eight). These were the qualities of the universe before it acted on itself:</p>
<ul>
<li><strong>Nun & Naunet</strong> — the primordial waters themselves, the medium of all potential</li>
<li><strong>Heh & Hauhet</strong> — infinite space and infinite time; eternity in all directions</li>
<li><strong>Kek & Kauket</strong> — primordial darkness; the absence of light before light existed</li>
<li><strong>Amun & Amaunet</strong> — the hidden, invisible principle; the cause before the effect</li>
</ul>
<p>These eight existed in dynamic suspension within Nun until the moment of creation — when they collectively generated the Isle of Flame, the first mound of earth rising from the primordial waters, upon which the first sun rose. Creation was not an act of a single god imposing order on chaos — it was the natural unfolding of conditions that had always existed within the darkness.</p>
`
            },
            {
              id:       'ke-ennead',
              num:      'KE·02',
              title:    'The Heliopolitan Ennead — Nine Principles of Creation',
              readTime: '12 min',
              content: `
<p class="lead">The most complete and well-known Kemetic creation tradition comes from <strong>Iunu (Heliopolis)</strong> — the great city of the sun. Its theology produced the Ennead: nine interconnected divine principles that describe the unfolding of creation from nothing to the full world. Each principle is not merely a god — it is a cosmic function, a stage in the emergence of reality.</p>

<facts>Iunu::City of Origin (Heliopolis)|9::Principles of the Ennead|Atum::The Self-Created One|Ra-Atum::Sun as the Totality of Creation</facts>

<h4>Stage 1: Atum — The Self-Created</h4>
<p><strong>Atum</strong> ("The Complete One" or "The One Who Becomes") arose from Nun through self-generation. He stood upon the first primordial mound (the <strong>benben</strong>). Atum is the totality of existence made conscious. He contains within himself the seeds of everything that will come into being.</p>

<h4>Stage 2: Shu & Tefnut — Air and Moisture</h4>
<p><strong>Shu</strong> (air, space, light, the atmosphere) and <strong>Tefnut</strong> (moisture, rain, the wet element) are the first created pair — and already the pattern is established: creation proceeds through complementary pairs. Neither alone is sufficient. Air without moisture is desert. Moisture without air has no movement. Together they make life possible.</p>

<h4>Stage 3: Geb & Nut — Earth and Sky</h4>
<p><strong>Geb</strong> (the earth) and <strong>Nut</strong> (the sky — the arching goddess whose body forms the vault of heaven) are the children of Shu and Tefnut. Shu separates them, holding Nut above and Geb below — and in this separation, the space for life is created. Nut swallows the sun each evening and gives birth to it each dawn: the original cycle of death and resurrection.</p>

<h4>Stage 4: Osiris, Isis, Set & Nephthys</h4>
<ul>
<li><strong>Osiris</strong> — divine order, resurrection, the agricultural cycle, the afterlife. The first king.</li>
<li><strong>Isis</strong> — divine magic, the seat of power, motherhood, healing. She reassembles Osiris after his murder.</li>
<li><strong>Set</strong> — the desert, storms, chaos, necessary disruption. Not evil — necessary. The force that keeps existence from stagnation.</li>
<li><strong>Nephthys</strong> — the unseen, the margins, darkness, the protection of the dead.</li>
</ul>

<callout>Notice the deep architecture: creation begins in darkness and water (Nun), a self-conscious principle arises (Atum), everything unfolds through paired complementary forces, and the final stage brings human experience — love, death, chaos, magic, and resurrection — into the cosmic order. This is not mythology. It is a complete cosmological model.</callout>
`
            },
            {
              id:       'ke-ptah',
              num:      'KE·03',
              title:    'Ptah & the Memphite Theology — Creation Through Word',
              readTime: '8 min',
              content: `
<p class="lead">From <strong>Memphis (Mennefer)</strong>, the theology of <strong>Ptah</strong> offers a radically different and philosophically extraordinary account of creation: the universe was created through thought and speech. This theology — recorded on the Shabaka Stone (~700 BCE but copied from a much older text) — predates the Greek concept of the Logos by over 1,500 years, and the opening of the Gospel of John ("In the beginning was the Word") by approximately 2,700 years.</p>

<h4>Ptah: The Divine Craftsman</h4>
<p>Ptah is depicted as a mummiform figure holding a combined was scepter (power), djed pillar (stability), and ankh (life) — the three principles of creation. He is the patron of craftsmen, architects, and artists, and his name may be the root of the word "Egypt" (Ḥwt-kA-Ptḥ → Aigyptos → Egypt).</p>

<twocol left="Creation Through the Heart (Ib)" right="Creation Through the Tongue (Ns)">Ptah first conceived all things in his mind — the heart (ib) being understood as the seat of thought and intention in Kemetic anatomy. Every being, every principle, every aspect of creation was first a thought in the mind of Ptah. The universe begins as an idea. This is a radical philosophical position: consciousness precedes matter.||Ptah then spoke, and what he had conceived became real. The tongue is the instrument that bridges thought and existence — when Ptah named something, it came into being. The creative power of language is not metaphorical here; it is literal. Words are generative. This idea shaped Kemetic ritual, medicine, and law for 3,000 years.</twocol>

<callout type="gold">The Shabaka Stone records: "The Ennead of Ptah is the teeth and lips... which pronounced the name of everything." Ptah's theology subsumes and transcends the Heliopolitan Ennead — rather than replacing it, it explains how Atum himself came to exist: through the creative thought and speech of a deeper principle. This is philosophical sophistication of the highest order.</callout>
`
            }
          ]
        },

        /* ── MODULE 2: MAʻAT ── */
        {
          id:    'kemet-maat',
          title: 'Maʻat — Cosmic Order & Ethics',
          emoji: '⚖️',
          desc:  'The central ethical and cosmological principle of Kemetic civilization.',
          lessons: [
            {
              id:       'ke-maat',
              num:      'KE·04',
              title:    'Maʻat — Truth, Justice, and Cosmic Balance',
              readTime: '10 min',
              content: `
<p class="lead"><strong>Maʻat</strong> is perhaps the most central concept in all of Kemetic thought — a principle so fundamental that it organized everything from the movement of stars to the ethics of daily human conduct. Usually translated as "truth" or "justice," those words are too small. Maʻat is cosmic order itself — the principle that things are as they should be, that truth is spoken, that justice is upheld, that the balance between all forces is maintained. Its opposite, <strong>Isfet</strong> — chaos, untruth, injustice — was not merely wrong. It was cosmically dangerous.</p>

<h4>Maʻat as a Goddess</h4>
<p>Maʻat was personified as a woman wearing a single ostrich feather in her headdress. The feather was her symbol and her instrument — the <strong>Feather of Maʻat</strong>, used in the most important judgment in the Kemetic afterlife tradition: the Weighing of the Heart.</p>

<h4>The Hall of Two Truths: The Weighing of the Heart</h4>
<ul>
<li><strong>Anubis</strong> (jackal-headed) oversaw the weighing and guided the soul to judgment.</li>
<li><strong>Thoth</strong> (ibis-headed, god of wisdom and writing) recorded the outcome on his scroll.</li>
<li>Heart lighter than or equal to the feather → welcomed into the Field of Reeds (Aaru), eternal paradise.</li>
<li>Heart heavier than the feather → consumed by <strong>Ammit</strong>. The soul ceased to exist entirely.</li>
</ul>

<h4>Selected Declarations of Innocence</h4>
<concepts>"I have not committed sin" · "I have not murdered" · "I have not told lies" · "I have not caused pain" · "I have not damaged the fields" · "I have not polluted the water" · "I have not spoken against the poor" · "I have not caused weeping" · "I have lived with truth"</concepts>

<callout>Notice the scope: these declarations cover interpersonal ethics, environmental ethics, economic justice, and cosmic alignment in a single integrated framework. Harming another person and polluting a river were equally violations of Maʻat — because both disrupted the divine order. This is the most integrated ethical system in ancient history.</callout>
`
            },
            {
              id:       'ke-maat-politics',
              num:      'KE·05',
              title:    'Maʻat as Political Philosophy — The Ruler Serves the Principle',
              readTime: '7 min',
              content: `
<p class="lead">In Kemetic governance, the Pharaoh's primary duty — above all military, administrative, or religious functions — was to <strong>uphold Maʻat</strong>. A pharaoh who ruled unjustly did not merely fail their people — they threatened the continued functioning of the universe. Maʻat was not subject to royal decree. The pharaoh served Maʻat, not the other way around.</p>

<h4>The Maxims of Ptahhotep (~2400 BCE)</h4>
<p>The Maxims of Ptahhotep — composed by a vizier under Pharaoh Djedkare Isesi during the Old Kingdom — is one of the oldest works of moral philosophy in human history. Selected maxims:</p>
<ul>
<li>"If you are great, humble yourself before those lesser than you."</li>
<li>"Do not be proud because of your knowledge. Consult the ignorant man as well as the wise."</li>
<li>"How hard and painful are the last hours of an aged man! He grows weaker every day; his eyes become dim, his ears deaf; his strength fades; his heart knows peace no longer."</li>
</ul>

<callout type="gold">The Maxims of Ptahhotep contain passages on leadership, humility, family life, and the treatment of others that are indistinguishable in sophistication and compassion from the best moral philosophy of any era. They were written approximately 4,400 years ago. The idea that sophisticated ethical thinking is a recent or Western achievement is a colonial fiction. Kemet was thinking about justice, humility, and the good life millennia before Athens.</callout>
`
            }
          ]
        },

        /* ── MODULE 3: SACRED ARTS ── */
        {
          id:    'kemet-arts',
          title: 'Sacred Arts, Science & Architecture',
          emoji: '𓂀',
          desc:  'Hieroglyphics, sacred geometry, medicine, and the built environment.',
          lessons: [
            {
              id:       'ke-medunetjer',
              num:      'KE·06',
              title:    'Medu Netjer — Words of the Gods',
              readTime: '9 min',
              content: `
<p class="lead">The ancient Egyptians called their writing system <strong>medu netjer</strong> — "words of the gods." One of the oldest writing systems on Earth (~3200 BCE), Egyptian hieroglyphics are not merely a practical tool for record-keeping — they are a sacred technology in which every sign carries spiritual weight, every text is an act of power, and writing itself is understood as creation.</p>

<facts>~3200 BCE::Earliest Hieroglyphic Writing|700+::Standard Hieroglyphic Signs|1822::Decipherment by Champollion|Rosetta Stone::196 BCE (key to decipherment)</facts>

<h4>Three Types of Signs</h4>
<ul>
<li><strong>Logograms (Ideograms):</strong> Signs that represent the thing they depict. A drawing of a sun (𓇳) means "sun."</li>
<li><strong>Phonetic Signs:</strong> Signs representing sounds, not meanings. Ancient Egyptian was written without vowels — only consonants were recorded, because vowels were considered the breath of the reader and could not be imprisoned in stone.</li>
<li><strong>Determinatives:</strong> Silent signs placed at the end of a word to indicate its category — "this word is about walking," "this word is about divinity." They function like emoji used for disambiguation.</li>
</ul>

<callout>When Egypt was conquered and eventually lost control of its own narrative, hieroglyphics were forgotten. The last known hieroglyphic inscription was written in 394 CE. For 1,400 years, no one could read them. The Rosetta Stone — inscribed in 196 BCE in three scripts — was the key that unlocked 3,000 years of recorded human thought. Champollion's decipherment in 1822 was one of the greatest intellectual achievements of the 19th century. Kemet began speaking again.</callout>
`
            },
            {
              id:       'ke-medicine',
              num:      'KE·07',
              title:    'Kemetic Medicine — Imhotep, the Papyri, and the Science of Healing',
              readTime: '14 min',
              content: `
<p class="lead">Ancient Kemet produced some of the earliest and most sophisticated medical texts in human history — predating the Greek medical tradition by thousands of years. Kemetic physicians understood anatomy, performed surgical procedures, compounded medicines from plants and minerals, and operated within a framework that saw physical health, spiritual balance, and cosmic alignment as inseparable. The most famous physician of all antiquity was not Greek. He was Kemetic.</p>

<facts>~3,500 BCE::Earliest medical records|700+::Formulas in the Ebers Papyrus|48::Surgical cases in Edwin Smith Papyrus|Imhotep::First named physician in history</facts>

<h4>Imhotep — Architect, Physician, and Deified Healer</h4>
<p><strong>Imhotep</strong> (c. 2650–2600 BCE) is among the most extraordinary figures in recorded history. He served under Pharaoh Djoser of the Third Dynasty and is credited as the architect of the <strong>Step Pyramid of Saqqara</strong> — the world's first large stone structure. But his legacy as a healer may be even more significant.</p>
<p>Imhotep was the <strong>first physician in recorded history whose name we know</strong>. He was so revered for his healing knowledge that, centuries after his death, he was deified — elevated to the status of a god of medicine and wisdom. His temple at Memphis became a center of healing — people traveled from across the ancient world to seek cures there, sleeping in sacred spaces and receiving guidance in dreams (a practice called <em>incubation</em>). The Greeks identified him with their own healing deity Asclepius.</p>

<h4>The Medical Papyri — Written Medicine</h4>

<div class="cv-card-grid">
  <div class="cv-info-card cv-info-card--gold">
    <div class="cv-info-card__title">The Ebers Papyrus</div>
    <div class="cv-info-card__subtitle">c. 1550 BCE — 108 pages, 700+ formulas</div>
    <p>The longest surviving medical papyrus — essentially an encyclopedia of Kemetic medicine. It covers treatments for heart conditions, skin diseases, digestive disorders, eye and dental problems, women's health, and mental illness. Plants used include aloe vera, castor oil, garlic, juniper, myrrh, willow bark (which contains salicin — the active ingredient in aspirin), pomegranate, and coriander. Treatments combine herbal preparations, mineral compounds, and prayers.</p>
  </div>
  <div class="cv-info-card cv-info-card--gold">
    <div class="cv-info-card__title">The Edwin Smith Papyrus</div>
    <div class="cv-info-card__subtitle">c. 1600 BCE — 48 surgical cases</div>
    <p>The world's earliest known surgical text. It describes 48 cases of trauma and surgical conditions, organized anatomically from head to toe. Each case includes an examination, diagnosis, prognosis (rated as "treatable," "contestable," or "not to be treated"), and treatment. The clinical precision is remarkable: the papyrus describes the heart and pulse, the meninges of the brain, sutures, and the use of fresh meat to control bleeding — and notes that brain injuries cause dysfunction on the opposite side of the body.</p>
  </div>
</div>

<h4>The 42 Negative Confessions — Maʻat as Medical Ethics</h4>
<p>The <strong>42 Negative Confessions</strong> from the <em>Book of Coming Forth by Day</em> reveal the ethical framework within which Kemetic medicine — and all of Kemetic life — operated. In the Hall of Two Truths, the soul recited 42 declarations of innocence before 42 divine assessors. They include:</p>
<ul>
<li>"I have not done violence to any person."</li>
<li>"I have not caused pain."</li>
<li>"I have not caused anyone to weep."</li>
<li>"I have not polluted the water."</li>
<li>"I have not killed."</li>
<li>"I have not caused the destruction of food."</li>
</ul>
<p>Read carefully, the 42 Declarations are a comprehensive ethical code covering harm to persons, animals, the environment, community resources, and social relationships. The fact that ecological responsibility sits alongside prohibitions against violence and theft reveals Kemetic ethics as inherently relational — health, justice, ecology, and cosmic order are all expressions of the same principle: Maʻat.</p>

<h4>Spirit and Science — An Integrated System</h4>
<p>A common Western misreading of Kemetic medicine is to see it as split between "rational" (Edwin Smith type) and "magical" (Ebers type) treatments — as if these represented competing schools of thought. This is a projection of modern Western categories onto an entirely different worldview. For Kemetic physicians, prayer, herbs, surgery, and cosmic alignment were not competing approaches. They were different instruments in a single orchestra. The physical and spiritual dimensions of illness were not separate — they were expressions of a single disruption of Maʻat.</p>

<callout type="gold">When Hippocrates — the "father of Western medicine" — visited Kemet, he was entering a medical tradition already thousands of years old. Greek medicine did not invent rational, empirical healing. It inherited and repackaged a tradition with deep African roots. Knowing this changes everything about how we understand the history of medicine.</callout>
`
            }
          ]
        }

      ] // end kemet modules
    },   

    /* ══════════════════════════════════════════════════════════
       THE BRIDGE
    ══════════════════════════════════════════════════════════ */
    {
      id:      'bridge',
      name:    'The Bridge',
      emoji:   '🌐',
      tagline: 'Cross-Cultural Connections — Shared Cosmologies',
      theme:   'bridge',
      status:  'live',
      intro:   'Two civilizations on opposite ends of the Earth, separated by tens of thousands of miles and thousands of years. When you place their creation traditions and ethical frameworks side by side, the parallels are not superficial — they are structural. The same deep architecture of understanding, expressed through different languages and landscapes, pointing to the same cosmic realities.',

      modules: [
        {
          id:    'bridge-cosmology',
          title: 'Shared Cosmologies',
          emoji: '✦',
          desc:  'The deep connections between Kānaka Maoli and Kemetic wisdom traditions.',
          lessons: [
            {
              id:       'br-darkness',
              num:      'BR·01',
              title:    'Kumulipo & Nun — Creation from Primordial Darkness',
              readTime: '10 min',
              content: `
<p class="lead">Both the Hawaiian Kumulipo and Kemetic cosmology begin in the same place: deep, dark, primordial waters. Not empty nothingness. Not a void. A fertile darkness full of potential. The Hawaiian word <strong>Lipo</strong> and the Kemetic concept <strong>Nun</strong> point to the same cosmic intuition: before light, before form, before distinction, there was a deep dark source from which everything emerged.</p>

<twocol left="Kumulipo — The Deep Darkness" right="Nun — The Primordial Waters">The Kumulipo begins: "O ke au i kahuli wela ka honua" — at the time when the earth became hot. Creation begins in Pō, the sacred darkness. The first beings are marine: coral polyps, sea creatures, the life of the ocean depths. The source is dark, wet, fertile, and generative.||Nun is the infinite dark primordial ocean that existed before creation. From Nun rose the first mound, the benben, and upon it the first god, Atum. Nun is not chaos as disorder — it is unformed potential, the cosmic womb from which order emerges.</twocol>

<h4>The Shared Pattern</h4>
<p>The pattern is striking: creation begins not with a command from above, but from below — from depth, darkness, water, and heat. Both traditions reject the idea that darkness is evil or empty. Darkness is the womb. Darkness is where life begins. The light emerges from the dark; it does not conquer it.</p>

<callout type="bridge">Modern cosmology tells us the universe began in conditions of extreme heat and density, before light could travel freely — a dark, hot, undifferentiated state. The Kumulipo's "earth became hot" and Nun's primordial waters are not scientific statements in the modern sense, but they preserve a profound intuition: reality emerges from a dark, dense, generative beginning. Ancient cosmology and modern cosmology are asking the same question with different instruments.</callout>
`
            },
            {
              id:       'br-aloha-maat',
              num:      'BR·02',
              title:    'Aloha & Maʻat — The Ethics of Right Relationship',
              readTime: '12 min',
              content: `
<p class="lead"><strong>Aloha</strong> and <strong>Maʻat</strong> are not identical words — they arise from different languages, lands, and traditions — but they occupy structurally similar positions in their respective civilizations. Both are ethical, spiritual, ecological, and cosmic principles. Both govern right relationship. Both insist that the health of the individual, the community, the land, and the cosmos are inseparable.</p>

<h4>Aloha — Presence, Breath, Love, Responsibility</h4>
<p>Aloha is commonly translated as "love" or "hello/goodbye," but this is a severe reduction. <strong>Alo</strong> means presence, face, front; <strong>hā</strong> means breath, the breath of life. Aloha is the act of meeting another being in the fullness of shared breath and presence. It is love, yes — but also compassion, mercy, kindness, patience, respect, and the recognition of interdependence.</p>

<h4>Maʻat — Truth, Balance, Justice, Cosmic Order</h4>
<p>Maʻat is usually translated as truth or justice, but it too is much larger. Maʻat is the principle that keeps the universe in balance: stars in their courses, the Nile flooding on time, the pharaoh ruling justly, people speaking truth, the poor protected, the water unpolluted. To live Maʻat is to align your actions with the order that sustains life.</p>

<div class="cv-bridge-quote">
  <div class="cv-bridge-quote__hawaii">
    "Aloha is the intelligence with which we meet life."
    <span class="cv-bridge-quote__attr">— Attributed to Aunty Pilahi Paki</span>
  </div>
  <div class="cv-bridge-quote__divider">✦</div>
  <div class="cv-bridge-quote__kemet">
    "Speak Maʻat. Do Maʻat. For she is mighty, she is great, she endures."
    <span class="cv-bridge-quote__attr">— Kemetic inscription, Tomb of Rekhmire, c. 1425 BCE</span>
  </div>
</div>

<callout type="bridge"><strong>The Pattern:</strong> Both cultures understood that personal integrity, ecological responsibility, and cosmic alignment are not separate concerns — they are one. If you damage the land, you damage the cosmic order. If you lie, you damage the cosmic order. Aloha and Maʻat are the same principle wearing different names — and both traditions made that principle the ethical foundation of an entire civilization. This is not a coincidence. It is what civilizations look like when they are built from wisdom rather than conquest.</callout>
`
            },
            {
              id:       'br-cosmology-evolution',
              num:      'BR·03',
              title:    'Kumulipo & Evolution — Cosmology Across Scales',
              readTime: '14 min',
              content: `
<p class=\"lead\">The Kumulipo's unfolding of life from coral to sea creatures to land animals to humans is not a metaphor for evolution — it is something more profound. It is a cosmology that sees creation as a continuous process of increasing complexity, differentiation, and consciousness, mirrored in both the ancient Hawaiian genealogy and modern scientific understanding of how the universe and life evolve.</p>

<h4>Four Lenses on Creation</h4>

<div class=\"cv-card-grid\">
  <div class=\"cv-info-card cv-info-card--gold\">
    <div class=\"cv-info-card__title\">Lens 1: Genealogy</div>
    <p>The Kumulipo is literally a genealogy — a pedigree. It connects living Hawaiian chiefs to the first coral, making them the living continuation of 16 epochs of creative unfolding. This is not metaphor; it is kinship. You are descended from the ocean itself.</p>
  </div>
  <div class=\"cv-info-card cv-info-card--gold\">
    <div class=\"cv-info-card__title\">Lens 2: Biological Evolution</div>
    <p>The progression coral → sea life → plants → land animals → humans mirrors the sequence of complexity in evolutionary history. Simple marine organisms appeared first; complex land animals much later; humans most recently. The Kumulipo encoded this truth before Darwin, through oral tradition and observation.</p>
  </div>
  <div class=\"cv-info-card cv-info-card--gold\">
    <div class=\"cv-info-card__title\">Lens 3: Cosmic Evolution</div>
    <p>The Big Bang → radiation era → matter formation → star/galaxy formation → planetary systems → life. Each stage a leap in complexity and structure. The universe unfolds from simple undifferentiated energy into increasingly intricate patterns of order.</p>
  </div>
  <div class=\"cv-info-card cv-info-card--gold\">
    <div class=\"cv-info-card__title\">Lens 4: Quantum to Classical</div>
    <p>From quantum fields (undifferentiated potential) to particles to atoms to molecules to life. At each scale, new rules of organization emerge. Complexity is not imposed from above — it emerges from the interaction of simpler components following basic rules.</p>
  </div>
</div>

<h4>The Pattern of Emergence</h4>
<p>What connects these four lenses is not equivalence — they are not saying the same thing. Rather, they are describing the same architectural pattern at different scales: <strong>creation unfolds from simplicity to complexity, from potential to form, from darkness to light, through a sequence of stages, each building on what came before, each generating new properties that cannot be predicted from the previous stage alone.</strong></p>

<callout>Emergence is the key concept. When you combine hydrogen atoms, they don't just make \"more hydrogen.\" They make water, which has entirely new properties — wetness, fluidity, the ability to dissolve salt. The properties of water cannot be predicted from hydrogen alone. Each level of organization brings genuinely new phenomena. This is true at every scale: atoms and molecules, molecules and cells, cells and organisms, organisms and ecosystems, celestial bodies and galaxies.</callout>

<h4>Where These Are NOT Equivalent</h4>
<p>It is crucial to be clear: The Kumulipo is not a \"proto-scientific\" account that we can now correct with modern science. The Kumulipo is a genealogical and spiritual text — it is saying something different than evolutionary biology, even when the two describe similar sequences. Key distinctions:</p>

<ul>
<li><strong>Genealogy vs. Population:</strong> The Kumulipo traces a lineage — your direct descent from coral. Evolution describes population-level changes over time through mechanism of inheritance and selection. They are not the same framework.</li>
<li><strong>Agency:</strong> The Kumulipo speaks of paired beings, of choice, of personhood within creation. Modern evolution describes mechanism without intentionality. Both describe complexity; they do so through different narrative structures.</li>
<li><strong>Timescale:</strong> The Kumulipo structures time as wā (epochs) — qualitative ages that are distinguished by the types of beings present. Modern evolutionary biology uses quantitative timescale — millions of years. The structure of time itself is different.</li>
<li><strong>Purpose:</strong> The Kumulipo connects living humans to cosmic origin — it is genealogical, relational, sacred. Evolution (in its scientific form) describes mechanism without inherent purpose. These answer different questions.</li>
</ul>

<callout type=\"bridge\"><strong>The point is not equivalence, but resonance.</strong> When a Hawaiian elder and a modern cosmologist stand together and ask \"How did the universe come to contain life, consciousness, complexity?\" they are asking the same fundamental question. They have observed the same pattern — that the universe unfolds from simple to complex, from potential to form. They have structured their knowledge differently, for different purposes, using different tools. But the underlying pattern is recognizable in both. This is what the bridge does: it reveals structural resonance without collapsing distinct knowledge systems into false equivalence.</callout>\n`
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       DOGON — West African Cosmology
    ══════════════════════════════════════════════════════════ */
    {
      id:      'dogon',
      name:    'Dogon',
      emoji:   '🪘',
      tagline: 'West African Knowledge — Mali',
      theme:   'amber',
      status:  'live',
      intro:   'The Dogon people of Mali (West Africa) developed one of the most remarkable astronomical traditions in human history. For generations, Dogon knowledge keepers preserved a sophisticated understanding of the cosmos, encoded in ritual, myth, and sacred geometry. These lessons explore the Dogon vision of the Sirius system, the architecture of the universe, and the relationship between celestial order and human community.',
      modules: [
        {
          id:    'dogon-cosmology',
          title: 'Cosmology & the Sirius System',
          emoji: '⭐',
          desc:  'The Dogon understanding of the stars, particularly the Sirius system, and the cosmic architecture of the universe.',
          lessons: [
            {
              id:       'dg-sirius-triplet',
              num:      'DG·01',
              title:    'The Sirius Triplet — The Hidden Companion Star',
              readTime: '11 min',
              content: `\n<p class=\"lead\">The Dogon peoples of Mali maintained detailed astronomical knowledge passed down through oral tradition for centuries. Central to their cosmology is <strong>Sirius</strong> — the brightest visible star in Earth's night sky — and the knowledge that it is not alone. The Dogon spoke of a companion star, <em>Po Tolo</em>, invisible to the naked eye, orbiting Sirius with an orbital period of about 50 years.</p>\n\n<callout>In 1844, German astronomer Friedrich Wilhelm Bessel theorized that Sirius must have an unseen companion based on observed irregularities in Sirius's motion. In 1862, American telescope-maker Alvan Clark observed <strong>Sirius B</strong> — a white dwarf companion star — directly. The Dogon had been describing this reality, with remarkable accuracy, for generations before modern astronomy confirmed it.</callout>\n\n<h4>Po Tolo & Cosmic Order</h4>\n<p>Within Dogon cosmology, Po Tolo (Sirius B) is not merely an astronomical fact — it is a principle of cosmic order. The Dogon understood that the universe is not simple or transparent. Like the stars themselves, reality contains hidden layers, invisible dimensions, presences felt through their effects even when not directly visible. This mirrors modern physics: dark matter and dark energy comprise 95% of the universe, yet we perceive only 5% directly.</p>\n\n<h4>The Nommo — Waters of Creation</h4>\n<p>The Dogon cosmology centers on the <strong>Nommo</strong> — primordial waters and the principles of life, moisture, and generative power. The universe is understood as a vast system of organized waters. Stars are seeds cast into the cosmic waters. Life emerges from moisture. This parallels the Hebrew <em>mayim</em> (waters), the Egyptian <em>Nun</em>, and the Hawaiian <em>moana</em> — across cultures separated by vast distances, the same cosmological intuition: waters are the generative principle of the universe.</p>\n`
            },
            {
              id:       'dg-ammas-world',
              num:      'DG·02',
              title:    'Amma & the Creation of the World — The Cosmic Egg',
              readTime: '10 min',
              content: `\n<p class=\"lead\">Central to Dogon cosmology is <strong>Amma</strong> — the creator principle, the cosmic consciousness, the source of all being. In the beginning, Amma existed alone in an infinite void. From Amma emerged all creation, not through external command, but through internal unfoldment — like a cosmic egg that gestates, differentiates, and births worlds.</p>\n\n<h4>The Four Placenta — Sacred Geometry</h4>\n<p>The Dogon spoke of creation in terms of sacred geometry — the spiral, the circle, the cross. These are not arbitrary symbols. They encode actual principles of how the cosmos organizes: from the spiral of galaxies to the circular orbits of planets to the four-fold organization of space and time. The Dogon understanding that reality is fundamentally mathematical and geometric — expressed long before modern physics revealed that all of nature operates according to mathematical principles.</p>\n\n<callout type=\"bridge\">Modern physics describes the universe as emerging from quantum fields — mathematical potentials that become actual through interaction and observation. The Dogon intuition that creation unfolds from a cosmic principle (Amma) through sacred geometric patterns parallels modern theoretical physics in striking ways: reality at its foundation is mathematical and organizational, not material and simple.</callout>\n`
            },
            {
              id:       'dg-syncretism',
              num:      'DG·03',
              title:    'Knowledge Keepers & Transmission — Dogon Wisdom in the World',
              readTime: '9 min',
              content: `\n<p class=\"lead\">The Dogon maintained their astronomical knowledge through oral transmission, ritual, and sacred societies. Initiated knowledge keepers passed understanding to initiates through symbolic instruction and direct observation. This method preserved knowledge across generations without written text — a sophistication that modern scholarship is only beginning to appreciate.</p>\n\n<h4>The Challenge of Transmission</h4>\n<p>When Western scholars first encountered Dogon astronomical knowledge in the 1940s, they faced a crisis of credibility: How could non-literate peoples have such precise astronomical knowledge? This question reveals the bias embedded in Western assumptions — that knowledge requires written language, that oral transmission is less reliable, that \"primitive\" peoples could not possess sophisticated science.</p>\n<p>In fact, oral transmission creates precision through a different mechanism: ritual repetition, mnemonic poetry, direct observation, and corrective feedback from the community of knowledge keepers. This is not less reliable than writing — it is reliably different, optimized for different purposes.</p>\n\n<callout>The Dogon case teaches us to question our assumptions about what kinds of peoples can develop sophisticated knowledge, what forms that knowledge takes, and how it is preserved and transmitted. The universe does not require a university to reveal its patterns. A careful observer, a good memory, a community committed to precision, and centuries of unbroken transmission can preserve and refine knowledge as well as any written tradition.</callout>\n`
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       VEDIC — Ancient Indian Wisdom Traditions
    ══════════════════════════════════════════════════════════ */
    {
      id:      'vedic',
      name:    'Vedic',
      emoji:   '🕉️',
      tagline: 'Ancient Indian Wisdom Traditions',
      theme:   'saffron',
      status:  'live',
      intro:   'The Vedas are among humanity\'s oldest literary texts, composed in Sanskrit between 1500–500 BCE. They preserve the astronomical, philosophical, and cosmological knowledge of ancient Indian civilization. These lessons explore Vedic cosmology, the structure of time and space according to Hindu philosophy, and the sophisticated mathematics and astronomy encoded within ancient Indian traditions.',
      modules: [
        {
          id:    'vedic-cosmology',
          title: 'Cosmology & the Rigveda',
          emoji: '✨',
          desc:  'Vedic understanding of creation, the cosmos, and the sacred principles that structure reality.',
          lessons: [
            {
              id:       'vd-nasadiya',
              num:      'VD·01',
              title:    'The Nasadiya Sukta — \"Not Then Was\"',
              readTime: '12 min',
              content: `\n<p class=\"lead\">The Nasadiya Sukta (Rigveda 10.129) is one of the most philosophically sophisticated creation hymns in any human tradition. Its name comes from its opening: <strong>\"Na asit\"</strong> — \"Not then was.\" What does it mean to begin a creation story by describing what did NOT exist? This single choice reveals a radically different approach to cosmology.</p>\n\n<h4>Not Being & Pure Potential</h4>\n<p>The Nasadiya begins: <em>\"Not then was nor not-was; there was no sky nor the heavens beyond. What stirred? Where? And in whose protection? What was the water, the deep and mighty water?\"</em></p>\n<p>The Nasadiya does not posit a creator god who shapes pre-existing material. It begins in a state that is neither being nor non-being — what Hindu philosophy calls <strong>Brahman</strong>, the ultimate undifferentiated reality. From this state of pure potential, without external agent or command, the universe emerges through an inherent principle of manifestation.</p>\n\n<callout>Modern quantum cosmology describes something strikingly similar: the universe may have emerged not from \"nothing\" (which itself requires definition) but from a state of quantum potential — described mathematically but not physically manifest. The Nasadiya\'s \"not-being and being\" resonates with quantum superposition: a state that is neither definitively this nor that, until the act of emergence/observation collapses potential into actual.</callout>\n\n<h4>Emergence Without External Creator</h4>\n<p>The Nasadiya concludes: <em>\"Whence this creation hath arisen, perhaps it formed itself, or perhaps it did not. The one who looks down on it in the highest heaven, only he knows, or perhaps even he does not know.\"</em></p>\n<p>This is radical philosophical honesty: the text acknowledges uncertainty at the very heart of the cosmological question. It does not claim final knowledge. It describes a process of emergence that is fundamentally self-organizing and mysterious — not reducible to simple causation by external will.</p>\n`
            },
            {
              id:       'vd-brahma-cycles',
              num:      'VD·02',
              title:    'Brahma Cycles — Time at Cosmic Scale',
              readTime: '11 min',
              content: `\n<p class=\"lead\">Hindu cosmology structures time in cycles within cycles — a nested hierarchy of temporal organization. The smallest unit is the <strong>paramanu</strong> (smallest particle), and time scales up through increasingly vast cycles called <strong>yugas</strong> (ages) and <strong>kalpas</strong> (cosmic days).</p>\n\n<h4>The Four Yugas — Cosmic Ages</h4>\n<p>A full cosmic cycle consists of four yugas:</p>\n<ul>\n<li><strong>Satya Yuga</strong> — The Age of Truth. Dharma (cosmic order) is perfect. Humans live in harmony. Duration: 1,728,000 years.</li>\n<li><strong>Treta Yuga</strong> — The Age of Ritual. Dharma begins to decline. Humans must work. Duration: 1,296,000 years.</li>\n<li><strong>Dvapara Yuga</strong> — The Age of Doubt. Dharma erodes further. Conflict increases. Duration: 864,000 years.</li>\n<li><strong>Kali Yuga</strong> — The Age of Darkness/Conflict. Dharma nearly disappears. Humanity struggles. Duration: 432,000 years.</li>\n</ul>\n<p>One complete cycle of four yugas = 4,320,000 years = one <strong>Mahayuga</strong> (great age). One thousand Mahayugas = one Kalpa (cosmic day). One Brahman lifetime = 311 trillion years, then the universe collapses into chaos, and the cycle begins anew.</p>\n\n<callout type=\"bridge\">Modern cosmology describes the universe as approximately 13.8 billion years old, with a finite lifespan measured in trillions of years before heat death. The Hindu model posits a similar vastness and cyclical renewal. While the exact numbers differ, the structural intuition is the same: the universe is old beyond human comprehension, operates in grand cycles, and will eventually return to primal state before beginning again.</callout>\n\n<h4>Dharma — The Principle of Order</h4>\n<p>Crucial to this cosmology is the concept of <strong>Dharma</strong> — cosmic order, ethics, righteousness, the natural law that maintains the universe\'s function. As the universe ages through the yugas, Dharma naturally declines. This is not moralistic judgment — it is structural inevitability, like entropy. The cycle must complete itself; a new cycle must begin.</p>\n`
            },
            {
              id:       'vd-vedic-astronomy',
              num:      'VD·03',
              title:    'Vedic Mathematics & Astronomy — Numbers of the Gods',
              readTime: '10 min',
              content: `\n<p class=\"lead\">Ancient Indian civilization developed mathematics and astronomy of stunning sophistication. The Vedas contain astronomical data — observations of planetary motion, predictions of eclipses, descriptions of the structure of the cosmos in terms of mathematical relationships.</p>\n\n<h4>Decimal Mathematics & the Zero</h4>\n<p>Indian mathematicians developed the decimal system and the concept of <strong>zero</strong> as a number, not merely a placeholder. This innovation — which seems obvious now — was revolutionary. It enabled calculation at scales that were practically impossible with Roman or Greek numerals. The very concept of zero required philosophical sophistication: the recognition that non-being (zero) could be a mathematical entity with computational reality.</p>\n\n<callout>The term \"zero\" comes from the Sanskrit <em>sunya</em>, meaning \"empty\" or \"void.\" This carries philosophical weight: zero is not nothing in the sense of annihilation. It is the fertile emptiness — like the Brahman of the Nasadiya Sukta. From zero (potential), calculations unfold, structures emerge. The mathematics of the Vedas and the metaphysics of the Nasadiya teach the same lesson: potential is real, void is generative.</callout>\n\n<h4>Astronomical Precision</h4>\n<p>Vedic texts contain descriptions of planetary positions and motions with precision that matches modern observation. The Aryabhata, composed around 500 CE, describes the cosmos as heliocentric — the Sun at the center, planets orbiting. This description predates Copernicus by 1,000 years. Whether this was theoretical model or observational discovery remains debated — but the sophistication of Vedic astronomy is beyond question.</p>\n`
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       DREAMTIME — Aboriginal Australian Traditions
    ══════════════════════════════════════════════════════════ */
    {
      id:      'dreamtime',
      name:    'Dreamtime',
      emoji:   '🌏',
      tagline: 'Aboriginal Australian Wisdom Traditions',
      theme:   'rust',
      status:  'live',
      intro:   'The Aboriginal peoples of Australia developed one of the world\'s longest continuous cultures — at least 65,000 years of unbroken transmission. Central to this culture are the Songlines: spiritual narratives that encode astronomy, geography, kinship, and ecological knowledge in stories that are simultaneously maps, histories, and songs. These lessons explore the Songlines, celestial navigation, totem systems, and the Aboriginal understanding of Country as a living, conscious entity.',
      modules: [
        {
          id:    'dreamtime-songlines',
          title: 'Songlines & Country',
          emoji: '🎵',
          desc:  'The sacred narratives that encode place, kinship, and cosmic knowledge across the Australian continent.',
          lessons: [
            {
              id:       'dt-songlines-intro',
              num:      'DT·01',
              title:    'The Songlines — Stories That Are Maps',
              readTime: '13 min',
              content: `\n<p class=\"lead\">Across the Australian continent, thousands of stories form a vast interconnected network called the <strong>Songlines</strong> or <strong>Dreaming Tracks</strong>. A Songline is not merely a story or a poem or a map. It is all of these simultaneously — a narrative that simultaneously describes the journey of ancestral beings, encodes the geography of the continent, preserves kinship relationships, teaches practical ecological knowledge, and connects the living present to the sacred time of the Dreaming.</p>\n\n<h4>The Dreaming — Eternal Creative Time</h4>\n<p>The Dreaming (or Dreamtime) is not a time in the past — it is not historical. Rather, it is a permanent dimension of reality, accessible through song, story, ceremony, and connection to Country. During the Dreaming, ancestral beings — Dreamings — traveled across the landscape, shaping the features we see today: mountains, rivers, rock formations. Their actions created relationships between places, between peoples, between humans and the land itself.</p>\n<p>The Songlines trace these ancestral journeys. To sing the Songline is to travel the path, to recall the story, to reconnect with the sacred power of the place, and to maintain the relationship between the human community and Country.</p>\n\n<callout>A single Songline might stretch thousands of kilometers across the continent, passing through the territories of dozens of different Aboriginal nations, each of whom maintain their own portion of the story, their own verses, their own relationship to the places the Songline traverses. The entire continent is covered by intersecting, overlapping Songlines, forming a vast poetic geography encoded in the bodies and voices of the people who live there.</callout>\n\n<h4>Knowledge Encoded in Story</h4>\n<p>Within the Songlines are encoded practical, actionable knowledge: the locations of water sources in the desert; which plants are edible and when to harvest them; animal migration patterns; seasonal indicators; the locations of sacred sites; the kinship relationships between groups; protocols for sharing land and resources. This knowledge is preserved not in written form, but in narrative structure — in the characters, their actions, the geographic features they created, the songs that describe them.</p>\n<p>To know the Songline is to possess a map, a history, a spiritual practice, and a set of ecological knowledge simultaneously. The distinction between \"story\" and \"information,\" between \"sacred\" and \"practical,\" between \"past\" and \"present,\" does not apply. These categories are creations of literate, separated from the land cultures. For Aboriginal peoples, knowledge and story, place and meaning, past and present are unified.</p>\n`
            },
            {
              id:       'dt-celestial-navigation',
              num:      'DT·02',
              title:    'Stars & Navigation — The Celestial Songlines',
              readTime: '11 min',
              content: `\n<p class=\"lead\">The Aboriginal peoples of Australia were sophisticated navigators who used the stars to orient themselves across vast distances of desert and ocean. The stars themselves form Songlines — narratives written in the night sky that tell stories and encode navigational information.</p>\n\n<h4>The Pleiades — Seven Sisters</h4>\n<p>One of the most widespread Songlines across Aboriginal Australia involves the Pleiades — known as the Seven Sisters (or Pleiadies, or Makara). The story of the Seven Sisters appears in hundreds of variations across different Aboriginal nations, but the core narrative is consistent: celestial beings, often represented as young women, whose movements and positions encode seasonal knowledge and navigation information.</p>\n\n<h4>Orion & the Southern Cross</h4>\n<p>Major constellations visible from Australia — including Orion and the Southern Cross — are incorporated into Songlines and navigation knowledge. The Southern Cross (Crux) particularly served as a reliable orientation marker: it circles Polaris Australis, nearly directly above the southern celestial pole. For navigators traveling across deserts or open ocean, knowing the position of the Southern Cross provided constant orientation.</p>\n\n<callout type=\"bridge\">Modern GPS satellites provide the same function today — orienting travelers across vast distances by reference to fixed celestial points. Aboriginal navigators achieved similar precision through direct observation and encoded knowledge rather than technological instrument. The principle is identical: know the positions of reliable celestial markers, use them to orient yourself across terrain where ground-based landmarks are unavailable or unreliable.</callout>\n\n<h4>Seasonal Astronomy</h4>\n<p>Aboriginal astronomers tracked not just locations of stars, but their rising and setting positions throughout the year — which shift as Earth\'s axis tilts through its yearly cycle. This created a celestial calendar: the rising of particular stars signaled particular seasons — times to prepare for migration of animals, times to harvest certain plants, times for ceremony. The night sky was a living calendar, constantly teaching those who knew how to read it.</p>\n`
            },
            {
              id:       'dt-country-consciousness',
              num:      'DT·03',
              title:    'Country as Living — Kinship & Custodianship',
              readTime: '10 min',
              content: `\n<p class=\"lead\">At the heart of Aboriginal philosophy is the understanding that <strong>Country</strong> — the land, water, sky, creatures, plants, and people — is alive, conscious, and relational. This is not metaphor. Country is person. The Aboriginal relationship to land is not that of owner to property, or even steward to resource. It is kinship.</p>\n\n<h4>Country Speaks — Language of Connection</h4>\n<p>To \"know Country\" is to speak its language, to understand its structures, to recognize one\'s relationship within its patterns. Country communicates through the Songlines, through the behavior of animals, through the arrangement of rocks and water, through the positions of stars. Those who are deeply connected to Country learn to read these communications — they become fluent in the language their Country speaks.</p>\n\n<h4>Custodianship & Obligation</h4>\n<p>Aboriginal peoples are not owners of Country — they are custodians, responsible for maintaining the relationships and obligations encoded in the Songlines. To perform ceremony at the right time in the right place is to strengthen the connection, to maintain the sacred relationships, to ensure that the land continues to provide, that the seasons continue to cycle, that the creatures and plants continue to flourish. This is not charity offered by humans to nature — it is reciprocal relationship. Country cares for those who care for it.</p>\n\n<callout>Modern environmental science has largely adopted a similar understanding: ecosystems are not resources to be extracted but living systems in which humans are participants, with obligations and relationships. The Aboriginal understanding preceded Western ecology by thousands of years. It is knowledge carried in the bodies, ceremonies, and Songlines of living people — knowledge that Western science is finally learning to recognize and honor.</callout>\n`
            }
          ]
        }
      ]
    }

  ] // end cultures
}; // end CULTURALVERSE_DATA


/* ═══════════════════════════════════════════════════════════════════════════
   LKP DATA EXPORT BRIDGE
   Lets profile.js, lessons.js, mobile.js, and admin tools all read the same data.
   Keep this at the VERY BOTTOM of LKP/js/lkp-data.js
═══════════════════════════════════════════════════════════════════════════ */

(function exposeLKPDataForAllPages() {
  try {
    if (
      typeof CULTURALVERSE_DATA !== 'undefined' &&
      CULTURALVERSE_DATA &&
      Array.isArray(CULTURALVERSE_DATA.cultures)
    ) {
      window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
      window.LKP_DATA = CULTURALVERSE_DATA;
      window.IKEVERSE_DATA = CULTURALVERSE_DATA;

      window.dispatchEvent(
        new CustomEvent('lkp:data-ready', {
          detail: {
            cultures: CULTURALVERSE_DATA.cultures.length,
            data: CULTURALVERSE_DATA
          }
        })
      );

      console.info(
        '[LKP Data] CULTURALVERSE_DATA exposed globally:',
        CULTURALVERSE_DATA.cultures.length,
        'cultures'
      );
    } else {
      console.warn(
        '[LKP Data] CULTURALVERSE_DATA exists but does not contain a cultures array.'
      );
    }
  } catch (err) {
    console.warn('[LKP Data] Export bridge failed:', err);
  }
})();
