import type { Aktivitaet } from '@/types'
import { d } from '@/utils/dates'

export const mockAktivitaeten: Aktivitaet[] = [
  { id: 'a01', kundeId: 'k01', typ: 'Besuch', datum: d('2026-03-08'), notiz: 'Jahresgespräch mit Herrn Kessler. Interesse an neuer Schmuckpolitur-Linie.' },
  { id: 'a02', kundeId: 'k01', typ: 'Anruf', datum: d('2026-04-10'), notiz: 'Liefertermin für Galvanikmittel besprochen und bestätigt.' },
  { id: 'a03', kundeId: 'k01', typ: 'Email', datum: d('2026-04-25'), notiz: 'Angebot AN-2026-0042 über Reinigungsmittel versendet.' },
  { id: 'a04', kundeId: 'k02', typ: 'Besuch', datum: d('2026-04-05'), notiz: 'Demo der neuen Fräskomponenten. Sehr positives Feedback von Fr. Winter.' },
  { id: 'a05', kundeId: 'k02', typ: 'Anruf', datum: d('2026-03-15'), notiz: 'Technische Fragen zur ISO-Zertifizierung der Teile geklärt.' },
  { id: 'a06', kundeId: 'k03', typ: 'Besuch', datum: d('2026-03-28'), notiz: 'Neue Uhrwerkkomponenten vorgestellt. Expansionspläne in Richtung Smartwatch.' },
  { id: 'a07', kundeId: 'k03', typ: 'Email', datum: d('2026-04-15'), notiz: 'Technische Datenblätter für Miniaturlager zugesandt.' },
  { id: 'a08', kundeId: 'k03', typ: 'Anruf', datum: d('2026-05-02'), notiz: 'Rückfrage zu Lieferzeit. 3-4 Wochen bestätigt.' },
  { id: 'a09', kundeId: 'k04', typ: 'Besuch', datum: d('2026-04-18'), notiz: 'Quartalsreview Mühlacker. Produktionsvolumen +12% gegenüber Vorjahr.' },
  { id: 'a10', kundeId: 'k04', typ: 'Anruf', datum: d('2026-05-05'), notiz: 'Nachbestellung Rohgranulat für Spritzguss dringend.' },
  { id: 'a11', kundeId: 'k05', typ: 'Besuch', datum: d('2026-04-22'), notiz: 'Ersttermin nach Messekontakt Hannover. Großes Interesse an Cloud-Integration.' },
  { id: 'a12', kundeId: 'k05', typ: 'Email', datum: d('2026-05-01'), notiz: 'Referenzprojekte und Infomaterial zugesandt.' },
  { id: 'a13', kundeId: 'k06', typ: 'Besuch', datum: d('2026-02-12'), notiz: 'Beschichtungsqualität besprochen, neue Testserie gestartet.' },
  { id: 'a14', kundeId: 'k06', typ: 'Anruf', datum: d('2026-03-20'), notiz: 'Ergebnisse Testserie positiv. Serienstart Q2 geplant.' },
  { id: 'a15', kundeId: 'k07', typ: 'Besuch', datum: d('2026-04-08'), notiz: 'Präzisionsteile für Medizintechnik besprochen. Zertifizierung läuft.' },
  { id: 'a16', kundeId: 'k08', typ: 'Besuch', datum: d('2026-03-22'), notiz: 'Lieferproblem Januar abgeschlossen, Wiedergutmachungsangebot akzeptiert.' },
  { id: 'a17', kundeId: 'k09', typ: 'Besuch', datum: d('2026-03-01'), notiz: 'Druckaufträge Q2 besprochen. Rahmenvertrag verlängert.' },
  { id: 'a18', kundeId: 'k10', typ: 'Besuch', datum: d('2026-02-19'), notiz: 'Jahresplanung Elektroinstallation 2026 abgestimmt.' },
  { id: 'a19', kundeId: 'k10', typ: 'Email', datum: d('2026-03-25'), notiz: 'Neues Produktportfolio Schaltschranktechnik zugeschickt.' },
  { id: 'a20', kundeId: 'k11', typ: 'Besuch', datum: d('2026-01-10'), notiz: 'Maschinenwartungsvertrag verlängert. Neue Anlage in Planung.' },
  { id: 'a21', kundeId: 'k12', typ: 'Besuch', datum: d('2026-01-30'), notiz: 'Tourismuskonzept 2026 besprochen. Saisonstart Anfang Mai.' },
  { id: 'a22', kundeId: 'k13', typ: 'Besuch', datum: d('2025-12-15'), notiz: 'Reaktivierungsgespräch nach langer Pause. Interesse an neuem Sortiment.' },
  { id: 'a23', kundeId: 'k14', typ: 'Besuch', datum: d('2026-02-08'), notiz: 'IT-Infrastrukturprojekt vorgestellt. Angebot angefordert.' },
  { id: 'a24', kundeId: 'k15', typ: 'Besuch', datum: d('2026-01-05'), notiz: 'Logistikkonzept für neue Route besprochen.' }
]
