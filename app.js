'use strict'
                                   /*CONFIGURACION EXPRESS & BODYPARSER*/
//cargar modulo de express
var express=require('express');
//cargar modulo de bodyparser
var bodyParser=require('body-parser');
//variable que contiene el metodo de express
var app=express();


                                  /*CARGAR LOS ARCHIVOS DE LAS ROUTAS */
//cargamos el archivo de la carpeta routes
var project_routes=require('./routes/project');

                                              /*MIDDLEWARES*/
//app es la variable que contiene express y con body parser todo lo que me llegue por post lo convertiremos en objetos json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

                                                /*CORS*/
/*Cuando hacemos peticiones AJAX con jQuery o Angular a un backend o un API REST
es normal que tengamos problemas con el acceso CORS en NodeJS y nos fallen las peticiones.
Para eso podemos crear un middleware como este:*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

                                               /*RUTAS*/
//cargamos las routas del archivo que exportamos de routes, y agregamos una ruta previa a las demas rutas en este caso /api
app.use('/api',project_routes);

//exportar este modulo nodejs
module.exports=app;