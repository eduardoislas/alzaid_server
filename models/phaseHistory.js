const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let phSchema = new Schema({
    phase: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
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
});

module.exports = mongoose.model('PH', phSchema)