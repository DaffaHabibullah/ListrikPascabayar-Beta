const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
    res.send('Server telah berjalan...');
});

app.use('/', require('./routes/user'));
app.use('/', require('./routes/pelanggan'));
app.use('/', require('./routes/tarif'));
app.use('/', require('./routes/penggunaan'));
app.use('/', require('./routes/tagihan'));
app.use('/', require('./routes/pembayaran'));



module.exports = app;