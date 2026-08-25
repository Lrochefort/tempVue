import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryContent, queryRoot } from '@/test/helpers'

import ModalIdProgrammatic from './ModalIdProgrammatic.vue'

const MODAL_ID = 'display-modal-id-programmatic'

describe('display/modal-id-programmatic', () => {
  it('registers itself with the plugin under its modalId', () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)

    expect(vfm.get(MODAL_ID)).toBeDefined()
  })

  it('stays closed until opened programmatically', () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)

    expect(queryRoot()).toBeNull()
    expect(vfm.openedModals).toHaveLength(0)
  })

  it('opens by id without any v-model binding', async () => {
    const { wrapper, vfm } = mountVariant(ModalIdProgrammatic)

    await openVariant(wrapper)

    expect(queryContent()).not.toBeNull()
    expect(vfm.openedModals).toHaveLength(1)
  })

  it('closes by id', async () => {
    const { wrapper, vfm } = mountVariant(ModalIdProgrammatic)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="close"]').trigger('click')
    await flushModal()

    expect(queryRoot()).toBeNull()
    expect(vfm.openedModals).toHaveLength(0)
  })

  it('toggles by id in both directions', async () => {
    const { wrapper } = mountVariant(ModalIdProgrammatic)

    await wrapper.get('[data-testid="toggle"]').trigger('click')
    await flushModal()
    expect(queryRoot()).not.toBeNull()

    await wrapper.get('[data-testid="toggle"]').trigger('click')
    await flushModal()
    expect(queryRoot()).toBeNull()
  })

  it('resolves open() with "opened"', async () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)

    await expect(vfm.open(MODAL_ID)).resolves.toBe('opened')
  })

  it('resolves close() with "closed" once pending callbacks have drained', async () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)
    await vfm.open(MODAL_ID)
    await flushModal()

    await expect(vfm.close(MODAL_ID)).resolves.toBe('closed')
  })

  // FINDING: the modal keeps a single mutable resolver slot that every toggle
  // overwrites. `open()` resolves from the first transition hook to fire, but a
  // second hook still runs afterwards; by then `close()` has installed its own
  // resolver, so that stale callback resolves the close promise with "opened".
  // Net effect: `await open(id)` immediately followed by `await close(id)`
  // reports "opened". Draining pending callbacks first (previous test) avoids it.
  it('resolves close() with a stale "opened" when called straight after open()', async () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)
    await vfm.open(MODAL_ID)

    await expect(vfm.close(MODAL_ID)).resolves.toBe('opened')
  })

  // FINDING: `vfm.open(id)` builds its promise around the modelValue watcher
  // (`toggle` sets the ref, and only the watcher resolves). Re-opening an
  // already-open modal writes the same value, the watcher never fires, and the
  // returned promise never settles. The dynamic `useModal` path handles this by
  // resolving with "modal is already opened", so the two APIs disagree.
  // Awaiting this promise in application code deadlocks.
  it('returns a promise that never settles when re-opening an open modal', async () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)
    await vfm.open(MODAL_ID)

    const outcome = await Promise.race([
      Promise.resolve(vfm.open(MODAL_ID)).then(() => 'settled'),
      new Promise<string>((resolve) => setTimeout(() => resolve('still-pending'), 50)),
    ])

    expect(outcome).toBe('still-pending')
  })

  it('returns a promise that never settles when closing an already-closed modal', async () => {
    const { vfm } = mountVariant(ModalIdProgrammatic)

    const outcome = await Promise.race([
      Promise.resolve(vfm.close(MODAL_ID)).then(() => 'settled'),
      new Promise<string>((resolve) => setTimeout(() => resolve('still-pending'), 50)),
    ])

    expect(outcome).toBe('still-pending')
  })
})
