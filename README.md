# Portfolio

Single-page portfolio for Alexander Pop - a React 19 + Vite 8 + TypeScript site
with a canvas constellation backdrop, matrix-style text-scramble effects, and a
Netlify-backed contact form.

## Requirements

- **Node ≥ 24** (see `.nvmrc`). If your shell defaults to an older Node, run
  `nvm use` in the project root first - the build fails on older versions.

## Getting started

```bash
nvm use          # switch to Node 24
npm install
npm run dev      # start the Vite dev server
```

## Scripts

| Script                 | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Vite dev server with HMR                 |
| `npm run build`        | Type-check (`tsc -b`) + production build |
| `npm run typecheck`    | Type-check only                          |
| `npm run lint`         | ESLint                                   |
| `npm run preview`      | Preview the production build             |
| `npm run format`       | Prettier write                           |
| `npm run format:check` | Prettier check                           |

## Project structure

Feature-Sliced-inspired `shared/` + `sections/` layout. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full conventions and the
load-bearing gotchas, [`docs/DESIGN.md`](docs/DESIGN.md) for the visual spec,
and [`docs/CONTEXT.md`](docs/CONTEXT.md) for current state and deferred work.
_(The `docs/` folder is gitignored - local working notes.)_

## Deployment

Hosted on Netlify. The contact form posts to Netlify Forms via a hidden static
form in `index.html` (see the gotchas in `docs/ARCHITECTURE.md`).
