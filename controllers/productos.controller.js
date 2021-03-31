const { response, request } = require("express");
const { Producto } = require('../models/index');

// obtenerCategorias - paginado - total - populate
const obtenerProductos = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - controlador',
        total,
        productos
    });
}

// obtenerCategoria - populate {}
const obtenerProducto = async(req = request, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async(req = request, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const productoDb = await Producto.findOne({nombre: body.nombre});

    if(productoDb){
        return res.status(400).json({
            msg: `el producto ${productoDb.nombre}, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //guardar categoria en db
    await producto.save();

    res.status(201).json({
        msg: 'post',
        producto
    });
}

// actualizarCategoria
const actualizarProducto = async(req, res = response) => {

    const id = req.params.id;
    //extrayendo llaves del body
    const { estado, usuario, ...data} = req.body;

    if(data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true});

    res.json({
        msg: 'put',
        producto
    });
}

//borrarCategoria - estado: false
const borrarProducto = async(req, res = response) => {

    const id = req.params.id;
    //extrayendo llaves del body
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        msg: 'delete API - controlador',
        productoBorrado
    });
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}