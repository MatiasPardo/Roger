class LoginView {
    constructor() {
        this.initializeEffects();
        this.setupFormValidation();
    }

    initializeEffects() {
        this.createScannerEffect();
        this.addInputEffects();
    }

    createScannerEffect() {
        const loginCard = document.querySelector('.login-card');
        if (!loginCard) return;

        setInterval(() => {
            const scanner = document.createElement('div');
            scanner.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, transparent, #ff00ff, transparent);
                animation: verticalScan 2s linear;
                z-index: 10;
            `;
            
            loginCard.appendChild(scanner);
            
            setTimeout(() => {
                scanner.remove();
            }, 2000);
        }, 3000);

        if (!document.querySelector('#scanner-animation')) {
            const style = document.createElement('style');
            style.id = 'scanner-animation';
            style.textContent = `
                @keyframes verticalScan {
                    from { top: 0; opacity: 1; }
                    to { top: 100%; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addInputEffects() {
        const inputs = document.querySelectorAll('.input-group input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                this.createInputGlow(e.target);
            });

            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });
        });
    }

    createInputGlow(input) {
        const inputGroup = input.parentElement;
        const glow = document.createElement('div');
        glow.className = 'input-glow-effect';
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            border-radius: 12px;
            z-index: -1;
            opacity: 0;
            animation: glowPulse 0.5s ease-in-out forwards;
        `;

        inputGroup.appendChild(glow);

        if (!document.querySelector('#glow-animation')) {
            const style = document.createElement('style');
            style.id = 'glow-animation';
            style.textContent = `
                @keyframes glowPulse {
                    to { opacity: 0.6; }
                }
            `;
            document.head.appendChild(style);
        }

        input.addEventListener('blur', () => {
            glow.remove();
        }, { once: true });
    }

    validateInput(input) {
        const value = input.value;
        const inputGroup = input.parentElement;
        
        // Remover indicadores previos
        const existingIndicator = inputGroup.querySelector('.validation-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        if (value.length > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'validation-indicator';
            indicator.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00ff00;
                box-shadow: 0 0 10px #00ff00;
                animation: validationPulse 1s ease-in-out infinite;
            `;
            
            inputGroup.appendChild(indicator);

            if (!document.querySelector('#validation-animation')) {
                const style = document.createElement('style');
                style.id = 'validation-animation';
                style.textContent = `
                    @keyframes validationPulse {
                        0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
                        50% { opacity: 0.5; transform: translateY(-50%) scale(1.2); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    setupFormValidation() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showLoadingState();
        });
    }

    showLoadingState() {
        const button = document.querySelector('.login-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = `
            <span style="display: inline-flex; align-items: center;">
                <div style="width: 20px; height: 20px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                VERIFICANDO...
            </span>
        `;
        
        button.disabled = true;

        if (!document.querySelector('#spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // Simular delay de verificación
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        if (!messageDiv) return;

        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    clearMessage() {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }
    }
}