import { defineStore } from 'pinia'

const STORAGE_KEY = 'safari-theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
  }),

  actions: {
    /** Sync store state from DOM (inline script in index.html sets class before first paint) */
    init() {
      this.isDark = document.documentElement.classList.contains('dark')
    },

    toggle() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
      localStorage.setItem(STORAGE_KEY, this.isDark ? 'dark' : 'light')
    },

    setDark(value) {
      this.isDark = !!value
      document.documentElement.classList.toggle('dark', this.isDark)
      localStorage.setItem(STORAGE_KEY, this.isDark ? 'dark' : 'light')
    },
  },
})
