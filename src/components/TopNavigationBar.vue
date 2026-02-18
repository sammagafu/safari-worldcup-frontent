<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import logoUrl from '@/assets/logo.svg'

const user = useUserStore()
const route = useRoute()
const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

watch(() => route.path, closeMobileMenu)
</script>

<template>
  <div>
    <nav
      class="fixed w-full z-20 top-0 start-0 border-b border-border-default safe-area-inset-top bg-surface-elevated"
      aria-label="Main navigation"
    >
      <!-- Tailwind container: centered, max-width from theme -->
      <div class="container flex flex-wrap items-center justify-between gap-4 py-3 sm:py-4">
        <!-- Logo + brand -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 sm:gap-3 rtl:gap-2 rtl:sm:gap-3 shrink-0"
          aria-label="Safari Fantasy Home"
        >
          <img :src="logoUrl" class="h-7 w-auto sm:h-8 md:h-9" alt="" />
        </RouterLink>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-text-secondary rounded-lg md:hidden hover:bg-surface hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-safari-light-blue/30 transition"
          :aria-expanded="mobileMenuOpen"
          aria-controls="navbar-default"
          aria-label="Open main menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="sr-only">Open main menu</span>
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" />
          </svg>
          <svg v-else class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Nav links + theme + auth (desktop: always visible; mobile: in collapse) -->
        <div
          id="navbar-default"
          :class="[mobileMenuOpen ? 'block' : 'hidden', 'w-full md:flex md:items-center md:justify-end md:gap-6 lg:gap-8 md:w-auto']"
        >
          <ul class="font-medium flex flex-col gap-1 py-2 md:py-0 md:flex-row md:items-center md:gap-6 lg:gap-8 p-4 md:p-0 mt-2 md:mt-0 border border-border-default rounded-lg bg-surface md:border-0 md:bg-transparent">
            <li>
              <RouterLink
                to="/"
                class="block py-3 px-4 rounded-lg md:py-2 md:px-0 transition"
                :class="route.path === '/' ? 'text-white bg-safari-light-blue md:bg-transparent md:text-safari-light-blue' : 'text-text-primary hover:bg-surface md:hover:bg-transparent md:hover:text-safari-light-blue'"
                aria-current="page"
              >
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/squad"
                class="block py-3 px-4 rounded-lg md:py-2 md:px-0 transition"
                :class="route.path === '/squad' ? 'text-white bg-safari-light-blue md:bg-transparent md:text-safari-light-blue' : 'text-text-primary hover:bg-surface md:hover:bg-transparent md:hover:text-safari-light-blue'"
                @click="closeMobileMenu"
              >
                Squad
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/leaderboard"
                class="block py-3 px-4 rounded-lg md:py-2 md:px-0 transition"
                :class="route.path === '/leaderboard' ? 'text-white bg-safari-light-blue md:bg-transparent md:text-safari-light-blue' : 'text-text-primary hover:bg-surface md:hover:bg-transparent md:hover:text-safari-light-blue'"
                @click="closeMobileMenu"
              >
                Leaderboard
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/rewards"
                class="block py-3 px-4 rounded-lg md:py-2 md:px-0 transition"
                :class="route.path === '/rewards' ? 'text-white bg-safari-light-blue md:bg-transparent md:text-safari-light-blue' : 'text-text-primary hover:bg-surface md:hover:bg-transparent md:hover:text-safari-light-blue'"
                @click="closeMobileMenu"
              >
                Rewards
              </RouterLink>
            </li>
          </ul>

          <!-- Auth (inside collapse on mobile so they appear in drawer) -->
          <div class="flex items-center gap-2 sm:gap-3 px-4 pb-4 pt-1 md:pt-0 md:pb-0 md:px-0 md:shrink-0">
            <template v-if="!user.isLoggedIn">
              <RouterLink
                to="/login"
                class="hidden sm:inline-flex items-center py-2 px-3 text-sm font-medium text-text-primary hover:text-safari-light-blue rounded-lg transition"
                @click="closeMobileMenu"
              >
                Log In
              </RouterLink>
              <RouterLink
                to="/login"
                class="inline-flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-sm font-semibold text-white bg-safari-dark-blue hover:bg-safari-dark-blue/90 transition shadow-sm"
                @click="closeMobileMenu"
              >
                <svg class="w-4 h-4 shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </RouterLink>
            </template>
            <div v-else class="text-sm font-semibold text-text-primary py-2 px-1">
              {{ user.totalPoints }} pts
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer for fixed header (matches nav height) -->
    <div class="h-14 sm:h-16 md:h-18" aria-hidden="true" />
  </div>
</template>
