import React, { useState } from 'react';
import './App.css';
import logo from './assets/Colonnade-logo.png';

function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    try {
      const response = await fetch("https://localhost:7255/api/DirectDebitRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(data)),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("There was an error submitting the form. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="App">
      <img src={logo} alt="Colonnade Logo" className="logo" />
      {!submitted ? (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
          <label htmlFor="policyNumber">Policy Number:</label>
          <input type="text" id="policyNumber" name="policyNumber" required />

          <label htmlFor="evidenceClientNumber">Birth Number:</label>
          <input type="text" id="evidenceClientNumber" name="evidenceClientNumber" required />

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="iban">IBAN:</label>
          <input type="text" id="iban" name="iban" required />

          <button type="submit">Submit</button>
        </form>
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