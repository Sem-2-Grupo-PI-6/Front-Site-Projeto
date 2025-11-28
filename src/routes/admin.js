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
  adminController.buscarTop5Empresas(req, res);
});

router.get("/dashboard/atividades", function (req, res) {
  adminController.buscarAtividadesRecentes(req, res);
});

router.get("/usuarios/listar", function (req, res) {
  adminController.listarUsuariosEmpresas(req, res);
});

router.get("/usuarios/:id", function (req, res) {
  adminController.buscarUsuarioPorId(req, res);
});

router.put("/usuarios/:id", function (req, res) {
  adminController.editarUsuario(req, res);
});

router.delete("/usuarios/:id", function (req, res) {
  adminController.excluirUsuario(req, res);
});

router.get("/empresas/listar", function (req, res) {
  adminController.listarEmpresas(req, res);
});

router.get("/usuarios/listar/paginado", function (req, res) {
  adminController.listarUsuariosEmpresasPaginado(req, res);
});

module.exports = router;