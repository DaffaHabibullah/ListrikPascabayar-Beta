const app = require('./index.js');

app.listen(9000, () => {
    console.log('Server berjalan di http://localhost:9000');
}).on('error', (e) => {
    console.log('Error: ', e);
});