document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // --- 1. Dynamic Scroll-Based Navbar Header styling ---
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Run on scroll
    window.addEventListener('scroll', handleNavbarScroll);
    // Run on initial load to set state if refreshed page is already scrolled
    handleNavbarScroll();


    // --- 2. Mobile Drawer Toggle Menu ---
    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    };

    const closeMobileMenu = () => {
        mobileToggle.classList.remove('active');
        navbar.classList.remove('active');
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking nav link (crucial for mobile user experience)
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });


    // --- 3. Scrollspy (Active Navigation Link Highlighting) ---
    // Using Intersection Observer API for high performance and accuracy
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-30% 0px -40% 0px', // Trigger when section is in the center area of screen
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
});
