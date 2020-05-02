const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let homeActivitySchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        required: true
    },
    phase: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: false
    },
    resources: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model('HomeActivity', homeActivitySchema)