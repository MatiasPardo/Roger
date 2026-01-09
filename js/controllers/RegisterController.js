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

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.navigateToLogin();
            }
        });

        this.showEntryAnimation();
    }

    async handleRegister() {
        const formData = this.getFormData();
        
        this.registerView.clearMessage();

        if (!this.validateForm(formData)) {
            return;
        }

        this.registerView.showLoadingState();

        try {
            const result = await this.userModel.register(formData);
            
            if (result.success) {
                this.handleSuccessfulRegister(result);
            } else {
                this.handleFailedRegister(result.message);
            }
        } catch (error) {
            console.error('Error en registro:', error);
            this.handleFailedRegister('Error de conexión con el servidor');
        }
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
            fullName: `${result.user.firstName} ${result.user.lastName}`,
            firstName: result.user.firstName,
            lastName: result.user.lastName
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