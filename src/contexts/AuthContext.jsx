import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize state immediately with localStorage data if available
  const initializeState = () => {
    const token = localStorage.getItem('auth_token');
    const cachedUser = localStorage.getItem('user');
    
    if (token && cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        return {
          user,
          loading: false,
          isAuthenticated: true
        };
      } catch (error) {
        console.warn('Failed to parse cached user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    
    return {
      user: null,
      loading: token ? true : false, // Only show loading if we have a token but no user data
      isAuthenticated: false
    };
  };

  const initialState = initializeState();
  const [user, setUser] = useState(initialState.user);
  const [loading, setLoading] = useState(initialState.loading);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      // If we already have user data loaded, no need to fetch again
      if (user && isAuthenticated) {
        return;
      }
      
      if (token && !user) {
        // Only fetch from API if we have token but no user data
        try {
          const userData = await authService.getUserDetails();
          // Extract the user object from the response to match login format
          const rawUser = userData.data?.user || userData;
          // Transform _id to id and role to userRole for consistency
          const user = { 
            ...rawUser, 
            id: rawUser._id,
            userRole: { role: rawUser.role }
          };
          if (user._id) delete user._id;
          if (user.role) delete user.role;
          setUser(user);
          setIsAuthenticated(true);
          // Update localStorage with the transformed user data
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [user, isAuthenticated]); // Dependencies to prevent unnecessary calls

  const login = async (email, password) => {
    try {
      const response = await authService.loginWithPassword(email, password);
      if (response.isSuccess && response.token) {
        // Store user data from response
        if (response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        setIsAuthenticated(true);
        return { success: true, data: response };
      }
      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const loginWithOtp = async (phone_number, verification_code) => {
    try {
      const response = await authService.verify(phone_number, verification_code);
      if (response.token) {
        const userData = await authService.getUserDetails();
        if (userData) {
          // Extract the user object from the response to match login format
          const rawUser = userData.data?.user || userData;
          // Transform _id to id and role to userRole for consistency
          const user = { 
            ...rawUser, 
            id: rawUser._id,
            userRole: { role: rawUser.role }
          };
          if (user._id) delete user._id;
          if (user.role) delete user.role;
          setUser(user);
          setIsAuthenticated(true);
          // Store the transformed user data in localStorage
          localStorage.setItem('user', JSON.stringify(user));
        }
        return { success: true, data: response };
      }
      return { success: false, error: response.message || 'Verification failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Verification failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    loginWithOtp,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};