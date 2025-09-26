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

async function setupSalesTables() {
    try {
        // Conectar a la base de datos
        db.connect((err) => {
            if (err) {
                console.error('Error al conectar base de datos:', err);
                return;
            }
            console.log('Conectado a la base de datos');
        });

        // Crear tabla ventas
        const createVentasTableQuery = `
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_nombre VARCHAR(255) NOT NULL,
                cliente_dni VARCHAR(8) NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        db.query(createVentasTableQuery, (err, result) => {
            if (err) {
                console.error('Error al crear tabla ventas:', err);
                return;
            }
            console.log('Tabla ventas creada o ya existía');
        });

        // Crear tabla detalle_ventas
        const createDetalleVentasTableQuery = `
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                venta_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad INT NOT NULL,
                precio_unitario DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
        `;

        db.query(createDetalleVentasTableQuery, (err, result) => {
            if (err) {
                console.error('Error al crear tabla detalle_ventas:', err);
                return;
            }
            console.log('Tabla detalle_ventas creada o ya existía');
        });

        // Insertar algunas ventas de ejemplo
        const insertSampleSalesQuery = `
            INSERT IGNORE INTO ventas (id, cliente_nombre, cliente_dni, total, fecha_venta) 
            VALUES 
            (1, 'Juan Pérez González', '12345678', 45.25, '2024-01-15 10:30:00'),
            (2, 'María Elena Rodriguez', '87654321', 78.50, '2024-01-15 14:20:00'),
            (3, 'Carlos Alberto Mendoza', '11223344', 32.75, '2024-01-16 09:15:00')
        `;

        db.query(insertSampleSalesQuery, (err, result) => {
            if (err) {
                console.error('Error al insertar ventas de ejemplo:', err);
                return;
            }

            if (result.affectedRows > 0) {
                console.log(`${result.affectedRows} ventas de ejemplo insertadas`);

                // Insertar detalles de ventas de ejemplo
                const insertSampleDetailsQuery = `
                    INSERT IGNORE INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                    VALUES 
                    (1, 1, 2, 15.50, 31.00),
                    (1, 3, 1, 18.25, 18.25),
                    (2, 2, 1, 25.75, 25.75),
                    (2, 4, 2, 22.00, 44.00),
                    (2, 6, 1, 28.75, 28.75),
                    (3, 1, 1, 15.50, 15.50),
                    (3, 5, 1, 35.50, 35.50)
                `;

                db.query(insertSampleDetailsQuery, (err, detailResult) => {
                    if (err) {
                        console.error('Error al insertar detalles de ejemplo:', err);
                    } else if (detailResult.affectedRows > 0) {
                        console.log(`${detailResult.affectedRows} detalles de venta de ejemplo insertados`);
                    } else {
                        console.log('Los detalles de venta de ejemplo ya existían');
                    }

                    // Cerrar conexión
                    db.end(() => {
                        console.log('Configuración de tablas de ventas completada');
                    });
                });
            } else {
                console.log('Las ventas de ejemplo ya existían');
                
                // Cerrar conexión
                db.end(() => {
                    console.log('Configuración de tablas de ventas completada');
                });
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

setupSalesTables();