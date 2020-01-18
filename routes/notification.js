const express = require('express');
const Notification = require('../models/notification');

const app = express();

//Obtiene todas las notificaciones
app.get('/notification', (req, res) => {
    //let desde = Number(req.query.desde || 0);
    //let limite = Number(req.query.limite || 100);
    let fecha = new Date();
    let vigentes = [];
    Notification.find({ status: true })
        //.skip(desde)
        //.limit(limite)
        .sort('date')
        .populate('patient', 'name lastName lastNameSecond phase')
        .exec((err, notifs) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            for (let x of notifs) {
                if (fecha < x.expiration_date) {
                    vigentes.push(x);
                } else {
                    x.status = false;
                    x.save((err, notificationDB) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                err
                            });
                        }
                    });
                }
            }
            res.json({
                success: true,
                vigentes,
                count: vigentes.length
            });
        });
});




//Registra una notificación
app.post('/notification', (req, res) => {
    let body = req.body;
    let fecha = new Date();
    let areas = [];

    for (x of body.areas) {
        areas.push(x);
    }

    let notification = new Notification({
        date: fecha,
        expiration_date: Date.parse(body.expiration),
        high_priority: body.priority,
        description: body.description,
        type: body.type,
        area: areas,
        patient: body.patient,
        user: body.user
    });

    notification.save((err, notificationDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            notification: notificationDB
        });
    });
});













module.exports = app;