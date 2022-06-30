const express = require('express');

const DailyRecord = require('../models/dailyRecord');
const Patient = require("../models/patient")
const Record = require('../models/record');

const app = express();

////////////////////////////  HIGIENE ////////////////////////////////
//Obtiene todos los registros de higiene de los pacientes
app.get('/queries/hygiene', (req, res) => {
    let record = new Record();
    let records = [];
    let bano = 0;
    let protectores = 0;
    let ropa = 0;
    let estrenimiento = 0;
    let evacuacion = 0;
    let miccion = 0;
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
            for (r of records) {
                if (r.h_incidence === "Baño") {
                    bano++;
                } else if (r.h_incidence === "Cambio de protectores") {
                    protectores++;
                } else if (r.h_incidence === "Estreñimiento") {
                    estrenimiento++;
                } else if (r.h_incidence === "Cambio de ropa") {
                    ropa++;
                } else if (r.h_incidence === "Evacuación") {
                    evacuacion++;
                } else if (r.h_incidence === "Micción") {
                    miccion++;
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                bano,
                protectores,
                estrenimiento,
                ropa,
                evacuacion,
                miccion,
                records: records
            });
        });
});


//Obtiene todos los registros de higiene de un paciente por ID
app.get('/queries/hygiene/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    let bano = 0;
    let protectores = 0;
    let ropa = 0;
    let estrenimiento = 0;
    let evacuacion = 0;
    let miccion = 0;
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
            for (r of records) {
                if (r.h_incidence === "Baño") {
                    bano++;
                } else if (r.h_incidence === "Cambio de protectores") {
                    protectores++;
                } else if (r.h_incidence === "Estreñimiento") {
                    estrenimiento++;
                } else if (r.h_incidence === "Cambio de ropa") {
                    ropa++;
                } else if (r.h_incidence === "Evacuación") {
                    evacuacion++;
                } else if (r.h_incidence === "Micción") {
                    miccion++;
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                bano,
                protectores,
                estrenimiento,
                ropa,
                evacuacion,
                miccion,
                records: records
            });
        })
});

////////////////////////////  FASE ////////////////////////////////
//Obtiene todos los registros de comportamientos de los pacientes
app.get('/queries/behaviors', (req, res) => {
    let record = new Record();
    let records = [];
    let actRep = 0;
    let agresividad = 0;
    let ansiedad = 0;
    let apatia = 0;
    let cambioHumor = 0;
    let deambulacion = 0;
    let delirios = 0;
    let demAtencion = 0;
    let enfado = 0;
    let llanto = 0;
    let sexual = 0;
    let somnolencia = 0;
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
            for (r of records) {
                if (r.behavior === "Actitudes repetitivas") {
                    actRep++;
                } else if (r.behavior === "Agresividad") {
                    agresividad++;
                } else if (r.behavior === "Ansiedad") {
                    ansiedad++;
                } else if (r.behavior === "Apatía") {
                    apatia++;
                } else if (r.behavior === "Cambio de Humor") {
                    cambioHumor++;
                } else if (r.behavior === "Deambulación") {
                    deambulacion++;
                } else if (r.behavior === "Delirios") {
                    deambulacion++;
                } else if (r.behavior === "Demandante de atención") {
                    demAtencion++;
                } else if (r.behavior === "Enfado/Molestia") {
                    enfado++;
                } else if (r.behavior === "Llanto") {
                    llanto++;
                } else if (r.behavior === "Sexual") {
                    sexual++;
                } else if (r.behavior === "Somnolencia") {
                    somnolencia++;
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                actRep,
                agresividad,
                ansiedad,
                apatia,
                cambioHumor,
                deambulacion,
                delirios,
                demAtencion,
                enfado,
                llanto,
                sexual,
                somnolencia,
                records: records
            });
        });
});

//Obtiene todos los registros de comportamientos de un paciente por Id
app.get('/queries/behaviors/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    let actRep = 0;
    let agresividad = 0;
    let ansiedad = 0;
    let apatia = 0;
    let cambioHumor = 0;
    let deambulacion = 0;
    let delirios = 0;
    let demAtencion = 0;
    let enfado = 0;
    let llanto = 0;
    let sexual = 0;
    let somnolencia = 0;
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
            for (r of records) {
                if (r.behavior === "Actitudes repetitivas") {
                    actRep++;
                } else if (r.behavior === "Agresividad") {
                    agresividad++;
                } else if (r.behavior === "Ansiedad") {
                    ansiedad++;
                } else if (r.behavior === "Apatía") {
                    apatia++;
                } else if (r.behavior === "Cambio de Humor") {
                    cambioHumor++;
                } else if (r.behavior === "Deambulación") {
                    deambulacion++;
                } else if (r.behavior === "Delirios") {
                    deambulacion++;
                } else if (r.behavior === "Demandante de atención") {
                    demAtencion++;
                } else if (r.behavior === "Enfado/Molestia") {
                    enfado++;
                } else if (r.behavior === "Llanto") {
                    llanto++;
                } else if (r.behavior === "Sexual") {
                    sexual++;
                } else if (r.behavior === "Somnolencia") {
                    somnolencia++;
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                actRep,
                agresividad,
                ansiedad,
                apatia,
                cambioHumor,
                deambulacion,
                delirios,
                demAtencion,
                enfado,
                llanto,
                sexual,
                somnolencia,
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
    let presion = 0;
    let glucosa = 0;
    let frecardiaca = 0;
    let oxigeno = 0;
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
            for (r of records) {
                if (r.vitalSign === "Presion arterial") {
                    presion++;
                } else if (r.vitalSign === "Glucosa") {
                    glucosa++;
                } else if (r.vitalSign === "Frecuencia cardiaca") {
                    frecardiaca++;
                } else if (r.vitalSign === "Saturacion de oxigeno") {
                    oxigeno++;
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                presion,
                glucosa,
                frecardiaca,
                oxigeno,
                records: records
            });
        });
});

//Obtiene todos los registros de signos vitales de un paciente por Id
app.get('/queries/vitalsigns/:id', (req, res) => {
    let id = req.params.id;
    let record = new Record();
    let records = [];
    let presion = 0;
    let glucosa = 0;
    let frecardiaca = 0;
    let oxigeno = 0;
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
            for (r of records) {
                if (r.vitalSign === "Presion arterial") {
                    presion++;
                } else if (r.vitalSign === "Glucosa") {
                    glucosa++;
                } else if (r.vitalSign === "Frecuencia cardiaca") {
                    frecardiaca++;
                } else if (r.vitalSign === "Saturacion de oxigeno") {
                    oxigeno++;
                }
            }
            res.json({
                success: true,
                cuantos: records.length,
                presion,
                glucosa,
                frecardiaca,
                oxigeno,
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


////////////////////////////  Pacientes ////////////////////////////////
//Obtiene la lista de todos los pacientes

app.get("/queries/patients", (req, res) => {

    //El parámetro status solicita los pacientes activos
    Patient.find().exec((err, patients) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        Patient.countDocuments((err, conteo) => {
            res.json({
                success: true,
                count: conteo,
                patients,
            });
        });
    });

});


app.get('/queries/dailyrecord', (req, res) => {
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
                    date: x.date.getDate() + "/" + (x.date.getMonth() + 1) + "/" + x.date.getFullYear()
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



module.exports = app;