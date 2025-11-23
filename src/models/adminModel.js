var database = require("../database/config");

function adminAutenticar(email, token) {
  console.log("ACESSEI O ADMIN MODEL - function adminAutenticar():", email);

  var instrucaoSql = `CALL getAutenticarAdmin(?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [email, token]);
}

function cadastrarEmpresa(cnpj, nome, email) {
  console.log("ACESSEI O EMPRESA MODEL - function cadastrarEmpresa()");

  var instrucaoSql = `CALL setCadastrarEmpresa(?, ?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [cnpj, nome, email]);
}

module.exports = {
  adminAutenticar,
  cadastrarEmpresa,
};
