import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';        
import AuditLog from './pages/AuditLog'; 
import ProtectedRoute from "./pages/ProtectedRoute";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
         <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>} />
       <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
        }/>         
      <Route path="/audit-log" element={
        <ProtectedRoute>
          <AuditLog />
        </ProtectedRoute>
      } />      
    </Routes>
  );
}
