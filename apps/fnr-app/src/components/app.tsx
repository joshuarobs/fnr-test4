import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@react-monorepo/shared';
import { Header } from './app-shell/Header';
import { Sidebar } from './app-shell/Sidebar';
import { ThinSidebar } from './app-shell/ThinSidebar';
import { HomePage } from '../pages/HomePage';
import { AssignedPage } from '../pages/AssignedPage';
import { SettingsPage } from '../pages/SettingsPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ClaimPage } from '../pages/ClaimPage';
import { CreateClaimPage } from '../pages/CreateClaimPage';
import { ROUTES } from '../routes';
import KeyboardShortcutsPopup from './ui/KeyboardShortcutsPopup';

export function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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
    <BrowserRouter>
      <Toaster />
      <div className="flex flex-col h-screen">
        <Header
          onToggleSidebar={handleToggleSidebar}
          setIsShortcutsOpen={setIsShortcutsOpen}
          isSidebarExpanded={!isSidebarCollapsed}
        />
        <div className="flex flex-1">
          {isSidebarCollapsed ? <ThinSidebar /> : <Sidebar />}
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.ASSIGNED} element={<AssignedPage />} />
            <Route path={ROUTES.SETTINGS + '/*'} element={<SettingsPage />} />
            <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
            <Route path={ROUTES.CLAIM} element={<ClaimPage />} />
            <Route path={ROUTES.CREATE_CLAIM} element={<CreateClaimPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <KeyboardShortcutsPopup
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
