const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req = request, res = response) => {
    
    const {correo, password} = req.body;

    try {

        // verificar si el email existe
        const existeUsuario = await Usuario.findOne({correo});

        if(!existeUsuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // si el usuario esta activo
        if(!existeUsuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: falso'
            })
        }

        // verificar la contrase;a
        const passwordValido = bcryptjs.compareSync(password, existeUsuario.password);
        if(!passwordValido){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //generar el JWT
        const token = await generarJWT(existeUsuario.id);


        res.json({
            existeUsuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal. Hable con el administrador'
        })
    }

}

const googleSignin = async(req = request, res = response) => {

    const {id_token} = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        let existeUsuario = await Usuario.findOne({correo});

        if(!existeUsuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            existeUsuario = new Usuario(data);
            await existeUsuario.save();
        }

        // si el usuario en DB esta deshabilitado
        if(!existeUsuario.estado){
            return res.status(401).json({
                msg: 'hable con el administrador, usuario bloqueado'
            });
        }

        //generar el JWT
        const token = await generarJWT(existeUsuario.id);
        
        res.json({
            msg: 'todo ok! google signin',
            existeUsuario,
            token
        });

    } catch (error) {

        res.status(400).json({

            msg: 'token de google no es valido'
        })
    }

}

const renovarToken = async(req = request, res = response ) => {

    const { usuario } = req;

    //generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}