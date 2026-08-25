import { createVfm, type Vfm } from '@lrochefort/vue-final-modal'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick, type Component, type Plugin } from 'vue'

type MountPlugin = Plugin | [Plugin, ...unknown[]]

export interface MountVariantOptions {
  /** Extra attrs forwarded onto the variant (and through it onto the modal). */
  attrs?: Record<string, unknown>
  /** Extra plugins/components merged into the mounting options. */
  global?: Record<string, unknown>
}

export interface MountedVariant {
  wrapper: VueWrapper
  vfm: Vfm
  /** The element the variant is mounted into, distinct from `document.body`. */
  container: HTMLElement
}

/**
 * Mounts a variant with a fresh Vfm instance.
 *
 * The variant is attached to a dedicated container rather than straight to
 * `document.body`, otherwise a modal that teleports to `body` is indistinguishable
 * from one that renders in place (both end up parented to `body`).
 *
 * `focusTrap: false` is the default because focus-trap throws under jsdom: it
 * asks `tabbable` for focusable nodes, and jsdom reports every element as having
 * no layout box, so the trap concludes the container is empty. Variants that
 * exist specifically to exercise focusTrap set the prop themselves and win,
 * because the variant's own bindings are applied after `$attrs`.
 */
export function mountVariant(
  component: Component,
  options: MountVariantOptions = {},
): MountedVariant {
  const vfm = createVfm()
  const { attrs = {}, global = {} } = options
  const { plugins = [], ...restGlobal } = global as { plugins?: MountPlugin[] }

  const container = document.createElement('div')
  container.dataset['testid'] = 'variant-container'
  document.body.append(container)

  const wrapper = mount(component, {
    attachTo: container,
    attrs: { focusTrap: false, ...attrs },
    global: {
      plugins: [vfm, ...plugins],
      ...restGlobal,
    },
  })

  return { wrapper, vfm, container }
}

/**
 * Lets vue-final-modal's transition-driven lifecycle settle.
 *
 * `opened` and `closed` are emitted from `<Transition>` hooks, and Vue's enter
 * path waits for a double `requestAnimationFrame`. The setup file routes rAF
 * through a 0ms timer, so draining the macrotask queue twice is enough.
 */
export async function flushModal(): Promise<void> {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

/** Clicks the variant's `[data-testid="trigger"]` button and waits for the modal. */
export async function openVariant(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('[data-testid="trigger"]').trigger('click')
  await flushModal()
}

/**
 * Clicks an element inside the teleported modal.
 *
 * Teleported nodes live outside the wrapper's element tree, so `wrapper.get()`
 * cannot see them; they have to be resolved from the document and clicked
 * natively.
 */
export async function clickTeleported(testId: string): Promise<void> {
  const element = queryTestId(testId)

  if (element === null) {
    throw new Error(`No teleported element found with [data-testid="${testId}"].`)
  }

  element.click()
  await flushModal()
}

/**
 * Starts opening the modal and stops on the first frame.
 *
 * Transition classes only exist between the transition's start and end, so
 * asserting them requires stopping before {@link flushModal} drains the queue.
 */
export async function beginOpen(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('[data-testid="trigger"]').trigger('click')
}

/** Starts closing the modal and stops on the first frame. See {@link beginOpen}. */
export async function beginClose(): Promise<void> {
  const element = queryTestId('content-close')

  if (element === null) {
    throw new Error('No open modal to close.')
  }

  element.click()
  await nextTick()
}

const BOX_METRICS = [
  'offsetWidth',
  'offsetHeight',
  'clientWidth',
  'clientHeight',
  'scrollWidth',
  'scrollHeight',
] as const

/**
 * Gives every element a non-zero box.
 *
 * jsdom performs no layout, so all size metrics read back as `0`. That breaks
 * swipe-to-close in two ways: the travelled distance clamps to `0`, and the
 * `down`/`right` branches negate it into `-0`. Because `Object.is(-0, 0)` is
 * false, Vue treats that as a change and the direction watcher concludes the
 * finger moved the wrong way, so the gesture is discarded. Returns a restore
 * function.
 */
export function stubElementBox(size = 400): () => void {
  const originals = BOX_METRICS.map(
    (metric) => [metric, Object.getOwnPropertyDescriptor(HTMLElement.prototype, metric)] as const,
  )

  for (const metric of BOX_METRICS) {
    Object.defineProperty(HTMLElement.prototype, metric, {
      configurable: true,
      get: () => size,
    })
  }

  return () => {
    for (const [metric, descriptor] of originals) {
      if (descriptor === undefined) {
        Reflect.deleteProperty(HTMLElement.prototype, metric)
      } else {
        Object.defineProperty(HTMLElement.prototype, metric, descriptor)
      }
    }
  }
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

const SWIPE_DELTAS: Record<SwipeDirection, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

/**
 * jsdom implements neither `Touch` nor `TouchEvent`, but the library's swipe
 * handling accepts mouse events too (`mousedown` / `mousemove` / `mouseup`) and
 * reads `clientX` / `clientY` straight off them, so a pointer drag exercises the
 * exact same code path as a finger.
 */
function dragEvent(type: string, x: number, y: number): MouseEvent {
  return new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y })
}

