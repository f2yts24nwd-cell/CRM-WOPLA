<script setup lang="ts">
import { computed } from 'vue'
import type { Wochentag } from '@/types'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import TerminKarte from './TerminKarte.vue'

const props = defineProps<{ tag: Wochentag }>()
const emit = defineEmits<{
  (e: 'ki-ersatz', besuchId: string, kundeId: string): void
  (e: 'detail-open', kundeId: string): void
  (e: 'detail-schnell', besuchId: string): void
}>()

const planung = usePlanungStore()
const kundenStore = useKundenStore()

const besuche = computed(() => planung.besucheForTag(props.tag))

function getKunde(kundeId: string) {
  return kundenStore.getKundeById(kundeId)
}

function onAusgefallen(besuchId: string) {
  planung.besuchAlsAusgefallen(besuchId)
}

function onKiErsatz(besuchId: string) {
  const besuch = planung.besuche.find((b) => b.id === besuchId)
  if (besuch) emit('ki-ersatz', besuchId, besuch.kundeId)
}
</script>

<template>
  <div class="flex-1 overflow-y-auto py-2">
    <template v-if="besuche.length > 0">
      <TerminKarte
        v-for="(besuch, i) in besuche"
        :key="besuch.id"
        :besuch="besuch"
        :kunde="getKunde(besuch.kundeId)!"
        :rank="i + 1"
        @ausgefallen="onAusgefallen"
        @ki-ersatz="onKiErsatz"
        @detail-open="emit('detail-open', $event)"
        @detail-schnell="emit('detail-schnell', $event)"
      />
    </template>
    <div v-else class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="text-gray-400 font-medium">Keine Termine</p>
      <p class="text-gray-300 text-sm mt-1">Für diesen Tag sind keine Besuche geplant.</p>
    </div>
  </div>
</template>
