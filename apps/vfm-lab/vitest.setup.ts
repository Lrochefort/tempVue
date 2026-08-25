import { config, enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom does not implement matchMedia, which VueUse and CSS-driven components use.
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn<(query: string) => MediaQueryList>().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn<() => void>(),
    removeListener: vi.fn<() => void>(),
    addEventListener: vi.fn<() => void>(),
    removeEventListener: vi.fn<() => void>(),
    dispatchEvent: vi.fn<() => boolean>(),
  })) as unknown as typeof globalThis.matchMedia,
})

// jsdom has no layout engine, so ResizeObserver is missing.
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: class {
    observe = vi.fn<() => void>()
    unobserve = vi.fn<() => void>()
    disconnect = vi.fn<() => void>()
  },
})

// jsdom's requestAnimationFrame is driven by a ~16ms timer. Vue's <Transition>
// uses a double-rAF (`nextFrame`) before resolving enter hooks, so every modal
// open would cost ~32ms of real time. Routing rAF through a 0ms timer keeps the
// async ordering identical while making the suite fast and deterministic.
Object.defineProperty(globalThis, 'requestAnimationFrame', {
  writable: true,
  value: (cb: FrameRequestCallback): number =>
    setTimeout(() => cb(performance.now()), 0) as unknown as number,
})

Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  writable: true,
  value: (handle: number): void => clearTimeout(handle),
})

// Render real <Transition> components rather than stubbing them: vue-final-modal
// emits `opened` / `closed` from transition hooks, so stubbing them out would
// silently break the lifecycle assertions.
config.global.stubs = {
  transition: false,
}

enableAutoUnmount(afterEach)

beforeEach(() => {
  vi.clearAllMocks()
})

// Modal content is teleported to <body>, which lives outside any wrapper and is
// therefore not cleaned up by unmounting alone.
afterEach(() => {
  document.body.innerHTML = ''
})
