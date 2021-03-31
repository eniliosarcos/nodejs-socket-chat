

const {Schema, model} = require('mongoose');


const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        require: true,
        default: 'USER_ROLE'
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function() {

    const { __v, password, _id, ...usuario } = this.toObject();

    //esto cambia el la visualizacion de  _id por userId
    usuario.userId = _id;

    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);