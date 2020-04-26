const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let homeBinnacleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registerdate: {
        type: Date,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
})




module.exports = mongoose.model('HomeBinnacle', homeBinnacleSchema)