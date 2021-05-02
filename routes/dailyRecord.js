const express = require('express');
const _ = require('underscore');

let { verificaToken } = require('../middlewares/authentication');

let app = express();

let DailyRecord = require('../models/dailyRecord');
let DailyProgram = require('../models/dailyProgram');



//Obtiene todos los dailyRecords
app.get('/dailyRecord', (req, res) => {

    let next = () => {
        DailyRecord.find({})
            //.skip(desde)
            .limit(100)
            .sort('-date')
            .populate('patient')
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
    }

    verificaToken(req, res, next);
});

//Devuelve un DR por ID
app.get('/dailyrecord/id/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        DailyRecord.findById(id, (err, dr) => {
            if (err) {
                return res.status(500).json({
                    sucess: false,
                    err
                });
            };
            if (!dr) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: 'DR no encontrado'
                    }
                })
            }
            res.json({
                success: true,
                dr
            })
        }).populate('patient');
    }

    verificaToken(req, res, next);
})

//Obtiene todos los dailyRecords del dia de hoy
app.get('/dailyRecord/today', (req, res) => {

    let next = () => {
        //let desde = Number(req.query.desde || 0);
        //let limite = Number(req.query.limite || 100);
        let fechaInicial = new Date();
        fechaInicial.setHours(fechaInicial.getHours() - 7);
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();

        let fecha = new Date(anio, mes, dia, 0, 0, 0, 0);
        fecha.setHours(fecha.getHours() - 7);
        let manana = new Date(anio, mes, dia + 1, 0, 0, 0, 0);
        manana.setHours(manana.getHours() - 7);

        DailyRecord.find({ date: { "$gte": fecha, "$lt": manana } })
            //.skip(desde)
            //.limit(limite)
            .sort('date')
            .populate('patient')
            .exec((err, drs) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                DailyRecord.countDocuments({ date: { "$gte": fecha, "$lt": manana } }, (err, conteo) => {
                    res.json({
                        success: true,
                        cuantos: conteo,
                        drs
                    });
                })
            })
    }

    verificaToken(req, res, next);
});


//Obtiene todos los dailyRecords del día por fase
// app.get('/dailyRecord/today/:fase', (req, res) => {
//     //let desde = Number(req.query.desde || 0);
//     //let limite = Number(req.query.limite || 100);
//     let fechaInicial = new Date();
//     let dia = fechaInicial.getDate();
//     let mes = fechaInicial.getMonth();
//     let anio = fechaInicial.getFullYear();

//     let fecha = new Date(anio, mes, dia);

//     let fase = req.params.fase;
//     let regex = new RegExp(fase, 'i');

//     let dr = []

//     DailyRecord.find({ date: { $eq: fecha } })
//         //.skip(desde)
//         //.limit(limite)
//         .sort('date')
//         .populate('patient', 'name lastName lastNameSecond phase img')
//         .exec((err, drs) => {
//             if (err) {
//                 return res.status(400).json({
//                     success: false,
//                     err
//                 });
//             }
//             for (x of drs){
//                 if ( x.patient.phase)
//             }
//             DailyRecord.countDocuments({ date: { $eq: fecha } }, (err, conteo) => {
//                 res.json({
//                     success: true,
//                     cuantos: conteo,
//                     drs
//                 });
//             })
//         })
// });

//Obtiene todos los dailyRecords por fecha dada
app.get('/dailyRecord/date/:date', (req, res) => {

    let next = () => {
        //let desde = Number(req.query.desde || 0);
        //let limite = Number(req.query.limite || 100);
        let fechaInicial = new Date(req.params.date);
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();

        let fecha = new Date(anio, mes, dia);
        let manana = new Date(anio, mes, dia + 1);
        DailyRecord.find({ date: { "$gte": fecha, "$lt": manana } })
            //.skip(desde)
            //.limit(limite)
            .sort('date')
            .populate('patient')
            .exec((err, drs) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                DailyRecord.countDocuments({ date: { "$gte": fecha, "$lt": manana } }, (err, conteo) => {
                    res.json({
                        success: true,
                        cuantos: conteo,
                        drs
                    });
                });
            });
    }


    verificaToken(req, res, next);

});

//Obtiene todos los dailyRecords por Paciente
app.get('/dailyRecord/patient/:id', (req, res) => {
    let next = () => {
        let idP = req.params.id;
        //let desde = Number(req.query.desde || 0);
        //let limite = Number(req.query.limite || 100);
        DailyRecord.find({ patient: idP })
            //.skip(desde)
            //.limit(limite)
            .sort('-date')
            .populate('patient')
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
                        cuantos: conteo,
                        drs: drs
                    });
                })
            })
    }


    verificaToken(req, res, next);

});

