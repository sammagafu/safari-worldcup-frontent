<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import logoUrl from '@/assets/logo.svg'

const user = useUserStore()
const route = useRoute()
const menuOpen = ref(false)

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>

<template>
  <nav class="navbar navbar-dark fixed-top border-bottom border-white border-opacity-10 bg-dark bg-opacity-95 py-2 py-lg-3" style="backdrop-filter: blur(12px);" aria-label="Main navigation">
    <div class="container d-flex flex-wrap align-items-center justify-content-between gap-2">
      <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2" aria-label="Safari Fantasy Home">
        <img :src="logoUrl" class="d-block" style="height: 28px;" alt="" />
        <span class="fw-bold">Safari Fantasy</span>
      </RouterLink>

      <button
        class="navbar-toggler d-lg-none border-0 py-2"
        type="button"
        aria-controls="navbarMain"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        id="navbarMain"
        class="navbar-menu"
        :class="{ show: menuOpen }"
      >
        <ul class="navbar-nav nav-links">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link px-3 py-2 rounded" :class="isActive('/') ? 'active text-primary' : 'text-white'">
              Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/squad" class="nav-link px-3 py-2 rounded" :class="isActive('/squad') ? 'active text-primary' : 'text-white'">
              Team creation
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/my-team" class="nav-link px-3 py-2 rounded" :class="isActive('/my-team') ? 'active text-primary' : 'text-white'">
              My Team
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/leaderboard" class="nav-link px-3 py-2 rounded" :class="isActive('/leaderboard') ? 'active text-primary' : 'text-white'">
              Leaderboard
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/predictions" class="nav-link px-3 py-2 rounded" :class="isActive('/predictions') ? 'active text-primary' : 'text-white'">
              Predictions
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/rewards" class="nav-link px-3 py-2 rounded" :class="isActive('/rewards') ? 'active text-primary' : 'text-white'">
              Rewards
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/follow" class="nav-link px-3 py-2 rounded" :class="isActive('/follow') ? 'active text-primary' : 'text-white'">
              Follow Safari
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/settings" class="nav-link px-3 py-2 rounded" :class="isActive('/settings') ? 'active text-primary' : 'text-white'">
              Notifications
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin" class="nav-link px-3 py-2 rounded" :class="isActive('/admin') ? 'active text-primary' : 'text-white'">
              Admin
            </RouterLink>
          </li>
        </ul>
        <div class="navbar-actions d-flex align-items-center gap-2">
          <RouterLink v-if="!user.isLoggedIn" to="/login" class="btn btn-primary btn-sm fw-bold px-4">
            Get started
          </RouterLink>
          <span v-else class="badge bg-secondary fw-bold py-2 px-3">
            {{ user.totalPoints }} pts
          </span>
        </div>
      </div>
    </div>
  </nav>
  <div class="navbar-spacer" style="height: 56px;" aria-hidden="true" />
</template>

<style scoped>
.navbar-spacer {
  pointer-events: none;
}
@media (min-width: 992px) {
  .navbar-spacer {
    height: 64px;
  }
}

/* Nav menu: row on desktop, column on mobile */
.navbar-menu {
  display: none;
  width: 100%;
  flex-basis: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  order: 3;
}
.navbar-menu.show {
  display: flex;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
/* Mobile: links in a column */
.navbar-menu .nav-links {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.navbar-menu .nav-links .nav-link {
  display: block;
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
}
.navbar-menu .navbar-actions {
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: center;
}

/* Desktop: menu in a row, links in a row */
@media (min-width: 992px) {
  .navbar-menu {
    display: flex !important;
    flex-basis: auto;
    flex-direction: row;
    flex-grow: 1;
    width: auto;
    order: unset;
    padding-top: 0;
    border-top: none;
    gap: 0;
  }
  .navbar-menu .nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-right: auto;
    gap: 0.25rem;
  }
  .navbar-menu .nav-links .nav-link {
    padding: 0.5rem 0.75rem;
  }
  .navbar-menu .navbar-actions {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    justify-content: flex-end;
  }
}
</style>
