# Perihelion — cinematic space travel landing page

A full-screen landing page for a fictional commercial deep-space carrier, built with React, Vite,
Tailwind CSS, framer-motion and lucide-react. The entire page — design system, animation
primitives, and all nine sections — lives in a single file, `src/App.jsx`.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## How it is put together

`src/App.jsx` is self-contained. It injects its own stylesheet at runtime through a
`<style dangerouslySetInnerHTML>` block that carries the Google Fonts `@import`, the
`liquid-glass` / `liquid-glass-strong` component layer, focus styling, and a reduced-motion
fallback. The only outside configuration is the `font-heading` (Instrument Serif) and
`font-body` (Barlow) mapping in `tailwind.config.js`.

Two motion primitives drive the page, both easing on `cubic-bezier(0.16, 1, 0.3, 1)`:

- `BlurText` splits a headline into words and staggers each one from `blur(12px)` to sharp.
- `Reveal` fades and un-blurs a block of content once it scrolls into view.

`Reveal` drops a `.reveal-settled` class when its animation finishes. This matters: an element
keeping a `filter` value — even `blur(0px)` — becomes a backdrop root, which would flatten
`backdrop-filter` on every glass card nested inside it. Clearing the filter afterwards keeps the
glass effect alive.

## Remote assets

The hero video and the vessel photograph come from the URLs given in the brief. The four
destination photographs are Unsplash IDs; each card also carries a `tint` gradient behind the
image and an `onError` guard, so a card still reads as designed if a photo fails to load. Swap
any `image` value in the `DESTINATIONS` array to change one.
