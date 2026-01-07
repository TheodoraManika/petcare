import React from 'react';
import { Book, Search, Clock, FileCheck, ArrowUp, CheckCircle2, SquareCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OwnerInformation.css';
import PageLayout from '../../components/global/layout/PageLayout';

const OwnerInformation = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      icon: <Book size={32} />,
      title: 'Βιβλιάριο Υγείας',
      description: 'Προβολή και ενημέρωση του βιβλιαρίου υγείας του κατοικιδίου σας. Όλες οι ιατρικές πρόσφυσης, εμβολιασμοί και επειγοντα στοιχεία θα αποθηκεύονται αυτόματα στο βιβλιάριο.',
      features: [
        'Πλήρες ιστορικό εμβολιασμών',
        'Αναλυτική στοιχεία κατοικιδίου',
        'Δυνατότητα εκτύπωσης PDF'
      ]
    },
    {
      icon: <Search size={32} />,
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Βρείτε κατάλληλο κτηνίατρο με βάση την περιοχή, την ειδικότητα και τις αξιολογήσεις άλλων ιδιοκτητών.',
      features: [
        'Πρόβλημα λεπτομερειών κτηνιάτρων',
        'Πρόβλημα προφίλ και αξιολογήσεων',
        'Άμεση κράτηση ραντεβού'
      ]
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Δηλώσεις Απώλειας & Εύρεσης',
      description: 'Δηλώστε απώλεια ή εύρεση ενός κατοικιδίου σας. Οι δηλώσεις είναι ορατές σε όλους τους χρήστες και επικοινωνούν στο κτηνιατρικό δίκτυο.',
      features: [
        'Προσαρμογή αποθήκευσης',
        'Επεξεργασία πριν την υποβολή',
        'Ιστορικό δηλώσεων'
      ]
    },
    {
      icon: <Clock size={32} />,
      title: 'Διαχείριση Ραντεβού',
      description: 'Προγραμματίστε ραντεβού με επιλεγμένους κτηνιάτρους. Διαχειρίστε τα ραντεβού σας και ενημερωθείτε για επικοινωνίες κτηνιαγρών.',
      features: [
        'Κατανόηση: Ενημέρωμες, Επεισόδιες, Ολοκληρωμένο',
        'Ανακοίνωση ιστορικού κρατήσεων',
        'Αυτόματες υπενθυμίσεις'
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
            <li><a href="#faq-2">Πώς μπορώ να δω τα ψηφιακά αρχείο ραντεβού μου;</a></li>
            <li><a href="#faq-3">Πώς μπορώ να κλείσω ραντεβού με κάποιον κτηνίατρο;</a></li>
            <li><a href="#faq-4">Πώς μπορώ να αξιολογήσω κατοικών κτηνιάτρων.</a></li>
            <li><a href="#faq-5">Πώς μπορώ να επεξεργάζομαι ή να διαγράψω τα προφίλ μας;</a></li>
            <li><a href="#faq-6">Πώς μπορώ να δω όλες τις δηλώσεις μας και ης επεξεργασίας;</a></li>
            <li><a href="#faq-7">Πώς μπορώ να δηλώσω την απώλεια του κατοικιδίου μου;</a></li>
            <li><a href="#faq-8">Πώς μπορώ να δηλώσω την εύρεση ενός κατοικιδίου που βρήκα;</a></li>
            <li><a href="#faq-9">Πώς μπορώ να δημιουργήσω λογαρίασμό;</a></li>
            <li><a href="#faq-10">Πώς μπορώ να ανεβάσω ημερολόγιο επισκέψεων;</a></li>
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
                  <h3>Επιλέξτε "Μενού"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Βιβλιάριο Υγείας"</h3>
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
                  <h3>Επιλέξτε "Μενού"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Τα Ραντεβού μου"</h3>
                  <p>Εδώ εμφανίζονται όλα τα ραντεβού που έχετε κλείσει με κάποιον κτηνίατρο. Στην κατάσταση "Επεξεργασίας". Ο κτηνίατρος μπορεί να κρατήσει για ραντεβού με κάποιον επιτήδειο. Στην κατάσταση "Ενεργού", ο κτηνίατρος μπορεί να πει ναι για ραντεβού με κάποιον επιτήδειο, η δυνατότητα ακύρωσης από το δύο μέρη είναι διαθέσιμη. Επιπλέον, έχετε τη δυνατότητα να ακυρώσετε οποιαδήποτε ενεργή ραντεβού του ρεντεβού σας. Τα ακυρωμένα ραντεβού θα παραμείνουν λοιπόν ανενεργά και δεν μπορούν να προσφερθούν.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Ενέργο"</h3>
                  <p>Εδώ μπορείτε να δείτε όλα τα ενεργό ραντεβού σας. Αυτό που βρίσκονται στην κατάσταση "Επιβεβαιωμένο" έχουν εγκριθεί από τον κτηνίατρο, ενώ αυτό που βρίσκονται στην κατάσταση "Ενέργειες" αναμένουν έγκρισης από τον κτηνίατρο. Αν θέλετε να ακυρώσετε ένα ραντεβού, πατήστε το κουμπί Χ που βρίσκεται δίπλα από το ραντεβού.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Ιστορικό"</h3>
                  <p>Εδώ μπορείτε να δείτε όλα τα ραντεβού σας που έχουν ολοκληρωθεί ("Ολοκληρωμένα") ή που έχουν ακυρωθεί είτε από σας είτε από τον κτηνίατρο ("Ακυρωμένα").</p>
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
                  <h3>Επιλέξτε "Μενού" και επιτα "Αναζήτηση Κτηνιάτρων" ή από τη γραμμή πλοήγησης επιλέξτε "Κτηνιάτροι"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Κάντε ανακοίνωση σας</h3>
                  <p>Επιλέξτε τον κτηνίατρο που θέλετε να βρείτε και να αφήσετε στο δύναμο κτηνιατρείο για ένα. Μπορείτε να δείτε περισσότερες πληροφορίες για τους κτηνιάτρους και τους υπηρεσίες που προσφέρουν και την ημερομηνία που είναι διαθέσιμοι. "Τροποποίηση προφίλ".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Κλείστε το ραντεβό</h3>
                  <p>Πατήστε το κουμπί "Κλείσε ραντεβού" για τον κτηνίατρο που θέλετε διαλέξετε.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τα φόρμα</h3>
                  <p>Επιλέξτε το κατοικίδιό σας για το οποίο θέλετε το ραντεβό, διαλέξτε ημερομηνία, ώρα καθώς και τους λόγους κι χρειες που υπάρχουν διατιθέσεις και γενικές και χρήσιμες προσφορές κατόπιν του κτηνιάτρου.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">6</div>
                <div className="owner-step-content">
                  <h3>Στείλτε το αίτημα σας</h3>
                  <p>Πατήστε το κουμπί "Αποστολή αιτήματος". Το αίτημα σας, θα στελθεί στον κτηνίατρο και θα πρέπει να επιβεβαιωθεί για την επιβεβαίωση της για την κατακύρωση του.</p>
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
            
            <div className="owner-info-note">
              <strong>Σημείωση!</strong> Μπορείτε να αξιολογήσετε μόνο τους κτηνιάτρους που έχετε ολοκληρώσει κάποιο ραντεβού.
            </div>
            
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
                  <h3>Επιλέξτε "Μενού"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Το Ρεντεβού μου"</h3>
                  <p>Εδώ εμφανίζονται όλα τα ραντεβού που έχετε κλείσει με κάποιον κτηνίατρο.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Επιλέξτε "Ιστορικό"</h3>
                  <p>Εδώ μπορείτε να δείτε όλα τα ραντεβού σας που έχουν ολοκληρωθεί ("Ολοκληρωμένα") και από αυτό κάνετε αξιολόγηση. Πατήστε το κουμπί "Αποστολή Αξιολόγησης".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Κάντε αξιολόγηση σας</h3>
                  <p>Γράψτε τη διαφορά (1 - 5 αστέρια) και προσθέστε κάποια σχόλιο. Πατήστε το κουμπί "Αποστολή Αξιολόγησης".</p>
                </div>
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
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Επιλέξτε <span style={{color: '#23CED9'}}>📋 Λογαριασμός</span></h4>
                  <p>Βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα δείτε, επιλέξτε "Το Προφίλ μου".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Επιμεληθείτε το προφίλ σας</h4>
                  <p>Πατήστε το κουμπί "Επεξεργασία" και πραγματοποιήστε αποδεκτές αλλαγές. Δείτε στο σταθμό του λογαριασμού σας.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Αποθηκεύστε τις αλλαγές</h4>
                  <p>Πατήστε το κουμπί "Αποθήκευση" για να διατηρήσετε οι αλλαγές που έχετε κάνει στο προφίλ σας. Αν θέλετε & θέλετε να αποθηκεύσετε τις αλλαγές, πατήστε το κουμπί "Ακύρωση".</p>
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
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Επιλέξτε <span style={{color: '#23CED9'}}>📋 Λογαριασμός</span></h4>
                  <p>Βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα δείτε, επιλέξτε "Το Προφίλ μου".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#101828', margin: '0 0 6px 0'}}>Διαγραφή του λογαριασμού σας</h4>
                  <p>Πατήστε το κουμπί "Διαγραφή Λογαριασμού" και στη συνέχεια επιβεβαιώστε την ενέργεια διαγραφή του προφίλ σας πατώντας το κουμπί διαγραφή.</p>
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
                  <h3>Επιλέξτε "Μενού"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Προφίλ δηλώσεων</h3>
                  <p>Επιλέξτε τη σελίδα δηλώσεων. Εδώ βρίσκονται όλες οι δηλώσεις σας. Οι δηλώσεις σε κατάσταση "Ενεργές" έχουν υποβληθεί και μπορείτε να τις επεξεργαστείτε ή να τις διαγράψετε. Οι δηλώσεις σε κατάσταση "Ολοκληρωμένες" έχουν υποβληθεί αλλά δεν μπορείτε πλέον να κάνετε κάποιο βήμα σας. Πατήστε το κουμπί "Προβολή".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">4</div>
                <div className="owner-step-content">
                  <h3>Επεξεργασία δήλωσης</h3>
                  <p>Πατήστε το κουμπί "Επεξεργασία" στη δήλωση που θέλετε να επεξεργαστούν και πραγματοποιήστε τις αλλαγές που θέλετε να κάνετε. Αν θέλετε να αποθηκεύσετε τη δήλωση, πατήστε το κουμπί "Σήμανση". Αν θέλετε να αποδεχθείτε την αποθήκευση αλλαγών σας, πατήστε το κουμπί "Αποθήκευση". Αν δεν θέλετε να αποθηκεύσετε τις αλλαγές σας, πατήστε το κουμπί "Ακύρωση".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">5</div>
                <div className="owner-step-content">
                  <h3>Διαγραφή δήλωσης</h3>
                  <p>Πατήστε το κουμπί "Διαγραφή" στη δήλωση που θέλετε να διαγράψετε και ύστερα πιστοποιήστε την ενέργεια διαγραφής του προφίλ σας πατώντας το κουμπί "Διαγραφή".</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 7 */}
        <div className="owner-faq-container">
          {/* FAQ Section 7 */}
          <div className="owner-faq-section" id="faq-7">
            <h2>Πώς μπορώ να δηλώσω την απώλεια του κατοικιδίου μου;</h2>
            
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
                  <h3>Επιλέξτε "Μενού"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Επιλέξτε "Δήλωση Απώλειας". Συμπληρώστε όλα τα στοιχεία και πατήστε "Δημιουργία υπαγγελίας" για να ενημερώσετε το αίτημα προσφορά και να μη τις δηλώσετε. Πατήστε το κουμπί "Αποστολή" και δεν θα είναι ικανά να αποθηκεύσετε ή να υπογράψετε τη δήλωση.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Container 8 */}
        <div className="owner-faq-container">
          {/* FAQ Section 8 */}
          <div className="owner-faq-section" id="faq-8">
            <h2>Πώς μπορώ να δηλώσω την εύρεση ενός κατοικιδίου που βρήκα;</h2>
            
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
                  <h3>Επιλέξτε "Μενού"</h3>
                  <p>Το μενού βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Μέσα σε αυτό υπάρχουν όλες οι ενέργειες που μπορούν να κάνουν οι ιδιοκτήτες.</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε τη δήλωση</h3>
                  <p>Επιλέξτε "Δήλωση Εύρεσης". Τα προσφορών σας αποτελεί ένα πυκνοστιχία στη σχέση, μπορείτε όμως να ταξιδέψετε τώρα κι έτσι θα δίδετε. Συμπληρώστε τα φόρμα και πατήστε "Δημιουργία υπαγγελίας" για να ενημερώσετε το αίτημα προσφορά και να μη τις δηλώσετε. Πατήστε το κουμπί "Αποστολή" και δεν θα είναι ικανά να αποθηκεύσετε ή να υπογράψετε τη δήλωση.</p>
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
                  <p>Το κουμπί βρίσκεται πάνω δεξιά στη γραμμή πλοήγησης. Από τη λίστα που θα δείτε, επιλέξτε "Δεν διαθέτεις"</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">2</div>
                <div className="owner-step-content">
                  <h3>Συμπληρώστε το φόρμα</h3>
                  <p>Συμπληρώστε το φόρμα με τα στοιχεία σας και πατήστε το κουμπί "Εγγραφή".</p>
                </div>
              </div>
            </div>

            <div className="owner-info-note">
              <strong>Σημείωση!</strong> Σας θαυμάζουμε λογαριασμό, δες αποτύχιμο το βιβλιάριο των κατοικιδίων σας ότι υπάρχουν ενισχύσεις οικογενειακή αποσπάσματα που θα μέσον αποτολμηθείτε σε κατασκευή κτηνίατρο.
            </div>
          </div>
        </div>

        {/* FAQ Container 10 */}
        <div className="owner-faq-container">
          {/* FAQ Section 10 */}
          <div className="owner-faq-section" id="faq-10">
            <h2>Πώς μπορώ να ανεβάσω χαμένα κατοικίδια;</h2>
            
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
                  <h3>Κάντε ανεβάσεις σας</h3>
                  <p>Επιλέξτε να κατάλαβα φέρνα ή βίντο την αναζήτηση που θέλετε να κάνετε. Αν θέλετε να δείτε λεπτομέρειες ονειρευμένι να δείτε λεπτομέρειες ονειρευμένι να δείτε λεπτομέρειες ονειρευμένι πατήστε το κουμπί "Προβολή λεπτομερειών".</p>
                </div>
              </div>

              <div className="owner-step">
                <div className="owner-step-number">3</div>
                <div className="owner-step-content">
                  <h3>Βρείτε ένα συγκεκριμένο κατοικίδιο</h3>
                  <p>Πατήστε το κουμπί "Το Βρήκα - Δήλωση Εύρεσης" από το λεπτομέρειες του κατοικιδίου σας συμπληρώστε τη φόρμα.</p>
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
              <label>Όλες οι ιατρικές πράξεις και κατοικιδιακά κατοικιδίων μόνο στα ποτοποιούμενες επιπρόσθες</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Μπορείτε να ακυρώσετε ή να ματοποιήσετε ραντεβού που την επιβεβαίωση τους</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Οι δηλώσεις αίτησης είναι ορατές σε όλους τους χρήστες τον ιστοχώρου</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Μπορείτε να αξιολογήσετε κτηνιάτρους μετα από κάθε επίσκεψη</label>
            </div>
            <div className="owner-checklist-item">
              <SquareCheckBig size={20} className="owner-checklist-icon" />
              <label>Διαγραφές μεγαλύτερων, υοθλοπίες και ανακύκλυση αιτήματος υα ύψιων μόνο από ποσοπμένο κτηνιατρείο</label>
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
