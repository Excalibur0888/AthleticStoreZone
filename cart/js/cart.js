document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    const clearCartButton = document.getElementById('clearCart');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutButton = document.getElementById('checkoutBtn');
    
    // Format price to Indian Rupees
    function formatPrice(price) {
        if (price === undefined || price === null) {
            return '₹0.00';
        }
        return '₹' + price.toLocaleString('en-IN');
    }
    
    // Load cart items
    loadCartItems();
    
    // Update cart count
    updateCartCount();
    
    // Clear cart button event
    clearCartButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your cart?')) {
            // Clear cart in localStorage
            localStorage.removeItem('cart');
            
            // Update UI
            loadCartItems();
            updateCartCount();
        }
    });
  
    
    // Function to load cart items
    function loadCartItems() {
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Clear cart items container
        cartItemsContainer.innerHTML = '';
        
        // Check if cart is empty
        if (cart.length === 0) {
            // Show empty cart message
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.style.display = 'none';
            clearCartButton.style.display = 'none';
            
            // Update summary
            updateOrderSummary(0);
            
            return;
        }
        
        // Hide empty cart message
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        clearCartButton.style.display = 'block';
        
        // Calculate subtotal
        let subtotal = 0;
        
        // Create cart item elements
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.dataset.productId = item.id;
            if (item.selectedSize) {
                cartItemElement.dataset.size = item.selectedSize;
            }
            
            cartItemElement.innerHTML = `
                <div class="cart-item" data-product-id="${item.id}" data-size="${item.selectedSize || ''}">
                    <div class="cart-item__image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item__details">
                        <h3 class="cart-item__name">${item.name}</h3>
                        <p class="cart-item__price">${formatPrice(item.price)}</p>
                        ${item.selectedSize ? `<p class="cart-item__size">Size: ${item.selectedSize}</p>` : ''}
                        <div class="cart-item__actions">
                            <div class="quantity-control">
                                <button class="quantity-btn quantity-decrease">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                                <button class="quantity-btn quantity-increase">+</button>
                            </div>
                            <button class="remove-btn">
                                <img src="/images/remove-icon.svg" alt="Remove" width="16" height="16">
                                Remove
                            </button>
                        </div>
                    </div>
                    <div class="cart-item__price-column">
                        <span class="item-total-label">Total:</span>
                        <span class="item-total">${formatPrice(item.price * item.quantity)}</span>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update order summary
        updateOrderSummary(subtotal);
        
        // Add event listeners to quantity buttons and remove buttons
        addCartItemEventListeners();
    }
    
    // Add event listeners to cart item buttons
    function addCartItemEventListeners() {
        // Decrease quantity buttons
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.cart-item').getAttribute('data-product-id'));
                updateItemQuantity(productId, 'decrease');
            });
        });
        
        // Increase quantity buttons
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.cart-item').getAttribute('data-product-id'));
                updateItemQuantity(productId, 'increase');
            });
        });
        
        // Quantity input fields
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.closest('.cart-item').getAttribute('data-product-id'));
                const newQuantity = parseInt(this.value);
                
                if (newQuantity < 1) {
                    this.value = 1;
                    updateItemQuantity(productId, 'set', 1);
                } else {
                    updateItemQuantity(productId, 'set', newQuantity);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.cart-item').getAttribute('data-product-id'));
                removeCartItem(productId);
            });
        });
    }
    
    // Update item quantity
    function updateItemQuantity(productId, action, value = null) {
        // Get cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Find item index
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Update quantity based on action
            if (action === 'increase') {
                cart[itemIndex].quantity += 1;
            } else if (action === 'decrease') {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                }
            } else if (action === 'set' && value !== null) {
                cart[itemIndex].quantity = value;
            }
            
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            loadCartItems();
            updateCartCount();
        }
    }
    
    // Remove item from cart
    function removeCartItem(productId) {
        // Get cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Filter out the item to remove
        cart = cart.filter(item => item.id !== productId);
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        loadCartItems();
        updateCartCount();
    }
    
    // Update order summary
    function updateOrderSummary(subtotal) {
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        
        // Format subtotal
        subtotalElement.textContent = formatPrice(subtotal);
        
        // Calculate shipping (free for orders over ₹5000)
        const shipping = subtotal > 5000 ? 0 : 0;
        shippingElement.textContent = formatPrice(shipping);
        
        // Calculate tax (18% GST)
        const tax = subtotal * 0.18;
        taxElement.textContent = formatPrice(tax);
        
        // Calculate total
        const total = subtotal + shipping + tax;
        totalElement.textContent = formatPrice(total);
        
        // Disable checkout button if cart is empty
        checkoutButton.disabled = subtotal === 0;
    }
    
    // Update cart count in header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Load recommended products
    loadRecommendedProducts();
    
    // Function to load recommended products
    function loadRecommendedProducts() {
        const recommendedProductsContainer = document.getElementById('recommendedProducts');
        if (!recommendedProductsContainer) return;
        
        // In a real application, these would be fetched from an API based on user's browsing history
        // For now, we'll use some sample products
        const recommendedProducts = [
            {
                id: 1,
                name: 'Asics Gel-Kayano 28',
                price: 11999,
                image: '/images/products/asics-gel-kayano-28.jpg'
            },
            {
                id: 2,
                name: 'Nike Air Zoom Pegasus 38',
                price: 8999,
                image: '/images/products/nike-air-zoom-pegasus-38.jpg'
            },
            {
                id: 3,
                name: 'Babolat Pure Drive Tennis Racket',
                price: 13999,
                image: '/images/products/babolat-pure-drive.jpg'
            },
            {
                id: 4,
                name: 'Kookaburra Cricket Ball',
                price: 1999,
                image: '/images/products/kookaburra-cricket-ball.jpg'
            },
            {
                id: 5,
                name: 'New Balance 1080v11',
                price: 13499,
                image: '/images/products/new-balance-1080v11.jpg'
            }
        ];
        
        // Create product cards
        recommendedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'recommended-product-card';
            
            productCard.innerHTML = `
                <div class="recommended-product-card__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="recommended-product-card__content">
                    <h3 class="recommended-product-card__title">${product.name}</h3>
                    <div class="recommended-product-card__price">${formatPrice(product.price)}</div>
                    <button class="recommended-product-card__button" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            recommendedProductsContainer.appendChild(productCard);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.recommended-product-card__button').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-product-id'));
                const product = recommendedProducts.find(p => p.id === productId);
                
                if (product) {
                    // Add product to cart
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    
                    // Check if product already exists in cart
                    const existingItemIndex = cart.findIndex(item => item.id === productId);
                    
                    if (existingItemIndex !== -1) {
                        // Increment quantity if product already in cart
                        cart[existingItemIndex].quantity += 1;
                    } else {
                        // Add new product to cart
                        cart.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });
                    }
                    
                    // Save updated cart to localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Update UI
                    loadCartItems();
                    updateCartCount();
                    
                    // Show notification
                    showNotification(`${product.name} added to cart!`);
                }
            });
        });
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}); 