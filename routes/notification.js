const express = require('express');
const Notification = require('../models/notification');

const app = express();

//Obtiene todas las notificaciones
app.get('/notification', (req, res) => {
    //let desde = Number(req.query.desde || 0);
    //let limite = Number(req.query.limite || 100);
    let fecha = new Date();
    fecha = fecha.setHours(fecha.getHours() - 7);
    let vigentes = [];
    Notification.find({ status: true }, 'date expiration_date high_priority description type area patient user')
        //.skip(desde)
        //.limit(limite)
        .sort('date')
        .populate('type', 'name')
        .populate('patient', 'name lastName lastNameSecond')
        .populate('user', 'name')
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
                vigentes
            });
        })
});




//Registra una notificación
app.post('/notification', (req, res) => {
    let body = req.body;
    let fecha = new Date();
    let areas = ['5e028dd93a7fdc35b4ec2028', '5e028dd93a7fdc35b4ec2023'];

    let notification = new Notification({
        date: fecha.setHours(fecha.getHours() - 7),
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