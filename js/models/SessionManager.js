class SessionManager {
    constructor() {
        this.sessionDuration = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
        this.checkSessionValidity();
    }

    createSession(userData) {
        const sessionId = this.generateSessionId();
        const sessionData = {
            sessionId: sessionId,
            userData: userData,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionDuration).toISOString(),
            lastActivity: new Date().toISOString()
        };

        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userFullName', userData.fullName);

        console.log('Sesión creada:', sessionId);
        this.startSessionTimer();
        return sessionId;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    isSessionValid() {
        const sessionData = this.getSessionData();
        if (!sessionData) return false;

        const now = new Date();
        const expiresAt = new Date(sessionData.expiresAt);
        
        if (now > expiresAt) {
            this.destroySession();
            return false;
        }

        // Actualizar última actividad
        this.updateLastActivity();
        return true;
    }

    getSessionData() {
        const stored = localStorage.getItem('sessionData');
        return stored ? JSON.parse(stored) : null;
    }

    updateLastActivity() {
        const sessionData = this.getSessionData();
        if (sessionData) {
            sessionData.lastActivity = new Date().toISOString();
            localStorage.setItem('sessionData', JSON.stringify(sessionData));
        }
    }

    checkSessionValidity() {
        if (!this.isSessionValid()) {
            this.destroySession();
            return false;
        }
        return true;
    }

    destroySession() {
        localStorage.removeItem('sessionData');
        localStorage.removeItem('authenticated');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userFullName');
        console.log('Sesión destruida');
    }

    logout() {
        this.destroySession();
        window.location.href = 'index.html';
    }

    startSessionTimer() {
        // Verificar sesión cada 5 minutos
        setInterval(() => {
            if (!this.isSessionValid()) {
                alert('Tu sesión ha expirado. Serás redirigido al inicio.');
                this.logout();
            }
        }, 5 * 60 * 1000);
    }

    getRemainingTime() {
        const sessionData = this.getSessionData();
        if (!sessionData) return 0;

        const now = new Date();
        const expiresAt = new Date(sessionData.expiresAt);
        return Math.max(0, expiresAt - now);
    }

    formatRemainingTime() {
        const remaining = this.getRemainingTime();
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }
}