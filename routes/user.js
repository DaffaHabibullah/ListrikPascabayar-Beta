const express = require('express');
const router = express.Router();
const db = require('../config');
const bcrypt = require('bcrypt');

// Get data semua user
router.get('/user', (req, res) => {
    const query = 'SELECT u.id_user, u.username, u.nama_admin, l.nama_level AS id_level FROM user u JOIN level l ON u.id_level = l.id_level';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const users = results.map(user => ({
                id_user: user.id_user,
                username: user.username,
                ...(user.nama_admin !== null && user.nama_admin !== '' ? { nama_admin: user.nama_admin } : {}),
                id_level: user.id_level
            }));
            res.status(200).json(users);
        }
    });
});

// Get data user by id
router.get('/user/:id', (req, res) => {
    const idUser = req.params.id;
    const query = 'SELECT u.id_user, u.username, u.nama_admin, l.nama_level AS id_level FROM user u JOIN level l ON u.id_level = l.id_level WHERE u.id_user = ?';
    db.query(query, [idUser], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                const user = {
                    id_user: results[0].id_user,
                    username: results[0].username,
                    ...(results[0].nama_admin !== null && results[0].nama_admin !== '' ? { nama_admin: results[0].nama_admin } : {}),
                    id_level: results[0].id_level
                };
                res.status(200).json(user);
            }
        }
    });
});

// Get data user by level id
router.get('/user/level/:id', (req, res) => {
    const idLevel = req.params.id;
    const query = 'SELECT u.id_user, u.username, u.nama_admin, l.nama_level AS id_level FROM user u JOIN level l ON u.id_level = l.id_level WHERE u.id_level = ?';
    db.query(query, [idLevel], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const users = results.map(user => ({
                id_user: user.id_user,
                username: user.username,
                ...(user.nama_admin !== null && user.nama_admin !== '' ? { nama_admin: user.nama_admin } : {}),
                id_level: user.id_level
            }));
            res.status(200).json(users);
        }
    });
});


// Registrasi pengguna baru
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Semua bagian harus diisi' });
    }

    const selectQuery = 'SELECT * FROM user WHERE username = ?';
    db.query(selectQuery, [username], (selectErr, selectResults) => {
        if (selectErr) {
            console.error('Error executing MySQL query:', selectErr);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (selectResults.length > 0) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const insertPelangganQuery = 'INSERT INTO pelanggan (username, password) VALUES (?, ?)';
            db.query(insertPelangganQuery, [username, hashedPassword], (insertPelangganErr, insertPelangganResults) => {
                if (insertPelangganErr) {
                    console.error('Error executing MySQL query:', insertPelangganErr);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                const id_pelanggan = insertPelangganResults.insertId;

                const insertUserQuery = 'INSERT INTO user (username, password, id_level, id_pelanggan) VALUES (?, ?, 2, ?)';
                db.query(insertUserQuery, [username, hashedPassword, id_pelanggan], (insertUserErr) => {
                    if (insertUserErr) {
                        console.error('Error executing MySQL query:', insertUserErr);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(200).json({ message: 'Registrasi berhasil' });
                });
            });
        });
    });
});

// Login pengguna
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Semua bagian harus diisi' });
    }

    const query = 'SELECT * FROM user WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Username atau password tidak valid' });
        }
        const hashedPassword = results[0].password;
        bcrypt.compare(password, hashedPassword, (hashErr, isMatch) => {
            if (hashErr) {
                console.error('Error comparing passwords:', hashErr);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Username atau password tidak valid' });
            }
            return res.status(200).json(results[0]);
        });
    });
});



// Dummy data
router.get('/create-dummy-data', async (req, res) => {
    try {
        for (let i = 1; i <= 1000; i++) {
            const nilai1 = `Data ${i}`;
            const nilai2 = Math.floor(Math.random() * 100);
            const nilai3 = Math.random() < 0.5 ? 'A' : 'B';

            const sql = `INSERT INTO nama_tabel (kolom1, kolom2, kolom3) VALUES (?, ?, ?)`;

            await db.query(sql, [nilai1, nilai2, nilai3]);
            console.log(`Data dummy ke-${i} berhasil dimasukkan`);
        }

        res.status(200).json({ message: '1000 data dummy berhasil dimasukkan' });
    } catch (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Fungsi untuk mengukur waktu eksekusi
function measureExecutionTime(func) {
    const startTime = performance.now();
    func();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    return executionTime;
}

const v8 = require('v8');

// Fungsi untuk mengukur waktu eksekusi
function measureExecutionTime(func) {
    const startTime = process.hrtime();
    func();
    const endTime = process.hrtime(startTime);
    const executionTimeInMs = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);
    return executionTimeInMs;
}

// Fungsi untuk mengukur penggunaan memori
function measureMemoryUsage(func) {
    const heapBefore = v8.getHeapStatistics();
    func();
    const heapAfter = v8.getHeapStatistics();
    const usedHeap = heapAfter.used_heap_size - heapBefore.used_heap_size;
    return usedHeap;
}

// Fungsi yang ingin diukur eksekusi waktu dan penggunaan memori
function getUsers() {
    const query = 'SELECT u.id_user, u.username, u.nama_admin, l.nama_level AS id_level FROM user u JOIN level l ON u.id_level = l.id_level';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const users = results.map(user => ({
                id_user: user.id_user,
                username: user.username,
                ...(user.nama_admin !== null && user.nama_admin !== '' ? { nama_admin: user.nama_admin } : {}),
                id_level: user.id_level
            }));
            console.log(users);
        }
    });
}

// Mengukur eksekusi waktu fungsi getUsers()
const executionTime = measureExecutionTime(getUsers);
console.log(`Waktu eksekusi fungsi getUsers(): ${executionTime} ms`);

// Mengukur penggunaan memori fungsi getUsers()
const memoryUsage = measureMemoryUsage(getUsers);
console.log(`Penggunaan memori fungsi getUsers(): ${memoryUsage} bytes`);



module.exports = router;