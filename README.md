# Brightix — website prototype

Phase 1 scope: **Home** + **About Us (3 pages)**. Services, IT Solutions, Booking and
dashboards are intentionally placeholders.

## Run

```bash
./backend/run.sh          # creates .venv on first run, serves on http://127.0.0.1:4321
```

The pages are plain HTML and also open directly from the filesystem
(`open index.html`) — the server is only there to give the site clean routes.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/about` · `/about/who-we-are` | About 1 — Who We Are |
| `/about/our-approach` | About 2 — Why Brightix / Our Approach |
| `/about/our-team` | About 3 — Our Team |
| `/health` | server health check |

The plain `.html` paths the markup links to are served too, from both `/` and `/about/`.

## Layout

```
index.html            Home
about-1.html          Who We Are
about-2.html          Why Brightix / Our Approach
about-3.html          Our Team
assets/brightix.css   theme tokens, 3D primitives, motion, page-transition curtain
assets/transition.js  load + route transition (runs in <head>, covers first paint)
assets/brightix.js    nav dropdown, scroll reveal, pointer parallax, counters
backend/main.py       FastAPI static server
```

## Theme

Violet `#a78bfa`, white `#f2f4ff`, dark blue `#070a1c` / `#0d1233`, accent blue `#3b6dff`.
All colours are tokens on `:root` in `assets/brightix.css`.

## Motion

Curtain transition on load/reload and on every internal link; 3D wireframe cube with
orbital rings; pointer parallax; hover tilt on cards; staggered scroll reveal; animated
counters. Everything is disabled under `prefers-reduced-motion`.
