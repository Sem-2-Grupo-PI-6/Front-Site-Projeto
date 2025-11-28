var monitoramentoModel = require("../models/monitoramentoModel");

function buscarMetricas(req, res) {
  monitoramentoModel
    .buscarMetricas()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res. status(200).json(resultado[0]);
      } else {
        res.status(200).json({
          totalRequisicoes: 0,
          requisicoesOK: 0,
          requisicoesErro: 0,
          tempoMedioResposta: 0,
          taxaSucesso: 100.00,
          taxaErro: 0.00,
          dtUltimaSync: null
        });
      }
    })
    .catch(function (erro) {
      console.error("Erro ao buscar metricas:", erro);
      res.status(500).json({ erro: erro.message });
    });
}

function registrarErro(req, res) {
  var tipoErro = req.body. tipoErro;
  var endpoint = req.body.endpoint;
  var mensagem = req. body.mensagem;
  var tempoResposta = req. body.tempoResposta;

  if (!tipoErro || !endpoint) {
    res.status(400).json({ erro: "Campos obrigatorios faltando" });
    return;
  }

  monitoramentoModel
    .registrarErro(tipoErro, endpoint, mensagem, tempoResposta)
    .then(function (resultado) {
      res. status(201).json({ sucesso: true });
    })
    .catch(function (erro) {
      console.error("Erro ao registrar erro:", erro);
      res. status(500).json({ erro: erro.message });
    });
}

function atualizarMetricas(req, res) {
  var novasRequisicoes = parseInt(req.body. novasRequisicoes) || 0;
  var requisicoesOK = parseInt(req.body.requisicoesOK) || 0;
  var requisicoesErro = parseInt(req.body.requisicoesErro) || 0;
  var tempoMedioResposta = parseInt(req.body.tempoMedioResposta) || 0;

  monitoramentoModel
    .atualizarMetricas(novasRequisicoes, requisicoesOK, requisicoesErro, tempoMedioResposta)
    . then(function (resultado) {
      res.status(200).json({ sucesso: true });
    })
    .catch(function (erro) {
      console.error("Erro ao atualizar metricas:", erro);
      res. status(500).json({ erro: erro.message });
    });
}

function resetarMetricas(req, res) {
  monitoramentoModel
    . resetarMetricas()
    .then(function (resultado) {
      res.status(200). json({ sucesso: true, mensagem: "Metricas resetadas" });
    })
    .catch(function (erro) {
      console.error("Erro ao resetar metricas:", erro);
      res.status(500).json({ erro: erro.message });
    });
}

module.exports = {
  buscarMetricas,
  registrarErro,
  atualizarMetricas,
  resetarMetricas
};