import React, { useState } from 'react';
import { useDebounce } from '../../hooks';
import { useTransactionsContext } from './TransactionContext';
import type { TransactionType, TransactionCategory, TransactionSortField } from '../../types';
import './TransactionFilters.css';

const TRANSACTION_CATEGORIES = [
  'GROCERIES',
  'TRANSPORT',
  'ENTERTAINMENT',
  'UTILITIES',
  'SALARY',
  'RENT',
  'SHOPPING',
  'HEALTHCARE',
  'OTHER',
] as const;

export const TransactionFilters: React.FC = () => {
  const { filters, sort, setFilters, setSort } = useTransactionsContext();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Update filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ ...filters, search: debouncedSearch || undefined });
    }
  }, [debouncedSearch]);

  const handleTypeChange = (type: string) => {
    setFilters({
      ...filters,
      type: type === 'all' ? undefined : (type as TransactionType),
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({
      ...filters,
      category: category === 'all' ? undefined : (category as TransactionCategory),
    });
  };

  const handleSortChange = (field: TransactionSortField) => {
    if (sort.field === field) {
      // Toggle direction if same field
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Default to descending for new field
      setSort({ field, direction: 'desc' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSort({ field: 'date', direction: 'desc' });
  };

  const hasActiveFilters =
    searchTerm || filters.type || filters.category || sort.field !== 'date' || sort.direction !== 'desc';

  return (
    <div className="transaction-filters">
      {/* Search */}
      <div className="filter-section filter-search">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Type Filter */}
        <div className="filter-group">
          <label className="filter-label">Type</label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All types</option>
            <option value="INCOMING">Income</option>
            <option value="OUTGOING">Expenses</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All categories</option>
            {TRANSACTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label className="filter-label">Sort by</label>
          <div className="sort-buttons">
            <button
              className={`sort-button ${sort.field === 'date' ? 'active' : ''}`}
              onClick={() => handleSortChange('date')}
            >
              Date
              {sort.field === 'date' && (
                <span className="sort-arrow">{sort.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
            <button
              className={`sort-button ${sort.field === 'amount' ? 'active' : ''}`}
              onClick={() => handleSortChange('amount')}
            >
              Amount
              {sort.field === 'amount' && (
                <span className="sort-arrow">{sort.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
            <button
              className={`sort-button ${sort.field === 'counterpartyName' ? 'active' : ''}`}
              onClick={() => handleSortChange('counterpartyName')}
            >
              Name
              {sort.field === 'counterpartyName' && (
                <span className="sort-arrow">{sort.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm clear-filters-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};