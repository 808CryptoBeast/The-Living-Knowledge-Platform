# Ka Paepae `Ike Ola

**A living cultural knowledge platform with interactive galaxy navigation, Cultural Journeys, Kumulipo deep study, profile progress, and a personal learning galaxy.**

Ka Paepae `Ike Ola is a static-site learning platform built around living knowledge rather than a flat archive. It combines cultural lesson pathways, primary-source study, responsive navigation, visual progress systems, and a profile galaxy that grows as the learner begins and completes lessons.

## What It Does

The platform helps learners explore cultural knowledge systems with care, context, and continuity. Learners can open Cultural Journeys, study long-form lessons, read full Kumulipo Wā chant line pairs, track completion, earn Mana, and see their learning represented as a personal galaxy.

The current experience centers Kanaka Maoli, Kemet, cross-cultural bridge lessons, and expandable space for additional cultures.

## Current Experience

- Interactive homepage knowledge galaxy with Three.js navigation.
- Cultural Journeys lesson section with culture dropdowns, lesson search, progress indicators, active lesson highlighting, and responsive mobile menu behavior.
- Full Kumulipo Wā Deep Study pages for Wā 1-16, with Hawaiian source lines and English meanings shown together before interpretation.
- Kumulipo Wā navigation available from the main Kumulipo lesson, not repeated on every Wā page.
- Scholar and Keiki learning modes.
- Reflection prompts with saved local reflections and sync-ready structure.
- Lesson completion, Mana, badges, and progress tracking.
- Wayfinder Passport profile with a living user galaxy.
- Culture planets in the profile galaxy that appear when a learner starts a culture and evolve as lessons are completed.
- Responsive styling across desktop, tablet, and phone, including themed scrollbars and polished navigation.

## Key Features

### Cultural Journeys

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

### Kumulipo Wā Deep Study

The Kumulipo section includes dedicated pages for all 16 Wā. Each Wā page now opens with the full chant section available in the data file:

- numbered Hawaiian source line
- English meaning directly underneath
- source range and line count metadata
- interpretation and relational breakdown after the chant

This keeps the primary chant first, while still supporting the deeper learning scaffold.

### The User's Galaxy

The profile galaxy is a personal learning map. It begins as a quiet starfield. As a learner starts lessons in a culture, that culture appears as a planet.

Planet evolution reflects progress:

- starting a culture reveals a young planet
- completing lessons clears nebula around it
- mastered topics appear as moons
- deeper learning adds orbit, glow, rings, and companion bodies
- each planet can show progress and next steps

The goal is simple: the user's learning becomes visible as a living galaxy.

### Wayfinder Passport

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

### Responsive Interface

The project treats mobile as a primary experience. Current responsive work includes:

- polished top navigation
- mobile dropdown menu with outside-click and Escape close behavior
- collapsible culture side navigation
- scrollable sidebars and lesson panels
- themed scrollbars
- mobile lesson layout and fullscreen hero image support

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Three.js
- Supabase-ready profile/sync code
- LocalStorage
- Font Awesome
- Google Fonts

## Main Files

- `index.html` - homepage and interactive galaxy entry point
- `LKP/lessons.html` - Cultural Journeys lesson experience
- `profile.html` - Wayfinder Passport and user galaxy
- `about.html` - project overview
- `admin.html` - admin deck
- `LKP/js/lkp-data.js` - core lesson and Kumulipo Wā data
- `LKP/js/lkp-kumulipo-full-verses.js` - full Kumulipo Wā line pairs
- `LKP/js/lkp-lessons.js` - lesson renderer and controls
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

This keeps the app deployable on GitHub Pages while leaving room for richer Supabase-backed publishing later.

## Documentation

- [APP_REPORT_2026-05-12.md](APP_REPORT_2026-05-12.md) - current implementation report, now updated with recent changes
- [WA_UI_PREVIEW.md](WA_UI_PREVIEW.md) - Kumulipo Wā interface reference
- [PROJECT_PRESENTATION.md](PROJECT_PRESENTATION.md) - shareable presentation and talking points

## Project Direction

Ka Paepae `Ike Ola is built to honor cultural learning as relationship, not consumption. The platform is designed to keep primary sources visible, make learning progress meaningful, and create an experience where culture, place, ancestry, technology, and responsibility can be explored together.
