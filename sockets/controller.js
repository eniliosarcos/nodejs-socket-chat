const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketcontroller = async(socket = new Socket(), io) => {

    const token = socket.handshake.headers['x-token'];

    const usuario = await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect();
    }

    //agregar al usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes',chatMensajes.ultimos10);

    //conectarlo a una sala especial
    socket.join(usuario.id); //global, socket.id, usuario.id

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () =>{

        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje',({userId, mensaje}) => {

        if(userId){
            //mensaje privado
            socket.to(userId).emit('mensaje-privado', {de: usuario.nombre, mensaje});
        }else{

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

    })
}

module.exports = {
    socketcontroller
}