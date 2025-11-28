var database = require("../database/config");

function buscarMetricas() {
  var instrucaoSql = `
    SELECT
      totalRequisicoes,
      requisicoesOK,
      requisicoesErro,
      tempoMedioResposta,
      taxaSucesso,
      taxaErro,
      dtUltimaSync
    FROM tblMetricasSistema
    ORDER BY idMetrica DESC
    LIMIT 1
  `;
  return database.executar(instrucaoSql);
}

function registrarErro(tipoErro, endpoint, mensagem, tempoResposta) {
  var instrucaoSql = `
    INSERT INTO tblErrosSistema (tipoErro, endpoint, mensagem, tempoResposta)
    VALUES (?, ?, ?, ?)
  `;
  return database.executar(instrucaoSql, [tipoErro, endpoint, mensagem, tempoResposta]);
}

function atualizarMetricas(novasRequisicoes, requisicoesOK, requisicoesErro, tempoMedioNovo) {
  var instrucaoSql = `
    UPDATE tblMetricasSistema
    SET 
      totalRequisicoes = totalRequisicoes + ?,
      requisicoesOK = requisicoesOK + ?,
      requisicoesErro = requisicoesErro + ?,
      tempoMedioResposta = CASE 
        WHEN totalRequisicoes = 0 THEN ? 
        ELSE ROUND((tempoMedioResposta * totalRequisicoes + ?  * ?) / (totalRequisicoes + ?))
      END,
      taxaSucesso = CASE 
        WHEN (totalRequisicoes + ?) = 0 THEN 100.00
        ELSE ROUND(((requisicoesOK + ?) / (totalRequisicoes + ? )) * 100, 2)
      END,
      taxaErro = CASE 
        WHEN (totalRequisicoes + ?) = 0 THEN 0.00
        ELSE ROUND(((requisicoesErro + ?) / (totalRequisicoes + ?)) * 100, 2)
      END,
      dtUltimaSync = CURRENT_TIMESTAMP
    WHERE idMetrica = (SELECT id FROM (SELECT idMetrica as id FROM tblMetricasSistema ORDER BY idMetrica DESC LIMIT 1) as t)
  `;
  
  return database.executar(instrucaoSql, [
    novasRequisicoes,
    requisicoesOK,
    requisicoesErro,
    tempoMedioNovo,
    tempoMedioNovo,
    novasRequisicoes,
    novasRequisicoes,
    novasRequisicoes,
    requisicoesOK,
    novasRequisicoes,
    novasRequisicoes,
    requisicoesErro,
    novasRequisicoes
  ]);
}

function resetarMetricas() {
  var instrucaoSql = `
    UPDATE tblMetricasSistema
    SET 
      totalRequisicoes = 0,
      requisicoesOK = 0,
      requisicoesErro = 0,
      tempoMedioResposta = 0,
      taxaSucesso = 100.00,
      taxaErro = 0.00,
      dtResetMetricas = CURRENT_TIMESTAMP
    WHERE idMetrica = (SELECT id FROM (SELECT idMetrica as id FROM tblMetricasSistema ORDER BY idMetrica DESC LIMIT 1) as t)
  `;
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarMetricas,
  registrarErro,
  atualizarMetricas,
  resetarMetricas
};