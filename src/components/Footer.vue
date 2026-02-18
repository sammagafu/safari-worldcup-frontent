<script setup>
defineOptions({
  name: 'Footer',
})
</script>

<template>
  <footer class="border-t border-border-subtle bg-surface-elevated safe-area-inset-bottom">
    <div class="container py-4 sm:py-5">
      <p class="text-center text-xs sm:text-3xs text-text-muted px-2">
        <slot>
          Safari Lager World Cup Fantasy 2026 · Play responsibly · 21+
        </slot>
      </p>
    </div>
  </footer>
</template>
