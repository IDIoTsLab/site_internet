// ============================================
// 🎮 EVENT PAGE INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 🎲 ANIMATED DICE ROLLING ON CLICK
    // ============================================
    const dice = document.querySelectorAll('.dice-decoration');

    dice.forEach(die => {
        die.addEventListener('click', function() {
            const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            const randomDice = diceSymbols[Math.floor(Math.random() * diceSymbols.length)];

            this.style.transform = 'rotate(720deg) scale(1.5)';
            this.style.transition = 'transform 0.5s ease';

            setTimeout(() => {
                this.textContent = randomDice;
                this.style.transform = '';
            }, 500);
        });

        // Make dice slightly interactive on hover
        die.style.cursor = 'pointer';
    });

    // ============================================
    // 🎯 SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // 🎨 CARD ENTRANCE ANIMATION ON SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ============================================
    // 🎊 CONFETTI EFFECT ON CTA BUTTON CLICK
    // ============================================
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            createConfetti(e.clientX, e.clientY);
        });
    }

    function createConfetti(x, y) {
        const colors = ['#FF8C00', '#FF9500', '#5B4E9B', '#6B5BA8', '#1A3A52'];

        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';

            document.body.appendChild(confetti);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 10;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            animateConfetti(confetti, vx, vy);
        }
    }

    function animateConfetti(element, vx, vy) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let opacity = 1;
        const gravity = 0.5;
        let velocityY = vy;

        function animate() {
            x += vx;
            y += velocityY;
            velocityY += gravity;
            opacity -= 0.02;

            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                element.remove();
            }
        }

        animate();
    }

    // ============================================
    // 🎮 GAME TAG CLICK ANIMATION
    // ============================================
    const gameTags = document.querySelectorAll('.game-tag');

    gameTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pop 0.3s ease';
            }, 10);
        });
    });

    // Add pop animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // 📅 COUNTDOWN TO EVENT (if not past)
    // ============================================
    const eventDate = new Date('2025-01-17T14:00:00');
    const now = new Date();

    if (now < eventDate) {
        // Create countdown element
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'countdown-banner';
        countdownDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF8C00 0%, #FF9500 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(255, 140, 0, 0.4);
            z-index: 999;
            font-weight: 600;
            animation: fade-in-up 0.5s ease;
        `;

        document.body.appendChild(countdownDiv);

        function updateCountdown() {
            const now = new Date();
            const diff = eventDate - now;

            if (diff <= 0) {
                countdownDiv.innerHTML = '🎉 L\'événement a commencé !';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownDiv.innerHTML = `
                ⏰ Plus que ${days}j ${hours}h ${minutes}m ${seconds}s
            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ============================================
    // 🎪 PARALLAX EFFECT ON SCROLL
    // ============================================
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.dice-decoration');

        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // ✨ EASTER EGG: KONAMI CODE
    // ============================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;

            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        alert('🎮 Code secret activé ! Vous avez débloqué le mode SUPER JOUEUR ! 🎲');

        // Make all dice rotate continuously
        dice.forEach(die => {
            die.style.animation = 'spin 2s linear infinite';
        });

        // Add spin animation
        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);

        // Change body background
        document.body.style.background = 'linear-gradient(45deg, #FF8C00, #5B4E9B, #1A3A52, #FF9500)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradient-shift 5s ease infinite';

        const gradientStyle = document.createElement('style');
        gradientStyle.textContent = `
            @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(gradientStyle);
    }

    // ============================================
    // 🎨 DYNAMIC COLOR THEME SWITCHER (hidden)
    // ============================================
    let clickCount = 0;
    const logo = document.querySelector('.event-logo');

    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;

            if (clickCount === 5) {
                const themes = [
                    { primary: '#FF1744', secondary: '#651FFF' },
                    { primary: '#00E676', secondary: '#00B0FF' },
                    { primary: '#FFEA00', secondary: '#FF6D00' }
                ];

                const randomTheme = themes[Math.floor(Math.random() * themes.length)];
                document.documentElement.style.setProperty('--orange-vif', randomTheme.primary);
                document.documentElement.style.setProperty('--bleu-violet', randomTheme.secondary);

                clickCount = 0;
            }
        });
    }

    console.log('🎲 Event page loaded successfully!');
    console.log('🎮 Try clicking on the dice decorations!');
    console.log('🎪 Easter egg: Try the Konami code!');
});
