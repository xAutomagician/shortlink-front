import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/ui/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/views/LoginView.vue'),
    meta: { guestOnly: true, layout: 'plain' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/views/RegisterView.vue'),
    meta: { guestOnly: true, layout: 'plain' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/links/:shortCode/stats',
    name: 'link-stats',
    component: () => import('@/components/views/LinkStatsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
