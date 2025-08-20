import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  Business,
  LocationOn,
  Phone,
  Email,
  Language,
  CalendarToday,
  Chat,
  Work,
  Verified
} from '@mui/icons-material';
import axios from 'axios';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
    fetchProducts();
    fetchReviews();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/profile`
      );
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/products`
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/reviews`
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleStartChat = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/chat?user=${userId}`);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Container sx={{ py: 5 }}>
        <Box textAlign="center">
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container sx={{ py: 5 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Profile not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Go to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="flex-start">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2rem',
                  mr: 3,
                  bgcolor: 'primary.main'
                }}
              >
                {profile.company_name?.charAt(0).toUpperCase() || profile.name?.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="h4" component="h1" sx={{ mr: 1 }}>
                    {profile.company_name || profile.name}
                  </Typography>
                  {profile.verified && (
                    <Verified color="primary" />
                  )}
                </Box>
                
                <Chip
                  label={profile.user_type?.toUpperCase()}
                  color={profile.user_type === 'supplier' ? 'success' : 'info'}
                  sx={{ mb: 2 }}
                />
                
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating value={profile.rating || 0} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({profile.review_count || 0} reviews)
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {profile.business_description}
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={2} color="text.secondary">
                  {profile.location && (
                    <Box display="flex" alignItems="center">
                      <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{profile.location}</Typography>
                    </Box>
                  )}
                  {profile.business_type && (
                    <Box display="flex" alignItems="center">
                      <Work fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{profile.business_type}</Typography>
                    </Box>
                  )}
                  <Box display="flex" alignItems="center">
                    <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      Member since {new Date(profile.created_at).getFullYear()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box textAlign={{ xs: 'center', md: 'right' }}>
              <Button
                variant="contained"
                startIcon={<Chat />}
                onClick={handleStartChat}
                sx={{ mb: 3 }}
              >
                Start Chat
              </Button>
              
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Response Rate:</strong> {profile.response_rate || 95}%
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Response Time:</strong> {profile.response_time || '< 24 hours'}
                </Typography>
                <Typography variant="body2">
                  <strong>Completed Deals:</strong> {profile.completed_deals || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Profile Content Tabs */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" value="overview" />
          {profile.user_type === 'supplier' && (
            <Tab label={`Products (${products.length})`} value="products" />
          )}
          <Tab label={`Reviews (${reviews.length})`} value="reviews" />
        </Tabs>

        <TabPanel value={activeTab} index="overview">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Business Information
              </Typography>
              <List>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText>
                    <strong>Company:</strong> {profile.company_name}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText>
                    <strong>Address:</strong> {profile.address || 'Not provided'}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText>
                    <strong>Phone:</strong> {profile.phone || 'Not provided'}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText>
                    <strong>Email:</strong> {profile.email}
                  </ListItemText>
                </ListItem>
                {profile.website && (
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText>
                      <strong>Website:</strong>{' '}
                      <a href={profile.website} target="_blank" rel="noopener noreferrer">
                        {profile.website}
                      </a>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Business Details
              </Typography>
              <List>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText>
                    <strong>GST Number:</strong> {profile.gst_number || 'Not provided'}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText>
                    <strong>PAN Number:</strong> {profile.pan_number || 'Not provided'}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText>
                    <strong>Established:</strong> {profile.established_year || 'Not provided'}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText>
                    <strong>Employees:</strong> {profile.employee_count || 'Not provided'}
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText>
                    <strong>Annual Revenue:</strong> {profile.annual_revenue || 'Not provided'}
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {profile.certifications && profile.certifications.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Certifications
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {profile.certifications.map((cert, index) => (
                  <Chip key={index} label={cert} variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </TabPanel>

        {profile.user_type === 'supplier' && (
          <TabPanel value={activeTab} index="products">
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    {product.image && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {product.description?.substring(0, 100)}...
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip label={`$${product.price}`} color="success" />
                        <Typography variant="body2" color="text.secondary">
                          MOQ: {product.min_order_quantity}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {products.length === 0 && (
                <Grid item xs={12}>
                  <Typography textAlign="center" color="text.secondary">
                    No products listed yet
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        )}

        <TabPanel value={activeTab} index="reviews">
          {reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.reviewer_name}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  {review.comment}
                </Typography>
                {review.order_id && (
                  <Chip label={`Order #${review.order_id}`} size="small" />
                )}
              </CardContent>
            </Card>
          ))}
          {reviews.length === 0 && (
            <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
              No reviews yet
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default PublicProfile;