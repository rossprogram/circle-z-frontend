import Vue from 'vue';
import pluralize from 'pluralize';
import VueTelInput from 'vue-tel-input';
import moment from 'vue-moment';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.use(VueTelInput);
Vue.use(moment);

Vue.config.productionTip = false;

Vue.filter('pluralize', (value, number) => pluralize(value, number));

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initializeStore');
  },
}).$mount('#app');
