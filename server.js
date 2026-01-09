const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Configurar CORS para dominios específicos
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
        /^https?:\/\/.*\.pardos\.com\.ar$/,
        /^http?:\/\/.*\.pardos\.com\.ar$/,
        /^https?:\/\/pardos\.com\.ar$/
    ];
    
    if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

app.use(express.json());
app.use(express.static('.'));

// Inicializar archivos al arrancar el servidor
const giftListPath = path.join(__dirname, 'lista_regalos.json');
const attendancePath = path.join(__dirname, 'confirmaciones_asistencia.json');

function initializeGiftList() {
    const defaultGifts = {
        timestamp: new Date().toISOString(),
        event: 'Baby Shower Roger Octavio Pardo',
        gifts: {
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
        }
    };

    if (!fs.existsSync(giftListPath)) {
        fs.writeFileSync(giftListPath, JSON.stringify(defaultGifts, null, 2));
        console.log('Lista de regalos inicializada');
    } else {
        console.log('Lista de regalos ya existe');
    }
}

function initializeAttendanceList() {
    const defaultAttendance = {
        timestamp: new Date().toISOString(),
        event: 'Baby Shower Roger Octavio Pardo',
        eventDate: '2026-01-17',
        totalConfirmed: 0,
        confirmations: []
    };

    if (!fs.existsSync(attendancePath)) {
        fs.writeFileSync(attendancePath, JSON.stringify(defaultAttendance, null, 2));
        console.log('Lista de asistencia inicializada');
    } else {
        console.log('Lista de asistencia ya existe');
    }
}

// Base de datos en memoria para usuarios (en producción usar una base de datos real)
let users = [];
const usersPath = path.join(__dirname, 'users.json');

// Cargar usuarios existentes
function loadUsers() {
    if (fs.existsSync(usersPath)) {
        try {
            users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        } catch (error) {
            console.log('Error cargando usuarios, iniciando con array vacío');
            users = [];
        }
    }
}

