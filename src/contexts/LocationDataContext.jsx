import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const LocationDataContext = createContext(null);

export const useLocationData = () => {
  const context = useContext(LocationDataContext);
  if (!context) {
    throw new Error('useLocationData must be used within a LocationDataProvider');
  }
  return context;
};

export const LocationDataProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch initial data when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !dataLoaded) {
      fetchCountries();
    } else if (!isAuthenticated) {
      // Clear data on logout
      clearData();
    }
  }, [isAuthenticated, user]);

  const clearData = () => {
    setCountries([]);
    setStates([]);
    setCities([]);
    setDataLoaded(false);
  };

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const countriesRes = await api.get('/user/countries');
      setCountries(countriesRes.data || []);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      setCities([]);
      return [];
    }

    try {
      const response = await api.get(`/user/states/${countryId}`);
      const statesData = response.data || [];
      setStates(statesData);
      setCities([]); // Clear cities when country changes
      return statesData;
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
      return [];
    }
  };

  const fetchCities = async (countryId, stateId) => {
    if (!countryId || !stateId) {
      setCities([]);
      return [];
    }

    try {
      const response = await api.get('/user/cities', {
        params: {
          countryId: countryId,
          stateId: stateId
        }
      });
      const citiesData = response.data || [];
      setCities(citiesData);
      return citiesData;
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
      return [];
    }
  };

  // Helper function to get location names by IDs
  const getLocationNames = (countryId, stateId, cityId) => {
    const country = countries.find(c => c.id === countryId);
    const state = states.find(s => s.id === stateId);
    const city = cities.find(c => c.id === cityId);
    
    return {
      countryName: country?.name || '',
      stateName: state?.name || '',
      cityName: city?.name || ''
    };
  };

  const value = {
    countries,
    states,
    cities,
    loading,
    dataLoaded,
    fetchStates,
    fetchCities,
    getLocationNames,
    refetchCountries: fetchCountries
  };

  return (
    <LocationDataContext.Provider value={value}>
      {children}
    </LocationDataContext.Provider>
  );
};