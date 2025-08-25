import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CompleteProfile from './pages/CompleteProfile';
import Requirements from './pages/Requirements';
import AddRequirement from './pages/AddRequirement';
import ViewRequirement from './pages/ViewRequirement';
import Catalog from './pages/Catalog';
import AddCatalog from './pages/AddCatalog';
import Quotes from './pages/Quotes';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import DeleteAccount from './pages/DeleteAccount';
import Chat from './pages/Chat';
import Invoice from './pages/Invoice';
import SubmitQuote from './pages/SubmitQuote';
import PublicProfile from './pages/PublicProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <ProfileProvider>
            <Router>
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              
              <Route element={<PrivateRoute />}>
                {/* Profile completion route - doesn't require profile to be complete */}
                <Route path="/complete-profile" element={<CompleteProfile />} />
                
                {/* Protected routes that require profile completion */}
                <Route element={<Layout />}>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/requirements" element={
                  <ProtectedRoute>
                    <Requirements />
                  </ProtectedRoute>
                } />
                <Route path="/requirements/add" element={
                  <ProtectedRoute>
                    <AddRequirement />
                  </ProtectedRoute>
                } />
                <Route path="/requirements/:id" element={
                  <ProtectedRoute>
                    <ViewRequirement />
                  </ProtectedRoute>
                } />
                <Route path="/catalog" element={
                  <ProtectedRoute>
                    <Catalog />
                  </ProtectedRoute>
                } />
                <Route path="/catalog/add" element={
                  <ProtectedRoute>
                    <AddCatalog />
                  </ProtectedRoute>
                } />
                <Route path="/quotes" element={
                  <ProtectedRoute>
                    <Quotes />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                <Route path="/invoice/:id" element={
                  <ProtectedRoute>
                    <Invoice />
                  </ProtectedRoute>
                } />
                <Route path="/requirements/:requirementId/quote" element={
                  <ProtectedRoute>
                    <SubmitQuote />
                  </ProtectedRoute>
                } />
                <Route path="/profile/public/:userId" element={
                  <ProtectedRoute>
                    <PublicProfile />
                  </ProtectedRoute>
                } />
                <Route path="/delete-account" element={
                  <ProtectedRoute>
                    <DeleteAccount />
                  </ProtectedRoute>
                } />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ProfileProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App
