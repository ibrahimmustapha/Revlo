import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Offers from './pages/Offers';
import Trades from './pages/Trades';
import PaymentMethods from './pages/PaymentMethods';
import Kyc from './pages/Kyc';
import Profile from './pages/Profile';
import Disputes from './pages/Disputes';
import Ratings from './pages/Ratings';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import { RequireAuth } from './hooks/useRequireAuth';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/offers" replace />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/kyc" element={<Kyc />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/disputes" element={<Disputes />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/ratings" element={<Ratings />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </Layout>
          </RequireAuth>
        }
      />
      {!token && <Route path="*" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
}
