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

module.exports = router;
