import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    // Check saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');

    // Default theme = dark
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          📝 QuickNotes
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-9">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium transition-all duration-200 ${
                isActive
                  ? 'underline text-yellow-500'
                  : 'text-gray-800 dark:text-gray-300 hover:text-yellow-500'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pastes"
            className={({ isActive }) =>
              `font-medium transition-all duration-200 ${
                isActive
                  ? 'underline text-yellow-500'
                  : 'text-gray-800 dark:text-gray-300 hover:text-yellow-500'
              }`
            }
          >
            Pastes
          </NavLink>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="relative w-16 h-8 flex items-center rounded-full bg-gray-300 dark:bg-yellow-500 transition-all duration-300 px-1"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-300 flex items-center justify-center text-sm ${
                darkMode ? 'translate-x-8' : 'translate-x-0'
              }`}
            >
              {darkMode ? '🌙' : '☀️'}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;