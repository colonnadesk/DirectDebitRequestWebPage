Perfect thank you. The form looks much better now. Can we also please get rid of HTML 5 form validation and use only our custom error messages for each field? Please make the submit button disabled if the form is not fully filled with all the valid information.
To get rid of the HTML5 form validation and use only your custom error messages, you can follow these steps:

Add the noValidate attribute to the form element to disable the default HTML5 validation:
jsx
Copy code
<form onSubmit={handleSubmit} noValidate>
Create a function to validate the form fields:
javascript
Copy code
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
    errors.evidenceClientNumber = "Birth Number must be exactly 10 digits long";
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
  if (!isValid(formData.iban) || !formData.iban.startsWith("SK")) {
    isValid = false;
    errors.iban = "Please enter a valid Slovak IBAN";
  }

  setFormErrors(errors);
  return isValid;
};
Update the handleSubmit function to call the validateForm function:
javascript
Copy code
const handleSubmit = async (event) => {
  event.preventDefault();
  setShowErrors(true);

  if (!validateForm()) {
    return;
  }

  // Rest of the handleSubmit code...
};
Update the handleInputChange function to call the validateForm function and manage the disabled state of the submit button:
javascript
Copy code
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  validateForm();
};
Add a disabled attribute to the submit button to disable it when the form is not fully filled with all valid information:
jsx
Copy code
<button type="submit" disabled={!validateForm()}>
  Submit
</button>
With these changes, the form will use your custom error messages for each field and disable the submit button if the form is not fully filled with all valid information.




Ján Jesenský
continue
Here's the updated code with all the changes mentioned above:

jsx
Copy code
import React, { useState, useEffect } from 'react';
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
  const [apiError, setApiError] = useState(null);

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
      errors.evidenceClientNumber = "Birth Number must be exactly 10 digits long";
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
    if (!isValid(formData.iban) || !formData.iban.startsWith("SK")) {
      isValid = false;
      errors.iban = "Please enter a valid Slovak IBAN";
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    // Rest of the handleSubmit code...
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    validateForm();
  };

  // Rest of the component code...

  return (
    <div className="App">
      {/* Other elements... */}

      {!submitted ? (
        <div className="form-container">
          <form onSubmit={handleSubmit} noValidate>
            {/* Other input elements... */}

            <button type="submit" disabled={!validateForm()}>
              Submit
            </button>
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
This updated code includes the changes to disable the submit button if the form is not fully filled with all valid information and uses custom error messages for each field instead of HTML5 form validation.




Ján Jesenský
Please review my code and let me know why it's not working. Also please remember that we've refactored form to DirectDebitForm.js. App.js :import React, { useState } from 'react';
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

export default App;   DirectDebitForm.js: import React, { useState } from "react";
import { isValid } from "iban";
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

    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setFormErrors({
        ...formErrors,
        phoneNumber: "Please enter a valid international phone number.",
      });
      event.target.phoneNumber.classList.add("error");
      return;
    } else {
      event.target.phoneNumber.classList.remove("error");
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

  const validateIban = debounce((e) => {
    const iban = e.target.value;

    if (iban && isValid(iban) && iban.startsWith("SK")) {
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

    validateForm();
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
    if (!isValid(formData.iban) || !formData.iban.startsWith("SK")) {
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
      {showErrors && (
        <span className="error">{formErrors.evidenceClientNumber}</span>
      )}

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
      {apiError && <div className="error api-error">{apiError}</div>}

      <button type="submit" disabled={!validateForm()}>
        Submit
      </button>
    </form>
  );
};

export default DirectDebitForm;
I reviewed your code and found an issue in your DirectDebitForm.js. The problem is that you're using handleSubmit function to validate the phone number, which adds or removes the "error" class. However, the validateForm function should handle all the validations, and you should remove the manual validation from handleSubmit.

Here's the corrected version of your DirectDebitForm.js:

jsx
Copy code
import React, { useState } from "react";
import { isValid } from "iban";
import { isValidPhoneNumber } from "libphonenumber-js";
import { debounce } from "lodash";

const DirectDebitForm = ({ onSuccess }) => {
  // ... Rest of the code ...

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    try {
      // ... Rest of the try block ...
    } catch (error) {
      // ... Rest of the catch block ...
    }
  };

  // ... Rest of the code ...

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (showErrors) {
      validateForm();
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // ... Rest of the validations ...

    setFormErrors(errors);
    return isValid;
  };

  // ... Rest of the component ...

};

export default DirectDebitForm;
After making these changes, the form should work as expected. The errors will be displayed correctly, and the submit button will be disabled when the form is not filled with all valid information.




Ján Jesenský
The error from the browser console says: Uncaught TypeError: isValid is not a function
Apologies for the confusion. The issue is caused by the isValid function being imported from the "iban" library but being shadowed by the local variable isValid in the validateForm function. To fix this issue, you can change the import statement for the "iban" library to import isValid as a different name, like isValidIban.

Here's the updated version of your DirectDebitForm.js:

jsx
Copy code
import React, { useState } from "react";
import { isValid as isValidIban } from "iban";
import { isValidPhoneNumber } from "libphonenumber-js";
import { debounce } from "lodash";

const DirectDebitForm = ({ onSuccess }) => {
  // ... Rest of the code ...

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // ... Rest of the validations ...

    // Validate IBAN
    if (!isValidIban(formData.iban) || !formData.iban.startsWith("SK")) {
      isValid = false;
      errors.iban = "Please enter a valid Slovak IBAN";
    }

    setFormErrors(errors);
    return isValid;
  };

  // ... Rest of the component ...
};

export default DirectDebitForm;
This change should resolve the "Uncaught TypeError: isValid is not a function" error in your console, and the form should work as expected.




Ján Jesenský
Please review DIrectDebitForm.js one more time. This time we are getting Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.import React, { useState } from "react";
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
      validateForm();
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
      {showErrors && (
        <span className="error">{formErrors.evidenceClientNumber}</span>
      )}

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
      {apiError && <div className="error api-error">{apiError}</div>}

      <button type="submit" disabled={!validateForm()}>
        Submit
      </button>
    </form>
  );
};

export default DirectDebitForm;
The issue with too many re-renders is caused by calling validateForm() inside the handleInputChange function. When validateForm() is called, it updates the form errors by calling setFormErrors(), which causes the component to re-render. Since handleInputChange is called every time an input is changed, this creates an infinite loop of re-renders. To fix this issue, you can remove the call to validateForm() from handleInputChange.

Here's the updated handleInputChange function:

javascript
Copy code
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  if (showErrors) {
    // Do not call validateForm() here to avoid infinite re-renders
  }
};
With this change, the form should no longer cause too many re-renders. However, you may want to adjust the validation logic to ensure that errors are displayed and updated correctly as the user fills out the form. You can do this by calling validateForm() only when the form is submitted or by adding individual validation functions for each input field and calling them on specific events like onBlur or onChange.




