

const {Router} = require('express');
const { check } = require('express-validator');
const { cargarArchivos, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', validarArchivoSubir,cargarArchivos);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
],actualizarImagenCloudinary);
// ],actualizarImagen); // CARGA DE ARCHIVOS AL SERVIDOR

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
], mostrarImagen);

module.exports = router;