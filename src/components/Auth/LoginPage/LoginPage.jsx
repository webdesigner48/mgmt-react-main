import React, { useState, useEffect } from 'react';
import { useAuth } from './../../context/authcontext';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setError(result.message || 'Ungültige E-Mail oder Passwort');
      }
      // If successful, the AuthContext will handle the redirect/state change
    } catch (error) {
      console.error('Login error:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return formData.email && 
           formData.password && 
           validateEmail(formData.email) && 
           formData.password.length >= 6;
  };

  return (
    <div className={`login-page ${isVisible ? 'visible' : ''}`}>
      <div className="login-container">
        <div className="login-header">
          <h1>I Management</h1>
          <p>Willkommen zurück</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail Adresse</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="ihre.email@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
            {formData.email && !validateEmail(formData.email) && (
              <span className="field-error">Bitte geben Sie eine gültige E-Mail ein</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••••"
              disabled={isLoading}
              autoComplete="current-password"
              minLength="6"
            />
            {formData.password && formData.password.length < 6 && (
              <span className="field-error">Passwort muss mindestens 6 Zeichen haben</span>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`login-button ${!isFormValid() ? 'disabled' : ''}`}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <span className="loading-container">
                <span className="loading-spinner"></span>
                Anmeldung läuft...
              </span>
            ) : (
              'Anmelden'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="forgot-password">
            <a href="#forgot" onClick={(e) => {
              e.preventDefault();
              // Handle forgot password logic here
              alert('Forgot password functionality can be implemented here');
            }}>
              Passwort vergessen?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
