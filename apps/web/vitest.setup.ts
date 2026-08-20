import { config } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

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

config.global.stubs = {
  transition: false,
}

beforeEach(() => {
  vi.clearAllMocks()
})
