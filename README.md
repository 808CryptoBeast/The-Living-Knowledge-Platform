# Ka Paepae ʻIke Ola  
## The Living Knowledge Platform

**Ka Paepae ʻIke Ola — The Living Knowledge Platform** is an interactive cultural learning platform designed to preserve, organize, and teach living knowledge systems through modern web technology.

This project brings together cultural education, historical research, celestial navigation, interactive lessons, profile-based learning, and future-ready blockchain integration. It begins with Kanaka Maoli knowledge and expands outward toward other Indigenous, ancestral, and ancient civilizations across the world.

This is not built as a static history archive. It is built as a living learning environment.

---

## 🌺 Project Vision

The Living Knowledge Platform is designed to become a digital learning foundation where culture, history, technology, and identity are connected.

The goal is to create a space where learners can:

- study living knowledge systems with respect and depth
- explore cultural lessons through interactive visual systems
- follow learning paths across different civilizations and traditions
- track progress through a personal Wayfinder Passport
- earn internal learning rewards such as Mana, badges, and certificates
- prepare for future blockchain-based learning records through XRPL integration
- connect with the wider Ikeverse, Culturalverse, Digitalverse, IkeHub, IkeStar, and Pikoverse ecosystem

---

## 🧭 Meaning of the Name

**Ka Paepae ʻIke Ola** can be understood as a foundation or platform for living knowledge.

- **Ka Paepae** — the foundation, platform, or raised base
- **ʻIke** — knowledge, understanding, insight
- **Ola** — life, living, health, vitality

Together, the name reflects the purpose of this project:

> A foundation for knowledge that is alive, carried forward, practiced, taught, and connected across generations.

---

## 🌌 Core Features

### 1. Interactive Knowledge Galaxy

The platform uses Three.js to create an interactive cosmic learning map. Each connected realm appears as its own orbiting world with nebulae, cosmic dust, mini-planets, and distinct colors.

Current realm palettes include:

- **LKP** — Gold / Cyan
- **Ikeverse** — Emerald / Jade
- **Culturalverse** — Amber / Rust
- **Digitalverse** — Violet / Neon Cyan
- **IkeStar** — Star Blue / White
- **Pikoverse** — Gold / Orange

Users can click a realm to focus on it, view a preview card, reset the galaxy view, center the sun, or open the selected realm.

---

### 2. Wayfinder Passport Profile

The profile section acts as the user’s learning identity across the platform.

Features include:

- user sign-in and profile creation
- display name, handle, bio, avatar URL, and home realm
- lesson progress tracking
- completed lesson count
- Mana count
- learning percentage
- badges and reward progress
- admin-aware profile experience
- future-ready connection to ecosystem-wide identity

The profile is designed to become the user’s personal learning passport through the full platform ecosystem.

---

### 3. Mana Rewards System

The platform includes an internal reward system built around learning progression.

Current reward elements include:

- Mana
- XP
- daily check-ins
- learning streaks
- rank progression
- badges
- module completion
- culture path completion
- XRPL-ready certificate records for future expansion

The Mana system is not meant to replace the value of knowledge. It is meant to encourage accountability, consistency, and learning momentum.

---

### 4. Lesson Path System

Lessons are structured into cultures, modules, and individual learning experiences.

Users can:

- search lessons
- filter by culture
- filter by completion status
- mark lessons as complete
- track progress locally or through Supabase
- connect learning progress to future rewards

The lesson system is designed to support both current static data and future admin-managed Supabase content.

---

### 5. Admin-Ready Structure

The platform is being built with an admin layer in mind.

Admin and owner users will eventually be able to:

- add lessons
- edit lessons
- manage cultures
- manage galaxies
- manage modules
- manage sources
- publish updates
- control learning content across the platform

The profile system already recognizes upgraded roles such as:

- `user`
- `admin`
- `owner`

---

### 6. Time-of-Day Background System

The profile experience includes a dynamic visual background that changes by time of day:

- Dawn
- Day
- Dusk
- Night

This works alongside dark and light mode, allowing combinations such as:

- dark night
- dark dawn
- light day
- light dusk

The goal is to make the platform feel alive rather than static.

---

## 🛠️ Technology Stack

This project currently uses:

- **HTML5**
- **CSS3**
- **JavaScript**
- **Three.js**
- **Supabase**
- **Supabase Auth**
- **Supabase Database**
- **LocalStorage**
- **Font Awesome**
- **Google Fonts**
- **GitHub Pages-compatible structure**

Future integrations may include:

- XRPL wallet connection
- XRPL learning records
- NFT-style proof of completion
- credential verification
- expanded admin dashboards
- dynamic culture/lesson publishing
- multi-chain learning records

---

## 📁 Suggested Project Structure

```text
project-root/
│
├── index.html
├── lessons.html
├── profile.html
├── admin.html
│
├── LKP/
│   ├── css/
│   │   ├── lkp-brand.css
│   │   └── profile.css
│   │
│   ├── js/
│   │   ├── lkp-data.js
│   │   ├── lkp-rewards.js
│   │   └── profile.js
│   │
│   └── assets/
│       └── images/
│           ├── LKP-1.png
│           └── LKP-2.png
│
└── README.md

🔐 Supabase Profile System

The platform uses Supabase for authentication and profile management.

The profile table supports fields such as:

id
email
display_name
handle
bio
avatar_url
role
home_realm
ecosystem_access
preferences
created_at
updated_at

Roles are used to control user and admin experiences.

user  → regular learner profile
admin → upgraded profile with content tools
owner → full platform authority