import React, { useState } from 'react';
import './App.css';
import logo from './assets/Colonnade-logo.png';
import DirectDebitForm from './DirectDebitForm';

function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
  };

  return (
    <div className="App">
      <img src={logo} alt="Colonnade Logo" className="logo" />
      {!submitted ? (
          <div className="form-container">
          <DirectDebitForm onSuccess={handleSuccess} />
        </div>
      ) : (
        <div className="confirmation">
          <h2>Thank you for submitting your information!</h2>
          <p>We have received your direct debit request.</p>
        </div>
      )}
    </div>
  );
}

export default App;