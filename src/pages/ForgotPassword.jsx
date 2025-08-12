import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call would go here
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link');
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
                Forgot Password
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#909097',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                Enter your email and we'll send you a reset link.
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="standard"
                  InputLabelProps={{
                    sx: { fontWeight: 600 },
                  }}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{
                      maxWidth: '240px',
                      position: 'relative',
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </Box>
              </Stack>
            </Box>

            {/* Links */}
            <Stack spacing={1} alignItems="center">
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: '#2e42e2',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Back to login
              </MuiLink>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;