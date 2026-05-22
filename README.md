# Ka Paepae Ike Ola

**A living cultural knowledge platform with immersive Cultural Journeys, source-grounded lessons, galaxy navigation, profile progress, and a future XRPL learn-to-earn layer.**

Ka Paepae Ike Ola is built around living knowledge rather than a flat archive. It combines cultural learning pathways, primary-source study, responsive lesson navigation, visual progress systems, and a personal learning galaxy that grows as the learner begins and completes cultural journeys.

## What It Does

The platform helps learners explore cultural knowledge systems with care, context, and continuity. Learners can enter Cultural Journeys, study long-form lessons, read full Kumulipo Wa chant line pairs, track completion, earn Mana, and see their learning represented as a personal galaxy.

The current experience includes Kanaka Maoli, Kemet, Dogon, Vedic, Dreamtime, Maori, Yoruba, Chinese, and cross-cultural Bridge lessons, with room for many more cultures and technologies to be added over time.

## Current Experience

- Interactive homepage knowledge galaxy with culture nebulae and planet-style navigation.
- Cultural Journeys landing roadmap before entering a lesson path.
- Optional setting to skip the roadmap and resume where the learner left off.
- Culture dropdown side navigation with progress indicators, active states, and mobile support.
- Full Kumulipo Wa Deep Study pages for Wa 1-16, with Hawaiian source lines and English meanings shown together before interpretation.
- Deep creation-story study for Kanaka Maoli, Kemet, Dogon, Maori, Dreamtime, and other expanding traditions.
- Scholar and Keiki learning modes.
- Reflection prompts with saved local reflections and sync-ready structure.
- Lesson completion, Mana, badges, and progress tracking.
- Completion is locked to lesson pages and requires meaningful read progress before Mana or badges can be earned.
- Wayfinder Passport profile with a living user galaxy.
- Culture planets that appear when a learner starts a culture and evolve as lessons are completed.
- Admin profile pitch mode with quick links to the deck, galaxy, public lessons, metadata exports, and XRPL credential planning tools.
- Responsive styling across desktop, tablet, and phone, including themed scrollbars and polished navigation.

## Cultural Journeys

The lesson system is organized by culture. Each culture appears as a collapsible journey group in the side navigation, with lesson progress, active state, and completion markers.

The renderer supports:

- culture and module grouping
- learning objectives
- full lesson body rendering
- source sections and related lessons
- Scholar and Keiki modes
- reflections
- completion tracking
- previous/next navigation
- mobile-friendly reading controls

## Kumulipo Wa Deep Study

The Kumulipo section includes dedicated pages for all 16 Wa. Each Wa page opens with the chant first:

- numbered Hawaiian source line
- English meaning directly underneath
- source range and line count metadata
- interpretation and relational breakdown after the chant

The goal is to keep the primary chant visible and central, while using interpretation as support rather than replacement.

## The User's Galaxy

The profile galaxy is a personal learning map. It begins as a quiet starfield. As a learner starts lessons in a culture, that culture appears as a planet.

Planet evolution reflects progress:

- starting a culture reveals a young planet
- completing lessons clears nebula around it
- mastered topics appear as moons
- deeper learning adds orbit, glow, rings, and companion bodies
- each planet can show progress and next steps

The user's learning becomes visible as a living galaxy.

## Learn-To-Earn Direction

The future reward model is designed around care, completion, reflection, and stewardship rather than shallow streak-chasing.

Completion rewards are intentionally gated. A learner can browse lessons and profile lists freely, but Mana, badges, and completion records are only earned from inside a lesson page after progressing through the content. Profile list shortcuts return the learner to the lesson instead of awarding progress directly.

Planned learn-to-earn possibilities include:

- Mana rewards for lesson completion, reflection, and source literacy
- badges for topic mastery and cultural journey milestones
- stewardship quests connected to real-world responsibility
- portfolio-style proof of learning
- galaxy evolution tied to meaningful progress
- community review pathways before sensitive rewards are issued

The guiding principle is simple: rewards should support deeper relationship with knowledge, not turn culture into extraction.

## XRPL Blockchain Layer

The planned blockchain layer will use the XRP Ledger, XRPL. XRPL is being considered because it supports fast, low-cost transactions and native token tooling that can fit lightweight educational credentials, badges, and wallet-connected learning records.

Possible XRPL uses include:

- non-speculative learning badges
- portable proof of completed learning pathways
- future NFT-style certificates for major milestones
- wallet-linked Mana or achievement records
- community-issued credentials
- transparent reward logic for quests and learning challenges

This layer is future-facing. The current app is functional without a wallet, and cultural learning remains the center of the experience.

## Credential Metadata and NFT Readiness

The rewards engine now prepares metadata drafts with the schema `lkp.reward.metadata.v2`. These records are not minted yet; they are structured so future XRPL or NFT credential work can start from clean, reviewable fields.

Each reward or credential metadata record can include:

