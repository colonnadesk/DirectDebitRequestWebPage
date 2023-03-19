Prompt:
Perfect, logo looks good and I've also optimized it to 360x202px. 
Let's move forward. I would like to implement form validation with following requirements:
PolicyNumber has to be exactly 10 charactes long all characters should be digits.
Birthnumber has to be also 10 characters long all digits.
Phone number has to be valid international format.
Email has to be valid email.
IBAN has to be valid slovak version of IBAN.

Please suggest how to best implement validations. Priority is best possible user experience.

GPT: 
To implement form validation with a focus on user experience, you can use a combination of built-in HTML5 validation attributes and custom JavaScript validation for more specific requirements. Here's how you can approach this:

Update the form elements in src/App.js with the appropriate HTML5 validation attributes:
javascript
Copy code
// PolicyNumber
<input
  type="text"
  name="policyNumber"
  value={formData.policyNumber}
  onChange={handleInputChange}
  pattern="\d{10}"
  title="Policy Number must be exactly 10 digits long"
  required
/>

// BirthNumber
<input
  type="text"
  name="birthNumber"
  value={formData.birthNumber}
  onChange={handleInputChange}
  pattern="\d{10}"
  title="Birth Number must be exactly 10 digits long"
  required
/>

// PhoneNumber
<input
  type="tel"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleInputChange}
  pattern="^\+\d{1,3}\s\d{1,14}(\s\d{1,13})?$"
  title="Phone Number must be a valid international format (e.g., +1 555 123 4567)"
  required
/>

// Email
<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  title="Please enter a valid email address"
  required
/>
For the IBAN validation, since it requires more specific validation (Slovak version), you can use the popular iban.js library, which can be installed using npm:
bash
Copy code
npm install iban
Import the iban library in your src/App.js file:
javascript
Copy code
import { isValid } from 'iban';
Add a custom validation function for the IBAN input:
javascript
Copy code
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
Update the IBAN input element in your src/App.js file to use the custom validation function:
javascript
Copy code
<input
  type="text"
  name="iban"
  value={formData.iban}
  onChange={handleInputChange}
  onBlur={validateIban}
  required
/>
To display validation error messages, update the form elements in src/App.js:
javascript
Copy code
// PolicyNumber
<span className="error">{formErrors.policyNumber}</span>

// BirthNumber
<span className="error">{formErrors.birthNumber}</span>

// PhoneNumber
<span className="error">{formErrors.phoneNumber}</span>

// Email
<span className="error">{formErrors.email}</span>

// IBAN
<span className="error">{formErrors.iban}</span>
Add styles for the error messages in your src/App.css file:
css
Copy code
.error {
  color: #e4002b;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}
With these changes, the form will now display validation error messages for each input field based on the specified requirements. By using a combination of HTML5 validation attributes and custom JavaScript validation, you can ensure a smooth user experience while maintaining the necessary validation constraints.