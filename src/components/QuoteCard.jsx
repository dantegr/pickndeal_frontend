import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  LocationOn,
  CalendarToday,
  AttachMoney,
  LocalShipping,
  Description,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import EditQuoteModal from './EditQuoteModal';
import api from '../services/api';

const QuoteCard = ({ quote, onQuoteUpdated, onQuoteDeleted }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStateColor = (state) => {
    switch (state) {
      case 'CREATED': return 'info';
      case 'ACCEPTED': return 'success';
      case 'DECLINED': return 'error';
      default: return 'default';
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'CREATED': return <Schedule fontSize="small" />;
      case 'ACCEPTED': return <CheckCircle fontSize="small" />;
      case 'DECLINED': return <Cancel fontSize="small" />;
      default: return null;
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await api.delete(`/quotes/delete/${quote.uuid}`);

      if (response.data.success) {
        toast.success('Quote deleted successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        if (onQuoteDeleted) {
          onQuoteDeleted(quote.uuid);
        }

        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error(error.response?.data?.message || 'Failed to delete quote', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleQuoteUpdated = (updatedQuote) => {
    toast.success('Quote updated successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    if (onQuoteUpdated) {
      onQuoteUpdated(updatedQuote);
    }
  };

  return (
    <>
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
          {/* Quote Status and Requirement Title */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              {quote.requirement && (
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: '#4b4b4b',
                    mb: 1
                  }}
                >
                  {quote.requirement.title}
                </Typography>
              )}
              <Chip
                icon={getStateIcon(quote.state)}
                label={quote.state}
                color={getStateColor(quote.state)}
                size="small"
              />
            </Box>
          </Box>

          {/* Requirement Details */}
          {quote.requirement && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Requirement Details:
              </Typography>

              <Stack spacing={1}>
                {quote.requirement.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {quote.requirement.description.length > 150
                      ? `${quote.requirement.description.substring(0, 150)}...`
                      : quote.requirement.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#909097' }} />
                  <Typography variant="body2" color="text.secondary">
                    {quote.requirement.location}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, color: '#909097' }} />
                  <Typography variant="body2" color="text.secondary">
                    Requested: {quote.requirement.deliveryDate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, color: '#909097' }} />
                  <Typography variant="body2" color="text.secondary">
                    Budget: {quote.requirement.budget}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Quote Details */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Your Quote:
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney sx={{ fontSize: 16, color: '#2e42e2' }} />
                <Typography variant="body2" fontWeight="medium">
                  Proposed Amount: <strong>{quote.proposedAmount}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16, color: '#2e42e2' }} />
                <Typography variant="body2">
                  Delivery Date: {quote.deliveryDate}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping sx={{ fontSize: 16, color: '#2e42e2' }} />
                <Typography variant="body2">
                  Can Deliver: {quote.canDeliver ? 'Yes' : 'No'}
                </Typography>
              </Box>

              {quote.details && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Description sx={{ fontSize: 16, color: '#909097', mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {quote.details}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Timestamps */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Submitted: {new Date(quote.createdAt).toLocaleDateString()}
            </Typography>
            {quote.updatedAt !== quote.createdAt && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Last updated: {new Date(quote.updatedAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Actions - Only show if quote is not accepted or declined */}
        {quote.state === 'CREATED' && (
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, gap: 1 }}>
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
              onClick={() => setDeleteDialogOpen(true)}
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
      </Card>

      {/* Edit Quote Modal */}
      <EditQuoteModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        requirement={quote.requirement}
        onQuoteUpdated={handleQuoteUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Quote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this quote? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuoteCard;