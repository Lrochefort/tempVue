# tempVue

A Vue 3 pnpm monorepo built on the Composition API, Pinia, Vue Router, Vite and Vitest, with the
oxc toolchain (oxlint, oxfmt, Rolldown, tsdown) handling lint, format and bundling. No Nuxt.

The modal library in use is [`@lrochefort/vue-final-modal`](https://www.npmjs.com/package/@lrochefort/vue-final-modal)
v5 — a maintained fork of [`vue-final/vue-final-modal`](https://github.com/vue-final/vue-final-modal),
which has not shipped a release since `4.5.5` in September 2024. Certifying that fork is what
`apps/vfm-lab` is for.

## Getting started

```bash
pnpm install
pnpm dev              # web app on http://localhost:5173
pnpm dev:lab          # variant gallery on http://localhost:5174
```

Requirements, all declared in `package.json`:

| Requirement | Value                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Node        | `>=22.12.0` (`engines`)                                                                    |
| pnpm        | `>=10` (`engines`), pinned to `11.13.1` via `packageManager` — `corepack enable` is enough |

Both dev servers use `strictPort: false`: if the port is taken, Vite picks the next free one and
prints it.

## Layout

```
apps/
  web/          Vue 3 application (Vite, Vue Router, Pinia, @lrochefort/vue-final-modal, VueUse)
  vfm-lab/      Conformance lab for @lrochefort/vue-final-modal v5 — every configuration, tested
packages/
  ui/           Shared Vue SFC components (BaseButton, BaseCard), consumed straight from source
  utils/        Framework-agnostic TypeScript helpers, bundled with tsdown for publishing
.github/
  workflows/    CI (see below)
```

Dependency versions live in a single pnpm **catalog** in `pnpm-workspace.yaml`; every package
references them with `catalog:`.

Neither `packages/ui` nor `packages/utils` carries its own README — they are small enough that
this file is the documentation. `apps/vfm-lab` does:
[apps/vfm-lab/README.md](apps/vfm-lab/README.md).

## Toolchain

| Concern   | Tool                                               |
| --------- | -------------------------------------------------- |
| Dev/build | Vite 8 (bundles with Rolldown, which is oxc-based) |
| Lib build | tsdown (Rolldown + oxc)                            |
| Lint      | oxlint (`.oxlintrc.json`)                          |
| Format    | oxfmt (`.oxfmtrc.json`, includes import sorting)   |
| Types     | TypeScript + vue-tsc                               |
| Tests     | Vitest (jsdom) + @vue/test-utils + @pinia/testing  |
| E2E       | Playwright (chromium) against `apps/vfm-lab`       |

oxfmt covers Markdown too, so `pnpm format:check` will fail on the files you are reading if they
drift — run `pnpm format` after editing them.

## Scripts

```bash
pnpm dev              # start the web app (port 5173)
pnpm dev:lab          # start the vue-final-modal variant lab (port 5174)
pnpm build            # build packages/utils, then apps/web, then apps/vfm-lab
pnpm preview          # preview apps/web only — see below for apps/vfm-lab
pnpm clean            # remove coverage/ and every apps/*/dist, packages/*/dist

pnpm test             # run every Vitest project
pnpm test --project vfm-lab   # …or just one (projects: web, vfm-lab, ui, utils)
pnpm test:watch       # watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # v8 coverage, 80% globally and 90% for apps/vfm-lab/src
pnpm test:e2e         # Playwright e2e over the vfm-lab gallery (chromium)
pnpm test:e2e:ui      # Playwright UI mode
pnpm test:e2e:report  # open the last Playwright HTML report

pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix
pnpm format           # oxfmt (writes)
pnpm format:check     # oxfmt --check
pnpm typecheck        # vue-tsc / tsc across all packages

pnpm check            # format:check + lint + typecheck + test
pnpm check:all        # check + test:e2e (needs the Playwright chromium binary)
```

`pnpm preview` is `pnpm --filter @tempvue/web preview`, so it serves the web app alone even
though `pnpm build` produced three bundles. To preview the lab:

```bash
pnpm --filter @tempvue/vfm-lab preview
```

Both default to Vite's preview port `4173`, so only one can run at a time. Passing a different
port through `pnpm run` does not work — `pnpm run preview -- --port 4174` forwards the literal
`--` to Vite and the flag is dropped. Use `pnpm --filter @tempvue/vfm-lab exec vite preview
--port 4174` instead.

## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every pull request and on pushes to
`main`, `master` and `develop`: Ubuntu, Node 24, `pnpm install --frozen-lockfile`, then
`format:check` → `lint` → `typecheck` → `test:coverage` → `build`.

`pnpm check` is the local mirror, with two deliberate differences: it runs `test` rather than
`test:coverage` (so it will not fail you on the coverage thresholds) and it stops short of
`build`. Run `pnpm test:coverage && pnpm build` as well before pushing if you want certainty.

## Notes

- `packages/ui` is an _internal source package_: its `exports` point at `.ts`/`.vue` sources, so
  there is no build step and no stale `dist` during development.
- `packages/utils` also resolves to source locally, but `publishConfig.exports` redirects to the
  tsdown-built `dist/` when published.
- TypeScript is pinned to the 6.x line: `vue-tsc` shells out to the JS-based compiler, and
  TypeScript 7 (the native port) does not expose `lib/tsc`.
- Vitest projects are discovered from `apps/*` and `packages/*` via the root `vitest.config.ts`;
  each package declares its own `test.name` and environment in its `vite.config.ts`. Coverage
  thresholds are declared centrally in the root config, because Vitest computes coverage across
  the whole run.
- `apps/vfm-lab` exists to certify `@lrochefort/vue-final-modal` v5 rather than to ship a feature.
  It holds 67 variants across 11 groups, each with its own spec, and is held to a 90% coverage
  bar. Phase 2 adds a Playwright suite (`apps/vfm-lab/e2e`) that sweeps every variant in a real
  chromium and retires the jsdom caveats. See [apps/vfm-lab/README.md](apps/vfm-lab/README.md)
  for the variant matrix, the e2e conventions and the findings.
