const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let selfEfficacySchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de registro es requerida']
    },
    answers: [{
        type: Number,
        required: true,
    }],
    scale: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    caregiver: {
        type: Schema.Types.ObjectId,
        ref: 'Caregiver',
        required: true
    }
});



module.exports = mongoose.model('SelfEfficacy', selfEfficacySchema);