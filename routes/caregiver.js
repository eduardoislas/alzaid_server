const express = require('express');
const SelfEfficacy = require('../models/selfefficacy');
const Caregiver = require('../models/caregiver');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const app = express();


//Obtener todos los cuidadores activos
app.get('/caregiver', (req, res) => {
    //El parámetro status solicita los cuidadores activos
    Caregiver.find({ status: true })
        .populate('patient')
        .populate('user')
        .exec((err, caregivers) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
            Caregiver.countDocuments({ status: true }, (err, conteo) => {
                res.json({
                    success: true,
                    count: conteo,
                    caregivers
                });
            });
        });
});

//Devuelve un cuidador por ID
app.get('/caregiver/:id', (req, res) => {
    let id = req.params.id;
    Caregiver.findById(id, (err, caregiver) => {
            if (err) {
                return res.status(500).json({
                    sucess: false,
                    err
                });
            };
            if (!caregiver) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: 'Cuidador no encontrado'
                    }
                })
            }
            res.json({
                success: true,
                caregiver
            })
        }).populate('patient')
        .populate('user')
})

//Devuelve un cuidador por user ID
app.get('/caregiver/user/:userid', (req, res) => {
    let userid = req.params.userid;
    Caregiver.find({ user: userid })
        .populate('patient')
        .populate('user')
        .exec((err, caregiver) => {
            if (err) {
                return res.status(500).json({
                    sucess: false,
                    err: err
                });
            };
            if (!caregiver) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: 'Cuidador no encontrado'
                    }
                });
            }
            res.json({
                success: true,
                caregiver: caregiver
            });
        })
})

app.post('/caregiver', (req, res) => {
    promesas = [];
    let body = req.body;
    let caregiver = new Caregiver({
        name: body.name,
        lastName: body.lastName,
        lastNameSecond: body.lastNameSecond,
        birthdate: body.birthdate,
        age: body.age,
        gender: body.gender,
        civilStatus: body.civilStatus,
        religion: body.religion,
        school: body.school,
        occupation: body.occupation,
        phone: body.phone,
        email: body.email,
        patient: body.patient,
        relation: body.relation,
        registerdate: new Date(),
        user: new User({
            firstName: body.name,
            lastName: body.lastName,
            lastNameSecond: body.lastNameSecond,
            name: body.username,
            password: bcrypt.hashSync(body.password, 10),
            role: "FAMILIAR"
        })
    });
    promesas.push(crearUsuario(caregiver.user));
    promesas.push(crearCaregiver(caregiver));
    Promise.all(promesas)
        .then(respuestas => {
            res.status(200).json({
                success: true,
                respuestas: respuestas
            })
        })
});


function crearUsuario(user) {
    return new Promise((resolve, reject) => {
        user.save((err, userDB) => {
            if (err) {
                reject('Error al guardar el usuario', err);
            } else {
                resolve(userDB);
            }
        });
    });
}

function crearCaregiver(caregiver) {
    return new Promise((resolve, reject) => {
        caregiver.save((err, caregiverDB) => {
            if (err) {
                reject('Error al guardar el cuidador', err);
            } else {
                resolve(caregiverDB);
            }
        });
    });
}

//Eliminar un cuidador
app.delete('/caregiver/:id', (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }
    Caregiver.findByIdAndUpdate(id, changeStatus, { new: true }, (err, caregiverDeleted) => {
        if (err) {
            return res.status(500).json({
                sucess: false,
                err: err
            });
        }
        if (!caregiverDeleted) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'Cuidador no encontrado'
                }
            });
        }
        res.json({
            success: true,
            caregiver: caregiverDeleted
        });
    });
});

// //Autodiagnóstico de autoeficacia
// app.post('/caregiver/se', (req, res) => {
//     let body = req.body;
//     let se = new SelfEfficacy({
//         date: body.date,
//         answers: body.answers,
//         scale: body.scale,
//         caregiver: body.caregiver._id
//     });
//     se.save((err, seDB) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 err: err
//             });
//         }
//         res.json({
//             success: true,
//             selfEfficacy: seDB
//         });
//     });
// });

// //Obtener todos los registros de autoeficacia por id del cuidador
// app.get('/caregiver/se/:id', (req, res) => {
//     let id = req.params.id;
//     SelfEfficacy.find({ caregiver: id })
//         .sort('-date')
//         .exec((err, sesDB) => {
//             if (err) {
//                 return res.status(400).json({
//                     success: false,
//                     err
//                 });
//             }
//             SelfEfficacy.countDocuments({ caregiver: id }, (err, conteo) => {
//                 res.json({
//                     success: true,
//                     count: conteo,
//                     sesDB
//                 });
//             });
//         });
// })

module.exports = app;