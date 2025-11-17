var database = require("../database/config");

function cadastrarEmpresa(cnpj, nome, email, plano, limite, licenca, status) {
  console.log("ACESSEI O EMPRESA MODEL - function cadastrarEmpresa()");
  
  var instrucaoSql = `
    INSERT INTO tblEmpresa (
      cnpj, 
      nomeFantasia, 
      emailCoorportaiva, 
      dtLicenca, 
      sitacaoLicensa,
      tipoPlano,
      limiteUsuarios,
      usuariosAtivos
    ) VALUES (
      '${cnpj}',
      '${nome}',
      '${email}',
      '${licenca}',
      '${status}',
      '${plano}',
      ${limite},
      0
    );
  `;
  
  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarEmpresas() {
  console.log("ACESSEI O EMPRESA MODEL - function listarEmpresas()");
  
  var instrucaoSql = `
    SELECT 
      e.*,
      COUNT(u.idUsuario) AS usuariosAtivos,
      (e.limiteUsuarios - COUNT(u.idUsuario)) AS vagasDisponiveis
    FROM tblEmpresa e
    LEFT JOIN tblUsuario u ON e.idEmpresa = u.Empresa_idEmpresa
    GROUP BY e.idEmpresa
    ORDER BY e.nomeFantasia;
  `;
  
  return database.executar(instrucaoSql);
}

function verificarVagas(idEmpresa) {
  console.log("ACESSEI O EMPRESA MODEL - function verificarVagas():", idEmpresa);
  
  var instrucaoSql = `
    SELECT * FROM vw_EmpresasComUsuarios
    WHERE idEmpresa = ${idEmpresa};
  `;
  
  return database.executar(instrucaoSql);
}

function atualizarEmpresa(id, dados) {
  console.log("ACESSEI O EMPRESA MODEL - function atualizarEmpresa():", id);
  
  const campos = [];
  if (dados.nomeServer) campos.push(`nomeFantasia = '${dados.nomeServer}'`);
  if (dados.emailServer) campos.push(`emailCoorportaiva = '${dados.emailServer}'`);
  if (dados.planoServer) campos.push(`tipoPlano = '${dados.planoServer}'`);
  if (dados.limiteServer) campos.push(`limiteUsuarios = ${dados.limiteServer}`);
  if (dados.statusServer) campos.push(`sitacaoLicensa = '${dados.statusServer}'`);
  if (dados.licencaServer) campos.push(`dtLicenca = '${dados.licencaServer}'`);
  
  var instrucaoSql = `
    UPDATE tblEmpresa 
    SET ${campos.join(', ')}
    WHERE idEmpresa = ${id};
  `;
  
  return database.executar(instrucaoSql);
}

module.exports = {
  cadastrarEmpresa,
  listarEmpresas,
  verificarVagas,
  atualizarEmpresa
};