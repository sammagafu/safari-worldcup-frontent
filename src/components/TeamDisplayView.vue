<script setup>
import { ref, computed } from 'vue'
import { currentGameweek, gameweekDeadline, mockFixtures } from '@/data/fixtures'
import kitImage from '@/assets/images/kit.png'

const BENCH_SLOTS = ['B_GK', 'B_DEF', 'B_MID', 'B_FWD']
const benchRows = [
  { slot: 'B_GK', label: 'GKP sub' },
  { slot: 'B_DEF', label: 'DEF sub' },
  { slot: 'B_MID', label: 'MID sub' },
  { slot: 'B_FWD', label: 'FWD sub' },
]

const props = defineProps({
  picks: { type: Array, default: () => [] },
  teamName: { type: String, default: 'Team' },
  formation: { type: String, default: '442' },
  gameweekPoints: { type: Number, default: 0 },
  overallPoints: { type: Number, default: 0 },
  transfers: { type: Number, default: 0 },
  gwRank: { type: Number, default: null },
  avgPoints: { type: Number, default: 0 },
  highestPoints: { type: Number, default: 0 },
  /** When true, show gameweek points on each player card (for results view) */
  showGameweekPoints: { type: Boolean, default: false },
})

function playerPoints(pick) {
  if (props.showGameweekPoints) return pick.player?.gameweekPoints ?? 0
  return pick.player?.points ?? 0
}

const viewMode = ref('pitch')

const formationConfig = computed(() => {
  const cfg = { '442': { GK: 1, DEF: 4, MID: 4, FWD: 2 }, '433': { GK: 1, DEF: 4, MID: 3, FWD: 3 }, '352': { GK: 1, DEF: 3, MID: 5, FWD: 2 } }
  return cfg[props.formation] || cfg['442']
})

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

function picksBySlot(slot) {
  return props.picks.filter((p) => p.slot === slot)
}

const pitchRows = computed(() => {
  const cfg = formationConfig.value
  return [
    { slot: 'GK', picks: picksBySlot('GK'), max: cfg.GK },
    { slot: 'DEF', picks: picksBySlot('DEF'), max: cfg.DEF },
    { slot: 'MID', picks: picksBySlot('MID'), max: cfg.MID },
    { slot: 'FWD', picks: picksBySlot('FWD'), max: cfg.FWD },
  ]
})

function formatPrice(price) {
  const n = Number(price)
  return n % 1 === 0 ? `${n}M` : `${n.toFixed(1)}M`
}

function teamAbbr(team) {
  if (!team) return '—'
  const abbrs = { 'United States': 'USA', Mexico: 'MEX', Canada: 'CAN', Argentina: 'ARG', Brazil: 'BRA', France: 'FRA', Germany: 'GER', Spain: 'ESP', England: 'ENG', Portugal: 'POR', Netherlands: 'NED' }
  return abbrs[team] || team.slice(0, 3).toUpperCase()
}

function nextFixtureForTeam(team) {
  if (!team) return ''
  const fix = mockFixtures.find((f) => f.home === team || f.away === team)
  if (!fix) return ''
  const isHome = fix.home === team
  const opp = isHome ? fix.away : fix.home
  return `${teamAbbr(opp)} (${isHome ? 'H' : 'A'})`
}
</script>

