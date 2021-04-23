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

//CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());



//Configuración global de rutas
app.use(require('./routes/index'));

//Servir el contenido público
app.use(express.static(__dirname + '/public'));

//Conexión a MongoDB
//let urlDB = "mongodb+srv://alzaid:alzaid2021@cluster0.amt3e.mongodb.net/Project 0?retryWrites=true&w=majority";
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