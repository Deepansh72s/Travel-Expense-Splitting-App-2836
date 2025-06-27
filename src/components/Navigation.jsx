import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiPlus, FiList, FiUsers, FiPieChart, FiMap, FiBarChart3 } = FiIcons;

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/add-expense', icon: FiPlus, label: 'Add' },
    { path: '/expenses', icon: FiList, label: 'Expenses' },
    { path: '/groups', icon: FiUsers, label: 'Groups' },
    { path: '/split', icon: FiPieChart, label: 'Split' },
    { path: '/map', icon: FiMap, label: 'Map' },
    { path: '/reports', icon: FiBarChart3, label: 'Reports' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-2 px-3 relative"
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-blue-50 rounded-lg"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <SafeIcon 
                  icon={item.icon} 
                  className={`text-xl mb-1 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} 
                />
                <span className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;