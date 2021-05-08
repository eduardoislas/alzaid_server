const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let incidenceSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha es requerida']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida']
    },
    type: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Incidence', incidenceSchema)