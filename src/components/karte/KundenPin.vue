<script setup lang="ts">
import { computed } from 'vue'
import { LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { divIcon } from 'leaflet'
import type { Kunde } from '@/types'

const props = defineProps<{
  kunde: Kunde
  istGeplant?: boolean
  istAusgefallen?: boolean
}>()

const emit = defineEmits<{ (e: 'click', kundeId: string): void }>()

function pinColor(umsatz: number): string {
  if (umsatz >= 80000) return '#22c55e'
  if (umsatz >= 20000) return '#eab308'
  return '#ef4444'
}

const icon = computed(() => {
  const color = props.istAusgefallen ? '#9ca3af' : pinColor(props.kunde.umsatzPotenzial)
  const overlay = props.istAusgefallen
    ? `<span style="color:white;font-size:11px;line-height:1">✕</span>`
    : props.istGeplant
    ? `<span style="color:white;font-size:10px;line-height:1">✓</span>`
    : ''
  const border = props.istGeplant && !props.istAusgefallen ? '3px solid white' : '2px dashed rgba(255,255,255,0.7)'

  return divIcon({
    html: `<div style="
      background:${color};
      width:28px;height:28px;border-radius:50%;
      border:${border};
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
    ">${overlay}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
})

const latLng = computed((): [number, number] => [props.kunde.lat, props.kunde.lng])
</script>

<template>
  <LMarker :lat-lng="latLng" :icon="icon" @click="emit('click', kunde.id)">
    <LPopup>
      <div class="text-sm min-w-[160px]">
        <p class="font-semibold text-gray-900">{{ kunde.name }}</p>
        <p class="text-gray-500 text-xs mt-0.5">{{ kunde.adresse }}</p>
        <p class="text-gray-500 text-xs mt-1">
          Status: <span class="font-medium text-gray-700">{{ kunde.abcStatus }}</span>
          · Pot.: {{ (kunde.umsatzPotenzial / 1000).toFixed(0) }} T€
        </p>
      </div>
    </LPopup>
  </LMarker>
</template>
