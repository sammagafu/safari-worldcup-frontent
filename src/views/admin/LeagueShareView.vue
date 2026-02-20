<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useLeagueStore } from '@/stores/league'

const route = useRoute()
const leagueStore = useLeagueStore()

const leagueId = computed(() => route.params.id)
const league = computed(() => leagueStore.leagueById(leagueId.value))

function copyCode() {
  if (!league.value) return
  navigator.clipboard?.writeText(league.value.shareCode).catch(() => {})
}
</script>

<template>
  <div v-if="league">
    <RouterLink to="/admin" class="text-sm text-white hover:underline mb-6 inline-block">← Back to dashboard</RouterLink>
    <h1 class="font-display text-xl sm:text-display-sm font-bold text-text-primary mb-3">Share League</h1>
    <p class="text-text-secondary mb-8">Share this code with participants to join <strong>{{ league.name }}</strong>.</p>

    <div class="max-w-lg rounded-xl border border-border-subtle bg-surface-elevated p-7 sm:p-9">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div class="flex-1 rounded-lg bg-surface border border-border-default py-4 px-5 text-center">
          <span class="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-white">{{ league.shareCode }}</span>
        </div>
        <button
          type="button"
          class="font-display py-3 px-6 rounded-lg text-sm font-bold bg-safari-light-blue text-white hover:opacity-90 transition shrink-0"
          @click="copyCode"
        >
          Copy code
        </button>
      </div>
      <p class="mt-4 text-sm text-text-muted">
        Participants enter this code when joining a league to receive your invite.
      </p>
      <p class="mt-2 text-xs text-text-muted">
        When they win Man of the Match or a correct score prediction, they'll be notified via SMS if they've added their phone number.
      </p>
    </div>
  </div>
  <div v-else>
    <p class="text-text-muted">League not found.</p>
    <RouterLink to="/admin" class="text-white hover:underline mt-4 inline-block">Back to dashboard</RouterLink>
  </div>
</template>
