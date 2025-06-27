import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiDollarSign, FiUsers, FiMapPin, FiTrendingUp, FiPlus, FiCreditCard } = FiIcons;

const Dashboard = () => {
  const { state } = useExpenses();
  const { expenses, groups, members } = state;

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recentExpenses = expenses.slice(-5).reverse();

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Active Groups',
      value: groups.length,
      icon: FiUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Locations',
      value: new Set(expenses.map(e => e.location?.address)).size,
      icon: FiMapPin,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'This Month',
      value: `$${expenses
        .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
        .reduce((sum, e) => sum + e.amount, 0)
        .toFixed(2)}`,
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Expenses</h1>
        <p className="text-gray-600">Track and split your travel costs</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} p-4 rounded-xl`}
          >
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={stat.icon} className={`text-xl ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
          <Link
            to="/expenses"
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{expense.description}</h3>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                    {expense.location && (
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <SafeIcon icon={FiMapPin} className="mr-1" />
                        {expense.location.address}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiCreditCard} className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No expenses yet</p>
            <Link
              to="/add-expense"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="mr-2" />
              Add First Expense
            </Link>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white"
      >
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/add-expense"
            className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center hover:bg-white/30 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="text-xl mx-auto mb-1" />
            <p className="text-sm">Add Expense</p>
          </Link>
          <Link
            to="/split"
            className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center hover:bg-white/30 transition-colors"
          >
            <SafeIcon icon={FiUsers} className="text-xl mx-auto mb-1" />
            <p className="text-sm">Split Bills</p>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;