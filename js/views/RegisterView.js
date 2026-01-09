class RegisterView {
    constructor() {
        this.initializeEffects();
        this.setupValidation();
    }

    initializeEffects() {
        this.createScannerEffect();
        this.addInputEffects();
    }

    createScannerEffect() {
        const registerCard = document.querySelector('.register-card');
        if (!registerCard) return;

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
            
            registerCard.appendChild(scanner);
            
            setTimeout(() => {
                scanner.remove();
            }, 2000);
        }, 4000);
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
        const existingGlow = inputGroup.querySelector('.input-glow-effect');
        if (existingGlow) existingGlow.remove();

        const glow = document.createElement('div');
        glow.className = 'input-glow-effect';
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #ff00ff, #8000ff);
            border-radius: 12px;
            z-index: -1;
            opacity: 0;
            animation: glowPulse 0.5s ease-in-out forwards;
        `;

        inputGroup.appendChild(glow);

        input.addEventListener('blur', () => {
            glow.remove();
        }, { once: true });
    }

    validateInput(input) {
        const inputGroup = input.parentElement;
        const existingError = inputGroup.querySelector('.validation-error');
        if (existingError) existingError.remove();

        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'username':
                if (input.value.length < 3) {
                    isValid = false;
                    errorMessage = 'Mínimo 3 caracteres';
                }
                break;
            case 'password':
                this.updatePasswordStrength(input.value);
                const validation = this.validatePassword(input.value);
                if (!validation.valid) {
                    isValid = false;
                    errorMessage = validation.message;
                }
                break;
            case 'firstName':
            case 'lastName':
                if (input.value.length < 2) {
                    isValid = false;
                    errorMessage = 'Mínimo 2 caracteres';
                }
                break;
            case 'email':
                if (!this.isValidEmail(input.value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;
            case 'birthDate':
                if (!this.isValidAge(input.value)) {
                    isValid = false;
                    errorMessage = 'Fecha inválida';
                }
                break;
        }

        if (!isValid && input.value.length > 0) {
            this.showValidationError(inputGroup, errorMessage);
        } else if (input.value.length > 0) {
            this.showValidationSuccess(inputGroup);
        }
    }

    validatePassword(password) {
        if (password.length < 8) return { valid: false, message: 'Mínimo 8 caracteres' };
        if (!/[a-zA-Z]/.test(password)) return { valid: false, message: 'Debe contener letras' };
        if (!/[0-9]/.test(password)) return { valid: false, message: 'Debe contener números' };
        return { valid: true, message: 'Contraseña válida' };
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.password-strength');
        if (!strengthBar) return;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        strengthBar.className = 'password-strength';
        if (strength <= 2) strengthBar.classList.add('weak');
        else if (strength <= 3) strengthBar.classList.add('medium');
        else strengthBar.classList.add('strong');
    }

    isValidAge(birthDate) {
        if (!birthDate) return false;
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        return age >= 0 && age <= 120 && birth <= today;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showValidationError(inputGroup, message) {
        const error = document.createElement('div');
        error.className = 'validation-error show';
        error.textContent = message;
        inputGroup.appendChild(error);
    }

    showValidationSuccess(inputGroup) {
        const existingIndicator = inputGroup.querySelector('.validation-indicator');
        if (existingIndicator) existingIndicator.remove();

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
    }

    setupValidation() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showLoadingState();
        });
    }

    showLoadingState() {
        const button = document.querySelector('.register-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = `
            <span style="display: inline-flex; align-items: center;">
                <div style="width: 20px; height: 20px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                REGISTRANDO...
            </span>
        `;
        
        button.disabled = true;

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

    showSuccessAnimation() {
        const registerCard = document.querySelector('.register-card');
        if (registerCard) {
            registerCard.style.borderColor = '#00ff00';
            registerCard.style.boxShadow = '0 20px 40px rgba(0, 255, 0, 0.3)';
            
            this.createSuccessParticles();
        }
    }

    createSuccessParticles() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #00ff00;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    animation: successParticle 2s ease-out forwards;
                    box-shadow: 0 0 8px #00ff00;
                `;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }, i * 30);
        }
    }
}