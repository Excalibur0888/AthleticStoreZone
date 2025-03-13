document.addEventListener('DOMContentLoaded', function() {
    // Get all links in the table of contents
    const tocLinks = document.querySelectorAll('.terms-toc__list a');
    
    // Add click event listener to each link
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the target section smoothly
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Handle initial hash in URL
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Delay scrolling slightly to ensure page is fully loaded
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // Update cart count from localStorage
    updateCartCount();
    
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
}); 