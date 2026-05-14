<script setup lang="ts">
import { ref } from 'vue'
import type { Besuch, Kunde } from '@/types'
import Badge from '@/components/ui/Badge.vue'
import { daysSince } from '@/utils/geo'

const props = defineProps<{
  besuch: Besuch
  kunde: Kunde
  rank?: number
}>()

const emit = defineEmits<{
  (e: 'ausgefallen', besuchId: string): void
  (e: 'detail-open', kundeId: string): void
  (e: 'detail-schnell', besuchId: string): void
  (e: 'ki-ersatz', besuchId: string): void
}>()

const showConfirm = ref(false)

function bestaetigenAusgefallen() {
  showConfirm.value = false
  emit('ausgefallen', props.besuch.id)
  emit('ki-ersatz', props.besuch.id)
}

function randFarbe(): string {
  if (props.besuch.status === 'abgeschlossen') return 'bg-green-500'
  if (props.besuch.status === 'ausgefallen') return 'bg-red-400'
  return 'bg-primary-500'
}
</script>

<template>
  <div :class="[
    'bg-white rounded-xl shadow-sm border mx-3 my-2 overflow-hidden',
    besuch.status === 'ausgefallen' ? 'border-red-100 opacity-80' : 'border-gray-100',
    besuch.status === 'abgeschlossen' ? 'border-green-100' : ''
  ]">
    <div class="flex">
      <!-- Farbiger Status-Rand -->
      <div :class="['w-1 shrink-0', randFarbe()]" />

      <div class="flex-1 min-w-0">
        <!-- Klickbarer Hauptbereich -->
        <button class="w-full text-left px-3 pt-3 pb-2" @click="emit('detail-open', kunde.id)">
          <!-- Zeile 1: Uhrzeit + ABC + Tage -->
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-sm font-bold text-gray-800 tabular-nums">
              {{ besuch.startzeit }} – {{ besuch.endzeit }}
            </span>
            <div class="flex items-center gap-1.5">
              <span class="text-xs text-gray-400">{{ daysSince(kunde.letzterBesuch) }} Tage</span>
              <Badge :label="kunde.abcStatus" :variant="kunde.abcStatus" />
            </div>
          </div>

          <!-- Zeile 2: Kundenname -->
          <p class="font-semibold text-gray-900 text-sm leading-tight truncate">{{ kunde.name }}</p>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ kunde.adresse }}</p>

          <p v-if="besuch.notiz" class="text-xs text-gray-500 mt-1.5 italic truncate">
            {{ besuch.notiz }}
          </p>
        </button>

        <!-- Aktionen für geplante Termine -->
        <div v-if="besuch.status === 'geplant' && !showConfirm"
          class="flex gap-2 px-3 pb-3">
          <button
            class="flex-1 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 bg-white active:bg-gray-50"
            @click.stop="showConfirm = true"
          >
            Ausgefallen
          </button>
          <button
            class="flex-1 py-2 rounded-lg text-xs font-semibold bg-primary-500 text-white active:bg-primary-700"
            @click.stop="emit('detail-schnell', besuch.id)"
          >
            Details
          </button>
        </div>

        <!-- Bestätigungsdialog -->
        <div v-if="showConfirm" class="mx-3 mb-3 bg-red-50 rounded-xl p-3">
          <p class="text-xs text-red-700 font-semibold mb-2">Termin als ausgefallen markieren?</p>
          <div class="flex gap-2">
            <button @click.stop="bestaetigenAusgefallen"
              class="flex-1 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg">
              Ja, ausgefallen
            </button>
            <button @click.stop="showConfirm = false"
              class="flex-1 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">
              Abbrechen
            </button>
          </div>
        </div>

        <!-- Ausgefallen: KI-Ersatz -->
        <div v-if="besuch.status === 'ausgefallen'" class="px-3 pb-3">
          <button @click.stop="emit('ki-ersatz', besuch.id)"
            class="w-full py-2 rounded-lg text-xs font-semibold bg-primary-50 border border-primary-200 text-primary-600 active:bg-primary-100 flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            KI-Ersatz vorschlagen
          </button>
        </div>

        <!-- Abgeschlossen: keine weitere Aktion -->
        <div v-if="besuch.status === 'abgeschlossen'" class="px-3 pb-3">
          <p class="text-xs text-green-600 font-semibold">✓ Besuch abgeschlossen</p>
        </div>
      </div>
    </div>
  </div>
</template>
