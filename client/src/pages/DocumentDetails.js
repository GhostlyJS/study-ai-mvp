// src/pages/DocumentDetails.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Chip,
} from '@mui/material';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SendIcon from '@mui/icons-material/Send';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

import { GET_DOCUMENT, GET_DOCUMENT_QUERIES } from '../graphql/queries';
import { ASK_QUESTION, DELETE_DOCUMENT } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Fetch document
  const { loading: docLoading, data: docData, error: docError } = useQuery(GET_DOCUMENT, {
    variables: { id },
  });
  
  // Fetch document queries
  const { loading: queriesLoading, data: queriesData, refetch: refetchQueries } = useQuery(GET_DOCUMENT_QUERIES, {
    variables: { documentId: id },
    fetchPolicy: 'network-only',
  });

  console.log('queriesData', queriesData);
  
  // Mutations
  const [askQuestion] = useMutation(ASK_QUESTION);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT);
  
  if (docLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (docError) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          Erreur lors du chargement du document. Veuillez réessayer.
        </Typography>
      </Container>
    );
  }
  
  const document = docData?.getDocument;
  if (!document) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Document non trouvé.
        </Typography>
      </Container>
    );
  }
  
  const isOwner = document.owner.id === user.id;
  const queries = queriesData?.getDocumentQueries || [];
  
  // Modifiez la fonction formatDate pour qu'elle gère les dates invalides
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
  
  // Handle ask question
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    
    try {
      await askQuestion({
        variables: {
          documentId: id,
          question: question.trim(),
        },
      });
      
      setQuestion('');
      await refetchQueries();
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete document
  const handleDeleteDocument = async () => {
    try {
      await deleteDocument({
        variables: { id },
      });
      
      setDeleteDialogOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box mb={4} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {document.title}
        </Typography>
        
        {isOwner && (
          <Box>
            <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      <Box mb={4} display="flex" alignItems="center">
        <Chip
          icon={document.type === 'video' ? <YouTubeIcon /> : <PictureAsPdfIcon />}
          label={document.type === 'video' ? 'Vidéo YouTube' : 'PDF'}
          color={document.type === 'video' ? 'error' : 'primary'}
          sx={{ mr: 1 }}
        />
        
        <Chip
          icon={document.isPublic ? <PublicIcon /> : <LockIcon />}
          label={document.isPublic ? 'Public' : 'Privé'}
          color={document.isPublic ? 'success' : 'default'}
        />
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Typography variant="body2" color="textSecondary">
          Créé le {formatDate(document.createdAt)}
        </Typography>
      </Box>
      
      {document.type === 'video' && document.youtubeUrl && (
        <Box mb={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <ReactPlayer
              url={document.youtubeUrl}
              width="100%"
              height="500px"
              controls
            />
          </Paper>
        </Box>
      )}
      
      {document.type === 'pdf' && document.filePath && (
        <Box mb={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              <PictureAsPdfIcon fontSize="large" color="primary" sx={{ mb: -1 }} /> Document PDF
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Le PDF est chargé sur le serveur et prêt pour l'analyse.
            </Typography>
          </Paper>
        </Box>
      )}
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Poser une question sur ce document
        </Typography>
        <Box display="flex" alignItems="flex-start">
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Posez votre question ici..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            variant="outlined"
            disabled={loading}
            sx={{ mr: 2 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleAskQuestion}
            disabled={!question.trim() || loading}
            sx={{ minHeight: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Envoyer'}
          </Button>
        </Box>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Historique des questions
      </Typography>
      
      {queriesLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : queries.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          Aucune question posée pour le moment. Posez votre première question !
        </Typography>
      ) : (
        <Box>
          {queries.map((query) => (
            <Card key={query.id} variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                {/* Utiliser les données spécifiques à cette question */}
                <Typography variant="h6" gutterBottom>
                  Q: {query.question}
                </Typography>
                
                <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                  Posée le {formatDate(query.createdAt)}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Réponse:
                </Typography>
                
                <Box sx={{ px: 2, py: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                  <ReactMarkdown>{query.answer}</ReactMarkdown>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Supprimer le document ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible et
            supprimera également toutes les questions associées.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteDocument} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentDetails;