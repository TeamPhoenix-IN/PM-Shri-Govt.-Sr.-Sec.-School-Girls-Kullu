document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
       1. MOBILE MENU & NAVIGATION LOGIC
       ========================================= */
    const menuBtn = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navOverlay = document.getElementById("navOverlay");
    const body = document.body;

    if (menuBtn && navMenu) {
        function toggleMenu() {
            const isActive = navMenu.classList.toggle("active");
            menuBtn.classList.toggle("active"); // Triggers the X animation
            
            // Toggle the dark overlay if it exists
            if (navOverlay) navOverlay.classList.toggle("active");
            
            // Prevent background scrolling when menu is open
            body.style.overflow = isActive ? "hidden" : "auto";
        }

        // Event Listeners
        menuBtn.addEventListener("click", toggleMenu);

        if (navOverlay) {
            navOverlay.addEventListener("click", toggleMenu);
        }

        // Close menu automatically when a link (that isn't a dropdown) is clicked
        const navLinks = navMenu.querySelectorAll('a:not(.dropdown-trigger)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) toggleMenu();
            });
        });
    }

    /* =========================================
       2. MOBILE DROPDOWN TOGGLE (FIXED FOR ALL MENUS)
       ========================================= */
    // Select ALL elements with class .dropdown-trigger
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Only trigger click behavior on screens smaller than 1024px (Mobile/Tablet)
            if (window.innerWidth <= 1024) {
                e.preventDefault(); // Stop link from navigating/refreshing
                
                // Find the specific menu associated with THIS trigger
                const container = trigger.closest('.dropdown-container');
                const menu = container.querySelector('.dropdown-menu');
                
                if (menu) {
                    menu.classList.toggle('show');
                    
                    // Rotate arrow manually for mobile
                    const arrow = trigger.querySelector('.arrow');
                    if (arrow) {
                        arrow.style.transform = menu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                }
            }
        });
    });

    /* =========================================
       3. DYNAMIC BROWSER TITLE SCROLLING
       ========================================= */
    let originalTitle = document.title + " | ";
    let titleText = originalTitle;
    let titleInterval = null;

    function startScroll() {
        if (titleInterval) return;
        titleInterval = setInterval(() => {
            titleText = titleText.substring(1) + titleText[0];
            document.title = titleText;
        }, 300);
    }

    function stopScroll() {
        clearInterval(titleInterval);
        titleInterval = null;
        document.title = originalTitle; // Reset to clean title when focused
    }

    // Only scroll title when the tab is NOT visible (user is away)
    document.addEventListener("visibilitychange", () => {
        document.hidden ? startScroll() : stopScroll();
    });

    /* =========================================
       4. STATS COUNTER ANIMATION
       ========================================= */
    const statsSection = document.querySelector(".stats-grid");
    const counters = document.querySelectorAll(".stat-number");

    if (statsSection && counters.length > 0) {
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.dataset.target;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 20);
                let currentCount = 0;

                const update = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= target) {
                        counter.innerText = target;
                        clearInterval(update);
                    } else {
                        counter.innerText = Math.ceil(currentCount);
                    }
                }, 20);
            });
        };

        // Trigger animation only when section comes into view
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.disconnect(); // Run once then stop
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(statsSection);
    }

    /* =========================================
       5. ENHANCED SLIDESHOW (Auto + Touch + Dots)
       ========================================= */
    const slideshowContainer = document.querySelector(".slideshow-container");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (slides.length > 0) {
        let current = 0;
        let slideInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        // Function to switch slides
        function showSlide(index) {
            if (index >= slides.length) current = 0;
            else if (index < 0) current = slides.length - 1;
            else current = index;

            // Remove active class from all
            slides.forEach(slide => slide.classList.remove("active"));
            dots.forEach(dot => dot.classList.remove("active"));

            // Add active class to current
            slides[current].classList.add("active");
            if (dots[current]) dots[current].classList.add("active");
        }

        function nextSlide() {
            showSlide(current + 1);
        }

        function prevSlide() {
            showSlide(current - 1);
        }

        // Auto Play Controls
        function startAutoPlay() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // 5 Seconds
        }

        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        // --- Event Listeners ---

        // 1. Next/Prev Buttons
        nextBtn?.addEventListener("click", () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });

        prevBtn?.addEventListener("click", () => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });

        // 2. Dots Click
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                stopAutoPlay();
                showSlide(index);
                startAutoPlay();
            });
        });

        // 3. Touch Swipe Logic (Mobile)
        if (slideshowContainer) {
            slideshowContainer.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            }, { passive: true });

            slideshowContainer.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            }, { passive: true });
        }

        function handleSwipe() {
            const threshold = 50; // Min distance to count as swipe
            if (touchStartX - touchEndX > threshold) {
                nextSlide(); // Swiped Left
            }
            if (touchEndX - touchStartX > threshold) {
                prevSlide(); // Swiped Right
            }
        }

        // Initialize
        startAutoPlay();
    }
});