
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - controlador',
        total,
        usuarios
    });
}

const usuariosPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto} = req.body;

    if(password){

        //Encriptar la contrase;a
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json({
        msg: 'put API - controlador',
        usuario
    });
}

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    });

    //Encriptar la contrase;a
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    
    //guardar en BD
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {

    const id = req.params.id;

    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false});
    // const usuarioAutenticado = req.usuario;

    res.json({
        msg: 'delete API - controlador',
        usuario
        // usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}