// App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from "./components/context/authcontext";
import { ThemeProvider } from './contexts/ThemeContext'; 
import AppLayout from './layouts/AppLayout';
import './App.css';
import './theme.css'; 

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <AppLayout />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;