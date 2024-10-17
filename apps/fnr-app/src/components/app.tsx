import React from 'react';
import { Header } from './app-shell/Header';
import { Sidebar } from './app-shell/Sidebar';
import { MainContents } from './MainContents';

export function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContents />
      </div>
    </div>
  );
}

export default App;
