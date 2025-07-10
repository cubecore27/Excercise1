import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql", // 👈 your Django GraphQL endpoint
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>,
)
