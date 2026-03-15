import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/links'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function initAuth() {
    if (!token.value) return

    try {
      user.value = await authApi.me()
    } catch (error) {
      logout()
    }
  }

  async function login(email, password) {
    try {
      const data = await authApi.login(email, password)
      token.value = data.access_token
      localStorage.setItem('token', data.access_token)
      user.value = await authApi.me()
      localStorage.setItem('user', JSON.stringify(user.value))
      return data
    } catch (error) {
      throw error
    }
  }

  async function register(email, password) {
    try {
      const data = await authApi.register(email, password)
      token.value = data.access_token
      localStorage.setItem('token', data.access_token)
      user.value = await authApi.me()
      localStorage.setItem('user', JSON.stringify(user.value))
      return data
    } catch (error) {
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
  }
})
