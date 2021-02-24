// Puerto
process.env.PORT = process.env.PORT || 3000;
// process.env.PORT = process.env.PORT || 443;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Vencimiento de Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

// Seed de autenticación
process.env.SEED = process.env.SEED || 'seed-desarrollo'

// Base de Datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/alzaid';
    // urlDB = 'mongodb://74.208.247.106:27017/alzaid';   //PRODUCCION
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;