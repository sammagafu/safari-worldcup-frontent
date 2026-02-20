<script setup>
defineOptions({
  name: 'Footer',
})
</script>

<template>
  <footer class="border-top border-white border-opacity-10 bg-dark bg-opacity-90 py-4" style="backdrop-filter: blur(8px);">
    <div class="container">
      <p class="text-center text-white text-opacity-70 small mb-0">
        <slot>
          Safari Lager World Cup Fantasy 2026 · Play responsibly · 21+
        </slot>
      </p>
    </div>
  </footer>
</template>
