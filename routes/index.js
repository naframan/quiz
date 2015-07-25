var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId

router.get('/author', function(req, res) {
  res.render('author.ejs', {
    title: 'About myself',
    fotonaf: '/images/naframan.png',
    chicha: 'Sitio web desarrollado por Antonio Fernández dentro del curso de MiriadaX de desarrollo en la nube con HTML5, Javascript y node.js. Lo sé, el sitio es espartano pero cumple lo exigido por el curso, espero, porqué no tengo tiempo para más. Se agradecerán criticas constructivas sobre el desarrollo, el estilo ya sé que es feo ;)',
    errors: [],
  });
});

router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',               quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    quizController.edit);
router.put('/quizes/:quizId(\\d+)',         quizController.update);
router.delete('/quizes/:quizId(\\d+)',      quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',     commentController.create);

module.exports = router;
