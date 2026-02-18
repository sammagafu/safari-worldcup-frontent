<script setup>
import TopNavigationBar from '@/components/TopNavigationBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen min-h-dvh">
    <TopNavigationBar />
    <main class="container mx-auto bg-transparent pt-16 pb-4 sm:pt-20 sm:pb-6 md:pt-20 md:pb-8">
      <slot />
    </main>
    <Footer />
  </div>
</template>
