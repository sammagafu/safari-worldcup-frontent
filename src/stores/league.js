import { defineStore } from 'pinia'

/** Generate a short share code (6 alphanumeric) */
function generateShareCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const useLeagueStore = defineStore('league', {
  state: () => ({
    leagues: [], // { id, name, shareCode, createdAt, participants: [] }
  }),
  getters: {
    leagueById: (state) => (id) => state.leagues.find((l) => l.id === id),
    leagueByCode: (state) => (code) =>
      state.leagues.find((l) => l.shareCode.toUpperCase() === (code || '').toUpperCase()),
  },
  actions: {
    createLeague(name) {
      const shareCode = generateShareCode()
      const league = {
        id: `l${Date.now()}`,
        name,
        shareCode,
        createdAt: new Date().toISOString(),
        participants: [],
      }
      this.leagues.push(league)
      return league
    },
    joinLeague(code, userId) {
      const league = this.leagueByCode(code)
      if (!league) return false
      if (league.participants.includes(userId)) return true
      league.participants.push(userId)
      return true
    },
  },
})
