const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let dailyProgramSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    phase: {
        type: String,
        required: false
    },
    activities: [{
        name: {
            type: String,
            required: false
        },
        classification: {
            type: String,
            required: false
        }
    }]
});



module.exports = mongoose.model('DailyProgram', dailyProgramSchema);