const express = require('express');
const _ = require('underscore');

let { verificaToken } = require('../middlewares/authentication');

let app = express();

let DailyRecord = require('../models/dailyRecord');



//Obtiene todos los dailyRecords
app.get('/dailyRecord', (req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 100);
    DailyRecord.find({}, 'date exitHour patient')
        .skip(desde)
        .limit(limite)
        .sort('date')
        .populate('patient', 'name lastName lastNameSecond phase')
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
    let limite = Number(req.query.limite || 100);
    DailyRecord.find({ patient: idP }, 'date exitHour patient')
        .skip(desde)
        .limit(limite)
        .sort('date')
        .populate('patient', 'name lastName lastNameSecond')
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
app.post('/dailyRecord/:id', (req, res) => {
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
app.put('/dailyRecord/:id', (req, res) => {
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

// Guardar Signos vitales en el DailyRecord
app.put('/dailyRecord/vitalSign/:id', (req, res) => {
    let id = req.params.id;
    let signos = [{ vitalSign: '5e028a4371b134856e8cad3e', date: '2020-01-10', value: 120, valueB: 80 }, { vitalSign: '5e028a4371b134856e8cad41', date: '2020-01-10', value: 100 }];

    //console.log(signos);
    DailyRecord.findById(id, (err, drDB) => {
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
        for (let x of signos) {
            let a = {
                vitalSign: x.vitalSign,
                date: x.date,
                value: x.value,
                valueB: x.valueB
            };
            drDB.vitalSigns.push(a);
        };
        drDB.save((err, drSaved) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            res.json({
                success: true,
                patient: drSaved
            })
        });
    });
});





module.exports = app;