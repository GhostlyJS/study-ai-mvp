// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentDetails from './pages/DocumentDetails';
import DocumentUpload from './pages/DocumentUpload';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';

// Context
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</Box>;
  }

  return (
    <>
      {isAuthenticated && <NavBar />}
      <Box component="main" sx={{ p: 3, mt: isAuthenticated ? 8 : 0 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          
          {/* Private routes */}
          <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/document/:id" element={<PrivateRoute><DocumentDetails /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><DocumentUpload /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;