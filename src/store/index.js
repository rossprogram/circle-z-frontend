import Vue from 'vue';
import Vuex from 'vuex';
import { version } from '../../package.json';
import userService from '../services/user';
import router from '@/router';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    version,
    profile: null,
    application: {},
    recommendations: {},
    attachments: {},
    snackbar: { snack: '' },
  },

  mutations: {
    initializeStore(state) {
      // Check if the store exists
      if (localStorage.getItem('store')) {
        const localStore = JSON.parse(localStorage.getItem('store'));

        // Check the version stored against current. If different, don't
        // load the cached version
        if (localStore.version === version) {
          this.replaceState(Object.assign(state, localStore));
        } else {
          state.version = version;
        }
      }
    },

    setProfile(state, user) {
      state.profile = user;
    },

    setApplication(state, data) {
      state.application = data;
    },

    setRecommendations(state, data) {
      state.recommendations = {};

      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.recommendations, data[i].email, data[i]);
      }
    },

    addRecommendation(state, data) {
      Vue.set(state.recommendations, data.email, data);
    },

    removeRecommendation(state, email) {
      Vue.delete(state.recommendations, email);
    },

    setAttachments(state, data) {
      state.attachments = {};

      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.attachments, data[i].id, data[i]);
      }
    },

    addAttachment(state, data) {
      Vue.set(state.attachments, data.id, data);
    },

    removeAttachment(state, id) {
      Vue.delete(state.attachments, id);
    },

    logout(state) {
      state.profile = null;
    },

    loginFailure(state, error) { // eslint-disable-line no-unused-vars
      state.profile = null;
    },

    setSnack(state, snack) {
      state.snackbar.snack = snack;
    },

  },

  actions: {
    alertError({ dispatch, commit }, error) { // eslint-disable-line no-unused-vars
      if (error.response && error.response.data) commit('setSnack', error.response.data);
      else commit('setSnack', error);
    },

    alertSuccess({ dispatch, commit }, success) { // eslint-disable-line no-unused-vars
      commit('setSnack', success);
    },

    login({ dispatch, commit }, { email, password }) {
      userService.login(email, password)
        .then(
          (response) => {
            if (response.status === 200) {
              commit('setProfile', response.data);
              router.push('/');
            } else {
              commit('loginFailure', response.status);
              dispatch('alertError', response, { root: true });
            }
          },
          (error) => {
            commit('loginFailure', error);
            dispatch('alertError', error, { root: true });
          },
        );
    },

    getApplication({ dispatch, commit }) {
      userService.getApplication('me').then(
        (response) => {
          if (response.status === 200) {
            commit('setApplication', response.data);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    addRecommendation({ dispatch, commit }, email) {
      commit('addRecommendation', { email, loading: true });

      userService.addRecommendation('me', email).then(
        (response) => {
          if (response.status === 200) {
            commit('addRecommendation', response.data);
          }
        },
        (error) => {
          commit('removeRecommendation', email);
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getRecommendations({ dispatch, commit }) {
      userService.getRecommendations('me').then(
        (response) => {
          if (response.status === 200) {
            commit('setRecommendations', response.data);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    addAttachment({ dispatch, commit }, { file, label }) {
      userService.postAttachment('me', file, label).then(
        (response) => {
          if (response.status === 200) {
            commit('addAttachment', response.data);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    removeAttachment({ dispatch, commit }, id) {
      userService.deleteAttachment('me', id).then(
        (response) => {
          if (response.status === 200) {
            commit('removeAttachment', id);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getAttachments({ dispatch, commit }) {
      userService.getAttachments('me').then(
        (response) => {
          if (response.status === 200) {
            commit('setAttachments', response.data);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    updateApplication({ dispatch, commit }, data) {
      userService.putApplication('me', data).then(
        (response) => {
          if (response.status === 200) {
            commit('setApplication', response.data);
            dispatch('alertSuccess', 'Application updated!');
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },


    logout({ commit }) {
      commit('logout');
    },


  },
  modules: {
  },
});

export default store;

// Subscribe to store updates
store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem('store', JSON.stringify(state));
});
