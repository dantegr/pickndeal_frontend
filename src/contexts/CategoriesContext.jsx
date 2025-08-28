import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CategoriesContext = createContext(null);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch categories when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !dataLoaded) {
      fetchCategories();
    } else if (!isAuthenticated) {
      // Clear data on logout
      clearData();
    }
  }, [isAuthenticated, user]);

  const clearData = () => {
    setCategories([]);
    setDataLoaded(false);
  };

  const fetchCategories = async (role = null) => {
    try {
      setLoading(true);
      // Use provided role or fall back to user's role
      const userRole = role || user?.userRole?.role || 'retailer';
      const categoriesRes = await api.get('/user/categories', {
        params: { role: userRole }
      });
      setCategories(categoriesRes.data || []);
      setDataLoaded(true);
      return categoriesRes.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category?.name || category?.title || '';
  };

  // Get multiple category names by IDs
  const getCategoryNames = (categoryIds) => {
    if (!Array.isArray(categoryIds)) return [];
    return categoryIds.map(id => getCategoryName(id)).filter(name => name);
  };

  // Convert category names to IDs
  const categoryNamesToIds = (categoryNames) => {
    if (!Array.isArray(categoryNames)) return [];
    return categoryNames.map(name => {
      const category = categories.find(c => c.name === name || c.title === name);
      return category?.id;
    }).filter(id => id);
  };

  // Convert category IDs to names
  const categoryIdsToNames = (categoryIds) => {
    if (!Array.isArray(categoryIds)) return [];
    return categoryIds.map(id => {
      const category = categories.find(c => c.id === id);
      return category?.name || category?.title;
    }).filter(name => name);
  };

  const value = {
    categories,
    loading,
    dataLoaded,
    fetchCategories,
    getCategoryById,
    getCategoryName,
    getCategoryNames,
    categoryNamesToIds,
    categoryIdsToNames,
    refetchCategories: () => fetchCategories(user?.userRole?.role)
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};