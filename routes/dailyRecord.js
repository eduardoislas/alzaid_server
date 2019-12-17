const express = require('express');
const _ = require('underscore');

let { verificaToken } = require('../middlewares/authentication');

let app = express();

let DailyRecord = require('../models/dailyRecord');



//Obtiene todos los dailyRecords
app.get('/dailyRecord', (req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 10);
    DailyRecord.find({}, 'date exitHour patient')
        .skip(desde)
        .limit(limite)
        .sort('date')
        .populate('patient', 'name lastName')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            DailyRecord.countDocuments({}, (err, conteo) => {
                res.json({
                    success: true,
                    drs,
                    cuantos: conteo
                });
            })
        })
});


//Obtiene todos los dailyRecords por Paciente
app.get('/dailyRecord/patient/:id', (req, res) => {
    let idP = req.params.id;
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 10);
    DailyRecord.find({ patient: idP }, 'date exitHour patient')
        .skip(desde)
        .limit(limite)
        .sort('date')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            DailyRecord.countDocuments({ patient: idP }, (err, conteo) => {
                res.json({
                    success: true,
                    drs,
                    cuantos: conteo
                });
            })
        })
});

//Registra una asistencia en el DailyRecord
app.post('/dailyRecord/:id', verificaToken, (req, res) => {
    let idP = req.params.id;
    let fecha = new Date();
    let dailyRecord = new DailyRecord({
        date: fecha.setHours(fecha.getHours() - 7),
        patient: idP
    });

    dailyRecord.save((err, drDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            dailyRecord: drDB
        });
    });
});

//Registra la hora de salida en el dailyRecord
app.put('/dailyRecord/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let salida = new Date();
    salida = salida.setHours(salida.getHours() - 7);
    DailyRecord.findByIdAndUpdate(id, { exitHour: salida }, { new: true, runValidators: true }, (err, drDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        if (!drDB) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'El DailyRecord no existe'
                }
            });
        }
        res.json({
            success: true,
            dailyRecord: drDB
        })
    });
});


module.exports = app;