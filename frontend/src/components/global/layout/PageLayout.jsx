import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './PageLayout.css';

/**
 * PageLayout component - wraps pages with navbar, footer and breadcrumbs
 */
const PageLayout = ({ children, title }) => {
  return (
    <div className="page-layout">
      <Navbar />
      <main className="page-layout__main">
        <nav className="page-layout__breadcrumbs">
          <Link to="/" className="page-layout__breadcrumb-link">
            <Home size={16} />
          </Link>
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
