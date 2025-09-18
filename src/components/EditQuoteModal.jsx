import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
  Skeleton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';

const EditQuoteModal = ({ open, onClose, requirement, onQuoteUpdated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    canDeliver: false,
    deliveryDate: '',
    proposedAmount: '',
    details: ''
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quoteId, setQuoteId] = useState(null);

  useEffect(() => {
    if (open && requirement) {
      fetchExistingQuote();
    }
  }, [open, requirement]);

  const fetchExistingQuote = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/quotes/myQuote/${requirement.uuid}`);

      if (response.data.success) {
        const quote = response.data.data;
        setQuoteId(quote.uuid);
        setFormData({
          canDeliver: quote.canDeliver || false,
          deliveryDate: quote.deliveryDate || '',
          proposedAmount: quote.proposedAmount || '',
          details: quote.details || ''
        });

        // Set the date for the date picker
        if (quote.deliveryDate) {
          try {
            const date = new Date(quote.deliveryDate);
            setSelectedDate(date);
          } catch (err) {
            // If date parsing fails, just set the string value
            setSelectedDate(null);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching existing quote:', err);
      setError('Failed to load existing quote');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        deliveryDate: date.toLocaleDateString()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.deliveryDate || !formData.proposedAmount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!quoteId) {
      setError('Quote ID not found');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare the data to send
      const dataToSend = {
        canDeliver: formData.canDeliver,
        deliveryDate: formData.deliveryDate,
        proposedAmount: formData.proposedAmount,
        details: formData.details || undefined
      };

      const response = await api.put(`/quotes/update/${quoteId}`, dataToSend);

      if (response.data.success) {
        // Notify parent component
        if (onQuoteUpdated) {
          onQuoteUpdated(response.data.data);
        }

        onClose();
      }
    } catch (err) {
      console.error('Error updating quote:', err);
      setError(err.response?.data?.message || 'Failed to update quote');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({
        canDeliver: false,
        deliveryDate: '',
        proposedAmount: '',
        details: ''
      });
      setSelectedDate(null);
      setError(null);
      setQuoteId(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Edit Quote
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={submitting || loading}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {requirement && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Editing quote for:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {requirement.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {requirement.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Budget: {requirement.budget}
              </Typography>
              {requirement.deliveryDate && (
                <Typography variant="body2" color="text.secondary">
                  Requested Delivery: {requirement.deliveryDate}
                </Typography>
              )}
            </Box>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Skeleton variant="rectangular" height={42} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={120} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.canDeliver}
                    onChange={handleChange}
                    name="canDeliver"
                    disabled={submitting}
                  />
                }
                label="I can deliver to the specified location"
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Proposed Delivery Date *"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={submitting}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "When can you deliver the products?"
                    }
                  }}
                />
              </LocalizationProvider>

              <TextField
                required
                fullWidth
                label="Proposed Amount"
                name="proposedAmount"
                value={formData.proposedAmount}
                onChange={handleChange}
                placeholder="e.g., 45,000 DKK"
                helperText="Your proposed price for fulfilling this requirement"
                disabled={submitting}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Details (Optional)"
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Any additional information you want the retailer to know..."
                disabled={submitting}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={submitting || loading}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || loading}
            sx={{
              bgcolor: '#2e42e2',
              '&:hover': { bgcolor: '#1e32d2' }
            }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Updating...
              </>
            ) : (
              'Update Quote'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditQuoteModal;