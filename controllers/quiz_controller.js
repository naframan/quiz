var models = require('../models/models.js');
var debug = 0;

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
      res.render('quizes/index.ejs', { quizes: quizes});
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
      res.render('quizes/index.ejs', { quizes: quizes});
    }).catch(function (error) {
      next(error);
    });
  }

};

// GET /quizes/:quizId
exports.show = function (req, res) {
  if (debug) console.log('Mensaje consola:show');
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:quizId/answer
exports.answer = function (req, res) {
  if (debug) console.log('Mensaje consola:Mondongo!');
  var resultado = '¡Incorrecta!';
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = '¡Correcta!';
    }
    res.render('quizes/answer', { user_res: req.query.respuesta, quiz: req.quiz, respuesta: resultado});
};

/*
  res.locals.expReg = /^rom[ae]$/i;
  if (res.locals.expReg.test(req.query.respuesta)) {
    res.render('quizes/answer', {respuesta: '¡Correcto!'});
  } else {
    res.render('quizes/answer', {respuesta: '¡Incorrecto!'});
  }
*/
