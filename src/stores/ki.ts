import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Kunde, Besuch, Aktivitaet, Opportunity, KiEmpfehlungResult, KiGespraechResult, KiBesuchsBerichtResult, KiTagesBriefingResult, Folgeaktion } from '@/types'
import { haversine, daysSince } from '@/utils/geo'

type KiTask = 'empfehlung' | 'route' | 'gespraech' | 'ausfallersatz' | 'bericht' | 'briefing' | null

const BEGRUENDUNGEN: Record<string, string[]> = {
  A: [
    'A-Kunde mit hohem Umsatzpotenzial – lohnt sich sehr.',
    'Strategischer Key-Account, lange nicht besucht.',
    'Offene Opportunities rechtfertigen einen Besuch jetzt.'
  ],
  B: [
    'B-Kunde mit Wachstumspotenzial im Umkreis.',
    'Letzte Aktivität liegt länger zurück – guter Zeitpunkt.',
    'Offenes Angebot noch nicht abgeschlossen.'
  ],
  C: [
    'C-Kunde – Reaktivierungspotenzial vorhanden.',
    'Günstig gelegen, kein Umweg nötig.',
    'Seit längerer Zeit kein Kontakt – Relationship pflegen.'
  ]
}

function mockScore(kunde: Kunde): number {
  let score = 50
  if (kunde.abcStatus === 'A') score += 30
  else if (kunde.abcStatus === 'B') score += 15
  const tage = daysSince(kunde.letzterBesuch)
  if (tage > 60) score += 20
  else if (tage > 30) score += 10
  score += Math.min(20, Math.floor(kunde.umsatzPotenzial / 10000))
  score += Math.floor(Math.random() * 5)
  return Math.min(100, score)
}

function mockBegruendung(kunde: Kunde): string {
  const pool = BEGRUENDUNGEN[kunde.abcStatus]
  const tage = daysSince(kunde.letzterBesuch)
  const base = pool[Math.floor(Math.random() * pool.length)]
  return `${base} Letzter Besuch vor ${tage} Tagen.`
}

async function withDelay<T>(result: T, ms = 1500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms))
}

