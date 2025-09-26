const mysql=require('mysql2');
const bcrypt=require('bcrypt');
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database:'farmacia_db'
});

const email='usuario@correo.com';
const plainPassword='123456';
bcrypt.hash(plainPassword, 10, (err,hash)=>{
    if(err)throw err;

    const sql='INSERT INTO users(email, password) VALUES (?,?)';
    db.query(sql, [email,hash], (err, result)=>{
        if(err)throw err;
        console.log('usuarior creado correctamente');
        db.end();
    });
});