// Header scroll effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
});

// Smooth cursor glow animation
function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursorGlow);
}
animateCursorGlow();

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe sections and content elements
document.querySelectorAll('.section-content, .contact-content, .highlight-card, .subject-card, .subject-card-vertical, .research-card, .method-card, .project-card, .project-card-large, .skill-block, .study-block, .timeline-item, .bio-content, .bio-card, .goal-card, .contact-form-container, .contact-info, .project-main, .project-sidebar').forEach(el => {
    observer.observe(el);
});

// Staggered animation for cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.work-card, .highlight-card, .subject-card, .subject-card-vertical, .research-card, .method-card, .project-card, .project-card-large, .goal-card, .study-block, .contact-form-container, .contact-info, .project-main, .project-sidebar');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, i * 100);
            });
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe card containers
document.querySelectorAll('.highlights-grid, .work-grid, .subjects-grid, .subjects-grid-compact, .research-grid, .methodology-grid, .projects-grid, .projects-grid-simple, .medicine-goals, .studies-grid, .contact-grid, .project-detail-grid').forEach(container => {
    cardObserver.observe(container);
});

// Smooth scroll for same-page navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                contactForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                }
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error and restore button
            alert('There was an error sending your message. Please try again or email directly.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Add visible class to elements that should animate on page load
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations after a short delay
    setTimeout(() => {
        document.querySelectorAll('.bio-content, .bio-card, .quick-about-content, .quick-about-stats, .intro-content, .intro-image, .academic-visual').forEach(el => {
            el.classList.add('visible');
        });
    }, 200);
    
    // Trigger animations for elements already in view
    setTimeout(() => {
        document.querySelectorAll('.highlight-card, .project-card-large, .subject-card-vertical, .goal-card, .timeline-item').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                el.classList.add('visible');
            }
        });
    }, 600);
});

// Parallax effect for hero background orbs (subtle)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = 0.05 * (index + 1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// HORIZONTAL TIMELINE (LOGARITHMIC)
// ============================================

