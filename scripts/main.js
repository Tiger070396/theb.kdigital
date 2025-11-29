// The B.K Digital - Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Form handling with EmailJS integration
    const quickContactForm = document.getElementById('quick-contact');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Prepare EmailJS template parameters for quick contact
            const templateParams = {
                to_name: 'Buddhadev Karmakar',
                from_name: 'Website Visitor',
                from_email: email,
                phone: 'Not provided',
                company: 'Not provided',
                website: 'Not provided',
                services_interested: 'General Inquiry - Quick Contact',
                budget_range: 'Not specified',
                business_goals: 'Expressed interest via homepage quick contact form',
                current_challenges: 'Not provided',
                project_timeline: 'Not specified',
                additional_message: `Quick contact form submission from ${email}. Please follow up for consultation.`,
                reply_to: email
            };
            
            // Send email using EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_xnm3qqb', 'template_scef3a5', templateParams)
                    .then(function(response) {
                        console.log('Quick contact email sent successfully:', response.status, response.text);
                        showNotification('Thank you! We\'ll get back to you soon.', 'success');
                        quickContactForm.querySelector('input[type="email"]').value = '';
                    })
                    .catch(function(error) {
                        console.error('Quick contact email send failed:', error);
                        showNotification('Thank you! We\'ll get back to you soon.', 'success');
                        quickContactForm.querySelector('input[type="email"]').value = '';
                    });
            } else {
                // Fallback if EmailJS is not loaded
                showNotification('Thank you! We\'ll get back to you soon.', 'success');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-item, .case-study-card, .stat-item, .founder-card'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Extract number from target (handles + and % symbols)
            const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
            const currentValue = Math.floor(progress * numericTarget);
            
            // Preserve original formatting
            let formattedValue;
            if (target.includes('+')) {
                formattedValue = currentValue + '+';
            } else if (target.includes('%')) {
                formattedValue = currentValue + '%';
            } else if (target.includes('/')) {
                formattedValue = target; // Keep 24/7 as is
            } else {
                formattedValue = currentValue.toString();
            }
            
            element.textContent = formattedValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target; // Ensure exact final value
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Trigger counter animations when stats come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent;
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#1E5631';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#B87333';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Add CSS animations for intersection observer
const animationStyles = `
    .service-item,
    .case-study-card,
    .stat-item,
    .founder-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-item.animate-in,
    .case-study-card.animate-in,
    .stat-item.animate-in,
    .founder-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar.scrolled {
        background-color: rgba(250, 248, 241, 0.98);
        backdrop-filter: blur(15px);
        box-shadow: 0 2px 20px rgba(30, 86, 49, 0.1);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background-color: rgba(250, 248, 241, 0.98);
            backdrop-filter: blur(15px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            z-index: 999;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu a {
            margin: 1rem 0;
            font-size: 1.2rem;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);