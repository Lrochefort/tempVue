import type { Component } from 'vue'

/**
 * Axes along which vue-final-modal's behaviour is exercised. Each group maps to a
 * directory under `src/variants/` and to a route segment in the gallery.
 */
export const VARIANT_GROUPS = [
  'display',
  'teleport',
  'overlay',
  'transitions',
  'styling',
  'closing',
  'focus',
  'scroll',
  'zindex',
  'swipe',
  'composition',
] as const

export type VariantGroup = (typeof VARIANT_GROUPS)[number]

export interface VariantMeta {
  title: string
  description: string
  /**
   * Set when jsdom cannot reproduce the real behaviour, so unit tests can only
   * assert that configuration reaches the DOM. Phase 2 (e2e) owns the rest.
   */
  jsdomCaveat?: string
}

export interface Variant extends VariantMeta {
  /** Kebab-case, derived from the filename. Unique within a group. */
  id: string
  group: VariantGroup
  /** Glob key, e.g. `./display/DisplayIf.vue`. */
  file: string
  component: Component
}

export function isVariantGroup(value: string): value is VariantGroup {
  return (VARIANT_GROUPS as readonly string[]).includes(value)
}
