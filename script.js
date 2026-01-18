/**
 * CLICOM - Neo-Swiss Dark Performance
 * JavaScript Interactions & Micro-animations
 */

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        // Toggle aria-expanded
        menuToggle.setAttribute('aria-expanded', !isExpanded);

        // Toggle active class
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    });
}

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
const header = document.getElementById('header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignore empty hash or legal links
        if (href === '#' || href.includes('mentions-legales') || href.includes('politique-confidentialite') || href.includes('cgv')) {
            return;
        }

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// ANIMATED COUNTERS (Hero Stats)
// ==========================================
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Trigger counters when hero stats are visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
}

// ==========================================
// FORM VALIDATION
// ==========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation functions
    const validators = {
        name: (value) => {
            if (!value || value.trim().length < 2) {
                return 'Veuillez entrer votre nom complet (minimum 2 caractères)';
            }
            return '';
        },

        company: (value) => {
            if (!value || value.trim().length < 2) {
                return 'Veuillez entrer le nom de votre entreprise';
            }
            return '';
        },

        email: (value) => {
            if (!value) {
                return 'Veuillez entrer votre adresse email';
            }
            if (!emailRegex.test(value)) {
                return 'Veuillez entrer une adresse email valide';
            }
            return '';
        },

        objective: (value) => {
            if (!value) {
                return 'Veuillez sélectionner votre objectif principal';
            }
            return '';
        }
    };

    // Show error message
    const showError = (fieldName, message) => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    };

    // Clear error message
    const clearError = (fieldName) => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    };

    // Validate field
    const validateField = (fieldName) => {
        const field = document.getElementById(fieldName);
        if (!field) return true;

        const value = field.value;
        const validator = validators[fieldName];

        if (validator) {
            const errorMessage = validator(value);

            if (errorMessage) {
                showError(fieldName, errorMessage);
                return false;
            } else {
                clearError(fieldName);
                return true;
            }
        }

        return true;
    };

    // Real-time validation on blur
    ['name', 'company', 'email', 'objective'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));

            // Clear error on input
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(fieldName);
                }
            });
        }
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all required fields
        const fieldsToValidate = ['name', 'company', 'email', 'objective'];
        let isValid = true;

        fieldsToValidate.forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                const headerHeight = header.offsetHeight;
                const errorPosition = firstError.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: errorPosition,
                    behavior: 'smooth'
                });
            }
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            objective: document.getElementById('objective').value,
            message: document.getElementById('message').value
        };

        // Success message (In production, this would send to a backend)
        alert(`✅ Merci ${formData.name} !\n\nVotre demande d'audit digital a été envoyée avec succès.\n\nNous vous contacterons à l'adresse ${formData.email} dans les 24h ouvrées.\n\nÀ très bientôt,\nL'équipe CLICOM`);

        // Reset form
        contactForm.reset();

        // Clear all errors
        fieldsToValidate.forEach(clearError);

        // Track conversion (if analytics is set up)
        trackEvent('form_submit', {
            form_name: 'contact_form',
            objective: formData.objective
        });

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Continue observing for potential re-animations
            // revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
const revealElements = document.querySelectorAll('.bento-card, .timeline-item, .pricing-card, .client-card');
revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
});

// ==========================================
// PROGRESS BAR ANIMATIONS (Timeline)
// ==========================================
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    // Trigger CSS animation by adding a class
                    progressBar.style.animation = 'none';
                    setTimeout(() => {
                        progressBar.style.animation = '';
                    }, 10);
                }
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => progressObserver.observe(item));
}

// ==========================================
// PERFORMANCE OPTIMIZATION: Lazy Loading
// ==========================================
const lazyBackgrounds = document.querySelectorAll('[data-bg]');
if ('IntersectionObserver' in window && lazyBackgrounds.length > 0) {
    const lazyBgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bg = entry.target;
                bg.style.backgroundImage = `url(${bg.dataset.bg})`;
                lazyBgObserver.unobserve(bg);
            }
        });
    });

    lazyBackgrounds.forEach(bg => lazyBgObserver.observe(bg));
}

