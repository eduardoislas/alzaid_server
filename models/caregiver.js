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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
})




module.exports = mongoose.model('Caregiver', caregiverSchema)