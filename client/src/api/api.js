import axios from 'axios';

/**
 * Centralized Axios Instance
 * In development, requests are proxied via Vite config to http://localhost:5000/api
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Response Interceptor for uniform error parsing
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || [],
      status: error.response?.status || 500,
      code: error.code
    };
    return Promise.reject(customError);
  }
);

/**
 * Expense API Service functions
 */
export const expenseService = {
  /**
   * Fetch all expenses with optional filtering/sorting
   * @param {Object} params - { category, startDate, endDate, search, sortBy, order }
   */
  getExpenses: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'All') {
        cleanParams[key] = params[key];
      }
    });
    const response = await API.get('/expenses', { params: cleanParams });
    return response.data;
  },

  /**
   * Fetch a single expense by ID
   * @param {number|string} id
   */
  getExpenseById: async (id) => {
    const response = await API.get(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Add a new expense
   * @param {Object} data - { title, amount, category, date }
   */
  createExpense: async (data) => {
    const response = await API.post('/expenses', data);
    return response.data;
  },

  /**
   * Update an existing expense
   * @param {number|string} id
   * @param {Object} data - { title, amount, category, date }
   */
  updateExpense: async (id, data) => {
    const response = await API.put(`/expenses/${id}`, data);
    return response.data;
  },

  /**
   * Delete an expense
   * @param {number|string} id
   */
  deleteExpense: async (id) => {
    const response = await API.delete(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Fetch spending summary and category breakdown
   */
  getSummary: async () => {
    const response = await API.get('/expenses/summary');
    return response.data;
  },

  /**
   * Check API server health
   */
  checkHealth: async () => {
    const response = await API.get('/health');
    return response.data;
  }
};

export default API;
