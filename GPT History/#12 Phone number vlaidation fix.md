Prompt: 
It works. I've tested the form, and I can't proceed with phone number +421907096732 which is valid Slovakian number.

GPT:
I apologize for the confusion. It seems that the regex pattern for the phone number validation isn't suitable for all valid international phone numbers. I suggest using a library like libphonenumber-js to validate phone numbers more accurately.

First, install the library:

Copy code
npm install libphonenumber-js
Then, import the isValidPhoneNumber function from the library:

javascript
Copy code
import { isValidPhoneNumber } from 'libphonenumber-js';
Next, update the phone number validation in the handleSubmit function:

javascript
Copy code
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!isValidPhoneNumber(formData.phoneNumber)) {
    setFormErrors({ ...formErrors, phoneNumber: 'Please enter a valid international phone number.' });
    return;
  }

  // ...rest of the handleSubmit function...
};
Finally, remove the pattern attribute from the phone number input field:

javascript
Copy code
<input
  type="tel"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleInputChange}
  title="Phone Number must be a valid international format (e.g., +1 555 123 4567)"
  required
/>
<span className="error">{formErrors.phoneNumber}</span>
Now the form should accept valid Slovakian phone numbers like +421907096732.