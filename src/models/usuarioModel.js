var database = require("../database/config");

function autenticar(email, senha) {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",
    email,
    senha
  );
  
  // ⚠️ OPÇÃO 1: Usar PROCEDURE (exige nomeFantasia)
  // Para facilitar, vamos usar query direta primeiro
  
  var instrucaoSql = `
    SELECT
      usu.idUsuario AS id,
      usu.nome AS NOME,
      usu.email AS EMAIL,
      usu.senha AS SENHA,
      emp.nomeFantasia AS EMPRESA,
      emp.sitacaoLicensa AS STATUS_LICENCA,
      CASE
        WHEN emp.idEmpresa IS NOT NULL
             AND usu.Empresa_idEmpresa = emp.idEmpresa
             AND emp.sitacaoLicensa = 'Ativa'
        THEN TRUE
        ELSE FALSE
      END AS usuario_pertence_a_empresa_ativa
    FROM tblUsuario AS usu
    LEFT JOIN tblEmpresa AS emp
      ON usu.Empresa_idEmpresa = emp.idEmpresa
    WHERE usu.email = ?
      AND usu.senha = ?
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha, cnpj) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cnpj);
  
  // Inserir empresa se não existir
  var sqlEmpresa = `
    INSERT INTO tblEmpresa (cnpj, nomeFantasia, emailCoorportaiva, dtLicenca, sitacaoLicensa)
    VALUES (?, ?, ?, CURDATE(), 'Ativa')
    ON DUPLICATE KEY UPDATE 
      nomeFantasia = VALUES(nomeFantasia),
      emailCoorportaiva = VALUES(emailCoorportaiva);
  `;
  
  console.log("Executando cadastro de empresa");
  
  return database.executar(sqlEmpresa, [cnpj, nome, email])
    .then(function(resultado) {
      // Pegar ID da empresa (seja nova ou existente)
      const idEmpresa = resultado.insertId || resultado.affectedRows;
      
      // Inserir usuário
      var sqlUsuario = `
        INSERT INTO tblUsuario (nome, email, senha, dtCriacao, Empresa_idEmpresa) 
        VALUES (?, ?, ?, CURDATE(), LAST_INSERT_ID());
      `;
      
      console.log("Executando cadastro de usuário");
      return database.executar(sqlUsuario, [nome, email, senha]);
    });
}

module.exports = {
  autenticar,
  cadastrar,
};