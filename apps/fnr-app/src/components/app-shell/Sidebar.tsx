import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-200 w-64 h-screen p-4">
      <nav>
        <ul>
          <li><a href="#" className="text-blue-600 hover:underline">Home</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">About</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Contact</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
