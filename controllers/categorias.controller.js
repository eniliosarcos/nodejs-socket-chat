const { response, request } = require("express");
const { Categoria } = require('../models/index');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - controlador',
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req = request, res = response) => {

    const {id} = req.params;

    const categoria = await Categoria.findById(id)
    .populate('usuario', 'nombre');

    res.json(categoria);
}

const crearCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDb = await Categoria.findOne({nombre});

    if(categoriaDb){
        return res.status(400).json({
            msg: `La categoria ${categoriaDb.nombre}, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //guardar categoria en db
    await categoria.save();

    res.status(201).json({
        msg: 'post',
        categoria
    });
}

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const id = req.params.id;
    //extrayendo llaves del body
    const { estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true});

    res.json({
        msg: 'put',
        categoria
    });
}

//borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {

    const id = req.params.id;
    //extrayendo llaves del body
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        msg: 'delete API - controlador',
        categoriaBorrada
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}