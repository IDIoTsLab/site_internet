// ============================================
// MENU MOBILE TOGGLE
// ============================================
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// ============================================
// EMAIL OBFUSCATION (5 seconds delay)
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
// CAROUSEL
// ============================================
class RoomCarousel {
    constructor() {
        this.carousel = document.getElementById('roomCarousel');
        this.items = this.carousel.querySelectorAll('.carousel-item');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');

        this.currentIndex = 0;
        this.totalItems = this.items.length;

        this.init();
    }

    init() {
        // Créer les dots
        this.createDots();

        // Event listeners pour les boutons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Auto-play
        this.startAutoPlay();

        // Pause au survol
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Touch gestures pour mobile
        this.addTouchGestures();
    }

    createDots() {
        for (let i = 0; i < this.totalItems; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        this.items[this.currentIndex].classList.remove('active');
        this.currentIndex = index;
        this.items[this.currentIndex].classList.add('active');
        this.updateDots();
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.totalItems;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    addTouchGestures() {
        let startX = 0;
        let endX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }
}

// ============================================
// CONFIG GITHUB - TARIF SALLE
// ============================================
const CONFIG_URL = 'https://raw.githubusercontent.com/IDIoTsLab/Ressources/refs/heads/main/config.yaml';

async function loadConfig() {
    try {
        const response = await fetch(CONFIG_URL);
        if (!response.ok) return;
        const text = await response.text();

        // Extraction simple du tarif_journee depuis le YAML
        const match = text.match(/tarif_journee\s*:\s*(\d+)/);
        if (match) {
            const tarif = match[1];
            const el = document.getElementById('tarif-journee');
            if (el) el.textContent = tarif + '€';
        }
    } catch (e) {
        // Silencieux : la valeur par défaut (150€) reste affichée
    }
}

// ============================================
// FORMULAIRE DE RÉSERVATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le carousel
    new RoomCarousel();

    // Charger le tarif depuis GitHub
    loadConfig();

    // Gérer la soumission du formulaire
    const form = document.getElementById('reservationForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Récupérer les valeurs du formulaire
        const nomPrenom = document.getElementById('nomPrenom').value;
        const telephone = document.getElementById('telephone').value;
        const objet = document.getElementById('objet').value;
        const qui = document.getElementById('qui').value;
        const dateHeure = document.getElementById('dateHeure').value;

        // Formater la date
        const dateObj = new Date(dateHeure);
        const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Créer l'objet de l'email
        const emailSubject = `[Réservation salle] - ${qui} - ${dateFormatted}`;

        // Créer le corps de l'email
        const emailBody = `Bonjour,

Une nouvelle demande de réservation de salle a été soumise via le formulaire du site.

Détails de la réservation :
    • Nom Prénom : ${nomPrenom}
    • Numéro de téléphone : ${telephone}
    • Objet : ${objet}
    • Type : ${qui}
    • Date et heure : ${dateFormatted}

Veuillez vérifier la disponibilité et confirmer si nécessaire.`;

        // Obfuscation de l'email
        const user = 'REDACTED';
        const domain = 'REDACTED';
        const email = user + '@' + domain;

        // Encoder les paramètres pour l'URL
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        // Ouvrir le client email
        window.location.href = mailtoLink;

        // Optionnel : réinitialiser le formulaire après un court délai
        setTimeout(() => {
            form.reset();
        }, 1000);
    });
});
