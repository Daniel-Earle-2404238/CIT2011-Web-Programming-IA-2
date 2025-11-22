// ============================================
// SEARCH.JS - Add this new file
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const searchForms = document.querySelectorAll('.search-container form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = form.querySelector('.search-input');
            const searchQuery = searchInput.value.trim();
            
            if (searchQuery) {
                // Redirect to products page with search query
                window.location.href = `products.html?search=${encodeURIComponent(searchQuery)}`;
            }
        });
    });

    // If we're on the products page, check for search query
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery && window.location.pathname.includes('products.html')) {
        filterBooks(searchQuery);
    }
});

function filterBooks(query) {
    const bookCards = document.querySelectorAll('.book-card');
    const searchLower = query.toLowerCase();
    let foundCount = 0;

    bookCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const author = card.querySelector('.book-author')?.textContent.toLowerCase() || '';
        
        // Check if search matches title or author
        if (title.includes(searchLower) || author.includes(searchLower)) {
            card.style.display = 'flex';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show message if no results
    const booksGrid = document.querySelector('.books-grid');
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (foundCount === 0 && booksGrid) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #666; font-size: 18px;';
            noResultsMsg.innerHTML = `
                <i class="fas fa-search" style="font-size: 60px; color: #ddd; margin-bottom: 20px; display: block;"></i>
                No books found for "<strong>${query}</strong>"
                <br><br>
                <a href="products.html" style="color: var(--red-color); text-decoration: none; font-weight: 600;">← View all books</a>
            `;
            booksGrid.appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }

    // Update page title
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = `Search Results for "${query}"`;
    }
}