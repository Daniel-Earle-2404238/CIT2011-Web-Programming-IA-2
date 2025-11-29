document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('bookModal');
    const modalClose = document.querySelector('.modal-close');
    const modalAddBtn = document.querySelector('.modal-add-btn');
    
    // Store current book data
    let currentBook = null;

    // Book data with descriptions
    const bookDescriptions = {
        'white-bird': {
            description: 'A powerful graphic novel about a hidden Jewish girl in Nazi-occupied France, from the creator of Wonder. A story of courage, survival, and the kindness of strangers during humanity\'s darkest hour.'
        },
        'brotherband-slaves-of-socorro': {
            description: 'The Herons are recalled to Skandia to deal with a dangerous slave trade threatening their homeland. Action-packed Viking adventure with strategic battles and loyal friendships.'
        },
        'eragon': {
            description: 'A farm boy discovers a dragon egg, launching him into an epic journey of magic, dragons, and destiny. The first book in the beloved Inheritance Cycle series.'
        },
        'da-vinci-code': {
            description: 'A murder in the Louvre leads symbologist Robert Langdon on a breathless chase through cryptic codes and ancient secrets. A gripping thriller that challenges history itself.'
        },
        'the-other-side-of-truth': {
            description: 'Two Nigerian children flee to London as refugees after their mother\'s murder. A powerful story about truth, courage, and finding home in a strange land.'
        }
    };

    // Open modal when book card is clicked
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if "Add to Cart" button was clicked directly
            if (e.target.classList.contains('add-to-cart-btn') || 
                e.target.closest('.add-to-cart-btn')) {
                return;
            }

            const title = card.querySelector('h3').textContent;
            const author = card.querySelector('.book-author').textContent;
            const price = card.querySelector('.book-price').textContent;
            const imgSrc = card.querySelector('img').src;
            const bookId = card.id || '';

            // Store current book data for the modal Add to Cart button
            currentBook = {
                title: title,
                author: author,
                price: price,
                image: imgSrc,
                id: bookId
            };

            // Populate modal
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalAuthor').textContent = author;
            document.getElementById('modalPrice').textContent = price;
            document.getElementById('modalCover').src = imgSrc;

            // Set description (or default)
            const description = bookDescriptions[bookId] ? bookDescriptions[bookId].description : 'A captivating read that will transport you to new worlds and perspectives. Perfect for your collection.';
            document.getElementById('modalDescription').textContent = description;

            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when X is clicked
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal function
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        currentBook = null;
    }

    // Handle modal Add to Cart button
    modalAddBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!currentBook) {
            alert('Error: Book data not found');
            return;
        }

        // Check if user is logged in
        const currentUser = localStorage.getItem('inwell_current_user');
        
        if (!currentUser) {
            const confirmLogin = confirm('You need to be logged in to add items to your cart. Go to login page?');
            if (confirmLogin) {
                window.location.href = 'login.html';
            }
            return;
        }

        // Add to cart
        const success = addToCart(currentBook);
        
        if (success) {
            alert('Book added to cart successfully!');
            closeModal();
        }
    });

    // Add to cart function - matches cart-manager.js
    function addToCart(book) {
        try {
            const currentUserData = localStorage.getItem('inwell_current_user');
            if (!currentUserData) {
                alert('Please log in to add items to cart');
                return false;
            }

            const cartKey = 'inwell_cart_' + currentUserData;
            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            const priceValue = parseFloat(book.price.replace('$', ''));

            const existingItemIndex = cart.findIndex(item => item.title === book.title);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    title: book.title,
                    author: book.author,
                    price: priceValue,
                    imgSrc: book.image,
                    quantity: 1
                });
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));
            console.log('Cart updated:', cart);
            console.log('Cart key:', cartKey);

            updateCartCount(cart);
            
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('There was an error adding the item to your cart.');
            return false;
        }
    }

    // Update cart count
    function updateCartCount(cart) {
        if (!cart) {
            const currentUserData = localStorage.getItem('inwell_current_user');
            if (!currentUserData) return;
            
            const cartKey = 'inwell_cart_' + currentUserData;
            cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        }

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
            el.style.display = totalItems === 0 ? 'none' : 'inline-block';
        });
    }

    // Initialize cart count on page load
    updateCartCount();
});