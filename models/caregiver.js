const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let caregiverSchema = new Schema({
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
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    civilStatus: {
        type: String,
        required: false
    },
    religion: {
        type: String,
        required: false
    },
    school: {
        type: String,
        required: false
    },
    occupation: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    relation: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registerdate: {
        type: Date,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
})




module.exports = mongoose.model('Caregiver', caregiverSchema)