<script setup lang="ts">
import { computed, shallowRef, onMounted, nextTick } from 'vue'
import { LMap, LTileLayer, LPolyline } from '@vue-leaflet/vue-leaflet'
import type { Kunde, Besuch } from '@/types'
import KundenPin from './KundenPin.vue'
import RadiusKreis from './RadiusKreis.vue'

const props = defineProps<{
  kunden: Kunde[]
  besuche?: Besuch[]
  center?: [number, number]
  zoom?: number
  umkreis?: { lat: number; lng: number; radiusM: number }
  selectedKundeId?: string | null
  routePolyline?: [number, number][]
}>()

const emit = defineEmits<{ (e: 'kunde-click', kundeId: string): void }>()

const mapRef = shallowRef()
const mapCenter = computed((): [number, number] => props.center ?? [48.892, 8.710])

function istGeplant(kundeId: string): boolean {
  return (props.besuche ?? []).some(
    (b) => b.kundeId === kundeId && b.status === 'geplant'
  )
}

function istAusgefallen(kundeId: string): boolean {
  return (props.besuche ?? []).some(
    (b) => b.kundeId === kundeId && b.status === 'ausgefallen'
  )
}

function invalidateSize() {
  nextTick(() => {
    setTimeout(() => {
      mapRef.value?.leafletObject?.invalidateSize()
    }, 50)
  })
}

onMounted(invalidateSize)

defineExpose({ invalidateSize })
</script>

<template>
  <LMap
    ref="mapRef"
    :zoom="zoom ?? 11"
    :center="mapCenter"
    :use-global-leaflet="false"
    style="width: 100%; height: 100%"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© <a href='https://openstreetmap.org'>OpenStreetMap</a>"
      :max-zoom="19"
    />

    <KundenPin
      v-for="kunde in kunden"
      :key="kunde.id"
      :kunde="kunde"
      :ist-geplant="istGeplant(kunde.id)"
      :ist-ausgefallen="istAusgefallen(kunde.id)"
      @click="emit('kunde-click', kunde.id)"
    />

    <RadiusKreis
      v-if="umkreis"
      :lat="umkreis.lat"
      :lng="umkreis.lng"
      :radius-m="umkreis.radiusM"
    />

    <LPolyline
      v-if="routePolyline && routePolyline.length > 1"
      :lat-lngs="routePolyline"
      :color="'#F97316'"
      :weight="3"
      :opacity="0.7"
      :dash-array="'8, 6'"
    />
  </LMap>
</template>
