import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Heart, HandHeart } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './LifeEvents.css';

const LifeEvents = () => {
  const navigate = useNavigate();

  const events = [
    {
      id: 'transfer',
      icon: <ArrowRightLeft size={40} />,
      title: 'Δήλωση Μεταβίβασης',
      description: 'Δήλωση Μεταβίβασης ενός κατοικιδίου',
      route: ROUTES.vet.transfer
    },
    {
      id: 'death',
      icon: <Heart size={40} />,
      title: 'Δήλωση Υιοθεσίας',
      description: 'Δήλωση Υιοθεσίας ενός κατοικιδίου',
      route: ROUTES.vet.adoption
    },
    {
      id: 'adoption',
      icon: <HandHeart size={40} />,
      title: 'Δήλωση Αναδοχής',
      description: 'Δήλωση Αναδοχής ενός κατοικιδίου',
      route: ROUTES.vet.foster
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  const breadcrumbItems = [];

  return (
    <PageLayout title="Δηλώσεις Συμβάντων Ζωής" breadcrumbs={breadcrumbItems}>
      <div className="life-events">
        <div className="life-events__header">
          <h1 className="life-events__title">Δηλώσεις Συμβάντων Ζωής</h1>
        </div>

        <div className="life-events__grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="life-events__card"
              onClick={() => handleCardClick(event.route)}
            >
              <div className="life-events__card-icon">
                {event.icon}
              </div>
              <h2 className="life-events__card-title">{event.title}</h2>
              <p className="life-events__card-description">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default LifeEvents;
