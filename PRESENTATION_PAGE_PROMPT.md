# Presentation Page Build Prompt

Use this prompt to continue the Ka Paepae Ike Ola presentation page build if the stream disconnects again.

## Goal

Create a polished, immersive, web-based slideshow presentation for **Ka Paepae Ike Ola - The Living Knowledge Platform**.

The output should be a standalone `presentation.html` file in the project root. It should be easy to open locally, host on GitHub Pages, or share during a live pitch/demo.

## Current Project Context

The project is a static web app with:

- `index.html` - main immersive galaxy homepage
- `LKP/lessons.html` - Cultural Journeys lesson system
- `profile.html` - Wayfinder Passport and personal galaxy
- `about.html` - project overview
- `README.md` - updated with XRPL, Digitalverse, and learn-to-earn direction
- `PROJECT_PRESENTATION.md` - markdown speaker notes and presentation content

Important recent additions:

- Cultural Journeys landing roadmap
- option to skip the roadmap and resume the last lesson
- improved roadmap popup styling
- lesson completion is locked to lesson pages after meaningful read progress
- XRPL learn-to-earn roadmap copy
- reward metadata schema `lkp.reward.metadata.v2`
- NFT metadata draft and XRPL-ready claim exports from the admin profile settings drawer
- Digitalverse future section concept
- expanding cultures including Kanaka Maoli, Kemet, Dogon, Vedic, Dreamtime, Maori, Yoruba, Chinese, and Bridge lessons
- profile galaxy where cultures become evolving planets

## Required File

Create:

- `presentation.html`

Do not replace `index.html`. This is a separate presentation deck page.

## Presentation Content

Use the content from `PROJECT_PRESENTATION.md`, but update it to include:

1. **Title**
   - Ka Paepae Ike Ola
   - The Living Knowledge Platform
   - Cultural learning as relationship, memory, and responsibility.

2. **Problem**
   - Most learning tools flatten cultural knowledge into isolated facts, summaries, or checklists.
   - The platform responds by keeping source, relation, reflection, and practice visible.

3. **Vision**
   - Cultural learning becomes a journey.
   - Learners do not just consume information; they enter a living map of knowledge.

4. **Core Experience**
   - interactive homepage galaxy
   - Cultural Journeys
   - Kumulipo Wa deep study
   - Scholar and Keiki modes
   - reflections
   - Mana, badges, progress
   - Wayfinder Passport
   - personal user galaxy

5. **Cultural Journeys**
   - culture dropdown navigation
   - lessons by culture and module
   - progress indicators
   - mobile support
   - roadmap landing page
   - resume where the learner left off

6. **Kumulipo Wa Deep Study**
   - Wa 1-16
   - Hawaiian source lines
   - English meaning underneath each line
   - interpretation after the chant
   - primary source first

7. **Expanding Knowledge Worlds**
   - Kanaka Maoli
   - Kemet
   - Dogon
   - Vedic
   - Dreamtime
   - Maori
   - Yoruba
   - Chinese
   - Bridge lessons

8. **The User's Galaxy**
   - each started culture becomes a planet
   - lessons completed evolve the planet
   - moons, rings, nebula clearing, stars, orbit, companion bodies
   - visual story of breadth and depth

9. **Learn-To-Earn**
   - rewards should support depth, care, and reflection
   - Mana for learning and reflection
   - completion rewards are earned only from inside lesson pages after read progress
   - badges for topic mastery
   - stewardship quests
   - portfolio proof of learning
   - avoid turning culture into speculation or extraction

10. **XRPL Layer**
   - planned future blockchain layer using XRPL
   - XRPL is suitable for low-friction learning records, badges, tokens, and future credentialing
   - metadata v2 already includes culture, lesson, module, source, reflection proof, timestamp, level, and visual evolution state
   - admin profile settings can export NFT metadata drafts and XRPL-ready claim records
   - wallet use should come after education and consent
   - current app works without wallet connection

11. **Digitalverse**
   - future learning section for emerging technologies
   - XRPL basics
   - blockchain ecosystems
   - AI and LLM literacy
   - wallets and safety
   - data ownership and consent
   - responsible use of new tools

