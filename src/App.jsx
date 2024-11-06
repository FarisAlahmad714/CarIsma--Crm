// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AcceptInvite from './features/auth/AcceptInvite';
import Dashboard from './features/dashboard/Dashboard';
import Leads from './features/leads/Leads';
import Inventory from './features/inventory/Inventory';
import Calendar from './features/calendar/Calendar';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accept-invite/:token" element={<AcceptInvite />} />
            
            {/* Protected routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;