import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
import userService from '../services/user';
import { version } from '../../package.json';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    version,
    profile: null,
    snackbar: { snack: '' },
    calendar: '',
    files: {},
    fileUrls: {},
    users: {},
    emails: {},
    userImages: {},
    userImageTimestamps: {},
    reports: {},
    assignments: {},
    homeworks: {},
    rooms: {},
    roomTopics: {},
    videos: {},

    applications: {},
    attachments: {},
    offers: {},
    recommendations: {},
    evaluations: {},
    evaluators: {},
    evaluationsByEvaluator: {},
    myEvaluations: [],
    evaluationsById: {},
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
    setCalendar(state, { data }) {
      state.calendar = data;
    },
    setVideos(state, { data }) {
      state.videos = data;
    },
    setFiles(state, { data }) {
      state.files = data;
    },
    setFile(state, { filename, data }) {
      Vue.set(state.fileUrls, filename, data);
    },
    setUsers(state, { data }) {
      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.users, data[i].id, data[i]);
        Vue.set(state.emails, data[i].email, data[i].id);
        if (data[i].id === state.profile.id) state.profile = data[i];
        if (data[i].image || data[i].noImage) {
          if (data[i].image) Vue.set(state.userImages, data[i].id, data[i].image);
          Vue.set(state.userImageTimestamps, data[i].id, Date.now());
        }
      }
    },

    setRooms(state, { data }) {
      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.rooms, data[i].meetingId, data[i]);
        Vue.set(state.roomTopics, data[i].topic, data[i]);
      }
    },

    setReports(state, { data }) {
      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.reports, data[i].id, data[i]);
      }
    },

    setAssignments(state, { data }) {
      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.assignments, data[i].id, data[i]);
      }
    },
    setHomeworks(state, { data }) {
      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.homeworks, data[i].id, data[i]);
      }
    },

    setOffer(state, { id, data }) {
      Vue.set(state.offers, id, data);
    },
    setMyEvaluations(state, data) {
      state.myEvaluations = data;
    },
    setEvaluators(state, data) {
      state.evaluators = data;
    },
    setEvaluationsForEvaluator(state, { id, data }) {
      Vue.set(state.evaluationsByEvaluator, id, data);
    },

    setProfile(state, user) {
      state.profile = user;
    },

    setApplications(state, data) {
      for (let i = 0; i < data.length; i += 1) {
        Vue.set(state.applications, data[i].id, data[i]);
      }
    },

    setRecommendations(state, { id, data }) {
      Vue.set(state.recommendations, id, data);
    },

    setEvaluations(state, { id, data }) {
      Vue.set(state.evaluations, id, data);
    },

    removeEvaluation(state, data) {
      const applicationId = data.application;
      const evaluations = state.evaluations[applicationId];
      for (let i = 0; i < evaluations.length; i += 1) {
        if (evaluations[i].evaluator.id === data.evaluator.id) {
          Vue.delete(state.evaluations[applicationId], i);
          return;
        }
      }
    },

    removeOffer(state, id) {
      Object.keys(state.offers).forEach((key) => {
        if (key && state.offers && state.offers[key] && (state.offers[key].id === id)) {
          Vue.set(state.offers, key, {});
        }
      });
    },

    setEvaluationById(state, { id, data }) {
      Vue.set(state.evaluationsById, id, data);
    },

    setEvaluation(state, data) {
      const applicationId = data.application;
      const evaluations = state.evaluations[applicationId];

      for (let i = 0; i < evaluations.length; i += 1) {
        if (evaluations[i].evaluator.id === data.evaluator.id) {
          Vue.set(state.evaluations[applicationId], i, data);

          return;
        }
      }

      Vue.set(state.evaluations, applicationId, [data]);
    },

    logout(state) {
      state.profile = null;
      state.users = {};
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

    getCalendar({ dispatch, commit }) {
      userService.getCalendar().then(
        (response) => {
          if (response.status === 200) {
            commit('setCalendar', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getVideos({ dispatch, commit }) {
      userService.getVideos().then(
        (response) => {
          if (response.status === 200) {
            commit('setVideos', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },


    getFiles({ dispatch, commit }) {
      userService.getFiles().then(
        (response) => {
          if (response.status === 200) {
            commit('setFiles', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getFile({ dispatch, commit }, filename) {
      userService.getFile(filename).then(
        (response) => {
          if (response.status === 200) {
            commit('setFile', { filename, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getUser({ dispatch, commit }, id) {
      userService.getUser(id).then(
        (response) => {
          if (response.status === 200) {
            const { data } = response;
            commit('setUsers', { data: [data] });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getUserFromCache({ dispatch, commit, state }, id) {
      if (state.userImageTimestamps[id]) {
        // Wait five minutes before bothering to get new images
        if (Date.now() - state.userImageTimestamps[id] < 5 * 60 * 1000) {
          return;
        }
      }

      userService.getUser(id).then(
        (response) => {
          if (response.status === 200) {
            const { data } = response;

            if (response.data.image === undefined) data.noImage = true;

            commit('setUsers', { data: [data] });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getUsers({ dispatch, commit }) {
      userService.getUsers().then(
        (response) => {
          if (response.status === 200) {
            commit('setUsers', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    updateUser({ dispatch, commit }, { id, data }) {
      userService.putUser(id, data).then(
        (response) => {
          if (response.status === 200) {
            commit('setUsers', { data: [response.data] });
            dispatch('alertSuccess', 'User updated');
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getRooms({ dispatch, commit }) {
      userService.getRooms().then(
        (response) => {
          if (response.status === 200) {
            commit('setRooms', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getReports({ dispatch, commit }) {
      userService.getReports().then(
        (response) => {
          if (response.status === 200) {
            commit('setReports', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    submitReport({ dispatch, commit }, data) {
      userService.postReport(data).then(
        (response) => {
          if (response.status === 200) {
            commit('setReports', { data: [response.data] });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getAssignments({ dispatch, commit }) {
      userService.getAssignments().then(
        (response) => {
          if (response.status === 200) {
            commit('setAssignments', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    submitAssignment({ dispatch, commit }, data) {
      userService.postAssignment(data).then(
        (response) => {
          if (response.status === 200) {
            commit('setAssignments', { data: [response.data] });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    updateAssignment({ dispatch, commit }, { id, data }) {
      userService.putAssignment(id, data).then(
        (response) => {
          if (response.status === 200) {
            commit('setAssignments', { data: [response.data] });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    submitHomework({ dispatch, commit }, { user, assignment, pdf }) {
      userService.postHomework({ user, assignment, pdf }).then(
        (response) => {
          if (response.status === 200) {
            commit('setHomeworks', { data: [response.data] });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getHomeworks({ dispatch, commit }) {
      userService.getHomeworks().then(
        (response) => {
          if (response.status === 200) {
            commit('setHomeworks', { data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },


    getAttachments({ dispatch, commit }, id) {
      userService.getAttachments(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setAttachments', { id, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getEvaluatorEvaluations({ dispatch, commit }, id) {
      userService.getEvaluatorEvaluations(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setEvaluationsForEvaluator', { id, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getRecommendations({ dispatch, commit }, id) {
      userService.getRecommendations(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setRecommendations', { id, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getOffer({ dispatch, commit }, id) {
      userService.getOffer(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setOffer', { id, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getEvaluations({ dispatch, commit }, id) {
      userService.getEvaluations(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setEvaluations', { id, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getEvaluation({ dispatch, commit }, id) {
      userService.getEvaluation(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setEvaluationById', { id, data: response.data });
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getMyEvaluations({ dispatch, commit }) {
      userService.getMyEvaluations().then(
        (response) => {
          if (response.status === 200) {
            commit('setMyEvaluations', response.data);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    deleteEvaluation({ dispatch, commit }, id) {
      userService.deleteEvaluation(id).then(
        (response) => {
          if (response.status === 200) {
            commit('removeEvaluation', response.data);
            dispatch('alertSuccess', 'Evaluation deleted!');
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    deleteOffer({ dispatch, commit }, id) {
      userService.deleteOffer(id).then(
        (response) => {
          if (response.status === 200) {
            commit('removeOffer', id);
            dispatch('alertSuccess', 'Offer rescinded!');
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    updateEvaluation({ dispatch, commit }, { id, data }) {
      userService.putEvaluation(id, data).then(
        (response) => {
          if (response.status === 200) {
            commit('setEvaluation', response.data);
            dispatch('alertSuccess', 'Evaluation submitted!');
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    updateOffer({ dispatch, commit }, { id, data }) {
      userService.putOffer(id, data).then(
        (response) => {
          if (response.status === 200) {
            commit('setOffer', { id: response.data.application, data: response.data });
            dispatch('alertSuccess', 'Offer provided!');
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getApplication({ dispatch, commit }, id) {
      userService.getApplication(id).then(
        (response) => {
          if (response.status === 200) {
            commit('setApplications', [response.data]);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getEvaluators({ dispatch, commit }) {
      userService.getEvaluators().then(
        (response) => {
          if (response.status === 200) {
            commit('setEvaluators', response.data);
          }
        },
        (error) => {
          dispatch('alertError', error, { root: true });
        },
      );
    },

    getApplications({ dispatch, commit }) {
      userService.getApplications().then(
        (response) => {
          if (response.status === 200) {
            commit('setApplications', response.data);
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
