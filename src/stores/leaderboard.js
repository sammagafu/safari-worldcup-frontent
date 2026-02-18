import { defineStore } from 'pinia'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    national: [],
    regional: [],
    bar: [],
    currentView: 'national', // national | regional | bar
  }),
  actions: {
    setNational(entries) {
      this.national = entries
    },
    setRegional(entries) {
      this.regional = entries
    },
    setBar(entries) {
      this.bar = entries
    },
    setCurrentView(view) {
      this.currentView = view
    },
  },
  getters: {
    current: (state) => {
      if (state.currentView === 'regional') return state.regional
      if (state.currentView === 'bar') return state.bar
      return state.national
    },
  },
})
