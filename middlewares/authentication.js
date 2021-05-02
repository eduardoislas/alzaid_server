const jwt = require('jsonwebtoken');

// Verificar TOKEN
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};

// Verificar rol de usuario
let verificaAdmin_Role = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN') {
        next();
    } else {
        return res.json({
            success: false,
            err: {
                message: 'El usuario no tiene privilegios para esta acción'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}