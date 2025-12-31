import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Star, Clock, AlertCircle, CheckCircle, History, CirclePlus, PawPrint } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { DashboardCard } from '../../components/vet/dashboard';
import { ROUTES, UK } from '../../utils/constants';
import './Dashboard.css';


// Dashboard page for vets

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: 'pet-registration',
      title: 'Καταγραφή Κατοικιδίου',
      description: 'Καταγραφή νέου κατοικιδίου',
      icon: <CirclePlus />,
      onClick: () => navigate(ROUTES.vet.register),
    },
    {
      id: 'pet-operation',
      title: 'Ιατρικές Πράξεις',
      description: 'Καταγραφή ιατρικών πράξεων',
      icon: <FileText />,
      onClick: () => navigate(ROUTES.vet.operation),
    },
    {
      id: 'vet-reviews',
      title: 'Αξιολογήσεις',
      description: 'Προβολή αξιολογήσεων πελατών',
      icon: <Star />,
      onClick: () => navigate(ROUTES.vet.reviews),
    },
    {
      id: 'history',
      title: 'Ιστορικό',
      description: 'Προβολή επισκέψεων, ιατρικών πράξεων και δηλώσεων',
      icon: <History />,
      onClick: () => navigate(ROUTES.vet.history),
    },
    {
      id: 'vet-appointments',
      title: 'Διαχείριση Ραντεβού',
      description: 'Προβολή και επεξεργασία ραντεβού',
      icon: <Calendar />,
      onClick: () => navigate(ROUTES.vet.appointments),
    },
    {
      id: 'vet-availability',
      title: 'Διαθεσιμότητα',
      description: 'Ορισμός ωραρίου για ραντεβού',
      icon: <Clock />,
      onClick: () => navigate(ROUTES.vet.availability),
    },
    {
      id: 'vet-life-event',
      title: 'Δηλώσεις Συμβάντων Ζωής',
      description: 'Μεταβίβαση, υιοθεσία, αναδοχή',
      icon: <PawPrint />,
      onClick: () => navigate(ROUTES.vet.lifeEvents),
    },
    {
      id: 'lost-declaration',
      title: 'Δήλωση Απώλειας',
      description: 'Δήλωση απώλειας ενός κατοικιδίου',
      icon: <AlertCircle />,
      onClick: () => navigate(ROUTES.vet.lostPetForm),
    },
    {
      id: 'found-declaration',
      title: 'Δήλωση Εύρεσης',
      description: 'Δήλωση εύρεσης ενός κατοικιδίου',
      icon: <CheckCircle />,
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