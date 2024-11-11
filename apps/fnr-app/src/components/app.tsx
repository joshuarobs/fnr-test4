import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './app-shell/Header';
import { Sidebar } from './app-shell/Sidebar';
import { ThinSidebar } from './app-shell/ThinSidebar';
import { MainContents } from './MainContents';
import { HomePage } from '../pages/HomePage';
import { AssignedPage } from '../pages/AssignedPage';
import { SettingsPage } from '../pages/SettingsPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '[') {
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Header onToggleSidebar={handleToggleSidebar} />
        <div className="flex flex-1">
          {isSidebarCollapsed ? <ThinSidebar /> : <Sidebar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assigned" element={<AssignedPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/claim/:id" element={<MainContents />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
