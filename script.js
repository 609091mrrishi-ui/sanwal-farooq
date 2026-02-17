/* ==========================================================================
   CLOUD AI PORTFOLIO - SCRIPT.JS
   Interactive Features, Animations, and Event Handlers
   ========================================================================== */

// ==========================================================================
// GLOBAL VARIABLES & CONFIGURATION
// ==========================================================================
let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

// ==========================================================================
// LOADING SCREEN
// ==========================================================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// ==========================================================================
// PARTICLE SYSTEM ANIMATION
// ==========================================================================
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(canvas));
    }

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesArray = [];
        const newCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < newCount; i++) {
            particlesArray.push(new Particle(canvas));
        }
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        // Connect particles
        connectParticles(ctx);
        requestAnimationFrame(animate);
    }

    animate();
}

function connectParticles(ctx) {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const opacity = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', initParticles);

// ==========================================================================
// NAVIGATION FUNCTIONALITY
// ==========================================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Smooth scroll to sections
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==========================================================================
// TYPING ANIMATION
// ==========================================================================
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Cloud AI & Financial Mathematics Specialist',
    'Aviation Risk Analytics Expert',
    'Financial Modeling Professional',
    'Operations Research Specialist',
    'AI-Based Safety Systems Developer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});

// ==========================================================================
// ANIMATED COUNTERS FOR STATS
// ==========================================================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
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
}

// ==========================================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.skill-category, .project-card, .achievement-card, .stat-card');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('reveal', 'active');
        }
    });

    // Animate stat counters when visible
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const statTop = stat.getBoundingClientRect().top;
        if (statTop < window.innerHeight - 150 && !stat.classList.contains('counted')) {
            stat.classList.add('counted');
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
        }
    });

    // Animate skill bars when visible
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        if (barTop < window.innerHeight - 150 && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 100);
        }
    });
}

// Run on scroll
window.addEventListener('scroll', revealOnScroll);

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(revealOnScroll, 500);
});

// ==========================================================================
// FORM VALIDATION & SUBMISSION
// ==========================================================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    let isValid = true;

    if (name === '') {
        showError('name', 'Name is required');
        isValid = false;
    }

    if (email === '') {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }

    if (subject === '') {
        showError('subject', 'Subject is required');
        isValid = false;
    }

    if (message === '') {
        showError('message', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }

    if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
            contactForm.reset();
        }, 2000);
    }
});

function showError(fieldId, message) {
    const formGroup = document.getElementById(fieldId).parentElement;
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = message;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormStatus(type, message) {
    const statusElement = document.querySelector('.form-status');
    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`;
    
    setTimeout(() => {
        statusElement.className = 'form-status';
    }, 5000);
}

// ==========================================================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ==========================================================================
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        
        // Create temporary textarea for copying
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'var(--color-accent-green)';
            btn.style.borderColor = 'var(--color-accent-green)';
            btn.style.color = 'var(--color-primary)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        
        document.body.removeChild(textarea);
    });
});

// ==========================================================================
// FLOATING ELEMENTS ANIMATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const floatingElements = document.querySelectorAll('.float-elem');
    
    floatingElements.forEach((elem, index) => {
        elem.style.animationDelay = `${index * 0.5}s`;
    });
});

// ==========================================================================
// INTERSECTION OBSERVER FOR BETTER PERFORMANCE
// ==========================================================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
});

// ==========================================================================
// PROJECT CARD INTERACTIONS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add click event for mobile devices
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('flipped');
                const cardInner = this.querySelector('.card-inner');
                if (this.classList.contains('flipped')) {
                    cardInner.style.transform = 'rotateY(180deg)';
                } else {
                    cardInner.style.transform = 'rotateY(0deg)';
                }
            }
        });
    });
});

// ==========================================================================
// ACHIEVEMENT CARDS STAGGER ANIMATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    const achievementObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    achievementCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        achievementObserver.observe(card);
    });
});

// ==========================================================================
// KEYBOARD NAVIGATION
// ==========================================================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==========================================================================
// SMOOTH SCROLL BEHAVIOR FOR BROWSERS THAT DON'T SUPPORT IT
// ==========================================================================
if (!('scrollBehavior' in document.documentElement.style)) {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        });
    });
}

// ==========================================================================
// PERFORMANCE: DEBOUNCE SCROLL EVENTS
// ==========================================================================
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedReveal = debounce(revealOnScroll);
window.addEventListener('scroll', debouncedReveal);

// ==========================================================================
// ACCESSIBILITY: FOCUS VISIBLE POLYFILL
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    let hadKeyboardEvent = true;

    document.addEventListener('keydown', () => {
        hadKeyboardEvent = true;
    });

    document.addEventListener('mousedown', () => {
        hadKeyboardEvent = false;
    });

    document.addEventListener('focusin', (e) => {
        if (hadKeyboardEvent) {
            e.target.setAttribute('data-focus-visible', 'true');
        }
    });

    document.addEventListener('focusout', (e) => {
        e.target.removeAttribute('data-focus-visible');
    });
});

// ==========================================================================
// CONSOLE EASTER EGG
// ==========================================================================
console.log('%c🚀 Welcome to Sanwal Farooq\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with Cloud AI Focus | Financial Mathematics | Aviation Risk Analytics', 'color: #7b2ff7; font-size: 14px;');
console.log('%cInterested in collaborating? Reach out at sanwalfarooqqaisrani@gmail.com', 'color: #00ff88; font-size: 12px;');

// ==========================================================================
// INITIALIZE ALL FEATURES
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully ✅');
    
    // Log initialization
    console.log('🎨 Particle system active');
    console.log('⚡ Interactive features loaded');
    console.log('🎯 Scroll animations ready');
    console.log('📱 Responsive design active');
});
