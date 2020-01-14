const express = require('express');
const _ = require('underscore');

let { verificaToken } = require('../middlewares/authentication');

let app = express();

let DailyRecord = require('../models/dailyRecord');



//Obtiene todos los dailyRecords
app.get('/dailyRecord', (req, res) => {
    //let desde = Number(req.query.desde || 0);
    //let limite = Number(req.query.limite || 100);
    DailyRecord.find({})
        //.skip(desde)
        //.limit(limite)
        .sort('date')
        .populate('patient', 'name lastName lastNameSecond phase img')
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
                    cuantos: conteo,
                    drs
                });
            })
        })
});

//Obtiene todos los dailyRecords
app.get('/dailyRecord/today', (req, res) => {
    //let desde = Number(req.query.desde || 0);
    //let limite = Number(req.query.limite || 100);
    //let hoy = new Date();
    let ayer = new Date();
    let manana = new Date();
    let today = new Date();
    today.setHours(today.getHours() - 7);
    ayer = new Date(ayer.setDate(today.getDate() - 1));
    manana = new Date(manana.setDate(today.getDate() + 1));
    ayer.setHours(ayer.getHours() - 7);
    manana.setHours(manana.getHours() - 7);
    // ayer.setHours(today.getHours() - 7)
    // manana.setHours(today.getHours() - 7)
    // ayer.setDate(today.getDate() - 1);
    // manana.setDate(today.getDate() + 1);

    DailyRecord.find({ "date": { "$gte": ayer, "$lte": manana }, exit: false })
        //.skip(desde)
        //.limit(limite)
        .sort('date')
        .populate('patient', 'name lastName lastNameSecond phase img')
        .exec((err, drs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            DailyRecord.countDocuments({ "date": { "$gte": ayer, "$lte": manana }, exit: false }, (err, conteo) => {
                res.json({
                    success: true,
                    cuantos: conteo,
                    drs
                });
            })
        })
});

//Obtiene todos los dailyRecords por Paciente
app.get('/dailyRecord/patient/:id', (req, res) => {
    let idP = req.params.id;
    //let desde = Number(req.query.desde || 0);
    //let limite = Number(req.query.limite || 100);
    DailyRecord.find({ patient: idP })
        //.skip(desde)
        //.limit(limite)
        .sort('date')
        .populate('patient', 'name lastName lastNameSecond phase')
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
app.put('/dailyRecord/exit/:id', (req, res) => {
    let id = req.params.id;
    let salida = new Date();
    salida = salida.setHours(salida.getHours() - 7);
    DailyRecord.findByIdAndUpdate(id, { exitHour: salida, exit: true }, { new: true, runValidators: true, useFindAndModify: false }, (err, drDB) => {
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
    let signos = [{}];
    signos = req.body.vitalSigns;

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
            let fecha = new Date(x.date);
            let a = {
                vitalSign: x.vitalSign,
                date: fecha.setHours(fecha.getHours() - 7),
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

// Guardar attitudes en el DailyRecord
app.put('/dailyRecord/attitude/:id', (req, res) => {
    let id = req.params.id;
    let attitudes = [{ name: 'Delirio', time: 'Mañana', score: 4 }, { name: 'Enfado', time: 'Tarde', score: 3 }];

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
        for (let x of attitudes) {
            let a = {
                name: x.name,
                time: x.time,
                score: x.score
            };
            drDB.attitude.push(a);
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

// Guardar behaviors en el DailyRecord
app.put('/dailyRecord/behavior/:id', (req, res) => {
    let id = req.params.id;
    let behaviors = [{ name: 'Agresión', time: 'Mañana', score: 4 }, { name: 'Apatía', time: 'Tarde', score: 3 }];

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
        for (let x of behaviors) {
            let a = {
                name: x.name,
                time: x.time,
                score: x.score
            };
            drDB.behavior.push(a);
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

// Guardar crisis en el DailyRecord
app.put('/dailyRecord/crisis/:id', (req, res) => {
    let id = req.params.id;
    let crisis = { name: 'Llanto', time: 'Mañana', observation: 'Se siente solo(a)' };

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
        drDB.crisis.push(crisis);
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

// Guardar Hygiene en el DailyRecord
app.put('/dailyRecord/hygiene/:id', (req, res) => {
    let id = req.params.id;
    let higiene = [{ name: 'Micción', time: 'Mañana', observation: 'Normal' }, { name: 'Cambio de ropa', time: 'Tarde', observation: 'Incontinencia' }];

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
        for (let x of higiene) {
            let a = {
                name: x.name,
                time: x.time,
                observation: x.observation
            };
            drDB.hygiene.push(a);
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

// Guardar Apoyo técnico en el DailyRecord
app.put('/dailyRecord/technicalsupport/:id', (req, res) => {
    let id = req.params.id;
    let ts = [{ name: 'Andadera' }, { name: 'Aretes' }];

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
        for (let x of ts) {
            let a = {
                name: x.name
            };
            drDB.technicalSupport.push(a);
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


// Guardar Comida para el DailyRecord
app.put('/dailyRecord/meal/:id', (req, res) => {
    let id = req.params.id;
    //let meal = req.params.meal;
    //let meal = { type: 'Colacion', performance: 5 };
    let meal = { type: 'Comida', performance: 5, quantity: "Poco", foodType: "Papilla", independence: 4, functional: 3, chewingPerformance: 5 };
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
        let a = {
            type: meal.type,
            performance: meal.performance,
            quantity: meal.quantity,
            foodType: meal.foodType,
            independence: meal.independence,
            functional: meal.functional,
            chewingPerformance: meal.chewingPerformance
        };
        drDB.meal.push(a);
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