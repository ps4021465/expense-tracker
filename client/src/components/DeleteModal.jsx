import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteModal = ({
  isOpen,
  expense,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#fb7185' }}>
            <AlertTriangle size={20} color="#f43f5e" />
            <span>Confirm Delete</span>
          </h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Are you sure you want to delete this expense record?
          </p>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
              {expense.title}
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{expense.category}</span>
              <span style={{ color: '#f43f5e', fontWeight: 600 }}>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(expense.amount)}
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Expense'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
