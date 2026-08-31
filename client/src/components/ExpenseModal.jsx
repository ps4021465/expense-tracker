import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3, AlertCircle, IndianRupee, Calendar, Tag, Type } from 'lucide-react';
import { CATEGORIES } from './ExpenseFilters';

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

export const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: SELECTABLE_CATEGORIES[0] || 'Food & Dining',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        category: initialData.category || SELECTABLE_CATEGORIES[0],
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: SELECTABLE_CATEGORIES[0] || 'Food & Dining',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be under 200 characters';
    }

    if (!formData.amount || formData.amount === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const num = Number(formData.amount);
      if (isNaN(num) || num <= 0) {
        newErrors.amount = 'Amount must be a positive number greater than 0';
      }
    }

    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    });
  };

  const isEditing = Boolean(initialData && initialData.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? (
              <>
                <Edit3 size={20} color="#244c3c" />
                <span>Edit Expense</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} color="#fa6e06" />
                <span>Add New Expense</span>
              </>
            )}
          </h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title Field */}
            <div className="form-group">
              <label className="form-label">
                <Type size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Expense Title / Description
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Grocery shopping, Metro recharge, Electricity bill"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                autoFocus
              />
              {errors.title && (
                <div className="form-error-msg">
                  <AlertCircle size={12} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Amount Field */}
            <div className="form-group">
              <label className="form-label">
                <IndianRupee size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Amount (₹ INR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              {errors.amount && (
                <div className="form-error-msg">
                  <AlertCircle size={12} />
                  <span>{errors.amount}</span>
                </div>
              )}
            </div>

            {/* Category Field */}
            <div className="form-group">
              <label className="form-label">
                <Tag size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Category
              </label>
              <select
                className={`form-select ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {SELECTABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="form-error-msg">
                  <AlertCircle size={12} />
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            {/* Date Field */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Date
              </label>
              <input
                type="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && (
                <div className="form-error-msg">
                  <AlertCircle size={12} />
                  <span>{errors.date}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                <span>Update Expense</span>
              ) : (
                <span>Save Expense</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
