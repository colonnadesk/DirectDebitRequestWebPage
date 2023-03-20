import React, { useState } from "react";
import { isValid as isValidIban } from "iban";
import { isValidPhoneNumber } from "libphonenumber-js";
import { debounce } from "lodash";

const DirectDebitForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    policyNumber: "",
    evidenceClientNumber: "",
    phoneNumber: "",
    email: "",
    iban: "",
  });

  const [formErrors, setFormErrors] = useState({
    policyNumber: "",
    evidenceClientNumber: "",
    phoneNumber: "",
    email: "",
    iban: "",
  });

  const [showErrors, setShowErrors] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7255/api/DirectDebitRequests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(new FormData(event.target))),
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        handleApiErrors(response);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("There was an error submitting the form. Please try again.");
    }
  };

  const handleApiErrors = async (response) => {
    const errorData = await response.json();

    if (errorData.errors) {
      const newFormErrors = {};

      errorData.errors.forEach((error) => {
        newFormErrors[error.title.toLowerCase()] = error.message;
      });

      setFormErrors(newFormErrors);
    } else {
      setApiError(
        errorData.message ||
          "There was an error submitting the form. Please try again."
      );
    }
  };

  const handlePolicyNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validatePolicyNumber(value);
  };

  const validatePolicyNumber = (policyNumber) => {
    const policyNumberError = !policyNumber.match(/^\d{10}$/)
      ? "Policy Number must be exactly 10 digits long"
      : "";
    setFormErrors({ ...formErrors, policyNumber: policyNumberError });
  };

  const handleEvidenceClientNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateEvidenceClientNumber(value);
  };

  const validateEvidenceClientNumber = (evidenceClientNumber) => {
    const evidenceClientNumberError = !evidenceClientNumber.match(/^\d{10}$/)
      ? "Birth Number must be exactly 10 digits long"
      : "";
    setFormErrors({
      ...formErrors,
      evidenceClientNumber: evidenceClientNumberError,
    });
  };

  const handlePhoneNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validatePhoneNumber(value);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberError = !isValidPhoneNumber(phoneNumber)
      ? "Please enter a valid international phone number."
      : "";
    setFormErrors({ ...formErrors, phoneNumber: phoneNumberError });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateEmail(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailError = !email.match(emailRegex)
      ? "Please enter a valid email address"
      : "";
    setFormErrors({ ...formErrors, email: emailError });
  };

  const handleIbanChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateIban = debounce((e) => {
    const iban = e.target.value;

    if (iban && isValidIban(iban) && iban.startsWith("SK")) {
      setFormErrors({ ...formErrors, iban: "" });
      e.target.classList.remove("error");
    } else {
      setFormErrors({
        ...formErrors,
        iban: "Please enter a valid Slovak IBAN",
      });
      e.target.classList.add("error");
    }
  }, 500);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (showErrors) {
      //validateForm();
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // Validate policyNumber
    if (!formData.policyNumber.match(/^\d{10}$/)) {
      isValid = false;
      errors.policyNumber = "Policy Number must be exactly 10 digits long";
    }

    // Validate evidenceClientNumber
    if (!formData.evidenceClientNumber.match(/^\d{10}$/)) {
      isValid = false;
      errors.evidenceClientNumber =
        "Birth Number must be exactly 10 digits long";
    }

    // Validate phoneNumber
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      isValid = false;
      errors.phoneNumber = "Please enter a valid international phone number.";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.match(emailRegex)) {
      isValid = false;
      errors.email = "Please enter a valid email address";
    }

    // Validate IBAN
    if (!isValidIban(formData.iban) || !formData.iban.startsWith("SK")) {
      isValid = false;
      errors.iban = "Please enter a valid Slovak IBAN";
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="policyNumber">Policy Number:</label>

      <input
        type="text"
        name="policyNumber"
        value={formData.policyNumber}
        onChange={handlePolicyNumberChange}
        onBlur={() => validatePolicyNumber(formData.policyNumber)}
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
        onChange={handleEvidenceClientNumberChange}
        onBlur={() =>
          validateEvidenceClientNumber(formData.evidenceClientNumber)
        }
        pattern="\d{10}"
        title="Birth Number must be exactly 10 digits long"
        required
      />
      {showErrors && (
        <span className="error">{formErrors.evidenceClientNumber}</span>
      )}
      <label htmlFor="phoneNumber">Phone Number:</label>
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handlePhoneNumberChange}
        onBlur={() => validatePhoneNumber(formData.phoneNumber)}
        title="Phone Number must be a valid international format (e.g., +1 555 123 4567)"
        required
      />
      {showErrors && <span className="error">{formErrors.phoneNumber}</span>}

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleEmailChange}
        onBlur={() => validateEmail(formData.email)}
        title="Please enter a valid email address"
        required
      />
      {showErrors && <span className="error">{formErrors.email}</span>}

      <label htmlFor="iban">IBAN:</label>

      <input
        type="text"
        name="iban"
        value={formData.iban}
        onChange={handleIbanChange}
        onBlur={validateIban}
        required
      />
      {showErrors && <span className="error">{formErrors.iban}</span>}

      {apiError && <div className="error api-error">{apiError}</div>}

      <button type="submit">Submit</button>
    </form>
  );
};

export default DirectDebitForm;
