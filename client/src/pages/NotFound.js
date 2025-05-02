// src/pages/NotFound.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h1" color="primary" gutterBottom>
            404
          </Typography>
          
          <Typography variant="h5" gutterBottom>
            Page non trouvée
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </Typography>
          
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            sx={{ mt: 2 }}
          >
            Retour à l'accueil
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;