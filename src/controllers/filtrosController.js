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
          const filtrosComConfig = resultado.map(filtro => {
            let configParsed;
            
            console.log('Config recebido do banco:', filtro.config);
            console.log(' Tipo:', typeof filtro.config);
            
            try {
              if (!filtro.config || filtro.config === '') {
                throw new Error('Config vazio');
              }
              
              configParsed = typeof filtro.config === 'string' 
                ? JSON.parse(filtro.config) 
                : filtro.config;

              if (!configParsed.kpis || !configParsed.graficos) {
                throw new Error('Estrutura inválida');
              }
              
            } catch (erro) {
              console.error(' Erro ao parsear config do filtro:', filtro.idfiltroUsuario, erro);

              configParsed = {
                kpis: {
                  economico: { enabled: true, value: "pib-sp" },
                  setor: { enabled: true, value: "construcao" },
                  financeiro: { enabled: true, value: "selic" },
                  demo: { enabled: true, value: "faixa-etaria" }
                },
                graficos: {
                  pib: { enabled: true, regioes: ["grande-sp", "interior", "litoral"] },
                  setor: { enabled: true, setores: ["construcao", "imobiliario", "servicos"] },
                  atratividade: { enabled: true, regioes: ["zona-sul", "zona-leste", "abc", "campinas", "santos", "ribeirao"] }
                }
              };
            }
            
            return {
              idfiltroUsuario: filtro.idfiltroUsuario,
              nomeFiltro: filtro.nomeFiltro,
              ativo: filtro.ativo,
              dtCreateFiltro: filtro.dtCreateFiltro,
              dtUpdateFiltro: filtro.dtUpdateFiltro,
              config: configParsed
            };
          });
          
          console.log('Filtros processados:', filtrosComConfig.length);
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
          let configParsed;
          
          console.log('Config ativo recebido:', resultado[0].config);
          
          try {
            if (!resultado[0].config || resultado[0].config === '') {
              throw new Error('Config vazio');
            }
            
            configParsed = typeof resultado[0].config === 'string' 
              ? JSON.parse(resultado[0].config) 
              : resultado[0].config;
              
            if (!configParsed.kpis || !configParsed.graficos) {
              throw new Error('Estrutura inválida');
            }
            
          } catch (erro) {
            console.error('Erro ao parsear config do filtro ativo:', erro);
            configParsed = null;
          }

          const filtroAtivo = {
            idfiltroUsuario: resultado[0].idfiltroUsuario,
            nomeFiltro: resultado[0].nomeFiltro,
            ativo: resultado[0].ativo,
            config: configParsed
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