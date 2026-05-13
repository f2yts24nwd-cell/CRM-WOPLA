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
  (e: 'ki-ersatz', besuchId: string): void
}>()

const showConfirm = ref(false)

function onAusgefallenClick() {
  if (props.besuch.status !== 'ausgefallen') {
    showConfirm.value = true
  }
}

function bestaetigenAusgefallen() {
  showConfirm.value = false
  emit('ausgefallen', props.besuch.id)
  emit('ki-ersatz', props.besuch.id)
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-sm border mx-3 my-2 overflow-hidden transition-all',
      besuch.status === 'ausgefallen' ? 'border-red-200 opacity-75' : 'border-gray-100',
      besuch.status === 'abgeschlossen' ? 'border-green-200' : ''
    ]"
  >
    <!-- Hauptinhalt -->
    <button
      class="w-full text-left p-3"
      @click="emit('detail-open', kunde.id)"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <Badge :label="kunde.abcStatus" :variant="kunde.abcStatus" />
            <span v-if="rank" class="text-xs text-gray-400 font-medium">Termin {{ rank }}</span>
          </div>
          <p class="font-semibold text-gray-900 text-sm leading-tight truncate">{{ kunde.name }}</p>
          <p class="text-xs text-gray-500 mt-0.5 truncate">{{ kunde.adresse }}</p>
          <p class="text-xs text-gray-400 mt-1">
            Letzter Besuch: {{ daysSince(kunde.letzterBesuch) }} Tage
          </p>
        </div>
        <div class="flex flex-col items-end shrink-0">
          <span class="text-sm font-semibold text-primary-600">{{ besuch.startzeit }}</span>
          <span class="text-xs text-gray-400">{{ besuch.endzeit }}</span>
          <Badge
            v-if="besuch.status !== 'geplant'"
            :label="besuch.status === 'abgeschlossen' ? 'Erledigt' : 'Ausgefallen'"
            :variant="besuch.status"
            class="mt-1"
          />
        </div>
      </div>

      <p v-if="besuch.notiz" class="text-xs text-gray-500 mt-2 italic truncate">
        {{ besuch.notiz }}
      </p>
    </button>

    <!-- Aktionen -->
    <div v-if="besuch.status === 'geplant'" class="border-t border-gray-100">
      <button
        v-if="!showConfirm"
        @click.stop="onAusgefallenClick"
        class="w-full py-3 text-sm font-medium text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Termin ausgefallen
      </button>
      <div v-else class="px-3 py-2 bg-red-50">
        <p class="text-xs text-red-700 font-medium mb-2">Termin wirklich als ausgefallen markieren?</p>
        <div class="flex gap-2">
          <button @click.stop="bestaetigenAusgefallen"
            class="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-lg">
            Ja, ausgefallen
          </button>
          <button @click.stop="showConfirm = false"
            class="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
            Abbrechen
          </button>
        </div>
      </div>
    </div>

    <!-- KI-Ersatz anzeigen, wenn ausgefallen -->
    <div v-if="besuch.status === 'ausgefallen'" class="border-t border-red-100">
      <button @click.stop="emit('ki-ersatz', besuch.id)"
        class="w-full py-3 text-sm font-medium text-primary-500 hover:bg-primary-50 flex items-center justify-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        KI-Ersatz vorschlagen
      </button>
    </div>
  </div>
</template>