export const useKiStore = defineStore('ki', () => {
  const isLoading = ref(false)
  const currentTask = ref<KiTask>(null)

  async function berechneEmpfehlungen(kandidaten: Kunde[]): Promise<KiEmpfehlungResult[]> {
    isLoading.value = true
    currentTask.value = 'empfehlung'
    const scored = kandidaten
      .map((k) => ({ kunde: k, score: mockScore(k), begruendung: mockBegruendung(k) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
    const result = await withDelay(scored)
    isLoading.value = false
    currentTask.value = null
    return result
  }

  async function optimiereRoute(besuche: Besuch[], kunden: Kunde[]): Promise<string[]> {
    isLoading.value = true
    currentTask.value = 'route'
    const { nearestNeighborSort } = await import('@/utils/routeOptimierung')
    const ordered = nearestNeighborSort(besuche, kunden)
    const result = await withDelay(ordered)
    isLoading.value = false
    currentTask.value = null
    return result
  }

  async function erstelleGespraechsvorbereitung(
    kunde: Kunde,
    aktivitaeten: Aktivitaet[],
    opportunities: Opportunity[]
  ): Promise<KiGespraechResult> {
    isLoading.value = true
    currentTask.value = 'gespraech'
    const letzteAkt = aktivitaeten[0]
    const offeneOps = opportunities.filter((o) => o.status === 'offen')
    const result: KiGespraechResult = {
      zusammenfassung: `${kunde.name} ist ein ${kunde.abcStatus}-Kunde aus der Branche ${kunde.branche}. Der letzte Kontakt fand vor ${daysSince(kunde.letzterBesuch)} Tagen statt. ${offeneOps.length > 0 ? `Es gibt ${offeneOps.length} offene Opportunity/Opportunities im Gesamtwert von ${offeneOps.reduce((s, o) => s + o.wert, 0).toLocaleString('de-DE')} €.` : 'Aktuell keine offenen Opportunities.'}`,
      gespraechspunkte: [
        letzteAkt ? `Nachfassen: "${letzteAkt.notiz}"` : 'Erstkontakt vertiefen',
        offeneOps.length > 0 ? `Status "${offeneOps[0].titel}" klären` : 'Neuen Bedarf ermitteln',
        'Aktuelle Zufriedenheit und Pain Points erfragen',
        `Umsatzpotenzial von ${(kunde.umsatzPotenzial / 1000).toFixed(0)} T€ ausschöpfen`,
        'Entscheidungsträger und Zeitplan für nächsten Schritt festlegen'
      ],
      letzteAktivitaet: letzteAkt
        ? `${letzteAkt.typ} am ${letzteAkt.datum.toLocaleDateString('de-DE')}: ${letzteAkt.notiz}`
        : 'Keine Aktivitäten erfasst'
    }
    return await withDelay(result)
      .finally(() => {
        isLoading.value = false
        currentTask.value = null
      })
  }

  async function schlageAusfallersatzVor(
    ausgefallenerKunde: Kunde,
    alleKunden: Kunde[]
  ): Promise<KiEmpfehlungResult[]> {
    isLoading.value = true
    currentTask.value = 'ausfallersatz'
    const nearby = alleKunden
      .filter((k) => k.id !== ausgefallenerKunde.id)
      .map((k) => ({
        kunde: k,
        dist: haversine(ausgefallenerKunde.lat, ausgefallenerKunde.lng, k.lat, k.lng)
      }))
      .filter((e) => e.dist <= 30)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 8)
      .map((e) => ({ kunde: e.kunde, score: mockScore(e.kunde), begruendung: mockBegruendung(e.kunde) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
    const result = await withDelay(nearby)
    isLoading.value = false
    currentTask.value = null
    return result
  }

  async function verarbeiteBesuchsBericht(
    transkript: string,
    kunde: Kunde,
    aktivitaeten: Aktivitaet[]
  ): Promise<KiBesuchsBerichtResult> {
    isLoading.value = true
    currentTask.value = 'bericht'
    const tage = daysSince(kunde.letzterBesuch)
    const letzteAkt = aktivitaeten[0]
    const positiv = transkript.length > 80 || transkript.toLowerCase().includes('gut') || transkript.toLowerCase().includes('positiv')
    const kritisch = transkript.toLowerCase().includes('problem') || transkript.toLowerCase().includes('unzufrieden')
    const stimmung: 'positiv' | 'neutral' | 'kritisch' = kritisch ? 'kritisch' : positiv ? 'positiv' : 'neutral'

    const zusammenfassung = `Besuch bei ${kunde.name} (${kunde.abcStatus}-Kunde, ${kunde.branche}). ${stimmung === 'positiv' ? 'Gespräch verlief sehr positiv.' : stimmung === 'kritisch' ? 'Es wurden kritische Punkte angesprochen.' : 'Routinegespräch ohne besondere Vorkommnisse.'} ${letzteAkt ? `Seit dem letzten Kontakt (${letzteAkt.typ} vor ${tage} Tagen) gab es relevante Entwicklungen.` : ''}`

    const heute = new Date()
    const inTagen = (n: number): Date => {
      const d = new Date(heute)
      d.setDate(d.getDate() + n)
      return d
    }

    const folgeaktionen: Omit<Folgeaktion, 'id' | 'besuchId' | 'kundeId' | 'erledigt'>[] = [
      { typ: 'Email', beschreibung: `Besuchsprotokoll und Zusammenfassung an ${kunde.name} senden`, faelligAm: inTagen(2) },
      { typ: 'Anruf', beschreibung: 'Offene Fragen telefonisch klären und Feedback einholen', faelligAm: inTagen(7) },
      { typ: 'Besuch', beschreibung: `Folgetermin bei ${kunde.name} einplanen`, faelligAm: inTagen(30) }
    ]

    if (kunde.abcStatus === 'A' || stimmung === 'positiv') {
      folgeaktionen.splice(2, 0, { typ: 'Angebot', beschreibung: 'Angebot für besprochene Lösung erstellen', faelligAm: inTagen(5) })
    }

    const result: KiBesuchsBerichtResult = { zusammenfassung, stimmung, folgeaktionen }
    return await withDelay(result).finally(() => {
      isLoading.value = false
      currentTask.value = null
    })
  }

  async function erstelleTagesBriefing(
    besuche: Besuch[],
    kunden: Kunde[]
  ): Promise<KiTagesBriefingResult> {
    isLoading.value = true
    currentTask.value = 'briefing'
    const geplant = besuche.filter((b) => b.status === 'geplant')
    const prioritaetsKunde = kunden
      .filter((k) => geplant.some((b) => b.kundeId === k.id))
      .sort((a, b) => {
        const scoreA = (a.abcStatus === 'A' ? 3 : a.abcStatus === 'B' ? 2 : 1) * 10 + daysSince(a.letzterBesuch) / 10
        const scoreB = (b.abcStatus === 'A' ? 3 : b.abcStatus === 'B' ? 2 : 1) * 10 + daysSince(b.letzterBesuch) / 10
        return scoreB - scoreA
      })[0]

    const result: KiTagesBriefingResult = {
      prioritaet: prioritaetsKunde
        ? `${prioritaetsKunde.name} (${prioritaetsKunde.abcStatus}-Kunde, ${daysSince(prioritaetsKunde.letzterBesuch)} Tage kein Besuch)`
        : 'Alle Termine gleichwertig',
      routeStatus: geplant.length >= 2 ? 'Route optimiert · ca. 45 min Fahrzeit gesamt' : 'Einzeltermin · keine Optimierung nötig',
      hinweis: prioritaetsKunde && prioritaetsKunde.abcStatus === 'A'
        ? `Bereiten Sie sich gut auf ${prioritaetsKunde.name} vor – hohe Abschlusschance!`
        : 'Gute Vorbereitung ist der Schlüssel – viel Erfolg!'
    }
    return await withDelay(result, 1000).finally(() => {
      isLoading.value = false
      currentTask.value = null
    })
  }

  return {
    isLoading,
    currentTask,
    berechneEmpfehlungen,
    optimiereRoute,
    erstelleGespraechsvorbereitung,
    schlageAusfallersatzVor,
    verarbeiteBesuchsBericht,
    erstelleTagesBriefing
  }
})
