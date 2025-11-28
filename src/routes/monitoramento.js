var express = require("express");
var router = express. Router();
var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/metricas", function (req, res) {
  monitoramentoController.buscarMetricas(req, res);
});

router.post("/registrar-erro", function (req, res) {
  monitoramentoController.registrarErro(req, res);
});

router.post("/atualizar", function (req, res) {
  monitoramentoController.atualizarMetricas(req, res);
});

router.post("/resetar", function (req, res) {
  monitoramentoController.resetarMetricas(req, res);
});

module. exports = router;