import React from 'react';
import { Search, Filter, Calendar, X, ArrowUpDown } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Housing',
  'Health & Fitness',
  'Shopping',
  'Healthcare',
  'Education',
  'Miscellaneous'
];

export const ExpenseFilters = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const isFiltered =
    filters.search ||
    (filters.category && filters.category !== 'All') ||
    filters.startDate ||
    filters.endDate ||
    filters.preset !== 'ALL';

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    const today = new Date();
    let startDate = '';
    let endDate = '';

    if (preset === 'THIS_MONTH') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      startDate = `${year}-${month}-01`;
      endDate = today.toISOString().split('T')[0];
    } else if (preset === 'LAST_30_DAYS') {
      const past30 = new Date();
      past30.setDate(today.getDate() - 30);
      startDate = past30.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (preset === 'THIS_YEAR') {
      const year = today.getFullYear();
      startDate = `${year}-01-01`;
      endDate = today.toISOString().split('T')[0];
    }

    onFilterChange({
      preset,
      startDate,
      endDate
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const [sortBy, order] = value.split('_');
    onFilterChange({ sortBy, order });
  };

  return (
    <div className="filters-container">
      {/* Search Bar */}
      <div className="search-input-group">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search expenses by title or note..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <div className="filter-group">
        {/* Category Dropdown */}
        <select
          className="filter-select"
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? '📂 All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Date Presets Dropdown */}
        <select
          className="filter-select"
          value={filters.preset || 'ALL'}
          onChange={handlePresetChange}
        >
          <option value="ALL">🗓️ All Dates</option>
          <option value="THIS_MONTH">📅 This Month</option>
          <option value="LAST_30_DAYS">⏳ Last 30 Days</option>
          <option value="THIS_YEAR">📆 This Year</option>
          <option value="CUSTOM">⚙️ Custom Range</option>
        </select>

        {/* Custom Date Inputs if Custom preset is chosen */}
        {filters.preset === 'CUSTOM' && (
          <>
            <input
              type="date"
              className="date-input"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              title="Start Date"
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input
              type="date"
              className="date-input"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              title="End Date"
            />
          </>
        )}

        {/* Sort Dropdown */}
        <select
          className="filter-select"
          value={`${filters.sortBy || 'date'}_${filters.order || 'DESC'}`}
          onChange={handleSortChange}
        >
          <option value="date_DESC">🕒 Newest First</option>
          <option value="date_ASC">🕒 Oldest First</option>
          <option value="amount_DESC">💰 Amount: High to Low</option>
          <option value="amount_ASC">💰 Amount: Low to High</option>
          <option value="title_ASC">🔤 Title: A - Z</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button className="clear-btn" onClick={onResetFilters} title="Reset all filters">
            <X size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
