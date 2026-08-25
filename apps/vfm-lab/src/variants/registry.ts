import type { Component } from 'vue'

import { isVariantGroup, type Variant, type VariantGroup, type VariantMeta } from './types'

/**
 * Every `.vue` file under a group directory is a variant. Metadata lives in
 * `META` below rather than inside the components so that the gallery, the router
 * and the meta-test all read from one place.
 */
const modules = import.meta.glob<{ default: Component }>('./*/*.vue', { eager: true })

const META: Record<string, VariantMeta> = {
  './display/DisplayIf.vue': {
    title: 'displayDirective: if',
    description: 'The modal is removed from the DOM entirely while closed.',
  },
  './display/DisplayShow.vue': {
    title: 'displayDirective: show',
    description: 'The modal stays mounted and is hidden with `display: none`.',
  },
  './display/DisplayVisible.vue': {
    title: 'displayDirective: visible',
    description:
      'The modal stays mounted and keeps its layout box, hidden with `visibility: hidden`.',
  },
  './display/ControlledModel.vue': {
    title: 'Controlled v-model',
    description: 'Open state is owned by the parent and driven through `v-model`.',
  },
  './display/InitiallyOpen.vue': {
    title: 'Initially open',
    description: 'The modal is already open on first render, with no interaction.',
  },
  './display/ModalIdProgrammatic.vue': {
    title: 'modalId + useVfm',
    description: 'Opened, closed and toggled by id through the `useVfm()` API.',
  },
  './display/LifecycleEmits.vue': {
    title: 'Lifecycle emit order',
    description: 'Records every lifecycle emit so the open/close sequence can be asserted.',
  },

  './teleport/TeleportDefault.vue': {
    title: 'Default teleport target',
    description: 'With no `teleportTo` the modal lands on `document.body`.',
  },
  './teleport/TeleportToBody.vue': {
    title: 'teleportTo: body',
    description: 'The default target spelled out explicitly.',
  },
  './teleport/TeleportToSelector.vue': {
    title: 'teleportTo: selector',
    description: 'The modal is teleported into an arbitrary element resolved by selector.',
  },
  './teleport/TeleportDisabled.vue': {
    title: 'Teleport disabled',
    description: '`teleportTo: false` keeps the modal in place, inline in the component tree.',
  },

  './overlay/OverlayDefault.vue': {
    title: 'Default overlay',
    description: 'The backdrop element is rendered alongside the content.',
  },
  './overlay/OverlayHidden.vue': {
    title: 'hideOverlay',
    description: 'The backdrop element is not rendered at all.',
  },
  './overlay/OverlayBehaviorAuto.vue': {
    title: 'overlayBehavior: auto',
    description: 'Stacked modals show only the bottom-most overlay.',
  },
  './overlay/OverlayBehaviorPersist.vue': {
    title: 'overlayBehavior: persist',
    description: 'Every stacked modal keeps its own visible overlay.',
  },
  './overlay/OverlayCustomAppearance.vue': {
    title: 'overlayClass + overlayStyle',
    description: 'The backdrop is restyled through class and inline style props.',
  },

  './transitions/TransitionFade.vue': {
    title: 'vfm-fade preset',
    description: 'The bundled fade transition applied to both layers.',
  },
  './transitions/TransitionSlideUp.vue': {
    title: 'vfm-slide-up preset',
    description: 'The content slides in from below.',
  },
  './transitions/TransitionSlideDown.vue': {
    title: 'vfm-slide-down preset',
    description: 'The content slides in from above.',
  },
  './transitions/TransitionSlideLeft.vue': {
    title: 'vfm-slide-left preset',
    description: 'The content slides in from the right edge.',
  },
  './transitions/TransitionSlideRight.vue': {
    title: 'vfm-slide-right preset',
    description: 'The content slides in from the left edge.',
  },
  './transitions/TransitionCustomObject.vue': {
    title: 'Custom transition object',
    description: 'Per-phase class names are supplied instead of a preset name.',
  },
  './transitions/TransitionSeparateLayers.vue': {
    title: 'Overlay and content transitions differ',
    description: '`overlayTransition` and `contentTransition` are configured independently.',
  },
  './transitions/TransitionAppear.vue': {
    title: 'appear phase',
    description: 'An initially open modal with explicit appear classes.',
    jsdomCaveat:
      'The appear phase never runs: the content element is not part of the very first render, so Vue plays the regular enter transition instead.',
  },

  './styling/ContentClassString.vue': {
    title: 'contentClass string',
    description: 'A static class string is merged onto the content element.',
  },
  './styling/ContentClassReactive.vue': {
    title: 'contentClass reactive',
    description: 'The content class is recomputed as component state changes.',
  },
  './styling/ContentStyleObject.vue': {
    title: 'contentStyle object',
    description: 'Inline styles supplied as an object.',
  },
  './styling/ContentStyleArray.vue': {
    title: 'contentStyle array',
    description: 'Inline styles supplied as an array of objects, merged left to right.',
  },

  './closing/ClickToCloseEnabled.vue': {
    title: 'clickToClose enabled',
    description: 'Clicking the backdrop closes the modal (the default).',
  },
  './closing/ClickToCloseDisabled.vue': {
    title: 'clickToClose disabled',
    description: 'Backdrop clicks are ignored.',
  },
  './closing/EscToCloseEnabled.vue': {
    title: 'escToClose enabled',
    description: 'Pressing Escape closes the modal (the default).',
  },
  './closing/EscToCloseDisabled.vue': {
    title: 'escToClose disabled',
    description: 'Escape key presses are ignored.',
  },
  './closing/SlotCloseFunction.vue': {
    title: 'Default slot close()',
    description: 'The default slot receives a `close` function it can call directly.',
  },
  './closing/VetoLifecycle.vue': {
    title: 'Vetoing open and close',
    description: 'The `beforeOpen`/`beforeClose` events call `stop()` to cancel the transition.',
  },

  './focus/FocusTrapDefault.vue': {
    title: 'Default focus trap',
    description: 'Focus is trapped inside the content with `allowOutsideClick: true`.',
    jsdomCaveat:
      'jsdom reports zero-sized boxes, so `focus-trap` sees no tabbable node and throws from a timer. Tests stub `Element.prototype.getClientRects`.',
  },
  './focus/FocusTrapDisabled.vue': {
    title: 'focusTrap: false',
    description: 'No focus trap is installed; focus can leave the modal freely.',
  },
  './focus/FocusTrapOptions.vue': {
    title: 'focusTrap options',
    description: 'Options are forwarded straight to `focus-trap`, here `tabbableOptions`.',
  },
  './focus/BackgroundInteractive.vue': {
    title: 'background: interactive',
    description: 'Pointer events pass through everything except the content element.',
  },
  './focus/BackgroundNonInteractive.vue': {
    title: 'background: non-interactive',
    description: 'The default: the modal root swallows pointer events.',
  },

  './scroll/LockScrollEnabled.vue': {
    title: 'lockScroll enabled',
    description: 'Body scrolling is frozen while the modal is open (the default).',
  },
  './scroll/LockScrollDisabled.vue': {
    title: 'lockScroll disabled',
    description: 'The page keeps scrolling behind the modal.',
  },
  './scroll/ReserveScrollBarGapEnabled.vue': {
    title: 'reserveScrollBarGap enabled',
    description: 'A padding compensates for the hidden scrollbar so the layout does not shift.',
    jsdomCaveat:
      '`document.documentElement.clientWidth` is 0 in jsdom, so the computed gap equals the full `window.innerWidth`.',
  },
  './scroll/ReserveScrollBarGapDisabled.vue': {
    title: 'reserveScrollBarGap disabled',
    description: 'Only `overflow: hidden` is applied; the layout may shift by the scrollbar width.',
  },

  './zindex/ZIndexDefault.vue': {
    title: 'Default zIndexFn',
    description: 'The first modal receives `1000` from the default `1000 + 2 * index`.',
  },
  './zindex/ZIndexStacked.vue': {
    title: 'Stacked z-indexes',
    description: 'Three stacked modals step through 1000, 1002 and 1004.',
  },
  './zindex/ZIndexCustom.vue': {
    title: 'Custom zIndexFn',
    description: 'A user-supplied function replaces the default stacking formula.',
  },
  './zindex/ZIndexResetOnClose.vue': {
    title: 'z-index on reopen',
    description: 'A modal kept in the DOM recomputes its z-index from its new stack position.',
  },

  './swipe/SwipeToCloseNone.vue': {
    title: 'swipeToClose: none',
    description: 'The default: dragging the content does nothing.',
  },
  './swipe/SwipeToCloseUp.vue': {
    title: 'swipeToClose: up',
    description: 'Dragging the content upwards past the threshold closes it.',
    jsdomCaveat: 'Element box metrics must be stubbed; jsdom reports every element as 0 x 0.',
  },
  './swipe/SwipeToCloseDown.vue': {
    title: 'swipeToClose: down',
    description: 'Dragging the content downwards past the threshold closes it.',
    jsdomCaveat:
      'Without stubbed box metrics the computed offset is `-0`, which flips the direction guard and cancels the gesture.',
  },
  './swipe/SwipeToCloseLeft.vue': {
    title: 'swipeToClose: left',
    description: 'Dragging the content to the left past the threshold closes it.',
    jsdomCaveat: 'Element box metrics must be stubbed; jsdom reports every element as 0 x 0.',
  },
  './swipe/SwipeToCloseRight.vue': {
    title: 'swipeToClose: right',
    description: 'Dragging the content to the right past the threshold closes it.',
    jsdomCaveat:
      'Without stubbed box metrics the computed offset is `-0`, which flips the direction guard and cancels the gesture.',
  },
  './swipe/SwipeThreshold.vue': {
    title: 'Swipe threshold',
    description: 'A non-zero `threshold` requires a longer drag before the modal closes.',
    jsdomCaveat: 'Element box metrics must be stubbed; jsdom reports every element as 0 x 0.',
  },
  './swipe/SwipeBannerDefault.vue': {
    title: 'showSwipeBanner',
    description: 'The gesture is retargeted onto a dedicated banner strip instead of the content.',
    jsdomCaveat: 'Element box metrics must be stubbed; jsdom reports every element as 0 x 0.',
  },
  './swipe/SwipeBannerSlot.vue': {
    title: 'swipe-banner slot',
    description: 'The banner markup is replaced through the named slot.',
    jsdomCaveat: 'Element box metrics must be stubbed; jsdom reports every element as 0 x 0.',
  },
  './swipe/PreventNavigationGestures.vue': {
    title: 'preventNavigationGestures',
    description: 'Edge strips are rendered to swallow browser back/forward swipe gestures.',
  },

  './composition/UseModalBasic.vue': {
    title: 'useModal',
    description: 'A modal created entirely in script and rendered by `<ModalsContainer />`.',
  },
  './composition/UseModalSlots.vue': {
    title: 'useModalSlot',
    description: 'Slot content declared as a component, a raw HTML string and a render function.',
  },
  './composition/UseModalPatchOptions.vue': {
    title: 'patchOptions',
    description: 'Props, attrs and slots of a dynamic modal are patched after creation.',
  },
  './composition/UseModalDestroy.vue': {
    title: 'destroy()',
    description: 'The dynamic modal is removed from the container and can be recreated.',
  },
  './composition/UseModalKeepAlive.vue': {
    title: 'keepAlive',
    description: 'The dynamic modal stays mounted after closing and keeps its internal state.',
  },
  './composition/UseModalDefaultModelValue.vue': {
    title: 'defaultModelValue',
    description: 'A dynamic modal that is open the moment it is created.',
  },
  './composition/ModalsContainerFirst.vue': {
    title: 'One active <ModalsContainer />',
    description: 'Only the first mounted container renders dynamic modals; extras are inert.',
  },
  './composition/UseVfmOpenClose.vue': {
    title: 'useVfm open/close',
    description: 'Modals are driven by id through the plugin instance.',
  },
  './composition/UseVfmCloseAll.vue': {
    title: 'useVfm closeAll',
    description: 'Every open modal is dismissed in one call.',
  },
  './composition/GetModalExposed.vue': {
    title: 'getModalExposed',
    description: 'Reads a registered modal instance internal refs and drives it through `toggle`.',
  },
  './composition/UseVfmAttrsBridge.vue': {
    title: 'useVfmAttrs',
    description: 'A wrapper component that forwards every modal prop and event transparently.',
  },
}

