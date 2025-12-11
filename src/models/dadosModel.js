var database = require("../database/config");

function buscarPibParaGrafico(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarPibParaGrafico()");
  
  var instrucaoSql = `
    SELECT 
      p.trimestre, 
      p.ano, 
      p.pibGeral as valor,
      z.nome as zona_nome,
      z.idZona as zona_id
    FROM tblPib p
    INNER JOIN tblZona z ON p.tblZona_idZona = z.idZona
    WHERE z.idZona IN (${idsZonas.join(',')})
    ORDER BY p.ano DESC, 
      CASE p.trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 36;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPibAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibAtual()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, pibGeral
    FROM tblPib
    WHERE tblZona_idZona = 1
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

function buscarConstrucaoCivilParaGrafico() {
  console.log("ACESSEI O DADOS MODEL - function buscarConstrucaoCivilParaGrafico()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, construcaoCivil as valorPib
    FROM tblPibSetor
    ORDER BY ano ASC, 
      CASE trimestre
        WHEN '1º' THEN 1
        WHEN '2º' THEN 2
        WHEN '3º' THEN 3
        WHEN '4º' THEN 4
      END ASC
    LIMIT 12;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarConstrucaoCivilAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarConstrucaoCivilAtual()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, construcaoCivil as valorPib
    FROM tblPibSetor
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

function buscarServicosParaGrafico() {
  console.log("ACESSEI O DADOS MODEL - function buscarServicosParaGrafico()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, servico as valorServico
    FROM tblPibSetor
    ORDER BY ano ASC, 
      CASE trimestre
        WHEN '1º' THEN 1
        WHEN '2º' THEN 2
        WHEN '3º' THEN 3
        WHEN '4º' THEN 4
      END ASC
    LIMIT 12;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarServicosAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarServicosAtual()");
  
  var instrucaoSql = `
    SELECT trimestre, ano, servico as valorServico
    FROM tblPibSetor
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

function buscarPibRegionalSP() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibRegionalSP()");
  
  var instrucaoSql = `
    SELECT ano, pibSP
    FROM tblPibRegionalSP
    ORDER BY ano ASC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPibRegionalSPAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarPibRegionalSPAtual()");
  
  var instrucaoSql = `
    SELECT ano, pibSP
    FROM tblPibRegionalSP
    ORDER BY ano DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarSelicAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarSelicAtual()");
  
  var instrucaoSql = `
    SELECT valorTaxa, dtApuracao
    FROM tblSelic
    ORDER BY idtblSelic DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarInflacaoAtual() {
  console.log("ACESSEI O DADOS MODEL - function buscarInflacaoAtual()");
  
  var instrucaoSql = `
    SELECT valorTaxa, dtApuracao
    FROM tblInflacao
    ORDER BY dtApuracao DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarDemografiaPorZona(idZona) {
  console.log("ACESSEI O DADOS MODEL - function buscarDemografiaPorZona():", idZona);
  
  var instrucaoSql = `
    SELECT 
      qtdpopulacao,
      homens,
      mulheres,
      razaoSexo,
      idadeMedia,
      densidadeDemo,
      municipio,
      ano
    FROM tblPopulacao
    WHERE tblZona_idZona = ${idZona}
    ORDER BY ano DESC
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPopulacaoMultiplasZonas(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarPopulacaoMultiplasZonas():", idsZonas);
  
  var instrucaoSql = `
    SELECT 
      p.idtblPopulacao,
      p.municipio,
      p.qtdPopulacao,
      p.idadeMedia,
      p.densidadeDemo,
      z.nome as zona_nome,
      z.idZona as tblZona_idZona
    FROM tblPopulacao p
    INNER JOIN tblZona z ON p.tblZona_idZona = z.idZona
    WHERE z.idZona IN (${idsZonas.join(',')})
    ORDER BY p.ano DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarTodasZonas() {
  console.log("ACESSEI O DADOS MODEL - function buscarTodasZonas()");
  
  var instrucaoSql = `
    SELECT idZona, nome
    FROM tblZona
    ORDER BY nome;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarScoreAtratividade(idsZonas) {
  console.log("ACESSEI O DADOS MODEL - function buscarScoreAtratividade():", idsZonas);
  
  var instrucaoSql = `
    SELECT 
      z.idZona,
      z.nome,
      AVG(pop.qtdpopulacao) as populacao_media,
      AVG(pop.densidadeDemo) as densidade_media,
      AVG(pop.idadeMedia) as idade_media,
      (
        (COALESCE(AVG(pop.qtdPopulacao), 0) / 10000) * 0.3 + 
        (COALESCE(AVG(pop.densidadeDemo), 0) / 100) * 0.4 + 
        ((50 - ABS(COALESCE(AVG(pop.idadeMedia), 30) - 30)) / 50 * 100) * 0.3
      ) as score
    FROM tblZona z
    LEFT JOIN tblPopulacao pop ON z.idZona = pop.tblZona_idZona
    WHERE z.idZona IN (${idsZonas.join(',')})
    GROUP BY z.idZona, z.nome
    ORDER BY score DESC;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPibAtual,
  buscarPibParaGrafico,
  buscarConstrucaoCivilParaGrafico,
  buscarConstrucaoCivilAtual,
  buscarServicosParaGrafico,
  buscarServicosAtual,
  buscarPibRegionalSP,
  buscarPibRegionalSPAtual,
  buscarSelicAtual,
  buscarInflacaoAtual,
  buscarDemografiaPorZona,
  buscarPopulacaoMultiplasZonas,
  buscarTodasZonas,
  buscarScoreAtratividade
};