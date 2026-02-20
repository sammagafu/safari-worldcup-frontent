<script setup>
import TopNavigationBar from '@/components/TopNavigationBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-vh-100 overflow-x-hidden">
    <TopNavigationBar />
    <main class="py-4 py-md-5 pb-5">
      <slot />
    </main>
    <Footer />
  </div>
</template>
