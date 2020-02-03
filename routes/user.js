const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

const app = express();

app.get('/user', (req, res) => {
    User.find({ status: true }, 'name role status')
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            User.countDocuments({ status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    users,
                    count: conteo
                });
            })
        })
});

app.get('/user/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err
            });
        };
        if (!user) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            success: true,
            user
        })
    })
});

app.post('/user', (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        res.json({
            success: true,
            user: userDB
        });
    });
});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    User.findById(id, (err, userDB) => {
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
                    message: 'Usuario no encontrado'
                }
            });
        }
        console.log(body.password);
        if (!body.password === '') {
            userDB.password = bcrypt.hashSync(body.password, 10);
        }
        userDB.role = body.role;
        userDB.save((err, userSaved) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            res.json({
                success: true,
                user: userSaved
            })
        })
    });
})

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }
    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        };
        if (!userDeleted) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            success: true,
            user: userDeleted
        })
    })
});

module.exports = app;