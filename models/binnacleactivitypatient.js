const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let binnacleActivityPatientSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de registro es requerida']
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'HomeActivity',
        required: true
    },
    answers: [{
        type: Number,
        required: true,
    }],
    difficulty: {
        type: String,
        required: false
    },
    observation: {
        type: String,
        required: false
    }
});



module.exports = mongoose.model('BinnacleActivityPatient', binnacleActivityPatientSchema);