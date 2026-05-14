<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
</script>

<template>
  <div class="bg-page" style="height: 100dvh">
    <AppHeader />
    <main style="position: fixed; top: 44px; bottom: 56px; left: 0; right: 0; overflow: hidden;">
      <RouterView class="h-full w-full" />
    </main>
    <AppNav />
  </div>
</template>
