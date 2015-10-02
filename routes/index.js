var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Nursing Home App' });
});

// try with html
router.get('/static_index', function(req, res) {
  res.sendFile('views/static_index.html');
});

module.exports = router;
