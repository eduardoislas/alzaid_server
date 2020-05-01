const express = require('express');
const HomeActivity = require('../models/homeActivity');

const app = express();

// Guarda actividades diarias para el hogar
app.post('/binnacle/homeactivity', (req, res) => {
    let body = req.body;
    let fechaInicial = new Date.UTC(body.date);
    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth();
    let anio = fechaInicial.getFullYear();
    let fecha = new Date.UTC(anio, mes, dia);
    let ha = new HomeActivity({
        date: fecha,
        type: body.type,
        activity: body.activity,
        phase: body.phase
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
    let fechaInicial = new Date.UTC();
    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth();
    let anio = fechaInicial.getFullYear();
    let fecha = new Date.UTC(anio, mes, dia);
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







module.exports = app;