import type { Ansprechpartner } from '@/types'

export const mockAnsprechpartner: Ansprechpartner[] = [
  // k01 - Schmuckmanufaktur Kessler & Söhne
  { id: 'ap01', kundeId: 'k01', name: 'Martin Kessler', rolle: 'Geschäftsführer', telefon: '+49 7231 23845', email: 'm.kessler@kessler-schmuck.de' },
  { id: 'ap02', kundeId: 'k01', name: 'Heike Hoffmann', rolle: 'Verkaufsleiterin', telefon: '+49 7231 23846', email: 'h.hoffmann@kessler-schmuck.de' },

  // k02 - Precision Metalworks AG
  { id: 'ap03', kundeId: 'k02', name: 'Dr. Jürgen Berger', rolle: 'Betriebsleiter', telefon: '+49 7231 34567', email: 'j.berger@precision-metalworks.de' },
  { id: 'ap04', kundeId: 'k02', name: 'Claudia Winter', rolle: 'Einkaufsleiterin', telefon: '+49 7231 34568', email: 'c.winter@precision-metalworks.de' },

  // k03 - Schwarzwälder Uhrwerke GmbH
  { id: 'ap05', kundeId: 'k03', name: 'Klaus Meier', rolle: 'Geschäftsführer', telefon: '+49 7231 45678', email: 'k.meier@schwarzwald-uhren.de' },
  { id: 'ap06', kundeId: 'k03', name: 'Monika Schäfer', rolle: 'Projektleiterin', telefon: '+49 7231 45679', email: 'm.schaefer@schwarzwald-uhren.de' },

  // k04 - Mühlacker Kunststoffwerke KG
  { id: 'ap07', kundeId: 'k04', name: 'Werner Lehnert', rolle: 'Geschäftsführer', telefon: '+49 7041 56789', email: 'w.lehnert@muehlacker-kunststoff.de' },
  { id: 'ap08', kundeId: 'k04', name: 'Petra Schröder', rolle: 'Technische Leiterin', telefon: '+49 7041 56790', email: 'p.schroeder@muehlacker-kunststoff.de' },

  // k05 - TechSolutions Bretten AG
  { id: 'ap09', kundeId: 'k05', name: 'Dr. Ralf Stemmler', rolle: 'CEO', telefon: '+49 7252 67890', email: 'r.stemmler@techsolutions-bretten.de' },
  { id: 'ap10', kundeId: 'k05', name: 'Silke Benz', rolle: 'CTO', telefon: '+49 7252 67891', email: 's.benz@techsolutions-bretten.de' },

  // k06 - Galvanik Birkenfeld GmbH
  { id: 'ap11', kundeId: 'k06', name: 'Herbert Stieg', rolle: 'Betriebsleiter', telefon: '+49 7231 78901', email: 'h.stieg@galvanik-birkenfeld.de' },
  { id: 'ap12', kundeId: 'k06', name: 'Renate Lenz', rolle: 'Einkaufsleiterin', telefon: '+49 7231 78902', email: 'r.lenz@galvanik-birkenfeld.de' },

  // k07 - Ispringer Feinmechanik GmbH
  { id: 'ap13', kundeId: 'k07', name: 'Ulrich Aulinger', rolle: 'Geschäftsführer', telefon: '+49 7231 89012', email: 'u.aulinger@ispringer-feinmechanik.de' },
  { id: 'ap14', kundeId: 'k07', name: 'Ingrid Fischer', rolle: 'Qualitätsleiterin', telefon: '+49 7231 89013', email: 'i.fischer@ispringer-feinmechanik.de' },

  // k08 - AutoSupply Niefern GmbH
  { id: 'ap15', kundeId: 'k08', name: 'Hartmut Roth', rolle: 'Geschäftsführer', telefon: '+49 7233 90123', email: 'h.roth@autosupply-niefern.de' },
  { id: 'ap16', kundeId: 'k08', name: 'Sandra Klein', rolle: 'Einkäuferin', telefon: '+49 7233 90124', email: 's.klein@autosupply-niefern.de' },

  // k09 - Remchingen Druckerei AG
  { id: 'ap17', kundeId: 'k09', name: 'Gisela Neubert', rolle: 'Geschäftsführerin', telefon: '+49 7232 12340', email: 'g.neubert@remchingen-druck.de' },

  // k10 - Königsbach Elektrik KG
  { id: 'ap18', kundeId: 'k10', name: 'Dieter Schmitt', rolle: 'Betriebsleiter', telefon: '+49 7231 34561', email: 'd.schmitt@koenigsbach-elektrik.de' },
  { id: 'ap19', kundeId: 'k10', name: 'Brigitte Wald', rolle: 'Vertriebsleiterin', telefon: '+49 7231 34562', email: 'b.wald@koenigsbach-elektrik.de' },

  // k11 - Neuenbürg Maschinenbau GmbH
  { id: 'ap20', kundeId: 'k11', name: 'Andreas Herrmann', rolle: 'Geschäftsführer', telefon: '+49 7082 45672', email: 'a.herrmann@neuenbuerg-mb.de' },

  // k12 - Bad Wildbad Wellness GmbH
  { id: 'ap21', kundeId: 'k12', name: 'Susanne Wolter', rolle: 'Geschäftsführerin', telefon: '+49 7081 56783', email: 's.wolter@badwildbad-wellness.de' },

  // k13 - Straubenhardt Kunststofftechnik AG
  { id: 'ap22', kundeId: 'k13', name: 'Johannes Fischer', rolle: 'Technischer Leiter', telefon: '+49 7235 67894', email: 'j.fischer@straubenhardt-kunststoff.de' },

  // k14 - Keltern IT Services GmbH
  { id: 'ap23', kundeId: 'k14', name: 'Dr. Thomas Vogel', rolle: 'CTO', telefon: '+49 7236 78905', email: 't.vogel@keltern-it.de' },

  // k15 - Kämpfelbach Logistics KG
  { id: 'ap24', kundeId: 'k15', name: 'Frank Krämer', rolle: 'Geschäftsführer', telefon: '+49 7235 89016', email: 'f.kraemer@kaempfelbach-logistics.de' }
]
