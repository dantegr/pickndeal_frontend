import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 5,
              borderRadius: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Stack spacing={4}>
              {/* Header */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                  <img src={logo} alt="PickNDeal" style={{ maxHeight: '60px' }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#4b4b4b',
                    mb: 1,
                    textAlign: 'left',
                  }}
                >
                  Sign In
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#909097',
                    fontWeight: 500,
                    textAlign: 'left',
                  }}
                >
                  To access marketplace of suppliers and retailers!
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="standard"
                    InputLabelProps={{
                      sx: { fontWeight: 600 }
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="standard"
                    InputLabelProps={{
                      sx: { fontWeight: 600 }
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                      sx={{
                        maxWidth: '200px',
                        position: 'relative',
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </Box>
                </Stack>
              </Box>

              {/* Links */}
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: '#4b4b4b' }}>
                  Don't have an account?{' '}
                  <MuiLink
                    component={Link}
                    to="/signup"
                    sx={{
                      color: '#2e42e2',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign Up
                  </MuiLink>
                </Typography>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    color: '#2e42e2',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot your password?
                </MuiLink>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>
  );
};

export default Login;