class User {
    constructor() {
        // Ya no almacenamos usuarios en localStorage
    }

    validatePassword(password) {
        if (password.length < 8) return { valid: false, message: 'Mínimo 8 caracteres' };
        if (!/[a-zA-Z]/.test(password)) return { valid: false, message: 'Debe contener letras' };
        if (!/[0-9]/.test(password)) return { valid: false, message: 'Debe contener números' };
        return { valid: true, message: 'Contraseña válida' };
    }

    getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'weak';
        if (strength <= 3) return 'medium';
        return 'strong';
    }

    async register(userData) {
        try {
            const response = await fetch('https://pardos.com.ar/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                return { success: true, message: 'Usuario registrado exitosamente', user: result.user };
            } else {
                return { success: false, message: result.error };
            }
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }

    async authenticate(email, password) {
        try {
            const response = await fetch('https://pardos.com.ar/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                return { success: true, user: result.user };
            } else {
                return { success: false, message: result.error };
            }
        } catch (error) {
            console.error('Error en autenticación:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }
}