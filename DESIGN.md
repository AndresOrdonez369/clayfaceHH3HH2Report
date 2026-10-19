---
name: Clayface Weekend Analytics
description: The back of two collectible island cards, where the stat line lives and every figure cites its file.
colors:
  card-stock: "#EEF0F2"
  card-face: "#FFFFFF"
  ink-navy: "#14213D"
  ink-slate: "#44506A"
  ink-fineprint: "#5F6B84"
  on-ink: "#FFFFFF"
  on-ink-muted: "#B9C2D6"
  rule: "#D6DAE0"
  rule-faint: "#E7EAEE"
  band-hh3-blue: "#1D6FA3"
  band-hh2-violet: "#7A3FA8"
  havoc-yellow: "#F2C230"
  not-measured-red: "#B5341C"
typography:
  display:
    fontFamily: "'Big Shoulders Display', 'Bahnschrift', 'Arial Narrow', sans-serif"
    fontSize: "clamp(3.5rem, 6vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.95
  headline:
    fontFamily: "'Big Shoulders Display', 'Bahnschrift', 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.01em"
  stat:
    fontFamily: "'Big Shoulders Display', 'Bahnschrift', 'Arial Narrow', sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.625rem)"
    fontWeight: 800
    lineHeight: 1.05
  title:
    fontFamily: "'Big Shoulders Display', 'Bahnschrift', 'Arial Narrow', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.02em"
  lede:
    fontFamily: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  note:
    fontFamily: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 75"
  fine:
    fontFamily: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  mono:
    fontFamily: "ui-monospace, 'Cascadia Mono', Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  swatch: "3px"
  focus: "4px"
  catalog: "5px"
  tag: "8px"
  stamp: "10px"
  card: "14px"
spacing:
  gap: "clamp(16px, 2.2vw, 28px)"
  section: "calc(clamp(16px, 2.2vw, 28px) * 1.6)"
  cell: "0.875rem 1rem 1rem"
  panel: "1.25rem"
  band: "10px"
  container: "80rem"
components:
  shell:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink}"
    height: "4rem"
  tab:
    textColor: "{colors.on-ink-muted}"
    typography: "{typography.label}"
  tab-hover:
    textColor: "{colors.on-ink}"
  tab-active:
    textColor: "{colors.havoc-yellow}"
  island-card:
    backgroundColor: "{colors.card-face}"
    rounded: "{rounded.card}"
  island-tag:
    textColor: "{colors.on-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.tag}"
    padding: "0.375rem 0.75rem 0.375rem 0.875rem"
  stat-cell:
    textColor: "{colors.ink-navy}"
    typography: "{typography.stat}"
    padding: "{spacing.cell}"
  stamp:
    backgroundColor: "{colors.havoc-yellow}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.display}"
    rounded: "{rounded.stamp}"
    padding: "0.375rem 1rem 0.25rem"
  catalog-number:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.catalog}"
    height: "1.25rem"
    padding: "0 0.375rem"
  catalog-number-lit:
    backgroundColor: "{colors.havoc-yellow}"
    textColor: "{colors.ink-navy}"
  both-strip:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.card}"
    padding: "1.125rem 1.5rem"
  panel:
    backgroundColor: "{colors.card-face}"
    rounded: "{rounded.card}"
    padding: "{spacing.panel}"
  sign-in-card:
    backgroundColor: "{colors.card-face}"
    rounded: "{rounded.card}"
    width: "28rem"
  sign-in-button:
    backgroundColor: "{colors.havoc-yellow}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.tag}"
    height: "3rem"
  citation-tooltip:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.tag}"
    padding: "0.5rem 0.75rem"
    width: "22rem"
---

# Design System: Clayface Weekend Analytics

## Overview

**Creative North Star: "The Card Back Stat Line"**

