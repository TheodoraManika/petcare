import React from 'react';
import { Search, FileText, CheckCircle2, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './InformationPage.css';
import PageLayout from '../../../components/common/layout/PageLayout';

const InformationPage = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWork = () => {
    navigate('/citizen');
  };
  const cards = [
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Χαμένων Κατοικιδίων',
      description: 'Αναζητήστε χαμένα κατοικίδια και βοηθήστε τους ιδιοκτήτες τους να τα εντοπίσουν.',
      features: [
        'Πρόβλημα λεπτομερειών κατοικιδίων',
        'Πρόβλημα στοιχείων ιδιοκτήτη για επικοινωνία',
        'Κατάλληλα φίλτρα για διευκόλυνση της αναζήτησης'
      ]
    },
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Αναζητήστε με βάση την περιοχή, την ειδικότητα, τη διαθεσιμότητα και τις αξιολογήσεις άλλων ιδιοκτητών.',
      features: [
        'Πρόβλημα λεπτομερειών κτηνιάτρων',
        'Πρόβλημα προφίλ και αξιολογήσεων'
      ]    },
    {
      icon: <FileText size={32} />,
      title: 'Δηλώσεις Εύρεσης Κατοικιδίου',
      description: 'Δηλώστε όμως την εύρεση ένος κατοικιδίου για να το βοηθήσετε να επανενωθεί με τους ιδιοκτήτες του. Οι δηλώσεις είναι ορατές σε όλους τους χρήστες του ιστοχώρου.',
      features: []    }
  ];

  return (
    <PageLayout title="Γενικές Πληροφορίες">
      <div className="information-page">
        <div className="cards-container">
          {cards.map((card, idx) => (
            <div key={idx} className="info-card">
              <div className="card-icon-wrapper">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p className="card-description">{card.description}</p>
              <div className="card-items">
                {card.features.map((feature, i) => (
                  <div key={i} className="card-item">
                    <CheckCircle2 size={20} className="checkmark-icon" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contents Section */}
        <section className="help-section">
          <div className="help-box">
            <h2>Περιεχόμενα</h2>
            <ul className="contents-list">
              <li><a href="#lost-pets">Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</a></li>
              <li><a href="#vets">Πώς μπορώ να αναζητήσω κτηνιάτρους;</a></li>
              <li><a href="#found-pet">Πώς μπορώ να κάνω δήλωση εύρεσης για ένα κατοικίδιο που βρήκα;</a></li>
            </ul>
          </div>

          {/* Lost Pets Section */}
          <div className="help-box" id="lost-pets">
            <h2>Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</h2>
            <ol className="help-steps">
              <li>
                <span className="step-number">1</span>
                <div className="step-content">
                  <p><strong>Επιλέξτε "Χαμένα Κατοικίδια" από τη γραμμή πλοήγησης</strong></p>
                  <p>Στη γραμμή πλοήγησης βρίσκονται όλες οι λειτουργίες που μπορείτε να κάνετε στον ιστοχώρο.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div className="step-content">
                  <p><strong>Κάντε την αναζήτησή σας</strong></p>
                  <p>Επιλέξτε τα κατάλληλα φίλτρα με βάση την αναζήτηση που θέλετε να κάνετε. Αν θέλετε να δείτε λεπτομερίες σχετικά με κάποιο κατοικίδιο πατήστε το κουμπί "Προβολή Λεπτομερειών".</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div className="step-content">
                  <p><strong>Βρήκατε ένα συγκεκριμένο κατοικίδιο;</strong></p>
                  <p>Πατήστε το κουμπί "Το Βρήκα - Δήλωση Εύρεσης" από τις λεπτομέριες του κατοικιδίου και συμπληρώστε τη φόρμα.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Vets Section */}
          <div className="help-box" id="vets">
            <h2>Πώς μπορώ να αναζητήσω κτηνιάτρους;</h2>
            <ol className="help-steps">
              <li>
                <span className="step-number">1</span>
                <div className="step-content">
                  <p><strong>Επιλέξτε "Κτηνίατροι" από τη γραμμή πλοήγησης</strong></p>
                  <p>Στη γραμμή πλοήγησης βρίσκονται όλες οι λειτουργίες που μπορείτε να κάνετε στον ιστοχώρο.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div className="step-content">
                  <p><strong>Κάντε την αναζήτησή σας</strong></p>
                  <p>Επιλέξτε τα κατάλληλα φίλτρα με βάση την αναζήτηση που θέλετε να κάνετε. Αν θέλετε να δείτε λεπτομερίες σχετικά με κάποιον κτηνίατρο πατήστε το κουμπί "Προβολή Προφίλ".</p>
                </div>
              </li>
            </ol>
            <div className="info-note">
              <strong>Σημείωση!</strong>
              {' '}Ραντεβού με κτηνιάτρους μπορούν να κλείσουν μόνο οι χρήστες που έχουν επιλέξει λαχυτηρό ως ειδικότης κατοικιδίων και είναι συνδεδεμένοι.
            </div>
          </div>

          {/* Found Pet Section */}
          <div className="help-box" id="found-pet">
            <h2>Πώς μπορώ να κάνω δήλωση εύρεσης για ένα κατοικίδιο που βρήκα;</h2>
            <ol className="help-steps">
              <li>
                <span className="step-number">1</span>
                <div className="step-content">
                  <p><strong>Επιλέξτε "Δήλωση Εύρεσης" από τη γραμμή πλοήγησης</strong></p>
                  <p>Στη γραμμή πλοήγησης βρίσκονται όλες οι λειτουργίες που μπορείτε να κάνετε στον ιστοχώρο.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div className="step-content">
                  <p><strong>Συμπληρώστε τη δήλωση</strong></p>
                  <p>Συμπληρώστε τη φόρμα και πατήστε "Υποβολή Δήλωσης Εύρεσης" για να ανεβάσετε ή "Ακύρωση" αν δε θέλετε τελικά να υποβάλλετε τη δήλωση.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Back to Home Button */}
          <div className="button-container">
            <button className="back-home-button" onClick={handleStartWork}>Μετάβαση στην Αρχική</button>
            <button className="scroll-to-top-button" onClick={scrollToTop}>
              <ArrowUp size={24} />
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default InformationPage;
