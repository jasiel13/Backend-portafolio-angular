'use strict'
//un modelo representa a un nuevo documento de la coleccion de la base de datos

//importar mongoose
var mongoose= require('mongoose');

//crear esquema
var Schema=mongoose.Schema;

//crear esquema del proyecto, al metodo schema se le pasa como parametro un objecto json
var ProjectSchema=Schema({
      name:String,
      description:String,
      category:String,
      year:Number,
      langs:String,
      image:String
});

/*exportar este modulo, elegimos este esquema y lo usamos como modelo
le pasamos como parametro el nombre con el que se guardara en la base de datos(coleccion) y el esquema a usar*/
module.exports = mongoose.model('Project',ProjectSchema);