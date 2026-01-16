import React from 'react';
import { Book, Clock, FileCheck, Calendar, ArrowUp, CheckCircle2, SquareCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './VetInformation.css';
import PageLayout from '../../../components/common/layout/PageLayout';

const VetInformation = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      icon: <Book size={32} />,
      title: 'Καταγραφή κατοικιδίων και ιατρικών πράξεων',
      description: 'Καταγράψτε κατοικίδια και τις ιατρικές πράξεις που πραγματοποιείται σε αυτά. Τα στοιχεία ενημερώνονται αυτόματα στο προφίλ των ιδιοκτητών και εμφανίζονται στα βιβλιάρια υγείας των κατοικιδίων τους.',
      features: [
        'Καταγραφή ιατρικών πράξεων',
        'Καταγραφή στοιχείων κατοικιδίου',
        'Δυνατότητα εκτύπωσης PDF'
      ]
    },
    {
      icon: <Clock size={32} />,
      title: 'Διαχείριση Διαθεσιμότητας',
      description: 'Ενημερώστε τους χρήστες για τις ημερομηνίες που δέχεστε ραντεβού. Ορίστε χρονικά πλαίσια για κάθε ραντεβού, τύπο ιατρικής πράξης και ημερομηνία.',
      features: [
        'Επεξεργασία διαθεσιμότητας',
        'Άμεση ενημέρωση προγράμματος',
        'Εύκολη προσβάσιμη/διαγραφή'
      ]
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Υποβολή Δηλώσεων',
      description: 'Δηλώστε άμεσα την απώλεια, εύρεση, μεταβίβαση, υιοθεσία και αναδοχή ενός κατοικιδίου. Οι δηλώσεις εμφανίζονται αυτόματα στους ιδιοκτήτες τους οποίους αφορούν.',
      features: [
        'Ιστορικό δηλώσεων',
        'Ενημέρωση κατάστασης, δήλωσης'
      ]
    },
    {
      icon: <Calendar size={32} />,
      title: 'Διαχείριση Ραντεβού',
      description: 'Διαχειριστείτε τα ραντεβού σας και ενημερωθείτε άμεσα για την κατάσταση τους. Εγκρίνετε ή απορρίπτε εύκολα ένα ραντεβού',
      features: [
        'Καταστάσεις: Εκκρεμές, Επιβεβαιωμένο, Ακυρωμένο, Ολοκληρωμένο',
        'Αυτόματες ειδοποιήσεις',
        'Ιστορικό ραντεβού'
      ]
    }
  ];

  return (
    <PageLayout title="Πληροφορίες για Κτηνίατρους">
      <div className="vet-information-page">
        <div className="vet-information-header">
          <h1>Πληροφορίες για Κτηνίατρους</h1>
          <p>Όλα όσα χρειάζεστε να γνωρίζετε για τη χρήση του ιστοχώρου μας<br/>Τι μπορείτε να κάνετε με μια ματιά:</p>
        </div>

        <div className="vet-cards-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="vet-info-card">
              <div className="vet-info-card-icon">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p className="vet-info-card-description">{card.description}</p>
              <div className="vet-card-features">
                {card.features.map((feature, i) => (
                  <div key={i} className="vet-card-feature">
                    <CheckCircle2 size={20} className="checkmark-icon" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contents Section */}
        <div className="vet-contents-box">
          <h2>Περιεχόμενα</h2>
          <ul className="vet-contents-links">
            <li><a href="#faq-1">Πώς μπορώ να δημιουργήσω λογαριασμό στον ιστοχώρο;</a></li>
            <li><a href="#faq-2">Πώς μπορώ να καταγράψω μία ιατρική πράξη για κάποιο κατοικίδιο;</a></li>
            <li><a href="#faq-3">Πώς μπορώ να δω τις αξιολογήσεις που μου έχουν κάνει οι χρήστες;</a></li>
            <li><a href="#faq-4">Πώς μπορώ να δω τις δηλώσεις και τις ιατρικές πράξεις που έχω κάνει;</a></li>
            <li><a href="#faq-5">Πώς μπορώ να εγκρίνω ή να απορρίψω ένα ραντεβού;</a></li>
            <li><a href="#faq-6">Πώς μπορώ να δηλώσω τις ώρες που δέχομαι επισκέψεις;</a></li>
            <li><a href="#faq-7">Πώς μπορώ να κάνω δήλωση υιοθεσίας, μετακίνησης ή αναδοχής κατοικιδίου;</a></li>
            <li><a href="#faq-8">Πώς μπορώ να επεξεργαστώ ή να διαγράψω το προφίλ μου;</a></li>
            <li><a href="#faq-9">Πώς μπορώ να κάνω δήλωση εύρεσης ή απώλειας ενός κατοικιδίου;</a></li>
            <li><a href="#faq-10">Πώς μπορώ να κάνω καταγραφή ενός ζώου;</a></li>
            <li><a href="#faq-11">Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</a></li>
          </ul>
        </div>

        {/* FAQ Container 1 */}
        <div className="vet-faq-container">
          {/* FAQ Section 1 */}
          <div className="vet-faq-section" id="faq-1">
            <h2>Πώς μπορώ να δημιουργήσω λογαριασμό στον ιστοχώρο;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Εγγραφή"</h3>
                  <p>Επιλέξτε το κουμπί "Εγγραφή" που βρίσκεται πάνω δεξιά. Από τη λίστα που θα εμφανιστεί, επιλέξτε "Ως κτηνίατρος".</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Συμπληρώστε τη φόρμα</h3>
                  <p>Συμπληρώστε τη φόρμα με τα στοιχεία σας και πατήστε το κουμπί "Εγγραφή".</p>
                </div>
              </div>
            </div>

            <div className="vet-info-note">
              <strong>Σημείωση!</strong> Για να δημιουργήσετε λογαριασμό ως κτηνίατρος θα χρειαστείτε τον Αριθμό Άδειας Άσκησης Επαγγέλματος σας. Συνιστάται να χρησιμοποιήσετε την επαγγελματική σας διεύθυνση ηλεκτρονικού ταχυδρομείου (email).νιστάται να χρησιμοποιήσετε την επαγγελματική σας διεύθυνση ηλεκτρονικού ταχυδρομείου (email).
            </div>
          </div>
        </div>

        {/* FAQ Container 2 */}
        <div className="vet-faq-container">
          {/* FAQ Section 2 */}
          <div className="vet-faq-section" id="faq-2">
            <h2>Πώς μπορώ να καταγράψω μία ιατρική πράξη για κάποιο κατοικίδιο;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Ιατρικές Πράξεις"</h3>
                  <p>Μέσα από αυτή τη σελίδα μπορείτε να καταγράψετε τις ιατρικές πράξεις ενός κατοικιδίου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Συμπληρώστε τη φόρμα</h3>
                  <p>Συμπληρώστε τη φόρμα. Πατήστε το κουμπί "Καταγραφή" ώστε να καταχωρηθεί η ιατρική πράξη. Αν δε θέλετε γίνει καταχώρηση, πατήστε το κουμπί "Ακύρωση".</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 3 */}
        <div className="vet-faq-container">
          {/* FAQ Section 3 */}
          <div className="vet-faq-section" id="faq-3">
            <h2>Πώς μπορώ να δώ τις αξιολογήσεις που μου έχουν κάνει οι χρήστες;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε το στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του υποχρέου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Αξιολογήσεις"</h3>
                  <p>Μέσα σε αυτή τη σελίδα φαίνονται όλες οι αξιολογήσεις που σας έχουν κάνει οι χρήστες, οι οποίες έχουν ολοκληρώσει κάποιο ραντεβού μαζί σας.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 4 */}
        <div className="vet-faq-container">
          {/* FAQ Section 4 */}
          <div className="vet-faq-section" id="faq-4">
            <h2>Πώς μπορώ να δώ τις δηλώσεις και τις ιατρικές πράξεις που έχω κάνει;</h2>
            
            <h3 className="vet-subsection-title">Προβολή ιατρικών πράξεων</h3>
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Ιστορικό"</h3>
                  <p>Μέσα σε αυτή τη σελίδα φαίνονται όλες οι ιατρικές πράξεις και δηλώσεις που έχετε κάνει.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Επισκέψεις & Ιατρικές πράξεις"</h3>
                  <p>Εδώ εμφανίζονται όλες οι ιατρικές πράξεις που έχετε κάνει σε όλα τα κατοικίδια.</p>
                </div>
              </div>
            </div>

            <h3 className="vet-subsection-title">Προβολή δηλώσεων</h3>
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Ιστορικό"</h3>
                  <p>Μέσα σε αυτή τη σελίδα φαίνονται όλες οι ιατρικές πράξεις και δηλώσεις που έχετε κάνει.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Δηλώσεις"</h3>
                  <p>Εδώ εμφανίζονται όλες οι δηλώσεις που έχετε κάνει. Αμα θέλετε να δείτε αναλυτικότερα μια δήλωση, πατήστε το κουμπί "Προβολή".</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 5 */}
        <div className="vet-faq-container">
          {/* FAQ Section 5 */}
          <div className="vet-faq-section" id="faq-5">
            <h2>Πώς μπορώ να εγκρίνω ή να απορρίψω ένα ραντεβού;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Διαχείριση Ραντεβού"</h3>
                  <p>Εδώ εμφανίζονται όλα τα ραντεβού σας και η κατάστασή τους (Εκκρεμή, Επιβεβαιωμένα, Ολοκληρωμένα, Ακυρωμένα). Μπορείτε να δείτε τα ραντεβού σας σε μορφή Λίστας ή Ημερολογίου (Ανά ημέρα ή εβδομάδα).</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Εγκρίνετε ή απορρίψετε ένα ραντεβού</h3>
                  <p>Τα ραντεβού που είναι στην κατάσταση Εκκρεμές χρειάζονται έγκριση ή απόρριψη από εσάς.</p>
                  <ul className="vet-bullet-list">
                    <li>Αν κάνετε προβολή των ραντεβού σε μορφή λίστας, εντοπίστε το ραντεβού που θέλετε να εγκρίνετε και πατήστε ✓. Αν θέλετε να το απορρίψετε πατήστε Χ.</li>
                    <li>Αν κάνετε προβολή των ραντεβού σε μορφή ημερολογίου ανά εβδομάδα, κάντε κλικ στο ραντεβού που θέλετε να εγκρίνεται ή απορρίψετε. Θα εμφανιστούν οι λεπτομέρειές του. Πατήστε το κουμπί “Απόρριψη” ή “Επιβεβαίωση” αντίστοιχα. </li>
                    <li>Αν κάνετε προβολή των ραντεβού σε μορφή ημερολογίου ανά ημέρα, εντοπίστε το ραντεβού που θέλετε να εγκρίνετε και πατήστε ✓. Αν θέλετε να το απορρίψετε πατήστε Χ.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 6 */}
        <div className="vet-faq-container">
          {/* FAQ Section 6 */}
          <div className="vet-faq-section" id="faq-6">
            <h2>Πώς μπορώ να δηλώσω τις ώρες που δέχομαι επισκέψεις;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Διαθεσιμότητα"</h3>
                  <p>Εδώ εμφανίζεται ένα ημερολόγιο με όλες τις ώρες και μέρες που δέχεστε ραντεβού. Για να προσθέσετε ένα καινούργιο, επιλέξτε ώρα, ημέρα και υπηρεσία και πατήστε το κουμπί “Προσθήκη”. Το χρονικό παράθυρο που ορίσατε θα εμφανιστεί στο ημερολόγιο αυτόματα. Αν θέλετε να κάνετε ακύρωση κάποιου χρονικού παραθύρου, εντοπίστε το και πατήστε το εικονίδιο του κάδου δίπλα από αυτό.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 7 */}
        <div className="vet-faq-container">
          {/* FAQ Section 7 */}
          <div className="vet-faq-section" id="faq-7">
            <h2>Πώς μπορώ να κάνω δήλωση υιοθεσίας, μεταβίβασης ή αναδοχής κατοικιδίου;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Ανοίξτε το μενού του κτηνιάτρου</h3>
                  <p>Το μενού βρίσκεται άκρη αριστερά. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι κτηνίατροι στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Δηλώσεις Συμβάντων Ζωής"</h3>
                  <p>Από αυτή τη σελίδα, επιλέξτε τον τύπο της δήλωσης που χρειάζεστε: Δήλωση Υιοθεσίας, Δήλωση Μεταβίβασης, Δήλωση Αναδοχής.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Συμπληρώστε όλα τα πεδία στη φόρμα της δήλωσης. Πατήστε το κουμπί “Υποβολή Δήλωσης” αν είστε έτοιμοι να την υποβάλλετε, η δήλωση θα εμφανιστεί αυτόματα στο προφίλ των ιδιοκτητών που τους αφορά. Πατήστε το κουμπί “Ακύρωση” άμα δε θέλετε να υποβάλλετε τη δήλωση. Προσοχή, η δήλωση θα χαθεί.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 8 */}
        <div className="vet-faq-container">
          {/* FAQ Section 8 */}
          <div className="vet-faq-section" id="faq-8">
            <h2>Πώς μπορώ να επεξεργαστώ ή να διαγράψω το προφίλ μου;</h2>
            
            <h3 className="vet-subsection-title">Επεξεργασία Προφίλ</h3>
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Πατήστε το εικονίδιο με το όνομά σας</h3>
                  <p>Βρίσκεται πάνω και άκρη δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε “Προφίλ”.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επεξεργαστείτε το προφίλ σας</h3>
                  <p>Πατήστε το κουμπί "Επεξεργασία" και πραγματοποιήστε οποιαδήποτε αλλαγή θέλετε στο στοιχεία του λογαριασμού σας.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Αποθηκεύστε τις αλλαγές</h3>
                  <p>Πατήστε το κουμπί “Αποθήκευση” ώστε να αποθηκευτούν οι αλλαγές που κάνατε και να ενημερωθεί το προφίλ σας. Αν τελικά δε θέλετε να αποθηκεύσετε τις αλλαγές, πατήστε το κουμπί “Ακύρωση”.</p>
                </div>
              </div>
            </div>

            <h3 className="vet-subsection-title">Διαγραφή Προφίλ</h3>
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Πατήστε το εικονίδιο με το όνομά σας</h3>
                  <p>Βρίσκεται πάνω και άκρη δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε “Προφίλ”.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Διαγράψτε τον λογαριασμό σας</h3>
                  <p>Πατήστε το κουμπί “Διαγραφή Λογαριασμού” και όταν σας ζητήσει επιβεβαίωση πατήστε το κουμπί “Διαγραφή”.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 9 */}
        <div className="vet-faq-container">
          {/* FAQ Section 9 */}
          <div className="vet-faq-section" id="faq-9">
            <h2>Πώς μπορώ να κάνω δήλωση εύρεσης ή απώλειας ενός κατοικιδίου;</h2>
            
            <h3 className="vet-subsection-title">Δήλωση Εύρεσης</h3>
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Πατήστε το εικονίδιο με το όνομά σας</h3>
                  <p>Βρίσκεται πάνω και άκρη δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε “Προφίλ”.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Επιλέξτε “Δήλωση Εύρεσης”. Συμπληρώστε τη φόρμα και πατήστε “Οριστική Υποβολή” για να την ανεβάσετε ή “Ακύρωση” αν δεν θέλετε τελικά να την υποβάλλεται.</p>
                </div>
              </div>
            </div>

            <h3 className="vet-subsection-title">Δήλωση Απώλειας</h3>
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Πατήστε το εικονίδιο με το όνομά σας</h3>
                  <p>Βρίσκεται πάνω και άκρη δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε “Προφίλ”.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Επιλέξτε “Δήλωση Απώλειας”. Συμπληρώστε τη φόρμα και πατήστε “Οριστική Υποβολή” για να την ανεβάσετε ή “Ακύρωση” αν δεν θέλετε τελικά να την υποβάλλεται.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 10 */}
        <div className="vet-faq-container">
          {/* FAQ Section 10 */}
          <div className="vet-faq-section" id="faq-10">
            <h2>Πώς μπορώ να κάνω καταγραφή ενός ζώου;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Συνδεθείτε στον λογαριασμό σας</h3>
                  <p>Χρησιμοποιήστε τα στοιχεία σύνδεσης σας για να έχετε πρόσβαση σε όλες τις λειτουργίες του ιστοχώρου.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Πατήστε το εικονίδιο με το όνομά σας</h3>
                  <p>Βρίσκεται πάνω και άκρη δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα ανοίξει, επιλέξτε “Προφίλ”.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε “Καταγραφή Κατοικιδίου”</h3>
                  <p>Μέσα από αυτή τη σελίδα μπορείτε να κάνετε καταγραφή ενός κατοικιδίου και να το αντιστοιχήσετε με ένα Microchip.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">4</div>
                <div className="vet-step-content">
                  <h3>Συμπληρώστε τη φόρμα</h3>
                  <p>Συμπληρώστε τη φόρμα. Πατήστε το κουμπί “Οριστική Υποβολή” ώστε να καταχωρηθεί το κατοικίδιο. Αν δε θέλετε να γίνει η καταχώρηση, πατήστε το κουμπί “Ακύρωση”. </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 11 */}
        <div className="vet-faq-container">
          {/* FAQ Section 11 */}
          <div className="vet-faq-section" id="faq-11">
            <h2>Πώς μπορώ να αναζητήσω χαμένα κατοικίδια;</h2>
            
            <div className="vet-steps-container">
              <div className="vet-step">
                <div className="vet-step-number">1</div>
                <div className="vet-step-content">
                  <h3>Επιλέξτε "Χαμένα Κατοικίδια" από τη γραμμή πλοήγησης</h3>
                  <p>Στη γραμμή πλοήγησης βρίσκονται όλες οι λειτουργίες που μπορείτε να κάνετε στον ιστοχώρο.</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">2</div>
                <div className="vet-step-content">
                  <h3>Κάντε την αναζήτησή σας</h3>
                  <p>Επιλέξτε τα κατάλληλα φίλτρα με βάση την αναζήτηση που θέλετε να κάνετε. Αν θέλετε να δείτε λεπτομέρειες κάποιου κατοικιδίου πατήστε το κουμπί "Προβολή".</p>
                </div>
              </div>

              <div className="vet-step">
                <div className="vet-step-number">3</div>
                <div className="vet-step-content">
                  <h3>Βρήκατε ένα συγκεκριμένο κατοικίδιο;</h3>
                  <p>Πατήστε το κουμπί "Το Βρήκα" από τις λεπτομέρειες του κατοικιδίου και συμπληρώστε τη φόρμα.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Information Section */}
        <div className="vet-related-info">
          <h2>Σημαντικές Πληροφορίες</h2>
          
          <ul className="vet-checklist">
            <li>
              <SquareCheckBig size={24} className="vet-checklist-icon" />
              <span>Μπορείτε να ακυρώσετε ένα ραντεβού μόνο όταν είναι σε Εκκρεμή κατάσταση. Τα επιβεβαιωμένα ραντεβού δεν ακυρώνονται</span>
            </li>
            <li>
              <SquareCheckBig size={24} className="vet-checklist-icon" />
              <span>Οι δηλώσεις απώλειας είναι ορατές σε όλους τους χρήστες του ιστοχώρου</span>
            </li>
            <li>
              <SquareCheckBig size={24} className="vet-checklist-icon" />
              <span>Τα ακυρωμένα ραντεβού δε μπορούν να επεξεργαστούν</span>
            </li>
            <li>
              <SquareCheckBig size={24} className="vet-checklist-icon" />
              <span>Δηλώσεις μεταβίβασης, υιοθεσίας και αναδοχής μπορούν να γίνουν <strong>μόνο</strong> από κτηνιάτρους και όχι από τους ιδιοκτήτες</span>
            </li>
          </ul>
        </div>

        {/* Back to Home Button */}
        <div className="vet-button-container">
          <button className="vet-back-home-button" onClick={() => navigate('/')}>Μετάβαση στη Αρχική</button>
          <button className="vet-scroll-to-top-button" onClick={scrollToTop}>
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetInformation;
