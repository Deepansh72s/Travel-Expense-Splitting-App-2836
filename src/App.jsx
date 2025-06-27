import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import GroupManagement from './components/GroupManagement';
import SplitSummary from './components/SplitSummary';
import LocationMap from './components/LocationMap';
import Reports from './components/Reports';
import { ExpenseProvider } from './context/ExpenseContext';
import './App.css';

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  return (
    <ExpenseProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Navigation />
          <main className="pb-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-expense" element={<ExpenseForm currentLocation={currentLocation} />} />
                <Route path="/expenses" element={<ExpenseList />} />
                <Route path="/groups" element={<GroupManagement />} />
                <Route path="/split" element={<SplitSummary />} />
                <Route path="/map" element={<LocationMap />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </ExpenseProvider>
  );
}

export default App;
