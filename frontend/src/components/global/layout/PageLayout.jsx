import React from 'react';
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
 */
const PageLayout = ({ children, title, variant = 'vet', breadcrumbs }) => {
  return (
    <div className="page-layout">
      <Navbar variant={variant} />
      <main className="page-layout__main">
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
        <div className="page-layout__content">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;