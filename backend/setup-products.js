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

async function createProductsTable() {
    try {
        db.connect((err) => {
            if (err) {
                console.error('Error al conectar base de datos:', err);
                return;
            }
            console.log('Conectado a la base de datos');
        });

        // Crear tabla productos
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                codigo VARCHAR(50) UNIQUE NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                descripcion TEXT,
                categoria VARCHAR(100) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                fecha_vencimiento DATE NOT NULL,
                laboratorio VARCHAR(255) NOT NULL,
                presentacion VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_codigo (codigo),
                INDEX idx_categoria (categoria),
                INDEX idx_nombre (nombre),
                INDEX idx_fecha_vencimiento (fecha_vencimiento)
            )
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Error al crear tabla productos:', err);
                return;
            }
            console.log('Tabla productos creada o ya existía');
        });

        // Insertar productos de ejemplo
        const sampleProducts = [
            {
                codigo: 'MED001',
                nombre: 'Paracetamol 500mg',
                descripcion: 'Analgésico y antipirético para el alivio del dolor y fiebre',
                categoria: 'Analgésicos',
                precio: 15.50,
                stock: 100,
                fecha_vencimiento: '2025-12-31',
                laboratorio: 'Laboratorios ABC',
                presentacion: 'Tabletas'
            },
            {
                codigo: 'MED002',
                nombre: 'Amoxicilina 500mg',
                descripcion: 'Antibiótico de amplio espectro para infecciones bacterianas',
                categoria: 'Antibióticos',
                precio: 25.75,
                stock: 50,
                fecha_vencimiento: '2025-10-15',
                laboratorio: 'Pharma Labs',
                presentacion: 'Cápsulas'
            },
            {
                codigo: 'MED003',
                nombre: 'Vitamina C 1000mg',
                descripcion: 'Suplemento vitamínico para fortalecer el sistema inmunológico',
                categoria: 'Vitaminas',
                precio: 18.25,
                stock: 75,
                fecha_vencimiento: '2026-06-20',
                laboratorio: 'VitaHealth',
                presentacion: 'Tabletas efervescentes'
            },
            {
                codigo: 'MED004',
                nombre: 'Ibuprofeno 400mg',
                descripcion: 'Antiinflamatorio no esteroideo para dolor e inflamación',
                categoria: 'Antiinflamatorios',
                precio: 12.90,
                stock: 80,
                fecha_vencimiento: '2025-08-30',
                laboratorio: 'MediCorp',
                presentacion: 'Tabletas'
            },
            {
                codigo: 'MED005',
                nombre: 'Loratadina 10mg',
                descripcion: 'Antihistamínico para el tratamiento de alergias',
                categoria: 'Antialérgicos',
                precio: 22.50,
                stock: 60,
                fecha_vencimiento: '2025-11-25',
                laboratorio: 'AllergyFree Labs',
                presentacion: 'Tabletas'
            }
        ];

        const insertProductQuery = `
            INSERT IGNORE INTO productos 
            (codigo, nombre, descripcion, categoria, precio, stock, fecha_vencimiento, laboratorio, presentacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let insertedCount = 0;
        sampleProducts.forEach((product, index) => {
            db.query(insertProductQuery, [
                product.codigo,
                product.nombre,
                product.descripcion,
                product.categoria,
                product.precio,
                product.stock,
                product.fecha_vencimiento,
                product.laboratorio,
                product.presentacion
            ], (err, result) => {
                if (err) {
                    console.error(`Error al insertar producto ${product.codigo}:`, err);
                } else if (result.affectedRows > 0) {
                    insertedCount++;
                    console.log(`✓ Producto insertado: ${product.nombre}`);
                }

                // Si es el último producto, mostrar resumen y cerrar conexión
                if (index === sampleProducts.length - 1) {
                    setTimeout(() => {
                        console.log(`\n=== RESUMEN ===`);
                        console.log(`Productos de ejemplo insertados: ${insertedCount}`);
                        console.log('Configuración de tabla productos completada');
                        
                        db.end(() => {
                            console.log('Conexión cerrada');
                        });
                    }, 100);
                }
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

createProductsTable();