import React from 'react';
import {
  Edit3,
  Trash2,
  Receipt,
  Utensils,
  Car,
  Zap,
  Film,
  Home,
  Dumbbell,
  ShoppingBag,
  HeartPulse,
  BookOpen,
  HelpCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food & Dining':
      return <Utensils size={14} />;
    case 'Transportation':
      return <Car size={14} />;
    case 'Utilities':
      return <Zap size={14} />;
    case 'Entertainment':
      return <Film size={14} />;
    case 'Housing':
      return <Home size={14} />;
    case 'Health & Fitness':
      return <Dumbbell size={14} />;
    case 'Shopping':
      return <ShoppingBag size={14} />;
    case 'Healthcare':
      return <HeartPulse size={14} />;
    case 'Education':
      return <BookOpen size={14} />;
    default:
      return <HelpCircle size={14} />;
  }
};

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'Food & Dining':
      return 'badge-food';
    case 'Transportation':
      return 'badge-transport';
    case 'Utilities':
      return 'badge-utilities';
    case 'Entertainment':
      return 'badge-entertainment';
    case 'Housing':
      return 'badge-housing';
    case 'Health & Fitness':
      return 'badge-fitness';
    case 'Shopping':
      return 'badge-shopping';
    case 'Healthcare':
      return 'badge-healthcare';
    case 'Education':
      return 'badge-education';
    default:
      return 'badge-other';
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  // Avoid timezone offset issues with pure date strings like YYYY-MM-DD
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const ExpenseTable = ({
  expenses = [],
  isLoading = false,
  onEdit,
  onDelete,
  onAddNew
}) => {
  if (isLoading) {
    return (
      <div className="table-card">
        <div className="table-header-bar">
          <div className="table-header-title">
            <Receipt size={18} color="#244c3c" />
            <span>Expense Records</span>
          </div>
        </div>
        <div style={{ padding: '1rem 0' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-header-bar">
        <div className="table-header-title">
          <Receipt size={18} color="#244c3c" />
          <span>Expense Records</span>
          <span className="table-count-badge">{expenses.length} records</span>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-icon-wrap">
            <Receipt size={28} />
          </div>
          <h4 className="empty-title">No expenses found</h4>
          <p className="empty-desc">
            No expense records match your current filters. Try changing your search query or record a new expense.
          </p>
          <button className="btn-primary" onClick={onAddNew}>
            Add First Expense
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title / Description</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="expense-title-cell">
                    {expense.title}
                  </td>
                  <td>
                    <span className={`category-badge ${getCategoryBadgeClass(expense.category)}`}>
                      {getCategoryIcon(expense.category)}
                      <span>{expense.category}</span>
                    </span>
                  </td>
                  <td className="expense-date-cell">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} style={{ opacity: 0.6 }} />
                      {formatDate(expense.date)}
                    </span>
                  </td>
                  <td className="expense-amount-cell" style={{ textAlign: 'right' }}>
                    -{formatCurrency(expense.amount)}
                  </td>
                  <td>
                    <div className="expense-actions-cell" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-icon edit"
                        onClick={() => onEdit(expense)}
                        title="Edit Expense"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => onDelete(expense)}
                        title="Delete Expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
