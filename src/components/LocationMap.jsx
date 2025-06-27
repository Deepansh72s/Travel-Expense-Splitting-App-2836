import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiMapPin, FiDollarSign, FiCalendar, FiFilter } = FiIcons;

const LocationMap = () => {
  const { state } = useExpenses();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  const expensesWithLocation = state.expenses.filter(expense => expense.location);
  
  const filteredExpenses = expensesWithLocation.filter(expense =>
    filterCategory === '' || expense.category === filterCategory
  );

  const locationGroups = filteredExpenses.reduce((acc, expense) => {
    const locationKey = expense.location.address;
    if (!acc[locationKey]) {
      acc[locationKey] = {
        location: expense.location,
        expenses: [],
        totalAmount: 0
      };
    }
    acc[locationKey].expenses.push(expense);
    acc[locationKey].totalAmount += expense.amount;
    return acc;
  }, {});

  const locations = Object.values(locationGroups);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Expense Locations</h1>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {state.categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Map Placeholder */}
      <div className="mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center">
        <SafeIcon icon={FiMapPin} className="text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-700 font-medium">Interactive Map</p>
        <p className="text-sm text-gray-600 mt-1">
          Map integration would show expense locations here
        </p>
      </div>

      {/* Location List */}
      <div className="space-y-4">
        {locations.length > 0 ? (
          locations.map((locationGroup, index) => (
            <motion.div
              key={locationGroup.location.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedLocation(
                  selectedLocation === locationGroup.location.address 
                    ? null 
                    : locationGroup.location.address
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <SafeIcon icon={FiMapPin} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {locationGroup.location.address}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>{locationGroup.expenses.length} expenses</span>
                        <span className="mx-2">•</span>
                        <span>${locationGroup.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ${locationGroup.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {selectedLocation === locationGroup.location.address && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 bg-gray-50"
                >
                  <div className="p-4 space-y-3">
                    {locationGroup.expenses.map((expense) => (
                      <div key={expense.id} className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{expense.description}</h4>
                          <span className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <SafeIcon icon={FiFilter} className="mr-1" />
                            {expense.category}
                          </div>
                          <div className="flex items-center">
                            <SafeIcon icon={FiCalendar} className="mr-1" />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiMapPin} className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No location data available</p>
            <p className="text-sm text-gray-400 mt-1">
              {filterCategory ? 'No expenses with location for this category' : 'Add expenses with location to see them on the map'}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {locations.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-600">
              Total at {locations.length} locations
            </span>
            <span className="text-lg font-semibold text-blue-900">
              ${locations.reduce((sum, loc) => sum + loc.totalAmount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LocationMap;