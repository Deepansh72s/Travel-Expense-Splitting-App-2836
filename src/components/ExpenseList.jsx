import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiSearch, FiFilter, FiMapPin, FiCalendar, FiDollarSign, FiUser, FiMoreVertical, FiEdit2, FiTrash2 } = FiIcons;

const ExpenseList = () => {
  const { state, dispatch } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredExpenses = state.expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || expense.category === filterCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Expenses</h1>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {state.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-600">Total ({filteredExpenses.length} expenses)</span>
            <span className="text-lg font-semibold text-blue-900">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{expense.description}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <SafeIcon icon={FiFilter} className="mr-1" />
                      {expense.category}
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="mr-1" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>

                  {expense.paidBy && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <SafeIcon icon={FiUser} className="mr-1" />
                      Paid by {expense.paidBy}
                    </div>
                  )}

                  {expense.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <SafeIcon icon={FiMapPin} className="mr-1" />
                      {expense.location.address}
                    </div>
                  )}

                  {expense.notes && (
                    <p className="text-sm text-gray-600 italic">{expense.notes}</p>
                  )}

                  {expense.receipt && (
                    <div className="mt-2">
                      <img
                        src={expense.receipt}
                        alt="Receipt"
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiDollarSign} className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No expenses found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filterCategory ? 'Try adjusting your filters' : 'Add your first expense to get started'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExpenseList;