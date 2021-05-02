const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

const app = express();

app.get('/user', (req, res) => {
    let next = () => {
        User.find({ status: true }, 'firstName lastName lastNameSecond name role status')
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
    }

    verificaToken(req, res, next);

});

app.get('/user/:id', (req, res) => {
    let next = () => {
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
    }

    verificaToken(req, res, next);

});

app.get('/user/name/:name', (req, res) => {
    let next = () => {
        let name = req.params.name;
        User.findOne({ name: name }, (err, user) => {
            if (err) {
                return res.status(500).json({
                    sucess: false,
                    err: err
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
                user: user
            });
        })
    }

    verificaToken(req, res, next);

});

app.post('/user', (req, res) => {
    let next = () => {
        let body = req.body;
        let user = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            lastNameSecond: body.lastNameSecond,
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
    }

    verificaToken(req, res, next);

});

app.put('/user/:id', (req, res) => {
    let next = () => {
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
            if (body.password) {
                userDB.password = bcrypt.hashSync(body.password, 10);
            }
            userDB.firstName = body.firstName;
            userDB.lastName = body.lastName;
            userDB.lastNameSecond = body.lastNameSecond;
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
    }

    verificaToken(req, res, next);

})

// Cambiar solo password
app.put('/user/pass/:id', (req, res) => {
    let next = () => {
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
            userDB.password = bcrypt.hashSync(body.password, 10);
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
    }

    verificaToken(req, res, next);

})

app.delete('/user/:id', (req, res) => {
    let next = () => {
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
    }

    verificaToken(req, res, next);

});

module.exports = app;