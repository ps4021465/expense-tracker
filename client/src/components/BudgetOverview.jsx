import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const BudgetOverview = ({
  categoryBreakdown = [],
  budgetLimits = {},
  onOpenSettings
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute spend stats per category
  const budgetStats = Object.keys(budgetLimits).map((category) => {
    const found = categoryBreakdown.find((c) => c.category === category);
    const spent = found ? Number(found.totalAmount) : 0;
    const limit = Number(budgetLimits[category]) || 1;
    const percentage = Math.round((spent / limit) * 100);
    const isExceeded = spent > limit;
    const isWarning = percentage >= 80 && !isExceeded;

    return {
      category,
      spent,
      limit,
      percentage,
      isExceeded,
      isWarning
    };
  });

  // Sort by highest percentage spent first
  budgetStats.sort((a, b) => b.percentage - a.percentage);

  const exceededCount = budgetStats.filter((b) => b.isExceeded).length;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.35rem 1.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: exceededCount > 0 ? 'rgba(250, 110, 6, 0.15)' : 'rgba(36, 76, 60, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: exceededCount > 0 ? '#fa6e06' : '#244c3c'
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#193328' }}>
                Budget Limits &amp; Alert Watch
              </h3>
              {exceededCount > 0 ? (
                <span
                  style={{
                    background: '#fff1e6',
                    color: '#c94c00',
                    border: '1px solid #ffd8bf',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  🚨 {exceededCount} Over Budget!
                </span>
              ) : (
                <span
                  style={{
                    background: '#eaf1ed',
                    color: '#244c3c',
                    border: '1px solid #c7dcd1',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  ✅ All within limits
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#647a6d', margin: 0 }}>
              Live monitor tracking spending limits with automatic alarm notifications
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings();
            }}
          >
            <Sliders size={14} />
            <span>Set Limits</span>
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label="Toggle budget section"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Progress Bars Grid */}
      {isExpanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1.15rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          {budgetStats.slice(0, 6).map((item) => {
            let barColor = '#244c3c';
            if (item.isExceeded) barColor = '#e11d48';
            else if (item.isWarning) barColor = '#fa6e06';

            return (
              <div
                key={item.category}
                style={{
                  background: item.isExceeded ? '#fff5f5' : '#f9faf6',
                  border: item.isExceeded ? '1px solid #fed7d7' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.4rem'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#193328' }}>
                    {item.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: item.isExceeded ? '#e11d48' : item.isWarning ? '#c94c00' : '#244c3c'
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div
                  style={{
                    width: '100%',
                    height: '7px',
                    background: '#e4e8dc',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.4rem'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(item.percentage, 100)}%`,
                      background: barColor,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: '#647a6d'
                  }}
                >
                  <span>Spent: <strong style={{ color: '#193328' }}>{formatCurrency(item.spent)}</strong></span>
                  <span>Limit: <strong style={{ color: '#425e6a' }}>{formatCurrency(item.limit)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