// ==========================================
// ANALYTICS TRACKING (Google Analytics 4 Ready)
// ==========================================
const trackEvent = (eventName, eventParams = {}) => {
    // Check if gtag is available (Google Analytics 4)
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    }

    // Fallback: log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('📊 Analytics Event:', eventName, eventParams);
    }
};

// Track CTA clicks
document.querySelectorAll('.btn-primary-glow, .btn-primary-large, .btn-primary-block').forEach(btn => {
    btn.addEventListener('click', (e) => {
        trackEvent('cta_click', {
            button_text: btn.textContent.trim(),
            button_location: btn.closest('section')?.id || 'header',
            button_type: 'primary'
        });
    });
});

// Track secondary CTA clicks
document.querySelectorAll('.btn-secondary, .btn-secondary-large').forEach(btn => {
    btn.addEventListener('click', (e) => {
        trackEvent('cta_click', {
            button_text: btn.textContent.trim(),
            button_location: btn.closest('section')?.id || 'unknown',
            button_type: 'secondary'
        });
    });
});

// Track phone clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('phone_click', {
            phone_number: link.href.replace('tel:', '')
        });
    });
});

// Track email clicks
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('email_click', {
            email: link.href.replace('mailto:', '')
        });
    });
});

// Track navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('navigation_click', {
            nav_item: link.textContent.trim(),
            destination: link.getAttribute('href')
        });
    });
});

// ==========================================
// PAGE LOAD PERFORMANCE TRACKING
// ==========================================
window.addEventListener('load', () => {
    // Log performance metrics
    if ('performance' in window && 'timing' in window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        if (pageLoadTime > 0) {
            trackEvent('page_load_time', {
                load_time: pageLoadTime,
                page_path: window.location.pathname
            });
        }
    }

    // Log Core Web Vitals (if available)
    if ('PerformanceObserver' in window) {
        try {
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                trackEvent('core_web_vitals', {
                    metric: 'LCP',
                    value: lastEntry.renderTime || lastEntry.loadTime
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    trackEvent('core_web_vitals', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime
                    });
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                }
                trackEvent('core_web_vitals', {
                    metric: 'CLS',
                    value: clsScore
                });
            }).observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
            // Silently fail if observers are not supported
        }
    }
});

// ==========================================
// GLITCH TEXT EFFECT (Subtle, on hover)
// ==========================================
const glitchTexts = document.querySelectorAll('.glitch-text');
glitchTexts.forEach(text => {
    text.addEventListener('mouseenter', () => {
        text.style.animation = 'glitch-effect 0.3s ease-in-out';
        setTimeout(() => {
            text.style.animation = '';
        }, 300);
    });
});

// Define glitch animation via CSS (if not already defined)
if (!document.querySelector('#glitch-keyframes')) {
    const style = document.createElement('style');
    style.id = 'glitch-keyframes';
    style.textContent = `
        @keyframes glitch-effect {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// CONSOLE MESSAGE (Development/Branding)
// ==========================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(
        '%c🚀 CLICOM - Neo-Swiss Dark Performance',
        'font-size: 20px; font-weight: bold; color: #00ff88; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);'
    );
    console.log(
        '%cOn ne fait pas faire, on sait faire.',
        'font-size: 14px; color: #ffffff;'
    );
    console.log(
        '%c✓ JavaScript loaded successfully',
        'font-size: 12px; color: #00ff88;'
    );
    console.log(
        '%c✓ Micro-interactions active',
        'font-size: 12px; color: #00ff88;'
    );
    console.log(
        '%c✓ Analytics tracking ready',
        'font-size: 12px; color: #00ff88;'
    );
}

// ==========================================
// EASTER EGG: Konami Code
// ==========================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Easter egg activated
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);

        console.log('%c🎉 KONAMI CODE ACTIVATED! 🎉', 'font-size: 24px; color: #ff0033;');
    }
});

// Rainbow animation for Easter egg
if (!document.querySelector('#rainbow-keyframes')) {
    const style = document.createElement('style');
    style.id = 'rainbow-keyframes';
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// THEME TOGGLE (Future feature - Optional)
// ==========================================
// Uncomment if you want to add a light/dark mode toggle
/*
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    }
}
*/
