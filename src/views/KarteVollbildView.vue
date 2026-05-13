<script setup lang="ts">
import { computed } from 'vue'
import { useKundenStore } from '@/stores/kunden'
import { usePlanungStore } from '@/stores/planung'
import KarteView from '@/components/karte/KarteView.vue'
import KundenDetail from '@/components/kunde/KundenDetail.vue'

const kundenStore = useKundenStore()
const planung = usePlanungStore()

const alleBesuche = computed(() => planung.besucheForWeek)
</script>

<template>
  <div class="h-full relative">
    <KarteView
      :kunden="kundenStore.kunden"
      :besuche="alleBesuche"
      @kunde-click="planung.openKundenDetail"
    />

    <!-- Legende -->
    <div class="absolute top-3 left-3 bg-white rounded-xl shadow-md p-3 z-10">
      <p class="text-xs font-semibold text-gray-600 mb-2">Umsatzpotenzial</p>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
          <span class="text-xs text-gray-600">≥ 80 T€</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-yellow-400 border-2 border-white shadow-sm" />
          <span class="text-xs text-gray-600">20–80 T€</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
          <span class="text-xs text-gray-600">&lt; 20 T€</span>
        </div>
      </div>
      <div class="mt-2 pt-2 border-t border-gray-100 space-y-1">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-gray-400 border-2 border-white shadow-sm flex items-center justify-center">
            <span class="text-white text-[6px]">✓</span>
          </div>
          <span class="text-xs text-gray-600">Geplant</span>
        </div>
      </div>
    </div>

    <!-- KundenDetail Overlay -->
    <Transition name="slide-right">
      <KundenDetail
        v-if="planung.showKundenDetail && planung.detailKundeId"
        :kunden-id="planung.detailKundeId"
        @close="planung.closeKundenDetail"
      />
    </Transition>
  </div>
</template>
