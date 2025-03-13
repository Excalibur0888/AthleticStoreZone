document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    const productCountElement = document.getElementById('productCount');
    const filterButtons = document.querySelectorAll('.filter__button');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const catalogTitle = document.querySelector('.catalog__title');
    const compareList = document.getElementById('compareList');
    const compareButton = document.getElementById('compareButton');
    const comparisonModal = document.getElementById('comparisonModal');
    const closeComparisonModal = document.getElementById('closeComparisonModal');
    const comparisonBody = document.getElementById('comparisonBody');
    const quickviewModal = document.getElementById('quickviewModal');
    const closeQuickviewModal = document.getElementById('closeQuickviewModal');
    const quickviewBody = document.getElementById('quickviewBody');
    const recommendationSlider = document.getElementById('recommendationSlider');
    const trendingSlider = document.getElementById('trendingSlider');
    
    let currentCategory = 'all';
    let searchQuery = '';
    let compareProducts = [];
    const MAX_COMPARE_PRODUCTS = 4;
    
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        currentCategory = categoryParam;
        
        // Update active filter button
        filterButtons.forEach(button => {
            if (button.getAttribute('data-category') === currentCategory) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update catalog title
        updateCatalogTitle();
    }
    
    // Initial load of products
    loadProducts();
    
    // Filter button click event
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current category
            currentCategory = category;
            
            // Update catalog title
            updateCatalogTitle();
            
            // Load filtered products
            loadProducts();
            
            // Update URL parameter without page reload
            const url = new URL(window.location);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);
        });
    });
    
    // Search functionality
    searchButton.addEventListener('click', function() {
        searchQuery = searchInput.value.trim();
        loadProducts();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value.trim();
            loadProducts();
        }
    });
    
    // Add event listeners for modals if they exist
    if (compareButton && closeComparisonModal) {
        compareButton.addEventListener('click', openComparisonModal);
        closeComparisonModal.addEventListener('click', closeModal);
    }
    
    if (closeQuickviewModal) {
        closeQuickviewModal.addEventListener('click', closeModal);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (comparisonModal && e.target === comparisonModal) {
            closeModal();
        }
        if (quickviewModal && e.target === quickviewModal) {
            closeModal();
        }
    });
    
    // Function to load products based on filters
    function loadProducts() {
        // Clear products grid
        productsGrid.innerHTML = '';
        
        // Get filtered products
        let filteredProducts = filterProductsByCategory(currentCategory);
        
        // Apply search filter if search query exists
        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Update product count
        productCountElement.textContent = filteredProducts.length;
        
        // Display products or no results message
        if (filteredProducts.length > 0) {
            // Create product cards
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
                        <div class="product-card__description">${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</div>
                        <div class="product-card__sizes">
                            <span>Available sizes:</span> ${product.sizes ? product.sizes.join(', ') : 'One size'}
                        </div>
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
        } else {
            // Display no results message
            productsGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results__icon">🔍</div>
                    <h3 class="no-results__message">No products found</h3>
                    <p class="no-results__suggestion">Try adjusting your search or filter criteria</p>
                </div>
            `;
        }
    }
    
    // Add event listeners to product buttons
    function addProductButtonListeners() {
        // Add to Cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
        
        // Quick View buttons
        const quickViewButtons = document.querySelectorAll('.quick-view');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const product = products.find(p => p.id === productId);
                if (product) {
                    openQuickView(product);
                }
            });
        });
    }
    
    // Update catalog title based on current category
    function updateCatalogTitle() {
        if (currentCategory === 'all') {
            catalogTitle.textContent = 'All Products';
        } else {
            catalogTitle.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        }
    }
    
    // Add product to compare list
    function addToCompare(product) {
        if (compareProducts.length >= MAX_COMPARE_PRODUCTS) {
            alert(`You can compare up to ${MAX_COMPARE_PRODUCTS} products at a time.`);
            // Uncheck the checkbox
            const checkbox = document.querySelector(`#compare-${product.id}`);
            if (checkbox) checkbox.checked = false;
            return;
        }
        
        if (!compareProducts.some(p => p.id === product.id)) {
            compareProducts.push(product);
            updateCompareList();
        }
    }
    
    // Remove product from compare list
    function removeFromCompare(productId) {
        compareProducts = compareProducts.filter(p => p.id !== productId);
        updateCompareList();
        
        // Uncheck the checkbox if it exists
        const checkbox = document.querySelector(`#compare-${productId}`);
        if (checkbox) checkbox.checked = false;
    }
    
    // Update the compare list UI
    function updateCompareList() {
        compareList.innerHTML = '';
        
        if (compareProducts.length === 0) {
            compareList.innerHTML = `<p class="compare__empty">Select products to compare</p>`;
            compareButton.disabled = true;
        } else {
            compareProducts.forEach(product => {
                const item = document.createElement('div');
                item.className = 'compare__item';
                item.innerHTML = `
                    <span class="compare__item-name">${product.name}</span>
                    <button class="compare__item-remove" data-id="${product.id}">&times;</button>
                `;
                compareList.appendChild(item);
                
                // Add event listener to remove button
                const removeBtn = item.querySelector('.compare__item-remove');
                removeBtn.addEventListener('click', function() {
                    removeFromCompare(product.id);
                });
            });
            
            compareButton.disabled = compareProducts.length < 2;
        }
    }
    
    // Open comparison modal
    function openComparisonModal() {
        if (compareProducts.length < 2) {
            alert('Please select at least 2 products to compare.');
            return;
        }
        
        // Generate comparison table
        generateComparisonTable();
        
        // Show modal
        comparisonModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Generate comparison table
    function generateComparisonTable() {
        // Get all unique features from products
        const features = ['Image', 'Name', 'Category', 'Price', 'Description'];
        
        // Create table
        let tableHTML = '<table class="comparison-table">';
        
        // Create rows for each feature
        features.forEach(feature => {
            tableHTML += `<tr><th>${feature}</th>`;
            
            compareProducts.forEach(product => {
                switch (feature) {
                    case 'Image':
                        tableHTML += `<td><img src="${product.image}" alt="${product.name}" class="product-image"></td>`;
                        break;
                    case 'Name':
                        tableHTML += `<td class="product-title">${product.name}</td>`;
                        break;
                    case 'Category':
                        tableHTML += `<td>${product.category}</td>`;
                        break;
                    case 'Price':
                        tableHTML += `<td class="product-price">₹${product.price.toLocaleString()}</td>`;
                        break;
                    case 'Description':
                        tableHTML += `<td>${product.description}</td>`;
                        break;
                    default:
                        tableHTML += `<td>-</td>`;
                }
            });
            
            tableHTML += '</tr>';
        });
        
        // Add action row
        tableHTML += '<tr><th>Action</th>';
        compareProducts.forEach(product => {
            tableHTML += `
                <td>
                    <button class="product-card__button add-to-cart" data-id="${product.id}">Add to Cart</button>
                </td>
            `;
        });
        tableHTML += '</tr>';
        
        tableHTML += '</table>';
        
        comparisonBody.innerHTML = tableHTML;
        
        // Add event listeners to the new Add to Cart buttons
        const addToCartButtons = comparisonBody.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
    
    // Open quick view modal
    function openQuickView(product) {
        if (!product) return;
        
        // Generate size options HTML
        let sizesHTML = '';
        if (product.sizes && product.sizes.length > 0) {
            sizesHTML = `
                <div class="quickview-product__sizes">
                    <h4>Available Sizes:</h4>
                    <div class="size-options">
                        ${product.sizes.map(size => `<button class="size-option">${size}</button>`).join('')}
                    </div>
                </div>
            `;
        }
        
        // Generate quick view content
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
                    ${sizesHTML}
                    <div class="quickview-product__actions">
                        <button class="quickview-product__button" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        quickviewModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add event listener to the Add to Cart button
        const addToCartBtn = quickviewBody.querySelector('.quickview-product__button');
        addToCartBtn.addEventListener('click', function() {
            // Получаем выбранный размер
            const selectedSizeBtn = quickviewBody.querySelector('.size-option.selected');
            let selectedSize = null;
            
            if (selectedSizeBtn) {
                selectedSize = selectedSizeBtn.textContent;
            }
            
            // Добавляем товар в корзину с выбранным размером
            addToCart({
                ...product,
                selectedSize: selectedSize
            });
            
            closeModal(); // Close modal after adding to cart
        });
        
        // Add event listeners to size buttons
        const sizeButtons = quickviewBody.querySelectorAll('.size-option');
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                // Add selected class to clicked button
                this.classList.add('selected');
            });
        });
    }
    
    // Close modal
    function closeModal() {
        if (comparisonModal) {
            comparisonModal.style.display = 'none';
        }
        if (quickviewModal) {
            quickviewModal.style.display = 'none';
        }
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Add product to cart
    function addToCart(productOrId, name, price, image) {
        let product;
        
        // Check if first parameter is an object or an ID
        if (typeof productOrId === 'object') {
            product = productOrId;
        } else {
            product = {
                id: productOrId,
                name: name,
                price: price,
                image: image
            };
        }
        
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id && 
            (item.selectedSize === product.selectedSize || (!item.selectedSize && !product.selectedSize)));
        
        if (existingItemIndex !== -1) {
            // Increment quantity if product already in cart with same size
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                selectedSize: product.selectedSize || null,
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in header
        updateCartCount();
        
        // Show success message
        showNotification(`${product.name} added to cart!`);
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
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Render trending products
    function renderTrendingProducts() {
        // Get trending products (in a real app, these would be sorted by popularity)
        // For demo, we'll just get the most expensive products as "trending"
        const trendingProducts = [...products]
            .sort((a, b) => b.price - a.price) // Sort by price descending
            .slice(0, 6); // Get first 6 items
        
        trendingSlider.innerHTML = '';
        
        trendingProducts.forEach(product => {
            const item = document.createElement('div');
            item.className = 'trending__item';
            item.innerHTML = `
                <div class="trending__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="trending__content">
                    <h3 class="trending__title">${product.name}</h3>
                    <div class="trending__price">₹${product.price.toLocaleString()}</div>
                    <button class="trending__button" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            trendingSlider.appendChild(item);
            
            // Add event listener to the Add to Cart button
            const addToCartBtn = item.querySelector('.trending__button');
            addToCartBtn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
    
    // Initialize cart count on page load
    updateCartCount();
    
    // Initialize trending products
    if (trendingSlider) {
        renderTrendingProducts();
    }
}); 