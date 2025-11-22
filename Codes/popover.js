document.addEventListener('DOMContentLoaded', function() {
    // Get the button element and the popover panel element
    const toggleButton = document.getElementById('account-toggle-btn');
    const popoverContent = document.getElementById('account-popover');
    const userGreeting = document.querySelector('.user-greeting');
    const popoverActions = document.querySelector('.popover-actions');
    const manageBtn = document.querySelector('.manage-btn');

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('inwell_current_user'));

    if (currentUser) {
        // User IS logged in - Update the popover
        userGreeting.textContent = `Hi, ${currentUser.fullName}!`;
        
        // Replace Login/Sign-Up links with Logout button
        popoverActions.innerHTML = `
            <a href="#" class="action-link logout-link" id="logout-btn">Logout</a>
        `;

        // Add logout functionality
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('inwell_current_user');
            alert('You have been logged out.');
            window.location.href = 'index.html'; // Refresh the page
        });

        // Show the "Manage your Account" button
        manageBtn.style.display = 'block';
    } else {
        // User is NOT logged in - Show default state
        userGreeting.textContent = 'Hi, Guest!';
        manageBtn.style.display = 'none'; // Hide manage account button
    }

    // 1. Toggle Functionality (on button click)
    function togglePopover() {
        popoverContent.classList.toggle('show');
    }

    // Attach the toggle function to the button's click event
    toggleButton.addEventListener('click', function(event) {
        event.stopPropagation();
        togglePopover();
    });

    // 2. Click-Outside-to-Close Functionality
    document.addEventListener('click', function(event) {
        const isClickInsidePopover = popoverContent.contains(event.target);
        const isClickOnButton = toggleButton.contains(event.target);
        
        if (popoverContent.classList.contains('show') && !isClickInsidePopover && !isClickOnButton) {
            popoverContent.classList.remove('show');
        }
    });
});