import React from 'react';
import './Footer.css';
import assets from '../assets';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="logo-section">
            <div className="footer-logo">
              <img src={assets.footerLogo} alt="PetCare" className="logo-icon" />
              <h3 className="logo-text">PetCare</h3>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Υποστήριξη & Πληροφορίες</h4>
          <ul className="footer-links">
            <li><a href="/contact">Επικοινωνία</a></li>
            <li><a href="/about">Σχετικά με Εμάς</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Νομικά</h4>
          <ul className="footer-links">
            <li><a href="/privacy">Πολιτική Απορρήτου</a></li>
            <li><a href="/terms">Όροι & Προϋποθέσεις</a></li>
            <li><a href="/cookies">Πολιτική Cookies</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">© 2025 PetCare. Όλα τα δικαιώματα διατηρούνται.</p>
      </div>
    </footer>
  );
};

export default Footer;
