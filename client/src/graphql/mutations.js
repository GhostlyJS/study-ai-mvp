// src/graphql/mutations.js
import { gql } from '@apollo/client';

// Auth mutations
export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!, $role: String) {
    register(email: $email, password: $password, firstName: $firstName, lastName: $lastName, role: $role) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

// Document mutations
export const CREATE_DOCUMENT_FROM_YOUTUBE = gql`
  mutation CreateDocumentFromYoutube($title: String!, $youtubeUrl: String!, $isPublic: Boolean) {
    createDocumentFromYoutube(title: $title, youtubeUrl: $youtubeUrl, isPublic: $isPublic) {
      id
      title
      type
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

export const CREATE_DOCUMENT_FROM_PDF = gql`
  mutation CreateDocumentFromPdf($title: String!, $filePath: String!, $isPublic: Boolean) {
    createDocumentFromPdf(title: $title, filePath: $filePath, isPublic: $isPublic) {
      id
      title
      type
      filePath
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

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($id: ID!, $title: String, $isPublic: Boolean) {
    updateDocument(id: $id, title: $title, isPublic: $isPublic) {
      id
      title
      isPublic
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;

// AI Query mutations
export const ASK_QUESTION = gql`
  mutation AskQuestion($documentId: ID!, $question: String!) {
    askQuestion(documentId: $documentId, question: $question) {
      answer
    }
  }
`;