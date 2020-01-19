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
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
    }]
});



module.exports = mongoose.model('DailyProgram', dailyProgramSchema);