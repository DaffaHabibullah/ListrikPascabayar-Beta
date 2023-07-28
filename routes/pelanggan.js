const express = require('express');
const router = express.Router();
const db = require('../config');

// Get data pelanggan
router.get('/pelanggan', (req, res) => {
    const query = 'SELECT p.id_pelanggan, p.username, p.nomor_kwh, p.nama_pelanggan, p.alamat, t.daya AS id_tarif FROM pelanggan p JOIN tarif t ON p.id_tarif = t.id_tarif';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get('/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const query = 'SELECT p.id_pelanggan, p.username, p.nomor_kwh, p.nama_pelanggan, p.alamat, t.daya AS id_tarif FROM pelanggan p LEFT JOIN tarif t ON p.id_tarif = t.id_tarif WHERE p.id_pelanggan = ?';
    db.query(query, [idPelanggan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Pelanggan not found' });
            } else {
                res.status(200).json(results[0]);
            }
        }
    });
});

// Get pelanggan by username
router.get('/pelanggan/:username', (req, res) => {
    const usernamePelanggan = req.params.username;
    const query = 'SELECT p.id_pelanggan, p.username, p.nomor_kwh, p.nama_pelanggan, p.alamat, t.daya AS id_tarif FROM pelanggan p JOIN tarif t ON p.id_tarif = t.id_tarif WHERE p.username = ?';
    db.query(query, [usernamePelanggan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Pelanggan not found' });
            } else {
                res.status(200).json(results[0]);
            }
        }
    });
});



// Get data pelanggan hanya daya 900 VA
router.get('/pelanggan/daya/:id_tarif', (req, res) => {
    const idTarif = req.params.id_tarif;
    const query = 'SELECT p.id_pelanggan, p.username, p.nomor_kwh, p.nama_pelanggan, p.alamat, t.daya AS id_tarif FROM pelanggan p JOIN tarif t ON p.id_tarif = t.id_tarif WHERE t.id_tarif = ?';
    db.query(query, [idTarif], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});


// Mengupdate data pelanggan
router.put('/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const { nomor_kwh, nama_pelanggan, alamat, id_tarif } = req.body;

    if (!nomor_kwh, !nama_pelanggan, !alamat, !id_tarif) {
        return res.status(400).json({ message: 'Semua bagian harus diisi' });
    }

    // if (nomor_kwh.length !== 10) {
    //     return res.status(400).json({ message: 'Nomor kwh harus memiliki panjang 10 karakter' });
    // }
    const query = 'UPDATE pelanggan SET nomor_kwh = ?, nama_pelanggan = ?, alamat = ?, id_tarif = ? WHERE id_pelanggan = ?';
    db.query(query, [nomor_kwh, nama_pelanggan, alamat, id_tarif, idPelanggan], (err) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Update data pelanggan berhasil' });
    });
});


// Delete pelaanggan by id
router.delete('/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const query = 'DELETE FROM pelanggan WHERE id_pelanggan = ?';
    db.query(query, [idPelanggan], (err) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Delete data pelanggan berhasil' });
    });
});



module.exports = router;