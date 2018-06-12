import Vue from 'vue'
import App from './App.vue'
import VueFire from 'vuefire'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

Vue.config.productionTip = false
Vue.use(VueFire)
Vue.use(Buefy)


new Vue({
  render: h => h(App)
}).$mount('#app')
