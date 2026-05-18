# Ka Paepae `Ike Ola - App Report

**Original report date:** 2026-05-12  
**Updated:** 2026-05-18

## Summary

Ka Paepae `Ike Ola is a living knowledge platform for cultural learning, lesson navigation, profile progress, and identity-driven exploration. The current build combines an interactive galaxy interface, the Cultural Journeys lesson engine, full Kumulipo Wā deep study pages, a Wayfinder Passport profile, a personal user galaxy, and reward/progress systems into one static-site experience.

## Current Public Description

A living cultural knowledge platform that blends interactive galaxy navigation, Cultural Journeys, full Kumulipo Wā study, profile progress, and Indigenous knowledge systems across the Ikeverse.

## What the App Does

The platform lets users explore living knowledge systems through a star-map style interface, open lessons, read source-grounded cultural material, track completion, and visualize learning progress. It is designed to feel like a living learning environment rather than a static archive.

## Core Experience

- Homepage knowledge galaxy with interactive navigation.
- Cultural Journeys lesson page with culture dropdown navigation.
- Full Kumulipo Wā Deep Study pages for Wā 1-16.
- Hawaiian source lines paired with English meanings before interpretation.
- Scholar and Keiki learning modes.
- Reflection prompts and saved responses.
- Lesson completion, Mana, badges, and local progress.
- Wayfinder Passport profile with editable identity.
- Personal user galaxy where started cultures appear as planets.
- Responsive top navigation, side navigation, and themed scrollbars.

## Cultural Journeys

The former "Deep Lessons" experience has been renamed and reframed as **Cultural Journeys**. The side navigation now lists cultures as collapsible sections. Each culture section can contain modules and lessons, with progress shown at the culture level and active lessons highlighted.

The lesson system supports:

- culture and module grouping
- dropdown culture navigation
- progress labels and completion indicators
- active lesson highlighting
- search
- lesson objectives
- Scholar and Keiki modes
- reflection prompts
- hero images and fullscreen viewing
- related concepts and related lessons
- previous/next navigation
- mobile swipe and scrubber behavior

## Kumulipo Wā System

The Kumulipo section now includes complete Wā pages for all 16 Wā. The recent data update added full verse pairs for each Wā using:

- numbered source line
- Hawaiian line
- English meaning
- source range metadata
- expected line count metadata

The full chant section appears at the top of each Wā page, before the interpretation and breakdown. This keeps the primary source as the first point of contact.

## User Galaxy

The profile galaxy has been reworked into **The User's Galaxy - A Living Map of Cultural Learning**.

The galaxy starts as a dark field with distant stars. When the learner starts lessons in a culture, that culture appears as a planet. As learning deepens, the planet evolves:

- nebula clears around the planet
- moons appear for mastered topics
- a star and orbit become visible
- rings, atmosphere glow, and companion bodies can appear with deeper progress

The galaxy communicates two kinds of learning:

- many young planets: broad exploration across cultures
- fewer evolved planets: deep study within specific cultures

## Navigation and UI

Recent interface updates include:

- top navigation polish
- animated mobile navigation menu
- outside-click, Escape, and link-click close behavior
- culture side navigation dropdowns using explicit button controls
- accessibility attributes for dropdowns and menus
- improved active states and hover states
- themed scrollbars across the lesson and profile surfaces
- cache-busting query strings for updated CSS/JS assets

## Profile and Rewards

The Wayfinder Passport includes:

- profile identity fields
- lesson progress
- Mana and reward state
- badges and ranks
- started lessons
- completed lessons
- culture progress
- personal galaxy visualization

The profile form fields now include stable `name` attributes to improve browser behavior and reduce autofill warnings.

## Content and Data

The data layer is file-driven and merged from:

- `LKP/js/lkp-data.js`
- `LKP/js/lkp-kumulipo-full-verses.js`
- `LKP/js/lkp-data-rich-additions.js`
- `LKP/js/lkp-data-primary-sources.js`

This keeps the site static-file friendly while supporting richer lesson metadata, sources, and cross-culture connections.

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Three.js
- Supabase-ready profile/sync code
- LocalStorage
- Font Awesome
- Google Fonts

## File Map

- `index.html` - homepage and galaxy entry point
- `about.html` - project overview
- `profile.html` - Wayfinder Passport and user galaxy
- `admin.html` - admin deck
- `LKP/lessons.html` - Cultural Journeys page
- `LKP/js/lkp-lessons.js` - lesson rendering engine
- `LKP/js/lkp-data.js` - lesson and Wā data
- `LKP/js/lkp-kumulipo-full-verses.js` - Kumulipo source line pairs
- `LKP/js/profile.js` - profile and user galaxy logic
- `LKP/css/lkp-lessons.css` - Cultural Journeys styling
- `LKP/css/profile.css` - profile styling
- `LKP/css/lkp.css` - homepage styling

## Current Status

The current implementation is static-site friendly and ready for continued content expansion. The strongest near-term opportunities are:

- adding more culture modules
- adding more source notes and media assets
- expanding the profile galaxy dashboard summaries
- preparing a guided demo route for public presentations
- connecting admin publishing flows to persistent storage
