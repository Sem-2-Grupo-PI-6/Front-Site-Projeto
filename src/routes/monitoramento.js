var express = require("express");
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/metricas", function (req, res) {
  monitoramentoController.buscarMetricas(req, res);
});

router.post("/metricas/atualizar", function (req, res) {
  monitoramentoController.atualizarMetricas(req, res);
});

router.post("/erros/registrar", function (req, res) {
  monitoramentoController.registrarErro(req, res);
});

router.get("/erros/recentes", function (req, res) {
  monitoramentoController.buscarErrosRecentes(req, res);
});

router.post("/metricas/resetar", function (req, res) {
  monitoramentoController.resetarMetricas(req, res);
});

module.exports = router;