// ============================================
// REGISTER.JS - Use this exact code
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Target specifically the register form, not the search form
    const registerForm = document.querySelector('.auth-container form');
    
    if (!registerForm) {
        console.error('Register form not found');
        return;
    }
    
    const nameInput = registerForm.querySelector('input[type="text"]');
    const emailInput = registerForm.querySelector('input[type="email"]');
    const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Extra safety

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!fullName || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password should be at least 6 characters.");
            return;
        }

        const users = JSON.parse(localStorage.getItem('inwell_users')) || [];
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert("This email is already registered. Please log in.");
            window.location.href = 'login.html';
            return;
        }

        const newUser = {
            fullName: fullName,
            email: email,
            password: password 
        };

        users.push(newUser);
        localStorage.setItem('inwell_users', JSON.stringify(users));

        alert("Registration successful! Redirecting to login...");
        window.location.href = 'login.html';
    });
});