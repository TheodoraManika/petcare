import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, UserRound, CirclePlus, FileText, Star, History, Calendar, Clock, PawPrint, AlertCircle, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { ROUTES } from '../../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggleSidebar } = useSidebar();
  const [isLifeEventsOpen, setIsLifeEventsOpen] = useState(false);

  const menuItems = [
    { icon: <UserRound size={20} />, label: 'Προφίλ', route: ROUTES.vet.profile },
    { icon: <House size={20} />, label: 'Αρχική Ιδιοκτήτη', route: ROUTES.vet.dashboard },
    { icon: <CirclePlus size={20} />, label: 'Καταγραφή', route: ROUTES.vet.registerpet },
    { icon: <FileText size={20} />, label: 'Ιατρικές Πράξεις', route: ROUTES.vet.operation },
    { icon: <Star size={20} />, label: 'Αξιολογήσεις', route: ROUTES.vet.reviews },
    { icon: <History size={20} />, label: 'Ιστορικό', route: ROUTES.vet.history },
    { icon: <Calendar size={20} />, label: 'Ραντεβού', route: ROUTES.vet.appointments },
    { icon: <Clock size={20} />, label: 'Διαθεσιμότητα', route: ROUTES.vet.availability },
    { 
      icon: <PawPrint size={20} />, 
      label: 'Συμβάντα Ζωής', 
      route: ROUTES.vet.lifeEvents,
      isDropdown: true,
      subItems: [
        { label: 'Μεταβίβαση', route: ROUTES.vet.transfer },
        { label: 'Υιοθεσία', route: ROUTES.vet.adoption },
        { label: 'Αναδοχή', route: ROUTES.vet.foster },
      ]
    },
    { icon: <AlertCircle size={20} />, label: 'Απώλεια', route: ROUTES.vet.lostPetForm },
  ];

  const isActive = (route) => {
    return location.pathname === route;
  };

  const isLifeEventActive = () => {
    return location.pathname === ROUTES.vet.lifeEvents ||
           location.pathname === ROUTES.vet.transfer || 
           location.pathname === ROUTES.vet.adoption || 
           location.pathname === ROUTES.vet.foster;
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
              <div key={index}>
                {item.isDropdown ? (
                  <div 
                    onMouseEnter={() => setIsLifeEventsOpen(true)}
                    onMouseLeave={() => setIsLifeEventsOpen(false)}
                  >
                    <button
                      className={`sidebar__item ${isLifeEventActive() ? 'sidebar__item--active' : ''}`}
                      onClick={() => navigate(item.route)}
                      title={item.label}
                    >
                      <span className="sidebar__icon">{item.icon}</span>
                      <span className="sidebar__label">{item.label}</span>
                      <span className="sidebar__chevron">
                        {isLifeEventsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {isLifeEventsOpen && (
                      <div className="sidebar__submenu">
                        {item.subItems.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            className={`sidebar__subitem ${isActive(subItem.route) ? 'sidebar__subitem--active' : ''}`}
                            onClick={() => navigate(subItem.route)}
                            title={subItem.label}
                          >
                            <span className="sidebar__label">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className={`sidebar__item ${isActive(item.route) ? 'sidebar__item--active' : ''}`}
                    onClick={() => navigate(item.route)}
                    title={item.label}
                  >
                    <span className="sidebar__icon">{item.icon}</span>
                    <span className="sidebar__label">{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
