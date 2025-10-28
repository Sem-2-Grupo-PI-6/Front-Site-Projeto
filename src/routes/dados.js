var express = require("express");
var router = express.Router();

var dadosController = require("../controllers/dadosController");

router.get("/dashboard", function (req, res) {
    dadosController.buscarDadosDashboard(req, res);
});

router.get("/demografia/:idZona", function (req, res) {
    dadosController.buscarDemografia(req, res);
});

router.get("/zonas", function (req, res) {
    dadosController.buscarZonas(req, res);
});

router.get("/atratividade", function (req, res) {
    dadosController.buscarAtratividade(req, res);
});

module.exports = router;