function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function parseFile(file: string): { group: VariantGroup; id: string } {
  const match = /^\.\/([^/]+)\/([^/]+)\.vue$/.exec(file)
  const groupName = match?.[1]
  const componentName = match?.[2]

  if (groupName === undefined || componentName === undefined) {
    throw new Error(`Variant path "${file}" must look like "./<group>/<Component>.vue".`)
  }

  if (!isVariantGroup(groupName)) {
    throw new Error(`Variant "${file}" uses unknown group "${groupName}".`)
  }

  return { group: groupName, id: toKebabCase(componentName) }
}

function buildVariants(): Variant[] {
  const built: Variant[] = []

  for (const [file, meta] of Object.entries(META)) {
    const loaded = modules[file]

    if (loaded === undefined) {
      throw new Error(`Variant "${file}" is registered but the file does not exist.`)
    }

    const { group, id } = parseFile(file)

    built.push({
      id,
      group,
      file,
      component: loaded.default,
      title: meta.title,
      description: meta.description,
      jsdomCaveat: meta.jsdomCaveat,
    })
  }

  return built.toSorted((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id))
}

export const variants: Variant[] = buildVariants()

/** Glob keys actually present on disk, used by the meta-test to detect orphans. */
export const discoveredVariantFiles: string[] = Object.keys(modules).toSorted()

export function variantsInGroup(group: VariantGroup): Variant[] {
  return variants.filter((variant) => variant.group === group)
}

export function usedGroups(): VariantGroup[] {
  return [...new Set(variants.map((variant) => variant.group))]
}

export function findVariant(group: string, id: string): Variant | undefined {
  return variants.find((variant) => variant.group === group && variant.id === id)
}
