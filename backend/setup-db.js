const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmacia_deb',
    port: process.env.DB_PORT || 3306
});

async function setupDatabase() {
    try {
        // Conectar a la base de datos
        db.connect((err) => {
            if (err) {
                console.error('Error al conectar base de datos:', err);
                return;
            }
            console.log('Conectado a la base de datos');
        });

        // Crear tabla users si no existe
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Error al crear tabla:', err);
                return;
            }
            console.log('Tabla users creada o ya existía');
        });

        // Hashear contraseña para usuario de prueba
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Insertar usuario de prueba
        const insertUserQuery = `
            INSERT IGNORE INTO users (email, password) 
            VALUES (?, ?)
        `;

        db.query(insertUserQuery, ['test@test.com', hashedPassword], (err, result) => {
            if (err) {
                console.error('Error al insertar usuario:', err);
                return;
            }
            
            if (result.affectedRows > 0) {
                console.log('Usuario de prueba creado: test@test.com / 123456');
            } else {
                console.log('Usuario de prueba ya existía');
            }

            // Cerrar conexión
            db.end(() => {
                console.log('Configuración de base de datos completada');
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

setupDatabase();