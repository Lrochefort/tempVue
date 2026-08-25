import { describe, expect, it } from 'vitest'

import {
  discoveredVariantFiles,
  findVariant,
  usedGroups,
  variants,
  variantsInGroup,
} from './registry'
import { VARIANT_GROUPS } from './types'

/** Sibling specs, keyed the same way the registry keys its components. */
const specFiles = Object.keys(import.meta.glob('./*/*.spec.ts'))

describe('variants/registry', () => {
  it('registers every discovered variant file', () => {
    expect(variants.map((variant) => variant.file).toSorted()).toEqual(discoveredVariantFiles)
  })

  it('resolves every entry to a component', () => {
    const unresolved = variants.filter((variant) => !variant.component).map((v) => v.file)

    expect(unresolved).toEqual([])
  })

  it('gives every variant a sibling spec file', () => {
    const missing = variants
      .map((variant) => variant.file.replace(/\.vue$/, '.spec.ts'))
      .filter((spec) => !specFiles.includes(spec))

    expect(missing).toEqual([])
  })

  it('keeps ids unique within a group', () => {
    const duplicated = usedGroups().filter((group) => {
      const ids = variantsInGroup(group).map((variant) => variant.id)

      return new Set(ids).size !== ids.length
    })

    expect(duplicated).toEqual([])
  })

  it('populates every declared group', () => {
    expect(usedGroups().toSorted()).toEqual([...VARIANT_GROUPS].toSorted())
  })

  it('gives every variant a title and a description', () => {
    const incomplete = variants
      .filter((variant) => variant.title.length === 0 || variant.description.length === 0)
      .map((variant) => variant.file)

    expect(incomplete).toEqual([])
  })

  it('looks a variant up by group and id', () => {
    const unfindable = variants
      .filter((variant) => findVariant(variant.group, variant.id) !== variant)
      .map((variant) => variant.file)

    expect(unfindable).toEqual([])
    expect(findVariant('display', 'does-not-exist')).toBeUndefined()
  })
})
