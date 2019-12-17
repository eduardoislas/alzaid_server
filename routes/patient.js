const express = require('express');
const _ = require('underscore');
const Patient = require('../models/patient');

const app = express();


//Obtener todos los pacientes activos
app.get('/patient', (req, res) => {
    //El parámetro status solicita los pacientes activos
    Patient.find({ status: true }, 'name lastName lastNameSecond birthdate registerdate img')
        .exec((err, patients) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            Patient.countDocuments({ status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    patients,
                    count: conteo
                });
            })
        })
})

//Agregar un Paciente a la BD
app.post('/patient', (req, res) => {
    let body = req.body;
    let patient = new Patient({
        name: body.name,
        lastName: body.lastName,
        lastNameSecond: body.lastNameSecond,
        birthdate: Date.parse(body.birthdate),
        registerdate: Date.parse(body.registerdate),
        img: body.img
    });

    patient.save((err, patientDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            patient: patientDB
        });
    });
});

//Editar un Paciente
app.put('/patient/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'lastName', 'lastNameSecond', 'birthdate', 'registerdate', 'img']);
    Patient.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, patientDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        if (!patientDB) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Paciente no encontrado'
                }
            });
        }
        res.json({
            success: true,
            patient: patientDB
        })
    });
})

//Eliminar un paciente
app.delete('/patient/:id', (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }
    Patient.findByIdAndUpdate(id, changeStatus, { new: true }, (err, patientDeleted) => {
        if (err) {
            return res.status(400).json({
                sucess: false,
                err
            });
        };
        if (!patientDeleted) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Paciente no encontrado'
                }
            })
        }
        res.json({
            success: true,
            patient: patientDeleted
        })
    })
});


module.exports = app;