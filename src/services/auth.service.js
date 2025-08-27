import api from './api';

const authService = {
  // For signup - ensures phone number is unique
  async getOtpForSignup(phone_number) {
    const response = await api.post('/getOtpForSignup', { phone_number });
    return response.data;
  },

  // For login with OTP
  async getOtpForLogin(phone_number) {
    const response = await api.post('/getOtpForLogin', { phone_number });
    return response.data;
  },

  // For updates (protected - requires auth)
  async getOtp(phone_number) {
    const response = await api.post('/getOtp', { phone_number });
    return response.data;
  },

  async verify(phone_number, verification_code, section = 'signup') {
    const response = await api.post('/verify', { 
      phone_number, 
      verification_code: parseInt(verification_code),
      section 
    });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async loginWithPassword(email, password) {
    const response = await api.post('/loginWithPassword', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
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
    const response = await api.post('/user/submitUserDetail', userData);
    return response.data;
  },

  async getUserDetails() {
    const response = await api.get('/user/getUser');
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/resetPassword', data);
    return response.data;
  },

  async changePassword(oldPassword, newPassword, confirmPassword) {
    const response = await api.post('/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    return response.data;
  },

  async getUserTypes() {
    const response = await api.get('/user/getUserTypes');
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