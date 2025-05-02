// src/graphql/client.js
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create HTTP link
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL || 'http://localhost:4010/graphql',
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      
      // Handle authentication errors
      if (message === 'Not authenticated' || message === 'You must be logged in!') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Auth link (adds token to requests)
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Return headers
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;