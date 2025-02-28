import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/AdminGuard';
import GlobalStyles from './styles/GlobalStyles';

const theme = {
  colors: {
    primary: '#6c63ff',
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    error: '#ff6b6b',
    success: '#4CAF50'
  },
  shadows: {
    main: '0 8px 32px rgba(0, 0, 0, 0.3)'
  }
};

const ProtectedRoute = ({ children }) => (
  <AdminGuard>
    {children}
  </AdminGuard>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('adminToken'));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* Protected Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirect root to dashboard if logged in, otherwise to login */}
          <Route 
            path="/admin" 
            element={isAuthenticated ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <Navigate to="/admin/login" replace />
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

