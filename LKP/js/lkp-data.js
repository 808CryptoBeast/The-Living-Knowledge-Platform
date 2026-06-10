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

  const narrativeSection = config.narrativeSection || '';

  const reflectSection = `
<reflect>Reading ${config.waLabel} — what aspect of this Wā most shifts how you understand your relationship with the living world?</reflect>
<reflect>The crisis of this Wā: ${deep.crisis.replace(/\.$/, '')}. Where do you see this pattern active in your own life, community, or place?</reflect>
<reflect>This Wā cultivates ${deep.intelligence}. Name one specific way you could practice this capacity in the coming week.</reflect>
`;

  return `
<section class="kumu-wa-module">
  <section class="kumu-wa-hero kumu-reveal">
    <p class="kumu-wa-hero__eyebrow">Kumulipo Wā Deep Relational Study</p>
    <h2 class="kumu-wa-hero__title">Wā ${waNumber} — ${deep.hawaiianTitle}</h2>
    <p class="kumu-wa-hero__subtitle">${deep.englishTitle} · ${deep.movement}</p>
    <p class="kumu-wa-hero__lead">${config.heroLead}</p>
    ${deep.arc ? `<p class="kumu-wa-arc-statement">${deep.arc}</p>` : ''}
  </section>

  ${narrativeSection}

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

  ${reflectSection}
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
  <p class="kumu-hero__eyebrow">Kānaka Maoli Sacred Knowledge</p>
  <h2 class="kumu-hero__title">Kumulipo</h2>
  <p class="kumu-hero__subtitle">A Genealogy of Creation, Life, and Living Knowledge</p>
  <p class="kumu-hero__lead">2,102 lines. 16 epochs. A complete cosmological genealogy from deep darkness into kuleana. The Kumulipo is the most profound knowledge system in Hawaiian tradition — and your entry point into everything Kānaka Maoli.</p>
</section>

<facts>2,102::Lines in the Chant|16 Wā::Epochs of Unfolding|Pō::Generative Darkness, Not Emptiness|1897::Liliʻuokalani Translation</facts>

<section class="kumu-section kumu-reveal">
  <h4>What Is the Kumulipo?</h4>
  <p>The Kumulipo is a sacred Kānaka Maoli creation chant, genealogy, cosmology, and living knowledge system. It is a framework of pō, emergence, life, genealogy, ecology, relationship, and kuleana — carrying ancestral intelligence through chant, memory, protocol, and transmission across generations.</p>
  <p>The Kumulipo is its own complete knowledge system — cosmology, genealogy, ethics, and ecology held together in living form. Modern science offers one lens on origins. The Kumulipo offers a distinct Kānaka Maoli ancestral lens. Where meaningful parallels arise, they can deepen understanding of both — each tradition keeping its own integrity.</p>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Pō — The Source Before All Things</h4>
  <p><strong>Pō</strong> is where the Kumulipo opens. Deep, generative darkness — not void, not absence, but a fertile depth of potential before anything takes visible form. This is the first condition of the universe in Hawaiian thought.</p>
  <p>The opening line — <strong>"O ke au i kahuli wela ka honua"</strong> — describes heat, turning, and motion within that primordial state. What modern cosmology might loosely compare to the earliest conditions before matter settles into form. From within Pō, the first beings begin to emerge in Wā 1, with <strong>koʻa</strong> — the coral polyp — as the first named life, the first genealogical ancestor in a long chain of becoming.</p>
  <callout>The Kumulipo traces how coral, sea life, land, animals, and people all arise from the same generative source. Pō is prior. Everything else is emergence.</callout>
</section>

<!-- KM_KUMULIPO_SOURCE_INSERT -->

<section class="kumu-section kumu-reveal">
  <h4>Beyond Royal Lineage</h4>
  <p>The Kumulipo has historically been used to affirm aliʻi genealogy and chiefly authority. That use is real and important. But it is not the whole meaning of the chant. Its deeper function is broader: preserving a worldview in which creation is genealogical, life is interconnected, and humans emerge within the same relational system as coral, ocean, plants, animals, stars, land, and sky.</p>
  <p>This makes the Kumulipo a living body of ancestral knowledge, not a narrow political text. It preserves layered insight into origins, ecological relationships, continuity of life, and humanity's place within creation.</p>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Four Living Parallels</h4>
  <p>Hawaiian ancestors embedded deep structural wisdom in the Kumulipo. Modern learners can recognize resonances with contemporary frameworks — and the most meaningful connections are those that open Hawaiian understanding wider rather than translating it into a different vocabulary.</p>
  <callout type="bridge">Use these as orientation aids, not replacements. The Kumulipo carries its own ancestral logic — where modern parallels appear, they can illuminate Hawaiian meaning without becoming the frame for it.</callout>
  <div class="kumu-parallel-grid">
    <article class="kumu-parallel-card">
      <h5>Ecology</h5>
      <p>Coral, sea life, plants, animals, land, and people are connected relations within one genealogical system — not isolated species in separate categories. The chant maps living systems through kinship, not taxonomy.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Genealogy as Structure</h5>
      <p>Moʻokūʻauhau — genealogy — is not just lineage record. Human identity emerges inside ancestral and ecological continuity. You belong to creation, not above it. This reorders how identity, land, and responsibility connect.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Emergence</h5>
      <p>Life appears through ordered, relational phases — not instant completion. Each wā establishes conditions for what follows. Creation is process, not event. Order unfolds from depth, not from nothing.</p>
    </article>
    <article class="kumu-parallel-card">
      <h5>Kuleana</h5>
      <p>Knowledge is never neutral in the Kumulipo. To know creation is to inherit obligation toward balance, stewardship, and right relationship. Wisdom always becomes kuleana — responsibility that must be lived, not just understood.</p>
    </article>
  </div>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Cross-Cultural Resonance</h4>
  <p>The Kumulipo can be placed in respectful dialogue with other knowledge systems without collapsing difference. In Kemet thought, Nun names primordial waters before ordered creation. In the Kumulipo, pō and marine emergence hold a related structural role. The resonance is not identity — it is a shared insight that order emerges from primordial depth through distinct ancestral languages and protocols.</p>
  <twocol left="Wā 1 in Kumulipo" right="Resonance in Kemet">Pō is generative darkness; koʻa marks foundational life; creation unfolds through genealogy and relation.||Nun is primordial depth before ordered form; creation emerges through named principles and cosmic ordering.</twocol>
</section>

<!-- CV_CREATION_ARC -->

<section class="kumu-section kumu-reveal kumu-section--final">
  <h4>Why the Kumulipo Matters Today</h4>
  <p>The Kumulipo is not a simple origin story. It is a living knowledge system that speaks directly to modern questions about identity, ecology, sustainability, ancestry, consciousness, and responsibility. It teaches that creation is relational, life unfolds through genealogy, and knowledge carries kuleana.</p>
  <p>Humans are part of nature, not above it. Relationship precedes hierarchy. Wisdom must become stewardship. These are not abstract principles — they are the interpretive key that opens everything in Kānaka Maoli cultural learning.</p>
</section>

<section class="kumu-section kumu-reveal">
  <h4>Continue the Journey — The 16 Wā</h4>
  <p class="kumu-section__intro">Each wā has its own dedicated lesson page with specific cultural framing, emergence focus, and modern dialogue. Follow this pathway after reading KM·01.</p>
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
    <li><a href="#km-wa-16">Wā 16 — Wā o ke Ao Kānaka: Human Realm in Light</a></li>
  </ul>
  <callout type="bridge">Suggested path: (1) Read KM·01 as cosmological orientation → (2) Move through each dedicated Wā page → (3) Return to KM·01 to integrate the whole sequence.</callout>
</section>

<reflect title="Reflection Prompts">
How does understanding darkness as generative change your view of beginnings?
Where do you see relational thinking in your own community, ecology, or family history?
What does kuleana look like when humans are understood as part of creation rather than above it?
</reflect>
`
            },
            {
              id:       'km-wakea',
              num:      'KM·02',
              title:    'Wākea & Papahānaumoku — The Sky Father and Earth Mother',
              readTime: '8 min',
              content: `
<p class="lead">Beyond the Kumulipo's cosmic genealogy, the creation narrative of <strong>Wākea</strong> (sky father) and <strong>Papahānaumoku</strong> (earth mother) provides the deepest spiritual framework for the Hawaiian relationship to land, family, and food. This is the story that makes kalo the elder sibling of all human beings.</p>

<facts>Wākea::Sky Father — Wide Expanse|Papahānaumoku::She Who Births Islands|Hāloa::Elder Sibling — Sacred Kalo|Aloha ʻĀina::Love of Land as Genealogical Obligation</facts>

<h4>The Names Themselves</h4>
<p><strong>Wākea</strong> means "wide expanse" — the sky, infinite space, the masculine expansive principle. <strong>Papahānaumoku</strong> means "she who gives birth to islands" — Papa (flat foundation, earth) + hānau (to give birth) + moku (island). The earth mother is literally defined by her generative act: birthing the islands of Hawaiʻi.</p>

<h4>The Birth of Hāloa</h4>
<p>Wākea and Papahānaumoku had a child together — but this child was stillborn, born too early and not fully formed. Rather than discarding this child, they planted the baby in the earth. From that sacred burial, the first <strong>kalo</strong> (taro) plant grew. Its name: <strong>Hāloa-naka</strong> — "the trembling long stalk."</p>
<p>Wākea and Papahānaumoku had a second child — this one fully alive, fully human. This child was named <strong>Hāloa</strong> — named in honor of his elder sibling, the kalo plant that preceded him and nourished him.</p>

<callout>This genealogy is one of the most ethically profound ecological relationships in any culture's tradition. Kalo is not a crop. Kalo is your elder sibling. To pull taro from the ground is not agriculture — it is receiving nourishment from your ancestor. To damage or waste kalo is to disrespect your elder. To tend the loʻi is to fulfill your obligation to your family. The entire Hawaiian relationship to land, food, and agriculture flows from this genealogical truth.</callout>

<h4>The Islands as Family</h4>
<p>The islands themselves are children of Papahānaumoku and Wākea — born in sequence, each with its own name and personality. Hawaiʻi (the Big Island) is the eldest, then Maui, Kahoʻolawe, Lānaʻi, Molokaʻi, Oʻahu, Kauaʻi, Niʻihau. Each island is not a place — it is a being, a family member, an ancestor. <strong>Aloha ʻāina</strong> — love of the land — is not a sentiment. It is the natural expression of knowing that the land is your relative.</p>

<reflect>
How does kalo being your elder sibling change the meaning of food, farming, and wasting food?
What does aloha ʻāina demand in practice when the land is literally your ancestor?
How does the Wākea-Papahānaumoku story reframe the relationship between identity, land, and belonging?
</reflect>
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
                narrativeSection: `
<section class="kumu-section kumu-reveal">
  <h4>Opening in Pō — What Wā 1 Actually Does</h4>
  <p>The Kumulipo opens in darkness. Not the darkness of absence, but <strong>Pō</strong> — a generative depth so dense with ancestral potential that the first words of the chant describe it as <em>heat and turning motion</em>: <strong>"O ke au i kahuli wela ka honua"</strong> — the time of the overturning heat of the earth.</p>
  <p>This is the cosmological condition before life takes named form. And then, from within that Pō, the first named being emerges: <strong>koʻa</strong> — the coral polyp. Not a symbol. An actual living form that modern ecology recognizes as foundational to reef systems. The Kumulipo names it as genealogical ancestor — the first in a chain that runs, without break, all the way to humans.</p>
  <p>The pattern that opens here repeats throughout the chant: <em>born at night, lives in the sea, emerges from darkness</em>. Each creature is not just named but placed in relation — to what came before, to what it shares the world with, to what its emergence makes possible next.</p>
  <callout>Wā 1 is the interpretive key for all 16 Wā. Once you understand that <em>life</em> here means genealogical relation rather than biological category, every subsequent wā opens differently.</callout>
</section>`,
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
                narrativeSection: `
<section class="kumu-section kumu-reveal">
  <h4>When One Becomes Many — The Sea Fills With Kin</h4>
  <p>Wā 2 takes what Wā 1 began and multiplies it. The ocean, already seeded with koʻa and its first descendants, now fills with named sea life — fish, mollusks, echinoderms — species that Kānaka Maoli fishers and divers knew intimately over generations of direct relationship. But the chant is not a catalog. Each creature appears as a named genealogical member of a living family.</p>
  <p>The structural move of Wā 2 is <em>patterned abundance</em>. Emergence is not random; it follows sequence. Each new form relates to what came before it. Complexity arrives as relationship becoming denser, richer, more intricate — not as scattered accumulation.</p>
  <p>For Kānaka Maoli, this is not metaphor. The ocean is literally full of ancestors. The fish in the net is kin. Harvesting from it carries obligation — kuleana — because you are taking from family, not extracting from inventory.</p>
  <callout>Where Wā 1 established the first life and the first threshold, Wā 2 establishes abundance as genealogical — not property to be owned, but kin to be tended and reciprocated.</callout>
</section>`,
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
                narrativeSection: `
<section class="kumu-section kumu-reveal">
  <h4>The First Great Transformation — Parents Who Birth What Flies</h4>
  <p>Wā 3 introduces something the first two wā did not: <em>radical transformation</em>. Not just more creatures, but creatures born as a fundamentally different kind of being than their parent. A woodborer gives birth to a moth. A caterpillar to a butterfly. Parents of the ground give birth to children of the sky.</p>
  <p>The chant names this with a phrase that echoes through the entire wā: <strong>"puka kana keiki, lele"</strong> — <em>out came its child, and it flew</em>. The rhythm builds — parent after parent, emergence after emergence — and each time, the child takes flight. The repetition is the teaching. It is the Kumulipo insisting, again and again, that transformation across forms is not rupture — it is genealogy.</p>
  <p>In the Kumulipo, transformation does not break the line. The woodborer holds the moth into being. The ancestral form carries the new form forward into a new domain. This is what the chant means by genealogy: not just biological lineage, but the way one form of existence makes the next possible.</p>
  <p>Wā 3 closes by pairing sea birds with land birds, showing that the flying world spans all realms. Hawaiʻi once had more bird species per land area than almost anywhere on earth. Many are now gone. This wā is simultaneously a creation account and an ancestral record of a world that no longer fully exists — and a reminder of what is carried forward through memory.</p>
  <callout>The rhythm of <em>"puka kana keiki, lele"</em> is one of the most powerful teaching moments in the chant. Transformation, here, is always genealogical — something ancestral is always holding the new form into being.</callout>
</section>`,
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

<reflect>
What does it mean to navigate by relationship with the natural world rather than by instrument?
How does memorizing 150 stars as reliable friends change the navigator's understanding of the night sky?
Where in your own life could sustained observation of natural patterns serve as orientation?
</reflect>
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

<reflect>
How does proving intentional Pacific navigation change the historical narrative about Polynesian peoples?
What does the Hōkūleʻa revival suggest about what else might be reclaimed when a culture reconnects with suppressed knowledge?
What forms of knowledge in your own community might need a similar act of revival?
</reflect>
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

<reflect>
How does the mountain-to-sea design of the ahupuaʻa reflect an understanding of ecology that modern land management often lacks?
What does resource sovereignty look like when each community has built-in access to every ecological zone it needs?
If you were designing a sustainable community land system today, what elements of the ahupuaʻa would you want to preserve?
</reflect>
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

<reflect>
How does tending the loʻi kalo as an act of caring for your elder sibling change the meaning of agricultural labor?
What does the mākāhā's self-regulating design teach about the difference between extraction and managed reciprocity?
Where in contemporary life do you see systems that operate on continuous flow and return rather than take-and-discard?
</reflect>
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

<reflect>
Why did colonizers specifically target ʻōlelo Hawaiʻi — what did they understand about language that their suppression policy reveals?
What is contained inside a language that cannot be fully translated into another, and what does that mean for cultural loss?
How does the fact that every Hawaiian place name carries ecological and historical meaning change how you understand the relationship between language and land?
</reflect>
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

<reflect>
If hula is a technology for knowledge transmission, what does that imply about the body as a medium of cultural memory?
Why would colonizers target hula specifically — what does its suppression reveal about the relationship between artistic practice and power?
How does understanding art as a knowledge system change the way you value or practice any creative form in your own life?
</reflect>
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

<reflect>
How does the integration of pule, protocol, and botanical knowledge in laʻau lapaʻau challenge modern distinctions between medicine and spirituality?
What is the significance of a healing tradition that requires the healer to maintain personal purity and balance as a prerequisite for effective treatment?
How might healthcare change if it operated from the premise that illness is often a symptom of disrupted relationship — with family, land, or the divine?
</reflect>
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
              id:       'ke-creation-deep',
              num:      'KE·00',
              title:    'Kemetic Creation Deep Study — Nun, Atum, Ogdoad, Ennead & Ptah',
              readTime: '18 min',
              content: `
<p class="lead"><strong>Kemetic creation is not one flat story.</strong> It is a living constellation of temple traditions that ask the same deep questions from different sacred centers: What existed before form? How does darkness become world? How does hidden potential become speech, order, relation, and responsibility?</p>

<callout type="gold">Read these creation traditions as complementary lenses, not as contradictions. Heliopolis, Hermopolis, and Memphis each preserve a different part of the architecture: emergence from Nun, hidden pre-creation forces, divine differentiation, creative speech, and the maintenance of Maʻat.</callout>

<h4>Why Kemet Has Multiple Creation Accounts</h4>
<p>Ancient Kemet was not organized around a single forced doctrine. Sacred cities carried local temple knowledge, ritual memory, and philosophical emphasis. Iunu / Heliopolis centered Atum and the Ennead. Khmun / Hermopolis centered the Ogdoad and the hidden conditions before creation. Mennefer / Memphis centered Ptah, heart, tongue, craft, and name. These are not random myths competing for attention. They are different ways of reading the same mystery of emergence.</p>

<h4>The Deep Pattern</h4>
<p>The pattern begins in <strong>Nun</strong>, the dark primordial waters. Nun is not nothingness; it is full potential before visible form. From this hidden depth comes a first standing place, often imagined as the primeval mound. <strong>Atum</strong> emerges as self-generated completeness, then differentiation begins through pairs: Shu and Tefnut, Geb and Nut, and the later forces of life, death, disruption, restoration, and protection.</p>

<twocol left="Ogdoad · Hidden Conditions" right="Ennead · Relational Differentiation">The Ogdoad names what is present before creation becomes visible: water, infinity, darkness, and hiddenness. These conditions are not dead background; they are active preconditions for emergence.||The Ennead names how creation differentiates into relational principles. Air, moisture, earth, sky, renewal, magic, disruption, and protection all become part of the ordered field.</twocol>

<h4>Ptah and Creation Through Word</h4>
<p>The Memphite tradition deepens the question by asking how form becomes effective. Ptah creates through <strong>heart</strong> and <strong>tongue</strong>: inward conception and spoken articulation. In this worldview, language is not decoration. Naming places a being within reality. Speech can uphold Maʻat or damage it.</p>

<h4>How This Speaks With the Kumulipo</h4>
<p>The Kumulipo and Kemetic creation traditions both begin in generative darkness and depth. Both refuse the idea that darkness is only emptiness. Both use sequence, naming, and relation to show how worlds become livable. But they must not be collapsed into each other. The Kumulipo is Kānaka Maoli genealogical chant grounded in Pō, moʻokūʻauhau, and kuleana. Kemetic creation is rooted in Nun, divine principles, temple traditions, Maʻat, and ritual maintenance of cosmic order.</p>

<reflect>
Where do you see hidden potential being mistaken for emptiness?
How does a culture protect multiple creation lenses without forcing one to erase the others?
What changes when creation is read as responsibility rather than only origin?
</reflect>
`
            },
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

<h4>Nun as Continuing Presence</h4>
<p>Nun does not disappear once creation begins. Ordered world rises from Nun and remains surrounded by it, like land appearing after floodwater withdraws. This matters because Kemetic creation is not a one-time event locked in the past. Dawn, flood, temple ritual, royal renewal, burial, and rebirth all repeat the first emergence in smaller cycles. The world must keep being ordered.</p>

<h4>The Story Flow</h4>
<ol>
<li><strong>Before solidity</strong> — no firm earth, no separated sky, no stable direction, no visible light.</li>
<li><strong>Watery expanse</strong> — Nun holds potential before form, while paired forces name infinity, darkness, hiddenness, and lack of direction.</li>
<li><strong>First emergence</strong> — the creator appears from the waters on the first mound, lotus, heron, or fiery island depending on the tradition.</li>
<li><strong>Self-generation</strong> — Atum is complete within himself and brings forth Shu and Tefnut, the first differentiated pair.</li>
<li><strong>World-space opens</strong> — Geb and Nut become earth and sky; Shu creates the breathing space between them.</li>
<li><strong>Order must be maintained</strong> — Maʻat keeps creation from dissolving back into disorder.</li>
</ol>

<callout type="bridge">Similarity note: Nun and Pō both teach that darkness/depth is generative rather than empty. But Nun is Kemetic primordial water and cosmic precondition; Pō is Kanaka Maoli generative night carried through genealogical chant. The resonance is real, but the traditions remain distinct.</callout>

<reflect>
How does treating darkness as full potential rather than empty void change how you understand beginnings — personal, creative, or cosmological?
Where else do you see the principle that conditions for creation can be present and active before anything visible has formed?
What does Nun's continued presence at the margins of the created world suggest about the relationship between origin and ongoing existence?
</reflect>
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

<reflect>
How does the Ennead's paired structure — air and moisture, earth and sky — model a fundamentally relational understanding of creation rather than a solo creator?
What does it mean that love, death, chaos, and restoration are built into the cosmic order from its earliest stages, not added later as human problems?
How does this Heliopolitan sequence compare with other creation traditions you have encountered — what is shared, what is distinctive?
</reflect>
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

<reflect>
What are the ethical implications of a philosophy where consciousness conceives reality before matter exists — where thought precedes and shapes the world?
How does the creative power attributed to speech and naming change your understanding of the responsibility that comes with language?
Where do you experience language as genuinely generative — actually creating or reshaping reality rather than simply describing it?
</reflect>
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

<reflect>
The 42 Declarations treat harm to persons, animals, water, and community as equally serious violations of cosmic order. How does this integrated ethics compare with modern legal frameworks that separate environmental law from human rights?
If your heart were weighed by Maʻat today, which declarations would carry the most weight for you personally?
How does understanding justice as maintenance of cosmic order — rather than just human agreement — change what justice demands?
</reflect>
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

<reflect>
What would political leadership look like today if rulers were evaluated first by their alignment with ethical principle rather than accumulation of power?
How does the Maxim "consult the ignorant man as well as the wise" challenge modern hierarchies about whose knowledge deserves attention?
What is the cost to a civilization when it forgets that governance exists to serve the principle of order, not the other way around?
</reflect>
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

<reflect>
What is lost when a civilization can no longer read its own writing — what aspects of continuity break beyond just the texts themselves?
How does understanding hieroglyphics as "words of the gods" rather than utilitarian record-keeping change the spiritual stakes of writing?
What does the 1,400 years of silence followed by redecipherment teach about the relationship between knowledge, power, and cultural survival?
</reflect>
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

<reflect>
How does the integrated Kemetic model — where physical, spiritual, and cosmic alignment are inseparable components of health — challenge modern medicine's division of symptom from context?
What does it mean that Hippocrates was learning from a tradition already thousands of years old when he is called the "father" of Western medicine?
How might healthcare be transformed if practitioners were evaluated not only on technical skill but on personal balance and right relationship with patients?
</reflect>
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

<reflect>
Why might the insight that creation begins in generative darkness appear independently in cultures separated by thousands of miles and thousands of years?
How does reframing darkness as full potential rather than empty absence change the way you relate to uncertainty, unknowing, or difficult beginnings?
What does it mean for wisdom traditions and modern cosmology to be asking the same fundamental question with different instruments?
</reflect>
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

<reflect>
What does it mean that two civilizations separated by thousands of miles independently placed the same integrating principle at the center of everything they built?
How does understanding personal integrity, ecological care, and cosmic alignment as one single concern change how you approach daily decisions?
Where in your own life can you see Aloha or Maʻat as active — not as historical concepts, but as living demands?
</reflect>
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

<callout type=\"bridge\"><strong>The point is not equivalence, but resonance.</strong> When a Hawaiian elder and a modern cosmologist stand together and ask \"How did the universe come to contain life, consciousness, complexity?\" they are asking the same fundamental question. They have observed the same pattern — that the universe unfolds from simple to complex, from potential to form. They have structured their knowledge differently, for different purposes, using different tools. But the underlying pattern is recognizable in both. This is what the bridge does: it reveals structural resonance without collapsing distinct knowledge systems into false equivalence.</callout>

<reflect>
How does treating the Kumulipo as a distinct ancestral knowledge system — rather than an imperfect version of evolutionary biology — actually deepen what both traditions can offer?
What is the difference between structural resonance and equivalence, and why does honoring that distinction matter?
Where in your own experience have you encountered emergence — genuinely new properties arising from the interaction of simpler elements that could not have been predicted alone?
</reflect>
`
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
              id:       'dg-po-creation',
              num:      'DG·00',
              title:    'Po, Amma & Nommo — Dogon Creation Deep Study',
              readTime: '16 min',
              content: `
<p class="lead">Dogon creation teaching, as recorded most famously through Marcel Griaule and Germaine Dieterlen, begins with <strong>Amma</strong>, a creator intelligence, and with <strong>Po</strong>, the smallest seed of potential. Po is not simply a star name. It is a compact symbol of hidden density, beginning, contraction, and the power of the very small to unfold into worlds.</p>

<callout type="gold">Source care: Dogon cosmology is mostly known to outsiders through fieldwork, oral transmission, initiation contexts, and later scholarly debate. This lesson treats Griaule and Dieterlen as important witnesses, not as final owners of Dogon knowledge. It also names later critiques, especially around the Sirius material, so depth does not become overclaim.</callout>

<h4>Po as the Smallest Seed</h4>
<p>In the Griaule/Dieterlen account, Po is described as a tiny, dense, beginning-point. It is seed, grain, hidden center, and compressed possibility. This is why the similarity to Kanaka Maoli <strong>Pō</strong> is striking to the ear and imagination. But we must move carefully: Hawaiian Pō and Dogon Po are not proven to be the same word or tradition. The responsible comparison is conceptual: both point toward hidden generative depth before full visible unfolding.</p>

<h4>Amma and the World Egg</h4>
<p>Amma is the ordering creator. Creation is often described through an egg or seed-like enclosure where the universe is contained before differentiation. The world is not first imagined as loose matter scattered everywhere; it is gathered, folded, patterned, and then unfolded. This makes Dogon creation feel deeply architectural: the cosmos begins as a hidden structure that opens through rhythm, pairing, and motion.</p>

<h4>Nommo and Living Water</h4>
<p>The <strong>Nommo</strong> are linked with water, speech, life, sacrifice, restoration, and instruction. In many summaries they are called ancestral or amphibious beings, but that phrase can flatten their function. More importantly, Nommo represent the living principle that reconnects heaven, water, earth, language, and human order. Creation is not complete when forms appear; creation must be taught, healed, and rightly spoken.</p>

<h4>The Sirius Question</h4>
<p>The famous claims around Po Tolo and Sirius B should be taught with care. Griaule and Dieterlen reported Dogon knowledge of an invisible Sirius companion. Later scholars, including Walter van Beek, questioned whether that knowledge was widespread, ancient, or affected by outside contact. For this platform, the safest path is to respect Dogon knowledge while refusing sensational certainty. The deeper lesson is not "ancient aliens" or spectacle. It is hiddenness, density, cyclic time, oral transmission, and the seriousness of initiated knowledge.</p>

<twocol left="Dogon Po" right="Kanaka Maoli Pō">Po, in the Dogon material, can be read as a tiny dense seed of hidden cosmic potential, especially in relation to Amma and Po Tolo.||Pō, in the Kumulipo, is generative night/darkness, a genealogical source from which life unfolds through chant, birth, and kuleana.</twocol>

<reflect>
What is gained by comparing Po and Pō carefully, without claiming they are the same?
Where does your own learning confuse hiddenness with absence?
How can oral knowledge be honored without turning it into spectacle?
</reflect>
`
            },
            {
              id:       'dg-sirius-triplet',
              num:      'DG·01',
              title:    'The Sirius Triplet — The Hidden Companion Star',
              readTime: '11 min',
              content: `\n<p class=\"lead\">The Dogon peoples of Mali preserve sophisticated sky knowledge through oral tradition, ritual, architecture, agriculture, and initiation. Central to the famous Griaule/Dieterlen account is <strong>Sirius</strong> and a hidden companion called <em>Po Tolo</em>. This material is powerful, but it must be handled with care because later scholarship debates how ancient, widespread, and uncontaminated the Sirius claims are.</p>\n\n<callout>Historical astronomy confirms that Sirius has a white dwarf companion, Sirius B: Friedrich Wilhelm Bessel inferred an unseen companion in 1844, and Alvan Clark observed it in 1862. Griaule and Dieterlen later reported Dogon knowledge of a hidden Sirius companion. Walter van Beek and others questioned parts of that report. The right lesson posture is respect plus caution, not sensational certainty.</callout>\n\n<h4>Po Tolo & Cosmic Order</h4>\n<p>Within the reported Dogon cosmological system, Po Tolo is more than an astronomical object. Po is small, dense, hidden, seed-like, and difficult to perceive directly. This makes it a teaching about hidden structure: reality contains forces known by pattern, effect, rhythm, and initiation, not only by immediate visibility.</p>\n\n<h4>The Nommo — Waters of Creation</h4>\n<p>The Dogon cosmology centers on the <strong>Nommo</strong> — beings/principles linked with water, speech, life, moisture, sacrifice, and restoration. The universe is not merely an object to observe; it is a living order that must be instructed, repaired, and spoken rightly. This resonates with Kemetic Nun and Kanaka Maoli Pō as generative depth, while remaining its own West African tradition.</p>\n\n<reflect>\nHow does the concept of Po Tolo as hidden, dense, and perceivable only by pattern — not by direct sight — serve as a teaching about the structure of knowledge itself?\nHow should learners hold the Sirius material with respect and care without overclaiming or sensationalizing?\nWhat does the Nommo's role in teaching, repairing, and rightly speaking suggest about the obligations of knowledge transmission?\n</reflect>\n`
            },
            {
              id:       'dg-ammas-world',
              num:      'DG·02',
              title:    'Amma & the Creation of the World — The Cosmic Egg',
              readTime: '10 min',
              content: `\n<p class=\"lead\">Central to Dogon cosmology is <strong>Amma</strong> — the creator principle, the cosmic consciousness, the source of all being. In the beginning, Amma existed alone in an infinite void. From Amma emerged all creation, not through external command, but through internal unfoldment — like a cosmic egg that gestates, differentiates, and births worlds.</p>\n\n<h4>The Four Placenta — Sacred Geometry</h4>\n<p>The Dogon spoke of creation in terms of sacred geometry — the spiral, the circle, the cross. These are not arbitrary symbols. They encode actual principles of how the cosmos organizes: from the spiral of galaxies to the circular orbits of planets to the four-fold organization of space and time. The Dogon understanding that reality is fundamentally mathematical and geometric — expressed long before modern physics revealed that all of nature operates according to mathematical principles.</p>\n\n<callout type=\"bridge\">Modern physics describes the universe as emerging from quantum fields — mathematical potentials that become actual through interaction and observation. The Dogon intuition that creation unfolds from a cosmic principle (Amma) through sacred geometric patterns parallels modern theoretical physics in striking ways: reality at its foundation is mathematical and organizational, not material and simple.</callout>\n\n<reflect>\nWhat does it mean to say that creation is fundamentally architectural — that the cosmos begins as hidden structure before it unfolds?\nHow should learners hold the bridge between Dogon sacred geometry and modern physics without allowing one to subsume the other?\nWhere in your own experience does pattern recognition become the beginning of real knowledge?\n</reflect>\n`
            },
            {
              id:       'dg-syncretism',
              num:      'DG·03',
              title:    'Knowledge Keepers & Transmission — Dogon Wisdom in the World',
              readTime: '9 min',
              content: `\n<p class=\"lead\">The Dogon maintained their astronomical knowledge through oral transmission, ritual, and sacred societies. Initiated knowledge keepers passed understanding to initiates through symbolic instruction and direct observation. This method preserved knowledge across generations without written text — a sophistication that modern scholarship is only beginning to appreciate.</p>\n\n<h4>The Challenge of Transmission</h4>\n<p>When Western scholars first encountered Dogon astronomical knowledge in the 1940s, they faced a crisis of credibility: How could non-literate peoples have such precise astronomical knowledge? This question reveals the bias embedded in Western assumptions — that knowledge requires written language, that oral transmission is less reliable, that \"primitive\" peoples could not possess sophisticated science.</p>\n<p>In fact, oral transmission creates precision through a different mechanism: ritual repetition, mnemonic poetry, direct observation, and corrective feedback from the community of knowledge keepers. This is not less reliable than writing — it is reliably different, optimized for different purposes.</p>\n\n<callout>The Dogon case teaches us to question our assumptions about what kinds of peoples can develop sophisticated knowledge, what forms that knowledge takes, and how it is preserved and transmitted. The universe does not require a university to reveal its patterns. A careful observer, a good memory, a community committed to precision, and centuries of unbroken transmission can preserve and refine knowledge as well as any written tradition.</callout>\n\n<reflect>\nWhat does the Dogon case reveal about Western assumptions that equate literacy with intelligence or sophistication?\nHow does oral precision differ from written precision — what might each method preserve or transmit better than the other?\nWhat does it mean that the universe does not require a university to reveal its patterns?\n</reflect>\n`
            },
            {
              id:       'dg-pale-fox',
              num:      'DG·04',
              title:    'Yurugu — The Pale Fox and the First Disruption',
              readTime: '12 min',
              content: `
<p class="lead">Not all of Dogon cosmology moves toward order. At the heart of the creation story stands <strong>Yurugu</strong> — also called Ogo — the incomplete being who disrupted the unfolding of cosmic completeness before it could finish. His story is essential: without understanding Yurugu, the Nommo do not fully make sense.</p>

<callout type="gold">Yurugu is a principle, not a villain. Dogon cosmology does not divide neatly into good and evil. It describes forces of completion and forces of incompletion, both of which are real and active in the world.</callout>

<h4>Born Before His Time</h4>
<p>In the Griaule/Dieterlen account, Yurugu was formed inside the cosmic egg alongside his twin — but he emerged before completion, stealing a portion of the placenta that should have been shared. This act of premature birth broke the twinness, the pairing that is fundamental to Dogon cosmological order. He became, forever, a being who lacks the feminine counterpart that would make him whole.</p>
<p>His frantic movement across the cosmic landscape — spinning the stolen placenta, seeking what cannot be returned — generates the earth's form, creates the disorder that makes the present world imperfect. He is not merely destructive; his movement is generative. But what he generates is world-as-we-actually-know-it: incomplete, seeking, unresolved.</p>

<h4>The Pale Fox as Divination Oracle</h4>
<p>Yurugu's earthly form is the <em>Vulpes pallida</em> — the pale fox of the Sahel. Dogon diviners use the tracks the fox leaves in prepared sand to read messages about the present and future. The fox, as an embodiment of Yurugu, moves in the space between the human world and the cosmic unknown — its traces are legible to those trained to see them.</p>
<p>This is profound: the very principle of cosmic disruption becomes a tool of knowledge. Disorder, read rightly, reveals what ordered speech cannot. The fox's tracks carry information precisely because the fox does not follow the patterns of completion.</p>

<h4>What Yurugu Teaches</h4>
<p>Dogon cosmology needs Yurugu. Without him, the story is too clean, too orderly, too distant from the actual condition of the world. Yurugu names the experience of incompleteness: the seeking that does not end, the isolation that comes from acting too early, the disruption that scatters what should remain whole. And yet that disruption also makes earth, makes texture, makes the very ground the living walk on.</p>

<twocol left="Yurugu (Dogon)" right="Loki / Coyote (other traditions)">Yurugu is a principle of cosmological incompleteness — his disruption is structural, arising from premature action, and produces the actual world rather than just chaos.||Trickster figures across many cultures also occupy the edge of order — but their function, cosmological role, and cultural weight must not be collapsed into a single archetype.</twocol>

<reflect>
What is being taught when a tradition places an incomplete, disrupting principle at the heart of its creation story — not as villain, but as essential force?
The pale fox's tracks are a knowledge system only because the fox is outside the normal order. What does this suggest about the relationship between disruption and insight?
Where in your own experience has incompleteness or premature action shaped something that later became foundational?
</reflect>
`
            },
            {
              id:       'dg-nommo-descent',
              num:      'DG·05',
              title:    'The Eight Nommo — Descent of the Ancestors',
              readTime: '13 min',
              content: `
<p class="lead">While Yurugu disrupts, the <strong>Nommo</strong> restore. These eight ancestral pairs — four sets of male and female twins, born from Amma — descend from the celestial order to bring what the world needs to function: language, weaving, fire, agriculture, ceremony, and instruction. Their descent is not mythological metaphor. It is the Dogon account of how the present human order came to be organized.</p>

<h4>Eight Pairs, Eight Principles</h4>
<p>The eight Nommo are not simply eight identical beings. Each pair governs a domain of life and social order. Their distinctions correspond to Dogon clan organization, to agricultural cycles, to the organization of the granary, to the structure of the village. When Dogon people say a marriage or a harvest or a ceremony is properly conducted, they mean it aligns with the principles the Nommo established.</p>
<p>Twinness — paired completeness — is the signature of the Nommo. Yurugu broke twinness. The Nommo embody it. Their pairing creates stability, reciprocity, balance: the very qualities the world needs that Yurugu's incomplete nature cannot provide.</p>

<h4>The Cosmic Ark</h4>
<p>In the Griaule/Dieterlen account, the Nommo descended in a great cosmic ark — a structure that carried the seed of every living thing. Its form is echoed in the Dogon granary, in the structure of the village, in the proportions of ceremonial objects. The descent is remembered in architectural form: the ark became the template for the built environment.</p>
<p>This is what it means to say Dogon sacred geometry is cosmological. It is not decoration. The proportions of the granary, the layout of the village, the design of the sanctuary — all of these recapitulate the descent of the Nommo, the structure of the cosmic ark, the organization of the eight founding principles.</p>

<h4>Nommo as Language</h4>
<p>The Nommo are intimately connected to speech. Water and word share a common nature in Dogon thought — both flow, both carry life, both can heal or damage depending on how they are used. The <em>Sigi So</em> — the secret language used in ceremony — is attributed to Nommo transmission. To speak rightly is to channel the ordering principle that the Nommo represent. Careless or dishonest speech disrupts order the way Yurugu's movement disrupted the cosmic egg.</p>

<facts>Eight Nommo pairs::Correspond to clans, seasons, crops, cosmic forces|Cosmic ark::Template for granary, village, and ceremonial proportions|Sigi So::Secret ceremonial language, transmitted by Nommo|Twinness::Structural principle of completeness and reciprocity</facts>

<reflect>
The Nommo descend carrying civilization — but the form civilization takes is specific: language, weaving, agriculture, ceremony. What does this list reveal about what the Dogon considered the essential supports of human order?
Nommo are associated with water and speech. How does treating language as a fluid, living substance — something that can nourish or damage — change how you approach your own words?
What is the relationship between twinness as a cosmological principle and the actual social practices of reciprocity, pairing, and balance that hold communities together?
</reflect>
`
            }
          ]
        },
        {
          id:    'dogon-ceremony',
          title: 'Ceremony, Architecture & Sacred Time',
          emoji: '🥁',
          desc:  'The Dogon ceremonial cycle, sacred architecture, and how cosmic order is maintained through living practice.',
          lessons: [
            {
              id:       'dg-sacred-granary',
              num:      'DG·06',
              title:    'The Granary as Universe — Sacred Architecture',
              readTime: '11 min',
              content: `
<p class="lead">One of the most striking aspects of Dogon knowledge is that it does not stay in the sky. Cosmology descends into architecture. The <strong>granary</strong> — the everyday structure that stores grain through the dry season — is built according to the proportions of the cosmic egg, organized around the principles of the eight Nommo, and oriented to the movements of significant stars. To enter a granary is to be inside a model of the universe.</p>

<h4>Eight Compartments, Eight Nommo</h4>
<p>A traditional Dogon granary has eight internal compartments. These eight divisions correspond to the eight Nommo pairs — and through them to the eight clans, the eight crops, the eight cardinal and intercardinal directions, the eight seeds Amma placed in the world egg. This is not symbolic decoration imposed after the fact. The eight-fold structure is the design principle: the granary works as a granary and as a cosmological map simultaneously.</p>
<p>When grain is stored and accessed by season, family, and crop type, those practical decisions are made within a framework that reflects cosmic order. Daily life and cosmic structure are not separate domains requiring different modes of thought. They are one domain, visible at different scales.</p>

<h4>Village as Body</h4>
<p>The Dogon village plan is also cosmological. Read from above, a traditional village maps the shape of the Nommo's cosmic body. The smithy is the head. The communal meeting place is the chest. The altars are the hands. The women's dwellings form the legs. The layout is not merely aesthetic — it organizes collective life according to the same principles that organize the cosmos. Where you sit, where you gather, where you work — all of it locates you within the body of the founding ancestors.</p>

<callout>This is what comparative studies call "cosmological architecture" — building that encodes a view of the universe in its proportions and organization. Examples appear in many traditions: Kemet temple alignments, Hawaiian heiau construction, Vedic mandir proportions, Aboriginal sacred site placement. Each tradition generates its own form. What they share is the principle that constructed space is not neutral: it is an argument about how the world is organized.</callout>

<h4>Sanctuary and Sky</h4>
<p>The <em>togu na</em> — the men's meeting shelter — is built low enough that no one can stand inside. Everyone who enters must sit. The low roof enforces posture: in the space of collective deliberation, nobody stands above others. This is not a safety feature. It is architectural ethics, cosmological governance made physical.</p>

<reflect>
If you were to design a space — a home, a classroom, a community building — whose architecture encoded your values about how the world is organized, what would it look like?
The granary is cosmological and practical simultaneously. What would be lost and gained if we only understood it as one or the other?
The togu na enforces equality through low ceilings rather than rules. What does it say about a culture that builds its ethics into its architecture rather than writing them down?
</reflect>
`
            },
            {
              id:       'dg-dama-ceremony',
              num:      'DG·07',
              title:    'The Dama — Returning the Dead to the Ancestors',
              readTime: '13 min',
              content: `
<p class="lead">When a Dogon adult dies, a funeral ceremony takes place — but the work of returning that person fully to the cosmic order is not complete until the <strong>Dama</strong>. Performed months or years after death, the Dama releases the <em>nyama</em> — the vital force — of the deceased, freeing it from the world of the living and returning it to the ancestors. It is one of the most complex ceremonial events in West African life.</p>

<callout type="gold">The Dama is not public entertainment. It is sacred technology — a set of practices whose function is cosmological maintenance. What outsiders are permitted to witness, photograph, or describe is limited. This lesson works from published community accounts and scholarship that Dogon cultural organizations have consented to share. Approach with appropriate reserve.</callout>

<h4>Nyama and the Unfinished Dead</h4>
<p>In Dogon understanding, <em>nyama</em> is the vital force that animates all living things. At death, the body dissolves but nyama does not immediately return to the cosmic order. It lingers in the world of the living, incomplete, potentially disruptive — like Yurugu, it is force without proper form. The Dama provides the ceremonial structure that completes the transition, giving nyama the direction it needs to leave the living world and join the ancestors.</p>
<p>Until the Dama, the deceased is considered neither fully among the living nor fully among the dead. The survivors carry an obligation: to perform the ceremony that completes the transit. This understanding makes death not an event but a process — one that requires active participation from the community to bring to proper completion.</p>

<h4>The Masks</h4>
<p>The Dama involves mask performances by initiated men of the <em>Awa</em> society. The masks are not costumes representing human characters. They are instruments that embody cosmic forces — Nommo, elemental powers, ancestral principles. When a man wears the mask, he is not pretending to be something else; he is temporarily becoming a vessel for the force the mask represents. Strict protocols govern who may make, wear, see, or inherit particular masks.</p>
<p>The Kanaga mask — a cross-shaped form extending above the head — is one of the most recognized. Its shape encodes cosmological geometry: the connection between earth, the human, and the celestial order. Its movements during the Dama trace cosmological relationships in the air above the community.</p>

<h4>Completion as a Social Act</h4>
<p>What strikes comparative scholars is that the Dama makes cosmic completion a collective responsibility. The community must perform the ceremony or the dead are not properly returned. This is not superstition. It is a sophisticated understanding of what holds social and cosmic order together: active, repeated, communal ceremony. The cosmos does not maintain itself passively. It requires maintenance — the same principle found in Vedic yajna, in Hawaiian hula, in Kemetic temple ritual.</p>

<reflect>
What changes about your understanding of death when it becomes a process requiring communal action rather than an event that simply happens?
The masks embody cosmic forces rather than representing human characters. What does this distinction teach about the difference between performance and transformation?
The Dama is cosmic maintenance — the community actively sustains the order it lives within. Where do you see this principle of active maintenance at work in any tradition you know well?
</reflect>
`
            },
            {
              id:       'dg-sigui-cycle',
              num:      'DG·08',
              title:    'The Sigui — Sixty Years of Living Transmission',
              readTime: '12 min',
              content: `
<p class="lead">Every sixty years, the Dogon hold the <strong>Sigui</strong> — one of the most remarkable ceremonies in West African life. Lasting several years as it travels from village to village across Dogon country, the Sigui marks the renewal of the world, the transmission of the sacred language <em>Sigi So</em> to the next generation, and the commemoration of the first ancestor's death. Every living person experiences the Sigui once in their lifetime.</p>

<h4>The Sixty-Year Cycle</h4>
<p>The sixty-year period of the Sigui has drawn considerable attention because it appears to correlate with an astronomical cycle connected to the Sirius system — though, as with all the Sirius material, this connection should be held with careful attention to what is claimed and what is speculated. What is clear is that sixty years in Dogon life is more than a number: it is the human-scale cycle through which one generation fully hands the living tradition to the next.</p>
<p>A child born in a Sigui year will be old when the next arrives. The ceremony thus spans the full arc of human working life. To be alive for two Sigui is to have lived a complete cycle. This is not mystical — it is a cultural technology for ensuring continuity across the length of a human generation, using the physical experience of aging and memory rather than written records.</p>

<h4>Sigi So — The Language of the Ancestors</h4>
<p>The <em>Sigi So</em> is a secret ceremonial language used during the Sigui and transmitted only at this ceremony. It is not the everyday Dogon language (Dogon-so). It is a specialized register carrying the vocabulary, formulas, and cadences of ancestral transmission. Learning Sigi So means entering a lineage of speakers that stretches back, in principle, to the first Sigui after the first ancestor's death.</p>
<p>This is transmission as identity. To speak Sigi So correctly is to be connected to every Dogon man who spoke it before you and to every one who will speak it after. Language is not merely a communication tool; it is a carrier of lineage.</p>

<h4>The Great Mask</h4>
<p>Central to the Sigui is the <em>imina na</em> — the great mask, also called the serpent mask. This tall wooden structure, sometimes over ten meters, is carved at the beginning of each Sigui cycle and kept in a cave sanctuary afterward, joining the masks of previous cycles. The cave becomes a record of time: each mask a layer, each layer a generation, the whole a physical archive of the Sigui's unbroken chain.</p>

<facts>Sixty-year cycle::Spans a human working lifetime, transmits knowledge generation to generation|Sigi So::Secret ceremonial language, spoken only during Sigui|Imina na::Great mask carved for each Sigui, stored in ancestral caves|Awa society::Initiated men responsible for mask ceremonies and Sigui performance</facts>

<reflect>
What does it mean to design a knowledge transmission system around the full arc of a human lifetime — so that each person can only be present for one full cycle?
The cave storing the great masks becomes a physical archive of time. What does it mean to make time visible, layer by layer, in a single place?
The Sigui transmits the sacred language across sixty years. What would it take, in your own community or tradition, to ensure that something essential survived a full human generation?
</reflect>
`
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
              content: `\n<p class=\"lead\">The Nasadiya Sukta (Rigveda 10.129) is one of the most philosophically sophisticated creation hymns in any human tradition. Its name comes from its opening: <strong>\"Na asit\"</strong> — \"Not then was.\" What does it mean to begin a creation story by describing what did NOT exist? This single choice reveals a radically different approach to cosmology.</p>\n\n<h4>Not Being & Pure Potential</h4>\n<p>The Nasadiya begins: <em>\"Not then was nor not-was; there was no sky nor the heavens beyond. What stirred? Where? And in whose protection? What was the water, the deep and mighty water?\"</em></p>\n<p>The Nasadiya does not posit a creator god who shapes pre-existing material. It begins in a state that is neither being nor non-being — what Hindu philosophy calls <strong>Brahman</strong>, the ultimate undifferentiated reality. From this state of pure potential, without external agent or command, the universe emerges through an inherent principle of manifestation.</p>\n\n<callout>Modern quantum cosmology describes something strikingly similar: the universe may have emerged not from \"nothing\" (which itself requires definition) but from a state of quantum potential — described mathematically but not physically manifest. The Nasadiya\'s \"not-being and being\" resonates with quantum superposition: a state that is neither definitively this nor that, until the act of emergence/observation collapses potential into actual.</callout>\n\n<h4>Emergence Without External Creator</h4>\n<p>The Nasadiya concludes: <em>\"Whence this creation hath arisen, perhaps it formed itself, or perhaps it did not. The one who looks down on it in the highest heaven, only he knows, or perhaps even he does not know.\"</em></p>\n<p>This is radical philosophical honesty: the text acknowledges uncertainty at the very heart of the cosmological question. It does not claim final knowledge. It describes a process of emergence that is fundamentally self-organizing and mysterious — not reducible to simple causation by external will.</p>\n\n<reflect>\nWhat is philosophically significant about a creation hymn that begins by describing what did NOT exist — and ends by admitting even the highest observer may not know the ultimate source?\nHow does the Nasadiya\'s state of neither being nor non-being compare with Nun, Pō, and Te Kore — and where must the comparison stop?\nWhat changes when a sacred text invites honest uncertainty rather than requiring the reader to claim certainty they do not have?\n</reflect>\n`
            },
            {
              id:       'vd-brahma-cycles',
              num:      'VD·02',
              title:    'Brahma Cycles — Time at Cosmic Scale',
              readTime: '11 min',
              content: `\n<p class=\"lead\">Hindu cosmology structures time in cycles within cycles — a nested hierarchy of temporal organization. The smallest unit is the <strong>paramanu</strong> (smallest particle), and time scales up through increasingly vast cycles called <strong>yugas</strong> (ages) and <strong>kalpas</strong> (cosmic days).</p>\n\n<h4>The Four Yugas — Cosmic Ages</h4>\n<p>A full cosmic cycle consists of four yugas:</p>\n<ul>\n<li><strong>Satya Yuga</strong> — The Age of Truth. Dharma (cosmic order) is perfect. Humans live in harmony. Duration: 1,728,000 years.</li>\n<li><strong>Treta Yuga</strong> — The Age of Ritual. Dharma begins to decline. Humans must work. Duration: 1,296,000 years.</li>\n<li><strong>Dvapara Yuga</strong> — The Age of Doubt. Dharma erodes further. Conflict increases. Duration: 864,000 years.</li>\n<li><strong>Kali Yuga</strong> — The Age of Darkness/Conflict. Dharma nearly disappears. Humanity struggles. Duration: 432,000 years.</li>\n</ul>\n<p>One complete cycle of four yugas = 4,320,000 years = one <strong>Mahayuga</strong> (great age). One thousand Mahayugas = one Kalpa (cosmic day). One Brahman lifetime = 311 trillion years, then the universe collapses into chaos, and the cycle begins anew.</p>\n\n<callout type=\"bridge\">Modern cosmology describes the universe as approximately 13.8 billion years old, with a finite lifespan measured in trillions of years before heat death. The Hindu model posits a similar vastness and cyclical renewal. While the exact numbers differ, the structural intuition is the same: the universe is old beyond human comprehension, operates in grand cycles, and will eventually return to primal state before beginning again.</callout>\n\n<h4>Dharma — The Principle of Order</h4>\n<p>Crucial to this cosmology is the concept of <strong>Dharma</strong> — cosmic order, ethics, righteousness, the natural law that maintains the universe\'s function. As the universe ages through the yugas, Dharma naturally declines. This is not moralistic judgment — it is structural inevitability, like entropy. The cycle must complete itself; a new cycle must begin.</p>\n\n<reflect>\nHow does understanding time as vast, cyclical, and eventually self-renewing change your relationship with urgency, failure, or loss in daily life?\nWhat does the natural decline of Dharma through the yugas teach about the nature of order — that it requires active maintenance, not passive assumption?\nHow do Hindu cosmological timescales compare structurally with modern science\'s timeline for the universe — what does the convergence reveal?\n</reflect>\n`
            },
            {
              id:       'vd-vedic-astronomy',
              num:      'VD·03',
              title:    'Vedic Mathematics & Astronomy — Numbers of the Gods',
              readTime: '10 min',
              content: `\n<p class=\"lead\">Ancient Indian civilization developed mathematics and astronomy of stunning sophistication. The Vedas contain astronomical data — observations of planetary motion, predictions of eclipses, descriptions of the structure of the cosmos in terms of mathematical relationships.</p>\n\n<h4>Decimal Mathematics & the Zero</h4>\n<p>Indian mathematicians developed the decimal system and the concept of <strong>zero</strong> as a number, not merely a placeholder. This innovation — which seems obvious now — was revolutionary. It enabled calculation at scales that were practically impossible with Roman or Greek numerals. The very concept of zero required philosophical sophistication: the recognition that non-being (zero) could be a mathematical entity with computational reality.</p>\n\n<callout>The term \"zero\" comes from the Sanskrit <em>sunya</em>, meaning \"empty\" or \"void.\" This carries philosophical weight: zero is not nothing in the sense of annihilation. It is the fertile emptiness — like the Brahman of the Nasadiya Sukta. From zero (potential), calculations unfold, structures emerge. The mathematics of the Vedas and the metaphysics of the Nasadiya teach the same lesson: potential is real, void is generative.</callout>\n\n<h4>Astronomical Precision</h4>\n<p>Vedic texts contain descriptions of planetary positions and motions with precision that matches modern observation. The Aryabhata, composed around 500 CE, describes the cosmos as heliocentric — the Sun at the center, planets orbiting. This description predates Copernicus by 1,000 years. Whether this was theoretical model or observational discovery remains debated — but the sophistication of Vedic astronomy is beyond question.</p>\n\n<reflect>\nWhat does the zero — rooted in Sanskrit sunya, meaning fertile emptiness — reveal about the philosophical depth embedded in mathematical innovation?\nHow does placing Aryabhata\'s heliocentric model a thousand years before Copernicus change the conventional history of astronomical knowledge?\nWhere do you see mathematical precision and metaphysical insight arising from the same source in any tradition you have studied?\n</reflect>\n`
            },
            {
              id:       'vd-dharma-rta',
              num:      'VD·04',
              title:    'Dharma and Ṛta — Cosmic Order and Right Action',
              readTime: '12 min',
              content: `
<p class="lead">Before there was Dharma, there was <strong>Ṛta</strong>. Ṛta is one of the oldest concepts in the Vedas — it is the cosmic order itself: the principle that keeps the sun rising, the seasons turning, the rivers flowing, the moral fabric of the universe intact. Dharma, which comes later in Sanskrit philosophical development, is the human application of Ṛta — the right action, right conduct, right role that aligns a person with cosmic order.</p>

<h4>Ṛta — The Rhythm Before Ethics</h4>
<p>In the Rigveda, Ṛta is not a rule or a law in the legal sense. It is a structural reality — more like the laws of physics than the laws of a legislature. The sun follows Ṛta when it rises. The rains follow Ṛta when they come in their proper season. A person follows Ṛta when they act in accordance with their nature, their role, and their relationships.</p>
<p>The custodians of Ṛta in the cosmic order are Varuna and Mitra — two Vedic deities who watch the moral fabric of the world with the same care that forces of nature watch the physical fabric. Violation of Ṛta — what the Vedas call <em>anṛta</em> — does not merely offend; it disrupts the cosmic order itself. Wrong action has cosmological consequences.</p>

<h4>Dharma Emerging from Ṛta</h4>
<p>Dharma carries the same root as the Sanskrit <em>dhṛ</em> — "to hold, to support, to maintain." Dharma is what holds the world together. In different contexts it means: cosmic law, individual duty, ethical conduct, the path of right living, the teaching of a tradition. Its many meanings are not contradictions — they are the same principle at different scales: cosmic, social, individual, momentary.</p>
<p>The Bhagavad Gita — composed centuries after the Rigveda — places Dharma at the center of its ethical teaching. Arjuna hesitates before battle. Krishna's teaching is fundamentally about Dharma: about acting according to one's deepest nature and role, without attachment to results. This is not cold calculation; it is cosmic alignment.</p>

<callout type="bridge">The concept of a natural moral order embedded in the structure of the cosmos appears across many traditions: Kemetic Maʻat, Confucian Tian-ming (Mandate of Heaven), Kānaka Maoli Ea (sovereignty/breath), Aboriginal Lore. Each tradition develops its own form of this insight. What the convergence suggests is that the intuition of cosmic moral order — that right action aligns with something larger than personal preference — is among humanity's most widely-shared philosophical discoveries.</callout>

<h4>Right Action Without Attachment</h4>
<p>One of the Gita's most important teachings is <em>nishkama karma</em> — action without attachment to results. This is not apathy. It is the understanding that Dharma-aligned action is complete in itself, regardless of outcome. The archer who shoots correctly has fulfilled their Dharma whether the arrow lands or not. Right action is its own justification — not a means to a separate end.</p>

<reflect>
Ṛta treats cosmic order and moral order as the same principle at different scales. What does this suggest about the relationship between physics and ethics — between how the universe works and how we ought to act?
Dharma is often translated as "duty," but that translation is impoverished. What is lost when a concept of cosmic alignment is reduced to obligation?
The teaching of action without attachment to results is offered to someone paralyzed by fear of consequences. What makes this teaching potentially liberating rather than merely cold?
</reflect>
`
            },
            {
              id:       'vd-purusha',
              num:      'VD·05',
              title:    'Purusha — The Cosmic Person as All That Is',
              readTime: '11 min',
              content: `
<p class="lead">The <strong>Purusha Sukta</strong> (Rigveda 10.90) describes the universe not as an empty container filled with matter, but as a <em>person</em> — a vast, conscious being whose body is all of existence. Sky, earth, sun, moon, directions, time, social order, fire, seasons: all emerge from the sacrifice of this primordial being. This hymn rewrites what cosmology can be.</p>

<h4>Purusha — The Original Thousand-Limbed Being</h4>
<p>The Purusha Sukta opens: <em>"Purusha has a thousand heads, a thousand eyes, a thousand feet. Enveloping the earth from all sides, he stood ten finger-breadths beyond."</em> Purusha is not merely large — he exceeds the cosmos he fills. He is three-quarters immortal in the celestial realm; only one-quarter descends into the manifest world of time and matter.</p>
<p>This image of a being who exceeds the world it generates carries an important metaphysical claim: reality is larger than what appears. The manifest world is a portion of Purusha, but Purusha overflows it. Brahman — ultimate reality — cannot be contained by its own creations.</p>

<h4>Sacrifice as Creation</h4>
<p>The gods perform a sacrifice of Purusha himself — and from his sacrificed body, the entire world is constituted. From his mind comes the moon. From his eye, the sun. From his mouth, Indra and Agni. From his breath, the wind. From his navel, the sky's middle realm. From his head, the highest heaven. From his feet, the earth. From his ear, the directions.</p>
<p>This is cosmology as anatomy: the world is a body, and each part of the world corresponds to a part of the original being. The sun is not merely a distant hot object — it is Purusha's eye, still looking. The earth is not merely ground — it is Purusha's feet, still supporting. Creation is not finished and done; it is the ongoing body of the one who generated it.</p>

<h4>Microcosm and Macrocosm</h4>
<p>The Purusha Sukta establishes one of Vedic philosophy's most enduring principles: the human body recapitulates the cosmic body. The same correspondences that organize the cosmos organize the person. The sun corresponds to the eye; the moon to the mind; the wind to the breath; the directions to the ears. To know your own body is to know, in miniature, the structure of the universe. This principle becomes explicit in later Vedic philosophy: <em>Brahman</em> (the ultimate reality of the cosmos) equals <em>Atman</em> (the ultimate reality of the individual).</p>

<twocol left="Purusha Sukta (Vedic)" right="Kanaka Maoli Kumulipo">The cosmos as sacrificed body — reality emerging from the offering of a primordial person, whose limbs become sky, earth, sun, moon, social order.||The Kumulipo as genealogical chant — life forms emerging in sequence from primordial Pō, each birth a line, the chant itself the living record of the descent.</twocol>

<reflect>
What changes in how you relate to the sun, the wind, the earth when they are understood as parts of a living body rather than as physical forces operating mechanically?
The Purusha exceeds the cosmos he fills — Brahman overflows its own creations. What does this claim protect against in a philosophy of the ultimate?
The equation of Brahman (cosmic ultimate) with Atman (personal ultimate) is one of the most radical claims in human philosophy. What are its implications for how you understand your own identity?
</reflect>
`
            }
          ]
        },
        {
          id:    'vedic-transmission',
          title: 'Voice, Fire & Living Practice',
          emoji: '🔥',
          desc:  'How Vedic knowledge was preserved, transmitted through fire ritual, and embodied in practice.',
          lessons: [
            {
              id:       'vd-oral-transmission',
              num:      'VD·06',
              title:    'The Rigveda as Living Voice — Oral Transmission',
              readTime: '13 min',
              content: `
<p class="lead">The Rigveda is approximately 3,500 years old. It was transmitted orally — memorized and recited with exact pitch, rhythm, and pronunciation — for most of that time without a single written word. The manuscripts that eventually encoded it were produced centuries after the oral tradition was already ancient. That the text we have today matches those manuscripts with extraordinary precision is one of the greatest demonstrations of oral transmission in human history.</p>

<h4>Svara — The Three Tones</h4>
<p>Vedic Sanskrit uses a pitch accent system with three tones: <em>udātta</em> (raised), <em>anudātta</em> (lowered), and <em>svarita</em> (falling). These tones are not ornamental — they are part of the text itself. A word chanted at the wrong pitch carries a different meaning or no meaning at all. The tradition teaches that incorrectly chanted Veda can cause harm rather than the blessing it is meant to produce. This is not superstition; it is the understanding that the precise form of the chant is what gives it its power.</p>
<p>Every syllable's tone is specified. Every vowel's length is measured. Every consonant's point of articulation is taught. The result is a phonological system of extraordinary precision — one that linguists today use to reconstruct the sound system of Proto-Indo-European, the ancestor language of Sanskrit, Greek, Latin, and most European languages.</p>

<h4>Padapatha and Multiple Recitation Forms</h4>
<p>To ensure that chanted Veda could not be corrupted over time, the tradition developed multiple recitation forms:</p>
<ul>
<li><strong>Saṃhitā pāṭha</strong> — the continuous, natural chant</li>
<li><strong>Pada pāṭha</strong> — word-by-word recitation, stripping sandhi (sound-changes at word boundaries)</li>
<li><strong>Krama pāṭha</strong> — overlapping recitation: AB, BC, CD... each pair twice</li>
<li><strong>Jaṭā pāṭha</strong> — braided recitation: AB BA AB, BC CB BC...</li>
<li><strong>Ghana pāṭha</strong> — the most complex, forward and backward multiple times</li>
</ul>
<p>A student who memorized only the saṃhitā pāṭha could, in theory, corrupt it unconsciously over generations. By also memorizing the pada pāṭha and krama pāṭha, any variation becomes detectable: the derived forms would not match. The tradition built error-correction directly into the transmission protocol.</p>

<callout>UNESCO recognized Vedic chanting as an Intangible Cultural Heritage of Humanity in 2003. Living communities of Vedic chanters — particularly in certain regions of Kerala, Tamil Nadu, and Andhra Pradesh — still preserve these recitation forms in the same way they have been transmitted for millennia. This is not a museum artifact. It is a living transmission practice.</callout>

<h4>What This Demands of a Learner</h4>
<p>A young man beginning traditional Vedic training might spend eight to twelve years studying before being qualified to teach. He will have memorized thousands of hymns in multiple recitation forms, learned the grammar of an archaic Sanskrit that differs from the classical Sanskrit of later literature, mastered the phonological rules governing every sound change at every word boundary. This level of investment makes the transmission personal: the text lives in a body, not a book.</p>

<reflect>
The Vedic tradition built error-correction into the transmission protocol itself — memorizing multiple forms ensures that corruption would be detectable. What does this level of systematic care about precision reveal about what the tradition considered at stake?
A text that lives in a body — that must be learned through years of physical practice, breath, and tone — has a different relationship to the people who carry it than a text that lives on a page. What is different?
What would it mean to apply this standard of precision to any knowledge you consider important — to know it so completely that you could detect corruption by checking it against itself?
</reflect>
`
            },
            {
              id:       'vd-yajna-fire',
              num:      'VD·07',
              title:    'Agni and the Sacred Fire — Yajna as Cosmic Maintenance',
              readTime: '12 min',
              content: `
<p class="lead"><strong>Agni</strong> is the first word of the Rigveda. The Vedas open not with cosmology or abstract philosophy but with fire — the domestic, sacrificial, digestive, celestial fire that connects all realms of existence. Agni is not simply a deity of fire. He is fire as cosmic principle: the force of transformation, the carrier between worlds, the tongue that receives offerings and transmits them to the divine.</p>

<h4>Agni in All Fires</h4>
<p>In Vedic understanding, every fire is Agni. The cooking fire in every home is Agni. The digestive fire in every stomach is Agni. The lightning that strikes from cloud to earth is Agni. The sun is Agni in his celestial form. This is not poetic metaphor — it is an ontological claim: fire, wherever it appears, is a single principle expressing itself at different scales and in different contexts.</p>
<p>This makes Agni intimate in a way that distant cosmic deities are not. He is present at every meal, at every sunrise, at every fever, at every moment of digestion and transformation. The sacred fire of the yajna is not importing something foreign into domestic life; it is making visible the cosmic force already present in it.</p>

<h4>Yajna — The Mechanics of Offering</h4>
<p>The <em>yajna</em> is the Vedic fire sacrifice — the central ritual practice of the Vedic tradition. At its most basic: a fire is built according to precise specifications, priests chant hymns, offerings (grain, ghee, soma, wood) are placed into the fire at specific moments in the chant, and Agni receives them and carries them to the appropriate deities and cosmic forces. The cosmos is maintained by this exchange.</p>
<p>The cosmological logic of yajna is explicit in the texts: the gods maintain cosmic order; the gods are sustained by offerings; offerings are carried by Agni; therefore, performing yajna correctly maintains the cosmos. This is not magical thinking — it is a cosmological ecology, a model of reciprocal maintenance in which humans are participants rather than passive beneficiaries.</p>

<h4>Three Sacred Fires</h4>
<p>Traditional Vedic householders maintained three sacred fires at all times:</p>
<ul>
<li><strong>Gārhapatya</strong> — the householder's fire, perpetual, lit from the original family lineage fire</li>
<li><strong>Āhavanīya</strong> — the offering fire, built facing east, used for oblations</li>
<li><strong>Dakṣiṇāgni</strong> — the southern fire, facing ancestral spirits, used for protection</li>
</ul>
<p>These three fires triangulate the ritual space. The householder lives and works within this triangulation — surrounded by fire that marks the boundary between ordinary space and sacred space. This is not occasional ceremony. It is the permanent structure of a life lived as cosmic participation.</p>

<callout type="bridge">The principle of fire as transformative intermediary — connecting the human world to the divine through sacrifice and offering — appears across many traditions: Kemetic incense and offering ritual, Aboriginal fire ceremony, Hawaiian imu preparation as sacred act, Christian Eucharist as transformative consumption. Each tradition develops its own form. What they share is the understanding that transformation — not merely transmission — is what makes offering sacred.</callout>

<reflect>
If Agni is the same principle in the cooking fire, the digestive fire, and the sacrificial fire, what does this say about the relationship between the sacred and the everyday?
Yajna is cosmic maintenance — humans participate in sustaining the order they benefit from. How does this change the meaning of gratitude, offering, and reciprocity?
The householder's fire is lit from an ancestral lineage fire and must never go out. What is being protected and transmitted in that unbroken flame?
</reflect>
`
            },
            {
              id:       'vd-yoga-cosmos',
              num:      'VD·08',
              title:    'The Body as Universe — Yoga and Microcosm',
              readTime: '11 min',
              content: `
<p class="lead">One of the most distinctive and enduring contributions of Vedic and later Hindu philosophy is the insistence that the body and the cosmos are structured by the same principles. This is not metaphor. It is a knowledge claim: to know your own body deeply — through practice, through breath, through sustained attention — is to know the structure of the universe. <strong>Yoga</strong> is the technology through which this knowledge is accessed.</p>

<h4>Brahman = Atman</h4>
<p>The Upanishads — the philosophical texts that elaborate and develop Vedic thought — state this principle with extraordinary directness: <em>Brahman</em> (the ultimate reality of the cosmos, the source behind all appearances) equals <em>Atman</em> (the ultimate reality of the individual self, the witnessing awareness behind all thought). These are not two things that are similar. They are one thing seen from two directions.</p>
<p>This equation is one of the most radical claims in human philosophy. It dissolves the distinction between observer and observed, between self and universe, between personal liberation and cosmic realization. To know your own deepest nature is to know the deepest nature of reality itself. The two inquiries — "Who am I?" and "What is the cosmos?" — arrive at the same answer.</p>

<h4>The Subtle Body — Prāṇa and the Chakras</h4>
<p>Vedic and tantric philosophy describes a <em>subtle body</em> that underlies and interpenetrates the physical body. This subtle body is composed of prāṇa — life force, breath, the animating current — organized through channels (nāḍīs) and centers (chakras). The chakras correspond to levels of cosmic reality as well as to psychological and physiological functions. The base chakra relates to earth and physical survival; the crown chakra relates to pure awareness and the unmanifest source; the chakras between organize the full range of human experience in a map that is simultaneously anatomical and cosmological.</p>
<p>This is the Purusha principle applied inward: if the cosmos is a body, then the body is a cosmos. Every organ, every breath, every posture is a cosmological statement.</p>

<h4>Yoga as Epistemic Practice</h4>
<p><em>Yoga</em> means "union" — from the same root as the English word "yoke." It is the practice of unifying the individual with the cosmic, the personal with the universal, the moving with the still. In its many forms — asana (posture), pranayama (breath), dhyana (meditation), jnana (inquiry), bhakti (devotion) — yoga is not primarily exercise or relaxation. It is an epistemological practice: a method for arriving at direct knowledge of the nature of the self and the cosmos.</p>
<p>This is why Vedic philosophy is not merely theoretical. It demands practice. The texts describe the terrain; the practice navigates it. A philosopher who reads about Atman but does not practice has knowledge about something. The practitioner who reaches Atman in direct experience has knowledge of something. The Vedic tradition consistently distinguishes between these two kinds of knowing.</p>

<reflect>
If Brahman equals Atman — if the ultimate reality of the cosmos is identical to the ultimate reality of the self — what becomes possible in how you conduct the inquiry "Who am I?"?
The subtle body maps cosmological principles onto physical anatomy. What does it mean to inhabit a body that is also a cosmological argument?
Yoga distinguishes between knowing about and knowing directly through practice. Where in your own life have you experienced this distinction — where did understanding shift from intellectual to something more immediate?
</reflect>
`
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
              content: `\n<p class=\"lead\">Across the Australian continent, thousands of stories form a vast interconnected network called the <strong>Songlines</strong> or <strong>Dreaming Tracks</strong>. A Songline is not merely a story or a poem or a map. It is all of these simultaneously — a narrative that simultaneously describes the journey of ancestral beings, encodes the geography of the continent, preserves kinship relationships, teaches practical ecological knowledge, and connects the living present to the sacred time of the Dreaming.</p>\n\n<h4>The Dreaming — Eternal Creative Time</h4>\n<p>The Dreaming (or Dreamtime) is not a time in the past — it is not historical. Rather, it is a permanent dimension of reality, accessible through song, story, ceremony, and connection to Country. During the Dreaming, ancestral beings — Dreamings — traveled across the landscape, shaping the features we see today: mountains, rivers, rock formations. Their actions created relationships between places, between peoples, between humans and the land itself.</p>\n<p>The Songlines trace these ancestral journeys. To sing the Songline is to travel the path, to recall the story, to reconnect with the sacred power of the place, and to maintain the relationship between the human community and Country.</p>\n\n<callout>A single Songline might stretch thousands of kilometers across the continent, passing through the territories of dozens of different Aboriginal nations, each of whom maintain their own portion of the story, their own verses, their own relationship to the places the Songline traverses. The entire continent is covered by intersecting, overlapping Songlines, forming a vast poetic geography encoded in the bodies and voices of the people who live there.</callout>\n\n<h4>Knowledge Encoded in Story</h4>\n<p>Within the Songlines are encoded practical, actionable knowledge: the locations of water sources in the desert; which plants are edible and when to harvest them; animal migration patterns; seasonal indicators; the locations of sacred sites; the kinship relationships between groups; protocols for sharing land and resources. This knowledge is preserved not in written form, but in narrative structure — in the characters, their actions, the geographic features they created, the songs that describe them.</p>\n<p>To know the Songline is to possess a map, a history, a spiritual practice, and a set of ecological knowledge simultaneously. The distinction between \"story\" and \"information,\" between \"sacred\" and \"practical,\" between \"past\" and \"present,\" does not apply. These categories are creations of literate, separated from the land cultures. For Aboriginal peoples, knowledge and story, place and meaning, past and present are unified.</p>\n\n<reflect>\nWhat is lost when knowledge is separated from story, place, and the body — when information is extracted from the living context that made it meaningful?\nHow does the unity of history, map, spiritual practice, and ecological knowledge in the Songlines challenge the modern tendency to compartmentalize disciplines?\nWhat would it mean for your own community\'s knowledge to be encoded in the landscape itself — spoken through land rather than stored in archives?\n</reflect>\n`
            },
            {
              id:       'dt-celestial-navigation',
              num:      'DT·02',
              title:    'Stars & Navigation — The Celestial Songlines',
              readTime: '11 min',
              content: `\n<p class=\"lead\">The Aboriginal peoples of Australia were sophisticated navigators who used the stars to orient themselves across vast distances of desert and ocean. The stars themselves form Songlines — narratives written in the night sky that tell stories and encode navigational information.</p>\n\n<h4>The Pleiades — Seven Sisters</h4>\n<p>One of the most widespread Songlines across Aboriginal Australia involves the Pleiades — known as the Seven Sisters (or Pleiadies, or Makara). The story of the Seven Sisters appears in hundreds of variations across different Aboriginal nations, but the core narrative is consistent: celestial beings, often represented as young women, whose movements and positions encode seasonal knowledge and navigation information.</p>\n\n<h4>Orion & the Southern Cross</h4>\n<p>Major constellations visible from Australia — including Orion and the Southern Cross — are incorporated into Songlines and navigation knowledge. The Southern Cross (Crux) particularly served as a reliable orientation marker: it circles Polaris Australis, nearly directly above the southern celestial pole. For navigators traveling across deserts or open ocean, knowing the position of the Southern Cross provided constant orientation.</p>\n\n<callout type=\"bridge\">Modern GPS satellites provide the same function today — orienting travelers across vast distances by reference to fixed celestial points. Aboriginal navigators achieved similar precision through direct observation and encoded knowledge rather than technological instrument. The principle is identical: know the positions of reliable celestial markers, use them to orient yourself across terrain where ground-based landmarks are unavailable or unreliable.</callout>\n\n<h4>Seasonal Astronomy</h4>\n<p>Aboriginal astronomers tracked not just locations of stars, but their rising and setting positions throughout the year — which shift as Earth\'s axis tilts through its yearly cycle. This created a celestial calendar: the rising of particular stars signaled particular seasons — times to prepare for migration of animals, times to harvest certain plants, times for ceremony. The night sky was a living calendar, constantly teaching those who knew how to read it.</p>\n\n<reflect>\nHow does Aboriginal celestial navigation challenge the assumption that sophisticated science requires modern technology?\nWhat does it mean to be truly fluent in the night sky — to read it as calendar, map, story, and seasonal guide simultaneously?\nHow does connecting star knowledge to the seasonal behavior of animals and plants create a more complete intelligence than any single scientific discipline alone?\n</reflect>\n`
            },
            {
              id:       'dt-country-consciousness',
              num:      'DT·03',
              title:    'Country as Living — Kinship & Custodianship',
              readTime: '10 min',
              content: `\n<p class=\"lead\">At the heart of Aboriginal philosophy is the understanding that <strong>Country</strong> — the land, water, sky, creatures, plants, and people — is alive, conscious, and relational. This is not metaphor. Country is person. The Aboriginal relationship to land is not that of owner to property, or even steward to resource. It is kinship.</p>\n\n<h4>Country Speaks — Language of Connection</h4>\n<p>To \"know Country\" is to speak its language, to understand its structures, to recognize one\'s relationship within its patterns. Country communicates through the Songlines, through the behavior of animals, through the arrangement of rocks and water, through the positions of stars. Those who are deeply connected to Country learn to read these communications — they become fluent in the language their Country speaks.</p>\n\n<h4>Custodianship & Obligation</h4>\n<p>Aboriginal peoples are not owners of Country — they are custodians, responsible for maintaining the relationships and obligations encoded in the Songlines. To perform ceremony at the right time in the right place is to strengthen the connection, to maintain the sacred relationships, to ensure that the land continues to provide, that the seasons continue to cycle, that the creatures and plants continue to flourish. This is not charity offered by humans to nature — it is reciprocal relationship. Country cares for those who care for it.</p>\n\n<callout>Modern environmental science has largely adopted a similar understanding: ecosystems are not resources to be extracted but living systems in which humans are participants, with obligations and relationships. The Aboriginal understanding preceded Western ecology by thousands of years. It is knowledge carried in the bodies, ceremonies, and Songlines of living people — knowledge that Western science is finally learning to recognize and honor.</callout>\n\n<reflect>\nWhat becomes possible in land stewardship when Country is understood as a conscious person rather than a resource or property?\nHow does the distinction between owner and custodian change the obligations, authority, and responsibilities that come with place?\nWhere do you experience a living relationship with a place — where does a particular landscape feel like it communicates, teaches, or requires something of you?\n</reflect>\n`
            },
            {
              id:       'dt-protocol-country',
              num:      'DT·04',
              title:    'Protocol First — Many Nations, Many Dreamings',
              readTime: '14 min',
              content: `
<p class="lead">The first responsibility in studying Aboriginal Australian knowledge is protocol. <strong>Dreaming</strong>, <strong>Songlines</strong>, and <strong>Country</strong> are not generic myth categories. They belong to specific peoples, languages, places, Elders, families, and custodial responsibilities. Some knowledge is public. Some is restricted. Some is gendered, initiated, seasonal, or place-bound.</p>

<h4>Not One Story</h4>
<p>Aboriginal Australia includes hundreds of Nations and language groups. A public lesson can name broad patterns, but it cannot replace local authority. A story from one Country is not automatically transferable to another. Even shared themes, such as ancestral journeys or star knowledge, are held through specific custodianship.</p>

<h4>Public Knowledge and Restricted Knowledge</h4>
<p>Some public exhibitions, community resources, and scholarship share orientation-level knowledge about Songlines and Country. That does not make all knowledge open. A respectful learner asks: Who has authority to tell this? What has been made public? What should remain unspoken here? What responsibility follows from knowing even a little?</p>

<facts>Country::Place as living relation|Custodianship::Authority with responsibility|Protocol::Right way of approaching knowledge|Public knowledge::Orientation, not ownership</facts>

<h4>Why Protocol Is Knowledge</h4>
<p>Protocol is not a gate placed outside knowledge. It is part of the knowledge system. It protects Country, people, ceremony, memory, and sacred relationship from being extracted. Without protocol, learning becomes taking. With protocol, learning becomes accountable relation.</p>

<callout type="bridge">Careful bridge: this protocol boundary resonates with kapu, tapu, and other sacred restriction systems, but it should not be collapsed into them. Each tradition defines authority and access through its own law and living practice.</callout>

<reflect>
What changes when protocol is treated as knowledge rather than obstacle?
How can curiosity become extractive if it ignores custodianship?
What should this platform refuse to flatten or expose?
</reflect>
`
            },
            {
              id:       'dt-seven-sisters',
              num:      'DT·05',
              title:    'Seven Sisters — Songline Across Sky and Country',
              readTime: '16 min',
              content: `
<p class="lead">The <strong>Seven Sisters</strong> is one of the best-known public examples of a major Songline crossing vast distances of Country and sky. It is connected with the Pleiades star cluster, but it is not simply an astronomy story. It is also travel, kinship, danger, law, place memory, performance, and custodianship.</p>

<callout type="gold">Public orientation only: Seven Sisters knowledge is held by specific custodians across different Countries. This lesson does not retell restricted details or replace community authority.</callout>

<h4>Sky and Land Together</h4>
<p>The Seven Sisters shows how sky knowledge and land knowledge can be one system. Stars are not detached objects above the world. Their movements are read with places, routes, relationships, ceremonies, and seasonal meaning. The sky is part of Country.</p>

<h4>Songline as Shared but Not Ownerless</h4>
<p>A Songline may cross many territories. Each group may hold its own segment, language, performance responsibility, and authority. The line connects Countries without making them the same. Connection does not erase difference; it requires protocol between custodians.</p>

<h4>Teaching Through Movement</h4>
<p>Because the story moves, it teaches movement. It can encode direction, stopping places, resources, warnings, relationships, and moral consequence. The learning is not only heard. It is sung, walked, danced, painted, remembered, and renewed.</p>

<facts>Pleiades::Star cluster linked with Seven Sisters traditions|Songline::Route of story, place, song, and obligation|Custodians::Those with responsibility to hold and transmit|Movement::Knowledge carried through path and performance</facts>

<h4>The Lesson for This Platform</h4>
<p>The Seven Sisters gives a model for cross-cultural learning itself: connection must travel with consent, specificity, and care. A bridge is not a shortcut. It is a responsibility to honor each place it touches.</p>

<reflect>
How can a story be both sky map and law?
What is the difference between shared knowledge and ownerless knowledge?
How should a learning platform behave when knowledge crosses many communities?
</reflect>
`
            },
            {
              id:       'dt-emu-sky',
              num:      'DT·06',
              title:    'Emu in the Sky — Reading Dark Constellations',
              readTime: '15 min',
              content: `
<p class="lead">Many Aboriginal sky traditions read not only bright stars, but also the dark spaces of the Milky Way. The public example often called the <strong>Emu in the Sky</strong> shows an emu-shaped figure formed by dark nebulae rather than by star-to-star lines. This trains a different kind of attention: meaning may appear in shadow, absence, and relation.</p>

<h4>Seeing the Dark Pattern</h4>
<p>Western popular astronomy often teaches constellations as bright points connected by imaginary lines. The Emu in the Sky asks the learner to read dark cloud forms within the Milky Way. The figure changes orientation through the year, and in some public accounts it is associated with seasonal knowledge connected to emu behavior and egg availability.</p>

<h4>Seasonal Intelligence</h4>
<p>Sky knowledge is not abstract decoration. It can help mark timing: when animals behave in certain ways, when foods are available, when ceremony or travel is appropriate, when Country is changing. The sky becomes a calendar because Country, sky, animals, and people are read together.</p>

<h4>Darkness as Information</h4>
<p>This lesson is powerful beside the Kumulipo Pō and Māori Te Pō materials: darkness is not ignorance. It can be origin, shelter, pattern, or sign. But the resonance must stay careful. The Emu in the Sky belongs to Aboriginal sky knowledge and Country-specific teaching.</p>

<facts>Dark constellations::Figures seen in dark Milky Way clouds|Milky Way::Sky river and seasonal field|Seasonal marker::Timing held through observation|Attention::Learning to see pattern beyond bright points</facts>

<callout type="bridge">Modern astronomy can describe dark nebulae as dust clouds blocking starlight. Aboriginal astronomy can hold those same visible patterns within Country, season, story, law, and responsibility. Parallel description is useful only when it does not reduce one system to the other.</callout>

<reflect>
What can darkness reveal that bright points hide?
How does seasonal knowledge change when sky and animal behavior are read together?
Where do you need to train attention to the negative space of a pattern?
</reflect>
`
            },
            {
              id:       'dt-care-country',
              num:      'DT·07',
              title:    'Caring for Country — Knowledge as Obligation',
              readTime: '15 min',
              content: `
<p class="lead">The Dreaming and Songlines do not end in storytelling. They become responsibility to <strong>care for Country</strong>. Country includes land, waters, sky, plants, animals, ancestors, sacred places, language, memory, and living communities. Caring for Country is therefore ecological, spiritual, legal, educational, and relational at once.</p>

<h4>Country Is Not a Resource Container</h4>
<p>If Country is treated only as resource, development site, scenery, or data, the relationship is broken before any decision begins. Country is living relation. Care is not sentimental. It is practical work: burning, protecting water, respecting sites, sustaining language, teaching children, and maintaining the obligations encoded in story and place.</p>

<h4>Knowledge Must Be Practiced</h4>
<p>Songlines hold knowledge, but knowledge is not complete until it is practiced with the right people, in the right place, with the right responsibility. This is why ceremony, walking, singing, art, and land care matter. They renew the relationship rather than merely representing it.</p>

<h4>Modern Pressure</h4>
<p>Mining, climate disruption, land dispossession, language loss, and careless tourism can all damage Country and the knowledge systems bound to it. Caring for Country asks a harder question than "What can be used?" It asks: What relation must be repaired, protected, or renewed?</p>

<facts>Caring for Country::Practical responsibility to living place|Language::Memory and law held in speech|Ceremony::Renewal of relationship|Repair::Restoring damaged relation</facts>

<callout>The deepest lesson is conduct. If Songlines are admired but Country is harmed, the knowledge has been turned into decoration. Respect becomes real through protection, repair, and accountable relationship.</callout>

<reflect>
What does your own place need protected, repaired, or listened to?
How can learning about Country avoid becoming tourism of sacred knowledge?
What would it mean for this platform to teach care, not just fascination?
</reflect>
`
            },
            {
              id:       'dt-nations-map',
              num:      'DT·08',
              title:    'Nations, Language Groups & Country — Many Dreaming Systems',
              readTime: '17 min',
              content: `
<p class="lead">There is no single Aboriginal "Dreamtime system" owned by all peoples in the same way. Aboriginal Australia is made of many <strong>Nations, language groups, Countries, clans, families, and custodial lineages</strong>. Dreaming knowledge is held through those specific relations. A respectful map begins with plurality.</p>

<callout type="gold">The list below is representative, not complete. AIATSIS maps hundreds of Aboriginal and Torres Strait Islander language, social, and nation groups. Names, spellings, boundaries, and authority are complex and should be checked with community sources.</callout>

<h4>Representative Nations and Language Groups</h4>
<table>
<thead><tr><th>Nation / Language Group</th><th>Broad Region</th><th>Learning Note</th></tr></thead>
<tbody>
<tr><td><strong>Yolŋu</strong></td><td>Northeast Arnhem Land</td><td>Rich ceremonial, kinship, sea Country, and song traditions with multiple Yolŋu languages and clans.</td></tr>
<tr><td><strong>Anangu</strong></td><td>Central desert / Uluru region</td><td>A broad name used by Pitjantjatjara, Yankunytjatjara, and related peoples; Tjukurpa is central to law and Country.</td></tr>
<tr><td><strong>Warlpiri</strong></td><td>Tanami Desert / Central Australia</td><td>Known for strong language continuity, jukurrpa/Dreaming law, art, ceremony, and desert Country knowledge.</td></tr>
<tr><td><strong>Arrernte</strong></td><td>Central Australia / Mparntwe Alice Springs region</td><td>Country, kinship, ancestral tracks, and place names carry deep local authority.</td></tr>
<tr><td><strong>Noongar</strong></td><td>Southwest Western Australia</td><td>Six-season ecological knowledge and many Noongar groups connect language, Country, and care.</td></tr>
<tr><td><strong>Kaurna</strong></td><td>Adelaide Plains</td><td>Language revitalization and Country-based knowledge remain central to contemporary cultural renewal.</td></tr>
<tr><td><strong>Kulin Nations</strong></td><td>Central Victoria / Melbourne region</td><td>Includes Wurundjeri, Boon Wurrung/Bunurong, Wadawurrung, Dja Dja Wurrung, and Taungurung peoples.</td></tr>
<tr><td><strong>Eora and Dharug</strong></td><td>Sydney basin</td><td>Names are used in complex local contexts; learning should attend to specific community authority.</td></tr>
<tr><td><strong>Wiradjuri</strong></td><td>Central New South Wales</td><td>One of the largest language groups in NSW, with strong contemporary language and cultural renewal.</td></tr>
<tr><td><strong>Palawa / Pakana</strong></td><td>Lutruwita / Tasmania</td><td>Continuing Aboriginal identity, language renewal, and Country connections challenge erasure narratives.</td></tr>
<tr><td><strong>Tiwi</strong></td><td>Tiwi Islands</td><td>Distinct island cultures, languages, ceremony, art, and kinship systems north of Darwin.</td></tr>
<tr><td><strong>Yorta Yorta</strong></td><td>Murray-Goulburn region</td><td>River Country, rights, law, and living cultural continuity are central to contemporary recognition.</td></tr>
</tbody>
</table>

<h4>Regional Identity Words</h4>
<p>Terms such as <strong>Koori</strong>, <strong>Murri</strong>, <strong>Noongar</strong>, <strong>Nunga</strong>, <strong>Anangu</strong>, <strong>Yolŋu</strong>, and <strong>Palawa/Pakana</strong> may be used in different regions or community contexts. Some are broad regional identity terms; some name peoples, languages, or related groups. They are not interchangeable labels.</p>

<h4>Torres Strait Islander Distinction</h4>
<p>Torres Strait Islander peoples have distinct island, sea Country, language, kinship, and cosmological traditions. They are often named together with Aboriginal peoples in national contexts, but they should not be folded casually into "Dreamtime" as if all traditions were the same.</p>

<facts>Nation::People with Country, law, language, and authority|Language group::Knowledge carried through speech and place|Clan/family::Specific custodial responsibility|AIATSIS map::Orientation tool, not final authority</facts>

<callout>Use the AIATSIS map and local community sources as starting points. The goal is not to memorize a list. The goal is to stop flattening Aboriginal Australia into one generic category.</callout>

<reflect>
Which Nation or language group is connected to the place where you are learning from?
How does naming many Countries change the way you understand Songlines?
What does this platform need to do to avoid turning plurality into a single bucket?
</reflect>
`
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       MĀORI — Aotearoa Knowledge Traditions
    ══════════════════════════════════════════════════════════ */
    {
      id:      'maori',
      name:    'Māori',
      emoji:   '🌀',
      tagline: 'Aotearoa Knowledge — Whakapapa, Te Pō, and Living Relation',
      theme:   'emerald',
      status:  'live',
      intro:   'Māori knowledge traditions from Aotearoa New Zealand hold creation, land, genealogy, language, and responsibility together through whakapapa. These lessons begin with Te Kore and Te Pō, move through Ranginui and Papatūānuku, and follow how atua, whenua, wai, and people remain bound in living obligation.',
      modules: [
        {
          id:    'maori-creation',
          title: 'Whakapapa & Creation',
          emoji: '🌀',
          desc:  'Creation through Te Kore, Te Pō, Ranginui, Papatūānuku, atua, and whakapapa.',
          lessons: [
            {
              id:       'mi-te-po',
              num:      'MI·01',
              title:    'Te Kore & Te Pō — Potential, Night, and Becoming',
              readTime: '17 min',
              content: `
<p class="lead">Many Māori creation accounts begin not with a simple empty void, but with deep phases of potential, darkness, gestation, and becoming: <strong>Te Kore</strong>, the realm before visible being, and <strong>Te Pō</strong>, the night through which life, thought, atua, and world take shape. These are not failures of creation. They are the conditions through which creation gathers itself before the world becomes visible.</p>

<h4>Te Kore as Potential</h4>
<p><strong>Te Kore</strong> can be translated in different ways depending on iwi, teacher, and context: void, nothingness, absence, potential, or the realm before being. The important point is that it should not be flattened into a dead emptiness. In many whakapapa sequences, Te Kore is charged with possibility. It is the condition before form, but not the absence of meaning.</p>

<h4>The Deepening Through Te Pō</h4>
<p><strong>Te Pō</strong> is night, darkness, and the long unfolding before light. Some whakapapa name many nights or phases of night, showing creation as gradual intensification rather than instant appearance. Night becomes layered: first darkness, deep darkness, searching darkness, gestating darkness, the darkness where the world is still held close inside itself.</p>

<facts>Te Kore::Potential before form|Te Pō::Generative night|Te Ao Mārama::World of light|Whakapapa::Layered relation</facts>

<h4>Te Ao Mārama</h4>
<p>The visible world is often called <strong>Te Ao Mārama</strong>, the world of light. But light does not cancel darkness. It reveals the relations formed in darkness. The movement from Te Kore through Te Pō into Te Ao Mārama is not a rejection of origin. It is a passage from hidden potential into relational visibility.</p>

<h4>Why This Matters</h4>
<p>If Te Kore and Te Pō are read as empty nothingness, the whole creation sequence is weakened. Māori creation begins with depth, gestation, and relation. It teaches that what is unseen may still be real, and that visible life depends on hidden conditions.</p>

<callout type="bridge">Careful resonance: Māori Te Pō and Kanaka Maoli Pō share a Polynesian language family and creation-depth pattern. Similarity can deepen learning, but each tradition must be approached through its own genealogies, protocols, and living communities.</callout>

<reflect>
Where do you mistake hidden preparation for absence?
How does Te Pō change the meaning of darkness?
What becomes visible only after it has been protected in darkness?
</reflect>
`
            },
            {
              id:       'mi-rangi-papa',
              num:      'MI·02',
              title:    'Ranginui & Papatūānuku — The First Separation',
              readTime: '18 min',
              content: `
<p class="lead"><strong>Ranginui</strong>, the sky father, and <strong>Papatūānuku</strong>, the earth mother, are joined in close embrace. Their children live cramped in darkness between them. Creation opens when the children debate how to make space, and Tāne separates sky and earth so light can enter the world.</p>

<callout type="gold">Protocol note: There are many iwi and hapū versions of creation. This lesson gives a broad public teaching pattern, not a final version that replaces local authority, whakapapa, or tikanga.</callout>

<h4>Creation as Space for Relation</h4>
<p>The separation is not simply a physical event. It creates the breathing room in which life, weather, forests, winds, seas, and humans can exist. But it is also painful: love, grief, and consequence enter the world with light. Ranginui weeps as rain; Papatūānuku sighs as mist. Creation is not a clean victory over darkness. It is a relational reordering with cost.</p>

<h4>The Debate Among the Children</h4>
<p>In many tellings, the children discuss whether their parents should be killed or separated. The decision matters. Creation is not only force; it is deliberation. The world of light comes through a choice about how to transform a suffocating relation without destroying the parents.</p>

<h4>Tāne and the Opening of Light</h4>
<p><strong>Tāne</strong>, associated with forests and birds, places his shoulders or back against Papatūānuku and pushes with his legs against Ranginui until sky and earth are separated. The space between them becomes the humanly livable world. Forests grow upward in the opened space, birds move between earth and sky, and light enters as relation becomes breathable.</p>

<h4>The Atua as Kin Domains</h4>
<table>
<thead><tr><th>Atua</th><th>Domain</th><th>Relational Meaning</th></tr></thead>
<tbody>
<tr><td><strong>Tāne</strong></td><td>Forests, birds, life in the opened world</td><td>Growth, shelter, vertical connection between earth and sky</td></tr>
<tr><td><strong>Tangaroa</strong></td><td>Sea and marine life</td><td>Oceanic abundance, depth, movement, and marine kinship</td></tr>
<tr><td><strong>Tāwhirimātea</strong></td><td>Winds, storms, weather</td><td>Grief and anger at the separation; atmosphere as active relation</td></tr>
<tr><td><strong>Rongo</strong></td><td>Cultivated foods, peace</td><td>Food, ritual calm, cultivated life, and social restoration</td></tr>
<tr><td><strong>Haumia-tiketike</strong></td><td>Uncultivated foods</td><td>Wild nourishment, hidden foods, and survival knowledge</td></tr>
<tr><td><strong>Tūmatauenga</strong></td><td>Humanity, conflict, skill</td><td>Human action, war, tools, courage, and responsibility</td></tr>
</tbody>
</table>

<h4>The First Crisis</h4>
<p><strong>Tāwhirimātea</strong> refuses the separation and attacks his siblings with storms. This is important: creation does not erase conflict. It reveals unresolved grief. The world is born into weather, struggle, repair, and continuing responsibility.</p>

<callout>The first separation teaches that light creates responsibility. Once the world is visible, relations can be damaged or cared for. Knowledge begins with seeing consequence.</callout>

<reflect>
Why does creation require space between beings who love each other?
What does Tāwhirimātea teach about grief inside creation?
How does the first separation change the way you understand sky, earth, weather, forest, sea, and food?
</reflect>
`
            },
            {
              id:       'mi-whakapapa',
              num:      'MI·03',
              title:    'Whakapapa — Genealogy as Knowledge System',
              readTime: '15 min',
              content: `
<p class="lead"><strong>Whakapapa</strong> is often translated as genealogy, but it is more than a family tree. It is an ordering system that places people, atua, land, waters, plants, animals, and events into relation. To know whakapapa is to know where responsibilities come from.</p>

<h4>Layering Relation</h4>
<p>The word whakapapa evokes placing in layers. Knowledge is layered through descent, sequence, naming, and relation. This makes whakapapa a memory system, a political system, an ecological system, and a spiritual system at once.</p>

<h4>Whakapapa as Method</h4>
<p>Whakapapa can explain ancestry, land rights, atua domains, natural phenomena, kinship obligations, and the position of humans within the living world. It is not just content to memorize. It is a method of knowing: place something in relation, trace what it comes from, and ask what obligations follow.</p>

<h4>Whenua and Belonging</h4>
<p>Whenua means land and placenta. The language itself holds the relationship between birth, body, place, nourishment, and belonging. A person is not separate from land as an owner standing outside it. Identity is grounded through relation to whenua, ancestors, and responsibility.</p>

<h4>Mauri, Tapu, and Mana</h4>
<p>Creation and whakapapa also help orient key Māori concepts. <strong>Mauri</strong> is life force or vital essence. <strong>Tapu</strong> marks sacred restriction, potential, and protected relation. <strong>Mana</strong> includes authority, prestige, efficacy, and inherited or cultivated power. These concepts are not isolated vocabulary items; they are ways of describing how relations are protected, activated, and made accountable.</p>

<callout type="bridge">Whakapapa resonates deeply with the Kumulipo because both place humans inside a larger genealogy of sky, earth, ocean, plants, animals, ancestors, and responsibility. The resonance is kin-like, but the languages, protocols, and histories remain distinct.</callout>

<reflect>
What changes when genealogy is treated as an ethical map, not just ancestry?
How does whakapapa challenge the idea that land is property only?
What obligation follows from knowing your place in a living chain?
</reflect>
`
            },
            {
              id:       'mi-hineahuone',
              num:      'MI·04',
              title:    'Tāne & Hineahuone — Human Emergence from Earth',
              readTime: '16 min',
              content: `
<p class="lead">After the world of light opens, creation continues through the search for human life. In many public Māori accounts, <strong>Tāne</strong> forms <strong>Hineahuone</strong>, the first woman, from the earth at Kurawaka. Human life is therefore not outside the world of atua, whenua, and whakapapa. Humanity comes from earth, breath, desire for continuity, and sacred relation.</p>

<callout type="gold">Protocol note: Hineahuone traditions vary by iwi and teaching context. This lesson follows a broad public pattern and should be read as an orientation, not a replacement for local whakapapa or tikanga.</callout>

<h4>The Search for Human Life</h4>
<p>Tāne's work does not end with separating Ranginui and Papatūānuku. The opened world still requires human continuity. In some accounts, Tāne seeks the female element needed for human birth. This search matters because humanity is not created as isolated dominance. Humanity emerges from relation: atua seeking continuity through earth.</p>

<h4>Kurawaka and the Red Earth</h4>
<p>Hineahuone is often associated with <strong>Kurawaka</strong>, a place of sacred red earth. Her name can be read through earth-formed womanhood: <em>hine</em> as woman or female principle and <em>ahuone</em> as earth formed or heaped up. The body is not separate from land. Human origin is a whenua origin.</p>

<h4>Breath and Animation</h4>
<p>In public tellings, Tāne shapes Hineahuone and breathes life into her. Breath is not merely biological function. It marks animation, relationship, and the crossing from formed matter into living personhood. The lesson is subtle: earth form becomes human life through breath within a sacred relational field.</p>

<facts>Hineahuone::Earth-formed first woman|Kurawaka::Sacred red-earth origin place|Hā::Breath, life, animation|Whenua::Land and placenta</facts>

<h4>Humanity as Kin, Not Master</h4>
<p>This account places people inside a chain of dependency. Human beings are not introduced as owners of creation. They are latecomers formed from earth, animated through breath, and bound to atua and whenua. The human role is therefore not extraction-first authority, but responsibility born from origin.</p>

<callout type="bridge">Careful resonance: Hineahuone and Hāloa both place humanity in bodily relation with earth and plant/land continuity. The comparison is powerful, but each tradition carries its own genealogy and protocol.</callout>

<reflect>
How does human origin from earth change the meaning of responsibility?
What is lost when humanity is treated as separate from whenua?
Where does breath become obligation in your own practice?
</reflect>
`
            },
            {
              id:       'mi-hinetitama',
              num:      'MI·05',
              title:    'Hine-tītama & Hine-nui-te-pō — Dawn, Death, and Return',
              readTime: '18 min',
              content: `
<p class="lead"><strong>Hine-tītama</strong>, often understood as the dawn woman, stands at a profound turning point in Māori creation genealogies. After discovering hidden truth about her parentage and relation to Tāne in many public accounts, she withdraws to the realm of night and becomes <strong>Hine-nui-te-pō</strong>, the great woman of night. This is not a small episode. It establishes death, return, boundary, and care for descendants.</p>

<callout type="gold">This lesson handles a sacred and sensitive story. It avoids sensational detail and focuses on the relational meaning: truth, boundary, grief, transformation, and the care of descendants through death.</callout>

<h4>Dawn as Threshold</h4>
<p>Hine-tītama's name evokes dawn or the beginning of light. She belongs to the world opened by the separation of sky and earth, but her story shows that light also reveals painful truth. Visibility is not always comfort. Sometimes light exposes disorder that must be answered with boundary and transformation.</p>

<h4>The Turn Toward Night</h4>
<p>When Hine-tītama turns away from the world of light and becomes Hine-nui-te-pō, night is not simply evil or absence. Night becomes the domain that receives human beings at death. The movement returns the creation arc to Te Pō, but now Te Pō has a new role: it is not only origin before life, but also the receiving depth after life.</p>

<h4>Death as Relation, Not Annihilation</h4>
<p>Hine-nui-te-pō is often described as receiving her descendants. This reframes death as return into relation rather than meaningless disappearance. The lesson is not that grief disappears. The lesson is that grief is held inside a wider genealogy where the living and the dead remain connected.</p>

<h4>Boundary as Sacred Knowledge</h4>
<p>This story also teaches that sacred relation requires boundaries. When truth reveals harm, transformation is necessary. Hine's movement is not passive. It is an act that reorganizes the human condition and creates a place for future generations.</p>

<facts>Hine-tītama::Dawn woman, threshold of light|Hine-nui-te-pō::Great woman of night, receiver of descendants|Te Pō::Origin depth and death-return depth|Boundary::Sacred protection of relation</facts>

<callout>The creation sequence is not only about how life begins. It is also about how life is bounded, how death is held, and how descendants remain in relation with those who came before.</callout>

<reflect>
How does Hine-nui-te-pō change the meaning of night?
What kind of knowledge comes only after difficult truth is faced?
How can boundary become care rather than separation?
</reflect>
`
            },
            {
              id:       'mi-maui',
              num:      'MI·06',
              title:    'Māui — World-Shaping, Fire, Sun, and Islands',
              readTime: '17 min',
              content: `
<p class="lead"><strong>Māui</strong> is not usually the first creator of the cosmos, but he is one of the great world-shapers. Across Polynesian traditions, Māui appears as a boundary-crosser, trickster, culture hero, and transformer. In Māori traditions, his deeds help explain islands, fire, the pace of the sun, and the limits of human life.</p>

<h4>Fishing Up Land</h4>
<p>One famous Māori account tells how Māui fishes up the North Island, known in this frame as <strong>Te Ika-a-Māui</strong>, the fish of Māui. His canoe is associated with the South Island, <strong>Te Waka-a-Māui</strong>. The story is not only a landscape explanation. It is a way of reading land as event, body, relationship, and memory.</p>

<h4>Slowing the Sun</h4>
<p>Māui and his brothers slow the sun so people have enough daylight for work, food, and life. This transforms time itself into a humanly livable rhythm. The lesson is not domination of the sun as a resource. It is the rebalancing of cosmic force so community life can continue.</p>

<h4>Fire and Mahuika</h4>
<p>In the fire traditions, Māui seeks the source of fire from <strong>Mahuika</strong>. The episode teaches curiosity, danger, transmission, and the placement of fire in the world. Fire becomes knowledge that must be handled with skill, humility, and consequence-awareness.</p>

<h4>The Failed Quest Against Death</h4>
<p>Some traditions tell of Māui's attempt to overcome death through Hine-nui-te-pō. The attempt fails. This matters because Māui's brilliance has limits. The world-shaper cannot erase the sacred boundary of death. Knowledge includes daring, but also the recognition that some thresholds cannot be conquered.</p>

<facts>Te Ika-a-Māui::The fish of Māui, North Island frame|Te Waka-a-Māui::The canoe of Māui, South Island frame|Mahuika::Fire ancestress/source|Hine-nui-te-pō::Boundary of death and return</facts>

<callout type="bridge">Māui is a major Polynesian figure, and his stories resonate across Aotearoa, Hawaiʻi, Tahiti, Sāmoa, Tonga, and beyond. The shared pattern is real, but local names, places, genealogies, and meanings are not interchangeable.</callout>

<reflect>
When does cleverness become responsibility?
What does Māui teach about changing conditions so life can continue?
Where do limits protect the world from human overreach?
</reflect>
`
            },
            {
              id:       'mi-kaitiakitanga',
              num:      'MI·07',
              title:    'Kaitiakitanga — Responsibility from Creation',
              readTime: '14 min',
              content: `
<p class="lead">The Māori creation sequence does not end as ancient story. It becomes lived responsibility. <strong>Kaitiakitanga</strong> is often translated as guardianship or stewardship, but it is deeper than management. It arises from whakapapa: because land, waters, forests, winds, atua, ancestors, and people are related, care is not optional. It is inherited obligation.</p>

<h4>From Whakapapa to Conduct</h4>
<p>If humans descend through the same relational order as forests, seas, winds, foods, and ancestors, then action must answer to that order. Kaitiakitanga is not a decorative value added after economics. It is a way of making decisions inside kinship.</p>

<h4>Mauri and the Health of Relation</h4>
<p><strong>Mauri</strong> helps name the vitality or life principle of beings, places, and systems. Damage to a river, forest, or species is therefore not only loss of material utility. It is harm to mauri and to the relational field that sustains life.</p>

<h4>Authority Requires Accountability</h4>
<p>Creation gives humans capacity, but not unchecked permission. Mana is strongest when it protects relation. Tapu marks what must be approached with care. Tikanga gives patterns for right conduct. Kaitiakitanga brings these into practical decisions about food, water, land, language, burial places, education, and governance.</p>

<h4>Modern Pressure</h4>
<p>The crisis today is familiar: land and water can be treated as assets, data points, or development zones separated from ancestry. Kaitiakitanga interrupts that logic. It asks what a decision does to the living chain, not only what it produces in the short term.</p>

<facts>Kaitiakitanga::Kin-based responsibility and care|Mauri::Vital force and health of relation|Tikanga::Right practice and conduct|Mana::Authority accountable to relation</facts>

<callout>The creation story becomes complete only when it changes conduct. If whakapapa is known but not practiced, the chain has been named without being honored.</callout>

<reflect>
What decision near you needs to be judged by mauri, not only profit or convenience?
How does kaitiakitanga differ from ownership?
What would it mean to act as a descendant of creation rather than a consumer of it?
</reflect>
`
            }

          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       YORUBA — West African Ifá and Òrìṣà Traditions
    ══════════════════════════════════════════════════════════ */
    {
      id:      'yoruba',
      name:    'Yoruba',
      emoji:   '⚡',
      tagline: 'West African Wisdom — Ifá, Òrìṣà, Àṣẹ, and Destiny',
      theme:   'gold',
      status:  'live',
      intro:   'Yoruba knowledge traditions from West Africa carry a profound system of creation, divination, ethics, art, memory, and destiny. These lessons begin with Olódùmarè, Ilé-Ifẹ̀, Ọ̀rìṣà-nlá/Obàtálá, Odùduwà, Èṣù, Ifá, and àṣẹ as living principles of order, choice, and consequence.',
      modules: [
        {
          id:    'yoruba-cosmology',
          title: 'Creation, Ifá & Àṣẹ',
          emoji: '⚡',
          desc:  'Yoruba creation, sacred power, destiny, divination, and ethical choice.',
          lessons: [
            {
              id:       'yo-ile-ife',
              num:      'YO·01',
              title:    'Ilé-Ifẹ̀ — Descent, Earth, and the Making of World',
              readTime: '12 min',
              content: `
<p class="lead">In important Yoruba creation accounts, the world begins as watery or unformed expanse. <strong>Olódùmarè</strong>, the supreme source, sends divine agents to make habitable earth. Ilé-Ifẹ̀ becomes a sacred center: the place where world-making, kingship, artistry, and human origin are remembered.</p>

<h4>Earth Spread Over Waters</h4>
<p>One widely told account describes a chain descending from heaven, a handful of earth or sacred substance, and a fowl that spreads the earth across the waters. This is not only a story of land appearing. It is a teaching about order emerging through delegated responsibility and careful action.</p>

<h4>Obàtálá and Odùduwà</h4>
<p>Different Yoruba lineages and tellings emphasize Obàtálá, Odùduwà, or both in distinct ways. A responsible lesson does not flatten these variations into one final version. It recognizes that sacred history lives through place, lineage, ritual, and interpretation.</p>

<callout type="gold">Ilé-Ifẹ̀ is not merely a location on a map. It is a civilizational center of memory where creation, kingship, art, and sacred authority meet.</callout>
`
            },
            {
              id:       'yo-ase',
              num:      'YO·02',
              title:    'Àṣẹ — The Power That Makes Things Happen',
              readTime: '11 min',
              content: `
<p class="lead"><strong>Àṣẹ</strong> is the power of realization: the force by which words, rituals, choices, blessings, curses, art, and divine command become effective. It is often translated as power, authority, command, or "so may it be," but those translations only point toward it.</p>

<h4>Speech and Consequence</h4>
<p>Àṣẹ teaches that speech is not neutral. Words can bless, bind, open, distort, heal, or harm. This places language inside ethics. To speak without care is to act without care.</p>

<h4>Embodied Power</h4>
<p>Àṣẹ moves through Òrìṣà, elders, ritual specialists, artists, medicines, drums, praise poetry, and everyday conduct. Power is not abstract. It must be carried, disciplined, and aligned.</p>

<callout>Àṣẹ resonates with other traditions where word, chant, name, and breath are world-shaping. The resonance is real, but Yoruba àṣẹ remains grounded in Yoruba language, ritual, and Òrìṣà practice.</callout>
`
            },
            {
              id:       'yo-ifa',
              num:      'YO·03',
              title:    'Ifá, Orí & Èṣù — Destiny, Choice, and the Crossroads',
              readTime: '13 min',
              content: `
<p class="lead"><strong>Ifá</strong> is a divination, wisdom, literary, and ethical system associated with Òrúnmìlà. It preserves vast bodies of verse called <strong>Odù</strong>, which guide interpretation, ritual, character, and decision-making.</p>

<h4>Orí and Destiny</h4>
<p><strong>Orí</strong> means head, inner head, destiny, and personal spiritual orientation. Yoruba thought often frames a person's life as a negotiation between chosen destiny, character, community, and action. Destiny is not passive. It must be cultivated.</p>

<h4>Èṣù at the Crossroads</h4>
<p><strong>Èṣù</strong> is a messenger, opener of roads, tester, translator, and guardian of thresholds. Reducing Èṣù to "devil" is a colonial distortion. Èṣù teaches that every path has consequence and that communication must be interpreted with care.</p>

<reflect>
Where do you stand at a crossroads right now?
What would change if destiny meant disciplined alignment rather than fixed fate?
</reflect>
`
            }

          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       CHINESE — Dao, Yin-Yang, and Classical Chinese Traditions
    ══════════════════════════════════════════════════════════ */
    {
      id:      'chinese',
      name:    'Chinese',
      emoji:   '☯',
      tagline: 'Chinese Wisdom — Dao, Yin-Yang, Heaven, Earth, and Harmony',
      theme:   'cyan',
      status:  'live',
      intro:   'Classical Chinese knowledge traditions include Daoist, Confucian, cosmological, medical, divinatory, and mythic lineages. These lessons begin with Dao, yin-yang, Pangu, Nüwa, Heaven-Earth-Human relation, and the long search for harmony within change.',
      modules: [
        {
          id:    'chinese-cosmology',
          title: 'Dao, Creation & Harmony',
          emoji: '☯',
          desc:  'Chinese creation, Dao, yin-yang, Pangu, Nüwa, and relational order.',
          lessons: [
            {
              id:       'zh-dao',
              num:      'ZH·01',
              title:    'Dao — The Way Before Naming',
              readTime: '12 min',
              content: `
<p class="lead">The <strong>Dao</strong> is the Way: the generative order, pattern, and movement through which things arise and return. The Dao that can be fully named is not the constant Dao. This is not anti-knowledge. It is a warning that reality exceeds fixed labels.</p>

<h4>Before Names</h4>
<p>Classical Daoist thought begins with humility before origin. Naming is useful, but it can also trap living process into rigid categories. The nameless points toward source; the named points toward the many forms of the world.</p>

<h4>Wu Wei</h4>
<p><strong>Wu wei</strong>, often translated as non-forcing or effortless action, does not mean passivity. It means action aligned with pattern, timing, and relation. The wise person does not dominate the flow of things; they learn how to move with it.</p>

<callout>Dao offers a deep complement to the platform's living knowledge frame: wisdom is not control over life, but disciplined alignment with the patterns that sustain life.</callout>
`
            },
            {
              id:       'zh-yinyang',
              num:      'ZH·02',
              title:    'Yin-Yang & Five Phases — Change as Pattern',
              readTime: '13 min',
              content: `
<p class="lead"><strong>Yin</strong> and <strong>yang</strong> are not good and evil. They are relational tendencies: dark/light, receptive/active, cool/warm, inward/outward, earth/sky, rest/movement. Each contains the seed of the other.</p>

<h4>Dynamic Complementarity</h4>
<p>Yin-yang thinking trains attention to balance through movement. A situation can become too yang or too yin. Wisdom is not choosing one forever, but discerning the right relation for the moment.</p>

<h4>Five Phases</h4>
<p>The Five Phases — wood, fire, earth, metal, and water — describe cycles of generation and control. They are used in medicine, music, governance, seasonal thinking, and cosmology as a way to track transformation rather than static substance.</p>

<callout type="bridge">This resonates with paired-force systems in Kemet, Māori, Yoruba, and Kanaka Maoli lessons. The point is not sameness; the point is disciplined attention to relation.</callout>
`
            },
            {
              id:       'zh-pangu-nuwa',
              num:      'ZH·03',
              title:    'Pangu & Nüwa — World Body, Repair, and Human Making',
              readTime: '12 min',
              content: `
<p class="lead">Chinese mythic traditions include many creation accounts. Two especially important figures are <strong>Pangu</strong>, associated with the separation of heaven and earth and the formation of the world-body, and <strong>Nüwa</strong>, associated with creating humans and repairing the damaged sky.</p>

<h4>Pangu and Separation</h4>
<p>In later accounts, Pangu grows within a cosmic egg and separates heaven and earth. When he dies, his body becomes features of the world: breath, wind, voice, thunder, eyes, sun and moon, limbs, mountains, blood, rivers. The cosmos is not dead material; it is body-transformation.</p>

<h4>Nüwa and Repair</h4>
<p>Nüwa is remembered for forming humans and for mending the sky after cosmic damage. This matters deeply: creation is not only beginning. Creation includes repair. The world can fracture, and sacred intelligence restores balance.</p>

<reflect>
What does it mean to treat repair as a sacred act?
Where does your world need mending rather than conquest?
</reflect>
`
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
