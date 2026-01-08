import React from 'react';
import './CookiesPage.css';
import PageLayout from '../../../components/common/layout/PageLayout';

const CookiesPage = () => {
  return (
    <PageLayout title="Πολιτική Cookies">
      <div className="cookies-page">
        <div className="cookies-container">
          {/* Header Section */}
          <div className="cookies-header">
            <h1 className="cookies-title">Πολιτική Cookies</h1>
          </div>

          {/* Content Sections */}
          <div className="cookies-content">
            {/* Section 1 */}
            <section className="cookies-section">
              <h2 className="section-heading">1. Τι είναι τα Cookies</h2>
              <p className="section-text">
                Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας όταν επισκέπτεστε μια ιστοσελίδα. Χρησιμοποιούνται ευρέως για να κάνουν τις ιστοσελίδες να λειτουργούν αποτελεσματικότερα και να παρέχουν πληροφορίες στους ιδιοκτήτες των ιστοσελίδων.
              </p>
            </section>

            {/* Section 2 */}
            <section className="cookies-section">
              <h2 className="section-heading">2. Πώς Χρησιμοποιούμε τα Cookies</h2>
              <p className="section-text">Χρησιμοποιούμε cookies για τους εξής σκοπούς:</p>
              <ul className="section-list">
                <li>Να διατρέξουμε τη σύνδεση σας στον ιστοχώρο</li>
                <li>Να αναλύουμε τη χρήση του ιστοχώρου</li>
                <li>Να βελτιώνουμε τις υπηρεσίες μας</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="cookies-section">
              <h2 className="section-heading">3. Τύποι Cookies που Χρησιμοποιούμε</h2>
              
              <div className="cookie-type">
                <h3 className="cookie-type-title">Απαραίτητα Cookies</h3>
                <p className="section-text">
                  Αυτά τα cookies είναι απαραίτητα για τη λειτουργία του ιστοχώρου και δεν μπορούν να απενεργοποιηθούν. Συνήθως ορίζονται μόνο ως απόκριση σε ενέργειες που κάνετε, όπως η σύνδεση σας ή η συμπλήρωση φορμών.
                </p>
              </div>

              <div className="cookie-type">
                <h3 className="cookie-type-title">Cookies Ανάλυσης</h3>
                <p className="section-text">
                  Αυτά τα cookies μας επιτρέπουν να μετρήσουμε τον αριθμό επισκέψεων και πηγές κίνησης, ώστε να μπορούμε να μετρήσουμε και να βελτιώσουμε την απόδοση του ιστοχώρου.
                </p>
              </div>

              <div className="cookie-type">
                <h3 className="cookie-type-title">Cookies Λειτουργικότητας</h3>
                <p className="section-text">
                  Αυτά τα cookies επιτρέπουν στην πλατφόρμα να παρέχει βελτιωμένη λειτουργικότητα και εξατομίκευση. Μπορεί να αριστούν από εμάς ή από τρίτους παροχούς των οποίων τις υπηρεσίες έχουμε προσθέσει στις σελίδες μας.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="cookies-section">
              <h2 className="section-heading">4. Cookies Τρίτων</h2>
              <p className="section-text">
                Ορισμένα cookies ενδέχεται να τοποθετηθούν από τρίτες υπηρεσίες που χρησιμοποιούμε, όπως:
              </p>
              <ul className="section-list">
                <li>Υπηρεσίες ανάλυσης (π.χ. Google Analytics)</li>
                <li>Υπηρεσίες κοινωνικών μέσων</li>
                <li>Υπηρεσίες πληρωμών</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="cookies-section">
              <h2 className="section-heading">5. Διαχείριση Cookies</h2>
              <p className="section-text">
                Μπορείτε να ελέγξετε και να διαχειριστείτε τα cookies με διάφορους τρόπους:
              </p>
              
              <div className="cookie-management">
                <h3 className="management-title">Ρυθμίσεις Προγράμματος Περιήγησης</h3>
                <p className="section-text">
                  Τα περισσότερα προγράμματα περιήγησης σας επιτρέπουν να ελέγχετε τα cookies μέσω των ρυθμίσεων της περιήγησής σας και να απορρίψετε cookies ή να σας ειδοποιούν όταν στέλνεται ένα cookie.
                </p>
                <p className="section-text cookie-note">
                  <strong>Σημείωση:</strong> Η απενεργοποίηση ορισμένων cookies ίσως να επηρεάσει τη λειτουργικότητα του ιστοχώρου.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="cookies-section">
              <h2 className="section-heading">6. Διάρκεια Cookies</h2>
              <p className="section-text">Χρησιμοποιούμε δύο τύπους cookies:</p>
              <ul className="section-list">
                <li><strong>Session Cookies:</strong> Προσωρινά cookies που διαγράφονται όταν κλείσετε το πρόγραμμα περιήγησης</li>
                <li><strong>Persistent Cookies:</strong> Παραμένουν στη συσκευή σας για καθορισμένο χρόνο ή μέχρι να διαγράψετε τα ίδια</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="cookies-section">
              <h2 className="section-heading">7. Ενημερώσεις Πολιτικής</h2>
              <p className="section-text">
                Ενδέχεται να ενημερώσουμε την πολιτική cookies περιστασιακά. Σας συνιστούμε να ελέγχετε αυτή τη σελίδα τακτικά για τυχόν αλλαγές.
              </p>
            </section>

            {/* Section 8 */}
            <section className="cookies-section">
              <h2 className="section-heading">8. Επικοινωνία</h2>
              <p className="section-text">Για ερωτήσεις σχετικά με τη χρήση των cookies:</p>
              <ul className="section-list">
                <li><strong>Email:</strong> cookies@petcare.gr</li>
                <li><strong>Τηλέφωνο:</strong> 210 1234567</li>
              </ul>
              <p className="last-updated">Τελευταία ενημέρωση: Νοέμβριος 2025</p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CookiesPage;
