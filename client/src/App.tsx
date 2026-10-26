import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoSwitcher } from './components/DemoSwitcher';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { FindHelp } from './pages/FindHelp';
import { MyListings } from './pages/MyListings';
import { Bookings } from './pages/Bookings';
import { Wallet } from './pages/Wallet';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { CommunityEvents } from './pages/CommunityEvents';
import { AiAssistant } from './pages/AiAssistant';
import { Admin } from './pages/Admin';
import { RedeemCredits } from './pages/RedeemCredits';
import { CommunityPoolPage } from './pages/CommunityPool';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Footer } from './components/Footer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#111111]/70 dark:text-[#FAF8F3]/70">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#111111]/70 dark:text-[#FAF8F3]/70">
        Loading session...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppLayout: React.FC = () => {
  const { user, refreshUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC] dark:bg-[#101010] text-[#111111] text-sm font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#111111] border-t-[#FFD21C] rounded-full animate-spin"></div>
          <span className="font-serif text-base tracking-wide">Loading Community TimeBank AI...</span>
        </div>
      </div>
    );
  }

  const isPublicPage = location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/terms' || location.pathname === '/privacy';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC] dark:bg-[#101010] text-[#111111] dark:text-[#E5E0D8] font-sans selection:bg-[#FFD21C] selection:text-black transition-colors duration-200">
      {/* Top Demo Switcher Toolbar */}
      <DemoSwitcher />

      {isPublicPage || !user ? (
        /* Public Page Layout */
        <>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </>
      ) : (
        /* Authenticated Workspace with Left Sidebar & Top Header */
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <TopHeader />
            <main className="flex-1 bg-[#F7F4EC] dark:bg-[#101010]">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/find-help" element={<ProtectedRoute><FindHelp /></ProtectedRoute>} />
                <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                <Route path="/redeem" element={<ProtectedRoute><RedeemCredits user={user} onUserUpdate={refreshUser} /></ProtectedRoute>} />
                <Route path="/community-pool" element={<ProtectedRoute><CommunityPoolPage user={user} onUserUpdate={refreshUser} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityEvents /></ProtectedRoute>} />
                <Route path="/community-events" element={<ProtectedRoute><CommunityEvents /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
