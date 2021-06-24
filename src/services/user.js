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

  async getCalendar() {
    return axios.get('/calendar');
  },

  async getRooms() {
    return axios.get('/rooms');
  },

  async getUsers() {
    return axios.get('/users');
  },

  async getUser(id) {
    return axios.get(`/users/${id}`);
  },

  async getUserActivity(id) {
    return axios.get(`/users/${id}/activity`);
  },

  async putUser(id, data) {
    return axios.put(`/users/${id}`, data);
  },

  async getVideos() {
    return axios.get('/videos');
  },

  async getFiles() {
    return axios.get('/files');
  },

  async getFile(f) {
    return axios.get(`/files/${f}`);
  },

  async getReports() {
    return axios.get('/reports');
  },

  async postReport(data) {
    return axios.post('/reports', data);
  },

  async getAssignments() {
    return axios.get('/assignments');
  },

  async postAssignment(data) {
    return axios.post('/assignments', data);
  },

  async putAssignment(id, data) {
    return axios.put(`/assignments/${id}`, data);
  },

  async postHomework({
 user, assignment, pdf, isComplete, isRedo,
}) {
    const formData = new FormData();
    formData.append('pdf', pdf);
    if (isComplete) formData.append('isComplete', true);
    if (isRedo) formData.append('isRedo', true);

    return axios.post(`/assignments/${assignment}/users/${user}`, formData);
  },

  async getActivity() {
    return axios.get('/activity');
  },

  async getHomeworks() {
    return axios.get('/homeworks');
  },

  async getEvaluation(id) {
    return axios.get(`/evaluations/${id}`);
  },

  async putEvaluation(userId, data) {
    return axios.put(`/users/${userId}/application/${new Date().getFullYear()}/evaluations`, data);
  },

  async putOffer(userId, data) {
    return axios.put(`/users/${userId}/application/${new Date().getFullYear()}/offer`, data);
  },

  async deleteEvaluation(id) {
    return axios.delete(`/evaluations/${id}`);
  },


};
