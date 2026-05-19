<script setup lang="ts">
import { computed } from 'vue'
import type { Folgeaktion } from '@/types'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'

const props = defineProps<{ aktion: Folgeaktion }>()

const planung = usePlanungStore()
const kundenStore = useKundenStore()

const kunde = computed(() => kundenStore.getKundeById(props.aktion.kundeId))

function typIcon(typ: string): string {
  if (typ === 'Anruf') return '📞'
  if (typ === 'Email') return '📧'
  if (typ === 'Besuch') return '🤝'
  return '📄'
}

const typStyle = computed(() => {
  if (props.aktion.typ === 'Anruf') return 'bg-positive/10 text-positive'
  if (props.aktion.typ === 'Email') return 'bg-info/10 text-info'
  if (props.aktion.typ === 'Besuch') return 'bg-critical/10 text-critical'
  return 'bg-surface2 text-text2'
})
</script>

<template>
  <div class="mx-3 my-1.5 bg-surface border border-border rounded-lg p-3">
    <div class="flex items-start gap-2.5">
      <!-- Typ-Icon -->
      <div :class="['w-8 h-8 rounded flex items-center justify-center text-sm shrink-0', typStyle]">
        {{ typIcon(aktion.typ) }}
      </div>

      <!-- Inhalt -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="text-xs font-semibold text-text2">{{ aktion.typ }}</span>
          <span class="text-xs text-text2/60">·</span>
          <span class="text-xs text-text2 truncate">{{ kunde?.name }}</span>
        </div>
        <p class="text-sm text-text1 leading-snug">{{ aktion.beschreibung }}</p>
      </div>
    </div>

    <!-- Aktionen -->
    <div class="flex items-center gap-2 mt-2.5 pl-10">
      <button
        v-if="aktion.typ === 'Besuch'"
        @click="planung.folgeaktionAlsBesuchEintragen(aktion.id)"
        class="flex-1 text-xs py-1.5 px-2 rounded border border-brand text-brand font-semibold active:bg-brand/10"
      >
        + Als Termin eintragen
      </button>
      <button
        @click="planung.folgeaktionErledigen(aktion.id)"
        class="flex-1 text-xs py-1.5 px-2 rounded border border-border text-text2 font-medium active:bg-surface2"
      >
        ✓ Erledigt
      </button>
    </div>
  </div>
</template>
