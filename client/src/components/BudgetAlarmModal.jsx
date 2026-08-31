import React, { useEffect } from 'react';
import { AlertOctagon, Volume2, ShieldAlert, X, ArrowRight, Settings } from 'lucide-react';
import { stopBudgetAlarm } from '../utils/audioAlert';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export const BudgetAlarmModal = ({
  isOpen,
  alertData,
  onClose,
  onOpenSettings
}) => {
  // Ensure alarm stops when modal unmounts or closes
  useEffect(() => {
    return () => {
      stopBudgetAlarm();
    };
  }, []);

  if (!isOpen || !alertData) return null;

  const { category, currentSpend, limit, exceededAmount, percentage } = alertData;

  const handleDismiss = () => {
    stopBudgetAlarm();
    onClose();
  };

  const handleOpenSettings = () => {
    stopBudgetAlarm();
    onClose();
    if (onOpenSettings) onOpenSettings();
  };

  return (
    <div className="modal-overlay" onClick={handleDismiss}>
      <div
        className="modal-content alarm-modal-content"
        style={{
          maxWidth: '500px',
          border: '2px solid #fa6e06',
          boxShadow: '0 0 35px rgba(250, 110, 6, 0.4), 0 20px 40px rgba(36, 76, 60, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pulsating Warning Header */}
        <div className="alarm-header">
          <div className="alarm-icon-container">
            <div className="alarm-pulse-ring" />
            <div className="alarm-icon-badge">
              <ShieldAlert size={36} color="#ffffff" />
            </div>
          </div>
          <h2 className="alarm-title">Spending Limit Exceeded!</h2>
          <p className="alarm-subtitle">
            You have crossed your set budget limit for <strong>{category}</strong>.
          </p>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Spend vs Limit Comparison Box */}
          <div className="alarm-details-box">
            <div className="alarm-metric-row">
              <span className="alarm-metric-label">Category:</span>
              <span className="alarm-metric-val font-bold" style={{ color: '#244c3c' }}>
                {category}
              </span>
            </div>

            <div className="alarm-metric-row">
              <span className="alarm-metric-label">Your Budget Limit:</span>
              <span className="alarm-metric-val">{formatCurrency(limit)}</span>
            </div>

            <div className="alarm-metric-row">
              <span className="alarm-metric-label">Current Total Spent:</span>
              <span className="alarm-metric-val alarm-highlight-red">
                {formatCurrency(currentSpend)}
              </span>
            </div>

            <div className="alarm-divider" />

            <div className="alarm-metric-row" style={{ marginTop: '0.5rem' }}>
              <span className="alarm-metric-label font-bold" style={{ color: '#c94c00' }}>
                Exceeded By:
              </span>
              <span className="alarm-exceeded-badge">
                +{formatCurrency(exceededAmount)} ({percentage}% of limit)
              </span>
            </div>
          </div>

          {/* Audio Indicator */}
          <div className="alarm-sound-indicator">
            <Volume2 size={16} className="alarm-sound-wave" />
            <span>Audio Alarm is sounding — Click below to acknowledge.</span>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', background: '#fafbf8' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleOpenSettings}
            style={{ fontSize: '0.85rem' }}
          >
            <Settings size={14} />
            <span>Adjust Limit</span>
          </button>

          <button
            type="button"
            className="btn-primary alarm-close-btn"
            onClick={handleDismiss}
            autoFocus
          >
            <span>Acknowledge &amp; Stop Alarm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
