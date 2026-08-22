# CAC Good Works Assembly — 2026 Camp Meeting Homepage

A production-ready, installable (PWA) homepage for the **"Freely Given"** 2026 Camp Meeting
(October 8–11, 2026), built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks,
no build step, no backend.

## Folder structure

```
2026-camp-meeting/
│
├── index.html          Homepage markup
├── style.css            All styling / design system
├── script.js             Countdown, links config, PWA install logic
├── manifest.json      PWA manifest
├── service-worker.js  Offline caching
├── README.md
│
└── images/
    ├── logo.png             Church logo (replace)
    ├── hero.jpg              Hero background (replace, optional)
    ├── minister-1.jpg  ┐
    ├── minister-2.jpg  │ Minister portraits (replace)
    ├── minister-3.jpg  │
    ├── minister-4.jpg  ┘
    ├── icon-192.png       App icon (replace)
    └── icon-512.png       App icon (replace)
```

All images currently in `images/` are **generated placeholders** so the site runs immediately.
Swap them for real photos using the same file names and the site will pick them up automatically.

## How to preview it

No build tools needed. Either:

- Double-click `index.html` to open it in a browser, **or**
- Serve the folder locally for full PWA/offline testing, e.g.:
  ```
  cd 2026-camp-meeting
  python3 -m http.server 8080
  ```
  then open `http://localhost:8080` in your browser.

PWA install prompts and the service worker only activate over `https://` or `localhost`.

## What to edit

| What you want to change            | Where to edit it                                    |
|-------------------------------------|-------------------------------------------------------|
| Church name, theme, verses, dates   | `index.html` — hero and "About" sections (clearly commented) |
| Countdown target date               | `script.js` → `CAMP_INFO.eventStart` / `eventEnd`     |
| Registration / Gallery / Volunteer / Admin / Documentation / Strategies links | `script.js` → `CAMP_LINKS` object |
| Minister names, titles, churches    | `index.html` → "MINISTER PHOTOS" section              |
| Minister photos                     | Replace `images/minister-1.jpg` … `minister-4.jpg`   |
| Program schedule                    | `index.html` → "EVENT PROGRAM" section (`<ol class="timeline">`) |
| Logo                                | Replace `images/logo.png`                              |
| App icons                           | Replace `images/icon-192.png` and `images/icon-512.png` |
| Colors / fonts                      | `style.css` → `:root` custom properties at the top    |

### Editing the CTA links

Open `script.js` and find:

```js
const CAMP_LINKS = {
  registration:  "PASTE_REGISTRATION_LINK_HERE",
  gallery:       "PASTE_GALLERY_LINK_HERE",
  volunteer:     "PASTE_VOLUNTEER_LINK_HERE",
  admin:         "PASTE_ADMIN_LINK_HERE",
  documentation: "PASTE_DOCUMENTATION_LINK_HERE",
  strategies:    "PASTE_STRATEGIES_LINK_HERE",
};
```

Replace each placeholder with your real URL, e.g. `"https://forms.gle/your-form"`.
Until you do, the matching button stays visibly active but shows a friendly
"link has not been added yet" message instead of navigating anywhere broken.

### Editing the countdown date

In `script.js`:

```js
const CAMP_INFO = {
  eventStart: "2026-10-08T00:00:00",
  eventEnd:   "2026-10-11T23:59:59",
};
```

The homepage automatically shows one of four states based on the visitor's local clock:

1. **Before Oct 8** — live DAYS / HOURS / MINUTES / SECONDS countdown
2. **Oct 8 – Oct 11** — "THE CAMP MEETING IS NOW LIVE!"
3. **After Oct 11** — "THANK YOU FOR BEING PART OF THE 2026 CAMP MEETING"
4. The moment the countdown hits zero (edge case) — "WELCOME TO THE 2026 CAMP MEETING"

## Installing as an app

- **Android / Desktop Chrome, Edge:** tap/click the "Install App" button that appears once the
  browser's install prompt is available.
- **iPhone / iPad (Safari):** tapping "Install App" opens an instruction card:
  Share → Add to Home Screen → Add. iOS Safari has no automatic install prompt, so this is the
  correct behavior rather than a bug.

## Notes

- No backend or authentication is included — the ADMIN button is simply another external link
  you configure in `CAMP_LINKS`.
- The design respects `prefers-reduced-motion` and includes visible keyboard focus states.
- Bump `CACHE_NAME` in `service-worker.js` after future content changes so returning visitors
  receive the update instead of a stale cached copy.
