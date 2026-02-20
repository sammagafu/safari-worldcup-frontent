<script setup>
import { ref, computed } from 'vue'
import { useSquadStore } from '@/stores/squad'
import { mockPlayers } from '@/data/players'
import {
  currentGameweek,
  gameweekDeadline,
  mockFixtures,
  gameweekRange,
  getSimulatedResult,
} from '@/data/fixtures'

const squad = useSquadStore()
const gameweek = ref(currentGameweek)

/** Players in a fixture (home + away team) for MOTM and simulated result */
function playersInFixture(homeTeam, awayTeam) {
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
  squad.setScorePrediction(
    fixtureId,
    part === 'home' ? v : cur.home,
    part === 'away' ? v : cur.away
  )
}

function onMotmChange(fixtureId, ev) {
  const value = ev.target?.value || null
  squad.setFixtureMotm(fixtureId, value)
}

function motmSelectValue(fixtureId) {
  return squad.fixtureMotm[fixtureId] ?? ''
}

function submitMotm(fixtureId) {
  const current = squad.fixtureMotm[fixtureId]
  if (current) squad.setFixtureMotm(fixtureId, current)
}

/** Summary stats for prediction results */
const predictionResultsSummary = computed(() => {
  let correctScores = 0
  let correctMotm = 0
  mockFixtures.forEach((fix) => {
    if (scoreCorrect(fix)) correctScores++
    if (motmCorrect(fix)) correctMotm++
  })
  const totalFixtures = mockFixtures.length
  return { correctScores, correctMotm, totalFixtures }
})

function motmPlayerName(fix) {
  const id = squad.fixtureMotm[fix.id]
  return id ? mockPlayers.find((p) => p.id === id)?.name ?? '—' : '—'
}

function actualMotmName(fix) {
  const res = simulatedResultsByFixture.value[fix.id]
  const id = res?.motmPlayerId
  return id ? mockPlayers.find((p) => p.id === id)?.name ?? '—' : '—'
}

