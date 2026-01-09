class AdminPanel {
    constructor() {
        this.initializeEventListeners();
        this.checkAdminSession();
    }

    initializeEventListeners() {
        // Login admin
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }

        // Logout admin
        const logoutAdmin = document.getElementById('logoutAdmin');
        if (logoutAdmin) {
            logoutAdmin.addEventListener('click', () => {
                this.handleAdminLogout();
            });
        }

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Botones de agregar
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addGiftBtn') {
                this.showAddGiftModal();
            }
        });
    }

    checkAdminSession() {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            this.showAdminPanel();
        }
    }

    async handleAdminLogin() {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();

        if (!username || !password) {
            this.showMessage('Completa todos los campos', 'error');
            return;
        }

        // Verificar credenciales de admin directamente
        if (username === 'admin' && password === 'adminRoger1234') {
            localStorage.setItem('isAdmin', 'true');
            this.showMessage('Acceso autorizado', 'success');
            setTimeout(() => {
                this.showAdminPanel();
            }, 1000);
        } else {
            this.showMessage('Credenciales incorrectas', 'error');
        }
    }

    handleAdminLogout() {
        localStorage.removeItem('isAdmin');
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
    }

    showAdminPanel() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        this.loadAdminData();
    }

    switchTab(tabName) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        // Cargar datos específicos
        if (tabName === 'attendance') {
            this.loadAttendanceData();
        } else if (tabName === 'gifts') {
            this.loadGiftsData();
        }
    }

    async loadAdminData() {
        try {
            const response = await fetch('/api/admin/dashboard');
            const data = await response.json();
            
            this.updateAttendanceStats(data.users, data.confirmations);
            this.updateGiftsStats(data.gifts);
            this.updateAttendanceTable(data.users, data.confirmations);
            this.updateGiftsTable(data.gifts);
        } catch (error) {
            console.error('Error cargando datos del admin:', error);
        }
    }

    async loadAttendanceData() {
        await this.loadAdminData();
    }

    async loadGiftsData() {
        await this.loadAdminData();
    }

    updateAttendanceStats(users, confirmations) {
        const totalRegistered = users.length;
        const totalConfirmed = confirmations.length;
        const totalPending = totalRegistered - totalConfirmed;

        document.getElementById('totalConfirmed').textContent = totalConfirmed;
        document.getElementById('totalRegistered').textContent = totalRegistered;
        document.getElementById('totalPending').textContent = Math.max(0, totalPending);
    }

    updateGiftsStats(gifts) {
        let totalGifts = 0;
        let reservedGifts = 0;

        for (const category in gifts) {
            gifts[category].forEach(gift => {
                totalGifts++;
                if (gift.reserved) reservedGifts++;
            });
        }

        const availableGifts = totalGifts - reservedGifts;
        document.getElementById('totalGifts').textContent = totalGifts;
        document.getElementById('reservedGifts').textContent = reservedGifts;
        document.getElementById('availableGifts').textContent = availableGifts;
    }

    updateAttendanceTable(users, confirmations) {
        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = '';

        // Crear un mapa de confirmaciones por email
        const confirmationMap = {};
        confirmations.forEach(conf => {
            confirmationMap[conf.email] = conf;
        });

        // Mostrar todos los usuarios registrados
        users.forEach(user => {
            const row = document.createElement('tr');
            const confirmation = confirmationMap[user.email];
            
            let statusHtml, dateHtml;
            if (confirmation) {
                statusHtml = '<span class="confirmed">✓ Confirmado</span>';
                dateHtml = new Date(confirmation.confirmationDate).toLocaleString('es-ES');
            } else {
                statusHtml = '<span class="available">⏳ Pendiente</span>';
                dateHtml = '-';
            }

            row.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${dateHtml}</td>
                <td>${statusHtml}</td>
                <td>
                    <button onclick="adminPanel.resetPassword('${user.id}')" class="login-btn" style="margin: 2px; padding: 5px 10px; font-size: 12px;">🔄 Reset</button>
                    <button onclick="adminPanel.deleteUser('${user.id}')" class="login-btn" style="margin: 2px; padding: 5px 10px; font-size: 12px; background: #ff4444;">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateGiftsTable(gifts) {
        const tbody = document.getElementById('giftsTableBody');
        tbody.innerHTML = '';

        const categoryNames = {
            baby: 'Para el Bebé',
            mom: 'Para la Mamá',
            home: 'Para el Hogar'
        };

        for (const [category, giftList] of Object.entries(gifts)) {
            giftList.forEach(gift => {
                const row = document.createElement('tr');
                const categoryName = categoryNames[category] || category;
                
                let statusHtml, reservedByHtml, reservedDateHtml;
                
                if (gift.reserved) {
                    statusHtml = '<span class="reserved">🔒 Reservado</span>';
                    reservedByHtml = gift.reservedBy ? 
                        `${gift.reservedBy.fullName || gift.reservedBy.username} (${gift.reservedBy.email})` : 
                        'Desconocido';
                    reservedDateHtml = gift.reservedBy && gift.reservedBy.reservedDate ? 
                        new Date(gift.reservedBy.reservedDate).toLocaleString('es-ES') : 
                        'N/A';
                } else {
                    statusHtml = '<span class="available">🔓 Disponible</span>';
                    reservedByHtml = '-';
                    reservedDateHtml = '-';
                }

                row.innerHTML = `
                    <td>${categoryName}</td>
                    <td>${gift.name}</td>
                    <td>${statusHtml}</td>
                    <td>${reservedByHtml}</td>
                    <td>${reservedDateHtml}</td>
                    <td>
                        <button onclick="adminPanel.deleteGift(${gift.id})" class="login-btn" style="margin: 2px; padding: 5px 10px; font-size: 12px; background: #ff4444;">🗑️</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('adminMessage');
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }

    async deleteUser(userId) {
        console.log('Eliminando usuario con ID:', userId);
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
        
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.showMessage('Usuario eliminado', 'success');
                this.loadAdminData();
            } else {
                const error = await response.text();
                console.error('Error del servidor:', error);
                this.showMessage('Error al eliminar usuario', 'error');
            }
        } catch (error) {
            console.error('Error en deleteUser:', error);
            this.showMessage('Error al eliminar usuario', 'error');
        }
    }

    async resetPassword(userId) {
        if (!confirm('¿Resetear contraseña a "roger1234"?')) return;
        
        try {
            const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
                method: 'PUT'
            });
            
            if (response.ok) {
                this.showMessage('Contraseña reseteada a "roger1234"', 'success');
            } else {
                const error = await response.text();
                console.error('Error del servidor:', error);
                this.showMessage('Error al resetear contraseña', 'error');
            }
        } catch (error) {
            console.error('Error en resetPassword:', error);
            this.showMessage('Error al resetear contraseña', 'error');
        }
    }

    async deleteGift(giftId) {
        console.log('Eliminando regalo con ID:', giftId);
        if (!confirm('¿Estás seguro de eliminar este regalo?')) return;
        
        try {
            const response = await fetch(`/api/admin/gifts/${giftId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.showMessage('Regalo eliminado', 'success');
                this.loadAdminData();
            } else {
                const error = await response.text();
                console.error('Error del servidor:', error);
                this.showMessage('Error al eliminar regalo', 'error');
            }
        } catch (error) {
            console.error('Error en deleteGift:', error);
            this.showMessage('Error al eliminar regalo', 'error');
        }
    }

    showAddGiftModal() {
        const giftName = prompt('Nombre del regalo:');
        const category = prompt('Categoría (baby/mom/home):');
        
        if (giftName && category && ['baby', 'mom', 'home'].includes(category)) {
            this.addGift(category, giftName);
        } else {
            this.showMessage('Datos inválidos', 'error');
        }
    }

    async addGift(category, giftName) {
        try {
            const response = await fetch('/api/admin/gifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, giftName })
            });
            
            if (response.ok) {
                this.showMessage('Regalo agregado', 'success');
                this.loadAdminData();
            }
        } catch (error) {
            this.showMessage('Error al agregar regalo', 'error');
        }
    }
}

// Variable global para acceso desde botones
let adminPanel;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});