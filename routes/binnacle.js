const express = require('express');
const HomeActivity = require('../models/homeActivity');
const BinnacleCaregiver = require('../models/binnaclecaregiver');
const BinnacleActivityPatient = require('../models/binnacleactivitypatient');

const app = express();

// Guarda actividades diarias para el hogar
app.post('/binnacle/homeactivity', (req, res) => {
    let body = req.body;
    let fechaInicial = new Date(body.date);
    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth();
    let anio = fechaInicial.getFullYear();
    let fecha = new Date(anio, mes, dia);
    // console.log(fecha);
    // fecha.setHours(7);
    // console.log(fecha);
    let ha = new HomeActivity({
        date: fecha,
        type: body.type,
        activity: body.activity,
        phase: body.phase,
        instructions: body.instructions,
        resources: body.resources
    });
    ha.save((err, haDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            homeactivityDB: haDB
        });
    });
});


//Obtener una actividad por ID
app.get('/binnacle/homeactivity/id/:id', (req, res) => {
    let id = req.params.id;
    HomeActivity.findById(id, (err, ha) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err: err
            });
        };
        if (!ha) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Actividad no encontrada'
                }
            })
        }
        res.json({
            success: true,
            ha: ha
        });
    });
})

//Obtener el listado de actividades del hogar del día
app.get('/binnacle/homeactivity/today', (req, res) => {
    let fechaInicial = new Date();
    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth();
    let anio = fechaInicial.getFullYear();
    let fecha = new Date(anio, mes, dia);
    //fecha.setHours(7);
    //let manana = new Date(anio, mes, dia + 1);
    //{ date: { "$gte": fecha, "$lt": manana } }
    HomeActivity.find({ date: fecha, status: true })
        .sort('date')
        .exec((err, has) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            HomeActivity.countDocuments({ date: fecha, status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    has
                });
            })
        })
});

//Obtener el listado de actividades del hogar activas
app.get('/binnacle/homeactivity', (req, res) => {
    HomeActivity.find({ status: true })
        .sort('-date')
        .exec((err, has) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            HomeActivity.countDocuments({ status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    has
                });
            })
        })
});

//Obtener el listado de actividades del hogar por fase
app.get('/binnacle/homeactivity/:fase', (req, res) => {
    let fase = req.params.fase;
    HomeActivity.find({ phase: fase, status: true })
        .sort('-date')
        .exec((err, has) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err: err
                });
            }
            HomeActivity.countDocuments({ phase: fase, status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    has: has
                });
            })
        })
});

//Desactivar una actividad
app.delete('/binnacle/homeactivity/:id', (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }
    HomeActivity.findByIdAndUpdate(id, changeStatus, { new: true }, (err, haDeleted) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err
            });
        };
        if (!haDeleted) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Actividad no encontrada'
                }
            })
        }
        res.json({
            success: true,
            homeActivity: haDeleted
        })
    })
});

/////////////////////////////////////////////////////////////////////
// Bitácora del cuidador
app.post('/binnacle/caregiver', (req, res) => {
    let body = req.body;
    let cb = new BinnacleCaregiver({
        date: body.date,
        answers: body.answers,
        caregiver: body.caregiver._id
    });
    cb.save((err, cbDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        res.json({
            success: true,
            cbDB: cbDB
        });
    });
});

//Obtener todos los registros de bitácora por id del cuidador
app.get('/binnacle/caregiver/:id', (req, res) => {
    let id = req.params.id;
    BinnacleCaregiver.find({ caregiver: id })
        .sort('-date')
        .exec((err, cbsDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            BinnacleCaregiver.countDocuments({ caregiver: id }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    cbsDB: cbsDB
                });
            });
        });
})

///////////////////////////////////////////////////////////////////
// Bitácora del paciente

//Obtener la bitácora de actividades por paciente
app.get('/binnacle/patient/activity/:id', (req, res) => {
    let id = req.params.id;
    BinnacleActivityPatient.find({ patient: id })
        .sort('-date')
        .limit(5)
        .exec((err, pabDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            BinnacleActivityPatient.countDocuments({ patient: id }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    pabDB: pabDB
                });
            });
        });
})

//Obtener la bitácora de actividades 
app.get('/binnacle/patient/activity', (req, res) => {
    BinnacleActivityPatient.find({})
        .sort('-date')
        .exec((err, pabDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            BinnacleActivityPatient.countDocuments({}, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    pabDB: pabDB
                });
            });
        });
})

//Devuelve true si la actividad existe en las realizadas por paciente
app.get('/binnacle/patient/activitydone/:idp&:ida', (req, res) => {
    let idp = req.params.idp;
    let ida = req.params.ida;
    BinnacleActivityPatient.findOne({ patient: idp, activity: ida })
        .exec((pa) => {
            if (!pa) {
                res.json({
                    success: false,
                })
            } else {
                res.json({
                    success: true
                });
            }

        });
})

//Guardar un registro de bitácora de actividades
app.post('/binnacle/patient/activity', (req, res) => {
    let body = req.body;
    let pb = new BinnacleActivityPatient({
        date: body.date,
        patient: body.patient,
        activity: body.activity,
        answers: body.answers,
        difficulty: body.difficulty,
        observation: body.observation
    });
    pb.save((err, pbDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: err
            });
        }
        res.json({
            success: true,
            pbDB: pbDB
        });
    });
});

module.exports = app;