// Guardar usuarios
function saveUsers() {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// Endpoints
app.post('/api/auth/register', (req, res) => {
    try {
        const { username, email, password, firstName, lastName, birthDate } = req.body;
        
        // Verificar si el email ya existe
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }
        
        // Validar contraseña
        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, letras y números' });
        }
        
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // En producción, hashear la contraseña
            firstName,
            lastName,
            birthDate,
            registrationDate: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers();
        
        // No devolver la contraseña
        const { password: _, ...userResponse } = newUser;
        res.json({ success: true, user: userResponse });
    } catch (error) {
        res.status(500).json({ error: 'Error en el registro' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verificar admin
        if (email.toLowerCase() === 'admin@admin.com' && password === 'adminRoger1234') {
            return res.json({ 
                success: true, 
                user: { 
                    email: 'admin@admin.com', 
                    username: 'admin', 
                    firstName: 'Admin', 
                    lastName: 'System',
                    isAdmin: true 
                } 
            });
        }
        
        // Buscar usuario
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (user) {
            const { password: _, ...userResponse } = user;
            res.json({ success: true, user: userResponse });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
});

app.get('/api/admin/users', (req, res) => {
    try {
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        res.json({ users: usersWithoutPasswords });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

app.get('/api/admin/dashboard', (req, res) => {
    try {
        const attendanceData = JSON.parse(fs.readFileSync(attendancePath, 'utf8'));
        const giftData = JSON.parse(fs.readFileSync(giftListPath, 'utf8'));
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        
        res.json({
            users: usersWithoutPasswords,
            confirmations: attendanceData.confirmations,
            gifts: giftData.gifts
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos del dashboard' });
    }
});

app.post('/api/users', (req, res) => {
    const userData = req.body;
    const filename = `usuarios_${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(__dirname, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(userData, null, 2));
    res.json({ success: true, filename });
});

app.get('/api/gifts', (req, res) => {
    try {
        const giftData = JSON.parse(fs.readFileSync(giftListPath, 'utf8'));
        res.json(giftData);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar lista de regalos' });
    }
});

app.post('/api/gifts/reserve', (req, res) => {
    try {
        const { giftId, userInfo } = req.body;
        const giftData = JSON.parse(fs.readFileSync(giftListPath, 'utf8'));
        
        let giftFound = false;
        for (const category in giftData.gifts) {
            const gift = giftData.gifts[category].find(g => g.id === giftId);
            if (gift && !gift.reserved) {
                gift.reserved = true;
                gift.reservedBy = {
                    ...userInfo,
                    reservedDate: new Date().toISOString()
                };
                giftFound = true;
                break;
            }
        }
        
        if (giftFound) {
            giftData.timestamp = new Date().toISOString();
            fs.writeFileSync(giftListPath, JSON.stringify(giftData, null, 2));
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Regalo no disponible' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al reservar regalo' });
    }
});

app.post('/api/gifts/add', (req, res) => {
    try {
        const { category, giftName, userInfo } = req.body;
        const giftData = JSON.parse(fs.readFileSync(giftListPath, 'utf8'));
        
        if (!giftData.gifts[category]) {
            giftData.gifts[category] = [];
        }
        
        const newId = Math.max(...Object.values(giftData.gifts).flat().map(g => g.id), 0) + 1;
        const newGift = {
            id: newId,
            name: giftName,
            reserved: true,
            reservedBy: {
                username: userInfo.username,
                email: userInfo.email,
                fullName: userInfo.fullName,
                reservedDate: new Date().toISOString()
            },
            addedBy: userInfo.username,
            addedDate: new Date().toISOString()
        };
        
        giftData.gifts[category].push(newGift);
        giftData.timestamp = new Date().toISOString();
        fs.writeFileSync(giftListPath, JSON.stringify(giftData, null, 2));
        
        res.json({ success: true, gift: newGift });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar regalo' });
    }
});

app.post('/api/attendance/confirm', (req, res) => {
    try {
        const { userInfo } = req.body;
        const attendanceData = JSON.parse(fs.readFileSync(attendancePath, 'utf8'));
        
        // Verificar si ya confirmó
        const existingConfirmation = attendanceData.confirmations.find(c => c.email === userInfo.email);
        if (existingConfirmation) {
            return res.status(400).json({ error: 'Ya confirmaste tu asistencia' });
        }
        
        // Agregar confirmación
        const confirmation = {
            ...userInfo,
            confirmationDate: new Date().toISOString(),
            id: Date.now().toString()
        };
        
        attendanceData.confirmations.push(confirmation);
        attendanceData.totalConfirmed = attendanceData.confirmations.length;
        attendanceData.timestamp = new Date().toISOString();
        
        fs.writeFileSync(attendancePath, JSON.stringify(attendanceData, null, 2));
        res.json({ success: true, confirmation });
    } catch (error) {
        res.status(500).json({ error: 'Error al confirmar asistencia' });
    }
});

app.get('/api/attendance', (req, res) => {
    try {
        const attendanceData = JSON.parse(fs.readFileSync(attendancePath, 'utf8'));
        res.json(attendanceData);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar confirmaciones' });
    }
});

app.get('/api/attendance/check/:email', (req, res) => {
    try {
        const { email } = req.params;
        const attendanceData = JSON.parse(fs.readFileSync(attendancePath, 'utf8'));
        const confirmation = attendanceData.confirmations.find(c => c.email === email);
        res.json({ confirmed: !!confirmation, confirmation });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar asistencia' });
    }
});

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'adminRoger1234') {
        res.json({ success: true, isAdmin: true });
    } else {
        res.status(401).json({ error: 'Credenciales de admin incorrectas' });
    }
});

// Inicializar al arrancar
initializeGiftList();
initializeAttendanceList();
loadUsers();

app.listen(3001, () => {
    console.log('Servidor ejecutándose en http://localhost:3001');
    console.log('Lista de regalos disponible en /api/gifts');
    console.log('Confirmaciones de asistencia en /api/attendance');
});