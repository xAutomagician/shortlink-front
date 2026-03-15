<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import Layout from '@/components/ui/Layout.vue'

const route = useRoute()

const usePlainLayout = computed(() => route.meta.layout === 'plain')
</script>

<template>
  <template v-if="usePlainLayout">
    <RouterView />
  </template>
  <template v-else>
    <Layout>
      <RouterView />
    </Layout>
  </template>
</template>
