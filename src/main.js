import Vue from 'vue';
import pluralize from 'pluralize';
import VueTelInput from 'vue-tel-input';
import moment from 'vue-moment';
import { VueStars } from 'vue-stars';
import VueMarkdown from 'vue-markdown';
import CountryFlag from 'vue-country-flag';
import VImageInput from 'vuetify-image-input/a-la-carte';
import VueSSE from 'vue-sse';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Person from './components/Person.vue';

Vue.use(VueTelInput);
Vue.use(moment);
Vue.use(VueSSE);

Vue.config.productionTip = false;

Vue.component('vue-stars', VueStars);
Vue.component('vue-markdown', VueMarkdown);
Vue.component('vue-country-flag', CountryFlag);
Vue.component(VImageInput.name, VImageInput);
Vue.component('person', Person);

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
