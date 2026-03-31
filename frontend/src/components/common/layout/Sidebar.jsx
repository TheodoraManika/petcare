import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, CirclePlus, ArrowLeftRight, HandHeart, FileText, Star, History, Calendar, Clock, PawPrint, AlertCircle, Menu, X, ChevronDown, ChevronUp, Heart, Search, CircleCheckBig, BookOpen, Stethoscope } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { ROUTES } from '../../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ variant = 'vet' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggleSidebar } = useSidebar();
  const [isLifeEventsOpen, setIsLifeEventsOpen] = useState(false);

  // Vet sidebar: split into pet-related and vet-management sections
  const vetPetItems = [
    { icon: <House size={20} />, label: 'Αρχική Κτηνιάτρου', route: ROUTES.vet.dashboard },
    { icon: <BookOpen size={20} />, label: 'Βιβλιάριο Υγείας', route: ROUTES.vet.healthBook },
    { icon: <CirclePlus size={20} />, label: 'Καταγραφή', route: ROUTES.vet.registerpet },
    { icon: <FileText size={20} />, label: 'Ιατρικές Πράξεις', route: ROUTES.vet.operation },
    { icon: <AlertCircle size={20} />, label: 'Δήλωση Απώλειας', route: ROUTES.vet.lostPetForm },
    { 
      icon: <PawPrint size={20} />, 
      label: 'Συμβάντα Ζωής', 
      route: ROUTES.vet.lifeEvents,
      isDropdown: true,
      subItems: [
        { icon: <ArrowLeftRight size={14} />, label: 'Μεταβίβαση', route: ROUTES.vet.transfer },
        { icon: <Heart size={14} />, label: 'Υιοθεσία', route: ROUTES.vet.adoption },
        { icon: <HandHeart size={14} />, label: 'Αναδοχή', route: ROUTES.vet.foster },
      ]
    },
  ];

  const vetPersonalItems = [
    { icon: <Calendar size={20} />, label: 'Διαχείριση Ραντεβού', route: ROUTES.vet.appointments },
    { icon: <Clock size={20} />, label: 'Διαθεσιμότητα', route: ROUTES.vet.availability },
    { icon: <Stethoscope size={20} />, label: 'Τιμοκατάλογος Υπηρεσιών', route: ROUTES.vet.services },
    { icon: <History size={20} />, label: 'Ιστορικό', route: ROUTES.vet.history },
    { icon: <Star size={20} />, label: 'Αξιολογήσεις', route: ROUTES.vet.reviews },
  ];

  const ownerMenuItems = [
    { icon: <House size={20} />, label: 'Αρχική Ιδιοκτήτη', route: ROUTES.owner.dashboard },
    { icon: <FileText size={20} />, label: 'Τα Κατοικίδιά μου', route: ROUTES.owner.pets },
    { icon: <Calendar size={20} />, label: 'Τα Ραντεβού μου', route: ROUTES.owner.appointments },
    { icon: <AlertCircle size={20} />, label: 'Δήλωση Απώλειας', route: ROUTES.owner.lostPetForm },
    { icon: <History size={20} />, label: 'Ιστορικό Δηλώσεων', route: ROUTES.owner.lostHistory },
  ];

  // For the vet variant, we use sections; for owner, a flat list
  const isVet = variant !== 'owner';
  const menuItems = isVet ? vetPetItems : ownerMenuItems;

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
        className={`sidebar__toggle ${variant === 'owner' ? 'sidebar__toggle--owner' : ''}`}
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${variant === 'owner' ? 'sidebar--owner' : ''} ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
        <div className="sidebar__container">
          <nav className="sidebar__nav">
            {isVet && <div className="sidebar__section-label">Για το Κατοικίδιο</div>}
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
                            <span className="sidebar__subitem-icon">{subItem.icon}</span>
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

            {isVet && (
              <>
                <div className="sidebar__section-label">Για Εμένα</div>
                {vetPersonalItems.map((item, index) => (
                  <button
                    key={`personal-${index}`}
                    className={`sidebar__item ${isActive(item.route) ? 'sidebar__item--active' : ''}`}
                    onClick={() => navigate(item.route)}
                    title={item.label}
                  >
                    <span className="sidebar__icon">{item.icon}</span>
                    <span className="sidebar__label">{item.label}</span>
                  </button>
                ))}
              </>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
