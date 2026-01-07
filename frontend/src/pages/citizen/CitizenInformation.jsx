import React from 'react';
import { Book, Search, FileCheck, Heart, ArrowUp, CheckCircle2, SquareCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CitizenInformation.css';
import PageLayout from '../../components/global/layout/PageLayout';

const CitizenInformation = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Χαμένων Κατοικιδίων',
      description: 'Ψάξτε για χαμένα κατοικίδια που έχουν δηλωθεί από τους ιδιοκτήτες τους. Δείτε περιγραφές, φωτογραφίες και στοιχεία επικοινωνίας των ιδιοκτητών.',
      features: [
        'Αναζήτηση ανά περιοχή',
        'Φιλτράρισμα ανά είδος κατοικιδίου',
        'Άμεση επικοινωνία με τους ιδιοκτήτες'
      ]
    },
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Βρείτε κατάλληλους κτηνιάτρους στην περιοχή σας με βάση τις αξιολογήσεις και τις ειδικότητες. Δείτε τη διαθεσιμότητα και κλείστε ραντεβού.',
      features: [
        'Αναζήτηση με φίλτρα',
        'Αξιολογήσεις από άλλους χρήστες',
        'Κράτηση ραντεβού σε πραγματικό χρόνο'
      ]
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Δήλωση Εύρεσης Κατοικιδίου',
      description: 'Δηλώστε ότι βρήκατε ένα κατοικίδιο και βοηθήστε να βρεθεί ο ιδιοκτήτης του. Η δήλωσή σας θα ενημερώσει το κτηνιατρικό δίκτυο.',
      features: [
        'Εύκολη δημιουργία δήλωσης',
        'Ανάρτηση φωτογραφιών κατοικιδίου',
        'Ενημέρωση κατάστασης δήλωσης'
      ]
    }
  ];

  return (
    <PageLayout title="Πληροφορίες για Πολίτες">
      <div className="citizen-information-page">
        <div className="citizen-information-header">
          <h1>Πληροφορίες για Πολίτες</h1>
          <p>Όλα όσα χρειάζεστε να γνωρίζετε για τη χρήση του ιστοχώρου μας<br/>Τι μπορείτε να κάνετε με μια ματιά:</p>
        </div>

        <div className="citizen-cards-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="citizen-info-card">
              <div className="citizen-info-card-icon">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p className="citizen-info-card-description">{card.description}</p>
              <div className="citizen-card-features">
                {card.features.map((feature, i) => (
                  <div key={i} className="citizen-card-feature">
                    <CheckCircle2 size={20} className="checkmark-icon" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contents Section */}
        <div className="citizen-contents-box">
          <h2>Περιεχόμενα</h2>
          <ul className="citizen-contents-links">
            <li><a href="#faq-1">Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</a></li>
            <li><a href="#faq-2">Πώς δηλώνω ότι βρήκα ένα κατοικίδιο;</a></li>
            <li><a href="#faq-3">Πώς μπορώ να αναζητήσω κτηνιάτρους;</a></li>
          </ul>
        </div>

        {/* FAQ Container 1 */}
        <div className="citizen-faq-container">
          {/* FAQ Section 1 */}
          <div className="citizen-faq-section" id="faq-1">
            <h2>Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</h2>
            
            <div className="citizen-steps-container">
              <div className="citizen-step">
                <div className="citizen-step-number">1</div>
                <div className="citizen-step-content">
                  <h3>Μεταβείτε στη σελίδα αναζήτησης</h3>
                  <p>Από την αρχική σελίδα, επιλέξτε "Χαμένα Κατοικίδια" για να δείτε όλες τις δηλώσεις απώλειας.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">2</div>
                <div className="citizen-step-content">
                  <h3>Χρησιμοποιήστε τα φίλτρα αναζήτησης</h3>
                  <p>Φιλτράρισε τα κατοικίδια ανά περιοχή, είδος, ημερομηνία απώλειας και άλλα κριτήρια.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">3</div>
                <div className="citizen-step-content">
                  <h3>Δείτε τις λεπτομέρειες</h3>
                  <p>Κάντε κλικ σε ένα κατοικίδιο για να δείτε την πλήρη περιγραφή, τις φωτογραφίες και τα στοιχεία επικοινωνίας.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">4</div>
                <div className="citizen-step-content">
                  <h3>Επικοινωνήστε με τον ιδιοκτήτη</h3>
                  <p>Αν νομίζετε ότι έχετε πληροφορίες για το κατοικίδιο, επικοινωνήστε άμεσα με τον ιδιοκτήτη μέσω του ιστοχώρου.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">5</div>
                <div className="citizen-step-content">
                  <h3>Κοινοποιήστε τη δήλωση</h3>
                  <p>Μοιραστείτε τη δήλωση στα κοινωνικά δίκτυα για να βοηθήσετε τον ιδιοκτήτη να βρει το κατοικίδιό του.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 2 */}
        <div className="citizen-faq-container">
          {/* FAQ Section 2 */}
          <div className="citizen-faq-section" id="faq-2">
            <h2>Πώς δηλώνω ότι βρήκα ένα κατοικίδιο;</h2>
            
            <div className="citizen-steps-container">
              <div className="citizen-step">
                <div className="citizen-step-number">1</div>
                <div className="citizen-step-content">
                  <h3>Πλοηγηθείτε στη φόρμα δήλωσης</h3>
                  <p>Από την αρχική σελίδα ή το μενού, επιλέξτε "Δήλωση Εύρεσης Κατοικιδίου".</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">2</div>
                <div className="citizen-step-content">
                  <h3>Συμπληρώστε τα στοιχεία του κατοικιδίου</h3>
                  <p>Εισάγετε τις λεπτομέρειες που παρατηρήσατε για το κατοικίδιο (είδος, χρώμα, μέγεθος, ημερομηνία εύρεσης κ.λ.π.).</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">3</div>
                <div className="citizen-step-content">
                  <h3>Προσθέστε φωτογραφίες</h3>
                  <p>Ανεβάστε φωτογραφίες του κατοικιδίου για να βοηθήσετε τον ιδιοκτήτη να το αναγνωρίσει.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">4</div>
                <div className="citizen-step-content">
                  <h3>Προσδιορίστε την τοποθεσία</h3>
                  <p>Υποδείξτε τον χώρο όπου βρήκατε το κατοικίδιο και τυχόν σημαντικές λεπτομέρειες για τη τοποθεσία.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">5</div>
                <div className="citizen-step-content">
                  <h3>Υποβάλετε τη δήλωση</h3>
                  <p>Αποθηκεύστε τη δήλωση. Θα ενημερωθούν αυτόματα οι ιδιοκτήτες και το κτηνιατρικό δίκτυο για το εύρημά σας.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 3 */}
        <div className="citizen-faq-container">
          {/* FAQ Section 3 */}
          <div className="citizen-faq-section" id="faq-3">
            <h2>Πώς μπορώ να αναζητήσω κτηνιάτρους;</h2>
            
            <div className="citizen-steps-container">
              <div className="citizen-step">
                <div className="citizen-step-number">1</div>
                <div className="citizen-step-content">
                  <h3>Επιλέξτε τη λειτουργία αναζήτησης κτηνιάτρων</h3>
                  <p>Από την αρχική σελίδα ή το μενού, επιλέξτε "Αναζήτηση Κτηνιάτρων".</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">2</div>
                <div className="citizen-step-content">
                  <h3>Χρησιμοποιήστε τα φίλτρα</h3>
                  <p>Φιλτράρισε τους κτηνιάτρους ανά περιοχή, ειδικότητα, αξιολόγηση και άλλα κριτήρια.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">3</div>
                <div className="citizen-step-content">
                  <h3>Δείτε τα προφίλ κτηνιάτρων</h3>
                  <p>Πατήστε σε ένα προφίλ κτηνιάτρου για να δείτε τις αξιολογήσεις, τις ειδικότητες και τις ώρες λειτουργίας.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">4</div>
                <div className="citizen-step-content">
                  <h3>Ελέγξτε τη διαθεσιμότητα</h3>
                  <p>Δείτε τις διαθέσιμες ημερομηνίες και ώρες για ραντεβού σε πραγματικό χρόνο.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">5</div>
                <div className="citizen-step-content">
                  <h3>Κλείστε ραντεβού</h3>
                  <p>Επιλέξτε την ημερομηνία και ώρα που σας ταιριάζει και κλείστε το ραντεβού σας.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="citizen-button-container">
          <button className="citizen-back-home-button" onClick={() => navigate('/')}>Μετάβαση στην Αρχική Σελίδα</button>
          <button className="citizen-scroll-to-top-button" onClick={scrollToTop}>
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default CitizenInformation;
