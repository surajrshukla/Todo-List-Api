var express = require('express');
var router = express.Router();
var global = require('./global');

router.get('/', function (req, res, next) {
  var Return_Data = [{ "Responce": "Welcome to Fractal To DO API " + global.node_env }]
  res.json(Return_Data);
});

module.exports = router;
