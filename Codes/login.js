//==========================================
// LOGIN.JS - Use this exact code
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Target specifically the login form, not the search form
    const loginForm = document.querySelector('.auth-container form');
    
    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Extra safety

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        const users = JSON.parse(localStorage.getItem('inwell_users')) || [];
        const validUser = users.find(user => user.email === email && user.password === password);

        if (validUser) {
            const currentUser = {
                fullName: validUser.fullName,
                email: validUser.email
            };
            
            localStorage.setItem('inwell_current_user', JSON.stringify(currentUser));
            alert(`Welcome back, ${validUser.fullName}!`);
            window.location.href = 'index.html';
        } else {
            alert("Invalid email or password. Please try again.");
        }
    });
});