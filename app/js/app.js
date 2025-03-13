document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Initialize screenshots slider
    initScreenshotsSlider();
    
    // Add pulse effect to download buttons
    const downloadButtons = document.querySelectorAll('.download-app-btn');
    downloadButtons.forEach(button => {
        button.classList.add('pulse');
    });
    
    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Function to initialize screenshots slider
    function initScreenshotsSlider() {
        const slider = document.querySelector('.screenshots__slider');
        const track = document.querySelector('.screenshots__track');
        const container = document.querySelector('.screenshots__container');
        
        if (!slider || !track || !container) return;
        
        // Create scroll buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'screenshots__control screenshots__control--prev';
        prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'screenshots__control screenshots__control--next';
        nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        
        const controls = document.createElement('div');
        controls.className = 'screenshots__controls';
        controls.appendChild(prevButton);
        controls.appendChild(nextButton);
        
        container.appendChild(controls);
        
        // Scroll functionality
        let scrollAmount = 0;
        const scrollStep = 300;
        
        prevButton.addEventListener('click', function() {
            scrollAmount = Math.max(0, scrollAmount - scrollStep);
            track.style.transform = `translateX(-${scrollAmount}px)`;
        });
        
        nextButton.addEventListener('click', function() {
            const maxScroll = track.scrollWidth - slider.clientWidth;
            scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
            track.style.transform = `translateX(-${scrollAmount}px)`;
        });
    }

    // FAQ Section
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}); 