import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { variants } from '@/variants/registry'
import { VARIANT_GROUPS } from '@/variants/types'

import { buildRoutes } from './index'

function memoryRouter() {
  return createRouter({ history: createMemoryHistory(), routes: buildRoutes() })
}

describe('router', () => {
  it('generates one route per group and per variant', () => {
    const paths = buildRoutes().map((route) => route.path)

    expect(paths).toContain('/')

    for (const group of VARIANT_GROUPS) {
      expect(paths).toContain(`/${group}`)
    }

    for (const variant of variants) {
      expect(paths).toContain(`/${variant.group}/${variant.id}`)
    }

    expect(paths).toHaveLength(2 + VARIANT_GROUPS.length + variants.length)
  })

  it('deep-links straight to a variant with its props resolved', async () => {
    const router = memoryRouter()

    await router.push('/display/display-if')

    expect(router.currentRoute.value.name).toBe('variant-display-display-if')
    expect(router.currentRoute.value.matched[0]?.props['default']).toEqual({
      group: 'display',
      id: 'display-if',
    })
  })

  it('passes the group down to the group view', async () => {
    const router = memoryRouter()

    await router.push('/swipe')

    expect(router.currentRoute.value.matched[0]?.props['default']).toEqual({ group: 'swipe' })
  })

  it('redirects unknown paths home', async () => {
    const router = memoryRouter()

    await router.push('/display/not-a-variant')

    expect(router.currentRoute.value.name).toBe('home')
  })
})
