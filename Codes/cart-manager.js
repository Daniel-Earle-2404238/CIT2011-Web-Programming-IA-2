// cart-manager.js

// =========================================
// GLOBAL CART STORAGE FUNCTIONS
// These functions use a user-specific key to save the cart
// =========================================

/**
 * Retrieves the unique identifier for the currently logged-in user.
 */
function getCurrentUserKey() {
    // This assumes 'inwell_current_user' is set to the user's unique key (e.g., email or ID)
    return localStorage.getItem('inwell_current_user'); 
}

/**
 * Generates the local storage key for the cart, ensuring it's user-specific.
 */
function getCartStorageKey() {
    const userKey = getCurrentUserKey();
    // If no user is logged in, use a generic guest cart.
    return userKey ? `inwell_cart_${userKey}` : 'inwell_cart_guest';
}

/**
 * Loads the cart from the user-specific storage key.
 */
function loadCart() {
    const key = getCartStorageKey();
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * Saves the current cart data to the user-specific storage key.
 * @param {Array} currentCart - The array of cart items to save.
 */
function saveCart(currentCart) {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(currentCart));
}

// =========================================
// DOM CONTENT LOADED LOGIC
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cart from Local Storage using the user-specific key
    let cart = loadCart(); 
    updateHeaderCount();

    // 2. Identify which page we are on
    const isCartPage = window.location.pathname.includes('cart.html');
    const isCheckoutPage = window.location.pathname.includes('checkout.html');

    // =========================================
    // LOGIC FOR ADDING ITEMS (Home & Products)
    // =========================================
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Auth Check - Ensure cart items only belong to logged-in users
            if (!getCurrentUserKey()) return; 

            // Find the parent container
            const card = btn.closest('.book-card') || btn.closest('.slide-content')?.parentElement;

            if (!card) return;

            let title, author, priceStr, imgSrc;

            if (card.classList.contains('book-card')) {
                // Products Page Logic
                title = card.querySelector('h3').innerText;
                author = card.querySelector('.book-author').innerText;
                priceStr = card.querySelector('.book-price').innerText;
                imgSrc = card.querySelector('img').getAttribute('src');
            } else {
                // Home Page Slider Logic
                title = card.getAttribute('data-title');
                author = card.getAttribute('data-author');
                priceStr = card.getAttribute('data-price');
                imgSrc = card.getAttribute('data-img');

                if (!title || !priceStr) return;
            }

            // Clean price
            const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));

            addItemToStorage({ title, author, price, imgSrc });

            // Visual Feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            btn.style.backgroundColor = '#27ae60';
            btn.style.color = 'white';
            btn.style.borderColor = '#27ae60';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        });
    });

    // =========================================
    // CORE HELPER FUNCTIONS (DOM-specific)
    // =========================================

    function addItemToStorage(product) {
        const existingItem = cart.find(item => item.title === product.title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart); // Use the global saveCart
        updateHeaderCount();
    }

    function updateHeaderCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        countElements.forEach(el => {
            el.innerText = totalItems;
            el.style.display = totalItems === 0 ? 'none' : 'inline-block';
        });
    }

    function updateSummaryTotals(subtotal, totalItems) {
        // 1. Handle Shipping ($1200 JMD approx $7.75 USD)
        const shippingUSD = totalItems > 0 ? 7.75 : 0;

        const grandTotal = subtotal + shippingUSD;

        const summaryRows = document.querySelectorAll('.summary-row');

        if(summaryRows.length >= 3) {
            // Row 0: Subtotal
            summaryRows[0].children[0].innerText = `Subtotal (${totalItems} items)`;
            summaryRows[0].children[1].innerText = `$${subtotal.toFixed(2)}`;

            // Row 1: Shipping
            if (totalItems === 0) {
                 summaryRows[1].children[1].innerText = `$0.00`;
            } else {
                 summaryRows[1].children[1].innerText = `$1,200 JMD`;
            }

            // Row 2: Total
            const totalRow = document.querySelector('.summary-row.total');
            if (totalRow) {
                totalRow.querySelector('span:last-child').innerText = `$${grandTotal.toFixed(2)} USD`;
            }
        }
    }

    // =========================================
    // LOGIC FOR CART PAGE (cart.html)
    // =========================================
    if (isCartPage) {
        renderCartPage();
    }

    function renderCartPage() {
        const cartItemsContainer = document.querySelector('.cart-items');

        cartItemsContainer.innerHTML = '';

        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align:center; padding: 40px;">
                    <p>Your cart is empty.</p>
                    <a href="products.html" style="color:var(--red-color); font-weight:bold;">Go Shopping</a>
                </div>`;
            updateSummaryTotals(0, 0);
            return;
        }

        // Build Items HTML
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;

            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p>${item.author}</p>
                    </div>
                    <div class="quantity-price">
                        <div class="quantity-controls">
                            <button type="button" class="qty-btn minus" data-index="${index}">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button type="button" class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                        <div class="item-price">$${itemTotal.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" data-index="${index}" title="Remove"><i class="fas fa-times"></i></button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        updateSummaryTotals(subtotal, totalItems);
        attachCartListeners();
    }

    function attachCartListeners() {
        // Remove Logic
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.closest('button').dataset.index;
                cart.splice(index, 1);
                saveCart(cart); // Use the global saveCart
                updateHeaderCount();
                renderCartPage();
            });
        });

        // Quantity Logic
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                const isPlus = e.target.classList.contains('plus');

                if (isPlus) {
                    cart[index].quantity++;
                } else {
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    }
                }
                saveCart(cart); // Use the global saveCart
                updateHeaderCount();
                renderCartPage();
            });
        });
    }

    // =========================================
    // LOGIC FOR CHECKOUT PAGE (checkout.html)
    // =========================================
    if (isCheckoutPage) {
        renderCheckoutPage();
        attachCheckoutListener(); // <--- NEW: Attach the listener for the order button
    }

    function renderCheckoutPage() {
        const cartItemsContainer = document.querySelector('.order-summary .cart-items');
        const checkoutBtn = document.querySelector('.checkout-btn');

        let subtotal = 0;
        let totalItems = 0;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div style="text-align:center; padding: 20px 0;"><p style="color:#888;">Your cart is empty. <a href="products.html" style="color:var(--red-color); font-weight:bold;">Go Shopping</a></p></div>`;
            updateSummaryTotals(0, 0);

            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.innerText = 'CART IS EMPTY';
                checkoutBtn.style.backgroundColor = '#999';
                // Remove any styles that might be left over from successful order button
                checkoutBtn.style.pointerEvents = 'none';
            }
            return;
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerText = 'PLACE ORDER';
            checkoutBtn.style.backgroundColor = '';
            // Reset pointer events to default
            checkoutBtn.style.pointerEvents = 'auto'; 
        }

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;

            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>${item.author}</p>
                        <p style="font-size: 13px; color: #777;">Qty: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        updateSummaryTotals(subtotal, totalItems);
    }

    function attachCheckoutListener() {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault(); 

                // Check if cart has items before placing order
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add items before placing an order.');
                    return; 
                }
                
                // 1. Show alert as requested
                alert('Order Placed Successfully! Thank you for shopping with Inkwell Bookstore.');
                
                // 2. Clear the cart data
                cart = []; 
                saveCart(cart); 
                updateHeaderCount(); 
                
                // 3. Update the checkout page to show the empty cart state
                renderCheckoutPage(); 
                
                // 4. Redirect to the homepage after a short delay for better UX
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500); 
            });
        }
    }
});