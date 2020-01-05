const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let dailyRecordSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de Asistencia es requerida']
    },
    exitHour: {
        type: Date,
        required: false
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'El paciente es requerido']
    },
    vitalSigns: [{
        vitalSign: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: [true, 'La fecha de lectura es requerida']
        },
        value: {
            type: Number,
            required: true
        },
        valueB: {
            type: Number,
            required: false
        }
    }]
});


module.exports = mongoose.model('DailyRecord', dailyRecordSchema)