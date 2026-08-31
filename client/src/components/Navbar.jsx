import React from 'react';
import { Wallet, PlusCircle, RefreshCw, BellRing, Sliders } from 'lucide-react';

export const Navbar = ({
  onAddClick,
  onRefresh,
  isRefreshing,
  onOpenBudgetSettings,
  exceededAlertCount = 0
}) => {
  return (
    <header className="navbar">
      <div className="brand-logo">
        <div className="logo-icon-wrap">
          <Wallet size={24} color="#ffffff" />
        </div>
        <div>
          <h1 className="logo-title">ExpenseTracker</h1>
          <p className="logo-subtitle">Smart Financial Analytics</p>
        </div>
      </div>

      <div className="nav-actions">
        <button
          className="btn-secondary"
          onClick={onOpenBudgetSettings}
          title="Configure Spending Limits & Alarm"
          style={{ position: 'relative' }}
        >
          <BellRing size={16} color={exceededAlertCount > 0 ? '#fa6e06' : '#244c3c'} />
          <span>Budget Limits</span>
          {exceededAlertCount > 0 && (
            <span
              style={{
                background: '#e11d48',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                marginLeft: '0.2rem'
              }}
            >
              {exceededAlertCount}
            </span>
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={onRefresh}
          title="Refresh Data"
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={isRefreshing ? 'spin-anim' : ''} />
          <span>Refresh</span>
        </button>

        <button className="btn-primary" onClick={onAddClick}>
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};
