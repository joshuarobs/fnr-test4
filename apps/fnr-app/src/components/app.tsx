import React from 'react';
import { Header } from './app-shell/Header';
import { Sidebar } from './app-shell/Sidebar';
import { SecondSidebar } from './app-shell/SecondSidebar';
import { MainContents } from './MainContents';

export function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContents />
        <SecondSidebar />
      </div>
    </div>
  );
}

export default App;
