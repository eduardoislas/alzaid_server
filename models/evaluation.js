const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let EvaluationSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de registro es requerida']
    },
    score: {
        type: Number,
        required: true,
    },
    evaluationName: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    patientPhase: {
        type: String,
        required: false,
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
});



module.exports = mongoose.model('Evaluation', EvaluationSchema);