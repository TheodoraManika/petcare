import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/common/layout/PageLayout';
import './ConfirmationPage.css';
import { CheckCircle } from 'lucide-react';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    title = 'Επιτυχής ενέργεια',
    message = '',
    buttonText = 'Επιστροφή στην Αρχική',
    buttonTo = ROUTES.home,
    icon = <CheckCircle size={56} />,
  } = (location && location.state) || {};

  return (
    <PageLayout title={title}>
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            {icon}
          </div>
          <h2 className="confirmation-title">{title}</h2>
          {message && <p className="confirmation-message">{message}</p>}
          <button
            className="confirmation-btn"
            onClick={() => navigate(buttonTo, { replace: true })}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ConfirmationPage;