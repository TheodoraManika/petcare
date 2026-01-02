import React from 'react';
import './TermsPage.css';
import PageLayout from '../../components/global/layout/PageLayout';

const TermsPage = () => {
  return (
    <PageLayout title="Όροι και Προϋποθέσεις">
      <div className="terms-page">
        <div className="terms-container">
          {/* Header Section */}
          <div className="terms-header">
            <h1 className="terms-title">Όροι και Προϋποθέσεις Χρήσης</h1>
          </div>

          {/* Content Sections */}
          <div className="terms-content">
            {/* Section 1 */}
            <section className="terms-section">
              <h2 className="section-heading">1. Αποδοχή Όρων</h2>
              <p className="section-text">
                Με την πρόσβαση και χρήση του ιστοχώρου PetCare, αποδέχεστε και συμφωνείτε να δεσμεύεστε από τους παρόντες όρους και προϋποθέσεις. Εάν δεν συμφωνείτε με οποιαδήποτε όρο, παρακαλούμε μην χρησιμοποιείτε τον ιστοχώρο.
              </p>
            </section>

            {/* Section 2 */}
            <section className="terms-section">
              <h2 className="section-heading">2. Υπηρεσίες Ιστοχώρου</h2>
              <p className="section-text">Ο ιστοχώρος παρέχει:</p>
              <ul className="section-list">
                <li>Ψηφιακό βιβλιάριο υγείας κατοικιδίων</li>
                <li>Αναζήτηση και κλείσιμο ραντεβού με κτηνιάτρους</li>
                <li>Σύστημα δήλωσης απώλειας/εύρεσης κατοικιδίων</li>
                <li>Καταγραφή ιατρικών πράξεων (για κτηνιάτρους)</li>
                <li>Προβολή χαμένων κατοικιδίων</li>
                <li>Αξιολόγηση κτηνιάτρων</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="terms-section">
              <h2 className="section-heading">3. Εγγραφή Χρηστών</h2>
              <p className="section-text">
                Για την πρόσβαση σε ορισμένες λειτουργίες, απαιτείται δημιουργία λογαριασμού. Είστε υπεύθυνοι για τη διατήρηση της εμπιστευτικότητας των στοιχείων του λογαριασμού σας και για όλες τις ενέργειες που πραγματοποιούνται μέσω αυτού.
              </p>
            </section>

            {/* Section 4 */}
            <section className="terms-section">
              <h2 className="section-heading">4. Υποχρεώσεις Χρηστών</h2>
              <p className="section-text">Οι χρήστες δεσμεύονται να:</p>
              <ul className="section-list">
                <li>Παρέχουν ακριβείς και επικαιροποιημένες πληροφορίες</li>
                <li>Χρησιμοποιούν την πλατφόρμα σύμφωνα με το νόμο</li>
                <li>Σέβονται τα δικαιώματα άλλων χρηστών</li>
                <li>Μη διαδίδουν παραπλανητικές ή ψευδείς πληροφορίες</li>
                <li>Μη χρησιμοποιούν τον ιστοχώρο για παράνομους σκοπούς</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="terms-section">
              <h2 className="section-heading">5. Υπηρεσίες Κτηνιάτρων</h2>
              <p className="section-text">
                Ο ιστοχώρος λειτουργεί ως διαμεσολαβητής μεταξύ ιδιοκτητών κατοικιδίων και κτηνιάτρων. Δεν φέρουμε ευθύνη για την ποιότητα των παρεχόμενων κτηνιατρικών υπηρεσιών. Οι κτηνίατροι είναι αποκλειστικά υπεύθυνοι για τις ιατρικές τους πράξεις.
              </p>
            </section>

            {/* Section 6 */}
            <section className="terms-section">
              <h2 className="section-heading">6. Πνευματική Ιδιοκτησία</h2>
              <p className="section-text">
                Όλο το περιεχόμενο του ιστοχώρου (κείμενα, γραφικά, λογότυπα, εικόνες, λογισμικό) προστατεύεται από δικαιώματα πνευματικής ιδιοκτησίας και ανήκει στην PetCare ή στους αντίστοιχους δικαιούχους.
              </p>
            </section>

            {/* Section 7 */}
            <section className="terms-section">
              <h2 className="section-heading">7. Περιορισμός Ευθύνης</h2>
              <p className="section-text">
                Ο ιστοχώρος παρέχεται "ως έχει" χωρίς εγγυήσεις οποιουδήποτε είδους. Δεν φέρουμε ευθύνη για:
              </p>
              <ul className="section-list">
                <li>Διακοπές ή σφάλματα λειτουργίας του ιστοχώρου</li>
                <li>Απώλεια δεδομένων</li>
                <li>Έμμεσες ή άμεσες ζημιές από τη χρήση του ιστοχώρου</li>
                <li>Ενέργειες τρίτων μέσω του ιστοχώρου</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="terms-section">
              <h2 className="section-heading">8. Τροποποίηση Όρων</h2>
              <p className="section-text">
                Διατηρούμε το δικαίωμα να τροποποιούμε τους παρόντες όρους ανά πάσα στιγμή. Οι χρήστες θα ειδοποιούνται για σημαντικές αλλαγές μέσω email ή ανακοίνωσης στον ιστοχώρο.
              </p>
            </section>

            {/* Section 9 */}
            <section className="terms-section">
              <h2 className="section-heading">9. Διακοπή Υπηρεσιών</h2>
              <p className="section-text">
                Διατηρούμε το δικαίωμα να ανασταλούμε ή να τερματίσουμε την πρόσβαση χρήστη που παραβιάζει τους όρους χρήσης, χωρίς προειδοποίηση.
              </p>
            </section>

            {/* Section 10 */}
            <section className="terms-section">
              <h2 className="section-heading">10. Εφαρμοστέο Δίκαιο</h2>
              <p className="section-text">
                Οι παρόντες όροι διέπονται από το ελληνικό δίκαιο. Αρμόδια για την επίλυση οποιασδήποτε διαφοράς είναι τα δικαστήρια της Αθήνας.
              </p>
            </section>

            {/* Section 11 */}
            <section className="terms-section">
              <h2 className="section-heading">11. Επικοινωνία</h2>
              <p className="section-text">
                Για ερωτήσεις σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας:
              </p>
              <ul className="section-list">
                <li><strong>Email:</strong> info@petcare.gr</li>
                <li><strong>Τηλέφωνο:</strong> 210 1234567</li>
                <li><strong>Διεύθυνση:</strong> Λεωφόρος Συγγρού 123, 117 45 Αθήνα, Ελλάδα</li>
              </ul>
              <p className="last-updated">Τελευταία ενημέρωση: Νοέμβριος 2025</p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsPage;