async function initHorizontalTimeline() {
    const timelineContainer = document.getElementById('horizontal-timeline');
    const eventsContainer = document.getElementById('timeline-events');
    const yearsContainer = document.getElementById('timeline-years');
    const popup = document.getElementById('timeline-popup');
    
    if (!timelineContainer || !eventsContainer || !yearsContainer) return;
    
    // Load timeline data
    let timelineData;
    try {
        const response = await fetch('data/timeline.json');
        timelineData = await response.json();
    } catch (error) {
        console.error('Failed to load timeline data:', error);
        return;
    }
    
    const events = timelineData.events;
    const categories = timelineData.categories;
    
    // Reference date (today)
    const referenceDate = new Date('2026-02-04');
    
    // Find oldest event to determine range
    let oldestDate = referenceDate;
    events.forEach(event => {
        const eventDate = new Date(event.startDate || event.date);
        if (eventDate < oldestDate) oldestDate = eventDate;
    });
    
    // Calculate max days from oldest event to reference
    const maxDays = Math.ceil((referenceDate - oldestDate) / (1000 * 60 * 60 * 24));
    
    // Hybrid position function (blend of linear and logarithmic)
    // This gives moderate compression of old events while keeping recent events reasonably spaced
    function getHybridPosition(dateStr) {
        const date = new Date(dateStr);
        const daysAgo = Math.max(1, Math.ceil((referenceDate - date) / (1000 * 60 * 60 * 24)));
        
        // Linear position (0 = oldest, 1 = most recent)
        const linearPosition = 1 - (daysAgo / maxDays);
        
        // Logarithmic position
        const logPosition = 1 - (Math.log(daysAgo) / Math.log(maxDays + 1));
        
        // Blend: 60% linear, 40% logarithmic for balanced distribution
        const blendedPosition = (linearPosition * 0.6) + (logPosition * 0.4);
        
        return Math.max(3, Math.min(97, blendedPosition * 100)); // Clamp between 3-97%
    }
    
    // Format date for display
    function formatDate(event) {
        const options = { month: 'short', year: 'numeric' };
        if (event.startDate && event.endDate) {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
        }
        return new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    // Sort events by date (oldest first)
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.startDate || a.date);
        const dateB = new Date(b.startDate || b.date);
        return dateA - dateB;
    });
    
    // Group events by similar positions to handle overlapping
    const groupedEvents = [];
    const positionThreshold = 3; // percentage threshold for grouping
    
    sortedEvents.forEach(event => {
        const pos = event.startDate ? getHybridPosition(event.startDate) : getHybridPosition(event.date);
        
        // Find if there's an existing group nearby
        const existingGroup = groupedEvents.find(g => Math.abs(g.position - pos) < positionThreshold);
        
        if (existingGroup) {
            existingGroup.events.push(event);
            // Update group position to average
            existingGroup.position = (existingGroup.position + pos) / 2;
        } else {
            groupedEvents.push({
                position: pos,
                events: [event]
            });
        }
    });
    
    // Render events
    groupedEvents.forEach((group, groupIndex) => {
        group.events.forEach((event, eventIndex) => {
            const eventEl = document.createElement('div');
            eventEl.className = 'timeline-event';
            if (event.startDate && event.endDate) {
                eventEl.classList.add('range');
            }
            
            // Stack overlapping events vertically (alternate above/below)
            const verticalOffset = eventIndex * 25 * (eventIndex % 2 === 0 ? 1 : -1);
            eventEl.style.left = `${group.position}%`;
            eventEl.style.top = `calc(50% + ${verticalOffset}px)`;
            
            // If multiple events in group, show count indicator on first
            if (group.events.length > 1 && eventIndex === 0) {
                eventEl.classList.add('stacked');
                eventEl.setAttribute('data-count', group.events.length);
            }
            
            const category = categories[event.category];
            const dot = document.createElement('div');
            dot.className = 'event-dot';
            dot.style.backgroundColor = category.color;
            dot.style.color = category.color;
            
            eventEl.appendChild(dot);
            
            // Hover events
            eventEl.addEventListener('mouseenter', (e) => {
                const rect = eventEl.getBoundingClientRect();
                popup.querySelector('#popup-date').textContent = formatDate(event);
                popup.querySelector('#popup-title').textContent = event.title;
                popup.querySelector('#popup-description').textContent = event.description;
                
                // Position popup
                const popupWidth = 300;
                let left = rect.left + rect.width / 2 - popupWidth / 2;
                let top = rect.top - 10;
                
                // Keep popup in viewport
                if (left < 10) left = 10;
                if (left + popupWidth > window.innerWidth - 10) {
                    left = window.innerWidth - popupWidth - 10;
                }
                
                popup.style.left = `${left}px`;
                popup.style.top = `${top}px`;
                popup.style.transform = 'translateY(-100%)';
                popup.classList.add('active');
            });
            
            eventEl.addEventListener('mouseleave', () => {
                popup.classList.remove('active');
            });
            
            eventsContainer.appendChild(eventEl);
        });
    });
    
    // Render year markers with hybrid positioning
    const startYear = oldestDate.getFullYear();
    const endYear = referenceDate.getFullYear();
    
    for (let year = startYear; year <= endYear; year++) {
        const yearDate = new Date(year, 6, 1); // Mid-year for positioning
        const yearEl = document.createElement('div');
        yearEl.className = 'year-marker';
        yearEl.textContent = year;
        
        // Use same hybrid position formula for year markers
        const daysAgo = Math.max(1, Math.ceil((referenceDate - yearDate) / (1000 * 60 * 60 * 24)));
        const linearPos = 1 - (daysAgo / maxDays);
        const logPos = 1 - (Math.log(daysAgo) / Math.log(maxDays + 1));
        const hybridPos = (linearPos * 0.6) + (logPos * 0.4);
        yearEl.style.left = `${Math.max(3, Math.min(97, hybridPos * 100))}%`;
        
        yearsContainer.appendChild(yearEl);
    }
}

// Initialize timeline when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initHorizontalTimeline();
});
