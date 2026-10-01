---
name: Tanit Chat
description: Many tools. One workspace. Local first. - the multi-tool landing page
colors:
  shell: "#c8362b"
  shell-deep: "#9e2a22"
  shell-accent: "#e8635a"
  ink: "#1b1a17"
  paper: "#f3ead8"
  steel: "#e5e5e5"
  steel-dim: "#b8b8b2"
  pivot: "#9a9a93"
  bg: "#14130f"
  bg-2: "#1c1b16"
  text: "#ece8df"
  text-dim: "#a7a299"
  rule: "#3a3830"
  # Light theme variants (html[data-theme="light"]); shell/shell-deep/ink unchanged across themes
  light-bg: "#f4f0e6"
  light-bg-2: "#fffdf7"
  light-text: "#1b1a17"
  light-text-dim: "#5a564c"
  light-rule: "#dcd3bf"
  light-steel: "#1b1a17"
  light-steel-dim: "#5a564c"
  light-pivot: "#b3a994"
  light-paper: "#ffffff"
  light-localfirst-bg: "#1b1a17"
  light-localfirst-text: "#f3ead8"
  light-localfirst-dim: "#cfc7b6"
  light-em: "#c8362b"
typography:
  display:
    fontFamily: '"Big Shoulders Display","Public Sans",sans-serif'
    fontSize: "clamp(1.9rem,5vw,2.9rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "0.01em"
  tagline:
    fontFamily: '"Big Shoulders Display","Public Sans",sans-serif'
    fontSize: "clamp(1.4rem,4vw,2.1rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.01em"
  close-stamp:
    fontFamily: '"Big Shoulders Display","Public Sans",sans-serif'
    fontSize: "clamp(2rem,7vw,3rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "0.02em"
  body:
    fontFamily: '"Public Sans",system-ui,sans-serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-lead:
    fontFamily: '"Public Sans",system-ui,sans-serif'
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  shell-claim:
    fontFamily: '"Public Sans",system-ui,sans-serif'
    fontSize: "clamp(1.05rem,2.6vw,1.3rem)"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
  shell-stamp:
    fontFamily: '"JetBrains Mono",ui-monospace,monospace'
    fontSize: "clamp(1.9rem,6vw,3rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  label:
    fontFamily: '"JetBrains Mono",ui-monospace,monospace'
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
  col-head:
    fontFamily: '"JetBrains Mono",ui-monospace,monospace'
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  blade-list:
    fontFamily: '"JetBrains Mono",ui-monospace,monospace'
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.02em"
  micro-note:
    fontFamily: '"JetBrains Mono",ui-monospace,monospace'
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
  foot-line:
    fontFamily: '"JetBrains Mono",ui-monospace,monospace'
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  cta: "4px"
  tab: "5px"
  scrollbar: "6px"
  shell-inner: "10px"
  blades: "14px"
  close-shell: "16px"
  shell-plate: "18px 18px 4px 4px"
  ring: "40px"
spacing:
  wrap: "1180px"
  gutter: "24px"
  section: "72px 0"
  body-section: "64px 0 70px"
  close: "84px 0 64px"
  cols-gap: "34px 48px"
  shell-padding: "54px 40px 40px"
  blade-padding: "22px"
  blade-face-open: "10px 24px 26px"
components:
  button-shell-cta:
    backgroundColor: "{colors.shell-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.cta}"
    padding: "9px 16px"
    typography: "{typography.label}"
  button-ring:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ring}"
    padding: "13px 22px"
    typography: "{typography.label}"
  shell-plate:
    backgroundColor: "{colors.shell}"
    textColor: "#ffffff"
    rounded: "{rounded.shell-plate}"
    padding: "54px 40px 40px"
    typography: "{typography.shell-stamp}"
  blade-pivot:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.steel}"
    rounded: "0"
    padding: "22px"
    typography: "{typography.label}"
  blade-face:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "10px 24px 26px"
    typography: "{typography.body}"
  button-theme-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    rounded: "{rounded.cta}"
    padding: "8px 12px"
    typography: "{typography.micro-note}"
  shot:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "8px"
    padding: "0"
    typography: "{typography.body}"
---

# Design System: Tanit Chat

## Overview

**Creative North Star: "The Multi-Tool"**

