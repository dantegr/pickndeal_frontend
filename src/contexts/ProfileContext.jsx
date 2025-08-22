import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // Fetch user profile data including coordinates
  const fetchProfile = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      setLoading(true);
      // Try to get profile from backend
      const response = await api.get('/user/profile');
      
      if (response.data?.profile) {
        const profileData = response.data.profile;
        setProfile(profileData);
        
        // Extract coordinates if available
        if (profileData.lat && profileData.lng) {
          setCoordinates({
            lat: profileData.lat,
            lng: profileData.lng
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If profile doesn't exist or API fails, use mock coordinates for testing
      // You can remove this mock data once real profiles are working
      if (error.response?.status === 404 || !profile) {
        console.log('Using mock coordinates for testing (Copenhagen center)');
        setCoordinates({
          lat: 55.672964,
          lng: 12.558193
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = (newProfileData) => {
    setProfile(newProfileData);
    
    // Update coordinates if they changed
    if (newProfileData.lat && newProfileData.lng) {
      setCoordinates({
        lat: newProfileData.lat,
        lng: newProfileData.lng
      });
    }
  };

  // Update coordinates separately
  const updateCoordinates = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      // Clear profile data when user logs out
      setProfile(null);
      setCoordinates(null);
    }
  }, [isAuthenticated, user]);

  const value = {
    profile,
    coordinates,
    loading,
    fetchProfile,
    updateProfile,
    updateCoordinates,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};