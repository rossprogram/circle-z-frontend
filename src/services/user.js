import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

export default {
  async login(email, password) {
    return axios.get(`/users/${email}/authorize`, {
      auth: {
        username: email,
        password,
      },
    });
  },

  async getApplications() {
    return axios.get(`/applications/${new Date().getFullYear()}/`);
  },

  async getApplication(id) {
    return axios.get(`/applications/${new Date().getFullYear()}/${id}`);
  },

  async getAttachments(id) {
    return axios.get(`/applications/${new Date().getFullYear()}/${id}/attachments`);
  },

  async getMyEvaluations() {
    return axios.get('/evaluators/me/evaluations');
  },

  async getRecommendations(id) {
    return axios.get(`/applications/${new Date().getFullYear()}/${id}/recommendations`);
  },

  async getEvaluations(id) {
    return axios.get(`/applications/${new Date().getFullYear()}/${id}/evaluations`);
  },

  async putEvaluation(userId, data) {
    return axios.put(`/users/${userId}/application/${new Date().getFullYear()}/evaluations`, data);
  },

  async deleteEvaluation(id) {
    return axios.delete(`/evaluations/${id}`);
  },


};
