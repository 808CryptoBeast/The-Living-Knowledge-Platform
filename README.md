# Ka Paepae ʻIke Ola — The Living Knowledge Platform

**An immersive cultural learning platform with a live Three.js knowledge galaxy, nine culture lesson paths, source-grounded study, and a personal progress galaxy that mirrors the learner's journey.**

Ka Paepae ʻIke Ola is built around living knowledge rather than a flat archive. Learners explore cultural cosmologies, primary sources, long-form lessons, and interdisciplinary connections through an interactive 3D starfield. Their learning is reflected back as a personal galaxy that grows in brightness and complexity as they study.

---

## What It Does

Learners enter Cultural Journeys across nine traditions, study source-grounded lessons, write reflections, earn Mana, and watch their progress materialize as stars, nebulae, and connecting threads in a personal galaxy. The main homepage galaxy shows all nine culture nebulae. The profile galaxy shows every lesson from every culture — lit or dim based on how far each one has been read and completed.

---

## Nine Living Culture Traditions

| Culture | Theme | Lessons |
|---|---|---|
| Kānaka Maoli | Cosmology, Navigation, Ecology | 16+ incl. full Kumulipo Wā |
| Kemet | Creation, Sacred Geometry, Medicine | 8+ |
| Dogon | Astronomy, Sirius System, Cosmology | 6+ |
| Vedic | Consciousness, Mathematics, Ecology | 6+ |
| Dreamtime | Country, Songlines, Kinship | 6+ |
| Māori | Whakapapa, Navigation, Ecology | 6+ |
| Yoruba | Ifá, Oshun, Divination | 6+ |
| Chinese | Taoism, Five Elements, Astronomy | 6+ |
| The Bridge | Cross-cultural connections across all traditions | 7 |

---

## Main Features

### Homepage Galaxy
- Full-screen Three.js starfield with nine distinct nebula clusters, one per culture
- Each culture has a unique color palette — no two galaxies share the same hue
- Click any star to zoom to that culture's galaxy and open a culture detail panel
- Culture chip filter pills zoom the camera to the selected nebula and highlight it
- Double-click a star to navigate directly into that lesson
- First-visit animated hint that dismisses on first interaction and saves the preference
- Mobile tap ripple animation on canvas interaction
- Horizontal scroll culture cards on mobile with snap scrolling

### Culture Panel (slide-in)
- Clicking a culture star opens a side panel showing glyph, name, tagline, lesson count, intro, and a direct "Enter Culture" link
- Panel slides in from the right on desktop, anchors to the bottom on mobile
- Closes on ✕ button, Escape key, or clicking another culture

### Profile Galaxy — Personal Learning Map
- Nine culture nebula clusters always visible, positioned around the sun in 3D space
- **Untouched cultures** appear as dim ghost nebulae — the full shape of what's possible
- **Engaged cultures** grow brighter as the learner progresses
- Each lesson in every culture is a star orbiting its culture cluster:
  - **Not started** → tiny dark dot, 18% opacity, slow drift
  - **In progress** → brightness scales smoothly from 0% to 100% read — a 40% read lesson glows at ~40%
  - **Completed** → full-color emissive star with glow, fast orbit
- Cross-culture connection threads link related lessons across traditions, color-coded by axis (Cosmology = cyan, Bridge = violet, Ecology = emerald, etc.)
- Threads pulse and update in real time as lesson stars move
- Clicking a culture core shows culture overview panel with lesson count and progress
- Clicking a lesson star shows lesson title, module context, read status, and CTA button
- Double-click any star to open that lesson directly
- Completion burst — when a lesson is newly completed, 28 particles scatter outward from that star and fade over 900ms
- Sun and background starfield always visible from the first visit, even before any lessons are started

### Kumulipo Wā Deep Study
- Full Wā 1–16 verse pairs: numbered Hawaiian source line, English meaning, source metadata
- Primary chant appears first; interpretation follows as support, not replacement

### Lesson Experience
- Scholar and Keiki learning modes
- Reflection prompts with saved local responses
- Lesson completion gated to meaningful read progress (tracked via scroll position)
- Read progress persists in `lkp_lesson_read_progress_v1` and flows into the profile galaxy as fractional star brightness
- Previous/next navigation, hero images, related lessons, source citations

### Wayfinder Passport (Profile)
- Learning identity, Mana, badges, ranks
- Culture progress, started/completed lesson counts
- Admin settings drawer with NFT/XRPL metadata tools

### PWA Support
- Service worker with cache-first strategy for shell, data, and images
- `beforeinstallprompt` install banner on all pages — appears after 30s or 400px of scroll
- One-tap install, permanent dismiss, works offline after install

---

