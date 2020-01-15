const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const app = express();


app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ name: body.name }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Usuario y/o contraseña incorrectos'
                }
            })
        }
        if (!userDB.status) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Usuario inactivo'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Usuario y/o contraseña incorrectos'
                }
            })
        }
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            success: true,
            user: userDB,
            token,
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
    });
});






module.exports = app;