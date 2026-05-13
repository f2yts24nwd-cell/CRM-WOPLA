export interface Kunde {
  id: string
  name: string
  kundennummer: string
  adresse: string
  lat: number
  lng: number
  branche: string
  abcStatus: 'A' | 'B' | 'C'
  letzterBesuch: Date
  umsatzPotenzial: number
}

export interface Ansprechpartner {
  id: string
  kundeId: string
  name: string
  rolle: string
  telefon: string
  email: string
}

export interface Aktivitaet {
  id: string
  kundeId: string
  typ: 'Besuch' | 'Anruf' | 'Email'
  datum: Date
  notiz: string
}

export interface Opportunity {
  id: string
  kundeId: string
  titel: string
  wert: number
  status: 'offen' | 'gewonnen' | 'verloren'
  abschlussDatum: Date
}

export interface Angebot {
  id: string
  opportunityId: string
  kundeId: string
  nummer: string
  summe: number
  status: 'Entwurf' | 'Gesendet' | 'Akzeptiert' | 'Abgelehnt'
  erstelltAm: Date
}

export interface Besuch {
  id: string
  kundeId: string
  datum: Date
  startzeit: string
  endzeit: string
  notiz: string
  status: 'geplant' | 'abgeschlossen' | 'ausgefallen'
}

export interface KiEmpfehlungResult {
  kunde: Kunde
  score: number
  begruendung: string
}

export interface KiGespraechResult {
  zusammenfassung: string
  gespraechspunkte: string[]
  letzteAktivitaet: string
}

export type Wochentag = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr'
export type AbcStatus = 'A' | 'B' | 'C'
