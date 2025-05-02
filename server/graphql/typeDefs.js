// graphql/typeDefs.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Document {
    id: ID!
    title: String!
    type: String!
    filePath: String
    youtubeUrl: String
    content: String!
    owner: User!
    isPublic: Boolean!
    createdAt: String!
  }

  type QuestionAnswer {
    id: ID!
    question: String!
    answer: String!
    document: Document!
    user: User!
    createdAt: String!
  }

  type AIResponse {
    answer: String!
  }

  # Queries
  type RootQuery {
    # User queries
    me: User
    getUser(id: ID!): User
    
    # Document queries
    getDocument(id: ID!): Document
    getMyDocuments: [Document!]!
    getPublicDocuments: [Document!]!
    searchDocuments(searchTerm: String!): [Document!]!
    
    # Query history
    getMyQueries: [QuestionAnswer!]!
    getDocumentQueries(documentId: ID!): [QuestionAnswer!]!
  }

  # Mutations
  type Mutation {
    # Auth mutations
    register(
      email: String!, 
      password: String!, 
      firstName: String!, 
      lastName: String!,
      role: String
    ): AuthPayload!
    
    login(email: String!, password: String!): AuthPayload!
    
    # Document mutations
    createDocumentFromYoutube(
      title: String!, 
      youtubeUrl: String!, 
      isPublic: Boolean
    ): Document!
    
    createDocumentFromPdf(
      title: String!, 
      filePath: String!, 
      isPublic: Boolean
    ): Document!
    
    updateDocument(
      id: ID!, 
      title: String, 
      isPublic: Boolean
    ): Document!
    
    deleteDocument(id: ID!): Boolean!
    
    # AI Query mutations
    askQuestion(
      documentId: ID!, 
      question: String!
    ): AIResponse!
  }

  schema {
    query: RootQuery
    mutation: Mutation
  }
`;

module.exports = typeDefs;