<script setup lang="ts">
import { computed } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { addDays, formatShortDate, getKW } from '@/utils/dates'

const planung = usePlanungStore()

const tage = computed(() =>
  planung.WOCHENTAGE.map((tag, i) => ({
    tag,
    datum: addDays(planung.wocheStart, i),
    anzahl: planung.besucheForTag(tag).length,
    aufgaben: planung.folgeaktionenForTag(tag).length
  }))
)

const kw = computed(() => getKW(planung.wocheStart))
</script>

<template>
  <div class="bg-surface border-b border-border">
    <!-- Wochennavigation -->
    <div class="flex items-center justify-between px-4 py-2">
      <button @click="planung.vorigeWoche()"
        class="w-8 h-8 flex items-center justify-center rounded text-text2 hover:bg-surface2 active:bg-surface2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="text-sm font-semibold text-text1">KW {{ kw }}</span>
      <button @click="planung.naechsteWoche()"
        class="w-8 h-8 flex items-center justify-center rounded text-text2 hover:bg-surface2 active:bg-surface2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Fiori Underline-Tabs für Tagauswahl -->
    <div class="flex">
      <button
        v-for="{ tag, datum, anzahl, aufgaben } in tage"
        :key="tag"
        @click="planung.selectedTag = tag"
        :class="[
          'flex-1 flex flex-col items-center py-2 text-xs font-medium border-b-2 transition-colors',
          planung.selectedTag === tag
            ? 'text-brand border-brand'
            : 'text-text2 border-transparent'
        ]"
      >
        <span>{{ tag }}</span>
        <span :class="planung.selectedTag === tag ? 'text-brand/70' : 'text-text2'">
          {{ formatShortDate(datum) }}
        </span>
        <div class="flex items-center gap-0.5 mt-0.5 h-4">
          <span v-if="anzahl > 0"
            :class="[
              'w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold',
              planung.selectedTag === tag ? 'bg-brand text-white' : 'bg-brand/10 text-brand'
            ]">
            {{ anzahl }}
          </span>
          <span v-if="aufgaben > 0"
            :class="[
              'w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold',
              planung.selectedTag === tag ? 'bg-critical text-white' : 'bg-critical/10 text-critical'
            ]">
            {{ aufgaben }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
