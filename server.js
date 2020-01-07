// Archivo de configuraciones
require('./config/config.js')

//Importación de librerías
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json());

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


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});