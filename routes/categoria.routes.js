const {Router} = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares/index');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//obtener todas las categorias - publico
router.get('/' , obtenerCategorias);

//obtener una categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria);

//crear categoria - privado - cualquier persona con un token valido
router.post('/' , [ 
    validarJWT, 
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

//borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] , borrarCategoria);

module.exports = router;