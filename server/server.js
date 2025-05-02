// server.js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { authMiddleware, expressAuthMiddleware } = require('./middleware/auth');
const { applyRbacRules } = require('./middleware/rbac');

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Configure file upload with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and MP4 files are allowed!'), false);
    }
  }
});

const consoleLogMiddleware = (req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
}

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// File upload endpoint (outside of GraphQL)
app.post('/upload', expressAuthMiddleware, upload.single('file'),(req, res) => {
  console.log('File upload endpoint');
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.json({ 
    filepath: req.file.path,
    filename: req.file.originalname,
    mimetype: req.file.mimetype
  });
});

// Setup Apollo Server with RBAC
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add the authenticated user to the context
      const user = authMiddleware(req);
      return { user };
    },
    plugins: [
      {
        async requestDidStart() {
          return {
            async didResolveOperation({ context, document }) {
              // Apply RBAC rules
              await applyRbacRules(context, document);
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/study-ai-mvp';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch(err => {
  console.error('Error starting server:', err);
});