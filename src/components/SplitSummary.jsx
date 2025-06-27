import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiPieChart, FiUsers, FiDollarSign, FiArrowRight, FiArrowLeft, FiCheck } = FiIcons;

const SplitSummary = () => {
  const { state } = useExpenses();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitMethod, setSplitMethod] = useState('equal');

  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByPayer = state.expenses.reduce((acc, expense) => {
    if (expense.paidBy) {
      acc[expense.paidBy] = (acc[expense.paidBy] || 0) + expense.amount;
    }
    return acc;
  }, {});

  const calculateSplits = () => {
    if (selectedMembers.length === 0) return {};
    
    const splits = {};
    const sharePerPerson = totalExpenses / selectedMembers.length;
    
    selectedMembers.forEach(member => {
      const paid = expensesByPayer[member] || 0;
      const owes = sharePerPerson - paid;
      splits[member] = {
        paid,
        owes,
        share: sharePerPerson
      };
    });
    
    return splits;
  };

  const getSettlements = () => {
    const splits = calculateSplits();
    const settlements = [];
    
    const creditors = Object.entries(splits)
      .filter(([_, data]) => data.owes < 0)
      .map(([name, data]) => ({ name, amount: Math.abs(data.owes) }))
      .sort((a, b) => b.amount - a.amount);
    
    const debtors = Object.entries(splits)
      .filter(([_, data]) => data.owes > 0)
      .map(([name, data]) => ({ name, amount: data.owes }))
      .sort((a, b) => b.amount - a.amount);
    
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const amount = Math.min(creditor.amount, debtor.amount);
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount
        });
      }
      
      creditor.amount -= amount;
      debtor.amount -= amount;
      
      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }
    
    return settlements;
  };

  const splits = calculateSplits();
  const settlements = getSettlements();
  const availableMembers = [...new Set([
    ...state.members.map(m => m.name),
    ...Object.keys(expensesByPayer)
  ])].filter(name => name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Split Summary</h1>

      {/* Member Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Members</h2>
        <div className="space-y-2">
          {availableMembers.map(member => (
            <label key={member} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers([...selectedMembers, member]);
                  } else {
                    setSelectedMembers(selectedMembers.filter(m => m !== member));
                  }
                }}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">{member}</span>
                <span className="text-sm text-gray-600 ml-2">
                  Paid: ${(expensesByPayer[member] || 0).toFixed(2)}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {selectedMembers.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiDollarSign} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">${totalExpenses.toFixed(2)}</p>
              <p className="text-sm text-blue-600">Total Expenses</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiUsers} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">{selectedMembers.length}</p>
              <p className="text-sm text-green-600">Selected Members</p>
            </div>
          </div>

          {/* Individual Splits */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Individual Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(splits).map(([member, data]) => (
                <div key={member} className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{member}</h3>
                    <span className={`text-lg font-semibold ${
                      data.owes > 0 ? 'text-red-600' : data.owes < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {data.owes > 0 ? `Owes $${data.owes.toFixed(2)}` : 
                       data.owes < 0 ? `Gets $${Math.abs(data.owes).toFixed(2)}` : 
                       'Settled'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Paid</p>
                      <p>${data.paid.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Share</p>
                      <p>${data.share.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Balance</p>
                      <p className={data.owes > 0 ? 'text-red-600' : data.owes < 0 ? 'text-green-600' : 'text-gray-600'}>
                        ${Math.abs(data.owes).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settlements */}
          {settlements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended Settlements</h2>
              <div className="space-y-3">
                {settlements.map((settlement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <SafeIcon icon={FiArrowRight} className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {settlement.from} → {settlement.to}
                          </p>
                          <p className="text-sm text-gray-600">Settlement payment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${settlement.amount.toFixed(2)}
                        </p>
                        <button className="text-xs text-blue-600 hover:text-blue-700">
                          Mark as paid
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {settlements.length === 0 && (
            <div className="text-center py-8">
              <SafeIcon icon={FiCheck} className="text-4xl text-green-400 mx-auto mb-4" />
              <p className="text-green-600 font-medium">All settled!</p>
              <p className="text-sm text-gray-600">No payments needed between selected members</p>
            </div>
          )}
        </>
      )}

      {selectedMembers.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiPieChart} className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select members to see split summary</p>
          <p className="text-sm text-gray-400 mt-1">Choose who participated in the expenses</p>
        </div>
      )}
    </motion.div>
  );
};

export default SplitSummary;