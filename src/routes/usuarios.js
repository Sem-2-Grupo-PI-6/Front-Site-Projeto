var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/obterDados/:idUsuario", function (req, res) {
    usuarioController.obterDados(req, res);
});

router.put("/atualizarPerfil", function (req, res) {
    usuarioController.atualizarPerfil(req, res);
});

router.put("/alterarSenha", function (req, res) {
    usuarioController.alterarSenha(req, res);
});

router.put("/atualizarPreferencias", function (req, res) {
    usuarioController.atualizarPreferencias(req, res);
});


router.get("/slack/:idUsuario", function (req, res) {
    usuarioController.obterConfiguracaoSlack(req, res);
});

router.post("/slack/criar", function (req, res) {
    usuarioController.criarConfiguracaoSlack(req, res);
});

router.put("/slack/atualizar/:idSlack", function (req, res) {
    usuarioController.atualizarConfiguracaoSlack(req, res);
});

router.put("/slack/desativar/:idUsuario", function (req, res) {
    usuarioController.desativarSlack(req, res);
});

module.exports = router;
