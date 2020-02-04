const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN', 'USER', 'ENFERMERIA', 'FASE_INICIAL', 'FASE_INTERMEDIA', 'FASE_AVANZADA', 'HIGIENE', 'FISIOTERAPIA', 'NUTRICION', 'PSICOLOGO', 'FAMILIAR'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    lastNameSecond: {
        type: String,
        required: false
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('User', userSchema)