class GiftList {
    constructor() {
        this.storageKey = 'babyShowerGifts';
        this.confirmationsKey = 'giftConfirmations';
        this.loadGifts();
        this.initializeDefaultGifts();
    }

    loadGifts() {
        const stored = localStorage.getItem(this.storageKey);
        this.gifts = stored ? JSON.parse(stored) : {};
    }

    saveGifts() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.gifts));
        // Solo guardar en archivo cuando hay cambios importantes
        this.saveGiftsToFile();
    }

    saveGiftsToFile() {
        const giftData = {
            timestamp: new Date().toISOString(),
            event: 'Baby Shower Roger Octavio Pardo',
            totalGifts: Object.values(this.gifts).flat().length,
            reservedGifts: Object.values(this.gifts).flat().filter(g => g.reserved).length,
            availableGifts: Object.values(this.gifts).flat().filter(g => !g.reserved).length,
            gifts: this.gifts
        };
        
        const blob = new Blob([JSON.stringify(giftData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lista_regalos_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    initializeDefaultGifts() {
        if (Object.keys(this.gifts).length === 0) {
            this.gifts = {
                baby: [
                    { id: 1, name: 'Colecho', reserved: true, reservedBy: { username: 'Papis', fullName: 'Papis', email: 'papis@familia.com' } },
                    { id: 2, name: 'Cochecito', reserved: true, reservedBy: { username: 'Abuela', fullName: 'Abuela', email: 'abuela@familia.com' } },
                    { id: 3, name: 'Bañera', reserved: true, reservedBy: { username: 'Papis', fullName: 'Papis', email: 'papis@familia.com' } },
                    { id: 4, name: 'Silla para auto', reserved: false, reservedBy: null },
                    { id: 5, name: 'Ropa de bebé (0-6 meses)', reserved: false, reservedBy: null },
                    { id: 6, name: 'Pañales', reserved: false, reservedBy: null },
                    { id: 7, name: 'Biberones', reserved: false, reservedBy: null },
                    { id: 8, name: 'Juguetes para bebé', reserved: false, reservedBy: null },
                    { id: 9, name: 'Monitor de bebé', reserved: false, reservedBy: null }
                ],
                mom: [
                    { id: 10, name: 'Almohada de lactancia', reserved: false, reservedBy: null },
                    { id: 11, name: 'Ropa de maternidad', reserved: false, reservedBy: null },
                    { id: 12, name: 'Cremas y aceites', reserved: false, reservedBy: null },
                    { id: 13, name: 'Libro de maternidad', reserved: false, reservedBy: null },
                    { id: 14, name: 'Kit de relajación', reserved: false, reservedBy: null },
                    { id: 15, name: 'Bolsa maternal', reserved: false, reservedBy: null }
                ],
                home: [
                    { id: 16, name: 'Cambiador', reserved: false, reservedBy: null },
                    { id: 17, name: 'Lámpara nocturna', reserved: false, reservedBy: null },
                    { id: 18, name: 'Humidificador', reserved: false, reservedBy: null },
                    { id: 19, name: 'Organizador de juguetes', reserved: false, reservedBy: null },
                    { id: 20, name: 'Móvil para cuna', reserved: false, reservedBy: null },
                    { id: 21, name: 'Alfombra de juegos', reserved: false, reservedBy: null }
                ]
            };
            this.saveGifts();
        }
    }

    getGiftsByCategory(category) {
        return this.gifts[category] || [];
    }

    addGift(category, giftName, userInfo) {
        if (!this.gifts[category]) {
            this.gifts[category] = [];
        }

        const newId = Math.max(...Object.values(this.gifts).flat().map(g => g.id), 0) + 1;
        const newGift = {
            id: newId,
            name: giftName,
            reserved: false,
            reservedBy: null,
            addedBy: userInfo.username,
            addedDate: new Date().toISOString()
        };

        this.gifts[category].push(newGift);
        this.saveGifts();
        
        return newGift;
    }

    reserveGift(giftId, userInfo) {
        for (const category in this.gifts) {
            const gift = this.gifts[category].find(g => g.id === giftId);
            if (gift && !gift.reserved) {
                gift.reserved = true;
                gift.reservedBy = {
                    username: userInfo.username,
                    email: userInfo.email,
                    fullName: userInfo.fullName,
                    reservedDate: new Date().toISOString()
                };
                
                this.saveGifts();
                this.saveConfirmation(gift, userInfo);
                return true;
            }
        }
        return false;
    }

    saveConfirmation(gift, userInfo) {
        const confirmations = JSON.parse(localStorage.getItem(this.confirmationsKey) || '[]');
        
        const confirmation = {
            giftId: gift.id,
            giftName: gift.name,
            reservedBy: userInfo,
            timestamp: new Date().toISOString(),
            event: 'Baby Shower Roger Octavio Pardo'
        };
        
        confirmations.push(confirmation);
        localStorage.setItem(this.confirmationsKey, JSON.stringify(confirmations));
        
        // Descargar archivo de confirmación
        this.downloadConfirmation(confirmation);
    }

    downloadConfirmation(confirmation) {
        const confirmationData = {
            message: 'Confirmación de Regalo Reservado - Baby Shower Roger Octavio Pardo',
            regalo: {
                nombre: confirmation.giftName,
                categoria: this.getCategoryByGiftId(confirmation.giftId),
                fechaReserva: confirmation.timestamp
            },
            usuario: {
                nombre: confirmation.reservedBy.fullName,
                username: confirmation.reservedBy.username,
                email: confirmation.reservedBy.email
            },
            evento: {
                nombre: 'Baby Shower Roger Octavio Pardo',
                fecha: '2026-01-17'
            },
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(confirmationData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `regalo_reservado_${confirmation.giftName.replace(/\s+/g, '_')}_${confirmation.reservedBy.username}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getCategoryByGiftId(giftId) {
        for (const [category, gifts] of Object.entries(this.gifts)) {
            if (gifts.find(g => g.id === giftId)) {
                const categoryNames = {
                    baby: 'Para el Bebé',
                    mom: 'Para la Mamá',
                    home: 'Para el Hogar'
                };
                return categoryNames[category] || category;
            }
        }
        return 'Desconocida';
    }

    getUserReservations(userEmail) {
        const reservations = [];
        for (const category in this.gifts) {
            this.gifts[category].forEach(gift => {
                if (gift.reserved && gift.reservedBy && gift.reservedBy.email === userEmail) {
                    reservations.push(gift);
                }
            });
        }
        return reservations;
    }

    isAdmin(userEmail) {
        const adminEmails = ['admin@babyshower.com', 'roger@admin.com'];
        return adminEmails.includes(userEmail.toLowerCase());
    }
}