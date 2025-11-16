var monitoramentoModel = require("../models/monitoramentoModel");

function buscarMetricas(req, res) {
  monitoramentoModel
    .buscarMetricas()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(204).send("Nenhuma métrica encontrada!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar métricas! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function atualizarMetricas(req, res) {
  const totalReq = req.body.totalRequisicoes;
  const reqOK = req.body.requisicoesOK;
  const reqErro = req.body.requisicoesErro;
  const tempoMedio = req.body.tempoMedioResposta;

  monitoramentoModel
    .atualizarMetricas(totalReq, reqOK, reqErro, tempoMedio)
    .then(function (resultado) {
      res.status(200).json({ mensagem: "Métricas atualizadas com sucesso!" });
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao atualizar métricas! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function registrarErro(req, res) {
  const tipo = req.body.tipo;
  const endpoint = req.body.endpoint;
  const mensagem = req.body.mensagem;
  const tempo = req.body.tempo;

  monitoramentoModel
    .registrarErro(tipo, endpoint, mensagem, tempo)
    .then(function (resultado) {
      res.status(201).json({ mensagem: "Erro registrado com sucesso!" });
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao registrar erro! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function buscarErrosRecentes(req, res) {
  const limite = req.query.limite || 10;

  monitoramentoModel
    .buscarErrosRecentes(limite)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum erro encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar erros! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function resetarMetricas(req, res) {
  monitoramentoModel
    .resetarMetricas()
    .then(function (resultado) {
      res.status(200).json({ mensagem: "Métricas resetadas com sucesso!" });
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao resetar métricas! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  buscarMetricas,
  atualizarMetricas,
  registrarErro,
  buscarErrosRecentes,
  resetarMetricas
};