<template>
  <div class="fantasy-panel w-full rounded-lg sm:rounded-xl overflow-hidden">
    <!-- Header: team name, Pitch/List toggle, gameweek -->
    <div class="p-4 sm:p-5 border-b border-[var(--fp-border)] flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div class="min-w-0">
        <h2 class="fp-heading text-base sm:text-lg mb-0.5">{{ teamName }}</h2>
        <p class="fp-subheading text-xs sm:text-sm truncate">Formation: <strong class="text-white">{{ formation }}</strong> · GW{{ currentGameweek }} · {{ gameweekDeadline }}</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          class="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition min-h-11 sm:min-h-0 touch-manipulation"
          :class="viewMode === 'pitch' ? 'fp-pill' : 'bg-[var(--fp-bg-surface)] text-[var(--fp-text-secondary)] hover:text-white border border-[var(--fp-border)]'"
          @click="viewMode = 'pitch'"
        >
          Pitch View
        </button>
        <button
          type="button"
          class="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition min-h-11 sm:min-h-0 touch-manipulation"
          :class="viewMode === 'list' ? 'fp-pill' : 'bg-[var(--fp-bg-surface)] text-[var(--fp-text-secondary)] hover:text-white border border-[var(--fp-border)]'"
          @click="viewMode = 'list'"
        >
          List View
        </button>
      </div>
    </div>

    <!-- Gameweek stats bar -->
    <div class="px-3 sm:px-4 py-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs border-b border-[var(--fp-border)]">
      <span><span class="text-[var(--fp-text-muted)]">Avg:</span> <strong class="text-white">{{ avgPoints }}</strong> pts</span>
      <span><span class="text-[var(--fp-text-muted)]">Highest:</span> <strong class="text-white">{{ highestPoints }}</strong></span>
      <span class="fp-pill text-2.5xs">{{ gameweekPoints }} Latest</span>
      <span v-if="gwRank"><span class="text-[var(--fp-text-muted)]">GW Rank:</span> <strong class="text-white">{{ gwRank?.toLocaleString() }}</strong></span>
      <span><span class="text-[var(--fp-text-muted)]">Transfers:</span> <strong class="text-white">{{ transfers }}</strong></span>
    </div>

    <!-- Pitch View -->
    <div v-show="viewMode === 'pitch'" class="p-3 sm:p-4 overflow-x-auto">
      <div class="fantasy-pitch">
        <div class="fantasy-pitch-lines" aria-hidden="true" />
        <div class="relative grid gap-2 sm:gap-3 py-3 sm:py-4">
          <div v-for="row in pitchRows" :key="row.slot" class="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
            <div
              v-for="pick in row.picks"
              :key="pick.player?.id"
              class="fantasy-player-card relative"
            >
              <div
                class="jersey jersey-kit d-flex align-items-center justify-content-center text-white fw-bold"
                :style="{ backgroundImage: `url(${kitImage})` }"
                title="Jersey number"
              >
                <template v-if="showGameweekPoints">{{ playerPoints(pick) }}</template>
                <template v-else>{{ pick.player?.jerseyNumber ?? '—' }}</template>
              </div>
              <div class="name">{{ pick.player?.name }}</div>
              <div class="meta text-2.5xs">{{ teamAbbr(pick.player?.team) }}<template v-if="nextFixtureForTeam(pick.player?.team)"> · {{ nextFixtureForTeam(pick.player?.team) }}</template></div>
              <div v-if="!showGameweekPoints" class="price text-2.5xs">{{ formatPrice(pick.player?.price) }}</div>
              <div class="points text-2.5xs">{{ playerPoints(pick) }} {{ showGameweekPoints ? 'GW pts' : 'pts' }}</div>
              <span v-if="pick.isCaptain" class="absolute -top-0.5 left-1/2 -translate-x-1/2 text-2.5xs font-bold text-amber-400">C</span>
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
        <!-- Bench -->
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
                >
                  <div
                    class="jersey jersey-kit jersey-bench text-2.5xs d-flex align-items-center justify-content-center text-white fw-bold"
                    :style="{ backgroundImage: `url(${kitImage})` }"
                  >
                    <template v-if="showGameweekPoints">{{ playerPoints(pick) }}</template>
                    <template v-else>{{ pick.player?.jerseyNumber ?? '—' }}</template>
                  </div>
                  <div class="name text-xs">{{ pick.player?.name }}</div>
                  <div class="meta text-2.5xs text-white/80">{{ teamAbbr(pick.player?.team) }}<template v-if="nextFixtureForTeam(pick.player?.team)"> · {{ nextFixtureForTeam(pick.player?.team) }}</template></div>
                  <div class="points text-2.5xs">{{ playerPoints(pick) }} {{ showGameweekPoints ? 'GW pts' : 'pts' }}</div>
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

    <!-- List View -->
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
              <span class="text-xs text-[var(--fp-text-muted)]">{{ formatPrice(pick.player?.price) }} · {{ playerPoints(pick) }} {{ showGameweekPoints ? 'GW pts' : 'pts' }}</span>
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
  </div>
</template>

<style scoped>
.jersey-kit {
  background-color: transparent !important;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9);
}
</style>
