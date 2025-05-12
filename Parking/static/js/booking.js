document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    
    // Check if elements exist and log for debugging
    const parkingForm = document.getElementById("booking-form");
    const personalInfoForm = document.getElementById("personal-info-form");
    const paymentForm = document.getElementById("payment-form");
    const confirmButton = document.getElementById("confirm-booking");
    
    console.log("Booking form:", parkingForm);
    console.log("Personal info form:", personalInfoForm);
    console.log("Payment form:", paymentForm);
    console.log("Confirm button:", confirmButton);
    
    // Sample date for the booking
    const availableDate = "February 20, 2025";
    
    // Initialize review elements (add null checks)
    const reviewSlot = document.getElementById("review-slot");
    const reviewDate = document.getElementById("review-date");
    const reviewName = document.getElementById("review-name");
    const reviewEmail = document.getElementById("review-email");
    const reviewPhone = document.getElementById("review-phone");
    
    // When the user updates the form
    if (parkingForm) {
        parkingForm.addEventListener("change", updateReview);
    }
    
    if (personalInfoForm) {
        personalInfoForm.addEventListener("input", updateReview);
    }
    
    function updateReview() {
        const parkingSlot = document.getElementById("parking-slot");
        const fullName = document.getElementById("full-name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        
        // Only update if elements exist
        if (parkingSlot && reviewSlot) {
            reviewSlot.textContent = parkingSlot.value || "Express Avenue Mall";
        }
        
        if (reviewDate) {
            reviewDate.textContent = availableDate;
        }
        
        if (fullName && reviewName) {
            reviewName.textContent = fullName.value || "Not Provided";
        }
        
        if (email && reviewEmail) {
            reviewEmail.textContent = email.value || "Not Provided";
        }
        
        if (phone && reviewPhone) {
            reviewPhone.textContent = phone.value || "Not Provided";
        }
    }
    
    // Create a success message element
    function createSuccessMessage(bookingDetails) {
        // Create success message container
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.position = 'fixed';
        successMessage.style.top = '50%';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translate(-50%, -50%)';
        successMessage.style.backgroundColor = '#f0fff0';
        successMessage.style.border = '2px solid #4caf50';
        successMessage.style.borderRadius = '8px';
        successMessage.style.padding = '20px';
        successMessage.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        successMessage.style.zIndex = '1000';
        successMessage.style.maxWidth = '500px';
        successMessage.style.width = '80%';

        // Create header
        const header = document.createElement('h3');
        header.textContent = 'Booking Confirmed Successfully!';
        header.style.color = '#4caf50';
        header.style.marginTop = '0';
        header.style.textAlign = 'center';
        successMessage.appendChild(header);

        // Create details container
        const detailsContainer = document.createElement('div');
        detailsContainer.style.marginTop = '15px';
        
        // Add booking details
        const details = [
            {label: 'Parking Location', value: bookingDetails.parkingSlot},
            {label: 'Booking Date', value: bookingDetails.bookingDate},
            {label: 'Name', value: bookingDetails.fullName},
            {label: 'Email', value: bookingDetails.email},
            {label: 'Phone', value: bookingDetails.phone}
        ];
        
        details.forEach(detail => {
            const detailRow = document.createElement('p');
            detailRow.style.margin = '8px 0';
            detailRow.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
            detailsContainer.appendChild(detailRow);
        });
        
        successMessage.appendChild(detailsContainer);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'btn';
        closeButton.style.marginTop = '15px';
        closeButton.style.width = '100%';
        closeButton.style.padding = '8px';
        closeButton.style.backgroundColor = '#4caf50';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        
        closeButton.addEventListener('click', () => {
            successMessage.remove();
            window.location.href = "/dashboard"; // Redirect to dashboard after closing
        });
        
        successMessage.appendChild(closeButton);
        
        return successMessage;
    }
    
    // Handle the confirm booking button click
    if (confirmButton) {
        console.log("Adding event listener to confirm button");
        
        confirmButton.addEventListener("click", function(e) {
            console.log("Confirm button clicked");
            e.preventDefault();
            
            // Get form values
            const parkingSlot = document.getElementById("parking-slot");
            const fullName = document.getElementById("full-name");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            
            // Create booking details object
            const bookingDetails = {
                parkingSlot: parkingSlot ? parkingSlot.value : "Express Avenue Mall",
                bookingDate: availableDate,
                fullName: fullName ? fullName.value : "John Doe",
                email: email ? email.value : "johndoe@example.com",
                phone: phone ? phone.value : "+1234567890"
            };
            
            // Check if we're in testing/development mode (for demo purposes)
            const isTestMode = false; // Set to false in production
            
            if (isTestMode) {
                // Show success message directly for testing
                const successMessage = createSuccessMessage(bookingDetails);
                document.body.appendChild(successMessage);
            } else {
                // For production: Validate forms before submission
                if (!validateForms()) {
                    console.log("Form validation failed");
                    return;
                }
                
                console.log("Collecting form data");
                // Collect all form data
                // Change this in booking.js where you collect the form data
                const formData = new FormData();
                
                // Add parking slot data
                formData.append('parking_slot', parkingSlot.value);
                formData.append('booking_date', availableDate);
                
                // Add personal info
                formData.append('full_name', fullName.value);
                formData.append('email', email.value);
                formData.append('phone', phone.value);
                
                // Add payment info (in a real app, handle this securely)
                const cardNumber = document.getElementById("card-number");
                const expirationDate = document.getElementById("expiration-date");
                const cvv = document.getElementById("cvv");
                
                if (cardNumber && expirationDate && cvv) {
                    formData.append('card_number', cardNumber.value);
                    formData.append('expiration_date', expirationDate.value);
                    formData.append('cvv', cvv.value);
                }
                
                console.log("Submitting booking data to server");
                // Submit the booking data to the server
                fetch('/process_booking', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    console.log("Response received:", response);
                    if(response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(data => {
                    console.log("Success data:", data);
                    
                    // Create and show success message with booking details
                    const successMessage = createSuccessMessage(bookingDetails);
                    document.body.appendChild(successMessage);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("There was a problem confirming your booking. Please try again.");
                });
            }
        });
    } else {
        console.error("Confirm booking button not found in the DOM");
    }
    
    function validateForms() {
        // Check if all required fields are filled
        const parkingSlot = document.getElementById("parking-slot");
        const fullName = document.getElementById("full-name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const cardNumber = document.getElementById("card-number");
        const expirationDate = document.getElementById("expiration-date");
        const cvv = document.getElementById("cvv");
        
        if (!parkingSlot || !parkingSlot.value ||
            !fullName || !fullName.value ||
            !email || !email.value ||
            !phone || !phone.value ||
            !cardNumber || !cardNumber.value ||
            !expirationDate || !expirationDate.value ||
            !cvv || !cvv.value) {
            alert("Please fill in all required fields.");
            return false;
        }
        
        return true;
    }
    
    // Call updateReview initially to populate the review section
    updateReview();
});