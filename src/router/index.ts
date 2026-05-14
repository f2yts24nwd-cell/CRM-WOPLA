import { createRouter, createWebHashHistory } from 'vue-router'
import HeuteView from '@/views/HeuteView.vue'
import WochenPlanungView from '@/views/WochenPlanungView.vue'
import UmkreisSucheView from '@/views/UmkreisSucheView.vue'
import KundenDetailView from '@/views/KundenDetailView.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'heute', component: HeuteView },
    { path: '/woche', name: 'wochenplanung', component: WochenPlanungView },
    { path: '/umkreissuche', name: 'umkreissuche', component: UmkreisSucheView,
      props: (route) => ({ vorausgewaehlteBesuchId: route.query.besuchId as string | undefined }) },
    { path: '/kunden/:id', name: 'kundendetail', component: KundenDetailView, props: true }
  ]
})
