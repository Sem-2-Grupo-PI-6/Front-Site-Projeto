const database = require("../database/config");

function autenticarEmpresa(email, senha) {
  console.log("ACESSEI O EMPRESA MODEL - function autenticarEmpresa():", email);

  const instrucaoSql = `CALL getAutenticarEmpresa(?, ?)`;

  console.log("Executando SQL:", instrucaoSql);
  return database.executar(instrucaoSql, [email, senha]);
}

function atualizarSenha(idEmpresa, novaSenha) {
  console.log(
    "ACESSEI O EMPRESA MODEL - function atualizarSenha():",
    idEmpresa
  );
  const instrucaoSql = `CALL updateSenhaEmpresa(?, ?)`;
  console.log("Executando SQL:", instrucaoSql);
  return database.executar(instrucaoSql, [novaSenha, idEmpresa]);
}

function cadastrarUsuario(nome, email, senha, idEmpresa) {
  console.log("ACESSEI O USUARIO MODEL - function cadastrar()");

  var instrucaoSql = `CALL SetCadastroUsuario(?, ?, ?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [nome, email, senha, idEmpresa]);
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
  console.log(
    "ACESSEI O EMPRESA MODEL - function verificarVagas():",
    idEmpresa
  );

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
  if (dados.emailServer)
    campos.push(`emailCoorportaiva = '${dados.emailServer}'`);
  if (dados.planoServer) campos.push(`tipoPlano = '${dados.planoServer}'`);
  if (dados.limiteServer) campos.push(`limiteUsuarios = ${dados.limiteServer}`);
  if (dados.statusServer)
    campos.push(`sitacaoLicensa = '${dados.statusServer}'`);
  if (dados.licencaServer) campos.push(`dtLicenca = '${dados.licencaServer}'`);

  var instrucaoSql = `
    UPDATE tblEmpresa 
    SET ${campos.join(", ")}
    WHERE idEmpresa = ${id};
  `;

  return database.executar(instrucaoSql);
}

function listarUsuariosEmpresas(idEmpresa, pagina, limite){
  console.log("ACESSEI O EMPRESA MODEL - function listarUsuariosEmpresas()");

  const offset = (pagina - 1) * limite;

  var instrucaoSql = `
    select 
      u.idUsuario,
      u.nome as nomeUsuario,
      u.email as emailUsuario,
      u.telefone as telefoneUsuario,
      u.dtCriacao,
      e.nomefantasia,
      from tblUsuario u
      inner join tblEmpresa e on u.Empresa_idEmpresa = e.idEmpresa
      where u.Empresa_idEmpresa = ?
      order by u.dtCriacao desc limit ? offset ?;
      `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarUsuarioPorId(idUsuario, idEmpresa){
  console.log("ACESSEI O EMPRESA MODEL - function buscarUsuarioPorId()");

  var instrucaoSql = `
    select
      u.idUsuario,
      u.nome,
      u.email,
      u.telefone,
      u.dtCriacao,
      u.Empresa_idEmpresa
    from tblUsuario u where u.idUsuario = ? and u.Empresa_idEmpresa = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function atualizarUsuario(idUsuario, idEmpresa, dados){
  console.log("ACESSEI O EMPRESA MODEL - function atualizarUsuario()");
  

const campos = [];

const valores = [];

if (dados.nome){
  campos.push("nome = ? ")
  valores.push(dados.nome)
}

if(dados.telefone){
  campos.push("telefone = ?")
  valores.push(dados.telefone)
}

if(dados.senha){
  campos.push("senha = ?")
  valores.push(dados.senha)
}

valores.push(idUsuario, idEmpresa);


var instrucaoSql = `
  update tblUsuario
  set ${campos.join(", ")}
  where idUsuario = ? and excluirUsuario = ?;
  `;


return database.executar(instrucaoSql, valores);

}

function excluirUsuario(idUsuario, idEmpresa){
  console.log("ACESSEI O EMPRESA MODEL - function excluirUsuario()");

  var instrucaoSql = `
    delete from tblUsuario
    where idUsuario = ? and excluirUsuario = ? ; 
    `; 

  return database.executar(instrucaoSql, [idUsuario, idEmpresa])
}


module.exports = {
  autenticarEmpresa,
  atualizarSenha,
  cadastrarUsuario,
  listarEmpresas,
  verificarVagas,
  atualizarEmpresa,
  listarUsuariosEmpresas,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
};
