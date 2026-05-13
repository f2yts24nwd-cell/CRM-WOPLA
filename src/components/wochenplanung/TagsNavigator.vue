<script setup lang="ts">
import { computed } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { addDays, formatShortDate, getKW } from '@/utils/dates'

const planung = usePlanungStore()

const tage = computed(() =>
  planung.WOCHENTAGE.map((tag, i) => ({
    tag,
    datum: addDays(planung.wocheStart, i),
    anzahl: planung.besucheForTag(tag).length
  }))
)

const kw = computed(() => getKW(planung.wocheStart))
</script>

<template>
  <div class="bg-white border-b border-gray-200">
    <!-- Wochennavigation -->
    <div class="flex items-center justify-between px-4 py-2">
      <button @click="planung.vorigeWoche()"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="text-sm font-semibold text-gray-700">KW {{ kw }}</span>
      <button @click="planung.naechsteWoche()"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Tagauswahl -->
    <div class="flex px-2 pb-2 gap-1">
      <button
        v-for="{ tag, datum, anzahl } in tage"
        :key="tag"
        @click="planung.selectedTag = tag"
        :class="[
          'flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-colors',
          planung.selectedTag === tag
            ? 'bg-primary-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        <span>{{ tag }}</span>
        <span :class="planung.selectedTag === tag ? 'text-primary-100' : 'text-gray-400'">
          {{ formatShortDate(datum) }}
        </span>
        <span v-if="anzahl > 0"
          :class="[
            'mt-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold',
            planung.selectedTag === tag ? 'bg-white text-primary-500' : 'bg-primary-100 text-primary-600'
          ]">
          {{ anzahl }}
        </span>
      </button>
    </div>
  </div>
</template>
