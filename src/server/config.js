// config.js - Base URL Configuration
const config = {
  BASE_URL: 'https://i-mgmt-official.com/backend',
  API_ENDPOINTS: {
    LOGIN: '/auth/authHandler.php?action=login',
    LOGOUT: '/auth/authHandler.php?action=logout',
    // Add other endpoints as needed
  }
};

export default config;