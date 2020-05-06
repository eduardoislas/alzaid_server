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
            Valoration.countDocuments({}, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    valorations
                });
            });
        });
});


//Devuelve una valoración por ID
app.get('/valoration/:id', (req, res) => {
    let id = req.params.id;
    Valoration.findById(id, (err, valoration) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err
            });
        };
        if (!valoration) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Valoración no encontrada'
                }
            })
        }
        res.json({
            success: true,
            valoration
        });
    });
});

// Guarda Valoracion
app.post('/valoration', (req, res) => {
    let body = req.body;

    let val = new Valoration({
        year: body.year,
        numPeriod: body.numPeriod,
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
app.delete('/valoration/:id', (req, res) => {
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
        if (valDB.status) {
            valDB.status = false;
        } else {
            valDB.status = true;
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
});



module.exports = app;