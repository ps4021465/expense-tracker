import React, { useState } from 'react';
import { X, Sliders, IndianRupee, BellRing, RotateCcw, Check, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from './ExpenseFilters';

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

export const DEFAULT_BUDGET_LIMITS = {
  'Food & Dining': 5000,
  'Transportation': 2500,
  'Utilities': 4000,
  'Entertainment': 2000,
  'Housing': 20000,
  'Health & Fitness': 2500,
  'Shopping': 6000,
  'Healthcare': 3000,
  'Education': 3000,
  'Miscellaneous': 2000
};

export const BudgetSettingsModal = ({
  isOpen,
  limits = DEFAULT_BUDGET_LIMITS,
  soundEnabled = true,
  onSave,
  onClose
}) => {
  const [localLimits, setLocalLimits] = useState(limits);
  const [localSound, setLocalSound] = useState(soundEnabled);

  if (!isOpen) return null;

  const handleChange = (category, value) => {
    setLocalLimits((prev) => ({
      ...prev,
      [category]: value === '' ? '' : Math.max(0, Number(value))
    }));
  };

  const handleResetDefaults = () => {
    setLocalLimits(DEFAULT_BUDGET_LIMITS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanLimits = {};
    SELECTABLE_CATEGORIES.forEach((cat) => {
      cleanLimits[cat] = Number(localLimits[cat]) || DEFAULT_BUDGET_LIMITS[cat] || 2000;
    });
    onSave(cleanLimits, localSound);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <Sliders size={20} color="#244c3c" />
            <span>Category Spending Limits &amp; Alarm</span>
          </h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {/* Audio Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.1rem',
                background: '#f4f6ee',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <BellRing size={20} color="#fa6e06" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#193328' }}>
                    Sound Alarm on Breach
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#647a6d' }}>
                    Play an audible chime when an expense crosses its limit
                  </div>
                </div>
              </div>

              <label className="switch-toggle" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localSound}
                  onChange={(e) => setLocalSound(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#fa6e06', cursor: 'pointer' }}
                />
              </label>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#425e6a', marginBottom: '1rem', fontWeight: 600 }}>
              Set your target monthly threshold for each spending category (in ₹ INR):
            </p>

            {/* Category Limit Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {SELECTABLE_CATEGORIES.map((category) => (
                <div key={category} className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    {category}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#647a6d',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      className="form-input"
                      style={{ paddingLeft: '1.8rem', fontSize: '0.9rem' }}
                      value={localLimits[category] !== undefined ? localLimits[category] : ''}
                      onChange={(e) => handleChange(category, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleResetDefaults}
              title="Reset to recommended defaults"
              style={{ fontSize: '0.825rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Check size={16} />
                <span>Save Limits</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
