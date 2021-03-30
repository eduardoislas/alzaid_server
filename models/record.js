const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RecordSchema = new Schema({
    //Datos paciente
    id_patient: {
        type: String,
    },

    name: {
        type: String,
    },

    lastName: {
        type: String,
    },
    lastNameSecond: {
        type: String,
    },
    gender: {
        type: String,
    },
    phase: {
        type: String,
    },
    //Datos daily record
    dateDR: {
        type: Date
    },
    //Datos higiene
    h_incidence: {
        type: String
    },
    h_time: {
        type: String
    },
    h_observation: {
        type: String
    }
});


module.exports = mongoose.model('Record', RecordSchema)