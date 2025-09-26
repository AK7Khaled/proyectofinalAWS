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

async function fixUser() {
    try {
        db.connect((err) => {
            if (err) {
                console.error('Error al conectar base de datos:', err);
                return;
            }
            console.log('Conectado a la base de datos');
        });

        // Hashear la contraseña correctamente
        const hashedPassword = await bcrypt.hash('123456', 10);
        console.log('Nueva contraseña hasheada:', hashedPassword);

        // Actualizar el usuario existente
        const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
        
        db.query(updateQuery, [hashedPassword, 'test@test.com'], (err, result) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return;
            }
            
            console.log('Usuario actualizado correctamente');
            console.log('Credenciales: test@test.com / 123456');
            
            db.end();
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

fixUser();