const jwt = require('jsonwebtoken');
const {Usuario} = require('../models')

const generarJWT = (userId = '') => {

    return new Promise((resolve, reject) => {

        const payload = { userId };
        
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            
            expiresIn: '4h'
        }, (err,token) => {

            if(err){

                console.log(err);
                reject('No se pudo generar el token');
            }
            else{

                resolve(token);
            }
        })
    })
}

const comprobarJWT = async(token = '') => {

    try {
        if(token.length < 10){
            return null;
        }

        const {userId} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(userId);

        if(usuario){
            if(usuario.estado){

                return usuario;
            }else{
                return null;
            }
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}