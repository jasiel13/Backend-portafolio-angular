'use strict'
                                    /*CONEXION A LA BASE DE DATOS*/
//importar el modulo de mongoose
var mongoose = require('mongoose');

//importar el modulo de configuracion de express y bodyparser
var app= require('./app');

//variable para indicar el puerto de mi servidor(puede ser cualquiera).
var port=3700;

//crear promesa
mongoose.Promise=global.Promise;

//conexion a base de datos
mongoose.connect('mongodb://localhost:27017/portafolio')

//probar si la conexion funciono
.then(()=>{
    console.log("Conexión a la base de datos establecida con éxito");
                                    //CREAR EL SERVIDOR CON EXPRESS
    app.listen(port,()=>{
        console.log("Servidor corriendo correctamente en la url:localhost:3700");
    });

})
.catch(error=> console.log(error));