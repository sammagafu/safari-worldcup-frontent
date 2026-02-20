import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
    meta: { title: 'Team creation' },
  },
  {
    path: '/my-team',
    name: 'my-team',
    component: () => import('@/views/TeamResultsView.vue'),
    meta: { title: 'Team results' },
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
    path: '/predictions',
    name: 'predictions',
    component: () => import('@/views/PredictionsView.vue'),
    meta: { title: 'Predictions' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login' },
  },
  {
    path: '/verify-age',
    name: 'verify-age',
    component: () => import('@/views/AgeVerificationView.vue'),
    meta: { title: 'Verify Age' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Notifications' },
  },
  {
    path: '/follow',
    name: 'follow',
    component: () => import('@/views/FollowAccountsView.vue'),
    meta: { title: 'Follow Safari' },
  },
  {
    path: '/create-team-name',
    name: 'create-team-name',
    component: () => import('@/views/CreateTeamNameView.vue'),
    meta: { title: 'Create team name' },
  },
  {
    path: '/join-league',
    name: 'join-league',
    component: () => import('@/views/JoinLeagueView.vue'),
    meta: { title: 'Join League' },
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { title: 'Admin' },
    children: [
      {
        path: '',
        name: 'admin',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
      },
      {
        path: 'leagues/create',
        name: 'admin-create-league',
        component: () => import('@/views/admin/CreateLeagueView.vue'),
        meta: { title: 'Create League' },
      },
      {
        path: 'leagues/:id/share',
        name: 'admin-share-league',
        component: () => import('@/views/admin/LeagueShareView.vue'),
        meta: { title: 'Share League' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = useUserStore()

  // Step 1: Login — /login (public)
  // Step 2: Age verification — /verify-age (requires logged in)
  // Step 3: Follow — /follow (requires logged in + age verified)
  // Step 4: Create team name — /create-team-name (requires logged in + age verified)
  // Step 5: Squad — /squad (requires logged in + age verified)

  if (to.name === 'verify-age' && !user.isLoggedIn) {
    next({ name: 'login' })
    return
  }

  const requiresAuthAndAge = ['follow', 'create-team-name', 'squad']
  if (requiresAuthAndAge.includes(to.name)) {
    if (!user.isLoggedIn) {
      next({ name: 'login' })
      return
    }
    if (!user.ageVerified) {
      next({ name: 'verify-age' })
      return
    }
  }

  if (to.name === 'my-team') {
    if (!user.isLoggedIn) {
      next({ name: 'login' })
      return
    }
    if (!user.ageVerified) {
      next({ name: 'verify-age' })
      return
    }
  }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Safari Fantasy` : 'Safari World Cup Fantasy'
})

export default router
