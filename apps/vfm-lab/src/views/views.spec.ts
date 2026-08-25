import { createVfm } from '@lrochefort/vue-final-modal'
import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'

import App from '@/App.vue'
import { buildRoutes } from '@/router'
import { stubVisibleRects } from '@/test/helpers'
import { usedGroups, variants, variantsInGroup } from '@/variants/registry'
import VariantView from '@/views/VariantView.vue'

async function mountApp(
  path: string,
): Promise<{ wrapper: ReturnType<typeof mount>; router: Router }> {
  const router = createRouter({ history: createMemoryHistory(), routes: buildRoutes() })

  await router.push(path)
  await router.isReady()

  const wrapper = mount(App, { global: { plugins: [router, createVfm()] } })

  return { wrapper, router }
}

describe('views', () => {
  // Variants that are open on mount install the real focus trap, which needs
  // visible boxes to find a tabbable node.
  let restoreRects: () => void

  beforeAll(() => {
    restoreRects = stubVisibleRects()
  })

  afterAll(() => {
    restoreRects()
  })

  it('lists every group on the home view', async () => {
    const { wrapper } = await mountApp('/')

    for (const group of usedGroups()) {
      expect(wrapper.get(`[data-testid="group-link-${group}"]`).text()).toBe(group)
      expect(wrapper.get(`[data-testid="group-count-${group}"]`).text()).toBe(
        String(variantsInGroup(group).length),
      )
    }
  })

  it('lists the variants of a group', async () => {
    const { wrapper } = await mountApp('/scroll')

    expect(wrapper.get('[data-testid="group-title"]').text()).toBe('scroll')
    expect(wrapper.findAll('[data-testid="variant-list"] > li')).toHaveLength(
      variantsInGroup('scroll').length,
    )
  })

  it('renders a variant with its metadata and its demo', async () => {
    const { wrapper } = await mountApp('/display/display-if')

    expect(wrapper.get('[data-testid="variant-title"]').text()).toBe('displayDirective: if')
    expect(wrapper.get('[data-testid="variant-description"]').text().length).toBeGreaterThan(0)
    expect(wrapper.find('[data-testid="variant-caveat"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="variant-demo"] [data-testid="trigger"]').exists()).toBe(true)
  })

  it('surfaces the jsdom caveat when a variant has one', async () => {
    const { wrapper } = await mountApp('/scroll/reserve-scroll-bar-gap-enabled')

    expect(wrapper.get('[data-testid="variant-caveat"]').text().length).toBeGreaterThan(0)
  })

  it('mounts every registered variant through its own route', async () => {
    const unrendered: string[] = []

    for (const variant of variants) {
      // Routes are mounted one at a time on purpose: each variant gets a fresh
      // app so plugin state never leaks between them.
      // oxlint-disable-next-line no-await-in-loop
      const { wrapper } = await mountApp(`/${variant.group}/${variant.id}`)

      if (!wrapper.find('[data-testid="variant"]').exists()) {
        unrendered.push(variant.file)
      }

      wrapper.unmount()
    }

    expect(unrendered).toEqual([])
  })

  it('falls back to a placeholder when the registry has no such variant', () => {
    const wrapper = mount(VariantView, { props: { group: 'display', id: 'nope' } })

    expect(wrapper.get('[data-testid="variant-missing"]').text()).toContain('display/nope')
  })
})
