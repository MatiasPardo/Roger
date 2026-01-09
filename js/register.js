// Inicialización de la aplicación de registro
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (localStorage.getItem('authenticated') === 'true') {
        showAlreadyAuthenticatedMessage();
        return;
    }
    
    // Inicializar controlador de registro
    const registerController = new RegisterController();
    
    // Agregar efectos adicionales específicos del registro
    initializeRegisterEffects();
    setupAdvancedFeatures();
});

function showAlreadyAuthenticatedMessage() {
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('userFullName');
    const container = document.querySelector('.container');
    
    if (container && username) {
        container.innerHTML = `
            <div class="register-card" style="text-align: center;">
                <div style="color: #00ff00; font-size: 2rem; margin-bottom: 20px;">✓</div>
                <h2 style="color: #ff00ff; margin-bottom: 20px;">Ya estás registrado</h2>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 30px;">
                    Bienvenido de vuelta, ${fullName || username}
                </p>
                <button onclick="goToHome()" class="register-btn">
                    <span>Ir al Inicio</span>
                </button>
                <button onclick="logout()" style="
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 0.7);
                    margin-top: 10px;
                " class="register-btn">
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        `;
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

function logout() {
    localStorage.clear();
    location.reload();
}

function initializeRegisterEffects() {
    // Crear efecto de partículas de registro
    createRegistrationParticles();
    
    // Agregar efecto de respiración a la tarjeta
    addCardBreathing();
    
    // Crear indicador de progreso de registro
    createProgressIndicator();
}

function createRegistrationParticles() {
    const particles = document.createElement('canvas');
    particles.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    
    document.body.appendChild(particles);
    
    const ctx = particles.getContext('2d');
    particles.width = window.innerWidth;
    particles.height = window.innerHeight;
    
    const particleArray = [];
    const numberOfParticles = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * particles.width;
            this.y = Math.random() * particles.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 60 + 280}, 100%, 50%)`; // Colores púrpura/magenta
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > particles.width) this.x = 0;
            if (this.x < 0) this.x = particles.width;
            if (this.y > particles.height) this.y = 0;
            if (this.y < 0) this.y = particles.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < numberOfParticles; i++) {
        particleArray.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, particles.width, particles.height);
        
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
            particleArray[i].draw();
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

function addCardBreathing() {
    const registerCard = document.querySelector('.register-card');
    if (registerCard) {
        registerCard.style.animation = 'breathe 4s ease-in-out infinite';
    }
}

function createProgressIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'progress-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 200px;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        z-index: 1000;
    `;
    
    const progress = document.createElement('div');
    progress.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #ff00ff, #8000ff);
        border-radius: 3px;
        transition: width 0.3s ease;
    `;
    
    indicator.appendChild(progress);
    document.body.appendChild(indicator);
    
    // Actualizar progreso basado en campos completados
    const inputs = document.querySelectorAll('#registerForm input');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
    });
    
    function updateProgress() {
        const totalFields = inputs.length;
        let completedFields = 0;
        
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                completedFields++;
            }
        });
        
        const percentage = (completedFields / totalFields) * 100;
        progress.style.width = percentage + '%';
        
        if (percentage === 100) {
            progress.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.6)';
        }
    }
}

function setupAdvancedFeatures() {
    // Auto-focus en el primer input
    setTimeout(() => {
        const firstInput = document.getElementById('username');
        if (firstInput) {
            firstInput.focus();
        }
    }, 1000);
    
    // Validación de edad en tiempo real
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        birthDateInput.addEventListener('change', validateAge);
    }
    
    // Sugerencias de contraseña
    setupPasswordSuggestions();
    
    // Autocompletado inteligente
    setupSmartAutocomplete();
}

function validateAge() {
    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) return;
    
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    
    const ageIndicator = document.getElementById('age-indicator') || document.createElement('div');
    ageIndicator.id = 'age-indicator';
    ageIndicator.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 10px;
        font-family: 'Orbitron', monospace;
        font-size: 0.9rem;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    if (age < 0 || age > 120) {
        ageIndicator.style.background = 'rgba(255, 0, 0, 0.2)';
        ageIndicator.style.color = '#ff4444';
        ageIndicator.style.border = '1px solid rgba(255, 0, 0, 0.3)';
        ageIndicator.textContent = '⚠️ Fecha inválida';
    } else {
        ageIndicator.style.background = 'rgba(0, 255, 0, 0.2)';
        ageIndicator.style.color = '#00ff00';
        ageIndicator.style.border = '1px solid rgba(0, 255, 0, 0.3)';
        ageIndicator.textContent = `✓ ${age} años`;
    }
    
    if (!document.getElementById('age-indicator')) {
        document.body.appendChild(ageIndicator);
    }
    
    setTimeout(() => {
        if (ageIndicator.parentElement) {
            ageIndicator.remove();
        }
    }, 3000);
}

function setupPasswordSuggestions() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('focus', () => {
        showPasswordTips();
    });
    
    passwordInput.addEventListener('blur', () => {
        hidePasswordTips();
    });
}

function showPasswordTips() {
    const tips = document.getElementById('password-tips') || document.createElement('div');
    tips.id = 'password-tips';
    tips.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 0, 255, 0.3);
        border-radius: 10px;
        padding: 15px;
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Orbitron', monospace;
        font-size: 0.8rem;
        z-index: 1001;
        max-width: 250px;
        animation: slideUp 0.3s ease;
    `;
    
    tips.innerHTML = `
        <h4 style="color: #ff00ff; margin-bottom: 10px;">💡 Consejos de Contraseña:</h4>
        <ul style="margin: 0; padding-left: 15px;">
            <li>Mínimo 8 caracteres</li>
            <li>Incluye letras y números</li>
            <li>Usa mayúsculas y minúsculas</li>
            <li>Agrega símbolos especiales</li>
        </ul>
    `;
    
    if (!document.getElementById('password-tips')) {
        document.body.appendChild(tips);
        
        if (!document.querySelector('#slide-up-animation')) {
            const style = document.createElement('style');
            style.id = 'slide-up-animation';
            style.textContent = `
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function hidePasswordTips() {
    const tips = document.getElementById('password-tips');
    if (tips) {
        tips.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => tips.remove(), 300);
    }
}

function setupSmartAutocomplete() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    
    if (firstNameInput && lastNameInput) {
        firstNameInput.addEventListener('input', () => {
            if (firstNameInput.value.length > 2) {
                suggestUsername();
            }
        });
        
        lastNameInput.addEventListener('input', () => {
            if (lastNameInput.value.length > 2) {
                suggestUsername();
            }
        });
    }
}

function suggestUsername() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const usernameInput = document.getElementById('username');
    
    if (firstName && lastName && !usernameInput.value) {
        const suggestion = (firstName.toLowerCase() + lastName.toLowerCase().charAt(0)).replace(/\s/g, '');
        
        const suggestionDiv = document.getElementById('username-suggestion') || document.createElement('div');
        suggestionDiv.id = 'username-suggestion';
        suggestionDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 5px;
            padding: 8px 12px;
            color: #00ffff;
            font-size: 0.9rem;
            cursor: pointer;
            z-index: 100;
            margin-top: 5px;
        `;
        suggestionDiv.textContent = `💡 Sugerencia: ${suggestion}`;
        
        suggestionDiv.onclick = () => {
            usernameInput.value = suggestion;
            usernameInput.dispatchEvent(new Event('input'));
            suggestionDiv.remove();
        };
        
        const usernameGroup = usernameInput.parentElement;
        const existingSuggestion = usernameGroup.querySelector('#username-suggestion');
        if (existingSuggestion) existingSuggestion.remove();
        
        usernameGroup.appendChild(suggestionDiv);
        
        setTimeout(() => {
            if (suggestionDiv.parentElement) {
                suggestionDiv.remove();
            }
        }, 5000);
    }
}