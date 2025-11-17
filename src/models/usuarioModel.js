var database = require("../database/config");

function autenticar(email, senha) {
  console.log("ACESSEI O USUARIO MODEL - function autenticar():", email);
  
  var instrucaoSql = `
    SELECT 
      idUsuario,
      nome,
      email,
      tipoUsuario,
      usuarioAtivo,
      Empresa_idEmpresa,
      nomeEmpresa,
      cnpj,
      tipoPlano,
      limiteUsuarios,
      sitacaoLicensa,
      dtLicenca,
      podeAcessar,
      descricaoAcesso
    FROM vw_AutenticacaoUsuario
    WHERE email = '${email}' AND senha = '${senha}';
  `;
  
  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}


function cadastrar(nome, email, senha, cnpj) {
  console.log("ACESSEI O USUARIO MODEL - function cadastrar()");

  let tipoUsuario = 'usuario';
  if (email.includes('@admin.net')) {
    tipoUsuario = 'admin';
  }

  var sqlEmpresa = `
    INSERT INTO tblEmpresa (cnpj, nomeFantasia, emailCoorportaiva, dtLicenca, sitacaoLicensa)
    VALUES ('${cnpj}', '${nome}', '${email}', CURDATE(), 'Ativa')
    ON DUPLICATE KEY UPDATE 
      nomeFantasia = VALUES(nomeFantasia),
      emailCoorportaiva = VALUES(emailCoorportaiva);
  `;
  
  return database.executar(sqlEmpresa)
    .then(function (resultado) {

      const sqlBuscarEmpresa = `SELECT idEmpresa FROM tblEmpresa WHERE cnpj = '${cnpj}' LIMIT 1;`;
      
      return database.executar(sqlBuscarEmpresa)
        .then(function (empresas) {
          const idEmpresa = empresas[0].idEmpresa;

          var sqlUsuario = `
            INSERT INTO tblUsuario (nome, email, senha, tipoUsuario, dtCriacao, Empresa_idEmpresa) 
            VALUES ('${nome}', '${email}', '${senha}', '${tipoUsuario}', CURDATE(), ${idEmpresa});
          `;
          
          return database.executar(sqlUsuario);
        });
    });
}

function atualizarUltimoAcesso(idUsuario) {
  console.log("ACESSEI O USUARIO MODEL - function atualizarUltimoAcesso():", idUsuario);
  
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
  atualizarUltimoAcesso
};