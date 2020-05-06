const express = require('express');
const Scale = require('../models/scale');

const app = express();

////////////////////// AUTOEFICACIA ////////////////////////////
//Autodiagnóstico de autoeficacia
app.post('/scale', (req, res) => {
    let body = req.body;
    let scale = new Scale({
        date: body.date,
        answers: body.answers,
        scaleType: body.scaleType,
        scale: body.scale,
        caregiver: body.caregiver._id,
        valoration: body.valoration._id
    });
    scale.save((err, scaleDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        res.json({
            success: true,
            scale: scaleDB
        });
    });
});

//Obtener todos los registros de escalas por id del cuidador
app.get('/scale/:id', (req, res) => {
    let id = req.params.id;
    Scale.find({ caregiver: id })
        .sort('-date')
        .exec((err, scales) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            Scale.countDocuments({ caregiver: id }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    scales
                });
            });
        });
});


//Obtener todos los registros por id del cuidador y Tipo de escala
app.get('/scale/type/:id&:type', (req, res) => {
    let id = req.params.id;
    let type = int(req.params.type);
    Scale.find({ caregiver: id, scaleType: type })
        .sort('-date')
        .exec((err, scales) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            Scale.countDocuments({ caregiver: id, scaleType: type }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    scales
                });
            });
        });
});

//Obtener todos los registros por id del cuidador y valoración
app.get('/scale/val/:id&:idVal', (req, res) => {
    let id = req.params.id;
    let val = req.params.val;
    Scale.find({ caregiver: id, valoration: val })
        .sort('-date')
        .exec((err, scales) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            Scale.countDocuments({ caregiver: id, valoration: val }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    scales
                });
            });
        });
});


module.exports = app;