<script setup>
import { RouterLink } from 'vue-router'
import { useLeagueStore } from '@/stores/league'

const leagueStore = useLeagueStore()
</script>

<template>
  <div>
    <h1 class="font-display text-xl sm:text-display-sm font-bold text-text-primary mb-3">Admin Dashboard</h1>
    <p class="text-text-secondary mb-8">Manage leagues and share codes.</p>

    <section v-if="leagueStore.leagues.length" class="rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden">
      <h2 class="font-display p-5 border-b border-border-subtle font-bold text-text-primary">Your Leagues</h2>
      <ul class="divide-y divide-border-subtle">
        <li
          v-for="league in leagueStore.leagues"
          :key="league.id"
          class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <span class="font-medium text-text-primary">{{ league.name }}</span>
            <span class="text-text-muted text-sm ml-2">{{ league.participants.length }} participants</span>
          </div>
          <RouterLink
            :to="`/admin/leagues/${league.id}/share`"
            class="font-display px-5 py-2.5 rounded-lg text-sm font-bold bg-safari-light-blue text-white hover:opacity-90 transition w-fit"
          >
            Share code
          </RouterLink>
        </li>
      </ul>
    </section>

    <div v-else class="rounded-xl border border-dashed border-border-default p-12 text-center">
      <p class="text-text-muted mb-4">No leagues yet.</p>
      <RouterLink
        to="/admin/leagues/create"
        class="font-display inline-flex px-5 py-2.5 rounded-lg text-sm font-bold bg-safari-light-blue text-white hover:opacity-90 transition"
      >
        Create your first league
      </RouterLink>
    </div>
  </div>
</template>
