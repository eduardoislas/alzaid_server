const express = require("express");
const Notification = require("../models/notification");
const Patient = require("../models/patient");

let { verificaToken } = require("../middlewares/authentication");

const app = express();

//Obtiene todas las notificaciones
app.get("/notification", (req, res) => {
  let next = () => {
    //let desde = Number(req.query.desde || 0);
    //let limite = Number(req.query.limite || 100);
    let fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    let vigentes = [];
    Notification.find({ status: true })
      //.skip(desde)
      //.limit(limite)
      .sort("date")
      .populate("patient", "name lastName lastNameSecond phase")
      .exec((err, notifs) => {
        if (err) {
          return res.status(400).json({
            success: false,
            err,
          });
        }
        for (let x of notifs) {
          if (fecha <= x.expiration_date) {
            vigentes.push(x);
          } else {
            x.status = false;
            x.save((err, notificationDB) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  err,
                });
              }
            });
          }
        }
        res.json({
          success: true,
          vigentes,
          count: vigentes.length,
        });
      });
  };

  verificaToken(req, res, next);
});

//Registra una notificación
app.post("/notification", (req, res) => {
  let next = () => {
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
          err,
        });
      }
      if (!dbPat) {
        return res.status(400).json({
          success: false,
          err: {
            message: "El paciente no existe",
          },
        });
      }
      let notification = new Notification({
        date: fecha,
        expiration_date: Date.parse(body.expiration_date),
        high_priority: body.priority,
        description: body.description,
        type: body.type,
        area: area,
        patient: dbPat,
        unsubscribedPatients: [],
        user: body.user,
      });

      notification.save((err, notificationDB) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err,
          });
        }
        res.json({
          success: true,
          notification: notificationDB,
        });
      });
    });
  };

  verificaToken(req, res, next);
});

// Agrega un usuario al arreglo de usuarios desuscritos de la notificacion
app.put("/notification/unsubscribe/:id", (req, res) => {
  let next = () => {
    let id = req.params.id;
    let unsubscribedUser = req.body.unsubscribedUser;

    Notification.findById(id, (err, notificationDB) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        });
      }
      if (!notificationDB) {
        return res.status(400).json({
          success: false,
          err: {
            message: "La notificacion no existe",
          },
        });
      }

      if (!notificationDB.unsubscribedUsers.includes(unsubscribedUser)) {
        notificationDB.unsubscribedUsers.push(unsubscribedUser);
      }

      notificationDB.save((err, notificationSaved) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err,
          });
        }
        res.json({
          success: true,
          notification: notificationSaved,
        });
      });
    });
  };

  verificaToken(req, res, next);
});

// Elimina un usuario del arreglo de usuarios desuscritos de la notificacion
app.put("/notification/subscribe/:id", (req, res) => {
  let next = () => {
    let id = req.params.id;
    let subscribedUser = req.body.subscribedUser;

    Notification.findById(id, (err, notificationDB) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        });
      }
      if (!notificationDB) {
        return res.status(400).json({
          success: false,
          err: {
            message: "La notificacion no existe",
          },
        });
      }

      var index = notificationDB.unsubscribedUsers.indexOf(subscribedUser);
      if (index !== -1) {
        notificationDB.unsubscribedUsers.splice(index, 1);
      }

      notificationDB.save((err, notificationSaved) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err,
          });
        }
        res.json({
          success: true,
          notification: notificationSaved,
        });
      });
    });
  };

  verificaToken(req, res, next);
});

module.exports = app;
