const express = require('express');
const router = express.Router();
const db = require('../config');

// Get pembayaran pelanggan
router.get('/pembayaran', (req, res) => {
    const query = 'SELECT * FROM pembayaran';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Get pembayaran pelanggan by id
router.get('/pembayaran/:id', (req, res) => {
    const idPembayaran = req.params.id;
    const query = 'SELECT * FROM pembayaran WHERE id_pembayaran = ?';
    db.query(query, [idPembayaran], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Pembayaran not found' });
            } else {
                res.status(200).json(results[0]);
            }
        }
    });
});

// Get pembayaran pelanggan by id_pelanggan
router.get('/pembayaran/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const query = 'SELECT pb.* FROM pelanggan p JOIN pembayaran pb ON p.id_pelanggan = pb.id_pelanggan WHERE p.id_pelanggan = ?';
    db.query(query, [idPelanggan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
        else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Pembayaran not found' });
            } else {
                const pembayaran = results;
                res.status(200).json(pembayaran);
            }
        }
    });
});


// Menambahkan data pembayaran pelanggan berdasarkan id_tagihan dari tabel tagihan
router.post('/pembayaran/tagihan/:id', (req, res) => {
    const idTagihan = req.params.id;
    const { total_bayar } = req.body;

    if (!total_bayar) {
        return res.status(400).json({ message: 'Semua bagian harus diisi' });
    }

    const selectIdPelanggan = 'SELECT id_pelanggan, nama_pelanggan, bulan FROM tagihan WHERE id_tagihan = ?';
    const selectUsername = 'SELECT username FROM pelanggan WHERE id_pelanggan = ?';
    const selectIdUser = 'SELECT id_user FROM user WHERE username = ?';
    const selectJumlahMeter = 'SELECT jumlah_meter FROM tagihan WHERE id_tagihan = ?';
    const insertPembayaran = 'INSERT INTO pembayaran (id_tagihan, id_pelanggan, nama_pelanggan, id_user, tanggal_pembayaran, bulan_bayar, total_bayar, biaya_admin) VALUES (?, ?, ?, ?, ?, ?, ?, 2000)';
    const updateStatus = 'UPDATE tagihan SET status = 2 WHERE id_tagihan = ?';

    db.query(selectIdPelanggan, [idTagihan], (selectIdPelangganErr, selectIdPelangganResults) => {
        if (selectIdPelangganErr) {
            console.error('Error executing MySQL query:', selectIdPelangganErr);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (selectIdPelangganResults.length === 0) {
            return res.status(400).json({ message: 'Id_tagihan tidak valid' });
        }

        const idPelanggan = selectIdPelangganResults[0].id_pelanggan;
        const nama_pelanggan = selectIdPelangganResults[0].nama_pelanggan;
        const bulan_bayar = selectIdPelangganResults[0].bulan;

        db.query(selectUsername, [idPelanggan], (selectUsernameErr, selectUsernameResults) => {
            if (selectUsernameErr) {
                console.error('Error executing MySQL query:', selectUsernameErr);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (selectUsernameResults.length === 0) {
                return res.status(400).json({ message: 'Id_pelanggan tidak valid' });
            }

            const username = selectUsernameResults[0].username;

            db.query(selectIdUser, [username], (selectIdUserErr, selectIdUserResults) => {
                if (selectIdUserErr) {
                    console.error('Error executing MySQL query:', selectIdUserErr);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                if (selectIdUserResults.length === 0) {
                    return res.status(400).json({ message: 'Username tidak valid' });
                }

                const idUser = selectIdUserResults[0].id_user;

                db.query(selectJumlahMeter, [idTagihan], (selectJumlahMeterErr, selectJumlahMeterResults) => {
                    if (selectJumlahMeterErr) {
                        console.error('Error executing MySQL query:', selectJumlahMeterErr);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (selectJumlahMeterResults.length === 0) {
                        return res.status(400).json({ message: 'Id_tagihan tidak valid' });
                    }

                    const jumlah_meter = selectJumlahMeterResults[0].jumlah_meter;
                    const total_bayar_expected = jumlah_meter + 2000;

                    if (total_bayar !== total_bayar_expected) {
                        return res.status(400).json({ message: 'Total bayar tidak sama dengan jumlah meter ditambah biaya admin' });
                    }

                    db.query(insertPembayaran, [idTagihan, idPelanggan, nama_pelanggan, idUser, new Date(), bulan_bayar, total_bayar], (insertErr, insertResults) => {
                        if (insertErr) {
                            console.error('Error executing MySQL query:', insertErr);
                            return res.status(500).json({ message: 'Internal server error' });
                        }

                        if (insertResults.affectedRows === 0) {
                            return res.status(400).json({ message: 'Tagihan sudah dibayar' });
                        }

                        db.query(updateStatus, [idTagihan], (updateErr) => {
                            if (updateErr) {
                                console.error('Error executing MySQL query:', updateErr);
                                return res.status(500).json({ message: 'Internal server error' });
                            }

                            return res.status(200).json({ message: 'Insert pembayaran berhasil' });
                        });
                    });
                });
            });
        });
    });
});


// Delete pembayaran pelanggan by id
router.delete('/pembayaran/:id', (req, res) => {
    const idPembayaran = req.params.id;
    const query = 'DELETE FROM pembayaran WHERE id_pembayaran = ?';
    db.query(query, [idPembayaran], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Pembayaran not found' });
            } else {
                res.status(200).json({ message: 'Delete pembayaran berhasil' });
            }
        }
    });
});




module.exports = router;