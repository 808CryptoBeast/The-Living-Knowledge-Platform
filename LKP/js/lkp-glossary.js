/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — GLOSSARY HOVER CARDS
   File: LKP/js/lkp-glossary.js

   Scans rendered lesson body for known terms and wraps first occurrences
   with tooltip spans. Load after lkp-lessons.js has rendered content, or
   call window.LKPGlossary.apply(containerEl) manually.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const TERMS = {
    /* ── Kānaka Maoli ──────────────────────────────────────────── */
    'Pō': {
      culture: 'Kānaka Maoli',
      def: 'Generative ancestral darkness — not emptiness, but fertile depth and potential before visible form. The first condition in the Kumulipo.'
    },
    'Ao': {
      culture: 'Kānaka Maoli',
      def: 'Realm of light and visibility where kuleana becomes action. Not the opposite of Pō — its continuation into lived responsibility.'
    },
    'kuleana': {
      culture: 'Kānaka Maoli',
      def: 'Inherited charge and responsibility to act in right relation — to land, ancestors, community, and the living world.'
    },
    'Kuleana': {
      culture: 'Kānaka Maoli',
      def: 'Inherited charge and responsibility to act in right relation — to land, ancestors, community, and the living world.'
    },
    'moʻokūʻauhau': {
      culture: 'Kānaka Maoli',
      def: 'Genealogical continuity — lineage as living obligation, not just ancestry record. Binds beings, places, and duties across time.'
    },
    'Moʻokūʻauhau': {
      culture: 'Kānaka Maoli',
      def: 'Genealogical continuity — lineage as living obligation, not just ancestry record. Binds beings, places, and duties across time.'
    },
    'aliʻi': {
      culture: 'Kānaka Maoli',
      def: 'Chiefly rank — those who carry genealogical authority and responsibility to serve the people and land.'
    },
    'kapu': {
      culture: 'Kānaka Maoli',
      def: 'Sacred restriction and protocol — boundaries that maintain the integrity of sacred relationships and social order.'
    },
    'ʻāina': {
      culture: 'Kānaka Maoli',
      def: 'Land as ancestor — the living body of the earth, not property. That which feeds (from ʻai, to eat).'
    },
    'ʻĀina': {
      culture: 'Kānaka Maoli',
      def: 'Land as ancestor — the living body of the earth, not property. That which feeds (from ʻai, to eat).'
    },
    'mana': {
      culture: 'Kānaka Maoli',
      def: 'Sacred power and spiritual authority — inherited, cultivated, or earned through right action and genealogical connection.'
    },
    'Mana': {
      culture: 'Kānaka Maoli',
      def: 'Sacred power and spiritual authority — inherited, cultivated, or earned through right action and genealogical connection.'
    },
    'Aloha ʻĀina': {
      culture: 'Kānaka Maoli',
      def: 'Love of land as genealogical duty — not sentiment but deep obligation arising from the understanding that land is kin.'
    },
    'ahupuaʻa': {
      culture: 'Kānaka Maoli',
      def: 'Land division from mountain to sea — a complete ecological and social unit that managed all resources in one integrated system.'
    },
    'Ahupuaʻa': {
      culture: 'Kānaka Maoli',
      def: 'Land division from mountain to sea — a complete ecological and social unit that managed all resources in one integrated system.'
    },
    'kalo': {
      culture: 'Kānaka Maoli',
      def: 'Taro — elder sibling of humanity in Hawaiian genealogy. Hāloa, the first kalo plant, is the ancestor who feeds the people.'
    },
    'Kalo': {
      culture: 'Kānaka Maoli',
      def: 'Taro — elder sibling of humanity in Hawaiian genealogy. Hāloa, the first kalo plant, is the ancestor who feeds the people.'
    },
    'loʻi': {
      culture: 'Kānaka Maoli',
      def: 'Flooded taro field — a living system of water, kalo, and reciprocal care. Maintaining it is a form of genealogical practice.'
    },
    'wai': {
      culture: 'Kānaka Maoli',
      def: 'Water — also a root of wai-wai (wealth) and ola (life). Water is the measure of abundance and the condition of life.'
    },
    'Wākea': {
      culture: 'Kānaka Maoli',
      def: 'Sky Father — Wide Expanse. Father of the Hawaiian islands and of the kalo lineage. Partner of Papahānaumoku.'
    },
    'Papahānaumoku': {
      culture: 'Kānaka Maoli',
      def: 'Earth Mother — She Who Births Islands. The living foundation of the Hawaiian archipelago and of all life that grows from it.'
    },
    'Hōkūleʻa': {
      culture: 'Kānaka Maoli',
      def: 'The star Arcturus and the voyaging canoe named for it — vessel of the Hawaiian cultural renaissance and non-instrument navigation revival.'
    },
    'koʻa': {
      culture: 'Kānaka Maoli',
      def: 'Coral polyp — the first named living being in the Kumulipo. Emerges from Pō in Wā 1 as the foundational genealogical ancestor.'
    },

    /* ── Kemet / Ancient Egypt ─────────────────────────────────── */
    'Maʻat': {
      culture: 'Kemet',
      def: 'Cosmic order, truth, and justice — the principle governing all existence. Literally: the feather against which the heart is weighed.'
    },
    "Ma'at": {
      culture: 'Kemet',
      def: 'Cosmic order, truth, and justice — the principle governing all existence. Literally: the feather against which the heart is weighed.'
    },
    'Maat': {
      culture: 'Kemet',
      def: 'Cosmic order, truth, and justice — the principle governing all existence. Literally: the feather against which the heart is weighed.'
    },
    'Nun': {
      culture: 'Kemet',
      def: 'The primordial waters — undifferentiated potential before creation. The deep from which the first mound emerged. Still present beneath all things.'
    },
    'Ogdoad': {
      culture: 'Kemet',
      def: 'The eight primordial deities of Hermopolis, paired as four couples: Nun/Naunet (water), Huh/Hauhet (infinity), Kuk/Kauket (darkness), Amun/Amaunet (hiddenness).'
    },
    'Ennead': {
      culture: 'Kemet',
      def: 'The nine divine principles of Heliopolis — a lineage of creation from Atum through Geb, Nut, Osiris, Isis, Seth, and Nephthys.'
    },
    'Netjer': {
      culture: 'Kemet',
      def: 'Closer to "divine principle" or "sacred force" than to "god." Kemetic divinity is better understood as numinous quality than personal deity.'
    },
    'Ptah': {
      culture: 'Kemet',
      def: 'Divine craftsman and creator by Heka (spoken word and creative power) — the principle that consciousness and speech precede material form.'
    },
    'Thoth': {
      culture: 'Kemet',
      def: 'Divine scribe and keeper of Maʻat — associated with wisdom, writing (Medu Netjer), time, and the moon. Mediates between cosmic order and human knowledge.'
    },
    'Medu Netjer': {
      culture: 'Kemet',
      def: 'Literally "words of the divine" — the sacred writing system wrongly called "hieroglyphics." Writing as sacred act, not merely recording.'
    },

    /* ── Vedic / Indian ────────────────────────────────────────── */
    'Dharma': {
      culture: 'Vedic',
      def: 'Cosmic and moral order — right action in accord with one\'s nature, role, and duty. Sustains the structure of existence itself.'
    },
    'Ṛta': {
      culture: 'Vedic',
      def: 'Cosmic truth and order in the Rigveda — the principle underlying all existence, the precursor to Dharma. Truth as structural law of the universe.'
    },
    'Sunya': {
      culture: 'Vedic',
      def: 'Philosophical emptiness — the concept from which the mathematical zero emerged. Absence as generative principle, not mere negation.'
    },
    'Nāsadīya': {
      culture: 'Vedic',
      def: '"There was not" — the opening words of the Rigveda creation hymn (Nasadiya Sukta, RV 10.129). One of humanity\'s oldest honest admissions of cosmological uncertainty.'
    },

    /* ── Māori ─────────────────────────────────────────────────── */
    'Te Kore': {
      culture: 'Māori',
      def: 'Nothingness, potential, or the realm before being — charged with possibility, not dead emptiness. The first state in Māori whakapapa sequences.'
    },
    'Te Pō': {
      culture: 'Māori',
      def: 'Primordial darkness in Māori whakapapa — the deep night of potentiality before form and light emerge.'
    },
    'whakapapa': {
      culture: 'Māori',
      def: 'Genealogical layering — to place in layers. The fundamental Māori framework for understanding all of existence as relational lineage.'
    },
    'Whakapapa': {
      culture: 'Māori',
      def: 'Genealogical layering — to place in layers. The fundamental Māori framework for understanding all of existence as relational lineage.'
    },
    'tapu': {
      culture: 'Māori',
      def: 'Sacred restriction and protected status — the Māori cognate of Hawaiian kapu. Marks the boundary of the sacred and demands respectful approach.'
    },

    /* ── Aboriginal / Dreamtime ────────────────────────────────── */
    'Songlines': {
      culture: 'Dreamtime',
      def: 'Routes across Country that encode navigational, ecological, and cosmological knowledge in song, story, and ceremony. Country is not mapped — it is sung.'
    },
    'Country': {
      culture: 'Dreamtime',
      def: 'Living territory as a relational entity with its own consciousness, law, and agency. Not land owned, but a living being one belongs to and is responsible for.'
    },
    'Dreaming': {
      culture: 'Dreamtime',
      def: 'The living creative force and ongoing time of ancestral beings who shaped Country and continue to animate it. Not past mythology — an ongoing living reality.'
    }
  };

  function buildTip(term, entry) {
    return `<span class="lkp-gloss__tip"><strong>${term} · ${entry.culture}</strong>${entry.def}</span>`;
  }

  function glossify(container) {
    if (!container) return;

    const seen = new Set();
    const skip = new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE','H1','H2','H3','H4','H5','H6']);

    const sortedTerms = Object.keys(TERMS).sort((a, b) => b.length - a.length);

    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (skip.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('.lkp-gloss')) return NodeFilter.FILTER_REJECT;
          if (parent.closest('.kumu-wa-source-tag')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(textNode => {
      const text = textNode.nodeValue;
      if (!text.trim()) return;

      for (const term of sortedTerms) {
        if (seen.has(term)) continue;
        const idx = text.indexOf(term);
        if (idx === -1) continue;

        const before = text[idx - 1];
        const after = text[idx + term.length];
        const wordBoundaryBefore = !before || /[\s('"«]/.test(before);
        const wordBoundaryAfter = !after || /[\s.,;:!?)'"»\-]/.test(after);
        if (!wordBoundaryBefore || !wordBoundaryAfter) continue;

        seen.add(term);

        const entry = TERMS[term];
        const wrap = document.createElement('span');
        wrap.className = 'lkp-gloss';
        wrap.setAttribute('tabindex', '0');
        wrap.setAttribute('aria-label', `${term}: ${entry.def}`);

        const before$ = document.createTextNode(text.slice(0, idx));
        wrap.textContent = term;
        wrap.insertAdjacentHTML('beforeend', buildTip(term, entry));
        const after$ = document.createTextNode(text.slice(idx + term.length));

        const parent = textNode.parentNode;
        parent.insertBefore(before$, textNode);
        parent.insertBefore(wrap, textNode);
        parent.insertBefore(after$, textNode);
        parent.removeChild(textNode);
        break;
      }
    });
  }

  window.LKPGlossary = { apply: glossify, terms: TERMS };
})();
