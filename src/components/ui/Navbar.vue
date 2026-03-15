<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
</script>

<template>
  <header class="header">
    <div class="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
      <RouterLink to="/" class="flex items-center gap-2">
        <span class="text-base font-semibold">ShortLink</span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/dashboard" class="text-sm text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-100">
            Мои ссылки
          </RouterLink>
          <span class="text-gray-300">|</span>
          <span class="text-sm text-gray-500">{{ authStore.user?.email }}</span>
          <button
            @click="authStore.logout()"
            class="btn btn-ghost text-sm"
          >
            Выйти
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-secondary text-sm">
            Войти
          </RouterLink>
          <RouterLink to="/register" class="btn btn-primary text-sm">
            Регистрация
          </RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>
