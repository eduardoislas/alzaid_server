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
    activities: {
        attention: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            }
        }],
        calculus: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            }
        }],
        sensory: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            }
        }],
        language: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            }
        }],
        memory: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            }
        }],
        reminiscence: [{
            name: {
                type: String,
                required: false
            },
            classification: {
                type: String,
                required: false
            }
        }]
    }
});



module.exports = mongoose.model('DailyProgram', dailyProgramSchema);