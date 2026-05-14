<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useKundenStore } from '@/stores/kunden'
import { usePlanungStore } from '@/stores/planung'
import { useKiStore } from '@/stores/ki'
import KarteView from '@/components/karte/KarteView.vue'
import KiPanel from '@/components/ki/KiPanel.vue'
import KundenDetail from '@/components/kunde/KundenDetail.vue'
import Badge from '@/components/ui/Badge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { daysSince } from '@/utils/geo'
import { formatDate } from '@/utils/dates'
import type { KiEmpfehlungResult } from '@/types'
import type { AbcStatus } from '@/types'

const props = defineProps<{ vorausgewaehlteBesuchId?: string }>()

const kundenStore = useKundenStore()
const planung = usePlanungStore()
const ki = useKiStore()

const karteRef = ref<InstanceType<typeof KarteView>>()

const zentrum = ref<[number, number]>([48.892, 8.710])

const radius = ref(25)
const selectedAbc = ref<AbcStatus[]>(['A', 'B', 'C'])
const minTage = ref(0)
const minUmsatz = ref(0)

type SortKey = 'umsatz' | 'letzterBesuch' | 'name'
const sortKey = ref<SortKey>('umsatz')

const showKiPanel = ref(false)
const kiEmpfehlungen = ref<KiEmpfehlungResult[]>([])
type MobileView = 'filter' | 'karte'
const mobileView = ref<MobileView>('filter')

watch(mobileView, (v) => { if (v === 'karte') karteRef.value?.invalidateSize() })

onMounted(() => {
  if (props.vorausgewaehlteBesuchId) {
    const besuch = planung.besuche.find((b) => b.id === props.vorausgewaehlteBesuchId)
    if (besuch) {
      const kunde = kundenStore.getKundeById(besuch.kundeId)
      if (kunde) zentrum.value = [kunde.lat, kunde.lng]
    }
  }
})

const gefilterteKunden = computed(() => {
  const [lat, lng] = zentrum.value
  return kundenStore
    .kundenImUmkreis(lat, lng, radius.value)
    .filter((k) => selectedAbc.value.includes(k.abcStatus))
    .filter((k) => daysSince(k.letzterBesuch) >= minTage.value)
    .filter((k) => k.umsatzPotenzial >= minUmsatz.value)
    .sort((a, b) => {
      if (sortKey.value === 'umsatz') return b.umsatzPotenzial - a.umsatzPotenzial
      if (sortKey.value === 'letzterBesuch') return daysSince(b.letzterBesuch) - daysSince(a.letzterBesuch)
      return a.name.localeCompare(b.name)
    })
})

function toggleAbc(status: AbcStatus) {
  if (selectedAbc.value.includes(status)) {
    if (selectedAbc.value.length > 1) selectedAbc.value = selectedAbc.value.filter((s) => s !== status)
  } else {
    selectedAbc.value.push(status)
  }
}

async function kiEmpfehlung() {
  showKiPanel.value = true
  kiEmpfehlungen.value = []
  kiEmpfehlungen.value = await ki.berechneEmpfehlungen(gefilterteKunden.value)
}

const umkreis = computed(() => ({
  lat: zentrum.value[0],
  lng: zentrum.value[1],
  radiusM: radius.value * 1000
}))
</script>

<template>
  <div class="flex flex-col h-full bg-page">
    <!-- Mobile Tabs — Fiori Underline -->
    <div class="md:hidden flex border-b border-border bg-surface">
      <button @click="mobileView = 'filter'"
        :class="['flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
          mobileView === 'filter' ? 'text-brand border-brand' : 'text-text2 border-transparent']">
        Filter & Ergebnisse
      </button>
      <button @click="mobileView = 'karte'"
        :class="['flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
          mobileView === 'karte' ? 'text-brand border-brand' : 'text-text2 border-transparent']">
        Karte
      </button>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- Filter + Ergebnisliste -->
      <div :class="[
        'flex flex-col overflow-hidden bg-page',
        'md:w-2/5 md:border-r md:border-border md:flex',
        mobileView === 'filter' ? 'flex-1' : 'hidden'
      ]">
        <!-- Filter Panel -->
        <div class="bg-surface border-b border-border p-4 space-y-4">
          <!-- Radius -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-text1">Umkreis</span>
              <span class="text-sm font-bold text-brand">{{ radius }} km</span>
            </div>
            <input type="range" min="5" max="100" step="5" v-model.number="radius"
              class="w-full h-2 bg-surface2 rounded appearance-none cursor-pointer accent-brand" />
          </div>

          <!-- ABC-Filter -->
          <div>
            <p class="text-sm font-semibold text-text1 mb-2">ABC-Status</p>
            <div class="flex gap-2">
              <button v-for="s in ['A', 'B', 'C'] as AbcStatus[]" :key="s"
                @click="toggleAbc(s)"
                :class="[
                  'flex-1 py-2 rounded text-sm font-bold border-2 transition-colors',
                  selectedAbc.includes(s)
                    ? s === 'A' ? 'bg-info border-info text-white'
                    : s === 'B' ? 'bg-positive border-positive text-white'
                    : 'bg-neutral border-neutral text-white'
                    : 'bg-surface border-border text-text2'
                ]">
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Letzter Besuch -->
          <div>
            <p class="text-sm font-semibold text-text1 mb-2">Letzter Besuch</p>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="opt in [{ label: 'Alle', val: 0 }, { label: '> 30 Tage', val: 30 }, { label: '> 60 Tage', val: 60 }, { label: '> 90 Tage', val: 90 }]"
                :key="opt.val" @click="minTage = opt.val"
                :class="['py-2 rounded text-xs font-semibold border transition-colors',
                  minTage === opt.val ? 'bg-brand-active border-brand-active text-white' : 'bg-surface border-border text-text2']">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Sortierung -->
          <div>
            <p class="text-sm font-semibold text-text1 mb-2">Sortierung</p>
            <div class="flex gap-2">
              <button v-for="opt in [{ key: 'umsatz', label: 'Potenzial' }, { key: 'letzterBesuch', label: 'Ältester' }, { key: 'name', label: 'Name' }] as {key: SortKey, label: string}[]"
                :key="opt.key" @click="sortKey = opt.key"
                :class="['flex-1 py-2 rounded text-xs font-semibold border transition-colors',
                  sortKey === opt.key ? 'bg-brand-active border-brand-active text-white' : 'bg-surface border-border text-text2']">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- KI Button -->
          <button @click="kiEmpfehlung" :disabled="ki.isLoading || gefilterteKunden.length === 0"
            class="w-full py-3 bg-brand-active active:bg-brand text-white font-semibold rounded flex items-center justify-center gap-2 disabled:opacity-50">
            <LoadingSpinner v-if="ki.isLoading && ki.currentTask === 'empfehlung'" size="sm" />
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            KI-Empfehlung ({{ gefilterteKunden.length }} Kandidaten)
          </button>
        </div>

        <!-- Ergebnisliste -->
        <div class="flex-1 overflow-y-auto py-2">
          <div v-if="gefilterteKunden.length === 0" class="text-center py-12 text-text2">
            <p class="font-medium">Keine Kunden gefunden</p>
            <p class="text-sm mt-1">Filter anpassen oder Umkreis vergrößern</p>
          </div>
          <div v-for="kunde in gefilterteKunden" :key="kunde.id"
            class="bg-surface rounded-lg border border-border mx-3 my-2 p-3 cursor-pointer active:bg-surface2"
            @click="planung.openKundenDetail(kunde.id)">
            <div class="flex items-start justify-between mb-1">
              <div class="flex items-center gap-2">
                <Badge :label="kunde.abcStatus" :variant="kunde.abcStatus" />
                <span class="text-xs text-text2">{{ daysSince(kunde.letzterBesuch) }} Tage</span>
              </div>
              <span class="text-sm font-bold text-text1">
                {{ (kunde.umsatzPotenzial / 1000).toFixed(0) }} T€
              </span>
            </div>
            <p class="font-semibold text-text1 text-sm">{{ kunde.name }}</p>
            <p class="text-xs text-text2 mt-0.5">{{ kunde.adresse }}</p>
            <p class="text-xs text-text2 mt-1">Letzter Besuch: {{ formatDate(kunde.letzterBesuch) }}</p>
          </div>
        </div>
      </div>

      <!-- Karte -->
      <div :class="[
        'md:w-3/5 md:block',
        mobileView === 'karte' ? 'flex-1' : 'hidden'
      ]" style="height: 100%">
        <KarteView
          ref="karteRef"
          :kunden="gefilterteKunden"
          :center="zentrum"
          :zoom="10"
          :umkreis="umkreis"
          @kunde-click="planung.openKundenDetail"
        />
      </div>
    </div>

    <!-- KI Panel -->
    <KiPanel
      v-if="showKiPanel"
      titel="KI-Besuchsempfehlungen"
      :is-loading="ki.isLoading && ki.currentTask === 'empfehlung'"
      :empfehlungen="kiEmpfehlungen"
      @close="showKiPanel = false"
      @empfehlung-hinzugefuegt="showKiPanel = false"
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
