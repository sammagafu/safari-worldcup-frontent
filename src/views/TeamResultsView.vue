<script setup>
import { computed, ref } from 'vue'
import { useSquadStore } from '@/stores/squad'
import { useUserStore } from '@/stores/user'
import TeamDisplayView from '@/components/TeamDisplayView.vue'
import { currentGameweek } from '@/data/fixtures'

const squad = useSquadStore()
const user = useUserStore()

const selectedGw = ref(currentGameweek)
const totalPlayers = 12937745
const overallRank = 5828287

const overallPoints = computed(() =>
  squad.picks.length ? squad.totalPoints : user.totalPoints
)
const gameweekPoints = computed(() =>
  squad.picks.length ? squad.gameweekPoints : 0
)

function prevGameweek() {
  if (selectedGw.value > 1) selectedGw.value--
}
function nextGameweek() {
  if (selectedGw.value < 38) selectedGw.value++
}
</script>

<template>
  <div class="container py-4 py-md-5">
    <div class="row g-4">
      <!-- Sidebar: Points & Rankings, My Team Badge, Fan League, My Leagues -->
      <aside class="col-12 col-lg-4 col-xl-3">
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="rounded bg-primary bg-opacity-25 d-flex align-items-center justify-content-center p-2">
                <svg class="text-white" style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <span class="fw-semibold text-white">My Team</span>
            </div>
            <p class="small text-white text-opacity-80 mb-0">Points &amp; results</p>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header bg-transparent border-white border-opacity-10 d-flex justify-content-between align-items-center py-3">
            <h2 class="h6 fw-semibold text-white mb-0">Points &amp; Rankings</h2>
            <router-link to="/squad" class="small text-white text-decoration-none">Gameweek History &gt;</router-link>
          </div>
          <div class="card-body small">
            <div class="mb-2"><span class="text-white text-opacity-70">Overall points:</span> <strong class="text-white">{{ overallPoints.toLocaleString() }}</strong></div>
            <div class="mb-2"><span class="text-white text-opacity-70">Overall rank:</span> <strong class="text-white">{{ overallRank.toLocaleString() }}</strong></div>
            <div class="mb-2"><span class="text-white text-opacity-70">Total players:</span> <strong class="text-white">{{ totalPlayers.toLocaleString() }}</strong></div>
            <div><span class="text-white text-opacity-70">Gameweek points:</span> <strong class="text-white">{{ gameweekPoints }}</strong></div>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header bg-transparent border-white border-opacity-10 d-flex justify-content-between align-items-center py-3">
            <h2 class="h6 fw-semibold text-white mb-0">My Team Badge</h2>
          </div>
          <div class="card-body text-center py-4">
            <div class="rounded-circle border border-white border-opacity-25 d-inline-flex align-items-center justify-content-center mb-2 bg-dark" style="width: 80px; height: 80px;">
              <span class="fs-2 text-white text-opacity-50">+</span>
            </div>
            <p class="small text-white text-opacity-80 mb-2">Generate team badge</p>
            <button type="button" class="btn btn-outline-primary btn-sm">Generate Team Badge &gt;</button>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header bg-transparent border-white border-opacity-10 d-flex justify-content-between align-items-center py-3">
            <h2 class="h6 fw-semibold text-white mb-0">Fan League</h2>
            <span class="small text-white text-decoration-none cursor-pointer">View League &gt;</span>
          </div>
          <div class="card-body d-flex align-items-center gap-3">
            <div class="rounded-circle border border-white border-opacity-25 d-flex align-items-center justify-content-center small fw-bold text-white text-opacity-70" style="width: 48px; height: 48px;">MU</div>
            <span class="small text-white">Safari Fantasy League</span>
          </div>
        </div>

        <div class="card">
          <div class="card-header bg-transparent border-white border-opacity-10 d-flex justify-content-between align-items-center py-3">
            <h2 class="h6 fw-semibold text-white mb-0">My Leagues</h2>
            <router-link to="/join-league" class="small text-white text-decoration-none">Join League &gt;</router-link>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h3 class="small fw-semibold text-uppercase text-white text-opacity-60 mb-2">Broadcaster Leagues</h3>
              <div class="d-flex justify-content-between py-2 border-bottom border-white border-opacity-10">
                <span class="small text-white">SuperSport League</span>
                <span class="small text-danger fw-semibold">726,066</span>
              </div>
            </div>
            <div>
              <h3 class="small fw-semibold text-uppercase text-white text-opacity-60 mb-2">Invitational Classic</h3>
              <ul class="list-unstyled small mb-0">
                <li v-for="(league, i) in ['GGMU', 'Junto', 'PREMIER HEIST', 'Soccer Loverz', 'Wakanda na Vibonde']" :key="i" class="d-flex justify-content-between py-1">
                  <span class="text-white">{{ league }}</span>
                  <span class="text-white text-opacity-70">{{ [37, 4, 29, 18, 7][i] }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main: Gameweek selector, stats bar, team with points -->
      <main class="col-12 col-lg-8 col-xl-9">
        <header class="mb-4">
          <h1 class="h3 fw-bold text-white mb-1">Team results &amp; points</h1>
          <p class="text-white text-opacity-80 small mb-0">View your squad and gameweek point distribution.</p>
        </header>

        <!-- Gameweek selector -->
        <div class="d-flex align-items-center gap-3 mb-3">
          <button type="button" class="btn btn-outline-secondary btn-sm p-2" aria-label="Previous gameweek" @click="prevGameweek">
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 class="h5 fw-bold text-white mb-0">Gameweek {{ selectedGw }}</h2>
          <button type="button" class="btn btn-outline-secondary btn-sm p-2" aria-label="Next gameweek" @click="nextGameweek">
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- Gameweek stats bar -->
        <div class="d-flex flex-wrap align-items-center gap-3 gap-md-4 mb-4 p-3 rounded-2 border border-white border-opacity-10">
          <span class="small"><span class="text-white text-opacity-70">Average points:</span> <strong class="text-white">46</strong></span>
          <span class="small"><span class="text-white text-opacity-70">Highest points:</span> <strong class="text-white">119</strong></span>
          <span class="badge bg-primary px-3 py-2">{{ gameweekPoints }} Latest points</span>
          <span class="small"><span class="text-white text-opacity-70">GW Rank:</span> <strong class="text-white">9,110,365</strong></span>
          <span class="small"><span class="text-white text-opacity-70">Transfers:</span> <strong class="text-white">{{ user.transfersUsed ?? 1 }}</strong></span>
        </div>

        <div class="mb-2">
          <router-link to="/predictions" class="small text-primary text-decoration-none">★ Team of the Week</router-link>
        </div>

        <!-- Team display with gameweek points on each player -->
        <TeamDisplayView
          :picks="squad.picks"
          :team-name="user.teamName || 'My Team'"
          :formation="squad.formation"
          :gameweek-points="gameweekPoints"
          :overall-points="overallPoints"
          :transfers="user.transfersUsed ?? 0"
          :gw-rank="9110365"
          :avg-points="46"
          :highest-points="119"
          :show-gameweek-points="true"
        />

        <p v-if="!squad.picks.length" class="text-white text-opacity-70 small mt-3">
          Build your squad in <router-link to="/squad" class="text-primary">Team creation</router-link> to see results here.
        </p>
      </main>
    </div>
  </div>
</template>
