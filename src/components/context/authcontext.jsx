// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../../server/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from localStorage or session)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(`${config.BASE_URL}${config.API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session
      });

      const data = await response.json();

      if (data.status === 1) {
        // Admin user
        const userData = {
          email: email,
          role: 'Admin',
          status: 1,
          isAdmin: true
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else if (data.status === 2) {
        // Regular user - you might need to fetch additional user details
        const userData = {
          email: email,
          role: 'User', // This might come from your backend response
          status: 2,
          isAdmin: false,
          companyId: data.companyId, // If returned from backend
          department: data.department, // If returned from backend
          departmentId: data.departmentId // If returned from backend
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if you have one
      await fetch(`${config.BASE_URL}${config.API_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};