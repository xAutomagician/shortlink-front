<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref(null)
const loading = ref(false)

async function handleSubmit(event) {
  if (event) event.preventDefault()

  if (!email.value || !password.value) {
    error.value = 'Заполните все обязательные поля'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  loading.value = true
  error.value = null

  try {
    await authStore.register(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    console.error('Register error:', err)
    error.value = err.response?.data?.detail || err.message || 'Ошибка при регистрации'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto py-10">
    <button
      @click="router.push('/')"
      class="text-sm text-gray-500 hover:text-black mb-5 inline-flex items-center gap-1"
    >
      ← Назад
    </button>

    <section class="card p-5">
      <h2 class="text-base font-medium mb-4">Регистрация</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            class="input w-full"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
            Пароль
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="input w-full"
          />
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1.5">
            Подтвердите пароль
          </label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="input w-full"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div v-if="error" class="mt-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
        {{ error }}
      </div>

      <p class="mt-5 text-center text-sm text-gray-500">
        Уже есть аккаунт?
        <RouterLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
          Войти
        </RouterLink>
      </p>
    </section>
  </div>
</template>
