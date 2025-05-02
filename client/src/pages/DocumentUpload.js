// src/pages/DocumentUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDropzone } from 'react-dropzone';

import { CREATE_DOCUMENT_FROM_PDF, CREATE_DOCUMENT_FROM_YOUTUBE } from '../graphql/mutations';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  
  // Mutations
  const [createDocumentFromYoutube] = useMutation(CREATE_DOCUMENT_FROM_YOUTUBE);
  const [createDocumentFromPdf] = useMutation(CREATE_DOCUMENT_FROM_PDF);
  
  // Dropzone for PDF upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setPdfFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('Le fichier est trop volumineux. Taille maximum: 50MB');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Format de fichier non supporté. Seuls les fichiers PDF sont acceptés');
      } else {
        setError('Erreur lors du téléchargement du fichier');
      }
    },
  });
  
  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };
  
  // Handle YouTube URL form submission
  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Validate YouTube URL
      if (!youtubeUrl.includes('youtube.com/') && !youtubeUrl.includes('youtu.be/')) {
        throw new Error('URL YouTube invalide');
      }
      
      // Create document
      const { data } = await createDocumentFromYoutube({
        variables: {
          title,
          youtubeUrl,
          isPublic,
        },
      });
      
      const documentId = data.createDocumentFromYoutube.id;
      
      setSuccess('Document YouTube ajouté avec succès!');
      
      // Navigate to document details after a short delay
      setTimeout(() => {
        navigate(`/document/${documentId}`);
      }, 1500);
    } catch (error) {
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle PDF upload
  const handlePdfUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (!pdfFile) {
        throw new Error('Veuillez sélectionner un fichier PDF');
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', pdfFile);
      
      // Upload file
      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL_FETCH || 'http://localhost:4010'}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }
      
      const uploadData = await uploadResponse.json();
      
      // Create document
      const { data } = await createDocumentFromPdf({
        variables: {
          title,
          filePath: uploadData.filepath,
          isPublic,
        },
      });
      
      const documentId = data.createDocumentFromPdf.id;
      
      setSuccess('Document PDF ajouté avec succès!');
      
      // Navigate to document details after a short delay
      setTimeout(() => {
        navigate(`/document/${documentId}`);
      }, 1500);
    } catch (error) {
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box mb={4} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h4" component="h1">
          Ajouter un document
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab icon={<YouTubeIcon />} label="Vidéo YouTube" />
          <Tab icon={<UploadFileIcon />} label="PDF" />
        </Tabs>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <Box>
          {/* Common fields */}
          <TextField
            fullWidth
            label="Titre du document"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            sx={{ mb: 3 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
              />
            }
            label="Document public"
            sx={{ mb: 3 }}
          />
          
          {/* YouTube tab */}
          {activeTab === 0 && (
            <form onSubmit={handleYoutubeSubmit}>
              <TextField
                fullWidth
                label="URL YouTube"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<YouTubeIcon />}
                disabled={!title || !youtubeUrl || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Ajouter la vidéo'}
              </Button>
            </form>
          )}
          
          {/* PDF tab */}
          {activeTab === 1 && (
            <form onSubmit={handlePdfUpload}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.400',
                  borderRadius: 1,
                  p: 3,
                  mb: 3,
                  textAlign: 'center',
                  bgcolor: isDragActive ? 'primary.50' : 'background.paper',
                  cursor: 'pointer',
                }}
              >
                <input {...getInputProps()} />
                
                {pdfFile ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Fichier sélectionné:
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  </Box>
                ) : isDragActive ? (
                  <Typography>Déposez le fichier ici...</Typography>
                ) : (
                  <Box>
                    <UploadFileIcon fontSize="large" sx={{ mb: 1 }} />
                    <Typography variant="body1" gutterBottom>
                      Glissez-déposez un fichier PDF ici, ou cliquez pour sélectionner
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Taille maximum: 50MB
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<UploadFileIcon />}
                disabled={!title || !pdfFile || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Uploader le PDF'}
              </Button>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentUpload;