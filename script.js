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
const totalSlides = 4;
let autoPlayInterval;

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

// Carrousel des membres avec boucle infinie
let currentMemberIndex = 0;
const membersCarousel = document.getElementById('members-carousel');
const memberCards = membersCarousel.querySelectorAll('.member-card');
const totalMembers = memberCards.length;

// Clone les premières et dernières cartes pour l'effet infini
function initMembersCarousel() {
    // Clone les 4 premières cartes et les ajoute à la fin
    for (let i = 0; i < 4; i++) {
        const clone = memberCards[i].cloneNode(true);
        membersCarousel.appendChild(clone);
    }

    // Clone les 4 dernières cartes et les ajoute au début
    for (let i = totalMembers - 1; i >= totalMembers - 4; i--) {
        const clone = memberCards[i].cloneNode(true);
        membersCarousel.insertBefore(clone, membersCarousel.firstChild);
    }

    // Positionne au début (après les clones du début)
    currentMemberIndex = 4;
    updateMembersCarousel(false);
}

function scrollMembers(direction) {
    currentMemberIndex += direction;
    updateMembersCarousel(true);
}

function updateMembersCarousel(animate = true) {
    const cardWidth = memberCards[0].offsetWidth;
    const gap = 32; // 2rem = 32px
    const offset = -(currentMemberIndex * (cardWidth + gap));

    if (animate) {
        membersCarousel.style.transition = 'transform 0.5s ease-in-out';
    } else {
        membersCarousel.style.transition = 'none';
    }

    membersCarousel.style.transform = `translateX(${offset}px)`;

    // Gestion de la boucle infinie
    setTimeout(() => {
        if (currentMemberIndex <= 0) {
            // Si on est avant le début, saute à la fin
            currentMemberIndex = totalMembers;
            updateMembersCarousel(false);
        } else if (currentMemberIndex >= totalMembers + 4) {
            // Si on est après la fin, saute au début
            currentMemberIndex = 4;
            updateMembersCarousel(false);
        }
    }, animate ? 500 : 0);
}

// Support du swipe tactile pour mobile
let touchStartX = 0;
let touchEndX = 0;

membersCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

membersCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleMembersSwipe();
});

function handleMembersSwipe() {
    if (touchEndX < touchStartX - 50) {
        scrollMembers(1); // Swipe gauche
    }
    if (touchEndX > touchStartX + 50) {
        scrollMembers(-1); // Swipe droite
    }
}

// Support clavier
document.addEventListener('keydown', (e) => {
    if (document.querySelector('#community:hover')) {
        if (e.key === 'ArrowLeft') {
            scrollMembers(-1);
        } else if (e.key === 'ArrowRight') {
            scrollMembers(1);
        }
    }
});

// Initialise le carrousel au chargement
window.addEventListener('load', initMembersCarousel);

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
