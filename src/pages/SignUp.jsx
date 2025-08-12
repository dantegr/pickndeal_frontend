import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Link as MuiLink,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import logo from '../assets/logo.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'retailer'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setFormData({
        ...formData,
        role: newRole
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.role
      };

      await authService.submitUserDetail(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
        <Container maxWidth="md">
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
                {/* Mobile Layout */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#000',
                      mb: 2,
                    }}
                  >
                    Welcome to
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <img src={logo} alt="PickNDeal" style={{ height: '45px' }} />
                  </Box>
                </Box>

                {/* Desktop Layout */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#000',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    Welcome to{' '}
                    <img src={logo} alt="PickNDeal" style={{ height: '45px', verticalAlign: 'middle' }} />
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#909097',
                    fontWeight: 500,
                  }}
                >
                  Enter your details below
                </Typography>
              </Box>

              {/* Role Selection */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                  value={formData.role}
                  exclusive
                  onChange={handleRoleChange}
                  aria-label="user role"
                  sx={{ gap: 2 }}
                >
                  <ToggleButton value="retailer" aria-label="retailer">
                    <Stack alignItems="center">
                      <PersonIcon sx={{ fontSize: 40 }} />
                      <Typography>Retailer</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="supplier" aria-label="supplier">
                    <Stack alignItems="center">
                      <BusinessIcon sx={{ fontSize: 40 }} />
                      <Typography>Supplier</Typography>
                    </Stack>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Form */}
              <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{
                  '& > .MuiGrid-container': {
                    maxWidth: '580px',
                    margin: '0 auto',
                    '@media (min-width: 900px)': {
                      justifyContent: 'space-between',
                      '& > .MuiGrid-item:nth-of-type(even)': {
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }
                    },
                    '@media (max-width: 599px)': {
                      display: 'block',
                      maxWidth: 'none',
                      '& > .MuiGrid-item': {
                        maxWidth: '100%',
                        flexBasis: '100%',
                        paddingLeft: 0,
                        paddingRight: 0,
                        paddingTop: '16px',
                      }
                    }
                  }
                }}
              >
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid 
                    item 
                    xs={12} 
                    sm={12} 
                    md={6}
                    sx={{
                      '@media (min-width: 900px)': {
                        width: 'fit-content',
                      }
                    }}
                  >
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      variant="standard"
                      inputProps={{ pattern: '[a-zA-Z0-9\\s]+' }}
                      InputLabelProps={{
                        sx: { fontWeight: 600 }
                      }}
                      sx={{
                        '@media (min-width: 900px)': {
                          width: '120.06%',
                        },
                        '& .MuiInput-root': {
                          minHeight: '48px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid 
                    item 
                    xs={12} 
                    sm={12} 
                    md={6}
                    sx={{
                      '@media (min-width: 900px)': {
                        width: 'fit-content',
                      }
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      variant="standard"
                      inputProps={{ pattern: '[a-zA-Z0-9\\s]+' }}
                      InputLabelProps={{
                        sx: { fontWeight: 600 }
                      }}
                      sx={{
                        '@media (min-width: 900px)': {
                          width: '120.06%',
                        },
                        '& .MuiInput-root': {
                          minHeight: '48px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid 
                    item 
                    xs={12} 
                    sm={12} 
                    md={6}
                    sx={{
                      '@media (min-width: 900px)': {
                        width: 'fit-content',
                      }
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="standard"
                      InputLabelProps={{
                        sx: { fontWeight: 600 }
                      }}
                      sx={{
                        '@media (min-width: 900px)': {
                          width: '120.06%',
                        },
                        '& .MuiInput-root': {
                          minHeight: '48px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid 
                    item 
                    xs={12} 
                    sm={12} 
                    md={6}
                    sx={{
                      '@media (min-width: 900px)': {
                        width: 'fit-content',
                      }
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      variant="standard"
                      placeholder="12345678910"
                      inputProps={{ pattern: '[0-9]{8,15}' }}
                      InputLabelProps={{
                        sx: { fontWeight: 600 }
                      }}
                      sx={{
                        '@media (min-width: 900px)': {
                          width: '120.06%',
                        },
                        '& .MuiInput-root': {
                          minHeight: '48px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="standard"
                      InputLabelProps={{
                        sx: { fontWeight: 600 }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInput-root': {
                          minHeight: '48px',
                          position: 'relative',
                          '& input': {
                            paddingRight: '48px',
                          }
                        },
                        '& .MuiInputAdornment-root': {
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '40px',
                          height: '24px',
                          justifyContent: 'center',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      variant="standard"
                      InputLabelProps={{
                        sx: { fontWeight: 600 }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              size="small"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInput-root': {
                          minHeight: '48px',
                          position: 'relative',
                          '& input': {
                            paddingRight: '48px',
                          }
                        },
                        '& .MuiInputAdornment-root': {
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '40px',
                          height: '24px',
                          justifyContent: 'center',
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 5, textAlign: 'center' }}>
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
                        Creating account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </Box>
              </Box>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4b4b4b' }}>
                  Have an account?{' '}
                  <MuiLink
                    component={Link}
                    to="/login"
                    sx={{
                      color: '#2e42e2',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign In
                  </MuiLink>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
  );
};

export default SignUp;