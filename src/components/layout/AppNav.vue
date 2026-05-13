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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span class="text-xs font-medium">Planung</span>
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

    <RouterLink to="/karte" class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]"
      :class="route.path === '/karte' ? 'text-primary-500' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
      </svg>
      <span class="text-xs font-medium">Karte</span>
    </RouterLink>
  </nav>
</template>
