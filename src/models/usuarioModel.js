var database = require("../database/config");

function autenticar(email, senha) {
  console.log("ACESSEI O USUARIO MODEL - function autenticar():", email);

  var instrucaoSql = `CALL getLoginUsuario(?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
  console.log("ACESSEI O USUARIO MODEL - function cadastrar()");
  var instrucaoSql = `CALL SetCadastroUsuario(?, ?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [nome, email, senha]);
}

function atualizarUltimoAcesso(idUsuario) {
  console.log(
    "ACESSEI O USUARIO MODEL - function atualizarUltimoAcesso():",
    idUsuario
  );

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET dtUltimoAcesso = NOW()
    WHERE idUsuario = ${idUsuario};
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
  autenticar,
  cadastrar,
  atualizarUltimoAcesso,
};
