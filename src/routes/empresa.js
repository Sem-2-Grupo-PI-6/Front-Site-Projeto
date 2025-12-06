var express = require("express");
var router = express.Router();
var empresaController = require("../controllers/empresaController");

router.post("/autenticarEmpresa", function (req, res) {
  empresaController.autenticarEmpresa(req, res);
});

router.put("/:idEmpresa/atualizarSenha", function (req, res) {
  empresaController.atualizarSenha(req, res);
});

router.post("/cadastrarUsuario", function (req, res) {
  empresaController.cadastrarUsuario(req, res);
});

router.get("/listar", function (req, res) {
  empresaController.listarEmpresas(req, res);
});

router.get("/vagas/:idEmpresa", function (req, res) {
  empresaController.verificarVagas(req, res);
});

router.put("/atualizar/:id", function (req, res) {
  empresaController.atualizarEmpresa(req, res);
});

router.get("/usuarios/listar/paginado", function(req, res){
  empresaController.listarUsuariosPaginado(req, res);
})

router.get("/usuarios/:idUsuario", function(req, res){
  empresaController.buscarUsuarioId(req, res);
})

router.put("/usuarios/:idUsuarios", function(req, res){
  empresaController.atualizarUsuario(req, res);
})

router.delete("/usuarios/:idUsuarios", function(req, res){
  empresaController.excluirUsuario(req, res);
})

module.exports = router;
