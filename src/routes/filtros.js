var express = require("express");
var router = express.Router();

var filtrosController = require("../controllers/filtrosController");

router.get("/listar/:idUser", function (req, res) {
    filtrosController.listarFiltros(req, res);
});

router.get("/ativo/:idUser", function (req, res) {
    filtrosController.buscarFiltroAtivo(req, res);
});


router.post("/criar", function (req, res) {
    filtrosController.criarFiltro(req, res);
});


router.put("/atualizar/:id", function (req, res) {
    filtrosController.atualizarFiltro(req, res);
});

router.put("/ativar/:id", function (req, res) {
    filtrosController.ativarFiltro(req, res);
});


router.delete("/deletar/:id/:idUser", function (req, res) {
    filtrosController.deletarFiltro(req, res);
});

module.exports = router;