const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const {userId} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde al userId
        const usuario = await Usuario.findById(userId);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe BD'
            })
        }

        //Verificar si el userId tiene estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: falso'
            })
        }
        req.usuario = usuario;

        //esto le establece al request un valor para que pueda ser usado en el siguiente middleware o controlador;
        // req.userId = userId;

        next();
    } catch (error) {

        console.log(error);
        res.status(401).json({

            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}