<script setup>
import { ref, computed, watch } from 'vue'
import { useSquadStore } from '@/stores/squad'
import { useUserStore } from '@/stores/user'
import { mockPlayers, worldCupTeams } from '@/data/players'
import { currentGameweek, gameweekDeadline, mockFixtures, gameweekRange, getSimulatedResult } from '@/data/fixtures'

const squad = useSquadStore()
const user = useUserStore()

const viewMode = ref('pitch') // 'pitch' | 'list'
const positionFilter = ref('')
const teamFilter = ref('')
const sortBy = ref('points') // 'points' | 'price' | 'name'
const searchQuery = ref('')
const gameweek = ref(currentGameweek)
/** When set, user clicked a bench player to substitute in; click a starter of same position to swap. */
const selectedForSub = ref(null) // { playerId, position, slot }
/** When true, user clicked "Make Transfers" and must remove one player then add a replacement (uses 1 transfer). */
const transferMode = ref(false)

const positionLabels = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  FWD: 'Forwards',
}

const playerPool = computed(() => {
  let list = mockPlayers.filter((p) => !squad.picks.some((pick) => pick.player?.id === p.id))
  if (positionFilter.value) list = list.filter((p) => p.position === positionFilter.value)
  if (teamFilter.value) list = list.filter((p) => p.team === teamFilter.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
  if (sortBy.value === 'points') list = [...list].sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
  if (sortBy.value === 'price') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  return list
})

const playersByPosition = computed(() => {
  const groups = { GK: [], DEF: [], MID: [], FWD: [] }
  playerPool.value.forEach((p) => groups[p.position]?.push(p))
  return groups
})

const formationConfig = computed(() => squad.formationConfig)
const slots = computed(() => [
  { key: 'GK', label: 'Goalkeeper', max: 1 },
  { key: 'DEF', label: 'Defenders', max: formationConfig.value.DEF },
  { key: 'MID', label: 'Midfielders', max: formationConfig.value.MID },
  { key: 'FWD', label: 'Forwards', max: formationConfig.value.FWD },
  { key: 'B_GK', label: 'GKP sub', max: 1 },
  { key: 'B_DEF', label: 'DEF sub', max: 1 },
  { key: 'B_MID', label: 'MID sub', max: 1 },
  { key: 'B_FWD', label: 'FWD sub', max: 1 },
])

function addPlayer(player) {
  const slot = squad.suggestedSlot(player)
  if (slot) {
    const used = squad.addPlayer(player, slot)
    if (used && transferMode.value) transferMode.value = false
  }
}

function removePlayer(playerId) {
  squad.removePlayer(playerId)
  if (transferMode.value && squad.picks.length === 14) {
    // Stay in transfer mode; user must pick replacement from list
  }
}

function picksBySlot(slot) {
  return squad.picks.filter((p) => p.slot === slot)
}

function resetFilters() {
  searchQuery.value = ''
  positionFilter.value = ''
  teamFilter.value = ''
  sortBy.value = 'points'
}

function clearSquad() {
  squad.clear()
  user.resetForDemo()
  selectedForSub.value = null
}

function startSubstitute(pick) {
  if (squad.locked || !pick?.player) return
  selectedForSub.value = { playerId: pick.player.id, position: pick.player.position, slot: pick.slot }
}

function confirmSubstitute(starterPick) {
  if (!selectedForSub.value || !starterPick?.player) return
  if (BENCH_SLOTS.includes(starterPick.slot)) return
  const ok = squad.substitute(selectedForSub.value.playerId, starterPick.player.id)
  if (ok) selectedForSub.value = null
}

function cancelSubstitute() {
  selectedForSub.value = null
}

function doAutoPick() {
  squad.autoPick(mockPlayers)
}

function confirmTransfers() {
  if (squad.picks.length === 15 && !transferMode.value) {
    transferMode.value = true
    return
  }
  if (squad.picks.length === 15) transferMode.value = false
}

function cancelTransferMode() {
  transferMode.value = false
}

/** Players in a fixture (home + away team) for MOTM and simulated result */
const playersInFixture = (homeTeam, awayTeam) => {
  return mockPlayers.filter((p) => p.team === homeTeam || p.team === awayTeam)
}

const simulatedResultsByFixture = computed(() => {
  const out = {}
  mockFixtures.forEach((fix) => {
    const players = playersInFixture(fix.home, fix.away)
    const ids = players.map((p) => p.id)
    out[fix.id] = getSimulatedResult(fix.id, ids)
  })
  return out
})

function scoreCorrect(fix) {
  const pred = squad.scorePredictions[fix.id]
  const res = simulatedResultsByFixture.value[fix.id]
  return pred && res && pred.home === res.homeScore && pred.away === res.awayScore
}

function motmCorrect(fix) {
  const pred = squad.fixtureMotm[fix.id]
  const res = simulatedResultsByFixture.value[fix.id]
  return pred && res && pred === res.motmPlayerId
}

function setScorePart(fixtureId, part, ev) {
  const v = +(ev.target?.value) || 0
  const cur = squad.scorePredictions[fixtureId] || { home: 0, away: 0 }
  squad.setScorePrediction(fixtureId, part === 'home' ? v : cur.home, part === 'away' ? v : cur.away)
}

const BENCH_SLOTS = ['B_GK', 'B_DEF', 'B_MID', 'B_FWD']

// Pitch formation rows: GK, DEF, MID, FWD (counts from selected formation)
const pitchRows = computed(() => {
  const cfg = formationConfig.value
  return [
    { slot: 'GK', picks: picksBySlot('GK'), max: cfg.GK },
    { slot: 'DEF', picks: picksBySlot('DEF'), max: cfg.DEF },
    { slot: 'MID', picks: picksBySlot('MID'), max: cfg.MID },
    { slot: 'FWD', picks: picksBySlot('FWD'), max: cfg.FWD },
  ]
})
// Bench: one substitute per position (GKP, DEF, MID, FWD)
const benchRows = [
  { slot: 'B_GK', label: 'GKP sub' },
  { slot: 'B_DEF', label: 'DEF sub' },
  { slot: 'B_MID', label: 'MID sub' },
  { slot: 'B_FWD', label: 'FWD sub' },
]

// Simulated points summary
const overallRank = 5828287
const totalPlayers = 12937745

function formatPrice(price) {
  const n = Number(price)
  return n % 1 === 0 ? `${n}M` : `${n.toFixed(1)}M`
}

// Sync user total points from squad when we have a full squad (for nav & leaderboard)
watch(() => squad.picks.length, (len) => {
  if (len === 15) user.$patch({ totalPoints: squad.totalPoints })
}, { immediate: true })
</script>

<template>
  <div class="w-full bg-transparent px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
    <div class="fantasy-panel w-full min-h-screen py-5 px-4 sm:py-6 sm:px-5 md:py-8 md:px-6 rounded-lg sm:rounded-xl overflow-hidden">
      <!-- Points & rankings summary (top) - mobile first -->
      <section class="mb-5 sm:mb-8 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-[var(--fp-border)]" style="background: var(--fp-bg-elevated);">
        <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 class="fp-heading text-base sm:text-lg">Points &amp; rankings</h2>
          <div class="flex flex-wrap gap-5 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <div>
              <span class="fp-subheading">Overall points: </span>
              <strong class="text-white">{{ (squad.picks.length ? squad.totalPoints : user.totalPoints).toLocaleString() }}</strong>
            </div>
            <div>
              <span class="fp-subheading">Overall rank: </span>
              <strong class="text-white">{{ overallRank.toLocaleString() }}</strong>
            </div>
            <div>
              <span class="fp-subheading">Total players: </span>
              <strong class="text-white">{{ totalPlayers.toLocaleString() }}</strong>
            </div>
            <div>
              <span class="fp-subheading">Gameweek points: </span>
              <strong class="text-[var(--fp-blue)]">{{ squad.picks.length ? squad.gameweekPoints : 0 }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Transfers: two columns — 1/3 player list, 2/3 squad pitch (stack on mobile) -->
        <section class="rounded-lg sm:rounded-xl border border-[var(--fp-border)] overflow-hidden flex flex-col lg:flex-row" style="background: var(--fp-bg-elevated);">
          <!-- Left 1/3: filterable player list -->
          <aside class="w-full lg:w-1/3 flex flex-col border-b border-[var(--fp-border)] lg:border-b-0 lg:border-r border-[var(--fp-border)] min-h-0 max-h-45vh lg:max-h-none">
            <div class="p-4 sm:p-5 border-b border-[var(--fp-border)] shrink-0">
              <h2 class="fp-heading text-base sm:text-lg mb-1">Players</h2>
              <p class="fp-subheading text-xs sm:text-sm">Filter by position and add to your squad.</p>
            </div>
            <div class="p-3 sm:p-4 space-y-3 border-b border-[var(--fp-border)] shrink-0">
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fp-text-muted)] pointer-events-none">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="fp-input w-full pl-9 pr-3 py-2.5 sm:py-1.5 text-sm min-h-11 sm:min-h-0"
                  placeholder="Search by name"
                />
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <select v-model="positionFilter" class="fp-select text-xs sm:text-sm py-2 sm:py-1.5 pr-6 flex-1 min-w-0 min-h-11 sm:min-h-0">
                  <option value="">All positions</option>
                  <option value="GK">Goalkeepers</option>
                  <option value="DEF">Defenders</option>
                  <option value="MID">Midfielders</option>
                  <option value="FWD">Forwards</option>
                </select>
                <select v-model="teamFilter" class="fp-select text-xs sm:text-sm py-2 sm:py-1.5 pr-6 flex-1 min-w-0 min-h-11 sm:min-h-0" title="Filter by national team">
                  <option value="">All teams</option>
                  <option v-for="team in worldCupTeams" :key="team" :value="team">{{ team }}</option>
                </select>
                <select v-model="sortBy" class="fp-select text-xs sm:text-sm py-2 sm:py-1.5 pr-6 min-h-11 sm:min-h-0">
                  <option value="points">Points</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                </select>
                <button
                  type="button"
                  class="px-3 py-2.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-[var(--fp-border)] text-[var(--fp-text-secondary)] hover:bg-[var(--fp-bg-surface)] hover:text-white min-h-11 sm:min-h-0"
                  @click="resetFilters"
                >
                  Reset
                </button>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[var(--fp-text-muted)]">{{ playerPool.length }} players</span>
                <span class="font-medium text-white">{{ formatPrice(user.remainingBudget) }} budget</span>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto min-h-44 max-h-40vh lg:max-h-60vh">
              <template v-for="posKey in ['GK', 'DEF', 'MID', 'FWD']" :key="posKey">
                <div v-if="playersByPosition[posKey]?.length" class="p-3 border-b border-[var(--fp-border)]">
                  <h3 class="text-2.5xs font-semibold uppercase tracking-wide text-[var(--fp-text-muted)] mb-2">
                    {{ positionLabels[posKey] }}
                  </h3>
                  <ul class="space-y-1">
                    <li
                      v-for="player in playersByPosition[posKey]"
                      :key="player.id"
                      class="flex items-center gap-2 py-3 sm:py-2 px-3 rounded-lg hover:bg-[var(--fp-bg-surface)] transition text-sm min-h-13 sm:min-h-0"
                    >
                      <div class="w-8 h-8 sm:w-7 sm:h-7 rounded shrink-0 flex items-center justify-center text-xs font-bold text-[var(--fp-text-muted)] border border-[var(--fp-border)]" style="background: var(--fp-bg-surface);" :title="`Jersey ${player.jerseyNumber ?? '—'}`">{{ player.jerseyNumber ?? '—' }}</div>
                      <div class="min-w-0 flex-1">
                        <div class="font-medium text-white truncate text-xs">{{ player.name }}</div>
                        <div class="text-2.5xs text-[var(--fp-text-muted)]">{{ player.position }} · No. {{ player.jerseyNumber ?? '—' }} <span class="opacity-75">· {{ player.team }}</span></div>
                      </div>
                      <span class="text-2.5xs text-[var(--fp-text-secondary)] shrink-0" title="Price for budget">{{ formatPrice(player.price) }}</span>
                      <span class="text-2.5xs font-semibold text-[var(--fp-blue)] shrink-0 text-right" title="Points earned">{{ player.points ?? 0 }} pts</span>
                      <button
                        v-if="squad.suggestedSlot(player) && player.price <= user.remainingBudget"
                        type="button"
                        class="size-10 sm:size-7 rounded-lg flex items-center justify-center text-lg sm:text-sm font-bold text-green-400 hover:bg-green-400/20 active:scale-95 transition shrink-0 touch-manipulation"
                        aria-label="Add to squad"
                        @click="addPlayer(player)"
                      >
                        +
                      </button>
                      <button
                        v-else-if="squad.picks.some((p) => p.player?.id === player.id)"
                        type="button"
                        class="size-10 sm:size-7 rounded-lg flex items-center justify-center text-base sm:text-xs font-bold text-[var(--fp-red)] hover:bg-[var(--fp-red)]/20 active:scale-95 transition shrink-0 touch-manipulation"
                        aria-label="Remove from squad"
                        @click="removePlayer(player.id)"
                      >
                        ×
                      </button>
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </aside>

          <!-- Right 2/3: squad in pitch layout with positions -->
          <div class="w-full lg:w-2/3 flex flex-col min-h-0">
            <div class="p-3 sm:p-4 border-b border-[var(--fp-border)] flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div class="min-w-0">
                <h2 class="fp-heading text-base sm:text-lg mb-0.5">Your squad</h2>
                <p class="fp-subheading text-xs sm:text-sm truncate">Formation: <strong class="text-white">{{ squad.formation }}</strong> · GW{{ gameweek }} · {{ gameweekDeadline }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  class="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition min-h-11 sm:min-h-0 touch-manipulation"
                  :class="viewMode === 'pitch' ? 'fp-pill' : 'bg-[var(--fp-bg-surface)] text-[var(--fp-text-secondary)] hover:text-white border border-[var(--fp-border)]'"
                  @click="viewMode = 'pitch'"
                >
                  Pitch
                </button>
                <button
                  type="button"
                  class="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition min-h-11 sm:min-h-0 touch-manipulation"
                  :class="viewMode === 'list' ? 'fp-pill' : 'bg-[var(--fp-bg-surface)] text-[var(--fp-text-secondary)] hover:text-white border border-[var(--fp-border)]'"
                  @click="viewMode = 'list'"
                >
                  List
                </button>
              </div>
            </div>
            <div class="px-3 sm:px-4 pb-2 flex flex-wrap gap-3 sm:gap-4 text-xs">
              <span><span class="text-[var(--fp-text-muted)]">Players:</span> <strong class="text-white">{{ squad.picks.length }} / 15</strong></span>
              <span><span class="text-[var(--fp-text-muted)]">Budget:</span> <strong class="text-white">{{ formatPrice(user.remainingBudget) }}</strong></span>
              <span><span class="text-[var(--fp-text-muted)]">Free transfers:</span> <strong class="text-white">{{ user.freeTransfersThisWeek }}</strong></span>
              <span class="fp-pill text-2.5xs">Wildcard</span>
              <span class="fp-pill text-2.5xs">Free Hit</span>
            </div>

            <!-- Pitch View -->
            <div v-show="viewMode === 'pitch'" class="p-3 sm:p-4 overflow-x-auto">
              <p
                v-if="selectedForSub"
                class="mb-3 text-sm text-[var(--fp-blue)]"
              >
                Click a starting player to swap with {{ squad.picks.find(p => p.player?.id === selectedForSub.playerId)?.player?.name }} (formation may change).
              </p>
              <div class="fantasy-pitch">
                <div class="fantasy-pitch-lines" aria-hidden="true" />
                <div class="relative grid gap-2 sm:gap-3 py-3 sm:py-4">
                  <div v-for="row in pitchRows" :key="row.slot" class="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
                    <div
                      v-for="pick in row.picks"
                      :key="pick.player?.id"
                      class="fantasy-player-card relative"
                      :class="{ 'ring-2 ring-[var(--fp-blue)] cursor-pointer': selectedForSub }"
                      @click="selectedForSub ? confirmSubstitute(pick) : null"
                    >
                      <button
                        v-if="!squad.locked && !selectedForSub"
                        type="button"
                        class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--fp-red)] text-white flex items-center justify-center text-xs hover:opacity-90"
                        aria-label="Remove"
                        @click.stop="removePlayer(pick.player?.id)"
                      >
                        ×
                      </button>
                      <div class="jersey" title="Jersey number">No. {{ pick.player?.jerseyNumber ?? '—' }}</div>
                      <div class="name">{{ pick.player?.name }}</div>
                      <div class="meta">{{ pick.player?.position }}</div>
                      <div class="price text-2.5xs">{{ formatPrice(pick.player?.price) }}</div>
                      <div class="points text-2.5xs">{{ pick.player?.points ?? 0 }} pts</div>
                    </div>
                    <div
                      v-for="i in row.max - row.picks.length"
                      :key="`empty-${row.slot}-${i}`"
                      class="fantasy-player-card opacity-50 border-dashed"
                    >
                      <div class="jersey">—</div>
                      <div class="name text-[var(--fp-text-muted)]">Empty</div>
                      <div class="meta text-[var(--fp-text-muted)] text-2.5xs">—</div>
                    </div>
                  </div>
                </div>
                <!-- Bench: one substitute per position -->
                <div class="mt-4 pt-4 border-t border-white/20">
                  <div class="text-xs font-semibold uppercase tracking-wide text-white/70 mb-2">Bench (1 per position)</div>
                  <div class="flex flex-wrap justify-center gap-2 md:gap-3">
                    <template v-for="row in benchRows" :key="row.slot">
                      <div class="flex flex-col items-center gap-1">
                        <span class="text-2.5xs text-[var(--fp-text-muted)]">{{ row.label }}</span>
                        <div
                          v-for="pick in picksBySlot(row.slot)"
                          :key="pick.player?.id"
                          class="fantasy-player-card relative"
                          :class="{ 'ring-2 ring-[var(--fp-blue)]': selectedForSub?.playerId === pick.player?.id }"
                        >
                          <button
                            v-if="!squad.locked && !selectedForSub"
                            type="button"
                            class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--fp-red)] text-white flex items-center justify-center text-xs"
                            @click="removePlayer(pick.player?.id)"
                          >
                            ×
                          </button>
                          <button
                            v-if="!squad.locked"
                            type="button"
                            class="absolute -top-1 -left-1 px-1.5 py-0.5 rounded text-2.5xs font-medium bg-[var(--fp-blue)] text-white hover:opacity-90"
                            title="Substitute into starting XI"
                            @click.stop="selectedForSub?.playerId === pick.player?.id ? cancelSubstitute() : startSubstitute(pick)"
                          >
                            {{ selectedForSub?.playerId === pick.player?.id ? 'Cancel' : 'Sub' }}
                          </button>
                          <div class="jersey text-2.5xs">No. {{ pick.player?.jerseyNumber ?? '—' }}</div>
                          <div class="name text-xs">{{ pick.player?.name }}</div>
                          <div class="meta text-2.5xs text-white/80">{{ pick.player?.position }}</div>
                          <div class="points text-2.5xs">{{ pick.player?.points ?? 0 }} pts</div>
                        </div>
                        <div
                          v-for="i in 1 - picksBySlot(row.slot).length"
                          :key="`bench-empty-${row.slot}-${i}`"
                          class="fantasy-player-card opacity-50 border-dashed min-w-20"
                        >
                          <div class="name text-[var(--fp-text-muted)] text-xs">Empty</div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- List View (compact list of picks by slot) -->
            <div v-show="viewMode === 'list'" class="p-4">
              <div class="space-y-4">
                <div
                  v-for="s in slots"
                  :key="s.key"
                  class="rounded-lg border border-[var(--fp-border)] p-3"
                  style="background: var(--fp-bg-surface);"
                >
                  <div class="text-xs font-semibold uppercase text-[var(--fp-text-muted)] mb-2">{{ s.label }}</div>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="pick in picksBySlot(s.key)"
                      :key="pick.player?.id"
                      class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--fp-border)]"
                      style="background: var(--fp-bg-elevated);"
                    >
                      <span class="text-xs font-semibold text-[var(--fp-text-muted)] w-7" title="Jersey">No. {{ pick.player?.jerseyNumber ?? '—' }}</span>
                      <span class="text-sm font-medium text-white">{{ pick.player?.name }}</span>
                      <span class="text-xs text-[var(--fp-text-muted)]">{{ pick.player?.position }}</span>
                      <span class="text-xs text-[var(--fp-text-muted)]">{{ formatPrice(pick.player?.price) }} · {{ pick.player?.points ?? 0 }} pts</span>
                      <button
                        v-if="!squad.locked"
                        type="button"
                        class="text-[var(--fp-red)] hover:underline text-xs"
                        @click="removePlayer(pick.player?.id)"
                      >
                        Remove
                      </button>
                    </div>
                    <span
                      v-for="i in s.max - picksBySlot(s.key).length"
                      :key="`e-${s.key}-${i}`"
                      class="px-3 py-2 rounded-lg border border-dashed border-[var(--fp-border)] text-xs text-[var(--fp-text-muted)]"
                    >
                      Empty
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-3 sm:p-4 border-t border-[var(--fp-border)] flex flex-col sm:flex-row flex-wrap gap-3 mt-auto shrink-0">
              <button
                type="button"
                class="fp-pill px-4 py-3 sm:py-2 text-sm min-h-12 sm:min-h-0 touch-manipulation w-full sm:w-auto disabled:opacity-50"
                :disabled="squad.locked"
                @click="doAutoPick"
              >
                Auto Pick
              </button>
              <button
                v-if="!squad.locked && squad.picks.length > 0"
                type="button"
                class="px-4 py-3 sm:py-2 rounded-lg text-sm font-medium border border-[var(--fp-border)] text-[var(--fp-text-secondary)] hover:bg-[var(--fp-bg-surface)] hover:text-white transition min-h-12 sm:min-h-0 touch-manipulation w-full sm:w-auto"
                @click="clearSquad"
              >
                Reset
              </button>
              <template v-if="transferMode">
                <p class="text-sm text-[var(--fp-blue)] w-full sm:w-auto order-first sm:order-none">
                  {{ squad.picks.length === 15 ? 'Click a player in your squad to remove, then pick a replacement from the list.' : 'Pick a replacement from the list below.' }}
                </p>
                <button
                  type="button"
                  class="px-4 py-3 sm:py-2 rounded-lg text-sm font-medium border border-[var(--fp-border)] text-[var(--fp-text-secondary)] hover:bg-[var(--fp-bg-surface)] hover:text-white transition min-h-12 sm:min-h-0 touch-manipulation w-full sm:w-auto"
                  @click="cancelTransferMode"
                >
                  Cancel
                </button>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="px-4 py-3 sm:py-2 rounded-lg text-sm font-semibold bg-[var(--fp-red)] text-white hover:opacity-90 active:scale-95 transition min-h-12 sm:min-h-0 touch-manipulation w-full sm:w-auto disabled:opacity-50"
                  :disabled="squad.locked || squad.picks.length !== 15"
                  :title="squad.picks.length === 15 ? 'Remove one player then add a replacement to use 1 transfer' : 'Complete your 15-player squad first'"
                  @click="confirmTransfers"
                >
                  Make Transfers
                </button>
              </template>
            </div>
          </div>
        </section>

        <!-- Fixtures (full width below Transfers) -->
        <section class="rounded-lg sm:rounded-xl border border-[var(--fp-border)] overflow-hidden mt-4 sm:mt-6" style="background: var(--fp-bg-elevated);">
            <div class="p-3 sm:p-4 border-b border-[var(--fp-border)] flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
              <h2 class="fp-heading text-base sm:text-lg">Fixtures</h2>
              <div class="flex items-center gap-2">
                <button type="button" class="size-10 sm:size-8 rounded-lg border border-[var(--fp-border)] flex items-center justify-center text-[var(--fp-text-secondary)] hover:text-white hover:bg-[var(--fp-bg-surface)] touch-manipulation" aria-label="Previous gameweek">←</button>
                <span class="text-xs sm:text-sm font-medium text-white min-w-25 sm:min-w-35 text-center">GW{{ gameweek }} {{ gameweekRange(gameweek) }}</span>
                <button type="button" class="size-10 sm:size-8 rounded-lg border border-[var(--fp-border)] flex items-center justify-center text-[var(--fp-text-secondary)] hover:text-white hover:bg-[var(--fp-bg-surface)] touch-manipulation" aria-label="Next gameweek">→</button>
                <button type="button" class="size-10 sm:size-8 rounded-lg border border-[var(--fp-border)] flex items-center justify-center text-[var(--fp-text-muted)] touch-manipulation" aria-label="Calendar">📅</button>
              </div>
            </div>
            <div class="p-3 sm:p-4">
              <p class="text-xs sm:text-sm text-[var(--fp-text-secondary)] mb-3">Deadline: {{ gameweekDeadline }} <span class="text-[var(--fp-text-muted)] hidden sm:inline">*All times are shown in your local time</span></p>
              <ul class="space-y-4">
                <li
                  v-for="(fix, i) in mockFixtures"
                  :key="fix.id || i"
                  class="py-3 border-b border-[var(--fp-border)] last:border-0"
                >
                  <div class="flex flex-wrap items-center gap-2 text-sm mb-2">
                    <span class="text-[var(--fp-text-muted)] shrink-0">{{ fix.date }}</span>
                    <span class="text-white">{{ fix.home }} <span class="text-[var(--fp-text-muted)]">{{ fix.time }}</span> {{ fix.away }}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[var(--fp-text-muted)]">Score:</span>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        class="w-10 sm:w-12 py-1.5 px-1.5 rounded border border-[var(--fp-border)] bg-[var(--fp-bg-surface)] text-white text-center"
                        :value="squad.scorePredictions[fix.id]?.home ?? ''"
                        placeholder="0"
                        @input="setScorePart(fix.id, 'home', $event)"
                      />
                      <span class="text-[var(--fp-text-muted)]">–</span>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        class="w-10 sm:w-12 py-1.5 px-1.5 rounded border border-[var(--fp-border)] bg-[var(--fp-bg-surface)] text-white text-center"
                        :value="squad.scorePredictions[fix.id]?.away ?? ''"
                        placeholder="0"
                        @input="setScorePart(fix.id, 'away', $event)"
                      />
                    </div>
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="text-[var(--fp-text-muted)] shrink-0">MOTM:</span>
                      <select
                        class="max-w-36 py-1.5 pl-2 pr-6 rounded border border-[var(--fp-border)] bg-[var(--fp-bg-surface)] text-white text-xs"
                        :value="squad.fixtureMotm[fix.id] ?? ''"
                        @change="squad.setFixtureMotm(fix.id, $event.target.value || null)"
                      >
                        <option value="">Pick player</option>
                        <option v-for="p in playersInFixture(fix.home, fix.away)" :key="p.id" :value="p.id">{{ p.name }} ({{ p.team }})</option>
                      </select>
                    </div>
                  </div>
                  <div v-if="simulatedResultsByFixture[fix.id]" class="mt-2 flex flex-wrap items-center gap-2 text-2.5xs text-[var(--fp-text-muted)]">
                    <span>Result: <strong class="text-white">{{ simulatedResultsByFixture[fix.id].homeScore }}–{{ simulatedResultsByFixture[fix.id].awayScore }}</strong></span>
                    <span v-if="simulatedResultsByFixture[fix.id].motmPlayerId">
                      MOTM: <strong class="text-white">{{ mockPlayers.find(pl => pl.id === simulatedResultsByFixture[fix.id].motmPlayerId)?.name ?? '—' }}</strong>
                    </span>
                    <span v-if="squad.scorePredictions[fix.id]" :class="scoreCorrect(fix) ? 'text-green-400' : ''">{{ scoreCorrect(fix) ? '✓ Correct score' : '✗ Score' }}</span>
                    <span v-if="squad.fixtureMotm[fix.id]" :class="motmCorrect(fix) ? 'text-green-400' : ''">{{ motmCorrect(fix) ? '✓ MOTM' : '✗ MOTM' }}</span>
                  </div>
                </li>
              </ul>
            </div>
        </section>
    </div>
  </div>
</template>
