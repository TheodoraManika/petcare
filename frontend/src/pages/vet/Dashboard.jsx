import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Clock, AlertCircle, CheckCircle, History, Plus, PawPrint } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { DashboardCard } from '../../components/vet/dashboard';
import { ROUTES, UK } from '../../utils/constants';
import './Dashboard.css';

/**
 * Dashboard page for vets
 */
const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: 'pet-registration',
      title: 'Καταγραφή Κατοικιδίου',
      description: 'Καταγραφή νέου κατοικιδίου',
      icon: <Plus />,
      iconVariant: 'primary',
      onClick: () => navigate(ROUTES.vet.register),
    },
    {
      id: 'pet-operation',
      title: 'Ιατρικές Πράξεις',
      description: 'Καταγραφή ιατρικών πράξεων',
      icon: <FileText />,
      iconVariant: 'primary',
      onClick: () => navigate(ROUTES.vet.operations),
    },
    {
      id: 'vet-reviews',
      title: 'Αξιολογήσεις',
      description: 'Προβολή αξιολογήσεων πελατών',
      icon: <FileText />,
      iconVariant: 'primary',
      onClick: () => navigate(ROUTES.vet.reviews),
    },
    {
      id: 'history',
      title: 'Ιστορικό',
      description: 'Προβολή επισκέψεων, ιατρικών πράξεων και δηλώσεων',
      icon: <History />,
      iconVariant: 'info',
      onClick: () => navigate(ROUTES.vet.history),
    },
    {
      id: 'vet-appointments',
      title: 'Διαχείριση Ραντεβού',
      description: 'Προβολή και επεξεργασία ραντεβού',
      icon: <Calendar />,
      iconVariant: 'success',
      onClick: () => navigate(ROUTES.vet.appointments),
    },
    {
      id: 'vet-availability',
      title: 'Διαθεσιμότητα',
      description: 'Ορισμός ωραρίου για ραντεβού',
      icon: <Clock />,
      iconVariant: 'success',
      onClick: () => navigate(ROUTES.vet.availability),
    },
    {
      id: 'vet-life-event',
      title: 'Δηλώσεις Συμβάντων Ζωής',
      description: 'Μεταβίβαση, υιοθεσία, αναδοχή',
      icon: <PawPrint />,
      iconVariant: 'success',
      onClick: () => navigate(ROUTES.vet.lifeEvent),
    },
    {
      id: 'lost-declaration',
      title: 'Δήλωση Απώλειας',
      description: 'Δήλωση απώλειας ενός κατοικιδίου',
      icon: <AlertCircle />,
      iconVariant: 'info',
      onClick: () => navigate(ROUTES.vet.lostPetForm),
    },
    {
      id: 'found-declaration',
      title: 'Δήλωση Εύρεσης',
      description: 'Δήλωση εύρεσης ενός κατοικιδίου',
      icon: <CheckCircle />,
      iconVariant: 'success',
      onClick: () => navigate(ROUTES.vet.foundPetForm),
    },
  ];

  return (
    <PageLayout title="Μενού">
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