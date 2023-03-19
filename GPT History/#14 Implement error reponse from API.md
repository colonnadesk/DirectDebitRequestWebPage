Prompt: 
This is the example of a response from the API {"title":"Validation error","status":400,"detail":"One or more validation errors occurred.","instance":"/api/DirectDebitRequests","errors":[{"title":"Iban","message":"IBAN must be a valid IBAN."}],"traceId":"00-abe4b1a04f62cc22bc5f1cc3e9f988ad-42eb5be0ad39c5de-00"}

GPT:
To display the error messages from the API response, you should update the handleSubmit function to handle the error data and set the appropriate form errors based on the API response. Here's how you can do that:

Update the handleSubmit function to handle the API error messages:
javascript
Copy code
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!isValidPhoneNumber(formData.phoneNumber)) {
    setFormErrors({ ...formErrors, phoneNumber: 'Please enter a valid international phone number.' });
    return;
  }

  try {
    const response = await fetch("https://localhost:7255/api/DirectDebitRequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(new FormData(event.target))),
    });

    if (response.ok) {
      setSubmitted(true);
    } else {
      const errorData = await response.json();

      if (errorData.errors) {
        const newFormErrors = {};

        errorData.errors.forEach((error) => {
          newFormErrors[error.title.toLowerCase()] = error.message;
        });

        setFormErrors(newFormErrors);
      } else {
        setApiError(errorData.message || 'There was an error submitting the form. Please try again.');
      }
    }
  } catch (error) {
    console.error("Error:", error);
    setApiError('There was an error submitting the form. Please try again.');
  }
};
With these changes, your website will display the error messages from the API response in the form. The error messages will be shown for each input field based on the title property in the error object, making it easier for users to understand and fix the issues with their input.