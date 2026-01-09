// Inicialización de la aplicación principal
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (localStorage.getItem('authenticated') === 'true') {
        showAuthenticatedMessage();
    }
    
    // Inicializar controlador principal
    const mainController = new MainController();
    
    // Mostrar animación de bienvenida
    setTimeout(() => {
        mainController.showWelcomeAnimation();
    }, 500);
    
    // Agregar efectos adicionales
    initializeBackgroundEffects();
    setupKeyboardShortcuts();
});

function showAuthenticatedMessage() {
    const username = localStorage.getItem('username');
    if (username) {
        // Crear mensaje de bienvenida para usuario autenticado
        const welcomeMsg = document.createElement('div');
        welcomeMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 0, 0.2);
            color: #00ff00;
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid rgba(0, 255, 0, 0.3);
            font-family: 'Orbitron', monospace;
            z-index: 1000;
            animation: slideIn 0.5s ease;
        `;
        welcomeMsg.textContent = `Bienvenido de vuelta, ${username}`;
        
        document.body.appendChild(welcomeMsg);
        
        // Agregar animación
        if (!document.querySelector('#slide-animation')) {
            const style = document.createElement('style');
            style.id = 'slide-animation';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            welcomeMsg.style.animation = 'slideIn 0.5s ease reverse';
            setTimeout(() => welcomeMsg.remove(), 500);
        }, 5000);
    }
}

function initializeBackgroundEffects() {
    // Crear efecto de ondas en el fondo
    createWaveEffect();
    
    // Agregar efecto de mouse hover en el fondo
    document.addEventListener('mousemove', (e) => {
        createMouseTrail(e.clientX, e.clientY);
    });
}

function createWaveEffect() {
    const waves = document.createElement('div');
    waves.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        background: 
            radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
        animation: waveMove 10s ease-in-out infinite;
    `;
    
    document.body.appendChild(waves);
    
    if (!document.querySelector('#wave-animation')) {
        const style = document.createElement('style');
        style.id = 'wave-animation';
        style.textContent = `
            @keyframes waveMove {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(180deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createMouseTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(0, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    if (!document.querySelector('#trail-animation')) {
        const style = document.createElement('style');
        style.id = 'trail-animation';
        style.textContent = `
            @keyframes trailFade {
                to {
                    transform: scale(3);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => trail.remove(), 1000);
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Mostrar ayuda con F1
        if (e.key === 'F1') {
            e.preventDefault();
            showHelpModal();
        }
        
        // Limpiar sesión con Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            localStorage.clear();
            location.reload();
        }
    });
}

function showHelpModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 30px;
            color: white;
            font-family: 'Orbitron', monospace;
            max-width: 400px;
            text-align: center;
        ">
            <h3 style="color: #00ffff; margin-bottom: 20px;">Atajos de Teclado</h3>
            <p><strong>Ctrl + Enter:</strong> Acceder al login</p>
            <p><strong>F1:</strong> Mostrar esta ayuda</p>
            <p><strong>Ctrl + Shift + C:</strong> Limpiar sesión</p>
            <p><strong>Escape:</strong> Cerrar modal</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #00ffff;
                border: none;
                border-radius: 5px;
                color: black;
                font-weight: bold;
                cursor: pointer;
            ">Cerrar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar con Escape
    const closeModal = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeModal);
        }
    };
    document.addEventListener('keydown', closeModal);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}