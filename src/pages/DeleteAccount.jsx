import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Alert,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    if (!password) {
      setError('Please enter your password to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          password: password
        }
      });

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" textAlign="center" color="error" gutterBottom>
          Delete Account
        </Typography>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Warning!</Typography>
          <Typography paragraph>This action cannot be undone. Deleting your account will:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Permanently delete all your data</li>
            <li>Remove all your requirements and quotes</li>
            <li>Delete your catalog items</li>
            <li>Cancel any pending transactions</li>
            <li>Remove your profile and business information</li>
          </Box>
        </Alert>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleDeleteAccount}>
          <TextField
            fullWidth
            label="Enter your password to confirm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Type DELETE to confirm account deletion"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            required
            margin="normal"
            variant="outlined"
            helperText="Type DELETE exactly as shown"
          />

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={loading || confirmText !== 'DELETE'}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Deleting Account...' : 'Delete My Account'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/complete-profile')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Typography textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
          Having issues? Contact support instead
        </Typography>
      </Paper>
    </Container>
  );
};

export default DeleteAccount;