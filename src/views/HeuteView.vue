<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import Badge from '@/components/ui/Badge.vue'
import KundenDetail from '@/components/kunde/KundenDetail.vue'
import TagsBriefing from '@/components/heute/TagsBriefing.vue'
import BesuchsberichtDialog from '@/components/besuch/BesuchsberichtDialog.vue'
import TerminSchnellansicht from '@/components/besuch/TerminSchnellansicht.vue'
import { formatDate } from '@/utils/dates'
import { daysSince } from '@/utils/geo'
import type { Besuch } from '@/types'

const planung = usePlanungStore()
const kundenStore = useKundenStore()

const berichtBesuchId = ref<string | null>(null)
const schnellansichtBesuchId = ref<string | null>(null)

const besuche = computed(() => planung.heutigeBesuche)

const erledigt = computed(() => besuche.value.filter((b) => b.status === 'abgeschlossen').length)
const gesamt = computed(() => besuche.value.length)
const fortschritt = computed(() => gesamt.value === 0 ? 0 : Math.round((erledigt.value / gesamt.value) * 100))

const heute = new Date()
const tagLabel = heute.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })

// Folgeaktionen-Widget: überfällige + heutige Aktionen
const offeneFolgeaktionen = computed(() => {
  const eod = new Date()
  eod.setHours(23, 59, 59, 999)
  return planung.folgeaktionen.filter((f) => !f.erledigt && f.faelligAm <= eod)
})

function randFarbe(b: Besuch): string {
  if (b.status === 'abgeschlossen') return 'bg-positive'
  if (b.status === 'ausgefallen')   return 'bg-negative'
  return 'bg-brand-active'
}

function statusLabel(b: Besuch): string {
  if (b.status === 'abgeschlossen') return 'Erledigt'
  if (b.status === 'ausgefallen')   return 'Ausgefallen'
  return 'Geplant'
}

function istNaechster(b: Besuch): boolean {
  return b.status === 'geplant' && !besuche.value.some(
    (x) => x.status === 'geplant' && x.startzeit < b.startzeit
  )
}

function typIcon(typ: string): string {
  if (typ === 'Anruf') return '📞'
  if (typ === 'Email') return '📧'
  if (typ === 'Besuch') return '🤝'
  return '📄'
}

