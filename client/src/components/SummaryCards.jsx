import React from 'react';
import { IndianRupee, Calendar, TrendingUp, Receipt, Tag } from 'lucide-react';

export const SummaryCards = ({ summary = {}, isLoading = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const {
    totalSpend = 0,
    currentMonthSpend = 0,
    totalTransactions = 0,
    avgSpend = 0,
    topCategory = null
  } = summary;

  if (isLoading) {
    return (
      <div className="metrics-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="metric-card skeleton" style={{ height: '130px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="metrics-grid">
      {/* 1. Total Spend */}
      <div className="metric-card" style={{ borderTop: '3px solid #244c3c' }}>
        <div className="metric-card-top">
          <span className="metric-label">Total Spend</span>
          <div className="metric-icon-badge" style={{ background: 'rgba(36, 76, 60, 0.12)', color: '#244c3c' }}>
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="metric-value">{formatCurrency(totalSpend)}</div>
        <div className="metric-subtext">
          <span>Across all recorded expenses</span>
        </div>
      </div>

      {/* 2. Current Month Spend */}
      <div className="metric-card" style={{ borderTop: '3px solid #fa6e06' }}>
        <div className="metric-card-top">
          <span className="metric-label">This Month</span>
          <div className="metric-icon-badge" style={{ background: 'rgba(250, 110, 6, 0.14)', color: '#fa6e06' }}>
            <Calendar size={20} />
          </div>
        </div>
        <div className="metric-value">{formatCurrency(currentMonthSpend)}</div>
        <div className="metric-subtext">
          <span>Current billing period</span>
        </div>
      </div>

      {/* 3. Top Spending Category */}
      <div className="metric-card" style={{ borderTop: '3px solid #425e6a' }}>
        <div className="metric-card-top">
          <span className="metric-label">Top Category</span>
          <div className="metric-icon-badge" style={{ background: 'rgba(66, 94, 106, 0.14)', color: '#425e6a' }}>
            <Tag size={20} />
          </div>
        </div>
        <div className="metric-value" style={{ fontSize: '1.4rem' }}>
          {topCategory ? topCategory.category : 'None'}
        </div>
        <div className="metric-subtext">
          {topCategory ? (
            <span>{formatCurrency(topCategory.amount)} ({topCategory.count} items)</span>
          ) : (
            <span>No data available</span>
          )}
        </div>
      </div>

      {/* 4. Transactions & Avg */}
      <div className="metric-card" style={{ borderTop: '3px solid #526c5b' }}>
        <div className="metric-card-top">
          <span className="metric-label">Avg / Transactions</span>
          <div className="metric-icon-badge" style={{ background: 'rgba(82, 108, 91, 0.16)', color: '#526c5b' }}>
            <Receipt size={20} />
          </div>
        </div>
        <div className="metric-value">{formatCurrency(avgSpend)}</div>
        <div className="metric-subtext">
          <span>{totalTransactions} total entries</span>
        </div>
      </div>
    </div>
  );
};
