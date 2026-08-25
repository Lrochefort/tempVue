import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * The registry (`src/variants/registry.ts`) cannot be imported here: it relies
 * on `import.meta.glob`, which only exists under Vite. The same source of truth
 * — the files on disk — is enumerated with `fs` instead, using the identical
 * kebab-case id derivation. `conformance.e2e.ts` cross-checks the result
 * against the live gallery so the two views cannot drift silently.
 */
const VARIANTS_DIR = fileURLToPath(new URL('../../src/variants/', import.meta.url))

export interface VariantRef {
  group: string
  id: string
  route: string
}

/** Mirrors `toKebabCase` in src/variants/registry.ts. */
function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function allVariants(): VariantRef[] {
  const refs: VariantRef[] = []

  for (const entry of readdirSync(VARIANTS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    for (const file of readdirSync(`${VARIANTS_DIR}/${entry.name}`)) {
      if (!file.endsWith('.vue')) continue
      const id = toKebabCase(file.replace(/\.vue$/, ''))
      refs.push({ group: entry.name, id, route: `/${entry.name}/${id}` })
    }
  }

  return refs.toSorted((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id))
}

export function variantsInGroup(group: string): VariantRef[] {
  return allVariants().filter((v) => v.group === group)
}
