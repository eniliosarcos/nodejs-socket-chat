const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT } = require('../middlewares/');
const { login, googleSignin, renovarToken} = require('../controllers/auth.controller');

const router = Router();

router.post('/login', [
    check('correo', 'El Correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignin);

router.get('/', validarJWT, renovarToken)

module.exports = router;