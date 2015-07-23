//Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
    {
        pregunta: {
          type: DataTypes.STRING,
          validate:  { notEmpty:  {msg: "->Falta pregunta"}}
        },
        respuesta: {
          type: DataTypes.STRING,
          validate: { notEmpty: { msg: "-> Falta respuesta"}}
        },
        tema: {
          type: DataTypes.ENUM('otro','humanidades','ocio','ciencia','tecnología'),
          validate: { isIn: {
            args: [['otro','humanidades','ocio','ciencia','tecnología']],
            msg: "-> Tema desconocido"
          }}
        }
    });
}
