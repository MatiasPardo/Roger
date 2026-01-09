class BabyShowerView {
    constructor() {
        this.initializeEffects();
        this.setupScrollEffects();
    }

    initializeEffects() {
        this.createBabyParticles();
        this.addSectionAnimations();
        this.setupScrollIndicator();
    }

    createBabyParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(particleContainer);

        setInterval(() => {
            const particle = document.createElement('div');
            const symbols = ['👶', '🍼', '🎀', '💝', '🎉', '⭐', '💖'];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            
            particle.textContent = symbol;
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: floatUpBaby 4s linear forwards;
                opacity: 0.7;
            `;
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 4000);
        }, 800);

        if (!document.querySelector('#baby-particle-animation')) {
            const style = document.createElement('style');
            style.id = 'baby-particle-animation';
            style.textContent = `
                @keyframes floatUpBaby {
                    to {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupScrollEffects() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.animateSection(entry.target);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    animateSection(section) {
        const card = section.querySelector('.baby-card, .event-card, .confirmation-card');
        if (card) {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'float 6s ease-in-out infinite, sectionEntry 0.8s ease-out';
            }, 100);
        }

        if (!document.querySelector('#section-entry-animation')) {
            const style = document.createElement('style');
            style.id = 'section-entry-animation';
            style.textContent = `
                @keyframes sectionEntry {
                    from {
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupScrollIndicator() {
        const scrollArrow = document.querySelector('.scroll-arrow');
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        }
    }

    scrollToNextSection() {
        const eventSection = document.querySelector('.event-section');
        if (eventSection) {
            eventSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    addSectionAnimations() {
        // Animación especial para el título principal
        const babyMainTitle = document.querySelector('.baby-main-title');
        if (babyMainTitle) {
            setTimeout(() => {
                babyMainTitle.style.animation += ', titlePulse 2s ease-in-out 3';
            }, 1000);
        }

        if (!document.querySelector('#title-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'title-pulse-animation';
            style.textContent = `
                @keyframes titlePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showConfirmationMessage(message, type) {
        const messageDiv = document.getElementById('confirmationMessage');
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = `confirmation-message ${type}`;
        
        // Efecto de aparición
        setTimeout(() => {
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    showConfirmationAnimation() {
        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) {
            // Cambiar el botón temporalmente
            const originalText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center;">
                    <div style="width: 20px; height: 20px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                    CONFIRMANDO...
                </span>
            `;
            
            setTimeout(() => {
                confirmBtn.innerHTML = '✓ CONFIRMADO';
                confirmBtn.style.background = 'linear-gradient(45deg, #ffd700, #ffff00)';
                confirmBtn.style.color = '#000';
                
                // Crear efecto de confeti
                this.createConfetti();
            }, 2000);
        }
    }

    createConfetti() {
        const colors = ['#ff69b4', '#00ffff', '#ffd700', '#00ff00', '#ff1493'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    animation: confettiFall 3s linear forwards;
                    z-index: 1000;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }

        if (!document.querySelector('#confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addHeartEffect() {
        const hearts = ['💖', '💕', '💗', '💓'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.cssText = `
                    position: fixed;
                    font-size: 2rem;
                    left: ${Math.random() * 100}%;
                    top: 50%;
                    animation: heartFloat 2s ease-out forwards;
                    z-index: 1000;
                    pointer-events: none;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 2000);
            }, i * 100);
        }

        if (!document.querySelector('#heart-animation')) {
            const style = document.createElement('style');
            style.id = 'heart-animation';
            style.textContent = `
                @keyframes heartFloat {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-50px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}