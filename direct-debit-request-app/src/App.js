import React, { useState } from 'react';
import './App.css';
import logo from './assets/Colonnade-logo.png';
import { isValid } from 'iban';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { debounce } from 'lodash';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: '',
    evidenceClientNumber: '',
    phoneNumber: '',
    email: '',
    iban: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    policyNumber: '',
    evidenceClientNumber: '',
    phoneNumber: '',
    email: '',
    iban: '',
  });

  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);

    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setFormErrors({ ...formErrors, phoneNumber: 'Please enter a valid international phone number.' });
      return;
    }
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

  const validateIban = debounce((e) => {
    const iban = e.target.value;
  
    if (iban && isValid(iban) && iban.startsWith('SK')) {
      setFormErrors({ ...formErrors, iban: '' });
    } else {
      setFormErrors({
        ...formErrors,
        iban: 'Please enter a valid Slovak IBAN',
      });
    }
  }, 500);

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
            {showErrors && <span className="error">{formErrors.policyNumber}</span>}

            <label htmlFor="evidenceClientNumber">Birth Number:</label>
            <input
              type="text"
              name="evidenceClientNumber"
              value={formData.evidenceClientNumber}
              onChange={handleInputChange}
              pattern="\d{10}"
              title="Birth Number must be exactly 10 digits long"
              required
            />
            {showErrors && <span className="error">{formErrors.evidenceClientNumber}</span>}

            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              title="Phone Number must be a valid international format (e.g., +1 555 123 4567)"
              required
            />
            {showErrors && <span className="error">{formErrors.phoneNumber}</span>}


            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              title="Please enter a valid email address"
              required
            />
           {showErrors && <span className="error">{formErrors.email}</span>}

            <label htmlFor="iban">IBAN:</label>
            <input
              type="text"
              name="iban"
              value={formData.iban}
              onChange={handleInputChange}
              onBlur={validateIban}
              required
            />
            {showErrors && <span className="error">{formErrors.iban}</span>}

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