function scrollToWinners() {
  const el = document.getElementById('prediction-winners')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Mock winners (correct score / MOTM leaderboard); "You" row is reactive */
const predictionWinners = computed(() => {
  const summary = predictionResultsSummary.value
  const yourPoints = summary.correctScores * 3 + summary.correctMotm * 5
  return [
    { rank: 1, manager: 'Safari Star', correctScores: 4, correctMotm: 3, points: 28 },
    { rank: 2, manager: 'World Cup Wizard', correctScores: 3, correctMotm: 4, points: 26 },
    { rank: 3, manager: 'Fan One', correctScores: 3, correctMotm: 3, points: 24 },
    { rank: 4, manager: 'You', correctScores: summary.correctScores, correctMotm: summary.correctMotm, points: yourPoints },
    { rank: 5, manager: 'Bar Regular', correctScores: 2, correctMotm: 2, points: 16 },
  ]
})
</script>

<template>
  <div class="container py-4 py-md-5">
    <header class="mb-4 mb-md-5 d-flex flex-column flex-sm-row flex-wrap align-items-start align-items-sm-center justify-content-between gap-3">
      <div>
        <h1 class="h3 fw-bold text-white mb-2">Predictions</h1>
        <p class="text-white text-opacity-80 mb-0">
          Predict the score and Man of the Match for each fixture. Make your picks before the deadline.
        </p>
      </div>
      <a
        href="#prediction-winners"
        class="btn btn-outline-primary btn-sm text-nowrap"
        @click.prevent="scrollToWinners"
      >
        View winners
      </a>
    </header>

    <div class="card border border-white border-opacity-10 overflow-hidden">
      <div class="card-header bg-transparent border-white border-opacity-10 d-flex flex-column flex-sm-row flex-wrap align-items-sm-center justify-content-between gap-2 py-3 px-4">
        <h2 class="h6 fw-bold text-white mb-0">Gameweek {{ gameweek }}</h2>
        <div class="small text-white text-opacity-80">
          <span>{{ gameweekRange(gameweek) }}</span>
          <span class="mx-2">|</span>
          <span>Deadline: {{ gameweekDeadline }}</span>
        </div>
      </div>
      <p class="px-4 py-2 small text-white text-opacity-60 mb-0">All times are shown in your local time</p>

      <ul class="list-group list-group-flush">
        <li
          v-for="(fix, i) in mockFixtures"
          :key="fix.id || i"
          class="list-group-item border-white border-opacity-10 py-4"
        >
          <!-- Fixture header -->
          <div class="mb-3">
            <div class="small text-white text-opacity-60 mb-1">{{ fix.date }} · {{ fix.time }}</div>
            <div class="h5 fw-bold text-white mb-0">
              {{ fix.home }}
              <span class="mx-2 text-white text-opacity-50">v</span>
              {{ fix.away }}
            </div>
          </div>

          <div class="row g-3 g-md-4">
            <!-- Score prediction -->
            <div class="col-12 col-md-6 col-lg-4">
              <label class="form-label small fw-semibold text-white text-opacity-90 mb-2">Score prediction</label>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <div class="d-flex flex-column gap-1">
                  <span class="small text-white text-opacity-70">{{ fix.home }}</span>
                  <input
                    :id="`score-home-${fix.id}`"
                    type="number"
                    min="0"
                    max="9"
                    class="form-control form-control-lg text-center"
                    style="width: 4rem;"
                    :value="squad.scorePredictions[fix.id]?.home ?? ''"
                    placeholder="0"
                    aria-label="Home score"
                    @input="setScorePart(fix.id, 'home', $event)"
                  />
                </div>
                <span class="text-white text-opacity-50 fw-bold align-self-end pb-2">–</span>
                <div class="d-flex flex-column gap-1">
                  <span class="small text-white text-opacity-70">{{ fix.away }}</span>
                  <input
                    :id="`score-away-${fix.id}`"
                    type="number"
                    min="0"
                    max="9"
                    class="form-control form-control-lg text-center"
                    style="width: 4rem;"
                    :value="squad.scorePredictions[fix.id]?.away ?? ''"
                    placeholder="0"
                    aria-label="Away score"
                    @input="setScorePart(fix.id, 'away', $event)"
                  />
                </div>
                <span
                  v-if="squad.scorePredictions[fix.id] && (squad.scorePredictions[fix.id].home !== undefined || squad.scorePredictions[fix.id].away !== undefined)"
                  :class="scoreCorrect(fix) ? 'text-success small fw-medium align-self-end pb-2' : 'text-white text-opacity-50 small align-self-end pb-2'"
                >
                  {{ scoreCorrect(fix) ? '✓ Correct' : '✗' }}
                </span>
              </div>
            </div>

            <!-- Pick MOTM -->
            <div class="col-12 col-md-6 col-lg-5">
              <label :for="`motm-${fix.id}`" class="form-label small fw-semibold text-white text-opacity-90 mb-2">Pick Man of the Match</label>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <select
                  :id="`motm-${fix.id}`"
                  class="form-select flex-grow-1"
                  style="max-width: 18rem; min-width: 12rem;"
                  :value="motmSelectValue(fix.id)"
                  aria-label="Man of the Match"
                  @change="onMotmChange(fix.id, $event)"
                >
                  <option value="">Select player...</option>
                  <option
                    v-for="p in playersInFixture(fix.home, fix.away)"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }} ({{ p.team }})
                  </option>
                </select>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  :disabled="!motmSelectValue(fix.id)"
                  @click="submitMotm(fix.id)"
                >
                  Submit MOTM
                </button>
                <span
                  v-if="squad.fixtureMotm[fix.id]"
                  :class="motmCorrect(fix) ? 'text-success small fw-medium' : 'text-white text-opacity-50 small'"
                >
                  {{ motmCorrect(fix) ? '✓ Correct' : '✗' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Simulated result (demo) -->
          <div
            v-if="simulatedResultsByFixture[fix.id]"
            class="mt-3 pt-3 border-top border-white border-opacity-10 small text-white text-opacity-60"
          >
            <span>
              Result: <strong class="text-white">{{ simulatedResultsByFixture[fix.id].homeScore }}–{{ simulatedResultsByFixture[fix.id].awayScore }}</strong>
            </span>
            <span v-if="simulatedResultsByFixture[fix.id].motmPlayerId" class="ms-2">
              MOTM: <strong class="text-white">{{ mockPlayers.find((pl) => pl.id === simulatedResultsByFixture[fix.id].motmPlayerId)?.name ?? '—' }}</strong>
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Prediction results -->
    <div class="card border border-white border-opacity-10 mt-5 overflow-hidden">
      <div class="card-header bg-transparent border-white border-opacity-10 py-3 px-4">
        <h2 class="h6 fw-bold text-white mb-0">Prediction results</h2>
        <p class="small text-white text-opacity-70 mb-0 mt-1">Your picks vs actual results this gameweek</p>
      </div>
      <div class="card-body p-0">
        <div class="d-flex flex-wrap gap-3 p-4 border-bottom border-white border-opacity-10">
          <div class="rounded-2 border border-white border-opacity-25 px-3 py-2">
            <span class="small text-white text-opacity-70">Correct scores</span>
            <span class="d-block fw-bold text-white">{{ predictionResultsSummary.correctScores }}/{{ predictionResultsSummary.totalFixtures }}</span>
          </div>
          <div class="rounded-2 border border-white border-opacity-25 px-3 py-2">
            <span class="small text-white text-opacity-70">Correct MOTM</span>
            <span class="d-block fw-bold text-white">{{ predictionResultsSummary.correctMotm }}/{{ predictionResultsSummary.totalFixtures }}</span>
          </div>
          <div class="rounded-2 border border-primary border-opacity-50 px-3 py-2 bg-primary bg-opacity-10">
            <span class="small text-white text-opacity-70">Prediction points</span>
            <span class="d-block fw-bold text-primary">{{ predictionResultsSummary.correctScores * 3 + predictionResultsSummary.correctMotm * 5 }} pts</span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th class="border-white border-opacity-10 px-3 py-3 small">Fixture</th>
                <th class="border-white border-opacity-10 px-3 py-3 small">Your score</th>
                <th class="border-white border-opacity-10 px-3 py-3 small">Result</th>
                <th class="border-white border-opacity-10 px-3 py-3 small">Score</th>
                <th class="border-white border-opacity-10 px-3 py-3 small">Your MOTM</th>
                <th class="border-white border-opacity-10 px-3 py-3 small">Actual MOTM</th>
                <th class="border-white border-opacity-10 px-3 py-3 small">MOTM</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fix in mockFixtures" :key="fix.id">
                <td class="px-3 py-3 small text-white">{{ fix.home }} v {{ fix.away }}</td>
                <td class="px-3 py-3 small">
                  {{ (squad.scorePredictions[fix.id]?.home ?? '—') }}–{{ (squad.scorePredictions[fix.id]?.away ?? '—') }}
                </td>
                <td class="px-3 py-3 small text-white">
                  <template v-if="simulatedResultsByFixture[fix.id]">
                    {{ simulatedResultsByFixture[fix.id].homeScore }}–{{ simulatedResultsByFixture[fix.id].awayScore }}
                  </template>
                  <span v-else>—</span>
                </td>
                <td class="px-3 py-3 small">
                  <span v-if="squad.scorePredictions[fix.id] && simulatedResultsByFixture[fix.id]" :class="scoreCorrect(fix) ? 'text-success' : 'text-white text-opacity-50'">
                    {{ scoreCorrect(fix) ? '✓' : '✗' }}
                  </span>
                  <span v-else class="text-white text-opacity-50">—</span>
                </td>
                <td class="px-3 py-3 small text-white text-opacity-90">{{ motmPlayerName(fix) }}</td>
                <td class="px-3 py-3 small text-white text-opacity-90">{{ actualMotmName(fix) }}</td>
                <td class="px-3 py-3 small">
                  <span v-if="squad.fixtureMotm[fix.id] && simulatedResultsByFixture[fix.id]" :class="motmCorrect(fix) ? 'text-success' : 'text-white text-opacity-50'">
                    {{ motmCorrect(fix) ? '✓' : '✗' }}
                  </span>
                  <span v-else class="text-white text-opacity-50">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Winners table -->
    <div id="prediction-winners" class="card border border-white border-opacity-10 mt-4 overflow-hidden">
      <div class="card-header bg-transparent border-white border-opacity-10 py-3 px-4">
        <h2 class="h6 fw-bold text-white mb-0">Prediction winners</h2>
        <p class="small text-white text-opacity-70 mb-0 mt-1">Top predictors by correct scores &amp; MOTM (Gameweek {{ gameweek }})</p>
      </div>
      <div class="table-responsive">
        <table class="table table-dark table-hover mb-0">
          <thead>
            <tr>
              <th class="border-white border-opacity-10 px-3 py-3 small">Rank</th>
              <th class="border-white border-opacity-10 px-3 py-3 small">Manager</th>
              <th class="border-white border-opacity-10 px-3 py-3 small">Correct scores</th>
              <th class="border-white border-opacity-10 px-3 py-3 small">Correct MOTM</th>
              <th class="border-white border-opacity-10 px-3 py-3 small">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="w in predictionWinners"
              :key="w.rank"
              :class="{ 'bg-primary bg-opacity-15': w.manager === 'You' }"
            >
              <td class="px-3 py-3 small fw-medium text-white">{{ w.rank }}</td>
              <td class="px-3 py-3 small fw-medium text-white">{{ w.manager }}</td>
              <td class="px-3 py-3 small text-white">{{ w.correctScores }}</td>
              <td class="px-3 py-3 small text-white">{{ w.correctMotm }}</td>
              <td class="px-3 py-3 small fw-semibold text-danger">{{ w.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
