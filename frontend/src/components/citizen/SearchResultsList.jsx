import React from 'react';
import { Star, X } from 'lucide-react';
import Pagination from '../common/Pagination';
import './SearchResultsList.css';

/**
 * SearchResultsList Component
 * Reusable list view for search results
 * 
 * Props:
 * - items: array - Array of result items with id, name, avatar, specialty/info, rating, address, etc.
 * - currentPage: number - Current page number
 * - totalPages: number - Total number of pages
 * - onPageChange: (page) => void - Pagination callback
 * - itemsPerPage: number - Items per page
 * - variant: 'owner' | 'vet' | 'citizen' - Color theme variant
 * - renderItem: (item) => React.Node - Custom item render function
 * - onItemClick: (item) => void - Item click callback
 * - actionButtonText: string - Text for action button
 * - onActionClick: (item) => void - Action button callback
 * - showCloseAppointment: boolean - Show close appointment button for owners
 * - onCloseAppointment: (item) => void - Close appointment callback
 * - currentUser: object - Current user {userType: 'owner'|'vet'|'citizen'}
 */
const SearchResultsList = ({
  items = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  itemsPerPage = 5,
  variant = 'citizen',
  renderItem = null,
  onItemClick = () => {},
  actionButtonText = 'Προβολή Προφίλ',
  onActionClick = () => {},
  showCloseAppointment = false,
  onCloseAppointment = () => {},
  currentUser = null,
  showPagination = true
}) => {
  // Items are already paginated when passed in, so use them directly
  const displayItems = items;

  const defaultRenderItem = (item) => (
    <div key={item.id} className="result-item">
      <div className="result-avatar">
        <span className="avatar-initials">{item.avatarText || 'Δρ'}</span>
      </div>
      <div className="result-details">
        <h3 className="result-name">{item.name}</h3>
        {item.specialty && <p className="result-specialty">{item.specialty}</p>}
        {item.rating && (
          <div className="result-rating-info">
            <Star size={14} fill="#23CED9" color="#23CED9" />
            <span className="rating-stars">{item.rating}</span>
            {item.reviewCount && <span className="rating-count">({item.reviewCount} αξιολογήσεις)</span>}
          </div>
        )}
        {item.address && <p className="result-address">{item.address}</p>}
      </div>
      <div className="result-actions">
        {actionButtonText && (
          <button 
            className="result-action-btn"
            onClick={() => onActionClick(item)}
          >
            {actionButtonText}
          </button>
        )}
        {showCloseAppointment && currentUser?.userType === 'owner' && (
          <button 
            className="result-close-appointment-btn"
            onClick={() => onCloseAppointment(item)}
            title="Κλείστε Ραντεβού"
          >
            Κλείστε Ραντεβού
          </button>
        )}
      </div>
    </div>
  );

  const render = renderItem || defaultRenderItem;

  return (
    <div className="search-results-list-container">
      <div className="search-results-list">
        {displayItems.length > 0 ? (
          displayItems.map(item => render(item))
        ) : (
          <div className="no-results">
            <p>Δεν βρέθηκαν αποτελέσματα</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          variant={variant}
        />
      )}
    </div>
  );
};

export default SearchResultsList;
