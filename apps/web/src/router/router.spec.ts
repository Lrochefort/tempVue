import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { routes } from './index.ts'

function makeRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}

describe('router', () => {
  it('resolves the home route', async () => {
    const router = makeRouter()
    await router.push('/')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('resolves the about route', async () => {
    const router = makeRouter()
    await router.push('/about')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('about')
  })

  it('falls back to the not-found route', async () => {
    const router = makeRouter()
    await router.push('/does/not/exist')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
