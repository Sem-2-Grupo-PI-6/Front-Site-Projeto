var database = require("../database/config");

function listarFiltros(idUser) {
  console.log("ACESSEI O FILTROS MODEL - function listarFiltros():", idUser);
  
  var instrucaoSql = `
    SELECT idfiltroUsuario, nomeFiltro, ativo, CAST(config AS CHAR) as config, dtCreateFiltro, dtUpdateFiltro 
    FROM filtroUsuario 
    WHERE tblUsuario_idUsuario = ${idUser} 
    ORDER BY ativo DESC, dtCreateFiltro DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarFiltroAtivo(idUser) {
  console.log("ACESSEI O FILTROS MODEL - function buscarFiltroAtivo():", idUser);
  
  var instrucaoSql = `
    SELECT idfiltroUsuario, nomeFiltro, ativo, CAST(config AS CHAR) as config 
    FROM filtroUsuario 
    WHERE tblUsuario_idUsuario = ${idUser} AND ativo = TRUE 
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function criarFiltro(idUser, nome, config) {
  console.log("ACESSEI O FILTROS MODEL - function criarFiltro():", idUser, nome);
  
  const configJson = JSON.stringify(config);
  
  var instrucaoSql = `
    INSERT INTO filtroUsuario (tblUsuario_idUsuario, nomeFiltro, config, ativo) 
    VALUES (${idUser}, '${nome}', '${configJson}', FALSE);
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarFiltro(id, idUser, nome, config) {
  console.log("ACESSEI O FILTROS MODEL - function atualizarFiltro():", id, idUser, nome);
  
  const configJson = JSON.stringify(config);
  
  var instrucaoSql = `
    UPDATE filtroUsuario 
    SET nomeFiltro = '${nome}', config = '${configJson}' 
    WHERE idfiltroUsuario = ${id} AND tblUsuario_idUsuario = ${idUser};
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function ativarFiltro(id, idUser) {
  console.log("ACESSEI O FILTROS MODEL - function ativarFiltro():", id, idUser);

  var instrucaoSql1 = `
    UPDATE filtroUsuario 
    SET ativo = FALSE 
    WHERE tblUsuario_idUsuario = ${idUser};
  `;
  
  var instrucaoSql2 = `
    UPDATE filtroUsuario 
    SET ativo = TRUE 
    WHERE idfiltroUsuario = ${id} AND tblUsuario_idUsuario = ${idUser};
  `;
  
  console.log("Executando as instruções SQL: \n" + instrucaoSql1 + "\n" + instrucaoSql2);
  
  return database.executar(instrucaoSql1)
    .then(() => database.executar(instrucaoSql2));
}

function deletarFiltro(id, idUser) {
  console.log("ACESSEI O FILTROS MODEL - function deletarFiltro():", id, idUser);
  
  var instrucaoSql = `
    DELETE FROM filtroUsuario 
    WHERE idfiltroUsuario = ${id} AND tblUsuario_idUsuario = ${idUser};
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  listarFiltros,
  buscarFiltroAtivo,
  criarFiltro,
  atualizarFiltro,
  ativarFiltro,
  deletarFiltro
};