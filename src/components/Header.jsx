import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  InputBase,
  styled,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsOutlined,
  Home,
  AddBox,
  ListAlt,
  LocalMall,
  FormatQuote,
  Person,
  Logout,
  Close,
  Chat
} from '@mui/icons-material';
import logo from '../assets/logo.png';
import { useNotifications } from '../contexts/NotificationContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  border: '1px solid #e0e0e0',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#909097',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isRetailer = user?.userRole?.role === 'retailer';
  const isSupplier = user?.userRole?.role === 'supplier';
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifMenu = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleCloseNotifMenu = () => {
    setAnchorElNotif(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  const navigationItems = [
    { text: 'Home', icon: <Home />, path: '/dashboard' },
    ...(isRetailer ? [
      { text: 'Add Requirement', icon: <AddBox />, path: '/requirements/add' },
      { text: 'My Requirements', icon: <ListAlt />, path: '/requirements' },
    ] : []),
    ...(isSupplier ? [
      { text: 'My Catalog', icon: <LocalMall />, path: '/catalog' },
      { text: 'My Quotes', icon: <FormatQuote />, path: '/quotes' },
    ] : []),
  ];

  const drawer = (
    <Box sx={{ width: 275 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={logo} alt="PickNDeal" style={{ height: 40 }} />
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ width: 40, height: 40, mr: 2 }}
            src={profile?.avatarImage || undefined}
          >
            {!profile?.avatarImage && user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/chats"
            onClick={handleDrawerToggle}
          >
            <ListItemIcon><Chat /></ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/account-settings"
            onClick={handleDrawerToggle}
          >
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Account Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: '#4b4b4b', boxShadow: 1 }}>
        <Container maxWidth="xl" sx={{ px: 4 }}>
          <Toolbar disableGutters sx={{ py: 1 }}>
            {isMobile && (
              <IconButton
                size="large"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
              <Link to="/dashboard">
                <img src={logo} alt="PickNDeal" style={{ height: 40 }} />
              </Link>
            </Box>

            {!isMobile && (
              <>
                <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                  {navigationItems.map((item) => (
                    <Tooltip key={item.text} title={item.text}>
                      <IconButton
                        component={Link}
                        to={item.path}
                        sx={{
                          color: '#4b4b4b',
                          mx: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            color: '#2e42e2',
                          }
                        }}
                      >
                        {item.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                  <Tooltip title="Messages">
                    <IconButton
                      component={Link}
                      to="/chats"
                      sx={{
                        color: '#4b4b4b',
                        mx: 0.5,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          color: '#2e42e2',
                        }
                      }}
                    >
                      <Chat />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box component="form" onSubmit={handleSearch}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Search>
                </Box>
              </>
            )}

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleOpenNotifMenu}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>

              {!isMobile && (
                <>
                  <Tooltip title="Account Settings">
                    <IconButton 
                      onClick={() => navigate('/account-settings')} 
                      sx={{ p: 0 }}
                    >
                      <Avatar 
                        sx={{ bgcolor: '#2e42e2' }}
                        src={profile?.avatarImage || undefined}
                      >
                        {!profile?.avatarImage && user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout">
                    <IconButton 
                      onClick={handleLogout}
                      sx={{ 
                        ml: 1,
                        color: '#ff9800',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 152, 0, 0.08)',
                        }
                      }}
                    >
                      <Logout />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component={Link} to="/complete-profile" onClick={handleCloseUserMenu}>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>

            <Menu
              sx={{ mt: '45px' }}
              id="notif-menu"
              anchorEl={anchorElNotif}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotif)}
              onClose={handleCloseNotifMenu}
              PaperProps={{
                sx: { width: 360, maxHeight: 400 }
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Notifications</Typography>
                  {unreadCount > 0 && (
                    <Button 
                      size="small" 
                      onClick={() => markAllAsRead()}
                      sx={{ textTransform: 'none' }}
                    >
                      Mark all as read
                    </Button>
                  )}
                </Box>
              </Box>
              <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No new notifications
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {notifications.map((notification) => (
                      <ListItem
                        key={notification._id}
                        sx={{
                          borderBottom: '1px solid #f0f0f0',
                          bgcolor: notification.isRead ? 'transparent' : '#f5f5f5',
                          '&:hover': { bgcolor: '#e8e8e8' },
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsRead(notification._id);
                          }
                          // Handle notification click based on type
                          if (notification.type === 'chat') {
                            navigate('/chats');
                            handleCloseNotifMenu();
                          }
                        }}
                      >
                        <ListItemIcon>
                          {notification.type === 'chat' && <Chat color="primary" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            notification.type === 'chat' 
                              ? notification.data.senderName 
                              : 'Notification'
                          }
                          secondary={
                            <>
                              {notification.type === 'chat' && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'block' }}
                                >
                                  {notification.data.message}
                                </Typography>
                              )}
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(notification.dateCreated).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 275 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;