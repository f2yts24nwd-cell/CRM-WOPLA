<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import Badge from '@/components/ui/Badge.vue'
import KundenDetail from '@/components/kunde/KundenDetail.vue'
import TagsBriefing from '@/components/heute/TagsBriefing.vue'
import BesuchsberichtDialog from '@/components/besuch/BesuchsberichtDialog.vue'
import { formatDate } from '@/utils/dates'
import { daysSince } from '@/utils/geo'
import type { Besuch } from '@/types'

const planung = usePlanungStore()
const kundenStore = useKundenStore()

const berichtBesuchId = ref<string | null>(null)

const besuche = computed(() => planung.heutigeBesuche)

const erledigt = computed(() => besuche.value.filter((b) => b.status === 'abgeschlossen').length)
const gesamt = computed(() => besuche.value.length)
const fortschritt = computed(() => gesamt.value === 0 ? 0 : Math.round((erledigt.value / gesamt.value) * 100))

const heute = new Date()
const tagLabel = heute.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })

function randFarbe(b: Besuch): string {
  if (b.status === 'abgeschlossen') return 'bg-green-500'
  if (b.status === 'ausgefallen') return 'bg-red-400'
  return 'bg-primary-500'
}

function statusLabel(b: Besuch): string {
  if (b.status === 'abgeschlossen') return 'Erledigt'
  if (b.status === 'ausgefallen') return 'Ausgefallen'
  return 'Geplant'
}

function istNaechster(b: Besuch): boolean {
  return b.status === 'geplant' && !besuche.value.some(
    (x) => x.status === 'geplant' && x.startzeit < b.startzeit
  )
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header mit Fortschritt -->
    <div class="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
      <div class="flex items-start justify-between mb-1">
        <div>
          <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Heute</p>
          <h1 class="text-base font-bold text-gray-900">{{ tagLabel }}</h1>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-primary-500">{{ erledigt }}<span class="text-base font-semibold text-gray-400">/{{ gesamt }}</span></p>
          <p class="text-xs text-gray-400">Besuche</p>
        </div>
      </div>
      <!-- Fortschrittsbalken -->
      <div class="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="fortschritt === 100 ? 'bg-green-500' : 'bg-primary-500'"
          :style="{ width: fortschritt + '%' }"
        />
      </div>
      <p class="text-xs text-gray-400 mt-1">
        <span v-if="gesamt === 0">Keine Termine heute</span>
        <span v-else-if="fortschritt === 100" class="text-green-600 font-semibold">Alle Termine erledigt!</span>
        <span v-else>{{ gesamt - erledigt }} Termin{{ gesamt - erledigt !== 1 ? 'e' : '' }} ausstehend</span>
      </p>
    </div>

    <!-- Scrollbarer Inhalt -->
    <div class="flex-1 overflow-y-auto pb-4">
      <!-- KI-Briefing -->
      <TagsBriefing v-if="gesamt > 0" />

      <!-- Leerer Tag -->
      <div v-if="gesamt === 0" class="flex flex-col items-center justify-center h-48 text-gray-400 px-6 text-center mt-8">
        <svg class="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="font-semibold text-gray-500">Keine Termine heute</p>
        <p class="text-sm mt-1">Nutze die Umkreissuche um spontane Besuche zu finden.</p>
      </div>

      <!-- Terminliste -->
      <div class="mt-3 space-y-2 px-3">
        <div v-for="besuch in besuche" :key="besuch.id"
          class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          :class="istNaechster(besuch) ? 'ring-2 ring-primary-400 ring-offset-1' : ''">
          <!-- Linker Status-Rand + Inhalt -->
          <div class="flex">
            <div :class="['w-1 shrink-0', randFarbe(besuch)]" />
            <div class="flex-1 p-3">
              <!-- Zeile 1: Uhrzeit + Status-Badge -->
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-bold text-gray-800 tabular-nums">
                  {{ besuch.startzeit }} – {{ besuch.endzeit }}
                </span>
                <span v-if="istNaechster(besuch)"
                  class="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  Als nächstes
                </span>
                <span v-else-if="besuch.status === 'abgeschlossen'"
                  class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ Erledigt
                </span>
                <span v-else-if="besuch.status === 'ausgefallen'"
                  class="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  ✕ Ausgefallen
                </span>
              </div>

              <!-- Zeile 2: Kundeninfo -->
              <template v-if="kundenStore.getKundeById(besuch.kundeId) as any">
                <div class="flex items-center gap-2 mb-0.5">
                  <Badge :label="kundenStore.getKundeById(besuch.kundeId)!.abcStatus"
                    :variant="kundenStore.getKundeById(besuch.kundeId)!.abcStatus" />
                  <span class="font-semibold text-gray-900 text-sm">
                    {{ kundenStore.getKundeById(besuch.kundeId)!.name }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mb-0.5">
                  {{ kundenStore.getKundeById(besuch.kundeId)!.adresse }}
                </p>
                <p class="text-xs text-gray-400">
                  Letzter Besuch: {{ formatDate(kundenStore.getKundeById(besuch.kundeId)!.letzterBesuch) }}
                  · <span class="text-primary-500">{{ daysSince(kundenStore.getKundeById(besuch.kundeId)!.letzterBesuch) }} Tage</span>
                </p>
              </template>

              <!-- Bericht-Zusammenfassung falls abgeschlossen -->
              <div v-if="besuch.status === 'abgeschlossen' && planung.getBerichtForBesuch(besuch.id)"
                class="mt-2 bg-green-50 rounded-lg px-3 py-2">
                <p class="text-xs text-green-700 line-clamp-2">
                  {{ planung.getBerichtForBesuch(besuch.id)!.zusammenfassung }}
                </p>
              </div>

              <!-- Aktions-Buttons -->
              <div class="mt-2.5 flex gap-2">
                <!-- Detail-Button immer -->
                <button
                  class="flex-1 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 bg-white active:bg-gray-50"
                  @click="planung.openKundenDetail(besuch.kundeId)"
                >
                  Details
                </button>

                <!-- Primäraktion je nach Status -->
                <button v-if="besuch.status === 'geplant'"
                  class="flex-1 py-2 rounded-lg text-xs font-semibold bg-primary-500 text-white active:bg-primary-700"
                  @click="berichtBesuchId = besuch.id"
                >
                  Abschließen
                </button>
                <button v-else-if="besuch.status === 'ausgefallen'"
                  class="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                  @click="$router.push({ path: '/umkreissuche', query: { besuchId: besuch.id } })"
                >
                  KI-Ersatz
                </button>
              </div>

              <!-- "Ausgefallen" Button für geplante Termine -->
              <button v-if="besuch.status === 'geplant'"
                class="mt-1.5 w-full py-1.5 rounded-lg text-xs text-gray-400 active:bg-gray-50"
                @click="planung.besuchAlsAusgefallen(besuch.id)"
              >
                Als ausgefallen markieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
