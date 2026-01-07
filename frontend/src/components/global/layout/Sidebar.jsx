import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, UserRound, CirclePlus, FileText, Star, History, Calendar, Clock, PawPrint, AlertCircle, Menu, X } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { ROUTES } from '../../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggleSidebar } = useSidebar();

  const menuItems = [
    { icon: <UserRound size={20} />, label: 'Προφίλ', route: ROUTES.vet.profile },
    { icon: <House size={20} />, label: 'Αρχική Ιδιοκτήτη', route: ROUTES.vet.dashboard },
    { icon: <CirclePlus size={20} />, label: 'Καταγραφή', route: ROUTES.vet.registerpet },
    { icon: <FileText size={20} />, label: 'Ιατρικές Πράξεις', route: ROUTES.vet.operation },
    { icon: <Star size={20} />, label: 'Αξιολογήσεις', route: ROUTES.vet.reviews },
    { icon: <History size={20} />, label: 'Ιστορικό', route: ROUTES.vet.history },
    { icon: <Calendar size={20} />, label: 'Ραντεβού', route: ROUTES.vet.appointments },
    { icon: <Clock size={20} />, label: 'Διαθεσιμότητα', route: ROUTES.vet.availability },
    { icon: <PawPrint size={20} />, label: 'Συμβάντα Ζωής', route: ROUTES.vet.lifeEvents },
    { icon: <AlertCircle size={20} />, label: 'Απώλεια', route: ROUTES.vet.lostPetForm },
  ];

  const isActive = (route) => {
    return location.pathname === route;
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="sidebar__toggle" 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
        <div className="sidebar__container">
          <nav className="sidebar__nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar__item ${isActive(item.route) ? 'sidebar__item--active' : ''}`}
                onClick={() => navigate(item.route)}
                title={item.label}
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