Each island is a collectible card and the page is its back. The system is built from one banded-card geometry (white face, 14px corners, a 10px band of identity colour across the top) that frames key art, stat lines, charts and tables alike. The ground is coated card stock; the shell and the cross-island strip are ink navy. Numbers are set in condensed sports numerals and carry the hierarchy by scale alone; text is a variable grotesque that narrows for labels.

Trust is the visual through-line. Every figure on the page carries a fine-print catalog number (S1 to S4) that leads to its source file, and hovering a figure lights that number in Havoc yellow and opens a navy citation tip. Yellow is rare by design: it marks the headline figure and the things a hand can act on. The density is a sports card's: tight stat cells divided by hairlines, dashed fine print at the foot, nothing ornamental.

The system refuses the KPI-tile grid where every number weighs the same; the redemption rate is stamped, the counts sit in a stat line, the detail sits in panels.

**Key Characteristics:**
- One banded-card geometry for every container, with the band colour naming its owner.
- Condensed 800-weight numerals for every figure, tabular throughout.
- A catalog number on every figure, chart and table, linked to its source row.
- Havoc yellow reserved for the headline stamp, active and hovered interactive states, focus and selection.
- One authored motion: the stamp press.

## Colors

Cool card stock and ink navy carry the page; two island band colours and one yellow do all the signalling.

### Primary
- **Havoc Yellow** (havoc-yellow): the redemption-rate stamp, the active tab underline and label, hovered or lit catalog numbers, the catalog id inside the citation tip, the 3px focus ring, text selection, the citation hover underline, and the targeted source row (at 18% alpha).

### Secondary
- **HH3 Band Blue** (band-hh3-blue): everything that belongs to Havoc Hotel 3: card band and name tag, chart series, legend swatch, table chip dot.
- **HH2 Band Violet** (band-hh2-violet): the same roles for Havoc Hotel 2.

### Tertiary
- **Not-Measured Red** (not-measured-red): the bold lead of each open item and the dot on a failed chart load. Nothing else.

### Neutral
- **Card Stock** (card-stock): page ground behind all cards.
- **Card Face** (card-face): every card, panel and table surface.
- **Ink Navy** (ink-navy): primary text and numerals, shell bar, both-islands strip, panel band, catalog-number chip, citation tip, table header rule (2px).
- **Ink Slate** (ink-slate): secondary prose: panel intros, notes, stamp notes, legends.
- **Fine-print Ink** (ink-fineprint): stat labels, table headers, axis ticks, fine-print lines, footer.
- **On-ink** (on-ink) and **On-ink Muted** (on-ink-muted): text on navy; muted for idle tabs, credit, strip labels and tip source line.
- **Rule** (rule) and **Rule Faint** (rule-faint): card borders and stat-line divider; faint for inner cell dividers, table row lines and chart gridlines.

### Named Rules
**The Headline-or-Hand Rule.** Havoc yellow appears only on the headline stamp and on interactive state (active, hover, lit, focus, selection). A static secondary figure never turns yellow.

**The One Band Per Island Rule.** HH3 is always band blue and HH2 always band violet, in the card band, name tag, chart series, legend and table chip. Rooms vs lobby is shown by the same hue at full and 35% opacity, never by a new colour.

**The Red Means Unmeasured Rule.** Not-measured red marks missing or unavailable data only; it is never decoration or emphasis.

## Typography

**Display Font:** Big Shoulders Display (with Bahnschrift, Arial Narrow)
**Body Font:** Archivo, variable wdth 62 to 125 (with system-ui, Segoe UI)
**Label/Mono Font:** Archivo condensed to wdth 75 for labels; ui-monospace / Cascadia Mono for file names, field keys and hashes

**Character:** Sports-card numerals over a sturdy, slightly technical grotesque. All numerals are tabular.

