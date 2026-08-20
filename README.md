# tempVue

A Vue 3 pnpm monorepo built on the Composition API, Pinia, Vue Router, Vite and Vitest, with the
oxc toolchain (oxlint, oxfmt, Rolldown, tsdown) handling lint, format and bundling. No Nuxt.

## Layout

```
apps/
  web/          Vue 3 application (Vite, Vue Router, Pinia, vue-final-modal, VueUse)
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

## Scripts

```bash
pnpm dev              # start the web app
pnpm build            # build packages/utils, then apps/web
pnpm preview          # preview the production build

pnpm test             # run every Vitest project
pnpm test:watch       # watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # v8 coverage with 80% thresholds

pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix
pnpm format           # oxfmt (writes)
pnpm format:check     # oxfmt --check
pnpm typecheck        # vue-tsc / tsc across all packages

pnpm check            # format:check + lint + typecheck + test
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
