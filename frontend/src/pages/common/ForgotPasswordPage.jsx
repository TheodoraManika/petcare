import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/global/layout/PageLayout';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Παρακαλώ εισάγετε το email σας');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Παρακαλώ εισάγετε έγκυρη διεύθυνση email');
      return;
    }

    // Simulate sending reset instructions
    setError('');
    setMessage('Εισάγατε το email σας και θα σας στείλουμε οδηγίες για την ανάκτηση του κωδικού σας.');
    
    // In a real app, you would make an API call here
    console.log('Password reset requested for:', email);
  };

  return (
    <PageLayout title="Ανάκτηση Κωδικού" showBreadcrumbs={true} showNavbar={false} showFooter={false}>
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <h2 className="forgot-password-title">Ξέχασατε τον κωδικό σας;</h2>
          <p className="forgot-password-subtitle">
            Εισάγατε το email σας και θα σας στείλουμε οδηγίες για την ανάκτηση του κωδικού σας.
          </p>

          {/* Form */}
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && <div className="forgot-password-error">{error}</div>}
            
            {/* Success Message */}
            {message && <div className="forgot-password-success">{message}</div>}

            {/* Email Field */}
            <div className="forgot-password-form-group">
              <label htmlFor="email" className="forgot-password-label">Email</label>
              <div className="forgot-password-input-wrapper">
                <Mail className="forgot-password-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  className="forgot-password-input"
                  placeholder="Εισάγατε το email σας"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="forgot-password-button">
              Αποστολή Οδηγιών
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="forgot-password-back">
            <Link to={ROUTES.login} className="forgot-password-back-link">
              <ArrowLeft size={16} />
              Επιστροφή στη Σύνδεση
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ForgotPasswordPage;
