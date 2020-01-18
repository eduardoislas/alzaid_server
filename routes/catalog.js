const express = require('express');
const _ = require('underscore');
const Catalog = require('../models/catalog');

const app = express();

//Obtener todos los catalogos
app.get('/catalog', (req, res) => {
    //El parámetro status solicita los catalogos
    Catalog.find({ status: true })
        .sort('type')
        .exec((err, catalogs) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            Catalog.countDocuments({ status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    catalogs
                });
            })
        })
});

app.get('/catalog/id/:id', (req, res) => {
    let id = req.params.id;
    Catalog.findById(id, (err, catalog) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err
            });
        };
        if (!catalog) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Catálogo no encontrado'
                }
            })
        }
        res.json({
            success: true,
            catalog
        })
    })
});


//Obtiene todos los catálogos por tipo
app.get('/catalog/:type', (req, res) => {
    let type = req.params.type;
    let regex = new RegExp(type, 'i');

    Catalog.find({ type: regex })
        .sort('name')
        .exec((err, catalogs) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            Catalog.countDocuments({ type: regex }, (err, conteo) => {
                res.json({
                    success: true,
                    cuantos: conteo,
                    catalogs
                });
            })
        })
});

app.post('/catalog', (req, res) => {
    let body = req.body;
    let catalog = new Catalog({
        name: body.name,
        type: body.type,
    });
    catalog.save((err, catalogDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            catalog: catalogDB
        });
    });
});


app.delete('/catalog/:id', (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }
    Catalog.findByIdAndUpdate(id, changeStatus, { new: true }, (err, catalogDeleted) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err
            });
        };
        if (!catalogDeleted) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Catálogo no encontrado'
                }
            })
        }
        res.json({
            success: true,
            catalog: catalogDeleted
        })
    })
});




module.exports = app;