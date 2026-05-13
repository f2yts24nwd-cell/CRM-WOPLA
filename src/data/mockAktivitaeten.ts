import type { Aktivitaet } from '@/types'
import { d } from '@/utils/dates'

export const mockAktivitaeten: Aktivitaet[] = [
  { id: 'a01', kundeId: 'k01', typ: 'Besuch', datum: d('2026-03-05'), notiz: 'Jahresgespräch geführt. Interesse an neuem Produkt X.' },
  { id: 'a02', kundeId: 'k01', typ: 'Anruf', datum: d('2026-04-10'), notiz: 'Lieferverzögerung besprochen, Kulanz gewährt.' },
  { id: 'a03', kundeId: 'k01', typ: 'Email', datum: d('2026-04-25'), notiz: 'Angebot AN-2026-0042 versendet.' },
  { id: 'a04', kundeId: 'k02', typ: 'Besuch', datum: d('2026-04-28'), notiz: 'Demo der KI-Plattform, sehr positives Feedback.' },
  { id: 'a05', kundeId: 'k02', typ: 'Anruf', datum: d('2026-03-15'), notiz: 'Technische Fragen zur API-Anbindung geklärt.' },
  { id: 'a06', kundeId: 'k03', typ: 'Besuch', datum: d('2026-02-14'), notiz: 'Neues Lager vorgestellt. Expansionspläne erwähnt.' },
  { id: 'a07', kundeId: 'k03', typ: 'Email', datum: d('2026-03-01'), notiz: 'Produktkatalog Q1 zugesandt.' },
  { id: 'a08', kundeId: 'k03', typ: 'Anruf', datum: d('2026-04-20'), notiz: 'Preisverhandlung eingeleitet.' },
  { id: 'a09', kundeId: 'k04', typ: 'Besuch', datum: d('2026-04-15'), notiz: 'Quartalsreview. Umsatz +15% gegenüber Vorjahr.' },
  { id: 'a10', kundeId: 'k04', typ: 'Anruf', datum: d('2026-05-02'), notiz: 'Dringende Nachbestellung für Produkt Y.' },
  { id: 'a11', kundeId: 'k05', typ: 'Besuch', datum: d('2026-04-02'), notiz: 'Ersttermin nach Empfehlung von k02.' },
  { id: 'a12', kundeId: 'k05', typ: 'Email', datum: d('2026-04-10'), notiz: 'Infomaterial zugesandt.' },
  { id: 'a13', kundeId: 'k06', typ: 'Besuch', datum: d('2026-03-20'), notiz: 'Projektstart Q2 besprochen.' },
  { id: 'a14', kundeId: 'k06', typ: 'Anruf', datum: d('2026-04-08'), notiz: 'Statusupdate Lieferung.' },
  { id: 'a15', kundeId: 'k07', typ: 'Besuch', datum: d('2026-02-28'), notiz: 'Neues Studienprojekt vorgestellt.' },
  { id: 'a16', kundeId: 'k08', typ: 'Besuch', datum: d('2026-04-10'), notiz: 'Reklamation aus Januar abgeschlossen.' },
  { id: 'a17', kundeId: 'k09', typ: 'Besuch', datum: d('2026-03-01'), notiz: 'Vertragsverlängerung besprochen.' },
  { id: 'a18', kundeId: 'k10', typ: 'Besuch', datum: d('2026-01-20'), notiz: 'Jahresplanung 2026 abgestimmt.' },
  { id: 'a19', kundeId: 'k10', typ: 'Email', datum: d('2026-03-10'), notiz: 'Neues Produktportfolio zugeschickt.' },
  { id: 'a20', kundeId: 'k11', typ: 'Besuch', datum: d('2026-04-22'), notiz: 'Messe-Nachgespräch.' },
  { id: 'a21', kundeId: 'k12', typ: 'Besuch', datum: d('2025-11-30'), notiz: 'Letzter Besuch vor Weihnachten.' },
  { id: 'a22', kundeId: 'k13', typ: 'Besuch', datum: d('2026-01-08'), notiz: 'Reaktivierungsgespräch nach Pause.' },
  { id: 'a23', kundeId: 'k14', typ: 'Besuch', datum: d('2025-12-15'), notiz: 'Technische Anforderungen besprochen.' },
  { id: 'a24', kundeId: 'k15', typ: 'Besuch', datum: d('2026-02-05'), notiz: 'Projekt Waldkiefer Final abgestimmt.' }
]
