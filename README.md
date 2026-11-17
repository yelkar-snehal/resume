# Snehal Yelkar · portfolio

Source for https://yelkar-snehal.github.io/resume/, served by GitHub Pages from the `main` branch.

## Files

| Path | What it is |
|---|---|
| `index.html` | The page: hero, about, skills, highlights (with the request-path diagram), lab, experience and contact. |
| `assets/site.css` | All styles. Light theme by default, dark theme from `prefers-color-scheme`. |
| `assets/main.js` | Scroll reveals, the timeline line and the one-time request-path animation. No dependencies. |
| `og.html`, `og.png` | Social card (1200 x 630) used by LinkedIn and other link previews. |
| `.gitignore` | Keeps `.DS_Store` out of the repo. |
| `Snehal_Yelkar_Resume.pdf` | Resume download. |

There is no build step and no framework. Fonts come from Google Fonts. Icons and diagrams are inline SVG.

## Edit and preview

Open `index.html` in a browser, or run a local server:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Motion and accessibility

- Cards fade and move up a little as they scroll into view. The experience timeline line fills as you scroll.
- The request-path diagram builds itself once when it comes into view, then one dot travels the drawn path once, from the chat UI to a tool server (SVG `animateMotion`, started from `main.js`).
- `main.js` checks positions in one `requestAnimationFrame` pass on scroll: all reads first, then all writes.
- With `prefers-reduced-motion`, or without JavaScript, everything shows in its final state. If `main.js` fails to load or does not finish within 4 seconds, the page falls back to the same static layout.
- Screenshot hooks: `?y=1200` scrolls to that position after load and shows everything in its final state; `?static=1` renders the reduced-motion layout.

## Optional photo

Save a square photo as `assets/photo.jpg`, then add `data-photo="assets/photo.jpg"` to the `#mark` element in `index.html`. The page shows it in the round avatar in the top bar. Without the attribute, the page shows the "SY" monogram and does not request a photo.

## Regenerate the social card

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=4000 \
  --screenshot="$PWD/og.png" "file://$PWD/og.html"
```

## Content rules

Keep work highlights generic: no internal product, service or customer names, account IDs, numbers or code. The diagram uses generic names.
