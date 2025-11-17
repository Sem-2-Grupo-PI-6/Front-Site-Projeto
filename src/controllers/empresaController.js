var empresaModel = require("../models/empresaModel");

function cadastrarEmpresa(req, res) {
  const cnpj = req.body.cnpjServer;
  const nome = req.body.nomeServer;
  const email = req.body.emailServer;
  const plano = req.body.planoServer;
  const limite = req.body.limiteServer;
  const licenca = req.body.licencaServer;
  const status = req.body.statusServer;

  if (!cnpj || !nome || !email || !plano || !limite || !licenca) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  // Validar CNPJ (14 dígitos)
  if (cnpj.length !== 14 || isNaN(cnpj)) {
    res.status(400).send("CNPJ inválido!");
    return;
  }

  empresaModel
    .cadastrarEmpresa(cnpj, nome, email, plano, limite, licenca, status)
    .then(function (resultado) {
      console.log("✅ Empresa cadastrada:", resultado.insertId);
      res.status(201).json(resultado);
    })
    .catch(function (erro) {
      console.error("❌ Erro ao cadastrar empresa:", erro);
      
      if (erro.code === 'ER_DUP_ENTRY') {
        res.status(409).send("CNPJ já cadastrado!");
      } else {
        res.status(500).json(erro.sqlMessage || erro.message);
      }
    });
}

function listarEmpresas(req, res) {
  empresaModel
    .listarEmpresas()
    .then(function (resultado) {
      res.status(200).json(resultado);
    })
    .catch(function (erro) {
      console.error("Erro ao listar empresas:", erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function verificarVagas(req, res) {
  const idEmpresa = req.params.idEmpresa;

  empresaModel
    .verificarVagas(idEmpresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(404).send("Empresa não encontrada!");
      }
    })
    .catch(function (erro) {
      console.error("Erro ao verificar vagas:", erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function atualizarEmpresa(req, res) {
  const id = req.params.id;
  const dados = req.body;

  empresaModel
    .atualizarEmpresa(id, dados)
    .then(function (resultado) {
      res.status(200).json(resultado);
    })
    .catch(function (erro) {
      console.error("Erro ao atualizar empresa:", erro);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  cadastrarEmpresa,
  listarEmpresas,
  verificarVagas,
  atualizarEmpresa
};