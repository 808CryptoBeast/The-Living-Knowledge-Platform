# Ka Paepae ʻIke Ola

**GitHub description:** A living cultural knowledge platform with interactive 3D navigation, deep lessons, progress tracking, and mobile-friendly learning across the Ikeverse.

Ka Paepae ʻIke Ola is a static-site learning platform built around living knowledge rather than a flat archive. It combines a desktop Three.js knowledge galaxy, a mobile-first explorer, a lessons engine, a rewards and profile system, and a visual brand built around the platform’s nav mark.

## What It Does

The app lets learners explore cultural knowledge systems, open deep lesson pages, track completion, and return to their last lesson later. It is organized around Kānaka Maoli, Kemet, and cross-cultural bridge lessons, with room for future expansion across the wider Ikeverse.

## Current Experience

- Desktop 3D knowledge galaxy with hover, click, zoom, pan, and lesson selection.
- Mini live viewer in the homepage navigation area.
- Mobile fullscreen 3D explorer with its own controls and help sheet.
- Lessons page with culture filters, search, related concepts, lesson images, and sources.
- Lesson hero fullscreen viewer for image viewing on small screens and desktop.
- Swipe navigation, mobile lesson scrubber, and resume-last-lesson behavior.
- Profile passport with Mana, rewards, badges, and sync support.

## Key Features

### 1. Knowledge Galaxy

The homepage uses Three.js to render a living sky-map of concepts and lessons. It includes a main explorer, a preview viewer, and a mobile fullscreen viewer that shares the same knowledge graph.

### 2. Deep Lessons

The lessons system supports:

- lesson objectives
- scholar and keiki modes
- reflection prompts
- completion tracking
- source badges with inference and overrides
- image strips and hero artwork
- concept-based related lessons
- prev/next navigation
- mobile swipe navigation

### 3. Wayfinder Passport

The profile area tracks learning identity, completion progress, Mana, badges, and cloud-sync-ready profile data.

### 4. Rewards

The reward system uses Mana, XP, streaks, ranks, and badges to reinforce learning momentum.

### 5. Mobile-First Behavior

Mobile is treated as a primary experience, not a fallback. The mobile app has its own loader, explorer flow, and lesson-friendly layout choices.

## Branding and Icon System

The repo now uses the nav brand mark as the shared icon identity:

- favicon and app icons use the same brand image
- manifest and Windows tile metadata point to the same mark
- loader screens use the same icon with an uploading animation
- social preview metadata stays aligned with the same visual identity

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Three.js
- Supabase
- LocalStorage
- Font Awesome
- Google Fonts

## Main Files

- `index.html` — homepage and desktop 3D entry point
- `LKP/lessons.html` — deep lessons page
- `profile.html` — Wayfinder Passport
- `admin.html` — admin deck
- `LKP/js/lkp-three.js` — desktop Three.js galaxy and loader
- `LKP/js/lkp-mobile.js` — mobile experience and loader
- `LKP/js/lkp-lessons.js` — lesson renderer and lesson controls
- `LKP/css/lkp.css` — homepage and loader styles
- `LKP/css/lkp-mobile.css` — mobile app styles
- `LKP/css/lkp-lessons.css` — lessons styles
- `site.webmanifest` — install metadata
- `browserconfig.xml` — Windows tile metadata

## Data Sources

The content layer is driven by:

- `LKP/js/lkp-data.js`
- `LKP/js/lkp-data-rich-additions.js`
- `LKP/js/lkp-data-primary-sources.js`

This keeps the platform static-file friendly while still supporting richer lesson metadata and source handling.

## Documentation

For a detailed current-state report, see [APP_REPORT_2026-05-12.md](APP_REPORT_2026-05-12.md).

## Notes

This repository is structured to stay compatible with GitHub Pages and future Supabase-backed growth. The app is intentionally additive: new features are layered on top of the existing experience rather than replacing it.