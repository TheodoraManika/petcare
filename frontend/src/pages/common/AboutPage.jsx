import React from 'react';
import { Sparkles, Heart, Shield, Award, Check, Users } from 'lucide-react';
import './AboutPage.css';
import PageLayout from '../../components/global/layout/PageLayout';

const AboutPage = () => {
  const values = [
    {
      id: 1,
      title: 'Αγάπη για τα Ζώα',
      description: 'Η ευημερία των κατοικιδίων είναι η πρώτη μας προτεραιότητα',
      icon: 'heart',
    },
    {
      id: 2,
      title: 'Ασφάλεια Δεδομένων',
      description: 'Προστατεύουμε τα προσωπικά και ιατρικά σας δεδομένα με υψηλότερα πρότυπα',
      icon: 'shield',
    },
    {
      id: 3,
      title: 'Ποιότητα Υπηρεσιών',
      description: 'Συνεργαζόμαστε μόνο με πιστοποιημένους επαγγελματίες κτηνιάτρους',
      icon: 'award',
    },
  ];

  const services = [
    {
      id: 1,
      title: 'Ψηφιακό Βιβλιάριο Υγείας',
      description: 'Αποθήκευση και παρακολούθηση όλου του ιατρικού ιστορικού του κατοικιδίου σας σε ένα μέρος',
      icon: 'health',
    },
    {
      id: 2,
      title: 'Online Ραντεβού',
      description: 'Κλείστε ραντεβού με κτηνιάτρους online, χωρίς τηλεφωνικές κλήσεις',
      icon: 'booking',
    },
    {
      id: 3,
      title: 'Αξιολογήσεις Κτηνιάτρων',
      description: 'Διαβάστε και γράψτε αξιολογήσεις για τους κτηνιάτρους του ιστοχώρου',
      icon: 'ratings',
    },
    {
      id: 4,
      title: 'Αναζήτηση Κτηνιάτρων',
      description: 'Βρείτε εύκολα κτηνιάτρους κοντά σας με βάση την ειδικότητα και τη διαθεσιμότητα',
      icon: 'search',
    },
    {
      id: 5,
      title: 'Σύστημα Χαμένων Κατοικιδίων',
      description: 'Δημοσιεύστε και αναζητήστε χαμένα κατοικίδια στην περιοχή σας',
      icon: 'lost',
    },
    {
      id: 6,
      title: 'Ειδοποιήσεις & Υπενθυμίσεις',
      description: 'Λάβετε ειδοποιήσεις για επερχόμενα ραντεβού και εμβολιασμούς',
      icon: 'notifications',
    },
  ];

  const reasons = [
    {
      id: 1,
      title: 'Ιδιοκτήτες Κατοικιδίων',
      description: 'Χιλιάδες ιδιοκτήτες εμπιστεύονται την πλατφόρμα μας για τη φροντίδα των κατοικιδίων τους',
      icon: 'owners',
    },
    {
      id: 2,
      title: 'Κτηνίατροι',
      description: 'Δίκτυο πιστοποιημένων κτηνιάτρων που παρέχουν υψηλής ποιότητας υπηρεσίες',
      icon: 'vets',
    },
    {
      id: 3,
      title: 'Κοινότητα',
      description: 'Μια ενεργή κοινότητα που βοηθά στην εύρεση χαμένων κατοικιδίων',
      icon: 'community',
    },
  ];

  return (
    <PageLayout title="Σχετικά με Εμάς">
      <div className="about-page">
        <div className="about-container">
          {/* Header Section */}
          <div className="about-header">
            <h1 className="about-title">Σχετικά με Εμάς</h1>
            <p className="about-subtitle">
              Ο ιστοχώρος PetCare δημιουργήθηκε για να στηρίξει όλους όσους αγαπούν και φροντίζουν τα ζώα, προσφέροντας μια ολοκληρωμένη εμπειρία φροντίδας και παρακολούθησης της υγείας των κατοικιδίων
            </p>
          </div>

          {/* Mission and Vision Section */}
          <div className="mission-vision-section">
            <div className="mission-card">
              <div className="mission-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h2 className="mission-title">Η Αποστολή Μας</h2>
              <p className="mission-text">
                Να διευκολύνουμε την επικοινωνία μεταξύ ιδιοκτητών κατοικιδίων και κτηνιάτρων, παρέχοντας εύκολη πρόσβαση σε κτηνιατρικές υπηρεσίες και ψηφιακή διαχείριση του ιστορικού κατοικιδίων.
              </p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">
                <Sparkles size={32} />
              </div>
              <h2 className="vision-title">Το Όραμά Μας</h2>
              <p className="vision-text">
                Να γίνουμε η πρώτη επιλογή για την ψηφιακή διαχείριση της υγείας των κατοικιδίων στην Ελλάδα, συμβάλλοντας στη βελτίωση της ποιότητας ζωής τους και τη διευκόλυνση των ιδιοκτητών τους.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="values-section">
            <h2 className="section-title">Οι Αξίες Μας</h2>
            <div className="values-grid">
              {values.map((value) => (
                <div key={value.id} className="value-card">
                  <div className={`value-icon ${value.icon}-icon`}>
                    {value.icon === 'heart' && <Heart size={36} />}
                    {value.icon === 'shield' && <Shield size={36} />}
                    {value.icon === 'award' && <Award size={36} />}
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="services-section">
            <h2 className="section-title">Τι Προσφέρουμε</h2>
            <div className="services-container">
              <div className="services-left">
                {services.slice(0, 3).map((service) => (
                  <div key={service.id} className="service-item">
                    <div className={`service-icon ${service.icon}-icon`}>
                      <Check size={20} />
                    </div>
                    <div className="service-content">
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="services-right">
                {services.slice(3, 6).map((service) => (
                  <div key={service.id} className="service-item">
                    <div className={`service-icon ${service.icon}-icon`}>
                      <Check size={20} />
                    </div>
                    <div className="service-content">
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="reasons-section">
            <h2 className="section-title">Σε ποιους απευθυνόμαστε</h2>
            <div className="reasons-grid">
              {reasons.map((reason) => (
                <div key={reason.id} className={`reason-card reason-card-${reason.icon}`}>
                  <div className={`reason-icon ${reason.icon}-icon`}>
                    {reason.icon === 'owners' && <Users size={40} />}
                    {reason.icon === 'vets' && <Award size={40} />}
                    {reason.icon === 'community' && <Heart size={40} />}
                  </div>
                  <h3 className="reason-title">{reason.title}</h3>
                  <p className="reason-description">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="cta-section">
            <h2 className="cta-title">Ξεκινήστε Σήμερα</h2>
            <p className="cta-text">
              Εγγραφείτε δωρεάν και ανακαλύψτε πώς μπορούμε να στηρίξουμε εσάς και τα ζώα που αγαπάτε — είτε είστε ιδιοκτήτης είτε κτηνίατρος
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Εγγραφή Ιδιοκτήτη</button>
              <button className="btn btn-secondary">Εγγραφή Κτηνιάτρου</button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
