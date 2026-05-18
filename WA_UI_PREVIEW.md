# Kumulipo Wā UI Preview

This document describes the current Kumulipo Wā learning interface.

## Current Structure

The Kumulipo experience has two related layers:

1. **Main Kumulipo lesson**
   - includes the Kumulipo opening orientation
   - includes the 16 Wā navigation dropdown
   - lets the learner choose which Wā to study next

2. **Individual Wā pages**
   - one page for each Wā, 1-16
   - begins with the full chant section
   - shows Hawaiian source lines with English meanings underneath
   - follows with interpretation, vocabulary, context, resonances, and reflection

## Wā Navigation

The 16 Wā chooser should appear on the main Kumulipo lesson only. It should not be repeated at the top of every individual Wā page.

Each Wā item includes:

- Wā number
- Hawaiian title
- English title
- short movement/meaning
- link to the dedicated Wā lesson page

## Individual Wā Page Layout

Recommended order:

1. Full Kumulipo Verse
2. Foundational Orientation
3. Learning Objectives
4. Foundation Lens for Reading
5. Vocabulary in Context
6. Cultural Context
7. Deeper Interpretation
8. Intracrises and tensions
9. Modern Parallels
10. Scientific Resonances
11. Kuleana Now
12. Study Pathways
13. Common Misreadings
14. Continuity Anchor
15. Reflection Prompts

## Full Verse Section

The full verse section is the primary source anchor.

Each line pair should render as:

```text
0001
O ke au i kahuli wela ka honua

At the time when the earth became hot
```

The Hawaiian line remains the source. The English line is an orientation aid.

## Visual Guidance

- Keep source lines in one immersive container.
- Do not visually scatter each line into separate cards.
- Use a readable scroll container for long Wā sections.
- Maintain the dark cosmic style with gold/cyan highlights.
- Keep the chant first so interpretation does not replace source encounter.

## Interaction Guidance

- Wā chooser: dropdown/navigation list on the main Kumulipo page.
- Individual Wā pages: focus on reading, interpretation, and continuity.
- Scholar mode: full interpretive depth.
- Keiki mode: simpler language and lighter scaffolding.
- Related links should move the learner without losing the Wā context.

## Implementation Notes

Related files:

- `LKP/js/lkp-kumulipo-wa-ui.js`
- `LKP/js/lkp-kumulipo-full-verses.js`
- `LKP/js/lkp-data.js`
- `LKP/js/lkp-lessons.js`
- `LKP/css/lkp-lessons.css`

The Wā full verse data is loaded before `lkp-data.js`, then read into each Wā lesson during content generation.
