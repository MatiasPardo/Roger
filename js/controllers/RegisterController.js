class RegisterController {
    constructor() {
        this.userModel = new User();
        this.registerView = new RegisterView();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Validación en tiempo real del username
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => {
                this.checkUsernameAvailability();
            });
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.navigateToLogin();
            }
        });

        this.showEntryAnimation();
    }

    async checkUsernameAvailability() {
        const username = document.getElementById('username').value.trim();
        if (username.length < 3) return;

        if (this.userModel.userExists(username)) {
            this.showUsernameError('Este usuario ya existe');
        } else {
            this.showUsernameSuccess('Usuario disponible');
        }
    }

    showUsernameError(message) {
        const usernameGroup = document.getElementById('username').parentElement;
        const existingError = usernameGroup.querySelector('.username-availability');
        if (existingError) existingError.remove();

        const error = document.createElement('div');
        error.className = 'username-availability';
        error.style.cssText = `
            position: absolute;
            bottom: -25px;
            left: 0;
            color: #ff4444;
            font-size: 0.8rem;
            opacity: 1;
        `;
        error.textContent = message;
        usernameGroup.appendChild(error);
    }

    showUsernameSuccess(message) {
        const usernameGroup = document.getElementById('username').parentElement;
        const existingError = usernameGroup.querySelector('.username-availability');
        if (existingError) existingError.remove();

        const success = document.createElement('div');
        success.className = 'username-availability';
        success.style.cssText = `
            position: absolute;
            bottom: -25px;
            left: 0;
            color: #00ff00;
            font-size: 0.8rem;
            opacity: 1;
        `;
        success.textContent = message;
        usernameGroup.appendChild(success);
    }

    async handleRegister() {
        const formData = this.getFormData();
        
        this.registerView.clearMessage();

        if (!this.validateForm(formData)) {
            return;
        }

        this.registerView.showLoadingState();

        setTimeout(() => {
            const result = this.userModel.register(formData);
            
            if (result.success) {
                this.handleSuccessfulRegister(result);
            } else {
                this.handleFailedRegister(result.message);
            }
        }, 1500);
    }

    getFormData() {
        return {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            birthDate: document.getElementById('birthDate').value
        };
    }

    validateForm(data) {
        const errors = [];

        if (data.username.length < 3) {
            errors.push('El usuario debe tener al menos 3 caracteres');
        }

        if (this.userModel.emailExists(data.email)) {
            errors.push('Este email ya está registrado');
        }

        if (!this.isValidEmail(data.email)) {
            errors.push('Email inválido');
        }

        const passwordValidation = this.userModel.validatePassword(data.password);
        if (!passwordValidation.valid) {
            errors.push(passwordValidation.message);
        }

        if (data.firstName.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (data.lastName.length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        }

        if (!data.birthDate) {
            errors.push('La fecha de nacimiento es requerida');
        }

        if (errors.length > 0) {
            this.registerView.showMessage(errors[0], 'error');
            this.shakeForm();
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleSuccessfulRegister(result) {
        this.registerView.showMessage(`¡Bienvenido ${result.user.firstName}! Registro completado exitosamente`, 'success');
        
        this.registerView.showSuccessAnimation();
        
        // Crear sesión con SessionManager
        const sessionManager = new SessionManager();
        sessionManager.createSession({
            username: result.user.username,
            email: result.user.email,
            fullName: `${result.user.firstName} ${result.user.lastName}`
        });
        
        console.log('Datos guardados en localStorage (registro):');
        console.log('userEmail:', result.user.email);
        console.log('username:', result.user.username);
        
        // Limpiar formulario
        this.clearForm();
        
        // Redirigir después de mostrar el mensaje
        setTimeout(() => {
            this.navigateToWelcome();
        }, 3000);
    }

    handleFailedRegister(message) {
        this.registerView.showMessage(message, 'error');
        this.shakeForm();
    }

    shakeForm() {
        const registerCard = document.querySelector('.register-card');
        if (registerCard) {
            registerCard.style.animation = 'shake 0.5s ease-in-out';
            
            setTimeout(() => {
                registerCard.style.animation = '';
            }, 500);
        }
    }

    clearForm() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.reset();
            
            // Limpiar indicadores de validación
            document.querySelectorAll('.validation-indicator, .validation-error, .username-availability').forEach(indicator => {
                indicator.remove();
            });
            
            // Limpiar barra de fortaleza de contraseña
            const strengthBar = document.querySelector('.password-strength');
            if (strengthBar) {
                strengthBar.className = 'password-strength';
            }
        }
    }

    showEntryAnimation() {
        const registerCard = document.querySelector('.register-card');
        if (registerCard) {
            registerCard.style.opacity = '0';
            registerCard.style.transform = 'translateY(50px) scale(0.9)';
            
            setTimeout(() => {
                registerCard.style.transition = 'all 0.6s ease';
                registerCard.style.opacity = '1';
                registerCard.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }
    }

    navigateToLogin() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.transition = 'all 0.5s ease';
            container.style.transform = 'translateX(-100%)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        }
    }

    navigateToWelcome() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.transition = 'all 0.5s ease';
            container.style.transform = 'scale(1.1)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'babyshower.html';
            }, 500);
        }
    }
}