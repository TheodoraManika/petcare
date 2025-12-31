import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Search, AlertCircle, CheckCircle, History } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { DashboardCard } from '../../components/owner/dashboard';
import { ROUTES, UK } from '../../utils/constants';
import './Dashboard.css';

/**
 * Dashboard page for pet owners
 */
const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: 'health-book',
      title: 'Βιβλιάριο Υγείας',
      description: 'Προβολή στοιχείων κατοικιδίων',
      icon: <FileText />,
      iconVariant: 'primary',
      onClick: () => navigate(ROUTES.owner.pets),
    },
    {
      id: 'appointments',
      title: 'Τα Ραντεβού μου',
      description: 'Διαχείριση ραντεβού',
      icon: <Calendar />,
      iconVariant: 'success',
      onClick: () => navigate(ROUTES.owner.appointments),
    },
    {
      id: 'search-vets',
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Αναζήτηση επαγγελματιών κτηνιάτρων',
      icon: <Search />,
      iconVariant: 'primary',
      onClick: () => navigate(ROUTES.owner.pets),
    },
    {
      id: 'lost-declaration',
      title: 'Δήλωση Απώλειας',
      description: 'Δήλωση απώλειας ενός κατοικιδίου',
      icon: <AlertCircle />,
      iconVariant: 'info',
      onClick: () => navigate(ROUTES.owner.lostPetForm),
    },
    {
      id: 'found-declaration',
      title: 'Δήλωση Εύρεσης',
      description: 'Δήλωση εύρεσης ενός κατοικιδίου',
      icon: <CheckCircle />,
      iconVariant: 'success',
      onClick: () => navigate(ROUTES.owner.lostPetForm),
    },
    {
      id: 'history',
      title: 'Ιστορικό Δηλώσεων',
      description: 'Προβολή και επεξεργασία των δηλώσεων σας',
      icon: <History />,
      iconVariant: 'info',
      onClick: () => navigate(ROUTES.owner.lostHistory),
    },
  ];

  return (
    <PageLayout title="Μενού" variant="owner">
      <div className="dashboard">
        <div className="dashboard__cards">
          {dashboardCards.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              iconVariant={card.iconVariant}
              onClick={card.onClick}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
