const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let binnacleCaregiverSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de registro es requerida']
    },
    answers: [{
        type: Number,
        required: true,
    }],
    caregiver: {
        type: Schema.Types.ObjectId,
        ref: 'Caregiver',
        required: true
    }
});



module.exports = mongoose.model('BinnacleCaregiver', binnacleCaregiverSchema);