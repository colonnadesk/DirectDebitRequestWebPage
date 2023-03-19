const form = document.getElementById("direct-debit-form");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const data = {
        policyNumber: form.policyNumber.value,
        evidenceClientNumber: form.evidenceClientNumber.value,
        phoneNumber: form.phoneNumber.value,
        email: form.email.value,
        iban: form.iban.value,
    };

    try {
        const response = await fetch("https://localhost:7255/api/DirectDebitRequests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            form.classList.add("hidden");
            confirmation.classList.remove("hidden");
        } else {
            alert("There was an error submitting the form. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error submitting the form. Please try again.");
    }
});
