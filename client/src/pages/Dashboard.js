// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';

import { GET_MY_DOCUMENTS, GET_PUBLIC_DOCUMENTS, SEARCH_DOCUMENTS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch documents
  const { loading: myDocsLoading, data: myDocsData } = useQuery(GET_MY_DOCUMENTS);
  const { loading: publicDocsLoading, data: publicDocsData } = useQuery(GET_PUBLIC_DOCUMENTS);
  
  // Search documents
  const { loading: searchLoading, data: searchData, refetch: searchRefetch } = useQuery(SEARCH_DOCUMENTS, {
    variables: { searchTerm: '' },
    skip: true,
  });
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchRefetch({ searchTerm });
      setTabValue(2);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
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
  
  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };
  
  // Get documents based on active tab
  const getDocuments = () => {
    if (tabValue === 0 && myDocsData) {
      return myDocsData.getMyDocuments;
    } else if (tabValue === 1 && publicDocsData) {
      return publicDocsData.getPublicDocuments;
    } else if (tabValue === 2 && searchData) {
      return searchData.searchDocuments;
    }
    return [];
  };
  
  const isLoading = myDocsLoading || publicDocsLoading || searchLoading;
  const documents = getDocuments();
  
  return (
    <Container maxWidth="lg">
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1">
          Mes Documents
        </Typography>
        
        <Button
          component={RouterLink}
          to="/upload"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Ajouter un document
        </Button>
      </Box>
      
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher des documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                >
                  Rechercher
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Box mb={4}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Mes Documents" />
          <Tab label="Documents Publics" />
          {tabValue === 2 && <Tab label="Résultats de Recherche" />}
        </Tabs>
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {documents.length === 0 ? (
            <Box textAlign="center" my={4}>
              <Typography variant="h6" color="textSecondary">
                {tabValue === 0
                  ? "Vous n'avez pas encore de documents. Ajoutez-en un !"
                  : tabValue === 1
                  ? "Aucun document public disponible"
                  : "Aucun résultat pour cette recherche"}
              </Typography>
              
              {tabValue === 0 && (
                <Button
                  component={RouterLink}
                  to="/upload"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Ajouter un document
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {documents.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" noWrap>
                          {doc.title}
                        </Typography>
                        {doc.type === 'video' ? (
                          <YouTubeIcon color="error" />
                        ) : (
                          <PictureAsPdfIcon color="primary" />
                        )}
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          {doc.owner.id === user.id
                            ? 'Vous'
                            : `${doc.owner.firstName} ${doc.owner.lastName}`}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <PublicIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          {doc.isPublic ? 'Public' : 'Privé'}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary">
                        Créé le {formatDate(doc.createdAt)}
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        component={RouterLink}
                        to={`/document/${doc.id}`}
                        color="primary"
                        fullWidth
                      >
                        Consulter
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard;