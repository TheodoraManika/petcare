import React, { useState } from 'react';
import './ContactPage.css';
import PageLayout from '../../../components/common/layout/PageLayout';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send form data to backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <PageLayout title="Επικοινωνία">
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-header">
            <h1 className="contact-title">Επικοινωνήστε μαζί μας</h1>
            <p className="contact-subtitle">
              Είμαστε εδώ για να σας βοηθήσουμε! Συμπληρώστε τη φόρμα επικοινωνίας ή χρησιμοποιήστε τα στοιχεία επικοινωνίας παρακάτω.
            </p>
          </div>

          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="section-title">Φόρμα Επικοινωνίας</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Όνοματεπώνυμο *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Το όνομά σας"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Τηλέφωνο
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="210 1234567"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Θέμα *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Θέμα"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Μήνυμα *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Γράψτε το μήνυμά σας εδώ..."
                    className="form-input form-textarea"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit">
                  Αποστολή Μηνύματος
                </button>

                {isSubmitted && (
                  <div className="success-message">
                    ✓ Το μήνυμά σας έχει αποσταλεί με επιτυχία!
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2 className="section-title">Στοιχεία Επικοινωνίας</h2>

              <div className="contact-info-card">
                <div className="info-item">
                  <div className="info-icon email-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <p className="info-label">Email</p>
                    <p className="info-text">info@petcare.gr</p>
                    <p className="info-text">support@petcare.gr</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon phone-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <p className="info-label">Τηλέφωνο</p>
                    <p className="info-text">210 1234567</p>
                    <p className="info-text">Κινητό: 694 1234567</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon location-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <p className="info-label">Διεύθυνση</p>
                    <p className="info-text">Λ. Κατσιγιάννη 123</p>
                    <p className="info-text">117 45, Αθήνα, Ελλάδα</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon hours-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <p className="info-label">Ώρες Λειτουργίας</p>
                    <p className="info-text">Δευτέρα - Παρασκευή: 09:00 - 18:00</p>
                    <p className="info-text">Σάββατο: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h3 className="social-title">Χρήσιμοι Σύνδεσμοι</h3>
                <div className="social-buttons">
                  <a href="#" className="social-btn facebook-btn">
                    Σελίδα Facebook
                  </a>
                  <a href="#" className="social-btn instagram-btn">
                    Σελίδα Instagram
                  </a>
                  <a href="#" className="social-btn twitter-btn">
                    Σελίδα Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
