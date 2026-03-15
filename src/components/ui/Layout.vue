<script setup>
import Navbar from '@/components/ui/Navbar.vue'
import Footer from '@/components/ui/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 py-8">
      <div class="max-w-5xl mx-auto px-4">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>
