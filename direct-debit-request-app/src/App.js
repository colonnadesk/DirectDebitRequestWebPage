import React, { useState } from 'react';
import './App.css';
import logo from './assets/Colonnade-logo.png';
import { isValid } from 'iban';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: '',
    birthNumber: '',
    phoneNumber: '',
    email: '',
    iban: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    policyNumber: '',
    birthNumber: '',
    phoneNumber: '',
    email: '',
    iban: '',
  });

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

  const validateIban = (e) => {
    const iban = e.target.value;
  
    if (iban && isValid(iban) && iban.startsWith('SK')) {
      setFormErrors({ ...formErrors, iban: '' });
    } else {
      setFormErrors({
        ...formErrors,
        iban: 'Please enter a valid Slovak IBAN',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="App">
      <img src={logo} alt="Colonnade Logo" className="logo" />
      {!submitted ? (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="policyNumber">Policy Number:</label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleInputChange}
              pattern="\d{10}"
              title="Policy Number must be exactly 10 digits long"
              required
            />
            <span className="error">{formErrors.policyNumber}</span>

            <label htmlFor="evidenceClientNumber">Birth Number:</label>
            <input
              type="text"
              name="birthNumber"
              value={formData.birthNumber}
              onChange={handleInputChange}
              pattern="\d{10}"
              title="Birth Number must be exactly 10 digits long"
              required
            />
            <span className="error">{formErrors.birthNumber}</span>

            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              pattern="^\+\d{1,3}\s\d{1,14}(\s\d{1,13})?$"
              title="Phone Number must be a valid international format (e.g., +1 555 123 4567)"
              required
            />
            <span className="error">{formErrors.phoneNumber}</span>

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              title="Please enter a valid email address"
              required
            />
            <span className="error">{formErrors.email}</span>

            <label htmlFor="iban">IBAN:</label>
            <input
              type="text"
              name="iban"
              value={formData.iban}
              onChange={handleInputChange}
              onBlur={validateIban}
              required
            />

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