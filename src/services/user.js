import axios from 'axios';
// import store from '../store';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

export default {
  async requestPassword(email) {
    return axios.post(`/users/${email}`);
  },


  async login(email, password) {
    return axios.get(`/users/${email}/authorize`, {
      auth: {
        username: email,
        password,
      },
    });
  },

  async putApplication(id, data) {
    return axios.put(`/users/${id}/application/${new Date().getFullYear()}`, data);
  },

  async getApplication(id) {
    return axios.get(`/users/${id}/application/${new Date().getFullYear()}`);
  },

  async getRecommendations(id) {
    return axios.get(`/users/${id}/application/${new Date().getFullYear()}/recommendations`);
  },

  async getAttachments(id) {
    return axios.get(`/users/${id}/application/${new Date().getFullYear()}/attachments`);
  },

  async deleteAttachment(id, attachmentId) {
    return axios.delete(`/users/${id}/application/${new Date().getFullYear()}/attachments/${attachmentId}`);
  },

  async postAttachment(id, file, label) {
    const formData = new FormData();

    formData.append('file', file);

    let url = `/users/${id}/application/${new Date().getFullYear()}/attachments`;
    if (label) url = `${url}/${label}`;

    return axios.post(url,
                      formData,
                      {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      });
  },

  async addRecommendation(id, email) {
    return axios.post(`/users/${id}/application/${new Date().getFullYear()}/recommendations/${email}`);
  },

};
