/* ═══════════════════════════════════════════════════════════════════
   lkp-data.js  —  Data Assembler
   ────────────────────────────────────────────────────────────────
   Culture content lives in per-culture files loaded before this one:
     LKP/js/cultures/{id}/lkp-culture-{id}.js
   Each culture file pushes its definition to window._LKP_CULTURES.
   This file assembles CULTURALVERSE_DATA from that array.
═══════════════════════════════════════════════════════════════════ */

var CULTURALVERSE_DATA = {
  cultures: window._LKP_CULTURES || []
};

/* ═══════════════════════════════════════════════════════════════════════════
   LKP DATA EXPORT BRIDGE
   Lets profile.js, lessons.js, mobile.js, and admin tools all read the same data.
   Keep this at the VERY BOTTOM of LKP/js/lkp-data.js
═══════════════════════════════════════════════════════════════════════════ */

(function exposeLKPDataForAllPages() {
  try {
    if (
      typeof CULTURALVERSE_DATA !== 'undefined' &&
      CULTURALVERSE_DATA &&
      Array.isArray(CULTURALVERSE_DATA.cultures)
    ) {
      window.CULTURALVERSE_DATA = CULTURALVERSE_DATA;
      window.LKP_DATA = CULTURALVERSE_DATA;
      window.IKEVERSE_DATA = CULTURALVERSE_DATA;

      window.dispatchEvent(
        new CustomEvent('lkp:data-ready', {
          detail: {
            cultures: CULTURALVERSE_DATA.cultures.length,
            data: CULTURALVERSE_DATA
          }
        })
      );

      console.info(
        '[LKP Data] CULTURALVERSE_DATA exposed globally:',
        CULTURALVERSE_DATA.cultures.length,
        'cultures'
      );
    } else {
      console.warn(
        '[LKP Data] CULTURALVERSE_DATA exists but does not contain a cultures array.'
      );
    }
  } catch (err) {
    console.warn('[LKP Data] Export bridge failed:', err);
  }
})();