import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Kunde, Ansprechpartner, Aktivitaet, Opportunity, Angebot } from '@/types'
import { mockKunden } from '@/data/mockKunden'
import { mockAnsprechpartner } from '@/data/mockAnsprechpartner'
import { mockAktivitaeten } from '@/data/mockAktivitaeten'
import { mockOpportunities } from '@/data/mockOpportunities'
import { mockAngebote } from '@/data/mockAngebote'
import { haversine } from '@/utils/geo'

export const useKundenStore = defineStore('kunden', () => {
  const kunden = ref<Kunde[]>(mockKunden)
  const ansprechpartner = ref<Ansprechpartner[]>(mockAnsprechpartner)
  const aktivitaeten = ref<Aktivitaet[]>(mockAktivitaeten)
  const opportunities = ref<Opportunity[]>(mockOpportunities)
  const angebote = ref<Angebot[]>(mockAngebote)

  function getKundeById(id: string): Kunde | undefined {
    return kunden.value.find((k) => k.id === id)
  }

  function getAnsprechpartnerForKunde(kundeId: string): Ansprechpartner[] {
    return ansprechpartner.value.filter((a) => a.kundeId === kundeId)
  }

  function getAktivitaetenForKunde(kundeId: string): Aktivitaet[] {
    return aktivitaeten.value
      .filter((a) => a.kundeId === kundeId)
      .sort((a, b) => b.datum.getTime() - a.datum.getTime())
  }

  function getOpportunitiesForKunde(kundeId: string): Opportunity[] {
    return opportunities.value
      .filter((o) => o.kundeId === kundeId)
      .sort((a, b) => b.abschlussDatum.getTime() - a.abschlussDatum.getTime())
  }

  function getAngeboteForKunde(kundeId: string): Angebot[] {
    return angebote.value
      .filter((a) => a.kundeId === kundeId)
      .sort((a, b) => b.erstelltAm.getTime() - a.erstelltAm.getTime())
  }

  function kundenImUmkreis(lat: number, lng: number, radiusKm: number): Kunde[] {
    return kunden.value.filter((k) => haversine(lat, lng, k.lat, k.lng) <= radiusKm)
  }

  return {
    kunden,
    ansprechpartner,
    aktivitaeten,
    opportunities,
    angebote,
    getKundeById,
    getAnsprechpartnerForKunde,
    getAktivitaetenForKunde,
    getOpportunitiesForKunde,
    getAngeboteForKunde,
    kundenImUmkreis
  }
})
