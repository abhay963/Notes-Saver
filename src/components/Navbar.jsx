import React from 'react';
import { NavLink } from 'react-router-dom';


const Navbar = () => {


 

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">📝 QuickNotes</div>

        <div className="flex items-center gap-9">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium ${
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
              `font-medium ${
                isActive
                  ? 'underline text-yellow-500'
                  : 'text-gray-800 dark:text-gray-300 hover:text-yellow-500'
              }`
            }
          >
            Pastes
          </NavLink>

         

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
