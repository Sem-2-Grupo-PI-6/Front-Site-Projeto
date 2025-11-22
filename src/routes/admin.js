var express = require("express");
var router = express.Router();
var adminController = require("../controllers/adminController");

router.post("/adminAutenticar", function (req, res) {
  adminController.adminAutenticar(req, res);
});

module.exports = router;
