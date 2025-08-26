import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  IconButton,
  Collapse,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Lock,
  Notifications,
  Palette,
  Language,
  Help,
  Logout,
  ArrowBack,
  ChevronRight,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedPassword, setExpandedPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      setExpandedPassword(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const settingsItems = [
    {
      title: 'Profile',
      items: [
        { text: 'Edit Profile', icon: <Person />, path: '/complete-profile' },
        { text: 'Change Password', icon: <Lock />, expandable: true },
        { text: 'Notifications', icon: <Notifications />, path: '/notifications' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { text: 'Appearance', icon: <Palette />, path: '/appearance' },
        { text: 'Language', icon: <Language />, path: '/language' }
      ]
    },
    {
      title: 'Support',
      items: [
        { text: 'Help Center', icon: <Help />, path: '/help' }
      ]
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Account Settings
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: '#2e42e2',
              fontSize: '2rem'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Box 
              sx={{ 
                display: 'inline-block',
                bgcolor: '#ff9800',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                mt: 0.5
              }}
            >
              <Typography variant="caption" fontWeight="medium">
                {user?.userRole?.role === 'retailer' ? 'Retailer' : 'Supplier'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {settingsItems.map((section, index) => (
        <Paper key={index} sx={{ mb: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
              {section.title}
            </Typography>
          </Box>
          <List>
            {section.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (item.expandable && item.text === 'Change Password') {
                        setExpandedPassword(!expandedPassword);
                      } else if (item.path === '/complete-profile') {
                        navigate(item.path);
                      } else if (item.path) {
                        console.log(`Navigate to ${item.path}`);
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.expandable && item.text === 'Change Password' ? (
                      expandedPassword ? <ExpandLess /> : <ExpandMore />
                    ) : (
                      <ChevronRight />
                    )}
                  </ListItemButton>
                </ListItem>
                {item.expandable && item.text === 'Change Password' && (
                  <Collapse in={expandedPassword} timeout="auto" unmountOnExit>
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
                  </Collapse>
                )}
                {itemIndex < section.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}

      <Paper sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ color: '#d32f2f' }}
          >
            <ListItemIcon>
              <Logout sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Paper>
    </Container>
  );
};

export default AccountSettings;