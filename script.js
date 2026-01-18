/**
 * CLICOM - Agence Marketing Digital Suisse
 * JavaScript Interactions
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

        // Ignore empty hash
        if (href === '#' || href === '#mentions-legales' || href === '#politique-confidentialite' || href === '#cgv') {
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
// FAQ ACCORDION
// ==========================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

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

        // Optional: Scroll to top or show confirmation section
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Stop observing after reveal
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
const revealElements = document.querySelectorAll('.expertise-card, .timeline-item, .pricing-card, .faq-item');
revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
});

// ==========================================
// PERFORMANCE OPTIMIZATION: Lazy Loading for Background Images
// ==========================================
const lazyBackgrounds = document.querySelectorAll('[data-bg]');
if ('IntersectionObserver' in window) {
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
// ANALYTICS TRACKING (Ready for Google Analytics 4)
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
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        trackEvent('cta_click', {
            button_text: btn.textContent.trim(),
            button_location: btn.closest('section')?.id || 'unknown'
        });
    });
});

// Track form submission
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('form_submit', {
            form_name: 'contact_form',
            form_location: 'contact_section'
        });
    });
}

// Track external link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('external_link_click', {
            link_url: link.href,
            link_text: link.textContent.trim()
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

        } catch (error) {
            // Silently fail if observers are not supported
        }
    }
});

// ==========================================
// CONSOLE MESSAGE (Development)
// ==========================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(
        '%c🚀 CLICOM - Agence Marketing Digital Suisse',
        'font-size: 20px; font-weight: bold; color: #3366ff;'
    );
    console.log(
        '%cChez Clicom, on ne fait pas faire, on sait faire.',
        'font-size: 14px; color: #1a1a2e;'
    );
    console.log(
        '%c✓ JavaScript loaded successfully',
        'font-size: 12px; color: #00b894;'
    );
}