### Hierarchy
- **Display** (800, clamp(3.5rem, 6vw, 4.75rem), 0.95): the redemption-rate stamp, once per island.
- **Stat** (800, clamp(2rem, 3vw, 2.625rem), 1.05): stat-line figures; 2rem in the both-islands strip.
- **Headline** (800, clamp(1.75rem, 2.4vw, 2.25rem), 1.05, uppercase, 0.01em): panel titles.
- **Title** (800, 1.75rem, 1, uppercase, 0.02em): island name tags; the shell title runs at 1.625rem (1.25rem under 34rem).
- **Lede** (400 with 700 figures, clamp(1.125rem, 1.6vw, 1.375rem), 1.4, max 46ch): the one-sentence answer at the top.
- **Body / Note** (400, 1rem / 0.9375rem, 1.5, max 60 to 70ch): panel intros, notes, definitions.
- **Label** (600, 0.75rem, 0.1em, uppercase, wdth 75): stat labels and table headers; tabs use the same face at 0.875rem and 0.08em.
- **Fine** (400, 0.75rem): source lines under each figure group.
- **Mono** (0.8125rem): file names, event keys, SHA-256 hashes.

### Named Rules
**The Numerals Wear Shoulders Rule.** Every reported figure is Big Shoulders Display 800; Archivo never sets a headline number, and Big Shoulders never sets prose.

**The Condensed Label Rule.** A label names the figure beneath it, set narrow (wdth 75), 600, tracked 0.1em, uppercase, in fine-print ink. Labels never stand above a heading as an eyebrow.

## Layout

A single centred column capped at 80rem with a fluid gap (clamp(16px, 2.2vw, 28px)) that also sets page padding; sections stack at 1.6 times the gap. The two island cards sit side by side via auto-fit columns of at least 30rem and stack below that. Panels hold a body grid that splits 1.6fr / 1fr (chart beside table) and collapses to one column under 56rem. The shell is sticky and the section tabs scroll-spy; panels carry a scroll margin so anchors clear the shell.

Under 56rem the both-islands strip stacks its heading over an auto-fit metric grid (8.5rem minimum) and the shell credit hides. Under 34rem the tabs wrap to their own row, the stat line becomes 2 by 2, the stamp stacks above its note, the island tag stacks name over version, table chips swap to short island codes and the metric column wraps, and definitions go single-column. Wide tables scroll horizontally inside their card with edge shadows that appear only while columns sit off-screen.

## Elevation & Depth

Mostly flat card stock with one lifted layer. Island cards lift with a soft two-part ambient shadow; panels stay flat on a 1px rule border. Identity is carried by a 10px inset band, not by elevation. The citation tip floats highest.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 1px 2px rgba(20,33,61,.06), 0 8px 24px -12px rgba(20,33,61,.18)`): island cards only.
- **Identity band** (`box-shadow: inset 0 10px 0 <band colour>`): the top band of every card and panel (navy on panels, island colour on art strips).
- **Stamp rim** (`box-shadow: inset 0 0 0 2px rgba(20,33,61,.12)`): the yellow stamp's pressed-ink edge.
- **Tip float** (`box-shadow: 0 10px 30px -8px rgba(20,33,61,.45)`): the citation tooltip.
- **Citation underline** (`box-shadow: 0 3px 0 -1px #F2C230`): a cited figure on hover or focus.

### Named Rules
**The 10px Band Rule.** Every card and panel opens with a 10px band in its owner's colour: island blue or violet for island cards, ink navy for shared panels.

## Shapes

Friendly-firm corners on a single ladder: 14px for cards, panels and the both-islands strip; 10px for the stamp; 8px for name tags and tooltips; 5px for catalog-number chips; 3px for legend swatches; 4px on the focus ring. Borders are 1px rule hairlines, faint inside a card, a 2px navy rule under table headers, and a dashed rule above fine print. Key art is cropped into a fixed-height strip (clamp(10.5rem, 16vw, 13rem)) positioned at center 85%, with the name tag pinned top-left just below the band. Table island markers are 0.5rem circles.

## Components

