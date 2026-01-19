/**
 * CODEX - Main JavaScript
 * Agence Marketing Digital Suisse Romande
 */

'use strict';

// ========================================
// CONFIGURATION
// ========================================
const CODEX = {
    config: {
        apiUrl: 'https://votre-backend.ch/api/contact.php',
        enableAnalytics: true,
        enableHoneypot: true,
        smoothScrollOffset: 80,
        formSubmitTimeout: 10000
    },

    // SEO Keywords pour tracking
    keywords: {
        primary: [
            "agence marketing digital Lausanne",
            "SEO Genève",
            "création site web Suisse romande",
            "stratégie digitale Fribourg",
            "référencement naturel Neuchâtel"
        ],
        secondary: [
            "entreprise web Vaud",
            "communication digitale Valais",
            "audit SEO gratuit Genève",
            "formateur Google Ads Lausanne"
        ],
        local: [
            "PME digitale Genève",
            "restaurant référencement Lausanne",
            "commerce en ligne Fribourg",
            "hôtel marketing digital Valais"
        ]
    }
};

// ========================================
// MOBILE NAVIGATION
// ========================================
class MobileNavigation {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.body = document.body;

        if (this.toggle && this.menu) {
            this.init();
        }
    }

    init() {
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking on a link
        const links = this.menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isOpen = this.menu.classList.toggle('is-open');
        this.toggle.setAttribute('aria-expanded', isOpen);
        this.body.style.overflow = isOpen ? 'hidden' : '';

        // Animate hamburger
        this.toggle.classList.toggle('is-active');
    }

    closeMenu() {
        this.menu.classList.remove('is-open');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.classList.remove('is-active');
        this.body.style.overflow = '';
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================
class SmoothScroll {
    constructor(offset = 80) {
        this.offset = offset;
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Ignore empty anchors
                if (href === '#' || href === '') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);

                    // Track navigation
                    if (CODEX.config.enableAnalytics) {
                        Analytics.trackEvent('navigation', {
                            target: href,
                            type: 'smooth_scroll'
                        });
                    }
                }
            });
        });
    }
}

// ========================================
// FORM HANDLER
// ========================================
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);

        if (this.form) {
            this.statusElement = document.getElementById('formStatus');
            this.submitButton = this.form.querySelector('button[type="submit"]');
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Honeypot check
        if (CODEX.config.enableHoneypot) {
            const honeypot = this.form.querySelector('input[name="website"]');
            if (honeypot && honeypot.value !== '') {
                // Bot detected - fake success
                this.showStatus('Merci ! Nous vous recontactons rapidement.', 'success');
                this.form.reset();

                Analytics.trackEvent('form_spam_blocked', {
                    honeypot: 'triggered'
                });
                return;
            }
        }

        // Validate form
        if (!this.validateForm()) {
            this.showStatus('Veuillez vérifier les champs du formulaire.', 'error');
            return;
        }

        // Prepare data
        const formData = new FormData(this.form);
        const data = {
            entreprise: formData.get('entreprise'),
            contact_name: formData.get('contact_name'),
            localite: formData.get('localite'),
            email: formData.get('email'),
            telephone: formData.get('telephone') || '',
            besoin: formData.get('besoin'),
            message: formData.get('message')
        };

        // Show loading
        this.setLoading(true);
        this.showStatus('⏳ Envoi en cours...', 'success');

        try {
            const response = await fetch(CODEX.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(CODEX.config.formSubmitTimeout)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showStatus('✓ Merci ! Nous vous recontactons sous 24h.', 'success');
                this.form.reset();

                // Track conversion
                Analytics.trackEvent('form_submission_success', {
                    localite: data.localite,
                    besoin: data.besoin
                });

                // Redirect to thank you page (optional)
                // setTimeout(() => window.location.href = '/merci', 2000);
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Form submission error:', error);

            let errorMessage = 'Une erreur est survenue. ';

            if (error.name === 'TimeoutError') {
                errorMessage += 'Le serveur met trop de temps à répondre.';
            } else if (error.name === 'TypeError') {
                errorMessage += 'Impossible de contacter le serveur.';
            } else {
                errorMessage += 'Veuillez réessayer ou nous contacter par téléphone.';
            }

            this.showStatus('❌ ' + errorMessage, 'error');

            Analytics.trackEvent('form_submission_error', {
                error: error.message
            });
        } finally {
            this.setLoading(false);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        let isValid = true;
        const value = field.value.trim();

        // Required validation
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            this.setFieldError(field, 'Ce champ est obligatoire');
        }
        // Email validation
        else if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                this.setFieldError(field, 'Email invalide');
            } else {
                this.clearFieldError(field);
            }
        }
        // Phone validation (Swiss format)
        else if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^\+41\s?[0-9\s]{9,12}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                this.setFieldError(field, 'Format: +41 XX XXX XX XX');
            } else {
                this.clearFieldError(field);
            }
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    setFieldError(field, message) {
        field.classList.add('is-invalid');

        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = 'var(--swiss-red)';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '4px';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showStatus(message, type) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = 'form-status ' + type;
            this.statusElement.style.display = 'block';
        }
    }

    setLoading(loading) {
        if (this.submitButton) {
            this.submitButton.disabled = loading;
            this.submitButton.textContent = loading ? '⏳ Envoi...' : 'Envoyer ma demande';
        }
    }
}

