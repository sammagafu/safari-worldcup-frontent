import { defineStore } from 'pinia'

const BUDGET = 100 // 100M

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    ageVerified: false,
    termsAccepted: false,
    region: null,
    favoriteTeam: null,
    budget: BUDGET,
    transfersUsed: 0,
    freeTransfersThisWeek: 2,
    totalPoints: 0,
  }),
  getters: {
    isEligible: (state) => state.ageVerified && state.termsAccepted,
    remainingBudget: (state) => state.budget,
  },
  actions: {
    setLoggedIn(value) {
      this.isLoggedIn = value
    },
    setAgeVerified(value) {
      this.ageVerified = value
    },
    setTermsAccepted(value) {
      this.termsAccepted = value
    },
    setRegion(region) {
      this.region = region
    },
    setFavoriteTeam(team) {
      this.favoriteTeam = team
    },
    spendBudget(amount) {
      if (this.budget >= amount) {
        this.budget -= amount
        return true
      }
      return false
    },
    addBudget(amount) {
      this.budget += amount
    },
    addPoints(points) {
      this.totalPoints += points
    },
    useTransfer() {
      if (this.freeTransfersThisWeek > 0) {
        this.freeTransfersThisWeek--
        return true
      }
      this.transfersUsed++
      return false // penalty applies
    },
    setFreeTransfers(count) {
      this.freeTransfersThisWeek = count
    },
    resetForDemo() {
      this.budget = BUDGET
      this.transfersUsed = 0
      this.freeTransfersThisWeek = 2
    },
  },
})
