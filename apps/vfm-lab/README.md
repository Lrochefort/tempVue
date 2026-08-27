# @tempvue/vfm-lab

A conformance lab for [`@lrochefort/vue-final-modal`](https://www.npmjs.com/package/@lrochefort/vue-final-modal) **v5**.

Every meaningful configuration of the library is instantiated here as a **variant**,
and every variant is covered by a unit test. The point is not to test the app —
the app exists so the library can be certified.

```bash
pnpm dev:lab                  # browse the gallery at http://localhost:5174
pnpm test --project vfm-lab   # this app's 71 spec files only
pnpm test                     # every project in the monorepo
pnpm test:coverage            # vfm-lab is held to 90%, the repo default is 80%
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

## jsdom caveats

Unit tests run in jsdom, which never computes layout. Two shims in
`src/test/helpers.ts` bridge the gap, and one gap cannot be bridged at all. Each
is a real constraint on what Phase 1 can prove; the rest belongs to Phase 2 (e2e).

- **`stubVisibleRects()`** — `focus-trap` refuses to activate unless `tabbable`
  finds a visible node, and its default `displayCheck: 'full'` relies on
  `getClientRects()`. jsdom always returns an empty list, so the trap throws
  _asynchronously from a timer_, which Vitest reports as an unhandled error
  rather than a test failure.
- **`stubElementBox()`** — swipe-to-close divides by the element's measured size.
  With jsdom's zero-sized boxes the offset degenerates to `-0`, which cancels the
  gesture (see F4 below).
- **Scroll lock** has no shim: it is observable, but the numbers are not
  realistic. `document.documentElement.clientWidth` is `0`, so the reserved
  scrollbar gap equals the full `window.innerWidth`.

Swipe gestures are driven with **`MouseEvent`**, not touch events: the library's
vendored swipe reads `event.targetTouches[0]`, which synthetic `TouchEvent`s
built with a `touches` property do not populate.

Variants with a caveat carry a `jsdomCaveat` note in the registry, which the
gallery renders next to the demo.

## Findings

The deliverable of this lab is the list of confirmed defects and limitations
found while pinning the library's behaviour down.

### F1 — `vfm.open(id)` never settles when the modal is already open

`toggle()` builds its promise around the `modelValue` watcher. Writing the same
value does not trigger the watcher, so the resolver is never called and
`await vfm.open(id)` deadlocks. The dynamic `useModal` path instead resolves with
`"[Vue Final Modal] modal is already opened."`, so the two APIs disagree.

### F2 — `close()` can resolve with a stale `"opened"`

The resolver is a single mutable slot overwritten by every `toggle()`. `open()`
resolves from the first transition hook that fires, but a second hook still runs
afterwards; if `close()` has already installed its resolver, that stale callback
resolves the **close** promise with `"opened"`. Interleaving a flush avoids it.

### F3 — the `appear` phase never runs

`appear: true` is forced onto every transition and is not user-controllable — and
it never has any effect, because the content element is not part of the first
render. A modal that is open on mount plays the regular **enter** transition.

### F4 — a `-0` swipe offset silently cancels the gesture

The direction guard is `offset.value < 0`. When the drag distance rounds to `-0`,
`Object.is(-0, 0)` is `false` so the watcher _does_ fire, `-0 < 0` is `false`, and
the gesture is abandoned mid-drag. Reproducible in a real browser with any
element that reports a zero-sized box when the gesture starts.

### F5 — `getModalExposed()` returns a `ComputedRef`

Despite the name and the `ModalExposed` shape, the runtime value is a
`ComputedRef<ModalExposed>` whose fields are themselves refs, so reading one
takes two hops: `getModalExposed(instance)?.value.overlayBehavior.value`.

## Scope

This is **Phase 1: unit tests**. Behaviour that genuinely needs a browser —
real focus trapping, scroll locking, transition timing, pointer gestures — is
asserted here only as far as "the configuration reaches the DOM". Phase 2 (e2e
against this gallery) and Phase 3 (BDD) are out of scope for now.