function routeStarten(adresse: string) {
  const enc = encodeURIComponent(adresse)
  const url = /iPhone|iPad/.test(navigator.userAgent)
    ? `maps://maps.apple.com/?daddr=${enc}`
    : `https://www.google.com/maps/dir/?api=1&destination=${enc}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="flex flex-col h-full bg-page">
    <!-- Header mit Fortschritt -->
    <div class="bg-surface border-b border-border px-4 pt-4 pb-3">
      <div class="flex items-start justify-between mb-1">
        <div>
          <p class="text-xs text-text2 font-medium uppercase tracking-wide">Heute</p>
          <h1 class="text-base font-bold text-text1">{{ tagLabel }}</h1>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-brand">{{ erledigt }}<span class="text-base font-semibold text-text2">/{{ gesamt }}</span></p>
          <p class="text-xs text-text2">Besuche</p>
        </div>
      </div>
      <!-- Fortschrittsbalken -->
      <div class="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="fortschritt === 100 ? 'bg-positive' : 'bg-brand-active'"
          :style="{ width: fortschritt + '%' }"
        />
      </div>
      <p class="text-xs text-text2 mt-1">
        <span v-if="gesamt === 0">Keine Termine heute</span>
        <span v-else-if="fortschritt === 100" class="text-positive font-semibold">Alle Termine erledigt!</span>
        <span v-else>{{ gesamt - erledigt }} Termin{{ gesamt - erledigt !== 1 ? 'e' : '' }} ausstehend</span>
      </p>
    </div>

    <!-- Scrollbarer Inhalt -->
    <div class="flex-1 overflow-y-auto pb-4">
      <!-- KI-Briefing -->
      <TagsBriefing v-if="gesamt > 0" />

      <!-- Folgeaktionen-Widget -->
      <div v-if="offeneFolgeaktionen.length > 0"
        class="mx-3 mt-3 bg-critical/10 rounded-lg p-3 border border-critical/20">
        <p class="text-xs font-semibold text-critical mb-2">
          {{ offeneFolgeaktionen.length }} Folgeaktion{{ offeneFolgeaktionen.length > 1 ? 'en' : '' }} überfällig
        </p>
        <div v-for="f in offeneFolgeaktionen.slice(0, 3)" :key="f.id"
          class="flex items-center gap-2 py-1.5 cursor-pointer border-t border-critical/10 first:border-t-0"
          @click="planung.openKundenDetail(f.kundeId)">
          <span class="text-sm shrink-0">{{ typIcon(f.typ) }}</span>
          <span class="text-xs text-text1 truncate flex-1">{{ f.beschreibung }}</span>
          <button @click.stop="planung.folgeaktionErledigen(f.id)"
            class="text-xs text-positive font-semibold shrink-0 px-2 py-0.5 rounded bg-positive/10">✓</button>
        </div>
      </div>

      <!-- Leerer Tag -->
      <div v-if="gesamt === 0" class="flex flex-col items-center justify-center h-48 text-text2 px-6 text-center mt-8">
        <svg class="w-12 h-12 mb-3 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="font-semibold text-text1">Keine Termine heute</p>
        <p class="text-sm mt-1">Nutze die Umkreissuche um spontane Besuche zu finden.</p>
      </div>

      <!-- Terminliste -->
      <div class="mt-3 space-y-2 px-3">
        <div v-for="besuch in besuche" :key="besuch.id"
          class="bg-surface rounded-lg border border-border overflow-hidden"
          :class="istNaechster(besuch) ? 'ring-2 ring-brand ring-offset-1 ring-offset-surface' : ''">
          <!-- Linker Status-Rand + Inhalt -->
          <div class="flex">
            <div :class="['w-1 shrink-0', randFarbe(besuch)]" />
            <div class="flex-1 p-3">
              <!-- Zeile 1: Uhrzeit + Status -->
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-bold text-text1 tabular-nums">
                  {{ besuch.startzeit }} – {{ besuch.endzeit }}
                </span>
                <span v-if="istNaechster(besuch)"
                  class="text-xs font-semibold text-brand">
                  Als nächstes
                </span>
                <span v-else-if="besuch.status === 'abgeschlossen'"
                  class="text-xs font-semibold text-positive">
                  ✓ Erledigt
                </span>
                <span v-else-if="besuch.status === 'ausgefallen'"
                  class="text-xs font-semibold text-negative">
                  ✕ Ausgefallen
                </span>
              </div>

              <!-- Zeile 2: Kundeninfo -->
              <template v-if="kundenStore.getKundeById(besuch.kundeId) as any">
                <div class="flex items-center gap-2 mb-0.5">
                  <Badge :label="kundenStore.getKundeById(besuch.kundeId)!.abcStatus"
                    :variant="kundenStore.getKundeById(besuch.kundeId)!.abcStatus" />
                  <span class="font-semibold text-text1 text-sm">
                    {{ kundenStore.getKundeById(besuch.kundeId)!.name }}
                  </span>
                </div>
                <p class="text-xs text-text2 mb-0.5">
                  {{ kundenStore.getKundeById(besuch.kundeId)!.adresse }}
                </p>
                <p class="text-xs text-text2">
                  Letzter Besuch: {{ formatDate(kundenStore.getKundeById(besuch.kundeId)!.letzterBesuch) }}
                  · <span class="text-brand">{{ daysSince(kundenStore.getKundeById(besuch.kundeId)!.letzterBesuch) }} Tage</span>
                </p>
                <!-- Pipeline-Indikator -->
                <div v-if="kundenStore.getOpportunitiesForKunde(besuch.kundeId).filter(o => o.status === 'offen').length > 0"
                  class="mt-0.5">
                  <span class="text-xs font-medium text-critical">
                    🔥 {{ (kundenStore.getOpportunitiesForKunde(besuch.kundeId).filter(o => o.status === 'offen').reduce((s, o) => s + o.wert, 0) / 1000).toFixed(0) }} T€ Pipeline aktiv
                  </span>
                </div>
              </template>

              <!-- Bericht-Zusammenfassung falls abgeschlossen -->
              <div v-if="besuch.status === 'abgeschlossen' && planung.getBerichtForBesuch(besuch.id)"
                class="mt-2 bg-positive/10 rounded px-3 py-2">
                <p class="text-xs text-positive line-clamp-2">
                  {{ planung.getBerichtForBesuch(besuch.id)!.zusammenfassung }}
                </p>
              </div>

              <!-- Aktions-Buttons -->
              <div class="mt-2.5 flex gap-2 items-center">
                <!-- Schnell-Anruf -->
                <a v-if="kundenStore.getAnsprechpartnerForKunde(besuch.kundeId)[0]"
                  :href="`tel:${kundenStore.getAnsprechpartnerForKunde(besuch.kundeId)[0].telefon}`"
                  class="w-9 h-9 flex items-center justify-center rounded border border-border text-brand bg-surface active:bg-surface2 shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </a>

                <!-- Navigation starten -->
                <button v-if="kundenStore.getKundeById(besuch.kundeId)"
                  @click="routeStarten(kundenStore.getKundeById(besuch.kundeId)!.adresse)"
                  class="w-9 h-9 flex items-center justify-center rounded border border-border text-text2 bg-surface active:bg-surface2 shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </button>

                <!-- Detail-Button -->
                <button
                  class="flex-1 py-2 rounded text-xs font-semibold border border-border text-text1 bg-surface active:bg-surface2"
                  @click="schnellansichtBesuchId = besuch.id"
                >
                  Details
                </button>

                <!-- Primäraktion je nach Status -->
                <button v-if="besuch.status === 'geplant'"
                  class="flex-1 py-2 rounded text-xs font-semibold bg-brand-active text-white active:bg-brand"
                  @click="berichtBesuchId = besuch.id"
                >
                  Abschließen
                </button>
                <button v-else-if="besuch.status === 'ausgefallen'"
                  class="flex-1 py-2 rounded text-xs font-semibold bg-negative/10 border border-negative/20 text-negative"
                  @click="$router.push({ path: '/umkreissuche', query: { besuchId: besuch.id } })"
                >
                  KI-Ersatz
                </button>
              </div>

              <!-- "Ausgefallen" Button für geplante Termine -->
              <button v-if="besuch.status === 'geplant'"
                class="mt-1.5 w-full py-1.5 rounded text-xs text-text2 active:bg-surface2"
                @click="planung.besuchAlsAusgefallen(besuch.id)"
              >
                Als ausgefallen markieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Termin-Schnellansicht -->
    <TerminSchnellansicht
      v-if="schnellansichtBesuchId"
      :besuch-id="schnellansichtBesuchId"
      @close="schnellansichtBesuchId = null"
      @open-vollprofil="(kundeId) => { schnellansichtBesuchId = null; planung.openKundenDetail(kundeId) }"
    />

    <!-- Besuchsbericht Dialog -->
    <BesuchsberichtDialog
      v-if="berichtBesuchId"
      :besuch-id="berichtBesuchId"
      @close="berichtBesuchId = null"
      @gespeichert="berichtBesuchId = null"
    />

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