Ján Jesenský
I had to remove disabled={!validateForm()} from submit button to get the form working again! Please show me version with individual validation functions for each input field.
Here's a version of the DirectDebitForm component with individual validation functions for each input field. I've added separate validation functions for each input field and called them on the onBlur event, which triggers validation when the input field loses focus:

javascript
Copy code
import React, { useState } from "react";
import { isValid as isValidIban } from "iban";
import { isValidPhoneNumber } from "libphonenumber-js";
import { debounce } from "lodash";

const DirectDebitForm = ({ onSuccess }) => {
  // ... (keep the existing state and other functions)

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

  // ... (keep the existing validateIban function)

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ... (keep the existing form structure and update the input fields) */}
      
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

      <input
        type="text"
        name="evidenceClientNumber"
        value={formData.evidenceClientNumber}
        onChange={handleEvidenceClientNumberChange}
        onBlur={() => validateEvidenceClientNumber(formData.evidenceClientNumber)}
        pattern="\d{10}"
        title="Birth



Ján Jesenský
continue
Number must be exactly 10 digits long"
required
/>

php
Copy code
  <input
    type="tel"
    name="phoneNumber"
    value={formData.phoneNumber}
    onChange={handlePhoneNumberChange}
    onBlur={() => validatePhoneNumber(formData.phoneNumber)}
    title="Phone Number must be a valid international format (e.g., +1 555 123 4567)"
    required
  />

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleEmailChange}
    onBlur={() => validateEmail(formData.email)}
    title="Please enter a valid email address"
    required
  />

  <input
    type="text"
    name="iban"
    value={formData.iban}
    onChange={handleIbanChange}
    onBlur={validateIban}
    required
  />

  {/* ... (keep the existing error messages and submit button) */}
</form>
);
};

export default DirectDebitForm;

vbnet
Copy code

In this version, I added separate `handle*Change` functions for each input field, which update the corresponding field in the `formData` state and call the appropriate validation function. The validation functions, like `validatePolicyNumber`, `validateEvidenceClientNumber`, `validatePhoneNumber`, and `validateEmail`, check if the input value is valid and set the corresponding error message in the `formErrors` state if it's not valid. The `onBlur` event is used to trigger validation for each input field when it loses focus.