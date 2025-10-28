var database = require("../database/config");

// Buscar dados de PIB por zona
function buscarPibPorZona(idZona) {
  console.log("ACESSEI O DADOS MODEL - function buscarPibPorZona():", idZona);
  
  var instrucaoSql = `
    SELECT p.valor, z.nome as zona_nome
    FROM pib p
    INNER JOIN zona z ON p.idZona = z.id
    WHERE p.idZona = ${idZona}
    ORDER BY p.id DESC
    LIMIT 8;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar PIB de múltiplas zonas
function buscarPibMultiplasZonas(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarPibMultiplasZonas():", idsZonas);
  
  var instrucaoSql = `
    SELECT p.valor, z.nome as zona_nome, z.id as zona_id
    FROM pib p
    INNER JOIN zona z ON p.idZona = z.id
    WHERE z.id IN (${idsZonas.join(',')})
    ORDER BY z.id, p.id DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar taxa Selic mais recente
function buscarSelicAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarSelicAtual()");
  
  var instrucaoSql = `
    SELECT taxaSelic, dataApuracao
    FROM selic
    ORDER BY dataApuracao DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar taxa de inflação mais recente
function buscarInflacaoAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarInflacaoAtual()");
  
  var instrucaoSql = `
    SELECT taxaInflacao, dataApuracao
    FROM inflacao
    ORDER BY dataApuracao DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar PIB da Construção Civil
function buscarPibConstrucao() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibConstrucao()");
  
  var instrucaoSql = `
    SELECT valorPib, dataApuracao
    FROM pibConstrucaoCivil
    ORDER BY dataApuracao DESC
    LIMIT 12;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar dados demográficos por zona
function buscarDemografiaPorZona(idZona) {
  console.log("ACESSEI O DADOS MODEL - function buscarDemografiaPorZona():", idZona);
  
  var instrucaoSql = `
    SELECT 
      qtdPopulacao,
      homens,
      mulheres,
      razaoSexo,
      idadeMedia,
      densidadeDemografico,
      municipio,
      ano
    FROM populacao
    WHERE idZona = ${idZona}
    ORDER BY ano DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar todas as zonas disponíveis
function buscarTodasZonas() {
  console.log("ACESSEI O DADOS MODEL - function buscarTodasZonas()");
  
  var instrucaoSql = `
    SELECT id, nome
    FROM zona
    ORDER BY nome;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar score de atratividade calculado
function buscarScoreAtratividade(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarScoreAtratividade():", idsZonas);
  
  var instrucaoSql = `
    SELECT 
      z.id,
      z.nome,
      AVG(p.valor) as pib_medio,
      AVG(pop.densidadeDemografico) as densidade_media,
      AVG(pop.idadeMedia) as idade_media,
      -- Cálculo simplificado de score (você pode ajustar a fórmula)
      (AVG(p.valor) * 0.4 + AVG(pop.densidadeDemografico) * 0.3 + (100 - AVG(pop.idadeMedia)) * 0.3) as score
    FROM zona z
    LEFT JOIN pib p ON z.id = p.idZona
    LEFT JOIN populacao pop ON z.id = pop.idZona
    WHERE z.id IN (${idsZonas.join(',')})
    GROUP BY z.id, z.nome
    ORDER BY score DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPibPorZona,
  buscarPibMultiplasZonas,
  buscarSelicAtual,
  buscarInflacaoAtual,
  buscarPibConstrucao,
  buscarDemografiaPorZona,
  buscarTodasZonas,
  buscarScoreAtratividade
};