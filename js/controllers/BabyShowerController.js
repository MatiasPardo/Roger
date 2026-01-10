class BabyShowerController {
    constructor() {
        this.userModel = new User();
        this.giftListModel = new GiftList();
        this.sessionManager = new SessionManager();
        this.babyShowerView = new BabyShowerView();
        this.initializeApp();
    }

    async initializeApp() {
        await this.giftListModel.loadGifts();
        this.initializeEventListeners();
        this.checkUserAuthentication();
    }

    checkUserAuthentication() {
        if (!this.sessionManager.checkSessionValidity()) {
            alert('Tu sesión ha expirado. Serás redirigido al inicio.');
            this.sessionManager.destroySession();
            window.location.replace('index.html');
            return;
        }

        // Debug: verificar datos en localStorage
        console.log('Verificando autenticación:');
        console.log('authenticated:', localStorage.getItem('authenticated'));
        console.log('userEmail:', localStorage.getItem('userEmail'));
        console.log('username:', localStorage.getItem('username'));
        console.log('userFullName:', localStorage.getItem('userFullName'));

        // Mostrar información personalizada del usuario
        this.displayUserInfo();
    }

    displayUserInfo() {
        const username = localStorage.getItem('username');
        const userFullName = localStorage.getItem('userFullName');
        
        if (username) {
            // Personalizar el mensaje de bienvenida
            const babyMessage = document.querySelector('.baby-message');
            if (babyMessage && userFullName) {
                babyMessage.innerHTML = `
                    Hola <span class="highlight">${userFullName}</span>, sos uno de los invitados especiales a compartir un hermoso día con
                    <span class="highlight">Los papis de Roger</span>
                `;
            }
        }

        // Verificar si ya confirmó asistencia
        this.checkAttendanceStatus();
    }

    async checkAttendanceStatus() {
        const userEmail = localStorage.getItem('userEmail');
        
        try {
            const response = await fetch(`/api/attendance/check/${encodeURIComponent(userEmail)}`);
            if (response.ok) {
                const result = await response.json();
                if (result.confirmed) {
                    this.showAlreadyConfirmed();
                    this.showGiftListOption();
                }
            }
        } catch (error) {
            // Fallback a localStorage
            const confirmedAttendance = localStorage.getItem(`attendance_${userEmail}`);
            if (confirmedAttendance === 'true') {
                this.showAlreadyConfirmed();
                this.showGiftListOption();
            }
        }
    }

    showAlreadyConfirmed() {
        const confirmBtn = document.getElementById('confirmBtn');
        const messageDiv = document.getElementById('confirmationMessage');
        
        if (confirmBtn) {
            confirmBtn.innerHTML = '✓ YA CONFIRMASTE';
            confirmBtn.style.background = 'linear-gradient(45deg, #ffd700, #ffff00)';
            confirmBtn.style.color = '#000';
            confirmBtn.disabled = true;
        }
        
        if (messageDiv) {
            this.babyShowerView.showConfirmationMessage(
                '¡Gracias! Tu asistencia ya está confirmada. ¡Te esperamos!', 
                'confirmed'
            );
        }
    }

    initializeEventListeners() {
        // Debug: verificar si el botón existe
        console.log('Inicializando event listeners...');
        
        const confirmBtn = document.getElementById('confirmBtn');
        console.log('Botón encontrado:', confirmBtn);
        
        if (confirmBtn) {
            console.log('Agregando event listener al botón');
            confirmBtn.addEventListener('click', (e) => {
                console.log('Click en confirmar asistencia');
                e.preventDefault();
                this.handleAttendanceConfirmation();
            });
        } else {
            console.error('Botón confirmBtn no encontrado');
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGiftModal();
                this.navigateToHome();
            }
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleAttendanceConfirmation();
            }
        });

        // Event listeners para el modal de regalos
        const viewGiftsBtn = document.getElementById('viewGiftsBtn');
        if (viewGiftsBtn) {
            viewGiftsBtn.addEventListener('click', () => {
                this.openGiftModal();
            });
        }

        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeGiftModal();
            });
        }

        const addGiftBtn = document.getElementById('addGiftBtn');
        if (addGiftBtn) {
            addGiftBtn.addEventListener('click', () => {
                this.addNewGift();
            });
        }

        // Event listeners para logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Smooth scroll entre secciones
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        // Remover el event listener que bloquea el scroll normal
        // Solo mantener navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'PageDown' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.scrollToNextSection();
            }
            if (e.key === 'PageUp' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollToPreviousSection();
            }
        });
    }

    scrollToNextSection() {
        const sections = document.querySelectorAll('section');
        const currentSection = this.getCurrentSection();
        const targetSection = sections[Math.min(currentSection + 1, sections.length - 1)];
        
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    scrollToPreviousSection() {
        const sections = document.querySelectorAll('section');
        const currentSection = this.getCurrentSection();
        const targetSection = sections[Math.max(currentSection - 1, 0)];
        
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return i;
            }
        }
        return 0;
    }

    async handleAttendanceConfirmation() {
        console.log('Ejecutando handleAttendanceConfirmation');
        
        const userEmail = localStorage.getItem('userEmail');
        const username = localStorage.getItem('username');
        const userFullName = localStorage.getItem('userFullName');
        
        if (!userEmail) {
            alert('Error: Usuario no identificado');
            return;
        }

        try {
            const response = await fetch('/api/attendance/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInfo: {
                        email: userEmail,
                        username: username,
                        fullName: userFullName
                    }
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.processAttendanceConfirmation(userEmail, username);
            } else {
                const error = await response.json();
                if (error.error === 'Ya confirmaste tu asistencia') {
                    alert('Ya confirmaste tu asistencia anteriormente');
                    this.showAlreadyConfirmed();
                    this.showGiftListOption();
                } else {
                    throw new Error(error.error);
                }
            }
        } catch (error) {
            console.error('Error confirmando asistencia:', error);
            // Fallback a localStorage
            const alreadyConfirmed = localStorage.getItem(`attendance_${userEmail}`);
            if (alreadyConfirmed === 'true') {
                alert('Ya confirmaste tu asistencia anteriormente');
                return;
            }
            this.processAttendanceConfirmation(userEmail, username);
        }
    }

    processAttendanceConfirmation(userEmail, username) {
        console.log('Procesando confirmación para:', userEmail, username);
        
        // Guardar confirmación en localStorage
        localStorage.setItem(`attendance_${userEmail}`, 'true');
        localStorage.setItem(`attendance_date_${userEmail}`, new Date().toISOString());
        
        console.log('Confirmación guardada en localStorage');
        
        // Mostrar mensaje de éxito
        alert('¡Perfecto! Tu asistencia está confirmada. ¡Nos vemos el 17 de enero!');
        
        // Mostrar botón de lista de regalos
        setTimeout(() => {
            this.showAlreadyConfirmed();
            this.showGiftListOption();
        }, 1000);
    }

    downloadAttendanceConfirmation(record) {
        const confirmationData = {
            message: 'Confirmación de Asistencia - Baby Shower Roger Octavio Pardo',
            attendee: record,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(confirmationData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `confirmacion_${record.email.replace('@', '_')}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    navigateToHome() {
        const container = document.querySelector('.baby-shower-container');
        if (container) {
            container.style.transition = 'all 0.5s ease';
            container.style.transform = 'scale(0.8)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    }

    showEntryAnimation() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.8s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    showGiftListOption() {
        const giftListSection = document.getElementById('giftListSection');
        if (giftListSection) {
            giftListSection.style.display = 'block';
        }
    }

    openGiftModal() {
        const modal = document.getElementById('giftModal');
        if (modal) {
            modal.style.display = 'block';
            this.loadGiftList();
        }
    }

    closeGiftModal() {
        const modal = document.getElementById('giftModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    loadGiftList() {
        const categories = ['baby', 'mom', 'home'];
        const userEmail = localStorage.getItem('userEmail');
        const isAdmin = this.giftListModel.isAdmin(userEmail);
        
        categories.forEach(category => {
            const container = document.getElementById(`${category}Gifts`);
            if (container) {
                container.innerHTML = '';
                const gifts = this.giftListModel.getGiftsByCategory(category);
                
                gifts.forEach(gift => {
                    const giftElement = this.createGiftElement(gift, isAdmin);
                    container.appendChild(giftElement);
                });
            }
        });
    }

    createGiftElement(gift, isAdmin) {
        const giftDiv = document.createElement('div');
        giftDiv.className = `gift-item ${gift.reserved ? 'reserved' : ''}`;
        
        const giftName = document.createElement('span');
        giftName.className = 'gift-name';
        giftName.textContent = gift.name;
        
        const rightSection = document.createElement('div');
        rightSection.style.display = 'flex';
        rightSection.style.alignItems = 'center';
        rightSection.style.gap = '10px';
        
        const userEmail = localStorage.getItem('userEmail');
        const canEdit = gift.reserved && gift.reservedBy && gift.reservedBy.email === userEmail;
        
        if (gift.reserved) {
            const giftStatus = document.createElement('span');
            giftStatus.className = 'gift-status reserved';
            
            if (gift.reservedBy) {
                giftStatus.textContent = `Regala: ${gift.reservedBy.fullName || gift.reservedBy.username}`;
            } else {
                giftStatus.textContent = 'Reservado';
            }
            
            rightSection.appendChild(giftStatus);
            
            // Botón editar solo para el usuario que reservó
            if (canEdit) {
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = '✏️';
                editBtn.title = 'Editar regalo';
                editBtn.addEventListener('click', () => {
                    this.editGift(gift.id, gift.name);
                });
                rightSection.appendChild(editBtn);
            }
        } else {
            const giftStatus = document.createElement('span');
            giftStatus.className = 'gift-status available';
            giftStatus.textContent = 'Disponible';
            
            const reserveBtn = document.createElement('button');
            reserveBtn.className = 'reserve-btn';
            reserveBtn.textContent = 'Reservar';
            reserveBtn.addEventListener('click', () => {
                this.reserveGift(gift.id);
            });
            
            rightSection.appendChild(giftStatus);
            rightSection.appendChild(reserveBtn);
        }
        
        giftDiv.appendChild(giftName);
        giftDiv.appendChild(rightSection);
        
        return giftDiv;
    }

    async reserveGift(giftId) {
        const userInfo = {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('userEmail'),
            fullName: localStorage.getItem('userFullName')
        };
        
        const success = await this.giftListModel.reserveGift(giftId, userInfo);
        if (success) {
            // Recargar la lista para mostrar el cambio visual
            this.loadGiftList();
            
            // Mostrar mensaje de éxito
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 255, 0, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 3000;
                font-family: 'Orbitron', monospace;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3s forwards;
            `;
            successMsg.textContent = '¡Regalo reservado exitosamente! 🎁';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 4000);
        } else {
            // Mostrar mensaje de error
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 3000;
                font-family: 'Orbitron', monospace;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3s forwards;
            `;
            errorMsg.textContent = 'Error al reservar el regalo';
            document.body.appendChild(errorMsg);
            
            setTimeout(() => {
                errorMsg.remove();
            }, 4000);
        }
    }

    async addNewGift() {
        const category = document.getElementById('giftCategory').value;
        const giftName = document.getElementById('giftName').value.trim();
        
        if (!giftName) {
            alert('Por favor ingresa el nombre del regalo');
            return;
        }
        
        const userInfo = {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('userEmail'),
            fullName: localStorage.getItem('userFullName')
        };
        
        const newGift = await this.giftListModel.addGift(category, giftName, userInfo);
        if (newGift) {
            document.getElementById('giftName').value = '';
            this.loadGiftList();
            
            // Mostrar mensaje de éxito
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 255, 0, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 3000;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2s forwards;
            `;
            successMsg.textContent = '¡Regalo agregado exitosamente!';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        }
    }

    editGift(giftId, currentName) {
        const newName = prompt('Modificar nombre del regalo:', currentName);
        if (newName && newName.trim() && newName.trim() !== currentName) {
            this.updateGift(giftId, newName.trim());
        }
    }

    async updateGift(giftId, newName) {
        const userInfo = {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('userEmail'),
            fullName: localStorage.getItem('userFullName')
        };
        
        const success = await this.giftListModel.updateGift(giftId, newName, userInfo);
        if (success) {
            this.loadGiftList();
            
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 255, 0, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 3000;
                font-family: 'Orbitron', monospace;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3s forwards;
            `;
            successMsg.textContent = '¡Regalo modificado exitosamente! 🎁';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 4000);
        } else {
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 3000;
                font-family: 'Orbitron', monospace;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3s forwards;
            `;
            errorMsg.textContent = 'Error al modificar el regalo';
            document.body.appendChild(errorMsg);
            
            setTimeout(() => {
                errorMsg.remove();
            }, 4000);
        }
    }
}