var database = require("../database/config");

function buscarMetricas() {
  console.log("ACESSEI O MONITORAMENTO MODEL - function buscarMetricas()");
  
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
    LIMIT 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarMetricas(totalReq, reqOK, reqErro, tempoMedio) {
  console.log("ACESSEI O MONITORAMENTO MODEL - function atualizarMetricas()");
  
  const taxaSucesso = totalReq > 0 ? ((reqOK / totalReq) * 100).toFixed(2) : 100;
  const taxaErro = totalReq > 0 ? ((reqErro / totalReq) * 100).toFixed(2) : 0;
  
  var instrucaoSql = `
    UPDATE tblMetricasSistema 
    SET 
      totalRequisicoes = ${totalReq},
      requisicoesOK = ${reqOK},
      requisicoesErro = ${reqErro},
      tempoMedioResposta = ${tempoMedio},
      taxaSucesso = ${taxaSucesso},
      taxaErro = ${taxaErro},
      dtUltimaSync = CURRENT_TIMESTAMP
    WHERE idMetrica = 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function registrarErro(tipo, endpoint, mensagem, tempo) {
  console.log("ACESSEI O MONITORAMENTO MODEL - function registrarErro()");
  
  var instrucaoSql = `
    INSERT INTO tblErrosSistema (tipoErro, endpoint, mensagem, tempoResposta)
    VALUES ('${tipo}', '${endpoint}', '${mensagem}', ${tempo});
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarErrosRecentes(limite = 10) {
  console.log("ACESSEI O MONITORAMENTO MODEL - function buscarErrosRecentes()");
  
  var instrucaoSql = `
    SELECT 
      tipoErro,
      endpoint,
      mensagem,
      tempoResposta,
      dtOcorrencia
    FROM tblErrosSistema
    ORDER BY dtOcorrencia DESC
    LIMIT ${limite};
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function resetarMetricas() {
  console.log("ACESSEI O MONITORAMENTO MODEL - function resetarMetricas()");
  
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
    WHERE idMetrica = 1;
  `;
  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarMetricas,
  atualizarMetricas,
  registrarErro,
  buscarErrosRecentes,
  resetarMetricas
};