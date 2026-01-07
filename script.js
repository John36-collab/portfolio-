// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Interactive heading effect
    const interactiveHeading = document.getElementById('hero-heading');
    
    if (interactiveHeading) {
        interactiveHeading.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.textShadow = '0 0 30px rgba(0, 247, 255, 0.8)';
            
            // Add particle effect
            createParticles(this);
        });
        
        interactiveHeading.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.textShadow = '0 0 20px rgba(0, 247, 255, 0.7)';
        });
        
        interactiveHeading.addEventListener('click', function() {
            // Pulse animation on click
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    }
    
    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send to Python backend
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                // Show message
                formMessage.textContent = result.message;
                formMessage.className = 'form-message show ' + (result.success ? 'success' : 'error');
                
                // Reset form if successful
                if (result.success) {
                    contactForm.reset();
                    
                    // Add success animation
                    const inputs = contactForm.querySelectorAll('.form-input');
                    inputs.forEach(input => {
                        input.style.animation = 'pulse 0.5s ease';
                        setTimeout(() => {
                            input.style.animation = '';
                        }, 500);
                    });
                }
                
            } catch (error) {
                formMessage.textContent = 'Error sending message. Please try again.';
                formMessage.className = 'form-message show error';
                console.error('Form submission error:', error);
            } finally {
                // Reset button
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);
            }
        });
    }
    
    // Back to top button functionality
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add animation to the target section
                targetElement.style.animation = 'pulse 0.8s ease';
                setTimeout(() => {
                    targetElement.style.animation = '';
                }, 800);
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animations based on element type
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections and project cards
    document.querySelectorAll('.slide-in-section, .project-card').forEach(el => {
        observer.observe(el);
    });
    
    // Hover effects for skill and interest items
    document.querySelectorAll('.skill-list li, .interest-list li').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(10deg)';
                icon.style.color = '#ff2a2a';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = '#00f7ff';
            }
        });
    });
    
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const links = this.querySelectorAll('.project-link');
            links.forEach(link => {
                link.style.transform = 'translateY(0)';
                link.style.opacity = '1';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const links = this.querySelectorAll('.project-link');
            links.forEach(link => {
                link.style.transform = 'translateY(10px)';
                link.style.opacity = '0.8';
            });
        });
    });
    
    // Form input focus effects
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// Particle effect for heading
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = 15;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = i % 3 === 0 ? '#00f7ff' : i % 3 === 1 ? '#ff2a2a' : '#2a7fff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        
        // Random position around the heading
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.zIndex = '1000';
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const distance = 50 + Math.random() * 100;
        
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.2, 0, 0.8, 1)'
        });
        
        // Remove particle after animation
        animation.onfinish = () => {
            particle.remove();
        };
    }
}

// Initialize animations on window load
window.addEventListener('load', function() {
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
    
    // Animate hero section elements with delay
    const heroElements = document.querySelectorAll('.hero h1, .hero .tagline, .hero p, .hero .button-cta');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
});