Tanit Chat is presented as one object with many tools, not a dashboard of apps. The category default - hero name plus tagline, three feature cards, a trusted-by strip, pricing, FAQ - is refused on the page itself: the form makes "many tools, one body" literal. A closed signal-red anodized shell stands in the upper viewport, the product name stamped into it in monospaced caps; on click or first scroll it folds open along a horizontal steel pivot to reveal eight fold-out tool panels hinged on steel pivots. The fold is the signature interaction and the shell is the thesis, not a header.

The world is hardware, not paper: an anodized red shell on near-black, warm paper ground for the tools that have opened, light steel for pivots and rules, monospaced labels stamped rather than printed. Depth is structural (the lift of the lid, the fold of a blade) rather than decorative; shadows are cast by the object, not by cards. Type pairs a condensed industrial display face (Big Shoulders Display, 500/700/900) for headlines and stamps with a calm humanist body (Public Sans, 400-700) and a stamped monospace (JetBrains Mono, 500/700) for labels, jobs, and micro-copy. All three faces are self-hosted as woff2 with unicode-range subsets; no CDN.

**Key Characteristics:**
- One object, many tools: the fold is the product argument, not a transition.
- Signal-red shell (#c8362b) on near-black; warm paper (#f3ead8) for open tools; light steel (#e5e5e5) for pivots, labels, rules.
- Stamped monospace labels (uppercase, wide tracking) carry identity; the display face carries headlines; the body face carries prose.
- Depth is cast by the object (lid lift, blade fold, ring lift), never by card shadows.
- Two themes share one token set and one shell red: dark is canonical (near-black + warm paper), light inverts the neutrals (warm-paper-light + white open tools) but the shell stays the same object in both.
- Each fold-out ends with a framed screenshot of the actual tool - the reveal shows the tool, not a claim - except Security (no screenshot exists; none invented).
- Self-hosted fonts only; the page is a single static HTML file with minimal vanilla JS.

## Colors

The palette is a hardware palette: one anodized red, one near-black, one warm paper, one light steel - plus the dim steps the build needs to layer dark surfaces and quiet text.

### Primary
- **Signal-Red Shell** (#c8362b): the shell plate, the ring's stamped-tab open state, the ::selection background, the caret color. The single load-bearing accent; rarity is the point.
- **Shell Deep** (#9e2a22): the lower gradient stop of the shell, the top-bar CTA fill, the localfirst col-head and link color. The shadow the shell casts on itself.
- **Shell Accent** (#e8635a): the `<em>` inside dark-section block headlines (lighter red so the accent reads on near-black without going neon).

### Neutral
- **Ink** (#1b1a17): near-black; text on paper surfaces (blade faces, localfirst prose), the ring's text and tab glyph.
- **Paper** (#f3ead8): warm paper ground for opened tools (blade faces) and the localfirst band; the ring fill; the blade-list bullet is shell on paper.
- **Steel** (#e5e5e5): light steel for pivots, blade labels, col-heads, brand wordmark, focus ring.
- **Steel Dim** (#b8b8b2): the blade-tab glyph at rest and the scrollbar thumb on hover - the steel that has receded one step.
- **Pivot** (#9a9a93): the hinge line, the blade-pivot dot, the scrollbar thumb, the blade-pin gradient. The structural steel of the object.
- **BG** (#14130f): page background, top-bar backdrop, scrollbar track.
- **BG-2** (#1c1b16): the blades container and blade-pivot fill - one step lifted from the page.
- **Text** (#ece8df): warm off-white body text on dark surfaces.
- **Text Dim** (#a7a299): leads, blade jobs, micro-notes, foot links at rest.
- **Rule** (#3a3830): hairline rules between blades, between sections, under the top bar.

### Light theme variant (html[data-theme="light"])
The light theme reuses the same token names but inverts the neutrals; the shell red family is the only thing that does not move. Light token values: `--bg #f4f0e6` (warm paper light), `--bg-2 #fffdf7`, `--text #1b1a17` (dark ink), `--text-dim #5a564c`, `--rule #dcd3bf`, `--steel #1b1a17` (dark labels on light), `--steel-dim #5a564c`, `--pivot #b3a994`, `--paper #ffffff` (white open-tool surface). `--shell #c8362b`, `--shell-deep #9e2a22`, `--ink #1b1a17` are unchanged across themes.

Section inversions in light: `.localfirst` flips to a dark band (`--ink` background, `--paper` text, `--shell` em) so the one paper band in dark becomes the one ink band in light; `.top` uses `rgba(244,240,230,.86)`; `.blade-pivot` bg `--bg-2`; `.blade-face` bg `--paper`; `.shot` border `rgba(27,26,23,.16)` and shadow `0 10px 26px -14px rgba(27,26,23,.4)`; scrollbar thumb `--pivot` on `--bg`; `::selection` shell on `#fff`; `:focus-visible` outline `--shell`; `.block-h em` becomes `--shell` (not shell-accent); `.hero-note b` becomes `--ink`; `.close-note` becomes `#cfc7b6`; `.foot-links a:hover` becomes `--ink`.

### Named Rules
**The One Shell Rule.** The signal-red shell (#c8362b) is used on one object per viewport - the hero lid, the close-shell, the open blade-tab, the ::selection, the caret. It is never used as a section background, a card border, or a text color on dark. Its rarity is what makes the form read as one object.

**The Paper-Is-Open Rule.** Warm paper (#f3ead8) appears only where a tool has opened (blade faces, the localfirst band, the ring). It is never used as a default surface on the dark page. Paper means "this tool is open".

**The Two Themes, One Shell Rule.** The shell red (#c8362b) and shell-deep (#9e2a22) are the only tokens that do not change between dark and light themes; every neutral inverts. The shell is the same object in both themes - never recolor the shell to "fit" a light background. The theme toggle swaps the neutrals and the localfirst band inversion; it never touches the shell.

## Typography

**Display Font:** Big Shoulders Display (500/700/900), with Public Sans fallback.
**Body Font:** Public Sans (400/500/600/700), with system-ui fallback.
**Label/Mono Font:** JetBrains Mono (500/700), with ui-monospace fallback.

**Character:** A condensed industrial display face stamps the headlines (the shell, the block heads, the close-stamp); a calm humanist sans carries prose and claims; a monospace stamps labels, jobs, and micro-copy in wide-tracked uppercase. The pairing reads "machined object with a printed manual" - display is the object, mono is the stamp, body is the manual.

### Hierarchy
- **Display** (Big Shoulders Display 900, clamp(1.9rem,5vw,2.9rem), line-height 0.98, uppercase, tracking 0.01em): dark-section block headlines; the `<em>` inside takes shell-accent (#e8635a) on dark, shell-deep on paper.
- **Tagline** (Big Shoulders Display 700, clamp(1.4rem,4vw,2.1rem), line-height 1.3, uppercase): the localfirst lead tagline ("Fast. Local when you want it. Powerful when you need it.").
- **Close Stamp** (Big Shoulders Display 900, clamp(2rem,7vw,3rem), line-height 0.92, uppercase, tracking 0.02em): "Open yours" on the closing mini shell.
- **Shell Stamp** (JetBrains Mono 700, clamp(1.9rem,6vw,3rem), line-height 1, tracking 0.14em, uppercase, white): "Tanit Chat" stamped into the lid.
- **Shell Claim** (Public Sans 500, clamp(1.05rem,2.6vw,1.3rem), max-width 30ch): the one-line claim under the stamp.
- **Body** (Public Sans 400, 17px, line-height 1.6): base body copy.
- **Body Lead** (Public Sans 400, 1.05rem, line-height 1.6, max-width 62ch): the block-lead paragraph under each block headline.
- **Label** (JetBrains Mono 700, 13px, tracking 0.16em, uppercase): blade labels, the top-cta, the ring. The stamped identity of the object.
- **Col Head** (JetBrains Mono 700, 13px, tracking 0.14em, uppercase): the `<h3>` inside each col; steel on dark, shell-deep on paper.
- **Blade List** (JetBrains Mono 500, 12.5px, tracking 0.02em, line-height 1.45): the 2-col mono highlight list inside an opened blade, ink on paper, bullet is a 9x2 shell bar.
- **Micro Note** (JetBrains Mono 500, 12px, tracking 0.18em, uppercase, text-dim): the hero-note and close-note; the `<b>` inside takes steel.
- **Foot Line** (JetBrains Mono 500, 11.5px, tracking 0.1em, uppercase, text-dim): the footer tagline line.

### Named Rules
**The Stamp Rule.** Identity is stamped, not set: the product name, blade labels, CTAs, col-heads, and micro-notes are JetBrains Mono 700, uppercase, wide-tracked (0.14em-0.18em). The display face is reserved for headlines and the close-stamp; the body face is reserved for prose. Never set a label in the display or body face.

**The Em-Accent Rule.** The only color an `<em>` inside a display headline may take is shell-accent (#e8635a) on dark and shell-deep (#9e2a22) on paper. The em is the one word the headline stresses; it stays in the red family.

## Layout

The page is a single static document with a sticky top bar over a vertical stack of full-width bands. The grid is a 1180px max-width wrap (24px gutters) for everything except the hero object, which centers a 760px (min(760px,94vw)) body in its own section, and the close-shell, which centers 440px (min(440px,86vw)).

Section rhythm: the body-section pads 64px 0 70px; every `section.block` pads 72px 0 and is divided from the previous by a 1px rule top border. The close section pads 84px 0 64px. Two-column blocks use `grid-template-columns: repeat(2,1fr)` with a 34px 48px gap; the schools, developers, and command sections run four cols in two rows of two.

The blade grid is a 2-column grid of 8 blades inside a 14px-radius container with 1px rule borders; blades share borders (right + bottom, suppressed on the last pair and on every even child's right) so the grid reads as one ruled surface, not eight cards. Below 760px the blade grid collapses to one column, the blade-job hides, the blade-face list collapses to one column, the two-col blocks collapse to one, and the top-cta hides.

### Section order (the page is one object opening, then the manual)
1. Sticky top bar: brand mark (22px shell square, inset lower edge) + `TANIT CHAT` mono wordmark + `Get the app` shell-deep CTA (hidden below 760px).
2. Body section: the fold object (shell plate + hinge + tools-reveal) and the hero-note ("Free for real work - Tanit Pro only when using paid AI routing - Microsoft Store").
3. Localfirst band (paper): tagline + block-h "Local-first by default" + lead + 2 cols (Free for real work / Mix local and cloud).
4. Schools & security-sensitive environments block: 4 cols.
5. Developers & researchers block: 4 cols.
6. "A successful chat becomes a command" block: 4 cols.
7. Close: mini red shell ("Open yours") + ring + close-note ("Microsoft Store - 9N5F39064NPD - PolyMech.TanitChat").
8. Footer: POLYMECH brand + foot-links + foot-line.

## Elevation & Depth

Depth is cast by the object, not by cards. The shell plate lifts (rotateX -104deg on open); the blade faces fold (rotateX -92deg to 0); the ring sits proud of the lid. Shadows are structural - they describe where the object is in space - and inset highlights describe anodized edges.

### Shadow Vocabulary
- **Shell Lift** (`0 30px 60px -20px rgba(0,0,0,.7)`): the lid casting off the page; paired with `inset 0 2px 0 rgba(255,255,255,.18)` (top anodized highlight) and `inset 0 -10px 24px rgba(0,0,0,.28)` (bottom shell-deep shadow).
- **Hinge Set** (`0 2px 6px rgba(0,0,0,.45)` + `inset 0 -1px 0 rgba(0,0,0,.3)`): the pivot line under the lid.
- **Ring Lift** (`0 8px 20px -6px rgba(0,0,0,.5)`): the pull-ring proud of the lid.
- **Close Shell** (`0 24px 50px -18px rgba(0,0,0,.7)` + `inset 0 2px 0 rgba(255,255,255,.16)`): the closing mini shell.
- **Brand Mark Edge** (`inset 0 -3px 0 rgba(0,0,0,.25)`): the stamped mark's lower edge.
- **Pivot Dot Halo** (`0 0 0 3px rgba(154,154,147,.18)`): the blade-pivot dot's seated ring.
- **Shot Frame** (`0 10px 26px -12px rgba(27,26,23,.45)`): the framed screenshot inside an opened blade, sitting on the warm paper; light theme softens to `0 10px 26px -14px rgba(27,26,23,.4)`.

### Named Rules
**The Object-Casts Rule.** Shadows belong to the shell, the hinge, the ring, and the close-shell only. Section blocks, blade pivots, cols, and the footer are flat - they earn their place by hairline rules and tonal layer (bg / bg-2 / paper), never by a drop shadow. Do not add card shadows to flat surfaces.

## Shapes

The form language is the multi-tool: a tall shell plate with an asymmetric radius (18px 18px 4px 4px - rounded at the top where the lid meets the air, tight at the bottom where it hinges), a flat steel hinge line, and rectangular blade panels that share hairline rules. The ring is the one soft form - a 40px pill - because it is the one thing the user pulls. The brand mark is a 4px-radius square stamped with a 2px inner border. The blades container rounds 14px and clips its children; the close-shell rounds 16px. The shell-plate carries an inset 10px inner border (1px, white 14%) so the lid reads as anodized, not flat.

Borders are 1px hairlines in rule (#3a3830) on dark and in rgba(27,26,23,.16) on paper; the blade face's `face-rule` is a 1px paper-on-ink divider. There are no 2px borders, no pill cards, no circular avatars - the only circle is the pivot dot (7px) and the ring's 11px stamped-tab dot. The screenshot frame (.shot) rounds 8px with a 1px ink-tint border, full-width inside the blade face; the `.shots` 2-col row uses a 12px gap.

## Components

### Buttons
- **Shape:** shell-deep CTA is a 4px-radius rectangle; the ring is a 40px pill with a stamped 11px ring-dot prefix; the theme-toggle is a 4px-radius outlined rectangle.
- **Primary (top-cta):** shell-deep (#9e2a22) fill, white text, JetBrains Mono 700 13px tracking 0.06em uppercase, padding 9px 16px; hover darkens to #8a251e.
- **Ring (pull-ring):** paper fill, ink text, JetBrains Mono 700 14px tracking 0.08em uppercase, padding 13px 22px, ring-lift shadow; hover goes to pure white. The ring is the page's primary action and the only soft shape.
- **Theme toggle:** transparent fill, steel text, JetBrains Mono 700 12px tracking 0.08em uppercase, padding 8px 12px, 4px radius, 1px rule border (border-bottom also rule so it reads as a hairline, not a button); hover swaps border to steel and color to ink. The label text swaps to the opposite theme ("Light" when dark, "Dark" when light) and the aria-label inverts. Persisted in `localStorage['tanit-theme']`; a `?theme=light|dark` URL hook applies it on load.
- **Hover / Focus:** links gain a shell-colored bottom border on hover (text-underline-offset 3px); focus-visible is a 2px steel outline at offset 3px (shell outline in light theme).

### Cards / Containers
- **Shell plate:** the hero lid - shell gradient (shell 0-58% -> shell-deep), 18px 18px 4px 4px radius, shell-lift shadow + anodized insets, an inset 10px inner border, transform-origin bottom center, rotateX(-104deg) when opened.
- **Blades container:** bg-2 fill, 14px radius, 1px rule border, clips overflow; children share 1px rule borders so the grid is one ruled surface.
- **Blade pivot row:** bg-2, 22px padding, a 7px pivot dot with halo, a 2px blade-pin gradient on the left, the stamped label (steel) + job (text-dim, right-aligned, max-width 46%) + a 22px blade-tab square (5px radius, 1.5px rule border, a 9px plus glyph).
- **Blade face:** paper fill, ink text, opens from rotateX(-92deg) to 0, max-height 1180px (raised from 680px to fit the framed screenshot), padding 10px 24px 26px; a 1px face-rule, a body paragraph, a 2-col mono highlight list whose bullets are 9x2 shell bars, and a framed `.shot` screenshot at the end.
- **Shot (framed screenshot):** full-width `<img class="shot">` inside the blade face, 8px radius, 1px border (rgba(27,26,23,.18) dark / .16 light), white bg, shot-frame shadow, margin 16px 0 0, `loading="lazy"`. The `.shots` 2-col row (gap 12px) holds the Automation blade's launcher + forms-browser-use pair. A `.shot-cap` (JetBrains Mono 11px tracking 0.14em uppercase, shell-deep) can caption a shot.
- **Close shell:** shell->shell-deep gradient, 16px radius, close-shell shadow + anodized inset, holds the close-stamp + claim + ring.

### Navigation
- **Top bar:** sticky, rgba(20,19,15,.86) + backdrop-filter blur(10px) (rgba(244,240,230,.86) in light), 1px rule bottom, 62px tall. Brand mark + `TANIT CHAT` mono wordmark (14px, tracking 0.04em, steel / ink in light) on the left; on the right a row of the theme-toggle outlined button + `Get the app` shell-deep CTA (the CTA hidden below 760px, the toggle stays).
- **Footer:** 1px rule top, POLYMECH mono brand (14px, tracking 0.04em) with a small dim sub-line, foot-links (JetBrains Mono 12.5px uppercase, text-dim -> steel / ink in light on hover), and a foot-line tagline.

### Signature Component - The Fold Object
The fold is the signature interaction and the thesis. A `.body` (min(760px,94vw), perspective 1400px) contains three stacked layers: the `.shell-plate` lid (transform-origin bottom center), a 7px `.shell-hinge` (pivot steel), and a `.tools-reveal` container. Closed: the lid is upright and the tools-reveal is max-height 0 / opacity 0. Opened (`.body.opened`): the lid rotates rotateX(-104deg) over 0.9s cubic-bezier(.16,1,.3,1), and the tools-reveal expands to max-height 4200px / opacity 1 over 0.7s.

Three triggers open it: clicking the pull-ring, clicking the shell plate (the ring's own click is excluded), and the first scroll past 60px. A `?open` query param opens it on load without scrolling; a `?expand` query param opens it and opens every blade (the full reveal). The fold is one-way on the page - once open, the lid stays open; the blades inside are the accordion.

Inside the tools-reveal: a tools-head sub-lead, then the 2x4 `.blades` grid of eight fold-out tools (Files, AI, Voice, Images, Video, Markdown, Automation, Security). Each blade is a pivot row that folds open accordion-style (one open at a time; Esc closes all) revealing a paragraph, a 2-col mono highlight list on warm paper, and a framed `.shot` screenshot of the actual tool. The blade-tab plus glyph rotates 180deg and turns shell when its blade is open. Motion respects `prefers-reduced-motion` (durations collapse to 0.001ms).

Screenshot mapping (the reveal shows the tool): Files -> `screenshots/filemanager.jpg`, AI -> `screenshots/chat.jpg`, Voice -> `screenshots/audio.jpg`, Images -> `screenshots/image-ops.jpg`, Video -> `screenshots/chat-video-gen.jpg`, Markdown -> `screenshots/office-docs.jpg`, Automation -> `screenshots/automation.jpg` plus a `.shots` row of `screenshots/launcher.jpg` + `screenshots/forms-browser-use.jpg` (three screenshots because the Automation text names launcher + browser use). Security stays text-only - no screenshot exists, and none was invented.

### Named Rules
**The Reveal Shows The Tool Rule.** Every fold-out ends with a framed screenshot of the actual tool, except Security (no screenshot exists; none invented). The screenshot is the proof the tool is real, not a claim - never ship a fold-out that names a tool without showing it, and never invent a screenshot for a tool that does not have one.

### Browser surfaces
- **Scrollbar:** `scrollbar-color: pivot bg; scrollbar-width: thin`; webkit thumb is pivot, 11px, 6px radius, 2px bg border; hover goes steel-dim.
- **Caret:** `caret-color: shell` - the text cursor is the shell red.
- **Selection:** `::selection` is shell background with paper text.
- **Focus:** `:focus-visible` is a 2px steel outline at offset 3px.
- **Underline:** links use `text-underline-offset: 3px`.

## Do's and Don'ts

### Do:
- **Do** keep the signal-red shell to one object per viewport - the hero lid, the close-shell, the open blade-tab, the ::selection, the caret.
- **Do** stamp identity in JetBrains Mono 700 uppercase with 0.14em-0.18em tracking; reserve Big Shoulders Display for headlines and the close-stamp.
- **Do** let warm paper (#f3ead8) mean "this tool is open" - blade faces, the localfirst band, the ring.
- **Do** cast shadows from the object only (shell, hinge, ring, close-shell, shot frame); keep section blocks, blade pivots, cols, and the footer flat with hairline rules.
- **Do** make the fold the signature interaction: the lid lifts (rotateX -104deg), the blades fold (rotateX -92deg to 0), the ring lifts.
- **Do** keep the shell red (#c8362b / #9e2a22) identical across dark and light themes; invert only the neutrals and the localfirst band when the theme toggles.
- **Do** end every fold-out with a framed screenshot of the actual tool, except Security (no screenshot exists; none invented).
- **Do** self-host all three faces as woff2 with unicode-range subsets; no CDN.
- **Do** link download CTAs to https://apps.microsoft.com/detail/9N5F39064NPD.

### Don't:
- **Don't** use the signal-red shell as a section background, a card border, or a text color on dark.
- **Don't** add card drop shadows to flat surfaces - depth is structural, not decorative.
- **Don't** set labels in the display or body face - labels are stamped in mono.
- **Don't** color an `<em>` outside the red family - shell-accent on dark, shell-deep on paper, shell on light.
- **Don't** round the blade panels or the blades container beyond 14px; the only soft form is the 40px ring.
- **Don't** introduce a second accent hue; the world is one red, one near-black, one paper, one steel.
- **Don't** recolor the shell to "fit" a light background - the shell is the same object in both themes.
- **Don't** invent a screenshot for a tool that does not have one - Security stays text-only.
- **Don't** promise a trial or post-trial lock in copy - the v1 Store listing is a free app.

