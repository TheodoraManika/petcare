import React from 'react';
import { Book, Search, Clock, FileCheck, ArrowUp, CheckCircle2, SquareCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OwnerInformation.css';
import PageLayout from '../../../components/common/layout/PageLayout';

const OwnerInformation = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      icon: <Book size={32} />,
      title: 'Βιβλιάριο Υγείας Κατοικιδίου',
      description: 'Προβάλλετε και εκτυπώστε το βιβλιάριο υγείας του κατοικιδίου σας. Όλες οι ιατρικές πράξεις, εμβολιασμοί και επισκέψεις καταγράφονται από τον κτηνίατρό σας και εμφανίζονται αυτόματα στο βιβλιάριο.',
      features: [
        'Πλήρες ιατρικό ιστορικό',
        'Αναλυτικά στοιχεία κατοικιδίου',
        'Δυνατότητα εκτύπωσης PDF'
      ]
    },
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Βρείτε τον κατάλληλο κτηνίατρο με βάση την περιοχή, την ειδικότητα, τη διαθεσιμότητα και τις αξιολογήσεις άλλων ιδιοκτητών.',
      features: [
        'Προβολή λεπτομεριών κτηνιάτρων',
        'Προβολή προφίλ και αξιολογήσεωνν',
        'Άμεση κράτηση ραντεβού'
      ]
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Δηλώσεις Απώλειας & Εύρεσης',
      description: 'Δηλώστε απώλεια ή εύρεση ενός κατοικιδίου σας. Οι δηλώσεις είναι ορατές σε όλους τους χρήστες του ιστοχώρου.',
      features: [
        'Προσωρινή αποθήκευση δήλωσης',
        'Επεξεργασία πριν την υποβολή',
        'Ιστορικό δηλώσεων'
      ]
    },
    {
      icon: <Clock size={32} />,
      title: 'Διαχείριση Ραντεβού',
      description: 'Προγραμματίστε ραντεβού με επαγγελματίες κτηνιάτρους. Διαχειριστείτε τα ραντεβού σας και ενημερωθείτε άμεσα για την κατάσταση τους.',
      features: [
        'Καταστάσεις: Εκκρεμές, Επιβεβαιωμένο, Ακυρωμένο, Ολοκληρωμένο',
        'Αυτόματες ενημερώσεις',
        'Ιστορικό ραντεβού'
      ]
    }
  ];

  return (
    <PageLayout title="Πληροφορίες για Ιδιοκτήτες Κατοικιδίων">
      <div className="owner-information-page">
        <div className="owner-information-header">
          <h1>Πληροφορίες για Ιδιοκτήτες Κατοικιδίων</h1>
          <p>Όλα όσα χρειάζεστε να γνωρίζετε για τη χρήση του ιστοχώρου μας<br/>Τι μπορείτε να κάνετε με μια ματιά:</p>
        </div>

        <div className="owner-cards-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="owner-info-card">
              <div className="owner-info-card-icon">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p className="owner-info-card-description">{card.description}</p>
              <div className="owner-card-features">
                {card.features.map((feature, i) => (
                  <div key={i} className="owner-card-feature">
                    <CheckCircle2 size={20} className="checkmark-icon" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contents Section */}
        <div className="owner-contents-box">
          <h2>Περιεχόμενα</h2>
          <ul className="owner-contents-links">
            <li><a href="#faq-1">Πώς μπορώ να δω τις ιατρικές πράξεις των κατοικιδίων μου;</a></li>
            <li><a href="#faq-2">Πώς μπορώ να δω ή να ακυρώσω κάποιο ραντεβού μου;</a></li>
            <li><a href="#faq-3">Πώς μπορώ να κλείσω ραντεβού με κάποιον κτηνίατρο;</a></li>
            <li><a href="#faq-4">Πώς μπορώ να αξιολογήσω κάποιον κτηνίατρο;</a></li>
            <li><a href="#faq-5">Πώς μπορώ να επεξεργαστώ ή να διαγράψω το προφίλ μου;</a></li>
            <li><a href="#faq-6">Πώς μπορώ να δω όλες τις δηλώσεις μου και να τις επεξεργαστώ;</a></li>
            <li><a href="#faq-7">Πώς μπορώ να δηλώσω ότι χάθηκε ένα κατοικίδιό μου;</a></li>
            <li><a href="#faq-8">Πώς μπορώ να δηλώσω ότι βρήκα ένα κατοικίδιο;</a></li>
            <li><a href="#faq-9">Πώς μπορώ να δημιουργήσω λογαριασμό;</a></li>
            <li><a href="#faq-10">Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</a></li>
          </ul>
        </div>

        {/* FAQ Container */}
        <div className="owner-faq-container">
          {/* FAQ Section 1 */}
          <div className="owner-faq-section" id="faq-1">
            <h2>Πώς μπορώ να δώ τις ιατρικές πράξεις των κατοικιδίων μου;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Ανοίξτε το μενού του ιδιοκτήτη</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Τα Κατοικίδιά μου"</h3>
                  <p>Εδώ πέρα εμφανίζονται τα βιβλιάρια υγείας για όλα σας τα κατοικίδια.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Διαλέξτε κατοικίδιο</h3>
                  <p>Διαλέξτε το κατοικίδιο για το οποίο θέλετε να δείτε τις ιατρικές του πράξεις.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Εκτυπώστε το βιβλιάριο υγείας</h3>
                  <p>Είστε έτοιμοι! Τώρα μπορείτε να δείτε όλα τα στοιχεία του κατοικιδίου σας και τις ιατρικές του πράξεις. Αν θέλετε, μπορείτε να εκτυπώσετε το βιβλιάριο υγείας του κατοικιδίου σας πατώντας το κουμπί "Εκτύπωση Βιβλιαρίου"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 2 */}
        <div className="owner-faq-container">
          {/* FAQ Section 2 */}
          <div className="owner-faq-section" id="faq-2">
            <h2>Πώς μπορώ να δώ ή να ακυρώσω κάποιο ραντεβού μου;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Ανοίξτε το μενού του ιδιοκτήτη</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Τα Ραντεβού μου"</h3>
                  <p>Εδώ εμφανίζονται όλα τα ραντεβού που έχετε κλείσει με κάποιον κτηνίατρο. Όταν κάνετε κράτηση για ραντεβού με κάποιον κτηνίατρο, το ραντεβού εμφανίζεται στην κατάσταση "Εκκρεμές". Ο κτηνίατρος μπορεί να το εγκρίνει, οπότε το ραντεβού αλλάζει σε "Επιβεβαιωμένο", ή να το ακυρώσει, οπότε καταχωρείται ως "Ακυρωμένο". Τα ραντεβού σας ενημερώνονται αυτόματα και άμεσα και μπορείτε να δείτε οποιαδήποτε αλλαγή στην κατάσταση του ραντεβού από αυτή τη σελίδα.Επιπλέον, έχετε τη δυνατότητα να ακυρώσετε οποιοδήποτε εκκρεμές ή επιβεβαιωμένο ραντεβού απευθείας από τη διαχείριση των ραντεβού σας. Τα ακυρωμένα ραντεβού δεν μπορούν να τροποποιηθούν.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Ενεργά"</h3>
                  <p>Εδώ μπορείτε να δείτε όλα τα ενεργά ραντεβού σας. Αυτά που βρίσκονται στην κατάσταση “Επιβεβαιωμένο” έχουν εγκριθεί από τον κτηνίατρο, ενώ αυτά που βρίσκονται στην κατάσταση “ Εκκρεμές” αναμένουν έγκριση ή απόρριψη από τον κτηνίατρο. Αν θέλετε να ακυρώσετε ένα ραντεβού, πατήστε το εικονίδιο Χ που βρίσκεται δίπλα από αυτό.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Ιστορικό"</h3>
                  <p>Εδώ μπορείτε να δείτε όλα τα ραντεβού σας που έχουν ολοκληρωθεί ("Ολοκληρωμένο") ή που έχουν ακυρωθεί είτε από σας είτε από τον κτηνίατρο ("Ακυρωμένο").</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 3 */}
        <div className="owner-faq-container">
          {/* FAQ Section 3 */}
          <div className="owner-faq-section" id="faq-3">
            <h2>Πώς μπορώ να κλείσω ραντεβού με κάποιον κτηνίατρο;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε “Κτηνίατροι” από τη γραμμή πλοήγησης</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Κάντε την αναζήτησή σας</h3>
                  <p>Επιλέξτε τα κατάλληλα φίλτρα ώστε να βρείτε τον ιδανικό κτηνίατρο για εσάς. Μπορείτε να δείτε τα αποτελέσματα σε μορφή λίστας ή χάρτη. Μπορείτε να δείτε περισσότερες πληροφορίες για τους κτηνιάτρους που σας ενδιαφλερουν πατώντας “Προβολή προφίλ”.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Κλείστε το ραντεβού</h3>
                  <p>Πατήστε το κουμπί “Κλείσε ραντεβού” για τον κτηνίατρο που σας ενδιαφέρει.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τα φόρμα</h3>
                  <p>Επιλέξτε το κατοικίδιο για το οποίο κλείνετε το ραντεβού, διαλέξτε ημερομηνία, ώρα και τύπο υπηρεσίας από αυτές που υπάρχουν διαθέσιμες και γράψτε προαιρετικά κάποια σημείωση προς τον κτηνίατρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">6</div>
                <div className="owner-step-content">
                  <h3>Στείλτε το αίτημα σας</h3>
                  <p>Πατήστε το κουμπί “Κλείσιμο Ραντεβού”. Το αίτημά σας θα σταλεί στον κτηνίατρο και εσείς θα ενημερωθείτε για την κατάσταση του.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 4 */}
        <div className="owner-faq-container">
          {/* FAQ Section 4 */}
          <div className="owner-faq-section" id="faq-4">
            <h2>Πώς μπορώ να αξιολογήσω κάποιον κτηνίατρο;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Ανοίξτε το μενού του ιδιοκτήτη</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Το Ραντεβού μου"</h3>
                  <p>Εδώ εμφανίζονται όλα τα ραντεβού που έχετε κλείσει με κάποιον κτηνίατρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Ιστορικό"</h3>
                  <p>Εδώ μπορείτε να δείτε όλα τα ραντεβού σας που έχουν ολοκληρωθεί (“Ολοκληρωμένο”) ή που έχουν ακυρωθεί είτε από εσάς είτε από τον κτηνίατρο (“Ακυρωμένο”). Σε κάθε ολοκληρωμένο ραντεβού υπάρχει ένα κουμπί “Αξιολόγηση”. Πατήστε το για να προχωρήσετε παρακάτω.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Κάντε αξιολόγηση σας</h3>
                  <p>Βάλτε βαθμολογία (1 - 5 αστέρια) και προσθέστε προαιρετικά κάποιο σχόλιο. Πατήστε το κουμπί "Αποστολή Αξιολόγησης".</p>
                </div>
              </div>

              <div className="owner-info-note">
                <strong>Σημείωση! </strong> Μπορείτε να αξιολογήσετε μόνο τους κτηνιάτρους με τους οποίους έχετε ολοκληρώσει κάποιο ραντεβού.
              </div>

            </div>
          </div>
        </div>

        {/* FAQ Container 5 */}
        <div className="owner-faq-container">
          {/* FAQ Section 5 */}
          <div className="owner-faq-section" id="faq-5">
            <h2>Πώς μπορώ να επεξεργαστώ ή να διαγράψω το προφίλ μου;</h2>
            
            <div className="owner-steps-container">
              <h3 style={{fontSize: '16px', fontWeight: '600', color: '#101828', marginBottom: '16px', marginTop: '0'}}>Επεξεργασία Προφίλ</h3>
              
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Συνδεθείτε στον λογαριασμό σας</h4>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Πατήστε το εικονίδιο με το όνομά σας</h4>
                  <p>Βρίσκεται πάνω και άκρη δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε “Προφίλ”.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Επεξεργαστείτε το προφίλ σας</h4>
                  <p>Πατήστε το κουμπί “Επεξεργασία” και πραγματοποιήστε οποιαδήποτε αλλαγή θέλετε στα στοιχεία του λογαριασμού σας.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Αποθηκεύστε τις αλλαγές</h4>
                  <p>Πατήστε το κουμπί “Αποθήκευση” ώστε να αποθηκευτούν οι αλλαγές που κάνατε και να ενημερωθεί το προφίλ σας. Αν τελικά δε θέλετε να αποθηκεύστε τις αλλαγές, πατήστε το κουμπί “Ακύρωση”. </p>
                </div>
              </div>

              <h3 style={{fontSize: '16px', fontWeight: '600', color: '#101828', marginBottom: '16px', marginTop: '24px'}}>Διαγραφή Προφίλ</h3>

              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Συνδεθείτε στον λογαριασμό σας</h4>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Πατήστε το εικονίδιο με το όνομά σας</h4>
                  <p>Βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε "Προφίλ".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Διαγράψτε τον λογαριασμό σας</h4>
                  <p>Πατήστε το κουμπί “Διαγραφή Λογαριασμού” και όταν σας ζητήσει επιβεβαίωση πατήστε το κουμπί “Διαγραφή”.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 6 */}
        <div className="owner-faq-container">
          {/* FAQ Section 6 */}
          <div className="owner-faq-section" id="faq-6">
            <h2>Πώς μπορώ να δω όλες τις δηλώσεις μου και να τις επεξεργαστώ;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Ανοίξτε το μενού του ιδιοκτήτη</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Προφίλ δηλώσεων</h3>
                  <p>Επιλέξτε “Ιστορικό Δηλώσεων”. Εδώ βρίσκονται όλες οι δηλώσεις σας. Οι δηλώσεις σε κατάσταση “Πρόχειρη” δεν έχουν υποβληθεί και μπορείτε να τις επεξεργαστείτε ή προβάλλετε. Οι δηλώσεις σε κατάσταση “Υποβλήθηκε” έχουν υποβληθεί στο σύστημα και μπορείτε να κάνετε μόνο προβολή τους. Αν θέλετε να δείτε κάποια δήλωσή σας, πατήστε το κουμπί “Προβολή”.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Επεξεργασία δήλωσης</h3>
                  <p>Πατήστε το κουμπί “Επεξεργασία” στη δήλωση που θέλετε να επεξεργαστείτε και πραγματοποιήστε τις αλλαγές που θέλετε να κάνετε. Αν θέλετε να υποβάλλετε τη δήλωση, πατήστε το κουμπί “Οριστική Υποβολή”. Αν θέλετε να αποθηκεύσετε την δήλωση αλλά να μην την ανεβάσετε ακόμα, πατήστε το κουμπί “Αποθήκευση”. Αν δεν θέλετε να υποβάλλετε ή να αποθηκεύσετε τις αλλαγές σας, πατήστε το κουμπί “Ακύρωση”.  </p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Διαγραφή δήλωσης</h3>
                  <p>Πατήστε το κουμπί Χ στη δήλωση που θέλετε να διαγράψετε και ύστερα επιλέξτε το κουμπί “Διαγραφή”. Προσοχή, αυτή η ενέργεια δεν αναιρείται. Αν τελικά δε θέλετε να διαγράψετε τη δήλωσή σας, πατήστε το κουμπί “Ακύρωση”.  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 7 */}
        <div className="owner-faq-container">
          {/* FAQ Section 7 */}
          <div className="owner-faq-section" id="faq-7">
            <h2>Πώς μπορώ να δηλώσω ότι χάθηκε ένα κατοικίδιό μου;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Ανοίξτε το μενού του ιδιοκτήτη</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Επιλέξτε “Δήλωση Απώλειας”. Συμπληρώστε τη φόρμα και πατήστε “Οριστική Υποβολή” για να την ανεβάσετε, “Αποθήκευση” για να την αποθηκεύσετε προσωρινά και να μην την ανεβάσετε ακόμα ή “Ακύρωση” αν δεν θέλετε τελικά να αποθηκεύσετε ή να υποβάλλετε τη δήλωση.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 8 */}
        <div className="owner-faq-container">
          {/* FAQ Section 8 */}
          <div className="owner-faq-section" id="faq-8">
            <h2>Πώς μπορώ να δηλώσω ότι βρήκα ένα κατοικίδιο;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Ανοίξτε το μενού του ιδιοκτήτη</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Επιλέξτε “Δήλωση Εύρεσης”. Τα προσωπικά σας στοιχεία είναι ήδη συμπληρωμένα στη φόρμα, μπορείτε όμως να τα αλλάξετε αν θέλετε. Συμπληρώστε τη φόρμα και πατήστε “Οριστική Υποβολή” για να την ανεβάσετε, “Αποθήκευση” για να την αποθηκεύσετε προσωρινά και να μην την ανεβάσετε ακόμα ή “Ακύρωση” αν δεν θέλετε τελικά να αποθηκεύσετε ή να υποβάλλετε τη δήλωση. </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 9 */}
        <div className="owner-faq-container">
          {/* FAQ Section 9 */}
          <div className="owner-faq-section" id="faq-9">
            <h2>Πώς μπορώ να δημιουργήσω λογαριασμό;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Εγγραφή"</h3>
                  <p>Επιλέξτε το κουμπί “Εγγραφή” που βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα εμφανιστεί, επιλέξτε “Ως ιδιοκτήτης”.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τη φόρμα</h3>
                  <p>Συμπληρώστε τη φόρμα με τα στοιχεία σας και πατήστε το κουμπί “Εγγραφή”.</p>
                </div>
              </div>
            </div>

            <div className="owner-info-note">
              <strong>Σημείωση! </strong> Όταν δημιουργείτε λογαριασμό, δεν υπάρχουν τα βιβλιάρια των κατοικιδίων σας, ούτε μπορείτε εσείς να τα προσθέσετε μόνοι σας. Για να προσθέσετε τα βιβλιάρια των κατοικιδίων σας ή οποιουδήποτε καινούργιου κατοικιδίου αποκτήσετε στο μέλλον απευθυνθείτε σε κάποιον κτηνίατρο.
            </div>
          </div>
        </div>

        {/* FAQ Container 10 */}
        <div className="owner-faq-container">
          {/* FAQ Section 10 */}
          <div className="owner-faq-section" id="faq-10">
            <h2>Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</h2>
            
            <div className="owner-steps-container">
              <div className="owner-step">
                <div className="owner-step-number">1</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Χαμένα Κατοικίδια" από τη γραμμή πλοήγησης.</h3>
                  <p>Στη γραμμή πλοήγησης βρίσκονται όλες οι λειτουργίες που μπορείτε να κάνετε στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Κάντε την αναζήτησή σας</h3>
                  <p>Επιλέξτε τα κατάλληλα φίλτρα με βάση την αναζήτηση που θέλετε να κάνετε. Αν θέλετε να δείτε λεπτομέρειες σχετικά με κάποιο κατοικίδιο πατήστε το κουμπί “Προβολή Λεπτομεριών”.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Βρείτε ένα συγκεκριμένο κατοικίδιο;</h3>
                  <p>Πατήστε το κουμπί “Το Βρήκα” από τις λεπτομέριες του κατοικιδίου και συμπληρώστε τη φόρμα.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Information Section */}
        <div className="owner-related-info">
          <h3>Σχετικές Πληροφορίες</h3>
          <div className="owner-info-checklist">
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Όλες οι ιατρικές πράξεις και καταχωρήσεις κάποιου κατοικιδίου καταγράφονται <strong>μόνο</strong> από πιστοποιημένους κτηνιάτρους</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Μπορείτε να ακυρώσετε ή να τροποποιήσετε ραντεβού πριν την επιβεβαίωσή τους</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Οι δηλώσεις απώλειας είναι ορατές σε όλους τους χρήστες του ιστοχώρου</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Μπορείτε να αξιολογήσετε κτηνιάτρους <strong>μετά</strong> από κάθε επίσκεψη</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Δηλώσεις μεταβίβασης, υιοθεσίας και αναδοχής μπορούν να γίνουν <strong>μόνο</strong> από πιστοποιημένους κτηνιάτρους</label>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="owner-button-container">
          <button className="owner-back-home-button" onClick={() => navigate('/')}>Μετάβαση στη Αρχική</button>
          <button className="owner-scroll-to-top-button" onClick={scrollToTop}>
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default OwnerInformation;