// ========================================
// ANALYTICS (Local Tracking)
// ========================================
class Analytics {
    static trackEvent(eventName, eventData = {}) {
        if (!CODEX.config.enableAnalytics) return;

        // Add timestamp and page info
        const enrichedData = {
            ...eventData,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            language: navigator.language,
            referrer: document.referrer
        };

        // Log to console (dev)
        console.log('📊 Analytics Event:', eventName, enrichedData);

        // Send to backend (production)
        if (window.location.hostname !== 'localhost') {
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventName,
                    data: enrichedData
                })
            }).catch(err => console.error('Analytics error:', err));
        }
    }

    static trackPageView() {
        this.trackEvent('page_view', {
            title: document.title,
            url: window.location.href
        });
    }

    static detectSwissVisitor() {
        const language = navigator.language;
        const isSwiss = language.includes('fr-CH') || language.includes('de-CH') || language.includes('it-CH');

        if (isSwiss) {
            document.body.classList.add('visitor-swiss');

            if (language.includes('fr')) {
                document.body.classList.add('visitor-romand');
                this.trackEvent('visitor_detected', { region: 'suisse_romande' });
            }
        }

        return isSwiss;
    }

    static setupEventTracking() {
        // Track service clicks
        document.querySelectorAll('.service-link, .service-card').forEach(element => {
            element.addEventListener('click', function() {
                const serviceName = this.querySelector('h3')?.textContent || 'unknown';
                Analytics.trackEvent('service_click', {
                    service: serviceName
                });
            });
        });

        // Track CTA clicks
        document.querySelectorAll('.btn-primary, .btn-highlight').forEach(button => {
            button.addEventListener('click', function() {
                const ctaText = this.textContent.trim();
                const section = this.closest('section')?.id || 'unknown';

                Analytics.trackEvent('cta_click', {
                    text: ctaText,
                    location: section
                });
            });
        });

        // Track phone clicks
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function() {
                Analytics.trackEvent('phone_call_click', {
                    number: this.getAttribute('href')
                });
            });
        });

        // Track email clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', function() {
                Analytics.trackEvent('email_click', {
                    email: this.getAttribute('href')
                });
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

            if (scrollPercentage > maxScroll && scrollPercentage % 25 === 0) {
                maxScroll = scrollPercentage;
                Analytics.trackEvent('scroll_depth', {
                    percentage: scrollPercentage
                });
            }
        });
    }
}

// ========================================
// UTILITIES
// ========================================
class Utils {
    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Format Swiss phone number
    static formatSwissPhone(phone) {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');

        // Format as +41 XX XXX XX XX
        if (digits.startsWith('41')) {
            return `+41 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
        }

        return phone;
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                { threshold: 0.1 }
            );

            this.elements.forEach(element => {
                this.observer.observe(element);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate;
                entry.target.classList.add(animation);
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Codex - Initializing...');

    // Initialize components
    new MobileNavigation();
    new SmoothScroll(80);
    new ContactForm('contact-form');
    new ScrollAnimations();

    // Analytics
    if (CODEX.config.enableAnalytics) {
        Analytics.trackPageView();
        Analytics.detectSwissVisitor();
        Analytics.setupEventTracking();
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('⚡ Page loaded in:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
        });
    }

    console.log('✅ Codex - Ready!');
});

// ========================================
// EXPORTS (for modules)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CODEX,
        MobileNavigation,
        SmoothScroll,
        ContactForm,
        Analytics,
        Utils
    };
}
