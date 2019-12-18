const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let catalogSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    type: {
        type: String,
        required: [true, 'El tipo es requerido']
    },
    status: {
        type: Boolean,
        default: true
    }
});





module.exports = mongoose.model('Catalog', catalogSchema)