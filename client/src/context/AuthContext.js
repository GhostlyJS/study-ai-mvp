// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { GET_ME } from '../graphql/queries';
import { LOGIN, REGISTER } from '../graphql/mutations';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  
  // GraphQL operations
  const { refetch } = useQuery(GET_ME, {
    skip: !localStorage.getItem('token'),
    onCompleted: (data) => {
      if (data && data.me) {
        setUser(data.me);
      }
      setLoading(false);
    },
    onError: () => {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    },
  });
  
  const [login] = useMutation(LOGIN);
  const [register] = useMutation(REGISTER);
  
  // Check if token is valid on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          handleLogout();
        } else {
          // Fetch user data
          refetch();
        }
      } catch (error) {
        // Invalid token
        handleLogout();
      }
    } else {
      setLoading(false);
    }
  }, [refetch]);
  
  // Login handler
  const handleLogin = async (email, password) => {
    try {
      const { data } = await login({
        variables: { email, password },
      });
      
      const { token, user } = data.login;
      
      // Save token and user data
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };
  
  // Register handler
  const handleRegister = async (userData) => {
    try {
      const { data } = await register({
        variables: userData,
      });
      
      const { token, user } = data.register;
      
      // Save token and user data
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Clear Apollo cache
    client.resetStore();
  };
  
  // Context value
  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};