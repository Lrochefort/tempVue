export type Currency = 'CAD' | 'EUR' | 'USD'

/**
 * Converts arbitrary text into a URL-safe slug.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Restricts `value` to the inclusive `[min, max]` range.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError(`clamp: min (${min}) must not be greater than max (${max})`)
  }
  return Math.min(Math.max(value, min), max)
}

/**
 * Formats a number as a localized currency string.
 */
export function formatCurrency(
  value: number,
  currency: Currency = 'CAD',
  locale = 'en-CA',
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

/**
 * Returns a new array with duplicates removed, preserving first-seen order.
 */
export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)]
}
