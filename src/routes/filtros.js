var express = require("express");
var router = express.Router();

var filtrosController = require("../controllers/filtrosController");

// GET - Listar todos os filtros do usuário
router.get("/listar/:idUser", function (req, res) {
    filtrosController.listarFiltros(req, res);
});

// GET - Buscar filtro ativo do usuário
router.get("/ativo/:idUser", function (req, res) {
    filtrosController.buscarFiltroAtivo(req, res);
});

// POST - Criar novo filtro
router.post("/criar", function (req, res) {
    filtrosController.criarFiltro(req, res);
});

// PUT - Atualizar filtro
router.put("/atualizar/:id", function (req, res) {
    filtrosController.atualizarFiltro(req, res);
});

// PUT - Ativar filtro
router.put("/ativar/:id", function (req, res) {
    filtrosController.ativarFiltro(req, res);
});

// DELETE - Deletar filtro
router.delete("/deletar/:id/:idUser", function (req, res) {
    filtrosController.deletarFiltro(req, res);
});

module.exports = router;