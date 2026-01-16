import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPage.css';
import PageLayout from '../../../components/common/layout/PageLayout';
import { ROUTES } from "../../../utils/constants";

const PrivacyPage = () => {
  return (
    <PageLayout title="Πολιτική Απορρήτου">
      <div className="privacy-page">
        <div className="privacy-container">
          {/* Header Section */}
          <div className="privacy-header">
            <h1 className="privacy-title">Πολιτική Απορρήτου</h1>
          </div>

          {/* Content Sections */}
          <div className="privacy-content">
            {/* Section 1 */}
            <section className="privacy-section">
              <h2 className="section-heading">1. Εισαγωγή</h2>
              <p className="section-text">
                Ο ιστοχώρος PetCare δεσμεύεται να προστατεύει την ιδιωτικότητα των χρηστών της. Η παρούσα πολιτική απορρήτου περιγράφει τον τρόπο με τον οποίο συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα.
              </p>
            </section>

            {/* Section 2 */}
            <section className="privacy-section">
              <h2 className="section-heading">2. Δεδομένα που Συλλέγουμε</h2>
              <p className="section-text">Συλλέγουμε τα ακόλουθα είδη πληροφοριών:</p>
              <ul className="section-list">
                <li>
                  <strong>Στοιχεία ταυτοποίησης</strong> (όνομα, email, τηλέφωνο)
                </li>
                <li>Πληροφορίες κατοικιδίων (όνομα, είδος, ιατρικό ιστορικό)</li>
                <li>Στοιχεία ταυτοποίησης για την ανάδήτηση κτηνιάτρων</li>
                <li>Δεδομένα χρήσης της πλατφόρμας</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="privacy-section">
              <h2 className="section-heading">3. Χρήση Δεδομένων</h2>
              <p className="section-text">Χρησιμοποιούμε τα δεδομένα σας για:</p>
              <ul className="section-list">
                <li>Την παροχή των υπηρεσιών μας</li>
                <li>Τη διατήρηση του λογαριασμού σας</li>
                <li>Την επικοινωνία σχετικά με ρανιέβου και ειδοποιήσεις</li>
                <li>Τη βελτίωση των υπηρεσιών μας</li>
                <li>Την τήρηση νομικών υποχρεώσεων</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="privacy-section">
              <h2 className="section-heading">4. Προστασία Δεδομένων</h2>
              <p className="section-text">
                Λαμβάνουμε όλα τα απαραίτητα τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων σας από μη εξουσιοδοτημένη πρόσβαση, απώλεια ή κακή χρήση. Τα δεδομένα αποθηκεύονται σε ασφαλές διακομιστές με κρυπτογραφία.
              </p>
            </section>

            {/* Section 5 */}
            <section className="privacy-section">
              <h2 className="section-heading">5. Κοινοποίηση σε Τρίτους</h2>
              <p className="section-text">
                Δεν πουλάμε, ανταλλάσσουμε ή μεταβιβάζουμε τα προσωπικά σας δεδομένα σε τρίτους χωρίς τη συγκατάθεση σας, εκτός εάν απαιτείται από το νόμο ή για την παροχή των υπηρεσιών (π.χ. κοινοποίηση στοιχείων σε κτηνιάτρους για ρανιέβου).
              </p>
            </section>

            {/* Section 6 */}
            <section className="privacy-section">
              <h2 className="section-heading">6. Τα Δικαιώματα Σας</h2>
              <p className="section-text">Έχετε το δικαίωμα να:</p>
              <ul className="section-list">
                <li>Ζητήσετε πρόσβαση στα προσωπικά σας δεδομένα</li>
                <li>Διορθώσετε ανακριβή δεδομένα</li>
                <li>Ζητήσετε τη διαγραφή των δεδομένων σας</li>
                <li>Αντιταχθείτε στην επεξεργασία των δεδομένων σας</li>
                <li>Ζητήσετε τη φορητότητα των δεδομένων σας</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="privacy-section">
              <h2 className="section-heading">7. Cookies</h2>
              <p className="section-text">
                Χρησιμοποιούμε cookies για τη βελτίωση της εμπειρίας σας στην πλατφόρμα. Για περισσότερες πληροφορίες, δείτε την <Link to={ROUTES.cookies} className="privacy-link">Πολιτική Cookies</Link>.
              </p>
            </section>

            {/* Section 8 */}
            <section className="privacy-section">
              <h2 className="section-heading">8. Επικοινωνία</h2>
              <p className="section-text">
                Για οποιαδήποτε ερώτηση σχετικά με την πολιτική απορρήτου, επικοινωνήστε μαζί μας στο email: <strong>privacy@petcare.gr</strong> ή τηλέφωνο: <strong>210 1234567</strong>
              </p>
              <p className="last-updated">Τελευταία ενημέρωση: Νοέμβριος 2025</p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPage;
