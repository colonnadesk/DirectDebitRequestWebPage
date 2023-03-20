Prompt:
 I would like to change look and feel of the form slightly. The inputs should have #ccc border color and be 1px only. The red color should be only used when the inputs has error. Also gap between label and input is quite big, I would like to make it smaller. 

 GPT: 
 To achieve the desired look and feel for the form, update the CSS styles as follows:

Change the input border color to #ccc and set the border width to 1px. Also, add a class for input elements with errors, which will have the red border color.
css
Copy code
input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  font-family: inherit;
  font-size: 16px;
}

input.error {
  border-color: #E4002B;
}
To change the gap between the label and input, decrease the margin-bottom value of the label style:
css
Copy code
label {
  font-weight: bold;
  color: #003859;
  margin-bottom: 2px; /* Adjust this value to your preference */
}
Update the JavaScript code to add the error class to input elements with errors. Update the handleSubmit and validateIban functions like this:
javascript
Copy code
// In the handleSubmit function, after setting form errors:
if (!isValidPhoneNumber(formData.phoneNumber)) {
  setFormErrors({ ...formErrors, phoneNumber: 'Please enter a valid international phone number.' });
  e.target.phoneNumber.classList.add("error");
  return;
} else {
  e.target.phoneNumber.classList.remove("error");
}

// In the validateIban function, after checking the IBAN:
if (iban && isValid(iban) && iban.startsWith('SK')) {
  setFormErrors({ ...formErrors, iban: '' });
  e.target.classList.remove("error");
} else {
  setFormErrors({
    ...formErrors,
    iban: 'Please enter a valid Slovak IBAN',
  });
  e.target.classList.add("error");
}
These changes will update the input border color, width, and gap between the label and input as per your request. The red border color will only appear when there is an error in the input field.




Ján Jesenský
continue
To ensure that the error class is added or removed for other input fields as well, update the handleInputChange function to check for errors after the input value has changed:
javascript
Copy code
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  if (showErrors) {
    if (formErrors[name]) {
      e.target.classList.add("error");
    } else {
      e.target.classList.remove("error");
    }
  }
};
This change will ensure that the error class is added or removed from the input fields as needed when the user interacts with the form.

With these updates, the form should now have the desired look and feel. The inputs will have a #ccc border color with a 1px width, the red color will be applied only when the input has an error, and the gap between the label and input will be smaller. The form should now be visually appealing and provide a better user experience.