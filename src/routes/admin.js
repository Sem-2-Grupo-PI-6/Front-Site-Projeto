var express = require("express");
var router = express.Router();
var adminController = require("../controllers/adminController");

router.post("/adminAutenticar", function (req, res) {
  adminController.adminAutenticar(req, res);
});

router.post("/cadastrarEmpresa", function (req, res) {
  adminController.cadastrarEmpresa(req, res);
});

router.post("/cadastrarUsuarioAdmin", function (req, res) {
  adminController.cadastrarUsuarioAdmin(req, res);
});

router.get("/dashboard/metricas", function (req, res) {
  adminController.buscarMetricasDashboard(req, res);
});

router.get("/dashboard/usuarios", function (req, res) {
  adminController.buscarTotalUsuarios(req, res);
});

router.get("/dashboard/crescimento", function (req, res) {
  adminController.buscarCrescimentoUsuarios(req, res);
});

router.get("/dashboard/top-empresas", function (req, res) {
  adminController. buscarTop5Empresas(req, res);
});

router.get("/dashboard/atividades", function (req, res) {
  adminController.buscarAtividadesRecentes(req, res);
});

module.exports = router;