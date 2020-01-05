const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let notificationSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha es requerida']
    },
    expiration_date: {
        type: Date,
        required: [true, 'La fecha de vigencia es requerida']
    },
    high_priority: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida']
    },
    type: {
        type: String,
        required: true
    },
    area: [{
        type: String,
        required: true
    }],
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    user: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});





module.exports = mongoose.model('Notification', notificationSchema)