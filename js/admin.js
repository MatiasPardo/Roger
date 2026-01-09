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
        const messageDiv = document.getElementById('adminMessage');

        if (!username || !password) {
            this.showMessage('Completa todos los campos', 'error');
            return;
        }

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('isAdmin', 'true');
                this.showMessage('Acceso autorizado', 'success');
                setTimeout(() => {
                    this.showAdminPanel();
                }, 1000);
            } else {
                this.showMessage('Credenciales incorrectas', 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
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
        await this.loadAttendanceData();
        await this.loadGiftsData();
    }

    async loadAttendanceData() {
        try {
            // Cargar confirmaciones
            const attendanceResponse = await fetch('/api/attendance');
            const attendanceData = await attendanceResponse.json();

            // Cargar usuarios registrados
            const usersResponse = await fetch('/api/users');
            let totalRegistered = 0;
            
            // Si no hay endpoint de usuarios, usar localStorage como fallback
            const storedUsers = localStorage.getItem('registeredUsers');
            if (storedUsers) {
                totalRegistered = JSON.parse(storedUsers).length;
            }

            // Actualizar estadísticas
            const totalConfirmed = attendanceData.confirmations.length;
            const totalPending = Math.max(0, totalRegistered - totalConfirmed);

            document.getElementById('totalConfirmed').textContent = totalConfirmed;
            document.getElementById('totalRegistered').textContent = totalRegistered;
            document.getElementById('totalPending').textContent = totalPending;

            // Actualizar tabla
            this.updateAttendanceTable(attendanceData.confirmations);

        } catch (error) {
            console.error('Error cargando datos de asistencia:', error);
        }
    }

    async loadGiftsData() {
        try {
            const response = await fetch('/api/gifts');
            const giftData = await response.json();

            let totalGifts = 0;
            let reservedGifts = 0;
            const allGifts = [];

            // Procesar todas las categorías
            for (const [category, gifts] of Object.entries(giftData.gifts)) {
                gifts.forEach(gift => {
                    totalGifts++;
                    if (gift.reserved) reservedGifts++;
                    allGifts.push({ ...gift, category });
                });
            }

            const availableGifts = totalGifts - reservedGifts;

            // Actualizar estadísticas
            document.getElementById('totalGifts').textContent = totalGifts;
            document.getElementById('reservedGifts').textContent = reservedGifts;
            document.getElementById('availableGifts').textContent = availableGifts;

            // Actualizar tabla
            this.updateGiftsTable(allGifts);

        } catch (error) {
            console.error('Error cargando datos de regalos:', error);
        }
    }

    updateAttendanceTable(confirmations) {
        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = '';

        confirmations.forEach(confirmation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${confirmation.fullName || 'N/A'}</td>
                <td>${confirmation.username}</td>
                <td>${confirmation.email}</td>
                <td>${new Date(confirmation.confirmationDate).toLocaleString('es-ES')}</td>
                <td><span class="confirmed">✓ Confirmado</span></td>
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

        gifts.forEach(gift => {
            const row = document.createElement('tr');
            const categoryName = categoryNames[gift.category] || gift.category;
            
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
            `;
            tbody.appendChild(row);
        });
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
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});