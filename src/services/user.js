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

};
