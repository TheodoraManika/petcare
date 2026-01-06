import React from 'react';
import { Search } from 'lucide-react';
import './SearchSidebar.css';

/**
 * SearchSidebar Component
 * Reusable sidebar with filters for search pages
 * 
 * Props:
 * - title: string - Sidebar title
 * - filters: object - Filter state object
 * - children: React.Node - Filter input elements
 * - onSearch: () => void - Search button callback
 * - onClear: () => void - Clear button callback
 * - resultsCount: number - Number of results found
 */
const SearchSidebar = ({
  title = 'Φίλτρα Αναζήτησης',
  filters = {},
  children,
  onSearch = () => {},
  onClear = () => {},
  resultsCount = 0
}) => {
  return (
    <aside className="search-sidebar">
      <div className="filter-header">
        <h3 className="filter-title">{title}</h3>
      </div>

      <div className="filters-container">
        {children}

        {/* Search Button */}
        <button className="search-button-sidebar" onClick={onSearch}>
          <Search size={18} />
          Αναζήτηση
        </button>

        {/* Clear Button */}
        <button className="clear-button-sidebar" onClick={onClear}>
          Καθαρισμός Φίλτρων
        </button>

        {/* Results Info */}
        {resultsCount > 0 && (
          <div className="sidebar-info">
            <p className="info-text">Βρέθηκαν {resultsCount} αποτελέσματα</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SearchSidebar;
