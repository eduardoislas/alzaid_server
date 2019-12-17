const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let patientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido paterno es requerido']
    },
    lastNameSecond: {
        type: String,
        required: false
    },
    birthdate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es requerida']
    },
    registerdate: {
        type: Date,
        required: false
    },
    img: {
        type: String,
        required: false,
        default: "Sin Foto"
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Patient', patientSchema)