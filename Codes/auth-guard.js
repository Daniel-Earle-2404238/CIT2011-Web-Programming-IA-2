// ============================================
// AUTH-GUARD.JS - FIXED (No nav bar changes)
// ============================================
const USER_SESSION_KEY = 'inwell_current_user'; 
const PROTECTED_PAGES = ['cart.html', 'checkout.html'];

function isLoggedIn() {
    const user = localStorage.getItem(USER_SESSION_KEY);
    return user !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(USER_SESSION_KEY));
}

function logout() {
    localStorage.removeItem(USER_SESSION_KEY);
    alert('You have been logged out successfully.');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();

    // Protect specific pages
    if (PROTECTED_PAGES.includes(currentPage)) {
        if (!isLoggedIn()) {
            alert('You must be logged in to view this page.');
            window.location.href = 'login.html';
            return;
        }
    }

    // Protect "Add to Cart" buttons
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (!isLoggedIn()) {
                e.preventDefault();
                e.stopPropagation();
                
                const confirmLogin = confirm('You need to be logged in to add items to your cart. Go to login page?');
                if (confirmLogin) {
                    window.location.href = 'login.html';
                }
            }
        });
    });
});