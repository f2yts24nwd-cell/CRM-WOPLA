<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Besuch, Kunde } from '@/types'
import Badge from '@/components/ui/Badge.vue'
import { useKundenStore } from '@/stores/kunden'
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

const kundenStore = useKundenStore()
const showConfirm = ref(false)

const offeneOpps = computed(() =>
  kundenStore.getOpportunitiesForKunde(props.besuch.kundeId).filter((o) => o.status === 'offen')
)
const offenerWert = computed(() => offeneOpps.value.reduce((s, o) => s + o.wert, 0))
const primaerKontakt = computed(() => kundenStore.getAnsprechpartnerForKunde(props.besuch.kundeId)[0])

function bestaetigenAusgefallen() {
  showConfirm.value = false
  emit('ausgefallen', props.besuch.id)
  emit('ki-ersatz', props.besuch.id)
}

function randFarbe(): string {
  if (props.besuch.status === 'abgeschlossen') return 'bg-positive'
  if (props.besuch.status === 'ausgefallen')   return 'bg-negative'
  return 'bg-brand-active'
}

function routeStarten() {
  const enc = encodeURIComponent(props.kunde.adresse)
  const url = /iPhone|iPad/.test(navigator.userAgent)
    ? `maps://maps.apple.com/?daddr=${enc}`
    : `https://www.google.com/maps/dir/?api=1&destination=${enc}`
  window.open(url, '_blank')
}
</script>

<template>
  <div :class="[
    'bg-surface rounded-lg border mx-3 my-2 overflow-hidden',
    besuch.status === 'ausgefallen' ? 'border-negative/30 opacity-75' : 'border-border',
    besuch.status === 'abgeschlossen' ? 'border-positive/30' : ''
  ]">
    <div class="flex">
      <!-- Farbiger Status-Rand -->
      <div :class="['w-1 shrink-0', randFarbe()]" />

      <div class="flex-1 min-w-0">
        <!-- Klickbarer Hauptbereich -->
        <button class="w-full text-left px-3 pt-3 pb-2" @click="emit('detail-schnell', besuch.id)">
          <!-- Zeile 1: Uhrzeit + ABC + Tage -->
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-sm font-bold text-text1 tabular-nums">
              {{ besuch.startzeit }} – {{ besuch.endzeit }}
            </span>
            <div class="flex items-center gap-1.5">
              <span class="text-xs text-text2">{{ daysSince(kunde.letzterBesuch) }} Tage</span>
              <Badge :label="kunde.abcStatus" :variant="kunde.abcStatus" />
            </div>
          </div>

          <!-- Zeile 2: Kundenname -->
          <p class="font-semibold text-text1 text-sm leading-tight truncate">{{ kunde.name }}</p>
          <p class="text-xs text-text2 mt-0.5 truncate">{{ kunde.adresse }}</p>

          <p v-if="besuch.notiz" class="text-xs text-text2 mt-1 italic truncate">
            {{ besuch.notiz }}
          </p>

          <!-- Pipeline-Indikator -->
          <p v-if="offeneOpps.length > 0" class="text-xs font-medium text-critical mt-1">
            🔥 {{ (offenerWert / 1000).toFixed(0) }} T€ Pipeline aktiv
          </p>
        </button>

        <!-- Aktionen für geplante Termine -->
        <div v-if="besuch.status === 'geplant' && !showConfirm"
          class="flex gap-1.5 px-3 pb-3">
          <!-- Schnell-Anruf -->
          <a v-if="primaerKontakt" :href="`tel:${primaerKontakt.telefon}`"
            class="w-9 h-9 flex items-center justify-center rounded border border-border text-brand bg-surface active:bg-surface2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </a>
          <!-- Navigation -->
          <button @click.stop="routeStarten"
            class="w-9 h-9 flex items-center justify-center rounded border border-border text-text2 bg-surface active:bg-surface2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </button>
          <button
            class="flex-1 py-2 rounded text-xs font-semibold border border-border text-text1 bg-surface active:bg-surface2"
            @click.stop="showConfirm = true"
          >
            Ausgefallen
          </button>
          <button
            class="flex-1 py-2 rounded text-xs font-semibold bg-brand-active text-white active:bg-brand"
            @click.stop="emit('detail-schnell', besuch.id)"
          >
            Details
          </button>
        </div>

        <!-- Bestätigungsdialog -->
        <div v-if="showConfirm" class="mx-3 mb-3 bg-negative/10 rounded-lg p-3">
          <p class="text-xs text-negative font-semibold mb-2">Termin als ausgefallen markieren?</p>
          <div class="flex gap-2">
            <button @click.stop="bestaetigenAusgefallen"
              class="flex-1 py-2 bg-negative text-white text-xs font-semibold rounded">
              Ja, ausgefallen
            </button>
            <button @click.stop="showConfirm = false"
              class="flex-1 py-2 bg-surface2 text-text1 text-xs font-semibold rounded">
              Abbrechen
            </button>
          </div>
        </div>

        <!-- Ausgefallen: KI-Ersatz -->
        <div v-if="besuch.status === 'ausgefallen'" class="px-3 pb-3">
          <button @click.stop="emit('ki-ersatz', besuch.id)"
            class="w-full py-2 rounded text-xs font-semibold bg-brand/10 border border-brand/20 text-brand active:bg-brand/20 flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            KI-Ersatz vorschlagen
          </button>
        </div>

        <!-- Abgeschlossen -->
        <div v-if="besuch.status === 'abgeschlossen'" class="px-3 pb-3">
          <p class="text-xs text-positive font-semibold">✓ Besuch abgeschlossen</p>
        </div>
      </div>
    </div>
  </div>
</template>
