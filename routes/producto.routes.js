const {Router} = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares/index');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');

const router = Router();

//obtener todas las categorias - publico
router.get('/' , obtenerProductos);

//obtener una categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto);

//crear producto - privado - cualquier persona con un token valido
router.post('/' , [ 
    validarJWT, 
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es un id de mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);

//actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'no es un id de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

//borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] , borrarProducto);

module.exports = router;