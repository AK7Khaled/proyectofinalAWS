const express =require('express');
const mysql=require('mysql2');
const cors = require('cors');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const app=express();

app.use(cors()); //permitir peticiones react
app.use(express.json());

//configuracion a mysql
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmacia_deb',
    port: process.env.DB_PORT || 3306
});

db.connect((err)=>{
    if(err){
        console.error('Error al conectar base de datos:', err);
    }else{
        console.log('Estas conectado a la base de datos');
    }
});

//ruta del login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email recibido:', email);
    console.log('Password recibido:', password ? '[PRESENTE]' : '[FALTANTE]');

    // Validar que se proporcionen email y password
    if (!email || !password) {
        console.log('Error: Email o contraseña faltantes');
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        console.log('Usuarios encontrados:', results.length);
        
        if (results.length === 0) {
            console.log('Error: Usuario no encontrado para email:', email);
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];
        console.log('Usuario encontrado:', { id: user.id, email: user.email });
        
        try {
            const validPassword = await bcrypt.compare(password, user.password);
            console.log('¿Contraseña válida?', validPassword);
            
            if (!validPassword) {
                console.log('Error: Contraseña inválida para usuario:', email);
                return res.status(401).json({ error: 'Contraseña inválida' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email }, 
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '2h' }
            );
            
            console.log('Login exitoso para:', email);
            res.json({ message: 'Login exitoso', token });
        } catch (bcryptError) {
            console.error('Error al comparar contraseña:', bcryptError);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    });
});

//proteger rutas de jwt
const verifyToken=(req, res,next)=>{
    const bearer=req.headers.authorization;
    if(!bearer)return res.status(403).json({error:'Token Requerido'});

    const token=bearer.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err) return res.status(401).json({error:'Token Invalido'});
        req.user=decoded;
        next();
    });
};

//ruta protegida
app.get('/api/perfil', verifyToken, (req, res) => {
    res.json({message:`Hola ${req.user.email}, este es tu Perfil.`});
});

// CRUD de Productos
// Obtener todos los productos
app.get('/api/productos', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM productos ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// Obtener un producto por ID
app.get('/api/productos/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM productos WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(results[0]);
    });
});

// Crear un nuevo producto
app.post('/api/productos', verifyToken, (req, res) => {
    const {
        codigo,
        nombre,
        descripcion,
        categoria,
        precio,
        stock,
        fechaVencimiento,
        laboratorio,
        presentacion
    } = req.body;

    // Validaciones básicas
    if (!codigo || !nombre || !categoria || !precio || stock === undefined || !fechaVencimiento || !laboratorio || !presentacion) {
        return res.status(400).json({ error: 'Todos los campos requeridos deben ser proporcionados' });
    }

    const sql = `
        INSERT INTO productos 
        (codigo, nombre, descripcion, categoria, precio, stock, fecha_vencimiento, laboratorio, presentacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [codigo, nombre, descripcion, categoria, precio, stock, fechaVencimiento, laboratorio, presentacion], (err, result) => {
        if (err) {
            console.error('Error al crear producto:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe un producto con ese código' });
            }
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.status(201).json({
            message: 'Producto creado exitosamente',
            productId: result.insertId
        });
    });
});

// Actualizar un producto
app.put('/api/productos/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const {
        codigo,
        nombre,
        descripcion,
        categoria,
        precio,
        stock,
        fechaVencimiento,
        laboratorio,
        presentacion
    } = req.body;

    // Validaciones básicas
    if (!codigo || !nombre || !categoria || !precio || stock === undefined || !fechaVencimiento || !laboratorio || !presentacion) {
        return res.status(400).json({ error: 'Todos los campos requeridos deben ser proporcionados' });
    }

    const sql = `
        UPDATE productos 
        SET codigo = ?, nombre = ?, descripcion = ?, categoria = ?, precio = ?, 
            stock = ?, fecha_vencimiento = ?, laboratorio = ?, presentacion = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.query(sql, [codigo, nombre, descripcion, categoria, precio, stock, fechaVencimiento, laboratorio, presentacion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe un producto con ese código' });
            }
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado exitosamente' });
    });
});

// Eliminar un producto
app.delete('/api/productos/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado exitosamente' });
    });
});

// ===== RUTAS PARA VENTAS =====

