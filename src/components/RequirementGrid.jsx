import React, { useState, useEffect } from 'react';
import {
  Stack,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import RequirementCard from './RequirementCard';
import api from '../services/api';


const RequirementGrid = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveRequirements();
  }, []);

  const fetchActiveRequirements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requirement/getAll?state=ACTIVE');
      setRequirements(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching active requirements:', err);
      setError('Failed to fetch requirements. Please try again later.');
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (requirement) => {
    // Placeholder for edit functionality
    console.log('Edit requirement:', requirement);
  };

  const handleDelete = (requirement) => {
    // Placeholder for delete functionality
    console.log('Delete requirement:', requirement);
  };
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

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!loading && (!requirements || requirements.length === 0)) {
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
          No active requirements available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for new requirements matching your services.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Active requirements will appear here when retailers post them.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
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
      <Stack spacing={3}>
        {requirements.map((requirement) => (
          <RequirementCard
            key={requirement._id || requirement.uuid}
            requirement={requirement}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default RequirementGrid;