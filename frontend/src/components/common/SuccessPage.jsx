import React from 'react';
import { UserRound } from 'lucide-react';
import PageLayout from '../global/layout/PageLayout';
import './SuccessPage.css';

const SuccessPage = ({ 
  icon: Icon = UserRound, 
  title = 'Επιτυχία!',
  description = 'Η ενέργεια ολοκληρώθηκε με επιτυχία.',
  buttonText = 'Επιστροφή',
  onButtonClick,
  iconColor = '#FCA47C',
  iconBgColor = '#ffd8c6',
  breadcrumbs = [],
  pageTitle = ''
}) => {
  return (
    <PageLayout title={pageTitle} breadcrumbs={breadcrumbs}>
      <div className="success-page">
        <div className="success-page__content">
          <div 
            className="success-page__icon"
            style={{ 
              backgroundColor: iconBgColor,
              borderColor: iconColor,
              color: iconColor
            }}
          >
            <Icon size={54} />
          </div>
          <h1 className="success-page__title">{title}</h1>
          <p className="success-page__description">{description}</p>
          <button 
            className="success-page__btn"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SuccessPage;
