document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Update cart count from localStorage
    updateCartCount();
    
    // Function to update cart count
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (!cartCountElement) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElement.textContent = itemCount;
    }
}); 