import React, { useState } from 'react';
import './VetProfile.css';
import { Star, MapPin, GraduationCap, Briefcase, Clock } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';

const VetProfile = () => {
  const [visibleReviews, setVisibleReviews] = useState(3);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  };

  const currentUser = getCurrentUser();
  const isOwner = currentUser?.userType === 'owner' || currentUser?.role === 'owner';

  // Sample vet data - this would typically come from props or API
  const vetData = {
    name: 'Δρ. Γιώργος Αντωνίου',
    specialty: 'Γενική Κτηνιατρική',
    rating: 4.8,
    reviewCount: 127,
    address: 'Λεωφόρος Συγγρού 123, Αθήνα',
    phone: '+30 210 1234567',
    education: 'Διδάκτορας Κτηνιατρικής, Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης',
    experience: '15 χρόνια',
    hours: {
      weekdays: 'Δευτέρα - Παρασκευή: 09:00 - 18:00',
      saturday: 'Σάββατο: 10:00 - 14:00',
      sunday: 'Κυριακή: Κλειστά'
    },
    biography: 'Ειδικεύομαι στην προληπτική ιατρική, εμβολιασμούς, αποπαρασίτωση και στειρώσεις. Με πάνω από 15 χρόνια εμπειρίας στην κτηνιατρική φροντίδα, προσφέρω ολοκληρωμένες υπηρεσίες για τα κατοικίδιά σας. Η φιλοσοφία μου βασίζεται στην προσεκτική διάγνωση, τη σύγχρονη θεραπεία και την ενσυναίσθητη φροντίδα των ζώων.',
    profileImage: '/api/placeholder/120/120',
    reviews: [
      {
        id: 1,
        author: 'Μαρία Κ.',
        rating: 5,
        comment: 'Εξαιρετικός επαγγελματίας! Ο γιατρός είναι πολύ προσεκτικός και ενδιαφέρεται πραγματικά για την υγεία των ζώων. Το σκυλάκι μου ένιωσε άνετα από την πρώτη επίσκεψη.'
      },
      {
        id: 2,
        author: 'Νίκος Π.',
        rating: 5,
        comment: 'Πολύ καλή εξυπηρέτηση και καθαρό ιατρείο. Οι τιμές είναι λογικές και ο γιατρός πολύ εξηγητικός. Σίγουρα θα επιστρέψω για τον επόμενο εμβολιασμό.'
      },
      {
        id: 3,
        author: 'Ελένη Σ.',
        rating: 4,
        comment: 'Πολύ ικανοποιημένη από τη φροντίδα που έλαβε η γάτα μου. Μόνο μικρή καθυστέρηση στο ραντεβού, αλλά συνολικά εξαιρετική εμπειρία.'
      },
      {
        id: 4,
        author: 'Κώστας Μ.',
        rating: 5,
        comment: 'Άριστος κτηνίατρος με πολλή υπομονή και γνώση. Μας βοήθησε να αντιμετωπίσουμε ένα σοβαρό πρόβλημα υγείας του σκύλου μας.'
      },
      {
        id: 5,
        author: 'Σοφία Τ.',
        rating: 5,
        comment: 'Εξαιρετική εμπειρία! Το προσωπικό είναι φιλικό και ο γιατρός πολύ επαγγελματίας. Συνιστώ ανεπιφύλακτα!'
      }
    ]
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16}
          className={i <= rating ? "star-filled" : "star-empty"}
          fill={i <= rating ? "currentColor" : "none"}
        />
      );
    }
    return stars;
  };

  const handleLoadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 3, vetData.reviews.length));
  };

  return (
    <PageLayout 
      variant="citizen"
      title={vetData.name}
      breadcrumbs={[
        { label: 'Κτηνίατροι', path: '/citizen/search-map' }
      ]}
    >
      <div className="vet-profile-container">
        <div className="vet-profile-card">
          {/* Header Section */}
          <div className="profile-header">
          <div className="profile-header-content">
            <img 
              src={vetData.profileImage} 
              alt={vetData.name}
              className="profile-image"
            />
            <div className="profile-identity">
              <h1 className="vet-name">{vetData.name}</h1>
              <p className="vet-specialty">{vetData.specialty}</p>
              <div className="rating-section">
                <div className="stars">
                  {renderStars(Math.floor(vetData.rating))}
                </div>
                <span className="rating-text">
                  {vetData.rating} ({vetData.reviewCount} αξιολογήσεις)
                </span>
              </div>
            </div>
            {isOwner && (
              <button className="book-appointment-btn">
                Κλείστε Ραντεβού
              </button>
            )}
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="professional-details">
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-header">
                <MapPin className="detail-icon" size={20} />
                <h3>Διεύθυνση Ιατρείου</h3>
              </div>
              <p className="detail-content">{vetData.address}</p>
              <p className="detail-content">{vetData.phone}</p>
            </div>

            <div className="detail-item">
              <div className="detail-header">
                <Briefcase className="detail-icon" size={20} />
                <h3>Εμπειρία</h3>
              </div>
              <p className="detail-content">{vetData.experience}</p>
            </div>

            <div className="detail-item">
              <div className="detail-header">
                <GraduationCap className="detail-icon" size={20} />
                <h3>Εκπαίδευση</h3>
              </div>
              <p className="detail-content">{vetData.education}</p>
            </div>

            <div className="detail-item">
              <div className="detail-header">
                <Clock className="detail-icon" size={20} />
                <h3>Ωράριο</h3>
              </div>
              <p className="detail-content">{vetData.hours.weekdays}</p>
              <p className="detail-content">{vetData.hours.saturday}</p>
              <p className="detail-content">{vetData.hours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="biography-section">
          <h2 className="section-title">Βιογραφικό</h2>
          <p className="biography-content">{vetData.biography}</p>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="section-title">Κριτικές Πελατών</h2>
          <div className="reviews-list">
            {vetData.reviews.slice(0, visibleReviews).map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>
                  <span className="review-author">{review.author}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
          {visibleReviews < vetData.reviews.length && (
            <button 
              className="load-more-btn"
              onClick={handleLoadMore}
            >
              Φόρτωση περισσότερων
            </button>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetProfile;