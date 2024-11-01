import React, { useState, useEffect } from 'react';
import { Header } from './app-shell/Header';
import { Sidebar } from './app-shell/Sidebar';
import { ThinSidebar } from './app-shell/ThinSidebar';
import { SecondSidebar } from './app-shell/SecondSidebar';
import { MainContents } from './MainContents';

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
    <div className="flex flex-col h-screen">
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1">
        {isSidebarCollapsed ? <ThinSidebar /> : <Sidebar />}
        <MainContents />
        <SecondSidebar />
      </div>
    </div>
  );
}

export default App;
