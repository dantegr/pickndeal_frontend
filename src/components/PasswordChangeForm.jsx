import React, { useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import {
  Box,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

const PasswordChangeForm = ({ onSuccess }) => {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation - check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const response = await authService.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      
      toast.success(response.message || 'Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handlePasswordSubmit} sx={{ p: 3, bgcolor: '#f9f9f9' }}>
      <TextField
        fullWidth
        type="password"
        name="oldPassword"
        label="Old Password"
        value={passwordForm.oldPassword}
        onChange={handlePasswordChange}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        name="newPassword"
        label="New Password"
        value={passwordForm.newPassword}
        onChange={handlePasswordChange}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        value={passwordForm.confirmPassword}
        onChange={handlePasswordChange}
        required
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ 
          bgcolor: '#2e42e2',
          '&:hover': { bgcolor: '#1e32d2' }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
      </Button>
    </Box>
  );
};

export default PasswordChangeForm;