// middleware/auth.js
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const authMiddleware = (req) => {
  console.log('Auth middleware');
  // Get token from header
  const authHeader = req.headers.authorization || '';
  
  if (!authHeader) {
    return null;
  }
  
  // Check if not bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return null;
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Express middleware for file uploads
const expressAuthMiddleware = (req, res, next) => {
  console.log('Express auth middleware');
  try {
    const user = authMiddleware(req);
    
    if (!user) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Erreur d\'authentification: ' + error.message });
  }
};

module.exports = { authMiddleware, expressAuthMiddleware };