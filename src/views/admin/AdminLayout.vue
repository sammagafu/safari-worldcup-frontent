<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="container mx-auto w-full overflow-x-hidden bg-transparent px-5 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20">
    <nav class="mb-12 flex flex-wrap gap-5 border-b border-border-subtle pb-10">
      <RouterLink
        to="/admin"
        class="font-display px-5 py-2.5 rounded-lg text-sm font-bold transition"
        :class="route.path === '/admin' ? 'bg-safari-light-blue text-white' : 'bg-surface-elevated text-text-secondary hover:text-white hover:bg-surface'"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        to="/admin/leagues/create"
        class="font-display px-5 py-2.5 rounded-lg text-sm font-bold transition"
        :class="route.path === '/admin/leagues/create' ? 'bg-safari-light-blue text-white' : 'bg-surface-elevated text-text-secondary hover:text-white hover:bg-surface'"
      >
        Create League
      </RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
