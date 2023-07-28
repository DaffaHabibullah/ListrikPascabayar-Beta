const mysql = require('mysql');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pembayaran_listrik',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung dengan database:', err);
    } else {
        console.log('Berhasil terhubung dengan database');
    }
});



module.exports = db;