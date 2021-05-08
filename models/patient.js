const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let patientSchema = new Schema({
    expedient: {
        type: Number,
        required: false,
    },
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
    gender: {
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
        type: String,
        required: [true, 'La fase es requerida']
    },
    img: {
        type: String,
        required: false,
        default: "https://img.icons8.com/color/48/000000/matrix-architect.png"
    },
    status: {
        type: Boolean,
        default: true
    },
    phaseHistory: [{
        phase: {
            type: String,
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
    }],
    technicalSupport: [{
        name: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    diagnosis: [{
        name: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    allergies: [{
        name: {
            type: String,
            required: false
        }
    }],
    medicines: [{
        name: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    physicalLimitations: [{
        name: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    assistance: {
        type: Boolean,
        default: false
    },
    incidences: []
});



module.exports = mongoose.model('Patient', patientSchema)