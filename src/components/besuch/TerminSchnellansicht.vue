<script setup lang="ts">
import { computed } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import Badge from '@/components/ui/Badge.vue'
import { daysSince } from '@/utils/geo'
import { formatDate } from '@/utils/dates'

const props = defineProps<{ besuchId: string }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-vollprofil', kundeId: string): void
}>()

const planung = usePlanungStore()
const kundenStore = useKundenStore()

const besuch = computed(() => planung.besuche.find((b) => b.id === props.besuchId))
const kunde = computed(() => besuch.value ? kundenStore.getKundeById(besuch.value.kundeId) : undefined)
const aktivitaeten = computed(() => besuch.value ? kundenStore.getAktivitaetenForKunde(besuch.value.kundeId) : [])
const letzteAktivitaet = computed(() => aktivitaeten.value[0])
const ansprechpartner = computed(() => besuch.value ? kundenStore.getAnsprechpartnerForKunde(besuch.value.kundeId) : [])
const primaererKontakt = computed(() => ansprechpartner.value[0])

const opportunities = computed(() => besuch.value ? kundenStore.getOpportunitiesForKunde(besuch.value.kundeId) : [])
const angebote = computed(() => besuch.value ? kundenStore.getAngeboteForKunde(besuch.value.kundeId) : [])

const offeneOpps = computed(() => opportunities.value.filter((o) => o.status === 'offen'))
const offenerWert = computed(() => offeneOpps.value.reduce((sum, o) => sum + o.wert, 0))
const gesendeteAngebote = computed(() => angebote.value.filter((a) => a.status === 'Gesendet'))

const tage = computed(() => kunde.value ? daysSince(kunde.value.letzterBesuch) : 0)
const tageKlasse = computed(() => {
  if (tage.value > 60) return 'text-orange-600 bg-orange-50'
  if (tage.value <= 30) return 'text-green-600 bg-green-50'
  return 'text-gray-600 bg-gray-50'
})

function aktivitaetIcon(typ: string): string {
  if (typ === 'Anruf') return '📞'
  if (typ === 'Email') return '📧'
  if (typ === 'Besuch') return '🤝'
  return '📄'
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="emit('close')">
      <div class="bg-white rounded-t-2xl flex flex-col max-h-[65dvh]">
        <!-- Drag Handle -->
        <div class="flex-shrink-0 pt-3 pb-1">
          <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        </div>

        <!-- Scrollbarer Inhalt -->
        <div class="flex-1 overflow-y-auto px-4 pb-2">
          <!-- Header -->
          <div class="flex items-start justify-between pt-2 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <Badge v-if="kunde" :label="kunde.abcStatus" :variant="kunde.abcStatus" />
              <div class="min-w-0">
                <p class="font-bold text-gray-900 text-sm leading-tight truncate">{{ kunde?.name }}</p>
                <p class="text-xs text-gray-400">{{ kunde?.branche }}</p>
              </div>
            </div>
            <button @click="emit('close')"
              class="ml-2 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- KPI-Leiste -->
          <div class="grid grid-cols-3 gap-2 mt-3 mb-3">
            <div class="bg-gray-50 rounded-xl p-2.5 text-center">
              <p class="text-sm font-bold text-gray-900 tabular-nums leading-snug">
                {{ besuch?.startzeit }}<br>{{ besuch?.endzeit }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">Uhrzeit</p>
            </div>
            <div class="bg-primary-50 rounded-xl p-2.5 text-center">
              <p class="text-sm font-bold text-primary-600 leading-snug">
                {{ kunde ? (kunde.umsatzPotenzial / 1000).toFixed(0) : '–' }} T€
              </p>
              <p class="text-xs text-primary-400 mt-0.5">Potenzial</p>
            </div>
            <div :class="['rounded-xl p-2.5 text-center', tageKlasse]">
              <p class="text-sm font-bold leading-snug">{{ tage }} T.</p>
              <p class="text-xs mt-0.5 opacity-60">kein Bes.</p>
            </div>
          </div>

          <!-- Termin-Notiz -->
          <p v-if="besuch?.notiz" class="text-xs text-gray-500 italic mb-3 truncate">
            „{{ besuch.notiz }}"
          </p>

          <!-- Letzter Kontakt -->
          <div v-if="letzteAktivitaet" class="mb-3">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Zuletzt</p>
            <div class="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <span class="text-base leading-none mt-0.5">{{ aktivitaetIcon(letzteAktivitaet.typ) }}</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <span class="text-xs font-semibold text-gray-600">{{ letzteAktivitaet.typ }}</span>
                  <span class="text-xs text-gray-400">{{ formatDate(letzteAktivitaet.datum) }}</span>
                </div>
                <p class="text-xs text-gray-600 truncate">{{ letzteAktivitaet.notiz }}</p>
              </div>
            </div>
          </div>

          <!-- Pipeline -->
          <div class="mb-3">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Pipeline</p>
            <div class="bg-gray-50 rounded-xl px-3 py-2.5 space-y-1">
              <div v-if="offeneOpps.length > 0" class="flex items-center justify-between">
                <span class="text-xs text-gray-600">
                  {{ offeneOpps.length }} offene {{ offeneOpps.length === 1 ? 'Opportunity' : 'Opportunities' }}
                </span>
                <span class="text-xs font-semibold text-primary-600">{{ (offenerWert / 1000).toFixed(0) }} T€</span>
              </div>
              <div v-if="gesendeteAngebote.length > 0" class="flex items-center justify-between">
                <span class="text-xs text-gray-600">
                  {{ gesendeteAngebote.length }} {{ gesendeteAngebote.length === 1 ? 'Angebot' : 'Angebote' }} gesendet
                </span>
                <span class="text-xs text-gray-400">ausstehend</span>
              </div>
              <p v-if="offeneOpps.length === 0 && gesendeteAngebote.length === 0"
                class="text-xs text-gray-400">Keine aktive Pipeline</p>
            </div>
          </div>

          <!-- Primärer Ansprechpartner -->
          <div v-if="primaererKontakt" class="mb-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Kontakt</p>
            <div class="bg-gray-50 rounded-xl px-3 py-2.5">
              <p class="text-sm font-semibold text-gray-900">{{ primaererKontakt.name }}</p>
              <p class="text-xs text-gray-400 mb-2.5">{{ primaererKontakt.rolle }}</p>
              <div class="flex gap-2">
                <a :href="`tel:${primaererKontakt.telefon}`"
                  class="flex-1 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 flex items-center justify-center gap-1 active:bg-gray-50">
                  📞 Anrufen
                </a>
                <a :href="`mailto:${primaererKontakt.email}`"
                  class="flex-1 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 flex items-center justify-center gap-1 active:bg-gray-50">
                  ✉ E-Mail
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex-shrink-0 px-4 py-3 border-t border-gray-100"
          style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem)">
          <button v-if="kunde"
            @click="emit('open-vollprofil', kunde.id)"
            class="w-full py-3 rounded-xl font-semibold text-white bg-primary-500 active:bg-primary-700 text-sm">
            Vollprofil öffnen
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
