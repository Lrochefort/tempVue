import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, type Router } from 'vue-router'

import { usedGroups, variants } from '@/variants/registry'
import GroupView from '@/views/GroupView.vue'
import HomeView from '@/views/HomeView.vue'
import VariantView from '@/views/VariantView.vue'

/**
 * Routes are derived from the variant registry, so a new `.vue` file under a
 * group directory is deep-linkable as soon as it is registered.
 */
export function buildRoutes(): RouteRecordRaw[] {
  const groupRoutes: RouteRecordRaw[] = usedGroups().map((group) => ({
    path: `/${group}`,
    name: `group-${group}`,
    component: GroupView,
    props: { group },
  }))

  const variantRoutes: RouteRecordRaw[] = variants.map((variant) => ({
    path: `/${variant.group}/${variant.id}`,
    name: `variant-${variant.group}-${variant.id}`,
    component: VariantView,
    props: { group: variant.group, id: variant.id },
  }))

  return [
    { path: '/', name: 'home', component: HomeView },
    ...groupRoutes,
    ...variantRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
  ]
}

export function createAppRouter(): Router {
  return createRouter({ history: createWebHistory(), routes: buildRoutes() })
}
