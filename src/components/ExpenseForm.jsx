import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiDollarSign, FiMapPin, FiCamera, FiSave, FiX, FiUsers } = FiIcons;

const ExpenseForm = ({ currentLocation }) => {
  const navigate = useNavigate();
  const { state, dispatch } = useExpenses();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: '',
    splitWith: [],
    location: null,
    receipt: null,
    notes: ''
  });
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (currentLocation) {
      getLocationName(currentLocation);
    }
  }, [currentLocation]);

  const getLocationName = async (coords) => {
    setLocationLoading(true);
    try {
      // Using a mock location service - in real app, use Google Maps API
      const mockLocation = {
        address: "Sample Location, City, Country",
        lat: coords.lat,
        lng: coords.lng
      };
      setFormData(prev => ({ ...prev, location: mockLocation }));
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const expense = {
      ...formData,
      amount: parseFloat(formData.amount),
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    navigate('/expenses');
  };

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          getLocationName(coords);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationLoading(false);
        }
      );
    }
  };

  const handleReceiptCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, receipt: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <SafeIcon icon={FiX} className="text-xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Dinner at restaurant"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="relative">
            <SafeIcon icon={FiDollarSign} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select category</option>
            {state.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paid By
          </label>
          <input
            type="text"
            value={formData.paidBy}
            onChange={(e) => setFormData(prev => ({ ...prev, paidBy: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              {formData.location ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <SafeIcon icon={FiMapPin} className="mr-2" />
                    <span className="text-sm">{formData.location.address}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                  No location captured
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleLocationCapture}
              disabled={locationLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {locationLoading ? '...' : <SafeIcon icon={FiMapPin} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Receipt Photo
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleReceiptCapture}
              className="hidden"
              id="receipt-input"
            />
            <label
              htmlFor="receipt-input"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <SafeIcon icon={FiCamera} className="mr-2" />
              Capture Receipt
            </label>
            {formData.receipt && (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.receipt}
                  alt="Receipt"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Additional notes..."
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <SafeIcon icon={FiSave} className="mr-2" />
          Save Expense
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ExpenseForm;