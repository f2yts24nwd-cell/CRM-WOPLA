<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import { useKiStore } from '@/stores/ki'
import TagsNavigator from '@/components/wochenplanung/TagsNavigator.vue'
import WochenListe from '@/components/wochenplanung/WochenListe.vue'
import KarteView from '@/components/karte/KarteView.vue'
import KundenDetail from '@/components/kunde/KundenDetail.vue'
import KiPanel from '@/components/ki/KiPanel.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { KiEmpfehlungResult, Kunde } from '@/types'

const planung = usePlanungStore()
const kundenStore = useKundenStore()
const ki = useKiStore()

type MobileView = 'liste' | 'karte'
const mobileView = ref<MobileView>('liste')
const karteRef = ref<InstanceType<typeof KarteView>>()

watch(mobileView, (v) => { if (v === 'karte') karteRef.value?.invalidateSize() })

const wochenKunden = computed((): Kunde[] => {
  const seen = new Set<string>()
  return planung.besucheForWeek
    .map((b) => kundenStore.getKundeById(b.kundeId))
    .filter((k): k is Kunde => !!k && !seen.has(k.id) && seen.add(k.id) !== undefined)
})

const tagBesuche = computed(() => planung.besucheForTag(planung.selectedTag))

const routePolyline = ref<[number, number][]>([])
const showKiAusfallPanel = ref(false)
const kiAusfallErgebnisse = ref<KiEmpfehlungResult[]>([])
const kiAusfallLoading = ref(false)

async function onKiErsatz(_besuchId: string, kundeId: string) {
  const ausgefallenerKunde = kundenStore.getKundeById(kundeId)
  if (!ausgefallenerKunde) return
  showKiAusfallPanel.value = true
  kiAusfallLoading.value = true
  kiAusfallErgebnisse.value = []
  kiAusfallErgebnisse.value = await ki.schlageAusfallersatzVor(ausgefallenerKunde, kundenStore.kunden)
  kiAusfallLoading.value = false
}

async function optimiereRoute() {
  const besuche = tagBesuche.value.filter((b) => b.status === 'geplant')
  if (besuche.length < 2) return
  const kunden = besuche
    .map((b) => kundenStore.getKundeById(b.kundeId))
    .filter((k): k is Kunde => !!k)

  const orderedIds = await ki.optimiereRoute(besuche, kunden)
  planung.routeNeuAnordnen(planung.selectedTag, orderedIds)

  const orderedKunden = orderedIds
    .map((id) => besuche.find((b) => b.id === id))
    .filter(Boolean)
    .map((b) => kundenStore.getKundeById(b!.kundeId))
    .filter((k): k is Kunde => !!k)

  routePolyline.value = orderedKunden.map((k) => [k.lat, k.lng] as [number, number])
}

const tagDatum = computed(() => planung.tagDatum(planung.selectedTag))
</script>

<template>
  <div class="flex flex-col h-full">
    <TagsNavigator />

    <!-- Mobile: Umschalter Liste/Karte -->
    <div class="md:hidden flex border-b border-gray-200 bg-white">
      <button @click="mobileView = 'liste'"
        :class="['flex-1 py-2.5 text-sm font-semibold transition-colors',
          mobileView === 'liste' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400']">
        Liste
      </button>
      <button @click="mobileView = 'karte'"
        :class="['flex-1 py-2.5 text-sm font-semibold transition-colors',
          mobileView === 'karte' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400']">
        Karte
      </button>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- Liste -->
      <div :class="[
        'flex flex-col overflow-hidden bg-gray-50',
        'md:w-2/5 md:border-r md:flex',
        mobileView === 'liste' ? 'flex-1' : 'hidden'
      ]">
        <div class="px-3 pt-3">
          <button @click="optimiereRoute"
            :disabled="ki.isLoading && ki.currentTask === 'route'"
            class="w-full py-2.5 bg-white border border-primary-200 text-primary-600 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-primary-50 active:bg-primary-100 transition-colors disabled:opacity-50">
            <LoadingSpinner v-if="ki.isLoading && ki.currentTask === 'route'" size="sm" />
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            KI Routenoptimierung
          </button>
        </div>

        <WochenListe
          :tag="planung.selectedTag"
          @ki-ersatz="onKiErsatz"
          @detail-open="planung.openKundenDetail"
        />
      </div>

      <!-- Karte -->
      <div :class="[
        'md:w-3/5 md:block',
        mobileView === 'karte' ? 'flex-1' : 'hidden'
      ]" style="height: 100%">
        <KarteView
          ref="karteRef"
          :kunden="wochenKunden"
          :besuche="tagBesuche"
          :route-polyline="routePolyline"
          @kunde-click="planung.openKundenDetail"
        />
      </div>
    </div>

    <!-- KI Ausfallersatz Panel -->
    <KiPanel
      v-if="showKiAusfallPanel"
      titel="KI-Ersatzvorschläge"
      :is-loading="kiAusfallLoading"
      :empfehlungen="kiAusfallErgebnisse"
      :zieldatum="tagDatum"
      @close="showKiAusfallPanel = false"
      @empfehlung-hinzugefuegt="showKiAusfallPanel = false"
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
