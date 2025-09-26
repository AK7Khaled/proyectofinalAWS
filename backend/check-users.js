const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmacia_deb',
    port: process.env.DB_PORT || 3306
});

function checkUsers() {
    db.connect((err) => {
        if (err) {
            console.error('Error al conectar base de datos:', err);
            return;
        }
        console.log('Conectado a la base de datos');
    });

    // Listar todos los usuarios
    const query = 'SELECT id, email, password FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al consultar usuarios:', err);
            return;
        }
        
        console.log('=== USUARIOS EN LA BASE DE DATOS ===');
        console.log('Total de usuarios:', results.length);
        
        results.forEach(user => {
            console.log(`ID: ${user.id}, Email: ${user.email}, Password hash: ${user.password.substring(0, 20)}...`);
        });
        
        db.end();
    });
}

checkUsers();