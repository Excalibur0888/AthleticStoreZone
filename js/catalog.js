// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const quickviewModal = document.getElementById('quickviewModal');
const closeQuickviewModal = document.getElementById('closeQuickviewModal');
const quickviewBody = document.getElementById('quickviewBody');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterButtons = document.querySelectorAll('.filter__button');
const productCount = document.getElementById('productCount');
const recommendationSlider = document.getElementById('recommendationSlider');

// State
let products = [];
let filteredProducts = [];
let currentCategory = 'all';
let searchQuery = '';

// Fetch products data
async function fetchProducts() {
    try {
        const response = await fetch('/data/products.json');
        products = await response.json();
        filteredProducts = [...products];
        updateProductCount();
        renderProducts();
        renderRecommendations();
    } catch (error) {
        console.error('Error fetching products:', error);
        showNotification('Error loading products. Please try again later.', 'error');
    }
}

// Render products grid
function renderProducts() {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-card__image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card__content">
                <div class="product-card__category">${product.category}</div>
                <h3 class="product-card__title">${product.name}</h3>
                <div class="product-card__price">₹${product.price.toLocaleString()}</div>
                <div class="product-card__actions">
                    <button class="product-card__button add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="product-card__button quick-view" data-product-id="${product.id}">
                        Quick View
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to the new buttons
    addProductButtonListeners();
}

// Add event listeners to product buttons
function addProductButtonListeners() {
    // Quick View buttons
    const quickViewButtons = document.querySelectorAll('.quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            openQuickView(productId);
        });
    });

    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

// Quick View functionality
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    quickviewBody.innerHTML = `
        <div class="quickview-product">
            <div class="quickview-product__image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quickview-product__info">
                <div class="quickview-product__category">${product.category}</div>
                <h2 class="quickview-product__title">${product.name}</h2>
                <div class="quickview-product__price">₹${product.price.toLocaleString()}</div>
                <p class="quickview-product__description">${product.description}</p>
                <div class="quickview-product__actions">
                    <button class="quickview-product__button" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    // Add event listener to the Add to Cart button in quick view
    const addToCartButton = quickviewBody.querySelector('.quickview-product__button');
    addToCartButton.addEventListener('click', () => {
        addToCart(product);
    });

    quickviewModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Quick View modal
function closeQuickView() {
    quickviewModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Filter products by category
function filterProducts() {
    filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category.toLowerCase() === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    updateProductCount();
    renderProducts();
}

// Update product count
function updateProductCount() {
    productCount.textContent = filteredProducts.length;
}

// Add to Cart functionality
function addToCart(product) {
    // Get existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Update cart count in the header
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart successfully!');
}

// Update cart count in header
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render product recommendations
function renderRecommendations() {
    const recommendedProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);

    recommendationSlider.innerHTML = recommendedProducts.map(product => `
        <div class="recommendation__item">
            <div class="recommendation__image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="recommendation__content">
                <h3 class="recommendation__title">${product.name}</h3>
                <div class="recommendation__price">₹${product.price.toLocaleString()}</div>
                <button class="recommendation__button" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to recommendation buttons
    const recommendationButtons = recommendationSlider.querySelectorAll('.recommendation__button');
    recommendationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
});

closeQuickviewModal.addEventListener('click', closeQuickView);

quickviewModal.addEventListener('click', (e) => {
    if (e.target === quickviewModal) {
        closeQuickView();
    }
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterProducts();
});

searchButton.addEventListener('click', () => {
    filterProducts();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.dataset.category;
        filterProducts();
    });
}); 