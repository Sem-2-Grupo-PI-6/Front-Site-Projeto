var database = require("../database/config");

// Buscar PIB Geral mais recente
function buscarPibAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibAtual()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, pibGeral, construcaoCivil
    FROM pib
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar últimos 8 trimestres de PIB para o gráfico
function buscarPibParaGrafico() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibParaGrafico()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, pibGeral, construcaoCivil
    FROM pib
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 8;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar últimos 12 trimestres de Construção Civil para o gráfico
function buscarConstrucaoCivilParaGrafico() {
  console.log("ACESSEI O DADOS MODEL - function buscarConstrucaoCivilParaGrafico()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, construcaoCivil
    FROM pib
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 12;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar Construção Civil mais recente
function buscarConstrucaoCivilAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarConstrucaoCivilAtual()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, construcaoCivil
    FROM pib
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 1;
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

// Buscar todas as populações por múltiplas zonas
function buscarPopulacaoMultiplasZonas(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarPopulacaoMultiplasZonas():", idsZonas);
  
  var instrucaoSql = `
    SELECT 
      p.id,
      p.municipio,
      p.qtdPopulacao,
      p.idadeMedia,
      p.densidadeDemografico,
      z.nome as zona_nome,
      z.id as zona_id
    FROM populacao p
    INNER JOIN zona z ON p.idZona = z.id
    WHERE z.id IN (${idsZonas.join(',')})
    ORDER BY p.ano DESC;
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

// Buscar score de atratividade
function buscarScoreAtratividade(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarScoreAtratividade():", idsZonas);
  
  var instrucaoSql = `
    SELECT 
      z.id,
      z.nome,
      AVG(pop.qtdPopulacao) as populacao_media,
      AVG(pop.densidadeDemografico) as densidade_media,
      AVG(pop.idadeMedia) as idade_media,
      (
        (AVG(pop.qtdPopulacao) / 10000) * 0.3 + 
        (AVG(pop.densidadeDemografico) / 100) * 0.4 + 
        ((50 - ABS(AVG(pop.idadeMedia) - 30)) / 50 * 100) * 0.3
      ) as score
    FROM zona z
    LEFT JOIN populacao pop ON z.id = pop.idZona
    WHERE z.id IN (${idsZonas.join(',')})
    GROUP BY z.id, z.nome
    ORDER BY score DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPibRegionalSP() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibRegionalSP()");
  
  var instrucaoSql = `
    SELECT ano, pibSP
    FROM pibRegionalSP
    ORDER BY ano ASC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// Buscar PIB Regional SP mais recente
function buscarPibRegionalSPAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibRegionalSPAtual()");
  
  var instrucaoSql = `
    SELECT ano, pibSP
    FROM pibRegionalSP
    ORDER BY ano DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarServicosParaGrafico() {
  console.log("ACESSEI O DADOS MODEL - function buscarServicosParaGrafico()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, servicos
    FROM pib
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 12;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarServicosAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarServicosAtual()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, servicos
    FROM pib
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPibAtual,
  buscarPibParaGrafico,
  buscarConstrucaoCivilParaGrafico,
  buscarConstrucaoCivilAtual,
  buscarSelicAtual,
  buscarInflacaoAtual,
  buscarDemografiaPorZona,
  buscarPopulacaoMultiplasZonas,
  buscarTodasZonas,
  buscarScoreAtratividade,
  buscarPibRegionalSP,          
  buscarPibRegionalSPAtual,
  buscarServicosParaGrafico,     
  buscarServicosAtual          
};