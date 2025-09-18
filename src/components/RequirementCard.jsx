import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import CreateQuoteModal from './CreateQuoteModal';
import EditQuoteModal from './EditQuoteModal';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
  Divider,
  IconButton,
  Collapse,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Category,
  LocalOffer,
  Visibility,
  Send,
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
  CalendarToday,
  AttachMoney,
  Inventory,
  Repeat,
  PlayArrow,
  Pause,
  EditNote
} from '@mui/icons-material';

const RequirementCard = ({ requirement, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [updatingState, setUpdatingState] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [editQuoteModalOpen, setEditQuoteModalOpen] = useState(false);

  const isRetailer = user?.userRole?.role === 'retailer';
  const isSupplier = user?.userRole?.role === 'supplier';
  const hasQuoted = requirement?.quotedUsers?.includes(user?.id);

  useEffect(() => {
    // Simple check based on character count
    // Assuming roughly 80-100 characters fit in 2 lines for typical card width
    const characterThreshold = 150; // Adjust based on your typical card width
    if (requirement.description && requirement.description.length > characterThreshold) {
      setShowExpandButton(true);
    } else {
      setShowExpandButton(false);
    }
  }, [requirement.description]);

  const handleViewDetails = () => {
    navigate(`/requirements/view/${requirement.uuid}`);
  };

  const handleSubmitQuote = () => {
    setQuoteModalOpen(true);
  };

  const handleEditQuote = () => {
    setEditQuoteModalOpen(true);
  };

  const handleQuoteCreated = (quote) => {
    // Update the quotes count and quotedUsers locally
    if (requirement) {
      requirement.quotesCount = (requirement.quotesCount || 0) + 1;
      if (!requirement.quotedUsers) {
        requirement.quotedUsers = [];
      }
      if (user?.id && !requirement.quotedUsers.includes(user.id)) {
        requirement.quotedUsers.push(user.id);
      }
    }
    // Show success toast
    toast.success('Quote submitted successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleQuoteUpdated = (quote) => {
    // Show success toast for update
    toast.success('Quote updated successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(requirement);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(requirement);
  };

  const handleToggleState = async () => {
    try {
      setUpdatingState(true);
      const newState = requirement.state === 'CREATED' ? 'ACTIVE' : 'CREATED';

      await api.patch(`/requirement/updateState/${requirement.uuid}`, {
        state: newState
      });

      // Update the requirement object locally to reflect the change
      requirement.state = newState;

    } catch (error) {
      console.error('Error updating requirement state:', error);
    } finally {
      setUpdatingState(false);
    }
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

  const getUrgencyColor = (urgency) => {
    const urgencyColors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return urgencyColors[urgency] || 'default';
  };

  return (
    <Card
      sx={{
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#4b4b4b',
              flex: 1
            }}
          >
            {requirement.title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={requirement.state || requirement.status}
            color={getStateColor(requirement.state || requirement.status)}
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
          {requirement.urgency && (
            <Chip
              label={requirement.urgency}
              size="small"
              color={getUrgencyColor(requirement.urgency)}
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Collapse 
            in={expanded} 
            collapsedSize={45}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {requirement.description}
            </Typography>
          </Collapse>
          {showExpandButton && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
              <IconButton
                size="small"
                onClick={toggleExpanded}
                sx={{
                  padding: '2px',
                  color: '#2e42e2',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 66, 226, 0.04)',
                  },
                }}
              >
                {expanded ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </IconButton>
            </Box>
          )}
        </Box>

        <Stack spacing={1.5}>
          {requirement.products && requirement.products.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Inventory fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  Products ({requirement.products.length}):
                </Typography>
              </Box>
              {requirement.products.slice(0, 2).map((product, index) => (
                <Typography key={index} variant="caption" color="text.secondary" sx={{ display: 'block', ml: 3 }}>
                  • {product.name}: {product.quantity} {product.unit_of_measurement}
                </Typography>
              ))}
              {requirement.products.length > 2 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 3 }}>
                  +{requirement.products.length - 2} more products
                </Typography>
              )}
            </Box>
          )}

          {requirement.categories && requirement.categories.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Category sx={{ fontSize: 16, color: '#909097' }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {requirement.categories.slice(0, 3).map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: '20px' }}
                  />
                ))}
                {requirement.categories.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{requirement.categories.length - 3} more
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: '#909097' }} />
            <Typography variant="body2" color="text.secondary">
              {requirement.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: '#909097' }} />
            <Typography variant="body2" color="text.secondary">
              {requirement.recurring
                ? `Every ${requirement.deliveryDate}`
                : requirement.deliveryDate
              }
            </Typography>
          </Box>

          {requirement.budget && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ fontSize: 16, color: '#909097' }} />
              <Typography variant="body2" color="text.secondary">
                {requirement.budget}
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {(requirement.postedByName || requirement.postedBy?.name) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{ width: 64, height: 64 }}
                src={requirement.postedByImage || undefined}
              >
                {!requirement.postedByImage && (requirement.postedByName || requirement.postedBy?.name)?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Posted by: <strong>{requirement.postedByName || requirement.postedBy?.name}</strong>
              </Typography>
            </Box>
          )}
          <Typography variant="caption" color="text.secondary">
            {requirement.quotesCount || 0} quotes received
          </Typography>
        </Box>
      </CardContent>

      {isSupplier && (
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility fontSize="small" />}
            onClick={handleViewDetails}
            sx={{
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5
            }}
          >
            View Details
          </Button>
          {(requirement.state === 'ACTIVE' || requirement.status === 'open') && (
            hasQuoted ? (
              <Button
                size="small"
                variant="contained"
                startIcon={<EditNote fontSize="small" />}
                onClick={handleEditQuote}
                sx={{
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  bgcolor: '#ff9800',
                  '&:hover': { bgcolor: '#f57c00' }
                }}
              >
                Edit Quote
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                startIcon={<Send fontSize="small" />}
                onClick={handleSubmitQuote}
                sx={{
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5
                }}
              >
                Submit Quote
              </Button>
            )
          )}
        </CardActions>
      )}

      {isRetailer && (
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={
              updatingState ? (
                <CircularProgress size={12} color="inherit" />
              ) : requirement.state === 'CREATED' ? (
                <PlayArrow fontSize="small" />
              ) : (
                <Pause fontSize="small" />
              )
            }
            onClick={handleToggleState}
            disabled={updatingState}
            sx={{
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
              bgcolor: requirement.state === 'CREATED' ? '#4caf50' : '#ff9800',
              '&:hover': {
                bgcolor: requirement.state === 'CREATED' ? '#388e3c' : '#f57c00'
              }
            }}
          >
            {updatingState
              ? 'Updating...'
              : requirement.state === 'CREATED'
                ? 'Activate'
                : 'Deactivate'
            }
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Edit fontSize="small" />}
            onClick={handleEdit}
            sx={{
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<Delete fontSize="small" />}
            onClick={handleDelete}
            sx={{
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5
            }}
          >
            Delete
          </Button>
        </CardActions>
      )}

      {/* Create Quote Modal */}
      <CreateQuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        requirement={requirement}
        onQuoteCreated={handleQuoteCreated}
      />

      {/* Edit Quote Modal */}
      <EditQuoteModal
        open={editQuoteModalOpen}
        onClose={() => setEditQuoteModalOpen(false)}
        requirement={requirement}
        onQuoteUpdated={handleQuoteUpdated}
      />
    </Card>
  );
};

export default RequirementCard;