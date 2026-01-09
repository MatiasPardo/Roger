// Inicialización de la aplicación de login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (localStorage.getItem('authenticated') === 'true') {
        showAlreadyAuthenticatedMessage();
        return;
    }
    
    // Inicializar controlador de login
    const loginController = new LoginController();
    
    // Agregar efectos adicionales específicos del login
    initializeLoginEffects();
    setupAdvancedFeatures();
});

function showAlreadyAuthenticatedMessage() {
    const username = localStorage.getItem('username');
    const container = document.querySelector('.container');
    
    if (container && username) {
        container.innerHTML = `
            <div class="login-card" style="text-align: center;">
                <div style="color: #00ff00; font-size: 2rem; margin-bottom: 20px;">✓</div>
                <h2 style="color: #00ffff; margin-bottom: 20px;">Ya estás autenticado</h2>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 30px;">
                    Bienvenido de vuelta, ${username}
                </p>
                <button onclick="goToHome()" class="login-btn">
                    <span>Ir al Inicio</span>
                </button>
                <button onclick="logout()" style="
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 0.7);
                    margin-top: 10px;
                " class="login-btn">
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

function initializeLoginEffects() {
    // Crear efecto de matriz en el fondo
    createMatrixEffect();
    
    // Agregar efecto de respiración a la tarjeta de login
    addBreathingEffect();
    
    // Crear efecto de escaneo biométrico
    createBiometricScanner();
}

function createMatrixEffect() {
    const matrix = document.createElement('canvas');
    matrix.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;
    
    document.body.appendChild(matrix);
    
    const ctx = matrix.getContext('2d');
    matrix.width = window.innerWidth;
    matrix.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = matrix.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrix.width, matrix.height);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrix.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

function addBreathingEffect() {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.animation = 'breathe 4s ease-in-out infinite';
        
        if (!document.querySelector('#breathe-animation')) {
            const style = document.createElement('style');
            style.id = 'breathe-animation';
            style.textContent = `
                @keyframes breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function createBiometricScanner() {
    const scanner = document.createElement('div');
    scanner.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border: 2px solid #00ffff;
        border-radius: 50%;
        background: rgba(0, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: scannerPulse 2s ease-in-out infinite;
        z-index: 1000;
    `;
    
    scanner.innerHTML = `
        <div style="
            width: 30px;
            height: 30px;
            border: 1px solid #00ffff;
            border-radius: 50%;
            position: relative;
        ">
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4px;
                height: 4px;
                background: #00ffff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: scannerDot 1s ease-in-out infinite;
            "></div>
        </div>
    `;
    
    document.body.appendChild(scanner);
    
    if (!document.querySelector('#scanner-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'scanner-pulse-animation';
        style.textContent = `
            @keyframes scannerPulse {
                0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
                50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6); }
            }
            @keyframes scannerDot {
                0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.5); }
            }
        `;
        document.head.appendChild(style);
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
    
    // Detectar caps lock
    document.addEventListener('keydown', (e) => {
        if (e.getModifierState && e.getModifierState('CapsLock')) {
            showCapsLockWarning();
        }
    });
    
    // Contador de intentos fallidos
    setupFailedAttemptsCounter();
}

function showCapsLockWarning() {
    let warning = document.getElementById('caps-warning');
    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'caps-warning';
        warning.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 165, 0, 0.2);
            color: #ffa500;
            padding: 8px 16px;
            border-radius: 5px;
            border: 1px solid rgba(255, 165, 0, 0.3);
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            z-index: 1001;
            animation: slideDown 0.3s ease;
        `;
        warning.textContent = '⚠️ Caps Lock está activado';
        document.body.appendChild(warning);
        
        if (!document.querySelector('#slide-down-animation')) {
            const style = document.createElement('style');
            style.id = 'slide-down-animation';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); }
                    to { transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Remover warning después de 3 segundos
    setTimeout(() => {
        if (warning) {
            warning.remove();
        }
    }, 3000);
}

function setupFailedAttemptsCounter() {
    let failedAttempts = parseInt(localStorage.getItem('failedAttempts') || '0');
    
    // Mostrar advertencia si hay intentos fallidos previos
    if (failedAttempts > 0) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 0, 0, 0.2);
            color: #ff4444;
            padding: 10px 15px;
            border-radius: 5px;
            border: 1px solid rgba(255, 0, 0, 0.3);
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            z-index: 1000;
        `;
        warning.textContent = `⚠️ Intentos fallidos: ${failedAttempts}`;
        document.body.appendChild(warning);
        
        setTimeout(() => warning.remove(), 5000);
    }
    
    // Escuchar eventos de login fallido
    document.addEventListener('loginFailed', () => {
        failedAttempts++;
        localStorage.setItem('failedAttempts', failedAttempts.toString());
        
        if (failedAttempts >= 3) {
            showSecurityWarning();
        }
    });
    
    // Limpiar contador en login exitoso
    document.addEventListener('loginSuccess', () => {
        localStorage.removeItem('failedAttempts');
    });
}

function showSecurityWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        z-index: 2000;
        font-family: 'Orbitron', monospace;
        border: 2px solid #ff0000;
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
    `;
    
    warning.innerHTML = `
        <h3>🚨 ALERTA DE SEGURIDAD</h3>
        <p>Múltiples intentos de acceso fallidos detectados.</p>
        <p>Si no eres el usuario autorizado, por favor abandona esta página.</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 15px;
            padding: 10px 20px;
            background: white;
            color: red;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
        ">Entendido</button>
    `;
    
    document.body.appendChild(warning);
}