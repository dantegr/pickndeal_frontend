import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  FormatQuote,
  Inventory,
  AccessTime
} from '@mui/icons-material';
import SupplierGrid from '../components/SupplierGrid';
import RequirementGrid from '../components/RequirementGrid';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    requirements: 0,
    quotes: 0,
    catalog: 0,
    activeRequests: 0
  });
  const [suppliers, setSuppliers] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);

  const isRetailer = user?.userRole?.role === 'retailer';
  const isSupplier = user?.userRole?.role === 'supplier';
  

  useEffect(() => {
    fetchDashboardData();
    fetchMainContent();
  }, [user]);
  useEffect(() => {
    console.log(user)
  },[])

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // These would be actual API calls
      setStats({
        requirements: 5,
        quotes: 12,
        catalog: 8,
        activeRequests: 3
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMainContent = async () => {
    try {
      setContentLoading(true);
      if (isRetailer) {
        // Fetch suppliers for retailer
        const response = await api.get('/user/suppliers');
        setSuppliers(response.data.data || []);
      } else if (isSupplier) {
        // Fetch requirements for supplier
        // const response = await api.get('/requirements/available');
        // setRequirements(response.data);
        // Using mock data for now
        setRequirements(undefined); // Will use mock data from RequirementGrid
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      // Set empty array on error to prevent using mock data
      if (isRetailer) {
        setSuppliers([]);
      }
    } finally {
      setContentLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
              {loading ? <Skeleton width={60} /> : value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color: 'white', fontSize: 28 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#4b4b4b',
            mb: 1,
          }}
        >
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isRetailer 
            ? "Here's your marketplace overview and available suppliers"
            : "Check out the latest requirements matching your services"}
        </Typography>
      </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Requirements"
              value={stats.requirements}
              icon={<Assignment />}
              color="#2e42e2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Quotes"
              value={stats.quotes}
              icon={<FormatQuote />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Catalog Items"
              value={stats.catalog}
              icon={<Inventory />}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Requests"
              value={stats.activeRequests}
              icon={<AccessTime />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {contentLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {isRetailer && <SupplierGrid suppliers={suppliers} />}
              {isSupplier && <RequirementGrid requirements={requirements} />}
              {!isRetailer && !isSupplier && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Please complete your profile to access the marketplace
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Activity Section */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4b4b4b' }}>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No recent activity to display
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4b4b4b' }}>
                Quick Stats
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 2, color: '#4caf50' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Growth Rate
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      +12.5%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
    </Box>
  );
};

export default Dashboard;