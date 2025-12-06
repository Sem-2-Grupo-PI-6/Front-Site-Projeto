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

function cadastrarUsuarioAdmin(nome, email, senha) {
  console.log("ACESSEI O ADMIN MODEL - function cadastrarUsuarioAdmin()");

  var instrucaoSql = `CALL setCadastrarAdmin(?, ?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [nome, email, senha]);
}

function buscarTotalUsuariosAtivos() {
  console.log("ACESSEI O ADMIN MODEL - function buscarTotalUsuariosAtivos()");

  var instrucaoSql = `
    SELECT 
      (SELECT COUNT(*) FROM tblUsuario) as totalUsuarios,
      (SELECT COUNT(*) FROM tblEmpresa WHERE situacaoLicensa = 'Ativa') as totalEmpresasAtivas,
      (SELECT COUNT(*) FROM tblEmpresa) as totalEmpresas
  `;

  return database.executar(instrucaoSql);
}

function buscarCrescimentoUsuarios() {
  console.log("ACESSEI O ADMIN MODEL - function buscarCrescimentoUsuarios()");

  var instrucaoSql = `
    SELECT 
      DATE_FORMAT(dtCriacao, '%Y-%m') as mes,
      DATE_FORMAT(dtCriacao, '%b') as mesAbrev,
      YEAR(dtCriacao) as ano,
      COUNT(*) as novosUsuarios
    FROM tblUsuario
    WHERE dtCriacao >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(dtCriacao, '%Y-%m'), DATE_FORMAT(dtCriacao, '%b'), YEAR(dtCriacao)
    ORDER BY mes ASC;
  `;

  return database.executar(instrucaoSql);
}

function buscarTotalAcumuladoUsuarios() {
  console.log(
    "ACESSEI O ADMIN MODEL - function buscarTotalAcumuladoUsuarios()"
  );

  var instrucaoSql = `
    SELECT 
      DATE_FORMAT(dtCriacao, '%Y-%m') as mes,
      COUNT(*) as total,
      (SELECT COUNT(*) FROM tblUsuario u2 WHERE u2.dtCriacao <= MAX(u1.dtCriacao)) as acumulado
    FROM tblUsuario u1
    WHERE dtCriacao >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(dtCriacao, '%Y-%m')
    ORDER BY mes ASC;
  `;

  return database.executar(instrucaoSql);
}

function buscarTop5Empresas() {
  console.log("ACESSEI O ADMIN MODEL - function buscarTop5Empresas()");

  var instrucaoSql = `
    SELECT 
      e.idEmpresa,
      e.nomeFantasia,
      e.situacaoLicensa,
      COUNT(u.idUsuario) as totalUsuarios,
      (SELECT COUNT(*) FROM tblLogSistemaAcesso l WHERE l.Usuario_Empresa_idEmpresa = e.idEmpresa) as totalAcessos
    FROM tblEmpresa e
    LEFT JOIN tblUsuario u ON e.idEmpresa = u.Empresa_idEmpresa
    WHERE e.situacaoLicensa = 'Ativa'
    GROUP BY e.idEmpresa, e.nomeFantasia, e.situacaoLicensa
    ORDER BY totalAcessos DESC, totalUsuarios DESC
    LIMIT 5;
  `;

  return database.executar(instrucaoSql);
}

function buscarAtividadesRecentes(limite = 10) {
  console.log("ACESSEI O ADMIN MODEL - function buscarAtividadesRecentes()");

  var instrucaoSql = `
    SELECT 
      l.idLogSistema,
      l.dtAcontecimento,
      l.tipoLog,
      l.descricaoLog,
      u.nome as nomeUsuario,
      e.nomeFantasia as nomeEmpresa,
      a.email as emailAdmin,
      TIMESTAMPDIFF(MINUTE, l.dtAcontecimento, NOW()) as minutosAtras
    FROM tblLogSistemaAcesso l
    LEFT JOIN tblUsuario u ON l.Usuario_idUsuario = u.idUsuario
    LEFT JOIN tblEmpresa e ON l.Usuario_Empresa_idEmpresa = e.idEmpresa
    LEFT JOIN tblAdmin a ON l.Admin_idAdmin = a.idAdmin
    ORDER BY l.dtAcontecimento DESC
    LIMIT ${limite};
  `;

  return database.executar(instrucaoSql);
}

function buscarComparativoUsuarios() {
  console.log("ACESSEI O ADMIN MODEL - function buscarComparativoUsuarios()");

  var instrucaoSql = `
    SELECT 
      (SELECT COUNT(*) FROM tblUsuario WHERE MONTH(dtCriacao) = MONTH(CURDATE()) AND YEAR(dtCriacao) = YEAR(CURDATE())) as usuariosMesAtual,
      (SELECT COUNT(*) FROM tblUsuario WHERE MONTH(dtCriacao) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(dtCriacao) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))) as usuariosMesAnterior;
  `;

  return database.executar(instrucaoSql);
}

function registrarLogAtividade(
  tipoLog,
  descricao,
  idUsuario,
  idEmpresa,
  idAdmin
) {
  console.log("ACESSEI O ADMIN MODEL - function registrarLogAtividade()");

  var instrucaoSql = `
    INSERT INTO tblLogSistemaAcesso (dtAcontecimento, tipoLog, descricaoLog, Usuario_idUsuario, Usuario_Empresa_idEmpresa, Admin_idAdmin)
    VALUES (NOW(), ?, ?, ?, ?, ?)
  `;

  return database.executar(instrucaoSql, [
    tipoLog,
    descricao,
    idUsuario || null,
    idEmpresa || null,
    idAdmin || null,
  ]);
}

function buscarMetricasDashboard() {
  console.log("ACESSEI O ADMIN MODEL - function buscarMetricasDashboard()");

  var instrucaoSql = `
    SELECT 
      (SELECT COUNT(*) FROM tblUsuario) as totalUsuarios,
      (SELECT COUNT(*) FROM tblEmpresa WHERE situacaoLicensa = 'Ativa') as empresasAtivas,
      (SELECT COUNT(*) FROM tblEmpresa) as totalEmpresas,
      (SELECT COUNT(*) FROM tblUsuario WHERE MONTH(dtCriacao) = MONTH(CURDATE()) AND YEAR(dtCriacao) = YEAR(CURDATE())) as novosUsuariosMes,
      (SELECT COUNT(*) FROM tblLogSistemaAcesso WHERE dtAcontecimento >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as acessos30Dias;
  `;

  return database.executar(instrucaoSql);
}

function editarUsuario(novaSenha, nome, idAdmin) {
  console.log("ACESSEI O ADMIN MODEL - function editarUsuario()");

  var instrucaoSql = `CALL updateSenhaAdmin(?, ?, ?)`;

  return database.executar(instrucaoSql, [novaSenha, nome, idAdmin]);
}

function excluirUsuario(idUsuario) {
  console.log("ACESSEI O ADMIN MODEL - function excluirUsuario()");

  var instrucaoSql = `
    DELETE FROM tblUsuario 
    WHERE idUsuario = ?
  `;

  return database.executar(instrucaoSql, [idUsuario]);
}

function buscarUsuarioPorId(idUsuario) {
  console.log("ACESSEI O ADMIN MODEL - function buscarUsuarioPorId()");

  var instrucaoSql = `
    SELECT 
      u.idUsuario,
      u.nome,
      u.email,
      u.telefone,
      u.senha,
      u.dtCriacao,
      u.Empresa_idEmpresa,
      e.nomeFantasia,
      e.cnpj
    FROM tblUsuario u
    LEFT JOIN tblEmpresa e ON u.Empresa_idEmpresa = e.idEmpresa
    WHERE u.idUsuario = ? 
  `;

  return database.executar(instrucaoSql, [idUsuario]);
}

function listarEmpresas() {
  console.log("ACESSEI O ADMIN MODEL - function listarEmpresas()");

  var instrucaoSql = `
    SELECT 
      idEmpresa,
      nomeFantasia,
      cnpj,
      situacaoLicensa
    FROM tblEmpresa
    WHERE situacaoLicensa = 'Ativa'
    ORDER BY nomeFantasia ASC
  `;

  return database.executar(instrucaoSql);
}

function listarUsuariosEmpresas() {
  console.log("ACESSEI O ADMIN MODEL - listarUsuariosEmpresas()");
  var instrucaoSql = `
    SELECT 
      u.idUsuario,
      u.nome AS nomeUsuario,
      u.email as emailUsuario,
      u.dtCriacao,
      e.nomeFantasia,
      e.idEmpresa,
      e.situacaoLicensa
    FROM tblUsuario u
    LEFT JOIN tblEmpresa e ON u.Empresa_idEmpresa = e.idEmpresa
    ORDER BY u.idUsuario DESC
  `;
  return database.executar(instrucaoSql);
}

function listarUsuariosEmpresasPaginado(limite, offset) {
  console.log("ACESSEI O ADMIN MODEL - listarUsuariosEmpresasPaginado()");

  var instrucaoSql = `
    SELECT 
      u.idUsuario,
      u.nome AS nomeUsuario,
      u.email as emailUsuario,
      u.dtCriacao,
      e.nomeFantasia,
      e.idEmpresa,
      e.situacaoLicensa
    FROM tblUsuario u
    LEFT JOIN tblEmpresa e ON u.Empresa_idEmpresa = e.idEmpresa
    ORDER BY u.idUsuario DESC
    LIMIT ${limite} OFFSET ${offset}
  `;

  return database.executar(instrucaoSql);
}

function contarTotalUsuarios() {
  console.log("ACESSEI O ADMIN MODEL - contarTotalUsuarios()");

  var instrucaoSql = `
    SELECT COUNT(*) as total FROM tblUsuario
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
  adminAutenticar,
  cadastrarEmpresa,
  cadastrarUsuarioAdmin,
  buscarTotalUsuariosAtivos,
  buscarCrescimentoUsuarios,
  buscarTotalAcumuladoUsuarios,
  buscarTop5Empresas,
  buscarAtividadesRecentes,
  buscarComparativoUsuarios,
  registrarLogAtividade,
  buscarMetricasDashboard,
  listarUsuariosEmpresas,
  listarUsuariosEmpresasPaginado,
  contarTotalUsuarios,
  editarUsuario,
  excluirUsuario,
  buscarUsuarioPorId,
  listarEmpresas,
};
