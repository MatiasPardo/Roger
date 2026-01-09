// Inicialización de la aplicación del baby shower
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación antes de mostrar contenido
    if (localStorage.getItem('authenticated') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializar controlador del baby shower
    const babyShowerController = new BabyShowerController();
    
    // Agregar efectos adicionales específicos del baby shower
    initializeBabyShowerEffects();
    setupWelcomeAnimation();
});

function initializeBabyShowerEffects() {
    // Crear efecto de corazones flotantes en el fondo
    createFloatingHearts();
    
    // Agregar efecto de brillo a los elementos principales
    addShimmerEffect();
    
    // Crear efecto de ondas suaves
    createGentleWaves();
}

function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -2;
    `;
    document.body.appendChild(heartsContainer);

    setInterval(() => {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 15 + 10}px;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: gentleFloat 8s linear forwards;
            opacity: 0.3;
        `;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 2000);

    if (!document.querySelector('#gentle-float-animation')) {
        const style = document.createElement('style');
        style.id = 'gentle-float-animation';
        style.textContent = `
            @keyframes gentleFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.3;
                }
                50% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-100vh) rotate(180deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addShimmerEffect() {
    const titles = document.querySelectorAll('.baby-main-title, .event-date, .confirmation-title');
    
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.animation += ', shimmer 1s ease-in-out';
        });
    });

    if (!document.querySelector('#shimmer-animation')) {
        const style = document.createElement('style');
        style.id = 'shimmer-animation';
        style.textContent = `
            @keyframes shimmer {
                0% { filter: brightness(1); }
                50% { filter: brightness(1.3) saturate(1.2); }
                100% { filter: brightness(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createGentleWaves() {
    const waves = document.createElement('div');
    waves.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -3;
        background: 
            radial-gradient(circle at 30% 70%, rgba(255, 105, 180, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%);
        animation: gentleWaveMove 15s ease-in-out infinite;
    `;
    
    document.body.appendChild(waves);
    
    if (!document.querySelector('#gentle-wave-animation')) {
        const style = document.createElement('style');
        style.id = 'gentle-wave-animation';
        style.textContent = `
            @keyframes gentleWaveMove {
                0%, 100% { 
                    transform: scale(1) rotate(0deg);
                    opacity: 0.7;
                }
                33% { 
                    transform: scale(1.1) rotate(120deg);
                    opacity: 0.5;
                }
                66% { 
                    transform: scale(0.9) rotate(240deg);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupWelcomeAnimation() {
    // Animación de entrada secuencial
    setTimeout(() => {
        const babyTitle = document.querySelector('.baby-title');
        if (babyTitle) {
            babyTitle.style.opacity = '0';
            babyTitle.style.transform = 'translateY(-30px)';
            babyTitle.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                babyTitle.style.opacity = '1';
                babyTitle.style.transform = 'translateY(0)';
            }, 200);
        }
    }, 500);

    setTimeout(() => {
        const mainTitle = document.querySelector('.baby-main-title');
        if (mainTitle) {
            mainTitle.style.opacity = '0';
            mainTitle.style.transform = 'scale(0.8)';
            mainTitle.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                mainTitle.style.opacity = '1';
                mainTitle.style.transform = 'scale(1)';
            }, 300);
        }
    }, 800);

    setTimeout(() => {
        const babyName = document.querySelector('.baby-name');
        if (babyName) {
            babyName.style.opacity = '0';
            babyName.style.transform = 'translateX(-50px)';
            babyName.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                babyName.style.opacity = '1';
                babyName.style.transform = 'translateX(0)';
            }, 400);
        }
    }, 1200);

    setTimeout(() => {
        const message = document.querySelector('.baby-message');
        if (message) {
            message.style.opacity = '0';
            message.style.transform = 'translateY(30px)';
            message.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, 500);
        }
    }, 1600);

    // Mostrar indicador de scroll al final
    setTimeout(() => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateY(20px)';
            scrollIndicator.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateY(0)';
            }, 600);
        }
    }, 2200);
}

// Funciones de utilidad para navegación
function scrollToSection(sectionClass) {
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Atajos de teclado adicionales
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '1':
            scrollToSection('welcome-section');
            break;
        case '2':
            scrollToSection('event-section');
            break;
        case '3':
            scrollToSection('confirmation-section');
            break;
        case 'Home':
            scrollToSection('welcome-section');
            break;
        case 'End':
            scrollToSection('confirmation-section');
            break;
    }
});

// Mensaje de bienvenida personalizado
function showPersonalizedWelcome() {
    const username = localStorage.getItem('username');
    if (username) {
        const welcomeToast = document.createElement('div');
        welcomeToast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 105, 180, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4s forwards;
            box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
        `;
        welcomeToast.textContent = `¡Hola ${username}! 👶💖`;
        
        document.body.appendChild(welcomeToast);
        
        if (!document.querySelector('#slide-in-right-animation')) {
            const style = document.createElement('style');
            style.id = 'slide-in-right-animation';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            welcomeToast.remove();
        }, 5000);
    }
}

// Mostrar bienvenida personalizada después de la carga
setTimeout(showPersonalizedWelcome, 3000);