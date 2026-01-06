import React from 'react';
import PageLayout from '../../components/global/layout/PageLayout';

const LostPets = () => {
  return (
    <PageLayout title="Απώλειες" breadcrumbs={[{ label: 'Αρχική', path: '/' }]}> 
      <div style={{ padding: '1rem' }}>
        <p>Λίστα δηλωμένων απωλειών κατοικιδίων (υπό κατασκευή).</p>
      </div>
    </PageLayout>
  );
};

export default LostPets;
