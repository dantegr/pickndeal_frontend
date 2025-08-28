import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useLocationData } from '../contexts/LocationDataContext';
import { useCategories } from '../contexts/CategoriesContext';
import api from '../services/api';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Business,
  LocationOn,
  Category,
  AccessTime
} from '@mui/icons-material';

const EditProfileForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const { profile, fetchProfile, updateProfile } = useProfile();
  const { countries, states, cities, fetchStates, fetchCities } = useLocationData();
  const { categories, categoryNamesToIds } = useCategories();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    address2: '',
    country_id: '',
    state_id: '',
    city_id: '',
    zip: '',
    aboutme: '',
    timeSlots: [],
    cats: [],
    lat: null,
    lng: null,
    deliveryRadius: null
  });
  
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);

  const steps = ['Business Information', 'Location Details', 'Categories & Availability'];

  const timeSlotOptions = [
    { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 3 PM)' },
    { value: 'evening', label: 'Evening (3 PM - 6 PM)' },
    { value: 'night', label: 'Night (6 PM - 9 PM)' }
  ];

  useEffect(() => {
    if (profile) {
      // Prepopulate form with existing profile data
      const profileData = {
        name: profile.name || user?.name || '',
        address: profile.address || '',
        address2: profile.address2 || '',
        country_id: profile.country_id || '',
        state_id: profile.state_id || '',
        city_id: profile.city_id || '',
        zip: profile.zip || '',
        aboutme: profile.aboutme || '',
        timeSlots: Array.isArray(profile.timeSlots) ? profile.timeSlots : [],
        cats: profile.categories || [],
        lat: profile.lat || null,
        lng: profile.lng || null,
        deliveryRadius: profile.deliveryRadius || null
      };
      
      setFormData(profileData);
      
      // Set delivery availability if deliveryRadius exists
      if (profile.deliveryRadius) {
        setDeliveryAvailable(true);
      }
      
      // Load states and cities if location is already selected
      if (profile.country_id) {
        fetchStates(profile.country_id).then(() => {
          if (profile.state_id) {
            fetchCities(profile.country_id, profile.state_id);
          }
        });
      }
    }
  }, [profile, user]);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormData({ ...formData, country_id: countryId, state_id: '', city_id: '' });
    
    if (countryId) {
      await fetchStates(countryId);
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData({ ...formData, state_id: stateId, city_id: '' });
    
    if (stateId && formData.country_id) {
      await fetchCities(formData.country_id, stateId);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return formData.name && formData.aboutme;
      case 1:
        return formData.address && formData.country_id && formData.state_id && formData.zip;
      case 2:
        // For edit, we don't require categories and timeSlots to be filled
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Prepare update payload - only send changed fields
      const updatePayload = {};
      
      // Compare and add only changed fields
      if (formData.name !== profile?.name) updatePayload.name = formData.name;
      if (formData.address !== profile?.address) updatePayload.address = formData.address;
      if (formData.address2 !== profile?.address2) updatePayload.address2 = formData.address2;
      if (formData.country_id !== profile?.country_id) updatePayload.country_id = formData.country_id;
      if (formData.state_id !== profile?.state_id) updatePayload.state_id = formData.state_id;
      if (formData.city_id !== profile?.city_id) updatePayload.city_id = formData.city_id;
      if (formData.zip !== profile?.zip) updatePayload.zip = formData.zip;
      if (formData.aboutme !== profile?.aboutme) updatePayload.aboutme = formData.aboutme;
      
      // Handle array fields
      if (JSON.stringify(formData.timeSlots) !== JSON.stringify(profile?.timeSlots)) {
        updatePayload.timeSlots = formData.timeSlots;
      }
      
      // Handle categories - convert category names to IDs if needed
      if (formData.cats && formData.cats.length > 0) {
        // Check if cats are already IDs or names
        const isNames = typeof formData.cats[0] === 'string' && isNaN(formData.cats[0]);
        if (isNames) {
          // If they're names, convert to IDs for the API
          const catIds = categoryNamesToIds(formData.cats);
          updatePayload.cats = catIds;
        } else {
          updatePayload.cats = formData.cats;
        }
      }
      
      // Handle location coordinates
      if (formData.lat !== profile?.lat) updatePayload.lat = formData.lat;
      if (formData.lng !== profile?.lng) updatePayload.lng = formData.lng;
      
      // Handle delivery radius for suppliers
      if (user?.userRole?.role === 'supplier') {
        if (deliveryAvailable && formData.deliveryRadius) {
          if (formData.deliveryRadius !== profile?.deliveryRadius) {
            updatePayload.deliveryRadius = formData.deliveryRadius;
          }
        } else if (!deliveryAvailable && profile?.deliveryRadius) {
          // Remove delivery radius if unchecked
          updatePayload.deliveryRadius = null;
        }
      }

      // Only make API call if there are changes
      if (Object.keys(updatePayload).length === 0) {
        toast.info('No changes to save');
        setLoading(false);
        return;
      }

      // Call the update API
      const response = await api.put('/profile/update', updatePayload);

      if (response.status === 200 && response.data?.type === 'success') {
        // Fetch updated profile to update context
        const profileResponse = await api.get('/profile');
        if (profileResponse.data?.type === 'success' && profileResponse.data?.data) {
          updateProfile(profileResponse.data.data);
        }
        
        toast.success('Profile updated successfully!');
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1 }} />
              Business Information
            </Typography>
            
            <TextField
              fullWidth
              label="Business Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              helperText="Enter your business or company name"
              size="small"
            />

            <TextField
              fullWidth
              label="About Your Business"
              name="aboutme"
              value={formData.aboutme}
              onChange={handleChange}
              multiline
              rows={3}
              required
              helperText="Describe your business, products, or services"
              size="small"
            />

            {user?.userRole?.role === 'supplier' && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={deliveryAvailable}
                      onChange={(e) => {
                        setDeliveryAvailable(e.target.checked);
                        if (!e.target.checked) {
                          setFormData({ ...formData, deliveryRadius: null });
                        }
                      }}
                      size="small"
                    />
                  }
                  label="Ability to Deliver"
                />
                
                {deliveryAvailable && (
                  <TextField
                    fullWidth
                    label="Delivery Radius (km)"
                    name="deliveryRadius"
                    type="number"
                    value={formData.deliveryRadius || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        deliveryRadius: e.target.value ? Number(e.target.value) : null
                      });
                    }}
                    helperText="Maximum distance for delivery services"
                    size="small"
                  />
                )}
              </>
            )}
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1 }} />
              Location Details
            </Typography>

            <TextField
              fullWidth
              label="Address Line 1"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              helperText="Street address, building name"
              size="small"
            />

            <TextField
              fullWidth
              label="Address Line 2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              helperText="Area, locality, landmark (optional)"
              size="small"
            />

            <FormControl fullWidth required size="small">
              <InputLabel>Country</InputLabel>
              <Select
                name="country_id"
                value={formData.country_id}
                onChange={handleCountryChange}
                label="Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.country_id} size="small">
              <InputLabel>State</InputLabel>
              <Select
                name="state_id"
                value={formData.state_id}
                onChange={handleStateChange}
                label="State"
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!formData.state_id} size="small">
              <InputLabel>City</InputLabel>
              <Select
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                label="City"
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Optional</FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              label="ZIP/Postal Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              helperText="Enter your area postal code"
              size="small"
            />
          </Stack>
        );
      
      case 2:
        return (
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Category sx={{ mr: 1 }} />
              Business Categories
            </Typography>

            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option) => option.name || option.title || option}
              value={categories.filter(c => {
                // Handle both category IDs and names
                if (typeof formData.cats[0] === 'string' && isNaN(formData.cats[0])) {
                  // If cats contains names
                  return formData.cats.includes(c.name) || formData.cats.includes(c.title);
                } else {
                  // If cats contains IDs
                  return formData.cats.includes(c.id);
                }
              })}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  cats: newValue.map(v => v.id)
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Categories"
                  placeholder="Choose business categories"
                  helperText="Select categories that best describe your business"
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name || option.title || option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              size="small"
            />

            <Box>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                Availability Time Slots
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {timeSlotOptions.map((slot) => (
                  <Chip
                    key={slot.value}
                    label={slot.label}
                    onClick={() => {
                      const newSlots = formData.timeSlots.includes(slot.value)
                        ? formData.timeSlots.filter(s => s !== slot.value)
                        : [...formData.timeSlots, slot.value];
                      setFormData({ ...formData, timeSlots: newSlots });
                    }}
                    color={formData.timeSlots.includes(slot.value) ? 'primary' : 'default'}
                    variant={formData.timeSlots.includes(slot.value) ? 'filled' : 'outlined'}
                    sx={{ mb: 1 }}
                    size="small"
                  />
                ))}
              </Stack>
              <FormHelperText>Select your preferred business hours</FormHelperText>
            </Box>
          </Stack>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f9f9f9' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              onClick={() => setActiveStep(index)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiStepLabel-label': {
                    color: '#2e42e2',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 250, mb: 2 }}>
        {renderStepContent()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          size="small"
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1 || !validateStep()}
          size="small"
          sx={{ 
            bgcolor: activeStep === steps.length - 1 ? '#ccc' : '#2e42e2',
            '&:hover': { 
              bgcolor: activeStep === steps.length - 1 ? '#ccc' : '#1e32d2' 
            }
          }}
        >
          Next
        </Button>
      </Box>

      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading || !validateStep()}
          size="medium"
          sx={{ 
            bgcolor: '#2e42e2',
            '&:hover': { bgcolor: '#1e32d2' },
            py: 1.5
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Updating Profile...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfileForm;