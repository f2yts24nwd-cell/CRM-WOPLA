<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { getKW } from '@/utils/dates'
import HilfeModal from '@/components/layout/HilfeModal.vue'

const planung = usePlanungStore()
const kw = computed(() => getKW(planung.wocheStart))
const showHilfe = ref(false)
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-14 bg-primary-500 text-white flex items-center px-4 shadow-md"
          style="padding-top: env(safe-area-inset-top)">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM2 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      </div>
      <span class="font-bold text-lg tracking-wide">WOPLA</span>
    </div>

    <span class="mx-auto text-sm font-medium opacity-90">KW {{ kw }}</span>

    <button @click="showHilfe = true"
      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </button>

    <slot name="action" />

    <HilfeModal v-if="showHilfe" @close="showHilfe = false" />
  </header>
</template>
