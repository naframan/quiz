var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/author', function(req, res) {
  res.render('author.ejs', {
    title: 'About myself',
    fotonaf: '/images/naframan.png',
    chicha: 'Sitio web desarrollado por Antonio Fernández dentro del curso de MiriadaX de desarrollo en la nube con HTML5, Javascript y node.js. Lo sé, el sitio es espartano pero cumple lo exigido por el curso, espero, porqué no tengo tiempo para más. Se agradecerán criticas constructivas sobre el desarrollo, el estilo ya sé que es feo ;)',
  });
});

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
