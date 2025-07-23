// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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

// Observe all category sections and about sections
document.querySelectorAll('.category-section, .about-section').forEach(section => {
    observer.observe(section);
});

// Add loading animation to course cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Track course button clicks
document.querySelectorAll('.course-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const courseName = this.closest('.course-card').querySelector('h3').textContent;
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Optional: Track analytics
        console.log(`Curso acessado: ${courseName}`);
    });
});

// Add hover effects to course cards
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for header
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
        header.style.opacity = Math.max(0, 1 - scrolled / 400);
    }
});

// Search functionality
function createSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar cursos..." id="courseSearch">
        </div>
    `;
    
    const header = document.querySelector('.header-content');
    header.appendChild(searchContainer);
    
    // Search functionality
    const searchInput = document.getElementById('courseSearch');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = searchTerm === '' ? 'block' : 'none';
            }
        });
        
        // Hide/show category sections based on visible cards
        document.querySelectorAll('.category-section, .about-section').forEach(section => {
            const visibleCards = section.querySelectorAll('.course-card[style*="display: block"], .course-card:not([style*="display: none"])');
            section.style.display = visibleCards.length > 0 || searchTerm === '' ? 'block' : 'none';
        });
    });
}

// Initialize search box
document.addEventListener('DOMContentLoaded', createSearchBox);

// Add back to top button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    
    document.body.appendChild(backToTop);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'scale(1.1)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'scale(1)';
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const lightStylesheet = document.querySelector('link[href="style.css"]');
    const darkStylesheet = document.querySelector('#dark-stylesheet');
    const favicon = document.getElementById('favicon');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        darkStylesheet.disabled = false;
        lightStylesheet.disabled = true;
        themeToggleBtn.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        favicon.href = 'favicon-dark.ico';
    } else {
        darkStylesheet.disabled = true;
        lightStylesheet.disabled = false;
        favicon.href = 'favicon.ico';
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDarkMode = themeToggleBtn.querySelector('i').classList.contains('fa-moon');
        
        if (isDarkMode) {
            // Switch to light mode
            lightStylesheet.disabled = false;
            darkStylesheet.disabled = true;
            themeToggleBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            favicon.href = 'favicon.ico';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark mode
            lightStylesheet.disabled = true;
            darkStylesheet.disabled = false;
            themeToggleBtn.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            favicon.href = 'favicon-dark.ico';
            localStorage.setItem('theme', 'dark');
        }
        
        // Força recarregamento dos estilos para corrigir o bug visual
        document.body.style.transition = 'none'; // Desativa transições temporariamente
        setTimeout(() => {
            document.body.style.transition = ''; // Reativa transições
        }, 50);
        
        // Dispara evento para partículas
        const event = new CustomEvent('themeChanged', { detail: { isDarkMode: !isDarkMode } });
        window.dispatchEvent(event);
        
        // Add click animation
        themeToggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggleBtn.style.transform = 'scale(1)';
        }, 150);
    });
}

// Initialize theme toggle
document.addEventListener('DOMContentLoaded', initializeThemeToggle);

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuClose = document.querySelector('.menu-close');

    menuToggle.addEventListener('click', () => {
        menuOverlay.classList.add('active');
    });

    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
});