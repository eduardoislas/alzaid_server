const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let valorationsSchema = new Schema({
    year: {
        type: Number,
        required: true,
    },
    numPeriod: {
        type: Number,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
});



module.exports = mongoose.model('Valorations', valorationsSchema);