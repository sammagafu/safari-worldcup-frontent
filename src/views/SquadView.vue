<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useSquadStore } from '@/stores/squad'
import { useUserStore } from '@/stores/user'
import { mockPlayers, worldCupTeams } from '@/data/players'
import { currentGameweek, gameweekDeadline, gameweekRange, mockFixtures } from '@/data/fixtures'
import kitImage from '@/assets/images/kit.png'

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

/** Team abbreviation for display (e.g. "United States" → "USA") */
function teamAbbr(team) {
  if (!team) return '—'
  const abbrs = { 'United States': 'USA', Mexico: 'MEX', Canada: 'CAN', Argentina: 'ARG', Brazil: 'BRA', France: 'FRA', Germany: 'GER', Spain: 'ESP', England: 'ENG', Portugal: 'POR', Netherlands: 'NED' }
  return abbrs[team] || team.slice(0, 3).toUpperCase()
}

/** Next fixture for a team this gameweek (e.g. "MEX (A)") */
function nextFixtureForTeam(team) {
  if (!team) return ''
  const fix = mockFixtures.find((f) => f.home === team || f.away === team)
  if (!fix) return ''
  const isHome = fix.home === team
  const opp = isHome ? fix.away : fix.home
  return `${teamAbbr(opp)} (${isHome ? 'H' : 'A'})`
}

// Sync user total points from squad when we have a full squad (for nav & leaderboard)
watch(() => squad.picks.length, (len) => {
  if (len === 15) user.$patch({ totalPoints: squad.totalPoints })
}, { immediate: true })
</script>

