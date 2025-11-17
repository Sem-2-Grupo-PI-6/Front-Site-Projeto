var express = require("express");
var router = express.Router();
var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function (req, res) {
    empresaController.cadastrarEmpresa(req, res);
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

module.exports = router;