/**
 * Drags across an element to trigger a swipe gesture.
 *
 * Defaults to the modal content, which is what `swipeToClose` listens on unless
 * `showSwipeBanner` moves the listener to the banner.
 */
export async function swipe(
  direction: SwipeDirection,
  options: { distance?: number; target?: HTMLElement | null } = {},
): Promise<void> {
  const { distance = 200, target = queryContent() } = options

  if (target === null || target === undefined) {
    throw new Error('No element to swipe on.')
  }

  const delta = SWIPE_DELTAS[direction]
  const start = { x: 150, y: 150 }
  const end = { x: start.x + delta.x * distance, y: start.y + delta.y * distance }

  target.dispatchEvent(dragEvent('mousedown', start.x, start.y))
  target.dispatchEvent(dragEvent('mousemove', end.x, end.y))
  target.dispatchEvent(dragEvent('mouseup', end.x, end.y))
  await flushModal()
}

/** Clicks the standard close button rendered by `ModalBody`. */
export async function closeFromContent(): Promise<void> {
  await clickTeleported('content-close')
}

/**
 * Simulates a click on the modal's backdrop area.
 *
 * The library listens for `mousedown` + `mouseup` on the `.vfm` root with the
 * `.self` modifier, so both events must target the root element itself rather
 * than the content.
 */
export async function clickOutsideContent(): Promise<void> {
  const root = queryRoot()

  if (root === null) {
    throw new Error('No open modal to click outside of.')
  }

  root.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  root.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
  await flushModal()
}

function visibleClientRects(): DOMRectList {
  return [{ width: 10, height: 10 }] as unknown as DOMRectList
}

/**
 * Makes every element look laid out so `tabbable` treats it as visible.
 *
 * `focus-trap` refuses to activate unless it can find a tabbable node, and its
 * default `displayCheck: 'full'` relies on `getClientRects()`. jsdom never
 * computes layout and always returns an empty list, so without this shim the
 * trap throws asynchronously from a timer, which Vitest reports as an unhandled
 * error rather than a test failure. Returns a restore function.
 */
export function stubVisibleRects(): () => void {
  const original = Element.prototype.getClientRects

  Element.prototype.getClientRects = visibleClientRects

  return () => {
    Element.prototype.getClientRects = original
  }
}

/** Dispatches an Escape keydown on the modal root. */
export async function pressEscape(): Promise<void> {
  const root = queryRoot()

  if (root === null) {
    throw new Error('No open modal to send Escape to.')
  }

  root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await flushModal()
}

// Modal markup is teleported to <body>, so it is unreachable through the
// wrapper and must be queried from the document.

export function queryRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.vfm')
}

export function queryAllRoots(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('.vfm')]
}

export function queryOverlay(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.vfm__overlay')
}

export function queryAllOverlays(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('.vfm__overlay')]
}

export function queryContent(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.vfm__content')
}

export function queryAllContents(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('.vfm__content')]
}

export function queryTestId(testId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)
}

/** True when the modal content is present in the DOM and not hidden. */
export function isContentVisible(): boolean {
  const content = queryContent()

  if (content === null) {
    return false
  }

  const root = queryRoot()
  const hiddenByShow = root?.style.display === 'none'
  const hiddenByVisible = root?.style.visibility === 'hidden'

  return !hiddenByShow && !hiddenByVisible
}
