import api from './api';

const authService = {
  async getOtp(phone) {
    const response = await api.post('/getOtp', { phone });
    return response.data;
  },

  async verify(phone, otp) {
    const response = await api.post('/verify', { phone, otp });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async loginWithPassword(email, password) {
    const response = await api.post('/loginWithPassword', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async submitUserDetail(userData) {
    const response = await api.post('/submitUserDetail', userData);
    return response.data;
  },

  async getUserDetails() {
    const response = await api.get('/getUser');
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/resetPassword', data);
    return response.data;
  },

  async getUserTypes() {
    const response = await api.get('/getUserTypes');
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};

export default authService;