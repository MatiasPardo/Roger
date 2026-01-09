class User {
    constructor() {
        this.storageKey = 'registeredUsers';
        this.loadUsers();
    }

    loadUsers() {
        const stored = localStorage.getItem(this.storageKey);
        this.users = stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));
        this.saveToFile();
    }

    saveToFile() {
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
        
        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `usuarios_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

    register(userData) {
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
        this.saveUsers();
        
        return { success: true, message: 'Usuario registrado exitosamente', user: newUser };
    }

    authenticate(email, password) {
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