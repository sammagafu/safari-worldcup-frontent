import { defineStore } from 'pinia'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    national: [],
    regional: [],
    bar: [],
    currentView: 'national', // national | regional | bar
    selectedManagerId: null, // when set, show this manager's team
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
    setSelectedManager(id) {
      this.selectedManagerId = id
    },
    clearSelectedManager() {
      this.selectedManagerId = null
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
