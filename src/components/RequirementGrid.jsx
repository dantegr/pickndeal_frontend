import React from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import RequirementCard from './RequirementCard';

const mockRequirements = [
  {
    id: 1,
    title: 'Fresh Vegetables Supply',
    description: 'Looking for a reliable supplier of fresh organic vegetables for our restaurant chain. Need daily delivery of tomatoes, lettuce, cucumbers, and seasonal vegetables.',
    status: 'open',
    urgency: 'high',
    categories: ['Fresh Produce', 'Vegetables', 'Organic'],
    location: 'Copenhagen Central',
    deliveryDate: 'Daily, Starting Next Week',
    budget: '50,000 DKK/month',
    postedBy: 'Copenhagen Food Supplies',
    quotesCount: 3
  },
  {
    id: 2,
    title: 'Bakery Items for Catering Event',
    description: 'Need various bakery items including croissants, Danish pastries, bread rolls, and cakes for a corporate event hosting 500 guests.',
    status: 'open',
    urgency: 'medium',
    categories: ['Bakery Items', 'Catering', 'Events'],
    location: 'Frederiksberg',
    deliveryDate: 'March 15, 2024',
    budget: '15,000 DKK',
    postedBy: 'Event Solutions DK',
    quotesCount: 5
  },
  {
    id: 3,
    title: 'Dairy Products - Long-term Contract',
    description: 'Seeking supplier for dairy products including milk, cheese, yogurt, and butter. Looking for competitive pricing and reliable delivery schedule for our retail stores.',
    status: 'open',
    urgency: 'low',
    categories: ['Dairy Products', 'Retail', 'Long-term Contract'],
    location: 'Greater Copenhagen Area',
    deliveryDate: '3 times per week',
    budget: '100,000 DKK/month',
    postedBy: 'SuperMart Denmark',
    quotesCount: 8
  }
];

const RequirementGrid = ({ requirements = mockRequirements, loading = false }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!requirements || requirements.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No requirements found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for new requirements matching your services
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 'bold',
          color: '#4b4b4b',
          mb: 3,
        }}
      >
        Available Requirements
      </Typography>
      <Grid container spacing={3}>
        {requirements.map((requirement) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={requirement.id}>
            <RequirementCard requirement={requirement} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RequirementGrid;