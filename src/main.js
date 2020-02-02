import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'
import store from "./data/store.js"

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
