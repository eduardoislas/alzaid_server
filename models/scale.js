const mongoose = require('mongoose');

let Schema = mongoose.Schema;

// Escalas:  
// 1 - Autoeficacia
// 2 - Ansiedad
// 3 - Depresión
// 4 - Sobrecarga
// 5 - Apoyo Social

let ScaleSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de registro es requerida']
    },
    answers: [{
        type: Number,
        required: true,
    }],
    score: {
        type: Number,
        required: true,
    },
    scaleType: {
        type: Number,
        required: true,
    },
    scale: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    caregiver: {
        type: Schema.Types.ObjectId,
        ref: 'Caregiver',
        required: true
    },
    valoration: {
        type: Schema.Types.ObjectId,
        ref: 'Valorations',
        required: true
    }
});



module.exports = mongoose.model('Scale', ScaleSchema);