### Navigation (Shell)
Ink navy sticky bar, 4rem tall: uppercase Big Shoulders title, condensed uppercase tabs in muted on-ink, credit on the right. Hover lifts a tab to full on-ink; the active tab turns Havoc yellow with a 3px yellow underline. Colour transitions run 0.2s on the house ease.

### Island Card (signature)
White banded card in the island colour: art strip with name tag and version, four-cell stat line (label over Stat numerals, faint dividers), stamp row, dashed fine-print source line with catalog chips.

### Stamp
The redemption rate in Display numerals on a Havoc yellow block, 10px corners, inset rim. It presses in once when the data first loads (0.9s, scale 1.08 and -2deg to rest, second card delayed 0.12s); there is no motion under reduced-motion.

### Catalog Number (Chips)
A 1.25rem navy chip with on-ink Big Shoulders 800 text (S1 to S4) linking to its source row. Hover, or a lit state when its figure is hovered, turns it yellow on navy text and raises it 1px. The targeted source row tints yellow at 18%.

### Sign-in Card (standalone file only)
The standalone file opens on one lifted banded card, 28rem wide, centred on card stock: both islands' key art as two stacked full-width strips (6rem each, center 88%, each with its own 10px band), a Headline-style title at 2rem, a slate lede, two fields (condensed labels; 1px rule inputs, 8px corners, ink border on focus plus the yellow ring) and a full-width Havoc yellow "Open report" button (Big Shoulders 800 at 1.25rem, 8px corners, stamp rim). While keys derive the button reads "Opening…" and desaturates. Errors are one ink sentence led by the not-measured red dot, naming the problem and the recovery. The figures and CSVs stay encrypted in the file until sign-in (PBKDF2-SHA256, AES-256-CBC with HMAC-SHA256); the dashboard artifact has no sign-in card and relies on its sharing controls.
### Citation Tooltip
Every cited figure, chart and table cell shows a help cursor and, on hover or focus, a yellow underline and a navy tip (max 22rem, 8px corners): the catalog id in yellow Big Shoulders, then the file and field in muted on-ink.

### Both-Islands Strip
A full-width navy card with 14px corners: an uppercase title beside a five-column metric list, with muted labels over on-ink Stat numerals at 2rem.

### Panel
A white card with a navy 10px band, a Headline title and a slate intro (max 70ch), then a body grid of charts, tables and notes, ending in fine print.

### Charts and Tables
Vanilla SVG charts: island hue per series, lobby at 35% fill opacity, 2.25px round-joined lines, 4.5px point markers ringed in card white, faint gridlines with a navy baseline, 12px fine-print ticks and 13px 700 navy value labels. Tables use condensed label headers over a 2px navy rule, faint row lines, right-aligned numerals, a bold Both row, and island chips with coloured dots.

## Do's and Don'ts

### Do:
- **Do** frame every new section as a white banded card (14px corners, 10px top band, 1px rule border).
- **Do** give every figure, chart and table cell a catalog number and citation tip pointing to its source file.
- **Do** set every reported number in Big Shoulders Display 800 with tabular figures.
- **Do** keep HH3 band blue and HH2 band violet in every place that island appears, and separate rooms from lobby with 35% opacity of the same hue.
- **Do** use the house ease (cubic-bezier(.16, 1, .3, 1)) at 0.2s for state changes and keep the stamp press the only authored animation.
- **Do** keep hashes and file names in monospace, selectable in full.

### Don't:
- **Don't** use Havoc yellow on static secondary figures, deltas or decoration; it belongs to the stamp and interactive state.
- **Don't** lay out figures as a grid of equal KPI tiles; the stamp outranks the stat line, which outranks panel detail.
- **Don't** use not-measured red for anything except missing or unavailable data.
- **Don't** put uppercase labels above headings as eyebrows; labels name figures only.
- **Don't** add drop shadows to panels or introduce zero-blur offset shadows beyond the citation underline.
- **Don't** introduce a new hue for a series or state; reuse the island hues, navy and the rules.
