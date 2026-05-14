<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { usePlanungStore } from '@/stores/planung'
import { useKundenStore } from '@/stores/kunden'
import { useKiStore } from '@/stores/ki'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { BesuchsBericht, Folgeaktion, KiBesuchsBerichtResult } from '@/types'

const props = defineProps<{ besuchId: string }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'gespeichert'): void
}>()

const planung = usePlanungStore()
const kundenStore = useKundenStore()
const ki = useKiStore()

const besuch = computed(() => planung.besuche.find((b) => b.id === props.besuchId))
const kunde = computed(() => besuch.value ? kundenStore.getKundeById(besuch.value.kundeId) : undefined)
const aktivitaeten = computed(() => besuch.value ? kundenStore.getAktivitaetenForKunde(besuch.value.kundeId) : [])

type Schritt = 'aufnahme' | 'verarbeitung' | 'ergebnis'
const schritt = ref<Schritt>('aufnahme')
const transkript = ref('')
const isRecording = ref(false)
const kiErgebnis = ref<KiBesuchsBerichtResult | null>(null)
const aktiveFolgeaktionen = ref<boolean[]>([])

let recordingTimer: ReturnType<typeof setTimeout> | null = null

const MOCK_TRANSSKRIPTE = [
  'Gespräch verlief sehr positiv. Kunde ist an unserer neuen Produktlinie sehr interessiert. Er hat nach einem konkreten Angebot gefragt und möchte eine Demo nächste Woche. Der Entscheider war auch dabei, das war gut.',
  'Routine-Meeting, keine großen Neuigkeiten. Kunde ist zufrieden mit dem aktuellen Service. Hat nach Preisanpassungen zum Jahresende gefragt. Soll ich eine Übersicht schicken.',
  'Es gab Probleme mit der letzten Lieferung – Kunde ist unzufrieden. Haben gemeinsam Lösungswege besprochen. Kulanz-Angebot wurde positiv aufgenommen. Braucht aber zeitnah Rückmeldung.'
]

function starteAufnahme() {
  isRecording.value = true
  transkript.value = ''

  // Simulated: after 3s auto-fill a mock transcript
  recordingTimer = setTimeout(() => {
    const mock = MOCK_TRANSSKRIPTE[Math.floor(Math.random() * MOCK_TRANSSKRIPTE.length)]
    transkript.value = mock
    isRecording.value = false
  }, 3000)
}

function stoppeAufnahme() {
  if (recordingTimer) {
    clearTimeout(recordingTimer)
    recordingTimer = null
  }
  isRecording.value = false
}

async function verarbeiteBerichtMitKi() {
  if (!transkript.value.trim() || !kunde.value) return
  schritt.value = 'verarbeitung'
  kiErgebnis.value = await ki.verarbeiteBesuchsBericht(
    transkript.value,
    kunde.value,
    aktivitaeten.value
  )
  aktiveFolgeaktionen.value = kiErgebnis.value.folgeaktionen.map(() => true)
  schritt.value = 'ergebnis'
}

function speichernUndFertig() {
  if (!kiErgebnis.value || !besuch.value || !kunde.value) return
  const bericht: BesuchsBericht = {
    besuchId: props.besuchId,
    transkript: transkript.value,
    zusammenfassung: kiErgebnis.value.zusammenfassung,
    stimmung: kiErgebnis.value.stimmung,
    erstelltAm: new Date()
  }
  const folgeaktionen: Folgeaktion[] = kiErgebnis.value.folgeaktionen
    .filter((_, i) => aktiveFolgeaktionen.value[i])
    .map((a) => ({
      id: crypto.randomUUID(),
      besuchId: props.besuchId,
      kundeId: kunde.value!.id,
      typ: a.typ,
      beschreibung: a.beschreibung,
      faelligAm: a.faelligAm,
      erledigt: false
    }))
  planung.besuchAbschliessen(props.besuchId, bericht, folgeaktionen)
  emit('gespeichert')
}

const stimmungFarbe = computed(() => {
  if (!kiErgebnis.value) return ''
  if (kiErgebnis.value.stimmung === 'positiv') return 'text-green-600 bg-green-50'
  if (kiErgebnis.value.stimmung === 'kritisch') return 'text-red-600 bg-red-50'
  return 'text-gray-600 bg-gray-50'
})

const stimmungIcon = computed(() => {
  if (!kiErgebnis.value) return ''
  if (kiErgebnis.value.stimmung === 'positiv') return '😊'
  if (kiErgebnis.value.stimmung === 'kritisch') return '⚠️'
  return '😐'
})

function typIcon(typ: string): string {
  if (typ === 'Anruf') return '📞'
  if (typ === 'Email') return '📧'
  if (typ === 'Besuch') return '🤝'
  return '📄'
}

