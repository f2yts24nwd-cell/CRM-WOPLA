import type { Besuch } from '@/types'
import { d } from '@/utils/dates'

// KW 20: Mo 11.05. – Fr 15.05.2026
export const mockBesuche: Besuch[] = [
  // Montag 11.05.
  { id: 'b01', kundeId: 'k01', datum: d('2026-05-11'), startzeit: '09:00', endzeit: '10:00', notiz: 'Jahresgespräch vorbereiten', status: 'geplant' },
  { id: 'b02', kundeId: 'k03', datum: d('2026-05-11'), startzeit: '11:00', endzeit: '12:00', notiz: 'Neues Angebot vorstellen', status: 'geplant' },
  { id: 'b03', kundeId: 'k06', datum: d('2026-05-11'), startzeit: '14:00', endzeit: '15:30', notiz: 'Projektbesprechung Q3', status: 'geplant' },

  // Dienstag 12.05.
  { id: 'b04', kundeId: 'k02', datum: d('2026-05-12'), startzeit: '09:00', endzeit: '10:00', notiz: 'Demo der neuen Produktlinie', status: 'geplant' },
  { id: 'b05', kundeId: 'k08', datum: d('2026-05-12'), startzeit: '11:00', endzeit: '12:00', notiz: 'Reklamationsbesuch', status: 'ausgefallen' },
  { id: 'b06', kundeId: 'k09', datum: d('2026-05-12'), startzeit: '14:00', endzeit: '15:30', notiz: 'Verlängerungsangebot besprechen', status: 'geplant' },

  // Mittwoch 13.05.
  { id: 'b07', kundeId: 'k04', datum: d('2026-05-13'), startzeit: '09:00', endzeit: '10:00', notiz: 'Quartalsreview', status: 'geplant' },
  { id: 'b08', kundeId: 'k05', datum: d('2026-05-13'), startzeit: '11:00', endzeit: '12:00', notiz: 'Erstbesuch neues Produkt', status: 'geplant' },
  { id: 'b09', kundeId: 'k07', datum: d('2026-05-13'), startzeit: '14:00', endzeit: '15:30', notiz: 'Follow-up Angebot 2024', status: 'ausgefallen' },

  // Donnerstag 14.05.
  { id: 'b10', kundeId: 'k10', datum: d('2026-05-14'), startzeit: '09:00', endzeit: '10:00', notiz: 'Jahresplanung abstimmen', status: 'geplant' },
  { id: 'b11', kundeId: 'k11', datum: d('2026-05-14'), startzeit: '11:00', endzeit: '12:00', notiz: 'Bestandsaufnahme', status: 'geplant' },
  { id: 'b12', kundeId: 'k12', datum: d('2026-05-14'), startzeit: '14:00', endzeit: '15:30', notiz: 'Reaktivierung', status: 'geplant' },

  // Freitag 15.05.
  { id: 'b13', kundeId: 'k13', datum: d('2026-05-15'), startzeit: '09:00', endzeit: '10:00', notiz: 'Angebotsnachverfolgung', status: 'geplant' },
  { id: 'b14', kundeId: 'k14', datum: d('2026-05-15'), startzeit: '11:00', endzeit: '12:00', notiz: 'Technische Klärung', status: 'geplant' },
  { id: 'b15', kundeId: 'k15', datum: d('2026-05-15'), startzeit: '14:00', endzeit: '15:00', notiz: 'Abschlussgespräch Projekt', status: 'geplant' }
]
