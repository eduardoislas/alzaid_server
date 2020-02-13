const express = require('express');
const Notification = require('../models/notification');
const Patient = require('../models/patient');

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
    let body = req.body.notification;
    let fecha = new Date();
    let area = [];
    for (x of body.area) {
        area.push(x);
    }
    Patient.findById(body.patient, (err, dbPat) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        if (!dbPat) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'El paciente no existe'
                }
            });
        }
        let notification = new Notification({
            date: fecha,
            expiration_date: Date.parse(body.expiration),
            high_priority: body.priority,
            description: body.description,
            type: body.type,
            area: area,
            patient: dbPat
                //user: body.user
        });
        console.log(notification);
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
    })
});













module.exports = app;