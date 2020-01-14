'use strict'
//importamos el modelo que creamos
var Project=require('../models/project');

//libreria para borrar archivos que no son de tipo imagen usado en el metodo upladimage
var fs=require('fs');

//usar una propiedad de nodejs para cargar rutas fisicas de nuestros archivos
var path = require('path');

//creamos una especie de clase con una variable que contiene un objeto json con varias funciones
var controller ={
    home:function(req,res){
        return res.status(200).send({
            message:"soy el home"
        });
    },
    test: function(req,res){
        return res.status(200).send({
            message:"soy el metodo o accion test del controlador project"
        });
    },



    //crear metodo para guardar nuevos proyectos en la BD
    saveProject:function(req,res){

        //creamos una variable que contiene el nuevo proyecto new y Poject()hace referencia al modelo de datos
        var project= new Project();

        //recoger los parametros que llegan por el body de la peticion
        var params=req.body;

        //asignamos un valor a las propiedades que creamos en el modelo
        project.name=params.name;
        project.description=params.description;
        project.category=params.category;
        project.year=params.year;
        project.langs=params.langs;
        project.image=null;

        //guardar el nuevo objeto json(documento coleccion)en la base de datos
        project.save((error,projectStored)=>{
            if(error)
            return res.status(500).send({
                message:"Error al guardar el documento en la coleccion"
            });

            if(!projectStored)
            return res.status(404).send({
                message:"No se ha podido guardar el documento"
            });

            return res.status(200).send({
                project:projectStored
            });
        });
        
        /*ver la respuesta del metodo para comprobar que funciona y los datos que arroja
        return res.status(200).send({
                project:project,
                message:"metodo saveproject activo"
        });*/
    },


    //metodo para devolver los datos que ya almacenamos en la BD
    getProject:function(req,res){

        //recoger un valor que nos llega por la url en este caso el id
        var projectId=req.params.id;

        //metodo de mongoose para buscar por elemento id (findById)
        Project.findById(projectId,(error,project)=>{

            if(projectId==null)
            return res.status(404).send({
                message:"El proyecto no existe falto el id"
            });

            if(error)
            return res.status(500).send({
                message:"Error al devolver datos"
            });

            if(!project)
            return res.status(404).send({
                message:"El proyecto no existe el id es incorrecto"
            });

            return res.status(200).send({
               project
            });
        });
    },


    //crear un metodo que me liste todos los documentos de la coleccion de la BD 
    listProject:function(req,res){
    //usamos find para buscar y exec para ejecutar y ver los proyectos en lista, sort para ordenar por año
           Project.find({}).sort('-year').exec((error,project)=>{
            if(error)
            return res.status(500).send({
                message:"Error al devolver los datos"
            });

            if(!project)
            return res.status(404).send({
                message:"No hay proyectos que mostrar"
            });

            return res.status(200).send({
                project
            });
        });
    },

    //crear un metodo para actualizar los datos de la BD
    updateProject:function(req,res){

    //tomamos la variable donde almacenamos el id, para recoger un valor que nos llega por la url en este caso el id
        var projectId=req.params.id;

    //creamos una variable donde almacenar todo el objeto que ya actualizamos
        var update=req.body;

    /*usamos el metodo findByIdAndUpdate para actualizar el objeto con el id seleccionado
    le pasamos el id y el cuerpo del objeto y una funcion callback,y con la opcion new:true 
    devuelve el objeto nuevo(actualizado)sin esto devulve el objeto que se tenia antes*/
    Project.findByIdAndUpdate(projectId,update,{new:true},(error,projectUpdated)=>{

        if(error)
        return res.status(500).send({
            message:"Error al actualizar"
        });

        if(!projectUpdated)
        return res.status(404).send({
            message:"No existe el proyecto para actualizar"
        });

        return res.status(200).send({
            project:projectUpdated
         });

       });      
    },

    //creamos un metodo para borrar los datos de la BD
    removeProject:function(req,res){
        var projectId=req.params.id;    
        Project.findByIdAndRemove(projectId,(error,projectRemoved)=>{
            if(error)
            return res.status(500).send({
                message:"No se ha podido borrar el proyecto"
            });

            if(!projectRemoved)
            return res.status(404).send({
                message:"No se puede eliminar ese objeto"
            });

            return res.status(200).send({
                project:projectRemoved
            });
      });
    },

    //crear un metodo para subir imagenes
    uploadImage:function(req,res){
        //necesitamos recuperar el id
        var projectId=req.params.id; 
        //declarar una variable por default para guardar la imagen 
        var file_name="Imagen no subida...";

        //condicion en el que caso de que exista en el request
        if(req.files){

            //recuperar el path para subir la imagen a la BD
            var filePath=req.files.image.path;
            //separar el path por barra como viene en postmane: "path": "uploads\\NV5z0DMt9B70tng__c26D6O3.png"
            var fileSplit=filePath.split('\\');
            //recuperar solo el nombre dle archivo:NV5z0DMt9B70tng__c26D6O3.png
            var file_name=fileSplit[1];

            //sacar la extension de la imagen
            var extSplit=file_name.split('\.');
            var file_extension=extSplit[1];

            //condicion if para ver que tipo de extension es el archivo si cumple con la condicion de extension que la guarde en la bd
            if(file_extension=='png'||file_extension=='jpg'||file_extension=='jpeg'||file_extension=='gif'){
                Project.findByIdAndUpdate(projectId,{image:file_name},{new:true},(error,projectUpdated)=>{

                    if(error)
                    return res.status(500).send({
                        message:"La imagen no se ha subido"
                    });
    
                    if(!projectUpdated)
                    return res.status(404).send({
                        message:"El proyecto no existe y no se a subido la imagen"
                    });
    
                    return res.status(200).send({
                      project:projectUpdated
                    });
                });   
            }

            else{
                fs.unlink(filePath,(error)=>{
                    return res.status(200).send({
                        message:"La extension no es valida"
                    });
                });
            }               
        }

        else{
            return res.status(200).send({
                message:file_name
            })
        }
    },

 //metodo para devolver la imagen desde la BD
    getImageFile:function(req,res){
        var file= req.params.image;//recoger un parametro el nombre del archivo que se lo pasaremos por la url
        var path_file='./uploads/'+file;//es la ruta de la imagen mas el nombre que viene en la variable de arriba
//comprobamos si existe la ruta
        fs.exists(path_file,(exists)=>{
            if(exists){
                //si la ruta(path) si existe, que nos retorne la ruta 
                return res.sendFile(path.resolve(path_file));
            }
            else{
                return res.status(200).send({
                    message:"No existe la imagen..."
                });
            }
        });
    }
};

//exportar este modulo 
module.exports = controller;