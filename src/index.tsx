import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { CLERK_FRONTEND_API } from './config';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ClerkProvider publishableKey="pk_test_cGVhY2VmdWwtZ29zaGF3ay05My5jbGVyay5hY2NvdW50cy5kZXYk">
    <App />
  </ClerkProvider>
);