//Obtiene el daily record de hoy de un paciente determinado
app.get('/dailyRecord/today/id/:id', (req, res) => {
    let next = () => {
        let idP = req.params.id;
        console.log(idP);
        let fechaInicial = new Date();
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();

        let fecha = new Date(anio, mes, dia);
        let manana = new Date(anio, mes, dia + 1);

        DailyRecord.find({ date: { "$gte": fecha, "$lt": manana }, patient: idP })
            .sort('date')
            .populate('patient')
            .exec((err, drs) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                DailyRecord.countDocuments({ date: { "$gte": fecha, "$lt": manana }, patient: idP }, (err, conteo) => {
                    res.json({
                        success: true,
                        cuantos: conteo,
                        drs
                    });
                })
            })
    }


    verificaToken(req, res, next);

});

//Registra una asistencia en el DailyRecord
app.post('/dailyRecord/:id', (req, res) => {
    let next = () => {
        let idP = req.params.id;
        let fechaInicial = new Date();
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();
        let fecha = new Date(anio, mes, dia);
        let dailyRecord = new DailyRecord({
            date: fecha.setHours(fecha.getHours() - 7),
            //date: fecha,
            enterHour: fechaInicial,
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
    }


    verificaToken(req, res, next);

});

//Registra la hora de salida en el dailyRecord
app.put('/dailyRecord/exit/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let salida = new Date();
        // salida = salida.setHours(salida.getHours() - 7);
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
    }


    verificaToken(req, res, next);

});

// Guardar Signos vitales en el DailyRecord
app.put('/dailyRecord/vitalSign/:id', (req, res) => {
    let next = () => {
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
                    date: fecha,
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
    }


    verificaToken(req, res, next);

});


// Guardar behaviors en el DailyRecord
app.put('/dailyRecord/behavior/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let behaviors = [{}];
        behaviors = req.body.behaviors;

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

    }

    verificaToken(req, res, next);

});

// Guardar Hygiene en el DailyRecord
app.put('/dailyRecord/hygiene/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let hygiene = [{}];
        hygiene = req.body.hygiene;

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
            for (let x of hygiene) {
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

    }

    verificaToken(req, res, next);

});

// Guardar Apoyo técnico en el DailyRecord
app.put('/dailyRecord/technicalsupport/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let ts = [];
        ts = req.body.ts;

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
                drDB.technicalSupport.push(x);
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
    }


    verificaToken(req, res, next);

});


// Guardar Comida para el DailyRecord
app.put('/dailyRecord/meal/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let meal = {}
        meal = req.body.meal;
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
                quantity: meal.quantity,
                foodType: meal.foodType,
                independence: meal.independence,
                functional: meal.functional,
                chewingPerformance: meal.chewingPerformance
            };
            drDB.meal = a;
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
    }


    verificaToken(req, res, next);

});

app.post('/dailyRecord/dp/dailyProgram', (req, res) => {
    let next = () => {
        //Guardar fecha sin horas
        let fechaInicial = new Date();
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();

        let fecha = new Date(anio, mes, dia);

        let acts = req.body.activities;
        let attention = [];
        let calculus = [];
        let sensory = [];
        let language = [];
        let memory = [];
        let reminiscence = [];
        for (x of acts.attention) {
            let a = {
                name: x.name,
                classification: x.classification
            }
            attention.push(a);
        }
        for (x of acts.calculus) {
            let a = {
                name: x.name,
                classification: x.classification
            }
            calculus.push(a);
        }
        for (x of acts.sensory) {
            let a = {
                name: x.name,
                classification: x.classification
            }
            sensory.push(a);
        }
        for (x of acts.language) {
            let a = {
                name: x.name,
                classification: x.classification
            }
            language.push(a);
        }
        for (x of acts.memory) {
            let a = {
                name: x.name,
                classification: x.classification
            }
            memory.push(a);
        }
        for (x of acts.reminiscence) {
            let a = {
                name: x.name,
                classification: x.classification
            }
            reminiscence.push(a);
        }
        let dailyProgram = new DailyProgram({
            date: fecha,
            phase: req.body.phase,
            activities: {
                attention: attention,
                calculus: calculus,
                sensory: sensory,
                language: language,
                memory: memory,
                reminiscence: reminiscence
            }
        });
        dailyProgram.save((err, dpDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            res.json({
                success: true,
                dailyProgram: dpDB
            });
        });
    }


    verificaToken(req, res, next);

});

