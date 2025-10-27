var filtrosModel = require("../models/filtrosModel");

function listarFiltros(req, res) {
  const idUser = req.params.idUser;

  if (idUser == undefined) {
    res.status(400).send("ID do usuário está undefined!");
  } else {
    filtrosModel
      .listarFiltros(idUser)
      .then(function (resultado) {
        if (resultado.length > 0) {
          // Parse do JSON config para cada filtro
          const filtrosComConfig = resultado.map(filtro => ({
            ...filtro,
            config: JSON.parse(filtro.config)
          }));
          res.status(200).json(filtrosComConfig);
        } else {
          res.status(204).send("Nenhum filtro encontrado!");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao listar os filtros! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function buscarFiltroAtivo(req, res) {
  const idUser = req.params.idUser;

  if (idUser == undefined) {
    res.status(400).send("ID do usuário está undefined!");
  } else {
    filtrosModel
      .buscarFiltroAtivo(idUser)
      .then(function (resultado) {
        if (resultado.length > 0) {
          const filtroAtivo = {
            ...resultado[0],
            config: JSON.parse(resultado[0].config)
          };
          res.status(200).json(filtroAtivo);
        } else {
          res.status(204).send("Nenhum filtro ativo encontrado!");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar filtro ativo! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function criarFiltro(req, res) {
  const idUser = req.body.idUserServer;
  const nome = req.body.nomeServer;
  const config = req.body.configServer;

  if (idUser == undefined) {
    res.status(400).send("ID do usuário está undefined!");
  } else if (nome == undefined) {
    res.status(400).send("Nome do filtro está undefined!");
  } else if (config == undefined) {
    res.status(400).send("Configuração do filtro está undefined!");
  } else {
    filtrosModel
      .criarFiltro(idUser, nome, config)
      .then(function (resultado) {
        res.status(201).json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao criar o filtro! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function atualizarFiltro(req, res) {
  const id = req.params.id;
  const idUser = req.body.idUserServer;
  const nome = req.body.nomeServer;
  const config = req.body.configServer;

  if (id == undefined) {
    res.status(400).send("ID do filtro está undefined!");
  } else if (idUser == undefined) {
    res.status(400).send("ID do usuário está undefined!");
  } else if (nome == undefined) {
    res.status(400).send("Nome do filtro está undefined!");
  } else if (config == undefined) {
    res.status(400).send("Configuração do filtro está undefined!");
  } else {
    filtrosModel
      .atualizarFiltro(id, idUser, nome, config)
      .then(function (resultado) {
        res.status(200).json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao atualizar o filtro! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function ativarFiltro(req, res) {
  const id = req.params.id;
  const idUser = req.body.idUserServer;

  if (id == undefined) {
    res.status(400).send("ID do filtro está undefined!");
  } else if (idUser == undefined) {
    res.status(400).send("ID do usuário está undefined!");
  } else {
    filtrosModel
      .ativarFiltro(id, idUser)
      .then(function (resultado) {
        res.status(200).json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao ativar o filtro! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function deletarFiltro(req, res) {
  const id = req.params.id;
  const idUser = req.params.idUser;

  if (id == undefined) {
    res.status(400).send("ID do filtro está undefined!");
  } else if (idUser == undefined) {
    res.status(400).send("ID do usuário está undefined!");
  } else {
    filtrosModel
      .deletarFiltro(id, idUser)
      .then(function (resultado) {
        res.status(200).json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao deletar o filtro! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  listarFiltros,
  buscarFiltroAtivo,
  criarFiltro,
  atualizarFiltro,
  ativarFiltro,
  deletarFiltro
};