<script setup>
import { ref } from 'vue'
import { linksApi } from '@/api/links'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const originalUrl = ref('')
const alias = ref('')
const expiredAt = ref('')
const result = ref(null)
const error = ref(null)
const loading = ref(false)

async function handleSubmit(event) {
  if (event) event.preventDefault()

  if (!originalUrl.value) {
    error.value = 'Введите ссылку'
    return
  }

  loading.value = true
  error.value = null
  result.value = null

  try {
    const expiredAtMinutes = expiredAt.value ? parseInt(expiredAt.value) : null
    const data = await linksApi.shorten(originalUrl.value, alias.value || null, expiredAtMinutes)
    result.value = `${window.location.origin}/links/${data.short}`
    originalUrl.value = ''
    alias.value = ''
    expiredAt.value = ''
  } catch (err) {
    console.error('Shorten error:', err)
    error.value = err.response?.data?.detail || err.message || 'Ошибка при создании ссылки'
  } finally {
    loading.value = false
  }
}

async function copyToClipboard() {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = result.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}
</script>

<template>
  <section class="card p-6">
    <div class="mb-5">
      <h2 class="text-base font-medium">Сократить ссылку</h2>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="original-url" class="block text-sm font-medium text-gray-700 mb-1.5">
          Длинная ссылка
        </label>
        <input
          id="original-url"
          v-model="originalUrl"
          type="url"
          placeholder="https://example.com/very-long-url"
          required
          class="input w-full"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="alias" class="block text-sm font-medium text-gray-700 mb-1.5">
            Алиас
          </label>
          <input
            id="alias"
            v-model="alias"
            type="text"
            placeholder="mylink"
            pattern="[a-zA-Z0-9_-]+"
            class="input w-full"
          />
          <p class="text-xs text-gray-400 mt-1">необязательно</p>
        </div>

        <div>
          <label for="expired-at" class="block text-sm font-medium text-gray-700 mb-1.5">
            Время (мин)
          </label>
          <input
            id="expired-at"
            v-model="expiredAt"
            type="number"
            placeholder="60"
            min="1"
            class="input w-full"
          />
          <p class="text-xs text-gray-400 mt-1">необязательно</p>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full"
      >
        {{ loading ? 'Создаю...' : 'Сократить' }}
      </button>
    </form>

    <div v-if="error" class="mt-5 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="result" class="mt-5 p-3 rounded bg-green-50 border border-green-200">
      <div class="flex items-center gap-2">
        <a
          :href="result"
          target="_blank"
          class="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium truncate"
        >
          {{ result }}
        </a>
        <button
          @click="copyToClipboard"
          class="btn btn-secondary text-xs"
        >
          Копировать
        </button>
      </div>
    </div>
  </section>
</template>
