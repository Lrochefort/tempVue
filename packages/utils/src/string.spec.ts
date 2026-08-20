import { describe, expect, it } from 'vitest'

import { clamp, formatCurrency, slugify, unique } from './string.ts'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('strips diacritics and punctuation', () => {
    expect(slugify('Éléphant, café!')).toBe('elephant-cafe')
  })

  it('trims leading and trailing separators', () => {
    expect(slugify('  --Vue 3--  ')).toBe('vue-3')
  })
})

describe('clamp', () => {
  it('keeps values inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to the boundaries', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(99, 0, 10)).toBe(10)
  })

  it('rejects an inverted range', () => {
    expect(() => clamp(1, 10, 0)).toThrow(RangeError)
  })
})

describe('formatCurrency', () => {
  it('defaults to CAD/en-CA', () => {
    expect(formatCurrency(1234.5)).toContain('1,234.50')
  })

  it('honours an explicit currency', () => {
    expect(formatCurrency(10, 'USD', 'en-US')).toBe('$10.00')
  })
})

describe('unique', () => {
  it('removes duplicates and preserves order', () => {
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
  })
})
