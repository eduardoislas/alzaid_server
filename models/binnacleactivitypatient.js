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
    }
});



module.exports = mongoose.model('BinnacleActivityPatient', binnacleActivityPatientSchema);