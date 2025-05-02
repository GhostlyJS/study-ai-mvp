// src/pages/Profile.js
import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { GET_ME, GET_MY_DOCUMENTS, GET_MY_QUERIES } from '../graphql/queries';

const Profile = () => {
  // Fetch user data
  const { loading: userLoading, data: userData } = useQuery(GET_ME);
  
  // Fetch user documents
  const { loading: docsLoading, data: docsData } = useQuery(GET_MY_DOCUMENTS);
  
  // Fetch user queries
  const { loading: queriesLoading, data: queriesData } = useQuery(GET_MY_QUERIES);
  
  if (userLoading || docsLoading || queriesLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  const user = userData?.me;
  const documents = docsData?.getMyDocuments || [];
  const queries = queriesData?.getMyQueries || [];
  
  if (!user) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          Erreur lors du chargement du profil. Veuillez réessayer.
        </Typography>
      </Container>
    );
  }
  
  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date inconnue';
      
      const date = new Date(dateString);
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Date invalide';
    }
  };
  
  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'teacher':
        return 'Enseignant';
      case 'student':
        return 'Étudiant';
      default:
        return role;
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Mon Profil
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  mb: 2,
                }}
              >
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Box>
              
              <Typography variant="h5" align="center">
                {user.firstName} {user.lastName}
              </Typography>
              
              <Chip
                label={getRoleLabel(user.role)}
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Nom complet: {user.firstName} {user.lastName}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body1">Email: {user.email}</Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <WorkIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Rôle: {getRoleLabel(user.role)}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Membre depuis: {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                >
                  <Typography variant="h4">{documents.length}</Typography>
                  <Typography variant="subtitle1">Documents</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'secondary.light',
                    color: 'secondary.contrastText',
                  }}
                >
                  <Typography variant="h4">{queries.length}</Typography>
                  <Typography variant="subtitle1">Questions posées</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activité récente
            </Typography>
            
            {queries.length > 0 ? (
              <Box>
                {queries.slice(0, 5).map((query) => {
                  const document = documents.find(
                    (doc) => doc.id === query.document.id
                  );
                  
                  return (
                    <Box
                      key={query.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Q: {query.question}
                      </Typography>
                      
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Document: {document?.title || query.document.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(query.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                Aucune activité récente. Commencez à poser des questions sur vos documents !
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;