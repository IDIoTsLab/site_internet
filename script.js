// Popup nouveauté
const NEWS_CONFIG_URL = 'https://raw.githubusercontent.com/IDIoTsLab/Ressources/refs/heads/main/config.yaml';
const NEWS_IMAGE_URL = 'https://raw.githubusercontent.com/IDIoTsLab/Ressources/refs/heads/main/news.png';

function closeNewsPopup() {
    document.getElementById('news-overlay').classList.add('hidden');
}

document.getElementById('news-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeNewsPopup();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNewsPopup();
});

// Affiche le modal en renseignant le src de l'image seulement à cet instant :
// tant que le modal reste caché, aucune requête vers news.png n'est déclenchée.
function showNewsModal(overlay) {
    const img = overlay.querySelector('.news-image');
    if (img && !img.src) img.src = NEWS_IMAGE_URL;
    overlay.classList.remove('hidden');
}

async function initNewsModal() {
    const overlay = document.getElementById('news-overlay');
    if (!overlay) return;
    try {
        const response = await fetch(NEWS_CONFIG_URL, { cache: 'no-store' });
        if (response.ok) {
            const text = await response.text();
            const match = text.match(/end_date\s*:\s*"?([0-9]{4}-[0-9]{2}-[0-9]{2})"?/);
            if (match) {
                const endDate = new Date(match[1] + 'T23:59:59');
                if (new Date() > endDate) {
                    // Date passée : on laisse le modal caché et l'image n'est jamais chargée.
                    return;
                }
            }
        }
    } catch (e) {
        // Silencieux : en cas d'échec du fetch, on affiche quand même le modal.
    }
    showNewsModal(overlay);
}

initNewsModal();

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
    }, 10000);
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
        const previousSlidesVisible = this.slidesVisible;

        if (width <= 768) {
            this.slidesVisible = 1;
        } else if (width <= 1024) {
            this.slidesVisible = 2;
        } else {
            this.slidesVisible = 3;
        }

        // Si le nombre de slides visibles a changé, recréer les dots
        if (previousSlidesVisible !== this.slidesVisible) {
            this.recreateDots();
        }

        // Recalculer la position avec le nouveau nombre de slides visibles
        this.updatePosition(false);
    }

    recreateDots() {
        // Vider les dots existants
        this.dotsContainer.innerHTML = '';

        // Recréer les dots avec le bon nombre
        const numPositions = this.totalSlides - this.slidesVisible + 1;

        for (let i = 0; i < numPositions; i++) {
            const dot = document.createElement('button');
            dot.classList.add('members-dot');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }

        // Mettre à jour le dot actif
        this.updateDots();
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
        // Calculer le nombre de positions de navigation basé sur le nombre de slides visibles
        const numPositions = this.totalSlides - this.slidesVisible + 1;

        for (let i = 0; i < numPositions; i++) {
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

        // Calculer la largeur d'une carte incluant le gap
        // Sur mobile (1 slide), pas de gap. Sur desktop/tablet, gap de 2rem
        const gapSize = this.slidesVisible === 1 ? 0 : 2; // 2rem de gap sauf sur mobile
        const cardWidth = (100 - (gapSize * (this.slidesVisible - 1))) / this.slidesVisible;
        const slideWidth = cardWidth + gapSize;
        const offset = -this.currentIndex * slideWidth;
        this.track.style.transform = `translateX(${offset}%)`;

        this.updateDots();
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.members-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
        });

        // Calculer l'index réel du dot basé sur la position actuelle
        const actualIndex = ((this.currentIndex - this.totalSlides) % this.totalSlides + this.totalSlides) % this.totalSlides;

        // S'assurer que l'index du dot ne dépasse pas le nombre de dots disponibles
        const dotIndex = Math.min(actualIndex, dots.length - 1);

        if (dots[dotIndex]) {
            dots[dotIndex].classList.add('active');
        }
    }

    next() {
        if (this.isTransitioning) return;

        // Calculer le nombre maximum de positions
        const maxIndex = this.totalSlides + (this.totalSlides - this.slidesVisible);

        // Ne pas avancer si on est déjà à la dernière position valide
        if (this.currentIndex >= maxIndex) {
            // Revenir au début pour l'effet infini
            this.currentIndex = this.totalSlides - 1;
        }

        this.isTransitioning = true;
        this.currentIndex++;
        this.updatePosition();
    }

    prev() {
        if (this.isTransitioning) return;

        // Ne pas reculer si on est déjà au début
        if (this.currentIndex <= this.totalSlides) {
            // Aller à la fin pour l'effet infini
            this.currentIndex = this.totalSlides + (this.totalSlides - this.slidesVisible) + 1;
        }

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

        // Calculer la position maximale valide
        const maxValidIndex = this.totalSlides + (this.totalSlides - this.slidesVisible);

        // Réinitialiser la position si on est sur un clone à droite
        if (this.currentIndex > maxValidIndex) {
            const offset = this.currentIndex - maxValidIndex;
            this.currentIndex = this.totalSlides + offset - 1;
            this.updatePosition(false);
        }
        // Réinitialiser la position si on est sur un clone à gauche
        else if (this.currentIndex < this.totalSlides) {
            const offset = this.totalSlides - this.currentIndex;
            this.currentIndex = maxValidIndex - offset + 1;
            this.updatePosition(false);
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 6000); // Change de slide toutes les 6 secondes
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

// ============================================
// 📧 OBFUSCATION EMAIL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const emailLink = document.querySelector('.email-link');
        if (emailLink) {
            emailLink.addEventListener('click', function(e) {
                e.preventDefault();
                const user = 'REDACTED';
                const domain = 'REDACTED';
                window.location.href = 'mailto:' + user + '@' + domain;
            });
        }
    }, 5000);
});

// ============================================
// 🎮 EVENT MODAL FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const eventModal = document.getElementById('eventModal');

    // Check if modal should be displayed (only until January 17, 2026)
    const eventEndDate = new Date('2026-01-17T23:59:59');
    const now = new Date();

    // Check if user has already closed the modal in this session
    const modalClosed = sessionStorage.getItem('eventModalClosed');

    if (now <= eventEndDate && !modalClosed && eventModal) {
        // Show modal after a short delay
        setTimeout(function() {
            eventModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }, 1500);
    }
});

// Function to close the event modal
function closeEventModal() {
    const eventModal = document.getElementById('eventModal');
    if (eventModal) {
        eventModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling

        // Remember that user closed the modal for this session
        sessionStorage.setItem('eventModalClosed', 'true');
    }
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEventModal();
    }
});
