<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKiStore } from '@/stores/ki'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { KiTagesBriefingResult } from '@/types'

const ki = useKiStore()
const planung = usePlanungStore()
const kundenStore = useKundenStore()

const briefing = ref<KiTagesBriefingResult | null>(null)
const collapsed = ref(false)

onMounted(async () => {
  const besuche = planung.heutigeBesuche
  const kunden = besuche
    .map((b) => kundenStore.getKundeById(b.kundeId))
    .filter(Boolean) as ReturnType<typeof kundenStore.getKundeById>[]
  briefing.value = await ki.erstelleTagesBriefing(besuche, kunden as any)
})
</script>

<template>
  <div class="mx-3 mt-3 rounded-xl border-l-4 border-primary-500 bg-orange-50 overflow-hidden">
    <button
      class="w-full flex items-center justify-between px-4 py-3 text-left"
      @click="collapsed = !collapsed"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <span class="text-sm font-semibold text-primary-700">KI-Tages-Briefing</span>
        <LoadingSpinner v-if="ki.isLoading && ki.currentTask === 'briefing'" size="sm" />
      </div>
      <svg :class="['w-4 h-4 text-gray-400 transition-transform', collapsed ? '' : 'rotate-180']"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <div v-if="!collapsed && briefing" class="px-4 pb-3 space-y-2">
      <div class="flex items-start gap-2">
        <span class="text-xs font-semibold text-primary-600 shrink-0 mt-0.5">Priorität</span>
        <span class="text-xs text-gray-700">{{ briefing.prioritaet }}</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-xs font-semibold text-teal-600 shrink-0 mt-0.5">Route</span>
        <span class="text-xs text-gray-700">{{ briefing.routeStatus }}</span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-xs font-semibold text-gray-500 shrink-0 mt-0.5">Tipp</span>
        <span class="text-xs text-gray-600 italic">{{ briefing.hinweis }}</span>
      </div>
    </div>

    <div v-else-if="!collapsed && !briefing && !(ki.isLoading && ki.currentTask === 'briefing')"
      class="px-4 pb-3 text-xs text-gray-400">
      Keine Termine für heute geplant.
    </div>
  </div>
</template>