- `culture` - culture id and name
- `module` - module id and title
- `lesson` - lesson id and title when applicable
- `source` - source summary and source references
- `reflectionProof` - response count, local proof digest, and storage reference
- `timestamp` - credential event timestamp
- `level` - badge, lesson, or culture evolution level
- `visualEvolutionState` - planet/evolution state such as stage, moons, rings, nebula clearing, and companion bodies
- `xrpl` - future XRPL minting hints such as eligibility, network, suggested standard, taxon, and transfer policy

The current NFT path is:

1. Earn records through lesson-page completion, reflection, modules, culture paths, and galaxy evolution.
2. Review metadata v2 drafts from the admin profile settings drawer.
3. Export all NFT metadata drafts or only XRPL-ready claim records.
4. Review cultural source fields, reflection proof boundaries, and community approval needs before minting.
5. Add wallet education and consent in Digitalverse before connecting or authorizing any wallet.
6. Pin reviewed metadata and visual assets to durable storage such as IPFS or another approved asset store.
7. Mint selected records as XRPL NFTs or credentials only after review, consent, and clear non-speculative purpose.

The principle stays the same: credentials should prove learning and stewardship, not turn cultural knowledge into speculation.

## Digitalverse

Digitalverse is a planned section that will help learners navigate emerging technologies with the same care used in the cultural lessons.

Digitalverse can include:

- XRPL basics and wallet literacy
- blockchain ecosystem comparisons
- AI and LLM literacy
- prompt practice and critical evaluation
- digital identity and safety
- data ownership and consent
- ethical use of emerging tools
- bridges between cultural intelligence and modern technology

The goal is to make new technology understandable, useful, and responsible.

## Wayfinder Passport

The profile area tracks:

- learning identity
- lesson completion
- Mana
- badges
- current progress
- started lessons
- culture progress
- profile editing
- sync-ready data structures

For owner/admin users, the profile settings drawer also includes credential workflow helpers:

- export NFT metadata v2 drafts
- export XRPL-ready claim records
- stage a future XRPL wallet address without connecting a wallet
- refresh admin profile data before reviewing or publishing

The main admin profile surface remains pitch-focused, while the deeper publishing, metadata, and XRPL preparation tools live in settings.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Three.js
- Supabase-ready profile and sync code
- LocalStorage
- Font Awesome
- Google Fonts
- Future XRPL integration

## Main Files

- `index.html` - homepage and interactive galaxy entry point
- `presentation.html` - immersive web slideshow for sharing and pitching the project
- `LKP/lessons.html` - Cultural Journeys lesson experience
- `profile.html` - Wayfinder Passport and user galaxy
- `about.html` - project overview
- `admin.html` - admin deck
- `LKP/js/lkp-data.js` - core lesson and culture data
- `LKP/js/lkp-kumulipo-full-verses.js` - full Kumulipo Wa line pairs
- `LKP/js/lkp-data-rich-additions.js` - expanded lesson content
- `LKP/js/lkp-lessons.js` - lesson renderer and controls
- `LKP/js/lkp-rewards.js` - Mana, badge, metadata, claim, and XRPL-ready reward records
- `LKP/js/lkp-profile-sync.js` - Supabase-ready profile, progress, and reflection sync
- `LKP/js/profile.js` - profile logic and user galaxy
- `LKP/css/lkp-lessons.css` - Cultural Journeys styling
- `LKP/css/profile.css` - profile and galaxy styling
- `LKP/css/lkp.css` - homepage styling
- `site.webmanifest` - install metadata

## Content Data

The lesson content is static-file friendly and driven by JavaScript data files:

- `LKP/js/lkp-data.js`
- `LKP/js/lkp-kumulipo-full-verses.js`
- `LKP/js/lkp-data-rich-additions.js`
- `LKP/js/lkp-data-primary-sources.js`

This keeps the app deployable on GitHub Pages while leaving room for richer Supabase-backed publishing and XRPL-connected credentials later.

## Documentation

- [APP_REPORT_2026-05-12.md](APP_REPORT_2026-05-12.md) - implementation report
- [WA_UI_PREVIEW.md](WA_UI_PREVIEW.md) - Kumulipo Wa interface reference
- [presentation.html](presentation.html) - interactive web slideshow presentation
- [PROJECT_PRESENTATION.md](PROJECT_PRESENTATION.md) - shareable presentation and talking points
- [PRESENTATION_PAGE_PROMPT.md](PRESENTATION_PAGE_PROMPT.md) - build/resume prompt for the web presentation page

## Project Direction

Ka Paepae Ike Ola is built to honor cultural learning as relationship, not consumption. The platform is designed to keep primary sources visible, make learning progress meaningful, and create an experience where culture, place, ancestry, technology, and responsibility can be explored together.

The next major direction is to connect Cultural Journeys, the personal galaxy, Digitalverse, admin publishing, metadata review, and XRPL-powered learning credentials into one coherent learning ecosystem.
