const express = require('express');
const router = express.Router();
const db = require('../config');

// Get daftar tarif
router.get('/tarif', (req, res) => {
    const query = 'SELECT * FROM tarif';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});



module.exports = router;