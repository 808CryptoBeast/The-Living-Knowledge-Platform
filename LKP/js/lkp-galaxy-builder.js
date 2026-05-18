/* ═══════════════════════════════════════════════════════════════════════════
   LKP SHARED GALAXY BUILDER
   File: LKP/js/lkp-galaxy-builder.js
   
   Used by: lkp-mobile.js, lkp-three.js
   
   Purpose:
   Generate galaxy definitions from CULTURALVERSE_DATA dynamically.
   Both desktop and mobile share the same source of truth — when cultures
   or lessons are added, both views automatically regenerate with correct scaling.
   
   No hardcoded galaxy data. All driven by CULTURALVERSE_DATA.
═══════════════════════════════════════════════════════════════════════════ */

(function exposeGalaxyBuilder() {
  'use strict';

  if (typeof window === 'undefined') return;

  /**
   * Deterministic pseudo-random number generator seeded by culture id
   */
  function hashSeed(value) {
    let h = 2166136261;
    const str = String(value);
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function seededUnit(seed, step) {
    const x = Math.sin(seed + step * 73.156) * 43758.5453;
    return x - Math.floor(x);
  }

  /**
   * Calculate ecosystem planet count based on lesson/module counts
   */
  function ecosystemPlanetCount(culture) {
    if (!culture || !Array.isArray(culture.modules)) return 3;
    const lessonCount = culture.modules.reduce((sum, m) => sum + (Array.isArray(m.lessons) ? m.lessons.length : 0), 0);
    const moduleCount = culture.modules.length;
    return Math.max(3, Math.min(13, 2 + Math.floor(lessonCount / 4) + Math.floor(moduleCount * 0.7)));
  }

  /**
   * Generate unique orbital signature for each culture
   */
  function getCultureGalaxySignature(culture, cultureIndex) {
    const seed = hashSeed(`${culture.id}-${culture.name}`);
    
    return {
      orbitTilt:      30 + seededUnit(seed, 1) * 60,
      orbitSpeedMult: 0.6 + seededUnit(seed, 2) * 0.8,
      ringWave:       0.08 + seededUnit(seed, 3) * 0.12,
      ellipse:        0.2 + seededUnit(seed, 4) * 0.5,
      hueDrift:       seededUnit(seed, 5) * 0.4,
      dustDensity:    0.5 + seededUnit(seed, 6) * 1.0,
      moonRichness:   0.4 + seededUnit(seed, 7) * 0.6
    };
  }

  /**
   * Generate theme colors for a culture
   */
  function getCultureThemeColors(culture) {
    const themeMap = {
      'emerald':  { main: 0x3cb371, dim: 0x2a7a52, border: 0x5eeebb },
      'gold':     { main: 0xf0c96a, dim: 0xc4a85a, border: 0xffd700 },
      'bridge':   { main: 0xaa99ff, dim: 0x8877dd, border: 0xcc88ff },
      'amber':    { main: 0xcd8c00, dim: 0xa36e00, border: 0xff9933 },
      'saffron':  { main: 0xf4a460, dim: 0xd97f3f, border: 0xffb347 },
      'rust':     { main: 0xa0522d, dim: 0x704020, border: 0xd2691e },
      'cyan':     { main: 0x54c6ee, dim: 0x247d9b, border: 0x8be8ff },
      'violet':   { main: 0x8fa0ff, dim: 0x5e6ed8, border: 0xc7b8ff }
    };

    const cultureMap = {
      kanaka: themeMap.emerald,
      kemet: themeMap.gold,
      bridge: themeMap.bridge,
      dogon: themeMap.amber,
      vedic: themeMap.saffron,
      dreamtime: themeMap.rust
    };

    return themeMap[culture.theme] || cultureMap[culture.id] || { main: 0x54c6ee, dim: 0x247d9b, border: 0x8be8ff };
  }

  /**
   * Generate concept nodes (lesson picos) for a culture's galaxy
   */
  function generateConceptsForCulture(culture, themeColors) {
    const concepts = [];
    
    if (!Array.isArray(culture.modules)) return concepts;

    let conceptIndex = 0;
    for (const module of culture.modules) {
      if (!Array.isArray(module.lessons)) continue;

      for (const lesson of module.lessons) {
        const seed = hashSeed(`${culture.id}-concept-${conceptIndex}`);
        const az = (culture._galaxyAz || 0) + (seededUnit(seed, 0) - 0.5) * 22;
        const alt = (culture._galaxyAlt || 45) + (seededUnit(seed, 1) - 0.5) * 16;
        const r = (culture._galaxyRadius || 70) + (seededUnit(seed, 2) - 0.5) * 10;
        
        concepts.push({
          id: lesson.id || `${culture.id}-${conceptIndex}`,
          label: lesson.title || `Lesson ${conceptIndex + 1}`,
          lessonId: lesson.id,
          moduleId: module.id,
          color: themeColors.main,
          hex: '#' + themeColors.main.toString(16).padStart(6, '0'),
          az,
          alt,
          r,
          major: conceptIndex === 0
        });

        conceptIndex++;
      }
    }

    return concepts;
  }

  /**
   * Build complete galaxy definitions from CULTURALVERSE_DATA
   */
  function buildGalaxyDefsFromData(cultures, IS_MOBILE) {
    const galaxyDefs = [];

    if (!Array.isArray(cultures)) return galaxyDefs;

    let cultureIndex = 0;
    for (const culture of cultures) {
      if (culture.status === 'soon') continue; // Skip placeholder cultures

      const themeColors = getCultureThemeColors(culture);
      const planetCount = ecosystemPlanetCount(culture);
      const signature = getCultureGalaxySignature(culture, cultureIndex);

      const totalCultures = cultures.filter(c => c.status !== 'soon').length;
      const az = (cultureIndex / Math.max(1, totalCultures)) * 360;
      const alt = 32 + Math.sin(cultureIndex * 1.17) * 24;
      const r = 68 + Math.cos(cultureIndex * 0.83) * 6;
      const cultureForConcepts = Object.assign({}, culture, {
        _galaxyAz: az,
        _galaxyAlt: alt,
        _galaxyRadius: r
      });

      galaxyDefs.push({
        id: culture.id,
        name: culture.name,
        type: cultureIndex % 3 === 0 ? 'spiral' : cultureIndex % 3 === 1 ? 'elliptical' : 'spiral',
        color: themeColors.main,
        hex: '#' + themeColors.main.toString(16).padStart(6, '0'),
        theme: culture.theme,
        assetKey: culture.id,
        az,
        alt,
        r,
        particleCount: IS_MOBILE ? Math.round(planetCount * 105) : Math.round(planetCount * 350),
        concepts: generateConceptsForCulture(cultureForConcepts, themeColors),
        ecosystem: {
          planetCount,
          signature,
          nebula: {
            density: signature.dustDensity,
            pulse: 0.85 + signature.moonRichness * 0.35,
            spread: 12 + planetCount * 1.65
          }
        }
      });

      cultureIndex++;
    }

    return galaxyDefs;
  }

  /**
   * Build bridge lesson concepts as a separate constellation
   */
  function buildBridgeConstellationFromData(cultures, IS_MOBILE) {
    const bridgeCulture = cultures.find(c => c.id === 'bridge');
    if (!bridgeCulture || !Array.isArray(bridgeCulture.modules)) return [];

    const concepts = [];
    const themeColors = getCultureThemeColors(bridgeCulture);

    let conceptIndex = 0;
    for (const module of bridgeCulture.modules) {
      if (!Array.isArray(module.lessons)) continue;

      for (const lesson of module.lessons) {
        const seed = hashSeed(`bridge-concept-${conceptIndex}`);
        const az = 320 + seededUnit(seed, 0) * 40;
        const alt = 50 + seededUnit(seed, 1) * 30;
        const r = 60 + seededUnit(seed, 2) * 6;

        concepts.push({
          id: lesson.id || `bridge-${conceptIndex}`,
          label: lesson.title || `Bridge Lesson ${conceptIndex + 1}`,
          lessonId: lesson.id,
          moduleId: module.id,
          color: themeColors.main,
          hex: '#' + themeColors.main.toString(16).padStart(6, '0'),
          az,
          alt,
          r,
          major: conceptIndex === 0
        });

        conceptIndex++;
      }
    }

    return concepts;
  }

  /**
   * Get all theme colors for rendering
   */
  function getAllThemeColors(cultures) {
    const colors = {};
    for (const culture of cultures) {
      colors[culture.id] = getCultureThemeColors(culture);
    }
    return colors;
  }

  /**
   * Build dynamic connections from enrichment data (lesson.connections[])
   * Returns array of [lessonIdA, lessonIdB, strengthValue] tuples
   */
  function buildConnectionsFromData(cultures) {
    const connectionSet = new Set();
    const connectionStrengthMap = new Map();

    if (!Array.isArray(cultures)) return [];

    // Extract connections from enrichment layers
    for (const culture of cultures) {
      if (!Array.isArray(culture.modules)) continue;

      for (const module of culture.modules) {
        if (!Array.isArray(module.lessons)) continue;

        for (const lesson of module.lessons) {
          if (!Array.isArray(lesson.connections)) continue;

          for (const conn of lesson.connections) {
            if (!conn.lessonId) continue;

            // Create bidirectional connection key
            const idA = lesson.id;
            const idB = conn.lessonId;
            const key = [idA, idB].sort().join('|');

            if (!connectionSet.has(key)) {
              connectionSet.add(key);
              
              // Map connection axis to strength value (0-1)
              const axisStrengthMap = {
                'Cosmology': 0.85,
                'Bridge': 0.75,
                'Epistemology': 0.70,
                'Navigation': 0.65,
                'Ecology': 0.70,
                'Philosophy': 0.60,
                'Medicine': 0.65,
                'Language': 0.60,
                'Future Thread': 0.55
              };
              
              const strength = axisStrengthMap[conn.axis] || 0.50;
              connectionStrengthMap.set(key, strength);
            }
          }
        }
      }
    }

    // Convert to [idA, idB, strength] format
    const connections = [];
    for (const key of connectionSet) {
      const [idA, idB] = key.split('|');
      const strength = connectionStrengthMap.get(key);
      connections.push([idA, idB, strength]);
    }

    return connections;
  }

  /**
   * Expose to global scope
   */
  window.LKP_GALAXY_BUILDER = {
    hashSeed,
    seededUnit,
    ecosystemPlanetCount,
    getCultureGalaxySignature,
    getCultureThemeColors,
    generateConceptsForCulture,
    buildGalaxyDefsFromData,
    buildBridgeConstellationFromData,
    buildConnectionsFromData,
    getAllThemeColors
  };

  console.log('[LKP Galaxy Builder] Loaded and exposed globally');
})();
