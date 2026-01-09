class User {
    constructor() {
        this.storageKey = 'registeredUsers';
        this.loadUsers();
    }

    loadUsers() {
        const stored = localStorage.getItem(this.storageKey);
        this.users = stored ? JSON.parse(stored) : [];
    }

    async saveUsers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));
        await this.saveToFile();
    }

    async saveToFile() {
        const userData = {
            timestamp: new Date().toISOString(),
            users: this.users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                birthDate: user.birthDate,
                registrationDate: user.registrationDate
            }))
        };
        
        try {
            await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } catch (error) {
            console.error('Error guardando archivo:', error);
        }
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
        if (this.emailExists(userData.email)) {
            return { success: false, message: 'Este email ya está registrado' };
        }
        
        const passwordValidation = this.validatePassword(userData.password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.message };
        }
        
        const newUser = {
            ...userData,
            registrationDate: new Date().toISOString(),
            id: Date.now().toString()
        };
        
        this.users.push(newUser);
        await this.saveUsers();
        
        return { success: true, message: 'Usuario registrado exitosamente', user: newUser };
    }

    authenticate(email, password) {
        // Verificar si es admin
        if (email.toLowerCase() === 'admin' && password === 'adminRoger1234') {
            return { 
                success: true, 
                user: { 
                    email: 'admin', 
                    username: 'admin', 
                    firstName: 'Admin', 
                    lastName: 'System',
                    isAdmin: true 
                } 
            };
        }
        
        // Autenticación normal
        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        return user ? { success: true, user: user } : { success: false };
    }

    emailExists(email) {
        return this.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    }

    getUserData(email) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
}