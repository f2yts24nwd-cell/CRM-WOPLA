<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
</script>

<template>
  <div class="flex flex-col bg-gray-50" style="min-height: 100dvh">
    <AppHeader />
    <main class="flex-1 overflow-hidden" style="margin-top: 56px; margin-bottom: 56px">
      <RouterView />
    </main>
    <AppNav />
  </div>
</template>
