const express = require('express');

const Valoration = require('../models/valorations');

const app = express();


//Obtener todas las valoraciones
app.get('/valoration', (req, res) => {
    Valoration.find({})
        .exec((err, valorations) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            Caregiver.countDocuments({}, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    valorations
                });
            });
        });
});

// Guarda Valoracion
app.post('/valoration', (req, res) => {
    let body = req.body;

    let val = new Valoration({
        year: body.year,
        period: body.period
    });
    val.save((err, valDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            valorationDB: valDB
        });
    });
});

//Actualiza estado de cuiaddor
app.put('/valoration/:id', (req, res) => {
    let id = req.params.id;
    Valoration.findById(id, (err, valDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        if (!valDB) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Valoración no existe'
                }
            });
        }
        if (val.status) {
            val.status = false;
        } else {
            val.status = true;
        }
        valDB.save((err, valSaved) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            res.json({
                success: true,
                valorationDB: valSaved
            })
        })
    });
})







module.exports = app;