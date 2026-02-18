<script setup>
import { onMounted, computed } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { useUserStore } from '@/stores/user'

const leaderboard = useLeaderboardStore()
const user = useUserStore()

onMounted(() => {
  if (leaderboard.national.length === 0) {
    leaderboard.setNational([
      { rank: 1, name: 'Fan One', points: 284, transfers: 2 },
      { rank: 2, name: 'Safari Star', points: 276, transfers: 4 },
      { rank: 3, name: 'World Cup Wizard', points: 268, transfers: 3 },
      { rank: 4, name: 'You', points: user.totalPoints, transfers: user.transfersUsed },
      { rank: 5, name: 'Bar Regular', points: 245, transfers: 6 },
    ])
    leaderboard.setRegional(leaderboard.national.slice(0, 5))
    leaderboard.setBar([
      { rank: 1, name: 'Bar Alpha', avgPoints: 262 },
      { rank: 2, name: 'Bar Beta', avgPoints: 248 },
      { rank: 3, name: 'Bar Gamma', avgPoints: 235 },
    ])
  }
})

const tabs = [
  { id: 'national', label: 'National' },
  { id: 'regional', label: 'Regional' },
  { id: 'bar', label: 'Bar leaderboard' },
]

const columns = computed(() => {
  if (leaderboard.currentView === 'bar') {
    return ['Rank', 'Bar', 'Avg points']
  }
  return ['Rank', 'Manager', 'Points', 'Transfers']
})
</script>

<template>
  <div class="w-full min-w-0 bg-transparent px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
    <header class="mb-8 sm:mb-10">
      <h1 class="text-xl sm:text-display-sm font-bold text-text-primary tracking-tight mb-2">
        Leaderboard
      </h1>
      <p class="text-base text-text-secondary leading-relaxed">
        National, regional, and bar mini-leagues. Tiebreaker: fewer transfers.
      </p>
    </header>

    <section class="mb-8 sm:mb-10" aria-label="Leaderboard tabs">
      <div class="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="px-4 py-2.5 sm:py-2 rounded-lg text-3xs font-medium transition min-h-11 sm:min-h-0 touch-manipulation"
        :class="leaderboard.currentView === t.id
          ? 'bg-safari-dark-blue text-white'
          : 'bg-surface-elevated border border-border-subtle text-text-secondary hover:bg-border-subtle hover:text-text-primary'"
        @click="leaderboard.setCurrentView(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="rounded-lg border border-border-subtle bg-surface-elevated overflow-x-auto">
      <table class="w-full text-left min-w-72">
        <thead>
          <tr class="bg-safari-dark-blue text-white">
            <th
              v-for="col in columns"
              :key="col"
              class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-3xs font-semibold"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="leaderboard.currentView === 'bar'">
            <tr
              v-for="row in leaderboard.current"
              :key="row.rank"
              class="border-t border-border-subtle hover:bg-surface transition"
            >
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-text-primary">{{ row.rank }}</td>
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-text-primary">{{ row.name }}</td>
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-safari-red">{{ row.avgPoints }}</td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="row in leaderboard.current"
              :key="row.rank"
              class="border-t border-border-subtle hover:bg-surface transition"
              :class="{ 'bg-safari-light-blue/5': row.name === 'You' }"
            >
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-text-primary">{{ row.rank }}</td>
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-text-primary">{{ row.name }}</td>
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-safari-red">{{ row.points }}</td>
              <td class="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-text-secondary">{{ row.transfers }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    </section>
  </div>
</template>
