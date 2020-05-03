const express = require('express');
const HomeActivity = require('../models/homeActivity');
const BinnacleCaregiver = require('../models/binnaclecaregiver');

const app = express();

// Guarda actividades diarias para el hogar
app.post('/binnacle/homeactivity', (req, res) => {
    let body = req.body;
    let fechaInicial = new Date(body.date);
    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth();
    let anio = fechaInicial.getFullYear();
    let fecha = new Date(anio, mes, dia);
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
});


//Obtener el listado de actividades del hogar del día
app.get('/binnacle/homeactivity/today', (req, res) => {
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
                    cbsDB
                });
            });
        });
})



module.exports = app;