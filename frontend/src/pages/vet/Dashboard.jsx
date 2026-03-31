import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Star, Clock, AlertCircle, CheckCircle, History, CirclePlus, PawPrint, BookOpen, Stethoscope } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import { DashboardCard } from '../../components/vet/dashboard';
import { ROUTES } from '../../utils/constants';
import './Dashboard.css';


// Dashboard page for vets

const Dashboard = () => {
  const navigate = useNavigate();

  const petCards = [
    {
      id: 'pet-registration',
      title: 'Καταγραφή Κατοικιδίου',
      description: 'Καταγραφή νέου κατοικιδίου',
      icon: <CirclePlus />,
      onClick: () => navigate(ROUTES.vet.registerpet),
    },
    {
      id: 'pet-operation',
      title: 'Ιατρικές Πράξεις',
      description: 'Καταγραφή ιατρικών πράξεων',
      icon: <FileText />,
      onClick: () => navigate(ROUTES.vet.operation),
    },
    {
      id: 'health-book',
      title: 'Βιβλιάριο Υγείας',
      description: 'Προβολή και εκτύπωση του βιβλιαρίου υγείας ενός κατοικιδίου',
      icon: <BookOpen />,
      onClick: () => navigate(ROUTES.vet.healthBook),
    },
    {
      id: 'lost-declaration',
      title: 'Δήλωση Απώλειας',
      description: 'Δήλωση απώλειας ενός κατοικιδίου',
      icon: <AlertCircle />,
      onClick: () => navigate(ROUTES.vet.lostPetForm),
    },
    {
      id: 'vet-life-event',
      title: 'Δηλώσεις Συμβάντων Ζωής',
      description: 'Μεταβίβαση, υιοθεσία, αναδοχή',
      icon: <PawPrint />,
      onClick: () => navigate(ROUTES.vet.lifeEvents),
    },
  ];

  const vetCards = [
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
      id: 'vet-services',
      title: 'Υπηρεσίες & Τιμοκατάλογος',
      description: 'Επιλογή παρεχόμενων υπηρεσιών και τιμών',
      icon: <Stethoscope />,
      onClick: () => navigate(ROUTES.vet.services),
    },
    {
      id: 'vet-reviews',
      title: 'Αξιολογήσεις',
      description: 'Προβολή αξιολογήσεων πελατών',
      icon: <Star />,
      onClick: () => navigate(ROUTES.vet.reviews),
    },
  ];

  return (
    <PageLayout title="Αρχική Κτηνιάτρου" showBreadcrumbs={false}>
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Αρχική Κτηνιάτρου</h1>
        </div>

        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Ενέργειες για το Κατοικίδιο</h2>
          <div className="dashboard__cards">
            {petCards.map((card) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                onClick={card.onClick}
              />
            ))}
          </div>
        </section>

        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Ενέργειες για τον Κτηνίατρο</h2>
          <div className="dashboard__cards">
            {vetCards.map((card) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                onClick={card.onClick}
              />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Dashboard;