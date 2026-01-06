import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './PageLayout.css';

/**
 * PageLayout component - wraps pages with navbar, footer and breadcrumbs
 * @param {object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Current page title (displayed in breadcrumb)
 * @param {string} props.variant - Variant for navbar (vet, owner, citizen)
 * @param {array} props.breadcrumbs - Optional array of breadcrumb items: [{label, path}, ...]
 *                                     If provided, breadcrumb hierarchy is: Home > breadcrumbs[0] > breadcrumbs[1] > ... > title
 * @param {boolean} props.showBreadcrumbs - Whether to show breadcrumbs (default: true)
 * @param {boolean} props.showNavbar - Whether to show navbar (default: true)
 * @param {boolean} props.showFooter - Whether to show footer (default: true)
 */
const PageLayout = ({ children, title, variant, breadcrumbs, showBreadcrumbs = true, showNavbar = true, showFooter = true }) => {
  // Initialize state by checking localStorage immediately
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return !!storedUser;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  });

  useEffect(() => {
    // Check login status on mount (in case it changed)
    const checkLoginStatus = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        setIsLoggedIn(!!storedUser);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('loginStatusChanged', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('loginStatusChanged', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <div className={`page-layout ${!showNavbar ? 'page-layout--no-navbar' : ''}`}>
      {showNavbar && <Navbar variant={variant} />}
      <main className="page-layout__main">
        {showBreadcrumbs && (
          <nav className="page-layout__breadcrumbs">
            <Link to="/" className="page-layout__breadcrumb-link">
              <Home size={16} />
            </Link>
            
            {/* Render custom breadcrumbs if provided */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <span className="page-layout__breadcrumb-separator">&gt;</span>
                    <Link to={crumb.path} className="page-layout__breadcrumb-link">
                      {crumb.label}
                    </Link>
                  </React.Fragment>
                ))}
              </>
            )}
            
            {/* Current page title */}
            <span className="page-layout__breadcrumb-separator">&gt;</span>
            <span className="page-layout__breadcrumb-current">{title || 'Μενού'}</span>
          </nav>
        )}
        <div className="page-layout__content">
          {children}
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;