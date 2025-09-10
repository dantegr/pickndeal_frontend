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
    id: '507f1f77bcf86cd799439011',
    _id: '507f1f77bcf86cd799439011',
    name: 'Nordic Organic Farms',
    businessType: 'Organic Supplier',
    categories: ['Fresh Produce', 'Dairy Products', 'Meat & Poultry', 'Soft Drinks', 'Juices'],
    deliveryRadius: 50,
    // Frederiksberg - about 3km west of center
    lat: 55.681234,
    lng: 12.531456,
    address: 'Frederiksberg Allé 25, Copenhagen',
    rating: 4.5,
    image: null,
    avatarColor: '#4caf50'
  },
  {
    id: '507f1f77bcf86cd799439012',
    _id: '507f1f77bcf86cd799439012',
    name: 'Copenhagen Food Supplies',
    businessType: 'Wholesale Distributor',
    categories: ['Bakery Items', 'Frozen Foods', 'Catering', 'Beverages'],
    deliveryRadius: 30,
    // Nørrebro - about 2km north of center
    lat: 55.690123,
    lng: 12.559876,
    address: 'Nørrebrogade 45, Copenhagen',
    rating: 4.8,
    image: null,
    avatarColor: '#2196f3'
  },
  {
    id: '507f1f77bcf86cd799439013',
    _id: '507f1f77bcf86cd799439013',
    name: 'Danish Fresh Market',
    businessType: 'Local Supplier',
    categories: ['Vegetables', 'Fruits', 'Herbs', 'Seasonal Produce', 'Organic Products'],
    deliveryRadius: 25,
    // Østerbro - about 3km northeast
    lat: 55.695432,
    lng: 12.587654,
    address: 'Østerbrogade 120, Copenhagen',
    rating: 4.2,
    image: null,
    avatarColor: '#ff9800'
  },
  {
    id: '507f1f77bcf86cd799439014',
    _id: '507f1f77bcf86cd799439014',
    name: 'Scandinavian Seafood Co.',
    businessType: 'Seafood Specialist',
    categories: ['Fresh Fish', 'Shellfish', 'Frozen Seafood', 'Sushi Grade'],
    deliveryRadius: 40,
    // Amager - about 5km south
    lat: 55.641234,
    lng: 12.598765,
    address: 'Amagerbrogade 150, Copenhagen',
    rating: 4.7,
    image: null,
    avatarColor: '#00bcd4'
  },
  {
    id: '507f1f77bcf86cd799439015',
    _id: '507f1f77bcf86cd799439015',
    name: 'Green Valley Distributors',
    businessType: 'Eco-Friendly Supplier',
    categories: ['Organic Vegetables', 'Sustainable Products', 'Local Produce'],
    deliveryRadius: 35,
    // Valby - about 7km southwest
    lat: 55.648765,
    lng: 12.487654,
    address: 'Valby Langgade 80, Copenhagen',
    rating: 4.4,
    image: null,
    avatarColor: '#8bc34a'
  },
  {
    id: '507f1f77bcf86cd799439016',
    _id: '507f1f77bcf86cd799439016',
    name: 'Metro Wholesale Foods',
    businessType: 'Bulk Supplier',
    categories: ['Bulk Items', 'Restaurant Supplies', 'Catering Equipment'],
    deliveryRadius: 60,
    // Hvidovre - about 10km southwest
    lat: 55.628976,
    lng: 12.473456,
    address: 'Hvidovrevej 200, Hvidovre',
    rating: 4.3,
    image: null,
    avatarColor: '#9c27b0'
  },
  {
    id: '507f1f77bcf86cd799439017',
    _id: '507f1f77bcf86cd799439017',
    name: 'Nordic Bakery Supplies',
    businessType: 'Bakery Specialist',
    categories: ['Flour', 'Baking Ingredients', 'Pastry Supplies', 'Equipment'],
    deliveryRadius: 45,
    // Hellerup - about 8km north
    lat: 55.731234,
    lng: 12.576543,
    address: 'Strandvejen 100, Hellerup',
    rating: 4.6,
    image: null,
    avatarColor: '#795548'
  },
  {
    id: '507f1f77bcf86cd799439018',
    _id: '507f1f77bcf86cd799439018',
    name: 'Danish Dairy Direct',
    businessType: 'Dairy Distributor',
    categories: ['Milk Products', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
    deliveryRadius: 55,
    // Brønshøj - about 6km northwest
    lat: 55.704567,
    lng: 12.498765,
    address: 'Brønshøjvej 45, Copenhagen',
    rating: 4.5,
    image: null,
    avatarColor: '#f44336'
  },
  {
    id: '507f1f77bcf86cd799439019',
    _id: '507f1f77bcf86cd799439019',
    name: 'Continental Imports',
    businessType: 'International Foods',
    categories: ['Italian', 'Spanish', 'Asian', 'Middle Eastern', 'Specialty Items'],
    deliveryRadius: 50,
    // Lyngby - about 12km north
    lat: 55.769876,
    lng: 12.501234,
    address: 'Lyngby Hovedgade 50, Lyngby',
    rating: 4.4,
    image: null,
    avatarColor: '#3f51b5'
  },
  {
    id: '507f1f77bcf86cd79943901a',
    _id: '507f1f77bcf86cd79943901a',
    name: 'Fresh & Fast Logistics',
    businessType: 'Express Delivery',
    categories: ['All Categories', 'Same Day Delivery', 'Emergency Supplies'],
    deliveryRadius: 75,
    // Glostrup - about 11km west
    lat: 55.666789,
    lng: 12.403456,
    address: 'Glostrup Torv 10, Glostrup',
    rating: 4.2,
    image: null,
    avatarColor: '#ff5722'
  }
];

const SupplierGrid = ({ suppliers, loading = false }) => {
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