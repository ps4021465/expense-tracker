import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { ExpenseCharts } from './components/ExpenseCharts';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseModal } from './components/ExpenseModal';
import { DeleteModal } from './components/DeleteModal';
import { BudgetOverview } from './components/BudgetOverview';
import { BudgetSettingsModal, DEFAULT_BUDGET_LIMITS } from './components/BudgetSettingsModal';
import { BudgetAlarmModal } from './components/BudgetAlarmModal';
import { Toast } from './components/Toast';
import { expenseService } from './api/api';
import { playBudgetAlarm, stopBudgetAlarm } from './utils/audioAlert';
import { Database, AlertTriangle } from 'lucide-react';

export function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalSpend: 0,
    totalTransactions: 0,
    avgSpend: 0,
    currentMonthSpend: 0,
    topCategory: null,
    categoryBreakdown: [],
    monthlyBreakdown: []
  });

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    preset: 'ALL',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    order: 'DESC'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Budget & Alert States
  const [budgetLimits, setBudgetLimits] = useState(() => {
    try {
      const saved = localStorage.getItem('expense_budget_limits');
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET_LIMITS;
    } catch {
      return DEFAULT_BUDGET_LIMITS;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('expense_alarm_sound') !== 'false';
    } catch {
      return true;
    }
  });

  const [isBudgetSettingsOpen, setIsBudgetSettingsOpen] = useState(false);
  const [alarmAlertData, setAlarmAlertData] = useState(null);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    initialData: null,
    isSubmitting: false
  });

  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    expense: null,
    isDeleting: false
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  /**
   * Check if a category has exceeded its budget limit
   */
  const checkBudgetThreshold = useCallback((category, categoryBreakdownList, limits = budgetLimits, sound = soundEnabled) => {
    if (!category || !limits[category]) return;

    const limit = Number(limits[category]);
    const found = categoryBreakdownList.find((c) => c.category === category);
    const currentSpend = found ? Number(found.totalAmount) : 0;

    if (currentSpend > limit) {
      const exceededAmount = currentSpend - limit;
      const percentage = Math.round((currentSpend / limit) * 100);

      // Trigger audio alarm if enabled
      if (sound) {
        playBudgetAlarm();
      }

      // Trigger visual alarm dialog
      setAlarmAlertData({
        category,
        currentSpend,
        limit,
        exceededAmount,
        percentage
      });
    }
  }, [budgetLimits, soundEnabled]);

  /**
   * Save custom budget limits
   */
  const handleSaveBudgetLimits = (newLimits, newSound) => {
    setBudgetLimits(newLimits);
    setSoundEnabled(newSound);
    try {
      localStorage.setItem('expense_budget_limits', JSON.stringify(newLimits));
      localStorage.setItem('expense_alarm_sound', String(newSound));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    showToast('success', 'Budget spending limits updated successfully!');
  };

  /**
   * Load summary stats and charts
   */
  const loadSummary = useCallback(async () => {
    try {
      const res = await expenseService.getSummary();
      if (res && res.success) {
        setSummary(res.summary);
        return res.summary;
      }
    } catch (err) {
      console.error('Failed to load summary stats:', err);
    }
    return null;
  }, []);

  /**
   * Load expenses list with current filters
   */
  const loadExpenses = useCallback(async (currentFilters = filters, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setServerError(null);

    try {
      const res = await expenseService.getExpenses(currentFilters);
      if (res && res.success) {
        setExpenses(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setServerError(err.message || 'Failed to connect to backend server');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      await Promise.all([loadExpenses(filters, false), loadSummary()]);
      setIsLoading(false);
    };
    initData();
  }, []);

  // Debounced filter effect
  useEffect(() => {
    const handler = setTimeout(() => {
      loadExpenses(filters, false);
    }, 250);

    return () => clearTimeout(handler);
  }, [filters, loadExpenses]);

  /**
   * Refresh all data
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadExpenses(filters, false), loadSummary()]);
    setIsRefreshing(false);
    showToast('info', 'Data refreshed successfully');
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  /**
   * Reset all filters
   */
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      preset: 'ALL',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      order: 'DESC'
    });
    showToast('info', 'Filters reset to default');
  };

  /**
   * Open modal for Adding new expense
   */
  const handleOpenAddModal = () => {
    setModalConfig({
      isOpen: true,
      initialData: null,
      isSubmitting: false
    });
  };

  /**
   * Open modal for Editing an existing expense
   */
  const handleOpenEditModal = (expense) => {
    setModalConfig({
      isOpen: true,
      initialData: expense,
      isSubmitting: false
    });
  };

  /**
   * Submit Add or Edit Expense
   */
  const handleModalSubmit = async (formData) => {
    setModalConfig((prev) => ({ ...prev, isSubmitting: true }));
    try {
      if (modalConfig.initialData?.id) {
        // Update existing expense
        await expenseService.updateExpense(modalConfig.initialData.id, formData);
        showToast('success', 'Expense updated successfully!');
      } else {
        // Create new expense
        await expenseService.createExpense(formData);
        showToast('success', 'Expense added successfully!');
      }

      setModalConfig({ isOpen: false, initialData: null, isSubmitting: false });
      
      // Reload list and summary
      const [_, updatedSummary] = await Promise.all([
        loadExpenses(filters, false),
        loadSummary()
      ]);

      // Check if this category crossed the limit
      if (updatedSummary && updatedSummary.categoryBreakdown) {
        checkBudgetThreshold(formData.category, updatedSummary.categoryBreakdown);
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('error', err.message || 'Operation failed. Please check inputs.');
      setModalConfig((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  /**
   * Open confirmation modal for deletion
   */
  const handleOpenDeleteModal = (expense) => {
    setDeleteModalConfig({
      isOpen: true,
      expense,
      isDeleting: false
    });
  };

  /**
   * Confirm and execute deletion
   */
  const handleConfirmDelete = async (id) => {
    setDeleteModalConfig((prev) => ({ ...prev, isDeleting: true }));
    try {
      await expenseService.deleteExpense(id);
      showToast('success', 'Expense deleted successfully!');
      setDeleteModalConfig({ isOpen: false, expense: null, isDeleting: false });
      // Reload list and summary
      await Promise.all([loadExpenses(filters, false), loadSummary()]);
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', err.message || 'Failed to delete expense.');
      setDeleteModalConfig((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Compute number of exceeded categories for the navbar badge
  const exceededCount = (summary.categoryBreakdown || []).filter((item) => {
    const limit = budgetLimits[item.category];
    return limit && Number(item.totalAmount) > Number(limit);
  }).length;

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        onAddClick={handleOpenAddModal}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenBudgetSettings={() => setIsBudgetSettingsOpen(true)}
        exceededAlertCount={exceededCount}
      />

      {/* Backend connection notice if server has an issue */}
      {serverError && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            color: '#991b1b'
          }}
        >
          <AlertTriangle size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Unable to reach backend database</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {serverError} — Ensure MySQL is running, the `expense_tracker` schema is imported via `schema.sql`, and credentials in `server/.env` are configured.
            </div>
          </div>
        </div>
      )}

      {/* Metric Summary Cards */}
      <SummaryCards summary={summary} isLoading={isLoading} />

      {/* Live Budget Limits & Alert Watcher */}
      <BudgetOverview
        categoryBreakdown={summary.categoryBreakdown || []}
        budgetLimits={budgetLimits}
        onOpenSettings={() => setIsBudgetSettingsOpen(true)}
      />

      {/* Analytics & Charts */}
      <ExpenseCharts summary={summary} isLoading={isLoading} />

      {/* Search & Filters */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Expenses Table */}
      <ExpenseTable
        expenses={expenses}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onAddNew={handleOpenAddModal}
      />

      {/* Modals & Alerts */}
      <ExpenseModal
        isOpen={modalConfig.isOpen}
        initialData={modalConfig.initialData}
        isSubmitting={modalConfig.isSubmitting}
        onClose={() => setModalConfig({ isOpen: false, initialData: null, isSubmitting: false })}
        onSubmit={handleModalSubmit}
      />

      <DeleteModal
        isOpen={deleteModalConfig.isOpen}
        expense={deleteModalConfig.expense}
        isDeleting={deleteModalConfig.isDeleting}
        onClose={() => setDeleteModalConfig({ isOpen: false, expense: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
      />

      {/* Budget Limit Alarm Notification Modal */}
      <BudgetAlarmModal
        isOpen={Boolean(alarmAlertData)}
        alertData={alarmAlertData}
        onClose={() => {
          stopBudgetAlarm();
          setAlarmAlertData(null);
        }}
        onOpenSettings={() => setIsBudgetSettingsOpen(true)}
      />

      {/* Budget Settings Configuration Modal */}
      <BudgetSettingsModal
        isOpen={isBudgetSettingsOpen}
        limits={budgetLimits}
        soundEnabled={soundEnabled}
        onSave={handleSaveBudgetLimits}
        onClose={() => setIsBudgetSettingsOpen(false)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Footer */}
      <footer className="app-footer">
        <p>Full-Stack Expense Tracker • React + Express + MySQL</p>
        <div className="db-status-badge db-status-online">
          <span className="db-status-dot" />
          <span>MySQL Connection Pooling Active</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
