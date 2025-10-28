var dadosModel = require("../models/dadosModel");

function buscarDadosDashboard(req, res) {
  const idsZonas = req.query.zonas ? req.query.zonas.split(',').map(Number) : [1, 2, 3];
  
  if (!idsZonas || idsZonas.length === 0) {
    res.status(400).send("IDs das zonas não fornecidos!");
    return;
  }

  Promise.all([
    dadosModel.buscarPibMultiplasZonas(idsZonas),
    dadosModel.buscarSelicAtual(),
    dadosModel.buscarInflacaoAtual(),
    dadosModel.buscarPibConstrucao()
  ])
  .then(function ([pibData, selicData, inflacaoData, pibConstrucaoData]) {
    const resultado = {
      pib: pibData,
      selic: selicData[0] || { taxaSelic: 11.75 },
      inflacao: inflacaoData[0] || { taxaInflacao: 5.8 },
      pibConstrucao: pibConstrucaoData
    };
    
    console.log('✅ Dados da dashboard carregados com sucesso');
    res.status(200).json(resultado);
  })
  .catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao buscar dados da dashboard! Erro: ", erro.sqlMessage);
    res.status(500).json(erro.sqlMessage);
  });
}

function buscarDemografia(req, res) {
  const idZona = req.params.idZona;

  if (idZona == undefined) {
    res.status(400).send("ID da zona está undefined!");
  } else {
    dadosModel
      .buscarDemografiaPorZona(idZona)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado[0]);
        } else {
          res.status(204).send("Nenhum dado demográfico encontrado!");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar demografia! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function buscarZonas(req, res) {
  dadosModel
    .buscarTodasZonas()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhuma zona encontrada!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar zonas! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function buscarAtratividade(req, res) {
  const idsZonas = req.query.zonas ? req.query.zonas.split(',').map(Number) : [1, 2, 3, 4, 5, 6];

  if (!idsZonas || idsZonas.length === 0) {
    res.status(400).send("IDs das zonas não fornecidos!");
    return;
  }

  dadosModel
    .buscarScoreAtratividade(idsZonas)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum dado de atratividade encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar atratividade! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  buscarDadosDashboard,
  buscarDemografia,
  buscarZonas,
  buscarAtratividade
};