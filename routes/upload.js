const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const Patient = require('../models/patient');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({
    useTempFiles: true,
}));

//Guardar fotos de pacientes
app.put('/upload/:id', function(req, res) {

    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                success: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            })
    }

    // Validar extensión
    let file = req.files.file;
    let nameFileCut = file.name.split('.');
    let extension = nameFileCut[nameFileCut.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                success: false,
                err: {
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
                }
            })
    }

    // Cambiar nombre al archivo
    let nameFile = `${id}-${ new Date().getMilliseconds() }.${extension}`

    file.mv(`uploads/patients/${ nameFile }`, (err) => {
        if (err)
            return res.status(500).json({
                success: false,
                err
            });

        imagePatient(id, res, nameFile)

    })
});


function imagePatient(id, res, nameFile) {
    Patient.findById(id, (err, patientDB) => {
        if (err) {
            borraImagen(nameFile);
            return res.status(500).json({
                success: false,
                err
            });
        }
        if (!patientDB) {
            borraImagen(nameFile);
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Paciente no encontrado'
                }
            });
        }

        borraImagen(patientDB.img);

        patientDB.img = nameFile;
        patientDB.save((err, patientSaved) => {

            res.json({
                success: true,
                patient: patientSaved
            })
        })
    })
}

function borraImagen(nameFile) {
    // Validar si existe imagen
    let pathImagen = path.resolve(__dirname, `../uploads/patients/${nameFile}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;