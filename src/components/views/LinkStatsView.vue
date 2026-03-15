<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { linksApi } from '@/api/links'

const route = useRoute()
const stats = ref(null)
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await linksApi.getLinkStats(route.params.shortCode)
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при загрузке статистики'
  } finally {
    loading.value = false
  }
})

function formatDate(dateString) {
  if (!dateString) return 'Бессрочно'
  return new Date(dateString).toLocaleString('ru-RU')
}
</script>

<template>
  <section class="card p-5 max-w-xl mx-auto">
    <h2 class="text-base font-medium mb-4">Статистика</h2>

    <div v-if="loading" class="text-center py-8">
      <span class="text-sm text-gray-500">Загрузка...</span>
    </div>

    <div v-else-if="error" class="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-else-if="stats" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 rounded bg-gray-50 border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">Переходов</p>
          <p class="text-xl font-semibold">{{ stats.clicks_count }}</p>
        </div>
        <div class="p-3 rounded bg-gray-50 border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">Статус</p>
          <p class="text-sm font-medium" :class="stats.is_active ? 'text-green-700' : 'text-red-700'">
            {{ stats.is_active ? 'Активна' : 'Истекла' }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <p class="text-xs text-gray-500 mb-1.5">Оригинал</p>
        <a
          :href="stats.original"
          target="_blank"
          class="text-blue-600 hover:text-blue-800 text-sm break-all"
        >
          {{ stats.original }}
        </a>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-xs text-gray-500 mb-1">Код</p>
          <p class="font-medium">/{{ stats.short }}</p>
        </div>
        <div v-if="stats.alias">
          <p class="text-xs text-gray-500 mb-1">Алиас</p>
          <p class="font-medium">{{ stats.alias }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
        <div>
          <p class="text-gray-400">Создана</p>
          <p class="font-medium text-gray-700 mt-0.5">{{ formatDate(stats.created_at) }}</p>
        </div>
        <div>
          <p class="text-gray-400">Истекает</p>
          <p class="font-medium text-gray-700 mt-0.5">{{ formatDate(stats.expired_at) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
