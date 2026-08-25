# tempVue

A Vue 3 pnpm monorepo built on the Composition API, Pinia, Vue Router, Vite and Vitest, with the
oxc toolchain (oxlint, oxfmt, Rolldown, tsdown) handling lint, format and bundling. No Nuxt.

## Layout

```
apps/
  web/          Vue 3 application (Vite, Vue Router, Pinia, vue-final-modal, VueUse)
  vfm-lab/      Conformance lab for vue-final-modal v5 — every configuration, every one tested
packages/
  ui/           Shared Vue SFC components, consumed straight from source
  utils/        Framework-agnostic TypeScript helpers, bundled with tsdown
```

Dependency versions live in a single pnpm **catalog** in `pnpm-workspace.yaml`; every package
references them with `catalog:`.

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

## Scripts

```bash
pnpm dev              # start the web app
pnpm dev:lab          # start the vue-final-modal variant lab (port 5174)
pnpm build            # build packages/utils, then apps/web, then apps/vfm-lab
pnpm preview          # preview the production build

pnpm test             # run every Vitest project
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

## Notes

- `packages/ui` is an _internal source package_: its `exports` point at `.ts`/`.vue` sources, so
  there is no build step and no stale `dist` during development.
- `packages/utils` also resolves to source locally, but `publishConfig.exports` redirects to the
  tsdown-built `dist/` when published.
- TypeScript is pinned to the 6.x line: `vue-tsc` shells out to the JS-based compiler, and
  TypeScript 7 (the native port) does not expose `lib/tsc`.
- Vitest projects are discovered from `apps/*` and `packages/*` via the root `vitest.config.ts`;
  each package declares its own `test.name` and environment in its `vite.config.ts`.
- `apps/vfm-lab` exists to certify `@lrochefort/vue-final-modal` v5 rather than to ship a feature.
  It holds 67 variants across 11 groups, each with its own spec, and is held to a 90% coverage
  bar. Phase 2 adds a Playwright suite (`apps/vfm-lab/e2e`) that sweeps every variant in a real
  chromium and retires the jsdom caveats. See [apps/vfm-lab/README.md](apps/vfm-lab/README.md)
  for the variant matrix, the e2e conventions and the findings.
