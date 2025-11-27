var database = require("../database/config");

function adminAutenticar(email, token) {
  console.log("ACESSEI O ADMIN MODEL - function adminAutenticar():", email);

  var instrucaoSql = `CALL getAutenticarAdmin(?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [email, token]);
}

function cadastrarEmpresa(cnpj, nome, email) {
  console.log("ACESSEI O ADMIN MODEL - function cadastrarEmpresa()");

  var instrucaoSql = `CALL setCadastrarEmpresa(?, ?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [cnpj, nome, email]);
}

function cadastrarUsuarioAdmin(email, senha) {
  console.log("ACESSEI O ADMIN MODEL - function cadastrarEmpresa()");

  var instrucaoSql = `
    INSERT INTO tblAdmin (email, senha) 
    VALUES ('${email}', '${senha}');
  `;

  console.log("🔍 Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  adminAutenticar,
  cadastrarEmpresa,
  cadastrarUsuarioAdmin,
};
