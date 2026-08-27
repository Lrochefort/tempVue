# @tempvue/vfm-lab

A conformance lab for [`@lrochefort/vue-final-modal`](https://www.npmjs.com/package/@lrochefort/vue-final-modal) **v5**.

Every meaningful configuration of the library is instantiated here as a **variant**,
and every variant is covered by a unit test. The point is not to test the app —
the app exists so the library can be certified.

```bash
pnpm dev:lab                  # browse the gallery at http://localhost:5174
pnpm test --project vfm-lab   # this app's 71 unit spec files only
pnpm test                     # every project in the monorepo
pnpm test:coverage            # vfm-lab is held to 90%, the repo default is 80%

pnpm test:e2e                 # drive the gallery with Playwright (chromium)
pnpm test:e2e:ui              # the same suite in Playwright's UI mode
pnpm test:e2e:report          # open the last HTML report
```

Coverage thresholds are set in the **root** `vitest.config.ts`, not here — Vitest
computes coverage across the whole run, so a per-project threshold would be ignored.

See the [repo README](../../README.md) for workspace-wide setup and scripts.

## How it is organised

```
src/
  variants/<group>/<Variant>.vue     one configuration of the library
  variants/<group>/<Variant>.spec.ts its unit test (mandatory, enforced)
  variants/registry.ts               the single source of truth
  variants/types.ts                  VARIANT_GROUPS, VariantMeta, Variant
  variants/registry.spec.ts          meta-test: no orphans, no gaps
  variants/conformance.spec.ts       contracts shared by every variant
  components/ModalBody.vue           the heading/close chrome every variant reuses
  components/LabDialog.vue           the gallery's own dialog, not under test
  views/                             the gallery shell
  router/index.ts                    routes generated from the registry
  assets/lab.css                     gallery styling
  test/helpers.ts                    the shared mounting/interaction harness
e2e/
  support/variants.ts                fs-based twin of the registry (see below)
  support/fixtures.ts                console/page-error guard on every test
  support/modal.ts                   dialog locators, dismissal, gestures
  conformance.e2e.ts                 the generic sweep over all 67 variants
  <area>.e2e.ts                      focused specs per behaviour area
playwright.config.ts                 browser projects + webServer
```

Adding a variant is three steps: drop `src/variants/<group>/<Name>.vue`, register
it in `META`, write `<Name>.spec.ts`. The router, the gallery and both meta-tests
pick it up automatically — and `registry.spec.ts` fails if you forget the spec.

Every variant follows the same shape so the harness can drive it generically:

```vue
<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <!-- `$attrs` comes first so the variant's own configuration always wins -->
  <VueFinalModal v-bind="$attrs" v-model="show" some-prop="...">
    <ModalBody heading="..." @close="show = false">…</ModalBody>
  </VueFinalModal>
</template>
```

## Variant matrix

| Group         | Count | Axis under test                                                        |
| ------------- | ----- | ---------------------------------------------------------------------- |
| `display`     | 7     | `displayDirective`, `v-model`, `modalId`, lifecycle emit order         |
| `teleport`    | 4     | `teleportTo` (default, `body`, selector, disabled)                     |
| `overlay`     | 5     | `hideOverlay`, `overlayBehavior`, `overlayClass` / `overlayStyle`      |
| `transitions` | 8     | presets, custom class objects, per-layer transitions, `appear`         |
| `styling`     | 4     | `contentClass` / `contentStyle` as string, object and array            |
| `closing`     | 6     | `clickToClose`, `escToClose`, slot `close()`, lifecycle veto           |
| `focus`       | 5     | `focusTrap` on/off/options, `background`                               |
| `scroll`      | 4     | `lockScroll`, `reserveScrollBarGap`                                    |
| `zindex`      | 4     | default `zIndexFn`, stacking, custom function, reopen                  |
| `swipe`       | 9     | `swipeToClose`, `threshold`, swipe banner, navigation gestures         |
| `composition` | 11    | `useModal`, `useModalSlot`, `useVfm`, `useVfmAttrs`, `getModalExposed` |

## The harness

`src/test/helpers.ts` is what keeps 67 specs short. `mountVariant()` mounts a
variant against a fresh `Vfm` instance and a dedicated container — not
`document.body`, otherwise a modal that teleports to `body` is indistinguishable
from one that renders in place. Around it sit `queryRoot()`, `queryOverlay()`,
`queryContent()`, their `queryAll*` counterparts, `queryTestId()` and
`isContentVisible()`, all reading from the document rather than the wrapper
because the modal is teleported out of it.

## E2E (Phase 2)

The Playwright suite drives the same gallery in a **real browser** — real layout,
real timing, real input — and retires every jsdom caveat below. It runs against
the production build (`vite preview` on port 4174), started automatically by
Playwright's `webServer`.

Three projects, all chromium by choice:

| Project           | Runs            | Why                                                                                                                                                                        |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chromium`        | everything else | full chromium build (`channel: 'chromium'`), headless                                                                                                                      |
| `chromium-headed` | `scroll.e2e.ts` | headless chromium only paints overlay scrollbars, which occupy no layout width — `reserveScrollBarGap` then has nothing to compensate; CI wraps this project in `xvfb-run` |
| `mobile-chromium` | `swipe.e2e.ts`  | Pixel 7 viewport with trusted CDP touch input                                                                                                                              |

`conformance.e2e.ts` mirrors the unit conformance suite: every variant page must
render without console/page errors (enforced by an auto fixture on **all**
tests), open a visible, hit-testable `[role=dialog]`, dismiss through its
documented control, and restore focus to the trigger.

Conventions a new e2e spec must follow:

- Name it `*.e2e.ts` — Vitest collects `src/**/*.spec.ts`, Playwright collects
  `e2e/**/*.e2e.ts`, and the two must never overlap.
- The registry cannot be imported here (`import.meta.glob` is Vite-only);
  `e2e/support/variants.ts` enumerates the same files from disk with the same
  kebab-case derivation, and the sweep cross-checks the counts against the
  live gallery so the views cannot drift.
- Web-first assertions and auto-waiting only. A fixed `waitForTimeout` is
  allowed solely to assert that something did **not** happen, and says so.
- Prefer testids over library class names; `e2e/support/modal.ts` centralises
  the `.vfm*` selectors that are themselves part of the library contract.
- Do not disable animations globally — transitions are under test.

Driving gestures took three library-specific lessons (all encoded in
`support/modal.ts` and pinned as tests):

- Swipe moves must be **discrete events**; interpolated moves outrun Vue's
  per-event transform updates and the direction watcher cancels the gesture.
- A gesture starts at the edge **opposite** the drag direction: the sheet only
  follows the pointer after `threshold`, the swipe listeners sit on the sheet
  itself, and a pointer that walks off the element silently ends the gesture.
- A mouse drag that selects text aborts the swipe via the library's
  `selectionchange` guard (see F7).

## jsdom caveats — now bridged by e2e

Unit tests run in jsdom, which never computes layout. Two shims in
`src/test/helpers.ts` bridge the gap, and one gap cannot be bridged at all. Each
is a real constraint on what Phase 1 could prove — and each now has a Phase 2
spec that proves the real behaviour.

- **`stubVisibleRects()`** — `focus-trap` refuses to activate unless `tabbable`
  finds a visible node, and its default `displayCheck: 'full'` relies on
  `getClientRects()`. jsdom always returns an empty list, so the trap throws
  _asynchronously from a timer_, which Vitest reports as an unhandled error
  rather than a test failure. **Bridged by `e2e/focus.e2e.ts`**: real Tab /
  Shift+Tab confinement, escape with `focusTrap: false`, focus restoration.
- **`stubElementBox()`** — swipe-to-close divides by the element's measured size.
  With jsdom's zero-sized boxes the offset degenerates to `-0`, which cancels the
  gesture (see F4 below). **Bridged by `e2e/swipe.e2e.ts`**: real drags in all
  four directions, threshold spring-back, banner ownership, touch input.
- **Scroll lock** has no shim: it is observable, but the numbers are not
  realistic. `document.documentElement.clientWidth` is `0`, so the reserved
  scrollbar gap equals the full `window.innerWidth`. **Bridged by
  `e2e/scroll.e2e.ts`**: a genuinely scrollable page, wheel input, and a
  pixel-exact gap compensation check against a real scrollbar.

Transitions, stacking order, overlay behaviour, teleport placement and the
`background` prop each have their own focused spec
(`transitions`/`stacking`/`teleport` + the a11y pass in `a11y.e2e.ts`).

Swipe gestures in the unit suite are driven with **`MouseEvent`**, not touch
events: the library's vendored swipe reads `event.targetTouches[0]`, which
synthetic `TouchEvent`s built with a `touches` property do not populate. The
e2e suite uses real mouse input and trusted CDP touch events instead.

Variants with a caveat carry a `jsdomCaveat` note in the registry, which the
gallery renders next to the demo.

## Findings

The deliverable of this lab is the list of confirmed defects and limitations
found while pinning the library's behaviour down. Phase 2 re-ran every finding
in a real browser; the verdicts are below, and `e2e/findings.e2e.ts` keeps the
reproductions executable — if the library ever fixes one, the spec fails and
the finding gets retired.

### F1 — `vfm.open(id)` never settles when the modal is already open

`toggle()` builds its promise around the `modelValue` watcher. Writing the same
value does not trigger the watcher, so the resolver is never called and
`await vfm.open(id)` deadlocks. The dynamic `useModal` path instead resolves with
`"[Vue Final Modal] modal is already opened."`, so the two APIs disagree.

**Chromium verdict: CONFIRMED** — the promise outlives a 1.5s race
(`findings.e2e.ts`). Not a jsdom artifact.

### F2 — `close()` can resolve with a stale `"opened"`

The resolver is a single mutable slot overwritten by every `toggle()`. `open()`
resolves from the first transition hook that fires, but a second hook still runs
afterwards; if `close()` has already installed its resolver, that stale callback
resolves the **close** promise with `"opened"`. Interleaving a flush avoids it.

**Chromium verdict: CONFIRMED** — `open(id)` immediately followed by
`close(id)` resolves the close promise with `"opened"` (`findings.e2e.ts`).

### F3 — the `appear` phase never runs

`appear: true` is forced onto every transition and is not user-controllable — and
it never has any effect, because the content element is not part of the first
render. A modal that is open on mount plays the regular **enter** transition.

**Chromium verdict: CONFIRMED** — a MutationObserver installed before the app
boots sees the enter classes and never the appear classes
(`transitions.e2e.ts`).

### F4 — a `-0` swipe offset silently cancels the gesture

The direction guard is `offset.value < 0`. When the drag distance rounds to `-0`,
`Object.is(-0, 0)` is `false` so the watcher _does_ fire, `-0 < 0` is `false`, and
the gesture is abandoned mid-drag.

**Chromium verdict: NOT REPRODUCIBLE with real layout** — the code path needs a
zero-sized box at gesture start, which a rendered sheet never has. In practice
this is a jsdom-only hazard; the same watcher does, however, cancel real
gestures produced as interpolated event streams (see F7).

### F5 — `getModalExposed()` returns a `ComputedRef`

Despite the name and the `ModalExposed` shape, the runtime value is a
`ComputedRef<ModalExposed>` whose fields are themselves refs, so reading one
takes two hops: `getModalExposed(instance)?.value.overlayBehavior.value`.

**Verdict: browser-independent** — an API-shape fact with no rendering
dimension; the unit spec remains its reproduction.

### F6 — `teleportTo` a selector rendered by the same component crashes in real browsers (NEW)

Vue resolves Teleport targets at mount time and documents that the target
"cannot be rendered by the component itself". jsdom tolerated the original
`TeleportToSelector` variant; every real browser build (dev and prod) throws
`TypeError: Cannot read properties of null (reading 'nextSibling')` inside
Vue's renderer on open, killing the whole component tree. The library adds no
guard or graceful fallback for an unresolvable target. The variant now defers
mounting the modal by one tick (`onMounted`) — the pattern any consumer of
`teleportTo: '#selector'` must follow.

### F7 — mouse-driven swipe is hostile to real pointer input (NEW)

Three independent behaviours make `swipeToClose` unreliable with a mouse, all
pinned by `swipe.e2e.ts`:

1. **Text selection aborts the gesture.** The library watches
   `selectionchange` and cancels the swipe as soon as the drag selects any
   text — which a drag across a sheet with text content almost always does
   unless the sheet sets `user-select: none`.
2. **The swipe listeners live on the sheet element, not the document.** Until
   the drag passes `threshold`, the sheet does not follow the pointer, so a
   pointer that leaves the element's box silently ends the gesture. With a
   non-zero `threshold` a centred drag can never complete in a short sheet.
3. **Interpolated event streams cancel the gesture.** The direction watcher
   (the F4 watcher) treats any non-increasing offset sample as a reversal;
   coalesced/interpolated mouse moves routinely trigger it.

Touch input is unaffected. Verdict: works as coded, but mouse users get a
degraded, easily-cancelled gesture.

## Scope

- **Phase 1: unit tests** — done. 67 variants, every one with its own spec,
  90% coverage bar.
- **Phase 2: e2e** — done. Playwright over the same gallery: the generic
  conformance sweep, focused specs for everything jsdom could not prove, an
  accessibility pass, and executable reproductions of the findings.
- **Phase 3: BDD** — remaining. Gherkin-style feature files over the same
  variants, mapped onto the Playwright fixtures built here.
