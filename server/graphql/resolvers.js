// graphql/resolvers.js
const User = require('../models/User');
const Document = require('../models/Document');
const Query = require('../models/Query');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { extractYoutubeTranscript, processPdf } = require('../services/documentProcessor');
const { askAI } = require('../services/aiService');

const resolvers = {
  RootQuery: {
    // User queries
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      return await User.findById(user.id);
    },
    
    getUser: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      // Only admins can access other users' data
      if (user.role !== 'admin' && user.id !== id) {
        throw new AuthenticationError('Not authorized');
      }
      
      return await User.findById(id);
    },
    
    // Document queries
    getDocument: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      const document = await Document.findById(id).populate('owner');
      
      // Check if user has access to this document
      if (document.owner.id !== user.id && !document.isPublic && user.role !== 'admin') {
        throw new AuthenticationError('Not authorized to access this document');
      }
      
      return document;
    },
    
    getMyDocuments: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      return await Document.find({ owner: user.id }).populate('owner').sort({ createdAt: -1 });
    },
    
    getPublicDocuments: async () => {
      return await Document.find({ isPublic: true }).populate('owner').sort({ createdAt: -1 });
    },
    
    searchDocuments: async (_, { searchTerm }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      // Search in user's own documents and public documents
      return await Document.find({
        $and: [
          { $text: { $search: searchTerm } },
          {
            $or: [
              { owner: user.id },
              { isPublic: true }
            ]
          }
        ]
      }).populate('owner').sort({ createdAt: -1 });
    },
    
    // Query history
    getMyQueries: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      return await Query.find({ user: user.id })
        .populate('document')
        .populate('user')
        .sort({ createdAt: -1 });
    },
    
    // Dans /server/graphql/resolvers.js
    getDocumentQueries: async (_, { documentId }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Vous devez être connecté!');
      }
      
      const document = await Document.findById(documentId);
      
      // Vérifier si l'utilisateur a accès à ce document
      if (!document) {
        throw new UserInputError('Document non trouvé');
      }
      
      if (document.owner.toString() !== user.id && !document.isPublic && user.role !== 'admin') {
        throw new AuthenticationError('Non autorisé à accéder à ce document');
      }
      
      // Récupérer les requêtes
      const queries = await Query.find({ document: documentId, user: user.id })
        .populate('document')
        .populate('user')
        .sort({ createdAt: -1 });
      
      console.log('Nombre de requêtes trouvées:', queries.length);
      
      // Assurez-vous que chaque objet a un ID unique
      return queries.map(query => {
        console.log('ID de requête:', query._id.toString());
        return {
          id: query._id.toString(),
          question: query.question,
          answer: query.answer,
          document: query.document,
          user: query.user,
          createdAt: query.createdAt.toString(),
        };
      });
    },
  },
  
  Mutation: {
    // Auth mutations
    register: async (_, { email, password, firstName, lastName, role }) => {
      // Check if email already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new UserInputError('Email already registered');
      }
      
      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role: role || 'student',
      });
      
      await user.save();
      
      // Generate token
      const token = user.generateAuthToken();
      
      return {
        token,
        user,
      };
    },
    
    login: async (_, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError('Invalid credentials');
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new UserInputError('Invalid credentials');
      }
      
      // Generate token
      const token = user.generateAuthToken();
      
      return {
        token,
        user,
      };
    },
    
    // Document mutations
    createDocumentFromYoutube: async (_, { title, youtubeUrl, isPublic }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      try {
        // Extract transcript from YouTube video
        const content = await extractYoutubeTranscript(youtubeUrl);
        
        // Create document
        const document = new Document({
          title,
          type: 'video',
          youtubeUrl,
          content,
          owner: user.id,
          isPublic: isPublic || false,
        });
        
        await document.save();
        await document.populate('owner');
        
        return document;
      } catch (error) {
        throw new Error(`Failed to process YouTube video: ${error.message}`);
      }
    },
    
    createDocumentFromPdf: async (_, { title, filePath, isPublic }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      try {
        // Extract text from PDF
        const content = await processPdf(filePath);
        
        // Create document
        const document = new Document({
          title,
          type: 'pdf',
          filePath,
          content,
          owner: user.id,
          isPublic: isPublic || false,
        });
        
        await document.save();
        await document.populate('owner');
        
        return document;
      } catch (error) {
        throw new Error(`Failed to process PDF: ${error.message}`);
      }
    },
    
    updateDocument: async (_, { id, title, isPublic }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      const document = await Document.findById(id);
      
      // Check if user is authorized to update document
      if (document.owner.toString() !== user.id && user.role !== 'admin') {
        throw new AuthenticationError('Not authorized to update this document');
      }
      
      // Update document
      if (title) document.title = title;
      if (isPublic !== undefined) document.isPublic = isPublic;
      
      await document.save();
      await document.populate('owner');
      
      return document;
    },
    
    deleteDocument: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      const document = await Document.findById(id);
      
      // Check if user is authorized to delete document
      if (document.owner.toString() !== user.id && user.role !== 'admin') {
        throw new AuthenticationError('Not authorized to delete this document');
      }
      
      // Delete document
      await Document.findByIdAndDelete(id);
      
      // Delete related queries
      await Query.deleteMany({ document: id });
      
      return true;
    },
    
    // AI Query mutations
    askQuestion: async (_, { documentId, question }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in!');
      }
      
      // Get document
      const document = await Document.findById(documentId);
      if (!document) {
        throw new UserInputError('Document not found');
      }
      
      // Check if user has access to this document
      if (document.owner.toString() !== user.id && !document.isPublic && user.role !== 'admin') {
        throw new AuthenticationError('Not authorized to access this document');
      }
      
      try {
        // Ask AI
        const answer = await askAI(document.content, question);
        
        // Save query to history
        const query = new Query({
          question,
          answer,
          document: documentId,
          user: user.id,
        });
        
        await query.save();
        
        return { answer };
      } catch (error) {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;