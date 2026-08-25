import { expect, test as base } from '@playwright/test'

/**
 * Every test in the suite fails if the page logged a console error or threw an
 * uncaught exception — a variant that renders but spews errors is not conformant.
 */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = []

      page.on('pageerror', (error) => {
        errors.push(`pageerror: ${error.message}`)
      })
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errors.push(`console.error: ${message.text()}`)
        }
      })

      await use(errors)

      expect(errors).toEqual([])
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'
