import React from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import SupplierCard from './SupplierCard';

const mockSuppliers = [
  {
    id: 1,
    name: 'Nordic Organic Farms',
    businessType: 'Organic Supplier',
    categories: ['Fresh Produce', 'Dairy Products', 'Meat & Poultry', 'Soft Drinks', 'Juices'],
    deliveryRadius: 50,
    distance: 10,
    address: 'Frederiksberg Allé 25, Copenhagen',
    rating: 4.5,
    image: null,
    avatarColor: '#4caf50'
  },
  {
    id: 2,
    name: 'Copenhagen Food Supplies',
    businessType: 'Wholesale Distributor',
    categories: ['Bakery Items', 'Frozen Foods', 'Catering', 'Beverages'],
    deliveryRadius: 30,
    distance: 5,
    address: 'Nørrebrogade 45, Copenhagen',
    rating: 4.8,
    image: null,
    avatarColor: '#2196f3'
  },
  {
    id: 3,
    name: 'Danish Fresh Market',
    businessType: 'Local Supplier',
    categories: ['Vegetables', 'Fruits', 'Herbs', 'Seasonal Produce', 'Organic Products'],
    deliveryRadius: 25,
    distance: 15,
    address: 'Østerbrogade 120, Copenhagen',
    rating: 4.2,
    image: null,
    avatarColor: '#ff9800'
  }
];

const SupplierGrid = ({ suppliers = mockSuppliers, loading = false }) => {
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

  if (!suppliers || suppliers.length === 0) {
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
          No suppliers found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for available suppliers in your area
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
        Available Suppliers
      </Typography>
      <Grid container spacing={3}>
        {suppliers.map((supplier) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={supplier.id}>
            <SupplierCard supplier={supplier} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SupplierGrid;