function formatFaellig(date: Date): string {
  const tage = Math.round((date.getTime() - Date.now()) / 86400000)
  if (tage <= 0) return 'Heute'
  if (tage === 1) return 'Morgen'
  if (tage <= 7) return `In ${tage} Tagen`
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

onUnmounted(() => {
  if (recordingTimer) clearTimeout(recordingTimer)
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <div class="bg-white rounded-t-2xl flex flex-col max-h-[90dvh]">
        <!-- Handle + Header -->
        <div class="flex-shrink-0 pt-3 pb-2 px-4 border-b border-gray-100">
          <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-bold text-gray-900">Besuchsbericht</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ kunde?.name }}</p>
            </div>
            <button @click="emit('close')"
              class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Scrollbarer Inhalt -->
        <div class="flex-1 overflow-y-auto px-4 py-4">

          <!-- Schritt 1: Aufnahme -->
          <div v-if="schritt === 'aufnahme'" class="space-y-4">
            <!-- Mikrofon-Button -->
            <div class="flex flex-col items-center py-6">
              <button
                @click="isRecording ? stoppeAufnahme() : starteAufnahme()"
                :class="[
                  'w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg',
                  isRecording
                    ? 'bg-red-500 scale-110 animate-pulse'
                    : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
                ]"
              >
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm0 2a2 2 0 00-2 2v6a2 2 0 004 0V5a2 2 0 00-2-2zM6.5 10.5A5.5 5.5 0 0012 16a5.5 5.5 0 005.5-5.5h2A7.5 7.5 0 0112 18a7.5 7.5 0 01-7.5-7.5h2zM11 19h2v3h-2z"/>
                </svg>
              </button>
              <p class="mt-3 text-sm font-semibold text-gray-700">
                {{ isRecording ? 'Aufnahme läuft… (Tippen zum Stoppen)' : 'Tippen zum Starten' }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ isRecording ? 'Sprechen Sie Ihren Besuchsbericht…' : 'Oder Text unten eingeben' }}
              </p>
            </div>

            <!-- Texteingabe Fallback -->
            <div>
              <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Bericht (Text)</label>
              <textarea
                v-model="transkript"
                placeholder="Alternativ hier eintippen…"
                rows="4"
                class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <!-- Weiter-Button -->
            <button
              :disabled="!transkript.trim()"
              @click="verarbeiteBerichtMitKi"
              class="w-full py-3 rounded-xl font-semibold text-white bg-primary-500 active:bg-primary-700 disabled:opacity-40"
            >
              KI analysieren lassen
            </button>
          </div>

          <!-- Schritt 2: Verarbeitung -->
          <div v-else-if="schritt === 'verarbeitung'" class="flex flex-col items-center py-16 gap-4">
            <LoadingSpinner size="lg" />
            <p class="text-sm font-semibold text-gray-600">KI analysiert Bericht…</p>
            <p class="text-xs text-gray-400 text-center">Zusammenfassung und Folgeaktionen werden erstellt</p>
          </div>

          <!-- Schritt 3: Ergebnis -->
          <div v-else-if="schritt === 'ergebnis' && kiErgebnis" class="space-y-4">
            <!-- Stimmung + Zusammenfassung -->
            <div :class="['rounded-xl p-4', stimmungFarbe]">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">{{ stimmungIcon }}</span>
                <span class="text-sm font-bold capitalize">{{ kiErgebnis.stimmung }}</span>
              </div>
              <p class="text-sm leading-relaxed">{{ kiErgebnis.zusammenfassung }}</p>
            </div>

            <!-- Folgeaktionen -->
            <div>
              <p class="text-sm font-bold text-gray-800 mb-2">Vorgeschlagene Folgeaktionen</p>
              <div class="space-y-2">
                <label
                  v-for="(aktion, i) in kiErgebnis.folgeaktionen"
                  :key="i"
                  class="flex items-start gap-3 bg-gray-50 rounded-xl p-3 cursor-pointer active:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    v-model="aktiveFolgeaktionen[i]"
                    class="mt-0.5 w-4 h-4 accent-primary-500 shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="text-base leading-none">{{ typIcon(aktion.typ) }}</span>
                      <span class="text-xs font-semibold text-gray-600">{{ aktion.typ }}</span>
                      <span class="ml-auto text-xs text-primary-500 font-medium shrink-0">
                        {{ formatFaellig(aktion.faelligAm) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700">{{ aktion.beschreibung }}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer-Button -->
        <div v-if="schritt === 'ergebnis'" class="flex-shrink-0 px-4 py-4 border-t border-gray-100"
          style="padding-bottom: calc(env(safe-area-inset-bottom) + 1rem)">
          <button
            @click="speichernUndFertig"
            class="w-full py-3 rounded-xl font-semibold text-white bg-green-500 active:bg-green-700"
          >
            Speichern & Fertig
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
