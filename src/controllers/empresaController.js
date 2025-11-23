const empresaModel = require("../models/empresaModel");

function autenticarEmpresa(req, res) {
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;

  console.log("📧 Tentativa de login:", email);

  if (!email) {
    res.status(400).json({ erro: "Email está undefined!" });
    return;
  } else if (!senha) {
    res.status(400).json({ erro: "Senha está undefined!" });
    return;
  }

  empresaModel
    .autenticarEmpresa(email, senha)
    .then(function (resultadoAutenticar) {
      console.log(`📊 Resultados encontrados: ${resultadoAutenticar.length}`);

      if (resultadoAutenticar.length === 0) {
        console.log("❌ Credenciais inválidas");
        res.status(403).json({ erro: "Email e/ou senha inválidos" });
        return;
      }

      const empresa = resultadoAutenticar[0];

      if (empresa.statusValido === 0) {
        console.log("🚫 Licença expirada ou situação inválida");
        res.status(403).json({
          erro: "Licença expirada ou empresa bloqueada! Entre em contato com o suporte.",
        });
        return;
      }

      console.log("✅ Autenticação bem-sucedida!");

      res.json({
        idEmpresa: empresa.idEmpresa,
        email: empresa.email,
        dtLicenca: empresa.dtLicenca,
        situacao: empresa.situacao,
        statusValido: empresa.statusValido,
      });
    })
    .catch(function (erro) {
      console.error("❌ ERRO COMPLETO:", erro);
      console.error("❌ Stack trace:", erro.stack);
    });
}

function cadastrarUsuario(req, res) {
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;
  var idEmpresa = req.body.idEmpresaServer;

  if (!nome || !email || !senha || !idEmpresa) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando!" });
  }

  empresaModel
    .cadastrarUsuario(nome, email, senha, idEmpresa)
    .then(function (resultado) {
      console.log("✅ Cadastro realizado com sucesso!");
      res.json(resultado);
    })
    .catch(function (erro) {
      console.error("ERRO NO CADASTRO:", erro);

      if (erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ erro: "Este email já está cadastrado." });
      }
      res.status(500).json({ erro: "Erro interno ao realizar cadastro." });
    });
}

function cadastrarEmpresa(req, res) {
  const cnpj = req.body.cnpjServer;
  const nome = req.body.nomeServer;
  const email = req.body.emailServer;

  if (!cnpj || !nome || !email) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  if (cnpj.length !== 14 || isNaN(cnpj)) {
    res.status(400).send("CNPJ inválido!");
    return;
  }

  empresaModel
    .cadastrarEmpresa(cnpj, nome, email)
    .then(function (resultado) {
      console.log("✅ Empresa cadastrada:", resultado.insertId);
      res.status(201).json(resultado);
    })
    .catch(function (erro) {
      console.error("❌ Erro ao cadastrar empresa:", erro);

      if (erro.code === "ER_DUP_ENTRY") {
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
  autenticarEmpresa,
  cadastrarEmpresa,
  cadastrarUsuario,
  listarEmpresas,
  verificarVagas,
  atualizarEmpresa,
};
