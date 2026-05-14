<script setup lang="ts">
import type { KiEmpfehlungResult } from '@/types'
import Badge from '@/components/ui/Badge.vue'
import { usePlanungStore } from '@/stores/planung'

const props = defineProps<{
  empfehlung: KiEmpfehlungResult
  rank: number
  zieldatum?: Date
}>()

const emit = defineEmits<{ (e: 'hinzugefuegt'): void }>()

const planung = usePlanungStore()

const startzeiten = ['09:00', '10:30', '11:00', '13:00', '14:00', '15:00', '16:00']
const endzeiten = ['10:00', '11:30', '12:00', '14:00', '15:00', '16:00', '17:00']

function terminHinzufuegen() {
  const heute = props.zieldatum ?? new Date()
  const idx = Math.floor(Math.random() * 3)
  planung.besuchHinzufuegen(props.empfehlung.kunde.id, heute, startzeiten[idx], endzeiten[idx])
  emit('hinzugefuegt')
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-positive'
  if (score >= 60) return 'text-critical'
  return 'text-negative'
}
</script>

<template>
  <div class="bg-surface rounded-lg border border-border p-4">
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center">
          {{ rank }}
        </span>
        <Badge :label="empfehlung.kunde.abcStatus" :variant="empfehlung.kunde.abcStatus" />
      </div>
      <div class="text-right">
        <span :class="['text-lg font-bold', scoreColor(empfehlung.score)]">{{ empfehlung.score }}</span>
        <span class="text-xs text-text2">/100</span>
      </div>
    </div>

    <h3 class="font-semibold text-text1 text-sm mb-0.5">{{ empfehlung.kunde.name }}</h3>
    <p class="text-xs text-text2 mb-2">{{ empfehlung.kunde.adresse }}</p>
    <p class="text-xs text-text2 italic mb-3">{{ empfehlung.begruendung }}</p>

    <div class="flex gap-2 text-xs text-text2 mb-3">
      <span class="bg-surface2 border border-border px-2 py-1 rounded">
        {{ (empfehlung.kunde.umsatzPotenzial / 1000).toFixed(0) }} T€ Potenzial
      </span>
      <span class="bg-surface2 border border-border px-2 py-1 rounded">{{ empfehlung.kunde.branche }}</span>
    </div>

    <button
      @click="terminHinzufuegen"
      class="w-full py-2.5 bg-brand-active active:bg-brand text-white text-sm font-semibold rounded flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Termin hinzufügen
    </button>
  </div>
</template>