12. **Live Demo Flow**
   - homepage galaxy
   - Cultural Journeys
   - open a culture section
   - Kumulipo Wa page
   - Scholar/Keiki toggle
   - mark complete
   - profile galaxy

13. **Next Phase**
   - more cultures
   - educator guides
   - community review workflows
   - admin publishing
   - metadata review workflow for badges, certificates, and culture evolution records
   - XRPL/NFT credential preparation after consent and wallet education
   - richer galaxy dashboard
   - Digitalverse buildout
   - XRPL-ready credentials

## Credential Metadata / NFT Notes

The rewards engine uses `lkp.reward.metadata.v2` metadata drafts for future credentials. Metadata should be treated as review material until source, reflection, visual asset, community approval, and learner consent requirements are satisfied.

Important fields:

- `culture`
- `module`
- `lesson`
- `source`
- `reflectionProof`
- `timestamp`
- `level`
- `visualEvolutionState`
- `xrpl`

Admin profile settings should support this work by keeping exports and XRPL preparation in the drawer, not on the main learner-facing profile surface:

- export all NFT metadata drafts
- export XRPL-ready claim records
- stage a future XRPL wallet address without connecting a wallet
- refresh admin profile/reward state before review

14. **Closing**
   - Knowledge is not only read, but entered, remembered, practiced, and carried forward.

## Design Requirements

The page should feel like a premium immersive deck, not a plain document.

Style direction:

- dark cosmic background
- gold/cyan accents
- subtle cultural geometry
- soft glass panels
- strong typography
- responsive for desktop, tablet, and phone
- readable in a projector setting
- no clutter

Use available assets:

- `LKP/assets/images/LKP-1.png`
- `LKP/assets/images/kaikeola.png`
- `LKP/assets/images/cosmic-weave.png`
- `LKP/assets/images/km-kumulipo.png`
- `LKP/assets/images/kemet.png`
- `LKP/assets/images/dreamtime/dreamtime-culture.png`
- `LKP/assets/images/maori/mi-te-po.png` if present

If an image fails to load, the slide should still look good.

## Interactivity Requirements

Add:

- next and previous buttons
- keyboard navigation:
  - ArrowRight / Space = next
  - ArrowLeft = previous
  - Home = first slide
  - End = last slide
  - N = toggle speaker notes
  - F = fullscreen
- clickable slide dots
- progress bar
- slide counter
- speaker notes drawer or panel
- fullscreen button
- "Open App" link to `index.html`
- "Open Cultural Journeys" link to `LKP/lessons.html`
- "Open Profile" link to `profile.html`

## Three.js Requirement

Use Three.js if practical:

- create a lightweight starfield background
- use `https://unpkg.com/three@0.160.0/build/three.module.js`
- do not make the page fail if Three.js cannot load
- provide CSS fallback stars

The Three.js scene should be decorative and lightweight:

- no heavy models
- no blocking loading state
- subtle moving particles
- responsive resize support

## Technical Requirements

- Single standalone HTML file.
- Inline CSS is acceptable.
- Inline JS is acceptable.
- No build step required.
- Must work from local file or static host.
- Keep accessibility in mind:
  - buttons have labels
  - slide region has useful labels
  - content remains readable without animation
- Respect reduced motion:
  - if `prefers-reduced-motion`, reduce or stop animations.

## Documentation Updates

After creating `presentation.html`, update:

1. `README.md`
   - add `presentation.html` to the Main Files list
   - update Documentation section to mention the web slideshow

2. `PROJECT_PRESENTATION.md`
   - add a top note:
     - "Open `presentation.html` for the interactive web slideshow."
   - add XRPL, Digitalverse, and learn-to-earn to the slide outline if missing.

## Validation

After edits:

- confirm `presentation.html` exists
- run:
  - `node --check LKP/js/lkp-lessons.js`
  - `node --check LKP/js/lkp-data.js`
  - `node --check LKP/js/lkp-data-rich-additions.js`
- search for:
  - `presentation.html`
  - `XRPL`
  - `Digitalverse`
  - `learn-to-earn`

## Final Response

Keep final response concise:

- say `presentation.html` was created
- mention README and PROJECT_PRESENTATION updates
- mention validation checks
- give the local file to open: `presentation.html`
