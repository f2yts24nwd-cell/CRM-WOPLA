<script setup lang="ts">
type Schritt = { icon: string; text: string }
type Thema = { id: string; titel: string; icon: string; schritte: Schritt[] }

const emit = defineEmits<{ (e: 'close'): void }>()

const themen: Thema[] = [
  {
    id: 'heute',
    titel: 'Heute-Dashboard',
    icon: '☀️',
    schritte: [
      { icon: '📊', text: 'Der Fortschrittsbalken oben zeigt, wie viele Besuche du heute schon erledigt hast.' },
      { icon: '🟠', text: 'Oranger Rand = geplant, grüner Rand = erledigt, roter Rand = ausgefallen.' },
      { icon: '⭐', text: '"Als nächstes" markiert deinen nächsten offenen Termin.' },
      { icon: '✅', text: 'Tippe auf "Abschließen" direkt auf der Karte, um den Besuchsbericht zu öffnen.' },
      { icon: '🤖', text: 'Das KI-Briefing oben zeigt dir deinen Prioritätskunden und den Routenstatus.' }
    ]
  },
  {
    id: 'bericht',
    titel: 'Besuchsbericht & KI',
    icon: '🎙️',
    schritte: [
      { icon: '🎙️', text: 'Tippe auf den großen orangenen Mikrofon-Button und sprich deinen Bericht ein.' },
      { icon: '⏹️', text: 'Tippe erneut auf den Button, um die Aufnahme zu stoppen.' },
      { icon: '✍️', text: 'Alternativ kannst du den Bericht auch direkt in das Textfeld eintippen.' },
      { icon: '🤖', text: 'Tippe auf "KI analysieren lassen" – die KI erstellt Zusammenfassung und Folgeaktionen.' },
      { icon: '☑️', text: 'Hake ab, welche Folgeaktionen übernommen werden sollen, dann "Speichern & Fertig".' }
    ]
  },
  {
    id: 'woche',
    titel: 'Wochenplanung',
    icon: '📅',
    schritte: [
      { icon: '◀▶', text: 'Navigiere mit den Pfeilen oben zwischen den Kalenderwochen.' },
      { icon: '📆', text: 'Tippe auf einen Wochentag, um dessen Terminliste anzuzeigen.' },
      { icon: '🗺️', text: 'Wechsle mit dem "Karte"-Tab zur Kartenansicht deiner Tagesroute.' },
      { icon: '🔀', text: 'Tippe auf "KI Routenoptimierung", um die Reihenfolge automatisch zu optimieren.' },
      { icon: '❌', text: 'Termin ausgefallen? Tippe auf "Ausgefallen" – die KI schlägt dir Ersatzkunden vor.' }
    ]
  },
  {
    id: 'umkreis',
    titel: 'Umkreissuche',
    icon: '📍',
    schritte: [
      { icon: '🔵', text: 'Schiebe den Radius-Regler, um den Suchbereich zu vergrößern oder zu verkleinern.' },
      { icon: '🏷️', text: 'Filtere nach ABC-Status, um nur A-, B- oder C-Kunden anzuzeigen.' },
      { icon: '📅', text: 'Filter "Letzter Besuch" zeigt nur Kunden, die seit X Tagen nicht besucht wurden.' },
      { icon: '🤖', text: 'Tippe auf "KI-Empfehlung", um die besten Kandidaten automatisch priorisiert zu sehen.' },
      { icon: '➕', text: 'In der KI-Empfehlungsliste kannst du direkt einen Termin hinzufügen.' }
    ]
  },
  {
    id: 'kunde',
    titel: 'Kundenprofil',
    icon: '👤',
    schritte: [
      { icon: '📋', text: 'Das Profil hat 3 Tabs: Übersicht, Verlauf und Pipeline.' },
      { icon: '📞', text: 'In der Übersicht kannst du Ansprechpartner direkt anrufen oder mailen.' },
      { icon: '📈', text: '"Verlauf" zeigt alle bisherigen Besuche, Anrufe und E-Mails.' },
      { icon: '💼', text: '"Pipeline" zeigt offene Opportunities und gesendete Angebote.' },
      { icon: '🤖', text: 'Tippe auf "KI Gesprächsvorbereitung" für Gesprächspunkte vor dem Termin.' }
    ]
  }
]
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" @click.self="emit('close')">
      <div class="bg-white rounded-t-2xl flex flex-col max-h-[90dvh]">
        <!-- Handle + Header -->
        <div class="flex-shrink-0 pt-3 pb-2 px-4 border-b border-gray-100">
          <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-gray-900 text-base">Hilfe & Anleitung</h2>
            <button @click="emit('close')"
              class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Scrollbarer Inhalt -->
        <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          <div v-for="thema in themen" :key="thema.id"
            class="bg-gray-50 rounded-2xl overflow-hidden">
            <!-- Thema-Header -->
            <div class="flex items-center gap-3 px-4 py-3 bg-primary-50 border-b border-primary-100">
              <span class="text-xl">{{ thema.icon }}</span>
              <h3 class="font-bold text-primary-700 text-sm">{{ thema.titel }}</h3>
            </div>
            <!-- Schritte -->
            <div class="px-4 py-3 space-y-2.5">
              <div v-for="(schritt, i) in thema.schritte" :key="i"
                class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {{ i + 1 }}
                </div>
                <p class="text-sm text-gray-700 leading-snug">{{ schritt.text }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <p class="text-center text-xs text-gray-400 pb-2">
            WOPLA · Außendienst-Planungstool
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
