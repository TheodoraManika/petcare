import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CirclePlus,
  Clock,
  FileText,
  History,
  Home,
  Info,
  LogOut,
  Menu,
  PawPrint,
  Search,
  Star,
  UserRound,
} from 'lucide-react';
import { ROUTES } from '../../../utils/constants';
import Avatar from '../ui/Avatar';
import './Navbar.css';

const Navbar = ({ variant = 'vet' }) => {
  const isOwner = variant === 'owner';
  const isCitizen = variant === 'citizen';

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const defaultName = () => {
    if (isOwner) return 'Ιδιοκτήτης';
    if (isCitizen) return 'Πολίτης';
    return 'Κτηνίατρος';
  };

  const getUserData = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: userData.name || userData.username || defaultName(),
          avatar: userData.avatar || null,
        };
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
    return { name: defaultName(), avatar: null };
  };

  const user = getUserData();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = (() => {
    if (isOwner) {
      return [
        { icon: <FileText size={18} />, label: 'Βιβλιάριο', route: ROUTES.owner.pets },
        { icon: <Calendar size={18} />, label: 'Ραντεβού', route: ROUTES.owner.appointments },
        { icon: <AlertCircle size={18} />, label: 'Δήλωση Απώλειας', route: ROUTES.owner.lostPetForm },
        { icon: <History size={18} />, label: 'Ιστορικό', route: ROUTES.owner.lostHistory },
      ];
    }
    if (isCitizen) {
      return [
        { icon: <Search size={18} />, label: 'Χαμένα Κατοικίδια', route: ROUTES.citizen.lostPets },
        { icon: <CheckCircle2 size={18} />, label: 'Δήλωση Εύρεσης', route: ROUTES.citizen.foundPetForm },
        { icon: <Info size={18} />, label: 'Χάρτης', route: ROUTES.citizen.searchMap },
      ];
    }
    return [
      { icon: <CirclePlus size={18} />, label: 'Καταγραφή', route: ROUTES.vet.register },
      { icon: <FileText size={18} />, label: 'Ιατρικές Πράξεις', route: ROUTES.vet.operation },
      { icon: <Star size={18} />, label: 'Αξιολογήσεις', route: ROUTES.vet.reviews },
      { icon: <History size={18} />, label: 'Ιστορικό', route: ROUTES.vet.history },
      { icon: <Calendar size={18} />, label: 'Ραντεβού', route: ROUTES.vet.appointments },
      { icon: <Clock size={18} />, label: 'Διαθεσιμότητα', route: ROUTES.vet.availability },
      { icon: <PawPrint size={18} />, label: 'Συμβάντα Ζωής', route: ROUTES.vet.lifeEvents },
      { icon: <AlertCircle size={18} />, label: 'Δήλωση Απώλειας', route: ROUTES.vet.lostPetForm },
    ];
  })();

  const navLinks = (() => {
    if (isOwner) {
      return [
        { to: ROUTES.home, icon: <Home size={18} />, label: 'Αρχική' },
        { to: ROUTES.owner.lostPetForm, icon: <AlertCircle size={18} />, label: 'Δήλωση Απώλειας' },
        { to: ROUTES.owner.foundPetForm, icon: <CheckCircle2 size={18} />, label: 'Δήλωση Εύρεσης' },
        { to: ROUTES.owner.appointments, icon: <Calendar size={18} />, label: 'Ραντεβού' },
        { to: ROUTES.owner.lostHistory, icon: <History size={18} />, label: 'Ιστορικό' },
      ];
    }
    if (isCitizen) {
      return [
        { to: ROUTES.home, icon: <Home size={18} />, label: 'Αρχική' },
        { to: ROUTES.citizen.lostPets, icon: <Search size={18} />, label: 'Χαμένα Κατοικίδια' },
        { to: ROUTES.citizen.foundPetForm, icon: <CheckCircle2 size={18} />, label: 'Δήλωση Εύρεσης' },
        { to: ROUTES.citizen.searchMap, icon: <Info size={18} />, label: 'Χάρτης' },
      ];
    }
    return [
      { to: ROUTES.home, icon: <Home size={18} />, label: 'Αρχική' },
      { to: ROUTES.vet.lostPetForm, icon: <Search size={18} />, label: 'Χαμένα Κατοικίδια' },
      { to: ROUTES.vet.foundPetForm, icon: <CheckCircle2 size={18} />, label: 'Δήλωση Εύρεσης' },
      { to: ROUTES.vet.searchMap, icon: <Info size={18} />, label: 'Χάρτης' },
    ];
  })();

  const handleMenuNavigate = (route) => {
    navigate(route);
    setIsMenuOpen(false);
  };

  const profileRoute = isOwner ? ROUTES.owner.profile : isCitizen ? ROUTES.citizen.lostPets : ROUTES.vet.profile;
  const dashboardRoute = isOwner ? ROUTES.owner.dashboard : isCitizen ? ROUTES.home : ROUTES.vet.dashboard;

  return (
    <nav className={`navbar ${isOwner ? 'navbar--owner' : ''}`}>
      <div className="navbar__container">
        <Link to={ROUTES.home} className="navbar__logo">
          <div className="navbar__logo-icon">
            <span>PC</span>
          </div>
          <span className="navbar__logo-text">PetCare</span>
        </Link>

        <div className="navbar__right">
          <div className="navbar__nav-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="navbar__nav-link">
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="navbar__nav-dropdown" ref={menuRef}>
              <button
                className="navbar__nav-link navbar__nav-link--dropdown"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <Menu size={18} />
                <span>Μενού</span>
                <ChevronDown className={`navbar__dropdown-chevron ${isMenuOpen ? 'navbar__dropdown-chevron--open' : ''}`} size={16} />
              </button>

              {isMenuOpen && (
                <div className="navbar__nav-dropdown-menu">
                  {menuItems.map((item) => (
                    <button
                      key={item.route}
                      className="navbar__nav-dropdown-item"
                      onClick={() => handleMenuNavigate(item.route)}
                    >
                      <span className="navbar__nav-dropdown-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="navbar__profile" ref={profileRef}>
            <button
              className="navbar__profile-btn"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <span className="navbar__profile-name">{user.name}</span>
              <ChevronDown className={`navbar__profile-chevron ${isProfileOpen ? 'navbar__profile-chevron--open' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="navbar__profile-menu">
                <div className="navbar__profile-menu-header">
                  <p className="navbar__profile-menu-name">{user.name}</p>
                </div>
                <Link
                  to={profileRoute}
                  className="navbar__profile-menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <span className="navbar__profile-menu-icon">
                    <UserRound size={16} />
                  </span>
                  <span>Προφίλ</span>
                </Link>
                <Link
                  to={dashboardRoute}
                  className="navbar__profile-menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <span>Dashboard</span>
                </Link>
                <button
                  className="navbar__profile-menu-item navbar__profile-menu-item--logout"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(ROUTES.home);
                  }}
                >
                  <span className="navbar__profile-menu-icon">
                    <LogOut size={16} />
                  </span>
                  <span>Αποσύνδεση</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
