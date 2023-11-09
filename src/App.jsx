import React from 'react';
import './styles/App.css';
import Router from './router';
import { AuthContextProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
};

export default App;
