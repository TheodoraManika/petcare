import React from 'react';
import { Book, Search, FileCheck, Heart, ArrowUp, CheckCircle2, SquareCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CitizenInformation.css';
import PageLayout from '../../../components/common/layout/PageLayout';

const CitizenInformation = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Χαμένων Κατοικιδίων',
      description: 'Αναζητήστε χαμένα κατοικίδια και βοηθήστε τους ιδιοκτήτες τους να τα εντοπίσουν.',
      features: [
        'Προβολή λεπτομεριών κατοικιδίων ',
        'Φιλτράρισμα ανά είδος Προβολή στοιχείων ιδιοκτήτη για επικοινωνία',
        'Κατάλληλα φίλτρα για διευκόλυνση της αναζήτησης'
      ]
    },
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Αναζητήστε με βάση την περιοχή, την ειδικότητα, τη διαθεσιμότητα και τις αξιολογήσεις άλλων ιδιοκτητών.',
      features: [
        'Προβολή λεπτομεριών κτηνιάτρων',
        'Αξιολογήσεις από άλλους χρήστες',
        'Κατάλληλα φίλτρα για διευκόλυνση της αναζήτησης'
      ]
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Δήλωση Εύρεσης Κατοικιδίου',
      description: 'Δηλώστε άμεσα την εύρεση ενός κατοικιδίου για να το βοηθήσετε να επανενωθεί με τους ιδιοκτήτες του. Οι δηλώσεις είναι ορατές σε όλους τους χρήστες του ιστοχώρου.',
      features: [
        'Εύκολη δημιουργία δήλωσης',
        'Ανάρτηση φωτογραφιών κατοικιδίου'
      ]
    }
  ];

  return (
    <PageLayout title="Γενικές Πληροφορίες">
      <div className="citizen-information-page">
        <div className="citizen-information-header">
          <h1>Γενικές Πληροφορίες</h1>
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
            <li><a href="#faq-2">Πώς μπορώ να κάνω δήλωση εύρεσης για ένα κατοικίδιο που βρήκα;</a></li>
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
                  <h3>Μεταβείτε στη σελίδα αναζήτησης χαμένων κατοικίδιων</h3>
                  <p>Επιλέξτε “Χαμένα Κατοικίδια” από τη γραμμή πλοήγησης για να δείτε όλα τα χαμένα κατοικίδια που έχουν δηλωθεί.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">2</div>
                <div className="citizen-step-content">
                  <h3>Χρησιμοποιήστε τα φίλτρα αναζήτησης</h3>
                  <p>Φιλτράρετε τα κατοικίδια ανά περιοχή, είδος, ημερομηνία απώλειας και άλλα κριτήρια.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">3</div>
                <div className="citizen-step-content">
                  <h3>Δείτε περισσότερες λεπτομέρειες</h3>
                  <p>Κάντε κλικ στο κουμπί "Προβολή" για να δείτε την πλήρη περιγραφή και τα στοιχεία επικοινωνίας ενός συγκεκριμένου κατοικίδιου.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">4</div>
                <div className="citizen-step-content">
                  <h3>Επικοινωνήστε με τον ιδιοκτήτη</h3>
                  <p>Πατήστε το κουμπί “Το Βρήκα” και συμπληρώστε τη φόρμα που θα εμφανιστεί ώστε να ενημερωθεί ο ιδιοκτήτης.</p>
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
                  <h3>Μεταβείτε στη σελίδα αναζήτησης κτηνιάτρων</h3>
                  <p>Επιλέξτε “Κτηνίατροι” από τη γραμμή πλοήγησης.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">2</div>
                <div className="citizen-step-content">
                  <h3>Χρησιμοποιήστε τα φίλτρα αναζήτηση</h3>
                  <p>Φιλτράρετε τους κτηνιάτρους ανά περιοχή, ειδικότητα, αξιολόγηση και άλλα κριτήρια.</p>
                </div>
              </div>

              <div className="citizen-step">
                <div className="citizen-step-number">3</div>
                <div className="citizen-step-content">
                  <h3>Δείτε τα προφίλ κτηνιάτρων</h3>
                  <p>Διαλέξτε έναν κτηνίατρο και πατήστε "Προβολή Προφίλ" για να δείτε περισσότερες λεπτομέρειες, όπως αξιολογήσεις και επαγγελματικά χαρακτηριστικά.</p>
                </div>
              </div>

              <div className="citizen-info-note">
                <strong>Σημείωση! </strong> Μπορείτε να αξιολογήσετε <strong>μόνο</strong> τους κτηνιάτρους με τους οποίους έχετε ολοκληρώσει κάποιο ραντεβού.
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
