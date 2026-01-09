class GlobalUserWidget {
    constructor() {
        this.sessionManager = new SessionManager();
        this.createWidget();
        this.setupEventListeners();
        this.startTimer();
    }

    createWidget() {
        // Solo crear si el usuario está autenticado
        if (!this.sessionManager.checkSessionValidity()) {
            return;
        }

        const widget = document.createElement('div');
        widget.id = 'globalUserWidget';
        widget.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            font-family: 'Orbitron', monospace;
        `;

        const userInfo = document.createElement('div');
        userInfo.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 12px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            font-size: 0.8rem;
        `;

        const username = localStorage.getItem('username');
        const welcomeText = document.createElement('span');
        welcomeText.id = 'globalWelcomeText';
        welcomeText.textContent = `${username}`;
        welcomeText.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.8rem;
        `;

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'globalLogoutBtn';
        logoutBtn.textContent = 'Salir';
        logoutBtn.style.cssText = `
            background: linear-gradient(45deg, #ff4444, #cc0000);
            border: none;
            padding: 6px 10px;
            border-radius: 12px;
            color: white;
            font-family: 'Orbitron', monospace;
            font-size: 0.7rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        const sessionTimer = document.createElement('div');
        sessionTimer.id = 'globalSessionTimer';
        sessionTimer.style.cssText = `
            background: rgba(255, 215, 0, 0.2);
            color: #ffd700;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 0.7rem;
            border: 1px solid rgba(255, 215, 0, 0.3);
        `;

        userInfo.appendChild(welcomeText);
        userInfo.appendChild(logoutBtn);
        widget.appendChild(userInfo);
        widget.appendChild(sessionTimer);

        document.body.appendChild(widget);

        // Agregar media query para móviles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 480px) {
                #globalUserWidget {
                    top: 5px !important;
                    right: 5px !important;
                    gap: 5px !important;
                }
                #globalUserWidget > div {
                    padding: 6px 8px !important;
                    gap: 8px !important;
                    font-size: 0.7rem !important;
                }
                #globalWelcomeText {
                    font-size: 0.7rem !important;
                }
                #globalLogoutBtn {
                    padding: 4px 8px !important;
                    font-size: 0.6rem !important;
                }
                #globalSessionTimer {
                    font-size: 0.6rem !important;
                    padding: 3px 6px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('globalLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });

            logoutBtn.addEventListener('mouseenter', () => {
                logoutBtn.style.transform = 'translateY(-2px)';
                logoutBtn.style.boxShadow = '0 5px 15px rgba(255, 68, 68, 0.4)';
            });

            logoutBtn.addEventListener('mouseleave', () => {
                logoutBtn.style.transform = 'translateY(0)';
                logoutBtn.style.boxShadow = 'none';
            });
        }
    }

    startTimer() {
        this.updateTimer();
        // Actualizar cada minuto
        setInterval(() => {
            this.updateTimer();
        }, 60000);
    }

    updateTimer() {
        const timerElement = document.getElementById('globalSessionTimer');
        if (timerElement && this.sessionManager.checkSessionValidity()) {
            const remaining = this.sessionManager.formatRemainingTime();
            timerElement.textContent = `Sesión: ${remaining}`;
        }
    }

    handleLogout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            this.sessionManager.logout();
        }
    }

    static init() {
        // Solo inicializar si hay una sesión válida
        const sessionManager = new SessionManager();
        if (sessionManager.checkSessionValidity()) {
            new GlobalUserWidget();
        }
    }
}