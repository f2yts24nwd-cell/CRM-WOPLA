<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKundenStore } from '@/stores/kunden'
import { useKiStore } from '@/stores/ki'
import Badge from '@/components/ui/Badge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import KiPanel from '@/components/ki/KiPanel.vue'
import { formatDate } from '@/utils/dates'
import { daysSince } from '@/utils/geo'
import type { KiGespraechResult } from '@/types'

const props = defineProps<{ kundeId: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

type Tab = 'uebersicht' | 'verlauf' | 'pipeline'
const activeTab = ref<Tab>('uebersicht')

const kundenStore = useKundenStore()
const ki = useKiStore()

const kunde = computed(() => kundenStore.getKundeById(props.kundeId))
const ansprechpartner = computed(() => kundenStore.getAnsprechpartnerForKunde(props.kundeId))
const aktivitaeten = computed(() => kundenStore.getAktivitaetenForKunde(props.kundeId))
const opportunities = computed(() => kundenStore.getOpportunitiesForKunde(props.kundeId))
const angebote = computed(() => kundenStore.getAngeboteForKunde(props.kundeId))

const showKiPanel = ref(false)
const kiGespraech = ref<KiGespraechResult | null>(null)

async function gespraechVorbereiten() {
  if (!kunde.value) return
  showKiPanel.value = true
  kiGespraech.value = null
  kiGespraech.value = await ki.erstelleGespraechsvorbereitung(
    kunde.value,
    aktivitaeten.value,
    opportunities.value
  )
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'uebersicht', label: 'Übersicht' },
  { key: 'verlauf', label: 'Verlauf' },
  { key: 'pipeline', label: 'Pipeline' }
]

function typIcon(typ: string): string {
  if (typ === 'Besuch') return '🤝'
  if (typ === 'Anruf') return '📞'
  return '📧'
}
</script>

<template>
  <div v-if="kunde" class="fixed inset-0 z-40 bg-white flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 pt-4 pb-3"
         style="padding-top: calc(env(safe-area-inset-top) + 1rem)">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <Badge :label="kunde.abcStatus" :variant="kunde.abcStatus" />
            <span class="text-xs text-gray-400">{{ kunde.kundennummer }}</span>
          </div>
          <h2 class="font-bold text-gray-900 text-base leading-tight">{{ kunde.name }}</h2>
          <p class="text-sm text-gray-500 mt-0.5">{{ kunde.branche }}</p>
        </div>
        <button @click="emit('close')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 ml-2 shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 3 Tabs -->
      <div class="flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
            activeTab === tab.key ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">

      <!-- Übersicht -->
      <div v-if="activeTab === 'uebersicht'" class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-xs text-gray-400 mb-1">Letzter Besuch</p>
            <p class="font-semibold text-gray-900 text-sm">{{ formatDate(kunde.letzterBesuch) }}</p>
            <p class="text-xs text-primary-500">vor {{ daysSince(kunde.letzterBesuch) }} Tagen</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-xs text-gray-400 mb-1">Umsatzpotenzial</p>
            <p class="font-semibold text-gray-900 text-sm">{{ (kunde.umsatzPotenzial / 1000).toFixed(0) }} T€</p>
            <p class="text-xs text-teal-500">{{ opportunities.filter(o => o.status === 'offen').length }} offene Opp.</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-1">Adresse</p>
          <p class="font-medium text-gray-900 text-sm">{{ kunde.adresse }}</p>
        </div>

        <!-- Ansprechpartner direkt in Übersicht -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ansprechpartner</p>
          <div v-for="ap in ansprechpartner" :key="ap.id"
            class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-gray-900 text-sm truncate">{{ ap.name }}</p>
              <p class="text-xs text-teal-600 font-medium">{{ ap.rolle }}</p>
            </div>
            <div class="flex gap-2 shrink-0">
              <a :href="`tel:${ap.telefon}`"
                class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </a>
              <a :href="`mailto:${ap.email}`"
                class="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Verlauf (Aktivitäten) -->
      <div v-else-if="activeTab === 'verlauf'" class="p-4">
        <div class="space-y-3">
          <div v-for="akt in aktivitaeten" :key="akt.id"
            class="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <div class="text-xl shrink-0 mt-0.5">{{ typIcon(akt.typ) }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold text-gray-600">{{ akt.typ }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(akt.datum) }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ akt.notiz }}</p>
            </div>
          </div>
          <div v-if="aktivitaeten.length === 0" class="text-center py-8 text-gray-400 text-sm">
            Keine Aktivitäten erfasst
          </div>
        </div>
      </div>

      <!-- Pipeline: Opportunities + Angebote -->
      <div v-else-if="activeTab === 'pipeline'" class="p-4 space-y-4">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Opportunities</p>
          <div class="space-y-2">
            <div v-for="op in opportunities" :key="op.id"
              class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div class="flex items-start justify-between mb-1.5">
                <p class="font-semibold text-gray-900 text-sm flex-1 pr-2">{{ op.titel }}</p>
                <Badge :label="op.status" :variant="op.status" />
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span class="font-semibold text-gray-900">{{ op.wert.toLocaleString('de-DE') }} €</span>
                <span>Abschluss: {{ formatDate(op.abschlussDatum) }}</span>
              </div>
            </div>
            <div v-if="opportunities.length === 0" class="text-center py-4 text-gray-400 text-sm">
              Keine Opportunities
            </div>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Angebote</p>
          <div class="space-y-2">
            <div v-for="an in angebote" :key="an.id"
              class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div class="flex items-start justify-between mb-1.5">
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ an.nummer }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(an.erstelltAm) }}</p>
                </div>
                <Badge :label="an.status" :variant="an.status" />
              </div>
              <p class="text-sm font-bold text-gray-900">{{ an.summe.toLocaleString('de-DE') }} €</p>
            </div>
            <div v-if="angebote.length === 0" class="text-center py-4 text-gray-400 text-sm">
              Keine Angebote
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KI Gesprächsvorbereitung -->
    <div class="border-t border-gray-200 p-4" style="padding-bottom: calc(env(safe-area-inset-bottom) + 1rem)">
      <button @click="gespraechVorbereiten"
        class="w-full py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        :disabled="ki.isLoading && ki.currentTask === 'gespraech'"
      >
        <LoadingSpinner v-if="ki.isLoading && ki.currentTask === 'gespraech'" size="sm" />
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        KI Gesprächsvorbereitung
      </button>
    </div>

    <!-- KI Panel -->
    <KiPanel
      v-if="showKiPanel"
      titel="Gesprächsvorbereitung"
      :is-loading="ki.isLoading && ki.currentTask === 'gespraech'"
      :gespraech="kiGespraech"
      @close="showKiPanel = false"
    />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