<template>
  <div class="container py-4 py-md-5 overflow-x-hidden">
    <!-- Step 5 — Add players -->
    <div v-if="user.isLoggedIn && user.ageVerified" class="d-flex align-items-center gap-2 mb-4">
      <span class="rounded-circle bg-dark bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 24px; height: 24px;">✓</span>
      <span class="flex-grow-1" style="max-width: 12px; height: 1px; background: rgba(13,11,92,0.3);"></span>
      <span class="rounded-circle bg-dark bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 24px; height: 24px;">✓</span>
      <span class="flex-grow-1" style="max-width: 12px; height: 1px; background: rgba(13,11,92,0.3);"></span>
      <span class="rounded-circle bg-dark bg-opacity-25 text-primary d-flex align-items-center justify-content-center small fw-bold" style="width: 24px; height: 24px;">✓</span>
      <span class="flex-grow-1" style="max-width: 12px; height: 1px; background: rgba(13,11,92,0.3);"></span>
      <span class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center small fw-bold" style="width: 24px; height: 24px;">5</span>
      <span class="small text-white text-opacity-70 ms-2">Step 5 — Add players{{ user.teamName ? ` · ${user.teamName}` : '' }}</span>
    </div>

    <div class="fantasy-panel w-100 rounded-3 overflow-hidden">
      <section class="card border border-white border-opacity-25 overflow-hidden row g-0 flex-column flex-lg-row align-items-stretch squad-section" style="background: var(--fp-bg-elevated);">
        <!-- Left: Player Selection (same height as squad, list scrolls) -->
        <aside class="col-12 col-lg-4 d-flex flex-column border-bottom border-lg-end border-white border-opacity-25 min-h-0 overflow-hidden squad-aside">
          <div class="p-4 border-bottom border-white border-opacity-25">
            <h2 class="fp-heading h5 mb-2">Player Selection</h2>
            <p class="fp-subheading small text-[var(--fp-text-muted)] mb-0">Select a maximum of 3 players from a single team or &apos;Auto Pick&apos; if you&apos;re short on time.</p>
          </div>
          <div class="p-4 border-bottom border-white border-opacity-25">
            <label class="form-label mb-2">Find a player</label>
            <div class="input-group input-group-lg mb-3">
              <span class="input-group-text border-end-0">
                <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input v-model="searchQuery" type="text" class="form-control border-start-0" placeholder="Search by name" />
            </div>
            <div class="d-flex flex-wrap gap-2 align-items-center mb-2">
              <select v-model="positionFilter" class="form-select form-select-sm" style="max-width: 140px;" title="Filter by position">
                <option value="">All players</option>
                <option value="GK">Goalkeepers</option>
                <option value="DEF">Defenders</option>
                <option value="MID">Midfielders</option>
                <option value="FWD">Forwards</option>
              </select>
              <select v-model="teamFilter" class="form-select form-select-sm flex-grow-1" style="max-width: 140px;" title="Filter by team">
                <option value="">All teams</option>
                <option v-for="team in worldCupTeams" :key="team" :value="team">{{ team }}</option>
              </select>
              <select v-model="sortBy" class="form-select form-select-sm flex-grow-1" style="max-width: 140px;">
                <option value="points">Total points</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              <span class="badge bg-primary">{{ formatPrice(user.remainingBudget) }}</span>
              <button type="button" class="btn btn-outline-secondary btn-sm p-2" aria-label="Reset filters" @click="resetFilters">
                <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            <span class="badge bg-primary">{{ playerPool.length }} players shown</span>
          </div>
            <div class="flex-grow-1 overflow-y-auto min-h-0" style="min-height: 120px; -webkit-overflow-scrolling: touch;">
              <template v-for="posKey in ['GK', 'DEF', 'MID', 'FWD']" :key="posKey">
                <div v-if="playersByPosition[posKey]?.length" class="p-4 sm:p-5 py-5 sm:py-6 border-b border-[var(--fp-border)]">
                  <h3 class="text-2.5xs font-semibold uppercase tracking-wide text-[var(--fp-text-muted)] mb-3">
                    {{ positionLabels[posKey] }}
                  </h3>
                  <ul class="space-y-2">
                    <li
                      v-for="player in playersByPosition[posKey]"
                      :key="player.id"
                      class="flex items-center gap-3 py-3.5 sm:py-3 px-4 rounded-lg hover:bg-[var(--fp-bg-surface)] transition text-sm min-h-13 sm:min-h-0"
                    >
                      <div
                        class="jersey-kit-sm shrink-0 flex items-center justify-center text-xs font-bold text-[var(--fp-text-muted)] border border-[var(--fp-border)] rounded"
                        style="background: var(--fp-bg-surface); min-width: 2rem; min-height: 2rem;"
                        :title="`Jersey ${player.jerseyNumber ?? '—'}`"
                      >
                        {{ player.jerseyNumber ?? '—' }}
                      </div>
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

          <!-- Right: Transfers -->
          <div class="col-12 col-lg-8 d-flex flex-column min-h-0">
            <div class="p-4 border-bottom border-white border-opacity-25 d-flex flex-column flex-sm-row flex-wrap align-items-sm-center justify-content-between gap-3">
              <div>
                <h2 class="fp-heading h6 mb-1">Transfers</h2>
                <p class="fp-subheading small text-[var(--fp-text-muted)] mb-0 text-truncate">Select a maximum of 3 players from a single team or &apos;Auto Pick&apos; if you&apos;re short on time. Formation: <strong class="text-white">{{ squad.formation }}</strong></p>
              </div>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn" :class="viewMode === 'pitch' ? 'btn-primary' : 'btn-outline-secondary'" @click="viewMode = 'pitch'">Pitch View</button>
                <button type="button" class="btn" :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'" @click="viewMode = 'list'">List View</button>
              </div>
            </div>
            <div class="p-4 border-bottom border-white border-opacity-25">
              <p class="small text-[var(--fp-text-secondary)] mb-3">Gameweek {{ gameweek }} – Deadline: {{ gameweekDeadline }}</p>
              <div class="d-flex flex-wrap gap-2 mb-4">
                <span class="badge bg-primary bg-opacity-25 text-white border border-primary border-opacity-50">Wildcard Play</span>
                <span class="badge bg-primary bg-opacity-25 text-white border border-primary border-opacity-50">Free Hit Play</span>
                <span class="badge bg-primary bg-opacity-25 text-white border border-primary border-opacity-50">Bench Boost Play</span>
              </div>
              <div class="row g-2 g-sm-3">
                <div class="col-6 col-sm-3">
                  <div class="rounded-2 p-3 bg-primary bg-opacity-25 border border-primary border-opacity-50">
                    <span class="small d-block text-[var(--fp-text-muted)] mb-1">Players</span>
                    <span class="small fw-bold text-white">{{ squad.picks.length }}/15 Selected</span>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="rounded-2 p-3 border border-white border-opacity-25">
                    <span class="small d-block text-[var(--fp-text-muted)] mb-1">Budget</span>
                    <span class="small fw-bold text-success">{{ formatPrice(user.remainingBudget) }}</span>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="rounded-2 p-3 border border-white border-opacity-25">
                    <span class="small d-block text-[var(--fp-text-muted)] mb-1">Free transfers</span>
                    <span class="small fw-bold text-white">{{ user.freeTransfersThisWeek }}</span>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="rounded-2 p-3 border border-white border-opacity-25">
                    <span class="small d-block text-[var(--fp-text-muted)] mb-1">Cost</span>
                    <span class="small fw-bold text-white">0 pts</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pitch View -->
            <div v-show="viewMode === 'pitch'" class="p-5 sm:p-7 py-6 sm:py-8 overflow-x-auto">
              <p
                v-if="selectedForSub"
                class="mb-3 text-sm text-[var(--fp-blue)]"
              >
                Click a starting player to swap with {{ squad.picks.find(p => p.player?.id === selectedForSub.playerId)?.player?.name }} (formation may change).
              </p>
              <div class="fantasy-pitch">
                <div class="fantasy-pitch-lines" aria-hidden="true" />
                <div class="relative grid gap-3 sm:gap-4 py-4 sm:py-6">
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
                      <div
                        class="jersey jersey-kit d-flex align-items-center justify-content-center text-white fw-bold"
                        :style="{ backgroundImage: `url(${kitImage})` }"
                        title="Jersey number"
                      >
                        {{ pick.player?.jerseyNumber ?? '—' }}
                      </div>
                      <div class="name">{{ pick.player?.name }}</div>
                      <div class="meta text-2.5xs">{{ teamAbbr(pick.player?.team) }} <template v-if="nextFixtureForTeam(pick.player?.team)">· {{ nextFixtureForTeam(pick.player?.team) }}</template></div>
                      <div class="price text-2.5xs">{{ formatPrice(pick.player?.price) }}</div>
                      <div class="points text-2.5xs">{{ pick.player?.points ?? 0 }} pts</div>
                    </div>
                    <div
                      v-for="i in row.max - row.picks.length"
                      :key="`empty-${row.slot}-${i}`"
                      class="fantasy-player-card opacity-50 border-dashed"
                    >
                      <div
                        class="jersey jersey-kit jersey-empty d-flex align-items-center justify-content-center text-white text-opacity-50"
                        :style="{ backgroundImage: `url(${kitImage})` }"
                      >—</div>
                      <div class="name text-[var(--fp-text-muted)]">Empty</div>
                      <div class="meta text-[var(--fp-text-muted)] text-2.5xs">—</div>
                    </div>
                  </div>
                </div>
                <!-- Bench: one substitute per position -->
                <div class="mt-5 pt-5 border-t border-white/20">
                  <div class="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">Bench (1 per position)</div>
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
                          <div
                            class="jersey jersey-kit jersey-bench text-2.5xs d-flex align-items-center justify-content-center text-white fw-bold"
                            :style="{ backgroundImage: `url(${kitImage})` }"
                          >
                            {{ pick.player?.jerseyNumber ?? '—' }}
                          </div>
                          <div class="name text-xs">{{ pick.player?.name }}</div>
                          <div class="meta text-2.5xs text-white/80">{{ teamAbbr(pick.player?.team) }} <template v-if="nextFixtureForTeam(pick.player?.team)">· {{ nextFixtureForTeam(pick.player?.team) }}</template></div>
                          <div class="price text-2.5xs">{{ formatPrice(pick.player?.price) }}</div>
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
            <div v-show="viewMode === 'list'" class="p-5 sm:p-6 py-6 sm:py-7">
              <div class="space-y-5">
                <div
                  v-for="s in slots"
                  :key="s.key"
                  class="rounded-lg border border-[var(--fp-border)] p-4 sm:p-5"
                  style="background: var(--fp-bg-surface);"
                >
                  <div class="text-xs font-semibold uppercase text-[var(--fp-text-muted)] mb-3">{{ s.label }}</div>
                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="pick in picksBySlot(s.key)"
                      :key="pick.player?.id"
                      class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--fp-border)]"
                      style="background: var(--fp-bg-elevated);"
                    >
                      <span class="text-xs font-semibold text-[var(--fp-text-muted)]" title="Jersey">No. {{ pick.player?.jerseyNumber ?? '—' }}</span>
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

            <div class="p-4 border-top border-white border-opacity-25 d-flex flex-column flex-sm-row flex-wrap gap-2 gap-sm-3 mt-auto">
              <button type="button" class="btn btn-primary btn-sm order-1" :disabled="squad.locked" @click="doAutoPick">Auto Pick</button>
              <button v-if="!squad.locked && squad.picks.length > 0" type="button" class="btn btn-outline-secondary btn-sm order-2" @click="clearSquad">Reset</button>
              <template v-if="transferMode">
                <p class="small text-primary order-first order-sm-0 w-100 mb-0 me-sm-2">
                  {{ squad.picks.length === 15 ? 'Click a player in your squad to remove, then pick a replacement from the list.' : 'Pick a replacement from the list below.' }}
                </p>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="cancelTransferMode">Cancel</button>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
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

        <!-- Go to my team (when squad is complete) -->
        <section v-if="squad.picks.length === 15" class="mt-4">
          <RouterLink
            to="/my-team"
            class="card border border-primary border-opacity-50 overflow-hidden text-decoration-none d-block"
            style="background: var(--fp-bg-elevated); max-width: 420px;"
          >
            <div class="card-body p-4 d-flex align-items-center justify-content-between gap-3">
              <div>
                <h2 class="h6 fw-bold text-white mb-1">Squad complete</h2>
                <p class="small text-white text-opacity-70 mb-0">View your team results and points</p>
              </div>
              <span class="fw-bold text-primary">Go to my team →</span>
            </div>
          </RouterLink>
        </section>

        <!-- Fixtures -->
        <section class="mt-4 mt-md-5">
          <div class="card border border-white border-opacity-25">
            <div class="card-header bg-transparent border-white border-opacity-10 d-flex align-items-center gap-2 py-3">
              <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h2 class="h6 fw-bold text-white mb-0">Fixtures</h2>
            </div>
            <div class="card-body small">
              <p class="text-white text-opacity-80 mb-2">Gameweek {{ gameweek }} {{ gameweekRange(gameweek) }}</p>
              <p class="text-white text-opacity-70 mb-3">Deadline: {{ gameweekDeadline }}</p>
              <p class="text-white text-opacity-60 mb-3">*All times are shown in your local time</p>
              <div class="d-flex flex-wrap gap-3">
                <div v-for="fix in mockFixtures.slice(0, 3)" :key="fix.id" class="d-flex align-items-center gap-2">
                  <span class="text-white text-opacity-70">{{ fix.date }}</span>
                  <span class="text-white">{{ fix.time }}</span>
                  <span class="text-white fw-medium">{{ fix.home }} v {{ fix.away }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Link to Predictions -->
        <section class="mt-4 mt-md-5 py-2">
          <router-link to="/predictions" class="card border border-white border-opacity-25 text-decoration-none text-white d-block p-4">
            <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div>
                <h2 class="h6 fw-bold text-white mb-1">Score & Man of the Match predictions</h2>
                <p class="small text-white text-opacity-70 mb-0">Predict results for each fixture. Earn bonus points for correct scores and MOTM.</p>
              </div>
              <span class="fw-medium text-nowrap">Make predictions →</span>
            </div>
          </router-link>
        </section>
    </div>
  </div>
</template>

<style scoped>
/* Same height as squad on desktop; list scrolls */
@media (min-width: 992px) {
  .squad-section {
    max-height: 85vh;
  }
  .squad-aside {
    max-height: 85vh;
  }
}
/* On mobile, cap left panel height so list is scrollable */
@media (max-width: 991px) {
  .squad-aside {
    max-height: 70vh;
  }
}
/* Safari kit image – no solid background, kit only */
.jersey-kit {
  background-color: transparent !important;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9);
}
.jersey-kit-sm {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
@media (min-width: 640px) {
  .jersey-kit-sm {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>
