const express = require('express');
const HomeActivity = require('../models/homeActivity');
const BinnacleCaregiver = require('../models/binnaclecaregiver');
const BinnaclePatient = require('../models/binnaclepatient');
const BinnacleActivityPatient = require('../models/binnacleactivitypatient');

let { verificaToken } = require('../middlewares/authentication');

const app = express();

// Guarda actividades diarias para el hogar
app.post('/binnacle/homeactivity', (req, res) => {
    let next = () => {
        let body = req.body;
        let fechaInicial = new Date(body.date);
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();
        let fecha = new Date(anio, mes, dia + 1);

        fecha.setHours(7);
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
    }

    verificaToken(req, res, next);

});


//Obtener una actividad por ID
app.get('/binnacle/homeactivity/id/:id', (req, res) => {
    let next = () => {
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

    }

    verificaToken(req, res, next);

})

//Obtener el listado de actividades del hogar del día
app.get('/binnacle/homeactivity/today', (req, res) => {
    let next = () => {
        let fechaInicial = new Date();
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();
        let fecha = new Date(anio, mes, dia);
        fecha.setHours(7);
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
    }

    verificaToken(req, res, next);

});

//Obtener el listado de actividades del hogar activas
app.get('/binnacle/homeactivity', (req, res) => {
    let next = () => {
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
    }

    verificaToken(req, res, next);

});

//Obtener el listado de actividades del hogar por fase
app.get('/binnacle/homeactivity/:fase', (req, res) => {
    let next = () => {
        let fase = req.params.fase;
        HomeActivity.find({ phase: fase, status: true })
            .sort('-date')
            .limit(7)
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

    }

    verificaToken(req, res, next);

});

//Desactivar una actividad
app.delete('/binnacle/homeactivity/:id', (req, res) => {
    let next = () => {
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
    }

    verificaToken(req, res, next);

});

/////////////////////////////////////////////////////////////////////
// Bitácora del cuidador
app.post('/binnacle/caregiver', (req, res) => {
    let next = () => {
        let body = req.body;
        let fechaInicial = new Date(body.date);
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();
        let fecha = new Date(anio, mes, dia + 1);
        fecha.setHours(7);

        let cb = new BinnacleCaregiver({
            date: fecha,
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
    }

    verificaToken(req, res, next);

});

//Obtener todos los registros de bitácora por id del cuidador
app.get('/binnacle/caregiver/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        BinnacleCaregiver.find({ caregiver: id })
            .sort('-date')
            .populate('caregiver')
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
    }

    verificaToken(req, res, next);

})

//Obtener la bitácora de cuidador por idBitácoraCuidador
app.get('/binnacle/caregiver/binnacle/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        BinnacleCaregiver.find({ _id: id })
            .sort('-date')
            .populate('caregiver')
            .exec((err, cbDB) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                BinnacleCaregiver.countDocuments({ _id: id }, (err, conteo) => {
                    res.json({
                        success: true,
                        count: conteo,
                        cbDB: cbDB
                    });
                });
            });
    }

    verificaToken(req, res, next);

})

///////////////////////////////////////////////////////////////////
// Bitácora del paciente

// Guarda la bitácora del paciente
app.post('/binnacle/patient', (req, res) => {
    let next = () => {
        let body = req.body;
        let fechaInicial = new Date(body.date);
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();
        let fecha = new Date(anio, mes, dia + 1);

        fecha.setHours(7);
        let pb = new BinnaclePatient({
            date: fecha,
            evacuation: body.evacuation,
            urination: body.urination,
            sleep: body.sleep,
            constipation: body.constipation,
            incontinence: body.incontinence,
            medicine: body.medicine,
            incidence: body.incidence,
            observation: body.observation,
            behaviors: body.behaviors,
            patient: body.patient
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
    }

    verificaToken(req, res, next);

});

//Obtener la bitácora de paciente por idpaciente
app.get('/binnacle/patient/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        BinnaclePatient.find({ patient: id })
            .sort('-date')
            .populate('patient')
            .exec((err, pbDB) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                BinnaclePatient.countDocuments({ patient: id }, (err, conteo) => {
                    res.json({
                        success: true,
                        count: conteo,
                        pbDB: pbDB
                    });
                });
            });
    }

    verificaToken(req, res, next);

})

//Obtener la bitácora de paciente por idBitácoraPaciente
app.get('/binnacle/patient/binnacle/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        BinnaclePatient.find({ _id: id })
            .sort('-date')
            .populate('patient')
            .exec((err, pbDB) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                BinnaclePatient.countDocuments({ _id: id }, (err, conteo) => {
                    res.json({
                        success: true,
                        count: conteo,
                        pbDB: pbDB
                    });
                });
            });
    }

    verificaToken(req, res, next);

})


///////////////////////////////////////////////////////////////////
// Bitácora de actividades del paciente
//Obtener la bitácora de actividades por paciente
app.get('/binnacle/patient/activity/:id', (req, res) => {

    let next = () => {
        let id = req.params.id;
        BinnacleActivityPatient.find({ patient: id })
            .sort('-date')
            .populate('patient')
            .populate('activity')
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
    }

    verificaToken(req, res, next);

})

//Obtener la bitácora de actividades por idBitácoraActividades
app.get('/binnacle/patient/activitybinnacle/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        BinnacleActivityPatient.find({ _id: id })
            .sort('-date')
            .populate('patient')
            .populate('activity')
            .exec((err, pabDB) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                BinnaclePatient.countDocuments({ patient: id }, (err, conteo) => {
                    res.json({
                        success: true,
                        count: conteo,
                        pabDB: pabDB
                    });
                });
            });

    }

    verificaToken(req, res, next);

})

//Obtener la bitácora de actividades 
app.get('/binnacle/patient/activity', (req, res) => {
    let next = () => {
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
    }

    verificaToken(req, res, next);

})

//Devuelve true si la actividad existe en las realizadas por paciente
app.get('/binnacle/patient/activitydone/:idp&:ida', (req, res) => {
    let next = () => {
        let idp = req.params.idp;
        let ida = req.params.ida;
        BinnacleActivityPatient.findOne({ patient: idp, activity: ida }, (err, pa) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            if (!pa) {
                res.json({
                    success: false,
                    pa
                });
            } else {
                res.json({
                    success: true,
                    pa
                });
            }
        });
    }

    verificaToken(req, res, next);

})

//Guardar un registro de bitácora de actividades
app.post('/binnacle/patient/activity', (req, res) => {
    let next = () => {
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
    }

    verificaToken(req, res, next);

});

module.exports = app;