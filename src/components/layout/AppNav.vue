<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex"
       style="padding-bottom: env(safe-area-inset-bottom)">
    <RouterLink to="/" class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]"
      :class="route.path === '/' ? 'text-primary-500' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02.707.707M1 12h2m18 0h2M4.22 19.78l.707-.707M18.95 5.05l.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"/>
      </svg>
      <span class="text-xs font-medium">Heute</span>
    </RouterLink>

    <RouterLink to="/woche" class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]"
      :class="route.path === '/woche' ? 'text-primary-500' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span class="text-xs font-medium">Woche</span>
    </RouterLink>

    <RouterLink to="/umkreissuche" class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]"
      :class="route.path === '/umkreissuche' ? 'text-primary-500' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <span class="text-xs font-medium">Umkreis</span>
    </RouterLink>
  </nav>
</template>
