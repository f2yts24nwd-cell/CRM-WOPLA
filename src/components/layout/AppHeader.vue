<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { useThemeStore } from '@/stores/theme'
import { getKW } from '@/utils/dates'
import HilfeModal from '@/components/layout/HilfeModal.vue'

const planung = usePlanungStore()
const themeStore = useThemeStore()
const kw = computed(() => getKW(planung.wocheStart))
const showHilfe = ref(false)
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-11 bg-shell text-white flex items-center px-4 border-b border-shell/50"
          style="padding-top: env(safe-area-inset-top)">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM2 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      </div>
      <span class="font-semibold text-sm tracking-wide">WOPLA</span>
    </div>

    <!-- KW-Anzeige zentriert -->
    <span class="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-white/70">KW {{ kw }}</span>

    <!-- Aktionen rechts -->
    <div class="flex items-center gap-1 ml-auto">
      <!-- Dark Mode Toggle -->
      <button @click="themeStore.toggle()"
        class="w-8 h-8 flex items-center justify-center rounded text-white/80 hover:bg-white/10 active:bg-white/20 transition-colors"
        :title="themeStore.isDark ? 'Heller Modus' : 'Dunkler Modus'">
        <!-- Mond: im hellen Modus anzeigen -->
        <svg v-if="!themeStore.isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
        <!-- Sonne: im dunklen Modus anzeigen -->
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02.707.707M1 12h2m18 0h2M4.22 19.78l.707-.707M18.95 5.05l.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"/>
        </svg>
      </button>

      <!-- Hilfe -->
      <button @click="showHilfe = true"
        class="w-8 h-8 flex items-center justify-center rounded text-white/80 hover:bg-white/10 active:bg-white/20 transition-colors">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </button>
    </div>

    <slot name="action" />

    <HilfeModal v-if="showHilfe" @close="showHilfe = false" />
  </header>
</template>
