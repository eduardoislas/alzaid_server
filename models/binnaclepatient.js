const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let binnaclePatientSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de registro es requerida']
    },
    evacuation: {
        type: Number,
        required: false,
    },
    urination: {
        type: Number,
        required: false,
    },
    sleep: {
        type: Number,
        required: false,
    },
    constipation: {
        type: Boolean,
        required: false,
    },
    incontinence: {
        type: Boolean,
        required: false,
    },
    medicine: {
        type: String,
        required: false,
    },
    incidence: {
        type: String,
        required: false,
    },
    observation: {
        type: String,
        required: false,
    },
    behaviors: [{
        type: Boolean,
        required: false,
    }],
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
});



module.exports = mongoose.model('BinnaclePatient', binnaclePatientSchema);