// Obtener todas las ventas
app.get('/api/ventas', verifyToken, (req, res) => {
    const sql = `
        SELECT v.*, 
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'producto_id', dv.producto_id,
                       'cantidad', dv.cantidad,
                       'precio_unitario', dv.precio_unitario,
                       'subtotal', dv.subtotal,
                       'nombre_producto', p.nombre
                   )
               ) as items
        FROM ventas v
        LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
        LEFT JOIN productos p ON dv.producto_id = p.id
        GROUP BY v.id
        ORDER BY v.fecha_venta DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener ventas:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// Crear una nueva venta
app.post('/api/ventas', verifyToken, (req, res) => {
    const { cliente_nombre, cliente_dni, items, total } = req.body;
    
    // Validaciones básicas
    if (!cliente_nombre || !cliente_dni || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Datos de venta incompletos' });
    }
    
    // Validar DNI
    if (!/^\d{8}$/.test(cliente_dni)) {
        return res.status(400).json({ error: 'DNI debe tener 8 dígitos' });
    }
    
    // Iniciar transacción
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar transacción:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        // Insertar venta
        const insertVentaSQL = `
            INSERT INTO ventas (cliente_nombre, cliente_dni, total, fecha_venta) 
            VALUES (?, ?, ?, NOW())
        `;
        
        db.query(insertVentaSQL, [cliente_nombre, cliente_dni, total], (err, ventaResult) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error al insertar venta:', err);
                    res.status(500).json({ error: 'Error al crear venta' });
                });
            }
            
            const ventaId = ventaResult.insertId;
            
            // Procesar cada item de la venta
            let completedItems = 0;
            let hasError = false;
            
            items.forEach((item, index) => {
                // Verificar stock disponible
                const checkStockSQL = 'SELECT stock FROM productos WHERE id = ?';
                
                db.query(checkStockSQL, [item.producto_id], (err, stockResult) => {
                    if (err || hasError) {
                        if (!hasError) {
                            hasError = true;
                            db.rollback(() => {
                                console.error('Error al verificar stock:', err);
                                res.status(500).json({ error: 'Error al verificar stock' });
                            });
                        }
                        return;
                    }
                    
                    if (stockResult.length === 0) {
                        if (!hasError) {
                            hasError = true;
                            db.rollback(() => {
                                res.status(400).json({ error: `Producto ${item.producto_id} no encontrado` });
                            });
                        }
                        return;
                    }
                    
                    const currentStock = stockResult[0].stock;
                    if (currentStock < item.cantidad) {
                        if (!hasError) {
                            hasError = true;
                            db.rollback(() => {
                                res.status(400).json({ error: `Stock insuficiente para producto ${item.producto_id}` });
                            });
                        }
                        return;
                    }
                    
                    // Insertar detalle de venta
                    const insertDetalleSQL = `
                        INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    
                    const subtotal = item.precio_unitario * item.cantidad;
                    
                    db.query(insertDetalleSQL, [ventaId, item.producto_id, item.cantidad, item.precio_unitario, subtotal], (err) => {
                        if (err || hasError) {
                            if (!hasError) {
                                hasError = true;
                                db.rollback(() => {
                                    console.error('Error al insertar detalle:', err);
                                    res.status(500).json({ error: 'Error al crear detalle de venta' });
                                });
                            }
                            return;
                        }
                        
                        // Actualizar stock del producto
                        const updateStockSQL = 'UPDATE productos SET stock = stock - ? WHERE id = ?';
                        
                        db.query(updateStockSQL, [item.cantidad, item.producto_id], (err) => {
                            if (err || hasError) {
                                if (!hasError) {
                                    hasError = true;
                                    db.rollback(() => {
                                        console.error('Error al actualizar stock:', err);
                                        res.status(500).json({ error: 'Error al actualizar stock' });
                                    });
                                }
                                return;
                            }
                            
                            completedItems++;
                            
                            // Si todos los items se procesaron correctamente, confirmar transacción
                            if (completedItems === items.length && !hasError) {
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error('Error al confirmar transacción:', err);
                                            res.status(500).json({ error: 'Error al confirmar venta' });
                                        });
                                    }
                                    
                                    res.status(201).json({
                                        message: 'Venta registrada exitosamente',
                                        ventaId: ventaId
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

const PORT = process.env.PORT || 5000;
const SERVERBACKEND = process.env.DB_HOST
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en ${SERVERBACKEND}:${PORT}`);
});


