import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import PasswordChangeForm from '../components/PasswordChangeForm';
import EditProfileForm from '../components/EditProfileForm';
import api from '../services/api';
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
  CircularProgress,
  Alert,
  Snackbar
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
  ExpandLess,
  CameraAlt
} from '@mui/icons-material';

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [expandedPassword, setExpandedPassword] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChangeSuccess = () => {
    setExpandedPassword(false);
  };

  const handleProfileEditSuccess = () => {
    setExpandedProfile(false);
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)',
        severity: 'error'
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: 'Image size must be less than 5MB',
        severity: 'error'
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.type === 'success') {
        setSnackbar({
          open: true,
          message: 'Profile image updated successfully',
          severity: 'success'
        });
        
        // Refetch profile to update the avatar across the app
        await fetchProfile();
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to upload profile image',
        severity: 'error'
      });
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const settingsItems = [
    {
      title: 'Profile',
      items: [
        { text: 'Edit Profile', icon: <Person />, expandable: true },
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
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              flex: { xs: 'none', sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Box 
              sx={{ 
                position: 'relative', 
                mr: { xs: 0, sm: 3 },
                mb: { xs: 2, sm: 0 }
              }}
            >
              <Avatar 
                sx={{ 
                  width: { xs: 80, sm: 70 },
                  height: { xs: 80, sm: 70 },
                  bgcolor: '#2e42e2',
                  fontSize: { xs: '2rem', sm: '1.75rem' }
                }}
                src={profile?.avatarImage || undefined}
              >
                {!profile?.avatarImage && user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              {uploadingAvatar && (
                <CircularProgress
                  size={80}
                  sx={{
                    position: 'absolute',
                    top: -5,
                    left: -5,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
            
            <Box 
              sx={{ 
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 2, sm: 0 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Typography variant="h6" fontWeight="bold">
                  {user?.name}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: '#ff9800',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    height: 'fit-content'
                  }}
                >
                  <Typography variant="caption" fontWeight="medium">
                    {user?.userRole?.role === 'retailer' ? 'Retailer' : 'Supplier'}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              alignItems: 'center'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              style={{ display: 'none' }}
              onChange={handleAvatarFileChange}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<CameraAlt />}
              onClick={handleAvatarButtonClick}
              disabled={uploadingAvatar}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                borderColor: '#2e42e2',
                color: '#2e42e2',
                textTransform: 'none',
                fontWeight: 500,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1, sm: 0.75 },
                '&:hover': {
                  borderColor: '#1e32d2',
                  bgcolor: 'rgba(46, 66, 226, 0.04)'
                }
              }}
            >
              Update Profile Image
            </Button>
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
                        setExpandedProfile(false);
                      } else if (item.expandable && item.text === 'Edit Profile') {
                        setExpandedProfile(!expandedProfile);
                        setExpandedPassword(false);
                      } else if (item.path) {
                        console.log(`Navigate to ${item.path}`);
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.expandable ? (
                      item.text === 'Change Password' ? (
                        expandedPassword ? <ExpandLess /> : <ExpandMore />
                      ) : item.text === 'Edit Profile' ? (
                        expandedProfile ? <ExpandLess /> : <ExpandMore />
                      ) : <ChevronRight />
                    ) : (
                      <ChevronRight />
                    )}
                  </ListItemButton>
                </ListItem>
                {item.expandable && item.text === 'Edit Profile' && (
                  <Collapse in={expandedProfile} timeout="auto" unmountOnExit>
                    <EditProfileForm onSuccess={handleProfileEditSuccess} />
                  </Collapse>
                )}
                {item.expandable && item.text === 'Change Password' && (
                  <Collapse in={expandedPassword} timeout="auto" unmountOnExit>
                    <PasswordChangeForm onSuccess={handlePasswordChangeSuccess} />
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountSettings;