
import React from 'react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center">
      <div 
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => onNavigate('home')}
      >
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">CMRIT Smart Campus</h1>
          <p className="text-xs text-gray-500 font-medium">AI-OPTIMIZED RESOURCE HUB</p>
        </div>
      </div>
      
      <div className="hidden md:flex space-x-6">
        {['Home', 'Canteen', 'Library', 'Admin', 'Exams'].map((tab) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab.toLowerCase())}
            className={`text-sm font-semibold transition-colors duration-200 ${
              activeTab === tab.toLowerCase() ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : 'text-gray-500 hover:text-teal-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-teal-500">
          <img src="https://picsum.photos/100/100" alt="Avatar" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
