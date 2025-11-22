var database = require("../database/config");

function adminAutenticar(email, token) {
  console.log("ACESSEI O ADMIN MODEL - function adminAutenticar():", email);

  var instrucaoSql = `CALL getAutenticarAdmin(?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [email, token]);
}

module.exports = {
  adminAutenticar,
};
