document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const burgerBtn = document.querySelector('.header__burger');
    const nav = document.querySelector('.nav');
    const body = document.body;

    burgerBtn.addEventListener('click', function() {
        burgerBtn.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('lock');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('lock');
        });
    });

    // Update cart count from localStorage
    updateCartCount();

    // Add active class to current page link
    const currentPage = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPage.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentPage.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        } else if (currentPage.endsWith('index.html') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const privacyConsent = document.getElementById('privacyConsent');
            const newsletterMessage = document.getElementById('newsletterMessage');
            
            if (!emailInput.value) {
                newsletterMessage.textContent = 'Please enter your email address.';
                newsletterMessage.classList.add('error');
                return;
            }
            
            if (!privacyConsent.checked) {
                newsletterMessage.textContent = 'Please agree to our Privacy Policy.';
                newsletterMessage.classList.add('error');
                return;
            }
            
            // In a real application, you would send the data to a server here
            // For now, we'll just redirect to the thanks page
            
            // Store email in localStorage for potential use on the thanks page
            localStorage.setItem('subscribedEmail', emailInput.value);
            
            // Redirect to thanks page
            window.location.href = '/thanks.html';
        });
    }
});

// Cart functionality
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = itemCount;
}

// Add to cart function
function addToCart(productId, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Increment quantity if product already in cart
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${name} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to DOM
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