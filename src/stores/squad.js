import { defineStore } from 'pinia'
import { useUserStore } from './user'

// Formations: 4-4-2, 4-3-3, 3-5-2. Bench = 1 sub per position (GKP, DEF, MID, FWD).
// Max 3 players per country. 2 goalkeepers required (1 starter + 1 bench).
const MAX_PLAYERS_PER_COUNTRY = 3
const FORMATIONS = {
  '442': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  '433': { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  '352': { GK: 1, DEF: 3, MID: 5, FWD: 2 },
}
const BENCH_SLOTS = ['B_GK', 'B_DEF', 'B_MID', 'B_FWD']
const POSITION_TO_BENCH = { GK: 'B_GK', DEF: 'B_DEF', MID: 'B_MID', FWD: 'B_FWD' }

function getStarterMax(formation, position) {
  return FORMATIONS[formation]?.[position] ?? 0
}

/** Infer formation from current starting XI counts. Default 442 when incomplete. */
function inferFormationFromCounts(c) {
  const def = c.DEF ?? 0
  const mid = c.MID ?? 0
  const fwd = c.FWD ?? 0
  if (def === 4 && mid === 4 && fwd === 2) return '442'
  if (def === 4 && mid === 3 && fwd === 3) return '433'
  if (def === 3 && mid === 5 && fwd === 2) return '352'
  if (fwd >= 3) return def >= mid ? '433' : '352'
  return '442'
}

/** True if starting XI counts (GK=1, DEF, MID, FWD) match a supported formation. */
function isValidFormationCounts(c) {
  return (
    c.GK === 1 &&
    ((c.DEF === 4 && c.MID === 4 && c.FWD === 2) ||
      (c.DEF === 4 && c.MID === 3 && c.FWD === 3) ||
      (c.DEF === 3 && c.MID === 5 && c.FWD === 2))
  )
}

function getSlotCountsFromState(state) {
  const c = { GK: 0, DEF: 0, MID: 0, FWD: 0, B_GK: 0, B_DEF: 0, B_MID: 0, B_FWD: 0 }
  state.picks.forEach((p) => {
    if (c[p.slot] !== undefined) c[p.slot]++
  })
  return c
}

export const useSquadStore = defineStore('squad', {
  state: () => ({
    picks: [], // { player, slot: 'GK'|'DEF'|'MID'|'FWD'|'B_GK'|'B_DEF'|'B_MID'|'B_FWD', isCaptain, isViceCaptain }
    chipUsed: null,
    motmPrediction: null, // legacy single; prefer fixtureMotm
    /** Per-fixture MOTM: { [fixtureId]: playerId } */
    fixtureMotm: {},
    /** Per-fixture score prediction: { [fixtureId]: { home, away } } */
    scorePredictions: {},
    locked: false,
  }),
  getters: {
    startingXi: (state) =>
      state.picks.filter((p) => !BENCH_SLOTS.includes(p.slot)),
    bench: (state) =>
      state.picks.filter((p) => BENCH_SLOTS.includes(p.slot)),
    captain: (state) => state.picks.find((p) => p.isCaptain),
    totalCost: (state) =>
      state.picks.reduce((sum, p) => sum + (p.player?.price ?? 0), 0),
    /** Simulated: total points from all picked players */
    totalPoints: (state) =>
      state.picks.reduce((sum, p) => sum + (p.player?.points ?? 0), 0),
    /** Simulated: gameweek points from starting XI only */
    gameweekPoints: (state) => {
      const starters = state.picks.filter((p) => !BENCH_SLOTS.includes(p.slot))
      const captain = state.picks.find((p) => p.isCaptain)
      let total = starters.reduce((sum, p) => sum + (p.player?.gameweekPoints ?? 0), 0)
      if (captain?.player?.gameweekPoints != null) total += (captain.player.gameweekPoints ?? 0)
      return total
    },
    slotCounts: (state) => {
      const c = { GK: 0, DEF: 0, MID: 0, FWD: 0, B_GK: 0, B_DEF: 0, B_MID: 0, B_FWD: 0 }
      state.picks.forEach((p) => {
        if (c[p.slot] !== undefined) c[p.slot]++
      })
      return c
    },
    /** Count starters by player position (used to infer formation). */
    starterPositionCounts: (state) => {
      const c = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
      state.picks.forEach((p) => {
        if (!BENCH_SLOTS.includes(p.slot) && p.player?.position) c[p.player.position] = (c[p.player.position] || 0) + 1
      })
      return c
    },
    /** Formation is inferred from starting XI player positions (442 / 433 / 352). */
    formation: (state, getters) => inferFormationFromCounts(getters?.starterPositionCounts ?? { GK: 0, DEF: 0, MID: 0, FWD: 0 }),
    formationConfig: (state, getters) => {
      const formation = getters?.formation ?? inferFormationFromCounts(getters?.starterPositionCounts ?? { GK: 0, DEF: 0, MID: 0, FWD: 0 })
      return FORMATIONS[formation] || FORMATIONS['442']
    },
    isValid: (state, getters) => {
      const posCounts = getters?.starterPositionCounts ?? { GK: 0, DEF: 0, MID: 0, FWD: 0 }
      const slotC = getters?.slotCounts ?? getSlotCountsFromState(state)
      const cfg = getters?.formationConfig ?? FORMATIONS['442']
      return (
        isValidFormationCounts(posCounts) &&
        slotC.B_GK === 1 &&
        slotC.B_DEF === 1 &&
        slotC.B_MID === 1 &&
        slotC.B_FWD === 1
      )
    },
    /** Count of players per country (team) in current squad */
    playersPerCountry: (state) => {
      const counts = {}
      state.picks.forEach((p) => {
        const team = p.player?.team
        if (team) counts[team] = (counts[team] || 0) + 1
      })
      return counts
    },
    suggestedSlot: (state, getters) => (player) => {
      const pos = player.position
      if (!pos || pos === 'BENCH') return null
      const team = player.team
      const perCountry = getters?.playersPerCountry ?? {}
      if (team && (perCountry[team] || 0) >= MAX_PLAYERS_PER_COUNTRY) return null
      const posCounts = getters?.starterPositionCounts ?? { GK: 0, DEF: 0, MID: 0, FWD: 0 }
      const slotC = getters?.slotCounts ?? getSlotCountsFromState(state)
      const cfg = getters?.formationConfig ?? FORMATIONS['442']
      const starterMax = cfg[pos]
      if (starterMax != null && (posCounts[pos] || 0) < starterMax) return pos
      const benchSlot = POSITION_TO_BENCH[pos]
      if (benchSlot && slotC[benchSlot] < 1) return benchSlot
      return null
    },
  },
  actions: {
    addPlayer(player, slot) {
      if (this.locked) return false
      const user = useUserStore()
      if (this.totalCost + player.price > user.budget) return false
      if (this.picks.some((p) => p.player?.id === player.id)) return false
      const perCountry = this.playersPerCountry
      if (player.team && (perCountry[player.team] || 0) >= MAX_PLAYERS_PER_COUNTRY) return false

      const pos = player.position
      const c = this.slotCounts

      if (BENCH_SLOTS.includes(slot)) {
        if (pos !== slot.replace('B_', '') || c[slot] >= 1) return false
      } else {
        const cfg = this.formationConfig
        const max = cfg[slot]
        if (pos !== slot || max == null || c[slot] >= max) return false
      }

      const wasFull = this.picks.length === 14
      this.picks.push({
        player: { ...player },
        slot,
        isCaptain: false,
        isViceCaptain: false,
      })
      user.spendBudget(player.price)
      if (wasFull) user.useTransfer()
      return true
    },
    removePlayer(playerId) {
      if (this.locked) return false
      const idx = this.picks.findIndex((p) => p.player?.id === playerId)
      if (idx === -1) return false
      const user = useUserStore()
      user.addBudget(this.picks[idx].player.price)
      this.picks.splice(idx, 1)
      return true
    },
    /** Swap a bench player with a starting XI player. Allows cross-position swap to change formation (442/433/352). */
    substitute(benchPlayerId, starterPlayerId) {
      if (this.locked) return false
      if (benchPlayerId === starterPlayerId) return false
      const benchPick = this.picks.find((p) => p.player?.id === benchPlayerId && BENCH_SLOTS.includes(p.slot))
      const starterPick = this.picks.find((p) => p.player?.id === starterPlayerId && !BENCH_SLOTS.includes(p.slot))
      if (!benchPick || !starterPick) return false
      const benchSlot = benchPick.slot
      const starterSlot = starterPick.slot
      // Build new picks with swapped slots so Vue reactivity updates the UI
      const startersAfterSwap = this.picks.map((p) => {
        if (p.player?.id === benchPlayerId) return { ...p, slot: starterSlot }
        if (p.player?.id === starterPlayerId) return { ...p, slot: benchSlot }
        return { ...p }
      })
      const newStarters = startersAfterSwap.filter((p) => !BENCH_SLOTS.includes(p.slot))
      const posCounts = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
      newStarters.forEach((p) => {
        if (p.player?.position) posCounts[p.player.position] = (posCounts[p.player.position] || 0) + 1
      })
      if (!isValidFormationCounts(posCounts)) return false
      // Reassign starter slots by position so formation display is correct (e.g. 433)
      const withReassignedSlots = startersAfterSwap.map((p) => {
        if (BENCH_SLOTS.includes(p.slot)) return p
        return { ...p, slot: p.player?.position ?? p.slot }
      })
      this.picks = withReassignedSlots
      return true
    },
    setCaptain(playerId) {
      this.picks.forEach((p) => {
        p.isCaptain = p.player?.id === playerId
        p.isViceCaptain = false
      })
    },
    setViceCaptain(playerId) {
      this.picks.forEach((p) => {
        p.isViceCaptain = p.player?.id === playerId
      })
    },
    setChip(chip) {
      this.chipUsed = this.chipUsed === chip ? null : chip
    },
    setMotmPrediction(playerId) {
      this.motmPrediction = playerId
    },
    setFixtureMotm(fixtureId, playerId) {
      if (!fixtureId) return
      const next = { ...this.fixtureMotm }
      if (playerId) next[fixtureId] = playerId
      else delete next[fixtureId]
      this.fixtureMotm = next
    },
    setScorePrediction(fixtureId, home, away) {
      if (!fixtureId || home == null || away == null) return
      this.scorePredictions = { ...this.scorePredictions, [fixtureId]: { home: Number(home), away: Number(away) } }
    },
    lock() {
      this.locked = true
    },
    clear() {
      const user = useUserStore()
      this.picks.forEach((p) => user.addBudget(p.player?.price ?? 0))
      this.picks = []
      this.chipUsed = null
      this.motmPrediction = null
      this.fixtureMotm = {}
      this.scorePredictions = {}
      this.locked = false
    },
    /**
     * Auto-pick a full squad with random players from the pool (all teams).
     * Uses formation 4-4-2; respects budget. Refunds current squad then fills.
     */
    autoPick(players) {
      if (this.locked) return false
      const user = useUserStore()
      this.clear()
      user.resetForDemo()

      const BUDGET = 100
      const slots = [
        { slot: 'GK', pos: 'GK' },
        { slot: 'B_GK', pos: 'GK' },
        { slot: 'DEF', pos: 'DEF' }, { slot: 'DEF', pos: 'DEF' }, { slot: 'DEF', pos: 'DEF' }, { slot: 'DEF', pos: 'DEF' },
        { slot: 'B_DEF', pos: 'DEF' },
        { slot: 'MID', pos: 'MID' }, { slot: 'MID', pos: 'MID' }, { slot: 'MID', pos: 'MID' }, { slot: 'MID', pos: 'MID' },
        { slot: 'B_MID', pos: 'MID' },
        { slot: 'FWD', pos: 'FWD' }, { slot: 'FWD', pos: 'FWD' },
        { slot: 'B_FWD', pos: 'FWD' },
      ]

      const byPos = { GK: [], DEF: [], MID: [], FWD: [] }
      players.forEach((p) => {
        if (byPos[p.position]) byPos[p.position].push({ ...p })
      })
      const shuffle = (arr) => {
        const a = [...arr]
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
        }
        return a
      }
      Object.keys(byPos).forEach((pos) => { byPos[pos] = shuffle(byPos[pos]) })

      let spent = 0
      const usedIds = new Set()

      const teamCounts = {}
      for (const { slot, pos } of slots) {
        const pool = byPos[pos].filter((p) => {
          if (usedIds.has(p.id) || spent + p.price > BUDGET) return false
          const cnt = teamCounts[p.team] || 0
          return cnt < MAX_PLAYERS_PER_COUNTRY
        })
        if (pool.length === 0) return false
        const pick = pool[Math.floor(Math.random() * pool.length)]
        usedIds.add(pick.id)
        spent += pick.price
        teamCounts[pick.team] = (teamCounts[pick.team] || 0) + 1
        this.picks.push({
          player: { ...pick },
          slot,
          isCaptain: false,
          isViceCaptain: false,
        })
      }

      user.budget = BUDGET - spent
      const captainPick = this.startingXi[0]
      if (captainPick) this.setCaptain(captainPick.player?.id)
      const vicePick = this.startingXi[1]
      if (vicePick) this.setViceCaptain(vicePick.player?.id)
      return true
    },
  },
})
