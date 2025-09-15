import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
  Alert,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';

const CreateRequirementModal = ({ open, onClose, onRequirementCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    quantity: '',
    recurring: false,
    location: '',
    deliveryDate: '',
    budget: ''
  });
  const [productCategories, setProductCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = [
    'Monday',
    'Tuesday', 
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  useEffect(() => {
    if (open) {
      fetchProductCategories();
    }
  }, [open]);

  const fetchProductCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get('/productCategory/getAll');
      setProductCategories(response.data.data);
    } catch (err) {
      console.error('Error fetching product categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear deliveryDate when toggling recurring
    if (name === 'recurring') {
      setFormData(prev => ({
        ...prev,
        deliveryDate: ''
      }));
      setSelectedDate(null);
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      categories: typeof value === 'string' ? value.split(',') : value
    }));

    // Update units based on selected categories
    if (value.length > 0) {
      // Find the units for the first selected category
      const firstCategory = productCategories.find(cat => cat.name === value[0]);
      if (firstCategory) {
        setSelectedUnits(firstCategory.unit_of_measurement);
      }
    } else {
      setSelectedUnits('');
    }
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
    if (!formData.title || !formData.description || !formData.location || 
        !formData.deliveryDate || !formData.budget || !formData.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate quantity is a positive number
    if (parseFloat(formData.quantity) <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/requirement/create', formData);
      
      if (response.data.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          categories: [],
          quantity: '',
          recurring: false,
          location: '',
          deliveryDate: '',
          budget: ''
        });
        setSelectedUnits('');
        setSelectedDate(null);
        
        // Notify parent component
        if (onRequirementCreated) {
          onRequirementCreated(response.data.data);
        }
        
        onClose();
      }
    } catch (err) {
      console.error('Error creating requirement:', err);
      setError(err.response?.data?.message || 'Failed to create requirement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({
        title: '',
        description: '',
        categories: [],
        quantity: '',
        recurring: false,
        location: '',
        deliveryDate: '',
        budget: ''
      });
      setSelectedUnits('');
      setSelectedDate(null);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Create New Requirement
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={submitting}
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Fresh Vegetables Supply for Restaurant"
              disabled={submitting}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your requirement in detail..."
              disabled={submitting}
            />

            <FormControl fullWidth>
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                labelId="categories-label"
                multiple
                value={formData.categories}
                onChange={handleCategoryChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                disabled={submitting || loadingCategories}
              >
                {loadingCategories ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  productCategories.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name} ({category.unit_of_measurement})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              type="number"
              label={`Quantity${selectedUnits ? ` (${selectedUnits})` : ''}`}
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              helperText={selectedUnits ? `Quantity in ${selectedUnits}` : 'Select a category first to see units'}
              disabled={submitting}
              inputProps={{ min: 0, step: "any" }}
            />

            <TextField
              required
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Copenhagen Central"
              disabled={submitting}
            />

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.recurring}
                    onChange={handleChange}
                    name="recurring"
                    disabled={submitting}
                  />
                }
                label="Recurring Weekly"
              />
            </Box>

            {formData.recurring ? (
              <FormControl fullWidth required>
                <InputLabel id="delivery-day-label">Delivery Day</InputLabel>
                <Select
                  labelId="delivery-day-label"
                  value={formData.deliveryDate}
                  label="Delivery Day"
                  onChange={handleChange}
                  name="deliveryDate"
                  disabled={submitting}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Delivery Date *"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={submitting}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "Select your preferred delivery date"
                    }
                  }}
                />
              </LocalizationProvider>
            )}

            <TextField
              required
              fullWidth
              label="Budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g., 50,000 DKK/month"
              helperText="Specify your budget range or maximum budget"
              disabled={submitting}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={submitting}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: '#2e42e2',
              '&:hover': { bgcolor: '#1e32d2' }
            }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Creating...
              </>
            ) : (
              'Create Requirement'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateRequirementModal;