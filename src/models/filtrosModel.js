var database = require("../database/config");

// Listar todos os filtros do usuário
function listarFiltros(idUser) {
  console.log("ACESSEI O FILTROS MODEL - function listarFiltros():", idUser);
  
  var instrucaoSql = `
    SELECT id, nome, ativo, CAST(config AS CHAR) as config, create_f, update_f 
    FROM filtrosUsuario 
    WHERE id_user = ${idUser} 
    ORDER BY ativo DESC, create_f DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar filtro ativo do usuário
function buscarFiltroAtivo(idUser) {
  console.log("ACESSEI O FILTROS MODEL - function buscarFiltroAtivo():", idUser);
  
  var instrucaoSql = `
    SELECT id, nome, ativo, CAST(config AS CHAR) as config 
    FROM filtrosUsuario 
    WHERE id_user = ${idUser} AND ativo = TRUE 
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Criar novo filtro
function criarFiltro(idUser, nome, config) {
  console.log("ACESSEI O FILTROS MODEL - function criarFiltro():", idUser, nome);
  
  // Converter config para JSON string
  const configJson = JSON.stringify(config);
  
  var instrucaoSql = `
    INSERT INTO filtrosUsuario (id_user, nome, config, ativo) 
    VALUES (${idUser}, '${nome}', '${configJson}', FALSE);
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Atualizar filtro
function atualizarFiltro(id, idUser, nome, config) {
  console.log("ACESSEI O FILTROS MODEL - function atualizarFiltro():", id, idUser, nome);
  
  const configJson = JSON.stringify(config);
  
  var instrucaoSql = `
    UPDATE filtrosUsuario 
    SET nome = '${nome}', config = '${configJson}' 
    WHERE id = ${id} AND id_user = ${idUser};
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Ativar filtro (desativa outros do mesmo usuário)
function ativarFiltro(id, idUser) {
  console.log("ACESSEI O FILTROS MODEL - function ativarFiltro():", id, idUser);
  
  // Primeiro desativa todos os filtros do usuário
  var instrucaoSql1 = `
    UPDATE filtrosUsuario 
    SET ativo = FALSE 
    WHERE id_user = ${idUser};
  `;
  
  // Depois ativa o filtro selecionado
  var instrucaoSql2 = `
    UPDATE filtrosUsuario 
    SET ativo = TRUE 
    WHERE id = ${id} AND id_user = ${idUser};
  `;
  
  console.log("Executando as instruções SQL: \n" + instrucaoSql1 + "\n" + instrucaoSql2);
  
  // Executar ambas as queries
  return database.executar(instrucaoSql1)
    .then(() => database.executar(instrucaoSql2));
}

// Deletar filtro
function deletarFiltro(id, idUser) {
  console.log("ACESSEI O FILTROS MODEL - function deletarFiltro():", id, idUser);
  
  var instrucaoSql = `
    DELETE FROM filtrosUsuario 
    WHERE id = ${id} AND id_user = ${idUser};
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