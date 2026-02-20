<script setup>
import { onMounted, computed } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { useUserStore } from '@/stores/user'
import { useSquadStore } from '@/stores/squad'
import TeamDisplayView from '@/components/TeamDisplayView.vue'
import { getMockTeamForManager } from '@/utils/mockTeam'

const leaderboard = useLeaderboardStore()
const user = useUserStore()
const squad = useSquadStore()

onMounted(() => {
  if (leaderboard.national.length === 0) {
    leaderboard.setNational([
      { id: 'm1', teamName: 'Fan One', name: 'Fan One', points: 284, transfers: 2 },
      { id: 'm2', teamName: 'Safari Star', name: 'Safari Star', points: 276, transfers: 4 },
      { id: 'm3', teamName: 'World Cup Wizard', name: 'World Cup Wizard', points: 268, transfers: 3 },
      { id: 'me', teamName: user.teamName || 'My Team', name: 'You', points: user.totalPoints, transfers: user.transfersUsed },
      { id: 'm4', teamName: 'Bar Regular', name: 'Bar Regular', points: 245, transfers: 6 },
    ])
    leaderboard.setRegional(leaderboard.national.slice(0, 5))
    leaderboard.setBar([
      { id: 'b1', rank: 1, name: 'Bar Alpha', avgPoints: 262 },
      { id: 'b2', rank: 2, name: 'Bar Beta', avgPoints: 248 },
      { id: 'b3', rank: 3, name: 'Bar Gamma', avgPoints: 235 },
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

const selectedEntry = computed(() => {
  if (!leaderboard.selectedManagerId) return null
  if (leaderboard.currentView === 'bar') return null
  return leaderboard.current.find((e) => e.id === leaderboard.selectedManagerId)
})

const viewingPicks = computed(() => {
  const entry = selectedEntry.value
  if (!entry) return []
  if (entry.id === 'me') return squad.picks
  return getMockTeamForManager(entry.id)
})

const viewingTeamName = computed(() =>
  selectedEntry.value?.id === 'me' ? (user.teamName || 'My Team') : (selectedEntry.value?.teamName ?? '')
)
const viewingFormation = computed(() => (selectedEntry.value?.id === 'me' ? squad.formation : '442'))

const viewingGameweekPoints = computed(() => {
  const entry = selectedEntry.value
  if (!entry) return 0
  if (entry.id === 'me' && squad.picks.length) return squad.gameweekPoints
  return Math.floor((entry.points ?? 0) * 0.15)
})

const viewingOverallPoints = computed(() => selectedEntry.value?.points ?? 0)
const viewingTransfers = computed(() => selectedEntry.value?.transfers ?? 0)

function viewTeam(entry) {
  if (leaderboard.currentView === 'bar') return
  leaderboard.setSelectedManager(entry.id)
}

function backToLeaderboard() {
  leaderboard.clearSelectedManager()
}
</script>

<template>
  <div class="container py-4 py-md-5">
    <div class="row g-4">
      <!-- Sidebar -->
      <aside class="col-12 col-lg-4 col-xl-3">
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="rounded bg-primary bg-opacity-25 d-flex align-items-center justify-content-center p-2">
                <svg class="text-white" style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <span class="fw-semibold text-white">My Team</span>
            </div>
            <p class="small text-white text-opacity-80 mb-0">Your fantasy squad</p>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header bg-transparent border-white border-opacity-10 d-flex justify-content-between align-items-center py-3">
            <h2 class="h6 fw-semibold text-white mb-0">Points &amp; Rankings</h2>
            <router-link to="/squad" class="small text-white text-decoration-none">Gameweek History &gt;</router-link>
          </div>
          <div class="card-body small">
            <div class="mb-2"><span class="text-white text-opacity-70">Overall points:</span> <strong class="text-white">{{ (squad.picks.length ? squad.totalPoints : user.totalPoints).toLocaleString() }}</strong></div>
            <div class="mb-2"><span class="text-white text-opacity-70">Overall rank:</span> <strong class="text-white">5,828,287</strong></div>
            <div class="mb-2"><span class="text-white text-opacity-70">Total players:</span> <strong class="text-white">12,937,745</strong></div>
            <div><span class="text-white text-opacity-70">Gameweek points:</span> <strong class="text-white">{{ squad.picks.length ? squad.gameweekPoints : 0 }}</strong></div>
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

      <!-- Main -->
      <main class="col-12 col-lg-8 col-xl-9">
        <header v-if="!leaderboard.selectedManagerId" class="mb-4">
          <h1 class="h3 fw-bold text-white mb-1">Leaderboard</h1>
          <p class="text-white text-opacity-80 small mb-0">National, regional, and bar mini-leagues. Click a manager to view their team.</p>
        </header>

        <!-- Team view -->
        <div v-if="leaderboard.selectedManagerId && selectedEntry" class="mb-4">
          <button type="button" class="btn btn-link text-white p-0 mb-3 d-flex align-items-center gap-1 small fw-bold text-decoration-none" @click="backToLeaderboard">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Back to Leaderboard
          </button>
          <TeamDisplayView
            :picks="viewingPicks"
            :team-name="viewingTeamName"
            :formation="viewingFormation"
            :gameweek-points="viewingGameweekPoints"
            :overall-points="viewingOverallPoints"
            :transfers="viewingTransfers"
            :gw-rank="9110365"
            :avg-points="46"
            :highest-points="119"
          />
        </div>

        <!-- Leaderboard table -->
        <div v-else>
          <div class="btn-group flex-wrap gap-2 mb-4" role="group">
            <button
              v-for="t in tabs"
              :key="t.id"
              type="button"
              class="btn btn-sm fw-bold"
              :class="leaderboard.currentView === t.id ? 'btn-dark' : 'btn-outline-secondary'"
              @click="leaderboard.setCurrentView(t.id)"
            >
              {{ t.label }}
            </button>
          </div>

          <div class="card overflow-hidden">
            <div class="table-responsive">
              <table class="table table-hover table-dark mb-0">
                <thead>
                  <tr>
                    <th v-for="col in columns" :key="col" class="border-white border-opacity-10 px-3 py-3 small fw-semibold">{{ col }}</th>
                    <th v-if="leaderboard.currentView !== 'bar'" class="border-white border-opacity-10 px-3 py-3 small fw-semibold" style="width: 100px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="leaderboard.currentView === 'bar'">
                    <tr v-for="row in leaderboard.current" :key="row.rank">
                      <td class="px-3 py-3 small">{{ row.rank }}</td>
                      <td class="px-3 py-3 small text-white">{{ row.name }}</td>
                      <td class="px-3 py-3 small fw-semibold text-danger">{{ row.avgPoints }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr
                      v-for="(row, idx) in leaderboard.current"
                      :key="row.id || row.rank"
                      class="cursor-pointer"
                      :class="{ 'bg-primary bg-opacity-10': row.name === 'You' }"
                      @click="viewTeam(row)"
                    >
                      <td class="px-3 py-3 small">{{ idx + 1 }}</td>
                      <td class="px-3 py-3 small text-white">{{ row.name }}</td>
                      <td class="px-3 py-3 small fw-semibold text-danger">{{ row.points }}</td>
                      <td class="px-3 py-3 small text-white text-opacity-80">{{ row.transfers }}</td>
                      <td class="px-3 py-3 small text-white">View team &gt;</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.btn-outline-secondary {
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
}
.btn-outline-secondary:hover {
  background-color: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}
</style>
