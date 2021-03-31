const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config.');
const { socketcontroller } = require('../sockets/controller');

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            users: '/api/users',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads'
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB(){

        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));

        //Fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.users, require('../routes/user.routes'));
        this.app.use(this.paths.categorias, require('../routes/categoria.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
        this.app.use(this.paths.uploads, require('../routes/upload.routes'));
    }

    sockets(){
        this.io.on("connection", (socket) => socketcontroller(socket, this.io));   
    }

    listen() {

        this.server.listen(this.port, () =>{
            console.log(' Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;