class LoginController {
    constructor() {
        this.userModel = new User();
        this.loginView = new LoginView();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.navigateBack();
            }
        });

        // Efecto de entrada
        this.showEntryAnimation();
    }

    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        this.loginView.clearMessage();

        if (!email || !password) {
            this.loginView.showMessage('Por favor completa todos los campos', 'error');
            this.shakeForm();
            return;
        }

        // Mostrar estado de carga
        this.showLoadingState();

        try {
            const result = await this.userModel.authenticate(email, password);
            
            if (result.success) {
                this.handleSuccessfulLogin(result.user);
            } else {
                this.handleFailedLogin(result.message);
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.handleFailedLogin('Error de conexión');
        } finally {
            this.hideLoadingState();
        }
    }

    handleSuccessfulLogin(user) {
        if (user.isAdmin) {
            this.loginView.showMessage('Acceso de administrador autorizado', 'success');
            
            // Crear sesión de admin
            const sessionManager = new SessionManager();
            sessionManager.createSession({
                username: user.username,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin
            });
            
            // Marcar como admin en localStorage
            localStorage.setItem('isAdmin', 'true');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            return;
        }
        
        this.loginView.showMessage(`¡Bienvenido ${user.username}! Asistencia confirmada`, 'success');
        
        // Efecto de éxito
        this.showSuccessAnimation();
        
        // Crear sesión con SessionManager
        const sessionManager = new SessionManager();
        sessionManager.createSession({
            username: user.username,
            email: user.email,
            fullName: user.fullName || `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        });
        
        console.log('Datos guardados en localStorage:');
        console.log('userEmail:', user.email);
        console.log('username:', user.username);
        
        // Redirigir después de mostrar el mensaje
        setTimeout(() => {
            this.navigateToConfirmation();
        }, 2000);
    }

    handleFailedLogin(message = 'Credenciales incorrectas. Verifica tu información.') {
        this.loginView.showMessage(message, 'error');
        this.shakeForm();
        this.clearForm();
    }

    shakeForm() {
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.style.animation = 'shake 0.5s ease-in-out';
            
            if (!document.querySelector('#shake-animation')) {
                const style = document.createElement('style');
                style.id = 'shake-animation';
                style.textContent = `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-10px); }
                        75% { transform: translateX(10px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                loginCard.style.animation = '';
            }, 500);
        }
    }

    showSuccessAnimation() {
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            // Cambiar el borde a verde
            loginCard.style.borderColor = '#00ff00';
            loginCard.style.boxShadow = '0 20px 40px rgba(0, 255, 0, 0.3)';
            
            // Crear efecto de partículas de éxito
            this.createSuccessParticles();
        }
    }

    createSuccessParticles() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: #00ff00;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    animation: successParticle 2s ease-out forwards;
                    box-shadow: 0 0 10px #00ff00;
                `;
                
                container.appendChild(particle);
                
                if (!document.querySelector('#success-particle-animation')) {
                    const style = document.createElement('style');
                    style.id = 'success-particle-animation';
                    style.textContent = `
                        @keyframes successParticle {
                            to {
                                transform: translate(${(Math.random() - 0.5) * 400}px, ${(Math.random() - 0.5) * 400}px);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }, i * 50);
        }
    }

    clearForm() {
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        
        // Remover indicadores de validación
        document.querySelectorAll('.validation-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    showEntryAnimation() {
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.style.opacity = '0';
            loginCard.style.transform = 'translateY(50px) scale(0.9)';
            
            setTimeout(() => {
                loginCard.style.transition = 'all 0.6s ease';
                loginCard.style.opacity = '1';
                loginCard.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }
    }

    navigateBack() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.transition = 'all 0.5s ease';
            container.style.transform = 'translateX(-100%)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    }

    navigateToConfirmation() {
        // Por ahora redirige a la página principal, pero podrías crear una página de confirmación
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

    showLoadingState() {
        const button = document.querySelector('.login-btn');
        this.originalButtonText = button.innerHTML;
        
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
    }

    hideLoadingState() {
        const button = document.querySelector('.login-btn');
        if (this.originalButtonText) {
            button.innerHTML = this.originalButtonText;
        }
        button.disabled = false;
    }
}