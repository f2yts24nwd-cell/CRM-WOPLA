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
  if (tage.value > 60) return 'text-critical bg-critical/10'
  if (tage.value <= 30) return 'text-positive bg-positive/10'
  return 'text-text2 bg-surface2'
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
    <div class="fixed inset-0 z-50 flex flex-col justify-end bg-black/50"
      @click.self="emit('close')">
      <div class="bg-surface rounded-t-xl flex flex-col max-h-[65dvh]">
        <!-- Drag Handle -->
        <div class="flex-shrink-0 pt-3 pb-1">
          <div class="w-10 h-1 bg-border rounded-full mx-auto" />
        </div>

        <!-- Scrollbarer Inhalt -->
        <div class="flex-1 overflow-y-auto px-4 pb-2">
          <!-- Header -->
          <div class="flex items-start justify-between pt-2 pb-3 border-b border-border">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <Badge v-if="kunde" :label="kunde.abcStatus" :variant="kunde.abcStatus" />
              <div class="min-w-0">
                <p class="font-bold text-text1 text-sm leading-tight truncate">{{ kunde?.name }}</p>
                <p class="text-xs text-text2">{{ kunde?.branche }}</p>
              </div>
            </div>
            <button @click="emit('close')"
              class="ml-2 shrink-0 w-8 h-8 flex items-center justify-center rounded bg-surface2 text-text2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- KPI-Leiste -->
          <div class="grid grid-cols-3 gap-2 mt-3 mb-3">
            <div class="bg-surface2 rounded-lg p-2.5 text-center border border-border">
              <p class="text-sm font-bold text-text1 tabular-nums leading-snug">
                {{ besuch?.startzeit }}<br>{{ besuch?.endzeit }}
              </p>
              <p class="text-xs text-text2 mt-0.5">Uhrzeit</p>
            </div>
            <div class="bg-brand/10 rounded-lg p-2.5 text-center border border-brand/20">
              <p class="text-sm font-bold text-brand leading-snug">
                {{ kunde ? (kunde.umsatzPotenzial / 1000).toFixed(0) : '–' }} T€
              </p>
              <p class="text-xs text-brand/70 mt-0.5">Potenzial</p>
            </div>
            <div :class="['rounded-lg p-2.5 text-center border border-transparent', tageKlasse]">
              <p class="text-sm font-bold leading-snug">{{ tage }} T.</p>
              <p class="text-xs mt-0.5 opacity-60">kein Bes.</p>
            </div>
          </div>

          <!-- Termin-Notiz -->
          <p v-if="besuch?.notiz" class="text-xs text-text2 italic mb-3 truncate">
            „{{ besuch.notiz }}"
          </p>

          <!-- Letzter Kontakt -->
          <div v-if="letzteAktivitaet" class="mb-3">
            <p class="text-xs font-semibold text-text2 uppercase tracking-wide mb-1.5">Zuletzt</p>
            <div class="flex items-start gap-2 bg-surface2 rounded-lg px-3 py-2.5">
              <span class="text-base leading-none mt-0.5">{{ aktivitaetIcon(letzteAktivitaet.typ) }}</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <span class="text-xs font-semibold text-text1">{{ letzteAktivitaet.typ }}</span>
                  <span class="text-xs text-text2">{{ formatDate(letzteAktivitaet.datum) }}</span>
                </div>
                <p class="text-xs text-text1 truncate">{{ letzteAktivitaet.notiz }}</p>
              </div>
            </div>
          </div>

          <!-- Pipeline -->
          <div class="mb-3">
            <p class="text-xs font-semibold text-text2 uppercase tracking-wide mb-1.5">Pipeline</p>
            <div class="bg-surface2 rounded-lg px-3 py-2.5 space-y-1">
              <div v-if="offeneOpps.length > 0" class="flex items-center justify-between">
                <span class="text-xs text-text1">
                  {{ offeneOpps.length }} offene {{ offeneOpps.length === 1 ? 'Opportunity' : 'Opportunities' }}
                </span>
                <span class="text-xs font-semibold text-brand">{{ (offenerWert / 1000).toFixed(0) }} T€</span>
              </div>
              <div v-if="gesendeteAngebote.length > 0" class="flex items-center justify-between">
                <span class="text-xs text-text1">
                  {{ gesendeteAngebote.length }} {{ gesendeteAngebote.length === 1 ? 'Angebot' : 'Angebote' }} gesendet
                </span>
                <span class="text-xs text-text2">ausstehend</span>
              </div>
              <p v-if="offeneOpps.length === 0 && gesendeteAngebote.length === 0"
                class="text-xs text-text2">Keine aktive Pipeline</p>
            </div>
          </div>

          <!-- Primärer Ansprechpartner -->
          <div v-if="primaererKontakt" class="mb-4">
            <p class="text-xs font-semibold text-text2 uppercase tracking-wide mb-1.5">Kontakt</p>
            <div class="bg-surface2 rounded-lg px-3 py-2.5">
              <p class="text-sm font-semibold text-text1">{{ primaererKontakt.name }}</p>
              <p class="text-xs text-text2 mb-2.5">{{ primaererKontakt.rolle }}</p>
              <div class="flex gap-2">
                <a :href="`tel:${primaererKontakt.telefon}`"
                  class="flex-1 py-2 rounded text-xs font-semibold bg-surface border border-border text-text1 flex items-center justify-center gap-1 active:bg-surface2">
                  📞 Anrufen
                </a>
                <a :href="`mailto:${primaererKontakt.email}`"
                  class="flex-1 py-2 rounded text-xs font-semibold bg-surface border border-border text-text1 flex items-center justify-center gap-1 active:bg-surface2">
                  ✉ E-Mail
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex-shrink-0 px-4 py-3 border-t border-border"
          style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem)">
          <button v-if="kunde"
            @click="emit('open-vollprofil', kunde.id)"
            class="w-full py-3 rounded font-semibold text-white bg-brand-active active:bg-brand text-sm">
            Vollprofil öffnen
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
