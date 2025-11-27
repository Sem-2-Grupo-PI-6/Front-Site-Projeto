var dadosModel = require("../models/dadosModel");

function buscarDadosDashboard(req, res) {
  const idsZonas = req.query. zonas ?  req.query.zonas.split(','). map(Number) : [1, 2, 3];
  
  Promise.all([
    dadosModel.buscarPibParaGrafico(idsZonas),
    dadosModel.buscarConstrucaoCivilParaGrafico(),
    dadosModel.buscarServicosParaGrafico(),
    dadosModel.buscarPibAtual(),
    dadosModel.buscarConstrucaoCivilAtual(),
    dadosModel.buscarServicosAtual(),
    dadosModel.buscarSelicAtual(),
    dadosModel. buscarInflacaoAtual(),
    dadosModel.buscarPopulacaoMultiplasZonas(idsZonas),
    dadosModel.buscarPibRegionalSP(),
    dadosModel.buscarPibRegionalSPAtual()
  ])
  .then(function ([
    pibGrafico, 
    construcaoGrafico, 
    servicosGrafico, 
    pibAtual, 
    construcaoAtual, 
    servicosAtual, 
    selicData, 
    inflacaoData, 
    populacaoData, 
    pibRegionalSP, 
    pibRegionalSPAtual
  ]) {
    const resultado = {

      pib: pibGrafico,
      pibConstrucao: construcaoGrafico,
      pibServicos: servicosGrafico,

      pibAtual: pibAtual[0] || null,
      construcaoAtual: construcaoAtual[0] || null,
      servicosAtual: servicosAtual[0] || null,

      selic: selicData[0] ?  {
        valorTaxa: selicData[0]. valorTaxa,
        dtApuracao: selicData[0].dtApuracao
      } : null,
      inflacao: inflacaoData[0] ? {
        valorTaxa: inflacaoData[0].valorTaxa,
        dtApuracao: inflacaoData[0].dtApuracao
      } : null,

      populacao: populacaoData,
      
      pibRegionalSP: pibRegionalSP,
      pibRegionalSPAtual: pibRegionalSPAtual[0] || null
    };
    
    console.log('Dados da dashboard carregados com sucesso');
    console.log('Selic:', resultado.selic);
    console.log('Inflação:', resultado. inflacao);
    res.status(200).json(resultado);
  })
  .catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao buscar dados da dashboard!  Erro: ", erro. sqlMessage);
    res.status(500). json(erro. sqlMessage);
  });
}

function buscarDemografia(req, res) {
  const idZona = req. params.idZona;

  if (idZona == undefined) {
    res.status(400). send("ID da zona está undefined!");
  } else {
    dadosModel
      .buscarDemografiaPorZona(idZona)
      . then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200). json({
            qtdpopulacao: resultado[0]. qtdpopulacao,
            homens: resultado[0].homens,
            mulheres: resultado[0].mulheres,
            razaoSexo: resultado[0].razaoSexo,
            idadeMedia: resultado[0].idadeMedia,
            densidadeDemografico: resultado[0]. densidadeDemo,
            municipio: resultado[0].municipio,
            ano: resultado[0].ano
          });
        } else {
          res. status(204).send("Nenhum dado demográfico");
        }
      })
      .catch(function (erro) {
        console. log(erro);
        console.log("erro ao buscar demografia Erro: ", erro.sqlMessage);
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
        res. status(204).send("Nenhuma zona encontrada");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("erro ao buscar zonas  Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function buscarAtratividade(req, res) {
  const idsZonas = req.query.zonas ? req.query.zonas.split(',').map(Number) : [1, 2, 3, 4, 5, 6];

  if (! idsZonas || idsZonas.length === 0) {
    res.status(400).send("IDs das zonas não fornecidos");
    return;
  }

  dadosModel
    .buscarScoreAtratividade(idsZonas)
    .then(function (resultado) {
      if (resultado. length > 0) {
        res. status(200).json(resultado);
      } else {
        res.status(204). send("Nenhum dado de atratividade encontrado");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("erro ao buscar atratividade Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  buscarDadosDashboard,
  buscarDemografia,
  buscarZonas,
  buscarAtratividade
};