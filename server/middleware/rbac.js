// middleware/rbac.js
const { ForbiddenError } = require('apollo-server-express');
const { getOperationAST } = require('graphql');

// Define RBAC permissions
const permissions = {
  student: {
    queries: ['me', 'getDocument', 'getMyDocuments', 'getPublicDocuments', 'searchDocuments', 'getMyQueries', 'getDocumentQueries'],
    mutations: ['login', 'register', 'createDocumentFromYoutube', 'createDocumentFromPdf', 'updateDocument', 'deleteDocument', 'askQuestion'],
  },
  teacher: {
    queries: ['me', 'getDocument', 'getMyDocuments', 'getPublicDocuments', 'searchDocuments', 'getMyQueries', 'getDocumentQueries'],
    mutations: ['login', 'register', 'createDocumentFromYoutube', 'createDocumentFromPdf', 'updateDocument', 'deleteDocument', 'askQuestion'],
  },
  admin: {
    queries: ['me', 'getUser', 'getDocument', 'getMyDocuments', 'getPublicDocuments', 'searchDocuments', 'getMyQueries', 'getDocumentQueries'],
    mutations: ['login', 'register', 'createDocumentFromYoutube', 'createDocumentFromPdf', 'updateDocument', 'deleteDocument', 'askQuestion'],
  },
};

const applyRbacRules = async (context, document) => {
  // Skip RBAC for login and register operations
  const operation = getOperationAST(document);
  const operationName = operation?.name?.value;
  
  if (operationName === 'Login' || operationName === 'Register') {
    return;
  }
  
  const { user } = context;
  
  // No user, only allow login and register
  if (!user) {
    throw new ForbiddenError('You must be logged in!');
  }
  
  // Get user role permissions
  const rolePermissions = permissions[user.role];
  if (!rolePermissions) {
    throw new ForbiddenError('Invalid user role');
  }
  
  // Check if user has permission for this operation
  // More complex logic could be implemented here to check specific fields, etc.
  
  // For now, we just check if the operation type is allowed for the user's role
  // A real implementation would parse the GraphQL operations and check each field
};

module.exports = { applyRbacRules };