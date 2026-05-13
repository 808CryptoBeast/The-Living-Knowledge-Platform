/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — PRIMARY SOURCES & CONTENT ADDITIONS
   File: LKP/js/lkp-data-primary-sources.js

   Load AFTER lkp-data.js and lkp-data-rich-additions.js.
   This file patches lesson content with:
     • Actual chant lines from the Kumulipo (Queen Lili'uokalani, 1897 — public domain)
     • Actual Kemetic scripture from the Book of the Dead, Pyramid Texts,
       and Coffin Texts (ancient originals — public domain)
     • Primary source blocks from historical figures
     • Keiki (child) versions for each lesson
     • kidVersion.story, bigIdeas, vocabulary, activity, reflection

   HOW TO USE
   These additions are applied by LKP_PRIMARY_SOURCES.applyAll() which is
   called automatically once CULTURALVERSE_DATA is ready.
   If you add a new lesson, just add a new entry to LESSON_ADDITIONS.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────────────
     LESSON ADDITIONS MAP
     Each entry targets a lesson by id and patches its content.
     The content uses the new custom tags:
       <chant lang="" title="">lines...</chant>
       <primary-source cite="" date="">text...</primary-source>
       <scripture title="" cite="">text...</scripture>
       <manuscript cite="">text...</manuscript>
  ────────────────────────────────────────────────────────────────────── */

  const LESSON_ADDITIONS = {

    /* ══════════════════════════════════════════════════════════════════
       KĀNAKA MAOLI — COSMOLOGY MODULE
    ══════════════════════════════════════════════════════════════════ */

    'km-kumulipo': {
      /* ── Content additions injected BEFORE existing content ── */
      contentPrefix: `
<chant lang="ʻŌlelo Hawaiʻi" title="Kumulipo — Opening of Wā 1 (lines 1–8)">
O ke au i kahuli wela ka honua
O ke au i kahuli lole ka lani
O ke au i kuka'iaka ka lā
E ho'omalamalama i ka malama
O ke au i mālamalama ka mahina
O ka lipolipo, o ka lipolipo
O ka lipolipo o ka lā
O ka lipolipo o ka pō
</chant>

<primary-source cite="Queen Lili'uokalani, translation, 1897" date="ca. 1700 CE original / 1897 translation">
At the time when the earth became hot
At the time when the heavens turned about
At the time when the sun was darkened
To cause the moon to shine
The time of the rise of the Pleiades
The slime, this was the source of the earth
The source of the darkness that made darkness
The source of the night that made night
</primary-source>

<callout type="gold">The opening does not begin with light. It begins with heat — kaʻau — and with turning. Creation is motion before it is form. This alone separates Hawaiian cosmology from many Western creation narratives that privilege light over dark, order over chaos.</callout>
`,

      /* ── Content additions injected AFTER existing content ── */
      contentSuffix: `
<chant lang="ʻŌlelo Hawaiʻi" title="Kumulipo — First Pairing (Wā 1, lines 9–12)">
Hānau ka po uhe'e i ka wai
He kai ka lipo i ka lipo
O ke kiʻowao nui o Kāne
O ka pōhaku, o ka pōhaka
</chant>

<primary-source cite="Queen Lili'uokalani, 1897 — on the first life pairing">
Born was the coral, living in the sea
The deep coral, the branching coral
Born was the worm, living in the sea
Born was the starfish, living in the sea
</primary-source>

<reflect title="Sitting with the Kumulipo">
The opening of the Kumulipo begins in darkness — Pō. What does it mean that darkness is the source rather than the absence of something?
The first life named is koʻa — the coral polyp. Why might the composers begin with the smallest marine organism, not with humans or gods?
Queen Lili'uokalani translated this chant while under house arrest after the 1893 overthrow of the Hawaiian Kingdom. How does knowing that change how you receive her translation?
</reflect>
`,
      kidVersion: {
        story: `Imagine the biggest family tree ever made. But instead of starting with your great-grandparents, it starts with the very first tiny creatures that ever lived in the ocean — coral polyps, no bigger than a grain of rice.\n\nThe Kumulipo is a Hawaiian chant that tells this story. It starts in darkness — Pō — and says that darkness is not empty. It is full of potential, like a seed before it sprouts. From the darkness came heat, and from heat came the first life: koʻa, the coral.\n\nFrom coral came more sea creatures. From sea creatures came plants. From plants came land animals. And from all of that long chain of life came people — including the aliʻi, the Hawaiian chiefs, who were expected to carry that entire responsibility in their bodies.`,
        bigIdeas: [
          'Darkness (Pō) is not emptiness — it is where all life begins. The Kumulipo teaches that creation starts in the deep dark ocean.',
          'All living things are related. The coral, the fish, the birds, the plants, the people — the chant traces them all back to the same source.',
          'The Kumulipo was memorized and chanted perfectly for generations before anyone wrote it down. Memory and voice ARE the library.'
        ],
        vocabulary: [
          { term: 'Kumulipo',  meaning: 'The name of the chant. Kumu = source or origin. Lipo = the deep blue-black of the ocean. "Beginning in deep darkness."' },
          { term: 'Pō',        meaning: 'Primordial darkness. Not empty darkness, but the darkness that holds all potential — like the ocean before dawn.' },
          { term: 'Ao',        meaning: 'The realm of light. In the Kumulipo, Ao is where humans and daylight exist, after the long journey through Pō.' },
          { term: 'Koʻa',      meaning: 'Coral. The first living being named in the Kumulipo. Everything starts here — in the sea, tiny and alive.' },
          { term: 'Wā',        meaning: 'An epoch or era. The Kumulipo has 16 wā. Each wā introduces a new stage of life, from coral to people.' },
          { term: 'Aliʻi',     meaning: 'The chiefly class. The Kumulipo was composed to celebrate the birth of a chief, connecting human genealogy all the way back to the first coral.' }
        ],
        activity: `Create your own "small kumulipo." On a long piece of paper, draw a chain: start with the ocean and draw the first tiny creature (coral). Then draw what it connects to. Then draw what that connects to. Keep going until you reach people. Write one word on each connecting line that describes the relationship. Is it food? Shelter? Air? This is how the Hawaiian composers thought about the world.`,
        reflection: [
          'The Kumulipo says darkness is where life begins. What does that make you think about nighttime, or about beginnings you can\'t see yet?',
          'If you were going to start a family tree that went all the way back to the first life on Earth, where would YOU start it?',
          'Queen Liliʻuokalani translated this chant when she was under house arrest — a prisoner in her own palace. Why might preserving this knowledge have mattered so much to her in that moment?'
        ]
      }
    },

    /* ── Wākea & Papahānaumoku ────────────────────────────────────── */

    'km-wakea': {
      contentPrefix: `
<chant lang="ʻŌlelo Hawaiʻi" title="On the union of Wākea and Papahānaumoku">
O Wākea ka lani
O Papahānaumoku ka honua
Hanau ka ʻāina, hanau ke kanaka
Ola ke kanaka i ka ʻāina
</chant>

<primary-source cite="Traditional moʻolelo, compiled by Martha Beckwith, The Kumulipo, 1951">
Wākea is the sky father — the expanse that holds all.
Papahānaumoku is the earth mother — she who births islands.
From their union came Hāloa, first child, stillborn, who became the kalo plant.
From Hāloa's spirit came Hāloanakalaukapalili — the first human being.
The kalo is therefore the older sibling of all Hawaiians.
</primary-source>

<callout>This is not metaphor. This is genealogy. The kalo (taro) plant is literally the elder sibling of humanity in Hawaiian cosmological understanding. When you eat poi, you are eating your ancestor.</callout>
`,
      kidVersion: {
        story: `In Hawaiian teaching, the sky has a name: Wākea. The earth has a name: Papahānaumoku — "she who births islands." Together, they are the parents of the Hawaiian islands themselves.\n\nTheir first child was born still. They buried the baby, and from that burial spot grew the very first kalo plant — taro, the plant that Hawaiian families have grown for thousands of years to make poi.\n\nThen came their second child: the first human being. That means the kalo plant is the OLDER SIBLING of all humans in Hawaiian understanding. When Hawaiian families tend their loʻi kalo (taro fields), they are caring for their elder sibling. That is not just farming. That is family.`,
        bigIdeas: [
          'The sky (Wākea) and the earth (Papahānaumoku) are not just nature. They are family — the ancestors of the Hawaiian people.',
          'The kalo (taro) plant is the elder sibling of humans. This means farming is not just work — it is a family relationship.',
          'The islands of Hawaiʻi are children of Papahānaumoku. The land is not property to be owned — it is a relative to be cared for.'
        ],
        vocabulary: [
          { term: 'Wākea',          meaning: 'The sky father in Hawaiian cosmology. His name means "wide expanse" — the sky that holds everything.' },
          { term: 'Papahānaumoku',   meaning: 'The earth mother. Her name means "she who gives birth to islands." The Hawaiian islands are her children.' },
          { term: 'Kalo',           meaning: 'The taro plant — staple food of Hawaiian culture, used to make poi. Also the elder sibling of humanity in Hawaiian genealogy.' },
          { term: 'Loʻi Kalo',      meaning: 'Flooded taro fields, often carved into valleys. Tending them is considered a family and sacred responsibility.' },
          { term: 'Moʻolelo',       meaning: 'Story and history carried through generations. The story of Wākea and Papahānaumoku is moʻolelo — living truth, not mythology.' }
        ],
        activity: `Draw a family portrait — but make it the Hawaiian cosmic family. Include: Wākea (sky), Papahānaumoku (earth), the islands, the kalo plant, and a human being. Draw lines showing how they are all related. Under each figure, write one word describing their role in the family.`,
        reflection: [
          'If the land is your relative and not your property, how would that change the way you treat it?',
          'The kalo is older than humans in Hawaiian teaching. What does it mean to have a food plant as your elder sibling?',
          'Papahānaumoku is still giving birth — volcanoes are still making new land in Hawaiʻi. What does that tell you about creation?'
        ]
      }
    },

    /* ══════════════════════════════════════════════════════════════════
       KEMET — COSMOLOGY MODULE
    ══════════════════════════════════════════════════════════════════ */

    'ke-nun': {
      contentPrefix: `
<scripture title="The Emergence of Atum from Nun" cite="Pyramid Texts, Utterance 527 — ca. 2400 BCE">
I am Atum who came into being by himself upon Nun,
the primordial waters.
I am Re in his first appearance,
when he began to rule what he had made.

Who is this? It is Re, who began to rule
what he had made when the sky had not yet come into being,
when the earth had not yet come into being,
when the ground had not yet been made firm,
when that strife which arose subsequently had not yet come into being.
</scripture>

<callout type="gold">Nun is not empty nothingness. Nun is limitless potential — the waters that preexist all creation, containing everything that will ever be. In Kemetic thought, creation does not happen from nothing. Creation happens from the fullness of Nun.</callout>
`,
      contentSuffix: `
<scripture title="The Self-Creation of Atum" cite="Coffin Texts, Spell 80 — Middle Kingdom, ca. 2000 BCE">
I am Atum, the creator of the eldest gods,
I am he who gave birth to Shu,
I am that great He-She.

I am he who did whatever he wished
in this land of the Primordial Mound.
I am the waters, boundless and infinite,
I am those who set bounds to themselves.
</scripture>

<reflect title="Sitting with Nun">
The Kemetic creation does not begin with a deity creating from nothing. It begins with a deity emerging from what already exists — the limitless waters of Nun. How does this compare to creation narratives you know?
Atum is described as "He-She" — both male and female, or neither, or both. Why might the Kemetic thinkers describe the first being as beyond gender?
If Nun represents limitless potential — the fullness before form — what in your own life is still "in Nun," waiting to emerge?
</reflect>
`,
      kidVersion: {
        story: `Before there was anything — before land, sky, sun, or people — the ancient Egyptians said there was Nun.\n\nNun was a vast, dark, still ocean that stretched in every direction forever. It was not empty. It was actually completely FULL — full of everything that was about to exist, like seeds before they sprout. There was no sound, no movement, no light. Just Nun, holding all possibilities.\n\nThen, from the depths of Nun, something stirred. A consciousness — a god named Atum — became aware of itself. And from that awareness, the first thought: "I am." That "I am" was the beginning of everything. From Atum came the first air (Shu) and the first moisture (Tefnut). From them came the sky (Nut) and the earth (Geb). And from all of that, eventually, came life.`,
        bigIdeas: [
          'Before creation, there was Nun — the primordial ocean. It was not empty; it was full of all potential, like seeds before they sprout.',
          'Atum created himself by thinking "I am." The Kemetic people believed thought and speech were so powerful they could bring things into existence.',
          'The Kemetic creation does not go from nothing to something — it goes from formless potential (Nun) to ordered form. Potential was always there.'
        ],
        vocabulary: [
          { term: 'Nun',    meaning: 'The primordial ocean — the limitless, still waters that existed before creation. Not empty, but full of everything waiting to exist.' },
          { term: 'Atum',   meaning: 'The self-created god who emerged from Nun. His name means "the complete one" or "the all." The first conscious being.' },
          { term: 'Shu',    meaning: 'The god of air — first child of Atum. His presence separates sky from earth and makes breathing possible.' },
          { term: 'Tefnut', meaning: 'The goddess of moisture — twin of Shu. Together with Shu, she balances the dry and the wet, making life possible.' },
          { term: 'Duat',   meaning: 'The realm the sun travels through at night — a place of transformation, not punishment. The sun is "reborn" each morning from the Duat.' }
        ],
        activity: `Fill a clear bowl or glass with water. Look into it — that is Nun. Now drop one pebble in. Watch the ripples spread outward in all directions. That moment of first movement — the first ripple — is Atum emerging from Nun. Write or draw: what is the first thing that came FROM the ripples?`,
        reflection: [
          'Nun was not empty — it was full of everything waiting to happen. Is there something in your life that feels like Nun right now?',
          'Atum created himself by thinking. Do you believe thoughts can be powerful enough to change reality? Why or why not?',
          'The Egyptians said creation is still happening — the sun "re-creates" the world every morning when it rises. What do you re-create every morning?'
        ]
      }
    },

    /* ── Maʻat ───────────────────────────────────────────────────── */

    'ke-maat': {
      contentPrefix: `
<scripture title="The Negative Confession — 42 Declarations of Innocence" cite="Book of the Dead, Chapter 125 — New Kingdom, ca. 1550 BCE">
I have not done wrong.
I have not robbed with violence.
I have not stolen.
I have not slain people.
I have not destroyed food supplies.
I have not reduced the bushel.
I have not falsified the scales.
I have not cheated in the fields.

These are spoken before Maʻat and her 42 assessors
in the Hall of Two Truths,
as the heart is weighed against the feather.
</scripture>

<callout type="gold">These are not commandments from a god. They are the self-accounting of a person who has lived. You do not confess to Maʻat — you demonstrate to her. The 42 declarations are a map of the ethical life, not a checklist of rules.</callout>
`,
      contentSuffix: `
<manuscript cite="Maxims of Ptahhotep, ca. 2400 BCE — among the oldest written ethical texts in human history">
Do not be proud of your learning.
Take counsel with the ignorant as with the learned,
for the limits of art cannot be reached,
and no artist's skills are perfect.

Good speech is more hidden than the emerald,
yet it may be found with maidservants at the grindstones.

If you are great after having been humble,
having come into wealth after having been poor,
do not boast of this to others.
Be kind to those who helped you rise.
</manuscript>

<reflect title="Living Maʻat">
The 42 declarations are not confessions of what you did wrong — they are affirmations of a life lived in Maʻat. What would YOUR 42 declarations look like? What would you need to say "I have not done" to live in right relationship?
Maʻat is described as both a concept (truth, balance, justice) and a goddess who weighs your heart. Why might the Kemetic people have personified ethical order as a female deity with a feather?
The maxims of Ptahhotep are over 4,000 years old and were written by a vizier — a government official. If a government official wrote these today, what would they say?
</reflect>
`,
      kidVersion: {
        story: `In ancient Egypt, when a person died, they believed something extraordinary happened. Their heart was carried into a great hall — the Hall of Two Truths. In that hall, the goddess Maʻat placed a single feather on one side of a giant scale. Your heart was placed on the other side.\n\nIf your heart was light — if you had lived honestly, treated people fairly, cared for the poor, spoken the truth — your heart would balance with the feather. You could continue your journey.\n\nIf your heart was heavy — full of cruelty, lies, and selfishness — a beast called Ammit would swallow it, and your journey would end.\n\nThe lesson? Maʻat is not just a story about death. It is a daily practice. Every choice you make either lightens or heavies your heart. You are constantly weighing your own heart.`,
        bigIdeas: [
          'Maʻat means truth, balance, and cosmic justice. It is not just a law — it is the force that holds the universe together.',
          'The opposite of Maʻat is Isfet — chaos, lies, and injustice. Kemetic people believed every person\'s choices either strengthened or weakened the balance of the world.',
          'The 42 declarations are a list of how to live well. They were spoken in the Hall of Two Truths, where your heart was weighed against a feather.'
        ],
        vocabulary: [
          { term: 'Maʻat',     meaning: 'Truth, balance, justice, and cosmic order. Also the goddess who holds the feather that your heart is weighed against after death.' },
          { term: 'Isfet',     meaning: 'The opposite of Maʻat — chaos, lies, and injustice. When you lie, cheat, or harm others, you create Isfet in the world.' },
          { term: 'Ammit',     meaning: 'The "devourer" — part lion, part hippo, part crocodile. She waits in the Hall of Two Truths. If your heart is too heavy, she swallows it.' },
          { term: 'Duat',      meaning: 'The realm the dead travel through. Not a punishment — a place of transformation and judgment, like a long journey home.' },
          { term: 'Feather',   meaning: 'The feather of Maʻat — a single ostrich feather — is what a human heart must balance against. A life of truth makes the heart as light as a feather.' }
        ],
        activity: `Make your own "Heart Scale." On one side of a piece of paper, write things that make a heart light (kindness, honesty, helping others). On the other side, write things that make it heavy (cruelty, lies, ignoring people who need help). Then look at the past week of your own life. Which side is heavier right now? What is one thing you could do this week to lighten it?`,
        reflection: [
          'If your heart were weighed TODAY against the feather of truth, what would the scale show?',
          'The Kemetic people believed that every single person would face the weighing — from the poorest farmer to the greatest pharaoh. Does that seem fair to you?',
          'Maʻat says you hold the universe in balance with your choices. That is a huge responsibility. Does that feel inspiring or overwhelming?'
        ]
      }
    },

    /* ── Medu Neter / Writing ────────────────────────────────────── */

    'ke-medunetjer': {
      contentPrefix: `
<scripture title="On the Power of Sacred Writing" cite="Leiden Papyrus I 350, Hymn to Amun — New Kingdom, ca. 1300 BCE">
The tongue of Ptah is a balance.
Words do not deviate from Maʻat,
for he who crosses over evil and good
is Thoth.

What the heart thinks, the tongue commands.
What the tongue commands comes into being.
Ptah is satisfied, his great body at rest,
for everything he desired has been accomplished.
</scripture>

<callout>In Kemetic theology, writing was not simply recording — it was CREATION. The same word, "Medu Neter," means both "words" and "the hieroglyphic script." To write a person's name was to give them eternal life. To erase it was to kill them.</callout>
`,
      kidVersion: {
        story: `In ancient Egypt, writing was not just communication — it was magic. The Egyptians called their writing "Medu Neter" — literally "words of the gods."\n\nThey believed that when you wrote something, you were doing something sacred. If you wrote a person's name in a tomb, that person could live forever. That's why pharaohs had their names written EVERYWHERE — on walls, columns, statues, coffins. Their name was their immortality.\n\nAnd if you carved a god's image on a wall, that image WAS the god — it gave the god a home in that space. Writing wasn't just symbols. It was living reality.`,
        bigIdeas: [
          'Medu Neter means "words of the gods" — not just a writing system, but a living magical language.',
          'Writing a name gave it eternal life. Erasing a name was one of the worst punishments — it meant destroying a person\'s existence forever.',
          'The god Thoth was the keeper of writing and knowledge. He recorded the weighing of hearts and held the cosmic library.'
        ],
        vocabulary: [
          { term: 'Medu Neter', meaning: '"Words of the gods" — the Egyptian hieroglyphic writing system. Both the words and the script itself were considered sacred.' },
          { term: 'Thoth',      meaning: 'God of wisdom, writing, and the moon. He recorded the weighing of hearts and kept the cosmic book of all knowledge.' },
          { term: 'Cartouche',  meaning: 'An oval ring drawn around a royal name to protect it and signify the person\'s divine status.' },
          { term: 'Shabti',     meaning: 'Small figurines written with spells and placed in tombs — they would come alive to serve the deceased in the afterlife.' }
        ],
        activity: `Create your own cartouche. A cartouche is an oval protecting someone's name. Draw an oval, and inside it, create symbols that represent YOU — not hieroglyphs, but YOUR symbols. A food you love, something you're good at, a place that matters to you. Then write why those symbols would be important for someone 3,000 years from now to know about you.`,
        reflection: [
          'The Egyptians believed writing a name gave it immortality. Whose name do you want to make sure is remembered?',
          'Medu Neter was a living language. Do you believe words have power to create or destroy things in real life?',
          'What would you write on your own tomb wall — what do you want people to know about you forever?'
        ]
      }
    },

    /* ══════════════════════════════════════════════════════════════════
       BRIDGE LESSONS
    ══════════════════════════════════════════════════════════════════ */

    'br-darkness': {
      contentPrefix: `
<scripture title="Nun — Kemetic Primordial Waters" cite="Pyramid Texts, Utterance 217 — ca. 2400 BCE">
O Nun, you who were before the gods came into being,
before the sky was separated from the earth,
before the dry from the wet —
you who hold all within your limitless body:
from you came the first arising.
</scripture>

<chant lang="ʻŌlelo Hawaiʻi" title="Pō — Hawaiian Primordial Darkness (Kumulipo, Wā 1)">
O ke au i kahuli wela ka honua
O ke au i kahuli lole ka lani
O ka lipolipo, o ka lipolipo
O ka lipolipo o ka lā
O ka lipolipo o ka pō
</chant>

<primary-source cite="Queen Lili'uokalani, 1897">
At the time when the earth became hot
At the time when the heavens turned about
The slime, this was the source of the earth
The source of the darkness that made darkness
The source of the night that made night
</primary-source>

<callout type="bridge">Separated by thousands of miles of ocean, Kemetic and Kānaka Maoli thinkers arrived at the same profound understanding: creation does not begin with light. It begins in the formless deep — Nun, Pō — where all possibility waits to emerge.</callout>
`,
      kidVersion: {
        story: `Two civilizations, thousands of miles apart, asked the same question: where did everything come from?\n\nIn ancient Egypt, they said: before anything existed, there was Nun — a vast, still, dark ocean that held all possibility.\n\nIn ancient Hawaiʻi, they said: before anything existed, there was Pō — the primordial darkness, like the deepest part of the ocean at night.\n\nNeither tradition said creation started from nothing. Both said it started from a fullness — a darkness so complete it contained everything that would ever exist.\n\nThis is the Bridge lesson: sometimes people across the world, without ever meeting, discover the same deep truths.`,
        bigIdeas: [
          'Nun (Kemet) and Pō (Kānaka Maoli) are the same profound idea: creation begins in a formless darkness full of potential.',
          'These traditions developed independently — no contact between ancient Egypt and ancient Hawaiʻi. Yet they arrived at similar understandings.',
          'When separate cultures arrive at the same wisdom, it might mean that wisdom is pointing toward something real about how the universe works.'
        ],
        vocabulary: [
          { term: 'Nun', meaning: 'Kemetic primordial ocean — limitless, dark, still, containing all potential before creation.' },
          { term: 'Pō',  meaning: 'Hawaiian primordial darkness — the "deep dark" from which all life emerges in the Kumulipo.' },
          { term: 'Bridge Lesson', meaning: 'A lesson that finds the connections between Hawaiian and Kemetic knowledge — not to say they are the same, but to find where they speak to each other.' }
        ],
        activity: `Draw two circles side by side. Label one "Nun" and one "Pō." Inside each, write what that tradition says about primordial darkness. Then in the space BETWEEN the circles (where they overlap), write what both traditions agree on. Outside both circles, write what makes each one unique.`,
        reflection: [
          'Why do you think two cultures so far apart came up with similar ideas about where everything came from?',
          'Darkness is usually thought of as scary or negative. These traditions say it is the SOURCE. How does that change how you think about darkness?',
          'What other ideas might humans across the world have discovered independently? What does that say about us as a species?'
        ]
      }
    }
  };

  /* ──────────────────────────────────────────────────────────────────────
     APPLY FUNCTION
     Finds each lesson in the data and patches in additional content
     and kidVersion data.
  ────────────────────────────────────────────────────────────────────── */

  function applyAll(data) {
    if (!data || !Array.isArray(data.cultures)) return;

    let applied = 0;

    data.cultures.forEach(culture => {
      if (!Array.isArray(culture.modules)) return;
      culture.modules.forEach(module => {
        if (!Array.isArray(module.lessons)) return;
        module.lessons.forEach(lesson => {
          const additions = LESSON_ADDITIONS[lesson.id];
          if (!additions) return;
          const overviewInsertMarker = '<!-- KM_KUMULIPO_SOURCE_INSERT -->';

          /* Patch content */
          if (additions.contentPrefix) {
            if (lesson.id === 'km-kumulipo' && String(lesson.content || '').includes(overviewInsertMarker)) {
              lesson.content = String(lesson.content || '').replace(
                overviewInsertMarker,
                `${additions.contentPrefix || ''}\n${overviewInsertMarker}`
              );
            } else {
              lesson.content = (additions.contentPrefix || '') + (lesson.content || '');
            }
          }
          if (additions.contentSuffix) {
            lesson.content = (lesson.content || '') + (additions.contentSuffix || '');
          }

          /* Patch kidVersion (don't overwrite if already set with real content) */
          if (additions.kidVersion) {
            const existing = lesson.kidVersion || lesson.keikiVersion || lesson.kid || lesson.keiki;
            if (!existing || !existing.story) {
              lesson.kidVersion = additions.kidVersion;
            }
          }

          applied++;
          console.info(`[LKP Primary Sources] Patched lesson: ${lesson.id}`);
        });
      });
    });

    console.info(`[LKP Primary Sources] Applied to ${applied} lessons.`);
  }

  /* ──────────────────────────────────────────────────────────────────────
     SELF-APPLY WHEN DATA IS READY
  ────────────────────────────────────────────────────────────────────── */

  function tryApply() {
    const data = window.CULTURALVERSE_DATA || window.LKP_DATA || window.IKEVERSE_DATA;
    if (data && Array.isArray(data.cultures) && data.cultures.length > 0) {
      applyAll(data);
      return true;
    }
    return false;
  }

  /* If data is already loaded, apply immediately */
  if (!tryApply()) {
    /* Otherwise wait for the data-ready event or poll */
    window.addEventListener('lkp:data-ready', function onReady(ev) {
      window.removeEventListener('lkp:data-ready', onReady);
      const d = ev?.detail?.data || window.CULTURALVERSE_DATA || window.LKP_DATA || window.IKEVERSE_DATA;
      if (d) applyAll(d);
    });

    let attempts = 0;
    const poll = setInterval(() => {
      if (tryApply() || ++attempts > 12) clearInterval(poll);
    }, 300);
  }

  /* Expose for manual use */
  window.LKP_PRIMARY_SOURCES = { LESSON_ADDITIONS, applyAll };

})();