//Obtiene los dailYProgram
app.get('/dailyRecord/dp/dailyProgram', (req, res) => {
    let next = () => {
        //let desde = Number(req.query.desde || 0);
        //let limite = Number(req.query.limite || 100);
        DailyProgram.find({})
            //.skip(desde)
            //.limit(limite)
            .sort('date')
            .exec((err, dps) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                DailyProgram.countDocuments({}, (err, conteo) => {
                    res.json({
                        success: true,
                        cuantos: conteo,
                        dps
                    });
                })
            })
    }


    verificaToken(req, res, next);

});

//Obtiene dailYProgram de hoy por fase
app.get('/dailyRecord/dp/dailyProgram/:fase', (req, res) => {
    let next = () => {
        //Crear fecha de hoy para usar en filtro
        let fechaInicial = new Date();
        let dia = fechaInicial.getDate();
        let mes = fechaInicial.getMonth();
        let anio = fechaInicial.getFullYear();
        let fecha = new Date(anio, mes, dia);
        let manana = new Date(anio, mes, dia + 1);

        let fase = req.params.fase;
        let regex = new RegExp(fase, 'i');
        DailyProgram.findOne({ date: { "$gte": fecha, "$lt": manana }, phase: regex })
            .sort('date')
            .exec((err, dps) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err
                    });
                }
                DailyProgram.countDocuments({ date: { "$gte": fecha, "$lt": manana }, phase: regex }, (err, conteo) => {
                    res.json({
                        success: true,
                        cuantos: conteo,
                        dps
                    });
                })
            })
    }


    verificaToken(req, res, next);

});

// Guarda Bitácora de actividades de fase en DailyRecord
app.put('/dailyRecord/phase/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let body = req.body.phaseBinnacle;
        let acts = [];
        for (x of body.activities) {
            let a = {
                name: x.name,
                classification: x.classification,
                performance: x.performance
            }
            acts.push(a);
        }
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
                orientation: body.orientation,
                date: body.date,
                observation: body.observation,
                activities: acts,
                status: true
            };
            drDB.phaseBinnacle = a;
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
    }


    verificaToken(req, res, next);

});


// Guarda Bitácora de actividades de Fisio en DailyRecord
app.put('/dailyRecord/physio/:id', (req, res) => {
    let next = () => {
        let id = req.params.id;
        let body = req.body.physioBinnacle;
        let acts = [];
        for (x of body.activities) {
            let a = {
                name: x.name,
                classification: x.classification,
                performance: x.performance
            }
            acts.push(a);
        }
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
                startMood: body.startMood,
                endMood: body.endMood,
                startTime: body.startTime,
                endTime: body.endTime,
                activities: acts,
                status: true
            };
            drDB.physioBinnacle = a;
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
    }


    verificaToken(req, res, next);

});

// Guarda activación física masivamente en DalyRecord 
app.put('/dailyRecord/physio/activation/todos', (req, res) => {
    let next = () => {
        let activation = req.body.activation;
        promesas = []
        for (x of activation) {
            promesas.push(insertarRegistroActivacion(x.id, x.performance))
        }
        Promise.all(promesas)
            .then(respuestas => {
                res.status(200).json({
                    success: true,
                    respuestas
                })
            })
    }


    verificaToken(req, res, next);

})


function insertarRegistroActivacion(id, performance) {
    return new Promise((resolve, reject) => {
        DailyRecord.findById(id, (err, drDB) => {
            if (err) {
                reject('Error al buscar DailyRecord', err);
            } else {
                drDB.physicalActivation = performance;
                drDB.save((err, drSaved) => {
                    if (err) {
                        reject('Error al guardar activación física', err);
                    } else {
                        resolve(drSaved);
                    }
                });
            };
        });
    })
}

// Guarda colación en Daily Record 
app.put('/dailyRecord/meal/collation/todos', (req, res) => {
    let next = () => {
        let collation = req.body.collation;
        promesas = []
        for (x of collation) {
            promesas.push(insertarCollation(x.id, x.performance))
        }
        Promise.all(promesas)
            .then(respuestas => {
                res.status(200).json({
                    success: true,
                    respuestas
                })
            })
    }


    verificaToken(req, res, next);

})

function insertarCollation(id, performance) {
    return new Promise((resolve, reject) => {
        DailyRecord.findById(id, (err, drDB) => {
            if (err) {
                reject('Error al buscar DailyRecord', err);
            } else {
                drDB.collation = performance;
                drDB.save((err, drSaved) => {
                    if (err) {
                        reject('Error al guardar colación', err);
                    } else {
                        resolve(drSaved);
                    }
                });
            };
        });
    })
}



module.exports = app;