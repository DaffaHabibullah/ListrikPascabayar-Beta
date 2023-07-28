const express = require('express');
const router = express.Router();
const db = require('../config');

// Get pengguaan pelanggan
router.get('/penggunaan', (req, res) => {
    const query = 'SELECT * FROM penggunaan';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Get penggunaan pelanggan by id
router.get('/penggunaan/:id', (req, res) => {
    const idPenggunaan = req.params.id;
    const query = 'SELECT * FROM penggunaan WHERE id_penggunaan = ?';
    db.query(query, [idPenggunaan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Penggunaan not found' });
            } else {
                const penggunaan = results[0];
                res.status(200).json(penggunaan);
            }
        }
    });
});

// Get penggunaan pelanggan by id_pelanggan
router.get('/penggunaan/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const query = 'SELECT pu.* FROM pelanggan p JOIN penggunaan pu ON p.id_pelanggan = pu.id_pelanggan WHERE p.id_pelanggan = ?';
    db.query(query, [idPelanggan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Penggunaan not found' });
            } else {
                const penggunaan = results;
                res.status(200).json(penggunaan);
            }
        }
    });
});

// Get penggunaan pelanggan by username
router.get('/penggunaan/pelanggan/:username', (req, res) => {
    const usernamePelanggan = req.params.username;
    const query = 'SELECT pu.* FROM pelanggan p JOIN penggunaan pu ON p.id_pelanggan = pu.id_pelanggan WHERE p.username = ?';
    db.query(query, [usernamePelanggan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Penggunaan not found' });
            } else {
                const penggunaan = results;
                res.status(200).json(penggunaan);
            }
        }
    });
});



// Menambahkan data penggunaan pelanggan berdasarkan id_pelanggan
router.post('/penggunaan/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const { bulan, tahun, meter_awal, meter_akhir } = req.body;

    if (!bulan || !tahun || !meter_awal || !meter_akhir) {
        return res.status(400).json({ message: 'Semua bagian harus diisi' });
    }

    const selectPelangganQuery = 'SELECT nama_pelanggan, id_tarif FROM pelanggan WHERE id_pelanggan = ?';
    db.query(selectPelangganQuery, [idPelanggan], (selectErr, selectResults) => {
        if (selectErr) {
            console.error('Error executing MySQL query:', selectErr);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (selectResults.length === 0) {
            return res.status(404).json({ message: 'Pelanggan not found' });
        }

        const nama_pelanggan = selectResults[0].nama_pelanggan;
        const idTarif = selectResults[0].id_tarif;

        const insertPenggunaanQuery = 'INSERT INTO penggunaan (id_pelanggan, nama_pelanggan, bulan, tahun, meter_awal, meter_akhir) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertPenggunaanQuery, [idPelanggan, nama_pelanggan, bulan, tahun, meter_awal, meter_akhir], (insertErr) => {
            if (insertErr) {
                console.error('Error executing MySQL query:', insertErr);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const selectLastInsertedPenggunaanIdQuery = 'SELECT LAST_INSERT_ID() as id_penggunaan';
            db.query(selectLastInsertedPenggunaanIdQuery, (selectIdErr, selectIdResults) => {
                if (selectIdErr) {
                    console.error('Error executing MySQL query:', selectIdErr);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                const idPenggunaan = selectIdResults[0].id_penggunaan;
                const selectTarifQuery = 'SELECT tarifperkwh FROM tarif WHERE id_tarif = ?';
                db.query(selectTarifQuery, [idTarif], (selectTarifErr, selectTarifResults) => {
                    if (selectTarifErr) {
                        console.error('Error executing MySQL query:', selectTarifErr);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    const tarifPerKwh = selectTarifResults[0].tarifperkwh;
                    const jumlahMeter = (meter_akhir - meter_awal) * tarifPerKwh;

                    const insertTagihanQuery = 'INSERT INTO tagihan (id_penggunaan, id_pelanggan, nama_pelanggan, bulan, tahun, jumlah_meter) VALUES (?, ?, ?, ?, ?, ?)';
                    db.query(insertTagihanQuery, [idPenggunaan, idPelanggan, nama_pelanggan, bulan, tahun, jumlahMeter], (insertTagihanErr) => {
                        if (insertTagihanErr) {
                            console.error('Error executing MySQL query:', insertTagihanErr);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                        return res.status(200).json({ message: 'Insert penggunaan dan tagihan berhasil' });
                    });
                });
            });
        });
    });
});



// Delete penggunaan pelanggan by id
router.delete('/penggunaan/:id', (req, res) => {
    const idPenggunaan = req.params.id;
    const query = 'DELETE FROM penggunaan WHERE id_penggunaan = ?';
    db.query(query, [idPenggunaan], (err) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Delete penggunaan berhasil' });
    });
});



module.exports = router;