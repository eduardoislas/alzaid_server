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
        type: String,
        required: [true, 'La fase es requerida']
    },
    img: {
        type: String,
        required: false,
        default: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwj8mL_J4OjmAhVDjK0KHcgbCK4QjRx6BAgBEAQ&url=https%3A%2F%2Ficons8.com%2Ficon%2F23264%2Fuser&psig=AOvVaw3q3D2YXzYsh4nql7uXcbdd&ust=1578186381499122"
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
    }]
});



module.exports = mongoose.model('Patient', patientSchema)