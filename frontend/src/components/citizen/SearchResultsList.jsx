import React from 'react';
import { Star, X } from 'lucide-react';
import Pagination from '../common/layout/Pagination';
import Avatar from '../common/Avatar';
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
  onPageChange = () => { },
  itemsPerPage = 5,
  variant = 'citizen',
  renderItem = null,
  onItemClick = () => { },
  actionButtonText = 'Προβολή Προφίλ',
  onActionClick = () => { },
  showCloseAppointment = false,
  onCloseAppointment = () => { },
  currentUser = null,
  showPagination = true
}) => {
  // Items are already paginated when passed in, so use them directly
  const displayItems = items;

  const defaultRenderItem = (item) => {
    // Generate initials from name
    const getInitials = (name, lastName) => {
      if (!name) return 'Δρ';
      const parts = `${name} ${lastName || ''}`.trim().split(' ');
      if (parts.length >= 2 && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    return (
      <div key={item.id} className="result-item">
        <div className="result-avatar">
          <Avatar
            src={item.avatar}
            name={item.name}
            lastName={item.lastName || item.surname}
            size="xl"
            shape="square"
          />
        </div>
        <div className="result-details">
          <h3 className="result-name">{item.name} {item.lastName || item.surname}</h3>
          {item.specialty && <p className="result-specialty">{item.specialty}</p>}
          {item.rating !== undefined && item.rating !== null && (
            <div className="result-rating-info">
              <Star size={14} fill="#FFC107" color="#FFC107" />
              <span className="rating-stars">{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>
              {(item.reviewCount !== undefined && item.reviewCount !== null) && (
                <span className="rating-count">({item.reviewCount} αξιολογήσεις)</span>
              )}
            </div>
          )}
          {item.address && <p className="result-address">{item.address}</p>}
          {(item.displayPrice !== undefined && item.displayPrice !== null) && (
            <div className="result-price-box">
              <span className="price-label">{item.displayService === 'από' ? 'Από' : item.displayService}</span>
              <span className="price-value">{item.displayPrice}€</span>
            </div>
          )}
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
          {showCloseAppointment && (
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
  };

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
