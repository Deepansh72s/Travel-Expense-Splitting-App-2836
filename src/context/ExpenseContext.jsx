import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  groups: [],
  members: [],
  categories: [
    'Food & Dining',
    'Transportation',
    'Accommodation',
    'Entertainment',
    'Shopping',
    'Activities',
    'Other'
  ]
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case 'ADD_GROUP':
      return {
        ...state,
        groups: [...state.groups, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.id ? action.payload : group
        )
      };
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload)
      };
    case 'ADD_MEMBER':
      return {
        ...state,
        members: [...state.members, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.id ? action.payload : member
        )
      };
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter(member => member.id !== action.payload)
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('travelExpenses');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('travelExpenses', JSON.stringify(state));
  }, [state]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}