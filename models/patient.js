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
    phase: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
        required: [true, 'La fase es requerida']
    },
    img: {
        type: String,
        required: false,
        default: "Sin Foto"
    },
    status: {
        type: Boolean,
        default: true
    },
    phaseHistory: [{
        phase: {
            type: Schema.Types.ObjectId,
            ref: 'Catalog',
            required: true
        },
        date: {
            type: Date,
            required: [true, 'La fecha de Cambio de fase es requerida']
        },
        status: {
            type: Boolean,
            default: true
        }
    }]
});



module.exports = mongoose.model('Patient', patientSchema)