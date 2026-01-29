// ============================================
// Demo Request Form JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('demoForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Set minimum date for date picker to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        // Validate at least one product is selected
        const productCheckboxes = form.querySelectorAll('input[name="interestedProducts"]:checked');
        const checkboxGroup = form.querySelector('.checkbox-group');
        const checkboxError = checkboxGroup.parentElement.querySelector('.error-message');

        if (productCheckboxes.length === 0) {
            isValid = false;
            checkboxError.textContent = 'Please select at least one product';
            checkboxGroup.parentElement.classList.add('error');
        } else {
            checkboxError.textContent = '';
            checkboxGroup.parentElement.classList.remove('error');
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            jobTitle: document.getElementById('jobTitle').value.trim(),
            organizationName: document.getElementById('organizationName').value.trim(),
            industryType: document.getElementById('industryType').value,
            organizationSize: document.getElementById('organizationSize').value,
            country: document.getElementById('country').value,
            interestedProducts: Array.from(productCheckboxes).map(cb => cb.value),
            preferredDate: document.getElementById('preferredDate').value,
            preferredTime: document.getElementById('preferredTime').value,
            comments: document.getElementById('comments').value.trim(),
            submittedAt: new Date().toISOString()
        };

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // Submit to API
            const response = await fetch('/api/demo/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                successMessage.style.display = 'flex';
                form.reset();

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Remove all validation classes
                inputs.forEach(input => {
                    input.parentElement.classList.remove('error', 'valid');
                });

                // Optional: Redirect after 3 seconds
                // setTimeout(() => {
                //     window.location.href = 'index.html';
                // }, 3000);
            } else {
                // Error from server
                throw new Error(data.message || 'Failed to submit demo request');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            errorText.textContent = error.message || 'An error occurred. Please try again or contact us directly at sales@thelabax.com';
            errorMessage.style.display = 'flex';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    // Field validation function
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return true;

        const errorSpan = formGroup.querySelector('.error-message');
        let isValid = true;
        let errorMsg = '';

        // Skip validation for optional fields if empty
        const isRequired = field.hasAttribute('required');
        const isEmpty = !field.value.trim();

        if (!isRequired && isEmpty) {
            formGroup.classList.remove('error', 'valid');
            if (errorSpan) errorSpan.textContent = '';
            return true;
        }

        // Required field validation
        if (isRequired && isEmpty) {
            isValid = false;
            errorMsg = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMsg = 'Please enter a valid email address';
            }
        }

        // Phone validation (optional but if provided, should be valid)
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value.trim()) || field.value.trim().length < 10) {
                isValid = false;
                errorMsg = 'Please enter a valid phone number';
            }
        }

        // Select validation
        if (field.tagName === 'SELECT' && isRequired && !field.value) {
            isValid = false;
            errorMsg = 'Please select an option';
        }

        // Update UI
        if (errorSpan) {
            errorSpan.textContent = errorMsg;
        }

        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('valid');
        } else {
            formGroup.classList.remove('valid');
            formGroup.classList.add('error');
        }

        return isValid;
    }

    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    e.target.value = value;
                } else if (value.length <= 6) {
                    e.target.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    e.target.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
        });
    }

    // Character counter for comments (optional enhancement)
    const commentsField = document.getElementById('comments');
    if (commentsField) {
        const maxLength = 500;
        const counterDiv = document.createElement('div');
        counterDiv.style.cssText = 'font-size: 0.875rem; color: var(--text-tertiary); margin-top: 0.5rem; text-align: right;';
        commentsField.parentElement.appendChild(counterDiv);

        function updateCounter() {
            const remaining = maxLength - commentsField.value.length;
            counterDiv.textContent = `${commentsField.value.length} / ${maxLength} characters`;
            if (remaining < 50) {
                counterDiv.style.color = '#EF4444';
            } else {
                counterDiv.style.color = 'var(--text-tertiary)';
            }
        }

        commentsField.setAttribute('maxlength', maxLength);
        commentsField.addEventListener('input', updateCounter);
        updateCounter();
    }

    // Checkbox group validation
    const checkboxes = form.querySelectorAll('input[name="interestedProducts"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const checked = form.querySelectorAll('input[name="interestedProducts"]:checked');
            const checkboxGroup = form.querySelector('.checkbox-group');
            const errorSpan = checkboxGroup.parentElement.querySelector('.error-message');

            if (checked.length > 0) {
                checkboxGroup.parentElement.classList.remove('error');
                checkboxGroup.parentElement.classList.add('valid');
                if (errorSpan) errorSpan.textContent = '';
            }
        });
    });

    // Prevent form submission on Enter key (except in textarea)
    form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });

    // Add smooth focus transitions
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    console.log('Demo form initialized successfully! 📋');
});

// Utility function to show custom validation message
function showValidationMessage(field, message) {
    const formGroup = field.closest('.form-group');
    const errorSpan = formGroup?.querySelector('.error-message');

    if (errorSpan) {
        errorSpan.textContent = message;
        formGroup.classList.add('error');
    }
}

// Utility function to clear validation message
function clearValidationMessage(field) {
    const formGroup = field.closest('.form-group');
    const errorSpan = formGroup?.querySelector('.error-message');

    if (errorSpan) {
        errorSpan.textContent = '';
        formGroup.classList.remove('error');
    }
}
