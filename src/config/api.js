
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("Base URL from .env:", BASE_URL);

const isDevelopment = import.meta.env.MODE === 'development';

const config = {
  development: {
    serverUrl: 'http://localhost:3001',
    apiPaths: {
      base: '/api',
      adminAlumni: '/admin/alumni',
      adminSignup: '/auth/admin/signup',
      adminLogin: '/auth/admin/login',
      adminVerify: '/auth/admin/verify'
    }
  },
  production: {
    serverUrl: 'https://kw-backend.onrender.com',
    apiPaths: {
      base: '/api',
      adminAlumni: '/admin/alumni',
      adminSignup: '/auth/admin/signup',
      adminLogin: '/auth/admin/login',
      adminVerify: '/auth/admin/verify'
    }
  }
};

const environment = config[isDevelopment ? 'development' : 'production'];

export const getApiUrl = (endpoint) => {
  return `${environment.serverUrl}${environment.apiPaths.base}${environment.apiPaths[endpoint]}`;
};

export default environment; 