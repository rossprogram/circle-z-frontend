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

  async putUser(id, data) {
    return axios.put(`/users/${id}`, data);
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

  async postHomework({ user, assignment, pdf }) {
    const formData = new FormData();
    formData.append('pdf', pdf);
    return axios.post(`/assignments/${assignment}/users/${user}`, formData);
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
