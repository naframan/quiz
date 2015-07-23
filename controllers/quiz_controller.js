var models = require('../models/models.js');
var debug = 1;

// Autolad - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  if (debug) console.log('Mensaje consola:load');
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId = ' + quizId));
      }
    }
  ).catch(function(error) {
    next(error);
  });
};

// GET /quizes
// GET /quizes?search=textoaBuscar
exports.index = function(req, res) {
  var str = req.query.search;
  if (!str) {
  if (debug) console.log('Mensaje consola:index vacio!');
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    }).catch(function (error) {
      next(error);
    });
  } else {
    str =  str.replace(' ','%');
    if (debug) console.log('Mensaje consola:index'+str);
    models.Quiz.findAll({
      where: ['pregunta like ?', '%'+str+'%'],
      order: ['pregunta']
    }).then(function(quizes) {
      if (debug) console.log('Mensaje consola: GOTCHA!');
      res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    }).catch(function (error) {
      next(error);
    });
  }

};

// GET /quizes/:quizId
exports.show = function (req, res) {
  if (debug) console.log('Mensaje consola:show');
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:quizId/answer
exports.answer = function (req, res) {
  if (debug) console.log('Mensaje consola: answer!');
  var resultado = '¡Incorrecta!';
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = '¡Correcta!';
    }
    res.render('quizes/answer', { user_res: req.query.respuesta, quiz: req.quiz, respuesta: resultado, errors: []});
};


// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    { pregunta: "Pregunta", respuesta: "Respuesta" , tema: ""}
  );
  res.render('quizes/new', { quiz: quiz, errors: []});
}

exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.
  validate()
  .then(
    function(err) {
      if (err) {
        res.render('quizes/new', { quiz: quiz, errors: err.errors});
      }  else {
        // guarda en DB los campos pregunta y respuesta de quiz
        quiz.save({ fields: ["pregunta", "respuesta", "tema"]}).then(function (){
         res.redirect ('/quizes')});
      }
    }
  );   // Redireccion HTTP (URL relativo) lista de preguntas
};

// GET quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;    // autoload de instancia de quiz

  if (debug) console.log(quiz);

  res.render('quizes/edit', { quiz: quiz, errors: []});
};

exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  if (debug) console.log(req.quiz.tema);

  req.quiz
  .validate()
  .then(
    function(err) {
      if (err) {
        res.render('quizes/edit', { quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz
        .save( { fields: ["pregunta", "respuesta", "tema"]})
        .then( function() { res.redirect('/quizes');});
      }  // Redriección HTTP a las listas de preguntas
    }
  );
};


exports.destroy = function (req, res) {
  req.quiz.destroy().then( function () {
    res.redirect('/quizes');
  }).catch(function(error) { next(error)});
};
/*
  res.locals.expReg = /^rom[ae]$/i;
  if (res.locals.expReg.test(req.query.respuesta)) {
    res.render('quizes/answer', {respuesta: '¡Correcto!'});
  } else {
    res.render('quizes/answer', {respuesta: '¡Incorrecto!'});
  }
*/
