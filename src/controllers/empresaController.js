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

function atualizarSenha(req, res) {
  const idEmpresa = req.params.idEmpresa;
  const novaSenha = req.body.novaSenhaServer;

  console.log("🔐 Atualizando senha - Empresa ID:", idEmpresa);

  if (!novaSenha) {
    res.status(400).json({ erro: "Nova senha está undefined!" });
    return;
  }

  empresaModel
    .atualizarSenha(idEmpresa, novaSenha)
    .then(function (resultadoAtualizar) {
      console.log("📊 Resultado atualização:", resultadoAtualizar);

      if (resultadoAtualizar.affectedRows === 0) {
        console.log("❌ Nenhum registro atualizado");
        res.status(404).json({ erro: "Empresa não encontrada" });
        return;
      }

      console.log("✅ Senha atualizada com sucesso!");
      res.json({ mensagem: "Senha atualizada com sucesso" });
    })
    .catch(function (erro) {
      console.error("❌ ERRO COMPLETO:", erro);
      console.error("❌ Stack trace:", erro.stack);
      res.status(500).json({ erro: "Erro interno do servidor" });
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

function listarUsuariosPaginado(req, res){
  const idEmpresa = req.query.idEmpresa;
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || 5;

  console.log( "Listar usuarios - Empresa ", idEmpresa, "Pagina", pagina);

  if(!idEmpresa){
    return res.status(400).json({error: "Id empresa nã encontrado ou nao salvo no localStorege"});
  }

  Promise.all([
    empresaModel.listarUsuariosPaginado(idEmpresa, pagina, limite),
    empresaModel.contarUsuariosEmpresa(idEmpresa),
  ])
    .then(function ([usuarios, [{total}]]){
      const totalPaginas = Math.ceil(total / limite);

      res.json({
        usuarios: usuarios,
        paginacao: {
          paginaAtual: pagina,
          totalPaginas: totalPaginas,
          totalUsuarios: total,
          limite: limite,
          temAnterior: pagina > 1,
          temProxima: pagina < totalPaginas,
        },
      });
    })
      .catch(function (erro) {
        console.log("Deu erro ao listar o usuario, provavel ser null ou undefined", erro);
        res.status(500).json({erro: "Erro interno servidor"});
      });
}

function buscarUsuarioPorId(req, res){
  const idUsuario = req.params.idUsuario;
  const idEmpresa = req.query.idEmpresa;

  console.log("Id usuario: ", idUsuario, "empresa:", idEmpresa);

  if(!idEmpresa){
    return res.status(400).json({erro: "id da empresa não salvo no localStorege ou não fez login"})
  }

  empresaModel
    .buscarUsuarioPorId(idUsuario, idEmpresa)
    .then(function(resultado){
      if(resultado.length === 0){
        return res.status(404).json({error: "Usuario não encontrado, bd ta vazio"})
      }
      res.json(resultado[0]);
    })
    .catch(function(erro){
      console.error("Erro ao buscar usuario: ", erro);
      res.status(500).json({erro: "Erro servidor"})
    })
}

function atualizarUsuario(res, req) {
 const idUsuario = req.params.idUsuario;
 const idEmpresa = req.query.idEmpresa;

 const dados = {
  nome: req.body.nomeServer,
  telefone: req.body.telefoneServer,
  senha: req.body.senhaServer,
 };

 console.log("Usuario Atualizado ", idUsuario);

   if(!idEmpresa){
    return res.status(400).json({erro: "id da empresa não salvo no localStorege ou não fez login"})
  }

  empresaModel
    .atualizarUsuario(idUsuario, idEmpresa, dados)
    .then(function(resultado){
      if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Usuario não encontrado"})
      }
      res.json({mensagem: "Usuairo att"});
    })
    .catch(function(erro){
      console.error("Erro ao att usuario: ", erro);
      res.status(500).json({erro: "Erro servidor"})
    });
}

function excluirUsuario(req, res){
 const idUsuario = req.params.idUsuario;
 const idEmpresa = req.query.idEmpresa;

    if(!idEmpresa){
    return res.status(400).json({erro: "id da empresa não salvo no localStorege ou não fez login"})
  }

   empresaModel
    .excluirUsuario(idUsuario, idEmpresa)
    .then(function(resultado){
      if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Usuario não encontrado"})
      }
      res.json({mensagem: "Usuairo att"});
    })
    .catch(function(erro){
      console.error("Erro ao excluir usuario: ", erro);
      res.status(500).json({erro: "Erro servidor"})
    });
}


module.exports = {
  autenticarEmpresa,
  atualizarSenha,
  cadastrarUsuario,
  listarEmpresas,
  verificarVagas,
  atualizarEmpresa,
  listarUsuariosPaginado,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
};
