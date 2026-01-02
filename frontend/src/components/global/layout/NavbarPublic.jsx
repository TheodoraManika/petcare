import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRound, Home, Search, CheckCircle2, Info, ChevronDown, Users, Stethoscope } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';
import './Navbar.css';

/**
 * NavbarPublic component - For non-authenticated users
 */
const NavbarPublic = () => {
  const navigate = useNavigate();
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = React.useState(false);

  const navLinks = [
    { to: ROUTES.home, icon: <Home size={18} />, label: 'Αρχική' },
    { to: ROUTES.citizen.lostPets, icon: <Search size={18} />, label: 'Χαμένα Κατοικίδια' },
    { to: ROUTES.citizen.foundPetForm, icon: <CheckCircle2 size={18} />, label: 'Δήλωση Εύρεσης' },
    { to: ROUTES.vet.searchMap, icon: <Search size={18} />, label: 'Κτηνίατροι' },
    { to: ROUTES.information, icon: <Info size={18} />, label: 'Πληροφορίες' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to={ROUTES.home} className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_dd_67_649)">
                <path d="M5 11C5 5.47715 9.47715 1 15 1H35C40.5228 1 45 5.47715 45 11V31C45 36.5228 40.5228 41 35 41H15C9.47715 41 5 36.5228 5 31V11Z" fill="url(#paint0_linear_67_649)" shapeRendering="crispEdges"/>
                <path d="M24 15C25.1046 15 26 14.1046 26 13C26 11.8954 25.1046 11 24 11C22.8954 11 22 11.8954 22 13C22 14.1046 22.8954 15 24 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M31 19C32.1046 19 33 18.1046 33 17C33 15.8954 32.1046 15 31 15C29.8954 15 29 15.8954 29 17C29 18.1046 29.8954 19 31 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M33 27C34.1046 27 35 26.1046 35 25C35 23.8954 34.1046 23 33 23C31.8954 23 31 23.8954 31 25C31 26.1046 31.8954 27 33 27Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 19C22.6566 19 23.3068 19.1293 23.9134 19.3806C24.52 19.6319 25.0712 20.0002 25.5355 20.4645C25.9998 20.9288 26.3681 21.48 26.6194 22.0866C26.8707 22.6932 27 23.3434 27 24V27.5C26.9997 28.3365 26.6999 29.1452 26.1548 29.7796C25.6097 30.4141 24.8555 30.8324 24.0286 30.9587C23.2017 31.085 22.357 30.9111 21.6473 30.4683C20.9376 30.0255 20.41 29.3432 20.16 28.545C19.7333 27.1683 18.8333 26.2667 17.46 25.84C16.6622 25.5901 15.9802 25.0629 15.5374 24.3538C15.0946 23.6446 14.9202 22.8004 15.0459 21.9739C15.1716 21.1473 15.5889 20.3931 16.2225 19.8476C16.8561 19.3021 17.664 19.0015 18.5 19H22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <filter id="filter0_dd_67_649" x="0" y="0" width="50" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_67_649"/>
                  <feOffset dy="2"/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_67_649"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect2_dropShadow_67_649"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="3"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="effect2_dropShadow_67_649" result="effect2_dropShadow_67_649"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_67_649" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_67_649" x1="5" y1="1" x2="45" y2="41" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#23CED9"/>
                  <stop offset="0.5" stopColor="#FCA47C"/>
                  <stop offset="1" stopColor="#F9D779"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar__logo-text">PetCare</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar__nav-links">
          {navLinks.map((link, index) => (
            <Link key={index} to={link.to} className="navbar__nav-link">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Login/Register buttons */}
        <div className="navbar__auth-buttons">
          <button 
            className="navbar__auth-btn navbar__auth-btn--signin"
            onClick={() => navigate(ROUTES.vet.dashboard)}
          >
            <UserRound size={16} />
            <span>Σύνδεση</span>
          </button>
          
          {/* Register Dropdown */}
          <div className="navbar__register-dropdown">
            <button 
              className="navbar__auth-btn navbar__auth-btn--signup"
              onClick={() => setIsRegisterDropdownOpen(!isRegisterDropdownOpen)}
            >
              <span>Εγγραφή</span>
              <ChevronDown 
                size={16} 
                className={`navbar__register-chevron ${isRegisterDropdownOpen ? 'navbar__register-chevron--open' : ''}`}
              />
            </button>
            
            {isRegisterDropdownOpen && (
              <div className="navbar__register-menu">
                <button 
                  className="navbar__register-option"
                  onClick={() => {
                    navigate(ROUTES.owner.register);
                    setIsRegisterDropdownOpen(false);
                  }}
                >
                  <Users size={20} color="#23CED9" />
                  <span>Ως Ιδιοκτήτης</span>
                </button>
                
                <button 
                  className="navbar__register-option"
                  onClick={() => {
                    navigate(ROUTES.vet.register);
                    setIsRegisterDropdownOpen(false);
                  }}
                >
                  <Stethoscope size={20} color="#FCA47C" />
                  <span>Ως Κτηνίατρος</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPublic;
