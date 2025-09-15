import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  IconButton,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Inventory,
  Repeat
} from '@mui/icons-material';
import CreateRequirementModal from '../components/CreateRequirementModal';
import api from '../services/api';

const Requirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

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

  const handleMenuOpen = (event, requirement) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequirement(requirement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequirement(null);
  };

  const handleDelete = async () => {
    if (!selectedRequirement) return;
    
    try {
      await api.delete(`/requirement/delete/${selectedRequirement.uuid || selectedRequirement._id}`);
      setRequirements(requirements.filter(req => req._id !== selectedRequirement._id));
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting requirement:', err);
      setError('Failed to delete requirement');
    }
  };

  const handleRequirementCreated = (newRequirement) => {
    setRequirements([newRequirement, ...requirements]);
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'CREATED': return 'default';
      case 'ACTIVE': return 'primary';
      case 'PROCESSING': return 'warning';
      case 'COMPLETED': return 'success';
      default: return 'default';
    }
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
        <Grid container spacing={3}>
          {requirements.map((requirement) => (
            <Grid item xs={12} md={6} lg={4} key={requirement._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {requirement.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, requirement)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={requirement.state}
                      color={getStateColor(requirement.state)}
                      size="small"
                    />
                    {requirement.recurring && (
                      <Chip
                        label="Recurring"
                        color="secondary"
                        size="small"
                        icon={<Repeat />}
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {requirement.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Inventory fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Quantity: {requirement.quantity} {requirement.categories && requirement.categories.length > 0 ? `units` : ''}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {requirement.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {requirement.recurring 
                          ? `Every ${requirement.deliveryDate}` 
                          : requirement.deliveryDate
                        }
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoney fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {requirement.budget}
                      </Typography>
                    </Box>
                  </Box>

                  {requirement.categories && requirement.categories.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {requirement.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="caption" color="text.secondary">
                      Quotes received: {requirement.quotesCount || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <CreateRequirementModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onRequirementCreated={handleRequirementCreated}
      />
    </Box>
  );
};

export default Requirements;