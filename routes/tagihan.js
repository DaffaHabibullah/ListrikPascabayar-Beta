const express = require('express');
const router = express.Router();
const db = require('../config');

// Get tagihan pelanggan
router.get('/tagihan', (req, res) => {
    const query = 'SELECT * FROM tagihan';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Get tagihan pelanggan by id
router.get('/tagihan/:id', (req, res) => {
    const idTagihan = req.params.id;
    const query = 'SELECT * FROM tagihan WHERE id_tagihan = ?';
    db.query(query, [idTagihan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Tagihan not found' });
            } else {
                const tagihan = results[0];
                res.status(200).json(tagihan);
            }
        }
    });
});

// Get tagihan pelanggan by id_pelanggan
router.get('/tagihan/pelanggan/:id', (req, res) => {
    const idPelanggan = req.params.id;
    const query = 'SELECT t.* FROM pelanggan p JOIN tagihan t ON p.id_pelanggan = t.id_pelanggan WHERE p.id_pelanggan = ?';
    db.query(query, [idPelanggan], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
        else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Tagihan not found' });
            } else {
                const tagihan = results;
                res.status(200).json(tagihan);
            }
        }
    });
});

// Get tagihan pelanggan by status
router.get('/tagihan/status/:status', (req, res) => {
    const status = req.params.status;
    const query = 'SELECT * FROM tagihan WHERE status = ?';
    db.query(query, [status], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});



module.exports = router;