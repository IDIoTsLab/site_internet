# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **IDIoTsLab**, a French hackerspace/makerspace located in Bron (69500). The site is a single-page application with no build system — open `index.html` directly in a browser or serve it with any static file server.

## Development

No build step, no package manager. To preview locally:

```bash
# Python (built-in)
python3 -m http.server 8000 --directory site_internet

# Or with npx
npx serve site_internet
```

Then open `http://localhost:8000`.

## Architecture

Three files, one page:

- **`index.html`** — all sections in order: nav, hero, values, how (spaces), what (projects carousel), community (members carousel), autonomie, join (contact + Google Calendar embed), footer.
- **`styles.css`** — CSS custom properties defined in `:root` at the top control all colors. Change `--bg-primary`/`--bg-secondary` to switch theme; preset palettes are commented near the top of the file.
- **`script.js`** — all interactivity: email obfuscation, mobile nav toggle, smooth scroll, projects carousel with auto-play and touch swipe, members infinite-loop carousel, scroll-triggered fade-in animations, and an orbital rotation animation for the values section.

**`qr.html`** is a redirect page (used for QR codes) that immediately forwards to `index.html`.

## Key Implementation Details

**Members carousel** uses an infinite-loop technique: on `load`, `initMembersCarousel()` clones the first 4 and last 4 `.member-card` elements and inserts them at the end/beginning, then sets `currentMemberIndex = 4` to start at the real first card. When scrolling past either boundary, it jumps silently to the mirrored position.

**Orbital values layout** uses a CSS transform chain — `rotate(Ndeg) translateY(-320px) rotate(-Ndeg)` — to place cards at 0°/120°/240° around a center logo. On mobile (`≤768px`) this collapses to a vertical stack via `transform: none !important`.

**Email obfuscation** — the address is assembled from an array in JS and injected after a 200 ms delay (both in `index.html` inline script and `script.js`). The two are duplicates; `script.js` is the one that actually fires.

**Brand colors** (do not change without updating both CSS variables and hardcoded hex values in `qr.html`):
- Orange: `#ed681a`
- Blue: `#01294D`
- Yellow: `#F7B801`

## Adding a Member

Add a `.member-card` div inside `#members-carousel` in `index.html` and place the avatar PNG in `Ressources/Avatar_membres/`. The infinite-loop logic in `initMembersCarousel()` clones a fixed count of 4 — if total members change significantly, verify the clone count still covers the visible window.

## Adding a Carousel Slide (Projects)

Add a `.carousel-item` div inside `#carousel` in `index.html`, then add a corresponding `.carousel-dot` in `#carousel-dots`, and increment `totalSlides` in `script.js:33`.
