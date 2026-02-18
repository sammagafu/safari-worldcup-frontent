import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Safari World Cup Fantasy' },
  },
  {
    path: '/squad',
    name: 'squad',
    component: () => import('@/views/SquadView.vue'),
    meta: { title: 'My Squad' },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('@/views/LeaderboardView.vue'),
    meta: { title: 'Leaderboard' },
  },
  {
    path: '/rewards',
    name: 'rewards',
    component: () => import('@/views/RewardsView.vue'),
    meta: { title: 'Rewards' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Safari Fantasy` : 'Safari World Cup Fantasy'
})

export default router
