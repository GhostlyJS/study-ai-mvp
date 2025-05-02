// src/graphql/queries.js
import { gql } from '@apollo/client';

// User queries
export const GET_ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
      createdAt
    }
  }
`;

// Document queries
export const GET_DOCUMENT = gql`
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      title
      type
      filePath
      youtubeUrl
      content
      isPublic
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_MY_DOCUMENTS = gql`
  query GetMyDocuments {
    getMyDocuments {
      id
      title
      type
      filePath
      youtubeUrl
      isPublic
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_PUBLIC_DOCUMENTS = gql`
  query GetPublicDocuments {
    getPublicDocuments {
      id
      title
      type
      filePath
      youtubeUrl
      isPublic
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export const SEARCH_DOCUMENTS = gql`
  query SearchDocuments($searchTerm: String!) {
    searchDocuments(searchTerm: $searchTerm) {
      id
      title
      type
      filePath
      youtubeUrl
      isPublic
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

// Query history
export const GET_MY_QUERIES = gql`
  query GetMyQueries {
    getMyQueries {
      id
      question
      answer
      createdAt
      document {
        id
        title
      }
    }
  }
`;

export const GET_DOCUMENT_QUERIES = gql`
  query GetDocumentQueries($documentId: ID!) {
    getDocumentQueries(documentId: $documentId) {
      id
      question
      answer
      createdAt
    }
  }
`;