var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/DATABASE_URL
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_NAME   = (url[6] || null);
var user      = (url[2] || null);
var pwd       = (url[3] || null);
var protocol  = (url[1] || null);
var dialect   = (url[1] || null);
var port      = (url[5] || null);
var host      = (url[4] || null);
var storage   = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');


// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_NAME, user, pwd,
  {
    dialect:  protocol,
    storage:  protocol,
    port:     port,
    host:     host,
    storage:  storage,    // solo SQLite (.env)
    omitNull: true        // solo Postgres
  });

// Imprtar la definicin de la tabla Quiz en quiz.js

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;  //exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en BD
sequelize.sync().success(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count) {
    if(count === 0) {     // la tabla se inicializa solo si est vacía
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma'
      });
      Quiz.create({
        pregunta: 'Capital de Francia',
        respuesta: 'París'
      });
      Quiz.create({
        pregunta: 'Capital de España',
        respuesta: 'Madrid'
      });
      Quiz.create({
        pregunta: 'En que año se firmo el tratado de paz de Utrech',
        respuesta: '1713'
      });
      Quiz.create({
        pregunta: 'En que año descubrió América Cristobal Colón',
        respuesta: '1492'
      });
      Quiz.create({
        pregunta: 'Capital de Portugal',
        respuesta: 'Lisboa'
      }).then(function() {console.log('Base de datos inicializada')});
    };
  });
});
