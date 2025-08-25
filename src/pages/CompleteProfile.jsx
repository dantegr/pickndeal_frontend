import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  FormHelperText,
  Autocomplete,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Business,
  LocationOn,
  Category,
  AccessTime,
  Info
} from '@mui/icons-material';

const CompleteProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch countries
      const countriesRes = await api.get('/user/countries');
      setCountries(countriesRes.data || []);
      
      // Fetch categories based on user role
      const userRole = user?.userRole?.role || 'retailer';
      const categoriesRes = await api.get('/user/categories', {
        params: { role: userRole }
      });
      setCategories(categoriesRes.data || []);
      
      // If user has existing profile data, load it
      if (user?.id) {
        const profileRes = await api.get('/user/profile');
        if (profileRes.data?.profile) {
          const profile = profileRes.data.profile;
          setFormData(prev => ({
            ...prev,
            address: profile.address || '',
            address2: profile.address2 || '',
            country_id: profile.country_id || '',
            state_id: profile.state_id || '',
            city_id: profile.city_id || '',
            zip: profile.pin || '',
            aboutme: profile.about_us || '',
            timeSlots: profile.time_slots ? JSON.parse(profile.time_slots) : [],
            cats: profileRes.data.cats?.map(c => c.category_id) || [],
            deliveryRadius: profile.deliveryRadius || null
          }));
          
          // Set delivery availability if deliveryRadius exists
          if (profile.deliveryRadius) {
            setDeliveryAvailable(true);
          }
          
          // Load states if country is selected
          if (profile.country_id) {
            const statesRes = await api.get(`/user/states/${profile.country_id}`);
            setStates(statesRes.data || []);
          }
          
          // Load cities if state is selected
          if (profile.state_id && profile.country_id) {
            const citiesRes = await api.get('/user/cities', {
              params: {
                countryId: profile.country_id,
                stateId: profile.state_id
              }
            });
            setCities(citiesRes.data || []);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormData({ ...formData, country_id: countryId, state_id: '', city_id: '' });
    
    if (countryId) {
      try {
        const response = await api.get(`/user/states/${countryId}`);
        setStates(response.data || []);
        setCities([]);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData({ ...formData, state_id: stateId, city_id: '' });
    
    if (stateId && formData.country_id) {
      try {
        const response = await api.get('/user/cities', {
          params: {
            countryId: formData.country_id,
            stateId: stateId
          }
        });
        setCities(response.data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    } else {
      setCities([]);
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
        return formData.cats.length > 0 && formData.timeSlots.length > 0;
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
      const payload = {
        ...formData,
        userid: user.id,
        timeSlots: JSON.stringify(formData.timeSlots)
      };
      
      // Only include deliveryRadius if user is supplier and delivery is available
      if (user?.userRole?.role === 'supplier' && deliveryAvailable && formData.deliveryRadius) {
        payload.deliveryRadius = formData.deliveryRadius;
      }

      const response = await api.post('/save/profile', payload);

      if (response.status === 200 && response.data?.type === 'success') {
        // Update user in context
        updateUser({ ...user, is_profile_completed: 1 });
        
        toast.success('Profile completed successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to save profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving profile');
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
            />

            <TextField
              fullWidth
              label="About Your Business"
              name="aboutme"
              value={formData.aboutme}
              onChange={handleChange}
              multiline
              rows={4}
              required
              helperText="Describe your business, products, or services"
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
                  />
                )}
              </>
            )}
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
            />

            <TextField
              fullWidth
              label="Address Line 2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              helperText="Area, locality, landmark (optional)"
            />

            <FormControl fullWidth required>
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

            <FormControl fullWidth required disabled={!formData.country_id}>
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

            <FormControl fullWidth disabled={!formData.state_id}>
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
            />
          </Stack>
        );
      
      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Category sx={{ mr: 1 }} />
              Business Categories
            </Typography>

            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option) => option.name || option.title}
              value={categories.filter(c => formData.cats.includes(c.id))}
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
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name || option.title}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />

            <Box>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ mr: 1 }} />
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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: '#4b4b4b',
                  mb: 1,
                }}
              >
                Complete Your Profile
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#909097',
                  fontWeight: 500,
                }}
              >
                Please provide your business information to start using Pick N Deal
              </Typography>
            </Box>

            {user?.is_profile_completed === 0 && (
              <Alert severity="info" icon={<Info />}>
                Your profile must be completed before you can access the marketplace features.
              </Alert>
            )}

            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 3, mb: 2 }}>
              {renderStepContent()}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !validateStep()}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        Saving...
                      </>
                    ) : (
                      'Complete Profile'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!validateStep()}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompleteProfile;