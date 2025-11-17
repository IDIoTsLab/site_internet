// Affichage de la navigation au scroll
let lastScrollTop = 0;
const nav = document.querySelector('nav');
const scrollThreshold = 100; // Pixels à scroller avant que la nav apparaisse

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
        nav.classList.add('visible');
    } else {
        nav.classList.remove('visible');
    }

    lastScrollTop = scrollTop;

    // Mettre à jour la barre de progression
    updateScrollProgress();
});

// ============================================
// 📊 BARRE DE PROGRESSION VERTICALE
// ============================================
function initScrollProgress() {
    const sections = [
        { id: 'hero', name: 'Accueil' },
        { id: 'values', name: 'Valeurs' },
        { id: 'how', name: 'Le Lab' },
        { id: 'what', name: 'Projets' },
        { id: 'community', name: 'Communauté' },
        { id: 'autonomie', name: 'Autonomie' },
        { id: 'join', name: 'Rejoindre' }
    ];

    const progressSections = document.getElementById('progressSections');

    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.style.top = `${(index / (sections.length - 1)) * 100}%`;
        dot.dataset.sectionId = section.id;

        const label = document.createElement('span');
        label.className = 'progress-dot-label';
        label.textContent = section.name;
        dot.appendChild(label);

        dot.addEventListener('click', () => {
            const targetSection = document.getElementById(section.id);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        progressSections.appendChild(dot);
    });
}

function updateScrollProgress() {
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const progressDots = document.querySelectorAll('.progress-dot');

    // Calculer la progression totale
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

    if (scrollProgressBar) {
        scrollProgressBar.style.height = `${Math.min(scrollPercent, 100)}%`;
    }

    // Activer le point correspondant à la section visible
    progressDots.forEach(dot => {
        const sectionId = dot.dataset.sectionId;
        const section = document.getElementById(sectionId);

        if (section) {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;

            if (isVisible) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        }
    });
}

// Initialiser au chargement
window.addEventListener('load', () => {
    initScrollProgress();
    updateScrollProgress();
});

// Protection anti-spam pour l'email
function showEmail() {
    const parts = ['REDACTED'];
    const email = parts[0] + '@' + parts[1] + '.' + parts[2];
    document.getElementById('email-address').innerHTML =
        '<a href="mailto:' + email + '" style="color: white;">' + email + '</a>';
}
// Délai pour éviter les bots basiques
setTimeout(showEmail, 200);

// Navigation mobile
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            document.getElementById('nav-menu').classList.remove('active');
        }
    });
});

// Carrousel amélioré
let currentSlide = 0;
const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = 8;
let autoPlayInterval;
let touchStartX = 0;
let touchEndX = 0;

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function changeSlide(direction) {
    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    updateCarousel();
    resetAutoPlay();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1);
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1);
    }
}

// Démarrer l'auto-play
startAutoPlay();

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
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

document.querySelectorAll('.value-card, .space-card, .activity-item, .member-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

// Classe pour le carrousel infini des membres
class MembersInfiniteCarousel {
    constructor() {
        this.track = document.getElementById('membersCarouselTrack');
        if (!this.track) return;

        this.slides = Array.from(this.track.children);
        this.prevBtn = document.getElementById('membersPrevBtn');
        this.nextBtn = document.getElementById('membersNextBtn');
        this.dotsContainer = document.getElementById('membersCarouselDots');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.slidesVisible = 3; // Nombre de slides visibles

        this.init();
        this.updateSlidesVisible();
        window.addEventListener('resize', () => this.updateSlidesVisible());
    }

    updateSlidesVisible() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.slidesVisible = 1;
        } else if (width <= 1024) {
            this.slidesVisible = 2;
        } else {
            this.slidesVisible = 3;
        }
    }

    init() {
        // Cloner les slides pour l'effet infini
        this.cloneSlides();

        // Créer les dots de navigation
        this.createDots();

        // Position initiale
        this.currentIndex = this.totalSlides;
        this.updatePosition(false);

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Détecter la fin de la transition
        this.track.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
        });

        // Pause sur hover
        this.track.parentElement.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.track.parentElement.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

        // Démarrer l'autoplay
        this.startAutoPlay();
    }

    cloneSlides() {
        // Cloner au début et à la fin pour l'effet infini
        this.slides.forEach(slide => {
            const cloneStart = slide.cloneNode(true);
            const cloneEnd = slide.cloneNode(true);
            this.track.appendChild(cloneEnd);
            this.track.insertBefore(cloneStart, this.track.firstChild);
        });
    }

    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('members-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updatePosition(animate = true) {
        if (animate) {
            this.track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            this.track.style.transition = 'none';
        }

        const slideWidth = 100 / this.slidesVisible;
        const offset = -this.currentIndex * slideWidth;
        this.track.style.transform = `translateX(${offset}%)`;

        this.updateDots();
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.members-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
        });

        const actualIndex = ((this.currentIndex - this.totalSlides) % this.totalSlides + this.totalSlides) % this.totalSlides;
        dots[actualIndex].classList.add('active');
    }

    next() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex++;
        this.updatePosition();
    }

    prev() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex--;
        this.updatePosition();
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = index + this.totalSlides;
        this.updatePosition();
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        // Réinitialiser la position si on est sur un clone
        if (this.currentIndex >= this.totalSlides * 2) {
            this.currentIndex = this.totalSlides;
            this.updatePosition(false);
        } else if (this.currentIndex < this.totalSlides) {
            this.currentIndex = this.totalSlides * 2 - 1;
            this.updatePosition(false);
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 3000); // Change de slide toutes les 3 secondes
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// Initialiser le carrousel des membres au chargement
window.addEventListener('load', () => {
    const membersCarousel = new MembersInfiniteCarousel();
});

// Animation de rotation orbitale (optionnel)
function enableOrbitalRotation() {
    const orbits = document.querySelectorAll('.value-orbit');
    let rotation = 0;

    function rotate() {
        rotation += 0.05; // Vitesse de rotation (plus petit = plus lent)

        orbits.forEach((orbit, index) => {
            const baseAngle = index * 120; // 120° entre chaque valeur
            const currentAngle = baseAngle + rotation;

            orbit.style.transform = `
                translate(-50%, -50%)
                rotate(${currentAngle}deg)
                translateY(-320px)
                rotate(-${currentAngle}deg)
            `;
        });

        requestAnimationFrame(rotate);
    }

    // Décommenter la ligne suivante pour activer la rotation
    rotate();
}

// Appeler la fonction au chargement (si tu veux l'animation)
window.addEventListener('load', enableOrbitalRotation);
