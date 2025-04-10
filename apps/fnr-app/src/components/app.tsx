import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
} from 'react-router-dom';
import { Toaster } from '@react-monorepo/shared';
import { UserProvider } from './providers/UserContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AuthRoute } from './auth/AuthRoute';
import { Header } from './app-shell/Header';
import { Sidebar } from './app-shell/Sidebar';
import { ThinSidebar } from './app-shell/ThinSidebar';
import { AdminSidebar } from './app-shell/AdminSidebar';
import { useIsAdminRoute } from '../hooks/useIsAdminRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { LogoutPage } from '../pages/LogoutPage';
import { AssignedPage } from '../pages/AssignedPage';
import { SettingsPage } from '../pages/SettingsPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ClaimPage } from '../pages/ClaimPage';
import { CreateClaimPage } from '../pages/CreateClaimPage';
import { StaffProfilePage } from '../pages/StaffProfilePage';
import { SupplierProfilePage } from '../pages/SupplierProfilePage';
import { HistoryPage } from '../pages/HistoryPage';
import { AdminPortalPage } from '../pages/AdminPortalPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminCustomersPage } from '../pages/AdminCustomersPage';
import { AdminSuppliersPage } from '../pages/AdminSuppliersPage';
import { AdminAnalyticsPage } from '../pages/AdminAnalyticsPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { ROUTES } from '../routes';
import KeyboardShortcutsPopup from './ui/KeyboardShortcutsPopup';

// Inner component that has access to router context
const AppContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Handle keyboard events at the root level
  const handleKeyDown = (event: KeyboardEvent) => {
    console.log(
      'Key event in App:',
      event.key,
      'Active element:',
      document.activeElement?.tagName
    );

    // Only handle ? key if not in an input/textarea
    if (
      event.key === '?' &&
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement)
    ) {
      console.log('Question mark detected, showing shortcuts');
      event.preventDefault();
      event.stopPropagation();
      setIsShortcutsOpen(true);
    }
  };

  useEffect(() => {
    console.log('Setting up keyboard shortcuts');
    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    console.log('Keyboard handler attached');

    return () => {
      console.log('Cleaning up keyboard handler');
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []); // Empty dependency array since handleKeyDown uses no props/state

  return (
    <>
      <Toaster />
      <Routes>
        {/* Auth routes - redirect to home if already logged in */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path={ROUTES.SIGN_UP}
          element={
            <AuthRoute>
              <SignUpPage />
            </AuthRoute>
          }
        />
        <Route path={ROUTES.LOGOUT} element={<LogoutPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <div
                className="flex flex-col h-screen"
                onClick={(e) => e.stopPropagation()}
              >
                <Header
                  onToggleSidebar={handleToggleSidebar}
                  setIsShortcutsOpen={setIsShortcutsOpen}
                  isSidebarExpanded={!isSidebarCollapsed}
                />
                <div className="flex flex-1">
                  {isAdminRoute ? (
                    <AdminSidebar />
                  ) : isSidebarCollapsed ? (
                    <ThinSidebar />
                  ) : (
                    <Sidebar />
                  )}
                  <Outlet />
                </div>
                <KeyboardShortcutsPopup
                  isOpen={isShortcutsOpen}
                  onClose={() => setIsShortcutsOpen(false)}
                />
              </div>
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ASSIGNED} element={<AssignedPage />} />
          <Route path={ROUTES.SETTINGS + '/*'} element={<SettingsPage />} />
          <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
          <Route path={ROUTES.STAFF} element={<StaffProfilePage />} />
          <Route path={ROUTES.SUPPLIER} element={<SupplierProfilePage />} />
          <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
          <Route path={ROUTES.CLAIM} element={<ClaimPage />} />
          <Route path={ROUTES.CREATE_CLAIM} element={<CreateClaimPage />} />
          {/* Admin routes */}
          <Route path={ROUTES.ADMIN_PORTAL} element={<AdminPortalPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
          <Route
            path={ROUTES.ADMIN_CUSTOMERS}
            element={<AdminCustomersPage />}
          />
          <Route
            path={ROUTES.ADMIN_SUPPLIERS}
            element={<AdminSuppliersPage />}
          />
          <Route
            path={ROUTES.ADMIN_ANALYTICS}
            element={<AdminAnalyticsPage />}
          />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
};

// Wrapper component that provides router context
export function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
