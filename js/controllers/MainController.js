class MainController {
    constructor() {
        this.userModel = new User();
        this.welcomeView = new WelcomeView();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const enterBtn = document.getElementById('enterBtn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                this.navigateToLogin();
            });
        }

        // Efecto de teclado para navegación rápida
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.navigateToLogin();
            }
        });
    }

    navigateToLogin() {
        // Efecto de transición antes de navegar
        const container = document.querySelector('.container');
        if (container) {
            container.style.transition = 'all 0.5s ease';
            container.style.transform = 'scale(0.8)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        } else {
            window.location.href = 'login.html';
        }
    }

    showWelcomeAnimation() {
        this.welcomeView.showWelcomeMessage();
        
        // Agregar efecto de aparición gradual
        const elements = document.querySelectorAll('.welcome-card > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}