## Architecture

### Data Layer
Culture data lives in individual files that register themselves before the assembler runs:

```
LKP/js/
  lkp-data.js                     ← assembler (reads window._LKP_CULTURES)
  cultures/
    kanaka/
      lkp-culture-kanaka.js        ← 2,200+ lines incl. Kumulipo helpers
      lkp-kumulipo-full-verses.js
      lkp-kumulipo-wa-ui.js
    kemet/lkp-culture-kemet.js
    bridge/lkp-culture-bridge.js
    dogon/lkp-culture-dogon.js
    vedic/lkp-culture-vedic.js
    dreamtime/lkp-culture-dreamtime.js
    maori/lkp-culture-maori.js
    yoruba/lkp-culture-yoruba.js
    chinese/lkp-culture-chinese.js
```

All nine culture files load in parallel via `Promise.all`. A script deduplication cache (`_LKP_SCRIPT_CACHE`) prevents double-execution if `LKP_LOAD_SHARED_DATA` is called from multiple places before data is ready.

### 3D Galaxy
- `lkp-three.js` — main page Three.js renderer; raycasting, camera zoom, star animation
- `lkp-galaxy-builder.js` — shared builder; computes culture cluster positions, nebula colors, lesson concept nodes, and cross-culture connections from `CULTURALVERSE_DATA`
- `profile.js` — profile galaxy renderer; builds culture clusters at fixed 3D positions, lesson stars with per-state visuals, connection threads, and completion bursts

### Service Worker
- Cache version `lkp-v4`
- Caches shell HTML, all CSS/JS, culture data files, and images
- Chrome-extension scheme guard prevents caching non-http(s) URLs

---

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Three.js (WebGL galaxy rendering, via ESM import on profile; bundled on homepage)
- Supabase (profile sync, remote progress, managed content)
- LocalStorage (offline-first progress, read progress, reflection storage)
- Service Worker + Web App Manifest (PWA, offline support)
- Font Awesome, Google Fonts
- XRPL integration (planned — metadata schema ready, minting pending review)

---

## File Map

```
index.html                          ← Homepage + main galaxy
profile.html                        ← Wayfinder Passport + personal galaxy
about.html                          ← Project overview
admin.html                          ← Admin deck
presentation.html                   ← Web slideshow presentation
sw.js                               ← Service worker (lkp-v4)
site.webmanifest                    ← PWA manifest

LKP/
  lessons.html                      ← Cultural Journeys lesson experience
  js/
    lkp-data.js                     ← Culture data assembler
    lkp-galaxy-builder.js           ← Shared galaxy definition builder
    lkp-three.js                    ← Homepage Three.js galaxy renderer
    lkp-lessons.js                  ← Lesson renderer, read progress, completion
    lkp-rewards.js                  ← Mana, badges, NFT metadata (v2 schema)
    lkp-profile-sync.js             ← Supabase profile/progress/reflection sync
    lkp-mobile.js                   ← Mobile galaxy viewer
    profile.js                      ← Profile galaxy, culture clusters, lesson stars
    cultures/
      kanaka/ kemet/ bridge/ dogon/
      vedic/ dreamtime/ maori/
      yoruba/ chinese/
  css/
    lkp.css                         ← Homepage styles
    lkp-brand.css                   ← Shared brand tokens + PWA banner
    lkp-lessons.css                 ← Cultural Journeys styles
    profile.css                     ← Profile and galaxy styles
```

---

## Learn-To-Earn Direction

The reward model is built around care, completion, reflection, and stewardship — not streak-chasing.

- Mana is earned from inside lesson pages after meaningful read progress
- Badges mark topic mastery and cultural journey milestones
- NFT metadata schema (`lkp.reward.metadata.v2`) is structured and ready for review
- XRPL minting is planned for after community review and consent processes
- The guiding principle: credentials should prove learning and stewardship, not turn culture into extraction

---

## Documentation

- [APP_REPORT_2026-06-13.md](APP_REPORT_2026-06-13.md) — current implementation report
- [WA_UI_PREVIEW.md](WA_UI_PREVIEW.md) — Kumulipo Wā interface reference
- [presentation.html](presentation.html) — interactive web slideshow
- [PROJECT_PRESENTATION.md](PROJECT_PRESENTATION.md) — shareable talking points

---

## Project Direction

Ka Paepae ʻIke Ola is built to honor cultural learning as relationship, not consumption. Primary sources stay visible. Progress is meaningful. The personal galaxy grows as the learner deepens their relationship with each tradition.

The next direction is connecting Cultural Journeys, the personal galaxy, Digitalverse, admin publishing, metadata review, and XRPL-powered credentials into one coherent living ecosystem.
