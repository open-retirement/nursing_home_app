var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Nursing Home App' });
});

// router.get('/map/:zipcode', function(req, res) {
//   var zipcode = req.params.zipcode;
//   console.log(zipcode);

//   res.render('map', {
//     title: "Map",
//     zipcode: zipcode
//   });
//   //res.render('map', { locals: { latitude : lat, longitude: lon } });
// });

router.get('/map/:lon/:lat', function(req, res) {
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
