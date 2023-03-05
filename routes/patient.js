const express = require("express");
const _ = require("underscore");
const Patient = require("../models/patient");
const Incidence = require("../models/incidence");
let { verificaToken } = require("../middlewares/authentication");
const fs = require("fs");
const path = require("path");
const app = express();

//Obtener todos los pacientes activos
app.get("/patient", (req, res) => {
    let next = () => {
        //El parámetro status solicita los pacientes activos
        Patient.find({ status: true }).exec((err, patients) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err,
                });
            }
            Patient.countDocuments({ status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    patients,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

//Devuelve un paciente por ID
app.get("/patient/id/:id", (req, res) => {
    let next = () => {
        let id = req.params.id;
        Patient.findById(id, (err, patient) => {
            if (err) {
                return res.status(500).json({
                    sucess: false,
                    err,
                });
            }
            if (!patient) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: "Paciente no encontrado",
                    },
                });
            }
            res.json({
                success: true,
                patient,
            });
        });
    };
    verificaToken(req, res, next);
});

//Obtener todos los pacientes activos por fase
app.get("/patient/:fase", (req, res) => {
    let next = () => {
        let fase = req.params.fase;
        let regex = new RegExp(fase, "i");
        //El parámetro status solicita los pacientes activos
        Patient.find({ status: true, phase: regex }, (err, patients) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                });
            }
            Patient.countDocuments({ status: true, phase: regex }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    patients,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

//Agregar un Paciente a la BD
app.post("/patient", (req, res) => {
    let next = () => {
        let body = req.body;
        let fecha = new Date();
        let ts = [];
        let pl = [];
        let med = [];
        let diag = [];
        let allergies = [];
        Patient.countDocuments({}, (err, conteo) => {
            let patient = new Patient({
                name: body.name,
                lastName: body.lastName,
                lastNameSecond: body.lastNameSecond,
                birthdate: Date.parse(body.birthdate),
                registerdate: Date.parse(body.registerdate),
                phase: body.phase,
                gender: body.gender,
                img: body.img,
            });
            //Historial de fase
            let ph = {
                phase: body.phase,
                date: fecha,
            };
            patient.phaseHistory = [ph];

            // Apoyo técnico
            for (let x of body.technicalSupport) {
                let a = { name: x };
                ts.push(a);
            }
            patient.technicalSupport = ts;

            //Diagnósticos
            for (let x of body.diagnosis) {
                let a = { name: x };
                diag.push(a);
            }
            patient.diagnosis = diag;

            //Alergias
            for (let x of body.allergies) {
                let a = { name: x };
                allergies.push(a);
            }
            patient.allergies = allergies;

            //Medicinas
            // for (let x of body.medicines) {
            //     let a = { name: x };
            //     med.push(a);
            // }
            // patient.medicines = med;

            //Limitaciones físicas
            for (let x of body.physicalLimitations) {
                let a = { name: x };
                pl.push(a);
            }
            patient.physicalLimitations = pl;

            //Expediente Autoincremental
            patient.expedient = conteo + 1;
            patient.save((err, patientDB) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err,
                    });
                }
                res.json({
                    success: true,
                    patient: patientDB,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

//Editar un paciente, actualizando su historial de Fase
app.put("/patient/:id", (req, res) => {
    let next = () => {
        let id = req.params.id;
        let body = req.body;
        let fecha = new Date();
        let ts = body.technicalSupport;
        let temp = [];
        Patient.findById(id, (err, patientDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                });
            }
            if (!patientDB) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: "Paciente no encontrado",
                    },
                });
            }
            let faseAnterior = patientDB.phase;
            patientDB.name = body.name;
            patientDB.lastName = body.lastName;
            patientDB.lastNameSecond = body.lastNameSecond;
            patientDB.birthdate = body.birthdate;
            patientDB.registerdate = body.registerdate;
            patientDB.img = body.img;
            patientDB.phase = body.phase;
            patientDB.gender = body.gender;
            // Si hubo cambios de Fase, se busca la fase activa del paciente y se cambia status a falso
            if (String(faseAnterior) !== String(patientDB.phase)) {
                for (let x of patientDB.phaseHistory) {
                    if (x.status == true) {
                        x.status = false;
                    }
                }
                let ph = {
                    phase: patientDB.phase,
                    date: fecha,
                };
                patientDB.phaseHistory.push(ph);
            }
            for (let x of ts) {
                let a = { name: x };
                temp.push(a);
            }
            patientDB.technicalSupport = temp;
            patientDB.diagnosis = body.diagnosis;
            patientDB.allergies = body.allergies;
            patientDB.medicines = body.medicines;
            patientDB.physicalLimitations = body.physicalLimitations;
            //Se manda a guardar el objeto Paciente con sus nuevos campos
            patientDB.save((err, patientSaved) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        err,
                    });
                }
                res.json({
                    success: true,
                    patient: patientSaved,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

//Eliminar un paciente
app.delete("/patient/:id", (req, res) => {
    let next = () => {
        let id = req.params.id;
        let changeStatus = {
            status: false,
        };
        Patient.findByIdAndUpdate(
            id,
            changeStatus, { new: true },
            (err, patientDeleted) => {
                if (err) {
                    return res.status(500).json({
                        sucess: false,
                        err,
                    });
                }
                if (!patientDeleted) {
                    return res.status(400).json({
                        success: false,
                        err: {
                            message: "Paciente no encontrado",
                        },
                    });
                }
                res.json({
                    success: true,
                    patient: patientDeleted,
                });
            }
        );
    };

    verificaToken(req, res, next);
});

//Editar un paciente, actualizando su campo de asistencia
app.put("/patient/assistance/:id", (req, res) => {
    let next = () => {
        let id = req.params.id;
        let body = req.body.assistance;
        Patient.findById(id, (err, patientDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                });
            }
            if (!patientDB) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: "Paciente no encontrado",
                    },
                });
            }
            patientDB.assistance = body;
            //Se manda a guardar el objeto Paciente con sus nuevos campos
            patientDB.save((err, patientSaved) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        err,
                    });
                }
                res.json({
                    success: true,
                    assistance: patientSaved.assistance,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

//Editar un paciente, actualizando su fase e historial de fase
app.put("/patient/changephase/:id", (req, res) => {
    let next = () => {
        let id = req.params.id;
        let body = req.body.newPhase;
        let fecha = new Date();
        Patient.findById(id, (err, patientDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                });
            }
            if (!patientDB) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: "Paciente no encontrado",
                    },
                });
            }
            let faseAnterior = patientDB.phase;
            patientDB.phase = body;
            // Si hubo cambios de Fase, se busca la fase activa del paciente y se cambia status a falso
            if (String(faseAnterior) !== String(patientDB.phase)) {
                for (let x of patientDB.phaseHistory) {
                    if (x.status == true) {
                        x.status = false;
                    }
                }
                let ph = {
                    phase: patientDB.phase,
                    date: fecha,
                };
                patientDB.phaseHistory.push(ph);
            }
            //Se manda a guardar el objeto Paciente con sus nuevos campos
            patientDB.save((err, patientSaved) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        err,
                    });
                }
                res.json({
                    success: true,
                    phase: patientSaved.phase,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

app.get("/patient/imagen/:img", (req, res) => {
    let next = () => {
        let img = req.params.img;

        let pathImagen = path.resolve(__dirname, `../uploads/patients/${img}`);

        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen);
        } else {
            let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");
            res.sendFile(noImagePath);
        }
    };

    verificaToken(req, res, next);
});

//Editar un paciente, actualizando su historial de incidencias
app.put("/patient/incidence/:id", (req, res) => {
    let next = () => {
        let id = req.params.id;
        let incidence = req.body.incidence;
        let fecha = new Date();
        fecha.setHours(0, 0, 0, 0);

        let incidenciaObjeto = new Incidence({
            date: fecha,
            description: incidence.description,
            type: incidence.type,
            user: incidence.user
        });

        Patient.findById(id, (err, patientDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err,
                });
            }
            if (!patientDB) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: "Paciente no encontrado",
                    },
                });
            }

            if (patientDB.incidences == undefined || patientDB.incidences == null) {
                patientDB.incidences = [];
            }

            patientDB.incidences.push(incidenciaObjeto);
            //Se manda a guardar el objeto Paciente con sus nuevos campos
            patientDB.save((err, patientSaved) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        err,
                    });
                }
                res.json({
                    success: true,
                    patient: patientSaved,
                });
            });
        });
    };

    verificaToken(req, res, next);
});

module.exports = app;