// Archivo de configuraciones
require('./config/config.js')

//HTTPS
const fs = require('fs');
const https = require('https');

//Importación de librerías
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json());

//CORS
app.use(cors())

//Configuración global de rutas
app.use(require('./routes/index'));

//Servir el contenido público
app.use(express.static(__dirname + '/public'));


//Conexión a MongoDB
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });

//Crear Servidor HTTPS
// https.createServer({
//     key: fs.readFileSync('acislab_key.key'),
//     cert: fs.readFileSync('acislab_crt.crt')
// }, app).listen(process.env.PORT, () => {
//     console.log('Escuchando puerto: ', process.env.PORT);
// });



//Crear Servidor
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});