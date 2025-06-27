import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiBarChart3, FiPieChart, FiTrendingUp, FiCalendar, FiDollarSign, FiMapPin } = FiIcons;

const Reports = () => {
  const { state } = useExpenses();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  const getCurrentPeriodExpenses = () => {
    const now = new Date();
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expenseDate >= weekAgo;
        case 'month':
          return expenseDate.getMonth() === now.getMonth() && 
                 expenseDate.getFullYear() === now.getFullYear();
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const currentExpenses = getCurrentPeriodExpenses();
  const totalAmount = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryBreakdown = currentExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const dailyExpenses = currentExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {});

  const locationBreakdown = currentExpenses
    .filter(expense => expense.location)
    .reduce((acc, expense) => {
      const location = expense.location.address;
      acc[location] = (acc[location] || 0) + expense.amount;
      return acc;
    }, {});

  const topLocations = Object.entries(locationBreakdown)
    .map(([location, amount]) => ({ location, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const averageDaily = totalAmount / Math.max(Object.keys(dailyExpenses).length, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['week', 'month', 'year'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <SafeIcon icon={FiDollarSign} className="text-blue-600 text-xl mb-2" />
          <p className="text-2xl font-bold text-blue-900">${totalAmount.toFixed(2)}</p>
          <p className="text-sm text-blue-600">Total Spent</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <SafeIcon icon={FiTrendingUp} className="text-green-600 text-xl mb-2" />
          <p className="text-2xl font-bold text-green-900">${averageDaily.toFixed(2)}</p>
          <p className="text-sm text-green-600">Daily Average</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <SafeIcon icon={FiBarChart3} className="text-purple-600 text-xl mb-2" />
          <p className="text-2xl font-bold text-purple-900">{currentExpenses.length}</p>
          <p className="text-sm text-purple-600">Transactions</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <SafeIcon icon={FiMapPin} className="text-orange-600 text-xl mb-2" />
          <p className="text-2xl font-bold text-orange-900">{topLocations.length}</p>
          <p className="text-sm text-orange-600">Locations</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
        <div className="space-y-3">
          {categoryData.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{item.category}</span>
                <span className="text-gray-900 font-semibold">${item.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      {topLocations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Locations</h2>
          <div className="space-y-3">
            {topLocations.map((item, index) => (
              <motion.div
                key={item.location}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={FiMapPin} className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.location}</p>
                    </div>
                  </div>
                  <span className="text-gray-900 font-semibold">${item.amount.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Spending Chart */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Spending Trend</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="space-y-2">
            {Object.entries(dailyExpenses)
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .slice(-7)
              .map(([date, amount], index) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{date}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(amount / Math.max(...Object.values(dailyExpenses))) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-green-600 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {currentExpenses.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiBarChart3} className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No data for selected period</p>
          <p className="text-sm text-gray-400 mt-1">Add some expenses to see analytics</p>
        </div>
      )}
    </motion.div>
  );
};

export default Reports;