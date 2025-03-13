// Sample product data
const products = [
    {
        id: 1,
        name: "Velocite Air Glide Runner 38",
        category: "footwear",
        price: 8999,
        image: "/images/product-shoe1.jpg",
        description: "Responsive running shoes with Air cushioning for comfort and speed.",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
    },
    {
        id: 2,
        name: "PulsarTech Predator Edge Football",
        category: "balls",
        price: 2499,
        image: "/images/product-ball1.jpg",
        description: "Official match ball with enhanced grip and accuracy for professional play.",
        sizes: ["Size 4", "Size 5"]
    },
    {
        id: 3,
        name: "ZenithFlex Pro Staff RF97 Tennis Racket",
        category: "rackets",
        price: 15999,
        image: "/images/product-racket1.jpg",
        description: "Professional signature racket with precision and control for advanced players.",
        sizes: ["L1", "L2", "L3", "L4"]
    },
    {
        id: 4,
        name: "ZenithFlex Sports Bag",
        category: "accessories",
        price: 3499,
        image: "/images/product-bag1.jpg",
        description: "Durable sports bag with multiple compartments for all your gear.",
        sizes: ["Small", "Medium", "Large"]
    },
    {
        id: 5,
        name: "TerraGrip Future Z Football Boots",
        category: "footwear",
        price: 12999,
        image: "/images/product-shoe2.jpg",
        description: "Lightweight football boots with adaptive FitZone for superior ball control.",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
    },
    {
        id: 6,
        name: "TerraGrip Pro Basketball",
        category: "balls",
        price: 4999,
        image: "/images/product-ball2.jpg",
        description: "Official game ball with superior grip and durability.",
        sizes: ["Size 5", "Size 6", "Size 7"]
    },
    {
        id: 7,
        name: "Velocite Astrox 100ZZ Badminton Racket",
        category: "rackets",
        price: 18999,
        image: "/images/product-racket2.jpg",
        description: "Professional badminton racket with Rotational Generator System for powerful smashes."
    },
    {
        id: 8,
        name: "Velocite Dry-Tech Training Gloves",
        category: "accessories",
        price: 1499,
        image: "/images/product-gloves1.jpg",
        description: "Lightweight training gloves with moisture-wicking technology for comfort during workouts."
    },
    {
        id: 9,
        name: "PulsarTech UltraStride 22",
        category: "footwear",
        price: 14999,
        image: "/images/product-shoe3.jpg",
        description: "Premium running shoes with responsive PowerBoost midsole for ultimate energy return."
    },
    {
        id: 10,
        name: "PulsarTech Cricket Ball",
        category: "balls",
        price: 1999,
        image: "/images/product-ball3.jpg",
        description: "Premium quality cricket ball with hand-stitched seam for consistent performance."
    },
    {
        id: 11,
        name: "TerraGrip Graphene 360+ Speed Pro Tennis Racket",
        category: "rackets",
        price: 16999,
        image: "/images/product-racket3.jpg",
        description: "Professional choice with perfect balance of power and control."
    },
    {
        id: 12,
        name: "ZenithFlex Pulse 5 Fitness Tracker",
        category: "accessories",
        price: 12999,
        image: "/images/product-tracker1.jpg",
        description: "Advanced fitness tracker with built-in GPS, heart rate monitoring, and sleep tracking."
    },
    {
        id: 13,
        name: "Velocite Gel-Kayano 28",
        category: "footwear",
        price: 11999,
        image: "/images/product-shoe4.jpg",
        description: "Stability running shoes with GEL technology for superior cushioning and support."
    },
    {
        id: 14,
        name: "PulsarTech V200W Volleyball",
        category: "balls",
        price: 3499,
        image: "/images/product-ball4.jpg",
        description: "Official game ball with aerodynamic dimple design for stable flight."
    },
    {
        id: 15,
        name: "TerraGrip Pure Drive Tennis Racket",
        category: "rackets",
        price: 13999,
        image: "/images/product-racket4.jpg",
        description: "Powerful racket with enhanced feel and stability for aggressive players."
    },
    {
        id: 16,
        name: "Velocite Pro Elite Compression Shorts",
        category: "accessories",
        price: 2499,
        image: "/images/product-shorts1.jpg",
        description: "Compression shorts with Dry-Tech technology for muscle support and moisture management."
    },
    {
        id: 17,
        name: "ZenithFlex Fresh Step 1080",
        category: "footwear",
        price: 13499,
        image: "/images/product-shoe5.jpg",
        description: "Premium cushioned running shoes with Fresh Step midsole for plush comfort."
    },
    {
        id: 18,
        name: "ZenithFlex Rugby World Cup Ball",
        category: "balls",
        price: 4499,
        image: "/images/product-ball5.jpg",
        description: "Official Rugby World Cup match ball with patented grip pattern for optimal handling."
    },
    {
        id: 19,
        name: "Velocite Windstorm 72 Badminton Racket",
        category: "rackets",
        price: 8999,
        image: "/images/product-racket5.jpg",
        description: "Lightweight badminton racket with aerodynamic frame for faster swing speed."
    },
    {
        id: 20,
        name: "PulsarTech Navigator 245 GPS Watch",
        category: "accessories",
        price: 24999,
        image: "/images/product-watch1.jpg",
        description: "Advanced GPS running watch with performance monitoring features and long battery life."
    }
];

// Format price to Indian Rupees
function formatPrice(price) {
    if (price === undefined || price === null) {
        return '₹0.00';
    }
    return '₹' + price.toLocaleString('en-IN');
}

// Load featured products on homepage
document.addEventListener('DOMContentLoaded', function() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    
    if (featuredProductsContainer) {
        // Get 4 random products for featured section
        const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
        
        // Create product cards
        featuredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <div class="product-card__price">${formatPrice(product.price)}</div>
                    <div class="product-card__actions">
                        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            featuredProductsContainer.appendChild(productCard);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                const image = this.getAttribute('data-image');
                
                addToCart(productId, name, price, image);
            });
        });
    }
});

// Function to filter products by category
function filterProductsByCategory(category) {
    if (category === 'all') {
        return products;
    } else {
        return products.filter(product => product.category === category);
    }
}

// Function to search products
function searchProducts(query) {
    query = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
} 