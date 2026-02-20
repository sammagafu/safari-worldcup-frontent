import { defineStore } from 'pinia'

const BUDGET = 100 // 100M

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    ageVerified: false,
    termsAccepted: false,
    ageBannerDismissed: false,
    followBannerDismissed: false,
    region: null,
    favoriteTeam: null,
    phoneNumber: null,
    /** User's fantasy team name (set in team creation step 1). */
    teamName: '',
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
    setPhoneNumber(phone) {
      this.phoneNumber = phone
    },
    setTeamName(name) {
      this.teamName = (name || '').trim()
    },
    confirmAge() {
      this.ageVerified = true
      this.termsAccepted = true
      this.ageBannerDismissed = true
    },
    dismissFollowBanner() {
      this.followBannerDismissed = true
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
      // Optionally clear teamName for a full reset: this.teamName = ''
    },
  },
})
