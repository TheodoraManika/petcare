import React from 'react';
import PageFoundPetForm from '../../pages/citizen/FoundPetForm';

// Simple wrapper: reuse the page-level FoundPetForm in inline mode
export default function FoundPetForm(props) {
  return <PageFoundPetForm inline={true} {...props} />;
}
