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

function atualizarPerfil(idUsuario, nome, telefone) {
  console.log("ACESSEI O USUARIO MODEL - function atualizarPerfil():", idUsuario);

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET nome = '${nome}',
        telefone = '${telefone}'
    WHERE idUsuario = ${idUsuario};
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function alterarSenha(idUsuario, senhaAtual, novaSenha) {
  console.log("ACESSEI O USUARIO MODEL - function alterarSenha():", idUsuario);

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET senha = '${novaSenha}'
    WHERE idUsuario = ${idUsuario} 
      AND senha = '${senhaAtual}';
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarPreferencias(idUsuario, receberNotificacao) {
  console.log("ACESSEI O USUARIO MODEL - function atualizarPreferencias():", idUsuario);

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET receberNotificacao = ${receberNotificacao ? 1 : 0}
    WHERE idUsuario = ${idUsuario};
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function obterDadosUsuario(idUsuario) {
  console.log("ACESSEI O USUARIO MODEL - function obterDadosUsuario():", idUsuario);

  var instrucaoSql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.telefone,
      u.dtCriacao,
      u.receberNotificacao,
      u.dtUltimoAcesso,
      e.idEmpresa,
      e.nomeFantasia,
      e.cnpj
    FROM tblUsuario u
    INNER JOIN tblEmpresa e ON u.Empresa_idEmpresa = e.idEmpresa
    WHERE u.idUsuario = ${idUsuario};
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  autenticar,
  cadastrar,
  atualizarUltimoAcesso,
  atualizarPerfil,
  alterarSenha,
  atualizarPreferencias,
  obterDadosUsuario
};