<script setup>
import { ref, onMounted } from 'vue'
import { linksApi } from '@/api/links'

const links = ref([])
const error = ref(null)
const loading = ref(true)
const editingLink = ref(null)
const editForm = ref({
  original: '',
  alias: '',
  expiredAt: '',
})

onMounted(async () => {
  await loadLinks()
})

async function loadLinks() {
  loading.value = true
  error.value = null

  try {
    links.value = await linksApi.getMyLinks()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при загрузке ссылок'
  } finally {
    loading.value = false
  }
}

async function deleteLink(shortCode) {
  if (!confirm('Удалить эту ссылку?')) return

  try {
    await linksApi.deleteLink(shortCode)
    await loadLinks()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при удалении'
  }
}

function openEditModal(link) {
  editingLink.value = link
  editForm.value = {
    original: link.original,
    alias: link.alias || '',
    expiredAt: '',
  }
}

function closeEditModal() {
  editingLink.value = null
  editForm.value = {
    original: '',
    alias: '',
    expiredAt: '',
  }
}

async function submitEdit() {
  if (!editingLink.value) return

  try {
    const data = {
      original: editForm.value.original,
    }
    if (editForm.value.alias) data.alias = editForm.value.alias
    if (editForm.value.expiredAt) data.expired_at = parseInt(editForm.value.expiredAt)

    await linksApi.updateLink(editingLink.value.short, data)
    closeEditModal()
    await loadLinks()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при обновлении'
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('ru-RU')
}
</script>

<template>
  <section class="card p-6">
    <h2 class="text-base font-medium mb-4">Мои ссылки</h2>

    <div v-if="loading" class="text-center py-8">
      <span class="text-sm text-gray-500">Загрузка...</span>
    </div>

    <div v-else-if="error" class="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-else-if="links.length === 0" class="text-center py-8">
      <p class="text-sm text-gray-500">У вас пока нет ссылок</p>
      <RouterLink to="/" class="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block">
        Создать первую
      </RouterLink>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="link in links"
        :key="link.short"
        class="card p-3 border border-gray-200"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1 min-w-0">
            <a
              :href="`/links/${link.short}`"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium block truncate mb-1"
            >
              {{ link.original }}
            </a>
            <div class="text-xs text-gray-500 flex flex-wrap gap-2 items-center">
              <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">/{{ link.short }}</span>
              <span v-if="link.alias" class="text-gray-600">алиас: {{ link.alias }}</span>
              <span>{{ link.clicks_count }} кликов</span>
              <span v-if="link.expired_at" class="text-gray-400">•</span>
              <span v-if="link.expired_at">до {{ formatDate(link.expired_at) }}</span>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="openEditModal(link)"
              class="btn btn-secondary text-xs"
            >
              Ред.
            </button>
            <button
              @click="deleteLink(link.short)"
              class="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editingLink" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div class="card max-w-md w-full p-5">
        <h3 class="text-base font-medium mb-4">Редактировать</h3>

        <form @submit.prevent="submitEdit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Длинная ссылка
            </label>
            <input
              v-model="editForm.original"
              type="url"
              required
              class="input w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Алиас
            </label>
            <input
              v-model="editForm.alias"
              type="text"
              pattern="[a-zA-Z0-9_-]+"
              class="input w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Время (минут)
            </label>
            <input
              v-model="editForm.expiredAt"
              type="number"
              min="1"
              placeholder="Пусто = бессрочно"
              class="input w-full"
            />
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 btn btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="flex-1 btn btn-primary"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
