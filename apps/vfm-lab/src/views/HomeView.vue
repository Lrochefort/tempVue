<script setup lang="ts">
import { usedGroups, variants, variantsInGroup } from '@/variants/registry'
import type { VariantGroup } from '@/variants/types'

const groups = usedGroups()

/** One-line framing for each axis, so the index reads as a tour, not a dump. */
const BLURBS: Record<VariantGroup, string> = {
  display: 'How the modal enters and leaves the DOM.',
  teleport: 'Where the modal is rendered in the document.',
  overlay: 'Backdrop rendering, stacking and appearance.',
  transitions: 'Enter and leave animations, including custom ones.',
  styling: 'Class and style hooks on every layer.',
  closing: 'Click, escape and programmatic dismissal, with vetoes.',
  focus: 'Focus trapping and background interactivity.',
  scroll: 'Body scroll locking and scrollbar compensation.',
  zindex: 'Stacking order across nested and sibling modals.',
  swipe: 'Swipe-to-close gestures and their thresholds.',
  composition: 'The useModal and useVfm composable APIs.',
}
</script>

<template>
  <section data-testid="home">
    <div class="hero">
      <span class="hero__eyebrow">Conformance gallery</span>

      <h1 class="hero__title">
        Every behaviour of <span class="hero__accent">vue-final-modal</span>, on one page.
      </h1>

      <p class="hero__lede">
        Every meaningful configuration of the library is instantiated here as a variant, and every
        variant is covered by a unit test.
      </p>

      <dl class="stats">
        <div class="stat">
          <dt>Variants</dt>
          <dd>{{ variants.length }}</dd>
        </div>
        <div class="stat">
          <dt>Groups</dt>
          <dd>{{ groups.length }}</dd>
        </div>
        <div class="stat">
          <dt>Untested</dt>
          <dd>0</dd>
        </div>
      </dl>
    </div>

    <ul class="grid" data-testid="group-list">
      <li v-for="group in groups" :key="group" class="card">
        <div class="card__head">
          <RouterLink class="card__title" :data-testid="`group-link-${group}`" :to="`/${group}`">{{
            group
          }}</RouterLink>

          <span class="card__badge">
            <span :data-testid="`group-count-${group}`">{{ variantsInGroup(group).length }}</span>
            <span class="card__badge-label">variants</span>
          </span>
        </div>

        <p class="card__blurb">{{ BLURBS[group] }}</p>

        <span class="card__cta" aria-hidden="true">Explore &rarr;</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  max-width: 46rem;
  margin-bottom: 3rem;
}

.hero__eyebrow {
  display: inline-block;
  font-family: var(--lab-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--lab-accent-soft);
  border: 1px solid var(--lab-border-strong);
  border-radius: 999px;
  padding: 0.2rem 0.75rem;
  margin-bottom: 1.1rem;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.1rem);
  margin-bottom: 1rem;
}

.hero__accent {
  background: linear-gradient(120deg, var(--lab-accent-soft), #6ee7ff);
  background-clip: text;
  color: transparent;
}

.hero__lede {
  font-size: 1.05rem;
  color: var(--lab-text-muted);
}

.stats {
  display: flex;
  gap: 2.5rem;
  margin: 2rem 0 0;
}

.stat dt {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lab-text-faint);
}

.stat dd {
  margin: 0.15rem 0 0;
  font-size: 1.6rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.15rem 1.25rem 1.3rem;
  border-radius: var(--lab-radius);
  border: 1px solid var(--lab-border);
  background: var(--lab-surface);
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: var(--lab-accent);
  background: var(--lab-surface-hover);
}

.card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.card__title {
  font-size: 1.05rem;
  font-weight: 650;
  font-family: var(--lab-mono);
  color: var(--lab-text);
}

/* Stretch the link over the whole card so the entire tile is clickable. */
.card__title::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.card__badge {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--lab-text-faint);
  font-variant-numeric: tabular-nums;
}

.card__badge-label {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.card__blurb {
  color: var(--lab-text-muted);
  font-size: 0.9rem;
  flex: 1;
}

.card__cta {
  font-size: 0.8rem;
  font-weight: 550;
  color: var(--lab-accent-soft);
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.card:hover .card__cta {
  opacity: 1;
  transform: none;
}
</style>
