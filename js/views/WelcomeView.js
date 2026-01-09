class WelcomeView {
    constructor() {
        this.initializeEffects();
    }

    initializeEffects() {
        this.createParticles();
        this.addHoverEffects();
    }

    createParticles() {
        const particleSystem = document.querySelector('.particle-system');
        if (!particleSystem) return;

        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: #00ffff;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: floatUp 3s linear forwards;
                box-shadow: 0 0 10px #00ffff;
            `;
            
            particleSystem.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, 500);

        // Agregar animación CSS dinámicamente
        if (!document.querySelector('#particle-animation')) {
            const style = document.createElement('style');
            style.id = 'particle-animation';
            style.textContent = `
                @keyframes floatUp {
                    to {
                        transform: translateY(-400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addHoverEffects() {
        const enterBtn = document.getElementById('enterBtn');
        if (!enterBtn) return;

        enterBtn.addEventListener('mouseenter', () => {
            this.createButtonRipple(enterBtn);
        });
    }

    createButtonRipple(button) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;

        button.appendChild(ripple);

        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showWelcomeMessage() {
        const title = document.querySelector('.title');
        if (title) {
            title.style.animation = 'none';
            setTimeout(() => {
                title.style.animation = 'gradient 3s ease infinite, pulse 1s ease-in-out 3';
            }, 100);
        }
    }
}