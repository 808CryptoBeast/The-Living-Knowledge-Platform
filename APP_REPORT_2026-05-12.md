# Ka Paepae ʻIke Ola — App Report

**Report date:** 2026-05-12

## Summary
Ka Paepae ʻIke Ola is a living knowledge platform for cultural learning, lesson navigation, and identity-driven progress tracking. The current build combines a desktop Three.js knowledge galaxy, a mobile-first explorer, a deep lessons engine, profile sync, and reward systems into one static-site experience that works across desktop and mobile.

## Current Public Description
A living cultural knowledge platform that blends interactive 3D navigation, deep lesson paths, profile progress, and Indigenous knowledge systems across the Ikeverse.

## What the App Does
The platform lets users explore living knowledge systems through a star-map style interface, open lesson pages, track completion, and store learning progress across devices when signed in. It is designed to feel like an active learning environment rather than a static archive.

## Core Experience
- Desktop 3D knowledge galaxy with hover, click, zoom, and pan controls.
- Mini live preview viewer in the navigation section.
- Mobile fullscreen 3D explorer with its own viewer, controls, and help sheet.
- Deep lessons page with culture filters, lesson search, related concepts, visuals, sources, and lesson navigation.
- Lesson hero fullscreen viewer for larger artwork viewing.
- Swipe navigation and a compact mobile lesson scrubber.
- Profile and rewards system with Mana, badges, streaks, and cloud sync.

## Lesson System
The lessons engine renders lessons from structured cultural data. It now supports:
- culture and module grouping
- learning objectives
- scholar and keiki modes
- reflection prompts saved locally and synced when available
- lesson hero image resolution with fallback placeholders
- per-lesson image strips
- concept-based related lessons
- source badges with inferred or explicit metadata
- lesson completion and progress tracking
- resume-last-opened-lesson behavior on return visits

## Navigation and Viewer System
The homepage navigation section now includes:
- a live mini viewer mirroring the main 3D scene
- zoom, reset, and pause controls
- a mobile fullscreen viewer launcher
- an onboarding help sheet for mobile viewer gestures

The main viewer uses Three.js with orbit controls, bloom, picking, and an expanded camera range so the galaxy starts farther out and allows broader zooming and panning.

## Mobile Experience
The mobile experience is no longer a reduced fallback. It now includes:
- a dedicated mobile galaxy interface
- a mobile fullscreen 3D viewer
- its own loader and upload animation
- swipe navigation between lessons
- a sticky mobile lesson scrubber
- a hero fullscreen viewer for lesson images
- responsive sidebar and lesson layout behavior

## Branding and Icons
The app is now aligned around the nav brand mark image:
- favicon and app icons point to the nav brand image
- manifest and browser tile assets use the same mark
- loading screens use the same icon with an animated uploading effect
- social metadata points to the same brand image for a consistent public identity

## Data and Content
The data layer is file-driven and merged from:
- `LKP/js/lkp-data.js`
- `LKP/js/lkp-data-rich-additions.js`
- `LKP/js/lkp-data-primary-sources.js`

This keeps the site static-file friendly while still allowing richer lesson metadata, sources, and cross-culture connections.

## Technology Stack
- HTML5
- CSS3
- JavaScript
- Three.js
- Supabase
- LocalStorage
- Font Awesome
- Google Fonts

## File Map
- `index.html` — homepage and 3D navigation entry point
- `about.html` — project overview
- `profile.html` — Wayfinder Passport and rewards
- `admin.html` — admin deck
- `LKP/lessons.html` — deep lessons page
- `LKP/js/lkp-three.js` — desktop 3D galaxy and loaders
- `LKP/js/lkp-mobile.js` — mobile experience and loader
- `LKP/js/lkp-lessons.js` — lesson rendering engine
- `LKP/css/lkp.css` — homepage and viewer styling
- `LKP/css/lkp-mobile.css` — mobile app styling
- `LKP/css/lkp-lessons.css` — lessons styling
- `site.webmanifest` — app icon and install metadata
- `browserconfig.xml` — Windows tile icon metadata

## Notes
This report reflects the current implementation after the latest mobile, branding, and documentation updates. It can be used as a handoff note for future work, releases, or GitHub documentation.
