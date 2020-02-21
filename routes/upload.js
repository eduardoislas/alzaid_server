const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();


app.use(fileUpload({
    useTempFiles: true,
}));


app.put('/upload', function(req, res) {

    if (!req.files) {
        return res.status(400)
            .json({
                success: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            })
    }

    let file = req.files.file;
    let nameFileCut = file.name.split('.');
    let extension = nameFileCut[nameFileCut.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                success: false,
                err: {
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
                }
            })
    }


    file.mv(`uploads/patients/${ file.name}`, (err) => {
        if (err)
            return res.status(500).json({
                success: false,
                err
            });

        res.json({
            success: true,
            message: 'Imagen subida correctamente'
        })
    })
});


module.exports = app;