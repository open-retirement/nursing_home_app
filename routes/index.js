var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Nursing Home App' });
});
router.get('/', function(req, res) {
  res.render('layout.jade', { title: 'Nursing Home App' });
});

router.get('/map/:lat/:lon', function(req, res) {
  var lat = req.params.lat;
  var lon = req.params.lon;
  console.log(lat + ", " + lon);

  res.render('map', {
    title: "Map",
    latitude: lat,
    longitude: lon
  });
  //res.render('map', { locals: { latitude : lat, longitude: lon } });
});

module.exports = router;
