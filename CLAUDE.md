# Romantino Production — Project Context

## What this is
Personal portfolio website for Roman (Romantino Production), a Los Angeles-based
photographer transitioning into video production (music videos, events, brand content).
Static site: plain HTML/CSS/JS, no build tools, no framework.

## Design direction
- Premium / luxury dark aesthetic — think high-end Rodeo Drive storefront, not a
  casual portfolio. Deep black (#0a0a0a) + gold accent (#c9a961).
- Typography: Cormorant Garamond (serif) for headings, Inter for body text.
- Previous version used a bright, comic/GTA-style illustrated look — that was
  intentionally replaced with this premium theme. Don't reintroduce bright colors,
  comic fonts, or cartoon animations (falling cameras, flashes, star particles).
- Hero has a subtle warm "billboard spotlight" glow (bottom-up, like stage/floor
  lighting) + a soft vignette — NOT a bright center spotlight (tried that, rejected
  as "too much"). Keep lighting effects harmonious at full screen size, not blotchy.

## Site structure
- `index.html` — home: hero, billboard/video placeholder, Video|Photography split,
  About (timeline), Contact form
- `video.html` — video portfolio (currently placeholder content, no real clips yet)
- `photography.html` — photography portfolio, organized as SERIES not by person:
  primary focus on Los Angeles (Rodeo Drive, Santa Monica Pier, West Hollywood,
  Walk of Fame — 4 series sections), secondary "Beyond LA" row (Austin, Honolulu/
  Waikiki, Manhattan NYC, Las Vegas — currently all placeholder, no photos yet)
- `bookings.html` — legacy booking page from the old site, not yet restyled to
  match the new premium theme
- `styles.css` — single stylesheet, CSS custom properties at top (--bg, --gold, etc.)
- `script.js` — nav toggle, scroll reveal, contact form (EmailJS), legacy booking
  modal code

## Current known gaps / in-progress
- No real photos/videos uploaded to the repo yet — portfolio sections are
  placeholders ("Add photo"). Roman has real street photography (LA + Austin,
  Honolulu, Manhattan, Las Vegas) and video footage (YouTube vlogs, a Boheme
  party event, self-shot clips) not yet added to this repo.
- `bookings.html` still uses the OLD visual style — not yet converted to match
  the new dark/gold theme used on the other pages.
- EmailJS is wired up in `script.js` (contact form) but needs real keys:
  `emailjs.init('YOUR_PUBLIC_KEY')`, service ID `service_dae6tt3` (already set,
  points to romphotoproduction@gmail.com), and `'YOUR_TEMPLATE_ID'` placeholder
  still needs the real EmailJS template ID once Roman finalizes it.
- Contact form sends: name, email, phone, service (Video/Photo/Both), message.

## Business context (for tone/content decisions)
- Roman is a working photographer (has commercial photo experience) but is NEW
  to commercial video — be honest in copy, don't let him overclaim experience
  he doesn't have (this already happened once with a fabricated About timeline
  claiming TV/commercial video work — it was corrected to reflect reality).
- Target audience for this site: higher-end / formal clients (brands, events,
  possibly weddings) who expect a polished web presence — NOT the primary lead
  channel (that's Instagram/direct outreach to musicians). This site is a
  trust-building asset, not the main funnel.
- Roman is also a musician — deliberately decided NOT to combine music content
  into this site. Music gets its own separate site/domain later.

## Workflow notes
- Roman prefers direct, no-fluff, practical communication.
- When making changes, always leave the actual files updated in the repo (not
  just a description) — he applies them manually, no auto-deploy pipeline set up.
- GitHub Pages is enabled on this repo (Settings → Pages → main branch → root).
