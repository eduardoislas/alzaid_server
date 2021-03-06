const express = require('express');
const json2csv = require('json2csv').parse;

const DailyRecord = require('../models/dailyRecord');
const Record = require('../models/Record');

const app = express();

////////////////////////////  HIGIENE ////////////////////////////////

//Obtiene todos los registros de higiene de los pacientes
app.get('/queries/hygiene', (req, res) => {
    let record = new Record();
    let records = [];
    DailyRecord.find({})
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (h of x.hygiene) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        h_incidence: h.name,
                        h_time: h.time,
                        h_observation: h.observation
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});


//Obtiene todos los registros de higiene de un paciente por ID
app.get('/queries/hygiene/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    DailyRecord.find({ patient: id })
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (h of x.hygiene) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        h_incidence: h.name,
                        h_time: h.time,
                        h_observation: h.observation
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        })
});

////////////////////////////  FASE ////////////////////////////////
//Obtiene todos los registros de comportamientos de los pacientes
app.get('/queries/behaviors', (req, res) => {
    let record = new Record();
    let records = [];
    DailyRecord.find({})
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (b of x.behavior) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        behavior: b.name,
                        b_score: b.score
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

//Obtiene todos los registros de comportamientos de un paciente por Id
app.get('/queries/behaviors/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    DailyRecord.find({ patient: id })
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (b of x.behavior) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        behavior: b.name,
                        b_score: b.score
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

//Obtiene todos los registros de actividades de fase de los pacientes
app.get('/queries/activities', (req, res) => {
    let record = new Record();
    let records = [];
    DailyRecord.find({})
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (a of x.phaseBinnacle.activities) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        space_orientation: x.phaseBinnacle.orientation,
                        time_orientation: x.phaseBinnacle.date,
                        observation: x.phaseBinnacle.observation,
                        activity: a.name,
                        classification: a.classification,
                        b_score: a.performance
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

//Obtiene todos los registros de actividades de fase de un paciente por Id
app.get('/queries/activities/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    DailyRecord.find({ patient: id })
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (a of x.phaseBinnacle.activities) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        space_orientation: x.phaseBinnacle.orientation,
                        time_orientation: x.phaseBinnacle.date,
                        observation: x.phaseBinnacle.observation,
                        activity: a.name,
                        classification: a.classification,
                        b_score: a.performance
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});



////////////////////////////  ENFERMERIA ////////////////////////////////
//Obtiene todos los registros de signos vitales de los pacientes
app.get('/queries/vitalsigns', (req, res) => {
    let record = new Record();
    let records = [];
    DailyRecord.find({})
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (v of x.vitalSigns) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        vitalSign: v.vitalSign,
                        value: v.value,
                        value_b: v.valueB
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

//Obtiene todos los registros de signos vitales de un paciente por Id
app.get('/queries/vitalsigns/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    DailyRecord.find({ patient: id })
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (v of x.vitalSigns) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        vitalSign: v.vitalSign,
                        value: v.value,
                        value_b: v.valueB
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

////////////////////////////  FISIOTERAPIA ////////////////////////////////
//Obtiene todos los registros de actividades de fisioterapia de los pacientes
app.get('/queries/physio', (req, res) => {
    let record = new Record();
    let records = [];
    DailyRecord.find({})
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (a of x.physioBinnacle.activities) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        startMood: x.physioBinnacle.startMood,
                        endMood: x.physioBinnacle.endMood,
                        startTime: (x.physioBinnacle.startTime).getHours() + ":" + (x.physioBinnacle.startTime).getMinutes(),
                        endTime: (x.physioBinnacle.endTime).getHours() + ":" + (x.physioBinnacle.endTime).getMinutes(),
                        activity: a.name,
                        classification: a.classification,
                        b_score: a.performance
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

//Obtiene todos los registros de actividades de fisioterapia de un paciente por Id
app.get('/queries/physio/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    DailyRecord.find({ patient: id })
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                for (a of x.physioBinnacle.activities) {
                    record = {
                        id_patient: x.patient._id,
                        name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                        gender: x.patient.gender,
                        phase: x.patient.phase,
                        date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                        startMood: x.physioBinnacle.startMood,
                        endMood: x.physioBinnacle.endMood,
                        startTime: (x.physioBinnacle.startTime).getHours() + ":" + (x.physioBinnacle.startTime).getMinutes(),
                        endTime: (x.physioBinnacle.endTime).getHours() + ":" + (x.physioBinnacle.endTime).getMinutes(),
                        activity: a.name,
                        classification: a.classification,
                        b_score: a.performance
                    }
                    records.push(record);
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});

////////////////////////////  NUTRICION ////////////////////////////////
//Obtiene todos los registros de comida de los pacientes
app.get('/queries/nutrition', (req, res) => {
    let record = new Record();
    let records = [];
    DailyRecord.find({})
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                record = {
                    id_patient: x.patient._id,
                    name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                    gender: x.patient.gender,
                    phase: x.patient.phase,
                    date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                    foodType: x.meal.foodType,
                    meal_quantity: x.meal.quantity,
                    independence: x.meal.independence,
                    functional: x.meal.functional,
                    chewingPerformance: x.meal.chewingPerformance
                }
                records.push(record);
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        });
});


//Obtiene todos los registros de comida de un paciente por ID
app.get('/queries/nutrition/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    DailyRecord.find({ patient: id })
        .sort('-date')
        .populate('patient')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (x of drs) {
                record = {
                    id_patient: x.patient._id,
                    name: x.patient.name + " " + x.patient.lastName + " " + x.patient.lastNameSecond,
                    gender: x.patient.gender,
                    phase: x.patient.phase,
                    date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear(),
                    foodType: x.meal.foodType,
                    meal_quantity: x.meal.quantity,
                    independence: x.meal.independence,
                    functional: x.meal.functional,
                    chewingPerformance: x.meal.chewingPerformance
                }
                records.push(record);
            }
            res.json({
                success: true,
                cuantos: records.length,
                records: records
            });
        })
});

module.exports = app;