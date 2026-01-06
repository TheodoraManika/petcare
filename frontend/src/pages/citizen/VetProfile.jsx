import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './VetProfile.css';

const mockVets = {
  1: {
    id: 1,
    name: 'Μαρία Παπαπολιτάκου',
    specialty: 'Γενικός Κτηνίατρος',
    rating: 4.8,
    reviewCount: 124,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150',
    address: 'Πανεπιστημίου 45, 10679',
    phone: '210 1234567',
    email: 'info@vetcare.gr',
    workingHours: 'Δευτέρα - Παρασκευή, 09:00 - 18:00',
    specializations: [
      'Γενική Κτηνιατρική',
      'Χειρουργική',
      'Οδοντιατρική'
    ],
    biography: 'Εξειδικευμένη στη γενική κτηνιατρική με διαρκεί την πρακτική εργασία. Έχω μεγάλη δυνατότητα αντιμετώπισης, επιστημών, ιδιοτήτων και γενικού σχολείου.',
    reviews: [
      {
        id: 1,
        author: 'Μαρία Κ.',
        rating: 5,
        text: 'Εξαιρετική εξυπηρέτηση! Πολύ προσεκτική και συμπαθητική προς το κατοικίδιό μου.'
      },
      {
        id: 2,
        author: 'Παναγιώτης Π.',
        rating: 4,
        text: 'Πολύ καλή εμπειρία, ωστόσο αρκετά περιορισμένη. Σαφώς επαγγελματική.'
      },
      {
        id: 3,
        author: 'Αλέξανδρος Σ.',
        rating: 5,
        text: 'Πολύ κατανοητική και αποτελεσματική. Σίγουρα θα επιστρέψω.'
      }
    ],
    appointmentInfo: 'Το κάμπι Κλείσιμο Ραντεβού δεν ευμάθειστα επιπλέες γιατί θέλησαν να κλείσουν ραντεβού μήνο σε ώδόσα ώδη κ.λ.π.'
  }
};

const VetProfile = () => {
  const { vetId = 1 } = useParams();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const vet = mockVets[vetId] || mockVets[1];
  const displayedReviews = showAllReviews ? vet.reviews : vet.reviews.slice(0, 2);

  const breadcrumbItems = [
    { label: 'Αναζήτηση Κτηνιάτρων', path: ROUTES.citizen.searchMap },
  ];

  return (
    <PageLayout title={`Δρ. ${vet.name}`} breadcrumbs={breadcrumbItems}>
      <div className="vet-profile">
        {/* Main Content */}
        <div className="vet-profile-container">
          {/* Header Section */}
          <div className="vet-header">
            <div className="vet-avatar">
              <img src={vet.avatar} alt={vet.name} />
            </div>
            <div className="vet-header-info">
              <h1 className="vet-name">Δρ. {vet.name}</h1>
              <p className="vet-specialty">{vet.specialty}</p>
              <div className="vet-rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(vet.rating) ? '#FCA47C' : '#e5e7eb'}
                      color={i < Math.floor(vet.rating) ? '#FCA47C' : '#e5e7eb'}
                    />
                  ))}
                </div>
                <span className="rating-value">{vet.rating}</span>
                <span className="rating-count">({vet.reviewCount} αξιολογήσεις)</span>
              </div>
            </div>

          </div>

          <div className="vet-profile-content">
            {/* Contact Information */}
            <div className="info-section">
              <h2 className="section-title">Δεδομένων Επαφής</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Διεύθυνση</p>
                    <p className="contact-value">{vet.address}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Phone size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Τηλέφωνο</p>
                    <p className="contact-value">{vet.phone}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Clock size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Ώρες Λειτουργίας</p>
                    <p className="contact-value">{vet.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="info-section">
              <h2 className="section-title">Ειδικότητες</h2>
              <div className="specializations">
                {vet.specializations.map((spec, idx) => (
                  <span key={idx} className="specialization-tag">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Biography */}
            <div className="info-section">
              <h2 className="section-title">Βιογραφία</h2>
              <p className="biography-text">{vet.biography}</p>
            </div>

            {/* Reviews */}
            <div className="info-section">
              <h2 className="section-title">Αξιολογήσεις Πελατών</h2>
              <div className="reviews-list">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div>
                        <h4 className="review-author">{review.author}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < review.rating ? '#FCA47C' : '#e5e7eb'}
                              color={i < review.rating ? '#FCA47C' : '#e5e7eb'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
              {vet.reviews.length > 2 && (
                <button
                  className="load-more-btn"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? 'Απόκρυψη' : 'Φόρτωση περισσοτέρων'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetProfile;
