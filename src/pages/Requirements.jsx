import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import CreateRequirementModal from '../components/CreateRequirementModal';
import RequirementCard from '../components/RequirementCard';
import api from '../services/api';

const Requirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requirement/my');
      setRequirements(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requirements');
      console.error('Error fetching requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (requirement) => {
    // TODO: Implement edit functionality
    console.log('Edit requirement:', requirement);
  };

  const handleDelete = async (requirement) => {
    try {
      await api.delete(`/requirement/delete/${requirement.uuid || requirement._id}`);
      setRequirements(requirements.filter(req => req._id !== requirement._id));
    } catch (err) {
      console.error('Error deleting requirement:', err);
      setError('Failed to delete requirement');
    }
  };

  const handleRequirementCreated = (newRequirement) => {
    setRequirements([newRequirement, ...requirements]);
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Requirements
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ 
            bgcolor: '#2e42e2',
            '&:hover': { bgcolor: '#1e32d2' }
          }}
        >
          Create Requirement
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {requirements.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No requirements found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first requirement to start receiving quotes from suppliers
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
            >
              Create First Requirement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {requirements.map((requirement) => (
            <RequirementCard
              key={requirement._id}
              requirement={requirement}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}


      <CreateRequirementModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onRequirementCreated={handleRequirementCreated}
      />
    </Box>
  );
};

export default Requirements;