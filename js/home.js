document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer
    initCountdown();
    
    // Testimonials Slider
    initTestimonialsSlider();
  
});

// Countdown Timer
function initCountdown() {
    // Set the countdown date (7 days from now)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 7);
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the countdown
        document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If the countdown is over, clear the interval
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('offerCountdown').innerHTML = '<p>Offer has expired!</p>';
        }
    }, 1000);
}

// Testimonials Slider
function initTestimonialsSlider() {
    const sliderContainer = document.querySelector('.testimonials__slider');
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialDots = document.querySelectorAll('.testimonials__dot');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (!testimonialsTrack || !testimonialCards.length) return;
    
    let currentTestimonial = 0;
    const testimonialCount = testimonialCards.length;
    let autoSlideInterval;
    
    // Set initial width for testimonial cards
    function setCardWidths() {
        // Получаем точную ширину контейнера слайдера
        const containerWidth = sliderContainer.offsetWidth;
        
        testimonialCards.forEach(card => {
            // Устанавливаем точную ширину для каждого слайда
            card.style.width = `${containerWidth}px`;
            card.style.flex = `0 0 ${containerWidth}px`;
            card.style.margin = '0';
            card.style.boxSizing = 'border-box';
        });
        
        // Устанавливаем общую ширину трека
        testimonialsTrack.style.width = `${containerWidth * testimonialCount}px`;
        
        // Обновляем позицию слайдера
        updateSliderPosition();
    }
    
    function updateSliderPosition() {
        // Получаем актуальную ширину контейнера
        const containerWidth = sliderContainer.offsetWidth;
        
        // Рассчитываем точное смещение
        const translateValue = currentTestimonial * containerWidth;
        
        // Применяем трансформацию
        testimonialsTrack.style.transform = `translateX(-${translateValue}px)`;
        
        // Update dots
        testimonialDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
        
        // Update arrows
        testimonialPrev.style.opacity = currentTestimonial === 0 ? '0.5' : '1';
        testimonialPrev.style.pointerEvents = currentTestimonial === 0 ? 'none' : 'auto';
        
        testimonialNext.style.opacity = currentTestimonial === testimonialCount - 1 ? '0.5' : '1';
        testimonialNext.style.pointerEvents = currentTestimonial === testimonialCount - 1 ? 'none' : 'auto';
    }
    
    function nextTestimonial() {
        if (currentTestimonial < testimonialCount - 1) {
            currentTestimonial++;
            updateSliderPosition();
            resetAutoSlide();
        }
    }
    
    function prevTestimonial() {
        if (currentTestimonial > 0) {
            currentTestimonial--;
            updateSliderPosition();
            resetAutoSlide();
        }
    }
    
    function goToTestimonial(index) {
        if (index >= 0 && index < testimonialCount) {
            currentTestimonial = index;
            updateSliderPosition();
            resetAutoSlide();
        }
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCount;
            updateSliderPosition();
        }, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event Listeners
    testimonialNext.addEventListener('click', nextTestimonial);
    testimonialPrev.addEventListener('click', prevTestimonial);
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToTestimonial(index);
        });
    });
    
    // Initialize slider
    setCardWidths();
    startAutoSlide();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setCardWidths();
        clearInterval(autoSlideInterval);
        startAutoSlide();
    });
    
    // Обработчик изменения ориентации экрана для мобильных устройств
    window.addEventListener('orientationchange', () => {
        // Небольшая задержка для корректного расчета новых размеров
        setTimeout(() => {
            setCardWidths();
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }, 200);
    });
    
    // Pause auto-slide when hovering over the slider
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
}