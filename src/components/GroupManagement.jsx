import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useExpenses } from '../context/ExpenseContext';

const { FiUsers, FiPlus, FiEdit2, FiTrash2, FiUser, FiMail } = FiIcons;

const GroupManagement = () => {
  const { state, dispatch } = useExpenses();
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroup.name) return;
    
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    setNewGroup({ name: '', description: '' });
    setShowAddGroup(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    
    dispatch({ type: 'ADD_MEMBER', payload: newMember });
    setNewMember({ name: '', email: '', phone: '' });
    setShowAddMember(false);
  };

  const handleDeleteGroup = (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      dispatch({ type: 'DELETE_GROUP', payload: id });
    }
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      dispatch({ type: 'DELETE_MEMBER', payload: id });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Groups & Members</h1>

      {/* Groups Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Groups</h2>
          <button
            onClick={() => setShowAddGroup(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="mr-1" />
            Add Group
          </button>
        </div>

        {showAddGroup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <form onSubmit={handleAddGroup} className="space-y-3">
              <input
                type="text"
                placeholder="Group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Group
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGroup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-3">
          {state.groups.length > 0 ? (
            state.groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <SafeIcon icon={FiUsers} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-gray-600">{group.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiUsers} className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No groups yet</p>
              <p className="text-sm text-gray-400">Create your first group to organize expenses</p>
            </div>
          )}
        </div>
      </div>

      {/* Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Members</h2>
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="mr-1" />
            Add Member
          </button>
        </div>

        {showAddMember && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <form onSubmit={handleAddMember} className="space-y-3">
              <input
                type="text"
                placeholder="Member name"
                value={newMember.name}
                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newMember.email}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={newMember.phone}
                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-3">
          {state.members.length > 0 ? (
            state.members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <SafeIcon icon={FiUser} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <div className="text-sm text-gray-600">
                        {member.email && (
                          <div className="flex items-center">
                            <SafeIcon icon={FiMail} className="mr-1" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="mt-1">{member.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiUser} className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No members yet</p>
              <p className="text-sm text-gray-400">Add members to split expenses with</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupManagement;