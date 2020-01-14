'use strict'

//importamos el modulo de express
var express=require('express');

//importamos el modulo del controlador
var ProjectController=require('../controllers/project');

//cargar el router
var router = express.Router();

/*para que funcione la subida de imagenes se debe configurar un middlewaer con el multiparty,
creamos una variable que contenga el mutluparty y se la pasamos a otra variable indicandole 
la ruta donde se almacenaran las imagenes*/
var multipart=require('connect-multiparty');
var multipartMiddleware= multipart({uploadDir:'./uploads'});

/*usamos el router con el metodo get, creamos una ruta en este caso home
y le pasamos el metodo projectcontroller que contiene el objeto json de la carpeta controllers*/
router.get('/home',ProjectController.home);
router.post('/test',ProjectController.test);
router.post('/save-project',ProjectController.saveProject);
router.get('/get-project/:id?',ProjectController.getProject);
router.get('/list-project',ProjectController.listProject);
router.put('/update-project/:id',ProjectController.updateProject);
router.delete('/remove-project/:id',ProjectController.removeProject);

//los middlewares se deben de ejecutar antes de una accion en este caso los controllers
router.post('/upload-project/:id',multipartMiddleware,ProjectController.uploadImage);

//creamos una ruta para la extraccion de las imagenes
router.get('/get-image/:image', ProjectController.getImageFile);

//exportar el modulo router
module.exports=router;